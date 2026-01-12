import { DEFAULT_TICKERS } from "@/constants";
import type { StockData } from "@/types";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface MarketResponse {
  data: StockData[];
  lastUpdate: string;
  error?: string;
}

interface YahooQuoteResult {
  regularMarketPrice?: number;
  regularMarketPreviousClose?: number;
  currency?: string;
}

async function fetchStockData(
  yahooFinance: { quote: (ticker: string) => Promise<YahooQuoteResult> },
  ticker: string
): Promise<StockData> {
  try {
    const quote = await yahooFinance.quote(ticker.trim());

    if (!quote || typeof quote.regularMarketPrice !== "number") {
      throw new Error(`Invalid data for ticker ${ticker}`);
    }

    const currentPrice = quote.regularMarketPrice;
    const previousClose = quote.regularMarketPreviousClose ?? currentPrice;
    const change = currentPrice - previousClose;
    const changePercent =
      previousClose !== 0 ? (change / previousClose) * 100 : 0;

    return {
      ticker: ticker.trim(),
      currentPrice,
      previousClose,
      change,
      changePercent,
      currency: quote.currency ?? "USD",
    };
  } catch {
    return {
      ticker: ticker.trim(),
      currentPrice: 0,
      previousClose: 0,
      change: 0,
      changePercent: 0,
      currency: "USD",
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    const yahooFinanceModule = await import("yahoo-finance2");
    const yahooFinance = yahooFinanceModule.default;

    const { searchParams } = new URL(request.url);
    const tickersParam = searchParams.get("tickers");
    const tickers = tickersParam
      ? tickersParam.split(",")
      : [...DEFAULT_TICKERS];

    const stockDataPromises = tickers.map((ticker) =>
      fetchStockData(yahooFinance, ticker)
    );

    const stockData = await Promise.all(stockDataPromises);

    const response: MarketResponse = {
      data: stockData,
      lastUpdate: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    const errorResponse: MarketResponse = {
      data: [],
      lastUpdate: new Date().toISOString(),
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
