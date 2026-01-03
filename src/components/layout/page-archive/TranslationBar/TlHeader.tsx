import { Menu } from "lucide-react";
import ButtonToggle from "../../../common/button-toggle";
import type { Dispatch, SetStateAction } from "react";
import type { TlOptionProps } from "./useTlOptions";
import { useArchive } from "../context/useArchive";

const TlHeader = ({
  options,
  activeModal,
  setActiveModal,
}: {
  options: TlOptionProps[];
  activeModal: string | null;
  setActiveModal: Dispatch<SetStateAction<string | null>>;
}) => {
  const { tlBarCollapsed, toggleTlBar, editing } = useArchive();

  return (
    <div
      className="group-unselectable flex items-center min-h-16 pb-3 min-w-full
      border-b border-black/30 [.dark_&]:border-white/30"
    >
      <button
        onClick={toggleTlBar}
        aria-label={
          tlBarCollapsed ? "Expand translation bar" : "Collapse translation bar"
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
          {!editing ? "Translation" : "Translator"}
        </span>
      </button>

      {options.map((o) => (
        <div
          key={o.id}
          className="min-w-[50px] h-full"
          onClick={(e) => {
            o.method?.() ?? e.stopPropagation();
          }}
        >
          <ButtonToggle
            toggle={o.content ? o.id !== activeModal : undefined}
            onToggle={() => setActiveModal(o.id)}
            fullSize={true}
          >
            {o.icon}
          </ButtonToggle>
        </div>
      ))}
    </div>
  );
};

export default TlHeader;
