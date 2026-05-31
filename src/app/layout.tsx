import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "FluxFinance - 株価監視ダッシュボード",
  description:
    "個人投資家向けの高速株価監視ダッシュボード。GRRR、S&P500、日経平均、USD/JPYの価格情報をリアルタイムで表示。",
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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FluxFinance",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "FluxFinance - 株価監視ダッシュボード",
    description: "個人投資家向けの高速株価監視ダッシュボード",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "FluxFinance - 株価監視ダッシュボード",
    description: "個人投資家向けの高速株価監視ダッシュボード",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://query1.finance.yahoo.com" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
