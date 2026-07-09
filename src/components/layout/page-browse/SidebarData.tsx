import GitHubLogo from "/assets/github.svg";
import DiscordLogo from "/assets/discord.svg";
import NovaTable from "/assets/nova-alphabet-table.jpg";
import NovaTableWritten from "/assets/nova-alphabet-written-table.png";
import pkg from "../../../../package.json";
import ScrollableImgGroup from "../../common/scrollable-imggroup";
import {
  FileSpreadsheet,
  CircleQuestionMark,
  Link,
  PenLine,
} from "lucide-react";
import HyperLink from "../../common/hyperlink";
import {
  Fragment,
  useState,
  type Dispatch,
  type JSX,
  type SetStateAction,
} from "react";
import OverlayModal from "../../common/overlay-modal";
import { useNavigate } from "react-router-dom";

interface SidebarOptionProps {
  id: string;
  label: string;
  icon: JSX.Element;
  content?: JSX.Element;
  navigatePath?: string;
}

const options: SidebarOptionProps[] = [
  {
    id: "edit_mode",
    label: "Edit Mode",
    icon: <PenLine />,
    navigatePath: "/archive?edit=true",
  },
  {
    id: "resources",
    label: "Resources",
    icon: <FileSpreadsheet />,
    content: (
      <div className="group-selectable flex w-[80vw] h-[50vh]">
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
      <div
        className="group-selectable flex flex-col gap-5
        max-w-[80vw] max-h-[50vh] overflow-y-auto"
      >
        <div className="flex flex-row gap-4 underline-offset-1">
          <img
            src={GitHubLogo}
            alt="GitHub"
            className="w-12 h-12 [.dark_&]:invert"
          />
          <div className="flex flex-col">
            <div className="font-bold">Stella Nova Archive</div>
            <HyperLink link="https://github.com/bright9th/stella-nova-archive.git" />
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
            <HyperLink link="https://github.com/bright9th/stella-nova-archive-db.git" />
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
      <div
        className="group-selectable flex flex-col gap-2
        w-[600px] max-w-[80vw] max-h-[50vh] overflow-y-auto"
      >
        <span>
          <span className="font-bold">Stella Nova Archive</span> is a website
          that acts like an archive that contains inscription and translation of{" "}
          <span className="font-bold">'Nova'</span> language from hit game{" "}
          <span className="font-bold">'Stella Sora'</span>.
        </span>
        <div className="border-b-5 border-dotted my-4 opacity-40"></div>
        <span>
          <span className="opacity-70">Version: </span>
          {pkg.version}
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

const SidebarOption = ({
  id,
  label,
  icon,
  navigatePath,
  collapsed,
  setActiveModal,
}: SidebarOptionProps & {
  collapsed: boolean;
  setActiveModal: Dispatch<SetStateAction<string | null>>;
}) => {
  const navigate = useNavigate();

  return (
    <button
      key={id}
      className="flex items-center p-[10px_10px] rounded-md
      font-semibold text-[var(--t-c)] [.dark_&]:text-[var(--t-c-dark)]
      hover:bg-blue-500/10 [.dark_&]:hover:bg-blue-300/10
      hover:text-blue-600 [.dark_&]:hover:text-blue-400
      whitespace-nowrap"
      onClick={() =>
        navigatePath ? navigate(navigatePath) : setActiveModal(id)
      }
    >
      <span className="absolute w-6 text-center">{icon}</span>
      <span
        className={`
          ml-9 origin-left duration-200
          ${collapsed ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"}
        `}
      >
        {label}
      </span>
    </button>
  );
};

const SidebarData = ({ sidebarCollapsed }: { sidebarCollapsed: boolean }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <>
      {options.map((o) => (
        <Fragment key={o.id}>
          <SidebarOption
            id={o.id}
            label={o.label}
            icon={o.icon}
            navigatePath={o.navigatePath}
            collapsed={sidebarCollapsed}
            setActiveModal={setActiveModal}
          />

          <div className="absolute z-5">
            {o.content && (
              <OverlayModal
                key={o.id}
                onClose={() => setActiveModal(null)}
                active={o.id === activeModal}
                title={o.label}
                children={o.content}
              />
            )}
          </div>
        </Fragment>
      ))}
    </>
  );
};

export default SidebarData;
