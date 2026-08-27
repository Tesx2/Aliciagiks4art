document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page || 'home';
  const gallery = document.getElementById('gallery');
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lightboxImage');
  const lbTitle = document.getElementById('lightboxTitle');
  const lbDesc = document.getElementById('lightboxDesc');
  const lbClose = document.querySelector('.lightbox-close');
  const themeToggle = document.getElementById('themeToggle');
  const lbVideo = document.getElementById('lightboxVideo');

  let currentGalleryItems = [];
  let currentLightboxIndex = -1;
  let projectsCache = null;

  const CMS = window.CMS_CONFIG || {};
  const DEFAULT_CATEGORIES = CMS.categories || ['Branding', 'Motion', 'Illustration', 'Graphic'];

  function getApiBase() {
    return (CMS.apiBase || '').replace(/\/$/, '');
  }

  function categoryHref(categoryName) {
    return `work.html?cat=${encodeURIComponent(categoryName)}`;
  }

  function projectHref(slug) {
    return `project.html?slug=${encodeURIComponent(slug)}`;
  }

  function formatCategoryLabel(name) {
    return (name || '').replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function projectCountLabel(count) {
    return `${count} project${count === 1 ? '' : 's'}`;
  }

  function stripHtml(html) {
    const el = document.createElement('div');
    el.innerHTML = html || '';
    return (el.textContent || el.innerText || '').trim();
  }

  function makeSlug(category, filename) {
    const base = (filename || '').replace(/\.[^.]+$/, '');
    return `${category}-${base}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function normalizeDimensions(width, height) {
    const w = Number(width) || null;
    const h = Number(height) || null;
    return {
      width: w,
      height: h,
      aspectRatio: w && h ? w / h : null,
    };
  }

  function normalizeProject(raw) {
    const dims = normalizeDimensions(raw.width, raw.height);
    return {
      id: raw.id || raw.slug,
      slug: raw.slug,
      title: raw.title || '',
      category: raw.category || 'Graphic',
      brief: raw.brief || raw.desc || '',
      client: raw.client || 'Personal / Freelance',
      role: raw.role || 'Graphic Designer & Motion Artist',
      year: raw.year || new Date().getFullYear(),
      featured: Boolean(raw.featured),
      type: raw.type || 'image',
      src: raw.src || '',
      poster: raw.poster || raw.src || '',
      alt: raw.alt || raw.title || '',
      width: dims.width,
      height: dims.height,
      aspectRatio: raw.aspect_ratio || raw.aspectRatio || dims.aspectRatio,
      processStills: (raw.process_stills || raw.processStills || []).map((still) => ({
        src: still.src,
        alt: still.alt || still.title || '',
        title: still.title || '',
        width: still.width || null,
        height: still.height || null,
      })),
      filename: raw.filename || '',
      mtime: raw.date || raw.mtime || null,
    };
  }

  function enrichItem(item, categoryName, categoryItems) {
    const enriched = normalizeProject(Object.assign({}, item, { category: item.category || categoryName }));
    if (!enriched.slug) enriched.slug = makeSlug(enriched.category, enriched.filename || enriched.title);
    if (!enriched.processStills?.length && categoryItems) {
      enriched.processStills = categoryItems
        .filter((other) => other.src !== enriched.src && other.type === 'image')
        .slice(0, 3)
        .map((other) => ({
          src: other.src,
          alt: other.alt,
          title: other.title,
          width: other.width,
          height: other.height,
        }));
    }
    return enriched;
  }

  async function fetchWpProjects() {
    const apiBase = getApiBase();
    if (!apiBase) throw new Error('WordPress API not configured');

    const perPage = CMS.perPage || 100;
    let pageNum = 1;
    const all = [];

    while (true) {
      const url = `${apiBase}/wp-json/wp/v2/projects?per_page=${perPage}&page=${pageNum}&_embed`;
      const resp = await fetch(url, { cache: 'no-store' });
      if (!resp.ok) throw new Error(`WordPress API error: ${resp.status}`);
      const batch = await resp.json();
      if (!Array.isArray(batch) || !batch.length) break;
      all.push(...batch);
      if (batch.length < perPage) break;
      pageNum += 1;
    }

    return all.map((post) => {
      if (post.portfolio) return normalizeProject(post.portfolio);
      const media = post._embedded?.['wp:featuredmedia']?.[0];
      const terms = (post._embedded?.['wp:term'] || []).flat();
      const categoryTerm = terms.find((t) => t.taxonomy === 'project_category');
      const details = post.featured_media_details || {};
      const meta = media?.media_details || {};

      return normalizeProject({
        id: post.id,
        slug: post.slug,
        title: stripHtml(post.title?.rendered),
        brief: stripHtml(post.excerpt?.rendered) || stripHtml(post.content?.rendered),
        category: categoryTerm?.name || 'Graphic',
        client: post.meta?.client,
        role: post.meta?.role,
        year: post.meta?.project_date || new Date(post.date).getFullYear(),
        featured: post.meta?.featured,
        type: post.meta?.video_url ? 'video' : 'image',
        src: post.meta?.video_url || details.src || media?.source_url || '',
        poster: details.src || media?.source_url || '',
        alt: details.alt || media?.alt_text || stripHtml(post.title?.rendered),
        width: details.width || meta.width,
        height: details.height || meta.height,
        aspect_ratio: details.aspect_ratio,
        process_stills: post.meta?.process_stills,
        date: post.date,
      });
    });
  }

  async function loadManifestProjects() {
    const resp = await fetch('geeks4drisony/manifest.json', { cache: 'no-store' });
    if (!resp.ok) throw new Error('Manifest not found');
    const manifest = await resp.json();
    const items = [];

    (manifest.categories || []).forEach((cat) => {
      (cat.items || []).forEach((item) => {
        items.push(enrichItem(item, cat.name, cat.items));
      });
    });

    return items;
  }

  async function loadProjects() {
    if (projectsCache) return projectsCache;

    try {
      if (getApiBase()) {
        projectsCache = await fetchWpProjects();
        return projectsCache;
      }
    } catch (err) {
      console.warn('WordPress fetch failed, using manifest fallback:', err);
    }

    projectsCache = await loadManifestProjects();
    return projectsCache;
  }

  function groupByCategory(projects) {
    const map = new Map();
    projects.forEach((project) => {
      const key = project.category || 'Graphic';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(project);
    });
    return map;
  }

  function getCategoriesFromProjects(projects) {
    const byCategory = groupByCategory(projects);
    return Array.from(byCategory.entries())
      .filter(([, items]) => items.length)
      .map(([name, items]) => ({ name, items }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function getFeaturedPerCategory(projects) {
    const byCategory = groupByCategory(projects);
    const featured = [];

    byCategory.forEach((items) => {
      if (!items.length) return;
      const pinned = items.find((item) => item.featured);
      featured.push(pinned || items[0]);
    });

    return featured;
  }

  function buildProjectIndex(projects) {
    const bySlug = new Map();
    const byCategory = new Map();

    projects.forEach((project) => {
      bySlug.set(project.slug, project);
      const cat = project.category || 'Graphic';
      if (!byCategory.has(cat)) byCategory.set(cat, []);
      byCategory.get(cat).push(project);
    });

    return { bySlug, byCategory, categories: getCategoriesFromProjects(projects) };
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggle) themeToggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    localStorage.setItem('site-theme', theme);
  }

  const savedTheme = localStorage.getItem('site-theme') || 'dark';
  applyTheme(savedTheme);
  themeToggle?.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
  });

  const nav = document.querySelector('.nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelectorAll('.nav-links a');

  function setMenuState(isOpen) {
    if (!nav || !menuToggle) return;
    nav.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  }

  menuToggle?.addEventListener('click', () => setMenuState(!nav?.classList.contains('is-open')));
  navLinks.forEach((link) => link.addEventListener('click', () => setMenuState(false)));

  document.addEventListener('click', (event) => {
    if (!nav?.classList.contains('is-open') || nav.contains(event.target)) return;
    setMenuState(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav?.classList.contains('is-open')) {
      setMenuState(false);
      menuToggle?.focus();
    }
  });

  function applyMediaAspect(figure, item) {
    if (item.aspectRatio) {
      figure.style.aspectRatio = `${item.width} / ${item.height}`;
    } else {
      figure.style.removeProperty('aspect-ratio');
    }
  }

  function buildCardMedia(item, { contain = true } = {}) {
    const figure = document.createElement('figure');
    figure.className = contain ? 'card-media card-media--contain' : 'card-media';
    applyMediaAspect(figure, item);

    if (item.category) {
      const tag = document.createElement('span');
      tag.className = 'card-category';
      tag.textContent = formatCategoryLabel(item.category);
      figure.appendChild(tag);
    }

    if (item.type === 'video') {
      const vid = document.createElement('video');
      vid.src = item.src;
      if (item.poster) vid.setAttribute('poster', item.poster);
      vid.setAttribute('playsinline', '');
      vid.setAttribute('muted', '');
      vid.setAttribute('preload', 'metadata');
      vid.setAttribute('aria-hidden', 'true');
      figure.appendChild(vid);

      const badge = document.createElement('span');
      badge.className = 'video-badge';
      badge.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 5v14l11-7L8 5z" fill="currentColor"/></svg><span>Motion</span>';
      figure.appendChild(badge);
    } else {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt || item.title || '';
      if (item.width) img.width = item.width;
      if (item.height) img.height = item.height;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.onerror = () => {
        img.src = 'assets/square.svg';
        img.onerror = null;
      };
      figure.appendChild(img);
    }

    const figcap = document.createElement('figcaption');
    figcap.className = 'overlay';
    figcap.innerHTML = `<div class="overlay-inner"><h3>${item.title || ''}</h3><p class="card-view-case">View case study →</p></div>`;
    figure.appendChild(figcap);

    const cap = document.createElement('div');
    cap.className = 'card-caption';
    cap.textContent = item.title || '';
    figure.appendChild(cap);

    return figure;
  }

  function createCard(item) {
    const link = document.createElement('a');
    link.className = 'card card-tilt';
    link.href = projectHref(item.slug);
    link.setAttribute('aria-label', `View case study: ${item.title || 'project'}${item.category ? ` — ${formatCategoryLabel(item.category)}` : ''}`);
    link.appendChild(buildCardMedia(item));
    return link;
  }

  function animateStaggerContainer(container) {
    if (!container) return;
    const parentReveal = container.closest('.reveal');
    container.querySelectorAll(':scope > *').forEach((el, idx) => {
      el.style.setProperty('--stagger', idx);
    });
    if (parentReveal) parentReveal.classList.add('is-visible');
  }

  function renderGallery(items, { masonry = true } = {}) {
    if (!gallery) return;
    currentGalleryItems = items || [];
    gallery.innerHTML = '';
    gallery.classList.toggle('gallery-masonry', masonry);

    if (!currentGalleryItems.length) {
      gallery.innerHTML = '<p class="gallery-empty">No projects in this category yet.</p>';
      gallery.classList.remove('gallery-masonry');
      return;
    }

    const frag = document.createDocumentFragment();
    currentGalleryItems.forEach((item) => frag.appendChild(createCard(item)));
    gallery.appendChild(frag);
    animateStaggerContainer(gallery);
  }

  function renderCategoryGrid(categories) {
    const grid = document.getElementById('categoryGrid');
    if (!grid) return;

    grid.innerHTML = '';
    const frag = document.createDocumentFragment();

    categories.forEach((cat, idx) => {
      const count = (cat.items || []).length;
      if (!count) return;

      const cover = cat.items[0];
      const link = document.createElement('a');
      link.className = 'category-card';
      link.href = categoryHref(cat.name);
      link.style.setProperty('--stagger', idx);

      const coverHtml = cover?.src
        ? `<div class="category-card-cover"><img src="${cover.poster || cover.src}" alt="${cover.alt || formatCategoryLabel(cat.name)} cover" loading="lazy" width="${cover.width || ''}" height="${cover.height || ''}"></div>`
        : '';

      link.innerHTML = `
        ${coverHtml}
        <span class="category-card-name">${formatCategoryLabel(cat.name)}</span>
        <span class="category-card-count">${projectCountLabel(count)}</span>
        <span class="category-card-cta" aria-hidden="true">View collection →</span>
      `;
      frag.appendChild(link);
    });

    grid.appendChild(frag);
    animateStaggerContainer(grid);
  }

  function renderCategoryNav(categories, activeCategory) {
    const navEl = document.getElementById('categoryNav');
    if (!navEl) return;

    navEl.innerHTML = '';
    const frag = document.createDocumentFragment();

    categories.forEach((cat) => {
      const count = (cat.items || []).length;
      if (!count) return;

      const link = document.createElement('a');
      link.className = 'filter-btn';
      link.href = categoryHref(cat.name);
      link.textContent = formatCategoryLabel(cat.name);
      if (cat.name === activeCategory) link.classList.add('active');
      link.setAttribute('aria-current', cat.name === activeCategory ? 'page' : 'false');
      frag.appendChild(link);
    });

    navEl.appendChild(frag);
  }

  function showGalleryError(message) {
    if (!gallery) return;
    gallery.classList.remove('gallery-masonry');
    gallery.innerHTML = `<p class="gallery-empty">${message}</p>`;
  }

  async function initHomePage() {
    try {
      const projects = await loadProjects();
      const categories = getCategoriesFromProjects(projects);
      renderGallery(getFeaturedPerCategory(projects));
      renderCategoryGrid(categories);
    } catch (err) {
      console.warn('Could not load projects:', err);
      showGalleryError('Projects could not load. Check the WordPress API URL in cms-config.js or serve the site locally.');
    }
  }

  async function initCategoryPage() {
    const params = new URLSearchParams(window.location.search);
    const categoryName = params.get('cat');
    const titleEl = document.getElementById('categoryTitle');
    const leadEl = document.getElementById('categoryLead');
    const breadcrumbEl = document.getElementById('breadcrumbCurrent');

    if (!categoryName) {
      if (titleEl) titleEl.textContent = 'Category not found';
      if (leadEl) leadEl.textContent = 'Choose a category from the featured work page.';
      showGalleryError('No category was selected. <a href="index.html#portfolio">Back to featured work</a>');
      return;
    }

    try {
      const projects = await loadProjects();
      const { byCategory, categories } = buildProjectIndex(projects);
      const items = byCategory.get(categoryName);

      if (!items?.length) {
        if (titleEl) titleEl.textContent = 'Category not found';
        if (leadEl) leadEl.textContent = `"${formatCategoryLabel(categoryName)}" does not exist.`;
        showGalleryError('Category not found. <a href="index.html#portfolio">Back to featured work</a>');
        return;
      }

      const label = formatCategoryLabel(categoryName);
      document.title = `${label} — Aliciagiks4art`;
      if (titleEl) titleEl.textContent = label;
      if (leadEl) leadEl.textContent = `${projectCountLabel(items.length)} in this collection.`;
      if (breadcrumbEl) breadcrumbEl.textContent = label;

      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.href = `https://aliciagiks4art.netlify.app/work.html?cat=${encodeURIComponent(categoryName)}`;

      renderCategoryNav(categories, categoryName);
      renderGallery(items);
    } catch (err) {
      console.warn('Could not load projects:', err);
      showGalleryError('Projects could not load. Check the WordPress API URL in cms-config.js.');
    }
  }

  function renderFinalMedia(item, container) {
    if (!container) return;
    container.innerHTML = '';
    container.className = 'case-final case-final--contain';

    if (item.type === 'video') {
      const vid = document.createElement('video');
      vid.src = item.src;
      if (item.poster) vid.setAttribute('poster', item.poster);
      vid.controls = true;
      vid.playsInline = true;
      vid.setAttribute('aria-label', item.title || 'Project video');
      container.appendChild(vid);
    } else {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt || item.title || '';
      if (item.width) img.width = item.width;
      if (item.height) img.height = item.height;
      img.loading = 'eager';
      img.decoding = 'async';
      container.appendChild(img);
    }
  }

  function renderProcessStills(stills, container, section) {
    if (!container || !section) return;
    if (!stills?.length) {
      section.hidden = true;
      return;
    }

    section.hidden = false;
    container.innerHTML = '';
    stills.forEach((still) => {
      const figure = document.createElement('figure');
      figure.className = 'process-item process-item--contain';
      const img = document.createElement('img');
      img.src = still.src;
      img.alt = still.alt || still.title || 'Process still';
      if (still.width) img.width = still.width;
      if (still.height) img.height = still.height;
      img.loading = 'lazy';
      figure.appendChild(img);
      if (still.title) {
        const cap = document.createElement('figcaption');
        cap.textContent = still.title;
        figure.appendChild(cap);
      }
      container.appendChild(figure);
    });
  }

  function renderCaseNav(item, siblings) {
    const navEl = document.getElementById('caseNav');
    if (!navEl || !siblings?.length) return;

    const idx = siblings.findIndex((s) => s.slug === item.slug);
    navEl.innerHTML = '';

    if (idx > 0) {
      const prev = document.createElement('a');
      prev.className = 'btn btn--ghost case-nav-link';
      prev.href = projectHref(siblings[idx - 1].slug);
      prev.textContent = `← ${siblings[idx - 1].title}`;
      navEl.appendChild(prev);
    }

    const category = document.createElement('a');
    category.className = 'btn btn--ghost case-nav-link';
    category.href = categoryHref(item.category);
    category.textContent = `All ${formatCategoryLabel(item.category)}`;
    navEl.appendChild(category);

    if (idx < siblings.length - 1) {
      const next = document.createElement('a');
      next.className = 'btn btn--ghost case-nav-link case-nav-next';
      next.href = projectHref(siblings[idx + 1].slug);
      next.textContent = `${siblings[idx + 1].title} →`;
      navEl.appendChild(next);
    }
  }

  async function initProjectPage() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    if (!slug) {
      document.getElementById('projectTitle').textContent = 'Project not found';
      document.getElementById('projectBrief').textContent = 'No project was selected.';
      return;
    }

    try {
      const projects = await loadProjects();
      const { bySlug, byCategory } = buildProjectIndex(projects);
      const item = bySlug.get(slug);

      if (!item) {
        document.getElementById('projectTitle').textContent = 'Project not found';
        document.getElementById('projectBrief').textContent = 'This case study could not be found.';
        return;
      }

      const siblings = byCategory.get(item.category) || [];
      const label = formatCategoryLabel(item.category);

      document.title = `${item.title} — Aliciagiks4art`;
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.href = `https://aliciagiks4art.netlify.app/project.html?slug=${encodeURIComponent(slug)}`;

      document.getElementById('projectTitle').textContent = item.title;
      document.getElementById('caseCategory').textContent = label;
      document.getElementById('metaClient').textContent = item.client;
      document.getElementById('metaRole').textContent = item.role;
      document.getElementById('metaYear').textContent = String(item.year);
      document.getElementById('projectBrief').textContent = item.brief;

      const breadcrumbCategory = document.getElementById('breadcrumbCategory');
      if (breadcrumbCategory) {
        breadcrumbCategory.textContent = label;
        breadcrumbCategory.href = categoryHref(item.category);
      }
      document.getElementById('breadcrumbCurrent').textContent = item.title;

      renderProcessStills(item.processStills, document.getElementById('processStills'), document.getElementById('processSection'));
      renderFinalMedia(item, document.getElementById('finalPiece'));
      renderCaseNav(item, siblings);
    } catch (err) {
      console.warn('Could not load project:', err);
      document.getElementById('projectBrief').textContent = 'This case study could not be loaded.';
    }
  }

  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

      revealEls.forEach((el) => revealObserver.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    }
  }

  function initCardTilt() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    document.addEventListener('mousemove', (event) => {
      const card = event.target.closest('.card-tilt');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tilt-x', `${y * -6}deg`);
      card.style.setProperty('--tilt-y', `${x * 6}deg`);
    });

    document.addEventListener('mouseout', (event) => {
      const card = event.target.closest('.card-tilt');
      if (!card) return;
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  }

  lbClose?.addEventListener('click', () => {
    lightbox?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    try { if (lbVideo) { lbVideo.pause(); lbVideo.currentTime = 0; lbVideo.src = ''; lbVideo.hidden = true; } } catch (e) {}
    try { if (lbImage) { lbImage.src = ''; lbImage.hidden = true; } } catch (e) {}
    currentLightboxIndex = -1;
  });

  lightbox?.addEventListener('click', (ev) => {
    if (ev.target === lightbox) lbClose?.click();
  });

  initScrollReveal();
  initCardTilt();

  if (page === 'category') initCategoryPage();
  else if (page === 'project' && !document.getElementById('case-study-container')) initProjectPage();
  else initHomePage();
});
