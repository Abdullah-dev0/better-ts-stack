import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import { cn } from "@/lib/utils";

import "./globals.css";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "better-ts-stack starter",
  description: "Generated with better-ts-stack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-sans antialiased", fontSans.variable, fontMono.variable)}
    >
      <body>{children}</body>
    </html>
  );
}
