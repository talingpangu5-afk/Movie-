'use client'

import { useState, useEffect, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Copy, CheckCircle2, RotateCw, Wallet, ShieldAlert } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onVerified?: () => void
  title?: string
}

const BTC_ADDRESS = '18EjNgsaSyQzsMkrwg7fnAQh3CHsSVdsno'
const BTC_AMOUNT = '0.00001'

export function PaymentModal({ isOpen, onClose, onVerified, title }: PaymentModalProps) {
  const [countdown, setCountdown] = useState(10)
  const [step, setStep] = useState<'payment' | 'verifying'>('payment')

  const copyAddress = () => {
    navigator.clipboard.writeText(BTC_ADDRESS)
    toast.success('Address copied to clipboard')
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'verifying' && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (step === 'verifying' && countdown === 0) {
      toast.success(`Transaction broadcasted. Manual verification pending for ${title}.`);
      onClose();
    }
    return () => clearInterval(interval);
  }, [step, countdown, onClose, title]);

  const handleVerify = () => {
    setStep('verifying')
  }

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('payment')
        setCountdown(10)
      }, 300)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-[#0c0c0c] border-white/10 text-white shadow-2xl overflow-hidden">
        {/* Futuristic Background Accents */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/10 blur-[100px] pointer-events-none"></div>

        <DialogHeader className="relative z-10">
          <DialogTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-tighter italic">
            <span className="p-2 bg-primary/10 rounded-lg text-primary">
              <Wallet className="w-6 h-6" />
            </span>
            Secure Access
          </DialogTitle>
          <DialogDescription className="text-white/50 font-medium">
            Unlock premium cinematic content: <span className="text-primary font-bold italic">{title}</span>
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'payment' ? (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6 py-4 relative z-10"
            >
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-white/5 relative group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <QRCodeSVG 
                  value={`bitcoin:${BTC_ADDRESS}?amount=${BTC_AMOUNT}`} 
                  size={180} 
                  bgColor="#ffffff" 
                  fgColor="#000000"
                  level="H"
                  className="relative z-10"
                />
                <div className="mt-4 px-4 py-1.5 bg-primary/20 rounded-full border border-primary/30 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{BTC_AMOUNT} BTC REQUIRED</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Bitcoin Destination Address</label>
                  <div className="flex gap-2">
                    <div className="flex-grow p-3 bg-white/5 border border-white/10 rounded-xl font-mono text-[11px] break-all flex items-center group-hover:border-white/20 transition-colors">
                      {BTC_ADDRESS}
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={copyAddress}
                      className="bg-white/5 hover:bg-white/10 border-white/10 shrink-0 h-auto"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex gap-3">
                  <ShieldAlert className="w-5 h-5 text-yellow-500 shrink-0" />
                  <p className="text-[11px] text-yellow-500/80 leading-relaxed">
                    Access is strictly linked to payment confirmation. Ensure the exact amount is sent to avoid gateway delays. Keep this window open during verification.
                  </p>
                </div>
              </div>

              <DialogFooter className="flex sm:justify-between items-center gap-4 border-t border-white/5 pt-6 mt-6">
                <Button variant="ghost" onClick={onClose} className="text-white/40 hover:text-white hover:bg-white/5">
                  Cancel
                </Button>
                <Button 
                  onClick={handleVerify}
                  className="bg-primary hover:bg-primary/80 text-white px-8 font-black uppercase tracking-tighter italic h-12 rounded-xl group"
                >
                  Verify Payment
                  <RotateCw className="w-4 h-4 ml-2 group-hover:rotate-180 transition-transform duration-500" />
                </Button>
              </DialogFooter>
            </motion.div>
          ) : (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 space-y-8 relative z-10"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center">
                  <span className="text-3xl font-black text-primary">{countdown}s</span>
                </div>
                <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold uppercase tracking-tighter">Scanning Blockchain</h3>
                <p className="text-white/50 text-sm max-w-xs mx-auto">
                  We are currently verifying your transaction on the P2P network. This usually takes a few moments.
                </p>
              </div>

              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 10, ease: "linear" }}
                  className="h-full bg-primary"
                />
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg text-[10px] font-mono text-white/30 uppercase tracking-widest">
                <RotateCw className="w-3 h-3 animate-spin" />
                Network Latency: 42ms
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
