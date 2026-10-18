"use client";

import type { StockDataError, StockResult } from "@/types";
import {
  formatPrice,
  formatChange,
  formatChangePercent,
  getTickerDisplayName,
  isStockDataError,
} from "@/lib/utils";

interface StockCardProps {
  stock: StockResult;
  onClick?: () => void;
}

const CARD_BASE_CLASS =
  "w-full bg-white rounded-lg shadow-md p-3 sm:p-4 text-left border min-h-[120px] sm:min-h-[140px]";

function StockErrorCard({ stock }: { stock: StockDataError }) {
  const displayName = getTickerDisplayName(stock.ticker);

  return (
    <article
      aria-label={`${displayName}の価格を取得できませんでした`}
      className={`${CARD_BASE_CLASS} border-red-200`}
    >
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
        {displayName}
      </h3>
      <p className="text-xs text-gray-500 truncate">{stock.ticker}</p>
      <p className="mt-2 sm:mt-3 text-sm font-medium text-red-700">
        価格を取得できませんでした
      </p>
      <p className="text-xs text-gray-500 break-words">{stock.error}</p>
    </article>
  );
}

export function StockCard({ stock, onClick }: StockCardProps) {
  if (isStockDataError(stock)) {
    return <StockErrorCard stock={stock} />;
  }

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
      className={`${CARD_BASE_CLASS} border-gray-100 hover:shadow-lg active:shadow-xl transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 touch-manipulation`}
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
