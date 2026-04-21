'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface JellyfishProps {
  color: string;
  size: number;
  left: string;
  top: string;
  delay: number;
  duration: number;
}

const Jellyfish = ({ color, size, left, top, delay, duration }: JellyfishProps) => (
  <motion.div
    style={{
      position: 'absolute',
      left,
      top,
      width: size,
      height: size * 0.8,
      background: `rgba(255, 255, 255, 0.05)`,
      backdropFilter: 'blur(10px)',
      border: `1px solid ${color}44`,
      borderRadius: '50% 50% 40% 40%',
      boxShadow: `0 0 30px ${color}44, inset 0 0 15px ${color}33`,
      zIndex: 5,
      pointerEvents: 'none',
    }}
    animate={{
      y: [0, -40, 0],
      x: [0, 15, -15, 0],
      opacity: [0.6, 1, 0.6],
      scale: [1, 1.05, 0.95, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    {/* Inner glow */}
    <div style={{
      position: 'absolute',
      top: '20%',
      left: '20%',
      right: '20%',
      bottom: '10%',
      background: `radial-gradient(circle, ${color}88, transparent 80%)`,
      filter: 'blur(5px)',
      borderRadius: '50%',
    }} />

    {/* Tentacles */}
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        style={{
          position: 'absolute',
          bottom: '-40%',
          left: `${15 + i * 14}%`,
          width: '1px',
          height: '100%',
          background: `linear-gradient(to bottom, ${color}88, transparent)`,
          filter: 'blur(1px)',
        }}
        animate={{
          height: ['100%', '160%', '100%'],
          opacity: [0.4, 0.8, 0.4],
          skewX: [0, 10, -10, 0],
        }}
        transition={{
          duration: duration * 0.7,
          delay: delay + i * 0.15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    ))}
  </motion.div>
);

export function JellyfishLights() {
  const [bubbles, setBubbles] = useState<any[]>([]);

  useEffect(() => {
    // Using a micro-timeout to avoid "synchronous setState in effect" lint error
    const timeout = setTimeout(() => {
      const newBubbles = [...Array(20)].map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        width: Math.random() * 6 + 2,
        height: Math.random() * 6 + 2,
        xDist: Math.random() * 40 - 20,
        duration: 8 + Math.random() * 8,
        delay: Math.random() * 10
      }));
      setBubbles(newBubbles);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  if (bubbles.length === 0) return null;

  const creatures = [
    { color: '#22d3ee', size: 45, left: '10%', top: '10px', delay: 0, duration: 10 },
    { color: '#c084fc', size: 35, left: '25%', top: '30px', delay: 2, duration: 14 },
    { color: '#818cf8', size: 55, left: '45%', top: '5px', delay: 4, duration: 16 },
    { color: '#22d3ee', size: 40, left: '65%', top: '25px', delay: 1, duration: 12 },
    { color: '#c084fc', size: 50, left: '85%', top: '15px', delay: 3, duration: 18 },
  ];

  return (
    <div className="absolute top-0 left-0 w-full h-[300px] pointer-events-none overflow-hidden z-10">
      {creatures.map((c, i) => (
        <Jellyfish key={i} {...c} />
      ))}
      
      {/* Light bubbles */}
      {bubbles.map((b) => (
        <motion.div
          key={`b-${b.id}`}
          style={{
            position: 'absolute',
            left: b.left,
            bottom: `-20px`,
            width: `${b.width}px`,
            height: `${b.height}px`,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '0.5px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            filter: 'blur(0.5px)',
          }}
          animate={{
            y: [0, -400],
            x: [0, b.xDist],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}
