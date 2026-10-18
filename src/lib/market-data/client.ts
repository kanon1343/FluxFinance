import "server-only";

import YahooFinance from "yahoo-finance2";

/** サーバー側で共有する yahoo-finance2 のインスタンス（cookie・crumb を使い回す） */
export const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});
