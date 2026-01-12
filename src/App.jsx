import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// This is your 3D Menu Experience moved into its own component
const GrillTownMenu = () => {
  return (
    <>
      <UI />
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
            <Experience />
          </Suspense>
        </group>
      </Canvas>
    </>
  );
};

// This is the blank page for the root domain (menusent.com)
const Home = () => {
  return <div style={{ width: "100vw", height: "100vh", background: "black" }}></div>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* URL: menusent.com -> Shows Blank Page */}
        <Route path="/" element={<Home />} />
        
        {/* URL: menusent.com/grilltown -> Shows 3D Menu */}
        <Route path="/grilltown" element={<GrillTownMenu />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;