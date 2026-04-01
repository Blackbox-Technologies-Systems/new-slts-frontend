import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { findUserByEmail, createUser, sanitizeUser } from "@/lib/mockDb";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, confirmPassword } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Passwords do not match" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existing = findUserByEmail(email.toLowerCase());
    if (existing) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = createUser({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: "user",
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      isVerified: false,
    });

    const token = await signToken({ userId: newUser.id, role: newUser.role });
    const safeUser = sanitizeUser(newUser);

    return NextResponse.json(
      { success: true, message: "Account created successfully", user: safeUser, token },
      { status: 201 }
    );
  } catch (err) {
    console.error("[AUTH/REGISTER]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
