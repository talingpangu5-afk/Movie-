import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Star, 
  Calendar, 
  Clock, 
  Globe, 
  Play, 
  Info,
  Tv
} from 'lucide-react';
import { Button } from '@/components/ui/button';

async function getShowData(id: string) {
  const res = await fetch(`https://api.tvmaze.com/shows/${id}`, {
    cache: 'no-store'
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function ShowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const show = await getShowData(id);

  if (!show) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mb-4">
          <Info className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tighter italic">Transmission Interrupted</h1>
        <p className="text-white/50 max-w-sm">The requested entertainment signal could not be localized within the digital network.</p>
        <Link href="/">
          <Button variant="outline" className="border-white/10 hover:bg-white/5 font-bold uppercase tracking-widest mt-4">
            Return to Core Hub
          </Button>
        </Link>
      </div>
    );
  }

  const stripHtml = (html?: string) => {
    if (!html) return 'No summary available.';
    return html.replace(/<[^>]*>?/gm, '');
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      {/* Dynamic Backdrop */}
      <div className="absolute top-0 left-0 w-full h-[70vh] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/60 to-transparent z-10" />
        <Image 
          src={show.image?.original || show.image?.medium || 'https://picsum.photos/seed/show/1920/1080'}
          alt={show.name}
          fill
          className="object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000"
          priority
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 backdrop-blur-3xl z-0" />
      </div>

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-20">
        <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors mb-12 group uppercase tracking-[0.2em] text-[10px] font-bold">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Poster Section */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 group">
            <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 flowing-border">
              <Image 
                src={show.image?.original || show.image?.medium || 'https://picsum.photos/seed/show/600/900'}
                alt={show.name}
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                <Button className="w-full h-14 bg-primary hover:bg-primary/80 font-black uppercase tracking-tighter italic text-lg rounded-2xl group/btn overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Play className="w-6 h-6 fill-current" />
                    Initialize Stream
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </Button>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {show.genres?.map((genre: string) => (
                <span key={genre} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60">
                  {genre}
                </span>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded">
                  Internal Transmission
                </div>
                {show.status && (
                  <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Status: {show.status}
                  </div>
                )}
              </div>
              <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter italic leading-none text-white transition-all">
                {show.name}
              </h1>
            </div>

            <div className="flex flex-wrap gap-8 py-6 border-y border-white/5">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 italic">Rating</p>
                <div className="flex items-center gap-2 text-primary font-black text-xl italic leading-none">
                  <Star className="w-5 h-5 fill-current" />
                  {show.rating?.average || '8.5'}/10
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 italic">Premiered</p>
                <div className="flex items-center gap-2 text-white font-black text-xl italic leading-none">
                  <Calendar className="w-5 h-5 text-white/40" />
                  {show.premiered?.split('-')[0] || 'Unknown'}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 italic">Runtime</p>
                <div className="flex items-center gap-2 text-white font-black text-xl italic leading-none">
                  <Clock className="w-5 h-5 text-white/40" />
                  {show.averageRuntime || '45'}m
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 italic">Network</p>
                <div className="flex items-center gap-2 text-white font-black text-xl italic leading-none uppercase tracking-tight">
                  <Globe className="w-5 h-5 text-white/40" />
                  {show.network?.name || show.webChannel?.name || 'Taling Pangu'}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-3">
                <Tv className="w-6 h-6 text-primary" />
                Data Summary
              </h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-white/70 leading-relaxed font-medium">
                  {stripHtml(show.summary)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
              <Button className="h-16 bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-xs rounded-2xl">
                Add to Transmission List
              </Button>
              <Button variant="outline" className="h-16 border-white/10 hover:bg-white/5 font-black uppercase tracking-widest text-xs rounded-2xl">
                Share Digital Signal
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-primary/20 z-50">
        <div className="h-full bg-primary animate-[shimmer_2s_infinite_linear]" style={{ width: '30%' }} />
      </div>
    </div>
  );
}
