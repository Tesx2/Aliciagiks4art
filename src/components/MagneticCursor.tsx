import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { Play, Eye, ArrowUpRight, Copy } from 'lucide-react';

export const MagneticCursor: React.FC = () => {
  const [isPointerDevice, setIsPointerDevice] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'play' | 'inspect' | 'link' | 'copy'>('default');
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring for the outer trailing cursor
  const springConfig = { damping: 25, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable custom cursor for devices with mouse/fine pointer (never on touch screens)
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
      setIsPointerDevice(true);
    } else {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Inspect hovered target for data-cursor attributes
      const target = (e.target as HTMLElement).closest('[data-cursor]') as HTMLElement | null;
      if (target) {
        const type = target.getAttribute('data-cursor') as any;
        const text = target.getAttribute('data-cursor-text') || '';
        setCursorType(type || 'link');
        setCursorText(text);
      } else {
        const isInteractive = (e.target as HTMLElement).closest('button, a, input, select, textarea');
        if (isInteractive) {
          setCursorType('link');
          setCursorText('');
        } else {
          setCursorType('default');
          setCursorText('');
        }
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isPointerDevice || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      {/* Precision inner center dot (immediate mouse response) */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-[#420D58] shadow-xs"
        style={{
          x: mouseX,
          y: mouseY,
          opacity: cursorType === 'default' ? 1 : 0,
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Dynamic Context Halo / Capsule (smooth spring trailing) */}
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center font-mono font-bold transition-colors duration-200"
        style={{
          x: smoothX,
          y: smoothY,
        }}
        animate={{
          scale: cursorType === 'default' ? 1 : 1.15,
        }}
      >
        {cursorType === 'default' && (
          <div className="w-8 h-8 -ml-4 -mt-4 rounded-full border border-purple-500/40 bg-purple-500/5 backdrop-blur-[1px]" />
        )}

        {cursorType === 'link' && (
          <div className="w-10 h-10 -ml-5 -mt-5 rounded-full border border-purple-600/70 bg-purple-100/30 backdrop-blur-xs flex items-center justify-center shadow-xs">
            <ArrowUpRight className="w-3.5 h-3.5 text-[#420D58]" />
          </div>
        )}

        {cursorType === 'play' && (
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="-ml-10 -mt-5 px-3.5 py-1.5 rounded-full bg-[#420D58] text-white shadow-xl shadow-purple-950/40 flex items-center gap-1.5 text-2xs uppercase tracking-wider border border-purple-300/40"
          >
            <Play className="w-3 h-3 fill-current ml-0.5" />
            <span>{cursorText || 'PLAY REEL'}</span>
          </motion.div>
        )}

        {cursorType === 'inspect' && (
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="-ml-11 -mt-5 px-3.5 py-1.5 rounded-full bg-[#420D58] text-white shadow-xl shadow-purple-950/40 flex items-center gap-1.5 text-2xs uppercase tracking-wider border border-purple-300/40"
          >
            <Eye className="w-3 h-3" />
            <span>{cursorText || 'INSPECT'}</span>
          </motion.div>
        )}

        {cursorType === 'copy' && (
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="-ml-9 -mt-5 px-3 py-1.5 rounded-full bg-emerald-700 text-white shadow-xl shadow-emerald-950/40 flex items-center gap-1.5 text-2xs uppercase tracking-wider border border-emerald-300/40"
          >
            <Copy className="w-3 h-3" />
            <span>COPY</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
