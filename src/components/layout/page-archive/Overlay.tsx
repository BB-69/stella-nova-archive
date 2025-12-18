import { useMemo, useEffect, useRef } from "react";
import randomHexColor from "../../../scripts/random-hexcolor";
import type { ItemData } from "../../../scripts/structs/item-data";
import { useOverlayContext } from "./OverlayContext";

const Overlay = ({
  item,
  resolution,
  display,
  offset,
}: {
  item: ItemData | null;
  resolution: { w: number; h: number };
  display: { x: number; y: number; w: number; h: number };
  offset: {
    x: number;
    y: number;
  };
}) => {
  const overlays = useMemo(() => {
    if (!item || !item?.overlays || resolution.w === 0 || resolution.h === 0)
      return [];

    const scaleX = display.w / resolution.w;
    const scaleY = display.h / resolution.h;

    return item.overlays.map((overlays) => {
      const { x, y, w, h } = overlays.bounds;

      return {
        id: overlays.id,
        left: offset.x + x * scaleX,
        top: offset.y + y * scaleY,
        width: w * scaleX,
        height: h * scaleY,
      };
    });
  }, [item, resolution, display]);

  const { overlayMetas, setOverlayMeta, setOverlayTransform } =
    useOverlayContext();

  useEffect(() => {
    if (!item?.overlays) return;

    item.overlays.forEach((o) =>
      setOverlayMeta({ [o.id]: { color: randomHexColor(), hover: false } })
    );
  }, [item]);

  function toggleOverlayHover(id: string, to: boolean) {
    setOverlayMeta({
      [id]: { hover: to },
    });
  }

  const overlayRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    overlays.forEach(({ id }) => {
      const overlay = overlayRefs.current[id];
      if (!overlay) return;

      const rect = overlay.getBoundingClientRect();

      setOverlayTransform(true, id, {
        p: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
        t: rect.top,
        b: rect.bottom,
        l: rect.left,
        r: rect.right,
      });
    });
  }, [overlays]);

  return (
    <>
      {overlays.map((o) => {
        const color = overlayMetas ? overlayMetas[o.id]?.color : "#888888";
        return (
          <div
            ref={(el) => {
              overlayRefs.current[o.id] = el;
            }}
            key={o.id}
            className="absolute border-2"
            style={{
              left: o.left,
              top: o.top,
              width: o.width,
              height: o.height,
              backgroundColor: `${color}${
                overlayMetas[o.id]?.hover ? "4A" : "1F"
              }`,
              borderColor: `${color}${overlayMetas[o.id]?.hover ? "FF" : "66"}`,
            }}
            onPointerEnter={() => toggleOverlayHover(o.id, true)}
            onPointerLeave={() => toggleOverlayHover(o.id, false)}
          />
        );
      })}
    </>
  );
};

export default Overlay;
