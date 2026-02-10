// Better TS Stack - Interactive CLI Intro
import consola from "consola";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function showInteractiveIntro() {
  console.clear();

  // Subtle fade-in effect
  console.log("\n");
  await sleep(80);

  consola.log("  \x1b[36m╭─────────────────────────────────────────╮\x1b[0m");
  await sleep(50);

  consola.log(
    "  \x1b[36m│\x1b[0m                                         \x1b[36m│\x1b[0m"
  );
  await sleep(50);

  consola.log(
    "  \x1b[36m│\x1b[0m         \x1b[1m\x1b[96mBetter TS Stack\x1b[0m                 \x1b[36m│\x1b[0m"
  );
  await sleep(50);

  consola.log(
    "  \x1b[36m│\x1b[0m                                         \x1b[36m│\x1b[0m"
  );
  await sleep(50);

  consola.log("  \x1b[36m╰─────────────────────────────────────────╯\x1b[0m");

  await sleep(150);
  console.log("\n");
}
