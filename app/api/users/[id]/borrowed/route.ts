import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
// Make sure borrowed_books is exported from the schema file, or update the import if the name is different
import { books } from "@/database/schema";
import { borrowRecords } from "@/database/schema"; 
import { eq } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Assuming borrowed_books has: id, userId, bookId, borrowDate, dueDate
  const result = await db
    .select({
      id: borrowRecords.id,
      bookTitle: books.title,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .where(eq(borrowRecords.userId, params.id));
  return NextResponse.json(result);
}
