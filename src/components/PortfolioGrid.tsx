import React, { useState, useMemo, useEffect } from 'react';
import { Play, Film, Image as ImageIcon, Eye, Search, Layers, Grid, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioItem, CATEGORY_FILTERS, FEATURED_PROJECTS } from '../data/portfolioData';
import { ProjectModal } from './ProjectModal';

export const PortfolioGrid: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>(FEATURED_PROJECTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProject, setActiveModalProject] = useState<PortfolioItem | null>(null);
  const [isFullArchiveLoaded, setIsFullArchiveLoaded] = useState<boolean>(false);
  const [loadingArchive, setLoadingArchive] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/index.json', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Project feed returned ${response.status}.`);
        return response.json();
      })
      .then((data: unknown) => {
        if (cancelled || !data || typeof data !== 'object' || !('projects' in data) || !Array.isArray(data.projects)) return;

        // The published project feed is the live source for uploaded work. Keep the bundled
        // projects as the initial portfolio and fallback when R2 has no uploads.
        const uploaded = data.projects.filter((project): project is PortfolioItem =>
          Boolean(
            project &&
            typeof project === 'object' &&
            typeof project.id === 'string' &&
            typeof project.title === 'string' &&
            typeof project.category === 'string' &&
            typeof project.src === 'string' &&
            (project.type === 'image' || project.type === 'video'),
          ),
        ).map((project) => ({
          ...project,
          categoryLabel: project.categoryLabel || project.category,
          alt: project.alt || project.title,
          year: project.year,
        }));

        if (uploaded.length === 0) return;
        setItems((current) => {
          const uploadedIds = new Set(uploaded.map((project) => project.id));
          const bundled = current.filter((project) => !uploadedIds.has(project.id) && !project.src.startsWith('/api/media/'));
          return [...uploaded, ...bundled];
        });
      })
      .catch((error) => {
        if (!cancelled) console.warn('Could not load managed portfolio projects; keeping bundled work.', error);
      });
    return () => { cancelled = true; };
  }, []);

  // Load complete manifest from public/geeks4drisony/manifest.json
  const loadFullArchive = async () => {
    if (isFullArchiveLoaded) return;
    setLoadingArchive(true);
    try {
      const res = await fetch('geeks4drisony/manifest.json');
      if (!res.ok) throw new Error('Failed to load manifest');
      const data = await res.json();
      
      const categoryLabelMap: Record<string, string> = {
        '3D': '3D Art',
        'drawing': 'Drawing & Art',
        'logo design': 'Brand & Logo',
        'motion graphic': 'Motion Graphics',
        'photography': 'Photography',
        'posters': 'Posters & Print',
      };

      const parsedItems: PortfolioItem[] = [];
      data.categories.forEach((cat: { name: string; items: any[] }) => {
        cat.items.forEach((item: any) => {
          parsedItems.push({
            id: item.slug || `${cat.name}-${item.filename}`,
            title: item.title || item.filename,
            category: cat.name,
            categoryLabel: categoryLabelMap[cat.name] || cat.name,
            src: item.src,
            type: item.type === 'video' ? 'video' : 'image',
            alt: item.alt || item.altText || item.title || item.filename,
          });
        });
      });

      if (parsedItems.length > 0) {
        setItems((current) => {
          const uploaded = current.filter((project) => project.src.startsWith('/api/media/'));
          const merged = new Map<string, PortfolioItem>();
          [...parsedItems, ...current.filter((project) => !project.src.startsWith('/api/media/')), ...uploaded]
            .forEach((project) => merged.set(project.id, project));
          return Array.from(merged.values());
        });
        setIsFullArchiveLoaded(true);
      }
    } catch (err) {
      console.warn('Falling back to curated projects:', err);
    } finally {
      setLoadingArchive(false);
    }
  };

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesQuery =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [items, selectedCategory, searchQuery]);

  const currentIndex = activeModalProject
    ? filteredItems.findIndex((i) => i.id === activeModalProject.id)
    : -1;

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < filteredItems.length - 1) {
      setActiveModalProject(filteredItems[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveModalProject(filteredItems[currentIndex - 1]);
    }
  };

  return (
    <section id="portfolio" className="py-16 sm:py-24 border-b border-purple-200/70 bg-white/70 backdrop-blur-xs relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-purple-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-900 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#420D58]" />
              <span className="font-semibold">Selected Works</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight">
              Work across image, print, and motion
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-2 max-w-xl">
              A selection of graphic design, animation, illustration, photography, and digital art. Open a project to see it up close.
            </p>
          </div>

          {/* Archive switcher button with purple styling */}
          <div className="flex items-center gap-3 shrink-0">
            {!isFullArchiveLoaded ? (
              <button
                type="button"
                onClick={loadFullArchive}
                disabled={loadingArchive}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-purple-950 bg-purple-50 hover:bg-purple-100/90 rounded-md transition-all border border-purple-200 shadow-2xs hover:scale-[1.02]"
              >
                <Layers className="w-3.5 h-3.5 text-purple-700" />
                <span>{loadingArchive ? 'Loading archive...' : 'Browse all projects'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-purple-900 font-mono bg-purple-50 px-3 py-1.5 rounded-md border border-purple-200">
                <Grid className="w-3.5 h-3.5 text-purple-600" />
                <span>Archive Active ({items.length} works)</span>
              </div>
            )}
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          {/* Category Filter Tabs with royal purple styling */}
          <div role="group" aria-label="Filter projects by category" className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none p-1 bg-purple-50/80 rounded-lg border border-purple-200/60">
            {CATEGORY_FILTERS.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  aria-pressed={isActive}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#420D58] to-[#6B21A8] text-white shadow-xs shadow-purple-900/30'
                      : 'text-neutral-700 hover:text-purple-950 hover:bg-white/80'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Quick Search with purple focus ring */}
          <div className="relative w-full sm:w-60 shrink-0">
            <Search className="w-3.5 h-3.5 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <label className="sr-only" htmlFor="portfolio-search">Search projects</label>
            <input
              id="portfolio-search"
              type="text"
              placeholder="Search works..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-purple-200 rounded-md focus:outline-hidden focus:border-purple-600 focus:ring-1 focus:ring-purple-600 text-neutral-900 placeholder:text-neutral-400 transition-colors shadow-2xs"
            />
          </div>
        </div>

        <p className="mt-4 text-xs text-neutral-500" aria-live="polite" aria-atomic="true">
          Showing <span className="font-semibold text-neutral-700">{filteredItems.length}</span> {filteredItems.length === 1 ? 'project' : 'projects'}
          {selectedCategory !== 'all' ? ` in ${CATEGORY_FILTERS.find((category) => category.id === selectedCategory)?.label || selectedCategory}` : ''}
          {searchQuery.trim() ? ` matching “${searchQuery.trim()}”` : ''}.
        </p>

        {/* Project Grid with motion & hover elevation */}
        <motion.div 
          layout
          className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence>
            {filteredItems.map((project) => (
              <motion.article
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                key={project.id}
                role="button"
                tabIndex={0}
                aria-label={`View project: ${project.title}`}
                data-cursor={project.type === 'video' ? 'play' : 'inspect'}
                data-cursor-text={project.type === 'video' ? 'PLAY REEL' : 'INSPECT'}
                onClick={() => setActiveModalProject(project)}
                onKeyDown={(event) => {
                  if (event.target !== event.currentTarget) return;
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveModalProject(project);
                  }
                }}
                className="group cursor-pointer rounded-2xl border border-purple-200/80 bg-white hover:border-purple-300 transition-all duration-300 hover:shadow-xl hover:shadow-purple-950/8 hover:-translate-y-1 flex flex-col overflow-hidden"
              >
                {/* Media Container */}
                <div className="relative aspect-16/10 bg-neutral-900 overflow-hidden border-b border-purple-100">
                  {project.type === 'video' ? (
                    <div className="relative w-full h-full">
                      <video
                        src={project.src}
                        aria-label={project.alt || project.title}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        onMouseEnter={(e) => {
                          const target = e.currentTarget;
                          target.play().catch(() => {});
                        }}
                        onMouseLeave={(e) => {
                          const target = e.currentTarget;
                          target.pause();
                          target.currentTime = 0;
                        }}
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 px-2 py-1 bg-[#420D58]/85 backdrop-blur-xs text-white text-2xs font-mono rounded-md flex items-center gap-1 shadow-xs">
                        <Film className="w-3 h-3 text-purple-200" />
                        <span>VIDEO</span>
                      </div>
                      <div className="absolute inset-0 bg-[#420D58]/10 group-hover:bg-[#420D58]/20 transition-colors flex items-center justify-center pointer-events-none">
                        <div className="w-11 h-11 rounded-full bg-white text-[#420D58] flex items-center justify-center shadow-md opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src={project.src}
                        alt={project.alt || project.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'assets/square.svg';
                        }}
                      />
                      <div className="absolute top-3 right-3 px-2 py-1 bg-neutral-900/75 backdrop-blur-xs text-white text-2xs font-mono rounded-md flex items-center gap-1 shadow-xs">
                        <ImageIcon className="w-3 h-3" />
                        <span>STILL</span>
                      </div>
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-white/95 text-purple-950 text-2xs font-semibold rounded-md flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3 h-3 text-purple-700" />
                      <span>FEATURED</span>
                    </div>
                  )}
                </div>

                {/* Project Card Content */}
                <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
                  <div>
                    {/* Unboxed Metadata in purple */}
                    <div className="flex items-center gap-2 text-xs text-purple-900/70 font-mono">
                      <span className="font-semibold text-purple-900">{project.categoryLabel}</span>
                      {project.year && <>
                        <span aria-hidden="true" className="text-purple-300">·</span>
                        <span>{project.year}</span>
                      </>}
                    </div>

                    <h3 className="text-base font-semibold text-neutral-900 mt-1.5 group-hover:text-purple-900 transition-colors">
                      {project.title}
                    </h3>

                    {project.brief && <p className="text-xs text-neutral-600 line-clamp-2 mt-1 leading-relaxed">{project.brief}</p>}
                  </div>

                  <div className="pt-3 border-t border-purple-100 flex items-center justify-between text-xs text-neutral-500">
                    <span className="inline-flex items-center gap-1 text-purple-900 font-semibold group-hover:underline">
                      <span>View project</span>
                      <Eye className="w-3.5 h-3.5 text-purple-600 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty Search Result State */}
        {filteredItems.length === 0 && (
          <div className="py-16 text-center border border-dashed border-purple-200 rounded-xl mt-6 bg-purple-50/40">
            <p className="text-sm font-semibold text-purple-950">No projects found</p>
            <p className="text-xs text-neutral-500 mt-1">Try resetting the category filter or searching for another term.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#420D58] hover:bg-[#350A47] rounded-md transition-colors shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Modal Dialog for full view */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
        onNext={currentIndex < filteredItems.length - 1 ? handleNext : undefined}
        onPrev={currentIndex > 0 ? handlePrev : undefined}
      />
    </section>
  );
};
