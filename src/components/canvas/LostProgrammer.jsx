import React, { Suspense, useEffect, useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
  DepthOfField,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

import CanvasLoader from "../Loader";

/* ------------------------------------------------------------------ *
 *  All effect strengths live here. Tweak these numbers to taste.       *
 *  Press the toggle key (default "G") to turn the whole stack on/off. *
 * ------------------------------------------------------------------ */
export const FX = {
  enabled: true,
  toggleKey: "KeyG",

  bloom: {
    intensity: 0.35,
    luminanceThreshold: 0.75,
    luminanceSmoothing: 0.2,
  },
  chromaticAberration: {
    offset: [0.0012, 0.0012],
  },
  noise: {
    opacity: 0.05,
  },
  vignette: {
    offset: 0.35,
    darkness: 0.5,
  },
  depthOfField: {
    focusDistance: 0.02,
    focalLength: 0.04,
    bokehScale: 1.6,
  },
  matrix: {
    count: 26,
    speed: 0.45,
    size: 0.16,
    opacity: 0.8,
  },
};

const LostProgrammer = ({ isMobile }) => {
  const model = useGLTF("./lost_programmer/scene.gltf");

  return (
    <primitive
      object={model.scene}
      scale={isMobile ? 0.6 : 0.6}
      position={[-0.83, -0.99, -0.81]}
      rotation={[0, Math.PI / 2, 0]}
    />
  );
};

/* ------------------------------------------------------------------ *
 *  Floating glowing 0s and 1s ("falling code").                       *
 * ------------------------------------------------------------------ */
const FloatingCode = () => {
  const group = useRef();
  const sprites = useMemo(() => {
    const arr = [];
    for (let i = 0; i < FX.matrix.count; i++) {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      const char = Math.random() > 0.5 ? "0" : "1";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 46px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 12;
      ctx.fillText(char, 32, 32);

      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;

      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
        opacity: FX.matrix.opacity,
      });

      const sprite = new THREE.Sprite(mat);
      sprite.scale.setScalar(FX.matrix.size);
      sprite.position.set(
        (Math.random() - 0.5) * 4.2,
        Math.random() * 3.5 - 0.5,
        (Math.random() - 0.5) * 3.2
      );
      sprite.userData = {
        speed: 0.35 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
      };
      arr.push(sprite);
    }
    return arr;
  }, []);

  useEffect(() => {
    const g = group.current;
    sprites.forEach((s) => g.add(s));
    return () => sprites.forEach((s) => g.remove(s));
  }, [sprites]);

  useFrame((state, delta) => {
    sprites.forEach((s) => {
      s.position.y -= FX.matrix.speed * s.userData.speed * delta;
      if (s.position.y < -2.2) {
        s.position.y = 2.8;
        s.position.x = (Math.random() - 0.5) * 4.2;
        s.position.z = (Math.random() - 0.5) * 3.2;
      }
      s.material.opacity =
        FX.matrix.opacity *
        (0.55 + 0.45 * Math.sin(state.clock.elapsedTime * 1.6 + s.userData.phase));
    });
  });

  return <group ref={group} />;
};

/* ------------------------------------------------------------------ *
 *  Post-processing stack.                                             *
 * ------------------------------------------------------------------ */
const Effects = ({ enabled }) => {
  if (!enabled) return null;
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={FX.bloom.intensity}
        luminanceThreshold={FX.bloom.luminanceThreshold}
        luminanceSmoothing={FX.bloom.luminanceSmoothing}
      />
      <ChromaticAberration
        offset={new THREE.Vector2(
          FX.chromaticAberration.offset[0],
          FX.chromaticAberration.offset[1]
        )}
      />
      <Noise opacity={FX.noise.opacity} blendFunction={BlendFunction.OVERLAY} />
      <Vignette offset={FX.vignette.offset} darkness={FX.vignette.darkness} />
    </EffectComposer>
  );
};


const LostProgrammerCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [effectsOn, setEffectsOn] = useState(FX.enabled);

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

  useEffect(() => {
    const handler = (e) => {
      if (e.code === FX.toggleKey) setEffectsOn((v) => !v);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <Canvas
      className="w-full h-full"
      frameloop="demand"
      shadows
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      camera={{
        position: isMobile ? [0, 1.5, 5] : isTablet ? [0, 2, 5] : [0, 2.5, 6],
        fov: isMobile ? 50 : isTablet ? 42 : 40,
      }}
      gl={{ alpha: true, preserveDrawingBuffer: true, antialias: false, powerPreference: "high-performance" }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <spotLight position={[15, 8, 5]} angle={0.4} penumbra={0.6} intensity={2.5} />
        <hemisphereLight intensity={0.5} groundColor="#111111" />
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.5}
          enableZoom={isMobile ? true : false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
        <LostProgrammer isMobile={isMobile} />
        {effectsOn && <FloatingCode />}
      </Suspense>
      <Effects enabled={effectsOn} />
      <Preload all />
    </Canvas>
  );
};

export default LostProgrammerCanvas;