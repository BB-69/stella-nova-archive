import { createContext, type ReactNode, useState, useContext } from "react";

export type OverlayMetaType = {
  [key: string]: { color?: string; hover: boolean };
};

interface OverlayContextType {
  overlayMetas: OverlayMetaType;
  setOverlayMeta: (meta: OverlayMetaType) => void;
}

export const OverlayContext = createContext<OverlayContextType | null>(null);

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [overlayMetas, setOverlayMetas] = useState<{
    [key: string]: { color: string; hover: boolean };
  }>({});

  const setOverlayMeta = (meta: OverlayMetaType) => {
    Object.entries(meta).forEach(([key, value]) => {
      setOverlayMetas((prev) => ({
        ...prev,
        [key]: {
          color: value.color ?? prev[key].color ?? "#676767",
          hover: value.hover,
        },
      }));
    });
  };

  return (
    <OverlayContext.Provider value={{ overlayMetas, setOverlayMeta }}>
      {children}
    </OverlayContext.Provider>
  );
}

export const useOverlayContext = () => {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("OverlayContext missing provider!");
  return ctx;
};
