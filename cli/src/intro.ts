// Better TS Stack - Interactive CLI Intro
import readline from "readline";

export async function showInteractiveIntro() {
  console.clear();
  console.log(
    "\n  ════════════════════════════════════════════════════════════"
  );
  console.log(
    "  ║                                                           ║"
  );
  console.log(
    "  ║              Better TS Stack                              ║"
  );
  console.log(
    "  ║                                                           ║"
  );
  console.log(
    "  ════════════════════════════════════════════════════════════\n"
  );
  console.log(
    "  Build powerful TypeScript projects with enterprise-grade tooling\n"
  );
  console.log("  ⚡  Lightning-fast setup with zero configuration");
  console.log("  🎯  Production-ready templates for every use case");
  console.log("  🛠️   Modern tooling: ESLint, Prettier, Vitest & more");
  console.log("  📦  Optimized builds with best practices baked in\n");

  return new Promise<void>((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("  Press Enter to continue... ", () => {
      rl.close();
      console.log();
      resolve();
    });
  });
}
