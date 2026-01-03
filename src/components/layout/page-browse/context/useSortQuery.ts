import { useSortContext } from "./SortContext";

export function useSortQuery() {
  const { sortQuery, setSortQuery } = useSortContext();

  return { query: sortQuery, setQuery: setSortQuery };
}
