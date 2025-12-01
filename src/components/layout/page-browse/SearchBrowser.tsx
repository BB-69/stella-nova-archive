import { createContext, useContext, useState, type ReactNode } from "react";
import { useDebugValue } from "../../../hooks/useDebugValue";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchContext = createContext<SearchContextType | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");

  {
    useDebugValue("searchQuery", searchQuery, "/browse");
  }

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearchContext = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("SearchContext missing provider!");
  return ctx;
};
