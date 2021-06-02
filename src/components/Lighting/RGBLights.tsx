import React from "react";

function RGBLights() {
  return (
    <>
      <pointLight
        decay={0}
        distance={0}
        intensity={1}
        color="lightblue"
        castShadow={true}
        position={[-2, -8, 5]}
      />
      <pointLight
        decay={0}
        distance={0}
        intensity={3}
        color="red"
        castShadow={true}
        position={[1, 8, -5]}
      />
      <pointLight
        decay={0}
        distance={0}
        intensity={2}
        color="limegreen"
        castShadow={true}
        position={[3, -8, -6]}
      />
    </>
  );
}
