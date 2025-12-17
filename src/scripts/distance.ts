export type position = { x: number; y: number };
export function positionDefault(): position {
  return { x: 0, y: 0 };
}
export type positionMeta = {
  p: position;
  t: number;
  b: number;
  l: number;
  r: number;
};
export function positionMetaDefault(): positionMeta {
  return {
    p: positionDefault(),
    t: 0,
    b: 0,
    l: 0,
    r: 0,
  };
}
export function getAllDirPosition(meta: positionMeta): position[] {
  const p = [
    { x: meta.p.x, y: meta.t },
    { x: meta.p.x, y: meta.b },
    { x: meta.l, y: meta.p.y },
    { x: meta.r, y: meta.p.y },
  ];
  console.log(p);
  return p;
}

export function getDistance(
  from: { x: number; y: number },
  to: { x: number; y: number }
): number {
  return Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2));
}
