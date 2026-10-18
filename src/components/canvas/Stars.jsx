import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

const Stars = (props) => {
  const ref = useRef();
  const isLowPower =
    typeof navigator !== "undefined" &&
    typeof navigator.deviceMemory === "number" &&
    navigator.deviceMemory <= 4;
  const [sphere] = useState(() =>
    isLowPower
      ? random.inSphere(new Float32Array(2500), { radius: 1.2 })
      : random.inSphere(new Float32Array(5000), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color='#f272c8'
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = ({ fixed = false }) => {
  return (
    <div
      className={`w-full h-auto inset-0 z-[-1] ${
        fixed ? "fixed pointer-events-none" : "absolute"
      }`}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.5]}
        frameloop="always"
        gl={{ antialias: false, powerPreference: "low-power", alpha: true }}
      >
        <Suspense fallback={null}>
          <Stars />
        </Suspense>

        <Preload all />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
