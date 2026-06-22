export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  tier: "featured" | "tier1" | "tier2";
  github: string;
  paper: string | null;
  demo?: string;
  command: string;
  // Optional secondary repo/demo links rendered alongside the main GitHub link
  // (used when one card covers more than one repo).
  extraLinks?: { label: string; href: string }[];
}

export const projects: Project[] = [
  // Committed: live demo card, rendered when NEXT_PUBLIC_COMMITTED_ENABLED is
  // "true". `demo` points at the internal /committed route (Projects.js renders
  // it as "Try the live demo →"); `github` renders as "View on GitHub →".
  {
    id: "committed",
    title: "Committed",
    subtitle: "Fine-tuned commit-message model. 2026.",
    description: "A 1.7B model I fine-tuned to turn a git diff into a Conventional Commits message. On a 442-diff held-out eval, fine-tuning lifted commit-type accuracy from 0.13 to 0.64 and faithfulness from 0.43 to 0.86 over the base model. It serves as a ~1 GB quantized GGUF on llama.cpp, CPU-only, so nothing leaves your machine, and a GBNF grammar makes every output a valid commit by construction.",
    tags: ["Fine-tuning", "QLoRA", "LLMs", "MLOps"],
    tier: "tier1",
    github: "https://github.com/marzoukbaig14/Committed",
    paper: null,
    demo: "/committed",
    command: "$ git commit -m \"feat: ...\""
  },
  {
    id: "mkp-ga",
    title: "Generating Function Initialization for Genetic Algorithms",
    subtitle: "MS Research, Northeastern. April 2026 to now.",
    description: "Standard genetic algorithms die on tight Multidimensional Knapsack instances. Every solution in the initial population is infeasible, selection never operates, and the search is dead on arrival. I built a different initialization approach using combinatorial generating functions to derive per-item sampling probabilities. No objective values needed, no LP relaxation. GPU Monte Carlo estimates all 100 probabilities in about 6 seconds on a T4. On the tight benchmark: uniform initialization gets 0% feasibility. This gets 52.5% and converges to 96.5% of the reference best. Confirmed novelty through correspondence with Hill (1999), the closest prior work. Paper and code on GitHub.",
    tags: ["Python", "PyTorch", "GPU", "Genetic Algorithms", "Combinatorial Optimization", "Research"],
    tier: "featured",
    github: "https://github.com/marzoukbaig14/MKP-using-Genetic-Algorithm",
    paper: "/paper.pdf",
    command: "$ python ga_init.py"
  },
  {
    id: "united-way-nlp",
    title: "Listening to Southern Maine",
    subtitle: "United Way of Southern Maine. Northeastern XN Program. Spring 2026.",
    description: "Mixed-methods analysis of 1,702 community survey responses for United Way of Southern Maine. The data engineering was messy: 8 different survey instruments, 18 questions, none asking the same things, producing a sparse ragged matrix where most empty cells are unasked rather than unanswered. We harmonized the schema, canonicalized open-text responses with NLP, and ran statistical modeling to answer three questions: what residents say their biggest challenges are, which challenges differ across economic strata, and who feels unheard. Main finding: housing cost is cited by 82% of respondents across every income group, confirmed no significant difference by chi-square. Any housing initiative framed as low-income support misses most of the people it affects. Full 25-page report and 14-slide deck in the repo.",
    tags: ["Python", "NLP", "spaCy", "scikit-learn", "Statistical Modeling", "Data Engineering"],
    tier: "tier1",
    github: "https://github.com/myhott163com/united_way_final",
    paper: "https://github.com/myhott163com/united_way_final/blob/main/report/final_report.pdf",
    command: ">>> df.groupby('income_tier')['housing'].value_counts()"
  },
  {
    id: "gentrification",
    title: "Gentrification and University Proximity",
    subtitle: "Independent research, University of Rochester. Fall 2023 to Fall 2024.",
    description: "Quantitative study on whether proximity to private universities in Monroe County, NY correlates with neighborhood-level gentrification indicators in Rochester. Full pipeline: data acquisition from census and geospatial sources, feature engineering on demographic variables, cross-validated logistic and linear regression in scikit-learn. The interesting part was operationalizing gentrification correctly before touching any models.",
    tags: ["Python", "scikit-learn", "Pandas", "Geospatial", "Regression"],
    tier: "tier1",
    // No public repo for this one (it predates regular GitHub use). Left empty
    // so the card doesn't dead-end on the profile page; a YouTube walkthrough
    // link is pending and can be dropped into `demo` once available.
    github: "",
    paper: null,
    command: ">>> model.fit(X_proximity, y_gentrify)"
  },
  {
    id: "gpt-zero",
    title: "GPT from Scratch",
    subtitle: "Independent project. 2026.",
    description: "A working ~10M-parameter character-level GPT, built in PyTorch from scratch and trained on Shakespeare until it produces coherent Shakespearean text. Every component implemented by hand: multi-head self-attention, transformer blocks with residual connections and layernorm, positional encoding, and autoregressive generation. The endpoint of the from-scratch track below; follows Karpathy's Neural Networks: Zero to Hero.",
    tags: ["Python", "PyTorch", "Transformers", "Deep Learning", "NLP"],
    tier: "tier2",
    github: "https://github.com/marzoukbaig14/gpt-zero",
    paper: null,
    command: "$ python train.py"
  },
  {
    // Consolidates the former micrograd (autograd engine) and nanoLM
    // (language-modeling progression) cards into one fundamentals track, so the
    // projects list reads as a deliberate progression rather than three
    // tutorial-style entries. Both repos are linked.
    id: "from-scratch",
    title: "Neural Networks from Scratch",
    subtitle: "Independent projects. 2026.",
    description: "Building the ML stack from the ground up to understand every layer before reaching for a framework. First a scalar-valued autograd engine in pure Python: backpropagation over a dynamically built DAG, no PyTorch or NumPy in the core. Then a language-modeling progression: bigram counts, a Bengio-style MLP with character embeddings, manual Xavier and Kaiming init and batch normalization, and full backprop through softmax, cross-entropy, and batchnorm by hand, validated against PyTorch autograd, up to a WaveNet-style model. The working GPT above is where this track lands.",
    tags: ["Python", "PyTorch", "Autograd", "Backpropagation", "Language Models"],
    tier: "tier2",
    github: "https://github.com/marzoukbaig14/nanoLM",
    paper: null,
    command: "$ python train.py",
    extraLinks: [
      { label: "micrograd (autograd engine) →", href: "https://github.com/marzoukbaig14/micrograd" }
    ]
  }
];