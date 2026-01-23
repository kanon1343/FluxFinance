"use client";

import { useCallback, useMemo, useState } from "react";
import { useMarketData } from "@/hooks";
import type { StockData } from "@/types";
import { ChartModal } from "./ChartModal";
import { Header } from "./Header";
import { MarketTicker } from "./MarketTicker";
import { StockCard } from "./StockCard";

interface DashboardProps {
  initialData?: StockData[];
  initialLastUpdate?: string;
}

export function Dashboard({ initialData, initialLastUpdate }: DashboardProps) {
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fallbackData = useMemo(
    () =>
      initialData
        ? {
            data: initialData,
            lastUpdate: initialLastUpdate ?? new Date().toISOString(),
          }
        : undefined,
    [initialData, initialLastUpdate]
  );

  const { stocks, lastUpdate, isLoading, isValidating, error, refresh } =
    useMarketData(undefined, {
      refreshInterval: 30000,
      fallbackData,
    });

  const handleStockClick = useCallback((stock: StockData) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedStock(null);
  }, []);

  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  const tickerItems = useMemo(
    () =>
      stocks.map((stock) => ({
        symbol: stock.ticker,
        displayName: stock.ticker,
        price: stock.currentPrice,
        change: stock.change,
        changePercent: stock.changePercent,
        currency: stock.currency,
      })),
    [stocks]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        lastUpdate={lastUpdate}
        isRefreshing={isValidating}
        onRefresh={handleRefresh}
      />

      {tickerItems.length > 0 && <MarketTicker items={tickerItems} />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">
              データの取得に失敗しました: {error.message}
            </p>
            <button
              type="button"
              onClick={handleRefresh}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              再試行
            </button>
          </div>
        )}

        {isLoading && stocks.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500">データを読み込み中...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stocks.map((stock) => (
              <StockCard
                key={stock.ticker}
                stock={stock}
                onClick={() => handleStockClick(stock)}
              />
            ))}
          </div>
        )}
      </main>

      {selectedStock && (
        <ChartModal
          stock={selectedStock}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
