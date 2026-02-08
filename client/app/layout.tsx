import { ThemeProvider } from "@/components/theme-provider";
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";


const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Nexus - Ship Type-Safety by Default",
	description:
		"Nexus scaffolds end-to-end type-safe TypeScript projects (Next.js, Prisma, tRPC, Tailwind) with zero-config. Eliminate boundary errors between your database and UI.",
	keywords: ["TypeScript", "Next.js", "Prisma", "tRPC", "type safety", "CLI tool", "scaffolding"],
};

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				// required styles
				className="flex flex-col min-h-screen"
			>
				<RootProvider>{children}</RootProvider>
			</body>
		</html>
	);
}	
