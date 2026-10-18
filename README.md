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
- **E2E テスト**は DevContainer 内で実行します（`pnpm test:e2e`）。


## DevContainer での安全な開発

Claude Code を含む開発作業は DevContainer 内で行います（VS Code で **Dev Containers: Reopen in Container**）。

### コンテナに組み込まれている対策

| 対策 | 内容 |
|---|---|
| 非 root 実行 | `pwuser` で動作。`sudo` はファイアウォールスクリプトの実行だけに限定 |
| 外向き通信の制限 | `.devcontainer/init-firewall.sh` が許可リスト（Anthropic・npm・GitHub・Yahoo Finance）以外への通信を遮断。IPv6 は全遮断 |
| Mac 側で実行されうるファイルの保護 | `.git/hooks`・`.git/config`・`.devcontainer/`・`.claude/settings.json`・`.claude/hooks/` をコンテナ内では読み取り専用でマウント |
| Claude Code の権限 | `/etc/claude-code/managed-settings.json` で `--dangerously-skip-permissions` を禁止し、上記ファイルの編集も禁止 |
| サプライチェーン | pnpm は公開から7日未満のバージョンを入れない（`minimumReleaseAge`）。ビルドスクリプトは esbuild / sharp のみ許可。pnpm と devcontainer feature のバージョンは固定 |
| 秘密情報 | Mac の `~/.ssh` やクラウドの認証情報はマウントしない。Claude の認証情報はコンテナ専用 volume に保存 |

### 運用ルール

- 信頼できないリポジトリをこのコンテナ構成で開かない。
- `package.json`・`pnpm-workspace.yaml`・`pnpm-lock.yaml`・`.devcontainer/` の変更は、コミット前に必ず差分を目視で確認する。
- `.git/config` が読み取り専用なので、`git push -u` などの設定を書き込む操作や `git remote` の変更は Mac 側で行う。
- GitHub CLI を使う場合は、Mac の `~/.config/gh` をマウントせず、このリポジトリだけに権限を絞った [fine-grained token](https://github.com/settings/personal-access-tokens) をコンテナ内で `gh auth login --with-token` に渡す。
- 許可リストにない通信先が必要になったら、`.devcontainer/init-firewall.sh` の `ALLOWED_DOMAINS` に追加してコンテナを再ビルドする。CDN の IP 変更で繋がらなくなった場合は `sudo /usr/local/bin/fluxfinance-firewall.sh` を再実行する。
