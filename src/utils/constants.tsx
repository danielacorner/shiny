import { useControl } from "react-three-gui";
import * as THREE from "three";
import isEqual from "lodash.isequal";
export const INITIAL_ROTATION = { x: 1, y: 2, z: 3 };
const degToRad = (THREE as any).Math.degToRad;

/** rotate the icosahedron (in degrees) to each face, from 20 to 1 */
export const ROTATION_STEPS_DEG = [
  { x: 88.8, y: 224.4, z: 252 }, // 20
  { x: 224.4, y: 144, z: 254.4 }, // 19
  { x: 349.2, y: 163.2, z: 25.2 }, // 18
  { x: 309.6, y: 27.6, z: 296.4 }, // 17
  { x: 349.2, y: 16.8, z: 33.6 }, // 16
  { x: 129.6, y: 30, z: 108 }, // 15
  { x: 66, y: 271.2, z: 271.2 }, // 14
  { x: 42, y: 150, z: 66 }, // 13
  { x: 50.4, y: 230.4, z: 152.4 }, // 12
  { x: 240.4, y: 304.8, z: 146.4 }, // 11
  // { x: 240.4, y: 304.8, z: 146.4 }, // 11
  { x: 230.4, y: 235.2, z: 326.4 }, // 10
  { x: 230.4, y: 232.8, z: 146.4 }, // 9
  { x: 42, y: 30, z: 252 }, // 8
  { x: 42, y: 271.2, z: 63.6 }, // 7
  { x: 302.4, y: 21.6, z: 118.8 }, // 6
  { x: 163.2, y: 16.8, z: 30 }, // 5
  { x: 307.2, y: 146.4, z: 110.4 }, // 4
  { x: 340.8, y: 19.2, z: 213.6 }, // 3
  { x: 224.4, y: 30, z: 69.6 }, // 2
  { x: 268.8, y: 30, z: 246 }, // 1
];

export const useRotationSteps = () => {
  const x = useControl("x", { type: "number", min: -100, max: 100, value: 0 });
  const y = useControl("y", { type: "number", min: -100, max: 100, value: 0 });
  const z = useControl("z", { type: "number", min: -100, max: 100, value: 0 });
  return (
    ROTATION_STEPS_DEG.map(
      (step) =>
        isEqual(step, { x: 240.4, y: 304.8, z: 146.4 }) ? { x, y, z } : step // overriding step 11
    )
      // convert to radians
      .map((xyz) =>
        Object.fromEntries(
          Object.entries(xyz).map(([x, degrees]) => [x, degToRad(degrees)])
        )
      )
  );
};

/** rotate the icosahedron (in radians) to each face, from 20 to 1  */
export const ROTATION_STEPS = ROTATION_STEPS_DEG.map((xyz) =>
  Object.fromEntries(
    Object.entries(xyz).map(([x, degrees]) => [x, degToRad(degrees)])
  )
);

export const NUM_ANIMATION_STEPS = ROTATION_STEPS_DEG.length + 1; // 1 extra step = starting position
