"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export const ThemeToggle = () => {
	const { setTheme, resolvedTheme } = useTheme();

	const mounted = useSyncExternalStore(
		() => () => {},
		() => true,
		() => false,
	);

	if (!mounted) {
		return null;
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
			className="glass-card rounded-lg cursor-pointer">
			{resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
		</Button>
	);
};
