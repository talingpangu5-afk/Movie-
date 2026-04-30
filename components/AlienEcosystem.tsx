'use client';

import React, { useMemo } from 'react';
import { motion } from 'motion/react';

export function AlienEcosystem() {
  // Stable pseudo-random configurations for elements to avoid 'pure component' lint errors
  const floatingRocks = useMemo(() => [
    { id: 1, side: 'left', top: '10%', left: '-5%', size: 280, duration: 25, xAmp: 10, yAmp: 20, rotate: -5 },
    { id: 2, side: 'left', top: '40%', left: '2%', size: 220, duration: 20, xAmp: 15, yAmp: 15, rotate: 10 },
    { id: 3, side: 'left', top: '70%', left: '-8%', size: 300, duration: 30, xAmp: 20, yAmp: 25, rotate: -15 },
    { id: 4, side: 'right', top: '15%', right: '-5%', size: 260, duration: 22, xAmp: 12, yAmp: 30, rotate: 8 },
    { id: 5, side: 'right', top: '50%', right: '3%', size: 240, duration: 28, xAmp: 18, yAmp: 20, rotate: -12 },
    { id: 6, side: 'right', top: '80%', right: '-10%', size: 320, duration: 35, xAmp: 25, yAmp: 40, rotate: 5 },
  ], []);

  const energyVeins = useMemo(() => [
    { id: 1, side: 'left', d: "M-50,800 Q150,500 0,-100", color: "#22d3ee", duration: 15 },
    { id: 2, side: 'left', d: "M0,900 Q250,400 -50,100", color: "#8b5cf6", duration: 18 },
    { id: 3, side: 'right', d: "M1000,800 Q850,500 1100,-100", color: "#d946ef", duration: 14 },
    { id: 4, side: 'right', d: "M1050,900 Q750,400 1150,100", color: "#0ea5e9", duration: 20 },
  ], []);

  const soulParticles = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: (i * 27.7) % 100,
      y: (i * 13.1) % 100,
      size: 1.5 + (i % 3),
      duration: 18 + (i % 12),
      delay: (i % 7) * 4,
      color: i % 3 === 0 ? '#22d3ee' : i % 3 === 1 ? '#d946ef' : '#8b5cf6'
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-[-1] bg-[#020617]">
      {/* DEEP CINEMATIC BASE */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.05)_0%,transparent_80%)]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />

      {/* VOLUMETRIC ATMOSPHERE */}
      <motion.div 
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-50%] bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.2),transparent_70%)] blur-[120px]"
      />

      {/* LEFT ECOSYSTEM - Bioluminescent Jungle */}
      <div className="absolute left-0 top-0 bottom-0 w-1/2 h-full">
        {/* Distant Mountain Silhouettes */}
        <div className="absolute top-0 bottom-0 left-0 w-full opacity-20 blur-[4px]">
           <svg viewBox="0 0 1000 1000" className="w-full h-full fill-slate-950">
              <path d="M-100,1000 L150,200 L400,600 L650,100 L900,1000 Z" />
           </svg>
        </div>

        {/* Bioluminescent "Rivers" / Energy Streams */}
        <svg className="absolute inset-0 w-full h-full opacity-40">
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          {energyVeins.filter(v => v.side === 'left').map(vein => (
            <motion.path 
              key={vein.id}
              d={vein.d}
              stroke={vein.color}
              strokeWidth="2"
              fill="none"
              strokeDasharray="10 30"
              animate={{ strokeDashoffset: [-200, 200], opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: vein.duration, repeat: Infinity, ease: "linear" }}
              filter="url(#glow)"
            />
          ))}
        </svg>

        {/* Floating Habitats */}
        {floatingRocks.filter(r => r.side === 'left').map(rock => (
          <motion.div
            key={rock.id}
            animate={{ 
              x: [-rock.xAmp, rock.xAmp, -rock.xAmp],
              y: [-rock.yAmp, rock.yAmp, -rock.yAmp],
              rotate: [rock.rotate, rock.rotate + 5, rock.rotate]
            }}
            transition={{ duration: rock.duration, repeat: Infinity, ease: "easeInOut" }}
            className="absolute shadow-[0_0_100px_rgba(34,211,238,0.1)] rounded-[45%_55%_35%_65%] overflow-visible"
            style={{ 
              top: rock.top, 
              left: rock.left, 
              width: rock.size, 
              height: rock.size * 0.8,
              background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(2,6,23,0.98))',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            {/* House Structure */}
            <div className="absolute top-[-10%] left-1/3 w-16 h-20 bg-cyan-950/80 rounded-t-full border border-cyan-400/30 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.3)]">
               <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-cyan-400 rounded-full blur-[2px] animate-pulse" />
               <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-violet-400 rounded-full blur-[1.5px] animate-pulse delay-150" />
            </div>

            {/* Glowing Moss Layer */}
            <div className="absolute inset-2 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.15),transparent_60%)]" />
            
            {/* Hanging Bio-Plants */}
            <div className="absolute bottom-0 left-10 w-[1px] h-40 bg-gradient-to-b from-cyan-400/60 via-cyan-400/20 to-transparent" />
            <div className="absolute bottom-[-10px] left-8 w-2 h-2 bg-cyan-400 rounded-full blur-[2px] animate-bounce" />
            
            <div className="absolute bottom-0 right-16 w-[1px] h-24 bg-gradient-to-b from-violet-400/60 via-violet-400/20 to-transparent" />
            <div className="absolute bottom-[-10px] right-15 w-2 h-2 bg-violet-400 rounded-full blur-[2px] animate-bounce delay-300" />
          </motion.div>
        ))}
      </div>

      {/* RIGHT ECOSYSTEM - Suspended Terrain & Violets */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 h-full">
         {/* Distant Mountain Silhouettes */}
         <div className="absolute top-0 bottom-0 right-0 w-full opacity-15 blur-[6px]">
           <svg viewBox="0 0 1000 1000" className="w-full h-full fill-indigo-950 scale-x-[-1]">
              <path d="M-100,1000 L200,100 L450,500 L700,50 L1100,1000 Z" />
           </svg>
        </div>

        {/* Floating Spire Habitats */}
        {floatingRocks.filter(r => r.side === 'right').map(rock => (
          <motion.div
            key={rock.id}
            animate={{ 
              x: [rock.xAmp, -rock.xAmp, rock.xAmp],
              y: [rock.yAmp, -rock.yAmp, rock.yAmp],
              rotate: [rock.rotate, rock.rotate - 5, rock.rotate]
            }}
            transition={{ duration: rock.duration, repeat: Infinity, ease: "easeInOut" }}
            className="absolute shadow-[0_0_100px_rgba(217,70,239,0.1)] rounded-[55%_45%_65%_35%] overflow-visible"
            style={{ 
              top: rock.top, 
              right: rock.right, 
              width: rock.size, 
              height: rock.size * 0.9,
              background: 'linear-gradient(225deg, rgba(30,20,50,0.95), rgba(5,5,20,0.98))',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
             <div className="absolute top-[-15%] right-1/4 w-14 h-24 bg-violet-950/80 rounded-t-full border border-violet-400/30 backdrop-blur-md shadow-[0_0_20px_rgba(217,70,239,0.3)]">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-4 h-4 bg-violet-300 rounded-full blur-[3px] animate-pulse" />
             </div>

             {/* Pink/Magenta Bioluminescence */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(217,70,239,0.2),transparent_70%)] animate-pulse" />
             
             {/* Energy Tendrils */}
             <div className="absolute bottom-0 right-12 w-[2px] h-56 bg-gradient-to-b from-violet-500/50 to-transparent" />
             <motion.div 
               animate={{ y: [0, 20, 0], opacity: [0.4, 1, 0.4] }}
               transition={{ duration: 3, repeat: Infinity }}
               className="absolute bottom-[-10px] right-11 w-3 h-3 bg-violet-400 rounded-full blur-[3px]"
             />
          </motion.div>
        ))}

        {/* Ambient Neon Flora (Glowing orbs in distance) */}
        {[...Array(12)].map((_, i) => (
          <motion.div 
            key={`flora-${i}`}
            animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 5 + (i % 4), repeat: Infinity, delay: i * 0.3 }}
            className="absolute rounded-full blur-[50px]"
            style={{
              right: `${5 + (i * 17) % 45}%`,
              bottom: `${10 + (i * 23) % 80}%`,
              width: (i % 2 === 0 ? 120 : 180) + 'px',
              height: (i % 2 === 0 ? 120 : 180) + 'px',
              background: i % 3 === 0 ? 'rgba(34,211,238,0.25)' : i % 3 === 1 ? 'rgba(217,70,239,0.25)' : 'rgba(139,92,246,0.25)'
            }}
          />
        ))}
      </div>

      {/* FLYING WOODSPRITE-LIKE PARTICLES */}
      {soulParticles.map(p => (
        <motion.div
           key={p.id}
           initial={{ x: p.x + '%', y: p.y + '%', opacity: 0 }}
           animate={{ 
             y: ['-5%', '105%'],
             opacity: [0, 0.8, 0],
             scale: [0.3, 1.2, 0.3],
             x: [p.x + '%', (p.x + 5) + '%', p.x + '%']
           }}
           transition={{ 
             duration: p.duration, 
             repeat: Infinity, 
             delay: p.delay,
             ease: "easeInOut"
           }}
           className="absolute rounded-full blur-[1px] z-10"
           style={{ 
             width: p.size, 
             height: p.size, 
             backgroundColor: p.color,
             boxShadow: `0 0 12px ${p.color}`
           }}
        />
      ))}

      {/* FLYING IKRRAN/CREATURE SILHOUETTES */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`creature-${i}`}
          initial={{ x: -200, y: 100 + i * 150 }}
          animate={{ 
            x: '110vw',
            y: [100 + i * 150, 150 + i * 150, 100 + i * 150] 
          }}
          transition={{ 
            x: { duration: 50 + i * 15, repeat: Infinity, ease: "linear", delay: i * 8 },
            y: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute w-24 h-12 opacity-[0.03] scale-x-[-1]"
        >
          <svg viewBox="0 0 60 30" className="w-full h-full fill-white blur-[2px]">
             <path d="M0,15 Q15,0 30,15 Q45,30 60,15 L50,18 Q30,40 10,18 Z" />
          </svg>
        </motion.div>
      ))}

      {/* TOP/BOTTOM ATMOSPHERIC DARKENING */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/60 to-transparent" />

      {/* FOCUS AREA SHADOW (Frames the center Earth) */}
      <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black/80 via-black/20 to-transparent z-20" />
      <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black/80 via-black/20 to-transparent z-20" />
    </div>
  );
}
