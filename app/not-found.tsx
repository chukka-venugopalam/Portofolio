/**
 * Site-wide 404 — Implementation Blueprint Section 1.4. A more specific
 * override exists at app/work/[slug]/not-found.tsx for the "shared
 * project link no longer resolves" case specifically.
 *
 * Left intentionally minimal per this task's "no page code yet" scope —
 * this is the structural file Next.js requires to exist for the
 * not-found convention to work at all; its actual visual design belongs
 * to a future page-implementation pass against the Visual Design Spec.
 */
export default function NotFound() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>The page you&rsquo;re looking for doesn&rsquo;t exist.</p>
    </main>
  );
}
