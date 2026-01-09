import { useMemo, useEffect, useRef, Fragment } from "react";
import { useOverlay } from "./context/useOverlay";
import { getColorId } from "../../../../scripts/color";
import { useArchive } from "../context/useArchive";

const Overlay = ({
  resolution,
  display,
  offset,
}: {
  resolution: { w: number; h: number };
  display: { x: number; y: number; w: number; h: number };
  offset: {
    x: number;
    y: number;
  };
}) => {
  const { item, editing } = useArchive();

  const overlays = useMemo(() => {
    if (!item || !item?.overlays || resolution.w === 0 || resolution.h === 0)
      return [];

    const scaleX = display.w / resolution.w;
    const scaleY = display.h / resolution.h;

    return item.overlays.map((o) => {
      const { x, y, w, h } = o.bounds;

      return {
        uid: o.uid,
        left: offset.x + x * scaleX,
        top: offset.y + y * scaleY,
        width: w * scaleX,
        height: h * scaleY,
        rotation: o.rotation,
        shear: o.shear,
      };
    });
  }, [item, resolution, display]);

  const { overlayActive, overlayMetas, setOverlayMeta, setOverlayTransform } =
    useOverlay();

  useEffect(() => {
    if (!item?.overlays) return;

    item.overlays.forEach((o) =>
      setOverlayMeta({
        [o.uid]: {
          color: o.color && o.color.length > 0 ? o.color : getColorId(o.id),
          hover: false,
        },
      })
    );
  }, [item]);

  function toggleOverlayHover(uid: string, to: boolean) {
    setOverlayMeta({
      [uid]: { hover: to },
    });
  }

  const overlayRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    overlays.forEach((o) => {
      const overlay = overlayRefs.current[o.uid];
      if (!overlay) return;

      const rect = overlay.getBoundingClientRect();

      setOverlayTransform(true, o.uid, {
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
        const color = overlayMetas ? overlayMetas[o.uid]?.color : "#888888";
        return (
          <Fragment key={o.uid}>
            <div
              ref={(el) => {
                overlayRefs.current[o.uid] = el;
              }}
              className="absolute origin-top-left"
              style={{
                left: o.left,
                top: o.top,
                width: o.width,
                height: o.height,
                transform: `
                  rotate(${o.rotation - o.shear / 2}deg)
                  skew(${o.shear / 2}deg, ${o.shear / 2}deg)
                `,
                backgroundColor: `${color}${
                  overlayMetas[o.uid]?.hover
                    ? "4A"
                    : overlayActive
                    ? "1F"
                    : "00"
                }`,
                boxShadow: `inset 0 0 0 2px ${color}${
                  overlayMetas[o.uid]?.hover
                    ? "FF"
                    : overlayActive
                    ? "66"
                    : "00"
                }`,
              }}
              onPointerEnter={() =>
                overlayActive ? toggleOverlayHover(o.uid, true) : {}
              }
              onPointerLeave={() => toggleOverlayHover(o.uid, false)}
            />
            {editing && (
              <div
                className="absolute"
                style={{
                  left: o.left,
                  top: o.top,
                }}
              >
                <div
                  className="absolute z-[1] w-[20px] h-[4px]
                  -translate-x-[10px] -translate-y-[2px]"
                  style={{
                    backgroundColor: `${color}${
                      overlayMetas[o.uid]?.hover ? "FF" : "00"
                    }`,
                    transform: "rotate(45deg)",
                  }}
                />
                <div
                  className={`absolute z-[1] w-[20px] h-[4px]
                    -translate-x-[10px] -translate-y-[2px]
                    bg-black [.dark_&]:bg-white
                    ${!overlayMetas[o.uid]?.hover && "opacity-0"}
                  `}
                  style={{
                    transform: "rotate(135deg)",
                  }}
                />
              </div>
            )}
          </Fragment>
        );
      })}
    </>
  );
};

export default Overlay;
