export interface Influence {
  id: string;
  fromId: string;
  toId: string;
  type?: string;
  strength?: number;
}
