import * as React from "react";
import Layout from "../components/Layout";
import styled from "styled-components/macro";
import CanvasAndScene from "../components/CanvasAndScene/CanvasAndScene";
import ScrollHandler from "../components/ScrollHandler";

export default function App() {
  return (
    <Layout>
      <title>Daniel C</title>
      Hellooo
      <Background />
    </Layout>
  );
}

function Background() {
  return (
    <BackgroundStyles>
      <ScrollHandler>
        <CanvasAndScene />
      </ScrollHandler>
    </BackgroundStyles>
  );
}

const BackgroundStyles = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
