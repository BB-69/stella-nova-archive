import { useNavigate } from "react-router-dom";
import ButtonToggle from "../common/button-toggle";
import Collapsible from "../common/collapsible";
import { ThemeSwitcher } from "../common/theme";
import DebugBox from "./DebugBox";
import RouteNavigator from "./RouteNavigator";
import VariableInspector, { useDebugVars } from "./VariableContext";
import type { JSX } from "react";

const DebugBoxContainer = ({
  routes,
}: {
  routes: Map<string, JSX.Element | null>;
}) => {
  const navigate = useNavigate();
  const { setCurrentRoute } = useDebugVars();

  const title = "DEBUG";

  return (
    <DebugBox title={title}>
      <div className="mb-2">
        <ThemeSwitcher systemTheme={true} />
      </div>
      <div className="h-[30px] mb-2">
        <ButtonToggle
          onToggle={() => localStorage.clear()}
          alwaysBorder={true}
          fullSize={true}
        >
          <span className="pb-0.5">Clear Storage</span>
        </ButtonToggle>
      </div>
      <Collapsible
        title="Route Navigator"
        subtitle={title}
        saveCollapsed={true}
      >
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
      <Collapsible title="Variables" subtitle={title} saveCollapsed={true}>
        <VariableInspector />
      </Collapsible>
    </DebugBox>
  );
};

export default DebugBoxContainer;
