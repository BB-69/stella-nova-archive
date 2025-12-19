import { CircleQuestionMark, FileSpreadsheet, Link, Menu } from "lucide-react";
import GitHubLogo from "/assets/github.svg";
import DiscordLogo from "/assets/discord.svg";
import NovaTable from "/assets/nova-alphabet-table.jpg";
import NovaTableWritten from "/assets/nova-alphabet-written-table.png";
import { useState } from "react";
import OverlayModal from "../../common/overlay-modal";
import HyperLink from "../../common/hyperlink";
import ScrollableImgGroup from "../../common/scrollable-imggroup";

const items = [
  {
    id: "resources",
    label: "Resources",
    icon: <FileSpreadsheet />,
    content: (
      <div className="flex w-[80vw] h-[50vh]">
        <ScrollableImgGroup
          srcs={[
            { src: NovaTable, alt: "Nova Alphabet Table" },
            { src: NovaTableWritten, alt: "Nova Alphabet Table Written" },
          ]}
        />
      </div>
    ),
  },
  {
    id: "links",
    label: "Links",
    icon: <Link />,
    content: (
      <div className="flex flex-col gap-5 max-w-[80vw] max-h-[50vh] overflow-y-auto">
        <div className="flex flex-row gap-4 underline-offset-1">
          <img
            src={GitHubLogo}
            alt="GitHub"
            className="w-12 h-12 [.dark_&]:invert"
          />
          <div className="flex flex-col">
            <div className="font-bold">Stella Nova Archive</div>
            <HyperLink link="https://github.com/BB-69/stella-nova-archive.git" />
          </div>
        </div>
        <div className="flex flex-row gap-4 underline-offset-1">
          <img
            src={GitHubLogo}
            alt="GitHub"
            className="w-12 h-12 [.dark_&]:invert"
          />
          <div className="flex flex-col">
            <div className="font-bold">Stella Nova Archive Database</div>
            <HyperLink link="https://github.com/BB-69/stella-nova-archive-db.git" />
          </div>
        </div>
        <div className="flex flex-row gap-4 underline-offset-1">
          <img src={DiscordLogo} alt="Discord" className="w-12 h-12" />
          <div className="flex flex-col">
            <div className="font-bold">Stella Nova Archive Discord Server</div>
            <HyperLink link="https://discord.gg/WbVEx5r8a8" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "about",
    label: "About",
    icon: <CircleQuestionMark />,
    content: (
      <div className="flex flex-col gap-2 w-[600px] max-w-[80vw] max-h-[50vh] overflow-y-auto">
        <span>
          <span className="font-bold">Stella Nova Archive</span> is a website
          that acts like an archive that contains inscription and translation of{" "}
          <span className="font-bold">'Nova'</span> language from hit game{" "}
          <span className="font-bold">'Stella Sora'</span>.
        </span>
        <div className="border-b-5 border-dotted my-4 opacity-40"></div>
        <span>
          This fan-made, non-commercial project is not affiliated with Yostar
          and is only for informational and educational purposes.
        </span>
        <span>
          Yostar Games owns the original assets to the game, all credits go to
          its rightful owner.
        </span>
      </div>
    ),
  },
];

const Sidebar = ({
  onToggleSidebar,
  collapsed,
}: {
  onToggleSidebar: () => void;
  collapsed: boolean;
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <aside
      aria-expanded={!collapsed}
      className={`overflow-hidden flex flex-col p-3.5
      border-r border-black/20 [.dark_&]:border-white/20
      shadow-md shadow-black/20 [.dark_&]:shadow-white/20
      bg-gradient-to-b from-[#f3fdff] to-white
      [.dark_&]:from-[#0b1220] [.dark_&]:to-black
      transition-[width] duration-200 z-10
      ${collapsed ? "w-[72px]" : "w-[260px]"}`}
    >
      <div
        className="flex items-center h-16 pb-3
        border-b border-black/30 [.dark_&]:border-white/30"
      >
        <button
          onClick={onToggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex flex-row justify-top items-center
          h-full w-full p-[6px_10px]
          rounded-md hover:bg-black/5 [.dark_&]:hover:bg-white/5"
        >
          <div className="absolute">
            <Menu />
          </div>
          <span
            className={`
              font-bold ml-9 origin-left duration-200
              ${collapsed ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"}
            `}
          >
            Library
          </span>
        </button>
      </div>

      <div className="flex flex-col justify-between h-full">
        <nav className="flex flex-col gap-2 mt-3" aria-label="Sidebar">
          {items.map((it) => (
            <button
              key={it.id}
              className="flex items-center p-[10px_10px] rounded-md
              font-semibold text-[var(--t-c)] [.dark_&]:text-[var(--t-c-dark)]
              hover:bg-blue-500/10 [.dark_&]:hover:bg-blue-300/10
              hover:text-blue-600 [.dark_&]:hover:text-blue-400
              whitespace-nowrap"
              onClick={() => setActiveModal(it.id)}
            >
              <span className="absolute w-6 text-center">{it.icon}</span>
              <span
                className={`
                ml-9 origin-left duration-200
                ${collapsed ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"}
              `}
              >
                {it.label}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {items.map((it) => (
        <OverlayModal
          key={it.id}
          onClose={() => setActiveModal(null)}
          active={it.id === activeModal}
          title={it.label}
          children={it.content}
        />
      ))}
    </aside>
  );
};

export default Sidebar;
