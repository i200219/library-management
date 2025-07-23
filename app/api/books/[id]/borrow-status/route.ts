import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const result = await db
    .select()
    .from(borrowRecords)
    .where(eq(borrowRecords.bookId, params.id));
  if (result.length > 0) {
    return NextResponse.json({
      isBorrowed: true,
      dueDate: result[0].dueDate,
    });
  }
  return NextResponse.json({ isBorrowed: false });
}
