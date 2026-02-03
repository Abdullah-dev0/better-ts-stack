// Better TS Stack - Interactive CLI Intro
import readline from "readline";

// ANSI color codes
const reset = "\u001b[0m";
const brightCyan = "\u001b[96m";
const brightGreen = "\u001b[92m";
const brightYellow = "\u001b[93m";
const brightMagenta = "\u001b[95m";
const bold = "\u001b[1m";
const dim = "\u001b[2m";

// Utility functions
// eslint-disable-next-line no-control-regex
const stripAnsi = (str: string) => str.replace(/\u001b\[[0-9;]*m/g, "");
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Clear screen and move cursor to top
const clearScreen = () => {
  console.clear();
  process.stdout.write("\u001b[H");
};

// Animated typewriter effect
const typewriter = async (text: string, speed = 30) => {
  for (const char of text) {
    process.stdout.write(char);
    await sleep(speed);
  }
};

// Progressive reveal animation
const revealLine = async (line: string, delay = 20) => {
  console.log(line);
  await sleep(delay);
};

// Sparkle animation effect
const sparkles = ["✨", "⭐", "💫", "🌟"];
let sparkleIndex = 0;
const getSparkle = () => sparkles[sparkleIndex++ % sparkles.length];

// Main intro animation
export async function showInteractiveIntro() {
  clearScreen();

  const width = 72;
  const borderTop = brightCyan + "╔" + "═".repeat(width - 2) + "╗" + reset;
  const borderBottom = brightCyan + "╚" + "═".repeat(width - 2) + "╝" + reset;
  const borderSide = brightCyan + "║" + reset;
  const emptyLine = borderSide + " ".repeat(width - 2) + borderSide;

  // Step 1: Draw empty box with animation
  await revealLine(borderTop, 30);
  await revealLine(emptyLine, 20);
  await revealLine(emptyLine, 20);
  await revealLine(emptyLine, 20);
  await revealLine(emptyLine, 20);
  await revealLine(emptyLine, 20);
  await revealLine(emptyLine, 20);
  await revealLine(borderBottom, 30);

  // Step 2: Move cursor up to fill content
  process.stdout.write("\u001b[7A"); // Move up 7 lines

  await sleep(200);

  // Animated title with gradient effect
  const titleLine1 =
    bold +
    brightYellow +
    "██████╗ " +
    brightMagenta +
    "███████╗" +
    brightCyan +
    "████████╗" +
    brightGreen +
    "████████╗" +
    brightYellow +
    "███████╗" +
    brightMagenta +
    "██████╗ " +
    reset;
  const titleLine2 =
    bold +
    brightYellow +
    "██╔══██╗" +
    brightMagenta +
    "██╔════╝" +
    brightCyan +
    "╚══██╔══╝" +
    brightGreen +
    "╚══██╔══╝" +
    brightYellow +
    "██╔════╝" +
    brightMagenta +
    "██╔══██╗" +
    reset;
  const titleLine3 =
    bold +
    brightYellow +
    "██████╔╝" +
    brightMagenta +
    "█████╗  " +
    brightCyan +
    "   ██║   " +
    brightGreen +
    "   ██║   " +
    brightYellow +
    "█████╗  " +
    brightMagenta +
    "██████╔╝" +
    reset;
  const titleLine4 =
    bold +
    brightYellow +
    "██╔══██╗" +
    brightMagenta +
    "██╔══╝  " +
    brightCyan +
    "   ██║   " +
    brightGreen +
    "   ██║   " +
    brightYellow +
    "██╔══╝  " +
    brightMagenta +
    "██╔══██╗" +
    reset;
  const titleLine5 =
    bold +
    brightYellow +
    "██████╔╝" +
    brightMagenta +
    "███████╗" +
    brightCyan +
    "   ██║   " +
    brightGreen +
    "   ██║   " +
    brightYellow +
    "███████╗" +
    brightMagenta +
    "██║  ██║" +
    reset;

  const subtitle =
    brightCyan +
    "T" +
    brightMagenta +
    "S" +
    reset +
    " " +
    brightGreen +
    "S" +
    brightYellow +
    "T" +
    brightMagenta +
    "A" +
    brightCyan +
    "C" +
    brightGreen +
    "K" +
    reset;

  const titleLines = [
    titleLine1,
    titleLine2,
    titleLine3,
    titleLine4,
    titleLine5,
  ];

  const centerText = (text: string) => {
    const textLen = stripAnsi(text).length;
    const padding = Math.floor((width - 2 - textLen) / 2);
    return (
      " ".repeat(padding) + text + " ".repeat(width - 2 - textLen - padding)
    );
  };

  // Animate title appearance
  for (const line of titleLines) {
    process.stdout.write(
      "\r" + borderSide + centerText(line) + borderSide + "\n"
    );
    await sleep(80);
  }

  // Show subtitle
  process.stdout.write(
    "\r" + borderSide + centerText(bold + subtitle + reset) + borderSide + "\n"
  );
  await sleep(200);

  // Move down past the box
  process.stdout.write("\u001b[2B");

  // Tagline with typewriter effect
  await sleep(300);
  const sparkle1 = brightYellow + getSparkle() + reset;
  const sparkle2 = brightMagenta + getSparkle() + reset;

  process.stdout.write("\n  " + sparkle1 + "  ");
  await typewriter(
    brightGreen +
      "Build powerful TypeScript projects with enterprise-grade tooling" +
      reset,
    15
  );
  process.stdout.write("  " + sparkle2 + "\n\n");

  await sleep(400);

  // Feature highlights with icons
  const features = [
    {
      icon: "⚡",
      color: brightYellow,
      text: "Lightning-fast setup with zero configuration",
    },
    {
      icon: "🎯",
      color: brightCyan,
      text: "Production-ready templates for every use case",
    },
    {
      icon: "🛠️ ",
      color: brightMagenta,
      text: "Modern tooling: ESLint, Prettier, Vitest & more",
    },
    {
      icon: "📦",
      color: brightGreen,
      text: "Optimized builds with best practices baked in",
    },
  ];

  console.log(
    dim +
      "  ─────────────────────────────────────────────────────────────────────" +
      reset
  );
  await sleep(100);

  for (const feature of features) {
    process.stdout.write("  " + feature.icon + "  " + feature.color);
    await typewriter(feature.text, 10);
    process.stdout.write(reset + "\n");
    await sleep(150);
  }

  console.log(
    dim +
      "  ─────────────────────────────────────────────────────────────────────" +
      reset
  );
  await sleep(300);

  // Interactive prompt
  console.log("\n");
  const prompt =
    brightCyan +
    "❯" +
    reset +
    " Ready to scaffold your next TypeScript project? " +
    dim +
    "(Press " +
    brightGreen +
    "Enter" +
    reset +
    dim +
    " to continue)" +
    reset;

  process.stdout.write("  " + prompt);

  // Wait for user input
  return new Promise<void>((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.on("line", () => {
      rl.close();
      console.log("\n");
      resolve();
    });
  });
}
