import _Test from "./pages/_Test";
import HomePage from "./pages/HomePage";
import BrowsePage from "./pages/BrowsePage";

export interface AppRoute {
  path: string;
  element: React.ComponentType | null;
  devOnly?: boolean;
}

export const appRoutes: AppRoute[] = [
  { path: "———DEV———", element: null, devOnly: true }, // keep null element for dropdown convenience lol
  { path: "/testcss", element: _Test, devOnly: true },
  { path: "/home", element: HomePage, devOnly: true },
  { path: "———MAIN———", element: null },
  { path: "/browse", element: BrowsePage }
];