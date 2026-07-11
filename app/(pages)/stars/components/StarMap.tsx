'use client'

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import starData from '@/lib/data/stars-25ly.json';
import famousData from '@/lib/data/stars-famous.json';

type Star = {
  name: string;
  proper?: string | null;
  x: number;
  y: number;
  z: number;
  dist: number;
  mag: number | null;
  absmag?: number;
  spect: string | null;
  con: string | null;
  ci: number | null;
  kind?: string | null;
  claim?: string | null;
  type?: string;
  massEarth?: number;
};

const STARS = starData as Star[];

// tight binaries (e.g. Toliman + Rigil Kentaurus) collapse onto identical
// coordinates at this precision — group them so hover/select shows the system
const posKey = (s: Star) => `${s.x},${s.y},${s.z}`;
const SYSTEMS = new Map<string, number[]>();
STARS.forEach((s, i) => {
  const k = posKey(s);
  const g = SYSTEMS.get(k);
  if (g) g.push(i);
  else SYSTEMS.set(k, [i]);
});
const systemOf = (idx: number): Star[] => {
  if (idx >= STARS.length) return [ALL[idx]];
  return (SYSTEMS.get(posKey(STARS[idx])) ?? [idx]).map((i) => STARS[i]);
};

// famous landmarks beyond 25 ly, placed on a logarithmic radial scale so the
// local neighborhood stays readable while the map reaches the edge of the galaxy
const FAMOUS = famousData as Star[];

// the solar system, to scale: real orbital radii on the ecliptic (tilted 23.4°
// from the map's celestial-equator plane), converted to light years
const AU_LY = 1 / 63241;
const ECLIPTIC = (23.44 * Math.PI) / 180;
const PLANET_DEFS = [
  { name: 'Mercury', a: 0.387, angle: 25, color: [0.65, 0.6, 0.55], size: 0.45, massEarth: 0.055, kind: 'planet', claim: "the sun's smallest and swiftest companion" },
  { name: 'Venus', a: 0.723, angle: 70, color: [0.92, 0.85, 0.66], size: 0.9, massEarth: 0.815, kind: 'planet', claim: "earth's evil twin, wrapped in acid clouds" },
  { name: 'Earth', a: 1.0, angle: 130, color: [0.4, 0.62, 0.9], size: 0.95, massEarth: 1.0, kind: 'planet', claim: 'you are here. no, really here' },
  { name: 'Mars', a: 1.524, angle: 190, color: [0.85, 0.5, 0.3], size: 0.55, massEarth: 0.107, kind: 'planet', claim: 'the red planet, rusting quietly for eons' },
  { name: 'Jupiter', a: 5.203, angle: 240, color: [0.84, 0.72, 0.55], size: 2.6, massEarth: 317.8, kind: 'gas giant', claim: 'heavier than every other planet combined' },
  { name: 'Saturn', a: 9.537, angle: 300, color: [0.9, 0.83, 0.62], size: 2.3, massEarth: 95.2, kind: 'gas giant', claim: 'the one with the rings' },
  { name: 'Uranus', a: 19.191, angle: 345, color: [0.62, 0.85, 0.88], size: 1.5, massEarth: 14.5, kind: 'ice giant', claim: 'rolls around the sun on its side' },
  { name: 'Neptune', a: 30.069, angle: 40, color: [0.35, 0.52, 0.95], size: 1.45, massEarth: 17.1, kind: 'ice giant', claim: 'the windiest world we know' },
  { name: 'Pluto', a: 39.482, angle: 100, color: [0.76, 0.7, 0.62], size: 0.3, massEarth: 0.00218, kind: 'dwarf planet', claim: 'still a planet in our hearts' },
];
const PLANETS: Star[] = PLANET_DEFS.map((p) => {
  const th = (p.angle * Math.PI) / 180;
  const r = p.a * AU_LY;
  const ex = Math.cos(th) * r;
  const ez = Math.sin(th) * r;
  // ecliptic-plane position rotated into the equatorial frame, stored in data coords
  return {
    name: p.name,
    x: ex,
    y: Math.cos(ECLIPTIC) * ez,
    z: -Math.sin(ECLIPTIC) * ez,
    dist: r,
    mag: null, spect: null, con: null, ci: null,
    kind: p.kind, claim: p.claim, type: 'planet',
    massEarth: p.massEarth,
  };
});

const ALL = [...STARS, ...FAMOUS, ...PLANETS];
const LOG_K = 34;
const compressRadius = (r: number) => (r <= 25 ? r : 25 + LOG_K * Math.log10(r / 25));

// full decimal, no scientific notation — 0.00000000655 solar masses is funnier
function plainDecimal(v: number): string {
  if (v >= 0.001) return Number(v.toPrecision(3)).toString();
  const digits = -Math.floor(Math.log10(v)) + 2;
  return v.toFixed(digits);
}

function fmtDist(d: number): string {
  if (d < 1e-7) return 'home';
  if (d < 0.001) return `${(d / AU_LY).toFixed(2)} au`;
  if (d < 100) return `${d.toFixed(2)} ly`;
  return `${Math.round(d).toLocaleString()} ly`;
}

// stars that get a permanent floating label
const LABELED = [
  'Sol',
  'Proxima Centauri',
  "Barnard's Star",
  'Sirius',
  'Procyon',
  'Altair',
  'Tau Ceti',
  'Ran',
  'Wolf 359',
  'Lalande 21185',
];

const CONSTELLATIONS: Record<string, string> = {
  And: 'Andromeda', Aql: 'Aquila', Aqr: 'Aquarius', Ara: 'Ara', Ari: 'Aries',
  Aur: 'Auriga', Boo: 'Boötes', CMa: 'Canis Major', CMi: 'Canis Minor',
  Cam: 'Camelopardalis', Cap: 'Capricornus', Car: 'Carina', Cas: 'Cassiopeia',
  Cen: 'Centaurus', Cep: 'Cepheus', Cet: 'Cetus', Cnc: 'Cancer', Cyg: 'Cygnus',
  Del: 'Delphinus', Dor: 'Dorado', Dra: 'Draco', Eri: 'Eridanus', Gem: 'Gemini',
  Gru: 'Grus', Her: 'Hercules', Hor: 'Horologium', Hya: 'Hydra', Hyi: 'Hydrus',
  Ind: 'Indus', Lac: 'Lacerta', Leo: 'Leo', Lep: 'Lepus', Lib: 'Libra',
  Lup: 'Lupus', Mic: 'Microscopium', Mon: 'Monoceros', Mus: 'Musca',
  Oph: 'Ophiuchus', Ori: 'Orion', Pav: 'Pavo', Peg: 'Pegasus', Pic: 'Pictor',
  PsA: 'Piscis Austrinus', Psc: 'Pisces', Scl: 'Sculptor', Sco: 'Scorpius',
  Sex: 'Sextans', Sgr: 'Sagittarius', Tel: 'Telescopium', UMa: 'Ursa Major',
  Vir: 'Virgo',
};

function starKind(spect: string | null): string {
  const c = spect?.trim().charAt(0).toUpperCase();
  switch (c) {
    case 'O': case 'B': return 'blue star';
    case 'A': return 'white star';
    case 'F': return 'yellow-white star';
    case 'G': return 'sun-like star';
    case 'K': return 'orange dwarf';
    case 'M': return 'red dwarf';
    case 'D': return 'white dwarf';
    case 'L': case 'T': case 'Y': return 'brown dwarf';
    default: return 'star';
  }
}

// B–V color index → RGB, rough blackbody approximation
function bvToColor(bv: number | null): THREE.Color {
  const t = THREE.MathUtils.clamp(bv ?? 0.6, -0.4, 2.0);
  let r: number, g: number, b: number;
  if (t < 0.0) { r = 0.62 + 0.5 * (t + 0.4); } else { r = 1.0; }
  if (t < 0.4) { g = 0.75 + 0.55 * t; } else { g = THREE.MathUtils.clamp(1.0 - 0.32 * (t - 0.4), 0.45, 1.0); }
  if (t < 0.4) { b = 1.0; } else { b = THREE.MathUtils.clamp(1.0 - 0.6 * (t - 0.4), 0.25, 1.0); }
  return new THREE.Color(THREE.MathUtils.clamp(r, 0, 1), THREE.MathUtils.clamp(g, 0, 1), b);
}

// data coords are equatorial (z = north celestial pole); scene is y-up
function toScene(s: Star): THREE.Vector3 {
  return new THREE.Vector3(s.x, s.z, s.y);
}

// scene position with the >25 ly log compression applied
function displayPos(s: Star): THREE.Vector3 {
  const v = toScene(s);
  const r = v.length();
  if (r <= 25) return v;
  return v.multiplyScalar(compressRadius(r) / r);
}

// a tiny hand-drawn blue marble: ocean gradient, green continents, soft edge
function makeEarthSprite(): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const ocean = ctx.createRadialGradient(52, 48, 8, 64, 64, 62);
  ocean.addColorStop(0, '#7ec4ff');
  ocean.addColorStop(0.6, '#2b6fd4');
  ocean.addColorStop(1, '#0b2e6b');
  ctx.fillStyle = ocean;
  ctx.beginPath();
  ctx.arc(64, 64, 62, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(88, 168, 78, 0.95)';
  const blobs: Array<[number, number, number, number, number]> = [
    [45, 44, 19, 12, 0.5], [86, 70, 14, 10, -0.4], [56, 92, 11, 7, 0.2], [90, 38, 9, 6, 0],
  ];
  for (const [x, y, rx, ry, rot] of blobs) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
    ctx.fill();
  }
  const edge = ctx.createRadialGradient(64, 64, 48, 64, 64, 63);
  edge.addColorStop(0, 'rgba(0,0,0,1)');
  edge.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, 128, 128);
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(canvas), transparent: true, depthWrite: false,
    })
  );
  return sprite;
}

function makeTextSprite(text: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const measure = canvas.getContext('2d')!;
  measure.font = '40px ui-monospace, monospace';
  const w = Math.ceil(measure.measureText(text).width) + 16;
  canvas.width = w;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.font = '40px ui-monospace, monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 8, 32);
  const tex = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })
  );
  sprite.scale.set(w / 64, 1, 1);
  return sprite;
}

export default function StarMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hovered, setHovered] = useState<Star[] | null>(null);
  const [selected, setSelected] = useState<Star[] | null>(null);
  const setSelectedRef = useRef(setSelected);
  setSelectedRef.current = setSelected;
  const deselectRef = useRef<() => void>(() => {});
  const mousePos = useRef({ x: 0, y: 0 });

  // place the tooltip as soon as it mounts, not on the next pointermove
  useEffect(() => {
    const tip = tooltipRef.current;
    if (tip && hovered) {
      tip.style.left = `${mousePos.current.x + 14}px`;
      tip.style.top = `${mousePos.current.y + 10}px`;
    }
  }, [hovered]);

  const labeledStars = [
    ...STARS.filter((s) => s.proper && LABELED.includes(s.proper)),
    ...FAMOUS,
    ...PLANETS,
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.display = 'block';

    // ---- main stars (shader points: per-star size + color, soft glow) ----
    const n = STARS.length;
    const positions = new Float32Array(n * 3);
    const colors = new Float32Array(n * 3);
    const sizes = new Float32Array(n);
    STARS.forEach((s, i) => {
      const p = toScene(s);
      positions.set([p.x, p.y, p.z], i * 3);
      const c = bvToColor(s.ci);
      colors.set([c.r, c.g, c.b], i * 3);
      // brighter (lower absmag) → bigger dot; absmag spans ~1.5 to ~18
      sizes[i] = THREE.MathUtils.clamp(1.55 - ((s.absmag ?? 10) - 1.5) * 0.075, 0.38, 1.7);
    });
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    starGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    const starMat = new THREE.ShaderMaterial({
      uniforms: { uScale: { value: 1 }, uMaxPx: { value: 30 } },
      vertexShader: /* glsl */ `
        attribute float aSize;
        attribute vec3 aColor;
        uniform float uScale;
        uniform float uMaxPx;
        varying vec3 vColor;
        void main() {
          vColor = aColor;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = min(aSize * uScale / -mv.z, uMaxPx);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float glow = smoothstep(0.5, 0.06, d);
          float core = smoothstep(0.2, 0.0, d);
          gl_FragColor = vec4(vColor * glow + vec3(0.9) * core, glow);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // ---- famous landmarks beyond 25 ly ----
    const fN = FAMOUS.length;
    const fPos = new Float32Array(fN * 3);
    const fCol = new Float32Array(fN * 3);
    const fSize = new Float32Array(fN);
    FAMOUS.forEach((s, i) => {
      const p = displayPos(s);
      fPos.set([p.x, p.y, p.z], i * 3);
      // black holes and pulsars are drawn as animated billboards instead of dots
      const c = s.type !== 'star' ? new THREE.Color(0, 0, 0) : bvToColor(s.ci);
      fCol.set([c.r, c.g, c.b], i * 3);
      fSize[i] = s.type !== 'star' ? 0.01 : 1.5;
    });
    const famousGeo = new THREE.BufferGeometry();
    famousGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3));
    famousGeo.setAttribute('aColor', new THREE.BufferAttribute(fCol, 3));
    famousGeo.setAttribute('aSize', new THREE.BufferAttribute(fSize, 1));
    const famousPoints = new THREE.Points(famousGeo, starMat);
    scene.add(famousPoints);

    // black holes: animated accretion disk + photon ring + true black horizon,
    // billboarded to face the camera. loosely styled after the EHT/Interstellar look
    const billboards: THREE.Group[] = [];
    const animMats: THREE.ShaderMaterial[] = [];
    FAMOUS.forEach((s) => {
      if (s.type !== 'blackhole') return;
      const g = new THREE.Group();
      // solid horizon disc occludes stars behind it
      const horizon = new THREE.Mesh(
        new THREE.CircleGeometry(0.21, 48),
        new THREE.MeshBasicMaterial({ color: 0x000000 })
      );
      const diskMat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = position.xy;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            vec2 uv = vUv;
            float r = length(uv);
            vec3 col = vec3(0.0);
            float alpha = 0.0;

            // thin, hot photon ring hugging the horizon
            float ring = exp(-pow((r - 0.26) * 34.0, 2.0));
            col += ring * vec3(1.0, 0.9, 0.72) * 1.5;
            alpha += ring;

            // flattened accretion disk with orbiting streaks
            vec2 duv = vec2(uv.x, uv.y * 2.6);
            float dr = length(duv);
            float da = atan(duv.y, duv.x);
            float band = smoothstep(0.28, 0.40, dr) * (1.0 - smoothstep(0.52, 0.95, dr));
            float streaks = 0.55
              + 0.30 * sin(da * 9.0 - uTime * 1.8 + dr * 16.0)
              + 0.15 * sin(da * 23.0 - uTime * 3.1 - dr * 30.0);
            float doppler = 1.0 + 0.75 * sin(da + 0.4); // one side beams toward us
            float disk = band * max(streaks, 0.0) * doppler;
            col += disk * mix(vec3(1.0, 0.5, 0.12), vec3(1.0, 0.93, 0.75), smoothstep(0.55, 0.30, dr));
            alpha += disk * 0.9;

            // soft ambient glow around the whole thing
            float glow = exp(-pow((r - 0.28) * 5.0, 2.0)) * 0.22;
            col += glow * vec3(1.0, 0.6, 0.3);
            alpha += glow;

            // slow uneasy flicker
            col *= 0.92 + 0.08 * sin(uTime * 4.7 + sin(uTime * 11.0));

            // nothing escapes the horizon
            if (r < 0.215) { col = vec3(0.0); alpha = 0.0; }
            gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      const disk = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), diskMat);
      g.add(horizon, disk);
      g.position.copy(displayPos(s));
      g.scale.setScalar(s.name === 'Sagittarius A*' ? 3.2 : 1.6);
      scene.add(g);
      billboards.push(g);
      animMats.push(diskMat);
    });

    // pulsars: a blinking core with two lighthouse beams sweeping around.
    // PSR J1748-2446ad gets a comically fast spin (still ~200x slower than reality)
    FAMOUS.forEach((s) => {
      if (s.type !== 'pulsar') return;
      const speed = s.name.startsWith('PSR') ? 30 : 6; // rad/s
      const mat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uSpeed: { value: speed } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = position.xy;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform float uSpeed;
          varying vec2 vUv;
          void main() {
            vec2 uv = vUv;
            float r = length(uv);
            float a = atan(uv.y, uv.x);
            float t = uTime * uSpeed;
            vec3 tint = vec3(0.72, 0.86, 1.0);
            vec3 col = vec3(0.0);
            float alpha = 0.0;

            // core flash — blinks as each beam sweeps past
            float core = exp(-pow(r * 7.0, 2.0)) * (0.75 + 0.25 * cos(2.0 * t));
            col += core * mix(tint, vec3(1.0), 0.6) * 1.6;
            alpha += core;

            // two opposed lighthouse beams
            float beam = pow(abs(cos(a - t)), 24.0) * exp(-r * 2.4) * smoothstep(0.02, 0.1, r);
            col += beam * tint * 1.3;
            alpha += beam;

            // faint halo
            float halo = exp(-pow(r * 3.0, 2.0)) * 0.12;
            col += halo * tint;
            alpha += halo;

            gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
      g.position.copy(displayPos(s));
      g.scale.setScalar(1.5);
      scene.add(g);
      billboards.push(g);
      animMats.push(mat);
    });

    // ---- faint distant background stars ----
    const bgN = 700;
    const bgPos = new Float32Array(bgN * 3);
    for (let i = 0; i < bgN; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(650 + Math.random() * 350);
      bgPos.set([v.x, v.y, v.z], i * 3);
    }
    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    const bgMat = new THREE.PointsMaterial({
      color: 0x9db4d4, size: 1.4, sizeAttenuation: false,
      transparent: true, opacity: 0.35, depthWrite: false,
    });
    scene.add(new THREE.Points(bgGeo, bgMat));

    // ---- distance rings on the celestial-equator plane ----
    // linear to 25 ly, then log-spaced milestones out to the galaxy's edge
    const RINGS: Array<[number, string, number]> = [
      [5, '5 ly', 0.06], [10, '10 ly', 0.06], [15, '15 ly', 0.06], [20, '20 ly', 0.06],
      [25, '25 ly', 0.14], [50, '50 ly', 0.09], [100, '100 ly', 0.09],
      [500, '500 ly', 0.09], [1000, '1,000 ly', 0.09], [10000, '10,000 ly', 0.09],
      [50000, 'edge of the milky way', 0.16],
    ];
    const gridGroup = new THREE.Group();
    for (const [r, text, opacity] of RINGS) {
      const dr = compressRadius(r);
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 180; i++) {
        const a = (i / 180) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * dr, 0, Math.sin(a) * dr));
      }
      const ring = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity })
      );
      gridGroup.add(ring);
      const label = makeTextSprite(text);
      const ls = Math.max(1, dr / 32);
      label.scale.multiplyScalar(ls);
      label.position.set(dr + 1.6 * ls, 0.4 * ls, 0);
      gridGroup.add(label);
    }
    scene.add(gridGroup);

    // ---- stems: star → plane, for depth perception ----
    const stemPos = new Float32Array(n * 6);
    STARS.forEach((s, i) => {
      const p = toScene(s);
      stemPos.set([p.x, p.y, p.z, p.x, 0, p.z], i * 6);
    });
    const stemGeo = new THREE.BufferGeometry();
    stemGeo.setAttribute('position', new THREE.BufferAttribute(stemPos, 3));
    const stems = new THREE.LineSegments(
      stemGeo,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.07 })
    );
    scene.add(stems);

    const fStemPos = new Float32Array(fN * 6);
    FAMOUS.forEach((s, i) => {
      const p = displayPos(s);
      fStemPos.set([p.x, p.y, p.z, p.x, 0, p.z], i * 6);
    });
    const fStemGeo = new THREE.BufferGeometry();
    fStemGeo.setAttribute('position', new THREE.BufferAttribute(fStemPos, 3));
    const fStems = new THREE.LineSegments(
      fStemGeo,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05 })
    );
    scene.add(fStems);

    // ---- the solar system: planet dots + orbit rings on the tilted ecliptic ----
    const PLANET_DOT = 1.2e-5; // world-size base for planet dots, in ly
    const pN = PLANETS.length;
    const pPos = new Float32Array(pN * 3);
    const pCol = new Float32Array(pN * 3);
    const pSize = new Float32Array(pN);
    PLANETS.forEach((s, i) => {
      const p = toScene(s);
      pPos.set([p.x, p.y, p.z], i * 3);
      pCol.set(PLANET_DEFS[i].color, i * 3);
      // exaggerated sizes — to-scale planets would be sub-pixel at any usable zoom
      pSize[i] = PLANET_DEFS[i].size * PLANET_DOT;
    });
    const planetGeo = new THREE.BufferGeometry();
    planetGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    planetGeo.setAttribute('aColor', new THREE.BufferAttribute(pCol, 3));
    planetGeo.setAttribute('aSize', new THREE.BufferAttribute(pSize, 1));
    const planetPoints = new THREE.Points(planetGeo, starMat);
    scene.add(planetPoints);

    // saturn's rings: two annuli with a cassini-division gap, tilted like the real
    // thing. sized each frame to hug the (pixel-capped) planet dot
    const saturnRing = new THREE.Group();
    for (const [inner, outer, opacity] of [[0.6, 0.78, 0.55], [0.82, 1.0, 0.3]] as const) {
      saturnRing.add(
        new THREE.Mesh(
          new THREE.RingGeometry(inner, outer, 48),
          new THREE.MeshBasicMaterial({
            color: 0xd8c790, transparent: true, opacity,
            side: THREE.DoubleSide, depthWrite: false,
          })
        )
      );
    }
    saturnRing.position.copy(toScene(PLANETS.find((p) => p.name === 'Saturn')!));
    saturnRing.rotation.set(-Math.PI / 2 + 0.47, 0, 0.15); // ~27° ring tilt
    saturnRing.visible = false;
    scene.add(saturnRing);

    const earthSprite = makeEarthSprite();
    earthSprite.position.copy(toScene(PLANETS.find((p) => p.name === 'Earth')!));
    earthSprite.visible = false;
    scene.add(earthSprite);

    const orbitGroup = new THREE.Group();
    orbitGroup.rotation.x = ECLIPTIC;
    for (const p of PLANET_DEFS) {
      const r = p.a * AU_LY;
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
      }
      orbitGroup.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts),
          new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 })
        )
      );
    }
    scene.add(orbitGroup);

    // ---- hover / selection highlight rings + sun→star line ----
    const makeHighlight = (opacity: number) => {
      const mesh = new THREE.Mesh(
        new THREE.RingGeometry(0.8, 0.92, 40),
        new THREE.MeshBasicMaterial({
          color: 0xffffff, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false,
        })
      );
      mesh.visible = false;
      scene.add(mesh);
      return mesh;
    };
    const hoverRing = makeHighlight(0.5);
    const selectRing = makeHighlight(0.9);
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(), new THREE.Vector3(),
    ]);
    const sunLine = new THREE.Line(
      lineGeo,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })
    );
    sunLine.visible = false;
    scene.add(sunLine);

    // ---- camera: custom orbit with inertia + idle auto-rotate ----
    // orbits `focus`, which glides to the selected star (or back home to Sol)
    let theta = 0.7, phi = 1.12, radius = 62;
    let velTheta = 0, velPhi = 0;
    let dragging = false;
    let lastX = 0, lastY = 0;
    let lastInteraction = 0;
    let pinchDist = 0;
    const pointers = new Map<number, { x: number; y: number }>();
    const focus = new THREE.Vector3();
    const focusTarget = new THREE.Vector3();

    const updateCamera = () => {
      phi = THREE.MathUtils.clamp(phi, 0.15, Math.PI - 0.15);
      radius = THREE.MathUtils.clamp(radius, 2.5e-6, 320);
      // shrink the near plane as we dive toward the planets
      camera.near = THREE.MathUtils.clamp(radius * 0.02, 2e-7, 0.5);
      camera.updateProjectionMatrix();
      camera.position.set(
        focus.x + radius * Math.sin(phi) * Math.cos(theta),
        focus.y + radius * Math.cos(phi),
        focus.z + radius * Math.sin(phi) * Math.sin(theta)
      );
      camera.lookAt(focus);
    };

    // ---- picking ----
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 0.7;
    const ndc = new THREE.Vector2();
    let hoveredIdx = -1;
    let selectedIdx = -1;

    const pick = (clientX: number, clientY: number): number => {
      // tighter hitbox when zoomed in, so close pairs (and planets) are pickable
      raycaster.params.Points.threshold = Math.max(2e-6, radius * 0.012);
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.set(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(ndc, camera);
      // planets only become interactive within a light year of home; farther
      // out, the solar system is just sol
      const targets =
        radius < 1 ? [starPoints, famousPoints, planetPoints] : [starPoints, famousPoints];
      const hits = raycaster.intersectObjects(targets);
      if (!hits.length) return -1;
      const hit = hits[0];
      const idx = hit.index ?? -1;
      if (idx < 0) return -1;
      if (hit.object === famousPoints) return STARS.length + idx;
      if (hit.object === planetPoints) return STARS.length + FAMOUS.length + idx;
      return idx;
    };

    const applySelection = (idx: number) => {
      selectedIdx = idx;
      if (idx >= 0) {
        const s = ALL[idx];
        const p = displayPos(s);
        selectRing.position.copy(p);
        selectRing.visible = true;
        focusTarget.copy(p);
        if (s.dist > 0.01) {
          lineGeo.setFromPoints([new THREE.Vector3(0, 0, 0), p]);
          sunLine.visible = true;
        } else {
          sunLine.visible = false;
        }
        setSelectedRef.current(systemOf(idx));
      } else {
        selectRing.visible = false;
        sunLine.visible = false;
        focusTarget.set(0, 0, 0);
        setSelectedRef.current(null);
      }
    };
    deselectRef.current = () => applySelection(-1);

    // ---- events ----
    const el = renderer.domElement;
    let downX = 0, downY = 0;

    const onPointerDown = (e: PointerEvent) => {
      el.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) {
        dragging = true;
        lastX = downX = e.clientX;
        lastY = downY = e.clientY;
      } else if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
      }
      lastInteraction = performance.now();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (pointers.has(e.pointerId)) {
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchDist > 0) radius *= pinchDist / d;
        pinchDist = d;
        lastInteraction = performance.now();
        return;
      }
      if (dragging) {
        velTheta = (e.clientX - lastX) * 0.006;
        velPhi = -(e.clientY - lastY) * 0.006;
        theta += velTheta;
        phi += velPhi;
        lastX = e.clientX;
        lastY = e.clientY;
        lastInteraction = performance.now();
        return;
      }
      // hover (mouse only)
      if (e.pointerType === 'mouse') {
        const rectNow = container.getBoundingClientRect();
        mousePos.current = { x: e.clientX - rectNow.left, y: e.clientY - rectNow.top };
        const idx = pick(e.clientX, e.clientY);
        if (idx !== hoveredIdx) {
          hoveredIdx = idx;
          setHovered(idx >= 0 ? systemOf(idx) : null);
          el.style.cursor = idx >= 0 ? 'pointer' : 'grab';
          if (idx >= 0) {
            hoverRing.position.copy(displayPos(ALL[idx]));
            hoverRing.visible = true;
          } else {
            hoverRing.visible = false;
          }
        }
        const tip = tooltipRef.current;
        if (tip) {
          const rect = container.getBoundingClientRect();
          tip.style.left = `${e.clientX - rect.left + 14}px`;
          tip.style.top = `${e.clientY - rect.top + 10}px`;
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchDist = 0;
      if (pointers.size === 0) dragging = false;
      // treat as a click if the pointer barely moved
      if (Math.hypot(e.clientX - downX, e.clientY - downY) < 6) {
        const idx = pick(e.clientX, e.clientY);
        applySelection(idx === selectedIdx ? -1 : idx);
      }
      lastInteraction = performance.now();
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // under a light year the empty gap to the planets is huge — zoom faster
      const rate = radius < 1 ? 0.006 : 0.003;
      radius *= Math.exp(e.deltaY * rate);
      lastInteraction = performance.now();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') applySelection(-1);
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
    el.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    el.style.cursor = 'grab';

    // ---- resize ----
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      starMat.uniforms.uScale.value =
        renderer.domElement.height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
      starMat.uniforms.uMaxPx.value = 30 * renderer.getPixelRatio();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // ---- render loop ----
    const labelStars = [
      ...STARS.filter((s) => s.proper && LABELED.includes(s.proper)),
      ...FAMOUS,
      ...PLANETS,
    ];
    const proj = new THREE.Vector3();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!dragging) {
        theta += velTheta;
        phi += velPhi;
        velTheta *= 0.92;
        velPhi *= 0.92;
        // gentle auto-rotate after 4s idle, unless a star is pinned
        if (performance.now() - lastInteraction > 4000 && selectedIdx < 0) {
          theta += 0.0009;
        }
      }
      focus.lerp(focusTarget, 0.06);
      updateCamera();
      const camScale = radius * 0.024;
      for (const ring of [hoverRing, selectRing]) {
        if (ring.visible) {
          ring.quaternion.copy(camera.quaternion);
          ring.scale.setScalar(camScale);
        }
      }
      const animTime = performance.now() * 0.001;
      for (const b of billboards) b.quaternion.copy(camera.quaternion);
      for (const m of animMats) m.uniforms.uTime.value = animTime;
      // saturn's rings and the blue marble track the pixel-capped planet dot size
      const solarZoom = radius < 0.004;
      saturnRing.visible = solarZoom;
      earthSprite.visible = solarZoom;
      if (solarZoom) {
        // match each planet's actual on-screen dot size (world size, capped in px)
        const capW = (d: number) =>
          (starMat.uniforms.uMaxPx.value * d) / starMat.uniforms.uScale.value;
        const dS = camera.position.distanceTo(saturnRing.position);
        saturnRing.scale.setScalar(Math.min(2.3 * PLANET_DOT, capW(dS)) * 0.8);
        const dE = camera.position.distanceTo(earthSprite.position);
        earthSprite.scale.setScalar(Math.min(0.95 * PLANET_DOT, capW(dE)) * 1.1);
      }
      // project floating labels to screen space
      const w = container.clientWidth;
      const h = container.clientHeight;
      labelStars.forEach((s, i) => {
        const div = labelRefs.current[i];
        if (!div) return;
        // planet labels only exist at solar-system zoom; star labels only outside it
        if (s.type === 'planet' ? radius > 0.004 : radius < 0.01) {
          div.style.opacity = '0';
          return;
        }
        proj.copy(displayPos(s)).project(camera);
        if (proj.z < 1) {
          const dy = i % 2 === 0 ? -18 : 10;
          div.style.transform = `translate(${(proj.x * 0.5 + 0.5) * w + 7}px, ${(-proj.y * 0.5 + 0.5) * h + dy}px)`;
          div.style.opacity = '1';
        } else {
          div.style.opacity = '0';
        }
      });
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.Line) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
        if (obj instanceof THREE.Sprite) {
          obj.material.map?.dispose();
          obj.material.dispose();
        }
      });
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-black">
      {/* floating labels for famous stars */}
      {labeledStars.map((s, i) => (
        <div
          key={s.name}
          ref={(el) => { labelRefs.current[i] = el; }}
          className="pointer-events-none absolute left-0 top-0 font-mono text-[10px] lowercase tracking-widest text-white/50 transition-opacity"
        >
          {s.proper ?? s.name}
        </div>
      ))}

      {/* hover tooltip */}
      {hovered && (
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute z-10 rounded-sm border border-white/15 bg-black/85 px-3 py-2 font-mono text-xs text-white"
        >
          {hovered.map((h) => (
            <div key={h.name} className="lowercase tracking-widest">{h.name}</div>
          ))}
          <div className="mt-0.5 text-white/50">
            {hovered[0].dist < 0.01
              ? 'you are here'
              : `${fmtDist(hovered[0].dist)} · ${
                  hovered.length > 1
                    ? 'binary pair'
                    : hovered[0].kind ?? starKind(hovered[0].spect)
                }`}
          </div>
        </div>
      )}

      {/* title */}
      <div className="pointer-events-none absolute inset-x-0 top-6 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold lowercase text-white sm:text-3xl">the neighborhood</h1>
        </div>
      </div>

      {/* selected star cards — one per member of the system */}
      {selected && (
        <div className="pointer-events-none absolute inset-x-0 top-6 z-20">
          <div className="mx-auto flex max-w-7xl flex-col items-end gap-3 px-4 sm:px-6 lg:px-8">
            {selected.map((info, i) => (
              <div
                key={info.name}
                className="pointer-events-auto w-64 rounded-sm border border-white/15 bg-black/85 p-4 font-mono text-xs text-white"
              >
                <div className="flex items-start justify-between">
                  <div className="text-sm lowercase tracking-widest">{info.name}</div>
                  {i === 0 && (
                    <button
                      onClick={() => deselectRef.current()}
                      className="-mr-1 -mt-1 px-1 text-white/40 hover:text-white"
                      aria-label="close"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="mt-1 text-white/50">
                  {info.kind ?? starKind(info.spect)}
                  {selected.length > 1 && ' · binary pair'}
                </div>
                {info.claim && (
                  <div className="mt-2 text-white/45">{info.claim}</div>
                )}
                <dl className="mt-3 space-y-1.5 text-white/70">
                  <div className="flex justify-between">
                    <dt className="text-white/40">distance</dt>
                    <dd>{fmtDist(info.dist)}</dd>
                  </div>
                  {info.spect && (
                    <div className="flex justify-between">
                      <dt className="text-white/40">spectral type</dt>
                      <dd>{info.spect}</dd>
                    </div>
                  )}
                  {info.con && (
                    <div className="flex justify-between">
                      <dt className="text-white/40">constellation</dt>
                      <dd>{CONSTELLATIONS[info.con] ?? info.con}</dd>
                    </div>
                  )}
                  {info.massEarth != null && (
                    <div className="flex justify-between">
                      <dt className="text-white/40">mass</dt>
                      <dd>{Number(info.massEarth.toPrecision(3))} earths</dd>
                    </div>
                  )}
                  {info.massEarth != null && (
                    <div className="flex justify-between">
                      <dt className="text-white/40">solar masses</dt>
                      <dd>{plainDecimal(info.massEarth * 3.003e-6)}</dd>
                    </div>
                  )}
                  {info.mag != null && (
                    <div className="flex justify-between">
                      <dt className="text-white/40">apparent mag</dt>
                      <dd>{info.mag.toFixed(2)}</dd>
                    </div>
                  )}
                  {info.absmag != null && (
                    <div className="flex justify-between">
                      <dt className="text-white/40">absolute mag</dt>
                      <dd>{info.absmag.toFixed(2)}</dd>
                    </div>
                  )}
                </dl>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* footer hud */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-right font-mono text-[10px] lowercase tracking-widest text-white/35">
          <div className="hidden sm:block">drag to orbit · scroll to zoom · click a star</div>
          <div className="sm:hidden">drag to orbit · pinch to zoom · tap a star</div>
        </div>
      </div>
    </div>
  );
}
