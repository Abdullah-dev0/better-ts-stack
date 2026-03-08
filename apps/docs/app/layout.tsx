import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { RootProvider } from "fumadocs-ui/provider/next";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "better-ts-stack - Ship Type-Safety by Default",
  description:
    "better-ts-stack scaffolds end-to-end type-safe TypeScript projects with zero-config. Eliminate boundary errors between your database and UI.",
  keywords: [
    "TypeScript",
    "Next.js",
    "Prisma",
    "tRPC",
    "type safety",
    "CLI tool",
    "scaffolding",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RootProvider>{children}</RootProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
