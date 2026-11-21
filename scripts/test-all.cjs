/** Run every slow check on the sampled matrix, start to finish: `npm run test:all`. */
// The same checks pull requests run, in one command. Needs Docker running
// (SKIP_DOCKER=1 skips those steps) and pnpm and bun installed for the
// monorepos. Pass --full to run every combination instead of the sample.
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const FRAMEWORKS = ["express", "nestjs", "nextjs", "tanstack"];
const skipDocker = process.env.SKIP_DOCKER === "1";
if (process.argv.includes("--full")) process.env.FULL_MATRIX = "1";

function run(command) {
  return spawnSync(command, { stdio: "inherit", shell: true }).status === 0;
}

if (!skipDocker && spawnSync("docker", ["info"], { stdio: "ignore" }).status) {
  console.error(
    "Docker is not running. Start it, or run with SKIP_DOCKER=1 to skip the image checks.",
  );
  process.exit(1);
}

// A short, new folder: pnpm cases fail on Windows' path limit under a long one
const matrixRoot = path.join(os.tmpdir(), `bts-${Date.now()}`);
const matrixFile = path.join(matrixRoot, "matrix.json");
const steps = [["generate", `npm run test:templates -- "${matrixRoot}"`]];
for (const framework of FRAMEWORKS) {
  steps.push([
    `${framework}: install, build, type-check, lint`,
    `node scripts/check-matrix.cjs "${matrixFile}" ${framework}`,
  ]);
  steps.push([
    `${framework}: start and check HTTP`,
    `node scripts/smoke-matrix.cjs "${matrixFile}" ${framework}`,
  ]);
  if (!skipDocker)
    steps.push([
      `${framework}: Docker images`,
      `node scripts/docker-matrix.cjs "${matrixFile}" ${framework}`,
    ]);
}
steps.push(["monorepos", `node scripts/check-monorepo.cjs "${matrixFile}"`]);

const results = [];
for (const [index, [name, command]] of steps.entries()) {
  console.log(`\n=== [${index + 1}/${steps.length}] ${name}`);
  const started = Date.now();
  const ok = run(command);
  const minutes = ((Date.now() - started) / 60000).toFixed(1);
  results.push({ name, ok, minutes });
  // Nothing else can run without the generated projects
  if (!ok && index === 0) break;
}

console.log("\n=== Summary");
for (const { name, ok, minutes } of results)
  console.log(`${ok ? "ok  " : "FAIL"} ${name} (${minutes} min)`);
const failed = results.some((result) => !result.ok);
if (failed) console.log(`\nLogs and projects are in ${matrixRoot}`);
else {
  fs.rmSync(matrixRoot, { recursive: true, force: true });
}
process.exitCode = failed ? 1 : 0;
