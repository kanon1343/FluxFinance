import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchHistory, isTimeRange } from "@/lib/market-data";
import type { HistoryResponse, TimeRange } from "@/types";

function getCacheMaxAge(range: TimeRange): number {
  return range === "1D" ? 300 : 3600;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ticker = searchParams.get("ticker")?.trim();
  const range = searchParams.get("range") ?? "1M";

  if (!ticker || ticker.length > 15) {
    return NextResponse.json(
      { error: "Ticker parameter is missing or invalid" },
      { status: 400 },
    );
  }

  if (!isTimeRange(range)) {
    return NextResponse.json(
      { error: "Invalid range. Must be one of: 1D, 1W, 1M, 3M" },
      { status: 400 },
    );
  }

  try {
    const data = await fetchHistory(ticker, range);

    if (data.length === 0) {
      const emptyResponse: HistoryResponse = {
        ticker,
        data: [],
        range,
        error: "No historical data available for this ticker",
      };
      return NextResponse.json(emptyResponse);
    }

    const response: HistoryResponse = { ticker, data, range };
    const cacheMaxAge = getCacheMaxAge(range);

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": `public, s-maxage=${cacheMaxAge}, stale-while-revalidate=${
          cacheMaxAge * 2
        }`,
      },
    });
  } catch (error) {
    const errorResponse: HistoryResponse = {
      ticker,
      data: [],
      range,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
