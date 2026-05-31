import { Metadata } from "next";
import { Dashboard } from "@/components";
import { DEFAULT_TICKERS } from "@/constants";
import type { StockData } from "@/types";

export const metadata: Metadata = {
  title: "FluxFinance - 株価監視ダッシュボード",
  description:
    "個人投資家向けの高速株価監視ダッシュボード。GRRR、S&P500、日経平均、USD/JPYの価格情報をリアルタイムで確認。",
  keywords: [
    "株価",
    "投資",
    "ダッシュボード",
    "リアルタイム",
    "S&P500",
    "日経平均",
  ],
  authors: [{ name: "FluxFinance" }],
  robots: "index, follow",
  openGraph: {
    title: "FluxFinance - 株価監視ダッシュボード",
    description: "個人投資家向けの高速株価監視ダッシュボード",
    type: "website",
    locale: "ja_JP",
  },
};

interface MarketResponse {
  data: StockData[];
  lastUpdate: string;
  error?: string;
}

async function getInitialMarketData(): Promise<MarketResponse | null> {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const response = await fetch(
      `${baseUrl}/api/market?tickers=${DEFAULT_TICKERS.join(",")}`,
      {
        next: {
          revalidate: 30,
          tags: ["market-data"],
        },
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

export default async function Home() {
  const initialData = await getInitialMarketData();

  return (
    <Dashboard
      initialData={initialData?.data}
      initialLastUpdate={initialData?.lastUpdate}
    />
  );
}
