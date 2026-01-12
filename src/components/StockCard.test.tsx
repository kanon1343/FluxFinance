import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StockCard } from "./StockCard";
import type { StockData } from "@/types";

const mockPositiveStock: StockData = {
  ticker: "GRRR",
  currentPrice: 150.25,
  previousClose: 145.0,
  change: 5.25,
  changePercent: 3.62,
  currency: "USD",
};

const mockNegativeStock: StockData = {
  ticker: "^GSPC",
  currentPrice: 4500.0,
  previousClose: 4550.0,
  change: -50.0,
  changePercent: -1.1,
  currency: "USD",
};

const mockJPYStock: StockData = {
  ticker: "JPY=X",
  currentPrice: 150.5,
  previousClose: 149.0,
  change: 1.5,
  changePercent: 1.01,
  currency: "JPY",
};

describe("StockCard", () => {
  it("銘柄名とティッカーを表示する", () => {
    render(<StockCard stock={mockPositiveStock} />);
    expect(screen.getByRole("heading", { name: "GRRR" })).toBeInTheDocument();
    expect(screen.getByText("GRRR", { selector: "p" })).toBeInTheDocument();
  });

  it("^GSPCを「S&P 500」として表示する", () => {
    render(<StockCard stock={mockNegativeStock} />);
    expect(
      screen.getByRole("heading", { name: "S&P 500" })
    ).toBeInTheDocument();
  });

  it("JPY=Xを「USD/JPY」として表示する", () => {
    render(<StockCard stock={mockJPYStock} />);
    expect(
      screen.getByRole("heading", { name: "USD/JPY" })
    ).toBeInTheDocument();
  });

  it("現在価格を表示する", () => {
    render(<StockCard stock={mockPositiveStock} />);
    expect(screen.getByText("$150.25")).toBeInTheDocument();
  });

  it("JPY通貨の場合は円記号で表示する", () => {
    render(<StockCard stock={mockJPYStock} />);
    expect(screen.getByText("¥150.50")).toBeInTheDocument();
  });

  it("価格上昇時に緑色のクラスが適用される", () => {
    render(<StockCard stock={mockPositiveStock} />);
    const changeElements = screen.getAllByText(/\+3\.62%/);
    const changeText = changeElements.find((el) => el.tagName === "P");
    expect(changeText).toHaveClass("text-green-600");
  });

  it("価格下落時に赤色のクラスが適用される", () => {
    render(<StockCard stock={mockNegativeStock} />);
    const changeElements = screen.getAllByText(/-1\.10%/);
    const changeText = changeElements.find((el) => el.tagName === "P");
    expect(changeText).toHaveClass("text-red-600");
  });

  it("クリック時にonClickが呼ばれる", () => {
    const handleClick = vi.fn();
    render(<StockCard stock={mockPositiveStock} onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("aria-labelが設定されている", () => {
    render(<StockCard stock={mockPositiveStock} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label");
    expect(button.getAttribute("aria-label")).toContain("GRRR");
  });
});
