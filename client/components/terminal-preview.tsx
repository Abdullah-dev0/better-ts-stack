"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { TERMINAL_CONFIG } from "@/lib/constants";
import { MotionDiv, MotionSpan, FadeInUp } from "./motion";

export const TerminalPreview = () => {
	const [copied, setCopied] = useState(false);
	const [typingComplete, setTypingComplete] = useState(false);
	const [displayedText, setDisplayedText] = useState("");
	const command = TERMINAL_CONFIG.command;

	useEffect(() => {
		let currentIndex = 0;
		const typingInterval = setInterval(() => {
			if (currentIndex <= command.length) {
				setDisplayedText(command.slice(0, currentIndex));
				currentIndex++;
			} else {
				clearInterval(typingInterval);
				setTypingComplete(true);
			}
		}, TERMINAL_CONFIG.typingSpeed);
		return () => clearInterval(typingInterval);
	}, [command]);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(command);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<FadeInUp delay={0.3} duration={0.6} className="relative w-full max-w-2xl mx-auto">
			{/* Terminal container */}
			<div className="relative glass-panel terminal-glow rounded-xl overflow-hidden">
				{/* Terminal header */}
				<div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
					<div className="flex items-center gap-2">
						<div className="flex gap-1.5">
							<div className="w-3 h-3 rounded-full bg-destructive/80" />
							<div className="w-3 h-3 rounded-full bg-yellow-500/80" />
							<div className="w-3 h-3 rounded-full bg-primary/80" />
						</div>
						<span className="text-xs text-muted-foreground font-mono ml-2">terminal</span>
					</div>
					<Terminal className="w-4 h-4 text-muted-foreground" />
				</div>

				{/* Terminal body */}
				<div className="bg-terminal-bg p-6">
					<div className="flex items-center gap-3">
						<span className="text-primary font-mono text-sm">❯</span>
						<div className="flex-1">
							<span className="text-terminal-text font-mono text-sm">{displayedText}</span>
							<MotionSpan
								animate={{ opacity: [1, 0, 1] }}
								transition={{ duration: 1, repeat: Infinity }}
								className="inline-block w-2 h-4 bg-terminal-text ml-0.5 align-middle"
							/>
						</div>
					</div>

					{/* Output lines */}
					{typingComplete && (
						<MotionDiv
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.4 }}
							className="mt-4 space-y-1">
							{TERMINAL_CONFIG.output.map((line, i) => {
								const isLast = i === TERMINAL_CONFIG.output.length - 1;
								return (
									<p
										key={i}
										className={`font-mono text-xs ${isLast ? "mt-2 " : ""}${isLast ? "text-primary" : "text-muted-foreground"}`}>
										<span className={line.color}>{line.icon}</span> {line.text}
									</p>
								);
							})}
						</MotionDiv>
					)}
				</div>

				{/* Copy button */}
				<button
					onClick={handleCopy}
					className="absolute top-14 right-4 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors group">
					{copied ? (
						<Check className="w-4 h-4 text-primary" />
					) : (
						<Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
					)}
				</button>
			</div>
		</FadeInUp>
	);
};
