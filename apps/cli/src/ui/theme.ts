// Colors and text styles shared by every piece of CLI output
import { styleText } from "node:util";

// Plain text is used when the output is piped, NO_COLOR is set, or the
// terminal has fewer than 256 colors
const hasColors = process.stdout.isTTY && process.stdout.hasColors(256);

// Wraps text in a color from the 256-color palette
function color(code: number) {
  return (text: string) =>
    hasColors ? `\x1b[38;5;${code}m${text}\x1b[39m` : text;
}

export const amber = color(214); // Brand: wordmark and headings
export const lavender = color(183); // Tagline
export const lime = color(148); // Prompts, success, and commands to run
export const pink = color(211); // Labels
export const red = color(203); // Errors

export const bold = (text: string) => styleText("bold", text);
export const dim = (text: string) => styleText("dim", text);
export const inverse = (text: string) => styleText("inverse", text);
