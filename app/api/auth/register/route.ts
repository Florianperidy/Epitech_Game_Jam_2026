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

    const userDoc = {
      email,
      passwordHash,
      name: null,
      image: null,
      emailVerified: null,
      createdAt: now,
      updatedAt: now,
    };

    const userResult = await users.insertOne(userDoc);
    const userId = userResult.insertedId;

    const portfolios = client.db().collection("portfolios");
    await portfolios.insertOne({
      userId: userId.toString(),
      email,
      createdAt: now,
      updatedAt: now,
      assets: [
        {
          symbol: "EUR",
          name: "Euro",
          amount: 10000,
          isFiat: true,
        },
        {
          symbol: "BTC",
          name: "Bitcoin",
          amount: 0,
          isFiat: false,
        },
        {
          symbol: "ETH",
          name: "Ethereum",
          amount: 0,
          isFiat: false,
        },
        {
          symbol: "SOL",
          name: "Solana",
          amount: 0,
          isFiat: false,
        },
        {
          symbol: "GLITCH",
          name: "GlitchCoin",
          amount: 0,
          isFiat: false,
          isGlitch: true,
        },
      ],
    });

    const transactions = client.db().collection("transactions");
    await transactions.insertOne({
      userId: userId.toString(),
      type: "deposit",
      asset: "EUR",
      amount: 10000,
      date: now,
      status: "Completed",
      description: "Dépôt Initial",
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
