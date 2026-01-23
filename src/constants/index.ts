export const DEFAULT_TICKERS = ["GRRR", "^GSPC", "^N225", "JPY=X"] as const;

export const TIME_RANGES = {
  "1D": "1 Day",
  "1W": "1 Week",
  "1M": "1 Month",
  "3M": "3 Months",
} as const;

export const CHART_COLORS = {
  positive: "#16a34a",
  negative: "#dc2626",
  grid: "#e5e7eb",
  tickText: "#6b7280",
  volumeBar: "#e5e7eb",
  volumeTickText: "#9ca3af",
} as const;

export const CHART_CONFIG = {
  margin: { top: 10, right: 10, left: 0, bottom: 0 },
  marginWithVolume: { top: 10, right: 10, left: 0, bottom: 30 },
  yAxisWidth: 80,
  volumeAxisWidth: 50,
  minTickGap: 50,
  tickFontSize: 12,
  volumeTickFontSize: 10,
  strokeDasharray: "3 3",
  activeDotRadius: 4,
  priceBuffer: 0.005,
} as const;
