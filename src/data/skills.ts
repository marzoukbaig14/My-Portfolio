export interface SkillGroup {
  category: string;
  skills: string[];
}

// Grouped by how systems are built (recruiters and resume parsers scan for this
// shape, not an alphabetical dump), most in-demand skills first. Everything here
// is drawn from real work on this site's projects and experience — each item is
// something to speak to in an interview, not keyword padding. Edit freely: add
// anything true that's missing (e.g. SQL, a cloud provider) and remove anything
// you would not want to be asked about.
//
// Category order leads with the ML keyword magnets, so an ML-role skim hits them
// before the web and foundations groups. Within a category, the highest-signal
// pill comes first.
export const skills: SkillGroup[] = [
  {
    category: "Languages",
    skills: ["Python", "TypeScript", "JavaScript", "Bash / Shell"],
  },
  {
    category: "LLMs, Fine-tuning & Agents",
    skills: [
      "LLM fine-tuning (SFT)",
      "QLoRA",
      "LoRA",
      "PEFT",
      "Agentic workflows",
      "Multi-agent orchestration",
      "Hugging Face Transformers",
      "Hugging Face Hub",
      "Qwen3",
      "Tokenization & prompt formatting",
      "Grammar-constrained decoding (GBNF)",
      "Structured / constrained generation",
    ],
  },
  {
    category: "ML & Deep Learning",
    skills: [
      "PyTorch",
      "Computer Vision",
      "Transformers & self-attention",
      "Distributed / HPC training",
      "Autograd & backpropagation (from scratch)",
      "Batch normalization",
      "Xavier / Kaiming initialization",
      "NLP",
      "spaCy",
      "scikit-learn",
      "Regression (logistic / linear)",
    ],
  },
  {
    category: "Model Serving & Quantization",
    skills: [
      "llama.cpp",
      "GGUF",
      "Quantization (Q4_K_M)",
      "CPU inference",
      "Edge / on-device inference",
      "NVIDIA Jetson",
      "FastAPI",
      "Docker",
      "Hugging Face Spaces",
      "REST APIs",
    ],
  },
  {
    category: "Model Evaluation",
    skills: [
      "LLM-as-judge evaluation",
      "Multi-metric eval harnesses",
      "Human-agreement validation (Cohen's κ)",
      "Held-out test splits",
      "Deployment-reweighted metrics",
      "Hypothesis testing (chi-square)",
      "Cross-validation",
    ],
  },
  {
    category: "Data & Analytics",
    skills: [
      "PySpark",
      "Databricks",
      "Entity resolution / record linkage",
      "Pandas",
      "NumPy",
      "Data engineering",
      "Feature engineering",
      "Schema harmonization",
      "Geospatial analysis",
      "Exploratory data analysis",
      "Statistical modeling",
    ],
  },
  {
    category: "Research & Methods",
    skills: [
      "Combinatorial optimization",
      "Genetic algorithms",
      "Generating functions",
      "Probabilistic modeling",
      "GPU Monte Carlo",
      "Stochastic methods",
      "Scientific writing",
    ],
  },
  {
    category: "Web & Deployment",
    skills: [
      "Next.js (App Router)",
      "React",
      "Tailwind CSS",
      "Framer Motion",
      "Vercel",
      "Server-side rendering",
      "Responsive & accessible UI",
      "CI/CD",
      "Git / GitHub",
    ],
  },
  {
    category: "Foundations",
    skills: [
      "Data structures & algorithms",
      "System design",
      "Software engineering",
      "API design",
      "Object-oriented & functional programming",
    ],
  },
];
