const items = [
  { id: "dash", label: "Dashboard", icon: "🏠" },
  { id: "files", label: "Files", icon: "📁" },
  { id: "assets", label: "Assets", icon: "🖼️" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

const Sidebar = ({
  onToggleSidebar,
  collapsed,
}: {
  onToggleSidebar: () => void;
  collapsed: boolean;
}) => {
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
      <div className="flex items-center h-16 pb-3
      border-b border-black/30 [.dark_&]:border-white/30">
        <button
          onClick={onToggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex flex-row justify-top items-center
          h-full w-full p-[6px_12px]
          rounded-md hover:bg-black/5 [.dark_&]:hover:bg-white/5"
        >
          <svg className="absolute" width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path fill="currentColor" d="M3 6h18v2H3zM3 11h12v2H3zM3 16h18v2H3z" />
          </svg>
          <span
            className={`
              font-bold ml-8 origin-left duration-200
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
          <a
          key={it.id}
          href={`#/${it.id}`}
          className="flex items-center p-[10px_10px] rounded-md
          font-semibold text-[var(--t-c)] [.dark_&]:text-[var(--t-c-dark)]
          hover:bg-blue-500/10 [.dark_&]:hover:bg-blue-300/10
          hover:text-blue-600 [.dark_&]:hover:text-blue-400"
          >
            <span className="absolute w-6 text-center">{it.icon}</span>
            <span
              className={`
                ml-8 origin-left duration-200
                ${collapsed ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"}
              `}
            >
              {it.label}
            </span>
          </a>
        ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
