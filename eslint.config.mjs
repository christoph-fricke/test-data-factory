import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import ts from "typescript-eslint";

export default defineConfig(
  globalIgnores(["coverage", "dist"]),
  js.configs.recommended,
  ts.configs.recommended,
  ts.configs.stylistic,
  {
    rules: {
      "@typescript-eslint/prefer-function-type": "off",
      "@typescript-eslint/no-empty-object-type": [
        "error",
        { allowInterfaces: "with-single-extends" },
      ],
    },
  },
);
