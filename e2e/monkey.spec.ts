import { test, expect } from "@playwright/test";
import { Ollama } from "ollama";
import * as fs from "fs";
import * as path from "path";

test.describe("monkey test", () => {
  test("should perform exploratory testing with AI", async ({ page }) => {
    // タイムアウトを30分に設定
    test.setTimeout(30 * 60 * 1000);

    const ollamaHost = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
    const ollamaModel = process.env.OLLAMA_MODEL || "llama3.2";
    
    console.log(`Using Ollama at ${ollamaHost} with model ${ollamaModel}`);
    const ollama = new Ollama({ host: ollamaHost });

    // アクションログとエラー情報を保存する配列
    const actionLog: any[] = [];
    const issuesFound: any[] = [];
    const pagesVisited = new Set<string>();

    let actionCount = 0;
    const MAX_ACTIONS = 50;

    // --- コンソールエラーの監視 ---
    page.on("pageerror", (error) => {
      issuesFound.push({
        severity: "critical",
        description: `Page Error: ${error.message}`,
        url: page.url(),
      });
    });

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        issuesFound.push({
          severity: "warning",
          description: `Console Error: ${msg.text()}`,
          url: page.url(),
        });
      }
    });

    // --- ツール定義 ---
    const clickElement = async (selector: string) => {
      actionLog.push({ action: "click", selector, time: new Date().toISOString() });
      try {
        await page.click(selector, { timeout: 5000 });
        await page.waitForLoadState("networkidle");
        return `Clicked element: ${selector}`;
      } catch (e: any) {
        return `Failed to click ${selector}: ${e.message}`;
      }
    };

    const fillInput = async (selector: string, text: string) => {
      actionLog.push({ action: "fill", selector, text, time: new Date().toISOString() });
      try {
        await page.fill(selector, text, { timeout: 5000 });
        return `Filled ${selector} with text: ${text}`;
      } catch (e: any) {
        return `Failed to fill ${selector}: ${e.message}`;
      }
    };

    const getPageContent = async () => {
      actionLog.push({ action: "get_content", time: new Date().toISOString() });
      try {
        // ページ上のすべてのクリック可能要素やテキストを抽出する簡易的なスナップショット
        const snapshot = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll("button, a, input, [role='button'], h1, h2, h3, p"));
          return elements.map((el) => {
            const tagName = el.tagName.toLowerCase();
            const id = el.id ? `#${el.id}` : "";
            const className = el.className ? `.${el.className.split(" ").join(".")}` : "";
            const text = (el.textContent || "").trim().substring(0, 50);
            return `<${tagName}${id}${className}>: ${text}`;
          }).join("\n");
        });
        return `Current URL: ${page.url()}\nPage Snapshot:\n${snapshot}`;
      } catch (e: any) {
        return `Failed to get content: ${e.message}`;
      }
    };

    const takeScreenshot = async (description: string) => {
      const timestamp = new Date().getTime();
      const filename = `screenshot_${timestamp}.png`;
      const reportDir = path.join(process.cwd(), "e2e", "reports");
      if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
      
      const filepath = path.join(reportDir, filename);
      await page.screenshot({ path: filepath });
      
      actionLog.push({ action: "screenshot", description, file: filename, time: new Date().toISOString() });
      issuesFound.push({
        severity: "info",
        description: `Screenshot taken: ${description}`,
        url: page.url(),
        screenshot_ref: filename,
      });
      return `Screenshot saved as ${filename}`;
    };

    // ツールリストの定義（Ollama向け）
    const tools = [
      {
        type: "function",
        function: {
          name: "clickElement",
          description: "Click an element on the page using a CSS selector or Playwright text selector (e.g. 'button:has-text(\"Submit\")')",
          parameters: {
            type: "object",
            properties: {
              selector: { type: "string", description: "The selector of the element to click" },
            },
            required: ["selector"],
          },
        }
      },
      {
        type: "function",
        function: {
          name: "fillInput",
          description: "Fill an input field on the page",
          parameters: {
            type: "object",
            properties: {
              selector: { type: "string", description: "The selector of the input element" },
              text: { type: "string", description: "The text to input" },
            },
            required: ["selector", "text"],
          },
        }
      },
      {
        type: "function",
        function: {
          name: "getPageContent",
          description: "Get a snapshot of the interactive elements and text currently visible on the page",
          parameters: {
            type: "object",
            properties: {},
          },
        }
      },
      {
        type: "function",
        function: {
          name: "takeScreenshot",
          description: "Take a screenshot to document a potential bug, visual glitch, or interesting state",
          parameters: {
            type: "object",
            properties: {
              description: { type: "string", description: "Reason for taking the screenshot" },
            },
            required: ["description"],
          },
        }
      },
      {
        type: "function",
        function: {
          name: "finishTest",
          description: "Call this when the exploratory testing is complete or if max turns is reached",
          parameters: {
            type: "object",
            properties: {
              summary: { type: "string", description: "A summary of the testing session" },
            },
            required: ["summary"],
          },
        }
      }
    ];

    // --- メインテストループ ---
    const SYSTEM_PROMPT = `
あなたはWebアプリケーションの探索的テスター（モンキーテスター）です。
目的: UIを自律的に操作し、バグや壊れた表示を見つけること。

手順:
1. 必ず最初に getPageContent ツールを呼び出して画面の要素を把握してください。
2. 見つけた要素（StockCardのボタンなど）を clickElement ツールでクリックしてください。
3. クリックした後、再度 getPageContent ツールを使って画面に変化があったか（モーダルが開いたか等）を確認してください。
4. バグらしき挙動（空白画面、NaNの表示など）を見つけたら takeScreenshot を使ってください。
5. 最大50アクションまで実行可能です。探索が終わったら finishTest を呼び出してください。

注意:
- アプリケーションは株価監視ダッシュボードです。
- テスト対象は localhost:3000 のみです。
`;

    // 最初のアクセス
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    pagesVisited.add(page.url());

    let messages: any[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: "テストを開始してください。まず画面情報を取得してください。" }
    ];

    // --- リトライロジック ---
    const MAX_RETRIES = 3;
    async function sendWithRetry(msgList: any[]) {
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          return await ollama.chat({
            model: ollamaModel,
            messages: msgList,
            tools: tools as any,
          });
        } catch (e: any) {
          const isRateLimit = e?.message?.includes("429") || e?.message?.includes("RESOURCE_EXHAUSTED") || e?.status === 429;
          const isConnectionError = e?.message?.includes("fetch failed") || e?.message?.includes("ECONNREFUSED");
          if ((isRateLimit || isConnectionError) && attempt < MAX_RETRIES) {
            const waitSeconds = Math.pow(2, attempt + 1) * 2;
            console.log(`Connection or rate limit issue. Waiting ${waitSeconds}s before retry (attempt ${attempt + 1}/${MAX_RETRIES})...`);
            await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000));
            continue;
          }
          throw e;
        }
      }
      throw new Error("Max retries exceeded");
    }

    let isFinished = false;
    let finalSummary = "";

    while (!isFinished && actionCount < MAX_ACTIONS) {
      actionCount++;
      pagesVisited.add(page.url());

      let response;
      try {
        response = await sendWithRetry(messages);
      } catch (err: any) {
        console.error("Failed to communicate with Ollama:", err);
        break;
      }

      // 履歴に追加
      messages.push(response.message);

      if (!response.message.tool_calls || response.message.tool_calls.length === 0) {
        messages.push({
          role: "user",
          content: "テキストではなく、ツール（getPageContent, clickElementなど）を呼び出して探索を続けてください。終了する場合は finishTest を呼んでください。"
        });
        continue;
      }

      for (const call of response.message.tool_calls) {
        const name = call.function.name;
        const args = call.function.arguments;
        let toolResult = "";

        if (name === "clickElement") {
          toolResult = await clickElement(args.selector as string);
        } else if (name === "fillInput") {
          toolResult = await fillInput(args.selector as string, args.text as string);
        } else if (name === "getPageContent") {
          toolResult = await getPageContent();
        } else if (name === "takeScreenshot") {
          toolResult = await takeScreenshot(args.description as string);
        } else if (name === "finishTest") {
          isFinished = true;
          finalSummary = args.summary as string;
          toolResult = "Testing finished.";
        }

        messages.push({
          role: "tool",
          content: toolResult
        });
      }
      
      if (isFinished) {
        break;
      }
    }

    if (!isFinished) {
      finalSummary = "Reached maximum action limit (50 turns).";
    }

    // --- レポートの出力 ---
    const reportDir = path.join(process.cwd(), "test-results");
    if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
    
    const timestamp = new Date().getTime();
    const dateStr = new Date().toISOString().replace(/[:.]/g, "-").split("T").join("_");
    const reportPath = path.join(reportDir, `monkey_report_${dateStr}.md`);

    const issuesMarkdown = issuesFound.length === 0 
      ? "問題は見つかりませんでした。" 
      : issuesFound.map(i => `- **[${i.severity.toUpperCase()}]** ${i.description}\n  - URL: ${i.url}${i.screenshot_ref ? `\n  - Screenshot: ${i.screenshot_ref}` : ""}`).join("\n");

    const actionLogMarkdown = actionLog.map((log, i) => {
      const time = new Date(log.time).toLocaleTimeString();
      let detail = "";
      if (log.action === "click") detail = `要素をクリック: \`${log.selector}\``;
      else if (log.action === "fill") detail = `入力: \`${log.selector}\` に 「${log.text}」 を入力`;
      else if (log.action === "get_content") detail = `画面情報の取得`;
      else if (log.action === "screenshot") detail = `スクリーンショット撮影: ${log.description} (ファイル: ${log.file})`;
      return `${i + 1}. [${time}] **${log.action.toUpperCase()}** - ${detail}`;
    }).join("\n");

    const mdContent = `# モンキーテスト 詳細レポート

## テスト概要
- **実行日時**: ${new Date().toLocaleString()}
- **総アクション数**: ${actionCount} アクション
- **訪問したページ数**: ${Array.from(pagesVisited).length}
- **AIによるサマリー**:
  > ${finalSummary}

## 発見された問題点
${issuesMarkdown}

## 実行ログ（タイムライン）
AIが実行した探索アクションの詳細な履歴です。

${actionLogMarkdown}
`;

    fs.writeFileSync(reportPath, mdContent, "utf-8");

    console.log(`Monkey test report saved to: ${reportPath}`);

    // 重大なエラー（critical）があった場合はテストを失敗させる
    const criticalIssues = issuesFound.filter(i => i.severity === "critical");
    if (criticalIssues.length > 0) {
      console.log(`Found ${criticalIssues.length} critical issues.`);
      // CIやテストランナーでエラーとして扱う
      expect(criticalIssues.length).toBe(0);
    }
  });
});
