import { Type, Minus, ChevronDown, ChevronUp, Plus } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  defaultItemOverlay,
  type ItemDataFraction,
} from "../../../../scripts/structs/item-data";
import ButtonToggle from "../../../common/button-toggle";
import TextBox from "../../../common/text-box";
import OverlayProperty from "./OverlayProperty";
import type { TlOptionProps } from "./useTlOptions";
import { useOverlay } from "../Overlay/context/useOverlay";
import { useArchive } from "../context/useArchive";

let scrollBounds = { x: 0, y: 0, w: 0, h: 0 };
export const getScrollBounds = () => {
  return scrollBounds;
};

const TlContent = ({
  applyItem,
  options,
  activeModal,
  setActiveModal,
}: {
  applyItem: (newI: ItemDataFraction) => void;
  options: TlOptionProps[];
  activeModal: string | null;
  setActiveModal: Dispatch<SetStateAction<string | null>>;
}) => {
  const { overlayMetas, setOverlayMeta, setOverlayTransform, removeOverlay } =
    useOverlay();
  const { tlBarCollapsed, item, setItem, editing } = useArchive();

  const [foldedTl, setFoldedTl] = useState<{ [key: string]: boolean }>({});

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

  const overlayInfoRefs = useRef<
    Record<
      string,
      { head: HTMLDivElement | null; child: HTMLDivElement | null }
    >
  >({});
  const overlayContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (overlayContainerRef.current == null) return;
    const rect = overlayContainerRef.current.getBoundingClientRect();

    scrollBounds = { x: rect.x, y: rect.y, w: rect.width, h: rect.height };
  }, [overlayContainerRef.current?.getBoundingClientRect()]);

  useEffect(() => {
    const overlayHeader = overlayInfoRefs.current;
    if (!overlayHeader) return;

    let rafId: number | null = null;

    const updateOverlayTransform = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;

        Object.entries(item?.overlays ?? []).forEach(([_, { id }]) => {
          if (!overlayHeader[id] || !overlayHeader[id].head) return;

          const rect = overlayHeader[id].head.getBoundingClientRect();

          setOverlayTransform(false, id, {
            p: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
            t: rect.top,
            b: rect.bottom,
            l: rect.left,
            r: rect.right,
          });
        });
      });
    };

    const observer = new ResizeObserver(() => {
      updateOverlayTransform();
    });

    Object.values(overlayHeader).forEach(({ head, child }) => {
      if (head) observer.observe(head);
      if (child) observer.observe(child);
    });

    updateOverlayTransform();

    window.addEventListener("resize", updateOverlayTransform);
    overlayContainerRef.current?.addEventListener(
      "scroll",
      updateOverlayTransform
    );
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateOverlayTransform);
      overlayContainerRef.current?.removeEventListener(
        "scroll",
        updateOverlayTransform
      );
    };
  }, [item]);

  return (
    <div
      className={`flex flex-col justify-between
      origin-top md:h-full pb-14 md:pb-0
      md:scale-y-100 md:opacity-100 md:max-h-full
      transition-[height] md:transition-none duration-200 md:duration-0
      ${tlBarCollapsed ? "scale-y-0 h-0" : "scale-y-100 h-full"}`}
    >
      {/*
      Bottom pad/margin from both divs here caused the elements to slip.
      But if i take it off, it would overflow layout.
      (need to fix overflow but idk how so pb for now)
      */}
      <nav
        ref={overlayContainerRef}
        className="md:flex md:flex-col grid md:grid-cols-none
        grid-cols-[repeat(auto-fit,minmax(240px,1fr))] max-[240px]:grid-cols-none
        gap-2 mt-3 md:mb-14 px-2 md:px-0 pb-12
        overflow-x-hidden overflow-y-auto"
        aria-label="Translation bar"
      >
        {options.length > 0 && (
          <div
            className={`duration-200 origin-top md:origin-top-right
            ${
              tlBarCollapsed
                ? "scale-y-0 md:scale-0 opacity-0 max-h-0"
                : "scale-y-100 md:scale-100 opacity-100 max-h-full"
            }
          `}
          >
            {options.map((o) =>
              o.alwaysShowContentOnFull ? (
                o.content
              ) : (
                <div
                  key={o.id}
                  className="group-unselectable p-[4px] my-1 w-full max-h-full
                  flex justify-center items-start"
                >
                  <div
                    className="group relative flex justify-center items-center
                    max-w-full max-h-full text-sm font-bold"
                  >
                    <ButtonToggle
                      toggle={o.id !== activeModal}
                      onToggle={() =>
                        o.content ? setActiveModal(o.id) : o.method?.()
                      }
                      fullSize={true}
                      alwaysBorder={true}
                    >
                      <span
                        className="flex flex-row items-center py-2 pl-2 pr-3
                        h-full gap-2 opacity-70 group-hover:opacity-100"
                      >
                        {o.icon}
                        <span className="pb-[1.7px]">{o.label}</span>
                      </span>
                    </ButtonToggle>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* ---=== VIEW ===--- */}

        {(() => {
          let index = 1;
          return item?.overlays.map((it) => {
            const om = overlayMetas[it.id];
            return (
              <div key={it.id} className="flex flex-col w-full h-full">
                <div
                  ref={(el) => {
                    if (!overlayInfoRefs.current[it.id])
                      overlayInfoRefs.current[it.id] = {
                        head: null,
                        child: null,
                      };
                    overlayInfoRefs.current[it.id].head = el;
                  }}
                  className={`group group-unselectable relative flex items-center p-[10px_8.8px] rounded-md
                  font-semibold text-[var(--t-c)] [.dark_&]:text-[var(--t-c-dark)]
                  border-1 whitespace-nowrap overflow-hidden`}
                  style={{
                    backgroundColor:
                      om && om.color && om.hover
                        ? `${om.color}19`
                        : "#00000000",
                    borderColor:
                      (!tlBarCollapsed && !foldedTl[it.id]) || (om && om.hover)
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
                  onClick={() => !tlBarCollapsed && toggleFoldedTl(it.id)}
                >
                  <span className="absolute w-6 text-center text-xl">
                    {it.id == "title" ? <Type /> : index++}
                  </span>
                  <span
                    className={`
                      ${!editing ? "ml-8" : "ml-6 mr-13"}
                      origin-left duration-200 px-1
                      ${
                        tlBarCollapsed
                          ? "md:opacity-0 md:scale-x-0 md:px-0"
                          : "md:opacity-100 md:scale-x-100 md:px-1"
                      }
                    `}
                    onClick={(e) => {
                      if (editing) e.stopPropagation();
                    }}
                  >
                    {!editing ? (
                      <>{it.id}</>
                    ) : (
                      <TextBox
                        text={it.id}
                        edit={{ placeholder: it.id }}
                        setText={(s) =>
                          applyItem({
                            overlays: item.overlays.map((overlay) => {
                              return {
                                ...overlay,
                                id:
                                  overlay.id === it.id
                                    ? s.toString()
                                    : overlay.id,
                              };
                            }),
                          })
                        }
                      />
                    )}
                  </span>

                  {/* ---=== EDIT ===--- */}

                  {editing && (
                    <span
                      className={`absolute right-9 ${
                        tlBarCollapsed ? "md:scale-0" : "md:scale-100"
                      }
                        md:opacity-0 md:group-hover:opacity-100
                        rounded-md pointer-events-auto border-1
                        border-black [.dark_&]:border-white
                        text-black [.dark_&]:text-white
                        hover:bg-black/20 [.dark_&]:hover:bg-white/20
                      `}
                      onClick={(e) => {
                        e.stopPropagation();

                        setItem((prev) => {
                          if (!prev) return prev;

                          const overlays = prev.overlays
                            .map((o) => {
                              return o.id == it.id ? null : o;
                            })
                            .filter((o) => o != null);

                          return {
                            ...prev,
                            overlays: overlays,
                          };
                        });

                        removeOverlay(it.id);

                        const { [it.id]: _, ...restFolded } = foldedTl;
                        setFoldedTl(restFolded);
                      }}
                    >
                      <Minus />
                    </span>
                  )}
                  <span
                    className={`absolute right-2 duration-200 ${
                      tlBarCollapsed
                        ? "md:scale-0 md:opacity-0"
                        : "md:scale-100 md:opacity-100"
                    }`}
                  >
                    {foldedTl[it.id] ? <ChevronDown /> : <ChevronUp />}
                  </span>
                </div>

                <div
                  ref={(el) => {
                    if (!overlayInfoRefs.current[it.id])
                      overlayInfoRefs.current[it.id] = {
                        head: null,
                        child: null,
                      };
                    overlayInfoRefs.current[it.id].child = el;
                  }}
                  className={`bg-[#ababab77] [.dark_&]:bg-[#2a2a2a77]
                  rounded-[8px] origin-top duration-200 overflow-hidden
                  ${
                    !tlBarCollapsed && !foldedTl[it.id]
                      ? "opacity-100 scale-y-100 max-h-69 p-[8px_12px] mb-3"
                      : "opacity-0 scale-y-0 max-h-0 p-0 mb-0"
                  }`}
                >
                  <OverlayProperty
                    meta={item.meta}
                    itemOverlay={it}
                    setOverlay={(o) => {
                      applyItem({
                        overlays: item.overlays.map((overlay) =>
                          overlay.id === it.id ? o : overlay
                        ),
                      });
                    }}
                  />
                </div>
              </div>
            );
          });
        })() ??
          (!editing && (
            <div
              className={`
                flex flex-col w-full pt-2 gap-4 duration-200
                text-center whitespace-nowrap
                ${
                  tlBarCollapsed
                    ? "md:opacity-0 md:scale-x-0"
                    : "md:opacity-80 md:scale-x-100"
                }
              `}
            >
              <span>! unknown session !</span>
              <span>Please select an archive to view</span>
            </div>
          ))}

        {/* ---=== EDIT ===--- */}

        {editing && (
          <div
            className="group-unselectable p-[4px] mt-1 w-full max-h-full
            flex justify-center items-start"
          >
            <span
              className={`
                group flex justify-center items-center
                max-w-full max-h-full rounded-full border-1
                border-black/50 [.dark_&]:border-white/50
                hover:border-white [.dark_&]:hover:border-black
                hover:bg-[var(--bg-a1)] [.dark_&]:hover:bg-white
                hover:text-white [.dark_&]:hover:text-[var(--bg-a1-dark)]
                pl-2 pr-3 text-sm font-bold whitespace-nowrap
                transition duration-100
                ${
                  tlBarCollapsed ? "scale-0 opacity-0" : "scale-100 opacity-100"
                }
              `}
              onClick={() =>
                setItem((prev) => {
                  if (!prev) return prev;

                  const getNewId = (baseId: string) => {
                    let id = baseId;
                    let n = 0;

                    while (prev.overlays.some((o) => o.id === id)) {
                      n++;
                      id = `${baseId} (${n})`;
                    }

                    return id;
                  };

                  return {
                    ...prev,
                    overlays: [
                      ...prev.overlays,
                      defaultItemOverlay(getNewId("new_overlay")),
                    ],
                  };
                })
              }
            >
              <span
                className="flex flex-row items-center
                h-full gap-2 opacity-70 group-hover:opacity-100"
              >
                <Plus />
                <span className="pb-[1.7px]">new overlay</span>
              </span>
            </span>
          </div>
        )}
      </nav>
    </div>
  );
};

export default TlContent;
