
// background.js - Local state management without API sending

const sequenciaRoleta = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];

let sessionOrdemAtraso = [12, 24, 36];
let sessionEstados = [];
let sessionDirecao = 'horário';
let sessionLastNum = null;

// Persistence
chrome.storage.local.get(["sessionOrdemAtraso", "sessionEstados", "sessionDirecao", "lastNum"], (data) => {
  if (data.sessionOrdemAtraso) sessionOrdemAtraso = data.sessionOrdemAtraso;
  if (data.sessionEstados) sessionEstados = data.sessionEstados;
  if (data.sessionDirecao) sessionDirecao = data.sessionDirecao;
  if (data.lastNum) sessionLastNum = parseInt(data.lastNum);
  
  // Clear any old API status messages
  chrome.storage.local.set({ lastStatus: "Pronto.", lastStatusType: "" });
});

// Logic function
function calcularDistancia(numeroAnterior, numeroAtual, direcao) {
    const posAnterior = sequenciaRoleta.indexOf(numeroAnterior);
    const posAtual = sequenciaRoleta.indexOf(numeroAtual);
    if (posAnterior === -1 || posAtual === -1) return 36;
    let distancia;
    if (direcao === 'horário') {
        distancia = posAtual >= posAnterior ? posAtual - posAnterior : (37 - posAnterior) + posAtual;
    } else {
        distancia = posAnterior >= posAtual ? posAnterior - posAtual : posAnterior + (37 - posAtual);
    }
    if (distancia <= 12) return 12;
    if (distancia <= 24) return 24;
    return 36;
}

// Receive numbers from content script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "NUMBERS_UPDATE") {
    handleNumbersUpdate(msg.numbers);
    sendResponse({ ok: true });
    return false;
  }

  if (msg.type === "GET_STATUS") {
    chrome.storage.local.get(["lastStatus", "lastStatusType", "lastNumbers", "running", "sessionEstados", "sessionDirecao", "sessionOrdemAtraso"], (data) => {
      sendResponse({
        status: data.lastStatus || "",
        statusType: data.lastStatusType || "",
        numbers: data.lastNumbers || [],
        running: !!data.running,
        sessionEstados: data.sessionEstados || [],
        sessionDirecao: data.sessionDirecao || 'horário',
        sessionOrdemAtraso: data.sessionOrdemAtraso || [12, 24, 36]
      });
    });
    return true;
  }

  if (msg.type === "START") {
    chrome.storage.local.set({ running: true }, () => {
      setStatus("Monitoramento ativo.", "ok");
      sendResponse({ running: true });
    });
    return true;
  }

  if (msg.type === "STOP") {
    chrome.storage.local.set({ running: false }, () => {
      setStatus("Pausado.", "");
      sendResponse({ running: false });
    });
    return true;
  }
});

async function handleNumbersUpdate(numbers) {
  try {
    const data = await chrome.storage.local.get(["running"]);
    if (!data.running) return;

    await chrome.storage.local.set({ lastNumbers: numbers });

    const current = numbers.find((n) => !n.disabled) || numbers[0];
    if (!current || !current.value) return;

    const currentVal = parseInt(current.value);
    const isNewNumber = currentVal !== sessionLastNum;

    if (isNewNumber) {
      if (sessionLastNum !== null) {
        const dist = calcularDistancia(sessionLastNum, currentVal, sessionDirecao);
        let estado;
        if (dist === sessionOrdemAtraso[0]) {
          estado = 'repeticao';
        } else if (dist === sessionOrdemAtraso[2]) {
          estado = 'atrasado';
          sessionOrdemAtraso = [dist, sessionOrdemAtraso[0], sessionOrdemAtraso[1]];
        } else {
          estado = 'intermediario';
          sessionOrdemAtraso = [dist, sessionOrdemAtraso[0], sessionOrdemAtraso[2]];
        }
        sessionEstados.push(estado);
        sessionDirecao = (sessionDirecao === 'horário') ? 'anti-horário' : 'horário';
      }
      sessionLastNum = currentVal;
      
      setStatus(`Último número: ${currentVal}`, "ok");
    }

    await chrome.storage.local.set({ 
      lastNumbers: numbers,
      sessionEstados: sessionEstados,
      sessionDirecao: sessionDirecao,
      sessionOrdemAtraso: sessionOrdemAtraso,
      lastNum: sessionLastNum
    });

  } catch (err) {
    console.error("handleNumbersUpdate error:", err);
  }
}

function setStatus(msg, type) {
  chrome.storage.local.set({ lastStatus: msg, lastStatusType: type || "" });
}
