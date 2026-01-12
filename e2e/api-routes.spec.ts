import { expect, test } from "@playwright/test";

test.describe("API Routes E2E Tests", () => {
  test.describe("Market API (/api/market)", () => {
    test("should return market data with correct structure", async ({
      request,
    }) => {
      const response = await request.get("/api/market");

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const data = await response.json();

      // Verify response structure
      expect(data).toHaveProperty("data");
      expect(data).toHaveProperty("lastUpdate");
      expect(Array.isArray(data.data)).toBeTruthy();

      // Verify lastUpdate is valid ISO date
      expect(new Date(data.lastUpdate).toISOString()).toBe(data.lastUpdate);
    });

    test("should return data for default tickers", async ({ request }) => {
      const response = await request.get("/api/market");
      const data = await response.json();

      // Should have 4 default tickers
      expect(data.data.length).toBe(4);

      // Verify each stock data has required fields
      for (const stock of data.data) {
        expect(stock).toHaveProperty("ticker");
        expect(stock).toHaveProperty("currentPrice");
        expect(stock).toHaveProperty("previousClose");
        expect(stock).toHaveProperty("change");
        expect(stock).toHaveProperty("changePercent");
        expect(stock).toHaveProperty("currency");

        // Verify types
        expect(typeof stock.ticker).toBe("string");
        expect(typeof stock.currentPrice).toBe("number");
        expect(typeof stock.previousClose).toBe("number");
        expect(typeof stock.change).toBe("number");
        expect(typeof stock.changePercent).toBe("number");
        expect(typeof stock.currency).toBe("string");
      }
    });

    test("should accept custom tickers parameter", async ({ request }) => {
      const response = await request.get("/api/market?tickers=AAPL,MSFT");
      const data = await response.json();

      expect(data.data.length).toBe(2);
      expect(data.data.map((s: { ticker: string }) => s.ticker)).toContain(
        "AAPL"
      );
      expect(data.data.map((s: { ticker: string }) => s.ticker)).toContain(
        "MSFT"
      );
    });

    test("should have correct cache headers", async ({ request }) => {
      const response = await request.get("/api/market");

      const cacheControl = response.headers()["cache-control"];
      expect(cacheControl).toContain("public");
      expect(cacheControl).toContain("s-maxage=30");
    });
  });

  test.describe("History API (/api/history)", () => {
    test("should return historical data with correct structure", async ({
      request,
    }) => {
      const response = await request.get("/api/history?ticker=AAPL&range=1M");

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const data = await response.json();

      // Verify response structure
      expect(data).toHaveProperty("ticker");
      expect(data).toHaveProperty("data");
      expect(data).toHaveProperty("range");
      expect(data.ticker).toBe("AAPL");
      expect(data.range).toBe("1M");
      expect(Array.isArray(data.data)).toBeTruthy();
    });

    test("should return chart data points with OHLCV structure", async ({
      request,
    }) => {
      const response = await request.get("/api/history?ticker=AAPL&range=1M");
      const data = await response.json();

      // Should have data points
      expect(data.data.length).toBeGreaterThan(0);

      // Verify each data point has OHLCV fields
      for (const point of data.data) {
        expect(point).toHaveProperty("timestamp");
        expect(point).toHaveProperty("open");
        expect(point).toHaveProperty("high");
        expect(point).toHaveProperty("low");
        expect(point).toHaveProperty("close");
        expect(point).toHaveProperty("volume");

        // Verify types
        expect(typeof point.timestamp).toBe("number");
        expect(typeof point.open).toBe("number");
        expect(typeof point.high).toBe("number");
        expect(typeof point.low).toBe("number");
        expect(typeof point.close).toBe("number");
        expect(typeof point.volume).toBe("number");
      }
    });

    test("should return 400 when ticker is missing", async ({ request }) => {
      const response = await request.get("/api/history?range=1M");

      expect(response.status()).toBe(400);

      const data = await response.json();
      expect(data).toHaveProperty("error");
      expect(data.error).toContain("Ticker parameter is required");
    });

    test("should return 400 for invalid range", async ({ request }) => {
      const response = await request.get(
        "/api/history?ticker=AAPL&range=invalid"
      );

      expect(response.status()).toBe(400);

      const data = await response.json();
      expect(data).toHaveProperty("error");
      expect(data.error).toContain("Invalid range");
    });

    test("should support all valid time ranges", async ({ request }) => {
      const validRanges = ["1D", "1W", "1M", "3M"];

      for (const range of validRanges) {
        const response = await request.get(
          `/api/history?ticker=AAPL&range=${range}`
        );
        expect(response.ok()).toBeTruthy();

        const data = await response.json();
        expect(data.range).toBe(range);
      }
    });

    test("should have correct cache headers based on range", async ({
      request,
    }) => {
      // 1D should have shorter cache
      const response1D = await request.get("/api/history?ticker=AAPL&range=1D");
      const cacheControl1D = response1D.headers()["cache-control"];
      expect(cacheControl1D).toContain("s-maxage=300");

      // 1M should have longer cache
      const response1M = await request.get("/api/history?ticker=AAPL&range=1M");
      const cacheControl1M = response1M.headers()["cache-control"];
      expect(cacheControl1M).toContain("s-maxage=3600");
    });

    test("should return data sorted by timestamp ascending", async ({
      request,
    }) => {
      const response = await request.get("/api/history?ticker=AAPL&range=1M");
      const data = await response.json();

      // Verify data is sorted by timestamp
      for (let i = 1; i < data.data.length; i++) {
        expect(data.data[i].timestamp).toBeGreaterThanOrEqual(
          data.data[i - 1].timestamp
        );
      }
    });
  });
});
