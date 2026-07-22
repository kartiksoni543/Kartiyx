"use client";

import { motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import { ExternalLink, Sparkles } from "lucide-react";

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
}

export default function ProjectsSection() {
  const projects: ProjectItem[] = [
    {
      id: "project-1",
      title: "Automated Enterprise CMS & Portfolio Platform",
      category: "Full Stack Node.js & EJS",
      description: "A production-grade CMS platform featuring custom MongoDB data schemas, dynamic blog publication, JWT authentication, and automated Nodemailer email notifications.",
      image: "/assets/img/blog/1.jpg",
      techStack: ["Next.js", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
      githubUrl: "https://github.com/kartiksoni543",
      liveUrl: "http://localhost:3000",
      featured: true,
    },
    {
      id: "project-2",
      title: "Real-Time AI Microservices & Analytics Hub",
      category: "Node.js & React Architecture",
      description: "High-scale API gateway supporting microservice rate limiting, JWT token management, real-time analytics aggregation, and interactive WebGL charts.",
      image: "/assets/img/blog/2.jpg",
      techStack: ["React", "Express.js", "MongoDB", "Three.js", "Chart.js"],
      githubUrl: "https://github.com/kartiksoni543",
      liveUrl: "#",
      featured: true,
    },
    {
      id: "project-3",
      title: "Interactive 3D E-Commerce Design System",
      category: "WebGL & Product Design",
      description: "A futuristic e-commerce experience featuring 3D product viewports, particle physics, glassmorphic card elements, and seamless checkout flows.",
      image: "/assets/img/blog/3.jpg",
      techStack: ["Three.js", "Next.js", "TypeScript", "Tailwind CSS", "GSAP"],
      githubUrl: "https://github.com/kartiksoni543",
      liveUrl: "#",
      featured: false,
    },
  ];

  return (
    <section id="projects" className="relative py-28 bg-[#050505] overflow-hidden">
      <div className="glow-orb-purple top-1/3 -right-32 opacity-50" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader
          badge="Featured Engineering"
          title="Selected Projects &"
          highlightTitle="Case Studies"
          subtitle="Explore recent full-stack applications, interactive 3D WebGL interfaces, and enterprise software systems."
        />

        <div className="grid grid-cols-1 gap-12">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
              className="glass-panel p-8 sm:p-10 rounded-3xl group relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-white/10 hover:border-[#00E5FF]/40 transition-all duration-500"
            >
              {/* Project Image Preview */}
              <div className="lg:col-span-6 relative overflow-hidden rounded-2xl border border-white/10 group-hover:scale-[1.02] transition-transform duration-500">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-72 sm:h-80 object-cover filter brightness-90 group-hover:brightness-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
              </div>

              {/* Project Details */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#7C3AED]/20 text-[#c084fc] border border-[#7C3AED]/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mb-4 group-hover:text-[#00E5FF] transition-colors">
                  {project.title}
                </h3>

                <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Project Links */}
                <div className="flex items-center gap-4">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button px-6 py-2.5 rounded-full text-xs font-bold text-[#00E5FF] flex items-center gap-2"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button px-5 py-2.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    <span>Source Code</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
