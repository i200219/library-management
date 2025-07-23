import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const updateData: any = {};
  if (body.status) updateData.status = body.status;
  if (body.role) updateData.role = body.role;
  await db.update(users).set(updateData).where(eq(users.id, params.id));
  return NextResponse.json({ success: true });
}
