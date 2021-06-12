import Layout from "./components/Layout";
import styled from "styled-components/macro";
import CanvasAndScene from "./components/CanvasAndScene/CanvasAndScene";
import ScrollHandler from "./components/ScrollHandler";
import { useDetectGPU } from "@react-three/drei";
import { useSetAnimationStepOnScroll } from "./components/store/useSetAnimationStepOnScroll";
import { ScrollingOverlaySimple } from "./components/ScrollingOverlay";
import { InfoButton } from "./components/controls/InfoButton";
import { SoundButton } from "./components/controls/SoundButton";
import { RollTheDieButton } from "./components/controls/RollTheDieButton";
import { useStore } from "./components/store/store";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  useSetAnimationStepOnScroll();
  const gpuInfo = useDetectGPU();
  const isInfoOverlayVisible = useStore((s) => s.isInfoOverlayVisible);

  return (
    <ErrorBoundary fallback={"oh no!"}>
      <Layout>
        Hellooo
        <BackgroundStyles>
          <ScrollHandler>
            <CanvasAndScene />
          </ScrollHandler>
          <ScrollingOverlaySimple />
          <InfoButton />
          <SoundButton />
          <RollTheDieButton />
          {isInfoOverlayVisible && (
            <div className="gpuInfo">{JSON.stringify(gpuInfo)}</div>
          )}
        </BackgroundStyles>
      </Layout>
    </ErrorBoundary>
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
    right: 25%;
    left: 50%;
  }
`;
