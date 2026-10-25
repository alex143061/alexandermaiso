import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Astro = ({ isMobile, materialProps = {} }) => {
  const astro = useGLTF("./astro/scene.gltf");

  return (
    <primitive
      object={astro.scene}
      scale={isMobile ? 1.5 : 2.0}
      position={[0, isMobile ? -1.2 : -1.8, 0]}
      rotation={[-0.01, -0.5, -0.1]}
      flatShading
      metalness={0.2}
      roughness={0.8}
      {...materialProps}
    />
  );
};

const AstroCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const tabletQuery = window.matchMedia("(min-width: 769px) and (max-width: 1024px)");

    setIsMobile(mobileQuery.matches);
    setIsTablet(tabletQuery.matches);

    const handleMobileChange = (event) => setIsMobile(event.matches);
    const handleTabletChange = (event) => setIsTablet(event.matches);

    mobileQuery.addEventListener("change", handleMobileChange);
    tabletQuery.addEventListener("change", handleTabletChange);

    return () => {
      mobileQuery.removeEventListener("change", handleMobileChange);
      tabletQuery.removeEventListener("change", handleTabletChange);
    };
  }, []);

  return (
    <Canvas
      className="w-full h-full"
      frameloop="demand"
      shadows
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      camera={{
        position: isMobile ? [10, 4, 5] : isTablet ? [14, 5, 5] : [18, 5, 5],
        fov: isMobile ? 40 : isTablet ? 30 : 25,
      }}
      gl={{ preserveDrawingBuffer: true, antialias: false, powerPreference: "high-performance" }}
    >
      <Suspense fallback={<CanvasLoader/>}>
        {/* Balanced lighting for astronaut suit */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1.0} />
        <spotLight position={[15, 8, 5]} angle={0.4} penumbra={0.6} intensity={2.5} />
        <hemisphereLight intensity={0.5} groundColor="#111111" />
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.5}
          enableZoom={isMobile ? true : false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Astro isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default AstroCanvas;