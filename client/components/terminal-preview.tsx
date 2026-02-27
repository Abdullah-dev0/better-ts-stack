"use client";

import { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { TERMINAL_CONFIG } from "@/lib/constants";
import { MotionDiv, FadeInUp } from "./motion";

export const TerminalPreview = () => {
	const [copied, setCopied] = useState(false);
	const command = TERMINAL_CONFIG.command;

	const handleCopy = async () => {
		await navigator.clipboard.writeText(command);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<FadeInUp delay={0.4} duration={0.6} className="relative w-full max-w-2xl mx-auto">
			{/* Terminal container */}
			<MotionDiv
				whileHover={{ scale: 1.01 }}
				transition={{ duration: 0.2 }}
				className="relative glass-panel terminal-glow rounded-xl overflow-hidden">
				{/* Terminal header */}
				<div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
					<div className="flex items-center gap-2">
						<div className="flex gap-1.5">
							<MotionDiv
								initial={{ opacity: 0, scale: 0 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.5, duration: 0.3 }}
								className="w-3 h-3 rounded-full bg-destructive/80"
							/>
							<MotionDiv
								initial={{ opacity: 0, scale: 0 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.6, duration: 0.3 }}
								className="w-3 h-3 rounded-full bg-accent-foreground/80"
							/>
							<MotionDiv
								initial={{ opacity: 0, scale: 0 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.7, duration: 0.3 }}
								className="w-3 h-3 rounded-full bg-primary/80"
							/>
						</div>
						<span className="text-xs text-muted-foreground font-mono ml-2">terminal</span>
					</div>
					<Terminal className="w-4 h-4 text-muted-foreground" />
				</div>

				{/* Terminal body */}
				<div className="bg-terminal-bg p-6">
					<MotionDiv
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.8, duration: 0.4 }}
						className="flex items-center gap-3">
						<span className="text-primary font-mono text-sm">❯</span>
						<div className="flex-1">
							<span className="text-terminal-text font-mono text-sm">{command}</span>
							<MotionDiv
								animate={{ opacity: [1, 0, 1] }}
								transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
								className="inline-block w-2 h-4 bg-terminal-text ml-0.5 align-middle"
							/>
						</div>
					</MotionDiv>

					{/* Output lines */}
					<div className="mt-4 space-y-1">
						{TERMINAL_CONFIG.output.map((line, i) => {
							const isLast = i === TERMINAL_CONFIG.output.length - 1;
							return (
								<MotionDiv
									key={i}
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 1.2 + i * 0.15, duration: 0.3 }}
									className={`font-mono text-xs ${isLast ? "mt-2 " : ""}${
										isLast ? "text-primary" : "text-muted-foreground"
									}`}>
									<span className={line.color}>{line.icon}</span> {line.text}
								</MotionDiv>
							);
						})}
					</div>
				</div>

				{/* Copy button */}
				<MotionDiv
					initial={{ opacity: 0, scale: 0 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 1.8, duration: 0.3 }}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}>
					<button
						onClick={handleCopy}
						className="absolute top-14 right-4 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors group">
						<MotionDiv animate={copied ? { scale: [1, 1.2, 1], rotate: [0, 0, 0] } : {}} transition={{ duration: 0.3 }}>
							{copied ? (
								<Check className="w-4 h-4 text-primary" />
							) : (
								<Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
							)}
						</MotionDiv>
					</button>
				</MotionDiv>
			</MotionDiv>
		</FadeInUp>
	);
};
