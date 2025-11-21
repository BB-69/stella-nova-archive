import { useEffect, useMemo, useRef, useState } from "react";
import EntryCard from "./EntryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDebugValue } from "../_DebugTools/hooks/useDebugValue";

type Card = {
  id: number;
  title: string;
};

const EntryCarousel = () => {
  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSnapping, setIsSnapping] = useState(false);
  const rotationRef = useRef<number>(rotation);
  const momentumIdRef = useRef<number | null>(null);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startRotation: 0,
    lastTime: 0,
    lastX: 0,
    velocity: 0,
  });

  {
    useDebugValue("rotation", rotation.toFixed(2), "/home");
    useDebugValue(
      "startRotation",
      dragRef.current.startRotation.toFixed(2),
      "/home"
    );
    useDebugValue("selectedIndex", selectedIndex, "/home");
  }

  const fullCircle = 2 * Math.PI;

  const mod = (n: number, m: number) => ((n % m) + m) % m;
  const roundToMultiple = (n: number, d: number) => Math.round(n / d) * d;

  const cards: Card[] = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        title: `Option ${i + 1}`,
      })),
    []
  );

  const anglePerCard = useMemo(
    () => (2 * Math.PI) / cards.length,
    [cards.length]
  );

  useEffect(() => {
    rotationRef.current = rotation;
    const newIndex = mod(Math.round(rotation / anglePerCard), cards.length);
    if (newIndex != selectedIndex) setSelectedIndex(newIndex);
  }, [rotation]);

  const cancelMomentum = () => {
    dragRef.current.velocity = 0;
    if (momentumIdRef.current) {
      cancelAnimationFrame(momentumIdRef.current);
      momentumIdRef.current = null;
    }
  };

  const rotateLeft = () => snapToCard(-1);
  const rotateRight = () => snapToCard(1);
  const snapToCard = (dir: number) => {
    cancelMomentum();

    const startRotation = rotationRef.current;
    const targetRotation =
      roundToMultiple(startRotation, anglePerCard) + dir * anglePerCard;

    let diff = (targetRotation - startRotation) % fullCircle;

    if (diff > Math.PI) diff -= fullCircle;
    else if (diff < -Math.PI) diff += fullCircle;

    const duration = 300; // ms
    const startTime = performance.now();

    const animateSnap = () => {
      const now = performance.now();
      const t = Math.min((now - startTime) / duration, 1); // 0 → 1
      const easedT = t * (2 - t); // ease out
      setRotation(() => {
        rotationRef.current = startRotation + diff * easedT;
        return rotationRef.current;
      });
      if (t < 1) requestAnimationFrame(animateSnap);
      else setIsSnapping(false);
    };

    setIsSnapping(true);
    animateSnap();
  };

  const handlePointerDown = (x: number) => {
    if (isSnapping) return;

    cancelMomentum();
    dragRef.current.active = true;
    dragRef.current.startX = x;
    dragRef.current.startRotation = rotation;
    dragRef.current.lastTime = performance.now();
  };

  const handlePointerMove = (x: number) => {
    if (!dragRef.current.active) return;

    const now = performance.now();
    const delta = x - dragRef.current.startX;
    const rotationDelta = (delta / 500) * Math.PI;
    setRotation(dragRef.current.startRotation - rotationDelta);

    const dt = now - dragRef.current.lastTime; // in ms
    const dx = x - dragRef.current.lastX;
    dragRef.current.velocity = dx / dt; // pixels per ms
    dragRef.current.lastTime = now;
    dragRef.current.lastX = x;
  };

  const handlePointerUp = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;

    let vel = dragRef.current.velocity * -0.15;
    const friction = 0.95;

    const animateMomentum = () => {
      if (Math.abs(vel) < 0.005) {
        momentumIdRef.current = null;
        snapToCard(0);
        return;
      }

      setRotation((prev) => {
        rotationRef.current = prev + vel;
        return rotationRef.current;
      });
      vel *= friction;
      momentumIdRef.current = requestAnimationFrame(animateMomentum);
    };

    animateMomentum();
  };

  return (
    <div className="w-full max-w-[1200px] flex items-center justify-center m-6">
      <div className="relative w-full">
        <div className="relative flex items-center justify-center">
          <button
            onClick={rotateLeft}
            className="absolute left-0 z-50 bg-purple-600/75 hover:bg-white text-white hover:text-black p-4 rounded-full backdrop-blur-md shadow-lg transition-all"
          >
            <ChevronLeft size={32} />
          </button>

          <div
            className="relative w-full h-[300px] cursor-grab active:cursor-grabbing"
            style={{
              perspective: "1200px",
              perspectiveOrigin: "center center",
            }}
            onMouseDown={(e) => handlePointerDown(e.clientX)}
            onMouseMove={(e) => handlePointerMove(e.clientX)}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
            onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
            onTouchEnd={handlePointerUp}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {cards.map((card, index) => (
                <EntryCard
                  key={card.id}
                  title={card.title}
                  position={index}
                  total={cards.length}
                  currentRotation={rotation}
                />
              ))}
            </div>
          </div>

          <button
            onClick={rotateRight}
            className="absolute right-0 z-50 bg-purple-600/75 hover:bg-white text-white hover:text-black p-4 rounded-full backdrop-blur-md shadow-lg transition-all"
          >
            <ChevronRight size={32} />
          </button>
        </div>

        <div className="mt-8 text-center text-white/80">
          <p className="text-lg">
            Selected:{" "}
            <span className="font-bold text-white">
              {cards[selectedIndex].title}
            </span>
          </p>
          <p className="text-sm mt-2">Click arrows, drag, or swipe to rotate</p>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mt-6">
          {cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => {
                if (momentumIdRef.current) {
                  cancelAnimationFrame(momentumIdRef.current);
                  momentumIdRef.current = null;
                }
                dragRef.current.velocity = 0;
                snapToCard(index - selectedIndex);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                selectedIndex === index
                  ? "bg-white w-8"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EntryCarousel;
