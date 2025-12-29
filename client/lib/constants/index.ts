// Icons are now referenced by name strings for server/client component compatibility
// Icon components are imported and mapped in client components

// ============================================================================
// NAVBAR CONSTANTS
// ============================================================================
export interface NavbarLink {
	href: string;
	label: string;
	external: boolean;
}

export const NAVBAR_CONFIG = {
	brand: {
		name: "better-ts-stack",
		logo: "TS",
	},
	banner: {
		icon: "Zap",
		text: "Built by developers who hate boilerplate",
		tagline: "Ship faster, type safer",
	},
	links: [
		{ href: "#features", label: "Modules", external: false },
		{ href: "#architecture", label: "Architecture", external: false },
		{ href: "https://github.com/abdullah-dev0", label: "GitHub", external: true },
	] as const satisfies readonly NavbarLink[],
	cta: {
		text: "Get Started",
	},
} as const;

// ============================================================================
// HERO SECTION CONSTANTS
// ============================================================================
export const HERO_CONFIG = {
	badge: {
		icon: "Sparkles",
		text: "Full-Stack CLI Tool",
	},
	headline: {
		main: "Ship Type-Safety",
		accent: "by Default.",
	},
	subheadline:
		"ts-better-stack scaffolds production-ready TypeScript projects with modular architecture—Prisma, MongoDB, Docker, and more. Zero configuration required.",
	cta: {
		primary: {
			text: "Get Started",
			icon: "ArrowRight",
		},
		secondary: {
			text: "View Documentation",
		},
	},
} as const;

// ============================================================================
// ARCHITECTURE GRID CONSTANTS
// ============================================================================
export interface Feature {
	icon: string; // Icon name as string for server/client component compatibility
	title: string;
	description: string;
	color: string;
	badge: string | null;
	size: "normal" | "large";
}

export const ARCHITECTURE_FEATURES: Feature[] = [
	{
		icon: "Server",
		title: "Backend Module",
		description:
			"TypeScript backend with Express or Fastify. Fully type-safe REST API with automatic validation using Zod.",
		color: "text-purple-400",
		badge: null,
		size: "large",
	},
	{
		icon: "Database",
		title: "Prisma ORM",
		description: "Type-safe database access with auto-generated types. Seamless integration with the backend module.",
		color: "text-orange-400",
		badge: null,
		size: "normal",
	},
	{
		icon: "Box",
		title: "MongoDB + Mongoose",
		description: "Better MongoDB support with Mongoose schemas. Full type inference for documents.",
		color: "text-primary",
		badge: null,
		size: "normal",
	},
	{
		icon: "Container",
		title: "Docker Ready",
		description: "Pre-configured Docker Compose setup. One command to spin up your entire dev environment.",
		color: "text-blue-400",
		badge: null,
		size: "normal",
	},
	{
		icon: "Layout",
		title: "Frontend Module",
		description: "Next.js/Vite Integration coming soon. Pre-configured with Tailwind and key libraries.",
		color: "text-muted-foreground",
		badge: "Coming Soon",
		size: "large",
	},
	{
		icon: "Shield",
		title: "Auth Module",
		description: "JWT authentication with session management. Role-based access control out of the box.",
		color: "text-primary",
		badge: "Coming Soon",
		size: "normal",
	},
	{
		icon: "Zap",
		title: "Edge Functions",
		description: "Deploy to Vercel Edge, Cloudflare Workers, or any edge runtime with ease.",
		color: "text-teal-400",
		badge: "Coming Soon",
		size: "normal",
	},
];

export const ARCHITECTURE_SECTION = {
	badge: "Modular Architecture",
	title: {
		main: "Everything You Need.",
		accent: "Nothing You Don't.",
	},
	description: "Pick the modules you need. Each one is designed to work perfectly alone or together.",
} as const;

// ============================================================================
// CORRECTNESS SECTION CONSTANTS
// ============================================================================
export interface StackItem {
	icon: string; // Icon name as string for server/client component compatibility
	label: string;
	sub: string;
	color: string;
}

export const STACK_ITEMS: StackItem[] = [
	{ icon: "Database", label: "Data Layer", sub: "MongoDB + Prisma + Mongoose", color: "text-primary" },
	{ icon: "Layers", label: "Business Logic", sub: "TypeScript + Zod + better-auth", color: "text-purple-400" },
	{ icon: "Server", label: "API Layer", sub: "Express + TypeScript", color: "text-blue-400" },
	{ icon: "UploadCloud", label: "Deployment", sub: "Docker + CI/CD", color: "text-orange-400" },
];

export interface FeatureCard {
	icon: string; // Icon name as string for server/client component compatibility
	title: string;
	description: string;
}

export const CORRECTNESS_FEATURE_CARDS: FeatureCard[] = [
	{
		icon: "Code2",
		title: "Correctness First",
		description: "If it compiles, it works. Catch errors at build time, not in production.",
	},
	{
		icon: "GitBranch",
		title: "Modular Design",
		description: "Use only what you need. Each module is independent and composable.",
	},
	{
		icon: "Zap",
		title: "Zero Overhead",
		description: "No runtime type checking. All safety happens at compile time.",
	},
];

export const CORRECTNESS_SECTION = {
	badge: "How It Works",
	title: "Built for Correctness",
	description: "Every layer is type-safe. Every connection is validated. No more guessing—just shipping.",
	typesPreserved: "Types preserved across all layers",
	comparison: {
		bad: {
			label: "Manual Setup",
			description: "Hours of config, auth headaches, type mismatches.",
		},
		good: {
			label: "ts-better-stack",
			description: "One command, full stack, ready to ship.",
		},
	},
	templates: {
		title: "Ready-Made Templates. Zero Setup.",
		description:
			"Pick your stack, choose your package manager (npm, yarn, pnpm, bun), and get a production-ready TypeScript project with Express backend, better-auth authentication, and end-to-end type safety. No configuration needed.",
	},
} as const;

// ============================================================================
// TERMINAL PREVIEW CONSTANTS
// ============================================================================
export const TERMINAL_CONFIG = {
	command: "npx ts-better-stack@latest init",
	typingSpeed: 80, // milliseconds per character
	output: [
		{ icon: "✓", text: "Scaffolding your type-safe project...", color: "text-primary" },
		{ icon: "✓", text: "TypeScript + Prisma + MongoDB configured", color: "text-primary" },
		{ icon: "✓", text: "Docker compose ready", color: "text-primary" },
		{ icon: "→", text: "Done in 2.4s. Run `cd my-app && npm run dev`", color: "text-primary" },
	],
} as const;

// ============================================================================
// STATS CONSTANTS
// ============================================================================
export const STATS = [
	{ label: "Type-Latencies", value: "0ms" },
	{ label: "Lighthouse Score", value: "100/100" },
	{ label: "Bundle Overhead", value: "2.4kb" },
] as const;

// ============================================================================
// FOOTER CONSTANTS
// ============================================================================
export const FOOTER_CONFIG = {
	brand: {
		name: "ts-better-stack",
		logo: "ts",
	},
	copyright: {
		year: new Date().getFullYear(),
		text: "Open source under MIT.",
	},
	social: [
		{ href: "https://github.com", icon: "Github", label: "GitHub" },
		{ href: "https://twitter.com", icon: "Twitter", label: "Twitter" },
	],
	pages: [
		{ href: "/", label: "Home" },
		{ href: "#modules", label: "Features" },
		{ href: "#architecture", label: "Architecture" },
		{ href: "#", label: "Docs" },
	],
	resources: [
		{ href: "#", label: "Documentation" },
		{ href: "#", label: "Getting Started" },
		{ href: "#", label: "Examples" },
	],
} as const;

// ============================================================================
// MOBILE CTA CONSTANTS
// ============================================================================
export const MOBILE_CTA_CONFIG = {
	buttonText: "Get Started",
	scrollThreshold: 300, // pixels
} as const;

// ============================================================================
// ANNOUNCEMENT BANNER CONSTANTS
// ============================================================================
export const ANNOUNCEMENT_BANNER_CONFIG = {
	icon: "Zap",
	text: "Built by developers who hate boilerplate",
	tagline: "Ship faster, type safer",
} as const;

// ============================================================================
// CORE ARCHITECTURE CONSTANTS
// ============================================================================
export const CORE_ARCHITECTURE_CONFIG = {
	badge: {
		text: "Core Architecture",
		indicator: true,
	},
	title: {
		main: "Stop guessing.",
		accent: "Start knowing.",
	},
	description:
		"Built on the principles of correctness and performance. ts-better-stack isn't just a starter template; it's a philosophy.",
	details:
		"Traditional API layers break the type chain. ts-better-stack preserves it. If you change a column name in your database, your frontend build fails immediately. No more runtime surprises.",
	stats: {
		runtimeErrors: {
			value: "0",
			label: "Runtime Errors",
		},
		compileTimeSafety: {
			value: "100%",
			label: "Compile-time Safety",
		},
	},
	simulation: {
		modes: {
			legacy: "Traditional",
			nexus: "ts-better-stack",
		},
		actions: {
			renameColumn: "Rename Column (migrate)",
			simulateRequest: "Simulate User Request",
			running: "Running...",
		},
		status: {
			buildFailed: "Build Failed",
			typeSafe: "Type-Safe",
			runtimeCrash: "Runtime Crash",
			appRunning: "App Running",
			waiting: "Waiting for request...",
		},
		labels: {
			runtimeStatus: "Runtime Status",
			buildStatus: "Build Status",
			action: "Action",
			result: "Result",
		},
	},
} as const;

// ============================================================================
// CODE COMPARISON CONSTANTS
// ============================================================================
export const CODE_COMPARISON_CONFIG = {
	title: "Type-Flow Visualization",
	description: "See the difference. Nexus bridges the gap between your backend and frontend.",
	files: {
		traditional: {
			name: "traditional-fetch.ts",
			label: "Unsafe",
			code: `const data = await fetch('/api/users').then(r => r.json())

// ❌ No type inference
console.log(data.user.nmae)`,
		},
		nexus: {
			name: "nexus-client.ts",
			label: "Type-Safe",
			code: `const data = await client.users.get.query()

// ✅ Full autocompletion
console.log(data.user.name)`,
			tooltip: {
				method: "method getUsers(): Promise<User[]>",
				hint: "Go to definition (Ctrl + Click)",
			},
		},
	},
} as const;
