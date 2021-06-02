import React, { Suspense, useState } from "react";
import { useWindowSize, useInterval } from "../../utils/hooks";
import * as THREE from "three";
import { Environment, Sky, Stars, Stats } from "@react-three/drei";
import { Lighting } from "../Lighting/Lighting";
import { Physics } from "@react-three/cannon";
import { PHYSICS_PROPS } from "../PHYSICS_PROPS";
import SpinScene from "../SpinScene";
import SpinningParticle from "./SpinningParticle";
import { Controls } from "react-three-gui";
import { DeviceOrientationOrbitControls } from "./DeviceOrientationOrbitControls";

export default function CanvasAndScene() {
  const windowSize = useWindowSize();

  return (
    <Suspense fallback={null}>
      <Controls.Provider>
        <Controls.Canvas
          onCreated={({ gl }) => {
            if (typeof window !== "undefined") {
              gl.setPixelRatio(window.devicePixelRatio);
            }
            gl.outputEncoding = THREE.sRGBEncoding;
            gl.physicallyCorrectLights = true;
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
          }}
          shadowMap={true}
          gl={{ antialias: false, alpha: false }}
          {...{ camera: { fov: 75, position: [0, 0, 15] } }}
          style={{ height: windowSize.height, width: windowSize.width }}
        >
          <SpinScene>
            <mesh scale={[1, 1, 1]}>
              <Scene />
              <Stats />
            </mesh>
          </SpinScene>
          <Lighting />
        </Controls.Canvas>
        {process.env.NODE_ENV !== "production" && <Controls />}
      </Controls.Provider>
    </Suspense>
  );
}

function Scene() {
  const turbidity = useGetTurbidityByTimeOfDay();
  return (
    <Physics {...PHYSICS_PROPS}>
      <>
        {process.env.NODE_ENV === "development" ? (
          // <OrbitControls />
          <DeviceOrientationOrbitControls />
        ) : (
          <DeviceOrientationOrbitControls />
        )}
        <Stars count={1000} />
        <Environment background={false} path={"/"} preset={"night"} />
        <Sky
          rayleigh={7}
          mieCoefficient={0.1}
          mieDirectionalG={1}
          turbidity={turbidity}
        />
        <SpinningParticle />
      </>
    </Physics>
  );
}

const SECONDS_IN_DAY = 24 * 60 * 60;
const TURBIDITY = { max: -50, min: 100 };

function useGetTurbidityByTimeOfDay() {
  const date = new Date();
  const [hours, minutes, seconds] = [
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];
  const secondOfDay = (hours * 60 + minutes) * 60 + seconds;
  // maximum = 12pm --> brightness = time before or after 12pm
  const secondsAtNoon = SECONDS_IN_DAY / 2;
  const secondsBeforeOrSinceNoon = Math.abs(secondOfDay - secondsAtNoon);
  const brightnessPct =
    (SECONDS_IN_DAY - secondsBeforeOrSinceNoon) / SECONDS_IN_DAY;

  const [turbidity, setTurbidity] = useState(
    TURBIDITY.min + brightnessPct * (TURBIDITY.max - TURBIDITY.min)
  );

  // update every 5min
  useInterval({
    callback: () => {
      setTurbidity(
        TURBIDITY.min + brightnessPct * (TURBIDITY.max - TURBIDITY.min)
      );
    },
    delay: 5 * 60 * 1000,
    immediate: false,
  });

  return turbidity;
}
