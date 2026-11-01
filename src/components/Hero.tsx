import React, { useState } from 'react';
import { ArrowDown, ArrowUpRight, Play, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { MagneticWrapper } from './MagneticWrapper';

export const Hero: React.FC = () => {
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  return (
    <section id="top" className="relative pt-8 sm:pt-16 pb-12 sm:pb-20 border-b border-purple-200/70 overflow-hidden">
      
      {/* Ambient Animated Purple Glow Background Orbs */}
      <div 
        aria-hidden="true" 
        className="absolute top-10 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" 
      />
      <div 
        aria-hidden="true" 
        className="absolute top-20 right-10 w-80 h-80 bg-fuchsia-400/15 rounded-full blur-3xl pointer-events-none" 
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Typographic Hierarchy with Motion animations */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start space-y-6"
          >
            
            {/* Unboxed Kicker with quiet royal purple separator */}
            <div className="flex items-center gap-2 text-xs font-mono text-purple-900 tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-[#420D58] shadow-xs shadow-purple-500/50 animate-pulse" />
              <span className="font-bold tracking-wider">Mary Alicia</span>
              <span aria-hidden="true" className="text-purple-300">·</span>
              <span className="text-purple-700">Graphic Designer · Animator · Artist</span>
            </div>

            {/* Display Headline with purple gradient italic word */}
            <h1 className="max-w-3xl text-4xl sm:text-5xl md:text-6xl lg:text-[4.15rem] font-bold text-neutral-900 tracking-[-0.045em] leading-[1.04] text-balance">
              Creative ideas, made visible in{' '}
              <span className="italic font-serif font-normal bg-gradient-to-r from-[#420D58] via-[#7E22CE] to-[#C026D3] bg-clip-text text-transparent">
                motion
              </span>{' '}
              and print.
            </h1>

            {/* Lead copy */}
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-xl">
              I&apos;m Mary Alicia. I create graphic design, animation, motion work, and digital experiences with a focus on clear ideas and memorable visuals.
            </p>

            {/* Unboxed Specialties with purple separators */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm font-medium text-neutral-800 pt-1">
              <span className="hover:text-purple-900 transition-colors">Graphic Design</span>
              <span aria-hidden="true" className="text-purple-300">·</span>
              <span className="hover:text-purple-900 transition-colors">Branding &amp; Identity</span>
              <span aria-hidden="true" className="text-purple-300">·</span>
              <span className="hover:text-purple-900 transition-colors">Animation</span>
              <span aria-hidden="true" className="text-purple-300">·</span>
              <span className="hover:text-purple-900 transition-colors">Illustration</span>
              <span aria-hidden="true" className="text-purple-300">·</span>
              <span className="hover:text-purple-900 transition-colors">Digital Experiences</span>
            </div>

            {/* CTAs with rich royal purple styling and magnetic physics */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <MagneticWrapper strength={0.28}>
                <a
                  href="#portfolio"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#420D58] via-[#5F1B68] to-[#7E22CE] hover:from-[#350A47] hover:to-[#6B21A8] rounded-md transition-all shadow-sm shadow-purple-900/25 hover:shadow-md hover:shadow-purple-900/30"
                >
                  <span>View Selected Work</span>
                  <ArrowDown className="w-4 h-4" />
                </a>
              </MagneticWrapper>

              <MagneticWrapper strength={0.28}>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-purple-950 bg-white hover:bg-purple-50/70 border border-purple-200 hover:border-purple-300 rounded-md transition-all shadow-2xs"
                >
                  <span>Start a Project</span>
                  <ArrowUpRight className="w-4 h-4 text-purple-600" />
                </a>
              </MagneticWrapper>
            </div>

            {/* Quiet trust marker */}
            <div className="pt-2 text-xs text-purple-800/80 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>Selected work across graphic design, illustration, animation, and motion</span>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual Showcase with purple border & glow */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 w-full"
          >
            <div 
              data-cursor="play"
              data-cursor-text="WATCH REEL"
              className="relative rounded-2xl border border-purple-200/90 bg-white/90 backdrop-blur-xs p-3 shadow-xl shadow-purple-950/5 group hover:border-purple-300 transition-all duration-300 cursor-pointer"
            >
              <div className="relative aspect-4/3 sm:aspect-16/10 rounded-xl overflow-hidden bg-neutral-900 border border-purple-200/60 shadow-inner">
                {isPlayingPreview ? (
                  <video
                    src="geeks4drisony/motion graphic/inspiration.mp4"
                    autoPlay
                    loop
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src="assets/profile-image/mary-alicia.jpg"
                      alt="Mary Alicia, graphic designer and motion artist"
                      loading="eager"
                      className="w-full h-full object-cover grayscale contrast-105 group-hover:scale-102 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2A0838]/90 via-[#420D58]/40 to-transparent flex flex-col justify-end p-5 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-mono tracking-wider text-purple-200 uppercase">Featured Motion Reel</p>
                          <h3 className="text-sm sm:text-base font-semibold text-white">Inspiration &amp; Brand Motion</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsPlayingPreview(true)}
                          className="w-11 h-11 rounded-full bg-white text-[#420D58] flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-purple-950/40"
                          aria-label="Play motion reel"
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Availability status */}
              <div className="mt-3 px-2 flex items-center justify-end text-xs text-purple-900/70 font-mono">
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  COMMISSIONS OPEN
                </span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Full-width Stats & Highlights Strip below the hero split */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 sm:mt-16 pt-8 border-t border-purple-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
        >
          <div className="p-3 rounded-lg hover:bg-purple-100/40 transition-colors">
            <div className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Graphic design</div>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">Identity, campaigns &amp; print</p>
          </div>
          <div className="p-3 rounded-lg hover:bg-purple-100/40 transition-colors">
            <div className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Animation</div>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">Motion &amp; moving image</p>
          </div>
          <div className="p-3 rounded-lg hover:bg-purple-100/40 transition-colors">
            <div className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Digital</div>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">Interactive experiences</p>
          </div>
          <div className="p-3 rounded-lg hover:bg-purple-100/40 transition-colors">
            <div className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Illustration</div>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">Drawing, art &amp; editorial</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
