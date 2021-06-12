import React, { Suspense, useState } from "react";
import { useWindowSize, useInterval } from "../../utils/hooks";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import {
  Environment,
  OrbitControls,
  Sky,
  Stars,
  Stats,
} from "@react-three/drei";
import { Lighting } from "../Lighting/Lighting";
import { Physics, usePlane } from "@react-three/cannon";
import { PHYSICS_PROPS } from "../PHYSICS_PROPS";
import SpinScene from "../SpinScene";
import SpinningParticle from "./SpinningParticle/SpinningParticle";
import { Controls } from "react-three-gui";
import { DeviceOrientationOrbitControls } from "./DeviceOrientationOrbitControls";
// import ScrollingOverlay from "../ScrollingOverlay";
import { useIsZoomed, useStore } from "../store/store";
import { useFrame, useThree, Canvas } from "@react-three/fiber";
import { useRollTheDieCannon } from "./SpinningParticle/useRollTheDieCannon";
import { ErrorBoundary } from "../ErrorBoundary";

const CONTROLLED = false;
const Canv = CONTROLLED ? Controls.Canvas : Canvas;

export default function CanvasAndScene() {
  const windowSize = useWindowSize();
  const isInfoOverlayVisible = useStore((s) => s.isInfoOverlayVisible);

  return (
    <Suspense fallback={null}>
      <Controls.Provider>
        <Canv
          onCreated={({ gl }) => {
            gl.setPixelRatio(window.devicePixelRatio);
            gl.outputEncoding = THREE.sRGBEncoding;
            gl.physicallyCorrectLights = true;
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
          }}
          gl={{ antialias: false, alpha: false }}
          {...{ camera: { fov: 75, position: [0, 0, 15] } }}
          style={{ height: windowSize.height, width: windowSize.width }}
        >
          <SpinScene>
            <ErrorBoundary component={<Html>❌ Scene</Html>}>
              <mesh scale={[1, 1, 1]}>
                <Scene />
                {isInfoOverlayVisible && <Stats />}
              </mesh>
            </ErrorBoundary>
          </SpinScene>
          <Lighting />
        </Canv>
        {process.env.NODE_ENV !== "production" &&
          isInfoOverlayVisible &&
          CONTROLLED && <Controls style={{ zIndex: 99999 }} />}
      </Controls.Provider>
    </Suspense>
  );
}

function Scene() {
  const turbidity = useGetTurbidityByTimeOfDay();
  const isZoomed = useIsZoomed();
  useResetCameraWhenZoomed();
  const isRollingDie = useStore((s) => s.isRollingDie);
  return (
    <>
      {false && process.env.NODE_ENV === "development" ? (
        <OrbitControls {...({} as any)} />
      ) : !isZoomed ? (
        <DeviceOrientationOrbitControls />
      ) : null}
      <Stars count={1000} />
      <Environment background={false} path={"/"} preset={"night"} />
      <Sky
        rayleigh={7}
        mieCoefficient={0.1}
        mieDirectionalG={1}
        turbidity={turbidity}
      />
      <Physics
        {...{ ...PHYSICS_PROPS, gravity: [0, 0, isRollingDie ? -30 : 0] }}
      >
        <ErrorBoundary component={<Html>❌ rollTheDieCannonRef</Html>}>
          <RollableD20 />
        </ErrorBoundary>
      </Physics>
    </>
  );
}
function RollableD20() {
  // const rollTheDieCannonRef = null;
  const rollTheDieCannonRef = useRollTheDieCannon();
  const [planeRef] = usePlane(() => ({
    rotation: [0, 0, 0],
    position: [0, 0, -8],
    // color: "white",
    // ...props,
  }));

  // const icosahedronPhysicsRef = null;

  return (
    <mesh>
      <mesh ref={rollTheDieCannonRef}>
        <ErrorBoundary component={<Html>❌ SpinningParticle</Html>}>
          <SpinningParticle />
        </ErrorBoundary>
      </mesh>
      <mesh ref={planeRef} />
    </mesh>
  );
}

const TO = { X: 0, Y: 0, Z: 15 };
const ANIMATION_SPEED = 0.07; // 0 to 1
function useResetCameraWhenZoomed() {
  const isZoomed = useIsZoomed();
  const isRollingDie = useStore((s) => s.isRollingDie);
  const camera = useThree(({ camera }) => camera);

  useFrame(() => {
    if (isZoomed && !isRollingDie) {
      const delta = {
        x: TO.X - camera.position.x,
        y: TO.Y - camera.position.y,
        z: TO.Z - camera.position.z,
      };

      camera.position.x = TO.X - delta.x * (1 - ANIMATION_SPEED);
      camera.position.y = TO.Y - delta.y * (1 - ANIMATION_SPEED);
      camera.position.z = TO.Z - delta.z * (1 - ANIMATION_SPEED);

      camera.lookAt(0, 0, 0);
    }
  });
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
    interval: 5 * 60 * 1000,
    immediate: false,
  });

  return turbidity;
}
