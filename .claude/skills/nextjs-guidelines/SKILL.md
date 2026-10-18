---
name: nextjs-guidelines
description: FluxFinance の Next.js 16 / React 19 / TypeScript コーディング規約。コンポーネント・App Router・データ取得・API Route・テスト・パフォーマンス・セキュリティの書き方に迷った時に使う。
paths: src/**
---

# Next.js / React コーディング規約（索引）

規約の本体は `.kiro/steering/nextjs-react-guidelines-2026.md`（約680行）にあります。**全体は読まず**、下の表で該当セクションの行範囲だけを `Read`（offset / limit）で読んでください。

| トピック | 行範囲 |
|---|---|
| 技術スタック・推奨ライブラリ | 7–24 |
| プロジェクト構造 | 25–46 |
| ファイル命名規則 | 49–68 |
| コンポーネント定義 | 69–114 |
| App Router パターン | 115–153 |
| データフェッチング | 154–191 |
| フォーム処理 | 192–251 |
| スタイリング (Tailwind) | 252–293 |
| API Routes | 294–339 |
| パフォーマンス（画像・動的 import・メモ化） | 340–421 |
| テスト戦略 | 422–479 |
| セキュリティ（環境変数・認証） | 480–532 |
| エラーハンドリング | 533–578 |
| まとめ・重要ポイント | 667–680 |

## このプロジェクトでの前提（ガイドラインとの差分）

- データ取得はクライアント側が **SWR**（`src/hooks/`）。ガイドラインにある TanStack Query は使っていないので、新しく導入しない。
- Lint / format は Biome。設定は `biome.json`（ダブルクォート、セミコロンあり、行幅80）。
- ユニットテストは Vitest + Testing Library + happy-dom。テストはコンポーネントと同じ階層に `*.test.tsx` として置く。
