import { STATS } from "@/lib/constants";

export function Stats() {
	return (
		<section className="bg-white dark:bg-zinc-950 border-y border-zinc-200 dark:border-zinc-800">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800">
					{STATS.map((stat, i) => (
						<div
							key={i}
							className="py-8 md:py-12 flex flex-col items-center justify-center text-center group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
							<span className="text-4xl md:text-5xl font-bold tracking-tighter text-zinc-900 dark:text-white mb-2 group-hover:scale-110 transition-transform duration-300">
								{stat.value}
							</span>
							<span className="text-sm font-medium text-zinc-500 uppercase tracking-widest">{stat.label}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
