import { HeroSection } from "@/components/hero";
import { ArchitectureGrid } from "@/components/architecture-grid";
import { CorrectnessSection } from "@/components/correctness-section";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Home() {
	return (
		<main className="min-h-screen bg-background selection:bg-primary/30">
			<Navbar />
			<HeroSection />
			<ArchitectureGrid />
			<CorrectnessSection />
			<Footer />
		</main>
	);
}
