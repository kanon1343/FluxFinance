import type { ChartDataPoint, TimeRange } from "@/types";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface HistoryResponse {
  ticker: string;
  data: ChartDataPoint[];
  range: TimeRange;
  error?: string;
}

interface YahooHistoricalItem {
  date: Date;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

type YahooHistoricalInterval = "1d" | "1wk" | "1mo";

interface YahooHistoricalParams {
  period1: Date;
  interval: YahooHistoricalInterval;
}

const VALID_RANGES: readonly TimeRange[] = ["1D", "1W", "1M", "3M"];

const MILLISECONDS = {
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  THREE_MONTHS: 90 * 24 * 60 * 60 * 1000,
} as const;

function getYahooFinanceParams(range: TimeRange): YahooHistoricalParams {
  const now = Date.now();

  switch (range) {
    case "1D":
      return { period1: new Date(now - MILLISECONDS.DAY), interval: "1d" };
    case "1W":
      return { period1: new Date(now - MILLISECONDS.WEEK), interval: "1d" };
    case "1M":
      return { period1: new Date(now - MILLISECONDS.MONTH), interval: "1d" };
    case "3M":
      return {
        period1: new Date(now - MILLISECONDS.THREE_MONTHS),
        interval: "1wk",
      };
  }
}

function isValidTimeRange(range: string): range is TimeRange {
  return VALID_RANGES.includes(range as TimeRange);
}

function mapToChartDataPoint(item: YahooHistoricalItem): ChartDataPoint {
  return {
    timestamp: item.date.getTime(),
    open: item.open ?? 0,
    high: item.high ?? 0,
    low: item.low ?? 0,
    close: item.close ?? 0,
    volume: item.volume ?? 0,
  };
}

function getCacheMaxAge(range: TimeRange): number {
  return range === "1D" ? 300 : 3600;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker");
  const rangeParam = searchParams.get("range") ?? "1M";

  if (!ticker) {
    return NextResponse.json(
      { error: "Ticker parameter is required" },
      { status: 400 }
    );
  }

  if (!isValidTimeRange(rangeParam)) {
    return NextResponse.json(
      { error: "Invalid range. Must be one of: 1D, 1W, 1M, 3M" },
      { status: 400 }
    );
  }

  const range: TimeRange = rangeParam;

  try {
    const { period1, interval } = getYahooFinanceParams(range);
    const yahooFinanceModule = await import("yahoo-finance2");
    const YahooFinance = yahooFinanceModule.default;
    const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

    const result = (await yahooFinance.historical(ticker, {
      period1,
      period2: new Date(),
      interval,
    })) as YahooHistoricalItem[];

    if (!result || result.length === 0) {
      const emptyResponse: HistoryResponse = {
        ticker,
        data: [],
        range,
        error: "No historical data available for this ticker",
      };
      return NextResponse.json(emptyResponse);
    }

    const chartData = result.map(mapToChartDataPoint);
    chartData.sort((a, b) => a.timestamp - b.timestamp);

    const response: HistoryResponse = {
      ticker,
      data: chartData,
      range,
    };

    const cacheMaxAge = getCacheMaxAge(range);

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": `public, s-maxage=${cacheMaxAge}, stale-while-revalidate=${
          cacheMaxAge * 2
        }`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    const errorResponse: HistoryResponse = {
      ticker,
      data: [],
      range,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
