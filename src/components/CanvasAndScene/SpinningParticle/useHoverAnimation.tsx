import { useFrame } from "react-three-fiber";
import { useRef } from "react";
import { useIsZoomed } from "../../store/store";

export function useHoverAnimation() {
  const ref = useRef(null as any);
  const izZoomed = useIsZoomed();
  useFrame(({ clock }) => {
    if (!izZoomed) {
      return;
    }
    if (ref.current) {
      ref.current.position.y = Math.sin(clock.getElapsedTime()) * 0.08;
      ref.current.position.x = Math.sin(clock.getElapsedTime()) * 0.05;
      ref.current.position.z = Math.sin(clock.getElapsedTime()) * 0.03;

      ref.current.rotation.x = Math.sin(clock.getElapsedTime()) * 0.03;
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() - 2000) * 0.04;
      ref.current.rotation.z = Math.sin(clock.getElapsedTime() + 1000) * 0.03;
    }
  });
  return ref;
}
