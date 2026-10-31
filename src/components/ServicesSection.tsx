import React from 'react';
import { ArrowUpRight, Palette, Film, Sparkles, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { SERVICES_LIST } from '../data/portfolioData';

export const ServicesSection: React.FC = () => {
  const getIcon = (number: string) => {
    switch (number) {
      case '01':
        return <Palette className="w-5 h-5 text-purple-900" />;
      case '02':
        return <Film className="w-5 h-5 text-purple-900" />;
      case '03':
        return <Layers className="w-5 h-5 text-purple-900" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-900" />;
    }
  };

  return (
    <section id="services" className="py-16 sm:py-24 border-b border-purple-200/70 bg-[#FAF7FC]/80 backdrop-blur-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-purple-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-900 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#420D58]" />
              <span className="font-semibold">Disciplines &amp; Capabilities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight">
              What I Can Help With
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-2 max-w-xl">
              End-to-end creative direction spanning visual identity, dynamic motion, print collateral, and custom digital illustration.
            </p>
          </div>

          <div className="shrink-0">
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-semibold text-purple-950 bg-white hover:bg-purple-50 border border-purple-200 hover:border-purple-300 rounded-md transition-all shadow-2xs hover:scale-[1.02]"
            >
              <span>Discuss Requirements</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-purple-600" />
            </a>
          </div>
        </div>

        {/* 4-Card Services Grid with purple hover glow & motion */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {SERVICES_LIST.map((service, idx) => (
            <motion.div
              key={service.number}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="rounded-2xl border border-purple-200/80 bg-white p-6 sm:p-8 hover:border-purple-300 transition-all duration-300 shadow-2xs hover:shadow-xl hover:shadow-purple-950/5 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-purple-100/80 border border-purple-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getIcon(service.number)}
                  </div>
                  <span className="font-mono text-sm font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200/60">
                    {service.number}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 group-hover:text-purple-950 transition-colors tracking-tight">
                  {service.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-600 mt-2.5 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Deliverables unboxed list in purple accents */}
              <div className="mt-6 pt-5 border-t border-purple-100">
                <p className="text-2xs font-mono uppercase tracking-wider text-purple-800 font-semibold mb-2.5">
                  Key Deliverables
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-neutral-700">
                  {service.deliverables.map((item, dIdx) => (
                    <React.Fragment key={item}>
                      <span className="font-medium hover:text-purple-900 transition-colors">{item}</span>
                      {dIdx < service.deliverables.length - 1 && (
                        <span aria-hidden="true" className="text-purple-300">·</span>
                      )}
                    </React.Fragment>
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
