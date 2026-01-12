'use server';

import { DEFAULT_TICKERS } from '@/constants';
import type { ChartDataPoint, StockData, TimeRange } from '@/types';
import yahooFinance from 'yahoo-finance2';

// Yahoo Finance APIの型定義
interface YahooQuote {
  symbol?: string;
  regularMarketPrice?: number;
  price?: number;
  regularMarketPreviousClose?: number;
  previousClose?: number;
  currency?: string;
}

interface YahooHistoricalData {
  date: Date;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

export async function getStockData(
  tickers: readonly string[] = DEFAULT_TICKERS
): Promise<StockData[]> {
  try {
    const quotes = await (yahooFinance as any).quote(tickers);

    return Array.isArray(quotes)
      ? quotes.map(transformQuoteToStockData)
      : [transformQuoteToStockData(quotes)];
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw new Error('Failed to fetch stock data');
  }
}

export async function getHistoricalData(
  ticker: string,
  range: TimeRange = '1M'
): Promise<ChartDataPoint[]> {
  try {
    const period1 = getPeriodFromRange(range);
    const period2 = new Date();

    const result = await (yahooFinance as any).historical(ticker, {
      period1,
      period2,
      interval: getIntervalFromRange(range),
    });

    return result.map(transformHistoricalToChartData);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw new Error('Failed to fetch historical data');
  }
}

function transformQuoteToStockData(quote: YahooQuote): StockData {
  const currentPrice = quote.regularMarketPrice || quote.price || 0;
  const previousClose =
    quote.regularMarketPreviousClose || quote.previousClose || currentPrice;
  const change = currentPrice - previousClose;
  const changePercent =
    previousClose !== 0 ? (change / previousClose) * 100 : 0;

  return {
    ticker: quote.symbol || '',
    currentPrice,
    previousClose,
    change,
    changePercent,
    currency: quote.currency || 'USD',
    lastUpdate: new Date(),
  };
}

function transformHistoricalToChartData(
  data: YahooHistoricalData
): ChartDataPoint {
  return {
    timestamp: data.date.getTime(),
    open: data.open || 0,
    high: data.high || 0,
    low: data.low || 0,
    close: data.close || 0,
    volume: data.volume || 0,
  };
}

function getPeriodFromRange(range: TimeRange): Date {
  const now = new Date();
  switch (range) {
    case '1D':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case '1W':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '1M':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '3M':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
}

function getIntervalFromRange(range: TimeRange): string {
  switch (range) {
    case '1D':
      return '5m';
    case '1W':
      return '1h';
    case '1M':
      return '1d';
    case '3M':
      return '1d';
    default:
      return '1d';
  }
}
