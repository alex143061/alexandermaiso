import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Ticofab = ({ isMobile }) => {
  const tico = useGLTF("./ajf-12_dvergr/model.glb");

  return (
    <primitive
      object={tico.scene}
      scale={isMobile ? 3.0 : 4.0}
      position={isMobile ? [0, -1.8, 0] : [0, -1.8, 0]}
      rotation={[-0.01, -0.5, -0.1]}
    />
  );
};

const TicofabCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);
    const handleMediaQueryChange = (event) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  return (
    <Canvas
      frameloop='demand'
      shadows
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [18, 5, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true, antialias: false, powerPreference: "high-performance" }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <ambientLight intensity={5.0} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2.0} />
        <hemisphereLight intensity={2.0} groundColor='white' />
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.5}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Ticofab isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default TicofabCanvas;
