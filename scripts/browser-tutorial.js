import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { openBrowserPage, pause } from './cdp.js';

const page = await openBrowserPage();
async function shot(name) {
  if (!process.env.QA_ARTIFACT_DIR) return;
  await mkdir(process.env.QA_ARTIFACT_DIR, { recursive: true });
  const result = await page.send('Page.captureScreenshot', { format: 'png' });
  await writeFile(`${process.env.QA_ARTIFACT_DIR}/${name}.png`, Buffer.from(result.data, 'base64'));
}
try {
  await page.send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });
  await page.evaluate(`(async()=>{const {savePreferences,DEFAULT_PREFERENCES}=await import('/src/settings/preferences.js');savePreferences(localStorage,{...DEFAULT_PREFERENCES,quality:'leve',flashKey:'KeyF'});})()`);
  await page.go('/train/dodge');
  assert.equal(await page.evaluate("Boolean(document.querySelector('a[href=\"#/learn/dodge\"]'))"), true);
  await page.go('/learn/dodge');
  await page.waitFor("document.querySelector('.arena-ready button')?.disabled===false", { timeout: 45000 });
  await shot('tutorial-ready');
  await page.clickButton('Começar tutorial');
  await page.mouse({ x: 1000, y: 500 }, 'right');
  await page.waitFor("!document.querySelector('.tutorial-actions button').hidden");
  await page.clickButton('Continuar');
  assert.match(await page.evaluate("document.querySelector('.tutorial-description').textContent"), /pressione F/);
  await page.clickButton('Pausar'); await page.key('KeyF', 'f'); await pause(200);
  assert.equal(await page.evaluate("document.querySelector('.tutorial-actions button').hidden"), true);
  await page.clickButton('Retomar tutorial');
  await page.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1000, y: 500 });
  await page.key('KeyF', 'f'); await page.waitFor("!document.querySelector('.tutorial-actions button').hidden");
  await page.clickButton('Continuar'); await page.key('KeyE', 'e');
  await page.waitFor("!document.querySelector('.tutorial-actions button').hidden"); await pause(250);
  await page.clickButton('Continuar');
  await page.evaluate("document.querySelector('.camera-toggle').click()");
  assert.match(await page.evaluate("document.querySelector('.camera-toggle').textContent"), /livre/);
  await page.key('KeyY', 'y');
  assert.equal(await page.evaluate("document.querySelector('.camera-toggle').getAttribute('aria-pressed')"), 'true');
  await page.clickButton('Lançar aviso'); await shot('tutorial-warning');
  await page.waitFor("document.querySelector('.tutorial-status').textContent.includes('A área acertou')");
  await page.clickButton('Tentar aviso novamente');
  await page.mouse({ x: 420, y: 480 }, 'right');
  await page.waitFor("document.querySelector('.dodge-tutorial').dataset.step==='complete'");
  assert.equal(await page.evaluate("document.querySelector('.app-shell').dataset.session"), 'completed');
  await shot('tutorial-complete');
  await page.go('/profile');
  await page.waitFor("document.querySelectorAll('.rank-badge').length===4");
  assert.equal(await page.evaluate("[...document.querySelectorAll('.rank-badge')].every(b=>b.textContent==='Sem patente')"), true);
  assert.equal(await page.evaluate("localStorage.getItem('moba-training:dodge-placement:v1')"), null);
  assert.deepEqual(page.errors, []);
  console.log(JSON.stringify({ status: 'PASSOU', nativeMovement: true, configuredFlash: 'F', dash: 'E', pausedInputIgnored: true, realCollisionRetry: true, areaAvoided: true, cameraToggle: true, officialProgressUnchanged: true }, null, 2));
} finally { await page.close(); }
