import clientPromise from "@/lib/mongodb";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email !== "string" ? "" : body.email.toLowerCase();
    const password = typeof body?.password !== "string" ? "" : body.password;

    if (!email || !password) {
      return NextResponse.json({
        error: "Email and password are required."
      }, {
        status: 400
      });
    }

    if (password.length < 8) {
      return NextResponse.json({
        error: "Password must be at least 8 characters."
      }, {
        status: 400
      });
    }

    const client = await clientPromise;
    const users = client.db().collection("users");

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        error: "An account with this email already exists."
      }, {
        status: 409
      });
    }

    const passwordHash = await hash(password, 12);
    const now = new Date();

    await users.insertOne({
      email,
      passwordHash,
      name: null,
      image: null,
      emailVerified: null,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      ok: true
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to create account."
    }, {
      status: 500
    });
  }
}
