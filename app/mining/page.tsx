'use client';

import React, { useState, useEffect } from 'react';
import { MiningDashboard } from '@/components/mining/MiningDashboard';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User, getAdditionalUserInfo } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { Cpu, Lock, AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function MiningPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });

    const initConnection = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        await fetch('/api/mining/start', { 
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // Slow down slightly for visual feedback of "secure connection"
        setTimeout(() => setIsConnecting(false), 1500);
      } catch (error) {
        toast.error('Failed to establish secure tunnel to API');
        setIsConnecting(false);
      }
    };

    initConnection();
    return () => unsubscribe();
  }, []);

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex flex-col items-center justify-center space-y-6">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
        <div className="text-center space-y-2">
          <h2 className="text-xl font-black uppercase tracking-[0.3em] text-white animate-pulse">Initializing Tunnel</h2>
          <p className="text-xs text-white/40 uppercase tracking-widest">Establishing encrypted handshake with API endpoint...</p>
        </div>
      </div>
    );
  }

  return <MiningDashboard user={user} />;
}
