const Header = ({
  onToggleSidebar,
  collapsed,
}: {
  onToggleSidebar: () => void;
  collapsed: boolean;
}) => {
  return (
    <header className="header">
      {/* Top row */}
      <div className="header-row header-row--top">
        <div className="brand">
          <button
            className="sidebar-toggle"
            onClick={onToggleSidebar}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {/* simple icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="currentColor"
                d="M3 6h18v2H3zM3 11h12v2H3zM3 16h18v2H3z"
              />
            </svg>
          </button>
          <span className="brand-name">My App</span>
        </div>

        <div className="header-actions">
          <div className="search">
            <input placeholder="Search..." aria-label="Search" />
          </div>
          <div className="user-actions">
            <button className="icon-btn" title="Notifications">
              🔔
            </button>
            <button className="icon-btn" title="Profile">
              👤
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row (nav tabs) */}
      <div className="header-row header-row--bottom">
        <nav className="top-nav" aria-label="Primary">
          <a className="nav-link" href="#">
            Overview
          </a>
          <a className="nav-link" href="#">
            Projects
          </a>
          <a className="nav-link" href="#">
            Teams
          </a>
          <a className="nav-link" href="#">
            Reports
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
