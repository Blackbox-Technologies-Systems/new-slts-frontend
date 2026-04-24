import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { findUserByEmail, sanitizeUser } from "@/lib/mockDb";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = findUserByEmail(email.toLowerCase());
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await signToken({ userId: user.id, role: user.roles });
    const safeUser = sanitizeUser(user);

    return NextResponse.json(
      { success: true, message: "Login successful", user: safeUser, token },
      { status: 200 }
    );
  } catch (err) {
    console.error("[AUTH/LOGIN]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
