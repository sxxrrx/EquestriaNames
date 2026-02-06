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

// -------- Basics --------
function tokens(text){
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}
function pickTribe(v){ return v === "random" ? rand(["earth","unicorn","pegasus","alicorn"]) : v; }
function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
function hueWrap(h){ h%=360; if(h<0) h+=360; return h; }
function jitter(range){ return (Math.random()*2 - 1) * range; }

// -------- HSL → HEX (for cohesive palettes) --------
function hslToRgb({h,s,l}){
  s/=100; l/=100;
  const c = (1 - Math.abs(2*l - 1)) * s;
  const x = c * (1 - Math.abs(((h/60) % 2) - 1));
  const m = l - c/2;
  let r=0,g=0,b=0;
  if (0<=h && h<60){ r=c; g=x; b=0; }
  else if (60<=h && h<120){ r=x; g=c; b=0; }
  else if (120<=h && h<180){ r=0; g=c; b=x; }
  else if (180<=h && h<240){ r=0; g=x; b=c; }
  else if (240<=h && h<300){ r=x; g=0; b=c; }
  else { r=c; g=0; b=x; }
  return { r:(r+m)*255, g:(g+m)*255, b:(b+m)*255 };
}
function rgbToHex({r,g,b}){
  const to = (v) => clamp(Math.round(v),0,255).toString(16).padStart(2,"0");
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase();
}
function hslToHex(hsl){ return rgbToHex(hslToRgb(hsl)); }

// Accept any user hex (#RGB or #RRGGBB) from coat/mane fields
function extractHexes(text){
  const matches = (text || "").match(/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g);
  if (!matches) return [];
  return matches.map(h => {
    let x = h.toUpperCase();
    if (x.length === 4) x = "#" + x.slice(1).split("").map(c => c+c).join("");
    return x;
  });
}

// -------- Vibe → base hue + style bias --------
function vibeProfile(vibeText){
  const t = new Set(tokens(vibeText));
  let styleBias = null;

  if (t.has("royal") || t.has("regal") || t.has("princess") || t.has("noble")) styleBias = "royal";
  if (t.has("forest") || t.has("nature") || t.has("everfree") || t.has("cottagecore")) styleBias = "nature";
  if (t.has("magic") || t.has("celestial") || t.has("witch") || t.has("arcane") || t.has("cosmic")) styleBias = "magical";
  if (t.has("alt") || t.has("punk") || t.has("goth") || t.has("emo") || t.has("baddie") || t.has("music")) styleBias = "alt";

  // Base hue families (simple + cohesive)
  let hue = 255; // default royal lavender-blue
  if (t.has("alt") || t.has("punk") || t.has("emo") || t.has("goth") || t.has("baddie")) hue = 275; // purple/indigo
  if (t.has("music") || t.has("dj") || t.has("band")) hue = 230; // blue/indigo
  if (t.has("beach") || t.has("ocean") || t.has("sea") || t.has("aqua")) hue = 190; // teal
  if (t.has("forest") || t.has("nature") || t.has("everfree") || t.has("cottagecore")) hue = 130; // green
  if (t.has("sun") || t.has("summer") || t.has("warm") || t.has("gold")) hue = 40; // gold/orange
  if (t.has("winter") || t.has("icy") || t.has("frost")) hue = 205; // icy blue

  return { styleBias, hue };
}

// -------- Cohesive Palette (simple, stable, regenerates) --------
function buildCohesivePalette({ vibeText, coatText, maneText }){
  const prof = vibeProfile(vibeText);

  // base hue w/ tiny variation so reseal changes palette
  let baseHue = hueWrap(prof.hue + jitter(8));

  // if user provided hexes, we still generate a cohesive set around vibe,
  // but we will *include* up to 2 user colors as-is.
  const userHexes = [...extractHexes(coatText), ...extractHexes(maneText)].slice(0, 2);

  // Analogous spread = cohesion (NOT rainbow)
  const spread = 26; // ±26°
  const sBase = clamp(52 + jitter(8), 28, 72);
  const lBase = clamp(48 + jitter(8), 28, 68);

  // Build 5 harmonious HSL swatches
  const hsl = [
    // deep shadow
    { h: hueWrap(baseHue - spread*0.55 + jitter(3)), s: clamp(sBase*0.75 + jitter(4), 18, 65), l: clamp(lBase*0.45 + jitter(4), 14, 38) },
    // base
    { h: hueWrap(baseHue + jitter(3)), s: clamp(sBase + jitter(4), 22, 75), l: clamp(lBase + jitter(4), 26, 70) },
    // mid
    { h: hueWrap(baseHue + spread*0.45 + jitter(3)), s: clamp(sBase*0.9 + jitter(4), 20, 75), l: clamp(lBase*1.05 + jitter(4), 30, 78) },
    // highlight
    { h: hueWrap(baseHue + spread*0.15 + jitter(3)), s: clamp(sBase*0.55 + jitter(4), 10, 55), l: clamp(lBase*1.55 + jitter(4), 72, 92) },
    // accent: still cohesive (slightly shifted, controlled saturation)
    { h: hueWrap(baseHue + (spread*0.95) + jitter(6)), s: clamp(sBase*0.70 + jitter(6), 18, 70), l: clamp(lBase*0.92 + jitter(6), 22, 72) }
  ];

  let palette = hsl.map(hslToHex);

  // include user hexes by swapping into base/mid slots
  if (userHexes[0]) palette[1] = userHexes[0];
  if (userHexes[1]) palette[2] = userHexes[1];

  return palette; // ["#AABBCC", ...]
}

// -------- Name / Known For / Backstory --------
const DATA = {
  classic: { first:["Sun","Moon","Star","Silver","Golden","Willow","Meadow","Cloud","Bright","Gentle","Honey","Autumn"],
             last:["Gleam","Breeze","Bloom","Song","Whisper","Dawn","Glow","Shimmer","Trail","Harmony","Mist","Quill"] },
  royal:   { first:["Auric","Regal","Noble","Velvet","Ivory","Amethyst","Sapphire","Gilded","Cerulean","Opaline","Majestic","Crown"],
             last:["Quill","Scroll","Crest","Sigil","Diadem","Chamber","Archive","Radiance","Luminance","Banner","Court","Laurel"] },
  nature:  { first:["Everfree","Thistle","Fern","Juniper","Clover","Briar","Aspen","River","Rain","Pine","Dew","Stone"],
             last:["Shade","Grove","Hollow","Branch","Brook","Glade","Wilds","Petal","Moss","Vale","Warden","Bloom"] },
  magical: { first:["Nova","Astral","Arcane","Starlit","Echo","Lunar","Solar","Mystic","Rune","Comet","Nebula","Celestial"],
             last:["Sigil","Hex","Vesper","Spiral","Glyph","Charm","Radiant","Eclipse","Aether","Mirage","Beacon","Quasar"] },
  alt:     { first:["Velvet","Neon","Indigo","Crimson","Violet","Static","Echo","Jet","Sable","Riot","Nocturne","Reverb"],
             last:["Chorus","Tempo","Rhapsody","Voltage","Vinyl","Cadence","Distortion","Crescendo","Drift","Anthem","Beat","Sparks"] }
};

const TITLES_NEUTRAL = ["Captain","Archivist","Warden","Keeper","Envoy"];
const TITLES_MARE = ["Lady","Dame","Duchess","Countess"];
const TITLES_STALLION = ["Sir","Lord","Duke","Count"];

function pickTitle(g){
  const pool = g==="mare" ? [...TITLES_MARE,...TITLES_NEUTRAL]
            : g==="stallion" ? [...TITLES_STALLION,...TITLES_NEUTRAL]
            : [...TITLES_NEUTRAL,...TITLES_MARE,...TITLES_STALLION];
  return rand(pool);
}

function pronouns(g){
  if (g === "mare") return { subj:"She", obj:"her", poss:"her", be:"is" };
  if (g === "stallion") return { subj:"He", obj:"him", poss:"his", be:"is" };
  return { subj:"They", obj:"them", poss:"their", be:"are" };
}

const TALENTS_BY_STYLE = {
  classic: ["organizing community festivals","finding the perfect words for everypony","bringing calm wherever they go","turning small kindnesses into big change"],
  royal:   ["archival work in the Royal Library","court diplomacy and elegant composure","designing banners, crests, and royal seals","solving mysteries with impeccable logic"],
  nature:  ["guiding travelers through tangled trails","growing rare blooms and herbal remedies","befriending woodland creatures instantly","restoring hidden springs and old paths"],
  magical: ["mapping constellations and ley lines","decoding ancient runes in moonlight","enchanting small objects with big purpose","protective wards cast with precision"],
  alt:     ["writing hooks that get stuck in your head","performing with fearless stage presence","mixing beats into stormy anthems","turning chaos into art on purpose"]
};

const JOBS_BY_TRIBE = {
  earth: ["orchard keeper","baker","craftsperson","festival coordinator","trail helper"],
  unicorn: ["librarian","scribe","enchanter","apothecary","research mage"],
  pegasus: ["weather captain","courier","flight instructor","storm chaser","show flier"],
  alicorn: ["royal envoy","guardian of archives","harmonic mediator","council advisor"]
};

const QUIRKS = [
  "always carries a tiny quill behind one ear",
  "names every cloud they pass",
  "hums a tune when thinking",
  "cannot resist fixing crooked picture frames",
  "keeps a pocketful of shiny pebbles for luck",
  "falls asleep mid-book—then wakes up on the exact right page"
];

function generateName({ tribe, style, withTitle, vibeText, gender }){
  const base = DATA[style] ?? DATA.classic;
  let firstPool = [...base.first];
  let lastPool = [...base.last];

  // tiny vibe nudges (simple)
  const t = new Set(tokens(vibeText));
  if (t.has("music") || t.has("dj") || t.has("band")) lastPool.push("Cadence","Chorus","Tempo");
  if (t.has("library") || t.has("librarian") || t.has("book")) lastPool.push("Quill","Archive","Scroll");
  if (t.has("witch") || t.has("magic") || t.has("arcane") || t.has("celestial")) firstPool.push("Astral","Rune","Mystic");

  let name = `${rand(firstPool)} ${rand(lastPool)}`;

  // small tribe flavor (light touch)
  const extras = tribe==="earth" ? ["Harvest","Orchard","Copper"]
               : tribe==="unicorn" ? ["Prism","Glimmer","Crystal"]
               : tribe==="pegasus" ? ["Nimbus","Sky","Gale"]
               : ["Aurora","Crownlight","Eternal"];

  if (Math.random() < 0.40) {
    const extra = rand(extras);
    name = Math.random() < 0.5 ? `${extra} ${rand(lastPool)}` : `${rand(firstPool)} ${extra}`;
  }

  if (style === "royal" && Math.random() < 0.22) {
    name = `${rand(firstPool)} of ${rand(["Canterlot","Crystal Court","Sunspire","Mooncrest","The Archive"])}`;
  }

  if (style === "alt" && Math.random() < 0.20) {
    name = `${rand(firstPool)}-${rand(lastPool)}`;
  }

  if (withTitle) name = `${pickTitle(gender)} ${name}`;
  return capWords(name);
}

function generateKnownFor({ tribe, style, vibeText, gender }){
  const p = pronouns(gender);
  const talent = rand(TALENTS_BY_STYLE[style] ?? TALENTS_BY_STYLE.classic);
  const job = rand(JOBS_BY_TRIBE[tribe] ?? ["traveler","storyteller"]);
  const quirk = rand(QUIRKS);

  return `Known for: ${p.subj.toLowerCase()} ${p.be} known for ${talent} as a ${job}, and ${quirk}.`;
}

function safeBackstory({ name, tribe, style, vibeText, gender, palette }){
  const p = pronouns(gender);
  const places = {
    classic: ["Ponyville","a cozy hillside village","a bustling market town"],
    royal: ["Canterlot","the Royal Archives","a marble-lined district near the palace"],
    nature: ["the Everfree edge","a woodland cabin","a quiet grove with ancient trees"],
    magical: ["a stargazer’s tower","an observatory","a moonlit study filled with scrolls"],
    alt: ["a Cloudsdale loft","a neon-lit venue","a hidden rehearsal hall"]
  };

  const t = new Set(tokens(vibeText));
  const goal =
    (t.has("music") || t.has("dj") || t.has("band")) ? "to write a song that calms even the wildest storms" :
    (t.has("library") || t.has("book") || t.has("librarian")) ? "to uncover a lost chapter of Equestria’s history" :
    (t.has("witch") || t.has("magic") || t.has("arcane") || t.has("celestial")) ? "to master a protective spell meant for guardians" :
    "to become a pony others can rely on";

  const challenge = rand([
    "a mix-up during a festival that nearly went off-script",
    "a sudden storm that tested every ounce of courage",
    "a mysterious riddle found in an old scroll",
    "a rivalry that turned into respect",
    "a mistake that became an important lesson"
  ]);

  const origin = rand(places[style] ?? places.classic);
  const paletteLine = `Palette: ${palette.slice(0,5).join(" ")}.`;

  const short = `${name} comes from ${origin}. After ${challenge}, ${p.subj.toLowerCase()} learned how to turn nerves into focus. Now, ${p.subj.toLowerCase()} works toward ${goal}. ${paletteLine}`;
  const medium = `${name} comes from ${origin}, where the days are busy and the nights feel full of possibility. After ${challenge}, ${p.subj.toLowerCase()} trained seriously, learning how to turn mistakes into stepping stones. Over time, ${p.subj.toLowerCase()} became known for helping others find their footing, too. Now, ${p.subj.toLowerCase()} works toward ${goal}. ${paletteLine}`;
  const long = `${name} comes from ${origin}, and the registry notes a spirit that refuses to stay ordinary. ${p.subj} wasn’t always confident, but after ${challenge}, ${p.subj.toLowerCase()} chose to keep going—learning, practicing, and growing into a special talent that finally felt like home. Along the way, ${p.subj.toLowerCase()} found allies and gained wisdom that doesn’t come from shortcuts. Now, ${p.subj.toLowerCase()} works toward ${goal}, determined to leave Equestria kinder and brighter than ${p.subj.toLowerCase()} found it. ${paletteLine}`;

  return backstoryLength.value === "short" ? short : backstoryLength.value === "long" ? long : medium;
}

// -------- Render --------
function renderPalette(palette){
  paletteGrid.innerHTML = "";
  for (const hex of palette){
    const el = document.createElement("div");
    el.className = "swatch";
    el.innerHTML = `
      <div class="swatchColor" style="background:${hex};"></div>
      <div class="swatchInfo mono">${hex}</div>
    `;
    paletteGrid.appendChild(el);
  }
}

function seal(){
  const vibeText = vibeInput.value.trim();
  const tribe = pickTribe(tribeSelect.value);
  const gender = genderSelect.value;

  const prof = vibeProfile(vibeText);
  const style = prof.styleBias || styleSelect.value;

  const palette = paletteFromVibe.checked
    ? buildCohesivePalette({ vibeText, coatText: coatColor.value, maneText: maneColors.value })
    : buildCohesivePalette({ vibeText: "", coatText: coatColor.value, maneText: maneColors.value });

  const name = generateName({ tribe, style, withTitle: titleToggle.checked, vibeText, gender });

  const tribeLabel = tribe === "earth" ? "Earth Pony" : tribe === "unicorn" ? "Unicorn" : tribe === "pegasus" ? "Pegasus" : "Alicorn";
  const genderLabel = gender === "mare" ? "Mare" : gender === "stallion" ? "Stallion" : "Prefer not to say";
  const styleLabel = style === "royal" ? "Canterlot Royal" : style === "nature" ? "Everfree / Nature" : style === "magical" ? "Arcane / Starborne" : style === "alt" ? "Alt / Music" : "Classic Equestria";

  outName.textContent = name;
  outMeta.textContent = `${tribeLabel} • ${genderLabel} • ${styleLabel} • Sealed by the Royal Registry ✦`;

  renderPalette(palette);

  if (knownForToggle.checked){
    outKnownFor.style.display = "";
    outKnownFor.textContent = generateKnownFor({ tribe, style, vibeText, gender });
  } else {
    outKnownFor.style.display = "none";
  }

  if (backstoryToggle.checked){
    outBackstoryWrap.style.display = "";
    outBackstory.textContent = safeBackstory({ name, tribe, style, vibeText, gender, palette });
  } else {
    outBackstoryWrap.style.display = "none";
  }

  outputBlock.style.display = "";
  copyAllBtn.disabled = false;
  outputBlock.scrollIntoView({ behavior:"smooth", block:"start" });
}

// -------- Events --------
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
  seal();
});

vibeExampleBtn.addEventListener("click", () => {
  vibeInput.value = "alt music baddie";
});

clearVibeBtn.addEventListener("click", () => {
  vibeInput.value = "";
});

copyAllBtn.addEventListener("click", async () => {
  const parts = [];
  parts.push(outName.textContent);
  parts.push(outMeta.textContent);

  if (paletteGrid.children.length){
    parts.push("Palette:");
    [...paletteGrid.children].forEach((c) => {
      const hex = c.querySelector(".mono")?.innerText || "";
      parts.push(`- ${hex}`);
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
