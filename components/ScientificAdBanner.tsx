'use client';

import React from 'react';
import { AdBanner } from './AdBanner';
import { Terminal, Zap, ShieldCheck, Activity } from 'lucide-react';

interface ScientificAdBannerProps {
  width?: string;
  height?: string;
  className?: string;
  label?: string;
}

export function ScientificAdBanner({ width = "728", height = "90", className = "", label = "DIAGNOSTIC AD-MODULE" }: ScientificAdBannerProps) {
  return (
    <div className={`relative p-2 bg-[#0a0a0b] border-2 border-[#1a1a1c] rounded-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] ${className}`}>
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-orange-500/50" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-orange-500/50" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-orange-500/50" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-orange-500/50" />

      {/* Technical Header */}
      <div className="flex items-center justify-between mb-2 px-2 border-b border-white/5 py-1">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3 text-orange-400" />
          <span className="text-[10px] font-mono text-orange-400/80 uppercase tracking-widest">{label}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
            <div className="w-1 h-1 bg-green-500/20 rounded-full" />
            <div className="w-1 h-1 bg-green-500/20 rounded-full" />
          </div>
          <Activity className="w-3 h-3 text-white/20" />
        </div>
      </div>

      {/* Ad Content */}
      <AdBanner width={width} height={height} className="rounded-none border-none shadow-none bg-black/40" />

      {/* Technical Footer */}
      <div className="mt-2 flex items-center justify-between px-2 opacity-30">
        <div className="flex items-center gap-4 text-[8px] font-mono text-white tracking-tighter">
          <span>SEC_LVL_4</span>
          <span>DATA_STREAM_AUTH</span>
          <span>TRANS_ID: SOL-X88</span>
        </div>
        <div className="flex gap-1">
          <Zap className="w-2 h-2" />
          <ShieldCheck className="w-2 h-2" />
        </div>
      </div>

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      </div>
    </div>
  );
}
