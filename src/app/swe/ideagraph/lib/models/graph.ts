import { Idea } from "../types/idea";
import { Influence } from "../types/influence";
import initialData from "../../../../../../ideagraph.json";

const STORAGE_KEY = "heonheo-ideagraph";

export interface IdeaWithStrength {
  idea: Idea;
  strength: number;
}

interface Data {
  ideas: Idea[];
  influences: Influence[];
}

const hydrate = (data: typeof initialData): Data => ({
  ideas: data.ideas.map((idea) => ({
    ...idea,
    createdAt: new Date(idea.createdAt),
    updatedAt: new Date(idea.updatedAt),
  })),
  influences: data.influences,
});

export class IdeaGraph {
  private ideas: Idea[] = [];
  private influences: Influence[] = [];

  constructor() {
    this.load();
  }

  private load = () => {
    if (typeof window === "undefined") {
      const data = hydrate(initialData);
      this.ideas = data.ideas;
      this.influences = data.influences;
      return;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as typeof initialData) : initialData;
    const data = hydrate(parsed);
    this.ideas = data.ideas;
    this.influences = data.influences;
  };
  private save = () => {
    const data: Data = {
      ideas: this.ideas,
      influences: this.influences,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  createIdea = (data: Omit<Idea, "id">): Idea => {
    const idea: Idea = {
      id: crypto.randomUUID(),
      ...data,
    };
    this.ideas.push(idea);
    this.save();
    return idea;
  };
  getIdea = (id: string): Idea | undefined => {
    this.load();
    return this.ideas.find((i) => i.id == id);
  };
  getAllIdeas = (): Idea[] => {
    this.load();
    return [...this.ideas].sort((a, b) => a.originDate - b.originDate);
  };
  updateIdea = (id: string, changes: Partial<Omit<Idea, "id">>) => {
    this.load();
    const idea = this.getIdea(id);
    if (!idea) return undefined;
    Object.assign(idea, changes);
    console.log(idea);
    this.save();
    return idea;
  };
  deleteIdea = (id: string): boolean => {
    const index = this.ideas.findIndex((i) => i.id === id);
    if (index === -1) return false;

    this.ideas.splice(index, 1);
    this.influences = this.influences.filter(
      (inf) => inf.fromId !== id && inf.toId !== id,
    );
    this.save();
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
    this.save();
    return influence;
  };

  getInfluence = (id: string): Influence | undefined => {
    return this.influences.find((i) => i.id == id);
  };

  getAllInfluences = () => {
    this.load();
    return [...this.influences];
  };

  updateInfluence = (id: string, changes: Partial<Omit<Influence, "id">>) => {
    const influence = this.getInfluence(id);
    if (!influence) return undefined;

    Object.assign(influence, changes);
    this.save();
    return influence;
  };

  deleteInfluence = (id: string): boolean => {
    const index = this.influences.findIndex((inf) => inf.id === id);
    if (index === -1) return false;

    this.influences.splice(index, 1);
    this.save();
    return true;
  };

  getParents = (id: string): IdeaWithStrength[] => {
    this.load();
    return this.influences
      .filter((inf) => inf.toId === id)
      .map((inf) => {
        const idea = this.getIdea(inf.fromId);
        return idea ? { idea, strength: inf.strength } : null;
      })
      .filter((i): i is IdeaWithStrength => !!i);
  };

  getChildren = (id: string): IdeaWithStrength[] => {
    this.load();
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
