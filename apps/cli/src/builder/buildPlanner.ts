// Works out what a build produces; nothing here writes to disk
import fs from "fs-extra";
import path from "node:path";

import { getModule } from "../modules/registry";
import {
  BuildPlan,
  MergedConfig,
  Module,
  ProjectConfig,
  TemplateContext,
} from "../types";
import {
  GENERATED_SECRETS,
  mergeConfigurations,
  STACK_FILE,
} from "./configGenerator";
import { listModuleFiles } from "./fileProcessor";
import { isInsideGitRepository } from "./gitInitializer";
import { selectModules } from "./moduleSelector";
import { getMonorepoApps, TURBO_VERSION } from "./monorepoApps";
import { ROUTE_TREE_FILE } from "./routeTree";
import { buildTemplateContext } from "./templateContext";

// Files the builder writes itself instead of copying them from a module
const GENERATED_FILES = [
  "package.json",
  ".env",
  ".env.example",
  "README.md",
  STACK_FILE,
];

interface BuildInputs {
  modules: Module[];
  templateContext: TemplateContext;
  mergedConfig: MergedConfig;
}

// Loads the selected modules and merges their configurations
export async function loadBuildInputs(
  config: ProjectConfig
): Promise<BuildInputs> {
  const selection = selectModules(config);
  const modules: Module[] = [];
  for (const id of [selection.base, ...selection.modules]) {
    modules.push(await getModule(id));
  }

  const templateContext = buildTemplateContext(config);
  const mergedConfig = mergeConfigurations(
    modules.map((m) => m.config),
    templateContext
  );
  Object.assign(mergedConfig.envVars, config.app?.envOverrides);

  return { modules, templateContext, mergedConfig };
}

// The target directory may not exist yet, so git is asked about the closest
// directory that does
async function findExistingDirectory(dir: string): Promise<string> {
  let current = dir;
  while (!(await fs.pathExists(current))) {
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return current;
}

// Describes the files, package.json content, environment variables, and
// commands of a build, for --dry-run
export async function planBuild(
  config: ProjectConfig,
  targetDir: string
): Promise<BuildPlan> {
  if (config.monorepo) return planMonorepo(config, targetDir);

  const { modules, mergedConfig } = await loadBuildInputs(config);

  // Later modules overwrite files of earlier ones, so each path is listed once
  const files = new Set(GENERATED_FILES);
  if (config.packageManager === "pnpm") files.add("pnpm-workspace.yaml");
  if (config.framework === "tanstack") files.add(ROUTE_TREE_FILE);
  for (const module of modules) {
    for (const file of await listModuleFiles(module.path)) files.add(file);
  }

  const envVars = Object.fromEntries(
    Object.entries(mergedConfig.envVars).map(([key, value]) => [
      key,
      GENERATED_SECRETS.includes(key) ? "<random secret>" : value,
    ])
  );

  const commands: string[] = [];
  if (config.installDeps) commands.push(`${config.packageManager} install`);
  if (
    config.initGit &&
    !isInsideGitRepository(await findExistingDirectory(targetDir))
  ) {
    commands.push("git init");
  }

  return {
    ...mergedConfig,
    envVars,
    files: [...files].sort((a, b) => a.localeCompare(b)),
    commands,
  };
}

// Both apps' plans with their folder in front of each file and variable, and
// the root files
async function planMonorepo(
  config: ProjectConfig,
  targetDir: string
): Promise<BuildPlan> {
  const plan: BuildPlan = {
    dependencies: {},
    devDependencies: { turbo: TURBO_VERSION },
    overrides: {},
    scripts: {},
    envVars: {},
    files: [
      "package.json",
      "turbo.json",
      ".gitignore",
      "README.md",
      STACK_FILE,
    ],
    commands: [],
  };
  if (config.packageManager === "pnpm") plan.files.push("pnpm-workspace.yaml");
  if (config.useCi) plan.files.push(".github/workflows/ci.yml");

  for (const app of getMonorepoApps(config)) {
    const appPlan = await planBuild(app.config, path.join(targetDir, app.dir));
    plan.files.push(...appPlan.files.map((file) => `${app.dir}/${file}`));
    Object.assign(plan.dependencies, appPlan.dependencies);
    Object.assign(plan.devDependencies, appPlan.devDependencies);
    Object.assign(plan.overrides, appPlan.overrides);
    for (const [key, value] of Object.entries(appPlan.envVars)) {
      plan.envVars[`${app.dir}/.env ${key}`] = value;
    }
  }
  for (const task of ["dev", "build", "start", "lint", "type:check"]) {
    plan.scripts[task] = `turbo run ${task}`;
  }

  if (config.installDeps)
    plan.commands.push(`${config.packageManager} install`);
  if (
    config.initGit &&
    !isInsideGitRepository(await findExistingDirectory(targetDir))
  ) {
    plan.commands.push("git init");
  }
  plan.files.sort((a, b) => a.localeCompare(b));
  return plan;
}
