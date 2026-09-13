/** Generate every supported combination; optionally install and check one case. */
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { build } = require("../apps/cli/dist/builder");

async function main() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "better-ts-stack-"));
  const cases = [];
  for (const framework of ["express", "nextjs", "tanstack"]) {
    for (const database of ["none", "prisma", "drizzle", "mongoose"]) {
      for (const useAuth of [false, true]) {
        if (
          (framework === "nextjs" || framework === "tanstack") &&
          database === "none" &&
          useAuth
        )
          continue;
        for (const packageManager of ["npm", "pnpm", "bun"]) {
          for (const useDocker of [false, true]) {
            const name = `${framework}-${database}-${useAuth ? "auth" : "plain"}-${packageManager}-${useDocker ? "docker" : "local"}`;
            const target = path.join(root, name);
            const config = {
              projectName: name,
              framework,
              applicationType:
                framework === "express" ? "backend" : "fullstack",
              database,
              orm: database,
              databaseType:
                database === "none"
                  ? "none"
                  : database === "mongoose"
                    ? "mongodb"
                    : "postgresql",
              useAuth,
              useDocker,
              packageManager,
              initGit: false,
              installDeps: false,
            };
            await build(config, target);
            const files = await fs.readdir(target, { recursive: true });
            assert(!files.some((file) => file.endsWith(".hbs")), name);
            assert(files.includes(".gitignore"), name);
            const manifest = JSON.parse(
              await fs.readFile(path.join(target, "package.json"))
            );
            for (const version of Object.values({
              ...manifest.dependencies,
              ...manifest.devDependencies,
            })) {
              assert(/^\^?\d+\.\d+\.\d+$/.test(version), `${name}: ${version}`);
            }
            assert(!JSON.stringify(manifest.scripts).includes("{{"), name);
            if (framework === "express")
              assert.equal(
                manifest.scripts.start,
                `${packageManager === "bun" ? "bun" : "node"} dist/index.js`
              );
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
