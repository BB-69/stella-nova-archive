import { useEffect } from "react";
import { useFilterContext } from "../components/layout/page-browse/FilterContext";

export function useFilterQuery(query: string[]) {
  const { setFilterQuery } = useFilterContext();

  useEffect(() => {
    setFilterQuery(query);
  }, [query, setFilterQuery]);
}
