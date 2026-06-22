export interface SkillGroup {
  category: string;
  skills: string[];
}

// Grouped by how systems are built (recruiters and resume parsers scan for this
// shape, not an alphabetical dump). Everything here is drawn from the projects
// and experience on this site, with the most in-demand, searchable skills
// surfaced first. Edit freely: add anything true that is missing (e.g. SQL,
// cloud providers) and remove anything you would not want to be asked about.
export const skills: SkillGroup[] = [
  {
    category: "Languages",
    skills: ["Python", "TypeScript", "JavaScript"],
  },
  {
    category: "ML & Deep Learning",
    skills: ["PyTorch", "LLM fine-tuning (QLoRA / LoRA)", "Transformers", "NLP", "scikit-learn"],
  },
  {
    category: "MLOps & Infrastructure",
    skills: ["Docker", "CI/CD", "Git", "REST APIs", "Model quantization (GGUF)", "llama.cpp"],
  },
  {
    category: "Data & Modeling",
    skills: ["Pandas", "NumPy", "spaCy", "Statistical modeling", "Feature engineering", "Data engineering"],
  },
  {
    category: "Research",
    skills: ["Combinatorial optimization", "Genetic algorithms", "Probabilistic modeling", "GPU Monte Carlo"],
  },
];
