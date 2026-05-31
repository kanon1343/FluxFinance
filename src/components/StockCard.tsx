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
        stock.currency,
      )}、変動: ${formatChangePercent(stock.changePercent)}`}
      className="w-full bg-white rounded-lg shadow-md p-3 sm:p-4 hover:shadow-lg active:shadow-xl transition-all duration-200 cursor-pointer text-left border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 touch-manipulation min-h-[120px] sm:min-h-[140px]"
    >
      <div className="flex justify-between items-start mb-2 sm:mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
            {displayName}
          </h3>
          <p className="text-xs text-gray-500 truncate">{stock.ticker}</p>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${bgChangeColor} ${changeColor} flex-shrink-0 ml-2`}
          aria-hidden="true"
        >
          {formatChangePercent(stock.changePercent)}
        </span>
      </div>

      <div className="mt-2 sm:mt-3">
        <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
          {formatPrice(stock.currentPrice, stock.currency)}
        </p>
        <p className={`text-sm font-medium ${changeColor} truncate`}>
          {formatChange(stock.change)} (
          {formatChangePercent(stock.changePercent)})
        </p>
      </div>
    </button>
  );
}
