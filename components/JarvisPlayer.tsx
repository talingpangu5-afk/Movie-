'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Download, 
  Camera, 
  Volume2, 
  VolumeX,
  FastForward,
  Rewind,
  X,
  Activity,
  Cpu,
  Radio,
  Globe
} from 'lucide-react';

interface JarvisPlayerProps {
  video: any;
  onClose: () => void;
}

export default function JarvisPlayer({ video, onClose }: JarvisPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showHUD, setShowHUD] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsPlaying(prev => !prev);
      } else if (e.code === 'KeyM') {
        setIsMuted(prev => !prev);
      } else if (e.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onClose]);

  const captureScreenshot = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current?.videoWidth || 1920;
    canvas.height = videoRef.current?.videoHeight || 1080;
    const ctx = canvas.getContext('2d');
    if (ctx && videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const link = document.createElement('a');
        link.download = `neural_capture_${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, scale: 1, backdropFilter: 'blur(40px)' }}
      exit={{ opacity: 0, scale: 1.1, backdropFilter: 'blur(0px)' }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
      ref={playerRef}
    >
      {/* Cinematic HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20">
         {/* Corner Brackets */}
         <div className="absolute top-10 left-10 w-24 h-24 border-t-2 border-l-2 border-cyan-500/30" />
         <div className="absolute top-10 right-10 w-24 h-24 border-t-2 border-r-2 border-cyan-500/30" />
         <div className="absolute bottom-10 left-10 w-24 h-24 border-b-2 border-l-2 border-cyan-500/30" />
         <div className="absolute bottom-10 right-10 w-24 h-24 border-b-2 border-r-2 border-cyan-500/30" />

         {/* Scanning Line */}
         <div className="scanline" />

         {/* Top Data Bar */}
         <div className="absolute top-12 inset-x-12 flex justify-between items-start text-cyan-400 font-mono text-[10px]">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="uppercase tracking-[0.3em]">REC_LIVE_STREAM_ACTIVE</span>
                </div>
                <div className="flex items-center gap-2 opacity-50">
                    <Activity className="w-3 h-3" />
                    <span>NEURAL_UPLINK: SYNCHRONIZED</span>
                </div>
            </div>
            <div className="text-right space-y-1">
                <div className="text-white font-black uppercase text-xs tracking-widest">{video?.title || "Neural Convergence 0x82"}</div>
                <div className="opacity-50">RES: 8K_HYPER / FPS: 120 / ENC: NEURAL_X</div>
            </div>
         </div>

         {/* Side Telemetry HUDs */}
         <div className="absolute left-12 top-1/2 -translate-y-1/2 space-y-8">
            <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl backdrop-blur-xl">
                <div className="text-[9px] font-mono text-cyan-500/60 uppercase mb-3">Sync_Status</div>
                <div className="flex flex-col gap-3">
                    {[
                        { label: 'Latency', value: '14ms', icon: Radio },
                        { label: 'Uplink', value: '99%', icon: Globe },
                        { label: 'Neural', value: 'Active', icon: Cpu }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <item.icon className="w-3 h-3 text-cyan-400" />
                            <div className="flex flex-col">
                                <span className="text-[7px] text-white/40 uppercase">{item.label}</span>
                                <span className="text-[9px] text-white font-bold">{item.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
         </div>
      </div>

      {/* Main Player Container */}
      <div className="relative w-full max-w-6xl aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(6,182,212,0.2)] bg-black group">
        <video 
          ref={videoRef}
          autoPlay 
          src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-futuristic-cityscape-and-robot-41315-large.mp4" 
          className="w-full h-full object-cover"
          onEnded={onClose}
        />

        {/* Video Controls Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {/* Progress Bar */}
            <div className="relative h-1 w-full bg-white/10 rounded-full group/progress cursor-pointer overflow-hidden">
                <motion.div 
                    animate={{ width: `${progress}%` }}
                    className="absolute inset-y-0 left-0 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,1)]" 
                />
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-4 rounded-2xl bg-white text-black hover:bg-cyan-400 transition-all shadow-xl"
                    >
                        {isPlaying ? <Pause className="fill-black" /> : <Play className="fill-black" />}
                    </button>
                    <div className="flex items-center gap-4">
                        <button className="text-white/60 hover:text-white transition-colors"><RotateCcw className="w-5 h-5" /></button>
                        <button 
                            onClick={() => setIsMuted(!isMuted)}
                            className="text-white/60 hover:text-white transition-colors"
                        >
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                    </div>
                    <div className="text-[10px] font-mono text-white/40">
                        00:34 / 12:45
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={captureScreenshot}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all group/btn"
                    >
                        <Camera className="w-5 h-5 group-hover/btn:scale-110" />
                    </button>
                    <button className="p-4 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all">
                        <Download className="w-5 h-5" />
                    </button>
                    <button className="p-4 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all">
                        <Maximize2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>

        {/* Floating Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white/40 hover:text-white hover:bg-black/60 transition-all z-30"
        >
            <X className="w-6 h-6" />
        </button>
      </div>

      {/* Background Holographic Atmosphere */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
        <motion.div 
            animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.4, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="w-[120vw] h-[120vh] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)] blur-[100px]" 
        />
      </div>
    </motion.div>
  );
}
