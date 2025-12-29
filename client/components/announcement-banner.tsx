import { Zap } from "lucide-react";
import { ANNOUNCEMENT_BANNER_CONFIG } from "@/lib/constants";

export function AnnouncementBanner() {
	return (
		<div className="fixed top-0 left-0 right-0 z-60 bg-linear-to-r from-primary/90 via-primary to-teal-500/90 py-2 px-4">
			<div className="container mx-auto flex items-center justify-center gap-2 text-sm font-medium text-primary-foreground">
				<Zap className="h-4 w-4" />
				<span>{ANNOUNCEMENT_BANNER_CONFIG.text}</span>
				<span className="text-primary-foreground/70">·</span>
				<span className="font-semibold">{ANNOUNCEMENT_BANNER_CONFIG.tagline}</span>
			</div>
		</div>
	);
}
