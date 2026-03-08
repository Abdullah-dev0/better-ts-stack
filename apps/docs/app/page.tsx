import { ArchitectureGrid } from "@/components/architecture-grid";
import { CorrectnessSection } from "@/components/correctness-section";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <main className="bg-background selection:bg-primary/30 min-h-screen">
      <Navbar />
      <HeroSection />
      <ArchitectureGrid />
      <CorrectnessSection />
      <Footer />
    </main>
  );
}
