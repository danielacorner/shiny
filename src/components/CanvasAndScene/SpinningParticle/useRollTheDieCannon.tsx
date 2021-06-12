import { useBox, useConvexPolyhedron } from "@react-three/cannon";
import { useEffect } from "react";
import { useStore } from "../../store/store";
import * as THREE from "three";

export function useRollTheDieCannon() {
  const isRollingDie = useStore((s) => s.isRollingDie);
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
  useEffect(() => {
    if (isRollingDie) {
      const impulse = [0, 0, -10];
      const worldPoint = [0, 0, 10];
      api.applyImpulse(impulse, worldPoint);
    } else {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRollingDie]);

  return icosahedronPhysicsRef;
}
