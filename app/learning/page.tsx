import { buildMetadata } from "@/lib/seo/metadata";
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
              I don't collect certificates. I collect understanding. Every project I build is an answer to a question I was genuinely curious about. Every learning area I study is motivated by a system I want to build but cannot yet.
            </blockquote>
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
