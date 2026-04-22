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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  return <MiningDashboard user={user} />;
}
