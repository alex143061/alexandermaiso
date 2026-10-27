import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Ticofab = ({ isMobile }) => {
  const tico = useGLTF("./ajf-12_dvergr/model.glb");

  return (
    <primitive
      object={tico.scene}
      scale={isMobile ? 2.5 : 4.0}
      position={isMobile ? [0, -1.8, 0] : [0, -1.8, 0]}
      rotation={[-0.01, -0.5, -0.1]}
    />
  );
};

const TicofabCanvas = () => {
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
      frameloop='demand'
      shadows
      dpr={isMobile ? [1, 1.5] : [1, 1.5]}
      camera={{
        position: isMobile ? [10, 4, 5] : isTablet ? [14, 5, 5] : [18, 5, 5],
        fov: isMobile ? 40 : isTablet ? 30 : 25,
      }}
      gl={{ preserveDrawingBuffer: false, antialias: false, powerPreference: "low-power", premultipliedAlpha: false }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <ambientLight intensity={5.0} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2.0} />
        <hemisphereLight intensity={2.0} groundColor='white' />
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.5}
          enableZoom={isMobile ? true : false}
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
