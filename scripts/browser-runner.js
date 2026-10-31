import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { access, mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pause } from './cdp.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const artifacts = path.resolve(root, process.env.QA_ARTIFACT_DIR ?? `artifacts/qa/${Date.now()}`);
const runtime = await mkdtemp(path.join(tmpdir(), 'moba-qa-'));
const owned = [];
let interrupted = false;
function interrupt() {
  interrupted = true;
  for (const item of owned) if (item.child.exitCode === null) item.child.kill('SIGTERM');
}
process.on('SIGINT', interrupt);
process.on('SIGTERM', interrupt);

function start(command, args, name, env = process.env, echo = false) {
  const log = createWriteStream(path.join(artifacts, `${name}.log`));
  const child = spawn(command, args, { cwd: root, env, stdio: ['ignore', 'pipe', 'pipe'] });
  child.stdout.pipe(log, { end: false });
  child.stderr.pipe(log, { end: false });
  if (echo) { child.stdout.pipe(process.stdout); child.stderr.pipe(process.stderr); }
  const item = { child, done: null, result: null };
  item.done = new Promise(resolve => {
    child.once('error', error => { item.result = { code: 1, error }; });
    child.once('close', (code, signal) => {
      item.result ??= { code, signal };
      log.end(() => resolve(item.result));
    });
  });
  owned.push(item);
  return item;
}
async function stop(item) {
  if (!item || item.result) return;
  item.child.kill('SIGTERM');
  const timer = setTimeout(() => item.child.kill('SIGKILL'), 3000);
  try { await item.done; } finally { clearTimeout(timer); }
}
async function ready(check, item, name) {
  const deadline = Date.now() + 45000;
  while (Date.now() < deadline) {
    assert.ok(!interrupted, 'QA interrompido.');
    assert.ok(!item.result, `${name} encerrou antes de ficar pronto; consulte ${artifacts}.`);
    try { const value = await check(); if (value) return value; } catch { /* Startup may still be in progress. */ }
    await pause(100);
  }
  throw new Error(`Timeout: ${name}; consulte ${artifacts}.`);
}
async function freePort() {
  const server = createServer();
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const port = server.address().port;
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  return port;
}
async function runSuite(name, base, env) {
  console.log(`\nQA: ${name}`);
  const suiteDir = path.join(artifacts, name);
  await mkdir(suiteDir, { recursive: true });
  const item = start(process.execPath, [`scripts/${name}.js`, base], name, { ...env, QA_ARTIFACT_DIR: suiteDir }, true);
  const timer = setTimeout(() => item.child.kill('SIGKILL'), 600000);
  try {
    const result = await item.done;
    assert.equal(result.code, 0, `${name} falhou (${result.error?.message ?? result.signal ?? result.code}); consulte ${artifacts}.`);
  } finally { clearTimeout(timer); }
}

try {
  await mkdir(artifacts, { recursive: true });
  await access(path.join(root, 'dist/index.html'));
  const candidates = process.env.CHROME_BIN ? [process.env.CHROME_BIN] : ['chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable'];
  const executable = candidates.find(command => spawnSync(command, ['--version'], { encoding: 'utf8' }).status === 0);
  assert.ok(executable, 'Instale Chrome/Chromium ou defina CHROME_BIN com o caminho do executável.');
  const headed = process.env.QA_HEADED === '1';
  const chromeArgs = [
    ...(headed ? [] : ['--headless']), '--disable-dev-shm-usage', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-address=127.0.0.1', '--remote-debugging-port=0', `--user-data-dir=${path.join(runtime, 'profile')}`,
    ...(process.env.QA_NO_SANDBOX === '1' ? ['--no-sandbox'] : []), 'about:blank',
  ];
  const browser = start(executable, chromeArgs, 'chromium');
  const debugPort = await ready(async () => {
    const content = await readFile(path.join(runtime, 'profile', 'DevToolsActivePort'), 'utf8');
    const port = Number(content.split('\n')[0]);
    if (!Number.isInteger(port) || port <= 0) return null;
    const response = await fetch(`http://127.0.0.1:${port}/json/version`, { signal: AbortSignal.timeout(2000) });
    return response.ok ? port : null;
  }, browser, 'Chrome/Chromium');
  const port = await freePort(), base = `http://127.0.0.1:${port}/`;
  const vite = path.join(root, 'node_modules/vite/bin/vite.js');
  let server = start(process.execPath, [vite, '--host', '127.0.0.1', '--port', String(port), '--strictPort'], 'vite');
  const isServing = async () => (await fetch(base, { signal: AbortSignal.timeout(2000) })).ok;
  await ready(isServing, server, 'Vite');
  const env = { ...process.env, CDP_URL: `http://127.0.0.1:${debugPort}`, QA_SKIP_FULLSCREEN: process.env.QA_SKIP_FULLSCREEN ?? (headed ? '' : '1') };
  if (env.QA_SKIP_FULLSCREEN) console.log('Tela cheia: NÃO VERIFICADA nesta execução. Execute QA_HEADED=1 e o roteiro manual para validá-la.');
  console.log(`Artefatos: ${artifacts}`);
  // Gameplay deliberately precedes dodge: shared-state regressions must not return.
  for (const name of ['browser-isolation', 'browser-tutorial', 'browser-series', 'browser-smoke', 'browser-native', 'browser-feedback', 'browser-dodge']) {
    await runSuite(name, base, env);
  }
  await stop(server);
  server = start(process.execPath, [vite, 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], 'preview');
  await ready(isServing, server, 'Preview de produção');
  await runSuite('browser-production', base, env);
  console.log('\nQA automatizado: PASSOU. Testes manuais de hardware e tela cheia permanecem separados.');
} finally {
  for (const item of owned.toReversed()) await stop(item);
  await rm(runtime, { recursive: true, force: true });
  process.removeListener('SIGINT', interrupt);
  process.removeListener('SIGTERM', interrupt);
}
