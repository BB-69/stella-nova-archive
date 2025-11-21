import { useEffect, useState } from "react";

interface Props {
  title: string;
  position: number;
  total: number;
  currentRotation: number;
}

const OptionCard = ({ title, position, total, currentRotation }: Props) => {
  const anglePerCard = (2 * Math.PI) / total;
  const cardAngle = position * anglePerCard - currentRotation;

  const [radius, setRadius] = useState(Math.min(window.innerWidth * 0.36, 400));

  useEffect(() => {
    const updateRadius = () => {
      setRadius(Math.min(window.innerWidth * 0.36, 400));
    };

    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  const x = Math.sin(cardAngle) * radius;
  const z = Math.cos(cardAngle) * radius;

  const normalizedZ = (z + radius) / (radius * 2);
  const opacity = Math.max(0.3, normalizedZ);
  const scale = 0.7 + normalizedZ * 0.3;

  const distanceFromCenter = Math.abs(cardAngle % (2 * Math.PI));
  const normalizedDistance = Math.min(
    distanceFromCenter,
    2 * Math.PI - distanceFromCenter
  );
  const isSelected = normalizedDistance < anglePerCard / 2;

  return (
    <div
      className="absolute transition-colors transition-shadow transition-opacity"
      style={{
        transform: `translateX(${x}px) translateZ(${z}px) scale(${scale})`,
        opacity: opacity, //z > -radius * 0.8 ? opacity : 0,
        zIndex: Math.round(z),
        pointerEvents: z > -radius * 0.8 ? "auto" : "none",
      }}
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

export default OptionCard;
