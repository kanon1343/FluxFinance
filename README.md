# FluxFinance

Next.js で構築された金融系ダッシュボードおよびアプリケーションです。堅牢なテスト環境と開発環境を備えています。

## 使用技術

- **フレームワーク:** [Next.js](https://nextjs.org) (App Router)
- **言語:** TypeScript
- **パッケージマネージャー:** pnpm
- **Linter & Formatter:** [Biome](https://biomejs.dev/)
- **ユニットテスト:** [Vitest](https://vitest.dev/)
- **E2E テスト:** [Playwright](https://playwright.dev/)
- **環境:** DevContainer サポート

## はじめに

### 前提条件

- Node.js (DevContainer 経由またはローカル)
- pnpm (`npm install -g pnpm`)

### インストール手順

1. 依存関係をインストールします:
   ```bash
   pnpm install
   ```

2. 開発サーバーを起動します:
   ```bash
   pnpm dev
   ```

3. ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認します。

### テスト

**ユニットテスト (Vitest):**
```bash
pnpm test
```

**E2E テスト (Playwright):**
```bash
pnpm exec playwright test
```

## 開発ワークフロー

- Linter および Formatter として **Biome** を使用しています。コミット前にコードが Biome のチェックを通過することを確認してください。
- **E2E テスト**は DevContainer 内で実行されるように設定されています。LLM 連携（ローカルの Ollama インスタンスなど）をテストする際は、ネットワーク隔離ルールが適用されます。

