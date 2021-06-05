import Layout from "./components/Layout";
import styled from "styled-components/macro";
import CanvasAndScene from "./components/CanvasAndScene/CanvasAndScene";
import ScrollHandler from "./components/ScrollHandler";
import { useDetectGPU } from "@react-three/drei";
import { useSetAnimationStepOnScroll } from "./useSetAnimationStepOnScroll";
import { ScrollingOverlaySimple } from "./components/ScrollingOverlay";
export default function App() {
  useSetAnimationStepOnScroll();
  const gpuInfo = useDetectGPU();
  return (
    <Layout>
      Hellooo
      <BackgroundStyles>
        <ScrollHandler>
          <CanvasAndScene />
        </ScrollHandler>
        {process.env.NODE_ENV === "development" && <ScrollingOverlaySimple />}
        {process.env.NODE_ENV === "development" && (
          <div className="gpuInfo">{JSON.stringify(gpuInfo)}</div>
        )}
      </BackgroundStyles>
    </Layout>
  );
}

const BackgroundStyles = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  .gpuInfo {
    background: hsla(0, 0%, 100%, 0.5);
    position: fixed;
    top: 0;
    right: 0;
    left: 50%;
  }
`;
