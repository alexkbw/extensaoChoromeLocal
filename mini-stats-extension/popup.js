const numbersEl = document.getElementById("numbers");
const statusEl = document.getElementById("status");
const toggleBtn = document.getElementById("toggleBtn");

let running = false;
let pollTimer;

// ── Init: load saved state ──────────────────────────────────
chrome.storage.local.get(["running"], (data) => {
  running = !!data.running;
  updateButton();
  refreshFromBackground();
});

// ── Toggle Start / Stop ─────────────────────────────────────
toggleBtn.addEventListener("click", () => {
  if (running) {
    chrome.runtime.sendMessage({ type: "STOP" }, (resp) => {
      running = false;
      updateButton();
    });
  } else {
    chrome.runtime.sendMessage({ type: "START" }, (resp) => {
      running = true;
      updateButton();
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
    renderNumbers(resp.numbers || [], resp.sessionEstados || [], resp.sessionOrdemAtraso || [12, 24, 36], resp.sessionDirecao || 'horário');
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

const renderNumbers = (list = [], estados = [], ordemAtraso = [12, 24, 36], direcao = 'horário') => {
  numbersEl.innerHTML = "";
  if (!list.length) {
    numbersEl.textContent = "Nada encontrado.";
    return;
  }

  // Detect suggestion based on background data
  const ultimoNumeroVal = parseInt(list[0].value);
  const sugestao = detectarSugestao(estados, ordemAtraso, direcao, ultimoNumeroVal);

  // states is [S12, S23, S34, S45] (oldest to newest)
  const revStates = [...estados].reverse(); // [S45, S34, S23, S12]

  list.forEach((item, idx) => {
    const container = document.createElement("div");
    container.className = "number-wrapper";

    const span = document.createElement("span");
    span.className = ["number", item.color || "", item.disabled ? "disabled" : "", idx === 0 ? "highlight" : ""]
      .filter(Boolean)
      .join(" ");
    span.textContent = item.value;
    
    container.appendChild(span);

    // Add state label if available
    const stateLabel = revStates[idx];
    if (stateLabel) {
      const label = document.createElement("div");
      label.className = `state-label state-${stateLabel}`;
      label.textContent = stateLabel.substring(0, 3).toUpperCase();
      container.appendChild(label);
    }

    numbersEl.appendChild(container);
  });

  updateStatesSummary(estados, ordemAtraso, direcao, list);
  updateAnalysisDisplay(sugestao);
};

function updateStatesSummary(estados, ordemAtraso, direcao, lastNumbers) {
  if (!lastNumbers || lastNumbers.length === 0) return;
  
  const ultimoNum = parseInt(lastNumbers[0].value);
  if (isNaN(ultimoNum)) return;

  // ordemAtraso[0] is Rep, [1] is Int, [2] is Atr
  const numRep = encontrarNumeroCentralDistancia(ordemAtraso[0], direcao, ultimoNum);
  const numInt = encontrarNumeroCentralDistancia(ordemAtraso[1], direcao, ultimoNum);
  const numAtr = encontrarNumeroCentralDistancia(ordemAtraso[2], direcao, ultimoNum);

  document.getElementById("rep-count").textContent = numRep;
  document.getElementById("int-count").textContent = numInt;
  document.getElementById("atr-count").textContent = numAtr;
}

function updateAnalysisDisplay(sugestao) {
  const container = document.getElementById("sugestao-container");
  if (sugestao) {
    container.style.display = "block";
    document.getElementById("sugestao-tipo").textContent = sugestao.tipo;
    
    const numsEl = document.getElementById("sugestao-numeros");
    numsEl.innerHTML = "";
    
    const numeroCentral = encontrarNumeroCentralDistancia(sugestao.distancia, sugestao.direcao, sugestao.ultimoNumero);
    const vizinhos = obterVizinhos(numeroCentral, 13);
    
    const ultimoNumInserido = String(sugestao.ultimoNumero);
    const relacionadosStr = dadosJogadas[ultimoNumInserido] || "";
    const relacionados = relacionadosStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));

    vizinhos.forEach(num => {
      const span = document.createElement("span");
      span.className = "numero-vizinho";
      if (num === numeroCentral) span.classList.add("numero-central");
      if (relacionados.includes(num)) span.classList.add("borda-amarela");
      span.textContent = num;
      numsEl.appendChild(span);
    });
  } else {
    container.style.display = "none";
  }
}

// Remove old updateGroups and updateAnalysis functions if they were here
