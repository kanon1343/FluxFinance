import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
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

  it("onRefreshが渡された場合、リフレッシュボタンを表示する", () => {
    const onRefresh = vi.fn();
    render(<Header onRefresh={onRefresh} />);
    expect(
      screen.getByRole("button", { name: "データを更新" })
    ).toBeInTheDocument();
  });

  it("onRefreshが渡されない場合、リフレッシュボタンを表示しない", () => {
    render(<Header />);
    expect(
      screen.queryByRole("button", { name: "データを更新" })
    ).not.toBeInTheDocument();
  });

  it("リフレッシュボタンをクリックするとonRefreshが呼ばれる", async () => {
    const user = userEvent.setup();
    const onRefresh = vi.fn();
    render(<Header onRefresh={onRefresh} />);

    await user.click(screen.getByRole("button", { name: "データを更新" }));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it("isRefreshingがtrueの場合、リフレッシュボタンが無効化される", () => {
    const onRefresh = vi.fn();
    render(<Header onRefresh={onRefresh} isRefreshing={true} />);

    const button = screen.getByRole("button", { name: "データを更新" });
    expect(button).toBeDisabled();
  });
});
