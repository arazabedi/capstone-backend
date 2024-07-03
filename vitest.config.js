import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		// Remove poolOptions to re-enable multi-threading
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    coverage: {
      provider: "istanbul", // Choose 'istanbul' or 'v8'
      reporter: ["text", "html"], // Output formats: text, html, lcov, etc.
      include: ["src/**/*.{js,ts,vue}"], // Files to include in coverage
      exclude: ["node_modules", "tests"], // Files to exclude from coverage
    },
    globals: true,
    environment: "node",
    testTimeout: 550,
  },
});
