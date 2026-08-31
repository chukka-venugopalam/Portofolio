import { CERTIFICATIONS } from "@/lib/credentials";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

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

          <div className="mt-8 grid grid-cols-1 tablet:grid-cols-3 gap-4">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.id}
                className="rounded-2xl border border-border-subtle bg-bg-card p-5 desktop:p-6 flex flex-col justify-between"
              >
                <div>
                  <span className="text-mono-xs uppercase tracking-wider text-accent font-semibold block mb-2">
                    {cert.issuer}
                  </span>
                  <h3 className="text-body-md font-semibold text-text-primary">
                    {cert.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
