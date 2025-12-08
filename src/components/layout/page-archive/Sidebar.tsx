import { ChevronDown, ChevronUp, Menu, Type } from "lucide-react";
import { useEffect, useState } from "react";
import type { ItemOverlay } from "../../../scripts/structs/item-data";

/* ---LOCAL_TEST--- */
const overlayItems: ItemOverlay[] = [
  {
    id: "title",
    frame: null,
    bounds: { x: 600, y: 60, w: 720, h: 240 },
    bounds_end: null,
    rotation: 0,
    shear: 0,
    text: "SAMPLE",
    notes: null,
  },
  {
    id: "title-sub",
    frame: null,
    bounds: { x: 180, y: 540, w: 1560, h: 420 },
    bounds_end: null,
    rotation: 0,
    shear: 0,
    text: "The trees are whispering...",
    notes: "Low confidence",
  },
];

const Sidebar = ({
  onToggleSidebar,
  sidebarCollapsed,
}: {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}) => {
  const [foldedTl, setFoldedTl] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Initialize all tags as unchecked
    overlayItems.forEach((i) => {
      setFoldedTl((prev) => ({ ...prev, [i.id]: true }));
      // sub.forEach((s) => {
      //   setCollapsedTl((prev) => ({ ...prev, [`${i.id}-${s}`]: false }));
      // });
    });
  }, []);

  function toggleFoldedTl(key: string) {
    setFoldedTl((prev) => ({ ...prev, [key]: !foldedTl[key] }));
  }

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
          {overlayItems.map((it) => {
            let index = 1;
            return (
              <div className="flex flex-col w-full h-full">
                <button
                  key={it.id}
                  className={`flex items-center p-[10px_8.5px] rounded-md
                  font-semibold text-[var(--t-c)] [.dark_&]:text-[var(--t-c-dark)]
                  hover:bg-blue-500/10 [.dark_&]:hover:bg-blue-300/10
                  hover:text-blue-600 [.dark_&]:hover:text-blue-400
                  border-1 whitespace-nowrap
                ${
                  !sidebarCollapsed && !foldedTl[it.id]
                    ? `border-black-500/50 hover:border-blue-500`
                    : "border-black/0"
                }
                `}
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
                </button>

                <div
                  className={`bg-[#ebebeb77] [.dark_&]:bg-[#2a2a2a77]
                    rounded-[8px] origin-top duration-200
                    ${
                      !sidebarCollapsed && !foldedTl[it.id]
                        ? "opacity-100 scale-y-100 h-auto p-[8px]"
                        : "opacity-0 scale-y-0 h-0 p-0"
                    }`}
                >
                  Text
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
