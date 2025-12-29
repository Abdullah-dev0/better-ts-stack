"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X } from "lucide-react";
import { CODE_COMPARISON_CONFIG } from "@/lib/constants";

export function CodeComparison() {
	const [hoveredToken, setHoveredToken] = useState<string | null>(null);

	return (
		<section className="py-24 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
			<div className="container mx-auto px-4">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white">
						{CODE_COMPARISON_CONFIG.title}
					</h2>
					<p className="text-zinc-500 max-w-2xl mx-auto">{CODE_COMPARISON_CONFIG.description}</p>
				</div>

				<div className="flex flex-col lg:flex-row gap-8 lg:gap-0 max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
					{/* Left Side: Unsafe */}
					<div className="flex-1 bg-[#1e1e1e] p-6 lg:border-r border-zinc-700">
						<div className="text-xs font-mono text-zinc-500 mb-4 flex items-center justify-between">
							<span>{CODE_COMPARISON_CONFIG.files.traditional.name}</span>
							<span className="text-red-400 flex items-center gap-1">
								<X size={12} /> {CODE_COMPARISON_CONFIG.files.traditional.label}
							</span>
						</div>
						<pre className="font-mono text-sm leading-relaxed overflow-x-auto text-zinc-300">
							<code>{CODE_COMPARISON_CONFIG.files.traditional.code}</code>
						</pre>
					</div>

					{/* Right Side: Safe (Nexus) */}
					<div className="flex-1 bg-[#1e1e1e] p-6 relative">
						<div className="text-xs font-mono text-zinc-500 mb-4 flex items-center justify-between">
							<span>{CODE_COMPARISON_CONFIG.files.nexus.name}</span>
							<span className="text-emerald-400 flex items-center gap-1">
								<Check size={12} /> {CODE_COMPARISON_CONFIG.files.nexus.label}
							</span>
						</div>
						<pre className="font-mono text-sm leading-relaxed overflow-x-auto text-zinc-300">
							<code>
								<span className="text-[#569cd6]">const</span> data = <span className="text-[#c586c0]">await</span>{" "}
								client.users.
								<span
									className="relative inline-block cursor-help text-[#dcdcaa] hover:bg-zinc-700 rounded px-0.5 transition-colors"
									onMouseEnter={() => setHoveredToken("get")}
									onMouseLeave={() => setHoveredToken(null)}>
									get
									<AnimatePresence>
										{hoveredToken === "get" && (
											<motion.div
												initial={{ opacity: 0, y: 5, scale: 0.95 }}
												animate={{ opacity: 1, y: 0, scale: 1 }}
												exit={{ opacity: 0, y: 5, scale: 0.95 }}
												className="absolute left-1/2 -translate-x-1/2 top-8 z-50 w-64 p-3 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 text-xs text-left">
												<div className="text-[#569cd6] mb-1">{CODE_COMPARISON_CONFIG.files.nexus.tooltip.method}</div>
												<div className="text-zinc-400">{CODE_COMPARISON_CONFIG.files.nexus.tooltip.hint}</div>
											</motion.div>
										)}
									</AnimatePresence>
								</span>
								.query()
								{"\n\n"}
								<span className="text-zinc-500">{"// ✅ Full autocompletion"}</span>
								{"\n"}
								console.log(data.user.name)
							</code>
						</pre>
					</div>
				</div>
			</div>
		</section>
	);
}
