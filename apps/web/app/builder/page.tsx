import { Suspense } from "react";

import type { Metadata } from "next";

import { StackBuilder } from "@/components/builder/stack-builder";
import { Navbar } from "@/components/navbar";
import { fromSearchParams, type SearchParams } from "@/lib/stack";

export const metadata: Metadata = {
  title: "Stack builder",
  description:
    "Pick a framework, a database, and extras, then copy the better-ts-stack command that generates the project.",
  alternates: { canonical: "/builder" },
};

// On wide screens the builder fills the screen and each pane scrolls
const GRID_CLASS =
  "grid xl:h-[calc(100svh-3rem)] xl:grid-cols-[22rem_minmax(0,1fr)] xl:*:min-h-0";

export default function BuilderPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <div className="home-page bg-background text-foreground selection:bg-tui-amber/30 min-h-screen pb-12 xl:pb-0">
      <Navbar />
      <main className={GRID_CLASS}>
        <Suspense fallback={<div className="min-h-[calc(100svh-3rem)]" />}>
          <SharedStack searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}

// Reads the choices a shared link carries
async function SharedStack({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { choices, projectName } = fromSearchParams(await searchParams);
  return (
    <StackBuilder initialChoices={choices} initialProjectName={projectName} />
  );
}
