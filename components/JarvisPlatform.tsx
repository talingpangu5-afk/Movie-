'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Zap, 
  Mic, 
  Waves, 
  Workflow, 
  BarChart3,
  Globe,
  Terminal,
  Layers,
  CircleDot
} from 'lucide-react';

interface JarvisPlatformProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JarvisPlatform({ isOpen, onClose }: JarvisPlatformProps) {
  const [activeWorkflow, setActiveWorkflow] = useState(0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden bg-black/95 backdrop-blur-3xl"
        >
          {/* Cyberpunk Grid Floor */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute bottom-0 w-full h-[30vh] bg-gradient-to-t from-cyan-500/20 to-transparent" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ 
              backgroundImage: 'linear-gradient(rgba(0,255,255,0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(0,255,255,0.1) 2px, transparent 2px)',
              backgroundSize: '80px 80px',
              perspective: '1000px',
              transform: 'rotateX(60deg) translateY(100px)'
            }} />
          </div>

          {/* Ironman Scanning Grid Overlay */}
          <div className="absolute inset-0 z-[1001] pointer-events-none opacity-[0.05]">
             <div className="w-full h-full" style={{ 
               backgroundImage: 'linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px)',
               backgroundSize: '100% 4px'
             }} />
          </div>

          {/* Background Ambient Glows */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 z-[1100] p-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-primary/50 transition-all group"
          >
            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
            <X className="w-6 h-6 text-white/40 group-hover:text-primary transition-colors relative z-10" />
          </button>

          {/* Left Side: Neural Readout */}
          <div className="absolute left-10 top-1/2 -translate-y-1/2 z-10 w-[320px] hidden xl:block">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-7xl font-black text-white leading-none tracking-tighter uppercase mb-6">
                  AETHER <br />
                  <span className="text-primary italic">JARVIS</span> <br />
                  <span className="text-white/20 text-4xl">CORE_04</span>
                </h2>
                <div className="flex gap-4 items-center">
                   <div className="w-12 h-[2px] bg-primary" />
                   <p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.4em] font-black">
                     Neural Interface Active
                   </p>
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-white/5">
                 {[
                   { label: 'COGNITIVE_SYNC', val: '99.9%', color: 'text-green-400' },
                   { label: 'HARDWARE_LINK', val: 'SECURE', color: 'text-cyan-400' },
                   { label: 'UPLINK_STRENGTH', val: 'OPTIMAL', color: 'text-primary' }
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-end border-b border-white/5 pb-2">
                      <span className="text-[8px] text-white/20 font-black tracking-widest">{stat.label}</span>
                      <span className={`text-[10px] font-mono font-black ${stat.color}`}>{stat.val}</span>
                   </div>
                 ))}
              </div>
            </motion.div>
          </div>

          {/* Main Visual: Holographic Platform & Figure */}
          <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-4xl h-full mt-20">
            
            {/* The Circular Platform */}
            <div className="relative mb-24">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-[450px] h-[450px] border-4 border-dashed border-cyan-500/20 rounded-full flex items-center justify-center"
              >
                  <div className="w-[85%] h-[85%] border border-cyan-500/10 rounded-full" />
              </motion.div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                 <motion.div 
                   animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.6, 0.3]
                   }}
                   transition={{ duration: 4, repeat: Infinity }}
                   className="w-[300px] h-[100px] bg-cyan-500/30 blur-[100px] rounded-full"
                 />
              </div>

              {/* Holographic Figure Mockup (Abstract Visual) */}
              <div className="absolute inset-0 flex items-center justify-center -top-40 pointer-events-none">
                 <motion.div
                   initial={{ y: 50, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ duration: 2 }}
                   className="relative"
                 >
                    {/* The "Hologram" */}
                    <div className="w-64 h-[400px] bg-gradient-to-t from-cyan-500/40 via-blue-500/10 to-transparent blur-[20px] rounded-t-full mask-linear-fade" />
                    
                    {/* Floating HUD Elements around figure */}
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                       <CircleDot className="w-12 h-12 text-cyan-400 opacity-80 backdrop-blur-md animate-pulse" />
                    </motion.div>

                    {/* Scanning Vertical Line */}
                    <motion.div 
                      animate={{ top: ['0%', '100%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                      className="absolute left-0 right-0 h-px bg-cyan-400/50 shadow-[0_0_15px_cyan]"
                    />
                 </motion.div>
              </div>
            </div>

            {/* Floating UI Panels (Surrounding the platform) */}
            
            {/* Panel 1: Analytics (Top Right) */}
            <FloatingPanel 
              x={350} y={-300} 
              icon={BarChart3} 
              title="Cognitive Load" 
              delay={0.5}
            >
               <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[8px] opacity-40 uppercase font-black">Memory Pool</span>
                    <span className="text-primary text-xs font-mono">82.1 GB</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ['20%', '82%'] }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <div className="flex gap-1 h-8 items-end">
                     {[...Array(12)].map((_, i) => (
                       <motion.div 
                         key={i}
                         animate={{ height: ['40%', '100%', '60%'] }}
                         transition={{ 
                           duration: 1 + (i * 0.1), 
                           repeat: Infinity, 
                           repeatType: 'reverse' 
                         }}
                         className="flex-1 bg-cyan-500/20"
                       />
                     ))}
                  </div>
               </div>
            </FloatingPanel>

            {/* Panel 2: Voice Command Waveform (Bottom Center) */}
            <FloatingPanel 
              x={0} y={150} 
              icon={Mic} 
              title="Voice Recognition" 
              delay={0.7}
              className="w-[400px]"
            >
               <div className="flex items-center justify-center gap-1.5 h-12">
                  {[...Array(40)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ 
                        height: [10, 40, 15, 30, 10],
                        opacity: [0.2, 1, 0.2]
                      }}
                      transition={{ 
                        duration: 1 + (i % 3) * 0.2, 
                        repeat: Infinity,
                        delay: i * 0.05
                      }}
                      className="w-1 bg-cyan-400 rounded-full"
                    />
                  ))}
               </div>
               <p className="text-center text-[10px] text-primary/60 font-mono mt-4 tracking-widest animate-pulse">
                WAITING FOR COMMAND...
               </p>
            </FloatingPanel>

            {/* Panel 3: Automation Workflow (Mid Left) */}
            <FloatingPanel 
              x={-380} y={0} 
              icon={Workflow} 
              title="Active Nodes" 
              delay={0.3}
            >
               <div className="space-y-4">
                  {[1, 2, 3].map((node) => (
                    <div key={node} className="flex items-center gap-3">
                       <div className={`w-2 h-2 rounded-full ${node === 1 ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`} />
                       <div className="flex-1 h-3 bg-white/5 rounded-sm overflow-hidden flex items-center px-1">
                          <span className="text-[7px] text-white/30 uppercase font-bold">Node_Sequence_0{node}</span>
                       </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-white/5">
                    <p className="text-[8px] text-white/40 leading-relaxed uppercase">
                      Redirecting visual sub-routines through neural mesh...
                    </p>
                  </div>
               </div>
            </FloatingPanel>

             {/* Panel 4: System Health (Bottom Right) */}
             <FloatingPanel 
              x={350} y={100} 
              icon={ShieldCheck} 
              title="Security Core" 
              delay={0.9}
            >
               <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                     <span className="text-[9px] text-white/40 uppercase">Firewall</span>
                     <span className="text-[9px] text-green-400 uppercase font-black tracking-widest">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[9px] text-white/40 uppercase">Threat Level</span>
                     <span className="text-[9px] text-cyan-400 uppercase font-black tracking-widest">Minimal</span>
                  </div>
                  <Waves className="w-full h-8 text-cyan-500/20 stroke-[1px]" />
               </div>
            </FloatingPanel>
          </div>

          {/* Lower HUD Overlays */}
          <div className="absolute bottom-10 inset-x-10 z-[100] flex justify-between items-end border-t border-white/10 pt-8 pt-12">
             <div className="flex gap-12">
                <StatusGroup label="CORE_TEMPERATURE" value="38°C" sub="STABLE" />
                <StatusGroup label="PROCESSING_POWER" value="4.2 TFLOPS" sub="OPTIMIZED" />
                <StatusGroup label="NEURAL_DRAIN" value="2.4%" sub="LOW" />
             </div>
             <div className="text-right">
                <p className="text-primary text-xs font-black uppercase tracking-[0.4em] mb-1">AETHER_JARVIS_INTERFACE</p>
                <p className="text-white/20 text-[9px] font-mono tracking-widest uppercase">{`System version 4.02 // Beta 29`}</p>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FloatingPanel({ children, x, y, icon: Icon, title, delay = 0, className = '' }: any) {
  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 0, scale: 0.9 }}
      animate={{ 
        x, 
        y, 
        opacity: 1, 
        scale: 1,
        transition: { delay, duration: 0.8, type: 'spring' }
      }}
      className={`absolute w-[260px] bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 shadow-2xl ${className}`}
    >
      <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
        <Icon className="w-4 h-4 text-primary" />
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">{title}</h4>
      </div>
      {children}
      
      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/50" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/50" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/50" />
    </motion.div>
  );
}

function StatusGroup({ label, value, sub }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-black text-white tracking-tighter uppercase">{value}</span>
        <span className="text-[8px] text-cyan-400 font-bold uppercase tracking-widest">{sub}</span>
      </div>
    </div>
  );
}
