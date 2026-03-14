import Link from "next/link";

import { Github, Twitter } from "lucide-react";

import { FOOTER_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-background relative overflow-hidden py-16">
      {/* Giant Background Text - behind content */}
      <div className="pointer-events-none z-0 flex items-start justify-center overflow-hidden select-none">
        <h1 className="text-foreground/[0.07] text-4xl font-black tracking-tight whitespace-nowrap md:text-[10rem]">
          BETTER TS STACK
        </h1>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold">
                {FOOTER_CONFIG.brand.logo}
              </div>
              <span className="text-foreground text-lg font-bold tracking-tight">
                {FOOTER_CONFIG.brand.name}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              © {FOOTER_CONFIG.copyright.year} {FOOTER_CONFIG.brand.name}.
              <br />
              {FOOTER_CONFIG.copyright.text}
            </p>
            <div className="flex gap-3 pt-2">
              {FOOTER_CONFIG.social.map((social, i) => {
                const Icon = social.icon === "Github" ? Github : Twitter;
                return (
                  <Link
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-2 transition-colors"
                  >
                    <Icon size={18} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Pages Column */}
          <div>
            <h4 className="text-foreground mb-4 font-semibold">Pages</h4>
            <ul className="text-muted-foreground space-y-3 text-sm">
              {FOOTER_CONFIG.pages.map((page, i) => (
                <li key={i}>
                  <Link
                    href={page.href}
                    className="hover:text-primary transition-colors"
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials Column */}
          <div>
            <h4 className="text-foreground mb-4 font-semibold">Socials</h4>
            <ul className="text-muted-foreground space-y-3 text-sm">
              {FOOTER_CONFIG.social.map((social, i) => (
                <li key={i}>
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {social.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-foreground mb-4 font-semibold">Resources</h4>
            <ul className="text-muted-foreground space-y-3 text-sm">
              {FOOTER_CONFIG.resources.map((resource, i) => (
                <li key={i}>
                  <Link
                    href={resource.href}
                    className="hover:text-primary transition-colors"
                  >
                    {resource.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
