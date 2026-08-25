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

  function makeSlug(category, filename) {
    const base = (filename || '').replace(/\.[^.]+$/, '');
    return `${category}-${base}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function enrichItem(item, categoryName, categoryItems) {
    const enriched = Object.assign({}, item);
    enriched.category = enriched.category || categoryName;
    enriched.slug = enriched.slug || makeSlug(enriched.category, enriched.filename);
    enriched.year = enriched.year || new Date(enriched.mtime || Date.now()).getFullYear();
    enriched.client = enriched.client || 'Personal / Freelance';
    enriched.role = enriched.role || 'Graphic Designer & Motion Artist';
    enriched.brief = enriched.brief || `A ${formatCategoryLabel(enriched.category)} project — ${enriched.title}. Crafted with bold visual language and refined attention to detail.`;
    if (!enriched.processStills?.length && categoryItems) {
      enriched.processStills = categoryItems
        .filter((other) => other.src !== enriched.src && other.type === 'image')
        .slice(0, 3)
        .map((other) => ({ src: other.src, alt: other.alt, title: other.title }));
    }
    return enriched;
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

  menuToggle?.addEventListener('click', () => {
    setMenuState(!nav?.classList.contains('is-open'));
  });

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

  function openLightboxItem(item, index) {
    if (!lightbox) return;
    try { if (lbVideo) { lbVideo.pause(); lbVideo.src = ''; lbVideo.hidden = true; } } catch (e) {}
    try { if (lbImage) { lbImage.src = ''; lbImage.hidden = true; } } catch (e) {}

    lbTitle.textContent = item.title || '';
    lbDesc.textContent = item.desc || item.brief || '';

    if (item.type === 'video' && lbVideo) {
      lbVideo.src = item.src;
      if (item.poster) lbVideo.setAttribute('poster', item.poster);
      else lbVideo.removeAttribute('poster');
      lbVideo.hidden = false;
      lbVideo.controls = true;
      lbVideo.muted = true;
      lbVideo.playsInline = true;
    } else if (lbImage) {
      lbImage.src = item.src;
      lbImage.alt = item.alt || item.title || '';
      lbImage.hidden = false;
    }

    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    currentLightboxIndex = index;
    lbClose?.focus();
  }

  function openLightboxByIndex(idx) {
    if (!Array.isArray(currentGalleryItems) || idx < 0 || idx >= currentGalleryItems.length) return;
    openLightboxItem(currentGalleryItems[idx], idx);
  }

  function buildCardMedia(item) {
    const figure = document.createElement('figure');

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
    cap.textContent = item.title || item.filename || '';
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

  function renderGallery(items) {
    if (!gallery) return;
    currentGalleryItems = items || [];
    gallery.innerHTML = '';

    if (!currentGalleryItems.length) {
      gallery.innerHTML = '<p class="gallery-empty">No projects in this category yet.</p>';
      return;
    }

    const frag = document.createDocumentFragment();
    currentGalleryItems.forEach((item) => frag.appendChild(createCard(item)));
    gallery.appendChild(frag);
    animateStaggerContainer(gallery);
  }

  function getFeaturedPerCategory(categories) {
    return categories
      .map((cat) => {
        const items = cat.items || [];
        if (!items.length) return null;
        return enrichItem(items[0], cat.name, items);
      })
      .filter(Boolean);
  }

  function renderCategoryGrid(categories) {
    const grid = document.getElementById('categoryGrid');
    if (!grid) return;

    grid.innerHTML = '';
    const frag = document.createDocumentFragment();

    categories.forEach((cat, idx) => {
      const count = (cat.items || []).length;
      if (!count) return;

      const link = document.createElement('a');
      link.className = 'category-card';
      link.href = categoryHref(cat.name);
      link.style.setProperty('--stagger', idx);
      link.innerHTML = `
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
    gallery.innerHTML = `<p class="gallery-empty">${message}</p>`;
  }

  async function loadManifest() {
    const resp = await fetch('geeks4drisony/manifest.json', { cache: 'no-store' });
    if (!resp.ok) throw new Error('Manifest not found');
    return resp.json();
  }

  function flattenManifest(manifest) {
    const categories = manifest.categories || [];
    const bySlug = new Map();
    const byCategory = new Map();

    categories.forEach((cat) => {
      const enriched = (cat.items || []).map((item) => enrichItem(item, cat.name, cat.items));
      byCategory.set(cat.name, enriched);
      enriched.forEach((item) => bySlug.set(item.slug, item));
    });

    return { categories, bySlug, byCategory };
  }

  async function initHomePage() {
    try {
      const manifest = await loadManifest();
      const { categories } = flattenManifest(manifest);
      renderGallery(getFeaturedPerCategory(categories));
      renderCategoryGrid(categories);
    } catch (err) {
      console.warn('Could not load manifest:', err);
      showGalleryError('Projects could not load. Open this site through a local server so the gallery can read the project manifest.');
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
      const manifest = await loadManifest();
      const { categories, byCategory } = flattenManifest(manifest);
      const items = byCategory.get(categoryName);

      if (!items) {
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
      console.warn('Could not load manifest:', err);
      showGalleryError('Projects could not load. Open this site through a local server so the gallery can read the project manifest.');
    }
  }

  function renderFinalMedia(item, container) {
    if (!container) return;
    container.innerHTML = '';

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
      figure.className = 'process-item';
      const img = document.createElement('img');
      img.src = still.src;
      img.alt = still.alt || still.title || 'Process still';
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
      const manifest = await loadManifest();
      const { bySlug, byCategory } = flattenManifest(manifest);
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
      const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
      if (breadcrumbCurrent) breadcrumbCurrent.textContent = item.title;

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

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && lightbox?.getAttribute('aria-hidden') === 'false') {
      lbClose?.click();
      return;
    }
    if (lightbox?.getAttribute('aria-hidden') === 'false') {
      if (ev.key === 'ArrowLeft' && currentLightboxIndex > 0) openLightboxByIndex(currentLightboxIndex - 1);
      if (ev.key === 'ArrowRight' && currentLightboxIndex < currentGalleryItems.length - 1) openLightboxByIndex(currentLightboxIndex + 1);
    }
  });

  initScrollReveal();
  initCardTilt();

  if (page === 'category') initCategoryPage();
  else if (page === 'project') initProjectPage();
  else initHomePage();
});
