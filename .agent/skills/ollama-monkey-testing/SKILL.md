---
name: ollama-monkey-testing
description: AI (Ollama) を用いてPlaywrightベースの自律的探索E2Eテスト（モンキーテスト）を構築・実行する手法。
---

# Ollama Monkey Testing Skill

このスキルは、ローカルLLM（Ollama）のFunction Calling機能とPlaywrightを組み合わせて、WebアプリケーションのUIを自律的に探索し、バグを検出する「モンキーテスト」を構築・実行する際の手順を提供します。

## 適用場面
- ユーザーに「AIにアプリを探索させてバグを見つけさせたい」と依頼された場合
- E2Eの探索的テスト（モンキーテスト）を構築したい場合

## 前提条件
1. **Ollama**: ローカル環境にインストール済みであり、Function Callingに対応したモデル（例: `llama3.2`, `gemma4`, `qwen2.5-coder`など）が `ollama pull` されていること。
2. **Playwright**: `@playwright/test` がインストールされていること。
3. **Ollama JS SDK**: `ollama` がインストールされていること。

## 構築手順

### 1. 依存関係のセットアップ
プロジェクトに以下のパッケージがインストールされているか確認し、無ければ追加します。
```bash
npm i -D @playwright/test ollama
```

### 2. 環境変数のセットアップ
テスト実行時に以下の環境変数を設定してOllamaに接続します。
- `OLLAMA_HOST`: `http://127.0.0.1:11434` （Dev Container内からホストマシンのOllamaに繋ぐ場合は `http://host.docker.internal:11434` を使用し、ホスト側のOllamaは `OLLAMA_HOST=0.0.0.0` で起動しておく必要があります）
- `OLLAMA_MODEL`: 使用するモデル（例: `llama3.2`, `gemma4` など）

### 3. テストスクリプトの実装
以下の基本的な構造を `e2e/monkey.spec.ts` などのファイルとして実装します。

#### クライアントの初期化
```typescript
import { test, expect } from "@playwright/test";
import { Ollama } from "ollama";

const ollama = new Ollama({ host: process.env.OLLAMA_HOST || "http://127.0.0.1:11434" });
const ollamaModel = process.env.OLLAMA_MODEL || "llama3.2";
```

#### ツール（Function Calling）の定義
AIが画面とやり取りするためのツール（`getPageContent`, `clickElement`, `fillInput`, `takeScreenshot`, `finishTest`）をOpenAI互換のJSON Schemaで定義します。
```typescript
const tools = [
  {
    type: "function",
    function: {
      name: "clickElement",
      description: "Click an element on the page using a CSS selector or Playwright text selector",
      parameters: {
        type: "object",
        properties: { selector: { type: "string" } },
        required: ["selector"],
      },
    }
  },
  // 他のツールも同様に定義
];
```

#### テストループとリトライロジック
AIの回答を受け取り、ツールを実行して結果を `role: 'tool'` で返すループを構築します。
```typescript
let messages = [
  { role: "system", content: "あなたは探索的テスターです。画面の要素を取得し、クリックしながらバグを探してください。" },
  { role: "user", content: "テストを開始してください。まず画面情報を取得してください。" }
];

while (!isFinished && actionCount < MAX_ACTIONS) {
  let response = await ollama.chat({ model: ollamaModel, messages, tools: tools as any });
  messages.push(response.message);

  if (response.message.tool_calls) {
    for (const call of response.message.tool_calls) {
      // ツールの実行ロジック
      const toolResult = await executeTool(call.function.name, call.function.arguments);
      messages.push({ role: "tool", content: toolResult });
    }
  } else {
    messages.push({ role: "user", content: "ツールを呼び出して探索を続けてください。" });
  }
}
```

### 4. レポートの出力
テスト完了後に、アクションログや発見されたエラーをMarkdown形式で保存するロジックを含めます。出力先は `test-results` などのCIでも取得しやすいディレクトリにし、日本語の詳細なタイムライン（実行ログ）をテキストベースで出力するのがベストプラクティスです。

## 注意事項
- **タイムアウト設定**: 探索テストは時間がかかるため、Playwrightのテストタイムアウトは長め（例: `30 * 60 * 1000` = 30分）に設定してください。
- **レート制限や接続エラー**: AIからのレスポンスエラー（429や接続拒否など）に対しては、指数バックオフによるリトライ処理を必ず実装してください。
- **モデルの性能**: モデルによってはFunction Callingの精度が低く、意図したツール呼び出しが行われない場合があります。その場合は `role: 'user'` のプロンプトでツール呼び出しを強く促すフォローアップを実装してください。
