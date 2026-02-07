import { NextResponse } from "next/server";
import { getLivePrices } from "@/lib/market";

export const dynamic = 'force-dynamic';

export async function GET() {
  const prices = getLivePrices();
  return NextResponse.json(prices);
}