// Utilities for copying files and processing Handlebars templates
import fs from "fs-extra";
import Handlebars from "handlebars";
import path from "path";

import { buildError, TemplateContext } from "../types";

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
        return basename !== "config.json";
      },
    });
  } catch (error) {
    throw buildError(
      error,
      "FILE_COPY_ERROR",
      `Failed to copy module files from ${moduleDir}`
    );
  }
}

// Compiles and renders template content with Handlebars and provided context
export function compileTemplate(
  content: string,
  context: TemplateContext
): string {
  try {
    // Register helper functions with Handlebars
    Object.entries(context.helpers).forEach(([name, fn]) => {
      Handlebars.registerHelper(name, fn);
    });

    // Compile the template
    const template = Handlebars.compile(content);

    // Render with context
    return template(context);
  } catch (error) {
    throw buildError(
      error,
      "TEMPLATE_SYNTAX_ERROR",
      "Failed to compile Handlebars template"
    );
  }
}

// Processes multiple template files by replacing variables and handling extensions
export async function processTemplateFiles(
  targetDir: string,
  context: TemplateContext,
  templateFiles: string[]
): Promise<void> {
  for (const templateFile of templateFiles) {
    await processTemplateFile(path.join(targetDir, templateFile), context);
  }
}

// Processes a single template file, replaces variables, and renames/deletes .hbs files
export async function processTemplateFile(
  filePath: string,
  context: TemplateContext
): Promise<void> {
  try {
    // Check if file exists
    const exists = await fs.pathExists(filePath);
    if (!exists) {
      return; // Skip if file doesn't exist
    }

    // Read template file
    const content = await fs.readFile(filePath, "utf-8");

    // Compile and render template with Handlebars
    const rendered = compileTemplate(content, context);

    // Determine output path (remove .hbs extension if present)
    const outputPath = filePath.endsWith(".hbs")
      ? filePath.slice(0, -4)
      : filePath;

    // Write processed content
    await fs.writeFile(outputPath, rendered, "utf-8");

    // Remove original .hbs file if it was renamed
    if (outputPath !== filePath) {
      await fs.remove(filePath);
    }
  } catch (error) {
    // Re-throw BuildErrors as-is
    if (error && typeof error === "object" && "code" in error) {
      throw error;
    }

    // Wrap other errors
    throw buildError(
      error,
      "TEMPLATE_WRITE_ERROR",
      `Failed to process template file ${filePath}`
    );
  }
}
