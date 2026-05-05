// src/content/pilotData.ts
import type { SimData, ValueLabel, StanceSpec } from "../game/types";

const stanceCostStd = { base: 1, perPoint: 6, maxDelta: 0.3 };
const stanceCostSoft = { base: 1, perPoint: 5, maxDelta: 0.35 };

const resourceAuthorityLabels: ValueLabel[] = [
  { min: 0, max: 5, label: "Empty" },
  { min: 5, max: 15, label: "Low" },
  { min: 15, max: 30, label: "Stable" },
  { min: 30, max: 50, label: "Abundant" },
];

const resourceBudgetLabels: ValueLabel[] = [
  { min: 0, max: 15, label: "Tight" },
  { min: 15, max: 40, label: "Limited" },
  { min: 40, max: 70, label: "Healthy" },
  { min: 70, max: 100, label: "Flush" },
];

const continuous01: StanceSpec = { kind: "continuous", step: 0.01 };

const discreteLowMidHigh: StanceSpec = {
  kind: "discrete",
  levels: [
    { value: 0.0, label: "Low" },
    { value: 0.5, label: "Medium" },
    { value: 1.0, label: "High" },
  ],
};

export const pilotData: SimData = {
  nodes: [
    {
      id: "authority",
      type: "resource",
      name: "Authority",
      description: "Authority capital used to change stances.",
      domain: { min: 0, max: 50, clamp: true },
      category: "Resource",
      valueLabels: resourceAuthorityLabels,
    },
    {
      id: "a",
      type: "stance",
      name: "A",
      description: "Local autonomy versus centralized hierarchy.",
      domain: { min: 0, max: 1, clamp: true },
      category: "Governance",
      stanceCost: stanceCostStd,
      stance: continuous01,
      startActive: false
    },
    {
      id: "b",
      type: "indicator",
      name: "B",
      description: "Retention and emotional attachment to the denomination.",
      domain: { min: 0, max: 1, clamp: true },
      category: "Governance",
    },
    {
      id: "d",
      type: "indicator",
      name: "D",
      description: "Retention and emotional attachment to the denomination.",
      domain: { min: 0, max: 1, clamp: true },
      category: "Governance",
    },
    {
      id: "l",
      type: "situation",
      name: "Leadership Crisis",
      description:
        "Leadership is distrusted and overstretched. Capacity and implementation suffer.",
      domain: { min: 0, max: 1, clamp: true },
      category: "Situations",
      situation: { start: 0.65, stop: 0.64 },
      positive: false,
      startActive: true,
    },
    {
      id: "c",
      type: "indicator",
      name: "C",
      description: "Retention and emotional attachment to the denomination.",
      domain: { min: 0, max: 1, clamp: true },
      category: "Governance",
    },
  ],

  effects: [
    {
      sourceId: "a",
      targetId: "b",
      magnitude: 1,
      inertiaTurns: 6,
    },
    {
      sourceId: "b",
      targetId: "c",
      magnitude: 0.3,
      inertiaTurns: 6,
    },
    {
      sourceId: "c",
      targetId: "l",
      magnitude: 0.2,
      inertiaTurns: 1,
    },
    {
      sourceId: "l",
      targetId: "d",
      magnitude: 0.3,
      inertiaTurns: 1,
    },
  ],
};
