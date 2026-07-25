"use client";

import { useState, useRef, TouchEvent } from "react";
import { ProjectCard } from "@/components/project/ProjectCard";
import type { ProjectFrontmatter } from "@/content/projects/_schema";

interface ProjectSliderProps {
  projects: ProjectFrontmatter[];
}

export function ProjectSlider({ projects }: ProjectSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Touch gesture state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  if (!projects || projects.length === 0) {
    return (
      <div className="py-8 text-center text-text-secondary text-body-md">
        No projects available in this section.
      </div>
    );
  }

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === projects.length - 1;

  const prevCard = () => {
    if (!isFirst) setCurrentIndex((i) => i - 1);
  };

  const nextCard = () => {
    if (!isLast) setCurrentIndex((i) => i + 1);
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.targetTouches[0]?.clientX ?? null;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;

    if (distance > minSwipeDistance && !isLast) {
      nextCard();
    } else if (distance < -minSwipeDistance && !isFirst) {
      prevCard();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="relative w-full">
      {/* Slider Viewport Container */}
      <div
        className="relative overflow-hidden rounded-2xl p-1"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {projects.map((project) => (
            <div key={project.slug} className="w-full shrink-0 pr-0">
              <div className="max-w-[640px] mx-auto min-h-[420px]">
                <ProjectCard project={project} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls & Pagination indicators */}
      <div className="mt-6 flex items-center justify-between px-2">
        {/* Step dots */}
        <div className="flex items-center gap-2">
          {projects.map((p, idx) => (
            <button
              key={p.slug}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-8 bg-accent"
                  : "w-2 bg-border-subtle hover:bg-text-tertiary"
              }`}
            />
          ))}
          <span className="ml-3 text-mono-xs text-text-tertiary">
            {currentIndex + 1} / {projects.length}
          </span>
        </div>

        {/* Manual Arrow Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevCard}
            disabled={isFirst}
            aria-label="Previous project"
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 ${
              isFirst
                ? "border-border-subtle/40 text-text-quaternary opacity-40 cursor-not-allowed"
                : "border-border-subtle bg-bg-secondary text-text-primary hover:border-accent/40 hover:text-accent"
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={nextCard}
            disabled={isLast}
            aria-label="Next project"
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 ${
              isLast
                ? "border-border-subtle/40 text-text-quaternary opacity-40 cursor-not-allowed"
                : "border-border-subtle bg-bg-secondary text-text-primary hover:border-accent/40 hover:text-accent"
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
