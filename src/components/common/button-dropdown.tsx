import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const ButtonDropdown = ({
  icon,
  divs,
  /*--- customization ---*/
  pxSize,
  fullSize: fullSize = false,
}: {
  icon: ReactNode;
  divs: ReactNode[];
  /*--- customization ---*/
  pxSize?: { w?: number; h?: number };
  fullSize?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const buttonSize = useMemo(() => {
    return {
      width: !fullSize ? `${pxSize?.w ? pxSize.w : 60}px` : undefined,
      height: !fullSize ? `${pxSize?.h ? pxSize.h : 60}px` : undefined,
    };
  }, [fullSize, pxSize]);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !buttonRef.current || !dropdownRef.current) return;

    let rafId: number;

    const loop = () => {
      const rect = buttonRef.current!.getBoundingClientRect();
      dropdownRef.current!.style.top = `${rect.top + rect.height}px`;
      dropdownRef.current!.style.left = `${rect.left}px`;
      rafId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(rafId);
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className={`
          group-unselectable flex justify-center items-center
          ${
            open
              ? `bg-[#225588] [.dark_&]:bg-white
              text-white [.dark_&]:text-[#225588]`
              : "bg-white [.dark_&]:bg-black"
          }
          hover:bg-[#225588] [.dark_&]:hover:bg-white
          hover:text-white [.dark_&]:hover:text-[#225588]
          transition-color duration-200
        `}
        onClick={() => setOpen((prev) => !prev)}
        style={{
          cursor: "pointer",
          minWidth: buttonSize.width,
          minHeight: buttonSize.height,
        }}
      >
        <div
          className={`flex justify-center items-center
          transition-transform ${open && "rotate-90"}`}
        >
          {icon}
        </div>
      </button>

      <div
        ref={dropdownRef}
        className="fixed z-[20] overflow-hidden"
        style={{
          maxWidth: buttonSize.width,
        }}
      >
        <div
          className={`flex flex-col
            divide-y-2 divide-black/20 [.dark_&]:divide-white/20
            transition-transform duration-200 ease-out
            ${open ? "translate-y-0" : "-translate-y-full"}
          `}
        >
          {divs.map((d, idx) => (
            <div
              key={idx}
              className="flex justify-center items-center
              bg-white [.dark_&]:bg-black p-1"
              style={{
                width: buttonSize.width,
                height: buttonSize.height,
              }}
            >
              {d}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ButtonDropdown;
