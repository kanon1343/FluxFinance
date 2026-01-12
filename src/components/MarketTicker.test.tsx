import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MarketTicker } from "./MarketTicker";
import type { TickerItem } from "@/types";

const mockItems: TickerItem[] = [
  {
    symbol: "^GSPC",
    displayName: "S&P 500",
    price: 4500.0,
    change: 25.0,
    changePercent: 0.56,
    currency: "USD",
  },
  {
    symbol: "JPY=X",
    displayName: "USD/JPY",
    price: 150.5,
    change: -0.5,
    changePercent: -0.33,
    currency: "JPY",
  },
];

describe("MarketTicker", () => {
  it("itemsが空の場合は何も表示しない", () => {
    const { container } = render(<MarketTicker items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("ティッカーアイテムを表示する", () => {
    render(<MarketTicker items={mockItems} />);
    expect(screen.getAllByText("S&P 500").length).toBeGreaterThan(0);
    expect(screen.getAllByText("USD/JPY").length).toBeGreaterThan(0);
  });

  it("価格を表示する", () => {
    render(<MarketTicker items={mockItems} />);
    expect(screen.getAllByText("$4,500.00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("¥150.50").length).toBeGreaterThan(0);
  });

  it("変動率を表示する", () => {
    render(<MarketTicker items={mockItems} />);
    expect(screen.getAllByText("+0.56%").length).toBeGreaterThan(0);
    expect(screen.getAllByText("-0.33%").length).toBeGreaterThan(0);
  });

  it("上昇時は緑色、下落時は赤色のクラスが適用される", () => {
    render(<MarketTicker items={mockItems} />);
    const positiveChanges = screen.getAllByText("+0.56%");
    const negativeChanges = screen.getAllByText("-0.33%");

    expect(positiveChanges[0]).toHaveClass("text-green-400");
    expect(negativeChanges[0]).toHaveClass("text-red-400");
  });

  it("aria-labelが設定されている", () => {
    render(<MarketTicker items={mockItems} />);
    const list = screen.getByRole("list");
    expect(list).toHaveAttribute("aria-label", "市場ティッカー");
  });

  it("リストアイテムとして表示される", () => {
    render(<MarketTicker items={mockItems} />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toBeGreaterThan(0);
  });
});
