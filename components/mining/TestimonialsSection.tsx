'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, User, ShieldCheck, CheckCircle2, Globe, ArrowRight } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "User ID #1021",
    country: "India",
    flag: "🇮🇳",
    rating: 5,
    plan: "Basic ₹1000",
    text: "Basic ₹1000 plan se start kiya, dashboard simple hai aur tracking clear hai.",
    color: "from-blue-500/20"
  },
  {
    id: 2,
    name: "User ID #2045",
    country: "UAE",
    flag: "🇦🇪",
    rating: 4,
    plan: "Pro ₹3000",
    text: "Pro ₹3000 plan pe upgrade kiya, performance smooth hai aur UI fast hai.",
    color: "from-purple-500/20"
  },
  {
    id: 3,
    name: "User ID #3099",
    country: "USA",
    flag: "🇺🇸",
    rating: 5,
    plan: "Elite ₹5000",
    text: "Elite ₹5000 plan me features zyada milte hain, experience premium lagta hai.",
    color: "from-primary/20"
  },
  {
    id: 4,
    name: "Verified User",
    country: "UK",
    flag: "🇬🇧",
    rating: 5,
    plan: "Pro ₹3000",
    text: "Reliable service. The automated mining process actually works as described.",
    color: "from-purple-500/20"
  },
  {
    id: 5,
    name: "User ID #4122",
    country: "India",
    flag: "🇮🇳",
    rating: 5,
    plan: "Elite ₹5000",
    text: "Customer support is very helpful. Elite plan benefits are worth the subscription.",
    color: "from-primary/20"
  }
];

const activityTicker = [
  "User from India subscribed to ₹1000 plan",
  "User from UAE upgraded to ₹3000 plan",
  "New Elite ₹5000 subscription from USA",
  "User from UK started Pro ₹3000 plan",
  "1,245 Active Users currently mining",
  "Verified Users: 98% satisfaction rate"
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-24 space-y-16">
      {/* Live Activity Ticker */}
      <div className="relative w-full overflow-hidden bg-white/5 backdrop-blur-sm border-y border-white/10 py-3">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex whitespace-nowrap gap-12 items-center"
        >
          {[...activityTicker, ...activityTicker, ...activityTicker].map((text, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/60 select-none">
                {text}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Section Header */}
      <div className="text-center space-y-4 px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic"
        >
          🌟 What Our <span className="text-primary">Global Users</span> Say
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-white/40 text-sm md:text-base tracking-widest uppercase max-w-2xl mx-auto"
        >
          Trusted by users worldwide with real-time experience
        </motion.p>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-8 px-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Verified Users</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Secure Subscription System</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
          <Globe className="w-4 h-4 text-blue-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Global Coverage</span>
        </div>
      </div>

      {/* Reviews Grid/Carousel */}
      <div className="relative px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {reviews.slice(currentIndex % 3, (currentIndex % 3) + 3).length === 3 ? (
               reviews.slice(currentIndex % 3, (currentIndex % 3) + 3).map((review, i) => (
                <ReviewCard key={review.id} review={review} index={i} />
              ))
            ) : (
                [...reviews.slice(currentIndex % 3), ...reviews.slice(0, 3 - reviews.slice(currentIndex % 3).length)].map((review, i) => (
                  <ReviewCard key={review.id} review={review} index={i} />
                ))
            )}
          </AnimatePresence>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center mt-12 gap-2">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${currentIndex === i ? 'w-8 bg-primary shadow-[0_0_10px_#00f2ff]' : 'w-2 bg-white/10'}`}
            />
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="flex flex-col items-center gap-6 px-4">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(0, 242, 255, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-8 py-5 bg-primary text-black font-black uppercase tracking-[0.2em] text-sm rounded-2xl flex items-center gap-3 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          Join Now & Start Your Plan
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </motion.button>
        
        <p className="text-[10px] text-white/30 uppercase tracking-[0.1em] font-medium text-center">
          All reviews are based on user experience (no guaranteed returns)
        </p>
      </div>
    </div>
  );
}

function ReviewCard({ review, index }: { review: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, borderColor: "rgba(0, 242, 255, 0.3)" }}
      className={`glass-card p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br ${review.color} to-transparent flex flex-col h-full relative group transition-all duration-500`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-lg">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-white text-sm uppercase tracking-widest">{review.name}</h4>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs">{review.flag}</span>
              <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold">{review.country}</span>
            </div>
          </div>
        </div>
        <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
          <span className="text-[9px] font-black text-primary uppercase tracking-widest italic">{review.plan}</span>
        </div>
      </div>

      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} />
        ))}
      </div>

      <p className="text-white/70 text-sm italic leading-relaxed flex-1">
        &quot;{review.text}&quot;
      </p>

      <div className="mt-6 flex items-center gap-2 pt-6 border-t border-white/5 opacity-40">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span className="text-[8px] uppercase tracking-widest font-bold">Transaction Confirmed</span>
      </div>
    </motion.div>
  );
}
