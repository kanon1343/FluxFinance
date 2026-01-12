'use client';

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CHART_COLORS, CHART_CONFIG } from '@/constants';
import { cn, formatPrice } from '@/lib/utils';
import type { ChartDataPoint } from '@/types';

export type ChartType = 'line' | 'candlestick';

interface PriceChartProps {
  data: ChartDataPoint[];
  chartType?: ChartType;
  currency?: string;
  height?: number;
  showVolume?: boolean;
  className?: string;
}

interface TooltipPayloadItem {
  value: number;
  dataKey: string;
  payload: ChartDataPoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  currency: string;
  chartType: ChartType;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
  });
}

function formatDateFull(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatVolume(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  return `${(value / 1000).toFixed(0)}K`;
}

function CustomTooltip({
  active,
  payload,
  currency,
  chartType,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-medium text-gray-900 mb-2">
        {formatDateFull(data.timestamp)}
      </p>
      {chartType === 'candlestick' ? (
        <div className="space-y-1">
          <p className="text-gray-600">
            始値:{' '}
            <span className="font-medium">
              {formatPrice(data.open, currency)}
            </span>
          </p>
          <p className="text-gray-600">
            高値:{' '}
            <span className="font-medium text-green-600">
              {formatPrice(data.high, currency)}
            </span>
          </p>
          <p className="text-gray-600">
            安値:{' '}
            <span className="font-medium text-red-600">
              {formatPrice(data.low, currency)}
            </span>
          </p>
          <p className="text-gray-600">
            終値:{' '}
            <span className="font-medium">
              {formatPrice(data.close, currency)}
            </span>
          </p>
        </div>
      ) : (
        <p className="text-gray-600">
          価格:{' '}
          <span className="font-medium">
            {formatPrice(data.close, currency)}
          </span>
        </p>
      )}
      {data.volume > 0 && (
        <p className="text-gray-500 mt-1 text-xs">
          出来高: {data.volume.toLocaleString()}
        </p>
      )}
    </div>
  );
}

const axisTickStyle = {
  fontSize: CHART_CONFIG.tickFontSize,
  fill: CHART_COLORS.tickText,
};

const axisLineStyle = { stroke: CHART_COLORS.grid };

export function PriceChart({
  data,
  chartType = 'line',
  currency = 'USD',
  height = 300,
  showVolume = false,
  className,
}: PriceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-50 rounded-lg',
          className
        )}
        style={{ height }}
      >
        <p className="text-gray-500">チャートデータがありません</p>
      </div>
    );
  }

  const prices = data.map((d) => d.close);
  const minPrice = Math.min(...prices) * (1 - CHART_CONFIG.priceBuffer);
  const maxPrice = Math.max(...prices) * (1 + CHART_CONFIG.priceBuffer);

  const firstPrice = data[0].close;
  const lastPrice = data[data.length - 1].close;
  const isPositive = lastPrice >= firstPrice;
  const lineColor = isPositive ? CHART_COLORS.positive : CHART_COLORS.negative;

  if (chartType === 'line') {
    return (
      <div className={cn('w-full', className)} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={CHART_CONFIG.margin}>
            <CartesianGrid
              strokeDasharray={CHART_CONFIG.strokeDasharray}
              stroke={CHART_COLORS.grid}
            />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatDate}
              tick={axisTickStyle}
              axisLine={axisLineStyle}
              tickLine={axisLineStyle}
              minTickGap={CHART_CONFIG.minTickGap}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tickFormatter={(value: number) => formatPrice(value, currency)}
              tick={axisTickStyle}
              axisLine={axisLineStyle}
              tickLine={axisLineStyle}
              width={CHART_CONFIG.yAxisWidth}
            />
            <Tooltip
              content={
                <CustomTooltip currency={currency} chartType={chartType} />
              }
            />
            <Line
              type="monotone"
              dataKey="close"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: CHART_CONFIG.activeDotRadius, fill: lineColor }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Candlestick chart using ComposedChart
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={
            showVolume ? CHART_CONFIG.marginWithVolume : CHART_CONFIG.margin
          }
        >
          <CartesianGrid
            strokeDasharray={CHART_CONFIG.strokeDasharray}
            stroke={CHART_COLORS.grid}
          />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatDate}
            tick={axisTickStyle}
            axisLine={axisLineStyle}
            tickLine={axisLineStyle}
            minTickGap={CHART_CONFIG.minTickGap}
          />
          <YAxis
            yAxisId="price"
            domain={[minPrice, maxPrice]}
            tickFormatter={(value: number) => formatPrice(value, currency)}
            tick={axisTickStyle}
            axisLine={axisLineStyle}
            tickLine={axisLineStyle}
            width={CHART_CONFIG.yAxisWidth}
          />
          {showVolume && (
            <YAxis
              yAxisId="volume"
              orientation="right"
              tickFormatter={formatVolume}
              tick={{
                fontSize: CHART_CONFIG.volumeTickFontSize,
                fill: CHART_COLORS.volumeTickText,
              }}
              axisLine={false}
              tickLine={false}
              width={CHART_CONFIG.volumeAxisWidth}
            />
          )}
          <Tooltip
            content={
              <CustomTooltip currency={currency} chartType={chartType} />
            }
          />
          {showVolume && (
            <Bar
              yAxisId="volume"
              dataKey="volume"
              fill={CHART_COLORS.volumeBar}
              opacity={0.5}
            />
          )}
          <Line
            yAxisId="price"
            type="monotone"
            dataKey="high"
            stroke={CHART_COLORS.positive}
            strokeWidth={1}
            dot={false}
            strokeDasharray="2 2"
          />
          <Line
            yAxisId="price"
            type="monotone"
            dataKey="low"
            stroke={CHART_COLORS.negative}
            strokeWidth={1}
            dot={false}
            strokeDasharray="2 2"
          />
          <Line
            yAxisId="price"
            type="monotone"
            dataKey="close"
            stroke={lineColor}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: CHART_CONFIG.activeDotRadius, fill: lineColor }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
