import React from 'react';
import { ArrowUpRight, Palette, Film, Sparkles, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteContent } from '../context/SiteContentContext';

export const ServicesSection: React.FC = () => {
  const content = useSiteContent();
  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Palette className="w-5 h-5 text-purple-900" />;
      case 1:
        return <Film className="w-5 h-5 text-purple-900" />;
      case 2:
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
              <span className="font-semibold">{content.services.eyebrow}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight">
              {content.services.heading}
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-2 max-w-xl">
              {content.services.intro}
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

        {/* Core areas of work */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {content.services.items.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="rounded-2xl border border-purple-200/80 bg-white p-6 sm:p-8 hover:border-purple-300 transition-all duration-300 shadow-2xs hover:shadow-xl hover:shadow-purple-950/5 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-purple-100/80 border border-purple-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getIcon(idx)}
                  </div>
                  <span className="font-mono text-sm font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200/60">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 group-hover:text-purple-950 transition-colors tracking-tight">
                  {service.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-600 mt-2.5 leading-relaxed">
                  {service.description}
                </p>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
