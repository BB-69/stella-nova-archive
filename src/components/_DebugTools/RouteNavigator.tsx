import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface RouteOption {
  path: string;
  disabled?: boolean;
}

interface Props {
  routes: RouteOption[];
  onSelect?: (route: string) => void;
}

export default function RouteNavigator({ routes, onSelect }: Props) {
  const [selected, setSelected] = useState("/");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname != selected) setSelected(location.pathname);
  }, [location.pathname]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
    onSelect?.(e.target.value);
  };

  return (
    <div className="content-box">
      <select value={selected} onChange={handleChange}>
        {routes.map(({ path, disabled }) => (
          <option key={path} value={path} disabled={disabled}>
            {path}
          </option>
        ))}
      </select>
    </div>
  );
}
