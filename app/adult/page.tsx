'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Play, Lock, Eye, Trash2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function AdultSection() {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkVerification = () => {
      const token = localStorage.getItem('adult_token');
      const timestamp = localStorage.getItem('adult_session_start');
      
      if (token && timestamp) {
        const now = new Date().getTime();
        const sessionAge = now - parseInt(timestamp);
        const maxAge = 3600000; // 1 hour session

        if (sessionAge < maxAge) {
          setIsVerified(true);
        } else {
          localStorage.removeItem('adult_token');
          localStorage.removeItem('adult_session_start');
          toast.error("Session expired. Please re-verify.");
          router.push('/');
        }
      } else {
        router.push('/');
      }
      setIsLoading(false);
    };

    checkVerification();
  }, [router]);

  const handleExit = () => {
    localStorage.removeItem('adult_token');
    localStorage.removeItem('adult_session_start');
    setIsVerified(false);
    toast.info("18+ Content Locked");
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isVerified) return null;

  const adultContent = [
    { id: 1, title: "Midnight Desire", image: "https://picsum.photos/seed/adult1/400/600", rating: "X", views: "1.2M" },
    { id: 2, title: "Neon Nights", image: "https://picsum.photos/seed/adult2/400/600", rating: "X", views: "850K" },
    { id: 3, title: "Silent Whispers", image: "https://picsum.photos/seed/adult3/400/600", rating: "X", views: "2.1M" },
    { id: 4, title: "Velvet Room", image: "https://picsum.photos/seed/adult4/400/600", rating: "X", views: "500K" },
    { id: 5, title: "Deep Focus", image: "https://picsum.photos/seed/adult5/400/600", rating: "X", views: "920K" },
    { id: 6, title: "The Last Dance", image: "https://picsum.photos/seed/adult6/400/600", rating: "X", views: "1.5M" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-20 px-4 md:px-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto space-y-12"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-primary/20 pb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="destructive" className="bg-primary/20 text-primary border-primary/50 text-xs font-black animate-pulse">
                RESTRICTED 18+
              </Badge>
              <span className="text-white/40 text-xs font-mono tracking-widest uppercase">Secured Session Active</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white flex items-center gap-4">
              Premium <span className="text-primary drop-shadow-[0_0_15px_rgba(229,9,20,0.5)]">Noir</span>
            </h1>
            <p className="text-white/60 max-w-2xl text-lg font-medium">
              Access granted to private cinematic archives. All content is strictly for adults. 
              Unauthorized recording or redistribution is prohibited.
            </p>
          </div>
          
          <Button 
            onClick={handleExit}
            variant="outline"
            className="border-primary/50 text-primary hover:bg-primary hover:text-white group h-14 px-8 rounded-full font-black uppercase tracking-widest transition-all"
          >
            <LogOut className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
            Exit Stealth Mode
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          <AnimatePresence mode="popLayout">
            {adultContent.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative"
              >
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden glass-card border border-white/5 group-hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:z-10">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <h3 className="text-white font-bold text-lg leading-tight mb-2 uppercase tracking-tighter">{item.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/60 font-mono italic">{item.views} views</span>
                      <div className="bg-primary p-2 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-[0_0_15px_rgba(229,9,20,0.5)]">
                        <Play className="w-3 h-3 text-white fill-white" />
                      </div>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-md text-[10px] font-black text-primary">
                    {item.rating}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Warning Banner */}
        <div className="mt-20 p-8 rounded-3xl bg-primary/5 border border-primary/20 backdrop-blur-xl flex flex-col md:flex-row items-center gap-8">
          <div className="p-6 bg-primary/20 rounded-2xl border border-primary/30">
            <ShieldAlert className="w-12 h-12 text-primary" />
          </div>
          <div className="space-y-2 flex-grow text-center md:text-left">
            <h4 className="text-xl font-bold text-white uppercase tracking-tighter">Legal Disclaimer</h4>
            <p className="text-white/40 text-sm max-w-3xl leading-relaxed font-medium">
              By entering this section, you acknowledge that you are at least 18 years of age. 
              We use device fingerprints and encrypted session storage to verify and maintain your access.
              Your location and IP data are strictly used for regional licensing compliance.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
            <span className="text-[10px] font-mono text-primary animate-pulse">ENCRYPTION ACTIVE</span>
          </div>
        </div>
      </motion.div>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 -right-20 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
}
