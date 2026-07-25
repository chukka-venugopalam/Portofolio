import { buildMetadata } from "@/lib/seo/metadata";
import { NOW_STATUS, SOCIAL_LINKS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata = buildMetadata({
  title: "Learning",
  description:
    "How I learn: fundamentals, prototypes, gaps, deeper study, better systems.",
  pathname: "/learning",
});

/**
 * Learning page
 *
 * My learning philosophy is not about collecting certificates or completing
 * tutorials. It is about understanding systems deeply enough to build them
 * myself. The cycle is always:
 *   Learn fundamentals -> Build prototypes -> Find gaps -> Study deeper -> Build better systems
 */
export default function LearningPage() {
  return (
    <>
      {/* Hero */}
      <Section spacing="secondary" className="pt-0">
        <Container className="max-w-[760px]" wide={false}>
          <SectionHeader
            mode="page"
            level="h1"
            subline="I don't optimize for completing tutorials. I optimize for understanding systems deeply enough to build them myself."
          >
            How I Learn
          </SectionHeader>
        </Container>
      </Section>

      {/* Philosophy */}
      <Section spacing="tight">
        <Container className="max-w-[760px]" wide={false}>
          <div className="rounded-card bg-bg-secondary border border-border-default p-6 desktop:p-8">
            <span className="text-mono-sm uppercase tracking-[0.08em] text-text-tertiary">
              My Learning Cycle
            </span>
            <ol className="mt-5 flex flex-col gap-4">
              {[
                {
                  step: "Learn fundamentals",
                  detail: "Build a solid mental model of how the system works at its core, not just how to use it.",
                },
                {
                  step: "Build prototypes",
                  detail: "Implement something real with what I have learned. The gap between theory and practice always reveals itself here.",
                },
                {
                  step: "Find gaps",
                  detail: "The prototype exposes what I don't actually understand. A bug, a performance issue, a design choice I could not justify.",
                },
                {
                  step: "Study deeper",
                  detail: "Go back to the fundamentals with a specific question in mind. The second pass is always faster and more focused.",
                },
                {
                  step: "Build better systems",
                  detail: "Rebuild or extend the prototype with the deeper understanding. This is where the learning solidifies into something durable.",
                },
              ].map((item, index) => (
                <li key={item.step} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-mono-md font-medium text-accent"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <span className="text-body-md font-medium text-text-primary">
                      {item.step}
                    </span>
                    <p className="mt-0.5 text-body-sm text-text-secondary">
                      {item.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {/* Current Learning Areas */}
      <Section spacing="tight">
        <Container className="max-w-[760px]" wide={false}>
          <SectionHeader mode="label" level="h2">
            Currently Studying
          </SectionHeader>

          <div className="mt-6 flex flex-col gap-6">
            <LearningArea
              title="Data Structures and Algorithms"
              status="completed"
              description="I have built a solid foundation in the core data structures: arrays, stacks, queues, trees, and graphs. I can implement each one from memory and reason about their tradeoffs."
              details={[
                "Arrays, Stacks, Queues",
                "Trees: binary trees, BSTs, tree traversals",
                "Graphs: representations, BFS, DFS",
              ]}
            />

            <LearningArea
              title="Algorithms"
              status="studying"
              description="I am moving from knowing data structures to understanding algorithmic thinking and optimization. This is not about memorizing solutions. It is about building intuition for why certain approaches work and others do not."
              details={[
                "Sorting and searching algorithms",
                "Dynamic programming patterns",
                "Graph algorithms: shortest paths, topological sort",
                "Complexity analysis and optimization",
              ]}
            />

            <LearningArea
              title="AI and Machine Learning"
              status="studying"
              description="I am studying beyond using APIs. I want to understand the models themselves: how they work, why they fail, and how to build systems around them that are reliable and predictable."
              details={[
                "Large Language Models: architecture, training, inference",
                "AI Engineering: building production systems around LLMs",
                "Agent Systems: tool use, reasoning, multi-step planning",
                "Machine Learning Fundamentals: beyond using APIs",
                "Evaluation: measuring quality beyond accuracy",
                "Retrieval Augmented Generation: grounding models in real data",
                "Prompt Engineering: systematic, not guesswork",
              ]}
            />

            <LearningArea
              title="Cloud and Full Stack"
              status="studying"
              description="Full-stack is where my learning becomes immediately testable. Every concept goes through the cycle: learn the theory, build a prototype, find the gaps, study deeper, ship something real."
              details={[
                "Backend Architecture: APIs, services, state management",
                "Databases: relational, NoSQL, query optimization",
                "Authentication: sessions, tokens, OAuth patterns",
                "APIs: REST design, WebSockets, real-time communication",
                "Deployment: CI/CD, containerization, orchestration",
                "Cloud Infrastructure: compute, storage, networking",
              ]}
            />
          </div>
        </Container>
      </Section>

      {/* Learning Belief */}
      <Section spacing="tight" className="pb-0">
        <Container className="max-w-[760px]" wide={false}>
          <div className="border border-border-subtle rounded-card p-6 desktop:p-8">
            <span className="text-mono-sm uppercase tracking-[0.08em] text-text-tertiary">
              My Belief
            </span>
            <blockquote className="mt-3 text-body-lg leading-relaxed text-text-primary">
              I don&rsquo;t collect certificates. I collect understanding. Every project I build is an answer to a question I was genuinely curious about. Every learning area I study is motivated by a system I want to build but cannot yet.
            </blockquote>

            <div className="mt-5 pt-4 border-t border-border-subtle">
              <a
                href={SOCIAL_LINKS.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-body-sm text-text-secondary hover:text-text-primary transition-colors duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.47-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L8.452 8.72l3.813-3.993c.538-.549.538-1.437.005-1.989a1.376 1.376 0 0 0-.787-.737zm-1.434 6.418 1.717 1.718-3.004 3.005a1.369 1.369 0 0 0 .01 1.937 1.38 1.38 0 0 0 1.95.01l3.006-3.006 1.69 1.688a1.37 1.37 0 0 0 1.464.282c.25-.1.464-.273.614-.5.15-.229.222-.49.209-.755a1.34 1.34 0 0 0-.655-.96 1.37 1.37 0 0 0-.402-.169l-.035-.01L17.1 9.364l.002-.001-1.798-1.796a1.378 1.378 0 0 0-1.95-.001 1.374 1.374 0 0 0-.348.612 1.3 1.3 0 0 0-.055.343v.001l.1.1z" />
                </svg>
                <span>LeetCode profile &mdash; solving DSA problems systematically</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* Now status */}
      <Section spacing="tight" className="pb-0">
        <Container className="max-w-[760px]" wide={false}>
          <div className="flex items-center gap-2 rounded-card border border-border-subtle bg-bg-secondary px-5 py-3">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            <span className="text-mono-sm text-text-tertiary uppercase tracking-[0.08em]">Now &mdash;</span>
            <span className="text-body-sm text-text-secondary">{NOW_STATUS.line}</span>
            <span className="text-mono-sm text-text-quaternary shrink-0 ml-auto">{NOW_STATUS.date}</span>
          </div>
        </Container>
      </Section>
    </>
  );
}

function LearningArea({
  title,
  status,
  description,
  details,
}: {
  title: string;
  status: "completed" | "studying";
  description: string;
  details: string[];
}) {
  const statusLabel = status === "completed" ? "Foundation built" : "Studying";
  const statusColor = status === "completed" ? "text-status-shipped" : "text-status-building";
  const dotColor = status === "completed" ? "bg-status-shipped" : "bg-status-building";

  return (
    <div className="rounded-card border border-border-subtle p-5 desktop:p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-heading-sm text-text-primary">{title}</h3>
        <span
          className={"inline-flex items-center gap-1.5 rounded-pill bg-bg-tertiary px-2.5 py-1 text-mono-md shrink-0 " + statusColor}
        >
          <span
            aria-hidden="true"
            className={"h-1.5 w-1.5 rounded-full " + dotColor}
          />
          {statusLabel}
        </span>
      </div>
      <p className="mt-2 text-body-md text-text-secondary leading-relaxed">
        {description}
      </p>
      <ul className="mt-3 flex flex-col gap-1">
        {details.map((detail) => (
          <li key={detail} className="flex gap-2 text-body-sm text-text-primary">
            <span aria-hidden="true" className="text-accent shrink-0">
              →
            </span>
            {detail}
          </li>
        ))}
      </ul>
    </div>
  );
}
