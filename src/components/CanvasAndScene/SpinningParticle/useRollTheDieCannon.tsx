import { useBox } from "@react-three/cannon";
import { useEffect } from "react";
import { useIsZoomedCamera, useStore } from "../../store/store";
// import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { CAMERA_POSITION_INITIAL } from "../../../utils/constants";

const ZOOM_SPEED = 0.1;
const ROLL_TIME = 2 * 1000;

export function useRollTheDieCannon() {
  const isRollingDie = useStore((s) => s.isRollingDie);
  const isRollingComplete = useStore((s) => s.isRollingComplete);
  const isZoomedCamera = useIsZoomedCamera();

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
    const d20Position = icosahedronPhysicsRef.current.position;
    const cameraPositionZoomed = {
      x: d20Position.x,
      y: d20Position.y,
      // x: 0,
      // y: -0,
      z: -0,
    };

    const targetPosition = isZoomedCamera
      ? // zoom in
        cameraPositionZoomed
      : // zoom out
        {
          x: CAMERA_POSITION_INITIAL[0],
          y: CAMERA_POSITION_INITIAL[1],
          z: CAMERA_POSITION_INITIAL[2],
        };

    const deltaX = targetPosition.x - camera.position.x;
    const x = camera.position.x + deltaX * ZOOM_SPEED;
    const deltaY = targetPosition.y - camera.position.y;
    const y = camera.position.y + deltaY * ZOOM_SPEED;
    const deltaZ = targetPosition.z - camera.position.z;
    const z = camera.position.z + deltaZ * ZOOM_SPEED;
    camera.position.set(x, y, z);

    camera.lookAt(0, 0, -100);

    if (isRollingComplete && !isZoomedCamera) {
      // move the d20 back to starting position
      const [pX, pY, pZ] = [
        d20Position.x * 0.9,
        d20Position.y * 0.9,
        d20Position.z * 0.9,
      ];
      api.position.set(pX, pY, pZ);
    }
  });

  return icosahedronPhysicsRef;
}
