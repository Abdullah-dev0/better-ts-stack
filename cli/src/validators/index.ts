// Validation utilities for user inputs

import { z } from 'zod';
import * as fs from 'fs-extra';
import * as path from 'path';
// Validates project name: lowercase, numbers, hyphens, or "." for current dir
export const projectNameSchema = z
  .string()
  .min(1, 'Project name is required')
  .refine(
    (name) => name === '.' || /^[a-z0-9-]+$/.test(name),
    'Project name must be "." for current directory, or lowercase with only letters, numbers, and hyphens'
  )
  .refine(
    (name) => name === '.' || (!name.startsWith('-') && !name.endsWith('-')),
    'Project name cannot start or end with a hyphen'
  )
  .refine(
    (name) => name === '.' || name.length <= 214,
    'Project name must be 214 characters or less (npm package name limit)'
  );

// Checks if a project name follows npm naming conventions
export function validateProjectName(name: string): string | undefined {
  const result = projectNameSchema.safeParse(name);

  if (result.success) {
    return undefined;
  }

  // Return the first error message
  const firstError = result.error.errors[0];
  return firstError.message;
}

// Ensures a directory is empty or does not exist before starting build
export async function validateDirectoryEmpty(dirPath: string): Promise<null | string> {
  try {
    // Check if directory exists
    const exists = await fs.pathExists(dirPath);

    if (!exists) return null;

    // Directory exists - check if it's empty
    const stats = await fs.stat(dirPath);

    if (!stats.isDirectory()) {
      return `Path "${dirPath}" exists but is not a directory`;
    }

    const files = await fs.readdir(dirPath);

    if (files.length === 0) return null;

    return `Directory "${path.basename(dirPath)}" already exists and is not empty`;
  } catch (error) {
    if (error instanceof Error) {
      return `Error checking directory: ${error.message}`;
    }
    return 'Error checking directory';
  }
}
