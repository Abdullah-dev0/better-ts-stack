import Image from "next/image";

import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BookOpen } from "lucide-react";

import { Github } from "@/components/icons/github";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image
            src="/icon.png"
            alt=""
            width={20}
            height={20}
            className="rounded-sm"
          />
          <span className="font-mono text-[13px] font-medium">
            better-ts-stack
          </span>
        </>
      ),
      transparentMode: "top",
    },
    links: [
      {
        text: "Documentation",
        url: "/docs",
        icon: <BookOpen />,
        active: "nested-url",
      },
      {
        text: "GitHub",
        url: "https://github.com/Abdullah-dev0/better-ts-stack",
        icon: <Github />,
        external: true,
      },
    ],
    githubUrl: "https://github.com/Abdullah-dev0/better-ts-stack",
  };
}
