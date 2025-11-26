import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { createElement, useMemo, type JSX } from "react";
import DebugBox from "./components/_DebugTools/DebugBox";
import RouteNavigator from "./components/_DebugTools/RouteNavigator";
import VariableInspector, {
  useDebugVars,
} from "./components/_DebugTools/VariableContext";
import Collapsible from "./components/common/collapsible";
import { ThemeSwitcher } from "./components/common/theme";

import { appRoutes } from ".";

function App() {
  const navigate = useNavigate();
  const { setCurrentRoute } = useDebugVars();

  const routes = useMemo(() => {
    const m = new Map<string, JSX.Element | null>();

    appRoutes
      .filter(({ devOnly }) => (import.meta.env.DEV && devOnly) || !devOnly)
      .forEach(({ path, element }) => {
        const jsx = element ? createElement(element) : null;
        m.set(path, jsx);
      });

    return m;
  }, []);
  const routeList = useMemo(
    () =>
      Array.from(routes)
        .filter(([, element]) => element)
        .map(([path, element]) => ({ path, element })),
    [routes]
  );

  const defaultRoute = "/browse";
  const title = "DEBUG";

  return (
    <div className="app">
      {import.meta.env.DEV && (
        <DebugBox title={title}>
          <div className="mb-2">
            <ThemeSwitcher />
          </div>
          <Collapsible title="Route Navigator" subtitle={title}>
            <RouteNavigator
              routes={Array.from(routes, ([path, element]) => ({
                path,
                disabled: element === null,
              }))}
              onSelect={(route) => {
                navigate(route);
                setCurrentRoute(route);
              }}
            />
          </Collapsible>
          <Collapsible title="Variables" subtitle={title}>
            <VariableInspector />
          </Collapsible>
        </DebugBox>
      )}
      <Routes>
        <Route path="/" element={<Navigate to={defaultRoute} replace />} />
        {routeList.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </div>
  );
}

export default App;
