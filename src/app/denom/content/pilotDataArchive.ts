import type { SimData } from "../game/types";

export const pilotData: SimData = {
  nodes: [
    {
      id: "adultEducationSubsidies",
      type: "stance",
      name: "Adult Education Subsidies",
      description: "Policy stance slider.",
      domain: { min: 0, max: 1, clamp: false },
      category: "A",
      stanceCost: { base: 1, perPoint: 6, maxDelta: 0.3 },
    },
    {
      id: "education",
      type: "indicator",
      name: "Education",
      description: "Indicator affected by subsidies.",
      domain: { min: 0, max: 1, clamp: false },
      category: "A",
    },
    {
      id: "gdp",
      type: "indicator",
      name: "GDP",
      description: "Economic output proxy.",
      domain: { min: 0, max: 1, clamp: false },
      category: "B",
    },
    {
      id: "carUsage",
      type: "indicator",
      name: "Car Usage",
      description: "Example of indicator affecting indicator.",
      domain: { min: 0, max: 1, clamp: false },
      category: "C",
    },
    {
      id: "authority",
      type: "resource",
      name: "Authority",
      description: "Authority capital as a resource node.",
      domain: { min: 0, max: 20, clamp: false },
      category: "B",
    },
  ],
  effects: [
    { sourceId: "_default_", targetId: "education", magnitude: 0.04 },
    {
      sourceId: "adultEducationSubsidies",
      targetId: "education",
      magnitude: 0.04,
    },

    // GDP -> car usage
    { sourceId: "gdp", targetId: "carUsage", magnitude: 0.05 },

    // Simple authority drift
    { sourceId: "_default_", targetId: "authority", magnitude: 0.5 },
  ],
};
