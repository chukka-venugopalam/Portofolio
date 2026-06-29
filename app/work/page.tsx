import { buildMetadata } from "@/lib/seo/metadata";
import {
  getProjectsByCategory,
} from "@/lib/content/projects";
import { getAlsoBuildingEntries } from "@/lib/content/also-building";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusTag } from "@/components/ui/StatusTag";
import { ProjectCard } from "@/components/project/ProjectCard";
import { AlsoBuildingEntry } from "@/components/project/AlsoBuildingEntry";

export const metadata = buildMetadata({
  title: "Work",
  description: "Flagship products, production projects, and experiments I'm building.",
  pathname: "/work",
});

/**
 * Work page — organized into three clear sections:
 *   1. Flagship Projects — long-term products (larger cards, richer descriptions)
 *   2. Production Projects — fully working deployed applications (standard cards)
 *   3. Experiments & Research — small prototypes, explorations, and AI experiments
 */
export default function WorkPage() {
  const flagshipProjects = getProjectsByCategory("flagship");
  const productionProjects = getProjectsByCategory("production");
  const alsoBuilding = getAlsoBuildingEntries();

  return (
    <>
      {/* ── 1. Work Hero ── */}
      <Section spacing="secondary" className="pt-0">
        <Container>
          <SectionHeader
            mode="page"
            level="h1"
            subline="Flagship products, production projects, and experiments — everything I'm building."
          >
            Work
          </SectionHeader>
        </Container>
      </Section>

      {/* ── 2. Flagship Projects ── */}
      <Section spacing="secondary">
        <Container>
          <SectionHeader mode="label" level="h2" id="flagship">
            Flagship Projects
          </SectionHeader>
          <p className="mt-3 max-w-[600px] text-body-sm text-text-secondary">
            Long-term products that represent my vision — AI-assisted learning, real-time
            decision-making, and developer growth.
          </p>

          {flagshipProjects.length > 0 ? (
            <div className="mt-8 flex flex-col gap-8">
              {flagshipProjects.map((project) => (
                <ProjectCard
                  key={project.frontmatter.slug}
                  project={project.frontmatter}
                  variant="flagship"
                />
              ))}
            </div>
          ) : (
            <EmptyState
              status="exploring"
              message="No flagship projects yet — the current focus is on getting the first one ready."
            />
          )}
        </Container>
      </Section>

      {/* ── 3. Production Projects ── */}
      <Section spacing="secondary">
        <Container>
          <SectionHeader mode="label" level="h2" id="production">
            Production Projects
          </SectionHeader>
          <p className="mt-3 max-w-[600px] text-body-sm text-text-secondary">
            Fully built, deployed applications that are live and running.
          </p>

          {productionProjects.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 desktop:grid-cols-2 gap-x-6 gap-y-8">
              {productionProjects.map((project) => (
                <ProjectCard
                  key={project.frontmatter.slug}
                  project={project.frontmatter}
                  variant="grid"
                />
              ))}
            </div>
          ) : (
            <EmptyState
              status="building"
              message="Production projects will appear here once existing projects reach a shippable state."
            />
          )}
        </Container>
      </Section>

      {/* ── 4. Experiments & Research ──
          Quick prototypes, AI experiments, hackathon ideas, and research concepts —
          communicated as rapid iteration rather than polished products. */}
      <Section spacing="secondary" className="pb-0">
        <Container>
          <SectionHeader mode="label" level="h2" id="experiments">
            Experiments &amp; Research
          </SectionHeader>
          <p className="mt-3 max-w-[600px] text-body-sm text-text-secondary">
            Small prototypes, AI experiments, and research concepts — rapid iteration
            and curiosity-driven exploration.
          </p>

          {alsoBuilding.length > 0 ? (
            <ul className="mt-6 divide-y divide-border-subtle">
              {alsoBuilding.map((entry) => (
                <AlsoBuildingEntry key={entry.name} entry={entry} />
              ))}
            </ul>
          ) : (
            <EmptyState
              status="exploring"
              message="Nothing in early exploration to share publicly yet — check back soon."
            />
          )}
        </Container>
      </Section>
    </>
  );
}

/**
 * EmptyState
 *
 * Local to this page — plain text with a StatusTag anchor, consistent
 * with how thin content is treated everywhere else on the site.
 */
function EmptyState({
  status,
  message,
}: {
  status: "shipped" | "building" | "exploring";
  message: string;
}) {
  return (
    <div className="mt-6 flex items-start gap-3">
      <StatusTag status={status} className="mt-0.5 shrink-0" />
      <p className="text-body-md text-text-secondary">{message}</p>
    </div>
  );
}
