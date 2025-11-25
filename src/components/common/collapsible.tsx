import { useEffect, useMemo, useRef, useState } from "react";

export default function Collapsible({
  title,
  subtitle: subtitle = "",
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const storageKey = useMemo(
    () => `collapsible-${subtitle}-${title}`,
    [subtitle, title]
  );

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
    <div className="mb-[8px]">
      <div
        className="flex justify-between items-center
        bg-[var(--d2-h)] [.dark_&]:bg-[var(--d2-h-dark)]
        px-[8px] py-[6px] rounded-t-[8px] font-bold"
        ref={headerRef}
      >
        <span>{title}</span>

        <button
          className="w-[20px] h-[20px] rounded-[3px] cursor-pointer
          text-[var(t-c)] [.dark_&]:text-[var(t-c-dark)] text-[14px]/[20px]
          hover:bg-[var(--bg-hover)] [.dark_&]:hover:bg-[var(--bg-hover-dark)]"
          onClick={() => setOpen((v) => !v)}
          aria-label="toggle section"
        >
          {open ? "−" : "+"}
        </button>
      </div>

      {open && (
        <div
          className="bg-[#ebebeb77] [.dark_&]:bg-[#2a2a2a77]
          rounded-b-[8px] mb-[4px] p-[8px]"
        >
          {children}
        </div>
      )}
    </div>
  );
}
