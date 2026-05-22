export const projects = [
  {
    id: "mkp-ga",
    title: "Generating Function Initialization for Genetic Algorithms",
    subtitle: "MS Research, Northeastern. May 2025 to now.",
    description: "A new way to initialize genetic algorithms on tightly constrained problems. Standard 50/50 random initialization fails on tight Multidimensional Knapsack instances. Every solution is infeasible and the GA is dead on arrival under a death penalty model. I derive per-item sampling probabilities from sub-generating functions, no objective values or LP relaxation needed. GPU Monte Carlo estimates all 100 probabilities in around 6 seconds on a T4. On the tight benchmark where uniform initialization gets 0% feasibility, this gets 52.5% and converges to 96.5% of the reference best. Confirmed novelty through correspondence with the closest prior work (Hill, 1999). Paper PDF and code on GitHub.",
    tags: ["Python", "PyTorch", "GPU", "Genetic Algorithms", "Combinatorial Optimization", "Research"],
    tier: "featured",
    github: "https://github.com/marzoukbaig14/MKP-using-Genetic-Algorithm",
    paper: "https://github.com/marzoukbaig14/MKP-using-Genetic-Algorithm/blob/main/docs/proposal/Before%20The%20Search%20Begins.pdf",
    image: null
  },
  {
    id: "united-way-nlp",
    title: "Municipal Grant NLP Classifier",
    subtitle: "Applied AI Capstone, Northeastern XN program. Summer 2024.",
    description: "Built end-to-end for United Way of Southern Maine. First phase was a data pipeline on public municipal grant records: extraction, cleaning, EDA, and statistical analysis of funding trends and category allocation. Second phase extended it into NLP on open-ended community survey responses. spaCy for preprocessing and named entity recognition, BART-large-MNLI from Hugging Face for zero-shot thematic classification, and chi-square, logistic regression, PCA, and K-Means in scikit-learn for cross-segment pattern finding. Findings went to a non-technical client.",
    tags: ["Python", "spaCy", "Hugging Face", "BART", "scikit-learn", "NLP"],
    tier: "tier1",
    github: "https://github.com/marzoukbaig14",
    paper: null,
    image: "/images/analyis-i.png"
  },
  {
    id: "gentrification",
    title: "Gentrification and University Proximity",
    subtitle: "Independent research, University of Rochester. Fall 2023 to Fall 2024.",
    description: "Quantitative study on whether proximity to private universities in Monroe County, NY correlates with neighborhood-level gentrification indicators in Rochester. Full pipeline: data acquisition from public census and geospatial sources, cleaning and feature engineering on demographic variables, cross-validated logistic and linear regression in scikit-learn, results visualization. The interesting part was figuring out the right operationalization of gentrification before any modeling.",
    tags: ["Python", "scikit-learn", "Pandas", "Geospatial", "Regression"],
    tier: "tier1",
    github: "https://github.com/marzoukbaig14",
    paper: null,
    image: "/images/analyis-i.png"
  },
  {
    id: "1010data-sdk",
    title: "1010data Python SDK",
    subtitle: "SWE Intern, 1010data NYC. Summer 2022.",
    description: "Designed and built a pip-installable Python library that mirrored the Pandas API. Method calls were translated to 1010data's proprietary XML query language via a translation algorithm I wrote from scratch. Integrated end-to-end: SSO auth, custom REST endpoints I added to the internal stack, server-side execution, live results in the 1010data GUI. The new endpoints replaced a Selenium prototype that had failed security review and cut codebase size by over 30%.",
    tags: ["Python", "REST API", "OOP", "XML", "SSO"],
    tier: "tier2",
    github: "https://github.com/marzoukbaig14",
    paper: null,
    image: null
  },
  {
    id: "dvcs-rust",
    title: "Distributed Version Control System",
    subtitle: "Collaborative project, University of Rochester. Fall 2023.",
    description: "A distributed version control system built from scratch in Rust with a small team. Modular architecture across independently developed components for object storage, commit history, branching, merging, and conflict detection. My focus was conflict resolution and distributed state consistency across nodes.",
    tags: ["Rust", "Distributed Systems", "Systems Programming"],
    tier: "tier2",
    github: "https://github.com/marzoukbaig14",
    paper: null,
    image: "/images/dvcs.png"
  }
];