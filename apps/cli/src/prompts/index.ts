import { buildError } from "../types";
import { confirm, text } from "../ui";
import { validateProjectPath } from "../validators";
import { ask } from "./stack";

export { collectStackChoices } from "./stack";

// Returns the project path from the command line, or asks for it
export async function collectProjectPath(
  preset: string | undefined,
  isNonInteractive: boolean
): Promise<string> {
  if (preset !== undefined) {
    const error = validateProjectPath(preset);
    if (error) throw buildError(error, "INVALID_ARGUMENT");
  } else if (isNonInteractive) {
    throw buildError(
      "A project path is required with --yes, for example: better-ts-stack my-app --yes",
      "INVALID_ARGUMENT"
    );
  }

  return ask(preset, () =>
    text({
      message: "Project name",
      placeholder: "my-awesome-project",
      validate: (value) => validateProjectPath(value ?? ""),
    })
  );
}

// Asks for final confirmation before building; declining ends the session
export async function confirmBuild() {
  const shouldBuild = await ask(undefined, () =>
    confirm({ message: "Create this project?", initialValue: true })
  );

  if (!shouldBuild) {
    process.exit(0);
  }
}
