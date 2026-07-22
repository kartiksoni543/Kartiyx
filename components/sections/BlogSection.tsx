"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import { Search, Clock, Calendar, ArrowUpRight, Sparkles, BookOpen } from "lucide-react";

interface BlogPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  featured: boolean;
}

export default function BlogSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const posts: BlogPost[] = [
    {
      slug: "ui-ux-designers",
      title: "Top 10 UI/UX Designers To Follow For Better Product Thinking",
      category: "Tutorial",
      excerpt: "Following exceptional UI/UX designers is one of the fastest ways to improve your design judgment, layout hierarchy, and product taste.",
      date: "Feb 14, 2025",
      readTime: "5 min read",
      image: "/assets/img/blog/1.jpg",
      featured: true,
    },
    {
      slug: "app-development-guides",
      title: "App Development Guides For Teams Building Better Products",
      category: "Tips",
      excerpt: "Strong app development begins with clear technical foundation, API contracts, error boundaries, and modular microservices.",
      date: "Apr 09, 2025",
      readTime: "4 min read",
      image: "/assets/img/blog/2.jpg",
      featured: false,
    },
    {
      slug: "learn-graphic-design-free",
      title: "Learn Graphic Design Free With Smarter Practice Habits",
      category: "Freebies",
      excerpt: "Learning graphic design for free is realistic if your practice is focused on typography, grid spacing, contrast, and visual rhythm.",
      date: "Jun 21, 2025",
      readTime: "6 min read",
      image: "/assets/img/blog/3.jpg",
      featured: false,
    },
  ];

  const categories = ["All", "Tutorial", "Tips", "Freebies"];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="blog" className="relative py-28 bg-[#050505] overflow-hidden">
      <div className="glow-orb-cyan top-1/2 right-0 opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader
          badge="Insights & Writings"
          title="Engineering Blog &"
          highlightTitle="Articles"
          subtitle="Deep dives into software architecture, WebGL 3D design, Next.js performance, and digital product design."
        />

        {/* Search & Category Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#111111] border border-white/10 text-white text-sm focus:outline-none focus:border-[#00E5FF] transition-colors"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                    : "glass-button text-slate-300 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, idx) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-panel rounded-3xl overflow-hidden group flex flex-col justify-between hover:-translate-y-2 hover:border-[#00E5FF]/40 transition-all duration-300"
            >
              <div>
                {/* Thumb Image */}
                <div className="relative h-52 overflow-hidden border-b border-white/10">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#00E5FF] text-black">
                      {post.category}
                    </span>
                    {post.featured && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#7C3AED] text-white flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#00E5FF]" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-display text-white mb-3 group-hover:text-[#00E5FF] transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <a
                  href={`/blog/${post.slug}`}
                  className="glass-button w-full py-2.5 rounded-xl text-xs font-bold text-[#00E5FF] flex items-center justify-center gap-2 group-hover:bg-[#00E5FF]/20"
                >
                  <span>Read Full Article</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
