import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Desk = () => {
  const desk = useGLTF("./programmer_desk_setup__stylized_3d_room/scene.gltf");

  return (
    <primitive
      object={desk.scene}
      scale={0.5}
      position={[0, -2, 0]}
      rotation={[0, Math.PI, 0]}
    />
  );
};

const DeskCanvas = () => {
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
      frameloop="demand"
      shadows
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 2.5, 6], fov: 40 }}
      gl={{ preserveDrawingBuffer: true, antialias: false, powerPreference: "high-performance" }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.0} />
        <spotLight position={[15, 8, 5]} angle={0.4} penumbra={0.6} intensity={2.5} />
        <hemisphereLight intensity={0.5} groundColor="#111111" />
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.5}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
        <Desk />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default DeskCanvas;
