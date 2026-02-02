import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";

// Components
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import Home from "./pages/Home"; 

// --- DATA CONFIGURATION ---
const restaurants = {
  grilltown: {
    name: "Grill Town",
    logo: "/images/grilltown.png",
    whatsapp: "971566368870",
    cover: "front.jpg",
    back: "back.jpg",
    pages: ["page1.jpg", "page2.jpg", "page3.jpg"],
    width: 1.28 // Standard Width
  },
  seabrill: {
    name: "Seabrill",
    logo: "/images/seabrilllogo.png", 
    whatsapp: "971501111111", 
    cover: "front.jpg",
    back: "back.jpg",
    pages: ["page1.jpg", "page2.jpg", "page3.jpg"],
    width: 1.28 // Standard Width
  },
  spiceroutes: {
    name: "The Spice Routes",
    logo: "/images/spicerouteslogo.png", 
    whatsapp: "7050534343", 
    cover: "front.jpg",
    back: "back.jpg",
    pages: ["page1.jpg", "page2.jpg", "page3.jpg", "page4.jpg"], // 4 Pages
    width: 0.765 // Calculated: 1.71 * (917 / 2048)
  }
};

const MenuExperience = () => {
  const { slug } = useParams(); 
  
  // 1. Get specific data, fallback to grilltown
  const data = restaurants[slug] || restaurants["grilltown"];
  const folder = slug && restaurants[slug] ? slug : "grilltown"; 

  // 2. Build the Page Pairs (Front/Back)
  const bookPages = useMemo(() => {
    const path = `/textures/${folder}`;
    
    // Create a flat list of all faces in order: [Cover, P1, P2, P3... Back]
    const allFaces = [
      data.cover, 
      ...data.pages, 
      data.back
    ];

    const pagesList = [];

    // Loop through the faces in pairs (0&1, 2&3, etc.)
    for (let i = 0; i < allFaces.length; i += 2) {
      pagesList.push({
        front: `${path}/${allFaces[i]}`,
        // If there is no "back" partner (odd number of faces), repeat the last one or leave blank
        back: `${path}/${allFaces[i + 1] || allFaces[i]}`
      });
    }

    return pagesList;
  }, [folder, data]);

  return (
    <>
      <UI logo={data.logo} whatsapp={data.whatsapp} pages={bookPages} />
      
      <Loader />
      
      <Canvas
        shadows
        camera={{
          position: [-0.5, 1, window.innerWidth > 800 ? 3.3 : 9],
          fov: 45,
        }}
      >
        <group position-x={0} position-y={0}>
          <Suspense fallback={null}>
            {/* UPDATED: Pass the specific width to Experience */}
            <Experience pages={bookPages} width={data.width} />
          </Suspense>
        </group>
      </Canvas>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:slug" element={<MenuExperience />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
