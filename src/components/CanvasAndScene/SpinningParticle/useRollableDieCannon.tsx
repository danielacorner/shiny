import { useConvexPolyhedron } from "@react-three/cannon";
import { useEffect, useMemo, useRef } from "react";
import { useIsZoomedCamera, useStore } from "../../store/store";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { CAMERA_POSITION_INITIAL, ROLL_TIME } from "../../../utils/constants";
import { Geometry } from "three-stdlib";
import { useMount } from "../../../utils/hooks";

const ZOOM_SPEED = 0.1;

const RADIUS = 2;
const DETAIL = 0;

export function useRollableDieCannon() {
  const isRollingDie = useStore((s) => s.isRollingDie);
  const isRollingComplete = useStore((s) => s.isRollingComplete);
  const isZoomedCamera = useIsZoomedCamera();

  const set = useStore((s) => s.set);

  const geo = useMemo(
    () => toConvexProps(new THREE.IcosahedronBufferGeometry(RADIUS, DETAIL)),
    []
  );

  const [icosahedronPhysicsRef, api] = useConvexPolyhedron(() => ({
    mass: 1, // approximate mass using volume of a sphere equation
    // position,
    // rotation: [0, 0, 0],
    // onCollide: handleCollide(unmount, setVirusHp),
    // https://threejs.org/docs/scenes/geometry-browser.html#IcosahedronGeometry
    args: geo as any,
  }));

  // const [icosahedronPhysicsRef, api] = useBox(() => ({
  //   mass: 1,
  //   position: [0, 0, 0],
  // }));

  // throw the die
  const x = Math.random() * 3;
  useEffect(() => {
    // reset the rotation before & after rolling
    api.rotation.set(0, 0, 0);

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

  const d20Position = useRef([0, 0, 0]);
  useMount(() => {
    api.position.subscribe((v) => (d20Position.current = v));
  });

  // zoom in the camera after we roll
  useFrame(({ camera }) => {
    // const d20Position = icosahedronPhysicsRef.current.position;
    const cameraPositionZoomed = {
      x: d20Position.current[0],
      y: d20Position.current[1],
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

    if (isRollingComplete && isZoomedCamera) {
      camera.position.set(x, y, z);
      camera.lookAt(0, 0, -1000);
    }

    if (isRollingComplete && !isZoomedCamera) {
      // move the d20 back to starting position
      const [pX, pY, pZ] = [
        d20Position.current[0] * 0.9,
        d20Position.current[1] * 0.9,
        d20Position.current[2] * 0.9,
      ];
      api.position.set(pX, pY, pZ);
    }
  });

  return [icosahedronPhysicsRef, api];
}

/**
 * Returns legacy geometry vertices, faces for ConvP
 * @param {THREE.BufferGeometry} bufferGeometry
 */
function toConvexProps(bufferGeometry) {
  const geo = new Geometry().fromBufferGeometry(bufferGeometry);
  // Merge duplicate vertices resulting from glTF export.
  // Cannon assumes contiguous, closed meshes to work
  geo.mergeVertices();
  return [geo.vertices.map((v) => [v.x, v.y, v.z]), geo.faces.map((f) => [f.a, f.b, f.c]), []]; // prettier-ignore
}