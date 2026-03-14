import createNodeConfig from "@better-ts-stack/eslint-config/node";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  {
    ignores: ["dist", "node_modules", "templates/**/*", "bin/**/*"],
  },
  ...createNodeConfig(__dirname)
);
