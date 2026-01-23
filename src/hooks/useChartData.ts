"use client";

import type { ChartDataPoint, TimeRange } from "@/types";
import { useCallback, useState } from "react";

interface HistoryResponse {
  ticker: string;
  data: ChartDataPoint[];
  range: TimeRange;
  error?: string;
}

interface UseChartDataReturn {
  chartData: ChartDataPoint[];
  isLoading: boolean;
  error: string | null;
  fetchChartData: (ticker: string, range: TimeRange) => Promise<void>;
}

export function useChartData(): UseChartDataReturn {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = useCallback(
    async (ticker: string, range: TimeRange) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/history?ticker=${encodeURIComponent(ticker)}&range=${range}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch chart data");
        }

        const data: HistoryResponse = await response.json();

        if (data.error) {
          setError(data.error);
          setChartData([]);
        } else {
          setChartData(data.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { chartData, isLoading, error, fetchChartData };
}
