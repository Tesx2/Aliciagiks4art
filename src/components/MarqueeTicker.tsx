import React from 'react';
import { Sparkles } from 'lucide-react';

export const MarqueeTicker: React.FC = () => {
  const items = [
    'Motion Graphics',
    'Brand Identity',
    'Campaign Visuals',
    '3D Animation',
    'Digital Illustration',
    'Storyboarding & Art Direction',
    'Logo Systems',
    'Cinematic Visuals',
    'Remote Available',
  ];

  return (
    <div className="w-full overflow-hidden border-y border-purple-200/80 bg-gradient-to-r from-purple-100/70 via-purple-50/80 to-purple-100/70 py-3 backdrop-blur-xs select-none">
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-xs font-mono font-medium tracking-wider uppercase text-purple-900">
        {/* Loop 1 */}
        {items.map((item, idx) => (
          <div key={`m1-${idx}`} className="flex items-center gap-8 shrink-0">
            <span className="hover:text-purple-700 transition-colors">{item}</span>
            <Sparkles className="w-3 h-3 text-purple-400 shrink-0" aria-hidden="true" />
          </div>
        ))}
        {/* Loop 2 for continuous seamless flow */}
        {items.map((item, idx) => (
          <div key={`m2-${idx}`} className="flex items-center gap-8 shrink-0">
            <span className="hover:text-purple-700 transition-colors">{item}</span>
            <Sparkles className="w-3 h-3 text-purple-400 shrink-0" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
};
