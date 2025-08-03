"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import dayjs from "dayjs";
import type { BorrowBookParams, BookParams, CreateBookResponse } from "@/types";

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;

  try {
    const book = await db
      .select({
        availableCopies: books.availableCopies,
        totalCopies: books.totalCopies,
        title: books.title
      })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book.length || book[0].availableCopies <= 0) {
      return {
        success: false,
        error: "Book is not available for borrowing",
      };
    }

    // Check if this is a single-copy book and if it's already borrowed
    if (book[0].totalCopies === 1) {
      const existingBorrow = await db
        .select({
          userId: borrowRecords.userId,
          userName: users.fullName
        })
        .from(borrowRecords)
        .innerJoin(users, eq(borrowRecords.userId, users.id))
        .where(and(
          eq(borrowRecords.bookId, bookId),
          eq(borrowRecords.status, "BORROWED")
        ))
        .limit(1);

      if (existingBorrow.length > 0) {
        return {
          success: false,
          error: `This book has already been borrowed by ${existingBorrow[0].userName}`,
        };
      }
    }

    const dueDate = dayjs().add(7, "day").toDate().toDateString();

    const record = await db.insert(borrowRecords).values({
      userId,
      bookId,
      dueDate,
      status: "BORROWED",
    });

    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies - 1 })
      .where(eq(books.id, bookId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(record)),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "An error occurred while borrowing the book",
    };
  }
};

export const returnBook = async (params: { userId: string; bookId: string }) => {
  const { userId, bookId } = params;

  try {
    // Check if the user has borrowed this book
    const borrowRecord = await db
      .select({
        id: borrowRecords.id,
        status: borrowRecords.status,
      })
      .from(borrowRecords)
      .where(and(
        eq(borrowRecords.userId, userId),
        eq(borrowRecords.bookId, bookId),
        eq(borrowRecords.status, "BORROWED")
      ))
      .limit(1);

    if (!borrowRecord.length) {
      return {
        success: false,
        error: "No active borrow record found for this book",
      };
    }

    // Get book info to update available copies
    const book = await db
      .select({
        availableCopies: books.availableCopies,
        title: books.title
      })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book.length) {
      return {
        success: false,
        error: "Book not found",
      };
    }

    // Update borrow record to returned
    await db
      .update(borrowRecords)
      .set({
        status: "RETURNED",
        returnDate: new Date().toDateString()
      })
      .where(eq(borrowRecords.id, borrowRecord[0].id));

    // Increase available copies
    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies + 1 })
      .where(eq(books.id, bookId));

    return {
      success: true,
      message: `Successfully returned "${book[0].title}"`,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "An error occurred while returning the book",
    };
  }
};

export const createBook = async (values: BookParams): Promise<CreateBookResponse> => {
  try {
    console.log("Creating book with values:", values);

    const result = await db.insert(books)
      .values({
        ...values,
        createdAt: new Date(),
        availableCopies: values.totalCopies,
      })
      .returning();

    console.log("Book created successfully:", result);
    return {
      success: true,
      data: result[0], 
      message: "Book created successfully",
    };
  } catch (error) {
    console.error("Error creating book:", error);
    return {
      success: false,
      data: undefined,
      message: "Failed to create book",
    };
  }
};
