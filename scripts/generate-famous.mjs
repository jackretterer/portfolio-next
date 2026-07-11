// Generates lib/data/stars-famous.json — famous milestone objects beyond 25 ly.
// Positions are computed from J2000 RA/Dec + curated literature distances
// (parallax catalogs are unreliable at these ranges, so distances are hand-picked).
// Usage: node scripts/generate-famous.mjs
import fs from 'node:fs';

// ra "18h36m56s", dec "+38d47m01s", dist in light years
const FAMOUS = [
  { name: 'Vega', ra: '18h36m56s', dec: '+38d47m01s', dist: 25.0, mag: 0.03, spect: 'A0V', con: 'Lyr', ci: 0.0, kind: 'white star', claim: 'anchor of the summer triangle; the former (and future) north star' },
  { name: 'Fomalhaut', ra: '22h57m39s', dec: '-29d37m20s', dist: 25.1, mag: 1.16, spect: 'A3V', con: 'PsA', ci: 0.09, kind: 'white star', claim: 'the loneliest star, ringed by a vast debris disk' },
  { name: 'Pollux', ra: '07h45m19s', dec: '+28d01m34s', dist: 33.8, mag: 1.14, spect: 'K0III', con: 'Gem', ci: 1.0, kind: 'orange giant', claim: 'the nearest giant star, one of the gemini twins' },
  { name: 'Arcturus', ra: '14h15m40s', dec: '+19d10m56s', dist: 36.7, mag: -0.05, spect: 'K1.5III', con: 'Boo', ci: 1.23, kind: 'orange giant', claim: 'brightest star of the northern sky' },
  { name: 'Capella', ra: '05h16m41s', dec: '+45d59m53s', dist: 42.9, mag: 0.08, spect: 'G8III+G0III', con: 'Aur', ci: 0.8, kind: 'yellow giant pair', claim: 'the goat star — actually two giants in a tight waltz' },
  { name: 'Aldebaran', ra: '04h35m55s', dec: '+16d30m33s', dist: 65.3, mag: 0.85, spect: 'K5III', con: 'Tau', ci: 1.54, kind: 'orange giant', claim: 'the glaring eye of taurus the bull' },
  { name: 'Regulus', ra: '10h08m22s', dec: '+11d58m02s', dist: 79.3, mag: 1.35, spect: 'B8IVn', con: 'Leo', ci: -0.11, kind: 'blue-white star', claim: 'the heart of leo, spinning near its breakup speed' },
  { name: 'Algol', ra: '03h08m10s', dec: '+40d57m20s', dist: 93, mag: 2.12, spect: 'B8V', con: 'Per', ci: -0.05, kind: 'eclipsing binary', claim: 'the demon star — it winks every 2.9 days' },
  { name: 'Achernar', ra: '01h37m43s', dec: '-57d14m12s', dist: 139, mag: 0.46, spect: 'B6Vep', con: 'Eri', ci: -0.16, kind: 'blue star', claim: 'the end of the river eridanus; the flattest star known' },
  { name: 'Spica', ra: '13h25m12s', dec: '-11d09m41s', dist: 250, mag: 0.97, spect: 'B1V', con: 'Vir', ci: -0.23, kind: 'blue binary', claim: "virgo's blue jewel, two stars distorted into eggs" },
  { name: 'Mira', ra: '02h19m21s', dec: '-02d58m39s', dist: 300, mag: 3.0, spect: 'M7IIIe', con: 'Cet', ci: 1.42, kind: 'pulsating red giant', claim: 'the original "wonderful" variable star, fading and returning' },
  { name: 'Canopus', ra: '06h23m57s', dec: '-52d41m44s', dist: 310, mag: -0.74, spect: 'A9II', con: 'Car', ci: 0.15, kind: 'bright giant', claim: 'second-brightest star in the night sky' },
  { name: 'Polaris', ra: '02h31m49s', dec: '+89d15m51s', dist: 433, mag: 1.98, spect: 'F7Ib', con: 'UMi', ci: 0.6, kind: 'cepheid supergiant', claim: 'the north star, sitting almost exactly above the pole' },
  { name: 'Alcyone', ra: '03h47m29s', dec: '+24d06m18s', dist: 444, mag: 2.87, spect: 'B7IIIe', con: 'Tau', ci: -0.09, kind: 'blue giant', claim: 'brightest of the pleiades, the seven sisters' },
  { name: 'Betelgeuse', ra: '05h55m10s', dec: '+07d24m25s', dist: 548, mag: 0.5, spect: 'M1-2Ia-ab', con: 'Ori', ci: 1.85, kind: 'red supergiant', claim: "orion's shoulder — due to go supernova any millennium now" },
  { name: 'Antares', ra: '16h29m24s', dec: '-26d25m55s', dist: 554, mag: 1.06, spect: 'M1.5Iab', con: 'Sco', ci: 1.83, kind: 'red supergiant', claim: 'the rival of mars, heart of the scorpion' },
  { name: 'Rigel', ra: '05h14m32s', dec: '-08d12m06s', dist: 863, mag: 0.13, spect: 'B8Ia', con: 'Ori', ci: -0.03, kind: 'blue supergiant', claim: "orion's foot, outshining 100,000 suns" },
  { name: 'Gaia BH1', ra: '17h28m41s', dec: '-00d34m52s', dist: 1560, mag: 13.77, spect: null, con: 'Oph', ci: null, kind: 'black hole', claim: 'the nearest known black hole, found by the wobble of its companion star', type: 'blackhole' },
  { name: 'Deneb', ra: '20h41m26s', dec: '+45d16m49s', dist: 2615, mag: 1.25, spect: 'A2Ia', con: 'Cyg', ci: 0.09, kind: 'white supergiant', claim: 'the most distant bright star you can see with the naked eye' },
  { name: 'VY Canis Majoris', ra: '07h22m58s', dec: '-25d46m03s', dist: 3900, mag: 7.9, spect: 'M3-M4.5Ia', con: 'CMa', ci: 2.24, kind: 'red hypergiant', claim: 'a star so large it would swallow saturn' },
  { name: 'UY Scuti', ra: '18h27m36s', dec: '-12d27m59s', dist: 5900, mag: 9.7, spect: 'M4Ia', con: 'Sct', ci: 3.0, kind: 'red supergiant', claim: 'long held the title of largest known star' },
  { name: 'Crab Pulsar', ra: '05h34m32s', dec: '+22d00m52s', dist: 6500, mag: 16.5, spect: null, con: 'Tau', ci: 0.5, kind: 'pulsar', claim: 'the spinning corpse of the supernova of 1054 ad', type: 'pulsar' },
  { name: 'PSR J1748-2446ad', ra: '17h48m05s', dec: '-24d46m48s', dist: 18000, mag: null, spect: null, con: 'Sgr', ci: null, kind: 'millisecond pulsar', claim: 'the fastest-spinning star known — 716 rotations every second', type: 'pulsar' },
  { name: 'Eta Carinae', ra: '10h45m04s', dec: '-59d41m04s', dist: 7500, mag: 4.5, spect: 'LBV', con: 'Car', ci: 0.6, kind: 'luminous blue variable', claim: 'a doomed double star that already faked one death in 1843' },
  { name: 'Stephenson 2-18', ra: '18h39m02s', dec: '-06d05m11s', dist: 19000, mag: null, spect: 'M6', con: 'Sct', ci: 2.5, kind: 'red supergiant', claim: 'the current contender for largest star known' },
  { name: 'Sagittarius A*', ra: '17h45m40s', dec: '-29d00m28s', dist: 26670, mag: null, spect: null, con: 'Sgr', ci: null, kind: 'supermassive black hole', claim: '4 million suns of darkness at the center of the galaxy', type: 'blackhole' },
];

function parseRA(s) {
  const m = s.match(/(\d+)h(\d+)m([\d.]+)s/);
  return ((+m[1] + m[2] / 60 + m[3] / 3600) / 24) * 2 * Math.PI;
}
function parseDec(s) {
  const m = s.match(/([+-])(\d+)d(\d+)m([\d.]+)s/);
  const v = (+m[2] + m[3] / 60 + m[4] / 3600) * (Math.PI / 180);
  return m[1] === '-' ? -v : v;
}

const out = FAMOUS.map((f) => {
  const ra = parseRA(f.ra);
  const dec = parseDec(f.dec);
  const r = (v) => Math.round(v * 100) / 100;
  return {
    name: f.name,
    x: r(f.dist * Math.cos(dec) * Math.cos(ra)),
    y: r(f.dist * Math.cos(dec) * Math.sin(ra)),
    z: r(f.dist * Math.sin(dec)),
    dist: f.dist,
    mag: f.mag,
    spect: f.spect,
    con: f.con,
    ci: f.ci,
    kind: f.kind,
    claim: f.claim,
    type: f.type ?? 'star',
  };
});

out.sort((a, b) => a.dist - b.dist);
const path = new URL('../lib/data/stars-famous.json', import.meta.url).pathname;
fs.writeFileSync(path, JSON.stringify(out));
console.log(`${out.length} famous objects → ${path} (${fs.statSync(path).size} bytes)`);
