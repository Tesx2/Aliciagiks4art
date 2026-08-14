const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'styles.css');
const outPath = path.join(__dirname, '..', 'contrast-audit.json');

function extractRootVars(css){
  const vars = {};
  // find all --var: value; occurrences (robust to comments and spacing)
  const re = /(--[a-zA-Z0-9-_]+)\s*:\s*([^;\n\r]+)\s*;/g;
  let m;
  while((m = re.exec(css)) !== null){
    vars[m[1]] = m[2].trim();
  }
  return vars;
}

function parseColor(str){
  if(!str) return null;
  str = str.trim();
  if(str.startsWith('#')){
    const h = str.replace('#','');
    const full = h.length===3? h.split('').map(c=>c+c).join('') : h;
    const bigint = parseInt(full,16);
    return [(bigint>>16)&255, (bigint>>8)&255, bigint&255];
  }
  const rgb = /rgba?\(([^)]+)\)/.exec(str);
  if(rgb){
    const parts = rgb[1].split(',').map(p=>parseFloat(p.trim()));
    return [parts[0], parts[1], parts[2]];
  }
  return null;
}

function lum([r,g,b]){
  const a = [r,g,b].map(v=>{ v = v/255; return v<=0.03928? v/12.92: Math.pow((v+0.055)/1.055,2.4); });
  return 0.2126*a[0]+0.7152*a[1]+0.0722*a[2];
}

function contrast(colA, colB){
  const a = parseColor(colA);
  const b = parseColor(colB);
  if(!a || !b) return null;
  const L1 = lum(a); const L2 = lum(b);
  return (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);
}

(async function(){
  try{
    const css = fs.readFileSync(cssPath,'utf8');
    const vars = extractRootVars(css);
    const report = {generatedAt: new Date().toISOString(), variables: vars, results: []};
    const pairs = [ ['--text-light','--bg-primary'], ['--text-light','--bg-dark'], ['--text-on-accent','--accent-pink'], ['--text-on-accent','--accent-lilac'] ];
    pairs.forEach(([fgVar,bgVar])=>{
      let fg = vars[fgVar] || null;
      const bg = vars[bgVar] || null;
      // if --text-on-accent is not defined, choose between --text-light and a dark fallback
      if(!fg && (fgVar === '--text-on-accent') && bg){
        const white = vars['--text-light'] || '#FFFFFF';
        const dark = '#120417';
        const cWhite = contrast(white, bg);
        const cDark = contrast(dark, bg);
        fg = (cWhite>=cDark) ? white : dark;
      }
      const c = (fg && bg) ? contrast(fg, bg) : null;
      report.results.push({fgVar, bgVar, fg, bg, contrast: c===null? null: Number(c.toFixed(2)), passAA: c!==null? c>=4.5 : false, passAAA: c!==null? c>=7 : false});
    });
    fs.writeFileSync(outPath, JSON.stringify(report,null,2), 'utf8');
    console.log('Wrote report to', outPath);
  }catch(err){
    console.error('Audit failed', err);
    process.exit(1);
  }
})();
