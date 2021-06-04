import { useWindowSize } from "../utils/hooks";
import { useAnimationStep } from "./CanvasAndScene/useAnimationStep";
import { useSpring } from "@react-spring/three";
import { useControl } from "react-three-gui";
import { NUM_ANIMATION_STEPS } from "../utils/constants";
import { useRef } from "react";
import * as THREE from "three";
import { useMediaQuery } from "@material-ui/core";

export default function ScrollingOverlay() {
  const rot = useControl("rot", {
    type: "number",
    min: -10,
    max: 10,
    value: 1.47,
  });
  const thing = useControl("thing", {
    type: "number",
    min: 0,
    max: 1,
    value: 0.15,
  });
  const thing2 = useControl("thing", {
    type: "number",
    min: 0,
    max: 1,
    value: 0.8,
  });
  return (
    <mesh>
      {[...Array(22)].map((_, idx) => (
        <NumberIndicator key={idx} num={idx} {...{ rot, thing, thing2 }} />
      ))}
    </mesh>
  );
}

const degToRad = (THREE as any).Math.degToRad;

function NumberIndicator({ num, rot, thing, thing2 }) {
  const isTabletOrLarger = useMediaQuery(`(min-width: ${768}px)`);
  const isDesktopOrLarger = useMediaQuery(`(min-width: ${1000}px)`);
  const width = isDesktopOrLarger ? 20 : isTabletOrLarger ? 15 : 10;
  const height = 5;
  const depth = 0.2;

  const animationStep = useAnimationStep();
  const rotX = (-rot * num + -0.4 * animationStep) / Math.PI;
  const translateY = -Math.sin(animationStep / NUM_ANIMATION_STEPS);
  if (num === 0) {
    console.log("🌟🚨 ~ NumberIndicator ~ translateY", translateY);
    console.log("🌟🚨 ~ NumberIndicator ~ rotX", rotX);
  }
  const animatedRef = useRef(null as any);
  const springProps = useSpring({
    rotX,
    translateY,
    onFrame: ({ rotX, translateY }) => {
      // animatedRef.current.rotation.x = rotX;
      // animatedRef.current.translateY = translateY;
    },
  });

  return (
    <mesh
      ref={animatedRef}
      {...{
        position: [0, -num * height, -thing2 * num ** 1.8],
        rotation: [degToRad(90) * thing * num, 0, 0],
      }}
    >
      <boxBufferGeometry args={[width, height, depth]} />
      <meshLambertMaterial color={"red"} />
    </mesh>
  );
}
