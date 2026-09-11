export function formatBookTitle(slug: string) {
  return slug
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}
