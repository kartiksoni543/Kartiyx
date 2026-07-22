"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Code2, ArrowUpRight, Search, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Services", href: "#services" },
    { name: "Experience", href: "#experience" },
    { name: "Blog", href: "#blog" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none flex justify-center items-start">
      <div className="pointer-events-auto w-full max-w-5xl flex items-center justify-between gap-3">
        
        {/* Brand Pill */}
        <Link href="/" className="shrink-0 transition-transform hover:scale-105">
          <div className="h-[48px] px-5 rounded-full bg-[#0A0A0A]/80 border border-white/10 backdrop-blur-2xl shadow-[0_6px_24px_rgba(0,0,0,0.6)] flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#00E5FF] p-[1px]">
              <div className="w-full h-full bg-[#0A0A0A] rounded-full flex items-center justify-center">
                <Code2 className="w-3.5 h-3.5 text-[#00E5FF]" />
              </div>
            </div>
            <span className="text-sm font-bold font-display tracking-tight text-white">
              Kartik<span className="text-[#00E5FF]">.Soni</span>
            </span>
          </div>
        </Link>

        {/* Command Search Nav Pill (Aumiqx Style) */}
        <div className="hidden md:flex items-center gap-1 h-[48px] px-4 rounded-full bg-[#0A0A0A]/80 border border-white/10 backdrop-blur-2xl shadow-[0_6px_24px_rgba(0,0,0,0.6)]">
          <span className="font-mono text-[#00E5FF] font-bold text-xs mr-2">/</span>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-[#00E5FF] transition-colors rounded-full hover:bg-white/5"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Action Button Pill */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href="#contact"
            className="h-[48px] px-5 rounded-full bg-white text-black text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 shadow-lg hover:bg-[#00E5FF] transition-colors"
          >
            <span>Let’s Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden h-[48px] w-[48px] rounded-full bg-[#0A0A0A]/80 border border-white/10 backdrop-blur-2xl flex items-center justify-center text-slate-200"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto fixed inset-x-4 top-20 bg-[#0A0A0A]/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 shadow-2xl md:hidden z-50">
          <div className="flex flex-col gap-4 font-mono text-sm">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-[#00E5FF] py-1 border-b border-white/5"
              >
                <span className="text-[#00E5FF] mr-2">/</span>
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 text-center py-3 rounded-full bg-[#00E5FF] text-black font-bold text-xs uppercase tracking-wider"
            >
              Let’s Talk
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
