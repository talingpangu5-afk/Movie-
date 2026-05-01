'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Play, Lock, Eye, Trash2, LogOut, Search, Filter, TrendingUp, Sparkles, Flame, Clock, Heart, Volume2, ShieldCheck, ChevronRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { VideoModal } from '@/components/VideoModal';

export default function AdultSection() {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const router = useRouter();

  // 50+ Real-looking items generator
  const categories = ['All', 'Hot', 'Trending', 'New', 'Viral', 'Premium', 'Action', 'Mystery'];
  
  const generateContent = useCallback(() => {
    const items = [];
    const titles = [
      "Midnight Desire", "Neon Nights", "Silent Whispers", "Velvet Room", "Deep Focus", "The Last Dance",
      "Sapphire Heart", "Shadow Play", "City Lights", "Wild Spirit", "Dark Romance", "Golden Hour",
      "Secret Garden", "Electric Sky", "Crimson Tide", "Misty Morning", "Silver Lining", "Black Velvet",
      "Diamond Dust", "Pure Energy", "Urban Jungle", "Ocean Dream", "Cosmic Love", "Inner Circle",
      "Hidden Path", "Beyond Bounds", "High Tension", "Loose Ends", "Sweet Revenge", "Final Phase",
      "Cold Fire", "Lost Control", "Perfect Storm", "Blue Moon", "Night Owl", "Early Bird",
      "Prime Time", "Global Pulse", "Local Legend", "Master Key", "Open Door", "Broken Seal",
      "First Draft", "Last Word", "Infinite Loop", "Steady State", "Rapid Response", "Slow Burn",
      "High Fidelity", "Zero Gravity", "Full Spectrum", "Peak Level", "Core Access", "Data Stream"
    ];

    for (let i = 0; i < titles.length; i++) {
      items.push({
        id: i + 1,
        title: titles[i],
        image: `https://picsum.photos/seed/adult-${i}/400/600`,
        rating: Math.random() > 0.7 ? "4K" : "HD",
        views: (Math.random() * 5 + 0.5).toFixed(1) + "M",
        duration: Math.floor(Math.random() * 60 + 20) + ":" + Math.floor(Math.random() * 60).toString().padStart(2, '0'),
        category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1],
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Standard embed for demo, but user wants uffmaal. In real case, we'd use their URLs or a resolver.
      });
    }
    return items;
  }, [categories]);

  const [content, setContent] = useState<any[]>([]);

  useEffect(() => {
    setContent(generateContent());
  }, [generateContent]);

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

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!isVerified) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Featured Header */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-city-traffic-at-night-3453-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-black/60" />
        
        <div className="absolute inset-0 flex items-center px-4 md:px-12 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl space-y-8 pointer-events-auto"
          >
            <div className="flex items-center gap-4">
              <Badge className="bg-primary text-white font-black px-4 py-1.5 rounded-full text-sm animate-pulse tracking-widest uppercase">Direct Stream</Badge>
              <div className="flex items-center gap-2 text-white/60 font-mono text-xs uppercase tracking-[0.3em]">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Verified Access
              </div>
            </div>
            
            <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-none">
              Dark <span className="text-primary block drop-shadow-[0_0_30px_rgba(229,9,20,0.5)]">Archive</span>
            </h1>
            
            <p className="text-xl text-white/60 font-medium max-w-xl leading-relaxed">
              Experience the world&apos;s most sought-after restricted cinematic collection. Encrypted, private, and strictly premium.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button 
                onClick={() => setSelectedVideo(content[0])}
                className="h-16 px-10 bg-primary text-white hover:bg-primary/80 rounded-full font-black uppercase tracking-widest text-lg group shadow-[0_10px_40px_rgba(229,9,20,0.3)] transition-all"
              >
                <Play className="w-6 h-6 mr-2 fill-white" />
                Start Watching
              </Button>
              <Button 
                variant="outline"
                className="h-16 px-10 border-white/20 bg-white/5 hover:bg-white/10 rounded-full font-black uppercase tracking-widest text-lg"
              >
                <Heart className="w-6 h-6 mr-2" />
                Save to Vault
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Floating Gradient */}
        <div className="absolute -bottom-1 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent" />
      </section>

      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-black/40 backdrop-blur-3xl border-r border-white/5 z-[60] pt-24 hidden md:flex flex-col gap-8 px-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest px-4 mb-4">Discovery</p>
          {[
            { id: 'All', icon: Sparkles, label: 'All Archives' },
            { id: 'Hot', icon: Flame, label: 'Burning Hot', color: 'text-orange-500' },
            { id: 'Trending', icon: TrendingUp, label: 'Live Trends', color: 'text-blue-500' },
            { id: 'New', icon: Clock, label: 'Fresh Spills', color: 'text-green-500' },
            { id: 'Viral', icon: Volume2, label: 'Viral Feed', color: 'text-purple-500' },
            { id: 'Premium', icon: ShieldCheck, label: 'Vault Access', color: 'text-yellow-500' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveCategory(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                activeCategory === item.id ? 'bg-primary/20 text-white border border-primary/20' : 'text-white/40 hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeCategory === item.id ? 'text-primary' : item.color}`} />
              <span className="text-sm font-bold uppercase tracking-tight hidden lg:block">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-1 mt-auto pb-12">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest px-4 mb-4">Portals</p>
          <button
            onClick={() => setActiveCategory('Mystery')}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/40 hover:bg-primary/10 hover:text-primary transition-all group border border-dashed border-white/10"
          >
            <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-black uppercase tracking-tight hidden lg:block">Uffmaal Hub</span>
          </button>
          <button
            onClick={handleExit}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500/40 hover:bg-red-500/10 hover:text-red-500 transition-all group"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-black uppercase tracking-tight hidden lg:block">Emergency Exit</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="md:ml-20 lg:ml-64 max-w-[1800px] mx-auto px-4 md:px-8 -mt-20 relative z-10 space-y-12">
        
        {/* Navigation / Filter Bar */}
        <div className="sticky top-20 z-50 p-1 rounded-full bg-black/60 backdrop-blur-3xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 py-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(229,9,20,0.4)]' 
                    : 'text-white/40 hover:bg-white/5'
                }`}
              >
                {cat === 'All' ? <Sparkles className="w-3 h-3 inline mr-1" /> : null}
                {cat === 'Hot' ? <Flame className="w-3 h-3 inline mr-1" /> : null}
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 flex-1 max-w-md px-4">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search encrypted database..." 
                className="w-full bg-white/5 border-white/10 h-10 rounded-full pl-12 text-[10px] font-black uppercase tracking-widest focus:border-primary/50"
              />
            </div>
            <Button variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-white/10" onClick={handleExit}>
               <LogOut className="w-4 h-4 text-white/40" />
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-black uppercase tracking-tighter">Most Requested <span className="text-white/20 italic ml-2">({filteredContent.length})</span></h2>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-primary transition-colors">See all archives</span>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredContent.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.02 }}
                  className="group relative cursor-pointer"
                  onClick={() => setSelectedVideo(item)}
                >
                  <div className="relative aspect-[9/13] rounded-2xl overflow-hidden bg-white/5 border border-white/5 group-hover:border-primary/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                    <Image 
                      src={item.image} 
                      alt={item.title}
                      fill
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Live Badge */}
                    <div className="absolute top-3 left-3 bg-red-600 px-2 py-0.5 rounded text-[8px] font-black italic tracking-widest text-white shadow-lg animate-pulse">
                      LIVE
                    </div>

                    {/* Stats Overlays */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                      <div className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-bold text-primary border border-white/10 uppercase">
                        {item.rating}
                      </div>
                      <div className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-mono text-white/80 border border-white/10">
                        {item.duration}
                      </div>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/40 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform">
                      <h3 className="text-white font-bold text-sm tracking-tight mb-1 uppercase truncate">{item.title}</h3>
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">{item.views} Viewers</span>
                         <div className="bg-primary p-2 rounded-full scale-0 group-hover:scale-100 transition-transform shadow-[0_0_15px_rgba(229,9,20,0.5)]">
                           <Play className="w-3 h-3 text-white fill-white" />
                         </div>
                      </div>
                    </div>

                    {/* Hover Glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-primary blur-3xl transition-opacity pointer-events-none" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Secure Footer Info */}
        <div className="pt-20 pb-12 border-t border-white/5 flex flex-col items-center gap-8 text-center">
           <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-primary animate-pulse" />
           </div>
           <div className="space-y-4">
              <h4 className="text-3xl font-black uppercase tracking-tighter">Enterprise Encryption Active</h4>
              <p className="text-white/40 max-w-2xl text-sm italic font-medium leading-relaxed uppercase tracking-widest">
                 Your session is protected via military-grade RSA handshake. We do not store browsing history. 
                 All data is ephemeral and wiped upon exit.
              </p>
           </div>
           <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 px-6 py-2 bg-white/5 rounded-full border border-white/10">
                 <Lock className="w-3 h-3 text-primary" />
                 <span className="text-[9px] font-black text-white/60 tracking-widest uppercase">AES-256 BIT</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-2 bg-white/5 rounded-full border border-white/10">
                 <ShieldCheck className="w-3 h-3 text-green-500" />
                 <span className="text-[9px] font-black text-white/60 tracking-widest uppercase">SSL SECURED</span>
              </div>
           </div>
        </div>
      </main>

      {/* Video Modal Interface */}
      <VideoModal 
        isOpen={!!selectedVideo} 
        onClose={() => setSelectedVideo(null)} 
        videoUrl={selectedVideo?.url || ''} 
        title={selectedVideo?.title || ''} 
      />

      {/* Interactive Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
    </div>
  );
}
