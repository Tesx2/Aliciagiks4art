/**
 * Case study page — fetches a single project post by ID and renders
 * full details. Layout adapts to the artwork's orientation:
 *   - Portrait image  -> image and details sit side by side
 *   - Landscape image -> image on top, details below
 *
 * Backend: https://aliciagiks4art.wordpress.com
 * API base: https://public-api.wordpress.com/wp/v2/sites/aliciagiks4art.wordpress.com
 */

const API_BASE = "https://public-api.wordpress.com/wp/v2/sites/aliciagiks4art.wordpress.com";

// "About" category (id 9) is excluded — bio content, not portfolio.
const EXCLUDED_CATEGORY_IDS = [9];

function getProjectIdFromUrl() {
  // Expects project.html?id=9 (or legacy #project-9 hash).
  const params = new URLSearchParams(window.location.search);
  if (params.get("id")) return params.get("id");

  const hashMatch = window.location.hash.match(/project-(\d+)/);
  return hashMatch ? hashMatch[1] : null;
}

function getImageDimensions(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 4, height: 3 });
    img.src = url;
  });
}

async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  const cats = await res.json();
  const map = {};
  cats.forEach((c) => (map[c.id] = c.name));
  return map;
}

async function fetchProject(id) {
  const res = await fetch(`${API_BASE}/posts/${id}`);
  if (!res.ok) return null;
  return res.json();
}

function getPrimaryCategoryId(post) {
  return post.categories.find((id) => !EXCLUDED_CATEGORY_IDS.includes(id)) ?? null;
}

async function fetchRelatedPosts(categoryId, excludeId) {
  const res = await fetch(
    `${API_BASE}/posts?categories=${categoryId}&exclude=${excludeId}&per_page=12`
  );
  if (!res.ok) return [];
  const posts = await res.json();
  return posts.filter(
    (p) =>
      p.id !== excludeId &&
      (p.jetpack_featured_media_url || p._embedded?.["wp:featuredmedia"]?.[0]?.source_url)
  );
}

function renderRelatedSection(relatedPosts, categoryName) {
  if (!relatedPosts.length) return "";

  const cards = relatedPosts
    .map((p) => {
      const imageUrl =
        p.jetpack_featured_media_url || p._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
      return `
        <a class="case-study-related-card" href="project.html?id=${p.id}">
          <div class="case-study-related-card-media">
            <img src="${imageUrl}" alt="${p.title.rendered}" loading="lazy" />
          </div>
          <span class="case-study-related-card-title">${p.title.rendered}</span>
        </a>
      `;
    })
    .join("");

  return `
    <section class="case-study-related" aria-labelledby="caseStudyRelatedHeading">
      <h2 class="case-study-related-heading" id="caseStudyRelatedHeading">More from ${categoryName}</h2>
      <div class="case-study-related-row">${cards}</div>
    </section>
  `;
}

async function renderCaseStudy(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const id = getProjectIdFromUrl();
  if (!id) {
    container.innerHTML = `<p class="case-study-error">No project specified.</p>`;
    return;
  }

  const [post, categoryMap] = await Promise.all([fetchProject(id), fetchCategories()]);

  if (!post) {
    container.innerHTML = `<p class="case-study-error">This case study could not be found.</p>`;
    return;
  }

  const imageUrl =
    post.jetpack_featured_media_url || post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const { width, height } = imageUrl
    ? await getImageDimensions(imageUrl)
    : { width: 4, height: 3 };

  const isPortrait = height > width;
  const categoryNames = post.categories.map((cid) => categoryMap[cid]).filter(Boolean).join(", ");
  const primaryCategoryId = getPrimaryCategoryId(post);
  const primaryCategoryName = primaryCategoryId ? categoryMap[primaryCategoryId] : null;

  const relatedPosts =
    primaryCategoryId != null
      ? await fetchRelatedPosts(primaryCategoryId, post.id)
      : [];

  container.className = isPortrait ? "case-study side-by-side" : "case-study stacked";

  container.innerHTML = `
    <div class="case-study-media">
      <img src="${imageUrl}" alt="${post.title.rendered}" style="aspect-ratio: ${width} / ${height};" />
    </div>
    <div class="case-study-details">
      <span class="case-study-category">${categoryNames || "—"}</span>
      <h1>${post.title.rendered}</h1>
      <div class="case-study-body">${post.content.rendered}</div>
      ${renderRelatedSection(relatedPosts, primaryCategoryName || "this category")}
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  renderCaseStudy("#case-study-container");
});
