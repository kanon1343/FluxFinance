import { Dashboard } from "@/components";
import { DEFAULT_TICKERS } from "@/constants";
import type { StockData } from "@/types";

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
        next: { revalidate: 30 },
      }
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
