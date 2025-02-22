import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    watch: false,
    coverage: {
      include: ["dist/**", "exports/**", "src/**"],
      exclude: ["dist/**/*.d.ts"],
    },
    workspace: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          include: ["test/**/*.test.ts"],
        },
      },
    ],
  },
});
