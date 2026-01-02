import { useEffect } from "react";
import { useFilterContext } from "./FilterContext";

export function useFilterQuery(query: string[]) {
  const { setFilterQuery } = useFilterContext();

  useEffect(() => {
    setFilterQuery(query);
  }, [query, setFilterQuery]);
}
