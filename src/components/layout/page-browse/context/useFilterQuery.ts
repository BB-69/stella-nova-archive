import { useFilterContext } from "./FilterContext";

export function useFilterQuery() {
  const { filterQuery, setFilterQuery } = useFilterContext();

  return { query: filterQuery, setQuery: setFilterQuery };
}
