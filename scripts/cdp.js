import assert from 'node:assert/strict';
export const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

async function connect(url, timeout, onEvent = () => {}) {
  const socket = new WebSocket(url);
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => { socket.close(); reject(new Error('Timeout: conexão CDP')); }, timeout);
    socket.addEventListener('open', () => { clearTimeout(timer); resolve(); }, { once: true });
    socket.addEventListener('error', () => { clearTimeout(timer); reject(new Error('Falha na conexão CDP')); }, { once: true });
  });
  let sequence = 0;
  const pending = new Map();
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id) { onEvent(message); return; }
    const item = pending.get(message.id);
    if (!item) return;
    clearTimeout(item.timer);
    pending.delete(message.id);
    if (message.error) item.reject(new Error(JSON.stringify(message.error)));
    else item.resolve(message.result);
  });
  socket.addEventListener('close', () => {
    for (const item of pending.values()) {
      clearTimeout(item.timer);
      item.reject(new Error('Conexão CDP encerrada.'));
    }
    pending.clear();
  });
  return {
    send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = ++sequence;
        const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timeout: ${method}`)); }, timeout);
        pending.set(id, { resolve, reject, timer });
        socket.send(JSON.stringify({ id, method, params }));
      });
    },
    close() { socket.close(); },
  };
}

/** Every page owns a disposable browser context: no shared localStorage or IndexedDB. */
export async function openBrowserPage(base = process.argv[2] ?? 'http://127.0.0.1:5173/') {
  const endpoint = process.env.CDP_URL ?? 'http://127.0.0.1:9222';
  const timeout = Number(process.env.CDP_TIMEOUT_MS ?? 15000);
  assert.ok(Number.isFinite(timeout) && timeout >= 1000 && timeout <= 60000, 'CDP_TIMEOUT_MS deve ficar entre 1000 e 60000.');
  const response = await fetch(`${endpoint}/json/version`);
  assert.ok(response.ok, 'Inicie Chrome/Chromium com DevTools ou use npm run test:e2e.');
  const { webSocketDebuggerUrl } = await response.json();
  const browser = await connect(webSocketDebuggerUrl, timeout);
  let browserContextId, page;
  try {
    ({ browserContextId } = await browser.send('Target.createBrowserContext', { disposeOnDetach: true }));
    const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank', browserContextId });
    const targetsResponse = await fetch(`${endpoint}/json/list`);
    assert.ok(targetsResponse.ok, 'Não foi possível localizar a página de QA.');
    const target = (await targetsResponse.json()).find(item => item.id === targetId);
    assert.ok(target?.webSocketDebuggerUrl, 'Página de QA indisponível.');
    const errors = [];
    page = await connect(target.webSocketDebuggerUrl, timeout, message => {
      if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
      if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
        errors.push(message.params.args.map(arg => arg.value ?? arg.description).join(' '));
      }
    });
    const send = (method, params) => page.send(method, params);
    async function evaluate(expression) {
      const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
      return result.result.value;
    }
    async function waitFor(expression, { timeout = 15000, interval = 100 } = {}) {
      const until = Date.now() + timeout;
      while (Date.now() < until) {
        const result = await evaluate(expression);
        if (result) return result;
        await pause(interval);
      }
      throw new Error(`Condição não atingida: ${expression}`);
    }
    let closed = false;
    const api = {
      send, evaluate, waitFor, errors, browserContextId, targetId,
      async go(path) { await evaluate(`location.hash=${JSON.stringify(path)}`); await pause(150); },
      async clickButton(text, scope = 'main') {
        const result = await evaluate(`(()=>{const button=[...document.querySelectorAll(${JSON.stringify(scope + ' button')})].find(b=>b.textContent===${JSON.stringify(text)}&&!b.disabled&&!b.hidden);if(!button)return false;button.click();return true;})()`);
        assert.equal(result, true, `Botão disponível: ${text}`);
      },
      async key(code, key = code) {
        await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code });
        await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code });
      },
      async mouse(point, button = 'left') {
        await send('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button, clickCount: 1 });
        await send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button, clickCount: 1 });
      },
      async close() {
        if (closed) return;
        closed = true;
        try { await browser.send('Target.disposeBrowserContext', { browserContextId }); }
        finally { page.close(); browser.close(); }
      },
    };
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Page.navigate', { url: base });
    await waitFor("document.readyState==='complete'&&Boolean(document.querySelector('main'))");
    await send('Page.bringToFront');
    return api;
  } catch (error) {
    try { if (browserContextId) await browser.send('Target.disposeBrowserContext', { browserContextId }); }
    finally { page?.close(); browser.close(); }
    throw error;
  }
}
