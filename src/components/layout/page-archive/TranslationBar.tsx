import {
  ChevronDown,
  ChevronUp,
  FileCog,
  Menu,
  Minus,
  Plus,
  Type,
  Upload,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  defaultItemOverlay,
  type ItemData,
  type ItemDataFraction,
} from "../../../scripts/structs/item-data";
import TextBox from "../../common/text-box";
import { useOverlayContext } from "./OverlayContext";
import OverlayProperty from "./OverlayProperty";
import { useIsMd } from "../../../hooks/useIsMd";
import ButtonToggle from "../../common/button-toggle";
import OverlayModal from "../../common/overlay-modal";
import ImageMetadata from "./ImageData";

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

let scrollBounds = { x: 0, y: 0, w: 0, h: 0 };
export const getScrollBounds = () => {
  return scrollBounds;
};

const TranslationBar = ({
  onToggleTlBar,
  tlBarCollapsed,
  item,
  setItem,
  setImgSrc,
  editing,
}: {
  onToggleTlBar: () => void;
  tlBarCollapsed: boolean;
  item: ItemData | null;
  setItem: Dispatch<SetStateAction<ItemData | null>>;
  setImgSrc: Dispatch<SetStateAction<string>>;
  editing: boolean;
}) => {
  const [foldedTl, setFoldedTl] = useState<{ [key: string]: boolean }>({});
  const [foldedImgData, setFoldedImgData] = useState(true);
  const { overlayMetas, setOverlayMeta, setOverlayTransform, removeOverlay } =
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

  const applyItem = (newI: ItemDataFraction) => {
    setItem((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        ...newI,
      };
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];
    if (!file) return;

    const imgUrl: string = URL.createObjectURL(file);
    setImgSrc(imgUrl);
  };

  return (
    <>
      <aside
        aria-expanded={!tlBarCollapsed}
        className={`group-selectable overflow-hidden flex flex-col p-3.5 w-full h-full
        border-r border-black/20 [.dark_&]:border-white/20
        shadow-md shadow-black/20 [.dark_&]:shadow-white/20
        bg-gradient-to-b from-[#f3fdff] to-white
        [.dark_&]:from-[#0b1220] [.dark_&]:to-black
        md:transition-[width] md:duration-200 z-10
        ${tlBarCollapsed ? "md:w-[72px]" : "md:w-[260px]"}`}
      >
        <div
          className="group-unselectable flex items-center min-h-16 pb-3 min-w-full
          border-b border-black/30 [.dark_&]:border-white/30"
        >
          <button
            onClick={onToggleTlBar}
            aria-label={
              tlBarCollapsed
                ? "Expand translation bar"
                : "Collapse translation bar"
            }
            className="flex flex-row justify-top items-center
            h-full w-full p-[6px_10px]
            rounded-md hover:bg-black/5 [.dark_&]:hover:bg-white/5"
          >
            <div className="absolute">
              <Menu />
            </div>
            <span
              className={`
                  font-bold ml-9 origin-left md:duration-200
                ${
                  tlBarCollapsed
                    ? "md:opacity-0 md:scale-x-0"
                    : "md:opacity-100 md:scale-x-100"
                }
              `}
            >
              Translation
            </span>
          </button>

          {useIsMd() && (
            <>
              <div
                className="min-w-[50px] h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <ButtonToggle onToggle={() => {}} fullSize={true}>
                  <Upload />
                  <input
                    className="absolute inset-0 opacity-0"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </ButtonToggle>
              </div>
              <div
                className="min-w-[50px] h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <ButtonToggle
                  toggle={foldedImgData}
                  onToggle={() => setFoldedImgData(!foldedImgData)}
                  fullSize={true}
                >
                  <FileCog />
                </ButtonToggle>
              </div>
            </>
          )}
        </div>

        <div
          className={`flex flex-col justify-between
          origin-top md:h-full pb-14 md:pb-0
          md:scale-y-100 md:opacity-100 md:max-h-full
          transition-[height] md:transition-none duration-200 md:duration-0
          ${tlBarCollapsed ? "scale-y-0 h-0" : "scale-y-100 h-full"}`}
        >
          <nav
            ref={overlayContainerRef}
            className="md:flex md:flex-col grid md:grid-cols-none
            grid-cols-[repeat(auto-fit,minmax(240px,1fr))] max-[240px]:grid-cols-none
            gap-2 mt-3 md:mb-14 px-2 md:px-0 pb-12
            overflow-x-hidden overflow-y-auto"
            aria-label="Translation bar"
          >
            {/* ---=== EDIT ===--- */}

            {editing && !useIsMd() && (
              <div
                className={`duration-200 origin-top md:origin-top-right
                ${
                  tlBarCollapsed
                    ? "scale-y-0 md:scale-0 opacity-0 max-h-0"
                    : "scale-y-100 md:scale-100 opacity-100 max-h-full"
                }
              `}
              >
                <div
                  className="group-unselectable p-[4px] my-1 w-full max-h-full
                  flex justify-center items-start"
                >
                  <div
                    className="group relative flex justify-center items-center
                    max-w-full max-h-full rounded-xl border-1
                    border-black/50 [.dark_&]:border-white/50
                    hover:border-white [.dark_&]:hover:border-black
                    hover:bg-[var(--bg-a1)] [.dark_&]:hover:bg-white
                    hover:text-white [.dark_&]:hover:text-[var(--bg-a1-dark)]
                    pl-2 pr-3 text-sm font-bold whitespace-nowrap
                    transition duration-100"
                  >
                    <input
                      className="absolute inset-0 opacity-0"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <span
                      className="flex flex-row items-center py-2
                      h-full gap-2 opacity-70 group-hover:opacity-100"
                    >
                      <Upload />
                      <span className="pb-[1.7px]">upload image</span>
                    </span>
                  </div>
                </div>

                <ImageMetadata
                  item={item}
                  applyItem={applyItem}
                  canCollapse={true}
                />
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
                          (!tlBarCollapsed && !foldedTl[it.id]) ||
                          (om && om.hover)
                            ? om && om.color
                              ? om.color
                              : "black-500/50"
                            : "#00000000",
                        color:
                          om && om.color && om.hover ? om.color : "inherit",
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
                          e.stopPropagation();
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
                        editing={editing}
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
                      tlBarCollapsed
                        ? "scale-0 opacity-0"
                        : "scale-100 opacity-100"
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
                          defaultItemOverlay(getNewId("newOverlay")),
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
      </aside>

      {/* ---=== EDIT CONFIG ===--- */}

      {editing && (
        <div className="z-15">
          <OverlayModal
            onClose={() => {
              setFoldedImgData(true);
            }}
            active={!foldedImgData}
            title="Config"
          >
            <ImageMetadata
              item={item}
              applyItem={applyItem}
              canCollapse={false}
            />
          </OverlayModal>
        </div>
      )}
    </>
  );
};

export default TranslationBar;
