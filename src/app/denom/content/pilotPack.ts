import type { PilotPack } from "../game/types";
import { pilotData } from "./pilotData";

export const pilotPack: PilotPack = {
  id: "pilot_02",
  title: "Core Simulation Test",
  description: "Minimal pack to test nodes and effects with a unified tick.",
  data: pilotData,
  initialValues: {

    authority: 10,
  },
  authority: {
    nodeId: "authority",
  },
  startTurn: 300,
};

export const pilotPack_01: PilotPack = {
  id: "pilot_01",
  title: "Core Simulation Test",
  description: "Minimal pack to test nodes and effects with a unified tick.",
  data: pilotData,
  initialValues: {
    adultEducationSubsidies: 0.5,
    education: 0.5,
    gdp: 0.5,
    carUsage: 0.5,
    authority: 10,
  },
  authority: {
    nodeId: "authority",
  },
  startTurn: 300,
};
