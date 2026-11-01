import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Film, Image as ImageIcon } from 'lucide-react';
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
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector<HTMLElement>('button')?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], video[controls], [tabindex]:not([tabindex="-1"])',
        ));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [project, onClose, onNext, onPrev]);

  if (!project) return null;

  return createPortal((
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-neutral-900/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <div
        ref={dialogRef}
        className="relative flex h-[calc(100dvh-1rem)] max-h-[calc(100dvh-1rem)] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl sm:h-[90dvh] sm:max-h-[90dvh]"
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
            {project.year && <>
              <span aria-hidden="true" className="text-purple-300">·</span>
              <span>{project.year}</span>
            </>}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 text-neutral-500 hover:text-purple-950 hover:bg-purple-100 rounded-md transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Container */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-neutral-950 sm:w-fit sm:max-w-full sm:self-center">
          {project.type === 'video' ? (
            <video
              src={project.src}
              aria-label={project.alt || project.title}
              controls
              autoPlay
              playsInline
              className="h-full w-full max-h-full object-contain sm:w-auto sm:max-w-full"
            />
          ) : (
            <img
              src={project.src}
              alt={project.alt || project.title}
              className="h-full w-full max-h-full object-contain sm:w-auto sm:max-w-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'assets/tall.svg';
              }}
            />
          )}
        </div>

        {/* Content & Details Pane */}
        <div className="max-h-[24dvh] shrink-0 space-y-5 overflow-y-auto overscroll-contain p-4 sm:max-h-[25dvh] sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h2 id="modal-project-title" className="text-xl sm:text-2xl font-bold text-neutral-900">
                {project.title}
              </h2>
              {(project.client || project.role) && <div className="flex items-center gap-3 text-xs sm:text-sm text-neutral-500 mt-1">
                {project.client && <span className="text-purple-800 font-medium">{project.client}</span>}
                {project.client && project.role && <span aria-hidden="true">·</span>}
                {project.role && <span>{project.role}</span>}
              </div>}
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

          {project.brief && <div className="prose prose-neutral max-w-none text-sm text-neutral-600 leading-relaxed"><p>{project.brief}</p></div>}

          {/* Metadata Grid */}
          <div className={`grid gap-4 pt-4 border-t border-purple-100 text-xs ${project.year ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}`}>
            <div>
              <span className="text-purple-700 font-mono block mb-1">DISCIPLINE</span>
              <span className="font-semibold text-neutral-800">{project.categoryLabel}</span>
            </div>
            {project.year && <div>
              <span className="text-purple-700 font-mono block mb-1">YEAR</span>
              <span className="font-semibold text-neutral-800">{project.year}</span>
            </div>}
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
  ), document.body);
};
