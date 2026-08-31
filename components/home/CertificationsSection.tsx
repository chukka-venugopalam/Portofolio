import { CERTIFICATIONS } from "@/lib/credentials";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

export function CertificationsSection() {
  return (
    <Section spacing="secondary" id="certifications">
      <Container>
        <div className="max-w-[960px] mx-auto">
          <SectionHeader mode="label" level="h2">
            Certifications
          </SectionHeader>
          <p className="mt-4 max-w-[600px] text-body-lg text-text-secondary">
            Specialized coursework and domain certifications in AI foundations and analytics.
          </p>

          <div className="mt-8 grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.id}
                className={cn(
                  "rounded-2xl border border-border-subtle bg-bg-card p-5 desktop:p-6 flex flex-col justify-between transition-all duration-medium",
                  cert.verifyUrl && "hover:border-accent/30 hover:bg-bg-card/95"
                )}
              >
                <div>
                  <span className="text-mono-xs uppercase tracking-wider text-accent font-semibold block mb-2">
                    {cert.issuer}
                  </span>
                  <h3 className="text-body-md font-semibold text-text-primary">
                    {cert.title}
                  </h3>
                </div>

                {cert.verifyUrl && (
                  <div className="mt-4 pt-3 border-t border-border-subtle/60">
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-body-sm font-medium text-accent hover:text-accent-light transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                    >
                      <span>Verify</span>
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
                    </a>
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
