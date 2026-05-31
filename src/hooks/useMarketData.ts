"use client";

import { fetcher } from "@/lib/fetcher";
import type { StockData } from "@/types";
import useSWR from "swr";

interface MarketResponse {
  data: StockData[];
  lastUpdate: string;
  error?: string;
}

interface UseMarketDataOptions {
  refreshInterval?: number;
  fallbackData?: MarketResponse;
}

interface UseMarketDataReturn {
  stocks: StockData[];
  lastUpdate: Date | null;
  isLoading: boolean;
  isValidating: boolean;
  error: Error | null;
  refresh: () => Promise<MarketResponse | undefined>;
}

/**
 * マーケットデータを取得・キャッシュするカスタムフック
 *
 * Next.js 16+ ベストプラクティス:
 * - Server Component で初期データを取得し fallbackData として渡す
 * - Client Component で SWR による自動更新を行う
 *
 * @param tickers - 取得する銘柄コードの配列
 * @param options - SWR オプション
 */
export function useMarketData(
  tickers?: string[],
  options: UseMarketDataOptions = {},
): UseMarketDataReturn {
  const { refreshInterval = 30000, fallbackData } = options;

  const tickersParam = tickers?.join(",");
  const url = tickersParam
    ? `/api/market?tickers=${tickersParam}`
    : "/api/market";

  const { data, error, isLoading, isValidating, mutate } =
    useSWR<MarketResponse>(url, fetcher, {
      refreshInterval,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 10000,
      fallbackData,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      // Performance optimizations
      revalidateIfStale: true,
      revalidateOnMount: !fallbackData,
      keepPreviousData: true,
    });

  return {
    stocks: data?.data ?? [],
    lastUpdate: data?.lastUpdate ? new Date(data.lastUpdate) : null,
    isLoading,
    isValidating,
    error: error ?? (data?.error ? new Error(data.error) : null),
    refresh: mutate,
  };
}
