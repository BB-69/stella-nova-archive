import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
  useEffect,
} from "react";
import { useLocation } from "react-router-dom";

interface DebugEntry {
  key: string;
  value: unknown;
  route?: string;
}

interface DebugContextType {
  vars: DebugEntry[];
  setVar: (key: string, value: unknown, route?: string) => void;
  currentRoute: string;
  setCurrentRoute: (r: string) => void;
}

const DebugContext = createContext<DebugContextType | null>(null);

export function DebugProvider({ children }: { children: ReactNode }) {
  const [vars, setVars] = useState<DebugEntry[]>([]);
  const [currentRoute, setCurrentRoute] = useState("/");
  const location = useLocation();

  useEffect(() => {
    setCurrentRoute(location.pathname);
  }, [location.pathname]);

  const setVar = useCallback((key: string, value: unknown, route?: string) => {
    setVars((prev) => {
      const exists = prev.find((v) => v.key === key);

      if (exists) {
        return prev.map((v) => (v.key === key ? { key, value, route } : v));
      }

      return [...prev, { key, value, route }];
    });
  }, []);

  return (
    <DebugContext.Provider
      value={{ vars, setVar, currentRoute, setCurrentRoute }}
    >
      {children}
    </DebugContext.Provider>
  );
}

export const useDebugVars = () => {
  const ctx = useContext(DebugContext);
  if (!ctx) throw new Error("DebugContext missing provider!");
  return ctx;
};

export default function VariableInspector() {
  const { vars, currentRoute } = useDebugVars();

  const filteredGlobal = vars.filter((v) => !v.route);
  const filteredRoute = vars.filter((v) => v.route === currentRoute);

  return (
    <div className="content-box">
      {filteredGlobal.length !== 0 && (
        <div className="content-text">Global</div>
      )}

      {filteredGlobal.map((v) => (
        <div key={v.key} style={{ wordBreak: "break-all" }}>
          <strong>{v.key}:</strong> {JSON.stringify(v.value)}
        </div>
      ))}

      {filteredRoute.length !== 0 && <div className="content-text">Route</div>}

      {filteredRoute.map((v) => (
        <div key={v.key} style={{ wordBreak: "break-all" }}>
          <strong>{v.key}:</strong> {JSON.stringify(v.value)}
        </div>
      ))}

      {filteredGlobal.length + filteredRoute.length < 1 && (
        <div
          className="content-text"
          style={{ opacity: 0.8, fontStyle: "italic" }}
        >
          No vars...
        </div>
      )}
    </div>
  );
}
