import { useEffect, useState } from "react";
import { filterTags } from "../../../scripts/structs/tag-data";
import { Check } from "lucide-react";
import { useFilterContext } from "./context/FilterContext";

const FilterSelector = ({ collapsed }: { collapsed: boolean }) => {
  const [checkedTags, setCheckedTags] = useState<{ [key: string]: boolean }>(
    {}
  );

  const { setFilterQuery } = useFilterContext();
  useEffect(
    () =>
      setFilterQuery(
        Object.keys(checkedTags).filter((key) => checkedTags[key])
      ),
    [checkedTags]
  );

  useEffect(() => {
    // Initialize all tags as unchecked
    filterTags.forEach(({ main, sub }) => {
      setCheckedTags((prev) => ({ ...prev, [main]: false }));
      sub.forEach((s) => {
        setCheckedTags((prev) => ({ ...prev, [`${main}-${s}`]: false }));
      });
    });
  }, []);

  function toggleTag(tag: string, to?: boolean) {
    setCheckedTags((prev) => ({
      ...prev,
      [tag]: to == undefined ? !prev[tag] : to,
    }));
  }

  return (
    <div
      className={`transition-[height] duration-200 ${
        collapsed ? "h-[0] overflow-hidden" : "h-[160px]"
      }`}
    >
      <div
        className="h-full px-4 pt-3 pb-1 bg-white [.dark_&]:bg-black
        border-b-5 border-black/20 [.dark_&]:border-white/20 border-double
        shadow-md shadow-black/10 [.dark_&]:shadow-white/10
        inset-shadow-sm inset-shadow-black/30 [.dark_&]:inset-shadow-white/30"
      >
        {filterTags && (
          <div
            className="h-full pb-2 px-2 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))]
            justify-center items-top overflow-x-hidden"
          >
            {Object.entries(filterTags).map(([_, { main, sub }]) => (
              <div key={main} className="p-2 flex flex-col min-w-max">
                <button
                  className={`flex px-2 py-1 items-center rounded-md
                  border-1
                  ${
                    checkedTags[main]
                      ? `
                    justify-between
                    bg-blue-500/10 [.dark_&]:bg-blue-300/10
                    text-blue-600 [.dark_&]:text-blue-400
                    hover:bg-blue-500/20 [.dark_&]:hover:bg-blue-300/20
                  `
                      : `
                    justify-start
                    border-black/30 [.dark_&]:border-white/30
                    hover:bg-black/10 [.dark_&]:hover:bg-white/10
                  `
                  }`}
                  onClick={() => {
                    toggleTag(main);
                    sub.forEach((subTag) => {
                      if (checkedTags[`${main}-${subTag}`] == true)
                        toggleTag(`${main}-${subTag}`, false);
                    });
                  }}
                >
                  <span className="font-bold text-sm">{main}</span>
                  {checkedTags[main] && <Check size={16} />}
                </button>
                <div className="flex flex-col px-1">
                  {sub.length > 0 &&
                    sub.map((subTag, idx) => (
                      <button
                        key={`${main}-${subTag}`}
                        className={`flex px-2 py-0.5 items-center
                        border-b-1
                        ${
                          checkedTags[`${main}-${subTag}`]
                            ? `
                          justify-between
                          bg-blue-500/10 [.dark_&]:bg-blue-300/10
                          text-blue-600 [.dark_&]:text-blue-400
                          hover:bg-blue-500/20 [.dark_&]:hover:bg-blue-300/20
                        `
                            : `
                          justify-start
                          border-black/20 [.dark_&]:border-white/30
                          hover:bg-black/10 [.dark_&]:hover:bg-white/10
                        `
                        }`}
                        onClick={() => {
                          toggleTag(`${main}-${subTag}`);
                          if (checkedTags[main] == false) toggleTag(main, true);
                        }}
                      >
                        <span className="text-sm">
                          {`${idx == sub.length - 1 ? "└" : "├"} ${subTag}`}
                        </span>
                        {checkedTags[`${main}-${subTag}`] && (
                          <Check size={16} />
                        )}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSelector;
