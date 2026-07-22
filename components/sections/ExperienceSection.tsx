"use client";

import { motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import { Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react";

interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  highlights: string[];
}

export default function ExperienceSection() {
  const experiences: ExperienceItem[] = [
    {
      period: "2022 — Present",
      role: "Senior Full Stack Developer & Architect",
      company: "Freelance & Technical Enterprise Consulting",
      location: "Remote / India",
      description: "Leading end-to-end full stack architecture for global clients. Building Next.js frontends, Node.js REST API microservices, and automated MongoDB database integrations.",
      highlights: [
        "Architected scalable Node.js microservices handling thousands of requests",
        "Developed luxury 3D WebGL interfaces using Three.js and Framer Motion",
        "Implemented Nodemailer email automation & rate-limited Express APIs",
        "Achieved 95+ Lighthouse scores across client web platforms"
      ],
    },
    {
      period: "2020 — 2022",
      role: "Lead Frontend Engineer & UI Designer",
      company: "TechSolutions Inc.",
      location: "India",
      description: "Directed frontend software development teams. Spearheaded design systems, component architecture, and responsive React applications.",
      highlights: [
        "Led a team of 6 software developers building SaaS management dashboards",
        "Standardized Tailwind CSS design tokens and component libraries",
        "Reduced initial bundle loading times by 40% through code splitting"
      ],
    },
    {
      period: "2019 — 2020",
      role: "Junior Web Developer & WordPress Specialist",
      company: "Digital Spark Studio",
      location: "India",
      description: "Created custom WordPress themes, JavaScript interactive widgets, and client websites.",
      highlights: [
        "Delivered 20+ responsive business websites with high client feedback",
        "Built custom PHP & JavaScript interactive components"
      ],
    },
  ];

  return (
    <section id="experience" className="relative py-28 bg-[#050505] overflow-hidden">
      <div className="glow-orb-purple top-1/4 -left-32 opacity-40" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader
          badge="Career Journey"
          title="Professional Experience &"
          highlightTitle="Leadership"
          subtitle="A track record of engineering leadership, commercial product delivery, and technical growth."
        />

        <div className="relative border-l-2 border-white/10 ml-4 md:ml-32 space-y-12">
          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.role}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="relative pl-8 md:pl-12 group"
            >
              {/* Timeline Node Icon */}
              <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-[#050505] border-2 border-[#00E5FF] flex items-center justify-center text-[#00E5FF] group-hover:scale-125 group-hover:bg-[#00E5FF] group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                <Briefcase className="w-4 h-4" />
              </div>

              {/* Glass Card */}
              <div className="glass-panel p-8 rounded-3xl group-hover:border-[#00E5FF]/40 transition-all duration-300">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.period}
                    </span>
                    <h3 className="text-2xl font-bold font-display text-white group-hover:text-[#00E5FF] transition-colors">
                      {exp.role}
                    </h3>
                    <p className="text-sm font-semibold text-[#c084fc]">{exp.company}</p>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    <MapPin className="w-3.5 h-3.5 text-[#00E5FF]" />
                    <span>{exp.location}</span>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {exp.description}
                </p>

                {/* Highlights List */}
                <div className="space-y-2">
                  {exp.highlights.map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-400">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
