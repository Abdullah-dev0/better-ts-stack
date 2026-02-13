import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BookOpen, Github } from "lucide-react";

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: "Better-TS-Stack",
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
