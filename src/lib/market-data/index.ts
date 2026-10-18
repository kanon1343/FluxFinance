import "server-only";

import type { ChartDataPoint, StockResult, TimeRange } from "@/types";
import { yahooFinance } from "./client";
import { getChartParams, toChartDataPoints, toStockResult } from "./transform";

export { isTimeRange } from "./transform";

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "不明なエラーが発生しました";
}

/**
 * 銘柄ごとに現在値を取得する。1銘柄の失敗が他の銘柄に影響しないよう個別に呼び出し、
 * 失敗した銘柄は `error` を持つ結果として返す。
 */
export async function fetchQuotes(
  tickers: readonly string[],
): Promise<StockResult[]> {
  return Promise.all(
    tickers.map(async (ticker): Promise<StockResult> => {
      try {
        const quote = await yahooFinance.quote(ticker);
        // Quote の一部（ECN など）はフィールドが型に現れないため、使う値だけを取り出す
        return toStockResult(ticker, {
          regularMarketPrice: quote.regularMarketPrice,
          regularMarketPreviousClose: quote.regularMarketPreviousClose,
          currency: quote.currency,
        });
      } catch (error) {
        return { ticker, error: toErrorMessage(error) };
      }
    }),
  );
}

/** 指定期間の価格履歴を時系列順で取得する。失敗時は例外を投げる */
export async function fetchHistory(
  ticker: string,
  range: TimeRange,
): Promise<ChartDataPoint[]> {
  const { period1, interval } = getChartParams(range);
  const result = await yahooFinance.chart(ticker, {
    period1,
    period2: new Date(),
    interval,
  });
  return toChartDataPoints(result.quotes);
}
