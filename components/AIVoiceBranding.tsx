'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Play, Pause, X, User, Cpu, Sparkles } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";

const SCRIPTS = [
  "This platform has been created solely for educational and entertainment purposes. It is not intended to harm or cause any inconvenience to anyone. All the content and features provided here are part of commonly available information and practices worldwide.\n\nFor any further information, inquiries, or support, you may contact us via email at arunpangu81125@gmail.com.",
  "Welcome to the next generation of cinematic exploration. Taling Pangu is designed to be your ultimate companion in the world of high-definition entertainment, mining insights, and global connectivity. Experience the future of content consumption with our advanced neural interface.",
  "Warning: You are now entering the Taling Pangu neural network. All streams are encrypted with 256-bit cosmic security. Our mining algorithms are processing the latest entertainment data to serve you with unparalleled precision. Stay connected, stay informed, and enjoy the show."
];

export function AIVoiceBranding() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const [typedText, setTypedText] = useState("");
  const [currentScript, setCurrentScript] = useState(SCRIPTS[0]);
  const [isIdentityVisible, setIsIdentityVisible] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [audioCache, setAudioCache] = useState<Record<string, string>>({});
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  // Initialize AudioContext lazily on user interaction
  const getAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
    }
    return audioContextRef.current;
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        stopPlayback();
        setIsIdentityVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchTTS = async (text: string) => {
    if (audioCache[text]) return audioCache[text];
    
    setIsLoadingAudio(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: `Say this script in a deep, futuristic, slightly robotic male voice: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Charon' },
            },
          },
        },
      });

      const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64) {
        setAudioCache(prev => ({ ...prev, [text]: base64 }));
        return base64;
      }
    } catch (error) {
      console.error("TTS Fetch failed:", error);
      // Fallback
      try {
        const aiFallback = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
        const response = await aiFallback.models.generateContent({
          model: "gemini-1.5-flash",
          contents: [{ parts: [{ text: `Read this script: ${text}` }] }],
          config: {
            responseModalities: [Modality.AUDIO] as any,
          }
        });
        const altBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (altBase64) return altBase64;
      } catch (e) {
        console.error("Fallback TTS failed:", e);
      }
    } finally {
      setIsLoadingAudio(false);
    }
    return null;
  };

  const playAudio = async (base64: string) => {
    try {
      const audioContext = getAudioContext();
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const float32Data = new Float32Array(bytes.length / 2);
      const view = new DataView(bytes.buffer);
      for (let i = 0; i < float32Data.length; i++) {
          if (i * 2 + 1 < bytes.length) {
            const s16 = view.getInt16(i * 2, true);
            float32Data[i] = s16 / 32768;
          }
      }

      const audioBuffer = audioContext.createBuffer(1, float32Data.length, 24000);
      audioBuffer.getChannelData(0).set(float32Data);

      // Stop any existing source to prevent overlapping sounds
      if (audioSourceRef.current) {
        try {
          audioSourceRef.current.stop();
        } catch (e) {}
      }

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      source.onended = () => {
        // Only set playing false if this was the current active source
        if (audioSourceRef.current === source) {
          setIsPlaying(false);
          isPlayingRef.current = false;
        }
      };

      source.start();
      audioSourceRef.current = source;
      
      startTyping();
    } catch (error) {
      console.error("Audio Playback Error:", error);
      setIsPlaying(false);
      isPlayingRef.current = false;
      startTyping();
    }
  };

  const startPlayback = async () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      console.error("Gemini API Key missing");
      return;
    }

    // Select random script
    const randomScript = SCRIPTS[Math.floor(Math.random() * SCRIPTS.length)];
    setCurrentScript(randomScript);

    setIsIdentityVisible(true);
    setIsPlaying(true);
    isPlayingRef.current = true;
    setTypedText("");

    try {
      const base64 = await fetchTTS(randomScript);
      
      if (!isPlayingRef.current) return;

      if (base64) {
        await playAudio(base64);
      } else {
          startTyping();
      }
    } catch (error) {
      console.error("Playback sequence failed:", error);
      setIsPlaying(false);
      isPlayingRef.current = false;
      startTyping();
    }
  };

  const stopPlayback = () => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) {}
      audioSourceRef.current = null;
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsPlaying(false);
    isPlayingRef.current = false;
  };

  const startTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    let currentText = "";
    const chars = currentScript.split("");
    let i = 0;

    const type = () => {
      if (isPlayingRef.current && i < chars.length) {
        currentText += chars[i];
        setTypedText(currentText);
        i++;
        const delay = chars[i-1] === '.' || chars[i-1] === '?' || chars[i-1] === '!' ? 400 : 25;
        typingTimeoutRef.current = setTimeout(type, delay);
      }
    };

    type();
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Brand Section */}
      <div className="flex items-center gap-2">
        <motion.div
          animate={isExpanded ? { scale: 1.1 } : { scale: 1 }}
          className="relative cursor-pointer"
          onClick={startPlayback}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => !isIdentityVisible && setIsExpanded(false)}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ${isIdentityVisible ? 'bg-primary shadow-[0_0_20px_rgba(247,147,26,0.5)]' : 'bg-zinc-900 border border-white/10 hover:border-primary/50'}`}>
              {isIdentityVisible ? <Cpu className="w-5 h-5 text-black" /> : <Sparkles className="w-5 h-5 text-primary" />}
          </div>
          <AnimatePresence>
            {isPlaying && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 bg-primary/20 rounded-full -z-10"
              />
            )}
          </AnimatePresence>
        </motion.div>

        <Link 
          href="/" 
          className="flex flex-col cursor-pointer group select-none"
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => !isIdentityVisible && setIsExpanded(false)}
        >
          <h1 className="text-xl md:text-2xl font-black tracking-tighter text-white transition-all duration-300 group-hover:neon-blue flex items-center gap-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-white animate-text-shimmer bg-[length:200%_auto]">
              TALING PANGU
            </span>
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-primary font-black ml-1 whitespace-nowrap text-xs md:text-sm"
                >
                  – CREATOR
                </motion.span>
              )}
            </AnimatePresence>
          </h1>
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 -mt-1 block group-hover:text-primary/60 transition-colors">
            Kaying Bazaar HQ
          </span>
        </Link>
      </div>

      {/* AI Script Console (Hologram Style) */}
      <AnimatePresence>
        {isIdentityVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, rotateX: 20 }}
            className="absolute top-full left-0 mt-4 w-[280px] md:w-[480px] z-[100] perspective-1000"
          >
            <div className="relative bg-black/60 backdrop-blur-2xl border border-white/20 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {/* Scanline Effect */}
              <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-[0.03]" />
              
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] uppercase font-black tracking-widest text-primary">AI Voice Core Active</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex gap-1 h-3 items-end">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <motion.div
                                key={i}
                                animate={isPlaying ? { height: [4, 12, 4] } : { height: 4 }}
                                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                className="w-1 bg-primary/60 rounded-full"
                            />
                        ))}
                    </div>
                    <button 
                      onClick={() => setIsIdentityVisible(false)}
                      className="text-white/40 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                </div>
              </div>

              <div className="p-6 h-[200px] overflow-y-auto scrollbar-hide font-mono text-[11px] md:text-xs leading-relaxed text-zinc-300">
                <p className="whitespace-pre-wrap">
                  {typedText}
                  {isPlaying && <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />}
                </p>
              </div>

              <div className="p-4 bg-white/5 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={isPlaying ? stopPlayback : startPlayback}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-primary transition-all group"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-primary" /> : <Play className="w-4 h-4 fill-primary" />}
                    <span className="text-[10px] font-black uppercase tracking-widest">{isPlaying ? "Pause AI" : "Resume"}</span>
                  </button>
                  
                  {isLoadingAudio && (
                      <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                          <span className="text-[9px] uppercase font-black text-white/40">Syncing Voice...</span>
                      </div>
                  )}
                </div>
                
                <div className="text-[9px] uppercase font-black text-white/20 tracking-tighter">
                    V-CORE 3.1 ALPHA
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
