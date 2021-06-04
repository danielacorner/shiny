import { useWindowSize } from "../utils/hooks";
import { useAnimationStep } from "./CanvasAndScene/useAnimationStep";
import { useSpring } from "@react-spring/three";
import { useControl } from "react-three-gui";
import { NUM_ANIMATION_STEPS } from "../utils/constants";
import { useRef } from "react";
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
  if (num === 0) {
    console.log("🌟🚨 ~ NumberIndicator ~ animationStep", animationStep);
    console.log("🌟🚨 ~ NumberIndicator ~ translateY", translateY);
    console.log("🌟🚨 ~ NumberIndicator ~ rotX", rotX);
  }
  const animatedRef = useRef(null as any);
  // const springProps = useSpring({
  //   rotX,
  //   translateY,
  //   onFrame: ({ rotX, translateY }) => {
  //     animatedRef.current.rotation.x =
  //       degToRad(90) * 0.14 * (num - animationStep);
  //     // animatedRef.current.translateY = translateY;
  //   },
  // });

  useFrame(() => {
    animatedRef.current.rotation.x =
      degToRad(90) * 0.14 * (num - animationStep);
  });

  return (
    <mesh
      ref={animatedRef}
      {...{
        position: [
          0,
          -(num - animationStep) * height,
          -0.58 * (num - animationStep) ** 2.04,
        ],
        rotation: [degToRad(90) * 0.14 * (num - animationStep), 0, 0],
        translate: [0, 10, 0],
      }}
    >
      <boxBufferGeometry args={[width, height, depth]} />
      <meshLambertMaterial color={"red"} />
    </mesh>
  );
}
