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

const NAMED_COLORS = {
  black:  { name:"Midnight Ink", hex:"#0B0E17" },
  purple: { name:"Amethyst Veil", hex:"#6B46C1" },
  violet: { name:"Violet Signal", hex:"#7C3AED" },
  crimson:{ name:"Crimson Note", hex:"#B91C1C" },
  neon:   { name:"Neon Spark", hex:"#22D3EE" },
  indigo: { name:"Indigo Velvet", hex:"#312E81" },
  silver: { name:"Silver Lining", hex:"#C7D2FE" },
  pearl:  { name:"Pearl Mist", hex:"#F1F5F9" },
  lavender:{name:"Lavender Bloom", hex:"#C4B5FD" },
  pink:   { name:"Rose Glow", hex:"#FB7185" },
  ice:    { name:"Icy Blue", hex:"#BFE3FF" },
  blue:   { name:"Canterlot Blue", hex:"#60A5FA" },
  aqua:   { name:"Seafoam Aqua", hex:"#2DD4BF" },
  gold:   { name:"Royal Gold", hex:"#F3D37A" },
  peach:  { name:"Peach Nectar", hex:"#FDBA74" },
  green:  { name:"Verdant Grove", hex:"#34D399" },
  moss:   { name:"Moss Shade", hex:"#15803D" },
  brown:  { name:"Chestnut Hearth", hex:"#A16207" }
};

function parseColorWords(freeText){
  const t = tokens(freeText);
  const found = [];
  for (const w of t){
    if (NAMED_COLORS[w]) found.push(w);
    // common synonyms
    if (w === "grey") found.push("silver");
    if (w === "gray") found.push("silver");
    if (w === "orange") found.push("peach");
  }
  return Array.from(new Set(found));
}

function buildPalette({ vibeText, coatText, maneText }){
  const profile = vibeProfile(vibeText);
  const colorsFromInputs = Array.from(new Set([
    ...parseColorWords(coatText),
    ...parseColorWords(maneText)
  ]));

  let tags = [];
  if (paletteFromVibe.checked) tags.push(...profile.paletteTags);
  tags.push(...colorsFromInputs);

  // Ensure we have enough tags
  const fallback = ["gold","lavender","silver","blue","peach"];
  if (tags.length < 3) tags.push(...fallback);

  // De-dupe, then pick first 5 with variety
  tags = Array.from(new Set(tags));

  const palette = [];
  for (const tag of tags) {
    if (NAMED_COLORS[tag]) palette.push(NAMED_COLORS[tag]);
    if (palette.length === 5) break;
  }
  while (palette.length < 5) palette.push(NAMED_COLORS[rand(fallback)]);

  return palette.slice(0,5);
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
  for (const sw of palette){
    const el = document.createElement("div");
    el.className = "swatch";
    el.innerHTML = `
      <div class="swatchColor" style="background:${sw.hex};"></div>
      <div class="swatchInfo">
        <div><strong>${sw.name}</strong></div>
        <div class="mono">${sw.hex.toUpperCase()}</div>
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
