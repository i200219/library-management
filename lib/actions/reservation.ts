"use server";

import { db } from "@/database/drizzle";
import { reservations, books, users, borrowRecords } from "@/database/schema";
import { eq, and, desc, count } from "drizzle-orm";
import dayjs from "dayjs";
import type { ReservationParams, ReservationResponse } from "@/types";

export const createReservation = async (params: ReservationParams): Promise<ReservationResponse> => {
  const { userId, bookId } = params;

  try {
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
      return {
        success: false,
        message: "Book not found",
      };
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
      return {
        success: false,
        message: "You already have an active reservation for this book",
      };
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
      return {
        success: false,
        message: "You currently have this book borrowed",
      };
    }

    // If book is available, user should borrow directly instead of reserving
    if (book.availableCopies > 0) {
      return {
        success: false,
        message: "This book is currently available for borrowing. Please borrow it directly instead of making a reservation.",
      };
    }

    // Get current queue position (count of active reservations for this book)
    const [queueCount] = await db
      .select({ count: count() })
      .from(reservations)
      .where(
        and(
          eq(reservations.bookId, bookId),
          eq(reservations.status, "ACTIVE")
        )
      );

    const queuePosition = (queueCount?.count || 0) + 1;

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

    return {
      success: true,
      data: newReservation,
      message: `Reservation created successfully. You are #${queuePosition} in the queue.`,
      queuePosition,
    };
  } catch (error) {
    console.error("Error creating reservation:", error);
    return {
      success: false,
      message: "An error occurred while creating the reservation",
    };
  }
};

export const cancelReservation = async (reservationId: string, userId: string): Promise<ReservationResponse> => {
  try {
    // Get reservation details
    const [reservation] = await db
      .select()
      .from(reservations)
      .where(eq(reservations.id, reservationId))
      .limit(1);

    if (!reservation) {
      return {
        success: false,
        message: "Reservation not found",
      };
    }

    // Check if user owns this reservation
    if (reservation.userId !== userId) {
      return {
        success: false,
        message: "You can only cancel your own reservations",
      };
    }

    // Check if reservation is still active
    if (reservation.status !== "ACTIVE") {
      return {
        success: false,
        message: "This reservation is no longer active",
      };
    }

    // Update reservation status to cancelled
    await db
      .update(reservations)
      .set({
        status: "CANCELLED",
        updatedAt: new Date(),
      })
      .where(eq(reservations.id, reservationId));

    return {
      success: true,
      message: "Reservation cancelled successfully",
    };
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    return {
      success: false,
      message: "An error occurred while cancelling the reservation",
    };
  }
};

export const getUserReservations = async (userId: string) => {
  try {
    const userReservations = await db
      .select({
        id: reservations.id,
        bookId: reservations.bookId,
        reservationDate: reservations.reservationDate,
        expiryDate: reservations.expiryDate,
        status: reservations.status,
        priorityPosition: reservations.priorityPosition,
        bookTitle: books.title,
        bookAuthor: books.author,
        bookCoverUrl: books.coverUrl,
        bookCoverColor: books.coverColor,
      })
      .from(reservations)
      .innerJoin(books, eq(reservations.bookId, books.id))
      .where(eq(reservations.userId, userId))
      .orderBy(desc(reservations.createdAt));

    return {
      success: true,
      data: userReservations,
    };
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    return {
      success: false,
      data: [],
      message: "An error occurred while fetching reservations",
    };
  }
};

export const getBookReservationQueue = async (bookId: string) => {
  try {
    const queue = await db
      .select({
        id: reservations.id,
        userId: reservations.userId,
        userName: users.fullName,
        reservationDate: reservations.reservationDate,
        expiryDate: reservations.expiryDate,
        priorityPosition: reservations.priorityPosition,
      })
      .from(reservations)
      .innerJoin(users, eq(reservations.userId, users.id))
      .where(
        and(
          eq(reservations.bookId, bookId),
          eq(reservations.status, "ACTIVE")
        )
      )
      .orderBy(reservations.priorityPosition);

    return {
      success: true,
      data: queue,
    };
  } catch (error) {
    console.error("Error fetching reservation queue:", error);
    return {
      success: false,
      data: [],
      message: "An error occurred while fetching the reservation queue",
    };
  }
};

export const deleteBook = async (bookId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`/api/books/${bookId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete book');
    }

    const data = await response.json();
    return {
      success: data.success,
      message: data.message,
    };
  } catch (error) {
    console.error("Error deleting book:", error);
    return {
      success: false,
      message: "An error occurred while deleting the book",
    };
  }
};