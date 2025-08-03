import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { books, borrowRecords, reservations } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";

// GET - Fetch individual book details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = params.id;

    const [book] = await db
      .select()
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update book details (admin only)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookId = params.id;
    const updateData = await request.json();

    // Check if book exists
    const [existingBook] = await db
      .select()
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!existingBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Update the book
    const [updatedBook] = await db
      .update(books)
      .set({
        ...updateData,
        // Ensure availableCopies doesn't exceed totalCopies
        availableCopies: Math.min(
          updateData.availableCopies || existingBook.availableCopies,
          updateData.totalCopies || existingBook.totalCopies
        ),
      })
      .where(eq(books.id, bookId))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedBook,
      message: "Book updated successfully",
    });
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete book (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if book exists
    const [book] = await db
      .select({
        id: books.id,
        title: books.title,
        totalCopies: books.totalCopies,
        availableCopies: books.availableCopies,
      })
      .from(books)
      .where(eq(books.id, id))
      .limit(1);

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Check if there are active borrows
    const activeBorrows = await db
      .select({ count: count() })
      .from(borrowRecords)
      .where(
        and(
          eq(borrowRecords.bookId, id),
          eq(borrowRecords.status, "BORROWED")
        )
      );

    if (activeBorrows[0].count > 0) {
      return NextResponse.json(
        { error: "Cannot delete book while it has active borrows" },
        { status: 400 }
      );
    }

    // Delete all borrow records related to this book
    await db.delete(borrowRecords).where(eq(borrowRecords.bookId, id));

    // Delete all reservations
    await db.delete(reservations).where(eq(reservations.bookId, id));

    // Finally delete the book
    await db.delete(books).where(eq(books.id, id));

    return NextResponse.json({
      success: true,
      message: `Book "${book.title}" has been successfully deleted along with all related records.`,
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}