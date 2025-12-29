"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Database, Layout, AlertTriangle, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CORE_ARCHITECTURE_CONFIG } from "@/lib/constants";

export function CoreArchitecture() {
	return (
		<section className="py-32 relative overflow-hidden">
			{/* Background Gradients */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
				<div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
				<div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
			</div>

			<div className="container mx-auto px-4">
				<div className="flex flex-col lg:flex-row gap-16 items-center">
					{/* Left: Text Content */}
					<div className="flex-1 space-y-8">
						<div>
							<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 mb-6">
								{CORE_ARCHITECTURE_CONFIG.badge.indicator && (
									<div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
								)}
								{CORE_ARCHITECTURE_CONFIG.badge.text}
							</div>
							<h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
								{CORE_ARCHITECTURE_CONFIG.title.main} <br />
								<span className="text-emerald-400">{CORE_ARCHITECTURE_CONFIG.title.accent}</span>
							</h2>
							<p className="text-lg text-zinc-400 leading-relaxed">{CORE_ARCHITECTURE_CONFIG.description}</p>
						</div>

						<div className="space-y-6">
							<p className="text-zinc-400">{CORE_ARCHITECTURE_CONFIG.details}</p>

							<div className="flex items-center gap-8">
								<div className="flex flex-col">
									<span className="text-3xl font-bold text-white mb-1">
										{CORE_ARCHITECTURE_CONFIG.stats.runtimeErrors.value}
									</span>
									<span className="text-xs uppercase tracking-wider text-zinc-500">
										{CORE_ARCHITECTURE_CONFIG.stats.runtimeErrors.label}
									</span>
								</div>
								<div className="w-px h-12 bg-zinc-800" />
								<div className="flex flex-col">
									<span className="text-3xl font-bold text-emerald-400 mb-1">
										{CORE_ARCHITECTURE_CONFIG.stats.compileTimeSafety.value}
									</span>
									<span className="text-xs uppercase tracking-wider text-zinc-500">
										{CORE_ARCHITECTURE_CONFIG.stats.compileTimeSafety.label}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Right: Interactive Simulation */}
					<div className="flex-1 w-full max-w-xl">
						<InteractiveSim />
					</div>
				</div>
			</div>
		</section>
	);
}

function InteractiveSim() {
	const [mode, setMode] = useState<"legacy" | "nexus">("nexus");
	const [columnName, setColumnName] = useState("email");
	const [dbState, setDbState] = useState<"synced" | "changed">("synced");
	const [isRunning, setIsRunning] = useState(false);
	const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

	const handleUpdateColumn = () => {
		setDbState("changed");
		setColumnName("user_email");
		// Reset status when DB changes
		setStatus("idle");
	};

	const handleReset = () => {
		setDbState("synced");
		setColumnName("email");
		setStatus("idle");
		setIsRunning(false);
	};

	const handleRun = () => {
		setIsRunning(true);
		setTimeout(() => {
			setIsRunning(false);
			if (mode === "legacy") {
				// Legacy: Fails at runtime (simulated)
				setStatus(dbState === "changed" ? "error" : "success");
			} else {
				// Nexus: Fails at build time if changed (which we simulate visually before run, but for the button action we show success if matches)
				// Actually, Nexus fails IMMEDIATELY.
				setStatus("success");
			}
		}, 1000);
	};

	// Derived state for visual feedback
	const buildStatus = mode === "nexus" && dbState === "changed" ? "failing" : "passing";

	return (
		<div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
			{/* Controls */}
				<div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
				<div className="flex items-center gap-2 bg-black/50 p-1 rounded-lg border border-zinc-800">
					<button
						onClick={() => {
							setMode("legacy");
							handleReset();
						}}
						className={cn(
							"px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
							mode === "legacy" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300",
						)}>
						{CORE_ARCHITECTURE_CONFIG.simulation.modes.legacy}
					</button>
					<button
						onClick={() => {
							setMode("nexus");
							handleReset();
						}}
						className={cn(
							"px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
							mode === "nexus" ? "bg-emerald-500/20 text-emerald-400" : "text-zinc-500 hover:text-zinc-300",
						)}>
						{CORE_ARCHITECTURE_CONFIG.simulation.modes.nexus}
					</button>
				</div>
				<Button variant="ghost" size="icon" onClick={handleReset} title="Reset">
					<RefreshCw size={14} />
				</Button>
			</div>

			<div className="p-8 space-y-8 relative">
				{/* Database Node */}
				<div className="flex items-center justify-between relative z-10">
					<Node
						icon={Database}
						label="Database"
						status={dbState === "changed" ? "modified" : "normal"}
						content={`table users { id, ${columnName} }`}
					/>
					<div className="flex-1 h-px bg-zinc-800 mx-4 relative">
						<motion.div
							className="absolute inset-0 bg-zinc-600"
							initial={{ scaleX: 0, originX: 0 }}
							animate={{ scaleX: 1 }}
							transition={{ duration: 0.5 }}
						/>
						{mode === "nexus" && (
							<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 bg-zinc-900 border border-zinc-700 rounded text-[10px] text-zinc-400">
								Introspected
							</div>
						)}
					</div>
					{/* API/Backend Node (Hidden for simplicity or merged) */}
				</div>

				{/* Arrow flows */}
				<div className="flex justify-center -my-2">
					<div className={cn("h-16 w-px", mode === "nexus" ? "bg-emerald-500/50" : "bg-zinc-800")} />
				</div>

				{/* Frontend Node */}
				<div className="flex items-center justify-between relative z-10">
					<Node
						icon={Layout}
						label="Frontend"
						status={buildStatus === "failing" ? "error" : "normal"}
						content={
							<div className="flex items-center gap-1">
								<span>user.</span>
								<span
									className={cn(
										buildStatus === "failing" ? "text-red-400 underline decoration-wavy" : "text-zinc-300",
									)}>
									email
								</span>
							</div>
						}
					/>
				</div>

				{/* Simulation Actions */}
				<div className="mt-8 p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/50 flex flex-col gap-4">
					<div className="flex items-center justify-between text-xs text-zinc-500">
						<span>{CORE_ARCHITECTURE_CONFIG.simulation.labels.action}</span>
						<span>{CORE_ARCHITECTURE_CONFIG.simulation.labels.result}</span>
					</div>

					<div className="flex gap-2">
						<Button
							variant="destructive"
							size="sm"
							className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700"
							onClick={handleUpdateColumn}
							disabled={dbState === "changed"}>
							{CORE_ARCHITECTURE_CONFIG.simulation.actions.renameColumn}
						</Button>
					</div>

					<div className="h-px bg-zinc-800" />

					<div className="flex items-center justify-between">
						<div className="text-sm font-medium text-white">
							{mode === "legacy"
								? CORE_ARCHITECTURE_CONFIG.simulation.labels.runtimeStatus
								: CORE_ARCHITECTURE_CONFIG.simulation.labels.buildStatus}
						</div>
						<AnimatePresence mode="wait">
							{mode === "nexus" ? (
								buildStatus === "failing" ? (
									<motion.div
										key="build-fail"
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										className="flex items-center gap-2 text-red-400 text-sm">
										<XCircle size={16} />
										<span>{CORE_ARCHITECTURE_CONFIG.simulation.status.buildFailed}</span>
									</motion.div>
								) : (
									<motion.div
										key="build-pass"
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										className="flex items-center gap-2 text-emerald-400 text-sm">
										<CheckCircle size={16} />
										<span>{CORE_ARCHITECTURE_CONFIG.simulation.status.typeSafe}</span>
									</motion.div>
								)
							) : // Legacy Mode
							status === "error" ? (
								<motion.div
									key="runtime-fail"
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									className="flex items-center gap-2 text-red-400 text-sm">
									<AlertTriangle size={16} />
									<span>{CORE_ARCHITECTURE_CONFIG.simulation.status.runtimeCrash}</span>
								</motion.div>
							) : (
								<div className="text-zinc-500 text-sm italic">
									{status === "idle" && dbState === "changed"
										? CORE_ARCHITECTURE_CONFIG.simulation.status.waiting
										: CORE_ARCHITECTURE_CONFIG.simulation.status.appRunning}
								</div>
							)}
						</AnimatePresence>
					</div>

					{mode === "legacy" && dbState === "changed" && status === "idle" && (
						<Button onClick={handleRun} disabled={isRunning} className="w-full" size="sm" variant="default">
							{isRunning
								? CORE_ARCHITECTURE_CONFIG.simulation.actions.running
								: CORE_ARCHITECTURE_CONFIG.simulation.actions.simulateRequest}
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

function Node({
	icon: Icon,
	label,
	status,
	content,
}: {
	icon: React.ElementType;
	label: string;
	status: string;
	content: React.ReactNode;
}) {
	return (
		<motion.div
			className={cn(
				"p-4 rounded-xl border w-full transition-colors relative overflow-hidden",
				status === "error"
					? "bg-red-500/10 border-red-500/50"
					: status === "modified"
					? "bg-blue-500/10 border-blue-500/50"
					: "bg-zinc-900 border-zinc-800",
			)}
			layout>
			<div className="flex items-center gap-3 mb-2">
				<div
					className={cn(
						"p-1.5 rounded-md",
						status === "error" ? "bg-red-500/20 text-red-400" : "bg-zinc-800 text-zinc-400",
					)}>
					<Icon size={14} />
				</div>
				<span className="text-sm font-medium text-zinc-200">{label}</span>
			</div>
			<div className="font-mono text-xs text-zinc-400 bg-zinc-950/50 p-2 rounded border border-zinc-800/50">
				{content}
			</div>
		</motion.div>
	);
}
