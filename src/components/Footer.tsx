import React from 'react';
import { ArrowUp, Instagram, Github, Mail, MessageCircle } from 'lucide-react';
import { ARTIST_PROFILE } from '../data/portfolioData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="py-12 border-t border-purple-200/80 bg-[#FAF7FC] text-neutral-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Row: Brand & Unboxed Navigation Links */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#420D58] via-[#5F1B68] to-[#8E24AA] text-white flex items-center justify-center text-xs font-mono font-bold shadow-xs shadow-purple-900/20">
              M
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-neutral-900 tracking-tight leading-none">
                {ARTIST_PROFILE.name}
              </span>
              <span className="text-[10px] font-mono text-purple-700 font-medium">
                @{ARTIST_PROFILE.handle}
              </span>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-6 text-xs font-medium text-neutral-600">
            <a href="#portfolio" className="hover:text-purple-900 transition-colors">
              Work
            </a>
            <a href="#services" className="hover:text-purple-900 transition-colors">
              Services
            </a>
            <a href="#about" className="hover:text-purple-900 transition-colors">
              About
            </a>
            <a href="#contact" className="hover:text-purple-900 transition-colors">
              Contact
            </a>
            <a href="/admin" className="hover:text-purple-900 transition-colors">
              Admin
            </a>
          </nav>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-800 hover:text-purple-950 transition-colors bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-md border border-purple-200/60 shadow-2xs"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Row: Social Links & Copyright */}
        <div className="pt-6 border-t border-purple-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-500">
          <p className="font-mono text-xs">
            © 2026 {ARTIST_PROFILE.name} ({ARTIST_PROFILE.handle}). Visual Storytelling &amp; Motion Design.
          </p>

          <div className="flex items-center gap-4 text-neutral-600">
            <a
              href="https://www.instagram.com/geeks4drisony/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-900 transition-colors flex items-center gap-1 text-xs"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>
            <a
              href="https://github.com/aliciagiks-graphics/Aliciagiks4art"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-900 transition-colors flex items-center gap-1 text-xs"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href="mailto:aliciagiks@gmail.com"
              className="hover:text-purple-900 transition-colors flex items-center gap-1 text-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
            <a
              href="https://wa.me/254768795272"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-700 transition-colors flex items-center gap-1 text-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
