import {
  ArrowDown01,
  ArrowDownAZ,
  ArrowUp01,
  ArrowUpAZ,
  LayoutList,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import ButtonToggle from "../../common/button-toggle";
import { useSortContext, type SortType } from "./SortContext";

const SortSelector = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { sortQuery, setSortQuery } = useSortContext();

  function onToggle() {
    setCollapsed(!collapsed);
  }

  const [nameAscending, setNameAscending] = useState<boolean | null>(null);
  const [dateAscending, setDateAscending] = useState<boolean | null>(null);
  const onNameToggle = () => {
    setNameAscending(nameAscending != null ? !nameAscending : true);
    setDateAscending(null);
  };
  const onDateToggle = () => {
    setDateAscending(dateAscending != null ? !dateAscending : true);
    setNameAscending(null);
  };
  const onCancelSort = () => {
    setNameAscending(null);
    setDateAscending(null);
  };

  useEffect(() => {
    const sort: SortType | null =
      nameAscending != null && dateAscending != null
        ? nameAscending != null
          ? { type: "name", ascending: nameAscending }
          : { type: "date", ascending: dateAscending }
        : null;
    setSortQuery(sort);
  }, [nameAscending, dateAscending]);

  return (
    <div className="relative">
      <ButtonToggle toggle={collapsed} onToggle={onToggle}>
        <LayoutList />
      </ButtonToggle>
      <div
        className={`absolute flex flex-col
        justify-center items-center p-4 gap-2
				top-[125%] left-[50%] translate-x-[-50%]
				border-1 border-black/30 [.dark_&]:border-white/30
				shadow-md shadow-black/30 [.dark_&]:shadow-white/30
				rounded-[20px] bg-white [.dark_&]:bg-black
				overflow-hidden transition-transform duration-200
				${collapsed ? "scale-y-0 translate-y-[-50%]" : "scale-y-100 translate-y-0"}`}
      >
        <div className="text-xs opacity-80 w-full flex items-center gap-1">
          <span className="pb-0.5">Sort by</span>
          <div
            className="grow text-center pb-0.5 overflow-hidden whitespace-nowrap
            rounded-full border-1 border-black/50 [.dark_&]:border-white/50"
          >
            {nameAscending != null
              ? "name"
              : dateAscending != null
              ? "date"
              : "none"}
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <ButtonToggle
            toggle={nameAscending == null}
            onToggle={onNameToggle}
            alwaysBorder={true}
          >
            {nameAscending == null || nameAscending ? (
              <ArrowUpAZ />
            ) : (
              <ArrowDownAZ />
            )}
          </ButtonToggle>
          <ButtonToggle
            toggle={dateAscending == null}
            onToggle={onDateToggle}
            alwaysBorder={true}
          >
            {dateAscending == null || dateAscending ? (
              <ArrowUp01 />
            ) : (
              <ArrowDown01 />
            )}
          </ButtonToggle>
        </div>
        <ButtonToggle
          onToggle={onCancelSort}
          pxSize={{ w: 88, h: 36 }}
          alwaysBorder={true}
        >
          <X />
        </ButtonToggle>
      </div>
    </div>
  );
};

export default SortSelector;
