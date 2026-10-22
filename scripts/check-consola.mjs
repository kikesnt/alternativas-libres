const url = process.argv[2] ?? "http://localhost:3000/";

const res = await fetch("http://localhost:9222/json/new?" + encodeURIComponent(url), {
  method: "PUT",
});
const target = await res.json();

const ws = new WebSocket(target.webSocketDebuggerUrl);
let id = 0;
const pendientes = new Map();
const problemas = [];

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
    return;
  }
  if (msg.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(msg.params.type)) {
    problemas.push({
      tipo: msg.params.type,
      texto: msg.params.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 220),
    });
  }
  if (msg.method === "Runtime.exceptionThrown") {
    problemas.push({
      tipo: "excepcion",
      texto: msg.params.exceptionDetails?.exception?.description?.slice(0, 220) ?? "",
    });
  }
  if (msg.method === "Log.entryAdded" && msg.params.entry.level === "error") {
    problemas.push({
      tipo: "log",
      texto: `${msg.params.entry.source}: ${msg.params.entry.text}`.slice(0, 220),
    });
  }
};

await enviar("Runtime.enable");
await enviar("Log.enable");
await enviar("Page.enable");
await enviar("Emulation.setDeviceMetricsOverride", {
  width: 1280,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});
await enviar("Page.navigate", { url });
await new Promise((r) => setTimeout(r, 5000));

// acepta cookies para forzar la carga del script de AdSense
const tema = process.argv[3];
await enviar("Runtime.evaluate", {
  expression: `(() => {
    localStorage.setItem('al_consent', 'all');
    ${tema ? `localStorage.setItem('al_theme', '${tema}');` : ""}
    return true;
  })()`,
});
await enviar("Page.reload");
await new Promise((r) => setTimeout(r, 5000));

console.log(problemas.length === 0 ? "Sin errores ni avisos en consola." : "");
const vistos = new Set();
for (const p of problemas) {
  const clave = p.texto.slice(0, 90);
  if (vistos.has(clave)) continue;
  vistos.add(clave);
  console.log(`[${p.tipo}] ${p.texto}`);
}
console.log(`\nTotal de mensajes: ${problemas.length} (${vistos.size} únicos)`);

ws.close();
process.exit(0);
