import Layout from "./components/Layout";
import styled from "styled-components/macro";
import CanvasAndScene from "./components/CanvasAndScene/CanvasAndScene";
import ScrollHandler from "./components/ScrollHandler";
import { useDetectGPU } from "@react-three/drei";

export default function App() {
  return (
    <Layout>
      Hellooo
      <Background />
    </Layout>
  );
}

function Background() {
  const gpuInfo = useDetectGPU();
  return (
    <BackgroundStyles>
      <ScrollHandler>
        <CanvasAndScene />
      </ScrollHandler>
      <div className="gpuInfo">{JSON.stringify(gpuInfo)}</div>
    </BackgroundStyles>
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
