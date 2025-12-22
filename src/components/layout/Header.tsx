// import StellaSoraLogo from "/assets/stellasora-logo-white.webp";
import StudyNovian from "/assets/study-novian.png";
import { ThemeSwitcher } from "../common/theme";
import SearchBar from "../common/search-bar";
import { ArrowLeftToLine, Layers2, SlidersHorizontal } from "lucide-react";
import SortSelector from "./page-browse/SortSelector";
import ButtonToggle from "../common/button-toggle";
import { useNavigate } from "react-router-dom";
import { useOverlayContext } from "./page-archive/OverlayContext";

const Header = ({
  onToggleFilterbar,
  collapsed,
  isBrowsing,
}: {
  onToggleFilterbar?: () => void;
  collapsed?: boolean;
  isBrowsing: boolean;
}) => {
  const navigate = useNavigate();

  const { overlayActive, toggleOverlayActive } = !isBrowsing
    ? useOverlayContext()
    : {};

  return (
    <header
      className="flex flex-col h-[64px]
      border-b border-black/30 [.dark_&]:border-white/30
      shadow-md shadow-black/20 [.dark_&]:shadow-white/20
      bg-white [.dark_&]:bg-black
      gap-[6px] p-[10px_18px] sticky z-20"
    >
      <div
        className="flex items-center justify-between
        max-[300px]:justify-end gap-4 h-full"
      >
        {/* <div className="max-[720px]:hidden">
          <img
            src={StellaSoraLogo}
            alt="Stella Sora Logo"
            className="h-8 w-auto brightness-0 [.dark_&]:brightness-100"
          />
        </div> */}
        {/* Still thinking if i shouldn't put the game logo on fan site */}

        <div className="max-[300px]:hidden">
          <img src={StudyNovian} alt="Study Novian" className="h-8 w-auto" />
        </div>

        <span
          className="overflow-hidden novamodern pt-2
          font-semibold text-xl whitespace-nowrap max-[700px]:hidden"
        >
          Stella Nova Archive
        </span>

        <div className="flex flex-row flex-1 min-w-0 max-w-[320px] gap-1">
          {isBrowsing == true ? (
            <>
              <SortSelector />

              <ButtonToggle
                toggle={collapsed}
                onToggle={onToggleFilterbar ?? (() => {})}
              >
                <SlidersHorizontal />
              </ButtonToggle>
            </>
          ) : (
            <>
              <ButtonToggle onToggle={() => navigate("/browse")}>
                <ArrowLeftToLine />
              </ButtonToggle>

              <ButtonToggle
                toggle={!overlayActive}
                onToggle={toggleOverlayActive ?? (() => {})}
              >
                <Layers2 />
              </ButtonToggle>
            </>
          )}

          <SearchBar isBrowsing={isBrowsing} />

          <div className="flex gap-2">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
