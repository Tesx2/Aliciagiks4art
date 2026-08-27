/**
 * Fetches project posts from the headless WordPress.com backend
 * and renders them into a masonry-style grid with no cropping —
 * card height follows each image's natural aspect ratio.
 *
 * Backend: https://aliciagiks4art.wordpress.com
 * API base: https://public-api.wordpress.com/wp/v2/sites/aliciagiks4art.wordpress.com
 */

const API_BASE = "https://public-api.wordpress.com/wp/v2/sites/aliciagiks4art.wordpress.com";

// "About" category (id 9) is excluded from the project grid —
// it's bio content, not a portfolio piece.
const EXCLUDED_CATEGORY_IDS = [9];

async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  const cats = await res.json();
  // Map: id -> name, e.g. { 9: "About", 12: "Motion", ... }
  const map = {};
  cats.forEach((c) => (map[c.id] = c.name));
  return map;
}

async function fetchProjects() {
  const res = await fetch(`${API_BASE}/posts?per_page=100`);
  const posts = await res.json();
  return posts.filter(
    (post) => !post.categories.some((id) => EXCLUDED_CATEGORY_IDS.includes(id))
  );
}

// Reads an image's natural width/height client-side so the grid
// can size each card correctly without waiting on a stored field.
function getImageDimensions(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 4, height: 3 }); // safe fallback ratio
    img.src = url;
  });
}

function extractPlainText(htmlContent, maxLength = 140) {
  const div = document.createElement("div");
  div.innerHTML = htmlContent;
  const text = div.textContent || div.innerText || "";
  return text.length > maxLength ? text.slice(0, maxLength).trim() + "…" : text.trim();
}

async function renderProjectGrid(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const [categoryMap, projects] = await Promise.all([fetchCategories(), fetchProjects()]);

  // Clear any static/placeholder markup already in the grid.
  container.innerHTML = "";

  for (const post of projects) {
    const imageUrl =
      post.jetpack_featured_media_url || post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
    if (!imageUrl) continue; // skip posts with no image — nothing to show in the grid

    const { width, height } = await getImageDimensions(imageUrl);
    const categoryNames = post.categories
      .map((id) => categoryMap[id])
      .filter(Boolean)
      .join(", ");

    const card = document.createElement("a");
    card.href = `project.html?id=${post.id}`;
    card.className = "project-card";
    card.style.setProperty("--aspect-ratio", `${width} / ${height}`);

    card.innerHTML = `
      <div class="project-card-media" style="aspect-ratio: ${width} / ${height};">
        <img src="${imageUrl}" alt="${post.title.rendered}" loading="lazy" />
      </div>
      <div class="project-card-info">
        <h3>${post.title.rendered}</h3>
        <span class="project-card-category">${categoryNames}</span>
        <p>${extractPlainText(post.content.rendered)}</p>
      </div>
    `;

    container.appendChild(card);
  }
}

// Usage: call this on page load, pointing at your grid container
// e.g. <div id="featured-work-grid" class="masonry-grid"></div>
document.addEventListener("DOMContentLoaded", () => {
  renderProjectGrid("#featured-work-grid");
});
