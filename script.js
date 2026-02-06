// EquestriaNames.com — simple, expandable generator

const $ = (sel) => document.querySelector(sel);

const tribeSelect = $("#tribeSelect");
const styleSelect = $("#styleSelect");
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
const capWords = (s) => s.replace(/\b\w/g, (m) => m.toUpperCase());

const TITLES = ["Lady", "Lord", "Sir", "Dame", "Captain", "Archivist", "Warden", "Duchess", "Duke"];

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

function pickTribe(value) {
  if (value !== "random") return value;
  return rand(["earth","unicorn","pegasus","alicorn"]);
}

function generateName({ tribe, style, withTitle }) {
  const base = DATA[style] ?? DATA.classic;

  // Two-word name by default, with occasional single-word or three-part flair
  const makeTwo = () => `${rand(base.first)} ${rand(base.last)}`;

  let name = makeTwo();

  // Tribe accent: sometimes swap in a tribe-flavor word
  if (Math.random() < 0.45 && TRIBE_FLAVOR[tribe]) {
    const extra = rand(TRIBE_FLAVOR[tribe].extras);
    // Replace either first or last with a tribe-flavored word
    if (Math.random() < 0.5) name = `${extra} ${rand(base.last)}`;
    else name = `${rand(base.first)} ${extra}`;
  }

  // Royal style leans more "proper"
  if (style === "royal" && Math.random() < 0.25) {
    name = `${rand(base.first)} of ${rand(["Canterlot","Crystal Court","Sunspire","Mooncrest","The Archive","The High Hall"])}`;
  }

  // Alt style sometimes hyphenates
  if (style === "alt" && Math.random() < 0.22) {
    const a = rand(base.first);
    const b = rand(base.last);
    name = `${a}-${b}`;
  }

  // Optional title
  if (withTitle) {
    const t = rand(TITLES);
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

function renderResult(name, tribe, style) {
  resultCard.innerHTML = `
    <div>
      <p class="result-name">${name}</p>
      <p class="result-sub">Sealed by the Royal Registry ✦</p>
    </div>
  `;
  updatePills(tribe, style);
  copyBtn.disabled = false;
  againBtn.disabled = false;
}

function doGenerate(overrides = {}) {
  const tribe = pickTribe(overrides.tribe ?? tribeSelect.value);
  const style = overrides.style ?? styleSelect.value;
  const withTitle = overrides.withTitle ?? titleToggle.checked;

  const name = generateName({ tribe, style, withTitle });
  renderResult(name, tribe, style);
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
  doGenerate({ tribe, style, withTitle });
});

resetBtn.addEventListener("click", () => {
  tribeSelect.value = "random";
  styleSelect.value = "classic";
  titleToggle.checked = false;

  resultCard.innerHTML = `<p class="result-placeholder">Your name will appear here…</p>`;
  pillTribe.textContent = "Tribe: —";
  pillStyle.textContent = "Style: —";
  copyBtn.disabled = true;
  againBtn.disabled = true;
});

copyBtn.addEventListener("click", async () => {
  const text = resultCard.innerText.replace(/\s+Sealed by.*$/m, "").trim();
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy"), 900);
  } catch {
    // fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy"), 900);
  }
});

// First-load: show a tasteful example
doGenerate({ tribe: "random", style: "royal", withTitle: false });
