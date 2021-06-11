import Layout from "./components/Layout";
import styled from "styled-components/macro";
import CanvasAndScene from "./components/CanvasAndScene/CanvasAndScene";
import ScrollHandler from "./components/ScrollHandler";
import { useDetectGPU } from "@react-three/drei";
import { useSetAnimationStepOnScroll } from "./components/store/useSetAnimationStepOnScroll";
import { ScrollingOverlaySimple } from "./components/ScrollingOverlay";
import { useStore } from "./components/store/store";
import { Info } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

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
        <ScrollingOverlaySimple />
        <InfoButton />
        <div className="gpuInfo">{JSON.stringify(gpuInfo)}</div>
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

/** show or hide the info overlay */
function InfoButton() {
  const isInfoOverlayVisible = useStore((s) => s.isInfoOverlayVisible);
  const set = useStore((s) => s.set);
  return (
    <IconButton
      onClick={() => set({ isInfoOverlayVisible: !isInfoOverlayVisible })}
    >
      <Info />
    </IconButton>
  );
}
