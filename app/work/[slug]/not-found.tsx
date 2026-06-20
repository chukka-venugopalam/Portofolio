import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

/**
 * Project-specific 404 — shown when a slug doesn't resolve to a real
 * project. More useful than the generic site-wide not-found.tsx for a
 * visitor who followed a shared link to a project that's since been
 * renamed (Implementation Blueprint Section 1.4).
 *
 * Updated to use real layout primitives (Container, Section, Button)
 * now that they exist — the original placeholder predated them.
 */
export default function ProjectNotFound() {
  return (
    <Section spacing="home">
      <Container className="max-w-[600px] text-center" wide={false}>
        <h1 className="text-display-lg text-text-primary">
          This project may have moved
        </h1>
        <p className="mt-4 text-body-lg text-text-secondary">
          The project you&rsquo;re looking for isn&rsquo;t here anymore —
          it may have been renamed or folded into another writeup. Check
          the current list on the Work page.
        </p>
        <Button href="/work" className="mt-8">
          See all work
        </Button>
      </Container>
    </Section>
  );
}
