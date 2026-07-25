"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface WorkSectionProps {
  id?: string;
  title: string;
  description?: string;
  count?: number;
  children: React.ReactNode;
}

export function WorkSection({
  id,
  title,
  description,
  count,
  children,
}: WorkSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setShouldReduceMotion(true);
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Trigger once only
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        "py-10 desktop:py-14 border-t border-border-subtle/50 transition-all duration-500 ease-out",
        shouldReduceMotion
          ? "opacity-100 translate-y-0"
          : isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6"
      )}
    >
      <div className="mb-8 max-w-[720px]">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-heading-xl desktop:text-display-sm font-bold text-text-primary tracking-tight">
            {title}
          </h2>
          {count !== undefined && (
            <span className="rounded-full border border-border-subtle bg-bg-tertiary/50 px-3 py-1 text-mono-xs text-text-tertiary">
              {count} {count === 1 ? "project" : "projects"}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-3 text-body-md text-text-secondary leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}
