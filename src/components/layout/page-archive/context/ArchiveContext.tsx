import { createContext, useContext, useState, type ReactNode } from "react";
import { useDebugValue } from "../../../_DebugTools/useDebugValue";
import type { ItemData } from "../../../../scripts/structs/item-data";

interface ArchiveContextType {
  tlBarCollapsed: boolean;
  setTlBarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  item: ItemData | null;
  setItem: React.Dispatch<React.SetStateAction<ItemData | null>>;
  imgSrc: string;
  setImgSrc: React.Dispatch<React.SetStateAction<string>>;
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ArchiveContext = createContext<ArchiveContextType | null>(null);

export function ArchiveProvider({ children }: { children: ReactNode }) {
  const [tlBarCollapsed, setTlBarCollapsed] = useState(false);
  const [item, setItem] = useState<ItemData | null>(null);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [editing, setEditing] = useState(false);

  {
    useDebugValue("tlBarCollapsed", tlBarCollapsed, "/archive");
    useDebugValue("itemId", item?.id, "/archive");
    useDebugValue("imgSrc", imgSrc, "/archive");
    useDebugValue("editing", editing, "/archive");
  }

  return (
    <ArchiveContext.Provider
      value={{
        tlBarCollapsed,
        setTlBarCollapsed,
        item,
        setItem,
        imgSrc,
        setImgSrc,
        editing,
        setEditing,
      }}
    >
      {children}
    </ArchiveContext.Provider>
  );
}

export const useArchiveContext = () => {
  const ctx = useContext(ArchiveContext);
  if (!ctx) throw new Error("ArchiveContext missing provider!");
  return ctx;
};
