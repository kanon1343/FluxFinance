'use client';

import { useEffect, useState } from 'react';
import { TIME_RANGES } from '@/constants';
import { useChartData } from '@/hooks';
import {
  cn,
  formatChangePercent,
  formatPrice,
  getTickerDisplayName,
} from '@/lib/utils';
import type { StockData, TimeRange } from '@/types';
import { type ChartType, PriceChart } from './PriceChart';

interface ChartModalProps {
  stock: StockData;
  isOpen: boolean;
  onClose: () => void;
  initialTimeRange?: TimeRange;
}

const TIME_RANGE_OPTIONS: TimeRange[] = ['1D', '1W', '1M', '3M'];
const CHART_TYPE_OPTIONS: { value: ChartType; label: string }[] = [
  { value: 'line', label: 'ライン' },
  { value: 'candlestick', label: 'OHLC' },
];

export function ChartModal({
  stock,
  isOpen,
  onClose,
  initialTimeRange = '1M',
}: ChartModalProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);
  const [chartType, setChartType] = useState<ChartType>('line');
  const { chartData, isLoading, error, fetchChartData } = useChartData();

  const displayName = getTickerDisplayName(stock.ticker);
  const isPositive = stock.change >= 0;

  useEffect(() => {
    if (isOpen) {
      fetchChartData(stock.ticker, timeRange);
    }
  }, [isOpen, stock.ticker, timeRange, fetchChartData]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  const handleChartTypeChange = (type: ChartType) => {
    setChartType(type);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chart-modal-title"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2
              id="chart-modal-title"
              className="text-xl font-bold text-gray-900"
            >
              {displayName}
            </h2>
            <p className="text-sm text-gray-500">{stock.ticker}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(stock.currentPrice, stock.currency)}
              </p>
              <p
                className={cn(
                  'text-sm font-medium',
                  isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {isPositive ? '+' : ''}
                {stock.change.toFixed(2)} (
                {formatChangePercent(stock.changePercent)})
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="閉じる"
            >
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <title>閉じる</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-100">
          {/* Time Range Buttons */}
          <fieldset className="flex gap-2 border-0 p-0 m-0">
            <legend className="sr-only">時間範囲選択</legend>
            {TIME_RANGE_OPTIONS.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => handleTimeRangeChange(range)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
                aria-pressed={timeRange === range}
              >
                {TIME_RANGES[range]}
              </button>
            ))}
          </fieldset>

          {/* Chart Type Toggle */}
          <fieldset className="flex gap-2 border-0 p-0 m-0">
            <legend className="sr-only">チャート種別選択</legend>
            {CHART_TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChartTypeChange(option.value)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  chartType === option.value
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
                aria-pressed={chartType === option.value}
              >
                {option.label}
              </button>
            ))}
          </fieldset>
        </div>

        {/* Chart Area */}
        <div className="flex-1 p-4 min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500">チャートを読み込み中...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-600 font-medium mb-2">
                  データの取得に失敗しました
                </p>
                <p className="text-gray-500 text-sm">{error}</p>
                <button
                  type="button"
                  onClick={() => fetchChartData(stock.ticker, timeRange)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  再試行
                </button>
              </div>
            </div>
          ) : (
            <PriceChart
              data={chartData}
              chartType={chartType}
              currency={stock.currency}
              height={400}
              showVolume={chartType === 'candlestick'}
              className="w-full"
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            データ提供: Yahoo Finance • 最終更新:{' '}
            {new Date().toLocaleString('ja-JP')}
          </p>
        </div>
      </div>
    </div>
  );
}
