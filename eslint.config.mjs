import eslint from "@eslint/js";
import tsEslint, { config } from "typescript-eslint";

export default config(
  { ignores: ["dist"] },
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  ...tsEslint.configs.stylistic,
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
