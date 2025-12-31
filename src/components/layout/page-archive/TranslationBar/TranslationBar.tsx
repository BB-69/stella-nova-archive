import { Fragment, useState, type Dispatch, type SetStateAction } from "react";
import {
  type ItemData,
  type ItemDataFraction,
} from "../../../../scripts/structs/item-data";
import TlHeader from "./TlHeader";
import TlContent from "./TlContent";
import useTlOptions from "./useTlOptions";
import { useIsMd } from "../../../../hooks/useIsMd";
import OverlayModal from "../../../common/overlay-modal";

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
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const applyItem = (newI: ItemDataFraction) => {
    setItem((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        ...newI,
      };
    });
  };

  const isMd = useIsMd();

  const tlOptions = useTlOptions({
    // passing props, no separation i know :)
    item,
    applyItem,
    setImgSrc,
  }).filter(({ appearOn }) =>
    appearOn.edit != undefined ? appearOn.edit === editing : true
  );

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
        <TlHeader
          onToggleTlBar={onToggleTlBar}
          tlBarCollapsed={tlBarCollapsed}
          editing={editing}
          options={tlOptions.filter(({ appearOn }) =>
            appearOn.md !== undefined ? appearOn.md === !isMd : true
          )}
          activeModal={activeModal}
          setActiveModal={setActiveModal}
        />

        <TlContent
          tlBarCollapsed={tlBarCollapsed}
          item={item}
          setItem={setItem}
          applyItem={applyItem}
          editing={editing}
          options={tlOptions.filter(({ appearOn }) =>
            appearOn.md !== undefined ? appearOn.md === isMd : false
          )}
          activeModal={activeModal}
          setActiveModal={setActiveModal}
        />
      </aside>

      <div className="absolute z-15">
        {tlOptions
          .filter((o) => o.content)
          .map((o) => (
            <Fragment key={o.id}>
              <OverlayModal
                onClose={() => setActiveModal(null)}
                active={o.id === activeModal}
                title={o.label}
              >
                {o.content}
              </OverlayModal>
            </Fragment>
          ))}
      </div>
    </>
  );
};

export default TranslationBar;
