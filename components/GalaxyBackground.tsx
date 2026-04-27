'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Stars } from '@react-three/drei';
import { staticRandom } from '@/lib/random';
import { getStarTexture } from './SpaceEffects';

export function GalaxyBackground() {
  const starsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0002;
      starsRef.current.rotation.z += 0.0001;
    }
  });

  return (
    <group ref={starsRef}>
      <Stars 
        radius={100} 
        depth={50} 
        count={7000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1} 
      />
      
      {/* Additional custom stars for more realism/depth */}
      <CustomStars count={2000} />
    </group>
  );
}

function CustomStars({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const texture = useMemo(() => getStarTexture(), []);

  const particles = useMemo(() => {
    const random = staticRandom;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spherical distribution
      const r = 50 + random() * 150;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);

      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);

      // Star colors: white, blueish, reddish
      const type = random();
      let color = new THREE.Color(0xffffff);
      if (type < 0.1) color = new THREE.Color(0x9db2ff); // Blue
      else if (type < 0.2) color = new THREE.Color(0xffcc6f); // Yellowish
      else if (type < 0.25) color = new THREE.Color(0xffaead); // Reddish

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = random() * 2;
    }
    return { positions, colors, sizes };
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      // Subtle twinkling
      const time = state.clock.getElapsedTime();
      pointsRef.current.material.opacity = 0.5 + Math.sin(time * 0.5) * 0.5;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        map={texture}
      />
    </points>
  );
}
