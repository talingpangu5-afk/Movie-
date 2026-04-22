'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc, collection, query, where, getDocs, orderBy, limit, addDoc, getDocFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, Wallet, TrendingUp, BarChart3, Settings2, 
  Copy, Check, AlertCircle, QrCode, CreditCard,
  Zap, Database, Activity, RefreshCw, LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { QRCodeSVG } from 'qrcode.react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MiningDashboardProps {
  user: User;
}

export function MiningDashboard({ user }: MiningDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'wallet' | 'analytics' | 'subscription' | 'admin'>('dashboard');
  const isAdmin = useMemo(() => user.email === 'talingpangu5@gmail.com', [user]);
  const [stats, setStats] = useState({
    hashrateBase: 42.5,
    earnings: 0,
    minedCoins: 0,
    balance: 1000,
    livePL: 0
  });
  const [currentHashrate, setCurrentHashrate] = useState(42.5);
  const [miningSettings, setMiningSettings] = useState({
    miningSpeed: 1,
    profitFactor: 1,
    lossFactor: 1
  });
  const [logs, setLogs] = useState<any[]>([]);
  const [chartData, setChartData] = useState<number[]>(() => Array(24).fill(0).map(() => Math.random() * 100));

  // Test connection on boot
  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();
  }, []);

  // Load mining settings
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'mining'), async (snapshot) => {
      if (snapshot.exists()) {
        setMiningSettings(snapshot.data() as any);
      } else if (isAdmin) {
        // Initialize settings if they don't exist (Admin only)
        try {
          await setDoc(doc(db, 'settings', 'mining'), {
            miningSpeed: 1,
            profitFactor: 1,
            lossFactor: 1,
            updatedAt: new Date()
          });
        } catch (err) {
          console.error("Failed to initialize settings:", err);
        }
      }
    });
    return () => unsub();
  }, [isAdmin]);

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate hashrate
      const delta = (Math.random() - 0.5) * 2;
      setCurrentHashrate(prev => {
        const next = prev + delta * miningSettings.miningSpeed;
        return Math.max(30, Math.min(60, next));
      });

      // Increase earnings
      setStats(prev => {
        // ₹10/day from ₹1000 investment
        // ₹10 / 86400 seconds = ₹0.00011574 per second
        const TARGET_INR_PER_SEC = 0.00011574 * miningSettings.profitFactor;
        const BTC_EQUIVALENT = TARGET_INR_PER_SEC / 8500000;
        
        return {
          ...prev,
          earnings: prev.earnings + BTC_EQUIVALENT,
          minedCoins: prev.minedCoins + (BTC_EQUIVALENT / 2),
          livePL: prev.livePL + TARGET_INR_PER_SEC
        };
      });

      // Update chart data occasionally
      if (Math.random() > 0.9) {
        setChartData(prev => [...prev.slice(1), 50 + (Math.random() - 0.5) * 20]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [miningSettings, currentHashrate]);

  // Activity logs simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const types = ['BLOCK FOUND', 'NODE SYNC', 'REWARD CREDITED', 'SHARE ACCEPTED'];
        const type = types[Math.floor(Math.random() * types.length)];
        const newLog = {
          id: Date.now(),
          type,
          time: new Date().toLocaleTimeString(),
          value: type === 'BLOCK FOUND' ? '0.00042 BTC' : 'Confirmed'
        };
        setLogs(prev => [newLog, ...prev.slice(0, 4)]);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const lineChartData = useMemo(() => {
    if (!chartData || chartData.length === 0) return null;
    return {
      labels: Array(chartData.length).fill(''),
      datasets: [
        {
          label: 'Hashrate (TH/s)',
          data: chartData,
          borderColor: '#00ff88',
          borderWidth: 2,
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(0, 255, 136, 0.2)');
            gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');
            return gradient;
          },
          fill: true,
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointBackgroundColor: '#00ff88',
        },
      ],
    };
  }, [chartData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0b0b0b',
        titleColor: '#fff',
        bodyColor: '#00ff88',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        displayColors: false,
      }
    },
    hover: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: { 
        display: true,
        grid: { display: false },
        ticks: { display: false }
      },
      y: { 
        display: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
        ticks: { color: 'rgba(255, 255, 255, 0.3)', font: { size: 10 } }
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-64 flex flex-col gap-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'wallet', label: 'Wallet', icon: Wallet },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'subscription', label: 'Subscription', icon: CreditCard },
            ...(isAdmin ? [{ id: 'admin', label: 'Admin Panel', icon: Settings2 }] : []),
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20 scale-105' 
                  : 'hover:bg-white/5 text-white/60'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="uppercase tracking-widest text-xs">{item.label}</span>
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="Hashrate" value={`${currentHashrate.toFixed(2)} TH/s`} icon={Zap} color="text-cyan-400" />
                  <StatCard label="Miner Status" value="Running" icon={Activity} color="text-green-400" pulse />
                  <StatCard label="Daily Earnings" value={`${stats.earnings.toFixed(6)} BTC`} icon={TrendingUp} color="text-yellow-400" />
                  <StatCard label="Network Diff" value="Low" icon={Database} color="text-purple-400" />
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Live Simulation */}
                  <div className="lg:col-span-2 glass-card p-8 rounded-3xl border border-white/5 overflow-hidden group">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                          Live <span className="text-primary italic">Hashrate</span>
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
                        </h3>
                        <p className="text-sm text-white/40">Real-time mining performance</p>
                      </div>
                      <RefreshCw className="w-5 h-5 text-white/20 animate-spin-slow" />
                    </div>
                    <div className="h-64 mb-8">
                      {lineChartData ? (
                        <Line data={lineChartData} options={chartOptions} />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-white/20 uppercase tracking-widest text-xs">
                          Initializing Terminal...
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-2xl">
                        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Block Generation</p>
                        <p className="text-lg font-bold text-cyan-400">~ 8.4m</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl">
                        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Efficiency</p>
                        <p className="text-lg font-bold text-green-400">99.8%</p>
                      </div>
                    </div>
                  </div>

                  {/* Activity Logs */}
                  <div className="glass-card p-8 rounded-3xl border border-white/5">
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Recent <span className="text-primary">Logs</span></h3>
                    <div className="space-y-4">
                      {logs.map(log => (
                        <div key={log.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-xs border border-white/5">
                          <div>
                            <p className="font-bold text-primary/80">{log.type}</p>
                            <p className="text-[10px] text-white/40">{log.time}</p>
                          </div>
                          <span className="text-white/60">{log.value}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="ghost" className="w-full mt-6 text-primary hover:text-primary/80 hover:bg-primary/5 uppercase tracking-widest text-[10px] font-bold">
                      View All Logs
                    </Button>
                  </div>
                </div>

                {/* Profit/Loss Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-sm uppercase tracking-widest text-white/40 mb-2 font-bold">Trading View (₹10/Day Profit)</p>
                    <span className="text-5xl font-black text-[#00ff88] tracking-tighter">
                      +₹{stats.livePL.toFixed(4)}
                    </span>
                    <p className="text-[10px] text-white/50 mt-2 uppercase tracking-widest flex items-center gap-1 font-mono">
                      Stably growing from ₹1000 Principal
                    </p>
                  </div>
                  <div className="glass-card p-8 rounded-3xl border border-white/5 flex flex-col italic group overflow-hidden relative">
                    <div className="flex items-center justify-between mb-4 not-italic">
                      <div>
                        <p className="text-sm uppercase tracking-widest text-white/40 font-normal">Simulated ROI (₹1k Base)</p>
                        <span className="text-4xl font-black text-primary tracking-tighter">
                          {((stats.livePL / 1000) * 100).toFixed(2)}%
                        </span>
                      </div>
                      <BarChart3 className="w-8 h-8 text-primary/20 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="h-24 w-full">
                       <Line 
                        data={{
                          labels: Array(10).fill(''),
                          datasets: [{
                            data: [5, 12, 8, 15, 20, 18, 25, 22, 30, 35],
                            borderColor: '#00f2ff',
                            borderWidth: 2,
                            pointRadius: 0,
                            fill: true,
                            backgroundColor: 'rgba(0, 242, 255, 0.05)',
                            tension: 0.4
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: { x: { display: false }, y: { display: false } }
                        }}
                       />
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden not-italic">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '65%' }}
                        className="h-full bg-primary shadow-[0_0_10px_#00f2ff]"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'wallet' && <WalletView stats={stats} />}
            {activeTab === 'analytics' && <AnalyticsView chartData={chartData} />}
            {activeTab === 'subscription' && <SubscriptionView user={user} />}
            {activeTab === 'admin' && <AdminPanelView settings={miningSettings} setSettings={setMiningSettings} />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, pulse }: any) {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-primary/20 transition-all duration-500 group">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
          <Icon className={`w-5 h-5 ${pulse ? 'animate-pulse' : ''}`} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-0.5">{label}</p>
          <h4 className="text-xl font-black tracking-tight">{value}</h4>
        </div>
      </div>
    </div>
  );
}

function WalletView({ stats }: { stats: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="glass-card p-12 rounded-[2rem] text-center border border-white/5 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Wallet className="w-48 h-48 rotate-12" />
        </div>
        <p className="text-sm uppercase tracking-widest text-white/40 mb-4">Current Total Value (Base ₹1000)</p>
        <h2 className="text-7xl font-black text-white tracking-tighter mb-4">
          ₹{(1000 + stats.livePL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
        <div className="flex items-center justify-center gap-4 mb-12">
          <p className="text-xl text-primary font-mono tracking-tighter opacity-80">
            {stats.earnings.toFixed(8)} BTC
          </p>
          <span className="text-green-400 font-bold tracking-widest text-xs">+₹{stats.livePL.toFixed(2)} PROFIT</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <Button className="h-16 bg-white text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-white/90">
            Withdraw Funds
          </Button>
          <Button className="h-16 bg-primary/10 text-primary border border-primary/20 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-primary/20">
            Convert to INR
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-white/5">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Mined Today</p>
          <h4 className="text-2xl font-bold">0.00042 BTC</h4>
        </div>
        <div className="glass-card p-6 rounded-3xl border border-white/5">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Network Fee</p>
          <h4 className="text-2xl font-bold">0.00001 BTC</h4>
        </div>
        <div className="glass-card p-6 rounded-3xl border border-white/5">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Pending Balance</p>
          <h4 className="text-2xl font-bold">0.00005 BTC</h4>
        </div>
      </div>
    </motion.div>
  );
}

function AnalyticsView({ chartData }: { chartData: any[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="glass-card p-8 rounded-3xl border border-white/5">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black uppercase tracking-tighter italic">Mining <span className="text-primary">Analytics</span></h3>
          <div className="flex gap-2">
            {['24H', '7D', '30D'].map(p => (
              <button key={p} className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border border-white/10 transition-all ${p === '24H' ? 'bg-white text-black' : 'text-white/40 hover:bg-white/5'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[400px]">
          <Line 
            data={{
              labels: Array(chartData.length).fill(''),
              datasets: [{
                label: 'Global Rank',
                data: chartData.map(v => v * 1.5),
                borderColor: '#ff0055',
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: '#ff0055',
                fill: false,
              }]
            }} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { 
                y: { grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { display: false }
              }
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function SubscriptionView({ user }: { user: User }) {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', utr: '' });
  const [submitting, setSubmitting] = useState(false);

  const plans = [
    { id: '3m', name: '3 Months Starter', price: 1000, color: 'from-blue-500/20' },
    { id: '6m', name: '6 Months Professional', price: 3000, color: 'from-purple-500/20' },
    { id: '12m', name: '12 Months Ultimate', price: 5000, color: 'from-primary/20' },
  ];

  const handlePayClick = (plan: any) => {
    setSelectedPlan(plan);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.utr) return toast.error('Please fill all fields');
    
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'subscriptions'), {
        userId: user.uid,
        name: formData.name,
        utr: formData.utr,
        plan: selectedPlan.name,
        amount: selectedPlan.price,
        status: 'pending',
        createdAt: new Date()
      });
      toast.success('Payment submitted! Verification in progress.');
      setSelectedPlan(null);
      setFormData({ name: '', utr: '' });
    } catch (error) {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-4">Choose Your <span className="text-primary">Plan</span></h2>
        <p className="text-white/40 text-sm tracking-widest uppercase">Maximize your hash power with our premium subscription plans.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className={`glass-card p-8 rounded-3xl border border-white/5 bg-gradient-to-br ${plan.color} to-transparent flex flex-col h-full group hover:border-primary/40 transition-all duration-500`}>
            <h4 className="text-lg font-black uppercase tracking-tighter mb-2">{plan.name}</h4>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black tracking-tighter italic">₹{plan.price}</span>
              <span className="text-[10px] uppercase tracking-widest text-white/40">/ subscription</span>
            </div>
            
            <div className="space-y-4 mb-8 flex-1">
              {['24/7 Cloud Support', 'Priority Nodes', 'No Withdrawal Limit'].map(f => (
                <div key={f} className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white/60">
                  <Check className="w-3 h-3 text-primary" /> {f}
                </div>
              ))}
            </div>

            <Button 
              onClick={() => handlePayClick(plan)}
              className="w-full bg-white text-black font-black uppercase tracking-widest text-xs h-14 rounded-2xl hover:bg-primary transition-all group-hover:scale-[1.02]"
            >
              Subscribe Now
            </Button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-md p-8 rounded-[2rem] border border-white/10 relative"
            >
              <button 
                onClick={() => setSelectedPlan(null)}
                className="absolute top-6 right-6 text-white/40 hover:text-white"
              >
                <AlertCircle className="w-6 h-6 rotate-45" />
              </button>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-1">Pay via <span className="text-primary italic">UPI</span></h3>
                <p className="text-xs text-white/40 tracking-widest uppercase">Scan to complete payment</p>
              </div>

              <div className="bg-white p-6 rounded-2xl mx-auto w-fit mb-8 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                <QRCodeSVG 
                  value={`upi://pay?pa=8731006024-2@ybl&pn=CTPool&am=${selectedPlan.price}&cu=INR`} 
                  size={200}
                />
              </div>

              <div className="bg-white/5 p-4 rounded-2xl mb-8 flex items-center justify-between border border-white/10">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">UPI ID</span>
                  <span className="text-sm font-mono font-bold tracking-tight">8731006024-2@ybl</span>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => {
                    navigator.clipboard.writeText('8731006024-2@ybl');
                    toast.success('UPI ID Copied');
                  }}
                  className="text-primary"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input 
                  placeholder="Your Full Name" 
                  className="bg-white/5 border-white/10 h-12 rounded-xl"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input 
                  placeholder="Enter Transaction ID (UTR)" 
                  className="bg-white/5 border-white/10 h-12 rounded-xl"
                  value={formData.utr}
                  onChange={e => setFormData(prev => ({ ...prev, utr: e.target.value }))}
                />
                <Button 
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-black font-black uppercase tracking-widest h-14 rounded-2xl hover:bg-primary/90"
                >
                  {submitting ? 'Submitting...' : 'I Have Paid'}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AdminPanelView({ settings, setSettings }: any) {
  const [pendingSubs, setPendingSubs] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'subscriptions'), where('status', '==', 'pending'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setPendingSubs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    await updateDoc(doc(db, 'subscriptions', id), { status });
    toast.success(`Subscription ${status}`);
  };

  const updateSettings = async (key: string, val: number) => {
    const newSettings = { ...settings, [key]: val };
    setSettings(newSettings);
    await setDoc(doc(db, 'settings', 'mining'), { ...newSettings, updatedAt: new Date() });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
    >
      <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-8">
        <h3 className="text-xl font-black uppercase tracking-tighter">Mining <span className="text-primary italic">Controls</span></h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40">Mining Speed Multiplier ({settings.miningSpeed}x)</label>
            <input 
              type="range" min="0.1" max="5" step="0.1" 
              value={settings.miningSpeed} 
              onChange={e => updateSettings('miningSpeed', parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none accent-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40">Profit Factor ({settings.profitFactor}x)</label>
            <input 
              type="range" min="0.1" max="10" step="0.1" 
              value={settings.profitFactor} 
              onChange={e => updateSettings('profitFactor', parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none accent-green-400"
            />
          </div>
        </div>
      </div>

      <div className="glass-card p-8 rounded-3xl border border-white/5">
        <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Pending <span className="text-primary">Approvals</span></h3>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {pendingSubs.length === 0 ? (
            <p className="text-white/20 text-xs italic">No pending requests</p>
          ) : (
            pendingSubs.map(sub => (
              <div key={sub.id} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h5 className="font-bold text-sm">{sub.name}</h5>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">{sub.plan}</p>
                  </div>
                  <span className="text-primary font-black text-sm italic">₹{sub.amount}</span>
                </div>
                <div className="bg-black/40 p-2 rounded-lg mb-4 flex items-center justify-between">
                  <span className="text-[10px] text-white/40">UTR: {sub.utr}</span>
                  <button onClick={() => { navigator.clipboard.writeText(sub.utr); toast.success('UTR Copied'); }}>
                    <Copy className="w-3 h-3 text-white/40 hover:text-primary" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="h-10 hover:bg-green-500/10 hover:text-green-400" onClick={() => handleAction(sub.id, 'approved')}>Approve</Button>
                  <Button size="sm" variant="outline" className="h-10 hover:bg-red-500/10 hover:text-red-400" onClick={() => handleAction(sub.id, 'rejected')}>Reject</Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
