import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Get total books
    const totalBooks = await db
      .select({ count: sql<number>`count(*)`.as('count') })
      .from(books)
      .then((result) => result[0].count);

    // Get available books
    const availableBooks = await db
      .select({ count: sql<number>`count(*)`.as('count') })
      .from(books)
      .where(sql`available_copies > 0`)
      .then((result) => result[0].count);

    // Get total users
    const totalUsers = await db
      .select({ count: sql<number>`count(*)`.as('count') })
      .from(users)
      .then((result) => result[0].count);

    // Get active borrow requests
    const activeBorrows = await db
      .select({ count: sql<number>`count(*)`.as('count') })
      .from(borrowRecords)
      .where(sql`status = 'BORROWED'`)
      .then((result) => result[0].count);

    return NextResponse.json({
      totalBooks,
      availableBooks,
      totalUsers,
      activeBorrows,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
