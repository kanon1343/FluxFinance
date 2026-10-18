export interface StockData {
  ticker: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  currency: string;
  lastUpdate?: Date;
}

/** 価格を取得できなかった銘柄の結果 */
export interface StockDataError {
  ticker: string;
  error: string;
}

/** 銘柄ごとの取得結果。失敗した銘柄は価格を持たず `error` を持つ */
export type StockResult = StockData | StockDataError;

export interface MarketResponse {
  data: StockResult[];
  lastUpdate: string;
  error?: string;
}

export interface HistoryResponse {
  ticker: string;
  data: ChartDataPoint[];
  range: TimeRange;
  error?: string;
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
