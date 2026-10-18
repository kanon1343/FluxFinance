---
name: create-issue
description: プロジェクト標準のフォーマット（概要・背景・ユーザーストーリー・技術的アプローチ・受け入れ条件）で GitHub Issue を作成する。
argument-hint: "[作りたい機能やタスクの説明]"
disable-model-invocation: true
---

依頼内容: $ARGUMENTS

`.agent/skills/create-issue/SKILL.md` を読み、そこに書かれたテンプレートと手順（日本語で書く、`gh issue create` で実際に作成する）に従って Issue を作成してください。

作成する前に、タイトルと本文をユーザーに見せて確認を取ってください。
