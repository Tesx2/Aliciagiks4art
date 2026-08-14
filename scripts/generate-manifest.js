const fs = require('fs');
const path = require('path');

// Configure paths
const root = path.resolve(__dirname, '..');
const galleryDir = path.join(root, 'geeks4drisony');
const outFile = path.join(galleryDir, 'manifest.json');

const imageExts = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg']);
const videoExts = new Set(['.mp4', '.webm', '.mov', '.m4v', '.ogg']);

function isImage(ext){ return imageExts.has(ext.toLowerCase()); }
function isVideo(ext){ return videoExts.has(ext.toLowerCase()); }
function extType(ext){ if(isImage(ext)) return 'image'; if(isVideo(ext)) return 'video'; return null; }

function slugToTitle(name){
  // Turn filenames like "my-image_name.jpg" into "My image name"
  return name.replace(/[-_]+/g,' ').replace(/\.[^.]+$/,'').replace(/\b\w/g, s => s.toUpperCase());
}

function scan(){
  if(!fs.existsSync(galleryDir) || !fs.statSync(galleryDir).isDirectory()){
    console.error('Gallery directory not found:', galleryDir);
    process.exit(2);
  }

  const categories = [];
  const entries = fs.readdirSync(galleryDir, { withFileTypes: true });
  entries.forEach(dirent => {
    if(!dirent.isDirectory()) return;
    const catName = dirent.name;
    const catPath = path.join(galleryDir, catName);
    // Recursively collect media files under this category (supports nested folders)
    const collectFiles = (dir) => {
      let out = [];
      const ents = fs.readdirSync(dir, { withFileTypes: true });
      ents.forEach(e => {
        const full = path.join(dir, e.name);
        if(e.isDirectory()){
          out = out.concat(collectFiles(full));
        } else if(e.isFile()){
          const ext = path.extname(e.name).toLowerCase();
          const t = extType(ext);
          if(t){
            out.push({ name: e.name, full, ext, type: t });
          }
        }
      });
      return out;
    };

    const found = collectFiles(catPath).sort((a,b)=> a.name.localeCompare(b.name, undefined, {sensitivity:'base'}));
    if(found.length === 0) return; // skip empty categories

    const items = found.map(f => {
      const fname = f.name;
      const fp = f.full;
      const stat = fs.statSync(fp);
      const item = {
        src: `geeks4drisony/${catName}/${path.relative(catPath, fp).replace(/\\\\/g, '/')}`,
        filename: fname,
        title: slugToTitle(fname),
        alt: slugToTitle(fname),
        mtimeMs: stat.mtimeMs,
        mtime: stat.mtime.toISOString(),
        type: f.type
      };

      // for videos, try to find a poster image with same basename in same directory
      if(f.type === 'video'){
        const dir = path.dirname(fp);
        const base = path.basename(fname, f.ext);
        const candidates = fs.readdirSync(dir, { withFileTypes: true })
          .filter(x => x.isFile())
          .map(x => x.name);
        const poster = candidates.find(n => isImage(path.extname(n).toLowerCase()) && path.basename(n, path.extname(n)).toLowerCase() === base.toLowerCase());
        if(poster){
          item.poster = `geeks4drisony/${catName}/${path.relative(catPath, path.join(dir, poster)).replace(/\\\\/g, '/')}`;
        }
      }

      return item;
    });

    // sort items newest first within category
    items.sort((a,b)=> b.mtimeMs - a.mtimeMs);

    categories.push({ name: catName, items });
  });

  // Sort categories alphabetically but keep 'All' logic to the frontend
  categories.sort((a,b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

  const manifest = { generatedAt: new Date().toISOString(), categories };
  fs.writeFileSync(outFile, JSON.stringify(manifest, null, 2), 'utf8');
  console.log('Manifest written to', outFile);
}

scan();
