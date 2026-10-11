import { intro } from "@clack/prompts";
import { styleText } from "node:util";

// Opens the session with the product name and version
export function showIntro(version: string) {
  intro(
    `${styleText(["bold", "yellow"], "better-ts-stack")} ${styleText("dim", `v${version}`)}`
  );
}
