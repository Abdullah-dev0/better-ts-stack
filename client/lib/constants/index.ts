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
		text: "Opinionated in the right places. Flexible where it matters.",
		tagline: "Build fast. Refactor fearlessly. Deploy confidently.",
	},
	links: [
		{ href: "/docs", label: "Docs", external: false },
		{ href: "https://github.com/abdullah-dev0", label: "GitHub", external: true },
	] as const satisfies readonly NavbarLink[],
	cta: {
		text: "Get Started",
		href: "/docs",
	},
} as const;

// ============================================================================
// HERO SECTION CONSTANTS
// ============================================================================
export const HERO_CONFIG = {
	badge: {
		icon: "Sparkles",
		text: "Bold & Confident",
	},
	headline: {
		main: "Type-safe. Production-ready.",
		accent: "No nonsense.",
	},
	subheadline:
		"From one CLI command to production—without the chaos. Zero config. Maximum confidence. Your backend, but better.",
	cta: {
		primary: {
			text: "Get Started",
			icon: "ArrowRight",
			href: "/docs/installation",
		},
		secondary: {
			text: "View Documentation",
			href: "/docs",
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
			"TypeScript backend with Express. Fully type-safe REST API with automatic validation using Zod. NestJS support coming soon.",
		color: "text-module-backend",
		badge: null,
		size: "large",
	},
	{
		icon: "Database",
		title: "Prisma ORM",
		description: "Type-safe database access with auto-generated types. Seamless integration with the backend module.",
		color: "text-module-database",
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
		color: "text-muted-foreground",
		badge: null,
		size: "normal",
	},
	{
		icon: "Layout",
		title: "Frontend Module",
		description: "Full-stack Next.js integration. Pre-configured with Tailwind CSS, React 19, and modern tooling.",
		color: "text-module-frontend",
		badge: null,
		size: "large",
	},
	{
		icon: "Shield",
		title: "Auth Module",
		description: "Optional JWT authentication with session management. Add auth to your project with one prompt.",
		color: "text-primary",
		badge: null,
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
	{ icon: "Layers", label: "Business Logic", sub: "TypeScript + Zod + JWT Auth", color: "text-module-backend" },
	{ icon: "Server", label: "API Layer", sub: "Express + TypeScript", color: "text-muted-foreground" },
	{ icon: "UploadCloud", label: "Deployment", sub: "Docker + CI/CD", color: "text-module-database" },
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
			label: "better-ts-stack",
			description: "One command, full stack, ready to ship.",
		},
	},
	templates: {
		title: "Ready-Made Templates. Zero Setup.",
		description:
			"Pick your stack, choose your package manager (npm, pnpm, bun), and get a production-ready TypeScript project with Express backend, optional JWT authentication, and end-to-end type safety. No configuration needed.",
	},
} as const;

// ============================================================================
// TERMINAL PREVIEW CONSTANTS
// ============================================================================
export const TERMINAL_CONFIG = {
	command: "npx better-ts-stack",
	typingSpeed: 80, // milliseconds per character
	output: [
		{ icon: "✓", text: "Scaffolding your type-safe project...", color: "text-primary" },
		{ icon: "✓", text: "Express + TypeScript configured", color: "text-primary" },
		{ icon: "✓", text: "Database (Prisma/Drizzle) ready", color: "text-primary" },
		{ icon: "✓", text: "Docker Compose configured", color: "text-primary" },
		{ icon: "→", text: "Done! Run `cd my-app && npm run dev`", color: "text-primary" },
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
		name: "better-ts-stack",
		logo: "TS",
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
		{ href: "/docs", label: "Docs" },
		{ href: "/docs/usage", label: "Usage" },
		{ href: "/docs/structure", label: "Architecture" },
	],
	resources: [
		{ href: "/docs", label: "Documentation" },
		{ href: "/docs/installation", label: "Getting Started" },
		{ href: "/docs/templates", label: "Templates" },
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
	text: "Start strong. Ship stronger.",
	tagline: "Build fast. Refactor fearlessly. Deploy confidently.",
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
		"Built on the principles of correctness and performance. better-ts-stack isn't just a starter template; it's a philosophy.",
	details:
		"Traditional API layers break the type chain. better-ts-stack preserves it. If you change a column name in your database, your frontend build fails immediately. No more runtime surprises.",
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
			modern: "better-ts-stack",
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
	description: "See the difference. better-ts-stack bridges the gap between your backend and frontend.",
	files: {
		traditional: {
			name: "traditional-fetch.ts",
			label: "Unsafe",
			code: `const data = await fetch('/api/users').then(r => r.json())

// ❌ No type inference
console.log(data.user.nmae)`,
		},
		modern: {
			name: "typed-client.ts",
			label: "Type-Safe",
			code: `const data = await api.users.get()

// ✅ Full autocompletion
console.log(data.user.name)`,
			tooltip: {
				method: "method getUsers(): Promise<User[]>",
				hint: "Go to definition (Ctrl + Click)",
			},
		},
	},
} as const;
