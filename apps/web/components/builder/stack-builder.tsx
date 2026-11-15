"use client";

import { useState } from "react";

import {
  Ban,
  Bot,
  CircleCheck,
  Code,
  Gauge,
  RotateCcw,
  Share2,
  Shuffle,
  X,
} from "lucide-react";
import {
  siBetterauth,
  siBun,
  siDocker,
  siDrizzle,
  siExpress,
  siGithubactions,
  siMongoose,
  type SimpleIcon,
  siNestjs,
  siNextdotjs,
  siNpm,
  siPnpm,
  siPrisma,
  siTanstack,
} from "simple-icons";

import { CopyButton } from "@/components/home/copy-button";
import {
  buildCommand,
  buildTree,
  canUseAuth,
  canUseRateLimit,
  DATABASE_OPTIONS,
  DEFAULT_CHOICES,
  type FileSource,
  FRAMEWORK_OPTIONS,
  isValidProjectName,
  listProjectFiles,
  matchesPreset,
  normalizeChoices,
  PACKAGE_MANAGER_OPTIONS,
  PROJECT_NAME,
  type ProjectFile,
  STACK_PRESETS,
  type StackChoices,
  toSearchParams,
  type TreeNode,
} from "@/lib/stack";
import { cn } from "@/lib/utils";

const SOURCE_STYLES: Record<
  Exclude<FileSource, "base">,
  { label: string; text: string }
> = {
  database: { label: "database", text: "text-tui-lime" },
  auth: { label: "auth", text: "text-tui-amber" },
  docker: { label: "docker", text: "text-tui-lavender" },
  "rate-limit": { label: "rate-limit", text: "text-tui-pink" },
  ci: { label: "ci", text: "text-tui-lime" },
  agents: { label: "agents", text: "text-tui-amber" },
  vscode: { label: "vscode", text: "text-tui-lavender" },
};

type IconComponent = React.ComponentType<{
  className?: string;
  "aria-hidden"?: boolean;
}>;

// A brand's logo from simple-icons, drawn in the current text color
function brandIcon(icon: SimpleIcon): IconComponent {
  function BrandIcon(props: { className?: string; "aria-hidden"?: boolean }) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d={icon.path} />
      </svg>
    );
  }
  return BrandIcon;
}

// Options without a logo of their own get a Lucide icon
const ICONS = {
  express: brandIcon(siExpress),
  nestjs: brandIcon(siNestjs),
  nextjs: brandIcon(siNextdotjs),
  tanstack: brandIcon(siTanstack),
  none: Ban,
  prisma: brandIcon(siPrisma),
  drizzle: brandIcon(siDrizzle),
  mongoose: brandIcon(siMongoose),
  npm: brandIcon(siNpm),
  pnpm: brandIcon(siPnpm),
  bun: brandIcon(siBun),
  auth: brandIcon(siBetterauth),
  docker: brandIcon(siDocker),
  "rate-limit": Gauge,
  ci: brandIcon(siGithubactions),
  agents: Bot,
  vscode: Code,
} satisfies Record<string, IconComponent>;

type ExtraId = Exclude<FileSource, "base" | "database">;

const EXTRA_OPTIONS: {
  id: ExtraId;
  field:
    | "useAuth"
    | "useDocker"
    | "useRateLimit"
    | "useCi"
    | "useAgents"
    | "useVscode";
  label: string;
  description: string;
}[] = [
  {
    id: "auth",
    field: "useAuth",
    label: "Auth",
    description: "Better Auth with email, GitHub, and Google sign-in",
  },
  {
    id: "docker",
    field: "useDocker",
    label: "Docker",
    description: "A multi-stage Dockerfile and a Compose file",
  },
  {
    id: "rate-limit",
    field: "useRateLimit",
    label: "Rate limit",
    description: "Per-IP request limits",
  },
  {
    id: "ci",
    field: "useCi",
    label: "CI",
    description: "A GitHub Actions workflow",
  },
  {
    id: "agents",
    field: "useAgents",
    label: "Agents",
    description: "AGENTS.md for coding agents",
  },
  {
    id: "vscode",
    field: "useVscode",
    label: "VS Code",
    description: "Workspace settings and extensions",
  },
];

const GROUPS = [
  { id: "framework", label: "framework" },
  { id: "database", label: "database" },
  { id: "extras", label: "extras" },
  { id: "package-manager", label: "package manager" },
] as const;

const LABEL_CLASS = "text-[11px] tracking-[0.14em] uppercase";
const FOCUS_CLASS =
  "focus-visible:ring-tui-amber focus-visible:ring-1 focus-visible:outline-none";

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
    useAgents: Math.random() < 0.5,
    useVscode: Math.random() < 0.5,
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

// Keeps the address bar in step with the choices, so the page can be shared
function writeUrl(choices: StackChoices, projectName: string) {
  window.history.replaceState(
    null,
    "",
    `?${toSearchParams(choices, projectName)}`
  );
}

function findLabel<T extends string>(
  options: readonly { value: T; label: string }[],
  value: T
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function StackBuilder({
  initialChoices = DEFAULT_CHOICES,
  initialProjectName = PROJECT_NAME,
}: {
  initialChoices?: StackChoices;
  initialProjectName?: string;
}) {
  const [choices, setChoices] = useState<StackChoices>(initialChoices);
  const [nameInput, setNameInput] = useState(initialProjectName);
  // Paths that the last change added, so only they animate in
  const [addedPaths, setAddedPaths] = useState<ReadonlySet<string>>(
    () => new Set()
  );
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [view, setView] = useState<"configure" | "files">("configure");

  const isNameValid = isValidProjectName(nameInput);
  const projectName = isNameValid ? nameInput : PROJECT_NAME;
  const command = buildCommand(choices, projectName);
  const commandText = command.join(" ");
  const files = listProjectFiles(choices);
  const tree = buildTree(files);
  const usedSources = new Set(files.map((file) => file.source));

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
    writeUrl(normalized, projectName);
  };
  const update = (patch: Partial<StackChoices>) =>
    apply({ ...choices, ...patch });

  const rename = (value: string) => {
    const name = value.toLowerCase().replace(/\s+/g, "-");
    setNameInput(name);
    writeUrl(choices, isValidProjectName(name) ? name : PROJECT_NAME);
  };

  const reset = () => {
    setChoices(DEFAULT_CHOICES);
    setNameInput(PROJECT_NAME);
    setAddedPaths(new Set());
    window.history.replaceState(null, "", window.location.pathname);
  };

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}?${toSearchParams(choices, projectName)}`;
    try {
      await navigator.clipboard.writeText(url);
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked; the address bar has the same link
    }
  };

  // What the sidebar lists; a pick with onRemove can be dropped from there
  const picks: {
    key: keyof typeof ICONS;
    label: string;
    onRemove?: () => void;
  }[] = [
    {
      key: choices.framework,
      label: findLabel(FRAMEWORK_OPTIONS, choices.framework),
    },
  ];
  if (choices.database !== "none")
    picks.push({
      key: choices.database,
      label: findLabel(DATABASE_OPTIONS, choices.database),
      onRemove: () => update({ database: "none" }),
    });
  for (const extra of EXTRA_OPTIONS) {
    if (choices[extra.field])
      picks.push({
        key: extra.id,
        label: extra.label,
        onRemove: () => update({ [extra.field]: false }),
      });
  }
  picks.push({ key: choices.packageManager, label: choices.packageManager });

  const disabledReasons: Partial<Record<ExtraId, string>> = {};
  if (!canUseAuth(choices)) disabledReasons.auth = "Requires a database";
  if (!canUseRateLimit(choices))
    disabledReasons["rate-limit"] = "Requires a backend framework";

  return (
    <>
      <aside
        aria-label="Your stack"
        className="border-border flex min-w-0 flex-col border-b xl:overflow-y-auto xl:border-r xl:border-b-0"
      >
        <h1 className="sr-only">Stack builder</h1>

        <div className="border-border border-b px-5 py-5">
          <label>
            <span
              className={cn("text-muted-foreground mb-2 block", LABEL_CLASS)}
            >
              project name
            </span>
            <input
              type="text"
              value={nameInput}
              onChange={(event) => rename(event.target.value)}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="none"
              aria-invalid={!isNameValid}
              aria-describedby={isNameValid ? undefined : "name-error"}
              placeholder={PROJECT_NAME}
              className="border-border bg-card text-foreground placeholder:text-muted-foreground/50 focus:border-tui-amber aria-invalid:border-destructive h-9 w-full border px-3 text-[13px] outline-none"
            />
          </label>
          {!isNameValid && (
            <p id="name-error" className="text-destructive mt-1.5 text-[11px]">
              lowercase letters, numbers, and hyphens only; using {PROJECT_NAME}
            </p>
          )}
        </div>

        <div className="border-border border-b px-5 py-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className={cn("text-muted-foreground", LABEL_CLASS)}>
              cli command
            </span>
            <CopyButton text={commandText} />
          </div>
          <p className="border-border bg-card border px-3 py-2.5 text-xs leading-5.5 wrap-break-word">
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
        </div>

        <div className="border-border border-b px-5 py-5 xl:border-b-0">
          <div
            className={cn(
              "text-muted-foreground mb-3 flex items-center justify-between gap-3",
              LABEL_CLASS
            )}
          >
            <span>selected stack</span>
            <span className="tabular-nums" aria-live="polite">
              {picks.length} picks
            </span>
          </div>
          <ul className="flex flex-wrap gap-1.5">
            {picks.map((pick) => {
              const Icon = ICONS[pick.key];
              return (
                <li
                  key={pick.key}
                  className="border-border bg-card text-foreground flex items-center gap-1.5 border px-2 py-1 text-xs"
                >
                  <Icon className="text-tui-amber size-3.5" aria-hidden />
                  {pick.label}
                  {pick.onRemove && (
                    <button
                      type="button"
                      onClick={pick.onRemove}
                      aria-label={`Remove ${pick.label}`}
                      className={cn(
                        "text-muted-foreground hover:text-foreground -mr-1 p-0.5 transition-colors",
                        FOCUS_CLASS
                      )}
                    >
                      <X className="size-3" aria-hidden />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="xl:border-border px-5 py-5 xl:mt-auto xl:border-t">
          <span className={cn("text-muted-foreground mb-3 block", LABEL_CLASS)}>
            presets
          </span>
          <div className="mb-5 grid grid-cols-2 gap-1.5">
            {STACK_PRESETS.map((preset) => {
              const isActive = matchesPreset(choices, preset);
              return (
                <button
                  key={preset.id}
                  type="button"
                  title={preset.description}
                  aria-pressed={isActive}
                  onClick={() =>
                    apply({
                      ...preset.choices,
                      packageManager: choices.packageManager,
                    })
                  }
                  className={cn(
                    "truncate border px-2 py-1.5 text-left text-xs transition-colors",
                    FOCUS_CLASS,
                    isActive
                      ? "border-tui-amber text-tui-amber"
                      : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <span className={cn("text-muted-foreground mb-3 block", LABEL_CLASS)}>
            actions
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <ActionButton icon={Shuffle} onClick={() => apply(randomChoices())}>
              random
            </ActionButton>
            <ActionButton icon={RotateCcw} onClick={reset}>
              reset
            </ActionButton>
            <ActionButton icon={Share2} onClick={copyLink}>
              {isLinkCopied ? "copied" : "share"}
            </ActionButton>
          </div>
          <span className="sr-only" aria-live="polite">
            {isLinkCopied ? "Link copied" : ""}
          </span>
        </div>
      </aside>

      <section
        aria-label="Options"
        className="flex min-w-0 flex-col xl:overflow-hidden"
      >
        <div className="border-border bg-background sticky top-12 z-30 shrink-0 border-b px-5 py-3 sm:px-6 xl:static">
          <div
            role="tablist"
            aria-label="Builder view"
            className={cn("flex gap-5", LABEL_CLASS)}
          >
            {(["configure", "files"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                id={`tab-${tab}`}
                aria-selected={view === tab}
                aria-controls="builder-panel"
                onClick={() => setView(tab)}
                className={cn(
                  "tracking-[0.14em] uppercase transition-colors",
                  FOCUS_CLASS,
                  view === tab
                    ? "text-tui-amber"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span aria-hidden>&gt;_ </span>
                {tab}
                {tab === "files" && (
                  <span className="tabular-nums"> ({files.length})</span>
                )}
              </button>
            ))}
          </div>
          {view === "configure" && (
            <nav
              aria-label="Option groups"
              className="mt-3 flex gap-1.5 overflow-x-auto"
            >
              {GROUPS.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() =>
                    document
                      .getElementById(group.id)
                      ?.scrollIntoView({ block: "start" })
                  }
                  className={cn(
                    "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground shrink-0 border px-2 py-1 text-[10px] tracking-[0.12em] uppercase transition-colors",
                    FOCUS_CLASS
                  )}
                >
                  <span className="text-tui-amber" aria-hidden>
                    ▪{" "}
                  </span>
                  {group.label}
                </button>
              ))}
            </nav>
          )}
        </div>

        <div
          id="builder-panel"
          role="tabpanel"
          aria-labelledby={`tab-${view}`}
          className="min-h-0 flex-1 scrollbar-thin px-5 pb-8 sm:px-6 xl:overflow-y-auto"
        >
          {view === "configure" ? (
            <>
              <OptionGroup id="framework" label="framework">
                {FRAMEWORK_OPTIONS.map((option) => (
                  <OptionCard
                    key={option.value}
                    type="radio"
                    name="framework"
                    icon={ICONS[option.value]}
                    label={option.label}
                    description={option.description}
                    badge={option.kind}
                    isChecked={choices.framework === option.value}
                    onChange={() => update({ framework: option.value })}
                  />
                ))}
              </OptionGroup>

              <OptionGroup id="database" label="database">
                {DATABASE_OPTIONS.map((option) => (
                  <OptionCard
                    key={option.value}
                    type="radio"
                    name="database"
                    icon={ICONS[option.value]}
                    label={option.label}
                    description={option.description}
                    isChecked={choices.database === option.value}
                    onChange={() => update({ database: option.value })}
                  />
                ))}
              </OptionGroup>

              <OptionGroup id="extras" label="extras">
                {EXTRA_OPTIONS.map((extra) => (
                  <OptionCard
                    key={extra.id}
                    type="checkbox"
                    name={extra.id}
                    icon={ICONS[extra.id]}
                    label={extra.label}
                    description={extra.description}
                    badge={extra.id === "agents" ? "default" : undefined}
                    disabledReason={disabledReasons[extra.id]}
                    isChecked={choices[extra.field]}
                    onChange={(isChecked) =>
                      update({ [extra.field]: isChecked })
                    }
                  />
                ))}
              </OptionGroup>

              <OptionGroup id="package-manager" label="package manager">
                {PACKAGE_MANAGER_OPTIONS.map((option) => (
                  <OptionCard
                    key={option.value}
                    type="radio"
                    name="packageManager"
                    icon={ICONS[option.value]}
                    label={option.label}
                    description={option.description}
                    isChecked={choices.packageManager === option.value}
                    onChange={() => update({ packageManager: option.value })}
                  />
                ))}
              </OptionGroup>
            </>
          ) : (
            <div className="pt-6">
              <div
                className={cn(
                  "mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5",
                  LABEL_CLASS
                )}
              >
                <span className="text-muted-foreground">{projectName}/</span>
                <ul className="flex flex-wrap gap-x-3 gap-y-1">
                  {Object.entries(SOURCE_STYLES)
                    .filter(([key]) => usedSources.has(key as FileSource))
                    .map(([key, style]) => (
                      <li key={key} className={style.text}>
                        + {style.label}
                      </li>
                    ))}
                </ul>
              </div>
              <ul
                aria-label={`Files in ${projectName}`}
                className="border-border bg-card border px-3 py-3 text-[13px] leading-6"
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
              <p className="text-muted-foreground mt-4 text-[11px]">
                same list as <span className="text-foreground">--dry-run</span>,
                read from the CLI templates
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Below xl the command scrolls away with the sidebar, so it stays in reach */}
      <div className="border-border bg-background fixed inset-x-0 bottom-0 z-40 flex h-12 items-center gap-3 border-t pr-2 pl-4 xl:hidden">
        <code className="min-w-0 flex-1 truncate text-xs">
          <span className="text-tui-lime select-none" aria-hidden>
            ${" "}
          </span>
          {commandText}
        </code>
        <CopyButton
          text={commandText}
          className="border-tui-amber text-tui-amber hover:bg-tui-amber/10 hover:text-tui-amber"
        />
      </div>
    </>
  );
}

function ActionButton({
  icon: Icon,
  onClick,
  children,
}: {
  icon: IconComponent;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground flex h-8 items-center justify-center gap-1.5 border text-[10px] tracking-[0.12em] uppercase transition-colors",
        FOCUS_CLASS
      )}
    >
      <Icon className="size-3" aria-hidden />
      {children}
    </button>
  );
}

function OptionGroup({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      role="group"
      aria-labelledby={`${id}-label`}
      className="scroll-mt-32 pt-6 xl:scroll-mt-0"
    >
      <div
        className={cn(
          "text-muted-foreground mb-3 flex items-center gap-3",
          LABEL_CLASS
        )}
      >
        <span id={`${id}-label`}>
          <span className="text-tui-amber" aria-hidden>
            &gt;_{" "}
          </span>
          {label}
        </span>
        <span className="bg-border h-px flex-1" aria-hidden />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function OptionCard({
  type,
  name,
  icon: Icon,
  label,
  description,
  badge,
  disabledReason,
  isChecked,
  onChange,
}: {
  type: "radio" | "checkbox";
  name: string;
  icon: IconComponent;
  label: string;
  description: string;
  badge?: string;
  disabledReason?: string;
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
}) {
  const isDisabled = disabledReason !== undefined;

  return (
    <label
      className={cn(
        "bg-card relative flex min-h-22 min-w-0 cursor-pointer flex-col gap-1.5 border px-4 py-3.5 transition-colors",
        "has-focus-visible:ring-tui-amber has-focus-visible:ring-1",
        isChecked
          ? "border-tui-amber"
          : "border-border hover:border-foreground/30",
        isDisabled && "cursor-not-allowed opacity-60 hover:border-(--border)"
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
      <span className="flex items-center gap-2">
        <Icon
          className={cn(
            "size-4 shrink-0",
            isChecked ? "text-tui-amber" : "text-muted-foreground"
          )}
          aria-hidden
        />
        <span
          className={cn(
            "min-w-0 text-sm font-medium",
            isChecked ? "text-tui-amber" : "text-foreground"
          )}
        >
          {label}
        </span>
        <span className="ml-auto flex shrink-0 items-center gap-2">
          {badge && (
            <span className="text-muted-foreground/70 text-[10px] tracking-[0.12em] uppercase">
              {badge}
            </span>
          )}
          {isChecked && (
            <CircleCheck className="text-tui-amber size-4" aria-hidden />
          )}
        </span>
      </span>
      <span className="text-muted-foreground text-xs leading-snug">
        {description}
      </span>
      {disabledReason && (
        <span className="text-tui-pink mt-auto text-[11px]">
          {disabledReason}
        </span>
      )}
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
