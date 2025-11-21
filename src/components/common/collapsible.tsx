import { useEffect, useRef, useState } from "react";

export default function Collapsible({
  title,
  key: key = "",
  children,
}: {
  title: string;
  key?: string;
  children: React.ReactNode;
}) {
  const storageKey = `collapsible-${key}-${title}`;

  const [open, setOpen] = useState(() => {
    const saved = localStorage?.getItem(storageKey);
    if (saved !== null) {
      return saved === "true";
    }
    return true;
  });

  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      if (open) {
        headerRef.current.classList.remove("fold");
      } else {
        headerRef.current.classList.add("fold");
      }
    }
    localStorage?.setItem(storageKey, open.toString());
  }, [open, storageKey]);

  return (
    <div className="collapsible">
      <div className="collapsible-header" ref={headerRef}>
        <span>{title}</span>

        <button
          className="collapse-btn"
          onClick={() => setOpen((v) => !v)}
          aria-label="toggle section"
        >
          {open ? "−" : "+"}
        </button>
      </div>

      {open && <div className="collapsible-body">{children}</div>}
    </div>
  );
}
