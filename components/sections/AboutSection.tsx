"use client";

import { motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import { Code, Cpu, ShieldCheck, Zap, Award, Layers } from "lucide-react";

export default function AboutSection() {
  const stats = [
    { label: "Years Experience", value: "5+", icon: Award },
    { label: "Projects Delivered", value: "45+", icon: Layers },
    { label: "Client Satisfaction", value: "99%", icon: ShieldCheck },
    { label: "Automated Systems", value: "30+", icon: Cpu },
  ];

  return (
    <section id="about" className="relative py-28 bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          badge="Story & Vision"
          title="Architecting Code with"
          highlightTitle="Precision & Purpose"
          subtitle="Combining engineering rigor with luxury visual aesthetics to create modern web platforms that scale seamlessly."
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-panel p-6 rounded-2xl text-center group hover:scale-[1.03] transition-transform"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF] group-hover:bg-[#00E5FF] group-hover:text-black transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold font-display text-white mb-1 gradient-text-cyan">
                  {stat.value}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Biography & Engineering Focus */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 glass-panel p-8 sm:p-10 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />

            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mb-6">
              Hi, I’m <span className="text-[#00E5FF]">Kartik Soni</span> — Senior Full Stack Developer & UI/UX Architect
            </h3>

            <p className="text-slate-300 leading-relaxed mb-4">
              With over 5 years of commercial engineering experience, I specialize in transforming complex business requirements into high-performance web applications, automated REST APIs, and immersive WebGL 3D interfaces.
            </p>

            <p className="text-slate-400 leading-relaxed mb-8">
              My core stack centers around **Next.js, TypeScript, Node.js, Express, and MongoDB**, paired with advanced animation engines like **Three.js, Framer Motion, and GSAP**. I design systems with high reliability, strict security, and clean code architecture.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF]">
                  <Code className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-200">Modern Next.js & React</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED]">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-200">Fast 60fps Animations</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 glass-panel p-8 rounded-3xl border-purple-500/20"
          >
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
              Core Philosophy
            </h4>

            <div className="space-y-6">
              <div>
                <h5 className="text-white font-semibold text-base mb-1">1. User-Centric Elegance</h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Design is not just how it looks, but how effortlessly it guides human attention and interaction.
                </p>
              </div>

              <div>
                <h5 className="text-white font-semibold text-base mb-1">2. Scalable Architecture</h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Clean modular structures, robust Mongoose schemas, and strict TypeScript types built for growth.
                </p>
              </div>

              <div>
                <h5 className="text-white font-semibold text-base mb-1">3. Automated Operations</h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Eliminating manual bottlenecks through smart APIs, background tasks, and AI integrations.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
