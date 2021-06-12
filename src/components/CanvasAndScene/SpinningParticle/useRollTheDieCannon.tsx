import { useBox, useConvexPolyhedron } from "@react-three/cannon";
import { useEffect, useState } from "react";
import { useStore } from "../../store/store";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const ZOOM_SPEED = 0.1;
const ROLL_TIME = 2 * 1000;

export function useRollTheDieCannon() {
  const isRollingDie = useStore((s) => s.isRollingDie);
  const isRollingComplete = useStore((s) => s.isRollingComplete);
  const set = useStore((s) => s.set);
  // const [icosahedronPhysicsRef, api] = useConvexPolyhedron(() => ({
  //   mass: 1, // approximate mass using volume of a sphere equation
  //   // position,
  //   // onCollide: handleCollide(unmount, setVirusHp),
  //   // https://threejs.org/docs/scenes/geometry-browser.html#IcosahedronBufferGeometry
  //   args: new THREE.IcosahedronGeometry(1, 1),
  // }));

  const [icosahedronPhysicsRef, api] = useBox(() => ({
    mass: 1,
    position: [0, 0, 0],
  }));

  // throw the die
  const x = 1;
  useEffect(() => {
    let timer = null as number | null;
    if (isRollingDie) {
      set({ isRollingComplete: false });
      timer = window.setTimeout(
        () => set({ isRollingComplete: true }),
        ROLL_TIME
      );

      const impulse = [Math.random() * x - x, Math.random() * x - x, -10];
      const worldPoint = [0, 0, 10];
      api.applyImpulse(impulse, worldPoint);
    }

    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRollingDie]);

  // zoom in the camera after we roll
  useFrame(({ camera }) => {
    if (isRollingDie && isRollingComplete) {
      const d20Position = icosahedronPhysicsRef.current.position;
      const CAMERA_POSITION_ZOOMED = {
        x: d20Position.x,
        y: d20Position.y,
        // x: 0,
        // y: -0,
        z: -0,
      };

      // zoom in
      const deltaX = CAMERA_POSITION_ZOOMED.x - camera.position.x;
      const x = camera.position.x + deltaX * ZOOM_SPEED;
      const deltaY = CAMERA_POSITION_ZOOMED.y - camera.position.y;
      const y = camera.position.y + deltaY * ZOOM_SPEED;
      const deltaZ = CAMERA_POSITION_ZOOMED.z - camera.position.z;
      const z = camera.position.z + deltaZ * ZOOM_SPEED;
      camera.position.set(x, y, z);

      camera.lookAt(0, 0, -100);
    }
  });

  return icosahedronPhysicsRef;
}
