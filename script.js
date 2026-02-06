// EquestriaNames.com — expandable generator
const beginBtn = document.querySelector("#beginBtn");
const heroCard = document.querySelector(".hero-card");

if (beginBtn && heroCard) {
  beginBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Tiny ceremonial "seal" moment
    heroCard.classList.add("activated");
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Then proceed to ceremony page
    setTimeout(() => {
      window.location.href = beginBtn.getAttribute("href");
    }, 650);
  });
}
const $ = (sel) => document.querySelector(sel);

const tribeSelect = $("#tribeSelect");
const styleSelect = $("#styleSelect");
const genderSelect = $("#genderSelect");
const coatColorInput = $("#coatColor");
const maneColorsInput = $("#maneColors");
const titleToggle = $("#titleToggle");

const generateBtn = $("#generateBtn");
const resetBtn = $("#resetBtn");
const surpriseBtn = $("#surpriseBtn");

const resultCard = $("#resultCard");
const copyBtn = $("#copyBtn");
const againBtn = $("#againBtn");

const pillTribe = $("#pillTribe");
const pillStyle = $("#pillStyle");

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const capWords = (s) => s.replace(/\b\w/g, (m) => m.toUpperCase()).replace(/\s+/g, " ").trim();

const TITLES_NEUTRAL = ["Captain", "Archivist", "Warden", "Keeper", "Envoy"];
const TITLES_MARE = ["Lady", "Dame", "Duchess", "Countess"];
const TITLES_STALLION = ["Sir", "Lord", "Duke", "Count"];

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
  earth:   { extras: ["Harvest", "Saddle", "Field", "Prairie", "Orchard", "Copper", "Barn"] },
  unicorn: { extras: ["Arc", "Prism", "Focus", "Spell", "Ward", "Crystal", "Glimmer"] },
  pegasus: { extras: ["Sky", "Gale", "Jetstream", "Nimbus", "Soar", "Cloudbank", "Wing"] },
  alicorn: { extras: ["Eternal", "Aurora", "Empyrean", "Covenant", "Ascendant", "Crownlight"] }
};

// Simple color-to-Equestria lexicon (you can expand this forever)
const COLOR_WORDS = {
  red: ["Crimson", "Scarlet", "Ruby"],
  blue: ["Azure", "Cerulean", "Sapphire"],
  purple: ["Amethyst", "Violet", "Lilac"],
  pink: ["Rose", "Blush", "Peony"],
  orange: ["Ember", "Sunset", "Clementine"],
  yellow: ["Golden", "Honey", "Marigold"],
  green: ["Verdant", "Willow", "Jade"],
  black: ["Midnight", "Sable", "Onyx"],
  white: ["Ivory", "Pearl", "Snow"],
  gray: ["Silver", "Ashen", "Mist"],
  grey: ["Silver", "Ashen", "Mist"],
  brown: ["Copper", "Chestnut", "Cocoa"],
  tan: ["Sandstone", "Fawn", "Wheat"],
  peach: ["Peach", "Apricot", "Nectar"],
  gold: ["Gilded", "Auric", "Crown"],
  silver: ["Silver", "Sterling", "Moonlit"]
};

const COLOR_MOTIFS = {
  red: ["Flare", "Blaze", "Ember"],
  blue: ["Tide", "Breeze", "Sky"],
  purple: ["Glimmer", "Vesper", "Veil"],
  pink: ["Bloom", "Song", "Charm"],
  orange: ["Glow", "Dawn", "Spark"],
  yellow: ["Radiance", "Dawn", "Halo"],
  green: ["Grove", "Leaf", "Vale"],
  black: ["Eclipse", "Shade", "Nocturne"],
  white: ["Lumen", "Dawn", "Shimmer"],
  gray: ["Mist", "Quill", "Drift"],
  grey: ["Mist", "Quill", "Drift"],
  brown: ["Grove", "Trail", "Hearth"],
  peach: ["Bloom", "Dawn", "Glow"],
  gold: ["Crest", "Radiance", "Court"],
  silver: ["Gleam", "Quill", "Mist"]
};

function pickTribe(value) {
  if (value !== "random") return value;
  return rand(["earth","unicorn","pegasus","alicorn"]);
}

function normalizeColorTokens(str) {
  if (!str) return [];
  // split by commas or "and" and spaces, keep small set of tokens
  return str
    .toLowerCase()
    .replace(/&/g, " and ")
    .split(/,|and|\//)
    .map(s => s.trim())
    .filter(Boolean)
    .flatMap(s => s.split(/\s+/))
    .map(t => t.replace(/[^a-z]/g, ""))
    .filter(Boolean);
}

function getColorBoosts(coatRaw, maneRaw) {
  const tokens = [...normalizeColorTokens(coatRaw), ...normalizeColorTokens(maneRaw)];
  const keys = new Set(tokens.filter(t => COLOR_WORDS[t] || COLOR_MOTIFS[t]));
  return Array.from(keys);
}

function pickTitle(gender) {
  const pool =
    gender === "mare" ? [...TITLES_MARE, ...TITLES_NEUTRAL] :
    gender === "stallion" ? [...TITLES_STALLION, ...TITLES_NEUTRAL] :
    [...TITLES_NEUTRAL, ...TITLES_MARE, ...TITLES_STALLION];
  return rand(pool);
}

function generateName({ tribe, style, withTitle, gender, coatColor, maneColors }) {
  const base = DATA[style] ?? DATA.classic;

  // Build weighted pools (simple: just add extra options)
  const colorKeys = getColorBoosts(coatColor, maneColors);

  let firstPool = [...base.first];
  let lastPool = [...base.last];

  // If user gives colors, bias toward matching lexicon
  if (colorKeys.length) {
    for (const k of colorKeys) {
      if (COLOR_WORDS[k]) firstPool.push(...COLOR_WORDS[k]);
      if (COLOR_MOTIFS[k]) lastPool.push(...COLOR_MOTIFS[k]);
    }
  }

  const makeTwo = () => `${rand(firstPool)} ${rand(lastPool)}`;
  let name = makeTwo();

  // Tribe accent
  if (Math.random() < 0.45 && TRIBE_FLAVOR[tribe]) {
    const extra = rand(TRIBE_FLAVOR[tribe].extras);
    if (Math.random() < 0.5) name = `${extra} ${rand(lastPool)}`;
    else name = `${rand(firstPool)} ${extra}`;
  }

  // Royal flourish
  if (style === "royal" && Math.random() < 0.25) {
    name = `${rand(firstPool)} of ${rand(["Canterlot","Crystal Court","Sunspire","Mooncrest","The Archive","The High Hall"])}`;
  }

  // Alt hyphenation
  if (style === "alt" && Math.random() < 0.22) {
    name = `${rand(firstPool)}-${rand(lastPool)}`;
  }

  // Optional title (gender-aware)
  if (withTitle) {
    const t = pickTitle(gender);
    name = `${t} ${name}`;
  }

  return capWords(name);
}

function updatePills(tribe, style) {
  const tribeLabel =
    tribe === "earth" ? "Earth Pony" :
    tribe === "unicorn" ? "Unicorn" :
    tribe === "pegasus" ? "Pegasus" :
    tribe === "alicorn" ? "Alicorn" : "—";

  const styleLabel =
    style === "classic" ? "Classic Equestria" :
    style === "royal" ? "Canterlot Royal" :
    style === "nature" ? "Everfree / Nature" :
    style === "magical" ? "Arcane / Starborne" :
    style === "alt" ? "Alt / Music" : "—";

  pillTribe.textContent = `Tribe: ${tribeLabel}`;
  pillStyle.textContent = `Style: ${styleLabel}`;
}

function renderResult({ name, tribe, style, gender, coatColor, maneColors }) {
  const genderLabel =
    gender === "mare" ? "Mare" :
    gender === "stallion" ? "Stallion" : "Prefer not to say";

  const extras = [];
  if (coatColor?.trim()) extras.push(`Coat: ${coatColor.trim()}`);
  if (maneColors?.trim()) extras.push(`Mane: ${maneColors.trim()}`);

  resultCard.innerHTML = `
    <div>
      <p class="result-name">${name}</p>
      <p class="result-sub">
        ${genderLabel}${extras.length ? ` • ${extras.join(" • ")}` : ""}<br/>
        Sealed by the Royal Registry ✦
      </p>
    </div>
  `;

  updatePills(tribe, style);
  copyBtn.disabled = false;
  againBtn.disabled = false;
}

function doGenerate(overrides = {}) {
  const tribe = pickTribe(overrides.tribe ?? tribeSelect.value);
  const style = overrides.style ?? styleSelect.value;

  const gender = overrides.gender ?? (genderSelect?.value || "unspecified");
  const coatColor = overrides.coatColor ?? (coatColorInput?.value || "");
  const maneColors = overrides.maneColors ?? (maneColorsInput?.value || "");

  const withTitle = overrides.withTitle ?? titleToggle.checked;

  const name = generateName({ tribe, style, withTitle, gender, coatColor, maneColors });
  renderResult({ name, tribe, style, gender, coatColor, maneColors });
}

generateBtn.addEventListener("click", () => doGenerate());
againBtn.addEventListener("click", () => doGenerate());

surpriseBtn.addEventListener("click", () => {
  const tribe = "random";
  const style = rand(["classic","royal","nature","magical","alt"]);
  const withTitle = Math.random() < 0.35;

  tribeSelect.value = "random";
  styleSelect.value = style;
  titleToggle.checked = withTitle;

  if (genderSelect) genderSelect.value = "unspecified";
  if (coatColorInput) coatColorInput.value = "";
  if (maneColorsInput) maneColorsInput.value = "";

  doGenerate({ tribe, style, withTitle });
});

resetBtn.addEventListener("click", () => {
  tribeSelect.value = "random";
  styleSelect.value = "classic";
  titleToggle.checked = false;

  if (genderSelect) genderSelect.value = "unspecified";
  if (coatColorInput) coatColorInput.value = "";
  if (maneColorsInput) maneColorsInput.value = "";

  resultCard.innerHTML = `<p class="result-placeholder">Your name will appear here…</p>`;
  pillTribe.textContent = "Tribe: —";
  pillStyle.textContent = "Style: —";
  copyBtn.disabled = true;
  againBtn.disabled = true;
});

copyBtn.addEventListener("click", async () => {
  // Copy only the name (first line)
  const name = (resultCard.querySelector(".result-name")?.innerText || "").trim();
  if (!name) return;

  try {
    await navigator.clipboard.writeText(name);
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy"), 900);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = name;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy"), 900);
  }
});

// First-load example
doGenerate({ tribe: "random", style: "royal", withTitle: false });
