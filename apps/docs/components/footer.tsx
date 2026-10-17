import Image from "next/image";
import Link from "next/link";

import { FOOTER_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-border relative overflow-hidden border-t">
      <div className="container mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <Image
              src="/icon.png"
              alt=""
              width={24}
              height={24}
              className="rounded-md"
            />
            <span className="text-foreground font-semibold tracking-tight">
              {FOOTER_CONFIG.brand.name}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {FOOTER_CONFIG.copyright.year} {FOOTER_CONFIG.brand.name}.{" "}
            {FOOTER_CONFIG.copyright.text}
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          {FOOTER_CONFIG.links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                {...(link.external && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Sized to the viewport so the wordmark always fits on one line */}
      <p
        aria-hidden
        className="text-foreground/[0.06] -mb-[0.22em] text-center text-[12.5vw] leading-none font-semibold tracking-[-0.05em] whitespace-nowrap select-none xl:text-[10.5rem]"
      >
        {FOOTER_CONFIG.brand.name}
      </p>
    </footer>
  );
}
