import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const result = await db.select().from(users);
  // Map fields if necessary
  const mapped = result.map((user) => ({
    id: user.id,
    name: user.fullName ?? "Unknown",
    email: user.email,
    role: user.role ?? "User",
    status: user.status,
  }));
  return NextResponse.json(mapped);
}

// Add PATCH handler to update role/status in drizzle
export async function PATCH(request: Request) {
  const { id, role, status } = await request.json();
  const updateData: any = {};
  if (role){updateData.role = role};
  if (status){ updateData.status = status};
  if (!id) {return NextResponse.json({ error: "Missing user id" }, { status: 400 })};
  await db.update(users).set(updateData).where(eq(users.id, id));
  return NextResponse.json({ success: true });
}
