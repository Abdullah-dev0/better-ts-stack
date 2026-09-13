import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  globalIgnores([
    "dist/**",
    ".output/**",
    "src/routeTree.gen.ts",
    ".tanstack/**",
    "public/**",
  ]),
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": "off",
    },
  },
]);

export default eslintConfig;
