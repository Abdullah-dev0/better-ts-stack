#!/usr/bin/env node

/**
 * CLI entry point for better-ts-stack
 * This file is executed when the user runs `npx better-ts-stack`
 */

// Import the main CLI function from the compiled dist directory
import { main } from '../dist/index.js';

// Execute the main CLI function
main().catch((error) => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
