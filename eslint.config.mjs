import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

/**
 * Flat-config ESLint setup (ESLint 9+ convention). Extends Next.js's
 * recommended rules (core-web-vitals catches several of the
 * Implementation Blueprint Section 8 performance pitfalls automatically
 * — e.g. flags a raw <img> instead of next/image) plus TypeScript's
 * recommended rules.
 */
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
