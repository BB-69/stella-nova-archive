import type { ReactNode } from "react";

const ButtonToggle = ({
  toggle,
  onToggle,
  children,
  /*--- customization ---*/
  pxSize,
  fullSize: fullSize = false,
  alwaysBorder,
}: {
  toggle?: boolean;
  onToggle: () => void;
  children: ReactNode;
  /*--- customization ---*/
  pxSize?: { w?: number; h?: number };
  fullSize?: boolean;
  alwaysBorder?: boolean;
}) => {
  return (
    <button
      className={`flex justify-center items-center
			relative rounded-md pt-0.5
      ${fullSize && "w-full h-full"}
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
        width: !fullSize ? `${pxSize?.w ? pxSize.w : 40}px` : undefined,
        height: !fullSize ? `${pxSize?.h ? pxSize.h : 40}px` : undefined,
      }}
    >
      {children}
    </button>
  );
};

export default ButtonToggle;
