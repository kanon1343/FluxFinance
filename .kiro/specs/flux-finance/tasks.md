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

- [-] 7. レスポンシブデザインと UI 最適化
  - [-] 7.1 モバイル・デスクトップレイアウト調整
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

---

# 拡張フェーズ（2026-10 追加）

前提: デプロイせずローカル専用・単一ユーザーで使う。認証は実装しない。
実施順: 10.1 → 7.1 → 7.3 → 8.1 → 8.3 → 9 → 11 → 12 → 13 → 14。
各タスク末尾の「見積」は、そのタスクを担当するセッションのコンテキスト使用量（`get_usage` の tokensUsed、起動時の約 9 万を含む）の上限目安。超えても終わる見込みがなければ作業を止めてユーザーに判断を仰ぐ。

## Phase 0: 基盤整備

- [ ] 10. 基盤整備
  - [ ] 10.1 市場データ取得処理の統合
    - `src/lib/actions.ts` と `src/app/api/market`・`api/history` に重複する yahoo-finance2 呼び出しを `src/lib/market-data/` に集約する
    - `as any` を除去し、yahoo-finance2 の型を使う
    - 取得失敗した銘柄を価格 0 で返さず、`error` を持つ結果として返し UI でエラー表示する
    - 見積: 25 万

## Phase 1: 銘柄の選択と分析（DB 不要）

- [ ] 11. 銘柄の選択と分析
  - [ ] 11.1 銘柄検索 API と検索 UI
    - `/api/search`（yahoo-finance2 `search()`）を追加する
    - ヘッダーに検索ボックスを置き、候補から銘柄を選べるようにする（キーボード操作・a11y 対応）
    - 見積: 25 万
  - [ ] 11.2 ウォッチリスト（localStorage）
    - 検索結果から追加・削除・並べ替えができる。初期値は `DEFAULT_TICKERS`
    - Dashboard と MarketTicker をウォッチリスト基準で表示する
    - 見積: 25 万
  - [ ] 11.3 チャート期間の拡張
    - 6M / 1Y / 5Y を追加し、期間に応じた interval を選ぶ
    - 見積: 15 万
  - [ ] 11.4 テクニカル指標の計算関数
    - SMA / EMA / RSI / ボリンジャーバンドを `src/lib/indicators.ts` に純粋関数で実装し、ユニットテストを書く
    - 見積: 15 万
  - [ ] 11.5 チャートへの指標表示
    - ChartModal で指標の ON/OFF を切り替え、PriceChart に重ねて描画する（RSI は別ペイン）
    - 見積: 25 万
  - [ ] 11.6 比較チャート
    - 複数銘柄を起点 0% に正規化して重ね描きする画面を追加する
    - 見積: 25 万
  - [ ] 11.7 チェックポイント
    - typecheck・lint・unit・E2E がすべて通ることを確認し、主要フローの E2E を追加する
    - 見積: 20 万

## Phase 2: 市場の概観

- [ ] 12. 市場の概観
  - [ ] 12.1 マクロパネル
    - 米10年債（^TNX）、ドル円、ユーロ円、原油、金、VIX、BTC を一覧表示する
    - 見積: 20 万
  - [ ] 12.2 セクターヒートマップ
    - 米国セクター ETF（XLK など11本）と TOPIX-17 業種 ETF の騰落率を Recharts Treemap で表示する
    - 見積: 25 万
  - [ ] 12.3 ニュース表示
    - ウォッチリスト銘柄のニュース（yahoo-finance2 `search()` の news）を一覧・銘柄詳細に表示する
    - 見積: 20 万
  - [ ] 12.4 決算・配当カレンダー
    - ウォッチリスト銘柄の決算日・配当落ち日（`quoteSummary` の calendarEvents）を一覧表示する
    - 見積: 20 万
  - [ ] 12.5 チェックポイント
    - 見積: 20 万

## Phase 3: ポートフォリオ管理（ローカル単一ユーザー・認証なし）

- [ ] 13. ポートフォリオ管理
  - [ ] 13.1 要件・設計の追記
    - `requirements.md` / `design.md` にポートフォリオの要件とデータモデル（口座・取引・配当・為替）を追記する
    - DB は SQLite（`better-sqlite3`）+ Drizzle ORM。DB ファイルはプロジェクト内 `data/` に置き git 管理外にする
    - コードは書かない
    - 見積: 20 万
  - [ ] 13.2 DB 導入
    - Drizzle のスキーマ・マイグレーション・接続モジュール（`src/lib/db/`、server-only）を作る
    - `.gitignore`・`README.md` を更新し、追加した依存関係と理由を報告する
    - 見積: 25 万
  - [ ] 13.3 口座と取引の登録（Server Actions）
    - 口座（証券会社・口座種別: 特定/一般/NISA 成長/NISA つみたて）と取引（買/売・数量・単価・手数料・通貨・日付）の CRUD とフォーム
    - 入力バリデーションを行う
    - 見積: 35 万
  - [ ] 13.4 保有集計ロジック
    - 取引から保有数量・平均取得単価・実現損益・含み損益を計算する純粋関数とユニットテスト（移動平均法）
    - 見積: 20 万
  - [ ] 13.5 ポートフォリオ画面
    - `/portfolio` に保有一覧・評価額・損益を円換算で表示する（為替は Yahoo の `USDJPY=X` 等）
    - 見積: 30 万
  - [ ] 13.6 資産推移と収益率
    - 日次の評価額推移チャートと TWR（時間加重収益率）、ベンチマーク（S&P500・日経平均）比較
    - 見積: 35 万
  - [ ] 13.7 資産配分
    - 通貨・地域・セクター・口座別の配分を表示する
    - 見積: 25 万
  - [ ] 13.8 配当の記録と集計
    - 配当の登録、年別・月別の受取額集計
    - 見積: 25 万
  - [ ] 13.9 CSV 取り込み
    - 証券会社の取引履歴 CSV を取り込み、取引として登録する（プレビュー → 確定、重複検出）
    - 対象証券会社と CSV サンプルはユーザーから受け取る。サンプルがなければ着手しない
    - 見積: 35 万
  - [ ] 13.10 新NISA 枠管理
    - NISA 口座の取引から、年間投資枠（成長 240 万・つみたて 120 万）と生涯枠（1,800 万、うち成長 1,200 万）の使用額・残額を表示する
    - 見積: 25 万
  - [ ] 13.11 ウォッチリストの DB 移行
    - 11.2 の localStorage を DB 保存に切り替え、既存データを取り込む
    - 見積: 20 万
  - [ ] 13.12 チェックポイント
    - 登録 → 集計 → 表示の E2E を追加し、全テストが通ることを確認する
    - 見積: 25 万

## Phase 4: アラートと AI

- [ ] 14. アラートと AI
  - [ ] 14.1 価格アラート
    - 銘柄ごとに上限・下限・変動率の条件を DB に保存し、アプリを開いている間に判定してブラウザ通知（Notification API）を出す
    - 見積: 30 万
  - [ ] 14.2 Claude API 連携の基盤
    - API キーは `.env.local`。`api.anthropic.com` をファイアウォール許可リストに追加する必要がある（ユーザーに依頼）
    - 見積: 20 万
  - [ ] 14.3 ニュース・決算の AI 要約
    - 見積: 25 万
  - [ ] 14.4 ポートフォリオへの自然言語の質問
    - 見積: 30 万
  - [ ] 14.5 チェックポイント
    - 見積: 20 万

## Notes

- `*`マークのタスクはオプションで、MVP を早く作成するためにスキップ可能です
- 各タスクは具体的な要件番号を参照してトレーサビリティを確保
- チェックポイントで段階的な検証を実施
- プロパティテストは汎用的な正確性プロパティを検証
- ユニットテストは具体例とエッジケースを検証
