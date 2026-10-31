import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'motion/react';
import { TESTIMONIALS } from '../data/portfolioData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-16 sm:py-24 border-b border-purple-200/70 bg-white/70 backdrop-blur-xs relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="pb-12 border-b border-purple-100">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-900 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#420D58]" />
            <span className="font-semibold">Collaborator Feedback</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight">
            Client &amp; Partner Testimonials
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-2 max-w-xl">
            Words from creative directors, studio leads, and brand strategists on Mary Alicia&apos;s artistic delivery and craft.
          </p>
        </div>

        {/* 3-Column Testimonial Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="p-6 sm:p-8 rounded-2xl border border-purple-200/80 bg-white hover:border-purple-300 transition-all duration-300 shadow-2xs hover:shadow-xl hover:shadow-purple-950/5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  {/* 5-Star rating */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <Quote className="w-6 h-6 text-purple-300/80 group-hover:text-purple-500 transition-colors" />
                </div>

                <p className="text-xs sm:text-sm text-neutral-700 italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-purple-100">
                <h4 className="text-sm font-bold text-neutral-900 group-hover:text-purple-950 transition-colors">
                  {t.author}
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {t.role} · <span className="text-purple-900 font-semibold">{t.company}</span>
                </p>
                <div className="mt-2 text-2xs font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded inline-block border border-purple-200/60">
                  {t.project}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
