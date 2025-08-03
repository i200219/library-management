import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { eq, or, sql } from "drizzle-orm";
import { z } from "zod";

const searchSchema = z.object({
  query: z.string().min(1),
  type: z.enum(['users', 'books', 'borrowings']),
  page: z.number().default(1),
  limit: z.number().default(10),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = searchSchema.parse({
      query: searchParams.get('query') || '',
      type: searchParams.get('type') || 'users',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
    });

    const searchPattern = `%${params.query.toLowerCase()}%`;

    let results: any[] = [];

    switch (params.type) {
      case 'users':
        results = await db
          .select({
            id: users.id,
            name: users.fullName,
            email: users.email,
            universityId: users.universityId,
            role: users.role,
            lastActivityDate: users.lastActivityDate,
          })
          .from(users)
          .where(
            or(
              sql`lower(${users.fullName}) like lower(${sql`${searchPattern}`})`,
              sql`lower(${users.email}) like lower(${sql`${searchPattern}`})`,
              sql`${users.universityId}::text like ${sql`${searchPattern}`}`
            )
          )
          .limit(params.limit)
          .offset((params.page - 1) * params.limit);
        break;

      case 'books':
        results = await db
          .select({
            id: books.id,
            title: books.title,
            author: books.author,
            genre: books.genre,
            rating: books.rating,
            availableCopies: books.availableCopies,
            totalCopies: books.totalCopies,
          })
          .from(books)
          .where(
            or(
              sql`lower(${books.title}) like lower(${sql`${searchPattern}`})`,
              sql`lower(${books.author}) like lower(${sql`${searchPattern}`})`,
              sql`lower(${books.genre}) like lower(${sql`${searchPattern}`})`
            )
          )
          .limit(params.limit)
          .offset((params.page - 1) * params.limit);
        break;

      case 'borrowings':
        results = await db
          .select({
            id: borrowRecords.id,
            userId: borrowRecords.userId,
            userName: users.fullName,
            bookId: borrowRecords.bookId,
            bookTitle: books.title,
            borrowDate: borrowRecords.borrowDate,
            dueDate: borrowRecords.dueDate,
            status: borrowRecords.status,
          })
          .from(borrowRecords)
          .innerJoin(users, eq(borrowRecords.userId, users.id))
          .innerJoin(books, eq(borrowRecords.bookId, books.id))
          .where(
            or(
              sql`lower(${users.fullName}) like lower(${sql`${searchPattern}`})`,
              sql`lower(${books.title}) like lower(${sql`${searchPattern}`})`,
              sql`lower(${borrowRecords.status}) like lower(${sql`${searchPattern}`})`
            )
          )
          .limit(params.limit)
          .offset((params.page - 1) * params.limit);
        break;
    }

    // Get total count for pagination
    const count = await db
      .select({ count: sql<number>`count(*)`.as('count') })
      .from(params.type === 'borrowings' ? borrowRecords : params.type === 'books' ? books : users)
      .then((result) => result[0].count);

    return NextResponse.json({
      results,
      total: count,
      page: params.page,
      totalPages: Math.ceil(count / params.limit),
    });
  } catch (error) {
    console.error("Error in search:", error);
    return NextResponse.json(
      { error: "Failed to search" },
      { status: 500 }
    );
  }
}