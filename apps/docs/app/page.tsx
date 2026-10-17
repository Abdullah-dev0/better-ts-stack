import { Footer } from "@/components/footer";
import { ClosingCta } from "@/components/home/closing-cta";
import { Hero } from "@/components/home/hero";
import { ModuleList } from "@/components/home/module-list";
import { TestMatrix } from "@/components/home/test-matrix";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="home-page bg-background selection:bg-primary/30 min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <ModuleList />
        <TestMatrix />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  );
}
