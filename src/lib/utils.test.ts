import { describe, expect, it } from "vitest";
import {
  cn,
  formatChange,
  formatChangePercent,
  formatPrice,
  getTickerDisplayName,
} from "./utils";

describe("formatPrice", () => {
  it("USD通貨の場合はドル記号で表示する", () => {
    expect(formatPrice(150.25, "USD")).toBe("$150.25");
  });

  it("JPY通貨の場合は円記号で表示する", () => {
    expect(formatPrice(150.5, "JPY")).toBe("¥150.50");
  });

  it("大きな数値はカンマ区切りで表示する", () => {
    expect(formatPrice(4500.0, "USD")).toBe("$4,500.00");
  });

  it("小数点以下2桁で表示する", () => {
    expect(formatPrice(100, "USD")).toBe("$100.00");
  });
});

describe("formatChange", () => {
  it("正の値には+記号を付ける", () => {
    expect(formatChange(5.25)).toBe("+5.25");
  });

  it("負の値には-記号が付く", () => {
    expect(formatChange(-3.5)).toBe("-3.50");
  });

  it("0には+記号を付ける", () => {
    expect(formatChange(0)).toBe("+0.00");
  });
});

describe("formatChangePercent", () => {
  it("正の値には+記号と%を付ける", () => {
    expect(formatChangePercent(3.62)).toBe("+3.62%");
  });

  it("負の値には-記号と%が付く", () => {
    expect(formatChangePercent(-1.1)).toBe("-1.10%");
  });

  it("0には+記号と%を付ける", () => {
    expect(formatChangePercent(0)).toBe("+0.00%");
  });
});

describe("getTickerDisplayName", () => {
  it("^GSPCを「S&P 500」に変換する", () => {
    expect(getTickerDisplayName("^GSPC")).toBe("S&P 500");
  });

  it("^N225を「日経平均」に変換する", () => {
    expect(getTickerDisplayName("^N225")).toBe("日経平均");
  });

  it("JPY=Xを「USD/JPY」に変換する", () => {
    expect(getTickerDisplayName("JPY=X")).toBe("USD/JPY");
  });

  it("未知のティッカーはそのまま返す", () => {
    expect(getTickerDisplayName("GRRR")).toBe("GRRR");
  });
});

describe("cn", () => {
  it("複数のクラスを結合する", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("条件付きクラスを処理する", () => {
    expect(cn("foo", true && "bar", false && "baz")).toBe("foo bar");
  });

  it("Tailwindの競合を解決する", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
