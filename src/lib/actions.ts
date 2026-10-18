"use server";

import { DEFAULT_TICKERS } from "@/constants";
import { fetchHistory, fetchQuotes } from "@/lib/market-data";
import type { ChartDataPoint, StockResult, TimeRange } from "@/types";

export async function getStockData(
  tickers: readonly string[] = DEFAULT_TICKERS,
): Promise<StockResult[]> {
  return fetchQuotes(tickers);
}

export async function getHistoricalData(
  ticker: string,
  range: TimeRange = "1M",
): Promise<ChartDataPoint[]> {
  return fetchHistory(ticker, range);
}
