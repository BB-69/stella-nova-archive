import { Navigate, Route, Routes } from "react-router-dom";
import { createElement, useMemo, type JSX } from "react";

import { appRoutes } from ".";
import DebugBoxContainer from "./components/_DebugTools/DebugBoxContainer";

function App() {
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

  return (
    <div className="app">
      {import.meta.env.DEV && <DebugBoxContainer routes={routes} />}
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
