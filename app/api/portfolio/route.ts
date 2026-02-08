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
    const portfolios = client.db().collection("portfolios");

    const portfolio = await portfolios.findOne({
      userId: session.user.id,
    });

    if (!portfolio) {
      return NextResponse.json({
        error: "Portfolio not found"
      }, {
        status: 404
      });
    }

    return NextResponse.json(portfolio);
  } catch (error) {
    return NextResponse.json({
      error: "Failed to fetch portfolio"
    }, {
      status: 500
    });
  }
}
