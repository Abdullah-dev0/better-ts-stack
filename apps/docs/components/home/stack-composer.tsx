"use client";

import { useState } from "react";

import { Check, Copy, FileCode2, Folder, RotateCcw } from "lucide-react";

import {
  buildCommand,
  buildTree,
  canUseAuth,
  canUseRateLimit,
  DATABASE_OPTIONS,
  DEFAULT_CHOICES,
  type FileSource,
  FRAMEWORK_OPTIONS,
  listProjectFiles,
  normalizeChoices,
  PACKAGE_MANAGER_OPTIONS,
  PROJECT_NAME,
  type ProjectFile,
  type StackChoices,
  type TreeNode,
} from "@/lib/stack";
import { cn } from "@/lib/utils";

const SOURCE_STYLES: Record<
  Exclude<FileSource, "base">,
  { label: string; dot: string; text: string }
> = {
  database: {
    label: "database",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
  },
  auth: { label: "auth", dot: "bg-amber-400", text: "text-amber-300" },
  docker: { label: "docker", dot: "bg-sky-400", text: "text-sky-300" },
  "rate-limit": {
    label: "rate limit",
    dot: "bg-rose-400",
    text: "text-rose-300",
  },
};

const RUN_COMMANDS: Record<StackChoices["packageManager"], string> = {
  npm: "npm install && npm run dev",
  pnpm: "pnpm install && pnpm dev",
  bun: "bun install && bun run dev",
};

export function StackComposer() {
  const [choices, setChoices] = useState<StackChoices>(DEFAULT_CHOICES);
  // Paths that the last change added, so only they animate in
  const [addedPaths, setAddedPaths] = useState<ReadonlySet<string>>(
    () => new Set()
  );
  const [isCopied, setIsCopied] = useState(false);

  const command = buildCommand(choices);
  const files = listProjectFiles(choices);
  const tree = buildTree(files);
  const isAuthAvailable = canUseAuth(choices);
  const isRateLimitAvailable = canUseRateLimit(choices);

  const update = (patch: Partial<StackChoices>) => {
    const next = normalizeChoices({ ...choices, ...patch });
    const before = listTreePaths(files);
    setAddedPaths(
      new Set(
        [...listTreePaths(listProjectFiles(next))].filter(
          (path) => !before.has(path)
        )
      )
    );
    setChoices(next);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command.join(" "));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked; the command stays selectable
    }
  };

  return (
    <div className="border-border bg-card shadow-foreground/5 overflow-hidden rounded-2xl border shadow-2xl">
      <div className="border-border flex items-center justify-between gap-4 border-b px-5 py-3">
        <p className="text-muted-foreground font-mono text-xs">
          <span className="text-primary">●</span> Pick a stack
        </p>
        <button
          type="button"
          onClick={() => {
            setChoices(DEFAULT_CHOICES);
            setAddedPaths(new Set());
          }}
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <RotateCcw className="h-3 w-3" aria-hidden />
          Reset
        </button>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Choices */}
        <div className="space-y-6 p-5 sm:p-6">
          <ChoiceGroup legend="Framework" flag="--framework">
            <div className="grid grid-cols-2 gap-2">
              {FRAMEWORK_OPTIONS.map((option) => (
                <RadioTile
                  key={option.value}
                  name="framework"
                  isChecked={choices.framework === option.value}
                  onSelect={() => update({ framework: option.value })}
                  label={option.label}
                  hint={option.kind}
                />
              ))}
            </div>
          </ChoiceGroup>

          <ChoiceGroup legend="Database" flag="--database">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {DATABASE_OPTIONS.map((option) => (
                <RadioTile
                  key={option.value}
                  name="database"
                  isChecked={choices.database === option.value}
                  onSelect={() => update({ database: option.value })}
                  label={option.label}
                  hint={option.hint || "Skip it"}
                />
              ))}
            </div>
          </ChoiceGroup>

          <ChoiceGroup legend="Package manager" flag="runner">
            <div className="grid grid-cols-3 gap-2">
              {PACKAGE_MANAGER_OPTIONS.map((option) => (
                <RadioTile
                  key={option.value}
                  name="packageManager"
                  isChecked={choices.packageManager === option.value}
                  onSelect={() => update({ packageManager: option.value })}
                  label={option.value}
                  hint={option.runner}
                  isMono
                />
              ))}
            </div>
          </ChoiceGroup>

          <ChoiceGroup legend="Extras">
            <div className="divide-border border-border divide-y rounded-xl border">
              <Toggle
                label="Authentication"
                flag="--auth"
                description={
                  isAuthAvailable
                    ? choices.framework === "express" ||
                      choices.framework === "nestjs"
                      ? "JWT, bcrypt, and Zod validation"
                      : "Better Auth with sign-in and sign-up pages"
                    : "Better Auth needs a database"
                }
                isChecked={choices.useAuth}
                isDisabled={!isAuthAvailable}
                onToggle={(useAuth) => update({ useAuth })}
              />
              <Toggle
                label="Docker"
                flag="--docker"
                description="Multi-stage Dockerfile and Compose file"
                isChecked={choices.useDocker}
                onToggle={(useDocker) => update({ useDocker })}
              />
              <Toggle
                label="Rate limiting"
                flag="--rate-limit"
                description={
                  isRateLimitAvailable
                    ? "Per-IP request limits"
                    : "Express and NestJS only"
                }
                isChecked={choices.useRateLimit}
                isDisabled={!isRateLimitAvailable}
                onToggle={(useRateLimit) => update({ useRateLimit })}
              />
            </div>
          </ChoiceGroup>
        </div>

        {/* Output */}
        <div className="bg-terminal-bg flex min-w-0 flex-col text-neutral-300">
          <div className="border-b border-white/10 p-5 sm:p-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="font-mono text-[11px] tracking-[0.16em] text-neutral-500 uppercase">
                Run
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className="focus-visible:ring-primary inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-neutral-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:outline-none"
              >
                {isCopied ? (
                  <Check className="text-primary h-3.5 w-3.5" aria-hidden />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                )}
                {isCopied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="font-mono text-sm leading-7 break-words">
              <span className="text-primary mr-2 select-none" aria-hidden>
                $
              </span>
              {command.map((part, i) => (
                <span key={part}>
                  <CommandPart part={part} isFirst={i === 0} />
                  {i < command.length - 1 && " "}
                </span>
              ))}
            </p>
            <p className="mt-2 font-mono text-xs leading-6 break-words text-neutral-500">
              <span className="mr-2 select-none" aria-hidden>
                $
              </span>
              cd {PROJECT_NAME} && {RUN_COMMANDS[choices.packageManager]}
            </p>
            <span className="sr-only" aria-live="polite">
              {isCopied ? "Command copied" : ""}
            </span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <p
                className="font-mono text-[11px] tracking-[0.16em] text-neutral-500 uppercase"
                aria-live="polite"
              >
                {PROJECT_NAME}/ · {files.length} files
              </p>
              <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-neutral-400">
                {Object.entries(SOURCE_STYLES).map(([key, style]) => (
                  <li key={key} className="inline-flex items-center gap-1.5">
                    <span
                      className={cn("h-1.5 w-1.5 rounded-full", style.dot)}
                    />
                    {style.label}
                  </li>
                ))}
              </ul>
            </div>
            <ul
              aria-label={`Files in ${PROJECT_NAME}`}
              className="max-h-80 min-h-64 flex-1 [scrollbar-width:thin] [scrollbar-color:rgb(255_255_255/0.15)_transparent] overflow-y-auto pr-1 font-mono text-[13px] leading-6 lg:max-h-96"
            >
              {tree.map((node) => (
                <TreeItem
                  key={node.path}
                  node={node}
                  depth={0}
                  addedPaths={addedPaths}
                />
              ))}
            </ul>
            <p className="mt-4 border-t border-white/10 pt-3 text-xs text-neutral-500">
              The same file list{" "}
              <code className="text-neutral-300">--dry-run</code> prints, read
              from the CLI&apos;s templates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// File paths plus the folders that hold them, matching TreeNode.path
function listTreePaths(files: ProjectFile[]): Set<string> {
  const paths = new Set<string>();
  for (const { path } of files) {
    const segments = path.split("/");
    segments.forEach((_, i) => paths.add(segments.slice(0, i + 1).join("/")));
  }
  return paths;
}

function ChoiceGroup({
  legend,
  flag,
  children,
}: {
  legend: string;
  flag?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="mb-2.5 flex w-full items-baseline justify-between gap-3">
        <span className="text-foreground text-sm font-medium">{legend}</span>
        {flag && (
          <span className="text-muted-foreground font-mono text-[11px]">
            {flag}
          </span>
        )}
      </legend>
      {children}
    </fieldset>
  );
}

function RadioTile({
  name,
  label,
  hint,
  isChecked,
  isMono = false,
  onSelect,
}: {
  name: string;
  label: string;
  hint: string;
  isChecked: boolean;
  isMono?: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      className={cn(
        "border-border bg-background hover:border-foreground/25 relative flex cursor-pointer flex-col gap-0.5 rounded-lg border px-3 py-2.5 transition-colors",
        "has-checked:border-primary has-checked:bg-primary/8 has-focus-visible:ring-ring has-focus-visible:ring-2"
      )}
    >
      <input
        type="radio"
        name={name}
        checked={isChecked}
        onChange={onSelect}
        className="sr-only"
      />
      <span
        className={cn(
          "text-foreground text-sm font-medium",
          isMono && "font-mono"
        )}
      >
        {label}
      </span>
      <span className="text-muted-foreground font-mono text-[11px]">
        {hint}
      </span>
      {isChecked && (
        <Check
          className="text-primary absolute top-2.5 right-2.5 h-3.5 w-3.5"
          aria-hidden
        />
      )}
    </label>
  );
}

function Toggle({
  label,
  flag,
  description,
  isChecked,
  isDisabled = false,
  onToggle,
}: {
  label: string;
  flag: string;
  description: string;
  isChecked: boolean;
  isDisabled?: boolean;
  onToggle: (isChecked: boolean) => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 px-3.5 py-3 first:rounded-t-xl last:rounded-b-xl",
        "has-focus-visible:ring-ring has-focus-visible:ring-2 has-focus-visible:ring-inset",
        isDisabled && "cursor-not-allowed"
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span
            className={cn(
              "text-sm font-medium",
              isDisabled ? "text-muted-foreground" : "text-foreground"
            )}
          >
            {label}
          </span>
          <span className="text-muted-foreground font-mono text-[11px]">
            {flag}
          </span>
        </span>
        <span className="text-muted-foreground block text-xs">
          {description}
        </span>
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={isChecked}
        disabled={isDisabled}
        onChange={(event) => onToggle(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "bg-muted border-border relative h-5 w-9 shrink-0 rounded-full border transition-colors",
          "peer-checked:bg-primary peer-checked:border-primary peer-disabled:opacity-40",
          "after:bg-foreground/70 after:absolute after:top-0.5 after:left-0.5 after:h-3.5 after:w-3.5 after:rounded-full after:transition-transform",
          "peer-checked:after:bg-primary-foreground peer-checked:after:translate-x-4"
        )}
      />
    </label>
  );
}

function CommandPart({ part, isFirst }: { part: string; isFirst: boolean }) {
  if (isFirst) return <span className="text-white">{part}</span>;
  const [flag, value] = part.split(" ");
  return (
    <span className="whitespace-nowrap">
      <span className="text-primary">{flag}</span>
      {value && <span className="text-white"> {value}</span>}
    </span>
  );
}

function TreeItem({
  node,
  depth,
  addedPaths,
}: {
  node: TreeNode;
  depth: number;
  addedPaths: ReadonlySet<string>;
}) {
  const isFolder = node.children.length > 0;
  const style = node.source === "base" ? null : SOURCE_STYLES[node.source];
  const Icon = isFolder ? Folder : FileCode2;

  return (
    <li>
      <div
        className={cn(
          "flex items-center gap-2 rounded px-1.5",
          addedPaths.has(node.path) && "animate-file-in"
        )}
        style={{ paddingLeft: `${depth * 16 + 6}px` }}
      >
        <Icon
          className={cn(
            "h-3.5 w-3.5 shrink-0",
            isFolder ? "text-neutral-500" : "text-neutral-600"
          )}
          aria-hidden
        />
        <span
          className={cn(
            "truncate",
            isFolder ? "text-neutral-400" : (style?.text ?? "text-neutral-300")
          )}
        >
          {node.name}
          {isFolder && "/"}
        </span>
        {!isFolder && style && (
          <span
            className={cn(
              "ml-auto h-1.5 w-1.5 shrink-0 rounded-full",
              style.dot
            )}
            title={`Added by ${style.label}`}
          />
        )}
      </div>
      {isFolder && (
        <ul>
          {node.children.map((child) => (
            <TreeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              addedPaths={addedPaths}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
