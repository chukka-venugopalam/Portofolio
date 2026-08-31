import { EXPERIENCES } from "@/lib/credentials";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function ExperienceSection() {
  return (
    <Section spacing="secondary" id="experience">
      <Container>
        <div className="max-w-[960px] mx-auto">
          <SectionHeader mode="label" level="h2">
            Experience
          </SectionHeader>
          <p className="mt-4 max-w-[600px] text-body-lg text-text-secondary">
            Industry work building production interfaces, fixing client-reported issues, and shipping web applications.
          </p>

          <div className="mt-8 space-y-6">
            {EXPERIENCES.map((exp) => (
              <div
                key={exp.id}
                className="rounded-2xl border border-border-subtle bg-bg-card p-6 desktop:p-8"
              >
                <div className="flex flex-col tablet:flex-row tablet:items-baseline justify-between gap-1 pb-4 border-b border-border-subtle">
                  <div>
                    <h3 className="text-heading-md font-bold text-text-primary">
                      {exp.role}
                    </h3>
                    <p className="text-body-md text-text-secondary mt-0.5">
                      {exp.company}
                    </p>
                  </div>
                  <span className="text-mono-sm font-medium text-accent shrink-0 mt-1 tablet:mt-0">
                    {exp.period}
                  </span>
                </div>

                <ul className="mt-5 space-y-3">
                  {exp.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span aria-hidden="true" className="text-accent select-none mt-0.5">
                        —
                      </span>
                      <span className="text-body-md text-text-secondary leading-relaxed">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
