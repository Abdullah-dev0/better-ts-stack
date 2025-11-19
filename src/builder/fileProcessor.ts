/**
 * File processing utilities for copying and processing module files
 */

import fs from 'fs-extra';
import path from 'path';
import Handlebars from 'handlebars';
import { createBuildError } from '../types';
import { TemplateContext } from './templateContext';

/**
 * Copy files from a module directory to the target directory
 * @param moduleDir - Source module directory path
 * @param targetDir - Destination directory path
 */
export async function copyModuleFiles(moduleDir: string, targetDir: string): Promise<void> {
  try {
    // Ensure target directory exists
    await fs.ensureDir(targetDir);

    // Copy all files from module to target
    await fs.copy(moduleDir, targetDir, {
      overwrite: true,
      filter: (src: string) => {
        // Skip config.json files
        const basename = path.basename(src);
        return basename !== 'config.json';
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw createBuildError(
      `Failed to copy module files from ${moduleDir}: ${errorMessage}`,
      'FILE_COPY_ERROR'
    );
  }
}

/**
 * Compile and render a Handlebars template with the provided context
 *
 * @param content - Template content string with Handlebars syntax
 * @param context - Template context containing variables and helpers
 * @returns Rendered template string with all variables replaced
 * @throws {BuildError} If template compilation fails due to syntax errors
 */
export function compileTemplate(content: string, context: TemplateContext): string {
  try {
    // Register helper functions with Handlebars
    Handlebars.registerHelper('lowercase', context.helpers.lowercase);
    Handlebars.registerHelper('uppercase', context.helpers.uppercase);
    Handlebars.registerHelper('kebabCase', context.helpers.kebabCase);

    // Compile the template
    const template = Handlebars.compile(content);

    // Render with context
    return template(context);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw createBuildError(
      `Failed to compile Handlebars template: ${errorMessage}`,
      'TEMPLATE_SYNTAX_ERROR'
    );
  }
}

/**
 * Process template files with Handlebars variable replacement
 * Processes .hbs files by replacing variables and removing .hbs extension
 *
 * @param targetDir - Directory containing template files
 * @param context - Template context with variables for replacement
 * @param templateFiles - Array of template file paths relative to targetDir
 */
export async function processTemplateFiles(
  targetDir: string,
  context: TemplateContext,
  templateFiles: string[]
): Promise<void> {
  for (const templateFile of templateFiles) {
    await processTemplateFile(path.join(targetDir, templateFile), context);
  }
}

/**
 * Process a single template file with Handlebars variable replacement
 *
 * Reads a .hbs template file, compiles it with Handlebars, renders it with the provided
 * context, and writes the output. If the file has a .hbs extension, it is removed from
 * the output filename and the original .hbs file is deleted.
 *
 * @param filePath - Absolute path to the template file
 * @param context - Template context with variables for replacement
 * @throws {BuildError} If file reading, template compilation, or writing fails
 */
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
    const content = await fs.readFile(filePath, 'utf-8');

    // Compile and render template with Handlebars
    const rendered = compileTemplate(content, context);

    // Determine output path (remove .hbs extension if present)
    const outputPath = filePath.endsWith('.hbs') ? filePath.slice(0, -4) : filePath;

    // Write processed content
    await fs.writeFile(outputPath, rendered, 'utf-8');

    // Remove original .hbs file if it was renamed
    if (outputPath !== filePath) {
      await fs.remove(filePath);
    }
  } catch (error) {
    // Re-throw BuildErrors as-is
    if (error && typeof error === 'object' && 'code' in error) {
      throw error;
    }

    // Wrap other errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw createBuildError(
      `Failed to process template file ${filePath}: ${errorMessage}`,
      'TEMPLATE_WRITE_ERROR'
    );
  }
}
