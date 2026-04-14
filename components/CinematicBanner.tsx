'use client';

import { motion } from 'motion/react';
import { Play, Bell, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const posters = [
  'https://picsum.photos/seed/movie1/400/600',
  'https://picsum.photos/seed/movie2/400/600',
  'https://picsum.photos/seed/movie3/400/600',
  'https://picsum.photos/seed/movie4/400/600',
  'https://picsum.photos/seed/movie5/400/600',
  'https://picsum.photos/seed/movie6/400/600',
];

const FIXED_PARTICLES = [
  { id: 1, x: "10%", y: "20%", opacity: 0.3, duration: 6, delay: 1 },
  { id: 2, x: "85%", y: "15%", opacity: 0.4, duration: 8, delay: 0.5 },
  { id: 3, x: "45%", y: "80%", opacity: 0.2, duration: 7, delay: 2 },
  { id: 4, x: "70%", y: "40%", opacity: 0.5, duration: 5, delay: 0 },
  { id: 5, x: "20%", y: "60%", opacity: 0.3, duration: 9, delay: 3 },
  { id: 6, x: "90%", y: "70%", opacity: 0.4, duration: 6, delay: 1.5 },
  { id: 7, x: "5%", y: "90%", opacity: 0.2, duration: 10, delay: 4 },
  { id: 8, x: "30%", y: "10%", opacity: 0.5, duration: 7, delay: 0.2 },
  { id: 9, x: "60%", y: "30%", opacity: 0.3, duration: 8, delay: 2.5 },
  { id: 10, x: "80%", y: "85%", opacity: 0.4, duration: 6, delay: 1.2 },
  { id: 11, x: "15%", y: "45%", opacity: 0.2, duration: 9, delay: 0.8 },
  { id: 12, x: "55%", y: "5%", opacity: 0.5, duration: 5, delay: 3.5 },
  { id: 13, x: "40%", y: "95%", opacity: 0.3, duration: 7, delay: 1.8 },
  { id: 14, x: "95%", y: "50%", opacity: 0.4, duration: 8, delay: 0.4 },
  { id: 15, x: "25%", y: "75%", opacity: 0.2, duration: 6, delay: 2.2 },
];

export function CinematicBanner() {
  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-black flex items-center justify-center my-12">
      {/* Animated Background with Blurred Posters */}
      <div className="absolute inset-0 z-0 flex gap-4 opacity-40">
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-4 w-full h-full"
        >
          {posters.map((src, i) => (
            <div key={i} className="relative flex-1 min-w-[200px] h-full blur-md">
              <Image
                src={src}
                alt="Movie Poster"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dark Overlay Gradients */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-black" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-transparent to-black" />

      {/* Floating Particles */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {FIXED_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            initial={{ 
              x: p.x, 
              y: p.y,
              opacity: p.opacity
            }}
            animate={{ 
              y: [0, -40, 0],
              x: [0, 20, 0],
              opacity: [p.opacity, p.opacity + 0.2, p.opacity]
            }}
            transition={{ 
              duration: p.duration, 
              repeat: Infinity,
              delay: p.delay
            }}
            className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-30 container mx-auto px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card p-8 md:p-12 rounded-3xl max-w-4xl w-full border border-white/10 shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>EXCLUSIVE PREVIEW</span>
          </motion.div>

          <motion.h2 
            animate={{ 
              textShadow: [
                "0 0 10px rgba(255,0,0,0.5), 0 0 20px rgba(0,0,255,0.3)",
                "0 0 20px rgba(255,0,0,0.8), 0 0 40px rgba(0,0,255,0.5)",
                "0 0 10px rgba(255,0,0,0.5), 0 0 20px rgba(0,0,255,0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl md:text-7xl font-black tracking-tighter mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Coming Soon
            </span>
            <br />
            <span className="text-white">Live Stream Movies</span>
          </motion.h2>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Experience the next generation of cinema. Join our exclusive live streaming events and be the first to watch the biggest blockbusters from the comfort of your home.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-200 font-bold px-8 h-14 rounded-full text-lg transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
            >
              <Play className="w-5 h-5 mr-2 fill-black" />
              Watch Trailer
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold px-8 h-14 rounded-full text-lg transition-all hover:shadow-[0_0_20px_rgba(255,0,0,0.2)]"
            >
              <Bell className="w-5 h-5 mr-2" />
              Notify Me
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Light Streaks */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            x: ['-100%', '200%'],
            opacity: [0, 0.3, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent rotate-12"
        />
        <motion.div 
          animate={{ 
            x: ['200%', '-100%'],
            opacity: [0, 0.3, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-3/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent -rotate-12"
        />
      </div>
    </section>
  );
}
