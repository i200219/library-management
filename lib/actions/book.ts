"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";
import type { BorrowBookParams, BookParams, CreateBookResponse } from "@/types";

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;

  try {
    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book.length || book[0].availableCopies <= 0) {
      return {
        success: false,
        error: "Book is not available for borrowing",
      };
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
