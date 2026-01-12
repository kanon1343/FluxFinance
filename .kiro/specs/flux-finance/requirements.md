# Requirements Document

## Introduction

FluxFinance は個人の資産形成（特に短中期の急増狙い）のための株価監視ダッシュボードです。特定の監視銘柄（GRRR など）と市場指数（S&P500、日経平均）を、スマホや PC から素早く確認できるシンプルで高速な Web アプリケーションを提供します。

## Glossary

- **System**: FluxFinance ダッシュボードアプリケーション
- **User**: 個人投資家（エンジニア、ハイリスク許容、27 歳）
- **Stock_Data**: 株価、指数、為替の現在値と変動情報
- **Chart**: 価格推移を表示するグラフィカル要素
- **Ticker**: 銘柄コード（例：GRRR、^GSPC）
- **Market_Data**: Yahoo Finance から取得される金融データ

## Requirements

### Requirement 1: 株価データ表示

**User Story:** As a personal investor, I want to view current stock prices and market indices, so that I can quickly assess my investment positions.

#### Acceptance Criteria

1. THE System SHALL display current prices for GRRR, S&P 500 (^GSPC), Nikkei 225 (^N225), and USD/JPY (JPY=X)
2. WHEN displaying stock prices, THE System SHALL show the latest price or closing price
3. WHEN displaying price changes, THE System SHALL show both absolute change and percentage change from previous day
4. WHEN price change is positive, THE System SHALL display it in green color
5. WHEN price change is negative, THE System SHALL display it in red color

### Requirement 2: チャート表示機能

**User Story:** As a personal investor, I want to view price trend charts, so that I can analyze market movements over time.

#### Acceptance Criteria

1. THE System SHALL display line charts or candlestick charts for each monitored asset
2. THE System SHALL show price trends for the past 1 to 3 months by default
3. WHEN a user selects a time period, THE System SHALL update the chart to show data for that period
4. THE System SHALL support time period options of 1 day, 1 week, 1 month, and 3 months

### Requirement 3: ユーザー操作機能

**User Story:** As a personal investor, I want to interact with the dashboard, so that I can customize my view and refresh data.

#### Acceptance Criteria

1. WHEN a user clicks a time period button, THE System SHALL switch the chart display to that time period
2. WHEN a user clicks the refresh button, THE System SHALL fetch the latest market data
3. WHEN a user clicks on a stock card, THE System SHALL display a detailed chart modal or section
4. THE System SHALL provide automatic data refresh using SWR or similar technology

### Requirement 4: パフォーマンス要件

**User Story:** As a personal investor, I want fast access to market data, so that I can make timely investment decisions.

#### Acceptance Criteria

1. THE System SHALL display main content within 2 seconds of initial page load
2. THE System SHALL complete data fetching through API routes within the 2-second target
3. THE System SHALL optimize for Core Web Vitals metrics
4. THE System SHALL operate within free tier limitations of hosting services

### Requirement 5: レスポンシブ UI 設計

**User Story:** As a personal investor, I want to access the dashboard from both mobile and desktop devices, so that I can monitor markets anywhere.

#### Acceptance Criteria

1. THE System SHALL display stock cards in a single column layout on mobile devices
2. THE System SHALL display stock cards in a grid layout on desktop devices
3. THE System SHALL provide a clean, modern design with minimal visual noise
4. THE System SHALL display app name "FluxFinance" and last update time in the header
5. WHERE market ticker is enabled, THE System SHALL show S&P 500 and USD/JPY in a scrolling ticker format

### Requirement 6: データ取得アーキテクチャ

**User Story:** As a system administrator, I want reliable data fetching architecture, so that the application can consistently provide accurate market data.

#### Acceptance Criteria

1. THE System SHALL use Next.js API Routes as Backend for Frontend to avoid CORS issues
2. WHEN the client requests stock data, THE System SHALL call /api/stocks endpoint with ticker parameter
3. WHEN API route receives a request, THE System SHALL use yahoo-finance2 library to fetch data from Yahoo Finance
4. WHEN Yahoo Finance returns data, THE System SHALL format and return it as JSON to the client
5. THE System SHALL use SWR or TanStack Query for client-side caching and automatic revalidation

### Requirement 7: テクノロジースタック

**User Story:** As a developer, I want to use modern, reliable technologies, so that the application is maintainable and performant.

#### Acceptance Criteria

1. THE System SHALL be built using TypeScript for type safety
2. THE System SHALL use Next.js with App Router for the framework
3. THE System SHALL use Tailwind CSS for styling
4. THE System SHALL use Recharts library for chart rendering
5. THE System SHALL use yahoo-finance2 for backend data fetching
6. THE System SHALL be deployable to Vercel platform

### Requirement 8: E2E テスト要件

**User Story:** As a developer, I want comprehensive end-to-end testing, so that I can ensure the application works correctly across different scenarios.

#### Acceptance Criteria

1. THE System SHALL include Playwright for E2E testing
2. THE System SHALL use Playwright MCP for enhanced testing capabilities
3. THE System SHALL use Chrome Dev Tools MCP for debugging and performance analysis
4. WHEN E2E tests run, THE System SHALL verify data loading, chart rendering, and user interactions
5. THE System SHALL validate responsive behavior across different device sizes
