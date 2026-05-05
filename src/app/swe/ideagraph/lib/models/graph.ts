import { Idea } from "../types/idea";
import { Influence } from "../types/influence";
import fs from "fs";

const DATA_PATH = "ideagraph.json";

export interface IdeaWithStrength {
  idea: Idea;
  strength: number;
}

interface Data {
  ideas: Idea[];
  influences: Influence[];
}

export class IdeaGraph {
  private ideas: Idea[] = [];
  private influences: Influence[] = [];

  constructor() {
    this.loadFromFile();
  }

  private loadFromFile = () => {
    if (!fs.existsSync(DATA_PATH)) {
      fs.writeFileSync(
        DATA_PATH,
        JSON.stringify({ ideas: [], influences: [] }, null, 2)
      );
    }
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Data;

    this.ideas = parsed.ideas;
    this.influences = parsed.influences;
  };
  private saveToFile = () => {
    const data: Data = {
      ideas: this.ideas,
      influences: this.influences,
    };
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
  };

  createIdea = (data: Omit<Idea, "id">): Idea => {
    const idea: Idea = {
      id: crypto.randomUUID(),
      ...data,
    };
    this.ideas.push(idea);
    this.saveToFile();
    return idea;
  };
  getIdea = (id: string): Idea | undefined => {
    this.loadFromFile();
    return this.ideas.find((i) => i.id == id);
  };
  getAllIdeas = (): Idea[] => {
    this.loadFromFile();
    return [...this.ideas].sort((a, b) => a.originDate - b.originDate);
  };
  updateIdea = (id: string, changes: Partial<Omit<Idea, "id">>) => {
    this.loadFromFile();
    const idea = this.getIdea(id);
    if (!idea) return undefined;
    Object.assign(idea, changes);
    console.log(idea);
    this.saveToFile();
    return idea;
  };
  deleteIdea = (id: string): boolean => {
    const index = this.ideas.findIndex((i) => i.id === id);
    if (index === -1) return false;

    this.ideas.splice(index, 1);
    this.influences = this.influences.filter(
      (inf) => inf.fromId !== id && inf.toId !== id
    );
    this.saveToFile();
    return true;
  };

  createInfluence = (data: Omit<Influence, "id">): Influence | undefined => {
    if (data.fromId === data.toId) return undefined;
    if (!this.getIdea(data.fromId) || !this.getIdea(data.toId))
      return undefined;

    const influence: Influence = {
      id: crypto.randomUUID(),
      strength: data.strength ?? 1,
      ...data,
    };

    this.influences.push(influence);
    this.saveToFile();
    return influence;
  };

  getInfluence = (id: string): Influence | undefined => {
    return this.influences.find((i) => i.id == id);
  };

  getAllInfluences = () => {
    this.loadFromFile();
    return [...this.influences];
  };

  updateInfluence = (id: string, changes: Partial<Omit<Influence, "id">>) => {
    const influence = this.getInfluence(id);
    if (!influence) return undefined;

    Object.assign(influence, changes);
    this.saveToFile();
    return influence;
  };

  deleteInfluence = (id: string): boolean => {
    const index = this.influences.findIndex((inf) => inf.id === id);
    if (index === -1) return false;

    this.influences.splice(index, 1);
    this.saveToFile();
    return true;
  };

  getParents = (id: string): IdeaWithStrength[] => {
    this.loadFromFile();
    return this.influences
      .filter((inf) => inf.toId === id)
      .map((inf) => {
        const idea = this.getIdea(inf.fromId);
        return idea ? { idea, strength: inf.strength } : null;
      })
      .filter((i): i is IdeaWithStrength => !!i);
  };

  getChildren = (id: string): IdeaWithStrength[] => {
    this.loadFromFile();
    return this.influences
      .filter((inf) => inf.fromId === id)
      .map((inf) => {
        const idea = this.getIdea(inf.toId);
        return idea ? { idea, strength: inf.strength } : null;
      })
      .filter((i): i is IdeaWithStrength => !!i);
  };
}

export const ideaGraph = new IdeaGraph();
