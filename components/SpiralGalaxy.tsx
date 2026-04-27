'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { staticRandom } from '@/lib/random';

import { getStarTexture } from './SpaceEffects';

const GALAXY_PARAMS = {
  count: 80000,
  size: 0.02,
  radius: 6,
  branches: 4,
  spin: 1.5,
  randomness: 0.15,
  randomnessPower: 3,
  insideColor: '#ff9d4d',
  outsideColor: '#2b52ff',
};

export function SpiralGalaxy() {
  const pointsRef = useRef<THREE.Points>(null);
  const texture = useMemo(() => getStarTexture(), []);

  const particles = useMemo(() => {
    const random = staticRandom;
    const positions = new Float32Array(GALAXY_PARAMS.count * 3);
    const colors = new Float32Array(GALAXY_PARAMS.count * 3);
    const scales = new Float32Array(GALAXY_PARAMS.count);

    const colorInside = new THREE.Color(GALAXY_PARAMS.insideColor);
    const colorOutside = new THREE.Color(GALAXY_PARAMS.outsideColor);

    for (let i = 0; i < GALAXY_PARAMS.count; i++) {
      const i3 = i * 3;

      // Position
      const radius = random() * GALAXY_PARAMS.radius;
      const spinAngle = radius * GALAXY_PARAMS.spin;
      const branchAngle = ((i % GALAXY_PARAMS.branches) / GALAXY_PARAMS.branches) * Math.PI * 2;

      const randomX = Math.pow(random(), GALAXY_PARAMS.randomnessPower) * (random() < 0.5 ? 1 : -1) * GALAXY_PARAMS.randomness * radius;
      const randomY = Math.pow(random(), GALAXY_PARAMS.randomnessPower) * (random() < 0.5 ? 1 : -1) * GALAXY_PARAMS.randomness * radius;
      const randomZ = Math.pow(random(), GALAXY_PARAMS.randomnessPower) * (random() < 0.5 ? 1 : -1) * GALAXY_PARAMS.randomness * radius;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Color
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / GALAXY_PARAMS.radius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
      
      // Scales
      scales[i] = random();
    }

    return { positions, colors, scales };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
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
        size={GALAXY_PARAMS.size}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors
        blending={THREE.AdditiveBlending}
        transparent
        opacity={0.8}
        map={texture}
      />
    </points>
  );
}
