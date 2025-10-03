import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import viteConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), viteConfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
  },
});
