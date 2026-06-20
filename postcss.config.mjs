/**
 * Tailwind v4 routes through a single PostCSS plugin (@tailwindcss/postcss)
 * rather than v3's `tailwindcss` + `autoprefixer` pairing — v4 bundles its
 * own vendor-prefixing via Lightning CSS internally, so autoprefixer is not
 * needed and shouldn't be added back in.
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
