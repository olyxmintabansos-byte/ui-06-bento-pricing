"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Check,
  Zap,
  Shield,
  Sparkles,
  Users,
  CreditCard,
  Code2,
  Copy,
  Volume2,
  VolumeX,
  Server,
  Lock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { sound } from "@/lib/sound";

type Currency = "USD" | "IDR" | "EUR" | "BTC";

interface CurrencyConfig {
  symbol: string;
  rate: number;
  format: (val: number) => string;
}

const CURRENCIES: Record<Currency, CurrencyConfig> = {
  USD: { symbol: "$", rate: 1, format: (v) => `$${Math.round(v)}` },
  IDR: { symbol: "Rp", rate: 15800, format: (v) => `Rp ${(Math.round(v * 15800)).toLocaleString()}` },
  EUR: { symbol: "€", rate: 0.92, format: (v) => `€${Math.round(v * 0.92)}` },
  BTC: { symbol: "₿", rate: 0.000015, format: (v) => `₿${(v * 0.000015).toFixed(4)}` },
};

export const BentoPricing: React.FC = () => {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isAnnual, setIsAnnual] = useState(true);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [seats, setSeats] = useState<number>(5);
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "pro" | "enterprise">("pro");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);

  // Mouse spotlight position for Bento cards
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    sound.enabled = audioEnabled;
  }, [audioEnabled]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleToggleBilling = () => {
    const nextAnnual = !isAnnual;
    setIsAnnual(nextAnnual);
    sound.playToggle(nextAnnual);

    if (nextAnnual) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.5 },
          colors: ["#6366f1", "#a855f7", "#ec4899"],
        });
      } catch {}
    }
  };

  const handleSeatsChange = (newSeats: number) => {
    setSeats(newSeats);
    sound.playSliderTick(newSeats);
  };

  const handleCurrencyChange = (curr: Currency) => {
    setCurrency(curr);
    sound.playCurrency();
  };

  const handleCheckout = (tierName: string) => {
    sound.playCheckout();
    setCheckoutSuccess(tierName);
    try {
      confetti({
        particleCount: 65,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#10b981", "#3b82f6", "#f59e0b"],
      });
    } catch {}
    setTimeout(() => setCheckoutSuccess(null), 3000);
  };

  // Pricing Calculation
  // Base Pro is $29/seat/mo, discounted 20% on annual
  const discountMultiplier = isAnnual ? 0.8 : 1.0;
  const proBasePrice = 29 * seats * discountMultiplier;
  const starterPrice = 12 * discountMultiplier;
  const enterprisePrice = 79 * seats * discountMultiplier;

  const curr = CURRENCIES[currency];

  const componentCode = `// Interactive Bento Grid Pricing Playground
// Stack: Next.js 15, Framer Motion, Web Audio API, Tailwind CSS v4
import React, { useState } from 'react';

export function BentoPricing() {
  const [annual, setAnnual] = useState(true);
  const [seats, setSeats] = useState(5);
  const price = (annual ? 24 : 29) * seats;

  return (
    <div className="p-8 rounded-3xl bg-slate-950 border border-indigo-500/30 text-white font-mono">
      <h2 className="text-xl font-bold">Bento Grid Pricing</h2>
      <div className="my-4">
        <span>Seats: {seats}</span>
        <input type="range" min="1" max="50" value={seats} onChange={e => setSeats(+e.target.value)} />
      </div>
      <p className="text-2xl font-bold text-indigo-400">\${price} / month</p>
    </div>
  );
}`;

  const handleCopyCode = async () => {
    sound.playToggle(true);
    try {
      await navigator.clipboard.writeText(componentCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {}
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
            <CreditCard className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold font-mono tracking-wider text-slate-100 uppercase">
                Bento Grid Pricing Playground
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                UI-06
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Tactile Seat Scale Physics, Currency Matrix & Interactive Spotlight Bento
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end md:self-auto">
          {/* Audio toggle */}
          <button
            onClick={() => {
              setAudioEnabled(!audioEnabled);
              sound.playToggle(!audioEnabled);
            }}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all border ${
              audioEnabled
                ? "bg-indigo-950/60 border-indigo-500/40 text-indigo-300"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4" />}
            <span>{audioEnabled ? "HAPTICS ON" : "MUTED"}</span>
          </button>

          <button
            onClick={() => {
              sound.playToggle(true);
              setShowCodeModal(true);
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-mono bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium shadow-md shadow-indigo-950/50 transition-all cursor-pointer"
          >
            <Code2 className="w-4 h-4" />
            <span>Copy Component Code</span>
          </button>
        </div>
      </div>

      {/* Control Console: Billing Cycle & Currency & Seat Scale */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Monthly vs Annual Toggle */}
        <div className="flex flex-col space-y-2">
          <span className="text-[11px] font-mono text-slate-400">BILLING FREQUENCY</span>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleToggleBilling}
              className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer"
            >
              <div
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  !isAnnual ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Monthly
              </div>
              <div
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center space-x-1 ${
                  isAnnual ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>Annual</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-400 text-slate-950 font-bold">
                  -20%
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Currency Switcher */}
        <div className="flex flex-col space-y-2">
          <span className="text-[11px] font-mono text-slate-400">DISPLAY CURRENCY</span>
          <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-slate-950 border border-slate-800">
            {(["USD", "IDR", "EUR", "BTC"] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => handleCurrencyChange(c)}
                className={`py-1.5 rounded-xl text-xs font-mono transition text-center cursor-pointer ${
                  currency === c
                    ? "bg-indigo-500 text-white font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Seat Count Slider */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>TEAM SEATS</span>
            </span>
            <span className="text-indigo-300 font-bold">{seats} SEATS</span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={seats}
            onChange={(e) => handleSeatsChange(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>1 User</span>
            <span>25 Users</span>
            <span>50 Users</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Bento Grid with Mouse Spotlight Tracking */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* TIER 1: STARTER */}
        <div
          onClick={() => setSelectedPlan("starter")}
          className={`p-6 rounded-3xl bg-slate-900/40 border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden backdrop-blur-xl ${
            selectedPlan === "starter"
              ? "border-indigo-500/80 shadow-2xl shadow-indigo-950/40 ring-1 ring-indigo-500"
              : "border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                STARTER
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Solo Dev
              </span>
            </div>
            <div>
              <div className="text-3xl font-mono font-bold text-slate-100">
                {curr.format(starterPrice)}
                <span className="text-xs font-normal text-slate-400">/mo</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Core deployment tooling for personal pipelines.</p>
            </div>
            <ul className="space-y-2 text-xs font-mono text-slate-300 pt-2 border-t border-slate-800">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-indigo-400" />
                <span>1 Active Agent Orchestrator</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-indigo-400" />
                <span>5 GB Artifact Cache</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-indigo-400" />
                <span>Community Support</span>
              </li>
            </ul>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCheckout("Starter Plan");
            }}
            className="w-full mt-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition cursor-pointer"
          >
            SELECT STARTER
          </button>
        </div>

        {/* TIER 2: PRO SCALE (POPULAR BENTO) */}
        <div
          onClick={() => setSelectedPlan("pro")}
          className={`p-6 rounded-3xl bg-slate-900/80 border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden backdrop-blur-2xl ${
            selectedPlan === "pro"
              ? "border-indigo-400 shadow-2xl shadow-indigo-500/20 ring-2 ring-indigo-500/40"
              : "border-indigo-500/40 hover:border-indigo-400"
          }`}
        >
          {/* Popular Tag */}
          <div className="absolute top-0 right-0 px-4 py-1 bg-gradient-to-l from-indigo-500 to-purple-500 rounded-bl-2xl text-[10px] font-mono font-bold text-white tracking-widest shadow">
            MOST POPULAR
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono font-bold tracking-widest text-indigo-300 uppercase">
                PRO SCALE
              </span>
            </div>
            <div>
              <div className="text-3xl font-mono font-bold text-slate-100 flex items-baseline space-x-1">
                <span>{curr.format(proBasePrice)}</span>
                <span className="text-xs font-normal text-slate-400">/mo</span>
              </div>
              <p className="text-xs text-indigo-200/80 mt-1">
                Tuned for autonomous engineering teams ({seats} seats).
              </p>
            </div>
            <ul className="space-y-2.5 text-xs font-mono text-slate-200 pt-2 border-t border-slate-800">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Unlimited Subagent Clusters</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Real-Time Web Audio Haptics</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Automated GitHub Streak Anchor</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Priority 24/7 SLA</span>
              </li>
            </ul>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCheckout(`Pro Scale (${seats} Seats)`);
            }}
            className="w-full mt-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-mono font-bold shadow-lg shadow-indigo-500/25 transition cursor-pointer"
          >
            DEPLOY PRO SCALE
          </button>
        </div>

        {/* TIER 3: ENTERPRISE */}
        <div
          onClick={() => setSelectedPlan("enterprise")}
          className={`p-6 rounded-3xl bg-slate-900/40 border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden backdrop-blur-xl ${
            selectedPlan === "enterprise"
              ? "border-purple-500/80 shadow-2xl shadow-purple-950/40 ring-1 ring-purple-500"
              : "border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                ENTERPRISE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300">
                Custom Enclave
              </span>
            </div>
            <div>
              <div className="text-3xl font-mono font-bold text-slate-100">
                {curr.format(enterprisePrice)}
                <span className="text-xs font-normal text-slate-400">/mo</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Dedicated infrastructure & Zero-Knowledge compliance.</p>
            </div>
            <ul className="space-y-2 text-xs font-mono text-slate-300 pt-2 border-t border-slate-800">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-purple-400" />
                <span>Dedicated Sovereign VPC</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-purple-400" />
                <span>Hardware HSM Key Storage</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-purple-400" />
                <span>Custom LLM Fine-Tuning</span>
              </li>
            </ul>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCheckout("Enterprise Custom Enclave");
            }}
            className="w-full mt-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition cursor-pointer"
          >
            TALK TO ARCHITECT
          </button>
        </div>
      </div>

      {/* Bento Feature Grid Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase">Sub-Millisecond Speed</h3>
            <p className="text-[11px] text-slate-400">Ultra low-latency Web Audio & WebSocket channels.</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase">Quantum Resilient</h3>
            <p className="text-[11px] text-slate-400">Post-quantum encryption with Curve25519.</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase">Volume Tier Rebates</h3>
            <p className="text-[11px] text-slate-400">Automatic price step-downs as team seats expand.</p>
          </div>
        </div>
      </div>

      {/* Checkout Toast */}
      <AnimatePresence>
        {checkoutSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 border border-emerald-500/50 shadow-2xl flex items-center space-x-3 text-xs font-mono text-emerald-300"
          >
            <Check className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="font-bold">TRANSACTION INITIALIZED</p>
              <p className="text-[10px] text-slate-400">Selected tier: {checkoutSuccess}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Code Drawer */}
      <AnimatePresence>
        {showCodeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-mono font-bold text-slate-200">
                    BentoPricing.tsx
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-mono bg-indigo-500 hover:bg-indigo-400 text-white font-bold transition cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
                  </button>
                  <button
                    onClick={() => setShowCodeModal(false)}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="p-4 overflow-y-auto bg-slate-950 text-slate-300 font-mono text-xs leading-relaxed">
                <pre>{componentCode}</pre>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
