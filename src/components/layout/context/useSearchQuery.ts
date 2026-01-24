import { BrowseSearch } from "./SearchContext";

export function useSearchQuery() {
  const { searchQuery, setSearchQuery } = BrowseSearch.useSearch();

  return { query: searchQuery, setQuery: setSearchQuery };
}
