/**
 * Layout components barrel export.
 * Import as: import { Navbar, Footer, ThemeProvider, useTheme } from "@/components/layout"
 *
 * Note: ThemeProvider and useTheme are "use client" components. Importing
 * them in a Server Component context is fine — Next.js handles the
 * client/server boundary automatically. They only execute on the client.
 */
export { ThemeProvider, useTheme } from "./ThemeProvider";
export { ThemeToggle } from "./ThemeToggle";
export { Navbar } from "./Navbar";
export { MobileNavOverlay } from "./MobileNavOverlay";
export { Footer } from "./Footer";
