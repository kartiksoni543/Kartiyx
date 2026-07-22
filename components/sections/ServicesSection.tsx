"use client";

import { motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import { Layout, Server, Palette, Globe, Gauge, Bot, ArrowRight } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      title: "Frontend Engineering",
      icon: Layout,
      description: "Building responsive, ultra-fast web applications with Next.js, React, TypeScript, and Tailwind CSS. Pixel-perfect layout fidelity and smooth 60fps animations.",
    },
    {
      title: "Backend Development",
      icon: Server,
      description: "Designing RESTful APIs and microservices using Node.js, Express, and MongoDB Mongoose. Implementing JWT security, rate-limiting, and clean MVC architecture.",
    },
    {
      title: "UI/UX & Product Design",
      icon: Palette,
      description: "Crafting intuitive digital interfaces, interactive design systems, and glassmorphic dashboards centered around human ergonomics and typography hierarchy.",
    },
    {
      title: "WordPress Engineering",
      icon: Globe,
      description: "Custom WordPress theme development, ACF plugin integration, headless WordPress REST API configurations, and high-security enterprise solutions.",
    },
    {
      title: "Performance Optimization",
      icon: Gauge,
      description: "Lighthouse 95+ optimization, code splitting, asset compression, database indexing, and WebGL shader performance tuning for instant page loads.",
    },
    {
      title: "AI & System Integration",
      icon: Bot,
      description: "Embedding AI language models, automated workflow triggers, dynamic lead processing APIs, and custom chat assistants into web applications.",
    },
  ];

  return (
    <section id="services" className="relative py-28 bg-[#050505] overflow-hidden">
      <div className="glow-orb-cyan bottom-10 left-1/4 opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader
          badge="Services Offered"
          title="High-Value Engineering &"
          highlightTitle="Design Solutions"
          subtitle="Specialized capabilities designed to transform complex business concepts into automated digital software."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="glass-panel p-8 rounded-3xl relative group hover:-translate-y-2 hover:border-[#00E5FF]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] mb-6 group-hover:bg-[#00E5FF] group-hover:text-black transition-colors duration-300">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-bold font-display text-white mb-3 group-hover:text-[#00E5FF] transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-[#00E5FF] uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
