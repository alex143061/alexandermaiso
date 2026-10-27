import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Desk = ({ isMobile }) => {
  const desk = useGLTF("./programmer_desk_setup__stylized_3d_room/scene.gltf");

  return (
    <primitive
      object={desk.scene}
      scale={isMobile ? 0.32 : 0.46}
      position={[0, isMobile ? -1.2 : -1.6, 0]}
      rotation={[0, Math.PI, 0]}
    />
  );
};

const DeskCanvas = () => {
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
      dpr={isMobile ? [1, 1.5] : [1, 1.5]}
      camera={{
        position: isMobile ? [0, 1.5, 5] : isTablet ? [0, 2, 5] : [0, 2.5, 6],
        fov: isMobile ? 50 : isTablet ? 42 : 40,
      }}
      gl={{ preserveDrawingBuffer: false, antialias: false, powerPreference: "low-power", premultipliedAlpha: false }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.0} />
        <spotLight position={[15, 8, 5]} angle={0.4} penumbra={0.6} intensity={2.5} />
        <hemisphereLight intensity={0.5} groundColor="#111111" />
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.5}
          enableZoom={isMobile ? true : false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
        <Desk isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default DeskCanvas;
