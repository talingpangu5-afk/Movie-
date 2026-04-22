'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, Upload, Trash2, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { toast } from 'sonner';

export function CameraCapture() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showConsent, setShowConsent] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraSupported, setIsCameraSupported] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Check if getUserMedia is supported
    if (typeof window !== 'undefined' && (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)) {
      setTimeout(() => setIsCameraSupported(false), 0);
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setShowConsent(true);
  };

  const handleClose = () => {
    stopCamera();
    setIsOpen(false);
  };

  const startCamera = async () => {
    try {
      const constraints = {
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false,
      };
      
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      setShowConsent(false); // This renders the video element
      
      toast.success('Camera Connected');
    } catch (err) {
      console.error('Camera Access Error:', err);
      // Don't disable support entirely on one error, just report permission/hardware issue
      toast.error('Could not access camera. Please check permissions or if another app is using it.');
    }
  };

  // Attach stream to video element when it becomes available
  useEffect(() => {
    if (stream && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, showConsent]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Flip horizontally for natural feeling since it's a mirror preview
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const photoData = canvas.toDataURL('image/png');
        localStorage.setItem('captured_moment', photoData);
        window.dispatchEvent(new Event('moment_captured'));
        toast.success('Moment Captured!');
        handleClose();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoData = reader.result as string;
        localStorage.setItem('captured_moment', photoData);
        window.dispatchEvent(new Event('moment_captured'));
        toast.success('Moment Uploaded!');
        handleClose();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Floating Button / Swipe Bar */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-24 right-6 z-[60]"
      >
        <Button
          onClick={handleOpen}
          className="group h-12 bg-black/40 backdrop-blur-xl border border-primary/30 rounded-full px-6 flex items-center gap-3 hover:bg-black/60 hover:border-primary transition-all duration-300 shadow-[0_0_20px_rgba(229,9,20,0.2)]"
        >
          <div className="relative">
            <Camera className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
          </div>
          <span className="text-[10px] uppercase font-black tracking-widest text-white/80 group-hover:text-white">
            Capture Moment
          </span>
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-primary/20 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(229,9,20,0.1)] flex flex-col"
            >
              <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <Camera className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-tighter text-white">Capture Point</h3>
                  </div>
                  <button onClick={handleClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <X className="w-5 h-5 text-white/40" />
                  </button>
                </div>

                {showConsent ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8 text-center"
                  >
                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col items-center gap-4">
                      <Shield className="w-12 h-12 text-primary opacity-50" />
                      <p className="text-white/60 text-sm font-medium leading-relaxed">
                        We need access to your camera to capture this moment. Your privacy is priority — photos are stored locally on your device only.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      {isCameraSupported ? (
                        <Button 
                          onClick={startCamera}
                          className="h-14 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-black uppercase tracking-widest"
                        >
                          Allow Access
                        </Button>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-xs text-primary font-black uppercase italic">Camera Not Supported</p>
                          <label className="flex flex-col items-center gap-4 p-8 border-2 border-dashed border-white/10 rounded-3xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                            <Upload className="w-8 h-8 text-white/40" />
                            <span className="text-xs font-bold text-white/60">Upload Image Instead</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                          </label>
                        </div>
                      )}
                      <button 
                        onClick={handleClose}
                        className="text-[10px] uppercase font-bold text-white/30 hover:text-white transition-colors"
                      >
                        Cancel Transaction
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="relative aspect-square rounded-3xl overflow-hidden bg-black border border-white/5 group">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted
                        onLoadedMetadata={() => {
                          videoRef.current?.play().catch(e => console.error("Video play failed:", e));
                        }}
                        className="w-full h-full object-cover -scale-x-100"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                        <div className="w-[80%] h-[80%] border-2 border-primary border-dashed rounded-full" />
                      </div>
                      
                      <div className="absolute top-4 left-4 flex gap-2">
                         <div className="px-2 py-1 bg-primary text-[8px] font-black italic rounded text-white animate-pulse">REC</div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        onClick={capturePhoto}
                        className="flex-grow h-16 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(229,9,20,0.3)]"
                      >
                        Capture Moment
                      </Button>
                    </div>
                    <button 
                      onClick={() => setShowConsent(true)}
                      className="w-full text-[10px] uppercase font-bold text-white/30 hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Re-evaluate Access
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}
