import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { eq, and } from "drizzle-orm";

export interface BookAvailabilityStatus {
  isAvailable: boolean;
  reason: string;
  details: {
    totalCopies: number;
    availableCopies: number;
    borrowedCopies: number;
    borrowedBy?: Array<{
      userName: string;
      dueDate: string;
      isOverdue: boolean;
    }>;
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookId } = await params;

    // Get book information
    const [book] = await db
      .select({
        totalCopies: books.totalCopies,
        availableCopies: books.availableCopies,
        title: books.title,
      })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      );
    }

    // Get current borrow records for this book
    const borrowedRecords = await db
      .select({
        userId: borrowRecords.userId,
        userName: users.fullName,
        dueDate: borrowRecords.dueDate,
        borrowDate: borrowRecords.borrowDate,
      })
      .from(borrowRecords)
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .where(
        and(
          eq(borrowRecords.bookId, bookId),
          eq(borrowRecords.status, "BORROWED")
        )
      );

    const currentDate = new Date();
    const borrowedBy = borrowedRecords.map((record) => {
      const dueDate = new Date(record.dueDate);
      return {
        userName: record.userName,
        dueDate: record.dueDate,
        isOverdue: currentDate > dueDate,
      };
    });

    const borrowedCopies = borrowedRecords.length;
    const isAvailable = book.availableCopies > 0;

    let reason = "";
    if (!isAvailable) {
      if (book.totalCopies === 1 && borrowedCopies > 0) {
        const borrower = borrowedBy[0];
        if (borrower.isOverdue) {
          reason = `This book is currently borrowed by ${borrower.userName} and is overdue (due: ${borrower.dueDate})`;
        } else {
          reason = `This book is currently borrowed by ${borrower.userName} (due: ${borrower.dueDate})`;
        }
      } else if (borrowedCopies >= book.totalCopies) {
        const overdueCount = borrowedBy.filter(b => b.isOverdue).length;
        if (overdueCount > 0) {
          reason = `All ${book.totalCopies} copies are borrowed. ${overdueCount} ${overdueCount === 1 ? 'copy is' : 'copies are'} overdue.`;
        } else {
          reason = `All ${book.totalCopies} copies are currently borrowed`;
        }
      } else {
        reason = "No copies are currently available";
      }
    } else {
      reason = `${book.availableCopies} ${book.availableCopies === 1 ? 'copy' : 'copies'} available for borrowing`;
    }

    const availabilityStatus: BookAvailabilityStatus = {
      isAvailable,
      reason,
      details: {
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        borrowedCopies,
        borrowedBy: borrowedBy.length > 0 ? borrowedBy : undefined,
      },
    };

    return NextResponse.json(availabilityStatus);
  } catch (error) {
    console.error("Error fetching book availability:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}