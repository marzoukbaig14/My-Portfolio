export const projects = [
  // Committed: live demo card, rendered when NEXT_PUBLIC_COMMITTED_ENABLED is
  // "true". `demo` points at the internal /committed route (Projects.js renders
  // it as "Try the live demo →"); `github` renders as "View on GitHub →".
  {
    id: "committed",
    title: "Committed",
    subtitle: "Fine-tuned commit-message model. 2026.",
    description: "A commit-message model I fine-tuned (Qwen3-1.7B, QLoRA): give it a git diff, it writes the message in Conventional Commits format. Runs locally, which was the point. Nothing leaves your machine.",
    tags: ["Fine-tuning", "LLMs", "MLOps", "Docker"],
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
    github: "https://github.com/marzoukbaig14",
    paper: null,
    command: ">>> model.fit(X_proximity, y_gentrify)"
  },
  {
    id: "gpt-zero",
    title: "GPT from Scratch",
    subtitle: "Independent project. 2026.",
    description: "Where nanoLM lands. A full character-level GPT transformer built in PyTorch from scratch, trained on Shakespeare. ~10M parameters. Every component built independently: multi-head self-attention, transformer blocks with residual connections and layernorm, positional encoding, autoregressive generation. The model actually produces coherent Shakespearean text. Follows Karpathy's Neural Networks: Zero to Hero series.",
    tags: ["Python", "PyTorch", "Transformers", "Deep Learning", "NLP"],
    tier: "tier2",
    github: "https://github.com/marzoukbaig14/gpt-zero",
    paper: null,
    command: "$ python train.py"
  },
  {
    id: "nanoLM",
    title: "nanoLM",
    subtitle: "Independent project. 2026.",
    description: "A ground-up progression through the history of language modeling. Starts at a bigram count model and builds up one step at a time: neural bigram, Bengio et al. 2003 MLP with character embeddings, deep MLP with Xavier and Kaiming initialization and batch normalization (derived manually, not just applied), then full backpropagation through softmax, cross-entropy, and batchnorm by hand and validated against PyTorch autograd. WaveNet-style hierarchical model next. This one is about understanding every layer before moving to the next. gpt-zero is where it ends up.",
    tags: ["Python", "PyTorch", "Transformers", "Language Models"],
    tier: "tier2",
    github: "https://github.com/marzoukbaig14/nanoLM",
    paper: null,
    command: "$ python train.py"
  },
  {
    id: "micrograd",
    title: "Autograd Engine from Scratch",
    subtitle: "Independent project. 2026.",
    description: "A scalar-valued autograd engine and neural network library in pure Python. Backpropagation over a dynamically built DAG, no PyTorch or NumPy for the core engine. Gives you real appreciation for what automatic differentiation actually does. Built to understand, not to use.",
    tags: ["Python", "Autograd", "Backpropagation", "Neural Networks"],
    tier: "tier2",
    github: "https://github.com/marzoukbaig14/micrograd",
    paper: null,
    command: "$ python engine.py"
  }
];