"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import { Code2, Server, Database, Sparkles, Layout, Cpu } from "lucide-react";

interface SkillItem {
  name: string;
  category: "Frontend" | "Backend" | "Database" | "3D & CMS";
  level: string;
  tag: string;
  description: string;
}

export default function SkillsSection() {
  const [activeTab, setActiveTab] = useState<string>("All");

  const skills: SkillItem[] = [
    { name: "React", category: "Frontend", level: "Expert", tag: "JSX / Hooks", description: "Context API, custom hooks, state management & component patterns" },
    { name: "Next.js", category: "Frontend", level: "Expert", tag: "App Router", description: "Server Components, SSG, SSR, dynamic routing & Server Actions" },
    { name: "TypeScript", category: "Frontend", level: "Advanced", tag: "Type Safety", description: "Generics, strict interface typing & compile-time validation" },
    { name: "Tailwind CSS", category: "Frontend", level: "Expert", tag: "Utility CSS", description: "Custom design systems, responsive grid & fluid typography" },
    { name: "JavaScript", category: "Frontend", level: "Expert", tag: "ES6+ Engine", description: "Async/Await promises, Web APIs & DOM events" },
    
    { name: "Node.js", category: "Backend", level: "Expert", tag: "V8 Runtime", description: "Event loop concurrency, REST architecture & background tasks" },
    { name: "Express.js", category: "Backend", level: "Expert", tag: "HTTP Server", description: "Middleware, JWT auth, Express Validator & rate limiting" },
    
    { name: "MongoDB", category: "Database", level: "Advanced", tag: "NoSQL DB", description: "Mongoose ODM schemas, aggregation pipelines & Atlas cloud" },
    
    { name: "Three.js", category: "3D & CMS", level: "Advanced", icon: "🧊", tag: "WebGL Engine", description: "3D mesh geometries, camera controls, lighting & shaders" } as any,
    { name: "WordPress", category: "3D & CMS", level: "Expert", icon: "🌐", tag: "CMS Platform", description: "Custom PHP theme engine, REST API integration & ACF" } as any,
  ];

  const categories = ["All", "Frontend", "Backend", "Database", "3D & CMS"];

  const filteredSkills = activeTab === "All"
    ? skills
    : skills.filter((s) => s.category === activeTab);

  return (
    <section id="skills" className="relative py-28 bg-[#050505] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionHeader
          badge="Tech Stack"
          title="Mastered Technologies &"
          highlightTitle="Toolkits"
          subtitle="A battle-tested engineering stack built for performance, security, and developer ergonomics."
        />

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-semibold transition-all duration-200 ${
                activeTab === cat
                  ? "bg-white text-black font-bold shadow-md"
                  : "bg-white/5 border border-white/10 text-slate-300 hover:text-white"
              }`}
            >
              <span className="text-[#00E5FF] mr-1">/</span>
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredSkills.map((skill, idx) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-[#00E5FF]/40 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-[#00E5FF] bg-[#00E5FF]/10 px-2.5 py-1 rounded-md border border-[#00E5FF]/20">
                  {skill.tag}
                </span>
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
                  {skill.level}
                </span>
              </div>

              <h4 className="text-xl font-bold font-display text-white mb-2 group-hover:text-[#00E5FF] transition-colors">
                {skill.name}
              </h4>

              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {skill.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
