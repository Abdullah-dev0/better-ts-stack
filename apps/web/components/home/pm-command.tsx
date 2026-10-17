"use client";

import { useState } from "react";

import { PACKAGE_MANAGER_OPTIONS, type PackageManager } from "@/lib/stack";
import { cn } from "@/lib/utils";

import { CopyButton } from "./copy-button";

export function PmCommand() {
  const [packageManager, setPackageManager] = useState<PackageManager>("npm");
  const runner =
    PACKAGE_MANAGER_OPTIONS.find((o) => o.value === packageManager)?.runner ??
    "npx";
  const command = `${runner} better-ts-stack@latest`;

  return (
    <div>
      <fieldset className="mb-3 flex gap-4 text-[13px]">
        <legend className="sr-only">Package manager</legend>
        {PACKAGE_MANAGER_OPTIONS.map((option) => {
          const isSelected = option.value === packageManager;
          return (
            <label
              key={option.value}
              className={cn(
                "has-focus-visible:ring-tui-amber inline-flex cursor-pointer items-center gap-1.5 transition-colors has-focus-visible:ring-1",
                isSelected
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <input
                type="radio"
                name="init-package-manager"
                checked={isSelected}
                onChange={() => setPackageManager(option.value)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={cn(isSelected ? "text-tui-amber" : "opacity-50")}
              >
                {isSelected ? "●" : "○"}
              </span>
              {option.label}
            </label>
          );
        })}
      </fieldset>
      <div className="border-border bg-card flex items-center gap-3 border py-2 pr-2 pl-3">
        <code className="min-w-0 flex-1 truncate text-[13px] sm:text-sm">
          <span className="text-tui-lime select-none" aria-hidden>
            ${" "}
          </span>
          {command}
        </code>
        <CopyButton text={command} />
      </div>
    </div>
  );
}
