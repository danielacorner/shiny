import Layout from "./components/Layout";
import styled from "styled-components/macro";
import CanvasAndScene from "./components/CanvasAndScene/CanvasAndScene";
import ScrollHandler from "./components/ScrollHandler";
import { useDetectGPU } from "@react-three/drei";
import { useSetAnimationStepOnScroll } from "./components/store/useSetAnimationStepOnScroll";
import { ScrollingOverlaySimple } from "./components/ScrollingOverlay";
import { InfoButton } from "./components/controls/InfoButton";
import { useStore } from "./components/store/store";

export default function App() {
  useSetAnimationStepOnScroll();
  const gpuInfo = useDetectGPU();
  const isInfoOverlayVisible = useStore((s) => s.isInfoOverlayVisible);
  return (
    <Layout>
      Hellooo
      <BackgroundStyles>
        <ScrollHandler>
          <CanvasAndScene />
        </ScrollHandler>
        <ScrollingOverlaySimple />
        <InfoButton />
        {isInfoOverlayVisible && (
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
