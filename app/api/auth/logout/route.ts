import { NextResponse } from "next/server";
import { COOKIE_KEYS } from "@/constants";

export async function POST() {
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully" },
    { status: 200 }
  );
  // Clear auth cookies server-side
  response.cookies.delete(COOKIE_KEYS.AUTH_TOKEN);
  response.cookies.delete(COOKIE_KEYS.REFRESH_TOKEN);
  return response;
}
