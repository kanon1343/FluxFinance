import type { ChartOptions, ChartResultArrayQuote } from "yahoo-finance2/modules/chart";
import type { QuoteBase } from "yahoo-finance2/modules/quote";
import type { ChartDataPoint, StockResult, TimeRange } from "@/types";

const DAY_MS = 24 * 60 * 60 * 1000;

type ChartInterval = NonNullable<ChartOptions["interval"]>;

interface ChartParams {
  period1: Date;
  interval: ChartInterval;
}

const RANGE_PARAMS: Record<TimeRange, { days: number; interval: ChartInterval }> =
  {
    "1D": { days: 1, interval: "1d" },
    "1W": { days: 7, interval: "1d" },
    "1M": { days: 30, interval: "1d" },
    "3M": { days: 90, interval: "1wk" },
  };

const TIME_RANGES = new Set<string>(Object.keys(RANGE_PARAMS));

export function isTimeRange(value: string): value is TimeRange {
  return TIME_RANGES.has(value);
}

export function getChartParams(range: TimeRange, now = Date.now()): ChartParams {
  const { days, interval } = RANGE_PARAMS[range];
  return { period1: new Date(now - days * DAY_MS), interval };
}

/** 現在値の計算に使う Quote のフィールド */
export type QuotePriceFields = Pick<
  QuoteBase,
  "regularMarketPrice" | "regularMarketPreviousClose" | "currency"
>;

export function toStockResult(
  ticker: string,
  quote: QuotePriceFields | undefined,
): StockResult {
  const currentPrice = quote?.regularMarketPrice;
  if (typeof currentPrice !== "number" || !Number.isFinite(currentPrice)) {
    return { ticker, error: "価格データがありません" };
  }

  const previousClose = quote?.regularMarketPreviousClose ?? currentPrice;
  const change = currentPrice - previousClose;
  const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

  return {
    ticker,
    currentPrice,
    previousClose,
    change,
    changePercent,
    currency: quote?.currency ?? "USD",
  };
}

type ClosedQuote = ChartResultArrayQuote & { close: number };

function hasClose(item: ChartResultArrayQuote): item is ClosedQuote {
  return typeof item.close === "number" && Number.isFinite(item.close);
}

/** 終値が欠けている足（休場中など）は除外し、時系列順に並べる */
export function toChartDataPoints(
  quotes: readonly ChartResultArrayQuote[],
): ChartDataPoint[] {
  return quotes
    .filter(hasClose)
    .map((item) => ({
      timestamp: item.date.getTime(),
      open: item.open ?? item.close,
      high: item.high ?? item.close,
      low: item.low ?? item.close,
      close: item.close,
      volume: item.volume ?? 0,
    }))
    .sort((a, b) => a.timestamp - b.timestamp);
}
