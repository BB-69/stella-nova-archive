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
    <aside className="sidebar" aria-expanded={!collapsed}>
      <div className="sidebar-inner">
        <div className="sidebar-top">
          <div className="logo">
            <div className="logo-mark">✨</div>
            {!collapsed && <div className="logo-text">Studio</div>}
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Sidebar">
          {items.map((it) => (
            <a key={it.id} className="sidebar-item" href={`#${it.id}`}>
              <span className="item-icon" aria-hidden>
                {it.icon}
              </span>
              {!collapsed && <span className="item-label">{it.label}</span>}
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="collapse-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            {collapsed ? "➡️" : "⬅️"}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
