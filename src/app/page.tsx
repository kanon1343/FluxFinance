import { Metadata } from "next";
import { Dashboard } from "@/components";
import { DEFAULT_TICKERS } from "@/constants";
import { fetchQuotes } from "@/lib/market-data";

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

// 価格は 30 秒ごとに再生成する（以降はクライアントの SWR が更新する）
export const revalidate = 30;

export default async function Home() {
  const initialData = await fetchQuotes(DEFAULT_TICKERS);

  return (
    <Dashboard
      initialData={initialData}
      initialLastUpdate={new Date().toISOString()}
    />
  );
}
