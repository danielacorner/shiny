import styled from "styled-components/macro";
import { useWindowSize } from "../utils/hooks";
import { useAnimationStep } from "./CanvasAndScene/useAnimationStep";
import { useSpring } from "@react-spring/core";
import { animated } from "@react-spring/three";

export default function ScrollingOverlay() {
  const animationStep = useAnimationStep();
  const springScrollRotation = useSpring({
    rotation: [animationStep, 0, 0],
  });
  return (
    <StyledScrollingOverlayMesh style={springScrollRotation}>
      {[...Array(22)].map((_, idx) => (
        <NumberIndicator key={idx} num={idx} />
      ))}
    </StyledScrollingOverlayMesh>
  );
}
const StyledScrollingOverlayMesh = styled(animated.mesh)``;
function NumberIndicator({ num }) {
  const windowSize = useWindowSize();
  const animationStep = useAnimationStep();
  const width = (windowSize.width / 1920) * 40;
  console.log("🌟🚨 ~ NumberIndicator ~ width", width);
  const heightMulti = 3;
  const height = (windowSize.height / 1080) * heightMulti;
  console.log("🌟🚨 ~ NumberIndicator ~ height", height);
  const depth = 1;
  return (
    <mesh {...{ position: [0, (-num + animationStep) * heightMulti, 0] }}>
      <boxBufferGeometry args={[width, height, depth]} />
      <meshBasicMaterial color={"red"} />
    </mesh>
  );
}
