import { NextResponse } from "next/server";
import { getHistoricalData } from "@/lib/market";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol')?.toUpperCase() || 'BTC';

  const data = getHistoricalData(symbol);
  return NextResponse.json(data);
}