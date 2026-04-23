'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, 
  User, Headset, Clock, Wifi, X, ChevronRight,
  AlertCircle, ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type CallState = 'idle' | 'pre-call' | 'connecting' | 'live' | 'ended';

export function VideoSupportSystem() {
  const [isOpen, setIsOpen] = useState(false);
  const [callState, setCallState] = useState<CallState>('idle');
  const [formData, setFormData] = useState({ name: '', phone: '+918731006024', issue: 'Support' });
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [timer, setTimer] = useState(0);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Call Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callState === 'live') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      streamRef.current = stream;
      return true;
    } catch (err) {
      toast.error('Could not access camera or microphone');
      console.error(err);
      return false;
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleStartCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toast.error('Please enter your name or User ID');
    
    setCallState('connecting');
    const success = await startCamera();
    
    if (success) {
      // Simulate connection delay
      setTimeout(() => {
        setCallState('live');
        toast.success('Support agent connected');
      }, 3000);
    } else {
      setCallState('pre-call');
    }
  };

  const handleEndCall = () => {
    stopCamera();
    setCallState('idle');
    setIsOpen(false);
    setTimer(0);
    toast.info('Call ended');
  };

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsOpen(true);
          if (callState === 'idle') setCallState('pre-call');
        }}
        className="fixed bottom-8 right-8 z-[100] group"
      >
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping group-hover:animate-none" />
        <div className="relative bg-primary text-black p-4 rounded-full shadow-[0_0_30px_rgba(0,242,255,0.4)] flex items-center gap-2">
          <Video className="w-6 h-6" />
          <span className="font-black uppercase tracking-widest text-[10px] pr-2">Video Support</span>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
        </div>
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-4xl min-h-[500px] rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col relative shadow-2xl"
            >
              {/* Close Button */}
              <button 
                onClick={() => {
                  if (callState === 'live') {
                    if (confirm('Are you sure you want to end the call?')) handleEndCall();
                  } else {
                    setIsOpen(false);
                  }
                }}
                className="absolute top-6 right-6 z-10 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Pre-Call Screen */}
              {callState === 'pre-call' && (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8">
                  <div className="space-y-2">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 border border-primary/20">
                      <Headset className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter">Support <span className="text-primary italic">Onboarding</span></h2>
                    <p className="text-white/40 text-sm tracking-widest uppercase">Start a secure video session with our team</p>
                  </div>

                  <form onSubmit={handleStartCall} className="w-full max-w-sm space-y-4">
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Name / User ID</label>
                      <Input 
                        placeholder="e.g. talingpangu5" 
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-white/5 border-white/10 h-14 rounded-xl focus:border-primary/50"
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Phone Number</label>
                      <Input 
                        placeholder="+91..." 
                        value={formData.phone}
                        onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="bg-white/5 border-white/10 h-14 rounded-xl focus:border-primary/50"
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Issue Type</label>
                      <select 
                        value={formData.issue}
                        onChange={e => setFormData(prev => ({ ...prev, issue: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 h-14 rounded-xl px-4 text-sm font-medium focus:border-primary/50 outline-none appearance-none"
                      >
                        <option value="Support" className="bg-black text-white">General Support</option>
                        <option value="KYC" className="bg-black text-white">KYC Verification</option>
                        <option value="Demo" className="bg-black text-white">Platform Demo</option>
                      </select>
                    </div>

                    <Button type="submit" className="w-full h-14 bg-primary text-black font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-transform">
                      Start Video Call
                    </Button>
                  </form>

                  <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest font-bold pt-4">
                    <ShieldCheck className="w-4 h-4" />
                    Encrypted Peer-to-Peer Connection
                  </div>
                </div>
              )}

              {/* Connecting Screen */}
              {callState === 'connecting' && (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-primary/20 flex items-center justify-center">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-t-4 border-primary rounded-full"
                      />
                      <Wifi className="w-12 h-12 text-primary animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black uppercase tracking-tighter">Connecting <span className="text-primary italic">Securely</span></h3>
                    <p className="text-white/40 text-xs tracking-[0.2em] uppercase font-bold animate-pulse">Waiting for available agent...</p>
                  </div>
                </div>
              )}

              {/* Live Call Screen */}
              {callState === 'live' && (
                <div className="flex-1 flex flex-col md:flex-row relative bg-black">
                  {/* Remote Video (Full Screen in UI logic for better visibility) */}
                  <div className="flex-1 relative bg-zinc-900 overflow-hidden">
                    {/* Placeholder for Remote Stream */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-800 to-black">
                      <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                        <User className="w-12 h-12 text-primary" />
                      </div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-black">Support Representative</p>
                      <p className="text-[10px] text-green-500 uppercase tracking-widest font-bold mt-2">Active Agent</p>
                    </div>

                    {/* Remote Video Element (when integrated with WebRTC/Agora) */}
                    <video 
                      ref={remoteVideoRef} 
                      autoPlay 
                      playsInline 
                      className="absolute inset-0 w-full h-full object-cover z-0" 
                    />

                    {/* Top Info Bar */}
                    <div className="absolute top-6 left-6 z-20 flex items-center gap-4">
                      <div className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{formatTime(timer)}</span>
                        <div className="w-px h-3 bg-white/20" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Live Support</span>
                      </div>
                    </div>
                  </div>

                  {/* Local Video Picture-in-Picture */}
                  <div className="absolute bottom-28 right-6 w-48 aspect-video md:w-64 bg-zinc-800 rounded-2xl border border-white/20 overflow-hidden shadow-2xl z-30">
                    <video 
                      ref={localVideoRef} 
                      autoPlay 
                      muted 
                      playsInline 
                      className={`w-full h-full object-cover transition-opacity duration-300 ${isVideoOff ? 'opacity-0' : 'opacity-100'}`}
                    />
                    {isVideoOff && (
                      <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
                        <VideoOff className="w-8 h-8 text-white/20" />
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 rounded flex items-center gap-2">
                       <span className="text-[8px] font-black uppercase tracking-widest text-white/60">Your Camera</span>
                    </div>
                  </div>

                  {/* Call Controls Tab */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-6">
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-[2rem] flex items-center justify-center gap-6 shadow-2xl">
                      <button 
                        onClick={toggleMute}
                        className={`p-4 rounded-2xl transition-all ${isMuted ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}
                      >
                        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                      </button>
                      
                      <button 
                        onClick={handleEndCall}
                        className="p-5 bg-red-500 text-white rounded-2xl shadow-xl shadow-red-500/30 hover:scale-110 active:scale-95 transition-all transform"
                      >
                        <PhoneOff className="w-8 h-8" />
                      </button>

                      <button 
                        onClick={toggleVideo}
                        className={`p-4 rounded-2xl transition-all ${isVideoOff ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}
                      >
                        {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                      </button>
                    </div>
                  </div>

                  {/* Disclaimer Bottom Left */}
                  <div className="absolute bottom-6 left-6 z-20 hidden md:block">
                     <p className="max-w-[200px] text-[8px] text-white/40 uppercase tracking-[0.1em] leading-relaxed">
                       This call is for support and guidance only. No guaranteed profits. Securely encrypted.
                     </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * INTEGARTION POINTS:
 * 
 * 1. WebRTC Signaling:
 *    - Use a WebSocket server (e.g. Socket.io) to exchange SDP offers/answers and ICE candidates.
 *    - In `handleStartCall`, create a `new RTCPeerConnection()`.
 *    - Add tracks from `streamRef.current` to the peer connection.
 *    - Listen for `ontrack` events to set `remoteVideoRef.current.srcObject`.
 * 
 * 2. Agora SDK:
 *    - In `handleStartCall`, initialize Agora client with `AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })`.
 *    - Join channel with `client.join(appId, channel, token, uid)`.
 *    - Publish local tracks with `client.publish([audioTrack, videoTrack])`.
 *    - Subscribe to remote users with `client.on("user-published", handleUserPublished)`.
 * 
 * 3. Token Authentication:
 *    - The `token` used for joining (Agora/Twilio) should be fetched from a secure Next.js API route 
 *      (`app/api/support/token/route.ts`) which validates the user's session.
 */
