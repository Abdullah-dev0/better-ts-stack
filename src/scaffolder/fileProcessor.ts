/**
 * File processing utilities for copying and processing module files
 */

import fs from 'fs-extra';
import path from 'path';
import { ProjectConfig, createScaffoldError } from '../types';

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
    throw createScaffoldError(
      `Failed to copy module files from ${moduleDir}: ${errorMessage}`,
      'FILE_COPY_ERROR'
    );
  }
}

/**
 * Process template files with variable replacement
 * Processes .hbs files by replacing variables and removing .hbs extension
 * @param targetDir - Directory containing template files
 * @param config - Project configuration with variables for replacement
 * @param templateFiles - Array of template file paths relative to targetDir
 */
export async function processTemplateFiles(
  targetDir: string,
  config: ProjectConfig,
  templateFiles: string[]
): Promise<void> {
  for (const templateFile of templateFiles) {
    await processTemplateFile(path.join(targetDir, templateFile), config);
  }
}

/**
 * Process a single template file with variable replacement
 * Replaces {{variable}} patterns with values from config
 * @param filePath - Absolute path to the template file
 * @param config - Project configuration with variables for replacement
 */
export async function processTemplateFile(filePath: string, config: ProjectConfig): Promise<void> {
  try {
    // Check if file exists
    const exists = await fs.pathExists(filePath);
    if (!exists) {
      return; // Skip if file doesn't exist
    }

    // Read template file
    let content = await fs.readFile(filePath, 'utf-8');

    // Replace variables
    content = content.replace(/\{\{projectName\}\}/g, config.projectName);
    content = content.replace(/\{\{packageManager\}\}/g, config.packageManager);
    content = content.replace(/\{\{database\}\}/g, config.database);
    content = content.replace(/\{\{port\}\}/g, '3000');

    // Determine output path (remove .hbs extension if present)
    const outputPath = filePath.endsWith('.hbs') ? filePath.slice(0, -4) : filePath;

    // Write processed content
    await fs.writeFile(outputPath, content, 'utf-8');

    // Remove original .hbs file if it was renamed
    if (outputPath !== filePath) {
      await fs.remove(filePath);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw createScaffoldError(
      `Failed to process template file ${filePath}: ${errorMessage}`,
      'TEMPLATE_PROCESSING_ERROR'
    );
  }
}
