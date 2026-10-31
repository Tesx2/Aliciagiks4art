import React, { useEffect } from 'react';
import { X, ExternalLink, Play, Film, Image as ImageIcon, Calendar, Briefcase, Wrench } from 'lucide-react';
import { PortfolioItem } from '../data/portfolioData';

interface ProjectModalProps {
  project: PortfolioItem | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onNext,
  onPrev,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-900/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-xl border border-neutral-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100 bg-purple-50/60 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-900 uppercase">
            {project.type === 'video' ? (
              <Film className="w-3.5 h-3.5 text-purple-700" />
            ) : (
              <ImageIcon className="w-3.5 h-3.5 text-purple-700" />
            )}
            <span className="font-semibold">{project.categoryLabel}</span>
            <span aria-hidden="true" className="text-purple-300">·</span>
            <span>{project.year}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-purple-950 hover:bg-purple-100 rounded-md transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Container */}
        <div className="relative bg-neutral-950 flex items-center justify-center overflow-hidden min-h-[280px] sm:min-h-[380px] max-h-[55vh]">
          {project.type === 'video' ? (
            <video
              src={project.src}
              aria-label={project.alt || project.title}
              controls
              autoPlay
              playsInline
              className="w-full max-h-[55vh] object-contain"
            />
          ) : (
            <img
              src={project.src}
              alt={project.alt || project.title}
              className="w-full max-h-[55vh] object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'assets/tall.svg';
              }}
            />
          )}
        </div>

        {/* Content & Details Pane */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h2 id="modal-project-title" className="text-xl sm:text-2xl font-bold text-neutral-900">
                {project.title}
              </h2>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-neutral-500 mt-1">
                <span className="text-purple-800 font-medium">{project.client || 'Creative Showcase'}</span>
                <span aria-hidden="true">·</span>
                <span>{project.role || 'Design & Art Direction'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="#contact"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#420D58] to-[#7E22CE] hover:from-[#350A47] hover:to-[#6B21A8] rounded-md transition-all shadow-xs shadow-purple-900/25"
              >
                <span>Request Similar Project</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="prose prose-neutral max-w-none text-sm text-neutral-600 leading-relaxed">
            <p>{project.brief || 'A standout piece developed with attention to visual hierarchy, dynamic movement, and refined aesthetic polish.'}</p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-purple-100 text-xs">
            <div>
              <span className="text-purple-700 font-mono block mb-1">DISCIPLINE</span>
              <span className="font-semibold text-neutral-800">{project.categoryLabel}</span>
            </div>
            <div>
              <span className="text-purple-700 font-mono block mb-1">TIMEFRAME</span>
              <span className="font-semibold text-neutral-800">{project.year}</span>
            </div>
            <div>
              <span className="text-purple-700 font-mono block mb-1">TOOLS USED</span>
              <span className="font-semibold text-neutral-800">
                {project.tools ? project.tools.join(', ') : 'Creative Suite & Motion'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal footer navigation */}
        {(onPrev || onNext) && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-neutral-200 bg-neutral-50/50 text-xs text-neutral-600 shrink-0">
            {onPrev ? (
              <button
                type="button"
                onClick={onPrev}
                className="hover:text-neutral-900 font-medium py-1 transition-colors"
              >
                ← Previous Project
              </button>
            ) : <div />}

            <span className="font-mono text-neutral-400 text-2xs">ESC TO CLOSE</span>

            {onNext ? (
              <button
                type="button"
                onClick={onNext}
                className="hover:text-neutral-900 font-medium py-1 transition-colors"
              >
                Next Project →
              </button>
            ) : <div />}
          </div>
        )}
      </div>
    </div>
  );
};
