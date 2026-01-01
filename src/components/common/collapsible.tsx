import { useEffect, useMemo, useState, type JSX } from "react";

export default function Collapsible({
  title,
  subtitle: subtitle = "",
  saveCollapsed: saveCollapsed = false,
  icon: icon = { open: "+", close: "-" },
  fontSize,
  children,
  lock,
}: {
  title: string;
  subtitle?: string;
  saveCollapsed?: boolean;
  icon?:
    | { open: string; close: string }
    | { open: JSX.Element; close: JSX.Element };
  fontSize?: number;
  children: React.ReactNode;
  lock?: { setCollapsed: boolean };
}) {
  const storageKey = useMemo(
    () => `collapsible-${subtitle}-${title}`,
    [subtitle, title]
  );

  const [open, setOpen] = useState(() => {
    const saved =
      saveCollapsed && subtitle ? localStorage?.getItem(storageKey) : "true";
    if (saved !== null) {
      return saved === "true";
    }
    return true;
  });

  useEffect(() => {
    if (saveCollapsed && subtitle)
      localStorage?.setItem(storageKey, open.toString());
  }, [open, storageKey]);

  return (
    <div className="mb-[8px]">
      <div
        className={`
          flex justify-between items-center
          bg-[var(--d2-h)] [.dark_&]:bg-[var(--d2-h-dark)]
          px-[8px] py-[6px] font-bold rounded-t-[8px]
          ${!open && "rounded-b-[8px]"}
        `}
      >
        <span style={{ fontSize: fontSize }}>{title}</span>

        {lock == null && (
          <button
            className="w-[20px] h-[20px] rounded-[3px] cursor-pointer
            flex justify-center items-center
            text-[var(--t-c)] [.dark_&]:text-[var(--t-c-dark)] text-[14px]/[20px]
            hover:bg-[var(--bg-hover)] [.dark_&]:hover:bg-[var(--bg-hover-dark)]"
            onClick={() => setOpen((v) => !v)}
            aria-label="toggle section"
          >
            <span className={`${typeof icon.close == "string" && "pb-[3px]"}`}>
              {open ? icon.close : icon.open}
            </span>
          </button>
        )}
      </div>

      {(open || (lock != null && !lock.setCollapsed)) && (
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
