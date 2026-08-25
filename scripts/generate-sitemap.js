const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://aliciagiks4art.netlify.app';
const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, 'geeks4drisony', 'manifest.json');
const outFile = path.join(root, 'sitemap.xml');

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlEntry(loc, priority, changefreq) {
  return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

function generate() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const urls = [
    urlEntry(`${SITE_URL}/`, '1.0', 'weekly'),
  ];

  (manifest.categories || []).forEach((cat) => {
    if (!cat.items?.length) return;
    urls.push(urlEntry(`${SITE_URL}/work.html?cat=${encodeURIComponent(cat.name)}`, '0.8', 'weekly'));
    cat.items.forEach((item) => {
      if (!item.slug) return;
      urls.push(urlEntry(`${SITE_URL}/project.html?slug=${encodeURIComponent(item.slug)}`, '0.7', 'monthly'));
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  fs.writeFileSync(outFile, xml, 'utf8');
  console.log(`Sitemap written to ${outFile} (${urls.length} URLs)`);
}

generate();
