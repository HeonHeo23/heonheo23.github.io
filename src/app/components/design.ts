export type NeuTone =
  "yellow" | "pink" | "blue" | "green" | "orange" | "purple";

export const badgeToneClass: Record<NeuTone, string> = {
  yellow: "badge-primary",
  pink: "badge-secondary",
  blue: "badge-accent",
  green: "badge-success",
  orange: "badge-warning",
  purple: "badge-purple",
};
