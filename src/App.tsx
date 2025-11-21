import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { type JSX } from "react";
import DebugBox from "./components/_DebugTools/DebugBox";
import RouteNavigator from "./components/_DebugTools/RouteNavigator";
import VariableInspector, {
  useDebugVars,
} from "./components/_DebugTools/VariableContext";
import Collapsible from "./components/common/collapsible";
import { ThemeSwitcher } from "./components/common/theme";

import "./App.css";
import _Test from "./pages/_Test";
import HomePage from "./pages/HomePage";
import BrowsePage from "./pages/BrowsePage";

function App() {
  const navigate = useNavigate();
  const { setCurrentRoute } = useDebugVars();

  const routes = new Map<string, JSX.Element | null>([
    ["———DEV———", null],
    ["/testcss", <_Test />],
    ["———MAIN———", null],
    ["/home", <HomePage />],
    ["/browse", <BrowsePage />],
  ]);
  const defaultRoute = "/home";

  const title = "DEBUG";

  return (
    <div className="app">
      <DebugBox title={title}>
        <div className="mb-2">
          <ThemeSwitcher />
        </div>
        <Collapsible title="Route Navigator" key={title}>
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
        <Collapsible title="Variables" key={title}>
          <VariableInspector />
        </Collapsible>
      </DebugBox>
      <Routes>
        <Route path="/" element={<Navigate to={defaultRoute} replace />} />
        {Array.from(routes)
          .filter(([_, element]) => {
            return element;
          })
          .map(([path, element]) => (
            <Route path={path} element={element} />
          ))}
      </Routes>
    </div>
  );
}

export default App;
