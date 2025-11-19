/**
 * Template context builder for Handlebars template processing
 * Converts ProjectConfig into a context object with all variables and helpers
 */

import { ProjectConfig } from '../types';

/**
 * Template context interface containing all variables available in Handlebars templates
 *
 * @property projectName - Name of the project being built
 * @property packageManager - Package manager choice (npm, pnpm, or bun)
 * @property database - Database selection (none, prisma, or mongoose)
 * @property port - Port number for the application (defaults to 3000)
 * @property useDocker - Whether Docker support is enabled
 * @property useAuth - Whether authentication module is enabled
 * @property helpers - Helper functions available in templates for string transformations
 */
export interface TemplateContext {
  projectName: string;
  packageManager: string;
  database: string;
  port: number;
  useDocker: boolean;
  useAuth: boolean;
  helpers: {
    lowercase: (str: string) => string;
    uppercase: (str: string) => string;
    kebabCase: (str: string) => string;
  };
}

/**
 * Convert a string to lowercase
 * @param str - Input string
 * @returns Lowercase string
 */
export function lowercase(str: string): string {
  return str.toLowerCase();
}

/**
 * Convert a string to uppercase
 * @param str - Input string
 * @returns Uppercase string
 */
export function uppercase(str: string): string {
  return str.toUpperCase();
}

/**
 * Convert a string to kebab-case
 *
 * Handles spaces, underscores, and camelCase conversions.
 * Useful for generating file names, Docker image names, and other identifiers.
 *
 * @param str - Input string to convert
 * @returns Kebab-case string (lowercase with hyphens)
 * @example
 * ```typescript
 * kebabCase('MyProject') // 'my-project'
 * kebabCase('my_project') // 'my-project'
 * kebabCase('my project') // 'my-project'
 * ```
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2') // camelCase to kebab-case
    .replace(/[\s_]+/g, '-') // spaces and underscores to hyphens
    .toLowerCase();
}

/**
 * Build template context from project configuration
 *
 * Creates a context object with all variables and helper functions for Handlebars templates.
 * This context is used to render .hbs template files during the building process.
 *
 * @param config - Project configuration containing user choices and settings
 * @returns Template context with all variables and helpers ready for Handlebars rendering
 * @example
 * ```typescript
 * const config: ProjectConfig = {
 *   projectName: 'my-app',
 *   packageManager: 'npm',
 *   database: 'prisma',
 *   useDocker: true,
 *   useAuth: false
 * };
 * const context = buildTemplateContext(config);
 * // context.projectName === 'my-app'
 * // context.helpers.kebabCase('MyApp') === 'my-app'
 * ```
 */
export function buildTemplateContext(config: ProjectConfig): TemplateContext {
  return {
    projectName: config.projectName,
    packageManager: config.packageManager,
    database: config.database,
    port: 3000, // Default port
    useDocker: config.useDocker,
    useAuth: config.useAuth,
    helpers: {
      lowercase,
      uppercase,
      kebabCase,
    },
  };
}
