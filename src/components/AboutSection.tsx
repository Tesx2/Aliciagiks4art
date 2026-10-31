import React from 'react';
import { ArrowUpRight, CheckCircle2, MessageCircle, Mail } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-24 border-b border-purple-200/70 bg-white/70 backdrop-blur-xs relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="pb-10 border-b border-purple-100">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-900 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#420D58]" />
            <span className="font-semibold">Artist &amp; Storyteller Profile</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight">
            About Mary Alicia
          </h2>
        </div>

        {/* 2-Column Split: Image / Specs + Narrative */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Portrait & Fast Facts with motion */}
          <motion.div 
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-3 shadow-md shadow-purple-950/5 group hover:border-purple-300 transition-colors">
              <div className="aspect-4/5 rounded-xl overflow-hidden bg-neutral-900 border border-purple-200/60 shadow-inner">
                <img
                  src="assets/profile-image/mary-alicia.jpg"
                  alt="Mary Alicia portrait"
                  className="w-full h-full object-cover grayscale contrast-105 group-hover:scale-103 transition-transform duration-700"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'assets/portrait.svg';
                  }}
                />
              </div>

              <div className="mt-4 px-2 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-purple-700 font-semibold">LOCATION</span>
                  <span className="font-medium text-neutral-900">Remote · Global Client Delivery</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-purple-700 font-semibold">DISCIPLINES</span>
                  <span className="font-medium text-neutral-900">Visual Storytelling &amp; Motion</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-purple-700 font-semibold">AVAILABILITY</span>
                  <span className="font-medium text-emerald-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Open for Commissions
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Connect Buttons in royal purple */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://wa.me/254768795272?text=Hello%20Mary%20Alicia%2C%20I%27d%20like%20to%20collaborate%20on%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#420D58] to-[#7E22CE] hover:from-[#350A47] hover:to-[#6B21A8] rounded-md transition-all shadow-xs shadow-purple-900/25 hover:scale-[1.02]"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <a
                href="mailto:aliciagiks@gmail.com"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-purple-950 bg-white hover:bg-purple-50 border border-purple-200 hover:border-purple-300 rounded-md transition-all shadow-2xs hover:scale-[1.02]"
              >
                <Mail className="w-3.5 h-3.5 text-purple-600" />
                <span>Email Mary</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Narrative & Principles with motion */}
          <motion.div 
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 space-y-6"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-snug">
              I bring ideas to life through{' '}
              <span className="text-[#420D58] italic font-serif">image, type, and motion</span>.
            </h3>

            <div className="space-y-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
              <p>
                I&apos;m Mary Alicia, a graphic designer, animator, and artist. This portfolio brings together selected design work, animation, motion pieces, illustration, and digital experiments.
              </p>
              <p>
                I enjoy taking a project from its first idea to a finished visual, making work that feels thoughtful, distinctive, and easy to connect with.
              </p>
            </div>

            {/* Core Pillars */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-purple-200/80 bg-purple-50/40 hover:bg-purple-50/70 transition-colors">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-950 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-[#420D58]" />
                  <span>Motion &amp; animation</span>
                </div>
                <p className="text-xs text-neutral-600">
                  Logo animation, short-form motion, and moving-image experiments.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-purple-200/80 bg-purple-50/40 hover:bg-purple-50/70 transition-colors">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-950 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-[#420D58]" />
                  <span>Graphic design</span>
                </div>
                <p className="text-xs text-neutral-600">
                  Visual identities, campaign graphics, posters, and print pieces.
                </p>
              </div>
            </div>

            {/* Software Proficiency in purple tags */}
            <div className="pt-4 border-t border-purple-100">
              <p className="text-2xs font-mono uppercase tracking-wider text-purple-800 font-semibold mb-2">
                Primary Software &amp; Toolset
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-neutral-700">
                {['Adobe After Effects', 'Premiere Pro', 'Adobe Illustrator', 'Photoshop', 'InDesign', 'Cinema 4D', 'Blender', 'Figma', 'Procreate'].map((tool) => (
                  <span
                    key={tool}
                    className="px-2.5 py-1 bg-purple-50/90 border border-purple-200 text-purple-950 rounded-md font-mono text-2xs hover:border-purple-300 transition-colors"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
