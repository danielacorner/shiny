import React, { useRef } from "react";
import { useFrame } from "react-three-fiber";
import { useStore } from "../store";

// const SPEED_X = 0.2;
const SPEED_Y = 0.1;
const AMPLITUDE_Y = 0.2;
// const AMPLITUDE_X = 0.7;
const ANIMATION_SPEED = 0.07; // 0 to 1, 0 nothing 1 instant
export default function SpinScene({ children }) {
  const isSpinning = useStore((s) => s.isSpinning);
  const ref = useRef(null as any);
  useFrame(({ clock }) => {
    if (!isSpinning) {
      // animate the rotation back to 0
      // ref.current.rotation.x = 0;
      // ref.current.rotation.y = 0;
      // ref.current.rotation.z = 0;

      ref.current.rotation.x = ref.current.rotation.x * (1 - ANIMATION_SPEED);
      ref.current.rotation.y = ref.current.rotation.y * (1 - ANIMATION_SPEED);
      ref.current.rotation.z = ref.current.rotation.z * (1 - ANIMATION_SPEED);
      return;
    }
    const time = clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.x = -Math.sin(time * SPEED_Y) * AMPLITUDE_Y;
      ref.current.rotation.y = ref.current.rotation.y + 0.0015;
    }
  });
  return <mesh ref={ref}>{children}</mesh>;
}
