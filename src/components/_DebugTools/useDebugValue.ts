import { useEffect } from "react";
import { useDebugVars } from "./VariableContext";

export function useDebugValue(key: string, value: unknown, route?: string) {
  const { setVar } = useDebugVars();

  useEffect(() => {
    setVar(key, value, route);
  }, [key, value, route, setVar]);
}
