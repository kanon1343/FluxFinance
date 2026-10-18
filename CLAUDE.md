# FluxFinance

Next.js (App Router) の金融ダッシュボード。Yahoo Finance (`yahoo-finance2`) から市場データを取得し、SWR + Recharts で表示する。

## 言語

- ユーザーへの返答・Issue・ドキュメント・コミットメッセージは**日本語**。

## コマンド（パッケージ管理は必ず pnpm）

| 目的 | コマンド |
|---|---|
| 型チェック | `pnpm typecheck` |
| Lint | `pnpm lint`（自動修正: `pnpm lint:fix`） |
| ユニットテスト | `pnpm test --reporter=dot`（単体: `pnpm test src/lib/utils.test.ts`） |
| E2E | `pnpm test:e2e`（dev サーバーを自動起動。重いので必要時のみ） |
| 探索的テスト | `/monkey-test` skill（Claude 自身が Playwright でアプリを操作する。明示的に頼まれた時のみ） |

- ファイル編集後は hook が Biome（format + lint）を自動実行する。手動で format を走らせる必要はない。hook がエラーを返したらその場で直す。
- ESLint / Prettier は使わない。

## 構成

- `src/app/` ページと API Route（`api/market`, `api/history`）
- `src/components/` UI コンポーネント（テストは同階層の `*.test.tsx`）
- `src/hooks/` SWR ベースのデータ取得フック
- `src/lib/` fetcher・ユーティリティ・Server Actions
- `src/types/`, `src/constants/` 型と定数
- `e2e/` Playwright テスト
- `.kiro/specs/flux-finance/` 要件・設計・タスク一覧（`tasks.md`）
- import エイリアス: `@/` → `src/`

## 絶対に守るルール

- `any`、`@ts-ignore` / `@ts-nocheck` 禁止。型定義を省略しない
- Server Component 優先。不要な `'use client'` を付けない
- `pages/`、`getServerSideProps` / `getStaticProps`、クラスコンポーネント禁止
- 未使用の import/変数、デバッグ用 `console.log`、ハードコードした機密情報を残さない
- セマンティックな HTML とアクセシビリティを優先する
- 新しいコア依存関係や環境設定を追加したら `README.md` を更新する
- 詳細な規約は `nextjs-guidelines` skill を参照する（全部を読み込まない）

## セキュリティ（DevContainer 内で作業する前提）

- 依存関係（`package.json`、`pnpm-workspace.yaml`）を変更したら、追加・削除したパッケージとその理由を報告に必ず明記する。
- `.git/hooks`、`.git/config`、`.devcontainer/`、`.claude/settings.json`、`.claude/hooks/` は読み取り専用。変更が必要なら差分をユーザーに提示し、Mac 側で適用してもらう。
- 外向き通信は許可リスト方式（`.devcontainer/init-firewall.sh`）。接続が拒否されたら回避策を探さず、必要な送信先をユーザーに伝える。
- 秘密情報（トークン・API キー）をファイルやコミットに書かない。

## コミット形式

`<type>: <subject> (タスクX.Y)` — type は feat/fix/refactor/test/docs/style/perf/build/ci/chore。subject は日本語で50文字以内、動詞で始め、句読点を付けない。本文には変更点を箇条書きにする。

## 作業の進め方（コストと精度）

- 1タスク = 1セッション。終わったら `/clear` を促す。
- 探索は必要な範囲に絞る。ファイルパスが分かっているなら直接読む。広い探索は `Explore` サブエージェント（Haiku）に任せる。
- テスト・lint・型チェックの実行と失敗の要約は `test-runner` サブエージェント（Haiku）に任せ、メインのコンテキストにログを流さない。
- 機能を実装し終えたら `code-reviewer` サブエージェントでレビューし、指摘を直してから完了にする（小さな修正では省略してよい）。
- 1〜2ファイルで済む作業ならサブエージェントを使わず直接やる（起動コストの方が高い）。
- `.kiro/specs` のタスクを実装する時は `implement-task` skill の手順に従う。
- 数分以上かかるコマンド（install・build・E2E）は、出力をログファイルに直接書き出してバックグラウンドで実行し、Monitor で成功・失敗・停滞（ログが3分増えない）を検知する。`| grep | tail` を挟むと終わるまで状況が見えなくなるので使わない。止まったら原因を調べてから対処し、再発防止策を設定ファイルや CLAUDE.md に残す。

## Compact instructions

compact するときは「変更したファイルと変更内容」「未解決のテスト失敗やレビュー指摘」「現在のタスク番号と残作業」を優先して残す。探索中に読んだだけのファイル内容は捨ててよい。
