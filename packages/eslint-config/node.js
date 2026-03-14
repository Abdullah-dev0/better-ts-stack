import path from "node:path";

import base from "./base.js";

/**
 * Node.js / CLI ESLint config. Pass the config directory (e.g. __dirname of the consuming app).
 * Expects tsconfig.eslint.json in that directory.
 * @param {string} configDir - Absolute path to the consuming package root
 * @returns {import('typescript-eslint').ConfigWithExtends}
 */
export default function createNodeConfig(configDir) {
  return [
    ...base,
    {
      languageOptions: {
        parserOptions: {
          project: path.join(configDir, "tsconfig.eslint.json"),
          tsconfigRootDir: configDir,
        },
      },
    },
  ];
}
