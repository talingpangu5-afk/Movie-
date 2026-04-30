'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, ShieldCheck, X, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface APIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (keys: any) => void;
}

export function APIKeyModal({ isOpen, onClose, onSave }: APIKeyModalProps) {
  const [showKeys, setShowKeys] = useState(false);
  const [keys, setKeys] = useState({
    apiKey: '',
    apiSecret: '',
    passphrase: ''
  });

  const handleSave = () => {
    if (!keys.apiKey || !keys.apiSecret || !keys.passphrase) {
      return toast.error('Please fill all API details');
    }
    onSave(keys);
    toast.success('KuCoin API keys linked successfully');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-[#0f0f0f] border border-white/10 rounded-[2rem] p-8 relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 blur-[80px] rounded-full" />
            
            <div className="flex items-center justify-between mb-8 relative">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Key className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">KuCoin <span className="text-primary italic text-sm">Bridge</span></h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Connect your realistic API keys</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white/40" />
              </button>
            </div>

            <div className="space-y-6 relative">
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl flex gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                <p className="text-[10px] text-yellow-500/80 leading-relaxed uppercase tracking-wider font-bold">
                  Ensure your API keys have <span className="text-white">Spot Trading</span> enabled. Keep <span className="text-white">Withdrawal</span> disabled for security.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-widest font-black ml-1">API Key</label>
                  <Input 
                    type="text"
                    placeholder="Enter KuCoin API Key"
                    value={keys.apiKey}
                    onChange={(e) => setKeys({...keys, apiKey: e.target.value})}
                    className="bg-white/5 border-white/10 h-14 rounded-xl focus:border-primary/50 transition-all font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-widest font-black ml-1">API Secret</label>
                  <div className="relative">
                    <Input 
                      type={showKeys ? 'text' : 'password'}
                      placeholder="Enter KuCoin Secret"
                      value={keys.apiSecret}
                      onChange={(e) => setKeys({...keys, apiSecret: e.target.value})}
                      className="bg-white/5 border-white/10 h-14 rounded-xl focus:border-primary/50 transition-all font-mono text-xs pr-12"
                    />
                    <button 
                      onClick={() => setShowKeys(!showKeys)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60"
                    >
                      {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-widest font-black ml-1">API Passphrase</label>
                  <Input 
                    type={showKeys ? 'text' : 'password'}
                    placeholder="Enter Passphrase"
                    value={keys.passphrase}
                    onChange={(e) => setKeys({...keys, passphrase: e.target.value})}
                    className="bg-white/5 border-white/10 h-14 rounded-xl focus:border-primary/50 transition-all font-mono text-xs"
                  />
                </div>
              </div>

              <Button 
                onClick={handleSave}
                className="w-full h-14 bg-primary text-black font-black uppercase tracking-[0.2em] text-xs rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4"
              >
                Authenticate Connection
              </Button>

              <div className="flex items-center justify-center gap-2 text-white/20">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[9px] uppercase tracking-widest font-bold">Encrypted 256-bit handshake</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
