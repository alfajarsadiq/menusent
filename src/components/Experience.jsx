import { Environment, Float, OrbitControls } from "@react-three/drei";
import { Book } from "./Book";
import { useAtom } from "jotai"; // IMPORT: Needed for state management
import { pauseAtom } from "./UI"; // IMPORT: The pause state created in UI.jsx

export const Experience = ({ pages }) => {
  const [paused] = useAtom(pauseAtom); // GET STATE: Check if animation should be paused

  return (
    <>
      <Float
        rotation-x={-Math.PI / 4}
        // If paused is true, set intensities/speed to 0 to stop movement
        floatIntensity={paused ? 0 : 1}
        speed={paused ? 0 : 2}
        rotationIntensity={paused ? 0 : 2}
      >
        {/* Pass the pages prop down to the Book component */}
        <Book pages={pages} />
      </Float>
      <OrbitControls />
      <Environment preset="studio"></Environment>
      <directionalLight
        position={[2, 5, 2]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <mesh position-y={-1.5} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
    </>
  );
};
