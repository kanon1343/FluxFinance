import { describe, expect, it } from "vitest";
import type { ChartResultArrayQuote } from "yahoo-finance2/modules/chart";
import {
  getChartParams,
  isTimeRange,
  type QuotePriceFields,
  toChartDataPoints,
  toStockResult,
} from "./transform";

function makeQuote(fields: QuotePriceFields): QuotePriceFields {
  return fields;
}

describe("toStockResult", () => {
  it("前日終値との差分と変動率を計算する", () => {
    const result = toStockResult(
      "GRRR",
      makeQuote({
        regularMarketPrice: 110,
        regularMarketPreviousClose: 100,
        currency: "USD",
      }),
    );
    expect(result).toEqual({
      ticker: "GRRR",
      currentPrice: 110,
      previousClose: 100,
      change: 10,
      changePercent: 10,
      currency: "USD",
    });
  });

  it("前日終値がなければ現在値を基準にし、変動 0 とする", () => {
    const result = toStockResult("GRRR", makeQuote({ regularMarketPrice: 50 }));
    expect(result).toMatchObject({
      previousClose: 50,
      change: 0,
      changePercent: 0,
      currency: "USD",
    });
  });

  it("価格がない場合は価格 0 ではなく error を返す", () => {
    expect(toStockResult("GRRR", makeQuote({}))).toEqual({
      ticker: "GRRR",
      error: "価格データがありません",
    });
    expect(toStockResult("GRRR", undefined)).toHaveProperty("error");
  });
});

describe("toChartDataPoints", () => {
  it("終値のない足（null・NaN）を除外し、時系列順に並べる", () => {
    const quotes: ChartResultArrayQuote[] = [
      {
        date: new Date(2000),
        open: 2,
        high: 3,
        low: 1,
        close: 2.5,
        volume: 10,
      },
      {
        date: new Date(3000),
        open: null,
        high: null,
        low: null,
        close: null,
        volume: null,
      },
      {
        date: new Date(4000),
        open: 1,
        high: 1,
        low: 1,
        close: Number.NaN,
        volume: 1,
      },
      {
        date: new Date(1000),
        open: null,
        high: null,
        low: null,
        close: 1.5,
        volume: null,
      },
    ];

    expect(toChartDataPoints(quotes)).toEqual([
      { timestamp: 1000, open: 1.5, high: 1.5, low: 1.5, close: 1.5, volume: 0 },
      { timestamp: 2000, open: 2, high: 3, low: 1, close: 2.5, volume: 10 },
    ]);
  });
});

describe("getChartParams", () => {
  const now = Date.UTC(2026, 0, 31);
  const day = 24 * 60 * 60 * 1000;

  it.each([
    ["1D", 1, "1d"],
    ["1W", 7, "1d"],
    ["1M", 30, "1d"],
    ["3M", 90, "1wk"],
  ] as const)("%s は %i 日前から %s 間隔", (range, days, interval) => {
    expect(getChartParams(range, now)).toEqual({
      period1: new Date(now - days * day),
      interval,
    });
  });
});

describe("isTimeRange", () => {
  it("定義済みの期間だけを受け付ける", () => {
    expect(isTimeRange("1M")).toBe(true);
    expect(isTimeRange("1Y")).toBe(false);
    expect(isTimeRange("constructor")).toBe(false);
  });
});
