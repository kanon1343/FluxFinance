import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // server-only は Next.js のビルド時だけ意味を持つため、テストでは空モジュールに差し替える
      "server-only": path.resolve(__dirname, "./vitest.server-only.ts"),
    },
  },
});
