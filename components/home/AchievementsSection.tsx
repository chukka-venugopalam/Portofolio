import Link from "next/link";
import { ACHIEVEMENTS } from "@/lib/credentials";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

export function AchievementsSection() {
  return (
    <Section spacing="secondary" id="achievements">
      <Container>
        <div className="max-w-[960px] mx-auto">
          <SectionHeader mode="label" level="h2">
            Achievements
          </SectionHeader>
          <p className="mt-4 max-w-[600px] text-body-lg text-text-secondary">
            Milestones across competitive analytics, engineering hackathons, and problem solving.
          </p>

          <div className="mt-8 grid grid-cols-1 tablet:grid-cols-2 gap-4">
            {ACHIEVEMENTS.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "rounded-2xl border border-border-subtle bg-bg-card p-5 desktop:p-6 transition-all duration-medium",
                  "hover:border-accent/30 hover:bg-bg-card/95 flex flex-col justify-between"
                )}
              >
                <div>
                  <div className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-1.5 h-2 w-2 rounded-full bg-accent shrink-0 shadow-[0_0_8px_rgba(102,144,179,0.5)]" />
                    <div>
                      <h3 className="text-body-lg font-semibold text-text-primary">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-body-sm text-text-secondary">
                        {item.context}
                      </p>
                    </div>
                  </div>
                </div>

                {item.link && (
                  <div className="mt-4 pt-3 border-t border-border-subtle/60 pl-5">
                    <Link
                      href={item.link.href}
                      className="inline-flex items-center gap-1.5 text-body-sm font-medium text-accent hover:text-accent-light transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                    >
                      <span>{item.link.label}</span>
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
