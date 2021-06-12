import { useFrame } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import { useIsZoomed } from "../../store/store";
import { usePrevious } from "../../../utils/hooks";
import { useRotateWithScroll } from "../useRotateWithScroll";
import {
  SPEED_Y,
  AMPLITUDE_Y,
  SPEED_X,
  AMPLITUDE_X_INV,
} from "./SpinningParticle";

export function useSpinObjects(
  ref1: React.MutableRefObject<any>,
  ref2: React.MutableRefObject<any>,
  ref3: React.MutableRefObject<any>,
  ref4: React.MutableRefObject<any>,
  ref5: React.MutableRefObject<any>
) {
  const isZoomed = useIsZoomed();
  const d20Rotation = useRotateWithScroll();

  const rotationSpeed = !isZoomed ? 0.12 : 0.05;

  // manually detect when we just went from isZoomed to !isZoomed
  const [isZoomingOut, setIsZoomingOut] = useState(false);
  const prevIsZoomed = usePrevious(isZoomed);
  useEffect(() => {
    let timer = null as number | null;
    const nextIsZoomingOut = Boolean(prevIsZoomed && !isZoomed);
    if (nextIsZoomingOut) {
      timer = window.setTimeout(() => {
        setIsZoomingOut(false);
      }, 5 * 1000);
      setIsZoomingOut(true);
    }
    // if we're zooming back in, setIsZoomingOut(false)
    if (isZoomed) {
      setIsZoomingOut(false);
      if (timer) {
        window.clearTimeout(timer);
      }
    }
    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [prevIsZoomed, isZoomed]);

  // spin the particle
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (!ref1.current) {
      return;
    }
    ref1.current.rotation.x = -Math.sin(time * SPEED_Y) * AMPLITUDE_Y;
    ref1.current.rotation.y =
      ref1.current.rotation.y + Math.cos(time * SPEED_X) * AMPLITUDE_X_INV;

    ref2.current.rotation.x = Math.sin(time * SPEED_Y) * AMPLITUDE_Y;
    ref2.current.rotation.y =
      ref2.current.rotation.y - Math.cos(time * SPEED_X) * AMPLITUDE_X_INV;

    // ref3 is the d20
    const targetX = Math.sin(time * SPEED_Y) * AMPLITUDE_Y;
    const targetY =
      ref3.current.rotation.y + Math.cos(time * SPEED_X) * AMPLITUDE_X_INV;
    if (isZoomingOut) {
      // move in a spring animation from [x,y,z] to the time-based sine curve
      const deltaX = targetX - ref3.current.rotation.x;
      ref3.current.rotation.x =
        ref3.current.rotation.x + deltaX * rotationSpeed;
      const deltaY = targetY - ref3.current.rotation.y;
      ref3.current.rotation.y =
        ref3.current.rotation.y + deltaY * rotationSpeed;
    } else if (isZoomed) {
      // move in a spring animation from [x,y,z] to rotation
      // e.g. 5 -> 2
      // 5 = 5 + (2-5)/2
      const deltaX = d20Rotation.x - ref3.current.rotation.x;
      ref3.current.rotation.x =
        ref3.current.rotation.x + deltaX * rotationSpeed;
      const deltaY = d20Rotation.y - ref3.current.rotation.y;
      ref3.current.rotation.y =
        ref3.current.rotation.y + deltaY * rotationSpeed;
      const deltaZ = d20Rotation.z - ref3.current.rotation.z;
      ref3.current.rotation.z =
        ref3.current.rotation.z + deltaZ * rotationSpeed;
    } else {
      // (time-based sine curve)
      ref3.current.rotation.x = targetX;
      ref3.current.rotation.y = targetY;
    }

    ref4.current.rotation.x = -Math.sin(time * SPEED_Y) * AMPLITUDE_Y;
    ref4.current.rotation.y =
      ref4.current.rotation.y - Math.cos(time * SPEED_X) * AMPLITUDE_X_INV;

    ref5.current.rotation.x = -Math.sin(time * SPEED_Y) * AMPLITUDE_Y;
    ref5.current.rotation.y =
      ref5.current.rotation.y + Math.cos(time * SPEED_X) * AMPLITUDE_X_INV;
  });
}
