const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const galleryDir = path.join(root, 'geeks4drisony');
const outFile = path.join(galleryDir, 'manifest.json');

const imageExts = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg']);
const videoExts = new Set(['.mp4', '.webm', '.mov', '.m4v', '.ogg']);

function isImage(ext) { return imageExts.has(ext.toLowerCase()); }
function isVideo(ext) { return videoExts.has(ext.toLowerCase()); }
function extType(ext) { if (isImage(ext)) return 'image'; if (isVideo(ext)) return 'video'; return null; }

function slugToTitle(name) {
  return name.replace(/[-_]+/g, ' ').replace(/\.[^.]+$/, '').replace(/\b\w/g, (s) => s.toUpperCase());
}

function makeSlug(catName, filename) {
  const base = path.basename(filename, path.extname(filename));
  const raw = `${catName}-${base}`;
  return raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function formatCategoryLabel(name) {
  return (name || '').replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildBrief(catName, title) {
  return `A ${formatCategoryLabel(catName)} project — ${title}. Crafted with bold visual language, refined composition, and attention to detail across every stage of the creative process.`;
}

function scan() {
  if (!fs.existsSync(galleryDir) || !fs.statSync(galleryDir).isDirectory()) {
    console.error('Gallery directory not found:', galleryDir);
    process.exit(2);
  }

  const categories = [];
  const entries = fs.readdirSync(galleryDir, { withFileTypes: true });

  entries.forEach((dirent) => {
    if (!dirent.isDirectory()) return;
    const catName = dirent.name;
    const catPath = path.join(galleryDir, catName);

    const collectFiles = (dir) => {
      let out = [];
      const ents = fs.readdirSync(dir, { withFileTypes: true });
      ents.forEach((e) => {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) {
          out = out.concat(collectFiles(full));
        } else if (e.isFile()) {
          const ext = path.extname(e.name).toLowerCase();
          const t = extType(ext);
          if (t) out.push({ name: e.name, full, ext, type: t });
        }
      });
      return out;
    };

    const found = collectFiles(catPath).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    if (found.length === 0) return;

    const items = found.map((f) => {
      const fname = f.name;
      const fp = f.full;
      const stat = fs.statSync(fp);
      const item = {
        src: `geeks4drisony/${catName}/${path.relative(catPath, fp).replace(/\\/g, '/')}`,
        filename: fname,
        title: slugToTitle(fname),
        alt: slugToTitle(fname),
        mtimeMs: stat.mtimeMs,
        mtime: stat.mtime.toISOString(),
        type: f.type,
      };

      if (f.type === 'video') {
        const dir = path.dirname(fp);
        const base = path.basename(fname, f.ext);
        const candidates = fs.readdirSync(dir, { withFileTypes: true })
          .filter((x) => x.isFile())
          .map((x) => x.name);
        const poster = candidates.find((n) => isImage(path.extname(n).toLowerCase()) && path.basename(n, path.extname(n)).toLowerCase() === base.toLowerCase());
        if (poster) {
          item.poster = `geeks4drisony/${catName}/${path.relative(catPath, path.join(dir, poster)).replace(/\\/g, '/')}`;
        }
      }

      return item;
    });

    items.sort((a, b) => b.mtimeMs - a.mtimeMs);

    items.forEach((item, idx) => {
      item.slug = makeSlug(catName, item.filename);
      item.year = new Date(item.mtime).getFullYear();
      item.client = 'Personal / Freelance';
      item.role = 'Graphic Designer & Motion Artist';
      item.brief = buildBrief(catName, item.title);
      item.processStills = items
        .filter((other, i) => i !== idx && other.type === 'image')
        .slice(0, 3)
        .map((other) => ({ src: other.src, alt: other.alt, title: other.title }));
    });

    categories.push({ name: catName, items });
  });

  categories.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

  const manifest = { generatedAt: new Date().toISOString(), categories };
  fs.writeFileSync(outFile, JSON.stringify(manifest, null, 2), 'utf8');
  console.log('Manifest written to', outFile);
}

scan();
