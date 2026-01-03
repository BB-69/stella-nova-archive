import { useSearchContext } from "./SearchContext";
export function useSearchQuery() {
  const { searchQuery, setSearchQuery } = useSearchContext();

  return { query: searchQuery, setQuery: setSearchQuery };
}
