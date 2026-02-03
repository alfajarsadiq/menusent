import { Environment } from "@react-three/drei";
import { Book } from "./Book";
import { useAtom } from "jotai"; 
import { pauseAtom, pageAtom } from "./UI"; 
import { useFrame } from "@react-three/fiber"; 
import { useRef } from "react"; 
import { easing } from "maath"; 

export const Experience = ({ pages, width }) => {
  const [paused] = useAtom(pauseAtom); 
  const [page] = useAtom(pageAtom); 
  const groupRef = useRef(); 

  // --- RESPONSIVE SCALING LOGIC ---
  const isMobile = window.innerWidth < 800; // Check if device is mobile
  const isWideMenu = width > 1; // Check if menu is "Wide" (like Grill Town)

  // Default scale is 1.15
  let activeScale = 1.15; 

  // If we are on Mobile AND it's a Wide Menu, reduce scale to fit screen
  if (isMobile && isWideMenu) {
    activeScale = 0.65; // Smaller scale for wide menus on mobile
  } else if (isMobile && !isWideMenu) {
    activeScale = 1.0; // Slightly adjust slim menus if needed (optional)
  }

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    let targetX = 0;

    // --- CENTERING LOGIC (Preserved) ---
    if (page === 0) {
      targetX = -width / 2; // Center Front Cover
    } else if (page === pages.length) {
      targetX = width / 2;  // Center Back Cover
    } else {
      targetX = 0;          // Center Spine
    }

    easing.damp(groupRef.current.position, "x", targetX, 0.5, delta);
  });

  return (
    <>
      <group 
        ref={groupRef} 
        rotation-x={0} 
        position-y={0} 
        // Apply the dynamic scale here
        scale={activeScale} 
      >
        <Book pages={pages} width={width} />
      </group>

      <Environment preset="studio"></Environment>
      <directionalLight
        position={[2, 5, 2]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
    </>
  );
};
