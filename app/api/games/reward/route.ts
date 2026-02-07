import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({
        error: "Unauthorized"
      }, {
        status: 401
      });
    }

    const { score, gameType } = await request.json();

    if (typeof score !== "number" || !gameType) {
      return NextResponse.json({
        error: "Invalid request"
      }, {
        status: 400
      });
    }

    const client = await clientPromise;
    const db = client.db();
    const portfolios = db.collection("portfolios");
    const transactions = db.collection("transactions");

    let reward = 0;
    let currency = "EUR";

    switch (gameType) {
      case "clicker":
        reward = Math.floor(5 + (score / 10));
        reward = Math.min(reward, 15);
        break;
      case "memory":
        reward = Math.floor(10 + (score / 5));
        reward = Math.min(reward, 25);
        break;
      case "catch":
        reward = Math.floor(1 + (score / 50));
        reward = Math.min(reward, 3);
        currency = "GLITCH";
        break;
      case "reaction":
        reward = Math.floor(8 + (score / 50));
        reward = Math.min(reward, 20);
        break;
      default:
        reward = 5;
    }

    const portfolio = await portfolios.findOne({ userId: session.user.id });

    if (!portfolio) {
      return NextResponse.json({
        error: "Portfolio not found"
      }, {
        status: 404
      });
    }

    const assetIndex = portfolio.assets.findIndex(
      (a: any) => a.symbol === currency
    );

    if (assetIndex >= 0) {
      await portfolios.updateOne(
        { userId: session.user.id },
        { $inc: { [`assets.${assetIndex}.amount`]: reward } }
      );
    } else {
      await portfolios.updateOne(
        { userId: session.user.id },
        {
          $push: {
            assets: {
              symbol: currency,
              name: currency === "EUR" ? "Euro" : "Glitch Token",
              amount: reward,
              isFiat: currency === "EUR",
              isGlitch: currency === "GLITCH",
            },
          },
        }
      );
    }

    await transactions.insertOne({
      userId: session.user.id,
      type: "game_reward",
      asset: currency,
      amount: reward,
      date: new Date(),
      status: "completed",
      description: `Game Reward: ${gameType} (Score: ${score})`,
    });

    return NextResponse.json({
      success: true,
      reward,
      currency,
      message: `You earned ${reward} ${currency}!`,
    });
  } catch (error) {
    console.error("Game reward error:", error);
    return NextResponse.json({
      error: "Failed to process reward"
    }, {
      status: 500
    });
  }
}
