/** Which matrix cases the slow checks (install, build, smoke, Docker, monorepo) run. */
// generate-matrix.cjs still generates and asserts every case, which takes
// seconds. Installing and building every case takes hours, so the slow scripts
// run a sample by default: every pair of options appears together at least once
// for local projects, every single option at least once for Docker and
// monorepos, plus one project with everything on. Set FULL_MATRIX=1 to run all
// of them, BTS_CASES=<regex> to run only the cases whose name matches, e.g.
// BTS_CASES=-auth- after changing auth.
const LOCAL = ["database", "useAuth", "useRateLimit", "ai", "payments"];
const DOCKER = [
  "database",
  "useAuth",
  "useRateLimit",
  "packageManager",
  "ai",
  "payments",
];
const MONOREPO = [
  "layout",
  "framework",
  "apiFramework",
  "owner",
  "database",
  "useAuth",
  "packageManager",
  "ai",
  "payments",
];

// Keys a case covers: each option value, or each pair of option values
function keysOf(config, dims, strength) {
  const values = dims.map((dim) => `${dim}=${config[dim]}`);
  if (strength === 1) return values;
  const pairs = [];
  for (let i = 0; i < values.length; i++)
    for (let j = i + 1; j < values.length; j++)
      pairs.push(`${values[i]}|${values[j]}`);
  return pairs;
}

// Greedy cover: take the case with the most keys not yet covered, until none is left
function cover(cases, dims, strength) {
  // The monorepo layout is a case field, not a config option
  const keys = (c) => keysOf({ ...c.config, layout: c.layout }, dims, strength);
  const uncovered = new Set(cases.flatMap(keys));
  const chosen = [];
  while (uncovered.size > 0) {
    let best;
    let bestKeys = [];
    for (const c of cases) {
      const fresh = keys(c).filter((key) => uncovered.has(key));
      if (fresh.length > bestKeys.length) {
        best = c;
        bestKeys = fresh;
      }
    }
    chosen.push(best);
    for (const key of bestKeys) uncovered.delete(key);
  }
  return chosen;
}

function featureCount({ config }) {
  return (
    Number(config.useAuth) +
    Number(config.useRateLimit) +
    Number(config.ai !== "none") +
    Number(config.payments !== "none") +
    Number(config.database !== "none")
  );
}

function markSamples(cases) {
  const groups = new Map();
  for (const c of cases) {
    const { config } = c;
    const group = config.monorepo
      ? "monorepo"
      : config.useDocker
        ? `${config.framework}|docker`
        : config.packageManager === "npm"
          ? `${config.framework}|local`
          : undefined;
    // pnpm and bun projects without Docker are generated and asserted only
    if (group) groups.set(group, [...(groups.get(group) ?? []), c]);
  }
  const byName = new Map(cases.map((c) => [c.name, c]));
  for (const [group, members] of groups) {
    const isLocal = group.endsWith("|local");
    const dims = isLocal ? LOCAL : group === "monorepo" ? MONOREPO : DOCKER;
    const chosen = cover(members, dims, isLocal ? 2 : 1);
    if (group !== "monorepo")
      chosen.push(
        members.reduce((a, b) => (featureCount(b) > featureCount(a) ? b : a)),
      );
    for (const c of chosen) {
      c.sample = true;
      // docker-matrix.cjs pushes the schema from the installed npm project
      const local = byName.get(
        c.name.replace(/-(npm|pnpm|bun)-docker$/, "-npm-local"),
      );
      if (c.config.useDocker && local) local.sample = true;
    }
  }
}

// An exact case name given on the command line always runs
function inScope(c, filter) {
  if (filter) return c.name === filter;
  if (process.env.BTS_CASES && !new RegExp(process.env.BTS_CASES).test(c.name))
    return false;
  return process.env.FULL_MATRIX === "1" || c.sample === true;
}

module.exports = { markSamples, inScope };
