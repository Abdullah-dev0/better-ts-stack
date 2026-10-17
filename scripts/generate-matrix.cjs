/** Generate every supported combination into [output-dir] (default: a new temp dir). */
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { build } = require("../apps/cli/dist/builder");

const BACKEND_ENTRY_FILES = {
  express: "dist/index.js",
  nestjs: "dist/main.js",
};

async function main() {
  const root = process.argv[2]
    ? path.resolve(process.argv[2])
    : await fs.mkdtemp(path.join(os.tmpdir(), "better-ts-stack-"));
  const cases = [];
  for (const framework of ["express", "nestjs", "nextjs", "tanstack"]) {
    for (const database of ["none", "prisma", "drizzle", "mongoose"]) {
      for (const useAuth of [false, true]) {
        if (
          (framework === "nextjs" || framework === "tanstack") &&
          database === "none" &&
          useAuth
        )
          continue;
        // Rate limiting is offered for the backends only
        const rateLimitChoices = BACKEND_ENTRY_FILES[framework]
          ? [false, true]
          : [false];
        for (const useRateLimit of rateLimitChoices)
          for (const packageManager of ["npm", "pnpm", "bun"]) {
            for (const useDocker of [false, true]) {
              const name = `${framework}-${database}-${useAuth ? "auth" : "plain"}${useRateLimit ? "-ratelimit" : ""}-${packageManager}-${useDocker ? "docker" : "local"}`;
              const target = path.join(root, name);
              const config = {
                projectName: name,
                framework,
                applicationType: BACKEND_ENTRY_FILES[framework]
                  ? "backend"
                  : "fullstack",
                database,
                useAuth,
                useRateLimit,
                useDocker,
                packageManager,
                initGit: false,
                installDeps: false,
              };
              await build(config, target);
              const files = await fs.readdir(target, { recursive: true });
              assert(!files.some((file) => file.endsWith(".hbs")), name);
              assert(files.includes(".gitignore"), name);
              assert(files.includes("README.md"), name);
              const manifest = JSON.parse(
                await fs.readFile(path.join(target, "package.json"))
              );
              for (const version of Object.values({
                ...manifest.dependencies,
                ...manifest.devDependencies,
              })) {
                // A caret range on an exact version; prereleases such as
                // Nitro's 3.0.x-beta are allowed
                assert(
                  /^\^?\d+\.\d+\.\d+(-[0-9A-Za-z.]+)?$/.test(version),
                  `${name}: ${version}`
                );
              }
              assert(!JSON.stringify(manifest.scripts).includes("{{"), name);
              if (BACKEND_ENTRY_FILES[framework])
                assert.equal(
                  manifest.scripts.start,
                  `cross-env NODE_ENV=production ${packageManager === "bun" ? "bun" : "node"} ${BACKEND_ENTRY_FILES[framework]}`
                );
              // pnpm 11+ ignores package.json "pnpm" and needs build approvals
              assert(!manifest.pnpm, `${name}: package.json pnpm field`);
              assert.equal(
                files.includes("pnpm-workspace.yaml"),
                packageManager === "pnpm",
                `${name}: pnpm-workspace.yaml`
              );
              // NODE_ENV comes from the scripts, so .env must not pin it
              const env = await fs.readFile(path.join(target, ".env"), "utf8");
              assert(!/^NODE_ENV=/m.test(env), `${name}: NODE_ENV in .env`);
              cases.push({ name, target, config });
            }
          }
      }
    }
  }
  const report = { root, cases };
  await fs.writeFile(
    path.join(root, "matrix.json"),
    JSON.stringify(report, null, 2)
  );
  console.log(
    `Generated and checked ${cases.length} combinations. Matrix: ${path.join(root, "matrix.json")}`
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
