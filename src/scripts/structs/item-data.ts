import { getTagLevel } from "./tag-data";

export interface ItemMeta {
  width: number;
  height: number;
  frames: number | null;
  version: string;
}

export interface ItemOverlay {
  uid: string;
  id: string;
  frame: { s: number; e: number } | null;
  bounds: { x: number; y: number; w: number; h: number };
  bounds_end: { x: number; y: number; w: number; h: number } | null;
  rotation: number;
  shear: number;
  text: string;
  notes: string | null;
  color: string;
}

export interface ItemOverlayFraction {
  uid?: string;
  id?: string;
  frame?: { s: number; e: number } | null;
  bounds?: { x: number; y: number; w: number; h: number };
  bounds_end?: { x: number; y: number; w: number; h: number } | null;
  rotation?: number;
  shear?: number;
  text?: string;
  notes?: string | null;
  color?: string;
}

export interface ItemData {
  id: string;
  type: string;
  category: string;
  sub_category: string[];
  title: string;
  description: string;
  source: string[];

  meta: ItemMeta;

  overlays: ItemOverlay[];
}

export interface ItemDataFraction {
  id?: string;
  type?: string;
  category?: string;
  sub_category?: string[];
  title?: string;
  description?: string;
  source?: string[];

  meta?: ItemMeta;

  overlays?: ItemOverlay[];
}

export function isItemMeta(x: any): x is ItemMeta {
  return (
    x &&
    x.width &&
    x.height &&
    x.version &&
    typeof x === "object" &&
    typeof x.width === "number" &&
    typeof x.height === "number" &&
    (x.frames === null || typeof x.frames === "number") &&
    typeof x.version === "string"
  );
}

export function isItemOverlay(x: any): x is ItemOverlay {
  return (
    x &&
    /* prevent 'uid' deep copy for now since
    not all data has this property yet... */
    // x.uid &&
    x.id &&
    x.bounds &&
    x.rotation !== undefined &&
    x.shear !== undefined &&
    x.text &&
    x.color !== undefined &&
    typeof x === "object" &&
    // typeof x.uid === "string" &&
    typeof x.id === "string" &&
    (x.frame === null ||
      (typeof x.frame === "object" &&
        typeof x.frame.s === "number" &&
        typeof x.frame.e === "number")) &&
    typeof x.bounds === "object" &&
    typeof x.bounds.x === "number" &&
    typeof x.bounds.y === "number" &&
    typeof x.bounds.w === "number" &&
    typeof x.bounds.h === "number" &&
    (x.bounds_end === null ||
      (typeof x.bounds_end === "object" &&
        typeof x.bounds_end.x === "number" &&
        typeof x.bounds_end.y === "number" &&
        typeof x.bounds_end.w === "number" &&
        typeof x.bounds_end.h === "number")) &&
    typeof x.rotation === "number" &&
    typeof x.shear === "number" &&
    typeof x.text === "string" &&
    (x.notes === null || typeof x.notes === "string") &&
    typeof x.color === "string"
  );
}

export function isItemData(x: any): x is ItemData {
  return (
    x &&
    x.id &&
    x.type &&
    x.category &&
    x.title &&
    x.description &&
    x.meta &&
    typeof x === "object" &&
    typeof x.id === "string" &&
    typeof x.type === "string" &&
    typeof x.category === "string" &&
    getTagLevel(x.category) === "primary" &&
    Array.isArray(x.sub_category) &&
    (x.sub_category.length > 0
      ? (() => {
          for (let c of x.sub_category) {
            if (typeof c !== "string" || getTagLevel(c) !== "secondary")
              return false;
          }
          return true;
        })()
      : true) &&
    typeof x.title === "string" &&
    typeof x.description === "string" &&
    Array.isArray(x.source) &&
    (x.source.length > 0
      ? (() => {
          for (let s of x.source) {
            if (typeof s !== "string") return false;
          }
          return true;
        })()
      : true) &&
    isItemMeta(x.meta) &&
    Array.isArray(x.overlays) &&
    (x.overlays.length > 0
      ? (() => {
          for (let o of x.overlays) {
            if (!isItemOverlay(o)) return false;
          }
          return true;
        })()
      : true)
  );
}

export function defaultItemOverlay(id?: string): ItemOverlay {
  return {
    uid: crypto.randomUUID(),
    id: id ?? "new_overlay",
    frame: null,
    bounds: { x: 0, y: 0, w: 300, h: 300 },
    bounds_end: null,
    rotation: 0,
    shear: 0,
    text: "< null >",
    notes: null,
    color: "",
  };
}

export function defaultItemData(id?: string): ItemData {
  return {
    id: id ?? "new_item",
    type: "image",
    category: "other",
    sub_category: [],
    title: "< null >",
    description: "< null >",
    source: [],

    meta: {
      width: 1700,
      height: 1700,
      frames: null,
      version: "0.0.0",
    },

    overlays: [],
  };
}

const prefixes: Record<string, string> = {
  illustration: "illu",
  live2d: "l2d",
  battle_stage: "bat",
  ui: "ui",
  other: "other",

  // illu - l2d
  background: "bg",
  character: "char",
  disc: "disc",

  // bat
  ascension: "asc",

  // ui
  in_game: "game",
  encyclopedia: "guide",
};

export function getFileName(i: ItemData): string {
  const cat = prefixes[i.category];
  const subcat = prefixes[i.sub_category[0]];
  return `${cat ?? "other"}-${subcat ? `${subcat}-` : ""}${i.id}.json`;
}

export function processItemData(i: ItemData): ItemData {
  i = { ...defaultItemData(), ...i };

  if (i.sub_category.includes("< null >")) i.sub_category = [];

  if (i.source.length === 0) {
    const subcat = i.sub_category[0];
    const prefix = `assets/${i.category}/${subcat ? `${subcat}/` : ""}${i.id}`;
    i.source = [`${prefix}.webp`, `${prefix}.png`];
  }

  i.overlays.map((o) => processItemOverlay(o));

  return i;
}

export function processItemOverlay(o: ItemOverlay): ItemOverlay {
  return { ...defaultItemOverlay(), ...o };
}
