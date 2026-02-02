import { Environment, Float, OrbitControls } from "@react-three/drei";
import { Book } from "./Book";
import { useAtom } from "jotai"; 
import { pauseAtom } from "./UI"; 

// UPDATED: Accept 'width' as a prop alongside 'pages'
export const Experience = ({ pages, width }) => {
  const [paused] = useAtom(pauseAtom); 

  return (
    <>
      <Float
        rotation-x={-Math.PI / 4}
        floatIntensity={paused ? 0 : 1}
        speed={paused ? 0 : 2}
        rotationIntensity={paused ? 0 : 2}
      >
        {/* UPDATED: Pass the width prop to Book so it knows the correct size */}
        <Book pages={pages} width={width} />
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
