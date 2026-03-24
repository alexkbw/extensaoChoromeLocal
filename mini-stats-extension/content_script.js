// content_script.js — Runs inside the target page, detects number changes instantly
// Supports two site layouts:
//   1) .mini-statistics-number  (original)
//   2) [data-testid="single-result"]  (new site)

const MAX_NUMBERS = 7;

let lastSignature = "";
let observerStarted = false;

// ── Selectors for each site ────────────────────────────────
const SELECTORS = [
  {
    query: ".mini-statistics-number",
    mapEl: (el) => ({
      value: el.textContent.trim(),
      color: el.classList.contains("red")
        ? "red"
        : el.classList.contains("black")
          ? "black"
          : "",
      disabled: el.classList.contains("disabled"),
    }),
  },
  {
    query: '[data-testid="single-result"]',
    mapEl: (el) => ({
      value: el.textContent.trim(),
      // sP_sU = red, sP_sS = black, sP_sT = green (zero)
      color: el.classList.contains("sP_sU")
        ? "red"
        : el.classList.contains("sP_sS")
          ? "black"
          : el.classList.contains("sP_sT")
            ? "green"
            : "",
      disabled: false,
    }),
  },
];

function scrapeNumbers() {
  for (const sel of SELECTORS) {
    const nodes = document.querySelectorAll(sel.query);
    if (nodes.length) {
      return Array.from(nodes)
        .slice(0, MAX_NUMBERS)
        .map(sel.mapEl);
    }
  }
  return null;
}

function checkAndSend() {
  const numbers = scrapeNumbers();
  if (!numbers || !numbers.length) return;

  const signature = numbers.map((n) => n.value).join(",");
  if (signature === lastSignature) return;

  lastSignature = signature;

  chrome.runtime.sendMessage({ type: "NUMBERS_UPDATE", numbers }, () => {
    if (chrome.runtime.lastError) {
      // background might not be ready yet, ignore
    }
  });
}

function findContainer() {
  for (const sel of SELECTORS) {
    const el = document.querySelector(sel.query);
    if (el) return el.parentElement || document.body;
  }
  return null;
}

function startObserver() {
  if (observerStarted) return;

  const target = findContainer();
  if (!target) return;

  const observer = new MutationObserver(() => {
    checkAndSend();
  });

  observer.observe(target, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  observerStarted = true;
  checkAndSend();
}

function tryStart() {
  const container = findContainer();
  if (container) {
    startObserver();
    return true;
  }
  return false;
}

// Try to start immediately if elements exist
if (!tryStart()) {
  const waitTimer = setInterval(() => {
    if (tryStart()) {
      clearInterval(waitTimer);
    }
  }, 2000);

  setTimeout(() => clearInterval(waitTimer), 5 * 60 * 1000);
}

// Fallback periodic check
setInterval(checkAndSend, 3000);
