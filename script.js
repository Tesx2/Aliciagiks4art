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

  function formatCategoryLabel(name) {
    return (name || '').replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function projectCountLabel(count) {
    return `${count} project${count === 1 ? '' : 's'}`;
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggle) themeToggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    localStorage.setItem('site-theme', theme);
  }

  const savedTheme = localStorage.getItem('site-theme') || 'dark';
  applyTheme(savedTheme);
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
    });
  }

  const nav = document.querySelector('.nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelectorAll('.nav-links a');

  function setMenuState(isOpen) {
    if (!nav || !menuToggle) return;
    nav.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav && nav.classList.contains('is-open');
      setMenuState(!isOpen);
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
  });

  document.addEventListener('click', (event) => {
    if (!nav || !nav.classList.contains('is-open')) return;
    if (!nav.contains(event.target)) setMenuState(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav && nav.classList.contains('is-open')) {
      setMenuState(false);
      menuToggle?.focus();
    }
  });

  function openLightboxItem(item, index) {
    try { if (lbVideo) { lbVideo.pause(); lbVideo.src = ''; lbVideo.hidden = true; } } catch (e) {}
    try { if (lbImage) { lbImage.src = ''; lbImage.hidden = true; } } catch (e) {}

    lbTitle.textContent = item.title || '';
    lbDesc.textContent = item.desc || '';

    if (item.type === 'video') {
      if (lbVideo) {
        lbVideo.src = item.src;
        if (item.poster) lbVideo.setAttribute('poster', item.poster);
        else lbVideo.removeAttribute('poster');
        lbVideo.hidden = false;
        lbVideo.controls = true;
        lbVideo.muted = true;
        lbVideo.playsInline = true;
      }
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

  function createCard(item, index) {
    const article = document.createElement('article');
    article.className = 'card';
    article.setAttribute('role', 'button');
    article.setAttribute('tabindex', '0');
    article.setAttribute('aria-label', `View ${item.title || 'project'}${item.category ? ` — ${item.category}` : ''}`);
    article.dataset.title = item.title || '';
    article.dataset.desc = item.desc || '';
    article.dataset.src = item.src;
    article.dataset.category = item.category || '';
    article.dataset.type = item.type || 'image';
    article.dataset.index = String(index);

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
      badge.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8 5v14l11-7L8 5z" fill="currentColor"/></svg><span>Motion</span>';
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
    figcap.innerHTML = `<div class="overlay-inner"><h3>${item.title || ''}</h3></div>`;
    figure.appendChild(figcap);

    const cap = document.createElement('div');
    cap.className = 'card-caption';
    cap.textContent = item.title || item.filename || '';
    figure.appendChild(cap);

    article.appendChild(figure);
    return article;
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
    currentGalleryItems.forEach((item, idx) => frag.appendChild(createCard(item, idx)));
    gallery.appendChild(frag);
  }

  function getFeaturedPerCategory(categories) {
    return categories
      .map((cat) => {
        const items = cat.items || [];
        if (!items.length) return null;
        return Object.assign({ category: cat.name }, items[0]);
      })
      .filter(Boolean);
  }


  function renderCategoryGrid(categories) {
    const grid = document.getElementById('categoryGrid');
    if (!grid) return;

    grid.innerHTML = '';
    const frag = document.createDocumentFragment();

    categories.forEach((cat) => {
      const count = (cat.items || []).length;
      if (!count) return;

      const link = document.createElement('a');
      link.className = 'category-card';
      link.href = categoryHref(cat.name);
      link.innerHTML = `
        <span class="category-card-name">${formatCategoryLabel(cat.name)}</span>
        <span class="category-card-count">${projectCountLabel(count)}</span>
        <span class="category-card-cta" aria-hidden="true">View collection →</span>
      `;
      frag.appendChild(link);
    });

    grid.appendChild(frag);
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

  async function initHomePage() {
    try {
      const manifest = await loadManifest();
      const categories = manifest.categories || [];
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
      const categories = manifest.categories || [];
      const category = categories.find((cat) => cat.name === categoryName);

      if (!category) {
        if (titleEl) titleEl.textContent = 'Category not found';
        if (leadEl) leadEl.textContent = `"${formatCategoryLabel(categoryName)}" does not exist.`;
        showGalleryError(`Category not found. <a href="index.html#portfolio">Back to featured work</a>`);
        return;
      }

      const items = category.items.map((item) => Object.assign({ category: category.name }, item));
      const label = formatCategoryLabel(category.name);

      document.title = `${label} — Aliciagiks4art`;
      if (titleEl) titleEl.textContent = label;
      if (leadEl) leadEl.textContent = `${projectCountLabel(items.length)} in this collection.`;
      if (breadcrumbEl) breadcrumbEl.textContent = label;

      renderCategoryNav(categories, category.name);
      renderGallery(items);
    } catch (err) {
      console.warn('Could not load manifest:', err);
      showGalleryError('Projects could not load. Open this site through a local server so the gallery can read the project manifest.');
    }
  }

  if (gallery) {
    gallery.addEventListener('click', (ev) => {
      const card = ev.target.closest('.card');
      if (!card) return;
      const idx = parseInt(card.dataset.index || '-1', 10);
      if (!Number.isNaN(idx) && idx >= 0) openLightboxByIndex(idx);
    });

    gallery.addEventListener('keydown', (ev) => {
      if (ev.key !== 'Enter' && ev.key !== ' ') return;
      const card = ev.target.closest('.card');
      if (!card) return;
      ev.preventDefault();
      const idx = parseInt(card.dataset.index || '-1', 10);
      if (!Number.isNaN(idx) && idx >= 0) openLightboxByIndex(idx);
    });
  }

  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  lbClose?.addEventListener('click', () => {
    lightbox.setAttribute('aria-hidden', 'true');
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

  if (page === 'category') initCategoryPage();
  else initHomePage();
});
