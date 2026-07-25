"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type TabId = "products" | "explorations";

interface Tab {
  id: TabId;
  label: string;
  description: string;
  count: number;
}

interface WorkTabsProps {
  tabs: Tab[];
  tabContent: Record<TabId, React.ReactNode>;
  className?: string;
}

export function WorkTabs({
  tabs,
  tabContent,
  className,
}: WorkTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("explorations");
  const shouldReduce = useReducedMotion();

  return (
    <div className={className}>
      {/* Segmented control */}
      <div className="flex border border-border-subtle rounded-xl p-1 bg-bg-tertiary/50 w-fit" role="tablist" aria-label="Filter projects">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-mono-sm font-medium transition-colors duration-fast ease-standard",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                isActive
                  ? "text-text-primary"
                  : "text-text-tertiary hover:text-text-secondary"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="tab-active-bg"
                  className="absolute inset-0 rounded-lg bg-bg-card border border-border-subtle shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
              <span className={cn(
                "relative z-10 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-mono-xs",
                isActive
                  ? "bg-accent/10 text-accent"
                  : "bg-bg-tertiary text-text-quaternary"
              )}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab description */}
      <div className="mt-3">
        <p className="text-body-sm text-text-secondary max-w-[600px]">
          {tabs.find((t) => t.id === activeTab)?.description}
        </p>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          initial={shouldReduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="mt-8"
        >
          {tabContent[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
