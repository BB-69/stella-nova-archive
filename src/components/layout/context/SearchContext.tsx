import { createContext, useContext, useState, type ReactNode } from "react";
import { useDebugValue } from "../../_DebugTools/useDebugValue";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

function createSearchContext() {
  const Context = createContext<SearchContextType | null>(null);

  function Provider({ children }: { children: ReactNode }) {
    const [searchQuery, setSearchQuery] = useState("");

    {
      useDebugValue("searchQuery", searchQuery, "/browse");
    }

    return (
      <Context.Provider value={{ searchQuery, setSearchQuery }}>
        {children}
      </Context.Provider>
    );
  }

  const useSearch = () => {
    const ctx = useContext(Context);
    if (!ctx) throw new Error("SearchContext missing provider!");
    return ctx;
  };

  return { Provider, useSearch };
}

export const BrowseSearch = createSearchContext();
export const ArchiveImageSearch = createSearchContext();
