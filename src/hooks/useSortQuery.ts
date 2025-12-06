import { useEffect } from "react";
import {
  useSortContext,
  type SortType,
} from "../components/layout/page-browse/SortContext";

export function useSortQuery(query: SortType | null) {
  const { setSortQuery } = useSortContext();

  useEffect(() => {
    setSortQuery(query);
  }, [query, setSortQuery]);
}
