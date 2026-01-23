"use client";

import { fetcher } from "@/lib/fetcher";
import type { ChartDataPoint, TimeRange } from "@/types";
import useSWR from "swr";

interface HistoryResponse {
  ticker: string;
  data: ChartDataPoint[];
  range: TimeRange;
  error?: string;
}

interface UseHistoryDataReturn {
  chartData: ChartDataPoint[];
  isLoading: boolean;
  isValidating: boolean;
  error: Error | null;
  refresh: () => Promise<HistoryResponse | undefined>;
}

/**
 * 履歴データを取得・キャッシュするカスタムフック
 *
 * @param ticker - 銘柄コード
 * @param range - 時間範囲
 */
export function useHistoryData(
  ticker: string | null,
  range: TimeRange = "1M"
): UseHistoryDataReturn {
  const url = ticker
    ? `/api/history?ticker=${encodeURIComponent(ticker)}&range=${range}`
    : null;

  const { data, error, isLoading, isValidating, mutate } =
    useSWR<HistoryResponse>(url, fetcher, {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      errorRetryCount: 2,
    });

  return {
    chartData: data?.data ?? [],
    isLoading,
    isValidating,
    error: error ?? (data?.error ? new Error(data.error) : null),
    refresh: mutate,
  };
}
