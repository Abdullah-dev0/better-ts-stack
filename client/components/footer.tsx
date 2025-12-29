import { Github, Twitter } from "lucide-react";
import Link from "next/link";
import { FOOTER_CONFIG } from "@/lib/constants";

export function Footer() {
	return (
		<footer className="bg-background py-16 relative overflow-hidden">
			{/* Giant Background Text - behind content */}
			<div className="flex items-start justify-center pointer-events-none select-none overflow-hidden z-0">
				<h1 className="text-[6rem] md:text-[10rem] font-black text-muted/60 whitespace-nowrap tracking-tight">
					BETTER TS STACK
				</h1>
			</div>

			<div className="container mx-auto px-6 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-10">
					{/* Brand Column */}
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
								{FOOTER_CONFIG.brand.logo}
							</div>
							<span className="font-bold text-lg tracking-tight text-foreground">{FOOTER_CONFIG.brand.name}</span>
						</div>
						<p className="text-sm text-muted-foreground">
							© {FOOTER_CONFIG.copyright.year} {FOOTER_CONFIG.brand.name}.
							<br />
							{FOOTER_CONFIG.copyright.text}
						</p>
						<div className="flex gap-3 pt-2">
							{FOOTER_CONFIG.social.map((social, i) => {
								const Icon = social.icon === "Github" ? Github : Twitter;
								return (
									<Link
										key={i}
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
										<Icon size={18} />
									</Link>
								);
							})}
						</div>
					</div>

					{/* Pages Column */}
					<div>
						<h4 className="font-semibold text-foreground mb-4">Pages</h4>
						<ul className="space-y-3 text-sm text-muted-foreground">
							{FOOTER_CONFIG.pages.map((page, i) => (
								<li key={i}>
									<Link href={page.href} className="hover:text-primary transition-colors">
										{page.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Socials Column */}
					<div>
						<h4 className="font-semibold text-foreground mb-4">Socials</h4>
						<ul className="space-y-3 text-sm text-muted-foreground">
							{FOOTER_CONFIG.social.map((social, i) => (
								<li key={i}>
									<Link href={social.href} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
										{social.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Resources Column */}
					<div>
						<h4 className="font-semibold text-foreground mb-4">Resources</h4>
						<ul className="space-y-3 text-sm text-muted-foreground">
							{FOOTER_CONFIG.resources.map((resource, i) => (
								<li key={i}>
									<Link href={resource.href} className="hover:text-primary transition-colors">
										{resource.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</footer>
	);
}
