import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";

// Components
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import Home from "./pages/Home"; 

// --- DATA CONFIGURATION ---
// This acts as your "database" for now. 
// Ensure the keys (grilltown, seabrill) match your folder names in /public/textures/
const restaurants = {
  grilltown: {
    name: "Grill Town",
    logo: "/images/grilltown.png",
    whatsapp: "971566368870",
    // Just the filenames, we will build the full path dynamically
    cover: "front.jpg",
    back: "back.jpg",
    // internal pages in order
    pages: ["page1.jpg", "page2.jpg", "page3.jpg"] 
  },
  seabrill: {
    name: "Seabrill",
    logo: "/images/seabrilllogo.png", 
    whatsapp: "971501111111", 
    cover: "front.jpg",
    back: "back.jpg",
    pages: ["page1.jpg", "page2.jpg", "page3.jpg"]
  }
};

const MenuExperience = () => {
  const { slug } = useParams(); 
  
  // 1. Get specific data, fallback to grilltown if slug is wrong
  const data = restaurants[slug] || restaurants["grilltown"];
  // Used to build paths (e.g., /textures/seabrill/)
  const folder = slug && restaurants[slug] ? slug : "grilltown"; 

  // 2. Build the Page Pairs (Front/Back) for the Book
  const bookPages = useMemo(() => {
    const path = `/textures/${folder}`;
    const pagesList = [];

    // --- SHEET 1: Cover & First Page ---
    pagesList.push({
      front: `${path}/${data.cover}`,
      back: `${path}/${data.pages[0]}`
    });

    // --- MIDDLE SHEETS ---
    // This loops through remaining pages creating pairs
    for (let i = 1; i < data.pages.length - 1; i += 2) {
      pagesList.push({
        front: `${path}/${data.pages[i]}`,
        back: `${path}/${data.pages[i + 1]}`
      });
    }

    // --- LAST SHEET: Last Page & Back Cover ---
    // Check if we have an odd page left over to pair with the back cover
    const lastContentPage = data.pages[data.pages.length - 1];
    // Avoid re-adding the last page if it was already included in the loop above
    // (Simple logic: just pair the very last content item with the back cover)
    
    // Note: For your specific 3-page setup (Page1, Page2, Page3), 
    // The loop above handles Page2 & Page3. 
    // Wait, strictly: 
    // Sheet 1: Cover / Page 1
    // Sheet 2: Page 2 / Page 3
    // Sheet 3: ... Back Cover?
    
    // Let's force the Back Cover to appear as the final "back" of the last sheet
    // If you add more pages, you might want to adjust this logic.
    // For now, let's append a final sheet that is strictly [Last Page] -> [Back Cover]
    // If the loop already covered all pages, we add a specific Back Cover sheet.
    
    // SIMPLIFIED LOGIC FOR YOUR CURRENT FILES:
    if(data.pages.length > 1) {
       // If we handled up to Page 3 in the loop, we might need one last sheet for the Back Cover
       // Actually, let's just push a dedicated Back Cover sheet for safety
       pagesList.push({
         front: `${path}/${data.pages[data.pages.length - 1]}`, 
         back: `${path}/${data.back}`
       });
    }

    return pagesList;
  }, [folder, data]);

  return (
    <>
      {/* Pass Dynamic Data to UI */}
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
            {/* Pass Dynamic Pages to Experience */}
            <Experience pages={bookPages} />
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
