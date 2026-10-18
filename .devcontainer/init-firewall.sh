#!/bin/bash
# FluxFinance DevContainer の外向き通信を許可リスト方式に制限する。
# postStartCommand から sudo で実行する（sudoers でこのスクリプトだけを許可）。
# IP アドレスは起動時に名前解決した値で固定されるため、CDN の IP が変わって
# 繋がらなくなったら `sudo /usr/local/bin/fluxfinance-firewall.sh` を再実行する。
set -euo pipefail
IFS=$'\n\t'

ALLOWED_DOMAINS=(
  # Claude Code（https://code.claude.com/docs/en/network-config）
  api.anthropic.com
  claude.ai
  claude.com
  platform.claude.com
  downloads.claude.ai
  code.claude.com
  raw.githubusercontent.com
  # パッケージ
  registry.npmjs.org
  # アプリ本体のデータ取得元（yahoo-finance2）
  finance.yahoo.com
  query1.finance.yahoo.com
  query2.finance.yahoo.com
  fc.yahoo.com
  guce.yahoo.com
  consent.yahoo.com
)

# --- 既存ルールを初期化 ---
for t in filter nat mangle; do
  iptables -t "$t" -F
  iptables -t "$t" -X
done
ipset destroy allowed-domains 2>/dev/null || true
ipset create allowed-domains hash:net

# --- GitHub（git / gh / プラグインのマーケットプレイス） ---
gh_meta=$(curl -sf --connect-timeout 10 https://api.github.com/meta)
echo "$gh_meta" | jq -e '.web and .api and .git' >/dev/null
while read -r cidr; do
  [[ "$cidr" =~ ^[0-9]{1,3}(\.[0-9]{1,3}){3}/[0-9]{1,2}$ ]] || { echo "invalid CIDR: $cidr" >&2; exit 1; }
  ipset add -exist allowed-domains "$cidr"
done < <(echo "$gh_meta" | jq -r '(.web + .api + .git)[] | select(contains(":") | not)' | aggregate -q)

# --- 許可ドメイン ---
for domain in "${ALLOWED_DOMAINS[@]}"; do
  ips=$(dig +short A "$domain" | grep -E '^[0-9]{1,3}(\.[0-9]{1,3}){3}$' || true)
  if [ -z "$ips" ]; then
    echo "WARN: $domain を名前解決できませんでした（スキップ）" >&2
    continue
  fi
  while read -r ip; do
    ipset add -exist allowed-domains "$ip"
  done <<<"$ips"
done

# --- IPv4 ルール ---
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT DROP

iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# DNS は resolv.conf に書かれたリゾルバだけに許可（任意の DNS サーバー経由の持ち出しを防ぐ）
while read -r ns; do
  [[ "$ns" =~ ^[0-9]{1,3}(\.[0-9]{1,3}){3}$ ]] || continue
  iptables -A OUTPUT -p udp -d "$ns" --dport 53 -j ACCEPT
  iptables -A OUTPUT -p tcp -d "$ns" --dport 53 -j ACCEPT
done < <(awk '/^nameserver/ {print $2}' /etc/resolv.conf)

# 許可リスト宛ての HTTPS と、GitHub 宛ての SSH（git push 用）
iptables -A OUTPUT -p tcp --dport 443 -m set --match-set allowed-domains dst -j ACCEPT
iptables -A OUTPUT -p tcp --dport 22 -m set --match-set allowed-domains dst -j ACCEPT

# 拒否は即座に失敗させる（タイムアウト待ちで処理が止まらないように）
iptables -A OUTPUT -j REJECT --reject-with icmp-admin-prohibited

# --- IPv6 は loopback 以外すべて拒否 ---
if command -v ip6tables >/dev/null; then
  ip6tables -F
  ip6tables -P INPUT DROP
  ip6tables -P FORWARD DROP
  ip6tables -P OUTPUT DROP
  ip6tables -A INPUT -i lo -j ACCEPT
  ip6tables -A OUTPUT -o lo -j ACCEPT
fi

# --- 動作確認 ---
if curl -s --connect-timeout 5 https://example.com >/dev/null; then
  echo "ERROR: 許可していない example.com に接続できてしまいました" >&2
  exit 1
fi
curl -sf --connect-timeout 5 https://api.anthropic.com >/dev/null || [ $? -eq 22 ] \
  || { echo "ERROR: api.anthropic.com に接続できません" >&2; exit 1; }
echo "Firewall configured: $(ipset list allowed-domains | grep -cE '^[0-9]') entries allowed"
