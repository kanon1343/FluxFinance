import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(value);
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function formatPrice(price: number, currency: string): string {
  if (currency === "JPY") {
    return `¥${price.toLocaleString("ja-JP", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `$${price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatChange(change: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}`;
}

export function formatChangePercent(percent: number): string {
  const sign = percent >= 0 ? "+" : "";
  return `${sign}${percent.toFixed(2)}%`;
}

export function getTickerDisplayName(ticker: string): string {
  const names: Record<string, string> = {
    "^GSPC": "S&P 500",
    "^N225": "日経平均",
    "JPY=X": "USD/JPY",
  };
  return names[ticker] || ticker;
}
