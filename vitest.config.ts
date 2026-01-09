import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    watch: false,
    coverage: {
      include: ["dist/**", "exports/**", "src/**"],
      exclude: ["dist/**/*.d.ts"],
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          root: "src",
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          root: "test",
        },
      },
    ],
  },
});
