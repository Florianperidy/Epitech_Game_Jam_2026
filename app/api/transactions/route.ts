import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({
        error: "Unauthorized"
      }, {
        status: 401
      });
    }

    const client = await clientPromise;
    const transactions = client.db().collection("transactions");

    const userTransactions = await transactions.find({ userId: session.user.id }).sort({ date: -1 }).limit(50).toArray();

    return NextResponse.json(userTransactions);
  } catch (error) {
    return NextResponse.json({
      error: "Failed to fetch transactions"
    }, {
      status: 500
    });
  }
}
