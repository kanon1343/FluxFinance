export interface StockData {
  ticker: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  currency: string;
  lastUpdate?: Date;
}

export interface TickerItem {
  symbol: string;
  displayName: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
}

export interface ChartDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type TimeRange = "1D" | "1W" | "1M" | "3M";
