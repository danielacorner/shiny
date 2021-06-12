import { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/three";
import { useIsZoomed, useStore } from "../../store/store";
import { useMount } from "../../../utils/hooks";
import * as THREE from "three";
import D20_STAR from "../../GLTFs/D20_star";
import { useControl } from "react-three-gui";
import { useSpinObjects } from "./useSpinObjects";
import { useHoverAnimation } from "./useHoverAnimation";

export const SPEED_Y = 0.5;
export const SPEED_X = 0.2;
export const AMPLITUDE_Y = 1;
export const AMPLITUDE_X_INV = 0.01;

const COMMON_MATERIAL_PROPS = {
  transparent: true,
  wireframe: false,
  depthTest: true,
  flatShading: false,
  roughness: 0.4,
  vertexColors: false,
  reflectivity: 1,
};

const degToRad = (THREE as any).Math.degToRad;

// const D20_ROTATION = {
//   x: degToRad(-0.87),
//   y: degToRad(57.6),
//   z: degToRad(54.8),
// };
const D20_STAR_ROTATION = {
  x: degToRad(69.03),
  y: degToRad(-0.02),
  z: degToRad(-0.2),
};

export default function SpinningParticle() {
  const scalePct = 1;

  const ref1 = useRef(null as any);
  const ref2 = useRef(null as any);
  const ref3 = useRef(null as any);
  const ref4 = useRef(null as any);
  const ref5 = useRef(null as any);

  // const x = useControl("rotx", {
  //   type: "number",
  //   value: 69.03,
  //   min: 0,
  //   max: 360,
  // });
  // const y = useControl("roty", {
  //   type: "number",
  //   value: -0.02,
  //   min: 0,
  //   max: 360,
  // });
  // const z = useControl("rotz", {
  //   type: "number",
  //   value: -0.2,
  //   min: 0,
  //   max: 360,
  // });
  const isZoomed = useIsZoomed();

  // const rotation = { x: degToRad(x), y: degToRad(y), z: degToRad(z) };

  useSpinObjects(ref1, ref2, ref3, ref4, ref5);

  // const opacity = useControl("opacity", { // ? not working
  //   value: 0.78,
  //   type: "number",
  //   min: 0.04,
  //   max: 1,
  // });
  const metalness = useControl("metalness", {
    value: 4,
    type: "number",
    min: -4,
    max: 8,
  });
  const roughness = useControl("roughness", {
    value: 0.5,
    type: "number",
    min: 0.0,
    max: 1,
  });

  const [mounted, setMounted] = useState(false);
  useMount(() => {
    setMounted(true);
  });

  const handleZoomIn = () => set({ isZoomed: true });

  const set = useStore((s) => s.set);
  useEffect(() => {
    set({ isSpinning: !isZoomed });
  }, [set, isZoomed]);

  const scale = !mounted ? 0 : !isZoomed ? 2 : 4.5;
  const scaleWireMesh = !isZoomed ? 0.5 : 1;

  const [isWireframe, setIsWireframe] = useState(false);

  const springConfigZoomedOut = { mass: 2, tension: 80, friction: 70 };
  const springonfigZoomedIn = { mass: 1, tension: 80, frction: 70 };

  const springProps = useSpring({
    scale: [scale, scale, scale],
    scaleWireMesh: [scaleWireMesh, scaleWireMesh, scaleWireMesh],
    opacityTetrahedron: !isZoomed ? 0.8 : 0.8,
    opacityIcosahedron: !isZoomed ? 0.2 : 0.2,
    opacityD20: !isZoomed ? 0.6 : 0.2,
    opacityInnerIcosahedron: !isZoomed ? 0 : 0,
    metalnessD20: !isZoomed ? metalness : 0.99,
    roughnessD20: !isZoomed ? roughness : 0.15,
    roughness: !isZoomed ? 0.4 : 0,
    config: !isZoomed ? springConfigZoomedOut : springonfigZoomedIn,
    onRest: (spring) => {
      if (isZoomed) {
        setIsWireframe(true);
        set({ isScrollable: true });
      }
    },
  });

  // const d20Scale = 0.08;
  const d20StarScale = 0.055;

  const hoverAnimationRef = useHoverAnimation();

  return (
    <animated.mesh
      ref={hoverAnimationRef}
      scale={springProps.scale as any}
      onClick={handleZoomIn}
      onPointerDown={handleZoomIn}
    >
      {/* tetrahedron */}
      <animated.mesh ref={ref1}>
        <tetrahedronBufferGeometry args={[scalePct * 0.25, 0]} />
        <animated.meshPhysicalMaterial
          {...COMMON_MATERIAL_PROPS}
          opacity={springProps.opacityTetrahedron}
          depthTest={true}
        />
      </animated.mesh>
      {/* octahedron */}
      <mesh ref={ref2}>
        <octahedronBufferGeometry args={[scalePct * 0.5, 0]} />
        <meshPhysicalMaterial
          {...COMMON_MATERIAL_PROPS}
          opacity={0.6}
          depthTest={true}
        />
      </mesh>
      {/* icosahedron + D20 */}
      <mesh ref={ref3}>
        <mesh>
          <icosahedronBufferGeometry args={[scalePct * 1, 0]} />
          <animated.meshPhysicalMaterial
            {...COMMON_MATERIAL_PROPS}
            opacity={springProps.opacityIcosahedron}
            roughness={springProps.roughness}
            metalness={0.9}
          />
        </mesh>
        {/* TODO: need to fade in a non-transparent one too when isD20Active??? */}
        {/* <D20
          scale={[d20Scale, d20Scale, d20Scale]}
          rotation={[D20_ROTATION.x, D20_ROTATION.y, D20_ROTATION.z]}
          depthTest={true}
          depthWrite={true}
          receiveShadow={true}
          castShadow={true}
        >
          <animated.meshPhysicalMaterial
            {...COMMON_MATERIAL_PROPS}
            // transparent={true}
            depthTest={true}
            depthWrite={true}
            opacity={springProps.opacityD20}
            metalness={springProps.metalnessD20}
            roughness={springProps.roughnessD20}
            clearcoat={0.13}
            clearcoatRoughness={0.4}
            color="white"
          />
        </D20> */}
        <D20_STAR
          scale={[d20StarScale, d20StarScale, d20StarScale]}
          rotation={[
            D20_STAR_ROTATION.x,
            D20_STAR_ROTATION.y,
            D20_STAR_ROTATION.z,
          ]}
        >
          <animated.meshPhysicalMaterial
            {...COMMON_MATERIAL_PROPS}
            transparent={!isZoomed}
            depthTest={isZoomed}
            depthWrite={true}
            opacity={springProps.opacityD20}
            metalness={springProps.metalnessD20}
            roughness={springProps.roughnessD20}
            clearcoat={0.73}
            clearcoatRoughness={0.4}
            color="silver"
          />
        </D20_STAR>
      </mesh>
      <animated.mesh scale={springProps.scaleWireMesh} ref={ref4}>
        <icosahedronBufferGeometry args={[scalePct * 4, 1]} />
        <meshPhysicalMaterial
          {...COMMON_MATERIAL_PROPS}
          color="tomato"
          wireframe={isWireframe}
          opacity={isWireframe ? 0.05 : 0.08}
          depthTest={true}
        />
      </animated.mesh>
      <animated.mesh scale={springProps.scaleWireMesh} ref={ref5}>
        <icosahedronBufferGeometry args={[scalePct * 14, 2]} />
        <meshPhysicalMaterial
          {...COMMON_MATERIAL_PROPS}
          opacity={isWireframe ? 0.03 : 0.04}
          wireframe={true}
          depthTest={isZoomed}
        />
      </animated.mesh>
      <animated.mesh scale={springProps.scaleWireMesh}>
        <icosahedronBufferGeometry args={[scalePct * 100, 5]} />
        <meshPhysicalMaterial
          {...COMMON_MATERIAL_PROPS}
          color="rebeccapurple"
          opacity={0.018}
          wireframe={true}
        />
      </animated.mesh>
      <animated.mesh scale={springProps.scaleWireMesh}>
        <icosahedronBufferGeometry args={[scalePct * 600, 10]} />
        <meshPhysicalMaterial
          {...COMMON_MATERIAL_PROPS}
          color="cornflowerblue"
          opacity={0.01}
          wireframe={true}
        />
      </animated.mesh>
    </animated.mesh>
  );
}