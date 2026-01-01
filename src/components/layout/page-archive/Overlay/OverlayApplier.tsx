import { Fragment } from "react/jsx-runtime";
import OverlayBoxliner from "./OverlayBoxliner";
import OverlayConnector from "./OverlayConnector";
import { useOverlayContext } from "./OverlayContext";
import { useEffect, useState } from "react";

const OverlayApplier = () => {
  const { overlayMetas, overlayTransformsRef } = useOverlayContext();

  /* ========================== */

  // Need refactor from useState to full MotionValue

  /* ========================== */

  const [, forceUpdate] = useState(false);

  useEffect(() => {
    let raf: number;

    const loop = () => {
      forceUpdate((v) => !v);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      {Object.keys(overlayTransformsRef.current).map((id) => {
        if (
          !(
            overlayTransformsRef.current[id].overlay &&
            overlayTransformsRef.current[id].side
          )
        )
          return;

        const hovering = overlayMetas[id]?.hover ?? false;

        return (
          <Fragment key={id}>
            <OverlayConnector id={id} hovering={hovering} />
            <OverlayBoxliner id={id} hovering={hovering} />
          </Fragment>
        );
      })}
    </>
  );
};

export default OverlayApplier;
