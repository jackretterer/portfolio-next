// Regenerates lib/data/stars-25ly.json from the AT-HYG catalog.
// Usage:
//   curl -sL -o hyg.csv.gz "https://github.com/astronexus/ATHYG-Database/raw/main/data/subsets/hyglike_from_athyg_v32.csv.gz"
//   gunzip hyg.csv.gz
//   node scripts/generate-stars.mjs   (run from the directory containing hyg.csv)
//   mv stars-25ly.json lib/data/stars-25ly.json
import fs from 'node:fs';

const LY_PER_PC = 3.26156;
const MAX_LY = 25;

const raw = fs.readFileSync('hyg.csv', 'utf8');
const lines = raw.split('\n');
const header = lines[0].split(',').map((h) => h.replace(/"/g, ''));
const col = Object.fromEntries(header.map((h, i) => [h, i]));

// simple CSV split is fine here: no quoted commas in this dataset's fields we use,
// but be safe and handle quoted fields anyway
function parseLine(line) {
  const out = [];
  let cur = '';
  let inQ = false;
  for (const ch of line) {
    if (ch === '"') inQ = !inQ;
    else if (ch === ',' && !inQ) { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

const stars = [];
for (let i = 1; i < lines.length; i++) {
  if (!lines[i]) continue;
  const f = parseLine(lines[i]);
  const distPc = parseFloat(f[col.dist]);
  if (!isFinite(distPc)) continue;
  const distLy = distPc * LY_PER_PC;
  if (distLy > MAX_LY) continue;

  const proper = f[col.proper];
  const gl = f[col.gl];
  const bf = f[col.bf];
  const hip = f[col.hip];
  const name = proper || bf || gl || (hip ? `HIP ${hip}` : `#${f[col.id]}`);

  const r = (v, d = 3) => Math.round(parseFloat(v) * 10 ** d) / 10 ** d;

  stars.push({
    name,
    proper: proper || null,
    x: r(parseFloat(f[col.x]) * LY_PER_PC),
    y: r(parseFloat(f[col.y]) * LY_PER_PC),
    z: r(parseFloat(f[col.z]) * LY_PER_PC),
    dist: r(distLy, 2),
    mag: r(f[col.mag], 2),
    absmag: r(f[col.absmag], 2),
    spect: f[col.spect] || null,
    con: f[col.con] || null,
    ci: f[col.ci] ? r(f[col.ci], 2) : null,
  });
}

stars.sort((a, b) => a.dist - b.dist);
console.log(`stars within ${MAX_LY} ly: ${stars.length}`);
console.log('named:', stars.filter((s) => s.proper).length);
console.log(
  'nearest 12:',
  stars.slice(0, 12).map((s) => `${s.name} (${s.dist} ly)`).join(', ')
);

fs.writeFileSync('stars-25ly.json', JSON.stringify(stars));
console.log('bytes:', fs.statSync('stars-25ly.json').size);
