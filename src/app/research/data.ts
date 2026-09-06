export type ResearchPaper = {
  slug: string;
  published: string;
  publishedDate: string;
  type: string;
  title: string;
  authors: string;
  venue: string;
  volume: string;
  identifier: string;
  pages?: string;
  publisher: string;
  doi: string;
  href: string;
  abstract: string;
  abstractSections: {
    background: string;
    methods: string;
    results: string;
    conclusions: string;
  };
  tags: string[];
};

export const papers: ResearchPaper[] = [
  {
    slug: "deep-learning-assisted-cytological-image-analysis-for-canine-lymphoma",
    published: "FEB 2026",
    publishedDate: "February 23, 2026",
    type: "Journal article",
    title: "Deep learning-assisted cytological image analysis for canine lymphoma",
    authors:
      "Chanel Shum*, Donghee Lee*, Hyunji Jo, Joanne Kim, Heon Heo, Shir Gilor, Christopher Lanier, Kevin Hall, Michael Dark, Jong Hyuk Kim, Cleverson de Souza",
    venue: "Veterinary Oncology",
    volume: "3",
    identifier: "Article 5",
    publisher: "Springer Nature",
    doi: "10.1186/s44356-026-00056-5",
    href: "https://doi.org/10.1186/s44356-026-00056-5",
    abstract:
      "A proof-of-concept study evaluates whether convolutional neural networks can support cytological diagnosis of canine lymphoma. Using ResNet-50 models and patient-level cross-validation, the work distinguishes lymphoma from reactive lymphoid hyperplasia and explores B-cell versus T-cell phenotyping. The results show strong performance for the primary distinction while identifying the more difficult subtype classification problem as an area for further validation.",
    abstractSections: {
      background:
        "Canine lymphoma can be difficult to characterize from cytology alone, particularly when definitive histopathology and immunophenotyping are not immediately available. This study examines whether deep learning can assist with that diagnostic workflow.",
      methods:
        "The authors trained ResNet-50 convolutional neural networks on cytological images from 184 dogs. Patient-level dataset splitting and ten-fold cross-validation were used to evaluate two tasks: distinguishing lymphoma from reactive lymphoid hyperplasia, and classifying lymphoma as B-cell or T-cell.",
      results:
        "The lymphoma-versus-reactive-hyperplasia models achieved 85.4–95.4% test accuracy with AUC-ROC values of 0.943–0.988. B-cell versus T-cell classification achieved 66.2–79.8% test accuracy, indicating a more challenging subtyping problem.",
      conclusions:
        "The results support deep learning as a proof-of-concept tool for canine lymphoma cytology and provide a reproducible technical foundation for broader datasets and prospective clinical validation.",
    },
    tags: ["Deep learning", "Computer vision", "Model evaluation"],
  },
  {
    slug: "structured-inverse-design-a-tile-based-approach-for-practical-photonic-integration",
    published: "SEP 2025",
    publishedDate: "September 18, 2025",
    type: "Conference Proceeding",
    title: "Structured inverse design: a tile-based approach for practical photonic integration",
    authors:
      "Isaac Yu*, Heon Heo*, Byeongkwan Jeon*, Belal Jahannia, Abdolah Amirany, Hamed Dalir, Elham Heidari",
    venue: "Optical Design Automation",
    volume: "13601",
    identifier: "136010I",
    pages: "145–157",
    publisher: "SPIE",
    doi: "10.1117/12.3066478",
    href: "https://doi.org/10.1117/12.3066478",
    abstract:
      "A fabrication-aware, tile-based framework supports inverse photonic design. Binary tile primitives and direct binary search are combined with macro initialization, randomized scanning, resolution variation, and tile-shape diversity to maintain manufacturable layouts during optimization. The approach is evaluated on photonic devices including Y-branch splitters, power dividers, and an optical XOR gate using full-wave FDTD simulation.",
    abstractSections: {
      background:
        "Inverse design can discover high-performing photonic structures, but continuous layouts may be difficult to manufacture. The study investigates a structured representation that keeps fabrication constraints in the design process.",
      methods:
        "The framework represents devices with binary tile primitives and searches their layouts with direct binary search. Macro initialization, randomized tile scanning, resolution variation, and multiple tile shapes are introduced as targeted improvements, with full-wave FDTD simulation used for evaluation.",
      results:
        "The method is demonstrated on a Y-branch splitter, a three-port power divider, and a photonic XOR gate. The experiments show that initialization, scan randomization, grid resolution, and tile diversity affect optimization quality and layout refinement in different ways.",
      conclusions:
        "Tile-based direct binary search offers a structured route toward scalable, fabrication-compatible photonic integration without relying on continuous or post-processed layouts.",
    },
    tags: ["Computational optimization", "FDTD simulation", "Design automation"],
  },
];
