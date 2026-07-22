"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, Code2, Terminal, FolderGit2, Mail, CheckCircle2, Copy } from "lucide-react";

export default function HeroSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyCommand = () => {
    navigator.clipboard.writeText("npx kartiksoni@latest");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-[#050505] pt-28 pb-20 overflow-hidden">
      {/* Soft Ambient Radial Background Highlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#7C3AED]/20 to-[#00E5FF]/20 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Subtle Grid Lines Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
        
        {/* Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300 mb-8 backdrop-blur-md shadow-lg"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-bold">/</span>
          <span>Available for Freelance & Senior Engineering Roles</span>
        </motion.div>

        {/* Human Crafted Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold font-display text-white tracking-tight leading-[1.08] max-w-5xl"
        >
          Building <span className="gradient-text-cyan">High-Performance</span> Digital Products & Systems
        </motion.h1>

        {/* Subtitle & Human Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed"
        >
          I’m <strong className="text-white">Kartik Soni</strong>, a Senior Full Stack Engineer & UI/UX Architect crafting fast, accessible web platforms using <span className="text-[#00E5FF] font-mono">Next.js</span>, <span className="text-[#7C3AED] font-mono">Node.js</span>, <span className="text-[#00E5FF] font-mono">TypeScript</span>, and <span className="text-emerald-400 font-mono">MongoDB</span>.
        </motion.p>

        {/* Interactive CLI Terminal Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#0F0F0F] border border-white/10 font-mono text-xs text-slate-300 shadow-xl group cursor-pointer hover:border-[#00E5FF]/40 transition-all"
          onClick={handleCopyCommand}
        >
          <Terminal className="w-4 h-4 text-[#00E5FF]" />
          <span className="text-slate-500">$</span>
          <span className="text-slate-200">npx kartiksoni@latest</span>
          <button className="ml-2 text-slate-400 hover:text-white transition-colors">
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="px-8 py-3.5 rounded-full bg-white text-black font-bold text-sm hover:bg-[#00E5FF] transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.15)] flex items-center gap-2 group"
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Explore Work</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          <a
            href="#contact"
            className="px-8 py-3.5 rounded-full bg-white/5 border border-white/10 hover:border-white/30 text-white font-semibold text-sm transition-all duration-300 flex items-center gap-2 backdrop-blur-md"
          >
            <Mail className="w-4 h-4 text-[#00E5FF]" />
            <span>Let’s Talk</span>
          </a>
        </motion.div>

        {/* Key Competency Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400"
        >
          <div className="flex items-center gap-2">
            <span className="text-[#00E5FF]">⚡</span> 100% Lighthouse Performance
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#7C3AED]">🔒</span> Strict Type Safety & JWT Security
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">🚀</span> Scalable MongoDB Microservices
          </div>
        </motion.div>

      </div>
    </section>
  );
}
