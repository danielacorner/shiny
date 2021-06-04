import { useWindowSize } from "../utils/hooks";
import { useAnimationStep } from "./CanvasAndScene/useAnimationStep";
import { animated, useSpring } from "@react-spring/three";
import { useControl } from "react-three-gui";
import { NUM_ANIMATION_STEPS } from "../utils/constants";

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
        <NumberIndicator key={idx} num={idx} rot={rot} />
      ))}
    </mesh>
  );
}
function NumberIndicator({ num, rot }) {
  const windowSize = useWindowSize();
  const width = (windowSize.width / 1920) * 40;
  const height = 4;
  const depth = 0.2;

  const animationStep = useAnimationStep();
  const rotX = (-rot * num + -0.4 * animationStep) / Math.PI;
  const translateY = -Math.sin(animationStep / NUM_ANIMATION_STEPS);
  if (num === 0) {
    console.log("🌟🚨 ~ NumberIndicator ~ translateY", translateY);
    console.log("🌟🚨 ~ NumberIndicator ~ rotX", rotX);
  }
  const springProps = useSpring({
    rotX,
    translateY,
  });
  return (
    <animated.mesh
      {...{
        position: [0, -num * height, num],
        translate: [0, springProps.translateY, 0],
        rotateX: springProps.rotX,
      }}
    >
      <boxBufferGeometry args={[width, height, depth]} />
      <meshLambertMaterial color={"red"} />
    </animated.mesh>
  );
}
