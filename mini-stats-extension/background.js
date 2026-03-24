// background.js - receives numbers from content_script and sends to API

const SUPABASE_API_BASE = "https://mehdmjsbnemmmpkstukp.supabase.co/functions/v1/add-number";
const IP_DEFAULT_PORT = 3000;
const IP_DEFAULT_ORIGIN = "app-externo";
const IP_DEFAULT_TOKEN = "96873496";

let sending = false;

// Receive numbers from content script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "NUMBERS_UPDATE") {
    handleNumbersUpdate(msg.numbers);
    sendResponse({ ok: true });
    return false;
  }

  if (msg.type === "GET_STATUS") {
    chrome.storage.local.get(["lastStatus", "lastStatusType", "lastNumbers", "running"], (data) => {
      sendResponse({
        status: data.lastStatus || "",
        statusType: data.lastStatusType || "",
        numbers: data.lastNumbers || [],
        running: !!data.running,
      });
    });
    return true;
  }

  if (msg.type === "START") {
    chrome.storage.local.set({ running: true }, () => {
      setStatus("Iniciado. Aguardando numeros...", "ok");
      sendResponse({ running: true });
    });
    return true;
  }

  if (msg.type === "STOP") {
    chrome.storage.local.set({ running: false }, () => {
      setStatus("Parado.", "");
      sendResponse({ running: false });
    });
    return true;
  }

  if (msg.type === "ROOM_CHANGED") {
    chrome.storage.local.set({ lastSig: "", lastNum: "" });
    sendResponse({ ok: true });
    return false;
  }
});

async function handleNumbersUpdate(numbers) {
  try {
    const data = await chrome.storage.local.get(["room", "running", "lastSig", "lastNum"]);

    if (!data.running) return;

    // Save numbers for popup display
    await chrome.storage.local.set({ lastNumbers: numbers });

    const room = (data.room || "").trim();
    if (!room) {
      setStatus("Sala nao configurada.", "");
      return;
    }

    if (!numbers || !numbers.length) {
      setStatus("0 itens encontrados.", "");
      return;
    }

    const current = numbers.find((n) => !n.disabled) || numbers[0];
    if (!current || !current.value) return;

    // Dedup
    if (current.value === data.lastNum) return;

    const signature = numbers.map((n) => n.value).join(",");
    if (signature === data.lastSig) return;

    if (sending) return;
    sending = true;

    try {
      const target = parseSalaTarget(room);
      await sendNumber(target, current.value);
      await chrome.storage.local.set({ lastSig: signature, lastNum: current.value });
    } finally {
      sending = false;
    }
  } catch (err) {
    console.error("handleNumbersUpdate error:", err);
    setStatus("Erro: " + err.message, "error");
  }
}

function parseSalaTarget(rawSala) {
  const sala = (rawSala || "").trim();
  const [addressPart, ...tokenParts] = sala.split("|");
  const address = (addressPart || "").trim();
  const token = tokenParts.join("|").trim();

  const parsedAddress = parseIpAddress(address);
  if (!parsedAddress) {
    return { mode: "room", room: sala };
  }

  return {
    mode: "ip",
    ip: parsedAddress.ip,
    port: parsedAddress.port,
    token,
  };
}

function parseIpAddress(address) {
  if (!address) return null;

  if (address.startsWith("http://") || address.startsWith("https://")) {
    try {
      const url = new URL(address);
      if (!isValidIPv4(url.hostname)) return null;
      const parsedPort = url.port ? Number(url.port) : IP_DEFAULT_PORT;
      if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) return null;
      return { ip: url.hostname, port: parsedPort };
    } catch {
      return null;
    }
  }

  const [ip, portRaw] = address.split(":");
  if (!isValidIPv4(ip)) return null;

  const port = portRaw ? Number(portRaw) : IP_DEFAULT_PORT;
  if (!Number.isInteger(port) || port < 1 || port > 65535) return null;

  return { ip, port };
}

function isValidIPv4(value) {
  const parts = String(value || "").split(".");
  if (parts.length !== 4) return false;

  return parts.every((part) => {
    if (!/^\d{1,3}$/.test(part)) return false;
    const n = Number(part);
    return n >= 0 && n <= 255;
  });
}

async function sendNumber(target, number) {
  if (target.mode === "ip") {
    return sendNumberToIp(target, number);
  }
  return sendNumberToRoom(target.room, number);
}

async function sendNumberToRoom(room, number) {
  const resp = await fetch(SUPABASE_API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ room, number: Number(number) }),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    setStatus(`Erro HTTP ${resp.status}`, "error");
    throw new Error(`HTTP ${resp.status} ${text}`);
  }

  const result = await resp.json().catch(() => ({}));
  if (result?.success) {
    setStatus(`Enviado: ${number} -> sala ${room}`, "ok");
    return;
  }

  setStatus("Resposta inesperada da API.", "error");
  throw new Error("Supabase response did not include success=true");
}

async function sendNumberToIp(target, number) {
  const url = new URL(`http://${target.ip}:${target.port}/api/numero`);
  const token = target.token || IP_DEFAULT_TOKEN;
  url.searchParams.set("token", token);

  const resp = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      numero: Number(number),
      origem: IP_DEFAULT_ORIGIN,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    setStatus(`Erro HTTP ${resp.status} no IP ${target.ip}`, "error");
    throw new Error(`HTTP ${resp.status} ${text}`.trim());
  }

  setStatus(`Enviado: ${number} -> IP ${target.ip}:${target.port}`, "ok");
}

function setStatus(msg, type) {
  chrome.storage.local.set({ lastStatus: msg, lastStatusType: type || "" });
}
