'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'motion/react';
import { 
  ChevronRight, 
  TrendingUp, 
  ShieldCheck, 
  Wallet, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  Globe,
  Zap,
  Lock,
  MessageSquare,
  HelpCircle,
  CircleDollarSign,
  Briefcase,
  PieChart,
  Trophy,
  Star,
  Copy,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import Image from 'next/image';

export default function BlogPage() {
  const affiliateLink = "https://www.kucoin.com/ucenter/signup?rcode=rM66UX1&utm_source=app_g_Share";
  const referralCode = "rM66UX1";

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const labels = [
    "KuCoin Affiliate Signup", 
    "Crypto Review 2026", 
    "Passive Income", 
    "Bitcoin Trading", 
    "KuCoin Bonus", 
    "Best Crypto Exchange", 
    "Financial Freedom",
    "KuCoin Passive Income"
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    alert('Referral code copied!');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-[#23d1ae] selection:text-black">
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#23d1ae] z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Floating Join Button for Mobile/Scroll */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-8 right-8 z-50 md:hidden"
      >
        <Link 
          href={affiliateLink}
          target="_blank"
          className="flex items-center gap-2 px-6 py-4 bg-[#23d1ae] text-black font-black rounded-full shadow-2xl shadow-[#23d1ae]/40"
        >
          JOIN NOW <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>

      {/* Hero Section */}
      <header className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#23d1ae]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            {/* KuCoin Logo */}
            <div className="inline-flex items-center gap-4 mb-8 px-5 py-2.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl shadow-2xl">
              <div className="relative w-10 h-10">
                <Image 
                  src="https://www.kucoin.com/favicon.ico" 
                  alt="KuCoin Logo" 
                  width={40} 
                  height={40} 
                  className="rounded-xl brightness-125 contrast-125 shadow-[0_0_15px_rgba(35,209,174,0.5)]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-white font-black tracking-tighter text-2xl">KUCOIN</span>
                <span className="text-[#23d1ae] text-[10px] font-black uppercase tracking-[0.3em]">The People&apos;s Exchange</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] mb-8 tracking-tighter">
              The <span className="text-[#23d1ae] italic">Ultimate</span> KuCoin Guide (2026): Master the Giant.
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              Why thousands are switching to the &quot;People&apos;s Exchange&quot; for passive income, zero-effort trading, and global financial freedom.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {labels.map((label, index) => (
                <span key={index} className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-[#23d1ae]">
                  #{label.replace(/\s+/g, '')}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href={affiliateLink}
                target="_blank"
                className="group relative w-full sm:w-auto px-10 py-5 bg-[#23d1ae] text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(35,209,174,0.4)] overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">Sign Up & Claim Bonus <ChevronRight className="w-5 h-5" /></span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>

              <div className="flex items-center gap-4 px-6 py-5 bg-white/5 border border-white/10 rounded-2xl">
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Referral Code</p>
                  <p className="text-xl font-mono font-black text-[#23d1ae]">{referralCode}</p>
                </div>
                <button 
                  onClick={handleCopyCode}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Copy className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 animate-bounce">
          <span className="text-[10px] uppercase tracking-[0.3em] font-black">Scroll Down</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-6 pb-32 max-w-5xl">
        <div className="relative aspect-[16/7] w-full rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl mb-24">
          <Image 
            src="https://images.unsplash.com/photo-1621504450181-5d356f63d3ee?q=80&w=2000&auto=format&fit=crop" 
            alt="Advanced Trading Interface"
            fill
            className="w-full h-full object-cover grayscale brightness-50 contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[#23d1ae]/5" />
          <div className="absolute bottom-12 left-12 right-12 text-left">
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
              Real-Time Global Markets. <br />At Your <span className="text-[#23d1ae]">Command</span>.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16">
          {/* Article Pillar */}
          <article className="max-w-none">
            
            <p className="text-2xl font-medium text-white/90 leading-relaxed mb-12">
              In the fast-moving digital economy of 2026, staying on the sidelines is no longer an option. As inflation erodes traditional savings, more investors are turning to crypto not just as a gamble, but as a <span className="text-[#23d1ae] underline decoration-2 underline-offset-4">strategic pillar of wealth</span>.
            </p>

            <section className="mb-12">
              <h2 id="what-is-kucoin" className="text-3xl font-black text-white mb-6 tracking-tighter">What is KuCoin? The 2026 Perspective</h2>
              <div className="space-y-4 text-gray-400 text-lg leading-relaxed mb-8">
                <p>
                  Launched on September 15, 2017, KuCoin has grown from a humble trading platform into a massive global conglomerate known as the &quot;People&apos;s Exchange.&quot; With over 20 million users globally, it is consistently ranked as a top-3 exchange by volume and trust scores.
                </p>
                <p>
                  What sets KuCoin apart in 2026 is its unique balance of professional-grade tools and beginner-friendly passive income streams. It&apos;s the only platform where you can find early-stage &quot;moon shots&quot; alongside institutional-grade liquidity.
                </p>
              </div>

              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 my-10 group">
                <Image 
                  src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2664&auto=format&fit=crop" 
                  alt="Blockchain Visualization" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                  <p className="text-[#23d1ae] font-bold text-sm tracking-widest uppercase">KuCoin ecosystem</p>
                  <p className="text-white text-lg font-medium">A borderless world of crypto possibilities.</p>
                </div>
              </div>
            </section>

            <div className="my-16 p-10 bg-white/5 rounded-[2.5rem] border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#23d1ae]/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <h3 className="text-2xl font-black mb-6 flex items-center gap-3 text-white">
                <Star className="text-[#23d1ae] fill-[#23d1ae]" /> Why KuCoin is Dominating 2026
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[#23d1ae] font-bold">Unmatched Asset Listing</h4>
                  <p className="text-sm text-gray-400">Over 700+ high-quality coins. Be the first to discover gems before they hit the larger, more restricted exchanges.</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[#23d1ae] font-bold">Hyper-Liquid Markets</h4>
                  <p className="text-sm text-gray-400">Trade with zero friction. Whether you&apos;re a whale or a minnow, your orders fill at the best possible prices.</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[#23d1ae] font-bold">AI Trading Bots</h4>
                  <p className="text-sm text-gray-400">Our bots never sleep. Automate complex strategies like Grid, DCA, and Infinity Grid with one click.</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[#23d1ae] font-bold">Bank-Grade Security</h4>
                  <p className="text-sm text-gray-400">Multisig wallets, 2FA, anti-phishing codes, and regular proof-of-reserve audits.</p>
                </div>
              </div>
            </div>

            <section className="mb-12">
              <h2 id="earning-methods" className="text-3xl font-black text-white mb-6 tracking-tighter">The 4 Pillars of Earning on KuCoin</h2>
              <p className="text-gray-400 text-lg mb-8">
                Passive income is the goal. Active trading is the engine. KuCoin provides both in a high-octane environment designed for results.
              </p>

              <div className="space-y-12">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3"><Zap className="text-orange-500" /> 1. Spot & Futures Trading</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    KuCoin&apos;s trading engine handles millions of transactions per second. For the active trader, the fees are incredibly low (starting at 0.1%). If you want to leverage your conviction, KuCoin Futures allows up to 100x leverage on major pairs.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3"><Wallet className="text-[#23d1ae]" /> 2. KuCoin Earn: The Wealth Engine</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    This is the crown jewel of the exchange. Don&apos;t let your coins sit idle. Stake them. KuCoin Earn offers flexible and fixed staking on everything from Bitcoin to stablecoins.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3"><Users className="text-blue-500" /> 3. The Elite Affiliate Program</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    This is the hidden gem for creators. By joining the KuCoin Affiliate program, you earn a substantial cut of the trading fees generated by anyone you refer—forever.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3"><CircleDollarSign className="text-yellow-500" /> 4. KuCoin Spotlight (IEOs)</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Get in at the ground floor. Spotlight is KuCoin&apos;s launchpad where users can participate in Initial Exchange Offerings of groundbreaking projects.
                  </p>
                </div>
              </div>
            </section>

            {/* Special Callout */}
            <div className="my-16 p-1 bg-gradient-to-r from-[#23d1ae] to-blue-500 rounded-[2.5rem]">
              <div className="bg-[#050505] p-10 rounded-[2.4rem] text-center">
                <div className="w-16 h-16 bg-[#23d1ae]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-8 h-8 text-[#23d1ae]" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4">Join the 1% Today</h3>
                <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                  The difference between a watcher and a winner is the decision to start. Use the verified signup link below to secure your 2026 welcome bonus.
                </p>
                <Link 
                  href={affiliateLink}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-10 py-5 bg-[#23d1ae] text-black font-black uppercase tracking-widest rounded-2xl hover:shadow-[0_0_50px_rgba(35,209,174,0.5)] transition-all"
                >
                  Start Your Journey <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <section className="mb-12">
              <h2 id="security" className="text-3xl font-black text-white mb-6 tracking-tighter">Is KuCoin Safe?</h2>
              <p className="text-gray-400 text-lg mb-6">
                Safety isn&apos;t just a feature; it&apos;s a promise. KuCoin implements a multi-layered security strategy:
              </p>
              <ul className="space-y-4 text-gray-400 text-lg">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#23d1ae] flex-shrink-0 mt-0.5" />
                  <span><strong>Asset Isolation:</strong> User funds are never commingled with operating capital.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#23d1ae] flex-shrink-0 mt-0.5" />
                  <span><strong>Proof of Reserves:</strong> Regular, transparent audits that YOU can verify on-chain.</span>
                </li>
              </ul>
            </section>

            <section className="mb-24">
              <h2 id="faq" className="text-3xl font-black text-white mb-8 tracking-tighter flex items-center gap-4">
                <HelpCircle className="w-8 h-8 text-[#23d1ae]" /> FAQ
              </h2>
              <div className="space-y-4">
                {[
                  { 
                    q: "How do I sign up for the affiliate program?", 
                    a: "Simply create an account via our link, head to your profile, and select 'Affiliate' to generate your own earning links." 
                  },
                  { 
                    q: "What is the best way to earn passive income?", 
                    a: "KuCoin Earn is the most reliable. We recommend starting with stablecoin staking (USDT) for lower risk." 
                  },
                  { 
                    q: "Is KuCoin better than Binance in 2026?", 
                    a: "While both are giants, KuCoin is often preferred for its selection of low-cap gems and rewards." 
                  }
                ].map((item, i) => (
                  <details key={i} className="group p-6 bg-white/5 border border-white/10 rounded-2xl transition-all hover:bg-white/10">
                    <summary className="flex items-center justify-between cursor-pointer font-bold text-white list-none">
                      {item.q}
                      <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
                    </summary>
                    <p className="mt-4 text-gray-400 text-sm leading-relaxed border-t border-white/10 pt-4">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
            
            <div className="text-center pb-24 border-t border-white/10 pt-24">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] text-white">The Future Doesn&apos;t Wait. <br />Why Should <span className="text-[#23d1ae]">You</span>?</h2>
              <p className="text-xl text-gray-500 mb-12 max-w-xl mx-auto italic">
                &quot;The best time to plant a tree was 20 years ago. The second best time is now.&quot;
              </p>
              <div className="flex flex-col items-center gap-6">
                <Link 
                  href={affiliateLink}
                  target="_blank"
                  className="w-full md:w-auto px-16 py-6 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all text-xl shadow-2xl"
                >
                  JOIN KUCOIN NOW
                </Link>
                <p className="text-[#23d1ae] font-mono font-bold text-sm tracking-widest animate-pulse border border-[#23d1ae]/30 px-4 py-2 rounded-full">
                  REFERRAL CODE: {referralCode}
                </p>
              </div>
            </div>

          </article>

          {/* Sidebar */}
          <aside className="space-y-12 h-fit lg:sticky lg:top-32">
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
              <h4 className="text-lg font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#23d1ae]" /> Market Stats
              </h4>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-gray-500 text-sm">Users</span>
                  <span className="text-white font-bold">20M+</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-gray-500 text-sm">Coins Listed</span>
                  <span className="text-white font-bold">700+</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-gray-500 text-sm">Daily Volume</span>
                  <span className="text-white font-bold">$2.5B+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Trust Score</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-[#23d1ae] fill-[#23d1ae]" />)}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-[#23d1ae]/30 to-transparent border border-[#23d1ae]/20 rounded-3xl">
              <h4 className="text-lg font-black text-white mb-4">Quick Start</h4>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Unlock exclusive rewards by signing up through a verified affiliate link.
              </p>
              <Link 
                href={affiliateLink}
                target="_blank"
                className="block w-full py-4 bg-[#23d1ae] text-black text-center font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(35,209,174,0.3)] transition-all"
              >
                Claim My Bonus
              </Link>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
              <h4 className="text-sm font-black text-gray-500 mb-4 uppercase tracking-widest">In this article</h4>
              <nav className="space-y-3">
                <a href="#what-is-kucoin" className="block text-sm text-gray-400 hover:text-[#23d1ae] transition-colors">What is KuCoin?</a>
                <a href="#earning-methods" className="block text-sm text-gray-400 hover:text-[#23d1ae] transition-colors">Earning Methods</a>
                <a href="#security" className="block text-sm text-gray-400 hover:text-[#23d1ae] transition-colors">Platform Security</a>
                <a href="#faq" className="block text-sm text-gray-400 hover:text-[#23d1ae] transition-colors">FAQ</a>
              </nav>
            </div>
          </aside>
        </div>
      </main>

    </div>
  );
}
