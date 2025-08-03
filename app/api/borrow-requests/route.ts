import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { borrowRecords, users, books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";
import { auth } from "@/auth";

export async function GET() {
    // Join borrowRequests with users and books to get names and titles
    const result = await db
        .select({
            id: borrowRecords.id,
            userName: users.fullName ?? users.fullName,
            bookTitle: books.title,
            borrowDate: borrowRecords.borrowDate,
            dueDate: borrowRecords.dueDate,
            status: borrowRecords.status,
        })
        .from(borrowRecords)
        .innerJoin(users, eq(borrowRecords.userId, users.id))
        .innerJoin(books, eq(borrowRecords.bookId, books.id));
    return NextResponse.json(result);
}

export async function PATCH(request: Request) {
    try {
        const session = await auth();
        
        // Check if user is authenticated and has admin role
        if (!session?.user?.role || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, action } = await request.json();
        
        if (!id || !action) {
            return NextResponse.json({ error: "Missing id or action" }, { status: 400 });
        }

        // Map UI action to database status
        const status = action.toUpperCase() === 'APPROVE' ? 'BORROWED' : 'RETURNED';
        
        // Update the borrow request
        const updatedRecord = await db.update(borrowRecords)
            .set({
                status
            })
            .where(eq(borrowRecords.id, id))
            .returning();

        if (!updatedRecord[0]) {
            return NextResponse.json({ error: "Borrow request not found" }, { status: 404 });
        }

        // If approved (BORROWED), update book availability
        if (status === 'BORROWED') {
            const book = await db
                .select({ availableCopies: books.availableCopies })
                .from(books)
                .where(eq(books.id, updatedRecord[0].bookId))
                .limit(1);

            if (book[0]?.availableCopies > 0) {
                await db.update(books)
                    .set({ availableCopies: book[0].availableCopies - 1 })
                    .where(eq(books.id, updatedRecord[0].bookId));
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating borrow request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Implementation for equpdate
function equpdate(
    column: PgColumn<{ name: "id"; tableName: "borrow_records"; dataType: "string"; columnType: "PgUUID"; data: string; driverParam: string; notNull: true; hasDefault: true; isPrimaryKey: true; isAutoincrement: false; hasRuntimeDefault: false; enumValues: undefined; baseColumn: never; identity: undefined; generated: undefined; }, {}, {}>,
    value: any
) {
    return eq(column, value);
}
