// Utilities for copying files and processing Handlebars templates
import fs from "fs-extra";
import Handlebars from "handlebars";
import { readdir } from "node:fs/promises";
import path from "node:path";

import { buildError, TemplateContext } from "../types";

const TEMPLATE_EXTENSION = ".hbs";
const MODULE_CONFIG_FILE = "config.json";
// Names a template's .gitignore can be stored under, see restoreGitignore()
const GITIGNORE_TEMPLATE_NAMES = ["gitignore", ".npmignore"];

async function restoreGitignore(targetDir: string): Promise<void> {
  const templateGitignorePath = path.join(targetDir, "gitignore");
  const npmIgnorePath = path.join(targetDir, ".npmignore");
  const gitIgnorePath = path.join(targetDir, ".gitignore");

  const [hasTemplateGitignore, hasNpmIgnore, hasGitIgnore] = await Promise.all([
    fs.pathExists(templateGitignorePath),
    fs.pathExists(npmIgnorePath),
    fs.pathExists(gitIgnorePath),
  ]);

  // Prefer a plain "gitignore" template file because npm packaging preserves
  // it reliably, then fall back to ".npmignore" for already-published builds.
  if (hasTemplateGitignore && !hasGitIgnore) {
    await fs.move(templateGitignorePath, gitIgnorePath);
    return;
  }

  if (hasNpmIgnore && !hasGitIgnore) {
    await fs.move(npmIgnorePath, gitIgnorePath);
  }
}

// Copies files from a module to the destination, skipping config.json
export async function copyModuleFiles(
  moduleDir: string,
  targetDir: string
): Promise<void> {
  try {
    // Ensure target directory exists
    await fs.ensureDir(targetDir);

    // Copy all files from module to target
    await fs.copy(moduleDir, targetDir, {
      overwrite: true,
      filter: (src: string) => {
        // Skip config.json files
        const basename = path.basename(src);
        return basename !== MODULE_CONFIG_FILE;
      },
    });

    await restoreGitignore(targetDir);
  } catch (error) {
    throw buildError(
      error,
      "FILE_COPY_ERROR",
      `Failed to copy module files from ${moduleDir}`
    );
  }
}

// Lists the files a module adds to a project, under the names they end up
// with: no .hbs extension, and the gitignore template as .gitignore
export async function listModuleFiles(moduleDir: string): Promise<string[]> {
  const entries = await readdir(moduleDir, {
    recursive: true,
    withFileTypes: true,
  });

  return entries
    .filter((entry) => entry.isFile() && entry.name !== MODULE_CONFIG_FILE)
    .map((entry) => {
      const file = path
        .relative(moduleDir, path.join(entry.parentPath, entry.name))
        .split(path.sep)
        .join("/");

      if (GITIGNORE_TEMPLATE_NAMES.includes(file)) return ".gitignore";
      return file.endsWith(TEMPLATE_EXTENSION)
        ? file.slice(0, -TEMPLATE_EXTENSION.length)
        : file;
    });
}

// Compiles and renders template content with Handlebars and provided context
export function compileTemplate(
  content: string,
  context: TemplateContext
): string {
  try {
    // The output is source code, not HTML, so values are written unescaped
    const template = Handlebars.compile(content, { noEscape: true });

    return template(context, { helpers: context.helpers });
  } catch (error) {
    throw buildError(
      error,
      "TEMPLATE_SYNTAX_ERROR",
      "Failed to compile Handlebars template"
    );
  }
}

// Renders every .hbs file in the project and removes the .hbs extension
export async function processTemplateFiles(
  targetDir: string,
  context: TemplateContext
): Promise<void> {
  const files = await readdir(targetDir, { recursive: true });

  for (const file of files) {
    if (file.endsWith(TEMPLATE_EXTENSION)) {
      await processTemplateFile(path.join(targetDir, file), context);
    }
  }
}

// Renders a single .hbs file next to itself and deletes the template
async function processTemplateFile(
  filePath: string,
  context: TemplateContext
): Promise<void> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const rendered = compileTemplate(content, context);

    await fs.writeFile(
      filePath.slice(0, -TEMPLATE_EXTENSION.length),
      rendered,
      "utf-8"
    );
    await fs.remove(filePath);
  } catch (error) {
    throw buildError(
      error,
      "TEMPLATE_PROCESSING_ERROR",
      `Failed to process template file ${filePath}`
    );
  }
}
