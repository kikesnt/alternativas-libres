import { writeFile } from "node:fs/promises";

const url = process.argv[2] ?? "http://localhost:3000/";
const ancho = Number(process.argv[3] ?? 430);
const alto = Number(process.argv[4] ?? 1400);
const salida = process.argv[5] ?? "/tmp/shots/cdp.png";

const res = await fetch("http://localhost:9222/json/new?" + encodeURIComponent(url), {
  method: "PUT",
});
const target = await res.json();

const ws = new WebSocket(target.webSocketDebuggerUrl);
let id = 0;
const pendientes = new Map();

const enviar = (method, params = {}) =>
  new Promise((resolve) => {
    const mensajeId = ++id;
    pendientes.set(mensajeId, resolve);
    ws.send(JSON.stringify({ id: mensajeId, method, params }));
  });

await new Promise((r) => (ws.onopen = r));

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pendientes.has(msg.id)) {
    pendientes.get(msg.id)(msg.result);
    pendientes.delete(msg.id);
  }
};

await enviar("Emulation.setDeviceMetricsOverride", {
  width: ancho,
  height: alto,
  deviceScaleFactor: 2,
  mobile: true,
});
await enviar("Page.enable");
await enviar("Page.navigate", { url });
await new Promise((r) => setTimeout(r, 3500));

const expresion = `(() => {
  const vw = document.documentElement.clientWidth;
  const culpables = [];
  for (const el of document.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.width > vw + 1) {
      culpables.push({
        tag: el.tagName.toLowerCase(),
        clase: (el.className || '').toString().slice(0, 120),
        ancho: Math.round(r.width),
      });
    }
  }
  return { vw, scrollWidth: document.documentElement.scrollWidth, culpables: culpables.slice(0, 20) };
})()`;

const analisis = await enviar("Runtime.evaluate", {
  expression: expresion,
  returnByValue: true,
});
console.log(JSON.stringify(analisis.result.value, null, 2));

const captura = await enviar("Page.captureScreenshot", {
  format: "png",
  captureBeyondViewport: false,
});
await writeFile(salida, Buffer.from(captura.data, "base64"));
console.log("captura:", salida);

ws.close();
process.exit(0);
