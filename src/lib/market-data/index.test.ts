import { beforeEach, describe, expect, it, vi } from "vitest";

const { quote, chart } = vi.hoisted(() => ({
  quote: vi.fn(),
  chart: vi.fn(),
}));

vi.mock("./client", () => ({ yahooFinance: { quote, chart } }));

import { fetchHistory, fetchQuotes } from "./index";

beforeEach(() => {
  quote.mockReset();
  chart.mockReset();
});

describe("fetchQuotes", () => {
  it("取得に失敗した銘柄だけを error 付きで返す", async () => {
    quote.mockImplementation(async (ticker: string) => {
      if (ticker === "BAD") {
        throw new Error("Quote not found");
      }
      return {
        symbol: ticker,
        regularMarketPrice: 110,
        regularMarketPreviousClose: 100,
        currency: "JPY",
      };
    });

    const results = await fetchQuotes(["GOOD", "BAD"]);

    expect(results).toEqual([
      {
        ticker: "GOOD",
        currentPrice: 110,
        previousClose: 100,
        change: 10,
        changePercent: 10,
        currency: "JPY",
      },
      { ticker: "BAD", error: "Quote not found" },
    ]);
  });
});

describe("fetchQuotes（例外が Error でない場合）", () => {
  it("汎用のエラーメッセージを返す", async () => {
    quote.mockRejectedValue("boom");
    expect(await fetchQuotes(["GRRR"])).toEqual([
      { ticker: "GRRR", error: "不明なエラーが発生しました" },
    ]);
  });
});

describe("fetchHistory", () => {
  it("chart の結果を ChartDataPoint に変換する", async () => {
    chart.mockResolvedValue({
      meta: {},
      quotes: [
        { date: new Date(1000), open: 1, high: 2, low: 0.5, close: 1.5, volume: 3 },
      ],
    });

    const data = await fetchHistory("GRRR", "3M");

    expect(chart).toHaveBeenCalledWith(
      "GRRR",
      expect.objectContaining({ interval: "1wk" }),
    );
    expect(data).toEqual([
      { timestamp: 1000, open: 1, high: 2, low: 0.5, close: 1.5, volume: 3 },
    ]);
  });

  it("足が無ければ空配列を返す", async () => {
    chart.mockResolvedValue({ meta: {}, quotes: [] });
    expect(await fetchHistory("GRRR", "1D")).toEqual([]);
  });

  it("取得に失敗したら例外を投げる", async () => {
    chart.mockRejectedValue(new Error("network"));
    await expect(fetchHistory("GRRR", "1M")).rejects.toThrow("network");
  });
});
