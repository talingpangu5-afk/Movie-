'use client';

import React, { useState, useEffect } from 'react';
import { MiningDashboard } from '@/components/mining/MiningDashboard';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { Cpu, Lock } from 'lucide-react';

export default function MiningPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 border border-white/10 rounded-3xl"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Cpu className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">
              Mining <span className="text-primary italic">Platform</span>
            </h1>
            <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
              Join the most advanced cloud mining network. Start earning real-time mining rewards 
              with our state-of-the-art simulation and hardware integration.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={handleLogin}
                size="lg" 
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-black font-bold px-10 h-14 rounded-xl text-lg shadow-2xl shadow-primary/20 transition-all hover:scale-105"
              >
                <Lock className="w-5 h-5 mr-3" />
                LOGIN WITH GOOGLE
              </Button>
              <Button 
                onClick={handleLogin}
                variant="outline"
                size="lg" 
                className="w-full sm:w-auto border-white/20 text-white hover:bg-white/5 font-bold px-10 h-14 rounded-xl text-lg transition-all hover:scale-105"
              >
                CREATE ACCOUNT
              </Button>
            </div>
            <p className="mt-8 text-xs text-white/30 uppercase tracking-widest font-bold">
              Secure one-click authentication powered by Firebase Auth
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return <MiningDashboard user={user} />;
}
