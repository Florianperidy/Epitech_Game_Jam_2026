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

    const body = await request.json();
    const { symbol, amount, orderType } = body;
    const normalizedSymbol = typeof symbol === "string" ? symbol.toUpperCase() : "";
    const parsedAmount = Number(amount);

    if (!normalizedSymbol || !orderType || Number.isNaN(parsedAmount)) {
      return NextResponse.json({
        error: "Missing required fields"
      }, {
        status: 400
      });
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({
        error: "Amount must be greater than 0"
      }, {
        status: 400
      });
    }

    const priceTable: Record<string, number> = {
      BTC: 69420,
      ETH: 3512,
      SOL: 145,
      GLITCH: 1,
    };

    const price = priceTable[normalizedSymbol];
    if (!price) {
      return NextResponse.json({
        error: "Unknown asset"
      }, {
        status: 400
      });
    }

    const client = await clientPromise;
    const portfolios = client.db().collection("portfolios");
    const transactions = client.db().collection("transactions");

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

    const eurAsset = portfolio.assets.find((asset: any) => asset.symbol === "EUR");
    if (!eurAsset) {
      return NextResponse.json({
        error: "EUR balance missing"
      }, {
        status: 500
      });
    }

    let targetAsset = portfolio.assets.find((asset: any) => asset.symbol === normalizedSymbol);
    if (!targetAsset) {
      targetAsset = {
        symbol: normalizedSymbol,
        name: normalizedSymbol,
        amount: 0,
        isFiat: false,
      };
      portfolio.assets.push(targetAsset);
    }

    const bugRoll = Math.random();
    if (bugRoll < 0.3) {
      const bugTypes = [
        { error: `ERROR: Transaction ID Conflict (0x${Math.random().toString(16).substring(2, 8).toUpperCase()}). Please retry.`, status: "Failed" },
        { error: "WARNING: Funds deducted, but order not placed. Check balance.", status: "Pending" },
        { error: `CRITICAL: Order placed for ${parsedAmount * 10} ${normalizedSymbol}! (Amount Multiplier Bug)`, status: "Corrupted" },
      ];
      const bug = bugTypes[Math.floor(Math.random() * bugTypes.length)];

      await transactions.insertOne({
        userId: session.user.id,
        type: orderType,
        asset: normalizedSymbol,
        amount: parsedAmount,
        date: new Date(),
        status: bug.status,
        description: `${orderType.toUpperCase()} ${normalizedSymbol}`,
      });

      return NextResponse.json({
        error: bug.error,
        hasBug: true
      }, {
        status: 400
      });
    }

    const orderValue = parsedAmount * price;
    if (orderType === "buy") {
      if (eurAsset.amount < orderValue) {
        return NextResponse.json({
          error: "Insufficient EUR balance"
        }, {
          status: 400
        });
      }
      eurAsset.amount -= orderValue;
      targetAsset.amount += parsedAmount;
    } else if (orderType === "sell") {
      if (targetAsset.amount < parsedAmount) {
        return NextResponse.json({
          error: `Insufficient ${normalizedSymbol} balance`
        }, {
          status: 400
        });
      }
      targetAsset.amount -= parsedAmount;
      eurAsset.amount += orderValue;
    } else {
      return NextResponse.json({
        error: "Invalid order type"
      }, {
        status: 400
      });
    }

    const now = new Date();
    await portfolios.updateOne({
      userId: session.user.id,
    }, {
      $set: {
        assets: portfolio.assets,
        updatedAt: now,
      }
    });

    await transactions.insertOne({
      userId: session.user.id,
      type: orderType,
      asset: normalizedSymbol,
      amount: parsedAmount,
      date: now,
      status: "Completed",
      description: `${orderType.toUpperCase()} ${normalizedSymbol}`,
    });

    return NextResponse.json({
      success: true,
      message: `Order of ${parsedAmount} ${normalizedSymbol} to ${orderType} successful!`
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to process order"
    }, {
      status: 500
    });
  }
}
