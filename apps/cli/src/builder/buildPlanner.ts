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
import { GENERATED_SECRETS, mergeConfigurations } from "./configGenerator";
import { listModuleFiles } from "./fileProcessor";
import { isInsideGitRepository } from "./gitInitializer";
import { selectModules } from "./moduleSelector";
import { buildTemplateContext } from "./templateContext";

// Files the builder writes itself instead of copying them from a module
const GENERATED_FILES = ["package.json", ".env", ".env.example"];

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
  const { modules, mergedConfig } = await loadBuildInputs(config);

  // Later modules overwrite files of earlier ones, so each path is listed once
  const files = new Set(GENERATED_FILES);
  if (config.packageManager === "pnpm") files.add("pnpm-workspace.yaml");
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
