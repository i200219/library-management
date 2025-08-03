import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { reservations, users, books, borrowRecords } from "@/database/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import { auth } from "@/auth";
import dayjs from "dayjs";

// GET - Fetch user's reservations or all reservations (admin)
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const isAdmin = session.user.role === "ADMIN";

    let whereCondition;
    
    // If not admin, only show user's own reservations
    if (!isAdmin) {
      whereCondition = eq(reservations.userId, session.user.id);
    } else if (userId) {
      whereCondition = eq(reservations.userId, userId);
    }

    let query = db
      .select({
        id: reservations.id,
        userId: reservations.userId,
        bookId: reservations.bookId,
        reservationDate: reservations.reservationDate,
        expiryDate: reservations.expiryDate,
        status: reservations.status,
        priorityPosition: reservations.priorityPosition,
        createdAt: reservations.createdAt,
        updatedAt: reservations.updatedAt,
        userName: users.fullName,
        bookTitle: books.title,
        bookAuthor: books.author,
      })
      .from(reservations)
      .innerJoin(users, eq(reservations.userId, users.id))
      .innerJoin(books, eq(reservations.bookId, books.id));

    if (whereCondition) {
      query = query.where(whereCondition);
    }

    const result = await query.orderBy(desc(reservations.createdAt));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new reservation
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId } = await request.json();
    const userId = session.user.id;

    if (!bookId) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    // Check if book exists
    const [book] = await db
      .select({
        id: books.id,
        title: books.title,
        totalCopies: books.totalCopies,
        availableCopies: books.availableCopies,
      })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Check if user already has an active reservation for this book
    const existingReservation = await db
      .select()
      .from(reservations)
      .where(
        and(
          eq(reservations.userId, userId),
          eq(reservations.bookId, bookId),
          eq(reservations.status, "ACTIVE")
        )
      )
      .limit(1);

    if (existingReservation.length > 0) {
      return NextResponse.json(
        { error: "You already have an active reservation for this book" },
        { status: 400 }
      );
    }

    // Check if user currently has this book borrowed
    const currentBorrow = await db
      .select()
      .from(borrowRecords)
      .where(
        and(
          eq(borrowRecords.userId, userId),
          eq(borrowRecords.bookId, bookId),
          eq(borrowRecords.status, "BORROWED")
        )
      )
      .limit(1);

    if (currentBorrow.length > 0) {
      return NextResponse.json(
        { error: "You currently have this book borrowed" },
        { status: 400 }
      );
    }

    // If book is available, user can borrow directly instead of reserving
    if (book.availableCopies > 0) {
      return NextResponse.json(
        { 
          error: "This book is currently available for borrowing. Please borrow it directly instead of making a reservation.",
          available: true 
        },
        { status: 400 }
      );
    }

    // Get current queue position (count of active reservations for this book)
    const queueCount = await db
      .select({ count: reservations.id })
      .from(reservations)
      .where(
        and(
          eq(reservations.bookId, bookId),
          eq(reservations.status, "ACTIVE")
        )
      );

    const queuePosition = queueCount.length + 1;

    // Create reservation with 7-day expiry from now
    const expiryDate = dayjs().add(7, "day").toDate();

    const [newReservation] = await db
      .insert(reservations)
      .values({
        userId,
        bookId,
        expiryDate,
        priorityPosition: queuePosition,
        status: "ACTIVE",
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newReservation,
      message: `Reservation created successfully. You are #${queuePosition} in the queue.`,
      queuePosition,
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update reservation status (cancel, fulfill, etc.)
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reservationId, action } = await request.json();

    if (!reservationId || !action) {
      return NextResponse.json(
        { error: "Reservation ID and action are required" },
        { status: 400 }
      );
    }

    // Get reservation details
    const [reservation] = await db
      .select()
      .from(reservations)
      .where(eq(reservations.id, reservationId))
      .limit(1);

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    // Check permissions - users can only cancel their own reservations
    const isAdmin = session.user.role === "ADMIN";
    if (!isAdmin && reservation.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    let newStatus: "ACTIVE" | "FULFILLED" | "CANCELLED" | "EXPIRED";
    let message: string;

    switch (action.toLowerCase()) {
      case "cancel":
        newStatus = "CANCELLED";
        message = "Reservation cancelled successfully";
        break;
      case "fulfill":
        if (!isAdmin) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        newStatus = "FULFILLED";
        message = "Reservation fulfilled successfully";
        break;
      case "expire":
        if (!isAdmin) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        newStatus = "EXPIRED";
        message = "Reservation expired";
        break;
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    // Update reservation
    await db
      .update(reservations)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(reservations.id, reservationId));

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Error updating reservation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}