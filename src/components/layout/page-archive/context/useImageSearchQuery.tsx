import { ArchiveImageSearch } from "../../context/SearchContext";

export function useImageSearchQuery() {
  const { searchQuery, setSearchQuery } = ArchiveImageSearch.useSearch();

  return { query: searchQuery, setQuery: setSearchQuery };
}
