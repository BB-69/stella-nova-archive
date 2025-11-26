import StellaSoraLogo from "@/assets/stellasora-logo-white.webp";
import { ThemeSwitcher } from "../../common/theme";


const Header = () => {
  return (
    <header className="flex flex-col h-[64px]
      border-b border-black/30 [.dark_&]:border-white/30
      shadow-md shadow-black/20 [.dark_&]:shadow-white/20
      bg-white [.dark_&]:bg-black overflow-hidden
      gap-[6px] p-[10px_18px] sticky z-20"
    >
      <div className="flex items-center justify-between gap-4 h-full">
        <div className="max-[720px]:hidden">
          <img
            src={StellaSoraLogo}
            alt="Stella Sora Logo"
            className="h-8 w-auto"
          />
        </div>

        <span className="overflow-hidden novamodern pt-2
        font-semibold text-xl whitespace-nowrap">
          Stella Nova Archive
        </span>

        <div className="flex flex-row flex-1 min-w-0 max-w-[280px] gap-3">
          <input
            className="flex-1 min-w-[120px] px-3 py-2 rounded-xl
            border border-black/20 [.dark_&]:border-white/20"
            placeholder="Search..."
          />

          <div className="flex gap-2">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
