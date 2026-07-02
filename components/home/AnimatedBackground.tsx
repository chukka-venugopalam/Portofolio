"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export function AnimatedBackground({ className }: { className?: string }) {
  const shouldReduce = useReducedMotion();
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldReduce) return;
    const el = bgRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = ((e.clientX / window.innerWidth) - 0.5) * 8;
      const y = ((e.clientY / window.innerHeight) - 0.5) * 8;
      el.style.setProperty("--parallax-x", `${x}px`);
      el.style.setProperty("--parallax-y", `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [shouldReduce]);

  return (
    <div
      ref={bgRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        "opacity-[0.04]",
        "transition-opacity duration-slow ease-standard",
        className
      )}
      style={{
        transform: "translate(var(--parallax-x, 0px), var(--parallax-y, 0px))",
        willChange: "transform",
      }}
    >
      <div
        className={cn(
          "absolute inset-0",
          !shouldReduce && "animate-grid-rotate"
        )}
        style={{
          backgroundImage: [
            "linear-gradient(var(--color-border-subtle) 1px, transparent 1px)",
            "linear-gradient(90deg, var(--color-border-subtle) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "60px 60px",
          opacity: shouldReduce ? 0.3 : 0.5,
        }}
      />
      <div
        className={cn(
          "absolute -top-1/2 -left-1/2 h-[150%] w-[150%]",
          !shouldReduce && "animate-gradient-drift"
        )}
        style={{
          background: [
            "radial-gradient(ellipse at 30% 20%, var(--color-accent) 0%, transparent 60%)",
            "radial-gradient(ellipse at 70% 80%, var(--color-status-building) 0%, transparent 60%)",
          ].join(", "),
          opacity: 0.3,
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-text-tertiary) 0.5px, transparent 0.5px)",
          backgroundSize: "40px 40px",
          opacity: shouldReduce ? 0.15 : 0.25,
        }}
      />
    </div>
  );
}
