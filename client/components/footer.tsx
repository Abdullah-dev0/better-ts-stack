import { Github, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
	return (
		<footer className="bg-background py-16 relative overflow-hidden">
			{/* Giant Background Text - behind content */}
			<div className="flex items-start justify-center pointer-events-none select-none overflow-hidden z-0">
				<h1 className="text-[6rem] md:text-[10rem] font-black text-muted/60 whitespace-nowrap tracking-tight">
					BETTER TS STACK
				</h1>
			</div>

			<div className="container mx-auto px-6 py-7">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-10">
					{/* Brand Column */}
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
								ts
							</div>
							<span className="font-bold text-lg tracking-tight text-foreground">ts-better-stack</span>
						</div>
						<p className="text-sm text-muted-foreground">
							© {new Date().getFullYear()} ts-better-stack.
							<br />
							Open source under MIT.
						</p>
						<div className="flex gap-3 pt-2">
							<Link
								href="https://github.com"
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
								<Github size={18} />
							</Link>
							<Link
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
								<Twitter size={18} />
							</Link>
						</div>
					</div>

					{/* Pages Column */}
					<div>
						<h4 className="font-semibold text-foreground mb-4">Pages</h4>
						<ul className="space-y-3 text-sm text-muted-foreground">
							<li>
								<Link href="/" className="hover:text-primary transition-colors">
									Home
								</Link>
							</li>
							<li>
								<Link href="#modules" className="hover:text-primary transition-colors">
									Features
								</Link>
							</li>
							<li>
								<Link href="#architecture" className="hover:text-primary transition-colors">
									Architecture
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-primary transition-colors">
									Docs
								</Link>
							</li>
						</ul>
					</div>

					{/* Socials Column */}
					<div>
						<h4 className="font-semibold text-foreground mb-4">Socials</h4>
						<ul className="space-y-3 text-sm text-muted-foreground">
							<li>
								<Link
									href="https://github.com"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-primary transition-colors">
									GitHub
								</Link>
							</li>
							<li>
								<Link
									href="https://twitter.com"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-primary transition-colors">
									Twitter
								</Link>
							</li>
						</ul>
					</div>

					{/* Resources Column */}
					<div>
						<h4 className="font-semibold text-foreground mb-4">Resources</h4>
						<ul className="space-y-3 text-sm text-muted-foreground">
							<li>
								<Link href="#" className="hover:text-primary transition-colors">
									Documentation
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-primary transition-colors">
									Getting Started
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-primary transition-colors">
									Examples
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</footer>
	);
}
