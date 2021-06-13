import Plane from "./Plane";

const Walls = () => {
  const worldRadius = 8;

  const walls = [
    // {/* behind (back wall) */}
    {
      rotation: [0 * Math.PI, 0, 0],
      position: [0, -0, -worldRadius],
    },
    // {/* in front (camera-side) */}
    {
      rotation: [0, -1 * Math.PI, 0],
      position: [0, -0, worldRadius],
    },
    // {/* left */}
    {
      rotation: [0, 0.5 * Math.PI, 0],
      position: [-worldRadius, 0, 0],
    },
    // {/* right */}
    {
      rotation: [0, -0.5 * Math.PI, 0],
      position: [worldRadius, -0, 0],
    },
    // {/* floor */}
    {
      rotation: [-0.5 * Math.PI, 0, 0],
      position: [0, -worldRadius, 0],
    },
    // {/* ceiling */}
    {
      rotation: [0.5 * Math.PI, 0, 0],
      position: [0, worldRadius, 0],
    },
  ];

  return (
    <>
      {walls.map((props, idx) => (
        <Plane
          key={idx}
          {...props}
          width={worldRadius * 2}
          height={worldRadius * 2}
        />
      ))}
    </>
  );
};

export default Walls;
