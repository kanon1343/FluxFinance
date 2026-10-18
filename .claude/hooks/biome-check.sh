#!/bin/bash
# Edit/Write の後に編集ファイルへ Biome (format + lint 自動修正) をかける。
# 自動修正できないエラーが残った場合だけ exit 2 で Claude に要約を返し、その場で直させる。
file=$(jq -r '.tool_input.file_path // empty')

case "$file" in
  *.ts | *.tsx | *.js | *.jsx | *.mjs | *.cjs | *.json | *.css) ;;
  *) exit 0 ;;
esac
[ -f "$file" ] || exit 0

cd "$CLAUDE_PROJECT_DIR" || exit 0
# DevContainer で入れた node_modules を macOS から使う場合など、Biome が起動できない環境では何もしない
pnpm exec biome --version >/dev/null 2>&1 || exit 0
output=$(pnpm exec biome check --write --no-errors-on-unmatched --colors=off "$file" 2>&1)
if [ $? -ne 0 ]; then
  echo "Biome のエラーが残っています ($file):" >&2
  echo "$output" | head -40 >&2
  exit 2
fi
exit 0
