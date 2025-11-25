import { memo } from "react";

interface Props {
  title: string;
  isSelected: boolean;
}

const EntryCard = ({ title, isSelected }: Props) => {
  return (
    <div
      className={`absolute transition-colors transition-shadow transition-opacity ${
        isSelected ? "opacity-100" : "opacity-70"
      }`}
    >
      <div
        className={`w-[200px] h-[200px] rounded-xl p-6 flex flex-col items-center justify-center transition-all ${
          isSelected
            ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl scale-105"
            : "bg-white/90 [.dark_&]:bg-black/90 shadow-lg"
        }`}
      >
        <div className="text-center">
          <div
            className={`text-xl font-bold mb-2 ${
              isSelected
                ? "text-white"
                : "text-gray-800 [.dark_&]:text-gray-200"
            }`}
          >
            {title}
          </div>
        </div>
        <div
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 text-sm ${
            isSelected ? "opacity-100 text-white/90" : "opacity-0 text-gray-600"
          }`}
        >
          Tap to select
        </div>
      </div>
    </div>
  );
};

export default memo(EntryCard);
