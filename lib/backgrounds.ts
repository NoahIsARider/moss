export const backgrounds = [
  {
    id: "rooftop",
    name: "Rooftop evenings",
    description: "Zines, plants, and a table for everyone.",
    src: "/assets/img/background-rooftop.webp",
  },
  {
    id: "plaza",
    name: "Around the corner",
    description: "A warm light and familiar faces.",
    src: "/assets/img/background-plaza.webp",
  },
  {
    id: "riverside",
    name: "The long way home",
    description: "Bicycles, tea, and the riverside.",
    src: "/assets/img/background-riverside.webp",
  },
  {
    id: "nightmarket",
    name: "One more stop",
    description: "Books and vegetables under golden lights.",
    src: "/assets/img/background-nightmarket.webp",
  },
];
export function defaultBackground() {
  return (
    backgrounds.find((b) => b.id === process.env.NEXT_PUBLIC_MOSS_BACKGROUND) ||
    backgrounds[0]
  );
}
