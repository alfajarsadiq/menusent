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
    width: 1.28
  },
  seabrill: {
    name: "Seabrill",
    logo: "/images/seabrilllogo.png", 
    whatsapp: "971501111111", 
    cover: "front.jpg",
    back: "back.jpg",
    pages: ["page1.jpg", "page2.jpg", "page3.jpg"],
    width: 1.28
  },
  spiceroutes: {
    name: "The Spice Routes",
    logo: "/images/spicerouteslogo.png", 
    whatsapp: "7050534343", 
    cover: "front.jpg",
    back: "back.jpg",
    pages: ["page1.jpg", "page2.jpg", "page3.jpg", "page4.jpg"], 
    width: 0.765 
  }
};

const MenuExperience = () => {
  const { slug } = useParams(); 
  
  const data = restaurants[slug] || restaurants["grilltown"];
  const folder = slug && restaurants[slug] ? slug : "grilltown"; 

  const bookPages = useMemo(() => {
    const path = `/textures/${folder}`;
    const allFaces = [data.cover, ...data.pages, data.back];
    const pagesList = [];

    for (let i = 0; i < allFaces.length; i += 2) {
      pagesList.push({
        front: `${path}/${allFaces[i]}`,
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
          // UPDATED: 
          // 1. Position X=0 (Center horizontally)
          // 2. Position Y=0 (Center vertically - looking straight at the book)
          // 3. Position Z is adjusted for Mobile/Desktop zoom
          position: [0, 0, window.innerWidth > 800 ? 3.3 : 4.5],
          fov: 45,
        }}
      >
        <group position-x={0} position-y={0}>
          <Suspense fallback={null}>
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
