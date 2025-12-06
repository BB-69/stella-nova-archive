import { createContext, type ReactNode, useState, useContext } from "react";
import { useDebugValue } from "../../../hooks/useDebugValue";

export type SortType = {
  type: "name" | "date";
  ascending: boolean;
};

interface SortContextType {
  sortQuery: SortType | null;
  setSortQuery: (query: SortType | null) => void;
}

export const SortContext = createContext<SortContextType | null>(null);

export function SortProvider({ children }: { children: ReactNode }) {
  const [sortQuery, setSortQuery] = useState<SortType | null>(null);

  {
    useDebugValue("sortQuery", sortQuery, "/browse");
  }

  return (
    <SortContext.Provider value={{ sortQuery, setSortQuery }}>
      {children}
    </SortContext.Provider>
  );
}

export const useSortContext = () => {
  const ctx = useContext(SortContext);
  if (!ctx) throw new Error("SortContext missing provider!");
  return ctx;
};
