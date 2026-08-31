export interface AchievementItem {
  id: string;
  title: string;
  context: string;
  link?: {
    href: string;
    label: string;
  };
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  bullets: string[];
  link?: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
}

export const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: "summer-analytics-2026",
    title: "Top 10th Percentile — Summer Analytics 2026",
    context: "Consulting & Analytics Club, IIT Guwahati",
    link: {
      href: "/work/celonis-sustainability-capstone",
      label: "View Celonis Capstone Case Study",
    },
  },
  {
    id: "project-warzone",
    title: "1st Prize, Project Warzone",
    context: "College-level project expo",
  },
  {
    id: "sih-selection",
    title: "Smart India Hackathon (SIH) Qualified",
    context: "Selected via Innovex internal selection",
  },
  {
    id: "leetcode-solving",
    title: "270+ LeetCode Problems Solved",
    context: "Data structures, algorithms, and computational problem solving",
  },
  {
    id: "launchpilot-agent",
    title: "Built LaunchPilot AI Agent",
    context: "Google's 5-Day AI Agents: Intensive Vibe Coding Course (Kaggle)",
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: "driftsync",
    role: "Frontend Developer Intern",
    company: "DriftSync Solutions Pvt. Ltd.",
    period: "May – Jun 2026",
    bullets: [
      "Fixed ~10–15 UI bugs on EatssApp (rural food delivery platform) using Git branch workflows and code review in a 3-member team, incorporating direct client feedback into fix cycles",
      "Learned client-server architecture fundamentals — implemented server-side data loading to reduce client-side fetch latency — and assisted with company website development on Next.js",
    ],
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: "summer-analytics-cert",
    title: "Summer Analytics 2026, Certificate of Excellence",
    issuer: "Consulting & Analytics Club, IIT Guwahati",
  },
  {
    id: "anthropic-ai-fluency",
    title: "AI Fluency: Framework & Foundations",
    issuer: "Anthropic Academy",
  },
  {
    id: "anthropic-claude-101",
    title: "Claude 101",
    issuer: "Anthropic Academy",
  },
];
