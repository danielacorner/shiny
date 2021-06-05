import { useAnimationStep } from "../store";
import { useControl } from "react-three-gui";
import { NUM_ANIMATION_STEPS } from "../utils/constants";
import { useRef, useState } from "react";
import * as THREE from "three";
import { useMediaQuery } from "@material-ui/core";
import { useFrame } from "@react-three/fiber";

export default function ScrollingOverlay() {
  const rot = useControl("rot", {
    type: "number",
    min: -10,
    max: 10,
    value: 1.47,
  });

  return (
    <mesh>
      {[...Array(22)].map((_, idx) => (
        <NumberIndicator key={idx} num={idx} {...{ rot }} />
      ))}
    </mesh>
  );
}

const degToRad = (THREE as any).Math.degToRad;

function NumberIndicator({ num, rot }) {
  const isTabletOrLarger = useMediaQuery(`(min-width: ${768}px)`);
  const isDesktopOrLarger = useMediaQuery(`(min-width: ${1000}px)`);
  const width = isDesktopOrLarger ? 20 : isTabletOrLarger ? 15 : 10;
  const height = 5;
  const depth = 0.2;

  const animationStep = useAnimationStep();
  const rotX = (-rot * num + -0.4 * animationStep) / Math.PI;
  const translateY = -Math.sin(animationStep / NUM_ANIMATION_STEPS);
  const heightIndex = num - animationStep;

  if (num === 0) {
    console.log("🌟🚨 ~ NumberIndicator ~ animationStep", animationStep);
    console.log("🌟🚨 ~ NumberIndicator ~ translateY", translateY);
    console.log("🌟🚨 ~ NumberIndicator ~ rotX", rotX);
    console.log("🌟🚨 ~ NumberIndicator ~ heightIndex", heightIndex);
  }
  const ref = useRef(null as any);
  // const springProps = useSpring({
  //   rotX,
  //   translateY,
  //   onFrame: ({ rotX, translateY }) => {
  //     ref.current.rotation.x =
  //       degToRad(90) * 0.14 * (num - animationStep);
  //     // ref.current.translateY = translateY;
  //   },
  // });

  const [x, y, z] = [
    degToRad(90) * 0.14 * heightIndex,
    -heightIndex * height,
    -0.58 * heightIndex ** 2.04,
  ];
  console.log("🌟🚨 ~ NumberIndicator ~ y", y);

  const [position, setPosition] = useState([x, y, z]);

  useFrame(() => {
    setPosition([x, y, z]);
    // ref.current.rotation.x = degToRad(90) * 0.14 * heightIndex;
    // ref.current.position.y = -heightIndex * height;
    // ref.current.position.z = -0.58 * heightIndex ** 2.04;
  });

  return (
    <mesh
      ref={ref}
      position={position}
      // {...{
      //   // position: [0, -heightIndex * height, -0.58 * heightIndex ** 2.04],
      //   position,
      //   // rotation: [degToRad(90) * 0.14 * heightIndex, 0, 0],
      //   // translate: [0, 10, 0],
      // }}
    >
      <boxBufferGeometry args={[width, height, depth]} position={position} />
      <meshLambertMaterial color={"red"} />
    </mesh>
  );
}
