import Link from "next/link";

import { CopyButton } from "@/components/home/copy-button";
import { Pane } from "@/components/home/pane";
import { FOOTER_LINKS } from "@/lib/constants";

const COMMAND = "npx better-ts-stack";

export function Footer() {
  return (
    <Pane label="exit" index="07" className="border-border border-b">
      <div className="grid gap-8 px-5 py-8 sm:px-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <p className="text-foreground mb-4 text-2xl font-medium sm:text-3xl">
            ready when you are<span className="text-tui-amber">_</span>
          </p>
          <div className="border-border bg-card flex max-w-md items-center gap-3 border py-2 pr-2 pl-3">
            <code className="min-w-0 flex-1 truncate text-sm">
              <span className="text-tui-lime select-none" aria-hidden>
                ${" "}
              </span>
              {COMMAND}
            </code>
            <CopyButton text={COMMAND} />
          </div>
        </div>

        <div className="space-y-3 md:text-right">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] md:justify-end">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  {...(link.external && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                  className="text-muted-foreground hover:text-tui-lavender transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} better-ts-stack · open source under MIT
          </p>
        </div>
      </div>
    </Pane>
  );
}
