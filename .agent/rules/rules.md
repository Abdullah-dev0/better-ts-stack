---
trigger: always_on
---

# Project Rules: better-ts-stack

## 1. Modular Architecture
- **Rule**: All project features, frameworks, and tools MUST be implemented as modules.
- **Logic**: No framework-specific logic should exist in `src/builder`. The builder should only orchestrate the merging and copying of modules.
- **Location**: Base templates reside in `templates/backend/` or `templates/frontend/`. Optional features (ORMs, Docker, Auth) reside in `templates/modules/`.

## 2. Module Configuration (`config.json`)
- **Rule**: Every module folder must contain a valid `config.json` that follows the `ModuleConfig` interface.
- **Requirements**:
    - `id`: Unique identifier (e.g., `prisma`, `docker`).
    - `type`: Must be `base`, `database`, or `feature`.
    - `templateFiles`: Array of relative paths to files requiring Handlebars processing.
    - `scripts/dependencies`: Define only what is specific to that module.

## 3. Template Processing
- **Rule**: Files requiring dynamic content (interpolation) MUST use the `.hbs` extension.
- **Action**: Register these files in the module's `config.json` under `templateFiles`. The builder will strip the `.hbs` extension after processing (e.g., `Dockerfile.hbs` becomes `Dockerfile`).

## 4. Error Handling
- **Rule**: Use the custom `BuildError` system for all build-time failures.
- **Pattern**: `throw createBuildError(message, code, exitCode)`.
- **Codes**: Use descriptive, uppercase error codes (e.g., `MODULE_LOADING_ERROR`, `DIRECTORY_NOT_EMPTY`, `TEMPLATE_PROCESSING_ERROR`).

## 5. Logging & UI
- **Rule**: Exclusively use `consola` for terminal messages.
- **UX Standards**:
    - `consola.start()` / `consola.success()` for process milestones.
    - `consola.info()` for helpful context.
    - `consola.error()` for terminal failures.
    - Use `@clack/prompts` for all interactive user input (prompts, cancels, selects).

## 6. Type Integrity
- **Rule**: All core data structures must be centralized in `src/types/index.ts`.
- **Validation**: Ensure `ProjectConfig` accurately represents the union of all possible user choices to maintain type safety throughout the pipeline.

## 7. Filesystem Operations
- **Rule**: Use `fs-extra` for all filesystem operations (promises-based) to maintain consistency.
- **Safety**: Always use `path.join` and `path.resolve` for directory manipulations to ensure cross-platform compatibility (Windows/Linux).

## 8. Development Workflow
- **Rule**: Do not start or run any servers or builds unless explicitly instructed.
- **Rule**: When adding a new template, ensure a corresponding entry exists in the `prompts` logic and `moduleSelector.ts`.