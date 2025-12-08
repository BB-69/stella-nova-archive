export interface ItemOverlay {
  id: string;
  frame: { s: number; e: number } | null;
  bounds: { x: number; y: number; w: number; h: number };
  bounds_end: { x: number; y: number; w: number; h: number } | null;
  rotation: number;
  shear: number;
  text: string;
  notes: string | null;
}
[];

export interface ItemData {
  id: string;
  type: string;
  category: string;
  sub_category: string[] | null;
  title: string;
  description: string;
  source: string[];

  meta: {
    width: number;
    height: number;
    frames: number | null;
    version: string;
  };

  overlays: ItemOverlay;
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
