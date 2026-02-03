import { Environment, OrbitControls } from "@react-three/drei";
import { Book } from "./Book";
import { useAtom } from "jotai"; 
import { pauseAtom } from "./UI"; 

export const Experience = ({ pages, width }) => {
  const [paused] = useAtom(pauseAtom); 

  return (
    <>
      {/* REPLACED Float WITH group TO STOP FLYING ANIMATION */}
      {/* rotation-x is kept so the book stays tilted at the correct viewing angle */}
      <group rotation-x={-Math.PI / 4}>
        <Book pages={pages} width={width} />
      </group>

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
