import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { EXPERIENCE_TIMELINE } from '../data/portfolioData';

export const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="py-16 sm:py-24 border-b border-purple-200/70 bg-[#FAF7FC]/80 backdrop-blur-xs relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="pb-12 border-b border-purple-200/80">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-900 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#420D58]" />
            <span className="font-semibold">Career Timeline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight">
            Experience &amp; Background
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-2 max-w-2xl">
            A track record of crafting cinematic motion systems, brand identities, and visual narratives across agencies, studios, and independent client engagements.
          </p>
        </div>

        {/* Timeline Stack */}
        <div className="mt-12 space-y-8 relative before:absolute before:inset-0 before:left-3 sm:before:left-8 before:h-full before:w-0.5 before:bg-purple-200/70">
          {EXPERIENCE_TIMELINE.map((item, idx) => (
            <motion.div
              key={item.period}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="relative pl-8 sm:pl-16 group"
            >
              {/* Timeline Indicator Dot */}
              <div className="absolute left-1.5 sm:left-6.5 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#420D58] shadow-xs group-hover:scale-125 group-hover:bg-[#420D58] transition-all duration-300" />

              {/* Experience Card */}
              <div className="p-6 sm:p-8 rounded-2xl border border-purple-200/80 bg-white hover:border-purple-300 transition-all duration-300 shadow-2xs hover:shadow-xl hover:shadow-purple-950/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-purple-100">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-900 group-hover:text-purple-950 transition-colors">
                      {item.role}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-purple-900 font-medium mt-1">
                      <span className="font-semibold text-purple-950">{item.organization}</span>
                      <span aria-hidden="true" className="text-purple-300">·</span>
                      <span className="flex items-center gap-1 text-neutral-500">
                        <MapPin className="w-3 h-3" />
                        <span>{item.location}</span>
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-purple-900 bg-purple-100/80 px-3 py-1 rounded-md border border-purple-200 shrink-0 self-start sm:self-auto">
                    <Calendar className="w-3.5 h-3.5 text-purple-700" />
                    <span>{item.period}</span>
                  </span>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {item.description}
                </p>

                {/* Achievements list */}
                <div className="mt-5 pt-4 border-t border-purple-50 space-y-2">
                  {item.achievements.map((achieve, aIdx) => (
                    <div key={aIdx} className="flex items-start gap-2.5 text-xs text-neutral-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#420D58] shrink-0 mt-0.5" />
                      <span>{achieve}</span>
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
};
