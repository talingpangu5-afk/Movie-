'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, TrendingDown, Info, 
  BarChart3, Activity, ArrowUpRight,
  ShieldAlert, Settings2
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
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

interface PlanConfig {
  id: string;
  name: string;
  label: string;
  price: number;
  risk: 'Low' | 'Medium' | 'High';
  range: number; // e.g. 2 means -2% to +2%
  color: string;
}

const PLAN_CONFIGS: PlanConfig[] = [
  { id: '3m', name: '3 Months Starter', label: 'Basic', price: 1000, risk: 'Low', range: 2, color: '#3b82f6' },
  { id: '6m', name: '6 Months Pro', label: 'Standard', price: 3000, risk: 'Medium', range: 3, color: '#a855f7' },
  { id: '12m', name: '12 Months Ultimate', label: 'Premium', price: 5000, risk: 'High', range: 5, color: '#00f2ff' },
];

export function PLSimulationPanel({ isAdmin, settings }: { isAdmin?: boolean, settings?: any }) {
  const [activePlanId, setActivePlanId] = useState(PLAN_CONFIGS[0].id);
  const activePlan = useMemo(() => PLAN_CONFIGS.find(p => p.id === activePlanId)!, [activePlanId]);
  
  const [simData, setSimData] = useState({
    todayPL: 0,
    totalProfit: 0,
    currentBalance: 0,
    growthPercent: 0,
    history: [] as number[]
  });

  // Initialize balance based on plan price
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSimData({
      todayPL: 0,
      totalProfit: 0,
      currentBalance: activePlan.price,
      growthPercent: 45, // Starting visual progress
      history: Array(20).fill(0).map((_, i) => activePlan.price * (1 + (Math.random() - 0.5) * 0.05))
    });
  }, [activePlanId, activePlan.price]);

  // Simulation Loop
  useEffect(() => {
    if (settings?.isSimulationPaused) return;

    const interval = setInterval(() => {
      setSimData(prev => {
        // Daily fluctuation simulation (small increments for visual effect)
        // Range is +/- activePlan.range %
        const rangeBoost = settings?.simulationRangeBoost || 1;
        const profitBias = settings?.simulationProfitBias || 0;
        
        // Base fluctuation +/- plan range
        const baseFluctuation = (Math.random() - 0.5) * (activePlan.range / 100);
        // Add bias (scaled down for per-tick application)
        const biasedFluctuation = baseFluctuation + (profitBias / 500); 
        
        const fluctuation = biasedFluctuation * 0.1 * rangeBoost;
        const delta = prev.currentBalance * fluctuation;
        const nextBalance = prev.currentBalance + delta;
        const totalP = nextBalance - activePlan.price;
        const todayP = delta * 15; // Scaled up for "Today&apos;s P&L" feel

        return {
          ...prev,
          todayPL: todayP,
          totalProfit: totalP,
          currentBalance: nextBalance,
          growthPercent: Math.min(75, prev.growthPercent + (Math.random() * 0.01)), // Creep towards 75%
          history: [...prev.history.slice(1), nextBalance]
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [activePlanId, activePlan.range, activePlan.price, settings?.isSimulationPaused, settings?.simulationRangeBoost, settings?.simulationProfitBias]);

  const lineChartData = {
    labels: Array(simData.history.length).fill(''),
    datasets: [
      {
        data: simData.history,
        borderColor: simData.todayPL >= 0 ? '#10b981' : '#ef4444',
        borderWidth: 2,
        fill: true,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 100);
          gradient.addColorStop(0, simData.todayPL >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          return gradient;
        },
        tension: 0.4,
        pointRadius: 0,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } }
  };

  return (
    <div className="space-y-8 mt-12 mb-12">
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-black uppercase tracking-tighter italic">
          Yield <span className="text-primary">Simulator</span>
        </h3>
        <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">
          Market Performance Visualizer (72H Simulation)
        </p>
      </div>

      {/* Plan Selector Tabs */}
      <div className="flex justify-center gap-2 max-w-xl mx-auto p-1.5 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-sm">
        {PLAN_CONFIGS.map(plan => (
          <button
            key={plan.id}
            onClick={() => setActivePlanId(plan.id)}
            className={`flex-1 py-3 px-4 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
              activePlanId === plan.id 
                ? 'bg-primary text-black shadow-lg shadow-primary/20 scale-105' 
                : 'text-white/40 hover:bg-white/5 hover:text-white'
            }`}
          >
            {plan.label} {plan.price}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Main Stats Card */}
        <div className="md:col-span-2 glass-card p-10 rounded-[3rem] border border-white/5 bg-gradient-to-br from-white/5 via-transparent to-transparent flex flex-col justify-between group overflow-hidden relative">
          {/* Animated Background Glow */}
          <div className={`absolute -top-24 -right-24 w-64 h-64 blur-[100px] transition-colors duration-1000 ${
            simData.todayPL >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'
          }`} />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                  activePlan.risk === 'Low' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                  activePlan.risk === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                  'bg-red-500/10 text-red-500 border-red-500/20'
                }`}>
                  Risk Level: {activePlan.risk}
                </div>
                <div className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse">
                  Up To 75% Growth Potential
                </div>
              </div>
              
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black mb-2">Current Simulated Balance</p>
                <h2 className="text-6xl font-black tracking-tighter text-white">
                  ₹{simData.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
              </div>
            </div>

            <div className="text-right space-y-2">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black">Today&apos;s P&L</p>
              <div className={`flex items-center justify-end gap-2 text-2xl font-black ${simData.todayPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {simData.todayPL >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                {simData.todayPL >= 0 ? '+' : ''}₹{simData.todayPL.toFixed(2)}
              </div>
              <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Simulated Multiplier {activePlan.range}%</p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Total Profit</p>
              <p className={`text-xl font-black italic ${simData.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {simData.totalProfit >= 0 ? '+' : ''}₹{simData.totalProfit.toFixed(2)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Invested Amount</p>
              <p className="text-xl font-black italic text-white/80">₹{activePlan.price.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Profit Percentage</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(0, Math.min(100, (simData.totalProfit / activePlan.price) * 100 + 50))}%` }}
                    className={`h-full transition-colors duration-500 ${simData.totalProfit >= 0 ? 'bg-green-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`}
                  />
                </div>
                <span className={`text-xs font-black italic ${simData.totalProfit >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                  {((simData.totalProfit / activePlan.price) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Meter & Mini Graph */}
        <div className="space-y-6">
          {/* Progress Bar (Circular Meter equivalent) */}
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-b from-white/5 to-transparent h-1/2 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Potential Growth</p>
                <h4 className="text-xl font-black uppercase tracking-tighter italic">System <span className="text-primary">Limit</span></h4>
              </div>
              <ArrowUpRight className="w-5 h-5 text-primary opacity-40" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-4xl font-black tracking-tighter text-white italic">{simData.growthPercent.toFixed(1)}%</span>
                <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-1">Max 75.0%</span>
              </div>
              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(simData.growthPercent / 75) * 100}%` }}
                  className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary shadow-[0_0_15px_#00f2ff]"
                />
              </div>
              <p className="text-[9px] text-white/30 uppercase tracking-widest font-medium leading-relaxed">
                Growth models based on historical market cycles. Simulation capped for risk assessment.
              </p>
            </div>
          </div>

          {/* Mini Performance Graph */}
          <div className="glass-card p-6 rounded-[2.5rem] border border-white/5 bg-black h-[calc(50%-1.5rem)] relative overflow-hidden group">
            <div className="absolute top-4 left-6 z-10">
              <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-0.5">Real-time Performance</p>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-primary animate-pulse" />
                <span className="text-[10px] font-black text-white italic tracking-tighter uppercase">Market Feed</span>
              </div>
            </div>
            <div className="absolute inset-0 pt-12">
               <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="max-w-4xl mx-auto p-6 bg-red-500/5 rounded-3xl border border-red-500/10 flex items-start gap-4">
        <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 mt-1" />
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1 flex items-center gap-2">
             Security Compliance Disclaimer
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-red-500" />
              <p className="text-[9px] text-white/40 font-bold uppercase tracking-tight">Simulated educational model</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-red-500" />
              <p className="text-[9px] text-white/40 font-bold uppercase tracking-tight">No profit guaranteed</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-red-500" />
              <p className="text-[9px] text-white/40 font-bold uppercase tracking-tight">Market risk assessment required</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
