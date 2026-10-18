# インストール済みの @playwright/test（pnpm exec playwright --version）に合わせる。
# ずれると postCreate でブラウザを毎回ダウンロードし直すことになる
FROM mcr.microsoft.com/playwright:v1.60.0-noble

# jq: Claude Code の hook (.claude/hooks/biome-check.sh) が使う
# sudo / iptables / ipset / dnsutils / aggregate: ファイアウォール（init-firewall.sh）用
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    jq git sudo iptables ipset dnsutils aggregate \
  && rm -rf /var/lib/apt/lists/*

# ファイアウォールスクリプトは root 所有で配置し、pwuser には「このスクリプトの実行」だけを sudo で許可する。
# （Claude Code feature が /usr/local/bin/init-firewall.sh を上書きするので別名にする）
COPY --chmod=0755 init-firewall.sh /usr/local/bin/fluxfinance-firewall.sh
RUN echo "pwuser ALL=(root) NOPASSWD: /usr/local/bin/fluxfinance-firewall.sh" > /etc/sudoers.d/pwuser-firewall \
  && chmod 0440 /etc/sudoers.d/pwuser-firewall

# Claude Code の managed settings（最優先・pwuser からは変更不可）
# 権限確認を省略するモードの禁止と、Mac 側で実行されうるファイルの編集禁止
# （COPY --chmod は自動作成される親ディレクトリにも同じ権限を付けて辿れなくなるので、権限は RUN で付ける）
COPY managed-settings.json /etc/claude-code/managed-settings.json
RUN chmod 0755 /etc/claude-code && chmod 0644 /etc/claude-code/managed-settings.json

# Claude Code の設定・認証を永続化する volume のマウント先を、非 root ユーザーの所有で作っておく
RUN mkdir -p /home/pwuser/.claude && chown -R pwuser:pwuser /home/pwuser/.claude
