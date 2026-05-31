# Implementation Plan: FluxFinance

## Overview

FluxFinance ダッシュボードを Next.js App Router、TypeScript、Tailwind CSS を使用して実装します。yahoo-finance2 ライブラリで Yahoo Finance API と統合し、SWR でデータキャッシュ、Recharts でチャート表示を行います。段階的な実装により、各ステップで動作確認を行いながら進めます。

## Tasks

- [x] 1. プロジェクト初期設定とコア依存関係のセットアップ
  - Next.js 14 プロジェクトの作成と TypeScript 設定
  - 必要な依存関係のインストール（yahoo-finance2, SWR, Recharts, Tailwind CSS）
  - 基本的なプロジェクト構造の作成
  - _Requirements: 技術スタック要件_

- [x] 2. API Routes 実装とデータ統合
  - [x] 2.1 Market Data API Route の実装
    - `/api/market` エンドポイントの作成
    - yahoo-finance2 を使用した Yahoo Finance API 統合
    - エラーハンドリングとレスポンス形式の標準化
    - _Requirements: 7.1, 7.3, 7.4_

  - [ ]\* 2.2 Market Data API Route のプロパティテスト
    - **Property 1: Market Data Display Consistency**
    - **Property 13: Error Handling and Fallback**
    - **Validates: Requirements 1.2, 7.2, 7.3, 7.4**

  - [x] 2.3 Historical Data API Route の実装
    - `/api/history` エンドポイントの作成
    - 時系列データの取得と整形
    - パフォーマンス最適化とキャッシュヘッダー設定
    - _Requirements: 2.2, 6.2_

  - [ ]\* 2.4 Historical Data API Route のプロパティテスト
    - **Property 5: Default Time Range Display**
    - **Property 11: Performance Requirements**
    - **Validates: Requirements 2.2, 6.1, 6.2**

- [x] 3. チェックポイント - API Routes 動作確認
  - すべてのテストが通ることを確認し、質問があれば聞いてください。
  - ✅ E2E テスト 11 件すべてパス（Playwright 使用）

- [x] 4. コア UI コンポーネントの実装
  - [x] 4.1 基本レイアウトとヘッダーコンポーネント
    - アプリケーションヘッダーの実装（アプリ名、最終更新時刻）
    - レスポンシブレイアウトの基盤作成
    - Tailwind CSS によるスタイリング
    - _Requirements: 8.1, 5.1, 5.2_

  - [x] 4.2 StockCard コンポーネントの実装
    - 銘柄情報表示カードの作成
    - 価格変動の色分け表示（緑/赤）
    - カードクリックイベントハンドリング
    - _Requirements: 1.1, 1.3, 1.4, 1.5, 8.2_

  - [ ]\* 4.3 StockCard コンポーネントのプロパティテスト
    - **Property 2: Price Change Information Completeness**
    - **Property 3: Color Coding Consistency**
    - **Property 14: UI Component Organization**
    - **Validates: Requirements 1.3, 1.4, 1.5, 8.2**

  - [x] 4.4 MarketTicker コンポーネントの実装
    - 画面上部のティッカー表示
    - 自動スクロール機能
    - リアルタイム更新対応
    - _Requirements: 4.3_

- [x] 5. チャート機能の実装
  - [x] 5.1 PriceChart コンポーネントの実装
    - Recharts を使用したラインチャート実装
    - キャンドルスティックチャート対応
    - レスポンシブチャートサイズ調整
    - _Requirements: 2.1, 2.3, 5.4_

  - [ ]\* 5.2 PriceChart コンポーネントのプロパティテスト
    - **Property 4: Chart Rendering Support**
    - **Property 10: Mobile Chart Optimization**
    - **Validates: Requirements 2.1, 2.3, 5.4**

  - [x] 5.3 ChartModal コンポーネントの実装
    - 詳細チャート表示モーダル
    - 時間軸選択ボタン（1D, 1W, 1M, 3M）
    - チャート種別切り替え機能
    - _Requirements: 2.4, 3.1, 3.2, 3.3_

  - [ ]\* 5.4 ChartModal コンポーネントのプロパティテスト
    - **Property 6: Ticker Card Interaction**
    - **Property 7: Time Period Selection Behavior**
    - **Validates: Requirements 2.4, 3.2, 3.3**

- [x] 6. データフェッチングとキャッシュの実装
  - [x] 6.1 SWR フックとデータフェッチング戦略
    - カスタム SWR フックの作成
    - キャッシュ設定と revalidation 戦略
    - エラーハンドリングとフォールバック
    - _Requirements: 4.2, 6.3, 7.2_

  - [ ]\* 6.2 データフェッチングのプロパティテスト
    - **Property 8: Data Refresh Behavior**
    - **Property 12: Caching Behavior**
    - **Validates: Requirements 4.2, 4.3, 4.4, 6.3**

  - [x] 6.3 リフレッシュボタンと自動更新機能
    - 手動リフレッシュボタンの実装
    - 自動更新インターバル設定
    - ローディング状態の表示
    - _Requirements: 4.1, 4.4_

- [-] 7. レスポンシブデザインと UI 最適化P
- [-] - [ ] 7.1 モバイル・デスクトップレイアウト調整
  - グリッドレイアウトの実装
  - ブレークポイント設定
  - タッチ操作最適化
  - _Requirements: 5.1, 5.2, 5.3_

  - [ ]\* 7.2 レスポンシブデザインのプロパティテスト
    - **Property 9: Responsive Layout Adaptation**
    - **Validates: Requirements 5.1, 5.2**

  - [-] 7.3 パフォーマンス最適化
    - 画像最適化とコード分割
    - Core Web Vitals 改善
    - バンドルサイズ最適化
    - _Requirements: 6.1, 6.4_

- [-] 8. 統合とメインページ実装
  - [ ] 8.1 Dashboard ページの統合
    - 全コンポーネントの統合
    - 初期データローディング
    - エラーバウンダリの実装
    - _Requirements: 1.1, 1.2_

  - [ ]\* 8.2 統合テストと E2E テスト
    - 主要ユーザーフローのテスト
    - API 統合テスト
    - パフォーマンステスト
    - _Requirements: 6.1, 6.2_

  - [ ] 8.3 デフォルト銘柄設定と初期表示
    - GRRR, ^GSPC, ^N225, JPY=X の設定
    - 初期データ取得とエラーハンドリング
    - ローディング状態の実装
    - _Requirements: 1.1_

- [ ] 9. 最終チェックポイント - 全機能動作確認
  - すべてのテストが通ることを確認し、質問があれば聞いてください。

## Notes

- `*`マークのタスクはオプションで、MVP を早く作成するためにスキップ可能です
- 各タスクは具体的な要件番号を参照してトレーサビリティを確保
- チェックポイントで段階的な検証を実施
- プロパティテストは汎用的な正確性プロパティを検証
- ユニットテストは具体例とエッジケースを検証
