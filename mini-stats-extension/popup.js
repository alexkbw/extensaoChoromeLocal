const numbersEl = document.getElementById("numbers");
const statusEl = document.getElementById("status");
const roomInput = document.getElementById("room");
const toggleBtn = document.getElementById("toggleBtn");

let running = false;
let pollTimer;

// ── Init: load saved state ──────────────────────────────────
chrome.storage.local.get(["room", "running"], (data) => {
  if (data.room) roomInput.value = data.room;
  running = !!data.running;
  updateButton();
  refreshFromBackground();
});

// ── Room input ──────────────────────────────────────────────
roomInput.addEventListener("input", () => {
  const value = roomInput.value.trim();
  chrome.storage.local.set({ room: value });
  chrome.runtime.sendMessage({ type: "ROOM_CHANGED" });
});

// ── Toggle Start / Stop ─────────────────────────────────────
toggleBtn.addEventListener("click", () => {
  if (running) {
    chrome.runtime.sendMessage({ type: "STOP" }, (resp) => {
      running = false;
      updateButton();
      setStatus("Parado.", "");
    });
  } else {
    const room = roomInput.value.trim();
    if (!room) {
      setStatus("Preencha a sala ou IP antes de iniciar.", "error");
      return;
    }
    chrome.runtime.sendMessage({ type: "START" }, (resp) => {
      running = true;
      updateButton();
      if (resp?.numbers) renderNumbers(resp.numbers);
      if (resp?.status) setStatus(resp.status, "ok");
    });
  }
});

// ── Poll background for updates while popup is open ─────────
pollTimer = setInterval(refreshFromBackground, 2000);

window.addEventListener("unload", () => {
  if (pollTimer) clearInterval(pollTimer);
});

function refreshFromBackground() {
  chrome.runtime.sendMessage({ type: "GET_STATUS" }, (resp) => {
    if (chrome.runtime.lastError) return;
    if (!resp) return;
    running = resp.running;
    updateButton();
    renderNumbers(resp.numbers || []);
    if (resp.status) setStatus(resp.status, resp.statusType);
  });
}

// ── UI helpers ──────────────────────────────────────────────
function updateButton() {
  toggleBtn.textContent = running ? "Parar" : "Iniciar";
  toggleBtn.className = `toggle-btn ${running ? "running" : "stopped"}`;
}

const setStatus = (msg, type = "") => {
  statusEl.textContent = msg || "";
  statusEl.className = `status ${type}`.trim();
};

const renderNumbers = (list = []) => {
  numbersEl.innerHTML = "";
  if (!list.length) {
    numbersEl.textContent = "Nada encontrado.";
    return;
  }

  list.forEach((item, idx) => {
    const span = document.createElement("span");
    span.className = ["number", item.color || "", item.disabled ? "disabled" : "", idx === 0 ? "highlight" : ""]
      .filter(Boolean)
      .join(" ");
    span.textContent = item.value;
    numbersEl.appendChild(span);
  });
};
