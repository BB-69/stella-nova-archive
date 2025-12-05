import { createContext, type ReactNode, useState, useContext } from "react";
import { useDebugValue } from "../../../hooks/useDebugValue";

interface FilterContextType {
  filterQuery: string[];
  setFilterQuery: (query: string[]) => void;
}

export const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filterQuery, setFilterQuery] = useState<string[]>([]);

  {
    let filterString = "";
    filterQuery.forEach((f) => (filterString += `${f}, `));
    useDebugValue("filterQuery", filterString, "/browse");
  }

  return (
    <FilterContext.Provider value={{ filterQuery, setFilterQuery }}>
      {children}
    </FilterContext.Provider>
  );
}

export const useFilterContext = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("FilterContext missing provider!");
  return ctx;
};
