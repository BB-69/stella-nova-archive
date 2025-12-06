import type { ReactNode } from "react";

const ButtonToggle = ({
  toggle,
  onToggle,
  children,
  /*--- customization ---*/
  pxSize,
  alwaysBorder,
}: {
  toggle?: boolean;
  onToggle: () => void;
  children: ReactNode;
  /*--- customization ---*/
  pxSize?: { w?: number; h?: number };
  alwaysBorder?: boolean;
}) => {
  return (
    <button
      className={`flex justify-center items-center
			relative rounded-md pt-0.5
			${
        toggle == undefined || toggle
          ? `
				hover:bg-black/10 [.dark_&]:hover:bg-white/10
        ${alwaysBorder && "border-1 border-black/20 [.dark_&]:border-white/20"}
			`
          : `
				border-1
				bg-blue-500/10 [.dark_&]:bg-blue-300/10
				hover:bg-blue-500/20 [.dark_&]:hover:bg-blue-300/20
				text-blue-600 [.dark_&]:text-blue-400
			`
      }
			cursor-pointer font-bold`}
      onClick={onToggle}
      style={{
        cursor: "pointer",
        width: `${pxSize?.w ? pxSize.w : 40}px`,
        height: `${pxSize?.h ? pxSize.h : 40}px`,
      }}
    >
      {children}
    </button>
  );
};

export default ButtonToggle;
