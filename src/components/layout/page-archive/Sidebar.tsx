import { ChevronDown, ChevronUp, Menu, Type } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ItemData } from "../../../scripts/structs/item-data";
import TextBox from "../../common/text-box";
import { useOverlayContext } from "./OverlayContext";

/* ---LOCAL_TEST--- */
// const overlayItems: ItemOverlay[] = [
//   {
//     id: "title",
//     frame: null,
//     bounds: { x: 600, y: 60, w: 720, h: 240 },
//     bounds_end: null,
//     rotation: 0,
//     shear: 0,
//     text: "SAMPLE",
//     notes: null,
//   },
//   {
//     id: "title-sub",
//     frame: null,
//     bounds: { x: 180, y: 540, w: 1560, h: 420 },
//     bounds_end: null,
//     rotation: 0,
//     shear: 0,
//     text: "The trees are whispering...",
//     notes: "Low confidence",
//   },
// ];

const Sidebar = ({
  onToggleSidebar,
  sidebarCollapsed,
  item,
}: {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
  item: ItemData | null;
}) => {
  const [foldedTl, setFoldedTl] = useState<{ [key: string]: boolean }>({});
  const { overlayMetas, setOverlayMeta, setOverlayTransform } =
    useOverlayContext();

  useEffect(() => {
    if (!item) return;
    // Initialize all tags as unchecked
    item.overlays.forEach((i) => {
      setFoldedTl((prev) => ({ ...prev, [i.id]: true }));
      // sub.forEach((s) => {
      //   setCollapsedTl((prev) => ({ ...prev, [`${i.id}-${s}`]: false }));
      // });
    });
  }, []);

  function toggleFoldedTl(key: string) {
    setFoldedTl((prev) => ({ ...prev, [key]: !foldedTl[key] }));
  }

  const overlayInfoRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const overlay = overlayInfoRefs.current;
    if (!overlay) return;

    const updateOverlayTransform = () => {
      Object.entries(item?.overlays ?? []).forEach(([_, { id }]) => {
        if (!overlay[id]) return;

        const rect = overlay[id].getBoundingClientRect();

        setOverlayTransform(false, id, {
          p: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
          t: rect.top,
          b: rect.bottom,
          l: rect.left,
          r: rect.right,
        });
      });
    };

    const observer = new ResizeObserver(() => {
      updateOverlayTransform();
    });

    Object.values(overlay).forEach((el) => {
      if (el) observer.observe(el);
    });

    updateOverlayTransform();

    return () => {
      observer.disconnect();
    };
  }, [item]);

  return (
    <aside
      aria-expanded={!sidebarCollapsed}
      className={`overflow-hidden flex flex-col p-3.5
      border-r border-black/20 [.dark_&]:border-white/20
      shadow-md shadow-black/20 [.dark_&]:shadow-white/20
      bg-gradient-to-b from-[#f3fdff] to-white
      [.dark_&]:from-[#0b1220] [.dark_&]:to-black
      transition-[width] duration-200 z-10
      ${sidebarCollapsed ? "w-[72px]" : "w-[260px]"}`}
    >
      <div
        className="flex items-center h-16 pb-3 min-w-full
        border-b border-black/30 [.dark_&]:border-white/30"
      >
        <button
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex flex-row justify-top items-center
          h-full w-full p-[6px_10px]
          rounded-md hover:bg-black/5 [.dark_&]:hover:bg-white/5"
        >
          <div className="absolute">
            <Menu />
          </div>
          <span
            className={`
              font-bold ml-9 origin-left duration-200
              ${
                sidebarCollapsed
                  ? "opacity-0 scale-x-0"
                  : "opacity-100 scale-x-100"
              }
            `}
          >
            Translation
          </span>
        </button>
      </div>

      <div className="flex flex-col justify-between h-full">
        <nav className="flex flex-col gap-2 mt-3" aria-label="Sidebar">
          {item?.overlays.map((it) => {
            let index = 1;
            const om = overlayMetas[it.id];
            return (
              <div key={it.id} className="flex flex-col w-full h-full">
                <div
                  ref={(el) => {
                    overlayInfoRefs.current[it.id] = el;
                  }}
                  className={`flex items-center p-[10px_8.5px] rounded-md
                  font-semibold text-[var(--t-c)] [.dark_&]:text-[var(--t-c-dark)]
                  border-1 whitespace-nowrap`}
                  style={{
                    backgroundColor:
                      om && om.color && om.hover
                        ? `${om.color}19`
                        : "#00000000",
                    borderColor:
                      (!sidebarCollapsed && !foldedTl[it.id]) ||
                      (om && om.hover)
                        ? om && om.color
                          ? om.color
                          : "black-500/50"
                        : "#00000000",
                    color: om && om.color && om.hover ? om.color : "inherit",
                  }}
                  onPointerEnter={() =>
                    setOverlayMeta({ [it.id]: { hover: true } })
                  }
                  onPointerLeave={() =>
                    setOverlayMeta({ [it.id]: { hover: false } })
                  }
                  onClick={() => !sidebarCollapsed && toggleFoldedTl(it.id)}
                >
                  <span className="absolute w-6 text-center text-xl">
                    {it.id == "title" ? <Type /> : index++}
                  </span>
                  <span
                    className={`
                    ml-9 origin-left duration-200
                    ${
                      sidebarCollapsed
                        ? "opacity-0 scale-x-0"
                        : "opacity-100 scale-x-100"
                    }
                  `}
                  >
                    <span className="absolute ml-37">
                      {foldedTl[it.id] ? <ChevronDown /> : <ChevronUp />}
                    </span>
                    {it.id}
                  </span>
                </div>

                <div
                  className={`bg-[#ababab77] [.dark_&]:bg-[#2a2a2a77]
                    rounded-[8px] origin-top duration-200 overflow-hidden
                    ${
                      !sidebarCollapsed && !foldedTl[it.id]
                        ? "opacity-100 scale-y-100 max-h-60 p-[8px_12px] mb-3"
                        : "opacity-0 scale-y-0 max-h-0 p-0 mb-0"
                    }`}
                >
                  <div className="grid grid-cols-[60px_auto] auto-rows-[minmax(30px,auto)] gap-1">
                    <TextBox text={"Text"} />
                    <TextBox text={it.text} />
                    {it.notes != null && (
                      <>
                        <TextBox text={"Notes"} />
                        <TextBox text={it.notes} />
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          }) ?? (
            <div
              className={`
                flex flex-col w-full pt-2 gap-4 duration-200
                text-center whitespace-nowrap
                ${
                  sidebarCollapsed
                    ? "opacity-0 scale-x-0"
                    : "opacity-80 scale-x-100"
                }
              `}
            >
              <span>! unknown session !</span>
              <span>Please select an archive to view</span>
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
