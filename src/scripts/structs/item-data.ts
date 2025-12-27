export interface ItemMeta {
  width: number;
  height: number;
  frames: number | null;
  version: string;
}

export interface ItemOverlay {
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

export function isItemData(x: any): x is ItemData {
  return (
    typeof x === "object" &&
    x !== null &&
    typeof x.id === "string" &&
    typeof x.type === "string" &&
    Array.isArray(x.source)
  );
}

export function defaultItemOverlay(id?: string): ItemOverlay {
  return {
    id: id ?? "newOverlay",
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
    id: id ?? "newItem",
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
