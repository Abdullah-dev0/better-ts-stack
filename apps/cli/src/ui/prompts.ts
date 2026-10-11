// Prompts built on @clack/core, which handles the keyboard while the render
// functions below draw each state
import { ConfirmPrompt, SelectPrompt, TextPrompt } from "@clack/core";

import { bold, dim, inverse, lime, red } from "./theme";

export interface SelectOption<T> {
  value: T;
  label: string;
  hint?: string;
}

// A prompt waiting for input: "$ Project name"
const question = (message: string) => `${lime("$")} ${bold(message)}`;

// An answered prompt, collapsed to one line: "✓ Project name  my-app". The
// trailing newline leaves a blank line before the next prompt
const answered = (message: string, answer: string) =>
  `${lime("✓")} ${dim(message)}  ${answer}\n`;

const cancelled = (message: string) => `${red("×")} ${dim(message)}`;

export function text(options: {
  message: string;
  placeholder: string;
  validate: (value: string | undefined) => string | undefined;
}): Promise<string | symbol> {
  const { message, placeholder } = options;

  return new TextPrompt({
    validate: options.validate,
    render() {
      if (this.state === "submit") return answered(message, this.value ?? "");
      if (this.state === "cancel") return cancelled(message);

      // The inverse first character stands in for the cursor on an empty input
      const input = this.userInput
        ? this.userInputWithCursor
        : inverse(placeholder[0]) + dim(placeholder.slice(1));
      const error = this.state === "error" ? `\n  ${red(this.error)}` : "";

      return `${question(message)}\n  ${input}${error}\n`;
    },
  }).prompt() as Promise<string | symbol>;
}

export function select<T>(options: {
  message: string;
  options: SelectOption<T>[];
  initialValue: T;
}): Promise<T | symbol> {
  const { message } = options;

  return new SelectPrompt({
    options: options.options,
    initialValue: options.initialValue,
    render() {
      if (this.state === "submit")
        return answered(message, this.options[this.cursor].label);
      if (this.state === "cancel") return cancelled(message);

      const rows = this.options.map((option, index) => {
        const hint = option.hint ? `  ${dim(option.hint)}` : "";
        return index === this.cursor
          ? `  ${lime("›")} ${option.label}${hint}`
          : `    ${dim(option.label)}`;
      });

      return `${question(message)}\n${rows.join("\n")}\n`;
    },
  }).prompt() as Promise<T | symbol>;
}

export function confirm(options: {
  message: string;
  initialValue: boolean;
}): Promise<boolean | symbol> {
  const { message } = options;

  return new ConfirmPrompt({
    active: "Yes",
    inactive: "No",
    initialValue: options.initialValue,
    render() {
      if (this.state === "submit")
        return answered(message, this.value ? "Yes" : "No");
      if (this.state === "cancel") return cancelled(message);

      // Both choices keep their column; only the marker and color move
      const choice = (label: string, isActive: boolean) =>
        isActive ? lime(`› ${label}`) : dim(`  ${label}`);

      return `${question(message)}\n  ${choice("Yes", this.value === true)}   ${choice("No", this.value === false)}\n`;
    },
  }).prompt() as Promise<boolean | symbol>;
}
