'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Plus, Volume2, VolumeX, Info, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const TRAILERS = [
  {
    id: 1,
    title: "Cyberpunk 2077: Phantom Liberty",
    year: "2024",
    poster: "https://picsum.photos/seed/cyber/400/600",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: 2,
    title: "Interstellar: Beyond Time",
    year: "2025",
    poster: "https://picsum.photos/seed/space/400/600",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: 3,
    title: "The Matrix: Resurrections",
    year: "2024",
    poster: "https://picsum.photos/seed/matrix/400/600",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: 4,
    title: "Blade Runner: 2049",
    year: "2024",
    poster: "https://picsum.photos/seed/blade/400/600",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    id: 5,
    title: "Dune: Part Two",
    year: "2024",
    poster: "https://picsum.photos/seed/dune/400/600",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  }
];

const FIXED_PARTICLES = [
  { id: 1, x: "15%", y: "10%", duration: 12 },
  { id: 2, x: "85%", y: "20%", duration: 15 },
  { id: 3, x: "45%", y: "80%", duration: 10 },
  { id: 4, x: "70%", y: "40%", duration: 18 },
  { id: 5, x: "20%", y: "60%", duration: 14 },
  { id: 6, x: "90%", y: "75%", duration: 11 },
  { id: 7, x: "5%", y: "90%", duration: 20 },
  { id: 8, x: "30%", y: "5%", duration: 13 },
  { id: 9, x: "60%", y: "35%", duration: 16 },
  { id: 10, x: "80%", y: "85%", duration: 12 },
];

function TrailerCard({ trailer }: { trailer: typeof TRAILERS[0] }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered]);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, rotateY: 15, rotateX: 5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group min-w-[280px] md:min-w-[320px] aspect-[2/3] rounded-xl overflow-hidden cursor-pointer bg-black/40 border border-cyan-500/30 hologram-glow"
    >
      {/* Hologram Flicker Overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-cyan-500/5 animate-flicker" />
        <div className="scanline" />
      </div>

      {/* Poster Image */}
      <Image
        src={trailer.poster}
        alt={trailer.title}
        fill
        className={`object-cover transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
        referrerPolicy="no-referrer"
      />

      {/* Video Preview */}
      <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <video
          ref={videoRef}
          src={trailer.video}
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Sound Wave Animation */}
        <div className="absolute bottom-4 left-4 right-4 h-8 flex items-end gap-1 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: isHovered ? [4, 16, 8, 20, 4] : 4 }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
              className="flex-1 bg-cyan-400/60 rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Light Beam Projection Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-500/20 to-transparent z-10 pointer-events-none" />

      {/* Content Overlay */}
      <div className="absolute inset-0 z-30 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-lg font-bold text-white mb-1 drop-shadow-lg">{trailer.title}</h3>
        <p className="text-cyan-400 text-sm font-medium mb-4">{trailer.year}</p>
        
        <div className="flex gap-2">
          <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex-1">
            <Play className="w-4 h-4 mr-1 fill-black" />
            Play
          </Button>
          <Button size="sm" variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10 text-white p-2">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Play Button Center (Always visible but glows on hover) */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <motion.div
          animate={{ scale: isHovered ? 1.2 : 1, opacity: isHovered ? 1 : 0.6 }}
          className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-500/50 flex items-center justify-center backdrop-blur-sm"
        >
          <Play className="w-8 h-8 text-cyan-400 fill-cyan-400" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function HologramTrailers() {
  return (
    <section className="relative py-20 overflow-hidden bg-black">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.05)_0%,transparent_70%)]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {FIXED_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            initial={{ 
              x: p.x, 
              y: p.y,
              opacity: 0.1
            }}
            animate={{ 
              y: ["-10%", "110%"],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ 
              duration: p.duration, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-[1px]"
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              LIVE TRAILERS
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase">
              Watch Trailers in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Hologram</span> Experience
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl">
              Experience movie trailers like never before in immersive 3D visuals.
            </p>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="border-cyan-500/30 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/10">
              View All Experience
            </Button>
          </div>
        </div>

        {/* Horizontal Scroll Area */}
        <div className="relative group">
          <div className="flex gap-8 overflow-x-auto pb-12 pt-4 no-scrollbar snap-x snap-mandatory">
            {TRAILERS.map((trailer) => (
              <div key={trailer.id} className="snap-center">
                <TrailerCard trailer={trailer} />
              </div>
            ))}
          </div>
          
          {/* Scroll Indicators/Shadows */}
          <div className="absolute top-0 left-0 bottom-12 w-20 bg-gradient-to-r from-black to-transparent pointer-events-none z-20" />
          <div className="absolute top-0 right-0 bottom-12 w-20 bg-gradient-to-l from-black to-transparent pointer-events-none z-20" />
        </div>

        {/* Bottom Action Buttons */}
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black px-10 h-14 rounded-full text-lg shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            <Sparkles className="w-5 h-5 mr-2" />
            ENTER FULL IMMERSION
          </Button>
          <Button size="lg" variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold px-10 h-14 rounded-full text-lg">
            ADD ALL TO WATCHLIST
          </Button>
        </div>
      </div>

      {/* Decorative Wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
    </section>
  );
}
