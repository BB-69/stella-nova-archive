import type { ReactNode } from "react";

const ButtonInput = ({
  label,
  icon,
  htmlInput,
}: {
  label: string;
  icon: ReactNode;
  htmlInput: ReactNode;
}) => {
  return (
    <div
      className="group-unselectable p-[4px] my-1 w-full max-h-full
      flex justify-center items-start"
    >
      <div
        className="group relative flex justify-center items-center
        max-w-full max-h-full rounded-xl border-1
        border-black/50 [.dark_&]:border-white/50
        hover:border-white [.dark_&]:hover:border-black
        hover:bg-[var(--bg-a1)] [.dark_&]:hover:bg-white
        hover:text-white [.dark_&]:hover:text-[var(--bg-a1-dark)]
        pl-2 pr-3 text-sm font-bold whitespace-nowrap
        transition duration-100"
      >
        {htmlInput}
        <span
          className="flex flex-row items-center py-2
          h-full gap-2 opacity-70 group-hover:opacity-100"
        >
          {icon}
          <span className="pb-[1.7px]">{label}</span>
        </span>
      </div>
    </div>
  );
};

export default ButtonInput;
