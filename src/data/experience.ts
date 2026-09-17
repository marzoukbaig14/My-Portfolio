export interface Job {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
}

export const experience: Job[] = [
  {
    id: "roux",
    role: "Research Assistant, Applied Machine Learning",
    company: "The Roux Institute at Northeastern University",
    location: "Portland, ME",
    period: "Jul 2026 – Present",
    bullets: [
      "Scope an entity-resolution and record-linkage problem on large-scale operational data end to end, from an ambiguous initial definition through approach design and evaluation, on an industry-sponsored project with a multinational corporation.",
      "Build and benchmark record-matching algorithms across separate data systems in Databricks with PySpark, measured against an existing production approach to establish a baseline.",
      "Define success metrics with the partner team, weighing accuracy against efficiency and production-readiness, and document findings and code for handoff."
    ]
  },
  {
    id: "lineguard",
    role: "Co-Founder & Machine Learning Lead",
    company: "LineGuard",
    location: "Portland, ME",
    period: "2025 – Present",
    bullets: [
      "Co-founded a low-cost computer-vision system that makes automated in/out line calls for padel, running real-time inference at the edge on an NVIDIA Jetson fed by two off-to-the-side cameras, so calls happen on the court with no cloud round-trip.",
      "Awarded the Alpha Fund, Northeastern Mosaic's (NUCEE) advanced-prototype grant, to move the system from working prototype toward a deployable product.",
      "Built a config-driven, agentic ML workflow on an HPC cluster where training, evaluation, and experiment tracking run from plain-English specs, with graph-based orchestration that logs every run for reproducibility and keeps the pipeline fault-tolerant when individual steps fail.",
      "Lead the computer-vision and ML side; a co-founder leads hardware."
    ]
  },
  {
    id: "simon",
    role: "IT Support Consultant",
    company: "Simon Business School, University of Rochester",
    location: "Rochester, NY",
    period: "Jul 2023 – Dec 2024",
    bullets: [
      "Resolved 100+ hardware and software tickets monthly maintaining 99% system uptime; used Jira for ticket tracking, triage, and workflow management.",
      "Developed internal application widgets in Python to automate network-based administrative workflows using CI/CD pipelines.",
      "Rebuilt and digitized the IT documentation platform, reducing new employee onboarding time by 30%."
    ]
  },
  {
    id: "1010data",
    role: "Software Engineering Intern",
    company: "1010data",
    location: "New York, NY",
    period: "Jun 2022 – Aug 2022",
    bullets: [
      "Designed and built a pip-installable Python library mirroring the Pandas API, converting method calls to 1010data's proprietary XML query language via a custom translation algorithm.",
      "Integrated the library end-to-end: SSO auth, custom REST endpoints, server-side execution, live results in the 1010data GUI.",
      "Built an HTTP request-based automation layer replacing a Selenium prototype that failed internal security review; new REST endpoints cut codebase size by over 30%.",
      "Authored dual-audience technical documentation in Confluence covering library architecture and a client-facing user manual."
    ]
  },
  {
    id: "cronus",
    role: "Full Stack Developer",
    company: "Cronus",
    location: "Rochester, NY",
    period: "Feb 2021 – Aug 2021",
    bullets: [
      "Integrated the Google Places API into a React Native mobile application, implementing real-time address auto-fill with API key management and request throttling.",
      "Built a two-step user registration and authentication flow with client-side form validation, persisting data to Firestore with real-time read/write.",
      "Designed and implemented 10+ screens including the Vendor Profile screen, using Figma for mockups and establishing reusable component patterns."
    ]
  }
];