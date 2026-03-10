// Cation knowledge base with qualitative test patterns.
// This is simplified and meant for educational / guidance use.

const CATIONS = [
  {
    id: "Na+",
    name: "Sodium, Na⁺",
    group: "Alkali metal",
    patterns: {
      flameColor: ["yellow"],
      solutionColor: ["colorless"],
      naohPrecip: ["no-precip"],
      nh3Precip: ["no-precip"],
    },
  },
  {
    id: "K+",
    name: "Potassium, K⁺",
    group: "Alkali metal",
    patterns: {
      flameColor: ["lilac"],
      solutionColor: ["colorless"],
      naohPrecip: ["no-precip"],
    },
  },
  {
    id: "Ca2+",
    name: "Calcium, Ca²⁺",
    group: "Alkaline earth metal",
    patterns: {
      flameColor: ["brick-red"],
      naohPrecip: ["white"],
      naohExcess: ["insoluble"],
    },
  },
  {
    id: "Ba2+",
    name: "Barium, Ba²⁺",
    group: "Alkaline earth metal",
    patterns: {
      flameColor: ["apple-green"],
      naohPrecip: ["white"],
    },
  },
  {
    id: "Cu2+",
    name: "Copper(II), Cu²⁺",
    group: "Transition metal",
    patterns: {
      solutionColor: ["blue"],
      flameColor: ["blue-green"],
      naohPrecip: ["blue"],
      naohExcess: ["insoluble"],
      nh3Precip: ["blue"],
      nh3Excess: ["soluble-deep-blue"],
      sulfideTest: ["black"],
    },
  },
  {
    id: "Fe2+",
    name: "Iron(II), Fe²⁺",
    group: "Transition metal",
    patterns: {
      solutionColor: ["pale-green", "green"],
      naohPrecip: ["green"],
      naohExcess: ["insoluble"],
      nh3Precip: ["green"],
      nh3Excess: ["insoluble"],
      sulfideTest: ["black"],
    },
  },
  {
    id: "Fe3+",
    name: "Iron(III), Fe³⁺",
    group: "Transition metal",
    patterns: {
      solutionColor: ["yellow", "brown"],
      naohPrecip: ["brown"],
      naohExcess: ["insoluble"],
      nh3Precip: ["brown"],
      nh3Excess: ["insoluble"],
      sulfideTest: ["brown"],
    },
  },
  {
    id: "Zn2+",
    name: "Zinc, Zn²⁺",
    group: "Transition / amphoteric",
    patterns: {
      solutionColor: ["colorless"],
      naohPrecip: ["white"],
      naohExcess: ["soluble"],
      nh3Precip: ["white"],
      nh3Excess: ["soluble-colorless"],
      sulfideTest: ["white", "no-precip"],
    },
  },
  {
    id: "Al3+",
    name: "Aluminium, Al³⁺",
    group: "Amphoteric",
    patterns: {
      solutionColor: ["colorless"],
      naohPrecip: ["gelatinous-white", "white"],
      naohExcess: ["soluble"],
      nh3Precip: ["white"],
      nh3Excess: ["insoluble"],
    },
  },
  {
    id: "NH4+",
    name: "Ammonium, NH₄⁺",
    group: "Volatile cation",
    patterns: {
      solutionColor: ["colorless"],
      naohPrecip: ["no-precip"],
      // In practice identified by ammonia on warming with alkali.
    },
  },
];

function getObservations() {
  const fields = [
    "solutionColor",
    "flameColor",
    "naohPrecip",
    "naohExcess",
    "nh3Precip",
    "nh3Excess",
    "sulfideTest",
    "carbonateHcl",
  ];

  const obs = {};
  for (const field of fields) {
    const el = document.getElementById(field);
    if (!el) continue;
    const v = el.value.trim();
    obs[field] = v === "" ? null : v;
  }
  return obs;
}

function scoreCation(cation, observations) {
  const patterns = cation.patterns || {};
  let matches = 0;
  let total = 0;
  const matchedDetails = [];

  for (const [test, expectedValues] of Object.entries(patterns)) {
    const observed = observations[test];
    if (observed == null) continue; // test not performed
    total += 1;
    if (expectedValues.includes(observed)) {
      matches += 1;
      matchedDetails.push({ test, observed });
    }
  }

  if (total === 0) {
    return { score: 0, matches: 0, total: 0, matchedDetails: [] };
  }

  return {
    score: matches / total,
    matches,
    total,
    matchedDetails,
  };
}

function identifyCations(observations) {
  const results = CATIONS.map((cation) => {
    const scoring = scoreCation(cation, observations);
    return {
      cation,
      ...scoring,
    };
  });

  // Filter out zero-score entries
  const nonZero = results.filter((r) => r.score > 0);
  if (nonZero.length === 0) {
    return [];
  }

  // Sort by score descending, then number of matches, then name
  nonZero.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.matches !== a.matches) return b.matches - a.matches;
    return a.cation.name.localeCompare(b.cation.name);
  });

  // Return top 3 candidates
  return nonZero.slice(0, 3);
}

function renderResults(candidates, observations) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  const anyObservation = Object.values(observations).some((v) => v !== null);
  if (!anyObservation) {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = "Please select at least one observed test result.";
    container.appendChild(p);
    return;
  }

  if (!candidates || candidates.length === 0) {
    const p = document.createElement("p");
    p.className = "no-match";
    p.textContent =
      "No strong match found for the given pattern. Check the observations or perform additional confirmatory tests.";
    container.appendChild(p);
    return;
  }

  const intro = document.createElement("p");
  intro.className = "muted";
  intro.textContent =
    "These are the most compatible cations based on the qualitative test pattern. Always confirm using your full analytical scheme.";
  container.appendChild(intro);

  candidates.forEach((entry, index) => {
    const { cation, score, matches, total, matchedDetails } = entry;
    const card = document.createElement("div");
    card.className = "result-summary";

    const heading = document.createElement("div");
    const label = index === 0 ? "Most likely" : "Alternative";
    const confidence = Math.round(score * 100);
    heading.innerHTML = `<strong>${label}: ${cation.name}</strong>`;

    const badge = document.createElement("span");
    badge.className = "confidence-badge";
    const dot = document.createElement("span");
    dot.className = "dot";
    badge.appendChild(dot);
    const badgeText = document.createTextNode(
      `Approx. match: ${confidence}% (${matches} / ${total} tests considered)`
    );
    badge.appendChild(badgeText);

    heading.appendChild(document.createTextNode(" "));
    heading.appendChild(badge);
    card.appendChild(heading);

    const group = document.createElement("div");
    group.className = "chip-row";
    const chip1 = document.createElement("span");
    chip1.className = "chip";
    chip1.textContent = cation.group;
    group.appendChild(chip1);
    card.appendChild(group);

    if (matchedDetails.length > 0) {
      const ul = document.createElement("ul");
      ul.className = "reasoning-list";
      ul.innerHTML = matchedDetails
        .map((m) => `<li>Observed <strong>${formatTestName(m.test)}</strong> consistent with this cation.</li>`)
        .join("");
      card.appendChild(ul);
    }

    container.appendChild(card);
  });
}

function formatTestName(testKey) {
  const map = {
    solutionColor: "solution color",
    flameColor: "flame test color",
    naohPrecip: "NaOH (few drops)",
    naohExcess: "NaOH (excess)",
    nh3Precip: "aqueous NH₃ (few drops)",
    nh3Excess: "aqueous NH₃ (excess)",
    sulfideTest: "H₂S / sulfide test",
    carbonateHcl: "carbonate + dilute HCl",
  };
  return map[testKey] || testKey;
}

function setup() {
  const btn = document.getElementById("identifyBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const observations = getObservations();
    const candidates = identifyCations(observations);
    renderResults(candidates, observations);
  });
}

document.addEventListener("DOMContentLoaded", setup);

