'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Cloud } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { SpiralGalaxy } from './SpiralGalaxy';
import { GalaxyBackground } from './GalaxyBackground';
import { motion } from 'motion/react';
import { Rocket, Map, Info, Star } from 'lucide-react';

function CameraJourney() {
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Subtle breathing/drifting camera
    state.camera.position.x = 10 + Math.sin(time * 0.05) * 2;
    state.camera.position.z = 10 + Math.cos(time * 0.05) * 2;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

export function GalaxyJourney() {
  return (
    <div className="relative w-full h-screen bg-[#000000] overflow-hidden">
      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <Rocket className="text-blue-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-[0.3em] uppercase text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Galaxy Explorer</h1>
            <p className="text-[10px] text-blue-400/80 uppercase tracking-[0.5em] font-mono">Deep Space Navigation v2.0</p>
          </div>
        </motion.div>

        <div className="flex justify-between items-end">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl max-w-xs pointer-events-auto border border-white/10 shadow-2xl"
          >
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              Sgr A* Region
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              You are currently orbiting the supermassive black hole at the center of the Milky Way.
              Observe the intense thermal emission and high-density star clusters forming along the spiral arms.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col gap-3 pointer-events-auto"
          >
            <button className="bg-white/5 hover:bg-white/10 text-white p-4 rounded-xl border border-white/10 transition-all hover:scale-110 active:scale-95 shadow-lg backdrop-blur-md">
              <Map size={20} />
            </button>
            <button className="bg-white/5 hover:bg-white/10 text-white p-4 rounded-xl border border-white/10 transition-all hover:scale-110 active:scale-95 shadow-lg backdrop-blur-md">
              <Info size={20} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* 3D Scene */}
      <Canvas 
        className="w-full h-full"
        gl={{ 
          antialias: false, // Post-processing handles AA or we use cheap AA
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[12, 6, 12]} fov={55} />
          <OrbitControls 
            enablePan={false} 
            maxDistance={30} 
            minDistance={4} 
            autoRotate={false}
            enableDamping
            dampingFactor={0.05}
          />
          
          <ambientLight intensity={0.1} />
          <pointLight position={[0, 0, 0]} intensity={1.5} color="#ffccaa" distance={20} decay={2} />
          
          <group scale={1.8}>
            <SpiralGalaxy />
          </group>

          <GalaxyBackground />
          
          <group position={[10, -5, -10]}>
            <Cloud opacity={0.05} speed={0.4} width={20} depth={1} segments={10} color="#3355ff" />
          </group>
          
          <group position={[-12, 8, 8]}>
            <Cloud opacity={0.03} speed={0.2} width={25} depth={1} segments={8} color="#ff3388" />
          </group>

          <EffectComposer disableNormalPass>
            <Bloom 
              luminanceThreshold={0.2} 
              mipmapBlur 
              intensity={1.2} 
              radius={0.4}
            />
          </EffectComposer>

          <CameraJourney />
        </Suspense>
      </Canvas>
    </div>
  );
}
