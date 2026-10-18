import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { DEFAULT_TICKERS } from "@/constants";
import { fetchQuotes } from "@/lib/market-data";
import { isStockDataError } from "@/lib/utils";
import type { MarketResponse } from "@/types";

const MAX_TICKERS = 20;
const TICKER_PATTERN = /^[A-Z0-9^.=-]{1,15}$/i;

function parseTickers(param: string | null): string[] {
  if (!param) {
    return [...DEFAULT_TICKERS];
  }
  const tickers = param
    .split(",")
    .map((ticker) => ticker.trim())
    .filter((ticker) => TICKER_PATTERN.test(ticker));
  return [...new Set(tickers)].slice(0, MAX_TICKERS);
}

export async function GET(request: NextRequest) {
  const tickers = parseTickers(request.nextUrl.searchParams.get("tickers"));
  const data = await fetchQuotes(tickers);

  const response: MarketResponse = {
    data,
    lastUpdate: new Date().toISOString(),
  };

  // 失敗した銘柄を含む応答はキャッシュせず、次のリクエストで取り直す
  const cacheControl = data.some(isStockDataError)
    ? "no-store"
    : "public, s-maxage=30, stale-while-revalidate=60";

  return NextResponse.json(response, {
    headers: { "Cache-Control": cacheControl },
  });
}
