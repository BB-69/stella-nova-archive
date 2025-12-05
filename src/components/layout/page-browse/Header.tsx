// import StellaSoraLogo from "/assets/stellasora-logo-white.webp";
import { ThemeSwitcher } from "../../common/theme";
import SearchBar from "../../common/search-bar";
import { SlidersHorizontal } from "lucide-react";

const Header = ({
  onToggleFilterbar,
  collapsed,
}: {
  onToggleFilterbar: () => void;
  collapsed: boolean;
}) => {
  return (
    <header
      className="flex flex-col h-[64px]
      border-b border-black/30 [.dark_&]:border-white/30
      shadow-md shadow-black/20 [.dark_&]:shadow-white/20
      bg-white [.dark_&]:bg-black overflow-hidden
      gap-[6px] p-[10px_18px] sticky z-20"
    >
      <div
        className="flex items-center justify-between
        max-[540px]:justify-end gap-4 h-full"
      >
        {/* <div className="max-[720px]:hidden">
          <img
            src={StellaSoraLogo}
            alt="Stella Sora Logo"
            className="h-8 w-auto brightness-0 [.dark_&]:brightness-100"
          />
        </div> */}
        {/* Still thinking if i shouldn't put the game logo on fan site */}

        <span
          className="overflow-hidden novamodern pt-2
          font-semibold text-xl whitespace-nowrap max-[540px]:hidden"
        >
          Stella Nova Archive
        </span>

        <div className="flex flex-row flex-1 min-w-0 max-w-[280px] gap-3">
          <button
            className={`flex justify-center items-center
            relative w-[40px] h-[40px] rounded-md pt-0.5
            ${
              collapsed
                ? `
              hover:bg-black/10 [.dark_&]:hover:bg-white/10
            `
                : `
              border-1
              bg-blue-500/10 [.dark_&]:bg-blue-300/10
              hover:bg-blue-500/20 [.dark_&]:hover:bg-blue-300/20
              text-blue-600 [.dark_&]:text-blue-400
            `
            }
            cursor-pointer font-bold`}
            onClick={onToggleFilterbar}
            style={{
              cursor: "pointer",
            }}
          >
            <SlidersHorizontal />
          </button>

          <SearchBar />

          <div className="flex gap-2">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
