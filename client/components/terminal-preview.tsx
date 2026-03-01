"use client";

import { useState, useEffect, useRef } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { MotionDiv, FadeInUp } from "./motion";

// ── Types ──────────────────────────────────────────────────────────────────────
type LineKind =
	| { kind: "cmd"; text: string }
	| { kind: "prompt"; question: string; answer: string; color?: string }
	| { kind: "output"; text: string; color?: string }
	| { kind: "spacer" };

// ── Script ─────────────────────────────────────────────────────────────────────
const SETUP_SCRIPT: LineKind[] = [
	{ kind: "cmd", text: "npx better-ts-stack" },
	{ kind: "spacer" },
	{ kind: "prompt", question: "? Project name:", answer: " my-app", color: "text-primary" },
	{
		kind: "prompt",
		question: "? Select backend:",
		answer: " Express + TypeScript",
		color: "text-primary",
	},
	{
		kind: "prompt",
		question: "? Select database:",
		answer: " Prisma + MongoDB",
		color: "text-primary",
	},
	{
		kind: "prompt",
		question: "? Include frontend?",
		answer: " Yes — Next.js + Tailwind",
		color: "text-primary",
	},
	{ kind: "prompt", question: "? Include Docker?", answer: " Yes", color: "text-primary" },
	{ kind: "prompt", question: "? Add JWT auth?", answer: " Yes", color: "text-primary" },
	{ kind: "spacer" },
	{
		kind: "output",
		text: "✓  Scaffolding type-safe project...",
		color: "text-emerald-400",
	},
	{ kind: "output", text: "✓  Express + TypeScript configured", color: "text-emerald-400" },
	{ kind: "output", text: "✓  Prisma schema generated", color: "text-emerald-400" },
	{ kind: "output", text: "✓  Next.js 16 + Tailwind ready", color: "text-emerald-400" },
	{ kind: "output", text: "✓  Docker Compose configured", color: "text-emerald-400" },
	{ kind: "output", text: "✓  JWT auth scaffolded", color: "text-emerald-400" },
	{ kind: "spacer" },
	{
		kind: "output",
		text: "→  Done! Run  cd my-app && npm run dev",
		color: "text-primary",
	},
];

// ── Char speeds ────────────────────────────────────────────────────────────────
const CMD_SPEED = 55; // ms per char for the initial command
const ANSWER_SPEED = 40; // ms per char for prompt answers
const LINE_PAUSE = 180; // pause between lines
const LOOP_PAUSE = 3200; // pause before restarting

// ── Helper: render a completed line ───────────────────────────────────────────
function ComputedLine({ line }: { line: LineKind }) {
	if (line.kind === "spacer") return <div className="h-2" />;
	if (line.kind === "cmd")
		return (
			<div className="flex items-center gap-2">
				<span className="text-primary font-mono text-sm select-none">❯</span>
				<span className="font-mono text-sm text-(--terminal-text,#e2e8f0)">{line.text}</span>
			</div>
		);
	if (line.kind === "prompt")
		return (
			<div className="font-mono text-xs flex flex-wrap gap-0">
				<span className="text-muted-foreground">{line.question}</span>
				<span className={line.color ?? "text-foreground"}>{line.answer}</span>
			</div>
		);
	return <div className={`font-mono text-xs ${line.color ?? "text-muted-foreground"}`}>{line.text}</div>;
}

// ── Static config ─────────────────────────────────────────────────────────────
const DOTS: { delay: number; cls: string }[] = [
	{ delay: 0.5, cls: "bg-destructive/80" },
	{ delay: 0.6, cls: "bg-accent-foreground/80" },
	{ delay: 0.7, cls: "bg-primary/80" },
];

// ── Main component ─────────────────────────────────────────────────────────────
export const TerminalPreview = () => {
	const [copied, setCopied] = useState(false);
	const [completedLines, setCompletedLines] = useState<LineKind[]>([]);
	const [currentPartial, setCurrentPartial] = useState<string>("");
	const [currentLineIdx, setCurrentLineIdx] = useState(0);
	const [charIdx, setCharIdx] = useState(0);
	const [phase, setPhase] = useState<"typing-cmd" | "typing-answer" | "idle">("typing-cmd");
	const bottomRef = useRef<HTMLDivElement>(null);

	const handleCopy = async () => {
		await navigator.clipboard.writeText("npx better-ts-stack");
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	// Auto-scroll as new content appears
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
	}, [completedLines.length, currentPartial]);

	// Animation driver
	useEffect(() => {
		if (currentLineIdx >= SETUP_SCRIPT.length) {
			// Script finished — wait then restart
			const t = setTimeout(() => {
				setCompletedLines([]);
				setCurrentPartial("");
				setCurrentLineIdx(0);
				setCharIdx(0);
				setPhase("typing-cmd");
			}, LOOP_PAUSE);
			return () => clearTimeout(t);
		}

		const line = SETUP_SCRIPT[currentLineIdx];

		// Spacer or output — push immediately after a small pause
		if (line.kind === "spacer" || line.kind === "output") {
			const t = setTimeout(() => {
				setCompletedLines((prev) => [...prev, line]);
				setCurrentLineIdx((i) => i + 1);
			}, LINE_PAUSE);
			return () => clearTimeout(t);
		}

		// Command line — type character by character
		if (line.kind === "cmd") {
			if (charIdx < line.text.length) {
				const t = setTimeout(() => {
					setCurrentPartial((p) => p + line.text[charIdx]);
					setCharIdx((c) => c + 1);
				}, CMD_SPEED);
				return () => clearTimeout(t);
			} else {
				// Done typing cmd — commit and move on
				const t = setTimeout(() => {
					setCompletedLines((prev) => [...prev, { kind: "cmd", text: line.text }]);
					setCurrentPartial("");
					setCharIdx(0);
					setCurrentLineIdx((i) => i + 1);
					setPhase("typing-answer");
				}, LINE_PAUSE);
				return () => clearTimeout(t);
			}
		}

		// Prompt line — type the answer part
		if (line.kind === "prompt") {
			if (phase !== "typing-answer") {
				// Schedule state updates asynchronously to avoid synchronous setState in effect
				const t = setTimeout(() => {
					setCurrentPartial(line.question);
					setPhase("typing-answer");
					setCharIdx(0);
				}, 0);
				return () => clearTimeout(t);
			}
			if (charIdx < line.answer.length) {
				const t = setTimeout(() => {
					setCurrentPartial(line.question + line.answer.slice(0, charIdx + 1));
					setCharIdx((c) => c + 1);
				}, ANSWER_SPEED);
				return () => clearTimeout(t);
			} else {
				// Done typing answer — commit
				const t = setTimeout(() => {
					setCompletedLines((prev) => [...prev, line]);
					setCurrentPartial("");
					setCharIdx(0);
					setCurrentLineIdx((i) => i + 1);
					setPhase("typing-answer");
				}, LINE_PAUSE);
				return () => clearTimeout(t);
			}
		}
	}, [currentLineIdx, charIdx, phase, completedLines]);

	// Determine what to display for the currently-typing line
	const activeLineEl = (() => {
		if (currentLineIdx >= SETUP_SCRIPT.length) return null;
		const line = SETUP_SCRIPT[currentLineIdx];
		if (line.kind === "cmd") {
			return (
				<div className="flex items-center gap-2">
					<span className="text-primary font-mono text-sm select-none">❯</span>
					<span className="font-mono text-sm text-(--terminal-text,#e2e8f0)">{currentPartial}</span>
					<MotionDiv
						animate={{ opacity: [1, 0, 1] }}
						transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut" }}
						className="inline-block w-1.5 h-4 bg-primary align-middle"
					/>
				</div>
			);
		}
		if (line.kind === "prompt" && currentPartial) {
			const partial = phase === "typing-answer" ? currentPartial : line.question;
			const questionPart = line.question;
			const answerPart = partial.slice(questionPart.length);
			return (
				<div className="font-mono text-xs flex flex-wrap gap-0 items-center">
					<span className="text-muted-foreground">{questionPart}</span>
					<span className={line.color ?? "text-foreground"}>{answerPart}</span>
					<MotionDiv
						animate={{ opacity: [1, 0, 1] }}
						transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut" }}
						className="inline-block w-1 h-3 bg-primary align-middle ml-0.5"
					/>
				</div>
			);
		}
		return null;
	})();

	return (
		<FadeInUp delay={0.4} duration={0.6} className="relative w-full max-w-2xl mx-auto">
			<MotionDiv
				whileHover={{ scale: 1.01 }}
				transition={{ duration: 0.2 }}
				className="relative glass-panel terminal-glow rounded-xl overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
					<div className="flex items-center gap-2">
						<div className="flex gap-1.5">
							{DOTS.map(({ delay, cls }) => (
								<MotionDiv
									key={cls}
									initial={{ opacity: 0, scale: 0 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay, duration: 0.3 }}
									className={`w-3 h-3 rounded-full ${cls}`}
								/>
							))}
						</div>
						<span className="text-xs text-muted-foreground font-mono ml-2">terminal</span>
					</div>
					<Terminal className="w-4 h-4 text-muted-foreground" />
				</div>

				{/* Body */}
				<div className="bg-terminal-bg p-5 min-h-[220px] max-h-[340px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border space-y-0.5">
					{completedLines.map((line, i) => (
						<ComputedLine key={i} line={line} />
					))}
					{activeLineEl}
					<div ref={bottomRef} />
				</div>

				{/* Copy button */}
				<MotionDiv
					initial={{ opacity: 0, scale: 0 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 1, duration: 0.3 }}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}>
					<button
						onClick={handleCopy}
						title="Copy command"
						className="absolute top-14 right-4 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors group">
						<MotionDiv animate={copied ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.3 }}>
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
