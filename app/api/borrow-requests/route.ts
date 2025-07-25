import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { borrowRecords, users, books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";

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
    const { id, status } = await request.json();
    if (!id || !status) {
        return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }
    await db.update(borrowRecords).set({ status }).where(equpdate(borrowRecords.id, id));
    return NextResponse.json({ success: true });
}

// Implementation for equpdate
function equpdate(
    column: PgColumn<{ name: "id"; tableName: "borrow_records"; dataType: "string"; columnType: "PgUUID"; data: string; driverParam: string; notNull: true; hasDefault: true; isPrimaryKey: true; isAutoincrement: false; hasRuntimeDefault: false; enumValues: undefined; baseColumn: never; identity: undefined; generated: undefined; }, {}, {}>,
    value: any
) {
    return eq(column, value);
}


