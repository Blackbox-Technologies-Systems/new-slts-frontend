import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { findUserById, sanitizeUser } from "@/lib/mockDb";
import { COOKIE_KEYS } from "@/constants";

async function getAuthUser(request: NextRequest) {
  const token =
    request.cookies.get(COOKIE_KEYS.AUTH_TOKEN)?.value ||
    request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) return null;

  try {
    const payload = await verifyToken(token);
    const user = findUserById(payload.userId as string);
    return user ?? null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ success: true, data: sanitizeUser(user) });
}

export async function PATCH(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const updates = await request.json();
  const allowedFields = ["name", "avatar"];
  const filtered = Object.fromEntries(
    Object.entries(updates).filter(([k]) => allowedFields.includes(k))
  );

  Object.assign(user, filtered);
  return NextResponse.json({ success: true, data: sanitizeUser(user) });
}
