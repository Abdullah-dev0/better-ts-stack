"use client";

import { useState } from "react";

import {
  buildCommand,
  buildTree,
  canUseAuth,
  canUseRateLimit,
  DATABASE_OPTIONS,
  DEFAULT_CHOICES,
  type FileSource,
  FRAMEWORK_OPTIONS,
  isBackend,
  listProjectFiles,
  normalizeChoices,
  PACKAGE_MANAGER_OPTIONS,
  PROJECT_NAME,
  type ProjectFile,
  type StackChoices,
  type TreeNode,
} from "@/lib/stack";
import { cn } from "@/lib/utils";

import { CopyButton } from "./copy-button";
import { Pane, PaneBlock } from "./pane";

const SOURCE_STYLES: Record<
  Exclude<FileSource, "base">,
  { label: string; text: string }
> = {
  database: { label: "database", text: "text-tui-lime" },
  auth: { label: "auth", text: "text-tui-amber" },
  docker: { label: "docker", text: "text-tui-lavender" },
  "rate-limit": { label: "rate-limit", text: "text-tui-pink" },
  ci: { label: "ci", text: "text-tui-lime" },
};

function pickRandom<T>(values: readonly T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

function randomChoices(): StackChoices {
  return {
    framework: pickRandom(FRAMEWORK_OPTIONS).value,
    database: pickRandom(DATABASE_OPTIONS).value,
    packageManager: pickRandom(PACKAGE_MANAGER_OPTIONS).value,
    useAuth: Math.random() < 0.5,
    useDocker: Math.random() < 0.5,
    useRateLimit: Math.random() < 0.5,
    useCi: Math.random() < 0.5,
  };
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

export function StackBuilder() {
  const [choices, setChoices] = useState<StackChoices>(DEFAULT_CHOICES);
  // Paths that the last change added, so only they animate in
  const [addedPaths, setAddedPaths] = useState<ReadonlySet<string>>(
    () => new Set()
  );

  const command = buildCommand(choices);
  const files = listProjectFiles(choices);
  const tree = buildTree(files);
  const isAuthAvailable = canUseAuth(choices);
  const isRateLimitAvailable = canUseRateLimit(choices);

  const apply = (next: StackChoices) => {
    const normalized = normalizeChoices(next);
    const before = listTreePaths(files);
    setAddedPaths(
      new Set(
        [...listTreePaths(listProjectFiles(normalized))].filter(
          (path) => !before.has(path)
        )
      )
    );
    setChoices(normalized);
  };
  const update = (patch: Partial<StackChoices>) =>
    apply({ ...choices, ...patch });

  const randomize = () => apply(randomChoices());

  return (
    <>
      <Pane
        id="builder"
        label="stack.config"
        index="02"
        className="border-border border-b xl:border-r xl:border-b-0"
        bodyClassName="xl:overflow-y-auto"
        aside={
          <span className="flex gap-3 normal-case">
            <ActionButton onClick={randomize}>random</ActionButton>
            <ActionButton
              onClick={() => {
                setChoices(DEFAULT_CHOICES);
                setAddedPaths(new Set());
              }}
            >
              reset
            </ActionButton>
          </span>
        }
      >
        <PaneBlock label="framework" aside="--framework">
          <OptionGrid>
            {FRAMEWORK_OPTIONS.map((option) => (
              <OptionTile
                key={option.value}
                type="radio"
                name="framework"
                label={option.label}
                description={option.description}
                isChecked={choices.framework === option.value}
                onChange={() => update({ framework: option.value })}
              />
            ))}
          </OptionGrid>
        </PaneBlock>

        <PaneBlock label="database" aside="--database">
          <OptionGrid>
            {DATABASE_OPTIONS.map((option) => (
              <OptionTile
                key={option.value}
                type="radio"
                name="database"
                label={option.label}
                description={option.description}
                isChecked={choices.database === option.value}
                onChange={() => update({ database: option.value })}
              />
            ))}
          </OptionGrid>
        </PaneBlock>

        <PaneBlock label="package manager">
          <OptionGrid className="grid-cols-3">
            {PACKAGE_MANAGER_OPTIONS.map((option) => (
              <OptionTile
                key={option.value}
                type="radio"
                name="packageManager"
                label={option.label}
                description={option.runner}
                isChecked={choices.packageManager === option.value}
                onChange={() => update({ packageManager: option.value })}
              />
            ))}
          </OptionGrid>
        </PaneBlock>

        <PaneBlock label="extras" className="border-b-0">
          <OptionGrid className="grid-cols-2 sm:grid-cols-3">
            <OptionTile
              type="checkbox"
              name="auth"
              label="auth"
              description={
                !isAuthAvailable
                  ? "needs a database"
                  : isBackend(choices.framework)
                    ? "JWT, bcrypt, Zod"
                    : "Better Auth"
              }
              isChecked={choices.useAuth}
              isDisabled={!isAuthAvailable}
              onChange={(isChecked) => update({ useAuth: isChecked })}
            />
            <OptionTile
              type="checkbox"
              name="docker"
              label="docker"
              description="Dockerfile + Compose"
              isChecked={choices.useDocker}
              onChange={(isChecked) => update({ useDocker: isChecked })}
            />
            <OptionTile
              type="checkbox"
              name="rateLimit"
              label="rate limit"
              description={
                isRateLimitAvailable ? "per-IP limits" : "backends only"
              }
              isChecked={choices.useRateLimit}
              isDisabled={!isRateLimitAvailable}
              onChange={(isChecked) => update({ useRateLimit: isChecked })}
            />
            <OptionTile
              type="checkbox"
              name="ci"
              label="ci"
              description="GitHub Actions"
              isChecked={choices.useCi}
              onChange={(isChecked) => update({ useCi: isChecked })}
            />
          </OptionGrid>
        </PaneBlock>
      </Pane>

      <Pane
        label={`${PROJECT_NAME}/`}
        index="03"
        className="min-h-[28rem]"
        bodyClassName="flex flex-col xl:overflow-hidden"
        aside={<span aria-live="polite">{files.length} files</span>}
      >
        <PaneBlock
          label="cli command"
          aside={<CopyButton text={command.join(" ")} />}
        >
          <p className="text-[13px] leading-6 break-words">
            <span className="text-tui-lime mr-2 select-none" aria-hidden>
              $
            </span>
            {command.map((part, i) => (
              <span key={part}>
                <CommandPart part={part} isFirst={i === 0} />
                {i < command.length - 1 && " "}
              </span>
            ))}
          </p>
        </PaneBlock>

        <div className="flex min-h-0 flex-1 flex-col px-5 py-6 sm:px-8">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5 text-[11px] tracking-[0.14em] uppercase">
            <span className="text-tui-pink">files</span>
            <ul className="text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
              {Object.entries(SOURCE_STYLES).map(([key, style]) => (
                <li key={key} className={style.text}>
                  + {style.label}
                </li>
              ))}
            </ul>
          </div>
          <ul
            aria-label={`Files in ${PROJECT_NAME}`}
            className="max-h-96 min-h-56 flex-1 [scrollbar-width:thin] overflow-y-auto pr-1 text-[13px] leading-6 xl:max-h-none"
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
          <p className="border-border text-muted-foreground mt-4 border-t pt-4 text-[11px]">
            same list as <span className="text-foreground">--dry-run</span>,
            read from the CLI templates
          </p>
        </div>
      </Pane>
    </>
  );
}

function ActionButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hover:text-foreground focus-visible:ring-tui-amber tracking-[0.14em] uppercase transition-colors focus-visible:ring-1 focus-visible:outline-none"
    >
      [{children}]
    </button>
  );
}

function OptionGrid({
  className = "grid-cols-2 lg:grid-cols-4",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("grid gap-3", className)}>{children}</div>;
}

function OptionTile({
  type,
  name,
  label,
  description,
  isChecked,
  isDisabled = false,
  onChange,
}: {
  type: "radio" | "checkbox";
  name: string;
  label: string;
  description: string;
  isChecked: boolean;
  isDisabled?: boolean;
  onChange: (isChecked: boolean) => void;
}) {
  const marker =
    type === "radio" ? (isChecked ? "●" : "○") : isChecked ? "[x]" : "[ ]";

  return (
    <label
      className={cn(
        "border-border hover:border-foreground/30 relative flex min-w-0 cursor-pointer flex-col gap-1.5 border px-4 py-3.5 transition-colors",
        "has-checked:border-tui-amber has-checked:bg-tui-amber/[0.07] has-focus-visible:ring-tui-amber has-focus-visible:ring-1",
        isDisabled && "cursor-not-allowed opacity-50 hover:border-(--border)"
      )}
    >
      <input
        type={type}
        name={type === "radio" ? `builder-${name}` : undefined}
        checked={isChecked}
        disabled={isDisabled}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span className="flex items-baseline justify-between gap-2">
        <span
          className={cn(
            "min-w-0 text-sm font-medium",
            isChecked ? "text-tui-amber" : "text-foreground"
          )}
        >
          {label}
        </span>
        <span
          aria-hidden
          className={cn(
            "shrink-0 text-xs",
            isChecked ? "text-tui-amber" : "text-muted-foreground/60"
          )}
        >
          {marker}
        </span>
      </span>
      <span className="text-muted-foreground text-xs leading-snug">
        {description}
      </span>
    </label>
  );
}

function CommandPart({ part, isFirst }: { part: string; isFirst: boolean }) {
  if (isFirst) return <span className="text-foreground">{part}</span>;
  const [flag, value] = part.split(" ");
  return (
    <span className="whitespace-nowrap">
      <span className="text-tui-amber">{flag}</span>
      {value && <span className="text-foreground"> {value}</span>}
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

  return (
    <li>
      <div
        className={cn(
          "flex items-center gap-2 px-1",
          addedPaths.has(node.path) && "animate-file-in"
        )}
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
      >
        <span
          className={cn(
            "truncate",
            isFolder
              ? "text-muted-foreground"
              : (style?.text ?? "text-foreground/85")
          )}
        >
          {isFolder ? `${node.name}/` : node.name}
        </span>
        {!isFolder && style && (
          <span className={cn("ml-auto shrink-0 text-[11px]", style.text)}>
            +{style.label}
          </span>
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
