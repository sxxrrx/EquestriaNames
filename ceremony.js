const $ = (s) => document.querySelector(s);
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const capWords = (s) => s.replace(/\b\w/g, m => m.toUpperCase()).replace(/\s+/g, " ").trim();

const tribeSelect = $("#tribeSelect");
const genderSelect = $("#genderSelect");
const styleSelect = $("#styleSelect");
const titleToggle = $("#titleToggle");

const vibeInput = $("#vibeInput");
const coatColor = $("#coatColor");
const maneColors = $("#maneColors");
const paletteFromVibe = $("#paletteFromVibe");

const knownForToggle = $("#knownForToggle");
const backstoryToggle = $("#backstoryToggle");
const backstoryLength = $("#backstoryLength");

const sealBtn = $("#sealBtn");
const resetBtn = $("#resetBtn");
const surpriseBtn = $("#surpriseBtn");
const vibeExampleBtn = $("#vibeExampleBtn");
const clearVibeBtn = $("#clearVibeBtn");

const outputBlock = $("#outputBlock");
const outName = $("#outName");
const outMeta = $("#outMeta");
const paletteGrid = $("#paletteGrid");
const outKnownFor = $("#outKnownFor");
const outBackstoryWrap = $("#outBackstoryWrap");
const outBackstory = $("#outBackstory");
const copyAllBtn = $("#copyAllBtn");

const DATA = {
  classic: {
    first: ["Sun", "Moon", "Star", "Silver", "Golden", "Willow", "Meadow", "Cloud", "Bright", "Gentle", "Honey", "Autumn"],
    last:  ["Gleam", "Breeze", "Bloom", "Song", "Whisper", "Dawn", "Glow", "Shimmer", "Trail", "Harmony", "Mist", "Quill"]
  },
  royal: {
    first: ["Auric", "Regal", "Noble", "Velvet", "Ivory", "Amethyst", "Sapphire", "Gilded", "Cerulean", "Opaline", "Majestic", "Crown"],
    last:  ["Quill", "Scroll", "Crest", "Sigil", "Diadem", "Chamber", "Archive", "Radiance", "Luminance", "Banner", "Court", "Laurel"]
  },
  nature: {
    first: ["Everfree", "Thistle", "Fern", "Juniper", "Clover", "Briar", "Aspen", "River", "Rain", "Pine", "Dew", "Stone"],
    last:  ["Shade", "Grove", "Hollow", "Branch", "Brook", "Glade", "Wilds", "Petal", "Moss", "Vale", "Warden", "Bloom"]
  },
  magical: {
    first: ["Nova", "Astral", "Arcane", "Starlit", "Echo", "Lunar", "Solar", "Mystic", "Rune", "Comet", "Nebula", "Celestial"],
    last:  ["Sigil", "Hex", "Vesper", "Spiral", "Glyph", "Charm", "Radiant", "Eclipse", "Aether", "Mirage", "Beacon", "Quasar"]
  },
  alt: {
    first: ["Velvet", "Neon", "Indigo", "Crimson", "Violet", "Static", "Echo", "Jet", "Sable", "Riot", "Nocturne", "Reverb"],
    last:  ["Chorus", "Tempo", "Rhapsody", "Voltage", "Vinyl", "Cadence", "Distortion", "Crescendo", "Drift", "Anthem", "Beat", "Sparks"]
  }
};

const TRIBE_FLAVOR = {
  earth:   ["Harvest", "Orchard", "Copper", "Hearth", "Prairie", "Field"],
  unicorn: ["Prism", "Glimmer", "Rune", "Crystal", "Ward", "Spell"],
  pegasus: ["Nimbus", "Sky", "Gale", "Jetstream", "Soar", "Cloudbank"],
  alicorn: ["Crownlight", "Aurora", "Ascendant", "Eternal", "Empyrean"]
};

const TITLES_NEUTRAL = ["Captain", "Archivist", "Warden", "Keeper", "Envoy"];
const TITLES_MARE = ["Lady", "Dame", "Duchess", "Countess"];
const TITLES_STALLION = ["Sir", "Lord", "Duke", "Count"];

function pickTitle(g) {
  const pool = g === "mare"
    ? [...TITLES_MARE, ...TITLES_NEUTRAL]
    : g === "stallion"
    ? [...TITLES_STALLION, ...TITLES_NEUTRAL]
    : [...TITLES_NEUTRAL, ...TITLES_MARE, ...TITLES_STALLION];
  return rand(pool);
}

function pickTribe(v){
  return v === "random" ? rand(["earth","unicorn","pegasus","alicorn"]) : v;
}

function tokens(text){
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/* ---------- VIBE MAPPING (keyword-driven “smart” behavior) ---------- */

function vibeProfile(vibeText){
  const t = new Set(tokens(vibeText));
  // default lean
  let styleBias = null;
  let paletteTags = [];
  let talentTags = [];

  // style nudges
  if (t.has("royal") || t.has("regal") || t.has("princess") || t.has("noble")) styleBias = "royal";
  if (t.has("forest") || t.has("nature") || t.has("everfree") || t.has("cottagecore")) styleBias = "nature";
  if (t.has("magic") || t.has("celestial") || t.has("witch") || t.has("arcane") || t.has("cosmic")) styleBias = "magical";
  if (t.has("alt") || t.has("punk") || t.has("goth") || t.has("emo") || t.has("baddie") || t.has("music")) styleBias = "alt";

  // palette tags
  if (t.has("goth") || t.has("emo") || t.has("noir")) paletteTags.push("black","purple","silver");
  if (t.has("alt") || t.has("punk") || t.has("baddie")) paletteTags.push("black","violet","crimson","neon");
  if (t.has("music") || t.has("singer") || t.has("dj")) paletteTags.push("indigo","neon","silver");
  if (t.has("soft") || t.has("cozy") || t.has("gentle")) paletteTags.push("pearl","lavender","pink");
  if (t.has("winter") || t.has("icy") || t.has("frost")) paletteTags.push("ice","silver","blue");
  if (t.has("sun") || t.has("summer") || t.has("beach")) paletteTags.push("gold","peach","aqua");
  if (t.has("forest") || t.has("nature") || t.has("everfree")) paletteTags.push("green","moss","brown");

  // talent tags
  if (t.has("music") || t.has("dj") || t.has("band")) talentTags.push("music");
  if (t.has("library") || t.has("librarian") || t.has("book")) talentTags.push("archive");
  if (t.has("witch") || t.has("magic") || t.has("arcane")) talentTags.push("magic");
  if (t.has("baddie") || t.has("boss") || t.has("leader")) talentTags.push("leader");
  if (t.has("nature") || t.has("herbal") || t.has("forest")) talentTags.push("nature");

  return { styleBias, paletteTags, talentTags };
}

/* ---------- PALETTE ENGINE ---------- */
function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

function hexToRgb(hex){
  if (!hex) return null;
  let h = hex.trim().toLowerCase();
  if (!h.startsWith("#")) return null;
  h = h.slice(1);
  if (h.length === 3) h = h.split("").map(c => c + c).join("");
  if (h.length !== 6) return null;
  const n = parseInt(h, 16);
  if (Number.isNaN(n)) return null;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex({r,g,b}){
  const to = (v) => v.toString(16).padStart(2, "0");
  return `#${to(clamp(Math.round(r),0,255))}${to(clamp(Math.round(g),0,255))}${to(clamp(Math.round(b),0,255))}`.toUpperCase();
}

function rgbToHsl({r,g,b}){
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  const d = max - min;

  if (d !== 0) {
    s = d / (1 - Math.abs(2*l - 1));
    switch (max) {
      case r: h = ((g - b) / d) % 6; break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  return { h, s: s*100, l: l*100 };
}

function hslToRgb({h,s,l}){
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2*l - 1)) * s;
  const x = c * (1 - Math.abs(((h/60) % 2) - 1));
  const m = l - c/2;

  let r=0,g=0,b=0;
  if (0 <= h && h < 60) { r=c; g=x; b=0; }
  else if (60 <= h && h < 120) { r=x; g=c; b=0; }
  else if (120 <= h && h < 180) { r=0; g=c; b=x; }
  else if (180 <= h && h < 240) { r=0; g=x; b=c; }
  else if (240 <= h && h < 300) { r=x; g=0; b=c; }
  else { r=c; g=0; b=x; }

  return { r:(r+m)*255, g:(g+m)*255, b:(b+m)*255 };
}

function hueWrap(h){
  h %= 360;
  if (h < 0) h += 360;
  return h;
}
// Convert RGB to OK-ish perceptual space (Lab-like via XYZ + Lab)
function rgbToXyz({r,g,b}) {
  // sRGB companding
  const f = (v) => {
    v /= 255;
    return v <= 0.04045 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4);
  };
  let R=f(r), G=f(g), B=f(b);

  // D65
  const X = R*0.4124 + G*0.3576 + B*0.1805;
  const Y = R*0.2126 + G*0.7152 + B*0.0722;
  const Z = R*0.0193 + G*0.1192 + B*0.9505;
  return {X, Y, Z};
}

function xyzToLab({X,Y,Z}) {
  // D65 reference white
  const Xn=0.95047, Yn=1.00000, Zn=1.08883;
  const f = (t) => t > 0.008856 ? Math.cbrt(t) : (7.787*t + 16/116);
  const fx=f(X/Xn), fy=f(Y/Yn), fz=f(Z/Zn);
  const L=116*fy - 16;
  const a=500*(fx - fy);
  const b=200*(fy - fz);
  return {L,a,b};
}

function deltaE(rgb1, rgb2){
  const l1 = xyzToLab(rgbToXyz(rgb1));
  const l2 = xyzToLab(rgbToXyz(rgb2));
  const dL=l1.L-l2.L, da=l1.a-l2.a, db=l1.b-l2.b;
  return Math.sqrt(dL*dL + da*da + db*db);
}
function extractHexes(text){
  if (!text) return [];
  const matches = text.match(/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g);
  return matches ? matches.map(m => m.toUpperCase()) : [];
}

function buildPalette({ vibeText, coatText, maneText }){
  // 1) Pull any user-provided hex colors
  const userHexes = [
    ...extractHexes(coatText),
    ...extractHexes(maneText)
  ].slice(0, 3); // keep up to 3 influences

  const userHsl = userHexes
    .map(h => hexToRgb(h))
    .filter(Boolean)
    .map(rgbToHsl);

  // 2) Choose base hue
  let baseHue = baseHueFromVibe(vibeText);
  if (userHsl.length){
    // average hues on a circle (vector average)
    const rad = userHsl.map(c => c.h * Math.PI/180);
    const x = rad.reduce((s,a)=>s+Math.cos(a),0);
    const y = rad.reduce((s,a)=>s+Math.sin(a),0);
    baseHue = hueWrap(Math.atan2(y,x) * 180/Math.PI);
  }

  // 3) Set harmony parameters (tight hue spread = cohesion)
  const hueSpread = userHsl.length ? 22 : 28; // tighter if user provided colors
  const satBase = userHsl.length ? clamp(userHsl[0].s, 30, 70) : 52;
  const lightBase = userHsl.length ? clamp(userHsl[0].l, 28, 72) : 50;

  // 4) Generate 5 colors: shadow, base, mid, highlight, accent
  const candidatesHsl = [];

  // Shadow
  candidatesHsl.push({ h: hueWrap(baseHue - hueSpread*0.35), s: clamp(satBase*0.75, 22, 60), l: clamp(lightBase*0.45, 16, 42) });
  // Base
  candidatesHsl.push({ h: hueWrap(baseHue), s: clamp(satBase, 30, 75), l: clamp(lightBase, 28, 68) });
  // Mid
  candidatesHsl.push({ h: hueWrap(baseHue + hueSpread*0.35), s: clamp(satBase*0.9, 28, 72), l: clamp(lightBase*1.05, 32, 76) });
  // Highlight
  candidatesHsl.push({ h: hueWrap(baseHue + hueSpread*0.15), s: clamp(satBase*0.55, 18, 55), l: clamp(lightBase*1.45, 70, 92) });

  // Accent: either slight shift OR muted complement depending on vibe
  const wantEdgy = /alt|punk|emo|goth|baddie|neon/i.test(vibeText || "");
  const accentHue = wantEdgy ? hueWrap(baseHue + 165) : hueWrap(baseHue + hueSpread*0.9);
  candidatesHsl.push({
    h: accentHue,
    s: wantEdgy ? clamp(satBase*0.85, 28, 78) : clamp(satBase*0.55, 18, 58),
    l: wantEdgy ? clamp(lightBase*0.85, 22, 58) : clamp(lightBase*0.95, 28, 70)
  });

  // 5) Convert to hex
  let palette = candidatesHsl.map(hsl => rgbToHex(hslToRgb(hsl)));

  // 6) Blend in user hexes (replace base/mid/accent slots)
  // This ensures their provided colors appear, but we keep cohesion via base hue choice above.
  if (userHexes.length){
    if (userHexes[0]) palette[1] = userHexes[0]; // base slot
    if (userHexes[1]) palette[2] = userHexes[1]; // mid slot
    if (userHexes[2]) palette[4] = userHexes[2]; // accent slot
  }

  // 7) Enforce cohesion via perceptual distance caps
  // If any pair is too far apart, gently pull accent hue closer by regenerating it.
  // Thresholds chosen to avoid “clashing loud” palettes.
  const MAX_DE = 52; // above this tends to feel discordant
  const MIN_DE = 6;  // below this feels duplicate

  const rgbPalette = () => palette.map(h => hexToRgb(h)).filter(Boolean);

  function maxDeltaE(){
    const rgbs = rgbPalette();
    let max = 0, min = Infinity;
    for (let i=0;i<rgbs.length;i++){
      for (let j=i+1;j<rgbs.length;j++){
        const d = deltaE(rgbs[i], rgbs[j]);
        max = Math.max(max, d);
        min = Math.min(min, d);
      }
    }
    return { max, min };
  }

  // Try a few small adjustments to accent if needed (no heavy loops)
  for (let tries=0; tries<5; tries++){
    const { max, min } = maxDeltaE();
    if (max <= MAX_DE && min >= MIN_DE) break;

    // If too discordant, move accent closer to base and reduce saturation
    const base = hexToRgb(palette[1]);
    if (!base) break;
    const baseHsl = rgbToHsl(base);

    const adjust = candidatesHsl[4];
    adjust.h = hueWrap(baseHsl.h + (wantEdgy ? 140 : hueSpread*0.7));
    adjust.s = clamp(adjust.s * 0.85, 16, 65);
    adjust.l = clamp(adjust.l, 22, 72);

    palette[4] = rgbToHex(hslToRgb(adjust));
    // If user explicitly provided accent (userHexes[2]), don’t override it.
    if (userHexes[2]) palette[4] = userHexes[2];
  }

  return palette; // array of HEX strings
}


/* ---------- NAME + KNOWN FOR + BACKSTORY ---------- */

const TALENTS_BY_STYLE = {
  classic: [
    "organizing community festivals",
    "finding the perfect words for everypony",
    "bringing calm wherever they go",
    "turning small kindnesses into big change"
  ],
  royal: [
    "archival work in the Royal Library",
    "court diplomacy and elegant composure",
    "designing banners, crests, and royal seals",
    "solving mysteries with impeccable logic"
  ],
  nature: [
    "guiding travelers through tangled trails",
    "growing rare blooms and herbal remedies",
    "befriending woodland creatures instantly",
    "restoring hidden springs and old paths"
  ],
  magical: [
    "mapping constellations and ley lines",
    "decoding ancient runes in moonlight",
    "enchanting small objects with big purpose",
    "protective wards cast with precision"
  ],
  alt: [
    "writing hooks that get stuck in your head",
    "performing with fearless stage presence",
    "mixing beats into stormy anthems",
    "turning chaos into art on purpose"
  ]
};

const JOBS_BY_TALENTTAG = {
  music: ["club performer", "composer", "DJ", "stage manager"],
  archive: ["librarian", "scribe", "historian", "archivist"],
  magic: ["research mage", "enchanter", "ward specialist", "stargazer"],
  leader: ["crew captain", "event organizer", "guild lead", "royal envoy"],
  nature: ["herbalist", "trail warden", "gardener", "forest guide"]
};

const QUIRKS = [
  "always carries a tiny quill behind one ear",
  "names every cloud they pass",
  "hums a tune when thinking",
  "cannot resist fixing crooked picture frames",
  "keeps a pocketful of shiny pebbles for luck",
  "falls asleep mid-book—then wakes up on the exact right page"
];

function pronouns(g){
  if (g === "mare") return { subj:"She", obj:"her", poss:"her" };
  if (g === "stallion") return { subj:"He", obj:"him", poss:"his" };
  return { subj:"They", obj:"them", poss:"their" };
}

function generateName({ tribe, style, withTitle, vibeText }){
  const base = DATA[style] ?? DATA.classic;
  let firstPool = [...base.first];
  let lastPool  = [...base.last];

  const profile = vibeProfile(vibeText);
  if (profile.talentTags.includes("music")) lastPool.push("Cadence","Chorus","Tempo");
  if (profile.talentTags.includes("archive")) lastPool.push("Quill","Scroll","Archive");
  if (profile.talentTags.includes("magic")) firstPool.push("Astral","Rune","Mystic");
  if (profile.talentTags.includes("nature")) firstPool.push("Willow","Clover","Fern");

  let name = `${rand(firstPool)} ${rand(lastPool)}`;

  // Tribe accent
  if (Math.random() < 0.45 && TRIBE_FLAVOR[tribe]) {
    const extra = rand(TRIBE_FLAVOR[tribe]);
    name = Math.random() < 0.5 ? `${extra} ${rand(lastPool)}` : `${rand(firstPool)} ${extra}`;
  }

  // Royal flourish
  if (style === "royal" && Math.random() < 0.25) {
    name = `${rand(firstPool)} of ${rand(["Canterlot","Crystal Court","Sunspire","Mooncrest","The Archive"])}`;
  }

  // Alt hyphenation
  if (style === "alt" && Math.random() < 0.22) {
    name = `${rand(firstPool)}-${rand(lastPool)}`;
  }

  if (withTitle) name = `${pickTitle(genderSelect.value)} ${name}`;
  return capWords(name);
}

function generateKnownFor({ tribe, style, vibeText, g }){
  const profile = vibeProfile(vibeText);
  const talent = rand(TALENTS_BY_STYLE[style] ?? TALENTS_BY_STYLE.classic);

  let jobPool = (tribe === "earth") ? ["orchard keeper","baker","craftsperson","festival coordinator"]
            : (tribe === "unicorn") ? ["librarian","scribe","enchanter","apothecary"]
            : (tribe === "pegasus") ? ["weather captain","courier","flight instructor","storm chaser"]
            : ["royal envoy","guardian of archives","harmonic mediator","council advisor"];

  // If vibe suggests specific jobs, mix them in
  for (const tag of profile.talentTags){
    if (JOBS_BY_TALENTTAG[tag]) jobPool = [...jobPool, ...JOBS_BY_TALENTTAG[tag]];
  }

  const job = rand(jobPool);
  const quirk = rand(QUIRKS);

  const p = pronouns(g);
  return `Known for: ${p.subj.toLowerCase()} is known for ${talent} as a ${job}, and ${quirk}.`;
}

function safeBackstory({ name, tribe, style, vibeText, g, palette }){
  const p = pronouns(g);
  const places = {
    classic: ["Ponyville", "a cozy hillside village", "a bustling market town"],
    royal: ["Canterlot", "the Royal Archives", "a marble-lined district near the palace"],
    nature: ["the Everfree edge", "a woodland cabin", "a quiet grove with ancient trees"],
    magical: ["a stargazer’s tower", "an observatory", "a moonlit study filled with scrolls"],
    alt: ["a Cloudsdale loft", "a neon-lit venue", "a hidden rehearsal hall"]
  };

  const profile = vibeProfile(vibeText);
  const goal = profile.talentTags.includes("music") ? "to write a song that calms even the wildest storms"
           : profile.talentTags.includes("archive") ? "to uncover a lost chapter of Equestria’s history"
           : profile.talentTags.includes("magic") ? "to master a protective spell meant for guardians"
           : profile.talentTags.includes("nature") ? "to restore a trail no map remembers"
           : "to become a pony others can rely on";

  const challenge = rand([
    "a mix-up during a festival that nearly went off-script",
    "a sudden storm that tested every ounce of courage",
    "a mysterious riddle found in an old scroll",
    "a rivalry that turned into respect",
    "a mistake that became an important lesson"
  ]);

  const paletteLine = `Their palette leans ${palette.map(x => x.name).slice(0,3).join(", ")}—a look that suits ${p.poss} vibe.`;

  const origin = rand(places[style] ?? places.classic);

  const short = `${name} comes from ${origin}. ${p.subj} learned early that true strength is patience and practice. After ${challenge}, ${p.subj.toLowerCase()} discovered a talent for steady leadership—and a habit of showing up when it matters. Now, ${p.subj.toLowerCase()} works toward ${goal}. ${paletteLine}`;

  const medium = `${name} comes from ${origin}, where the days are busy and the nights feel full of possibility. ${p.subj} wasn’t always confident—at first, ${p.subj.toLowerCase()} preferred the quiet corners and the small victories. But after ${challenge}, ${p.subj.toLowerCase()} started training seriously, learning how to turn nerves into focus. Over time, ${p.subj.toLowerCase()} became known for helping others find their footing, too. Now, ${p.subj.toLowerCase()} works toward ${goal}, collecting stories, friendships, and lessons along the way. ${paletteLine}`;

  const long = `${name} comes from ${origin}, and the registry notes a spirit that refuses to stay ordinary. ${p.subj} grew up watching other ponies shine, quietly wondering what ${p.poss} own moment would look like. It arrived during ${challenge}—not as a grand miracle, but as a choice: to act, to learn, and to keep going. ${p.subj} practiced until mistakes felt like stepping stones, and soon discovered a special talent that fit like a perfectly tailored cloak. Along the way, ${p.subj.toLowerCase()} found allies—ponies who believed in the version of ${p.obj} that ${p.subj.toLowerCase()} was still becoming. Now, ${p.subj.toLowerCase()} works toward ${goal}, determined to leave Equestria kinder and brighter than ${p.subj.toLowerCase()} found it. ${paletteLine}`;

  return backstoryLength.value === "short" ? short
       : backstoryLength.value === "long" ? long
       : medium;
}

/* ---------- RENDER ---------- */

function renderPalette(palette){
  paletteGrid.innerHTML = "";
  for (const hex of palette){
    const el = document.createElement("div");
    el.className = "swatch";
    el.innerHTML = `
      <div class="swatchColor" style="background:${hex};"></div>
      <div class="swatchInfo">
        <div class="mono">${hex}</div>
      </div>
    `;
    paletteGrid.appendChild(el);
  }
}


function updateSteps(activeIdx){
  for (let i=1;i<=5;i++){
    const pill = document.querySelector(`#stepPill${i}`);
    if (!pill) continue;
    pill.classList.toggle("active", i === activeIdx);
  }
}

function seal(){
  updateSteps(5);

  const tribe = pickTribe(tribeSelect.value);
  const g = genderSelect.value;
  const vibeText = vibeInput.value.trim();

  const style = (() => {
    const prof = vibeProfile(vibeText);
    return prof.styleBias || styleSelect.value;
  })();

  const palette = buildPalette({ vibeText, coatText: coatColor.value, maneText: maneColors.value });
  const name = generateName({ tribe, style, withTitle: titleToggle.checked, vibeText });

  outName.textContent = name;

  const tribeLabel = tribe === "earth" ? "Earth Pony" : tribe === "unicorn" ? "Unicorn" : tribe === "pegasus" ? "Pegasus" : "Alicorn";
  const genderLabel = g === "mare" ? "Mare" : g === "stallion" ? "Stallion" : "Prefer not to say";
  outMeta.textContent = `${tribeLabel} • ${genderLabel} • ${style === "royal" ? "Canterlot Royal" : style === "nature" ? "Everfree / Nature" : style === "magical" ? "Arcane / Starborne" : style === "alt" ? "Alt / Music" : "Classic Equestria"} • Sealed by the Royal Registry ✦`;

  renderPalette(palette);

  if (knownForToggle.checked){
    outKnownFor.style.display = "";
    outKnownFor.textContent = generateKnownFor({ tribe, style, vibeText, g });
  } else {
    outKnownFor.style.display = "none";
  }

  if (backstoryToggle.checked){
    outBackstoryWrap.style.display = "";
    outBackstory.textContent = safeBackstory({ name, tribe, style, vibeText, g, palette });
  } else {
    outBackstoryWrap.style.display = "none";
  }

  outputBlock.style.display = "";
  copyAllBtn.disabled = false;

  // little glow
  const panel = $("#ceremonyPanel");
  if (panel){
    panel.classList.add("activated");
    setTimeout(()=>panel.classList.remove("activated"), 950);
    outputBlock.scrollIntoView({ behavior:"smooth", block:"start" });
  }
}

/* ---------- EVENTS ---------- */

sealBtn.addEventListener("click", seal);

resetBtn.addEventListener("click", () => {
  vibeInput.value = "";
  tribeSelect.value = "random";
  genderSelect.value = "unspecified";
  styleSelect.value = "classic";
  titleToggle.checked = false;
  coatColor.value = "";
  maneColors.value = "";
  paletteFromVibe.checked = true;

  knownForToggle.checked = true;
  backstoryToggle.checked = true;
  backstoryLength.value = "medium";

  outputBlock.style.display = "none";
  copyAllBtn.disabled = true;
  updateSteps(1);
});

surpriseBtn.addEventListener("click", () => {
  const vibes = [
    "alt music baddie",
    "soft winter librarian",
    "celestial goth witch",
    "sunny beach athlete",
    "forest guardian with a gentle heart",
    "royal etiquette expert with secret chaos"
  ];
  vibeInput.value = rand(vibes);
  tribeSelect.value = "random";
  genderSelect.value = "unspecified";
  styleSelect.value = rand(["classic","royal","nature","magical","alt"]);
  titleToggle.checked = Math.random() < 0.35;
  coatColor.value = "";
  maneColors.value = "";
  paletteFromVibe.checked = true;
  updateSteps(1);
  seal();
});

vibeExampleBtn.addEventListener("click", () => {
  vibeInput.value = "alt music baddie";
  updateSteps(1);
});

clearVibeBtn.addEventListener("click", () => {
  vibeInput.value = "";
  updateSteps(1);
});

copyAllBtn.addEventListener("click", async () => {
  const parts = [];
  parts.push(outName.textContent);
  parts.push(outMeta.textContent);

  if (paletteGrid.children.length){
    parts.push("Palette:");
    [...paletteGrid.children].forEach((c) => {
      const name = c.querySelector("strong")?.innerText || "";
      const hex = c.querySelector(".mono")?.innerText || "";
      parts.push(`- ${name} (${hex})`);
    });
  }
  if (outKnownFor.style.display !== "none") parts.push(outKnownFor.textContent);
  if (outBackstoryWrap.style.display !== "none") {
    parts.push("Backstory:");
    parts.push(outBackstory.textContent);
  }

  const text = parts.join("\n");

  try {
    await navigator.clipboard.writeText(text);
    copyAllBtn.textContent = "Copied!";
    setTimeout(() => (copyAllBtn.textContent = "Copy All"), 900);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    copyAllBtn.textContent = "Copied!";
    setTimeout(() => (copyAllBtn.textContent = "Copy All"), 900);
  }
});

/* step hinting (optional) */
vibeInput.addEventListener("input", () => updateSteps(1));
tribeSelect.addEventListener("change", () => updateSteps(2));
genderSelect.addEventListener("change", () => updateSteps(2));
styleSelect.addEventListener("change", () => updateSteps(2));
coatColor.addEventListener("input", () => updateSteps(3));
maneColors.addEventListener("input", () => updateSteps(3));
knownForToggle.addEventListener("change", () => updateSteps(4));
backstoryToggle.addEventListener("change", () => updateSteps(4));
backstoryLength.addEventListener("change", () => updateSteps(4));

updateSteps(1);
