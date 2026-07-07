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
export const skills: SkillGroup[] = [
  {
    category: "Languages",
    skills: ["Python", "TypeScript", "JavaScript", "Bash / Shell"],
  },
  {
    category: "LLMs & Fine-tuning",
    skills: [
      "LLM fine-tuning (SFT)",
      "QLoRA",
      "LoRA",
      "PEFT",
      "Hugging Face Transformers",
      "Hugging Face Hub",
      "Qwen3",
      "Tokenization & prompt formatting",
      "Grammar-constrained decoding (GBNF)",
      "Structured / constrained generation",
    ],
  },
  {
    category: "Model Serving & Quantization",
    skills: [
      "llama.cpp",
      "GGUF",
      "Quantization (Q4_K_M)",
      "CPU inference",
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
    category: "ML & Deep Learning",
    skills: [
      "PyTorch",
      "Transformers & self-attention",
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
    category: "Data & Analytics",
    skills: [
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
