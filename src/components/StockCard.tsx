"use client";

import type { StockData } from "@/types";
import {
  formatPrice,
  formatChange,
  formatChangePercent,
  getTickerDisplayName,
} from "@/lib/utils";

interface StockCardProps {
  stock: StockData;
  onClick?: () => void;
}

export function StockCard({ stock, onClick }: StockCardProps) {
  const isPositive = stock.change >= 0;
  const changeColor = isPositive ? "text-green-600" : "text-red-600";
  const bgChangeColor = isPositive ? "bg-green-50" : "bg-red-50";
  const displayName = getTickerDisplayName(stock.ticker);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${displayName}の詳細を表示。現在価格: ${formatPrice(
        stock.currentPrice,
        stock.currency
      )}、変動: ${formatChangePercent(stock.changePercent)}`}
      className="w-full bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer text-left border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{displayName}</h3>
          <p className="text-xs text-gray-500">{stock.ticker}</p>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${bgChangeColor} ${changeColor}`}
          aria-hidden="true"
        >
          {formatChangePercent(stock.changePercent)}
        </span>
      </div>

      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900">
          {formatPrice(stock.currentPrice, stock.currency)}
        </p>
        <p className={`text-sm font-medium ${changeColor}`}>
          {formatChange(stock.change)} (
          {formatChangePercent(stock.changePercent)})
        </p>
      </div>
    </button>
  );
}
