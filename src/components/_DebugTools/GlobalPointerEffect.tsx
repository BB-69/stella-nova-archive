import { useEffect } from "react";

function GlobalPulseOneshot() {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes pulse-once {
        0% {
          transform: scale(0.4);
          opacity: 1;
        }
        100% {
          transform: scale(1.2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    const onPointerDown = (e: PointerEvent) => {
      const pulse = document.createElement("div");
      const size = 40;

      pulse.style.width = pulse.style.height = `${size}px`;
      pulse.style.left = `${e.clientX - size / 2}px`;
      pulse.style.top = `${e.clientY - size / 2}px`;

      pulse.className = `
        fixed pointer-events-none z-[9999]
        rounded-full bg-gray-400/70
      `;

      pulse.style.animation = "pulse-once 200ms ease-out forwards";

      document.body.appendChild(pulse);

      setTimeout(() => pulse.remove(), 250);
    };

    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      style.remove();
    };
  }, []);

  return null;
}

function GlobalHoldOpacityDome() {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes dome-fade-in {
        from { transform: scale(0); }
        to { transform: scale(1); }
      }

      @keyframes dome-fade-out {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    const size = 20;
    let dome: HTMLDivElement | null = null;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 || dome) return;

      dome = document.createElement("div");

      dome.style.width = dome.style.height = `${size}px`;
      dome.style.left = `${e.clientX - size / 2}px`;
      dome.style.top = `${e.clientY - size / 2}px`;

      dome.className = `
        fixed pointer-events-none z-[9999]
        rounded-full bg-gray-400/40
      `;

      dome.style.animation = "dome-fade-in 100ms ease-out forwards";

      document.body.appendChild(dome);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dome) return;

      dome.style.left = `${e.clientX - size / 2}px`;
      dome.style.top = `${e.clientY - size / 2}px`;
    };

    const onPointerCancel = () => {
      if (!dome) return;

      dome.style.animation = "dome-fade-out 100ms ease-out forwards";

      setTimeout(() => {
        dome?.remove();
        dome = null;
      }, 250);
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerCancel);
    window.addEventListener("pointercancel", onPointerCancel);
    window.addEventListener("contextmenu", onPointerCancel);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerCancel);
      window.removeEventListener("pointercancel", onPointerCancel);
      window.removeEventListener("contextmenu", onPointerCancel);
      style.remove();
    };
  }, []);

  return null;
}

export function GlobalPointerEffect() {
  return (
    <>
      <GlobalPulseOneshot />
      <GlobalHoldOpacityDome />
    </>
  );
}
