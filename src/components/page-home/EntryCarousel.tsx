import { useCallback, useEffect, useRef, useState } from "react";
import EntryCard from "./EntryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDebugValue } from "../../hooks/useDebugValue";

type Card = {
  id: number;
  title: string;
};

// Placeholder
const cards: Card[] = Array.from({ length: 8 }).map((_, i) => ({
  id: i,
  title: `Option ${i + 1}`,
}));

const fullCircle = 2 * Math.PI;
const anglePerCard = fullCircle / cards.length;

const EntryCarousel = () => {
  const [isSnapping, setIsSnapping] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rotationRef = useRef(0);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startRotation: 0,
    lastTime: 0,
    lastX: 0,
    velocity: 0,
  });
  const momentumIdRef = useRef<number | null>(null);
  const snapIdRef = useRef<number | null>(null);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const getIndex = (dir?: number) =>
    mod(
      Math.round(
        (rotationRef.current + (dir ?? 0) * anglePerCard) / anglePerCard
      ),
      cards.length
    );

  {
    useDebugValue("rotation", rotationRef.current.toFixed(2), "/home");
    useDebugValue(
      "startRotation",
      dragRef.current.startRotation.toFixed(2),
      "/home"
    );
    useDebugValue("selectedIndex", selectedIndex, "/home");
  }

  const mod = (n: number, m: number) => ((n % m) + m) % m;
  const roundToMultiple = (n: number, d: number) => Math.round(n / d) * d;

  const updateTransforms = () => {
    const radius = Math.min(window.innerWidth * 0.36, 400);

    cardRefs.current.forEach((el, index) => {
      if (!el) return;

      const cardAngle = index * anglePerCard - rotationRef.current;
      const x = Math.sin(cardAngle) * radius;
      const z = Math.cos(cardAngle) * radius;

      const normalizedZ = (z + radius) / (radius * 2);
      const scale = 0.7 + normalizedZ * 0.3;

      el.style.transform = `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
    });
  };

  const animate = () => {
    updateTransforms();
    momentumIdRef.current = requestAnimationFrame(animate);
  };

  const cancelMomentum = () => {
    dragRef.current.velocity = 0;
    if (momentumIdRef.current) {
      cancelAnimationFrame(momentumIdRef.current);
      momentumIdRef.current = null;
    }
  };

  const rotateLeft = useCallback(() => snapToCard(-1), []);
  const rotateRight = useCallback(() => snapToCard(1), []);
  const snapToCard = useCallback(
    (dir: number) => {
      cancelMomentum();
      setSelectedIndex(getIndex(dir));

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
        rotationRef.current = startRotation + diff * easedT;
        updateTransforms();
        if (t < 1) snapIdRef.current = requestAnimationFrame(animateSnap);
        else {
          setIsSnapping(false);
          snapIdRef.current = null;
        }
      };

      setIsSnapping(true);
      animateSnap();
    },
    [anglePerCard]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (isSnapping) {
      setIsSnapping(false);
      if (snapIdRef.current) {
        cancelAnimationFrame(snapIdRef.current);
        snapIdRef.current = null;
      }
    }

    cancelMomentum();
    setSelectedIndex(null);
    dragRef.current.active = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startRotation = rotationRef.current;
    dragRef.current.lastTime = performance.now();

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;

    const now = performance.now();
    const delta = e.clientX - dragRef.current.startX;
    const rotationDelta = (delta / 500) * Math.PI;
    rotationRef.current = dragRef.current.startRotation - rotationDelta;

    if (momentumIdRef != null) {
      updateTransforms();
    }

    const dt = now - dragRef.current.lastTime; // in ms
    const dx = e.clientX - dragRef.current.lastX;
    dragRef.current.velocity = dx / dt; // pixels per ms
    dragRef.current.lastTime = now;
    dragRef.current.lastX = e.clientX;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (!dragRef.current.active) return;
    dragRef.current.active = false;

    let vel = dragRef.current.velocity * -0.15;

    const animateMomentum = () => {
      if (Math.abs(vel) < 0.01) {
        momentumIdRef.current = null;
        snapToCard(0);
        return;
      }

      rotationRef.current += vel;
      vel *= 0.94;
      updateTransforms();
      momentumIdRef.current = requestAnimationFrame(animateMomentum);
    };

    animateMomentum();
  };

  // Initialize
  useEffect(() => {
    snapToCard(0);
  }, []);

  return (
    <div className="w-full max-w-[1200px] flex items-center justify-center m-6">
      <div className="relative w-full">
        <div className="relative flex items-center justify-center">
          <button
            onClick={rotateLeft}
            className="absolute left-0 z-50 bg-purple-600/75 hover:bg-white text-white hover:text-black p-4 rounded-full backdrop-blur-md shadow-lg"
          >
            <ChevronLeft size={32} />
          </button>

          <div
            className="relative w-full h-[300px] cursor-grab active:cursor-grabbing"
            style={{
              perspective: "1200px",
              perspectiveOrigin: "center center",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {cards.map((card, index) => (
                <div
                  className="flex items-center justify-center"
                  key={card.id}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                >
                  <EntryCard
                    title={card.title}
                    isSelected={index === selectedIndex}
                  />
                </div>
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
              {selectedIndex != null ? cards[selectedIndex].title : "???"}
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
                snapToCard(index - getIndex());
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
