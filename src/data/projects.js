export const projects = [
  {
    id: "mkp-ga",
    title: "Generating Function Initialization for Genetic Algorithms",
    subtitle: "MS Research, Northeastern. April 2026 to now.",
    description: "A new way to initialize genetic algorithms on tightly constrained problems. Standard 50/50 random initialization fails on tight Multidimensional Knapsack instances. Every solution is infeasible and the GA is dead on arrival under a death penalty model. I derive per-item sampling probabilities from sub-generating functions, no objective values or LP relaxation needed. GPU Monte Carlo estimates all 100 probabilities in around 6 seconds on a T4. On the tight benchmark where uniform initialization gets 0% feasibility, this gets 52.5% and converges to 96.5% of the reference best. Confirmed novelty through correspondence with the closest prior work (Hill, 1999). Paper PDF and code on GitHub.",
    tags: ["Python", "PyTorch", "GPU", "Genetic Algorithms", "Combinatorial Optimization", "Research"],
    tier: "featured",
    github: "https://github.com/marzoukbaig14/MKP-using-Genetic-Algorithm",
    paper: "https://github.com/marzoukbaig14/MKP-using-Genetic-Algorithm",
    image: null
  },
  {
    id: "united-way-nlp",
    title: "Listening to Southern Maine",
    subtitle: "United Way of Southern Maine. Northeastern XN Program. Spring 2026.",
    description: "Mixed-methods analysis of 1,702 community survey responses collected by UWSM across Cumberland and York Counties. The data engineering problem was non-trivial — 8 different survey instruments, 18 questions, none asking the same things, producing a sparse ragged matrix where most empty cells are unasked rather than unanswered. We harmonized the schema, canonicalized open-text responses with NLP, and ran classical statistical modeling to answer three questions: what residents say their biggest challenges are, which challenges differ across economic strata, and who feels unheard. Headline finding: housing cost is cited by 82% of respondents across every income group. Below-ALICE and Above-ALICE respondents cite it at almost the same rate — chi-square confirms no significant difference. Any housing initiative framed as low-income support misses the majority of people affected. Full 25-page report and 14-slide community deck in the repo.",
    tags: ["Python", "NLP", "spaCy", "scikit-learn", "Statistical Modeling", "Data Engineering"],
    tier: "tier1",
    github: "https://github.com/myhott163com/united_way_final",
    paper: "https://github.com/myhott163com/united_way_final/blob/main/report/final_report.pdf",
    image: "/images/analyis-i.png"
  },
  {
    id: "gpt-zero",
    title: "GPT from Scratch",
    subtitle: "Independent project. 2026.",
    description: "Character-level GPT built from scratch in PyTorch. No wrapper libraries, no abstractions, no shortcuts. Just the attention mechanism, the math, and backprop. Implemented every component independently — tokenization, positional encoding, multi-head self-attention, feedforward layers, the works. If you want to actually understand how transformers work, you have to build one.",
    tags: ["Python", "PyTorch", "Transformers", "Deep Learning", "NLP"],
    tier: "tier1",
    github: "https://github.com/marzoukbaig14/gpt-zero",
    paper: null,
    image: null
  },
  {
    id: "micrograd",
    title: "Autograd Engine from Scratch",
    subtitle: "Independent project. 2026.",
    description: "A scalar-valued autograd engine and neural network library built from scratch in Python. Implements backpropagation over a dynamically built DAG — no PyTorch, no NumPy for the core engine. Gives you real appreciation for what automatic differentiation actually does under the hood. Built to understand, not to use.",
    tags: ["Python", "Autograd", "Backpropagation", "Neural Networks"],
    tier: "tier2",
    github: "https://github.com/marzoukbaig14/micrograd",
    paper: null,
    image: null
  },
  {
    id: "nanoLM",
    title: "nanoLM — Language Model from Scratch",
    subtitle: "Independent project. 2026.",
    description: "Character-level language model built from the ground up, starting from a bigram baseline and progressively building up to a full transformer. More educational deep-dive than production model — the point was understanding exactly what changes at each step of the architecture, not benchmarking against GPT-4.",
    tags: ["Python", "PyTorch", "Transformers", "Language Models"],
    tier: "tier2",
    github: "https://github.com/marzoukbaig14/nanoLM",
    paper: null,
    image: null
  },
  {
    id: "gentrification",
    title: "Gentrification and University Proximity",
    subtitle: "Independent research, University of Rochester. Fall 2023 to Fall 2024.",
    description: "Quantitative study on whether proximity to private universities in Monroe County, NY correlates with neighborhood-level gentrification indicators in Rochester. Full pipeline: data acquisition from public census and geospatial sources, cleaning and feature engineering on demographic variables, cross-validated logistic and linear regression in scikit-learn, results visualization. The interesting part was figuring out the right operationalization of gentrification before any modeling.",
    tags: ["Python", "scikit-learn", "Pandas", "Geospatial", "Regression"],
    tier: "tier2",
    github: "https://github.com/marzoukbaig14",
    paper: null,
    image: "/images/analyis-i.png"
  }
];