import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Header } from "./Header";

describe("Header", () => {
  it("アプリ名「FluxFinance」を表示する", () => {
    render(<Header />);
    expect(
      screen.getByRole("heading", { name: "FluxFinance" })
    ).toBeInTheDocument();
  });

  it("lastUpdateがnullの場合「取得中...」を表示する", () => {
    render(<Header lastUpdate={null} />);
    expect(screen.getByText(/取得中.../)).toBeInTheDocument();
  });

  it("lastUpdateが指定された場合、フォーマットされた日時を表示する", () => {
    const testDate = new Date("2026-01-13T10:30:00");
    render(<Header lastUpdate={testDate} />);
    expect(screen.getByText(/2026\/01\/13/)).toBeInTheDocument();
  });

  it("time要素にdateTime属性が設定される", () => {
    const testDate = new Date("2026-01-13T10:30:00");
    render(<Header lastUpdate={testDate} />);
    const timeElement = screen.getByRole("time");
    expect(timeElement).toHaveAttribute("dateTime", testDate.toISOString());
  });
});
