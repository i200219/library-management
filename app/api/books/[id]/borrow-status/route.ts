import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { borrowRecords } from "@/database/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const { id } = await params;

  // Check if the specific user has borrowed this book and hasn't returned it
  const userBorrowRecord = await db
    .select({
      id: borrowRecords.id,
      dueDate: borrowRecords.dueDate,
      borrowDate: borrowRecords.borrowDate,
      status: borrowRecords.status,
    })
    .from(borrowRecords)
    .where(and(
      eq(borrowRecords.bookId, id),
      eq(borrowRecords.userId, userId),
      eq(borrowRecords.status, "BORROWED")
    ))
    .limit(1);

  if (userBorrowRecord.length > 0) {
    return NextResponse.json({
      isBorrowedByUser: true,
      borrowRecord: userBorrowRecord[0],
    });
  }

  return NextResponse.json({
    isBorrowedByUser: false,
    borrowRecord: null
  });
}
