'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export function JarvisBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 5000], [0, -500]);
  const y2 = useTransform(scrollY, [0, 5000], [0, -1000]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dataPoints] = useState(() => 
    [...Array(20)].map(() => 
      `${Math.random() > 0.5 ? 'SYSTEM_CHECK: OK' : 'DATA_INPUT: RECEIVED'} // 0x${Math.floor(Math.random()*10000).toString(16)}`
    )
  );
  const [clusters] = useState(() => 
    [...Array(8)].map(() => ({
      x: Math.random() * 100 + '%',
      y: Math.random() * 100 + '%',
      duration: 15 + Math.random() * 10
    }))
  );
  const [stars] = useState(() => 
    [...Array(50)].map(() => ({
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      size: Math.random() * 2 + 'px'
    }))
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#02040a]"
      style={{
        perspective: '1200px',
      }}
    >
      {/* Deep Space Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,100,255,0.08)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,255,255,0.04)_0%,transparent_50%)]" />
      
      {/* Moving Scanning Pulse */}
      <motion.div 
        animate={{ y: ['-100%', '200%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-x-0 h-[40vh] bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent z-10"
      />

      {/* Grid Systems with Depth */}
      <motion.div 
        style={{ y: y1, rotateX: 20 }}
        className="absolute inset-0 opacity-[0.04] origin-top"
      >
        <div className="absolute inset-x-0 inset-y-[-100%] " style={{ 
          backgroundImage: 'linear-gradient(rgba(0,255,255,0.1) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(0,255,255,0.1) 1.5px, transparent 1.5px)',
          backgroundSize: '120px 120px'
        }} />
      </motion.div>

      <motion.div 
        style={{ y: y2, rotateX: 45 }}
        className="absolute inset-0 opacity-[0.02] origin-center"
      >
        <div className="absolute inset-x-[-50%] inset-y-[-200%] " style={{ 
          backgroundImage: 'linear-gradient(rgba(0,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </motion.div>

      {/* HUD 1: Left Top Corner */}
      <motion.div 
        animate={{ 
          x: mousePos.x * 1.5,
          y: mousePos.y * 1.5,
          rotate: 0
        }}
        className="absolute left-[2%] top-[15%] w-[450px] h-[450px] opacity-[0.12] z-20"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="w-full h-full"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full text-cyan-400 fill-none stroke-current">
            <circle cx="100" cy="100" r="95" strokeWidth="0.5" strokeDasharray="5 15" />
            <circle cx="100" cy="100" r="85" strokeWidth="1" strokeDasharray="1 5" />
            <circle cx="100" cy="100" r="70" strokeWidth="0.1" />
            <path d="M100 5 L100 15 M195 100 L185 100 M100 195 L100 185 M5 100 L15 100" strokeWidth="2" />
            <motion.path 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 3 }}
              d="M100 5 L100 15" strokeWidth="4" 
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* HUD 2: Right Mid Section */}
      <motion.div 
        animate={{ 
          x: mousePos.x * -1,
          y: mousePos.y * -1,
        }}
        className="absolute right-[5%] top-[45%] w-[350px] h-[350px] opacity-[0.08] z-20"
      >
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="w-full h-full"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full text-blue-400 fill-none stroke-current">
            <path d="M20 100 A 80 80 0 0 1 180 100" strokeWidth="0.5" />
            <path d="M20 100 A 80 80 0 0 0 180 100" strokeWidth="0.5" strokeDasharray="2 2" />
            <rect x="98" y="10" width="4" height="20" fill="currentColor" opacity="0.5" />
            <circle cx="100" cy="100" r="40" strokeWidth="0.1" />
          </svg>
        </motion.div>
      </motion.div>

      {/* HUD 3: Bottom Left Data Feed */}
      <div className="absolute left-[10%] bottom-[15%] w-[300px] h-[100px] opacity-[0.1] z-20 font-mono text-[8px] text-cyan-500 overflow-hidden">
        <motion.div 
          animate={{ y: [0, -100] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {dataPoints.map((point, i) => (
            <div key={i} className="mb-1">
              {point}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Digital Floating Clusters */}
      {clusters.map((cluster, i) => (
        <motion.div
          key={`cluster-${i}`}
          initial={{ 
            x: cluster.x, 
            y: cluster.y,
            opacity: 0
          }}
          animate={{ 
            y: [null, '-=50px', '+=50px'],
            opacity: [0, 0.2, 0]
          }}
          transition={{ 
            duration: cluster.duration, 
            repeat: Infinity,
            delay: i * 2
          }}
          className="absolute z-10"
        >
          <div className="grid grid-cols-2 gap-1">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="w-1 h-1 bg-cyan-400/40" />
            ))}
          </div>
        </motion.div>
      ))}

      {/* Parallax Stars / Particles in Distance */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0"
      >
        {stars.map((star, i) => (
          <div
            key={`p-${i}`}
            className="absolute bg-white rounded-full opacity-[0.2]"
            style={{ 
              left: star.left, 
              top: star.top,
              width: star.size,
              height: star.size
            }}
          />
        ))}
      </motion.div>

      {/* Side Glowing Borders (Subtle Network) */}
      <div className="absolute inset-y-0 left-0 w-[40px] bg-gradient-to-r from-cyan-500/5 to-transparent border-l border-cyan-500/10" />
      <div className="absolute inset-y-0 right-0 w-[40px] bg-gradient-to-l from-blue-500/5 to-transparent border-r border-blue-500/10" />

      {/* Ambient Vignette & Finish */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
      <div className="absolute inset-0 backdrop-blur-[1px] pointer-events-none" />
    </div>
  );
}
