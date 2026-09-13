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

const title = "better-ts-stack - Ship Type-Safety by Default";
const description =
  "Scaffold end-to-end type-safe TypeScript projects with zero config. Build your backend, frontend, database, authentication, and Docker setup in one command.";

export const metadata: Metadata = {
  metadataBase: new URL("https://better-ts-stack.abdullahtech.me"),
  title: {
    default: title,
    template: "%s | better-ts-stack",
  },
  description,
  applicationName: "better-ts-stack",
  keywords: [
    "TypeScript",
    "Next.js",
    "React",
    "drizzle",
    "Prisma",
    "tRPC",
    "type safety",
    "CLI tool",
    "scaffolding",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "better-ts-stack",
    title,
    description,
    images: [
      {
        url: "/social-card.png",
        width: 1200,
        height: 630,
        alt: "better-ts-stack homepage showing its one-command TypeScript stack builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [
      {
        url: "/social-card.png",
        alt: "better-ts-stack homepage showing its one-command TypeScript stack builder",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
