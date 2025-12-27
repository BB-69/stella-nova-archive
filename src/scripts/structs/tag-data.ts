export const tags = [
  {
    level: "primary",
    tag: ["illustration", "live2d", "battle_stage", "ui", "other"],
  },
  {
    level: "secondary",
    tag: [
      "background",
      "character",
      "disc",
      "ascension",
      "in_game",
      "encyclopedia",
    ],
  },
  {
    level: "tertiary",
    tag: ["element", "rarity", "domain"],
  },
];

export const filterTags = [
  {
    main: "illustration",
    sub: ["background", "character", "disc"],
  },
  {
    main: "live2d",
    sub: ["background", "character"],
  },
  {
    main: "battle_stage",
    sub: ["ascension"],
  },
  {
    main: "ui",
    sub: ["in_game", "encyclopedia"],
  },
  {
    main: "other",
    sub: [],
  },
];

function getTagLevel(tag: string): string {
  for (const tl of tags) {
    if (tl.tag.includes(tag)) return tl.level;
  }
  return "none";
}

const tagColor: Record<string, { col1: string; col2: string }> = {
  // index category
  primary: {
    col1: "#660066",
    col2: "#FFCCFF",
  },
  // sub category
  secondary: {
    col1: "#006600",
    col2: "#CCFFCC",
  },
  // exclusive type
  tertiary: {
    col1: "#006666",
    col2: "#CCFFFF",
  },
  // default
  none: {
    col1: "#555555",
    col2: "#EEEEEE",
  },
};

export function getTagColor(tag: string): {
  col1: string;
  col2: string;
} {
  return tagColor[getTagLevel(tag)];
}
