import assert from 'node:assert/strict';
import { GAME_VERSION } from '../src/app/version.js';
import { openBrowserPage } from './cdp.js';

const page = await openBrowserPage();
try {
  assert.equal(await page.evaluate(`document.body.innerText.includes(${JSON.stringify(GAME_VERSION)})`), true);
  assert.equal(await page.evaluate("document.title"),'RIFT LAB');
  assert.equal(await page.evaluate("(async()=>{const r=await fetch(new URL('assets/rift-lab/midlane.svg',location.href));return r.ok;})()"),true);
  await page.go('/prepare/dodge');assert.equal(await page.evaluate("document.querySelectorAll('.focus-card').length"),5);
  await page.go('/check/dodge');await page.waitFor("document.querySelector('.probe-intro button')?.disabled===false",{timeout:45000});assert.equal(await page.evaluate("document.querySelector('.probe-intro select').options.length"),4);await page.clickButton('Iniciar verificação');assert.equal(await page.evaluate("document.querySelector('.app-shell').dataset.session"),'running');await page.go('/');assert.equal(await page.evaluate("document.querySelectorAll('canvas').length"),0);
  await page.go('/preview');
  await page.waitFor("document.querySelector('.stage')?.dataset.visuals==='ready'", { timeout: 45000 });
  assert.equal(await page.evaluate("document.querySelectorAll('canvas').length"), 1);
  assert.equal(await page.evaluate("document.querySelectorAll('.preview-error').length"), 0);
  await page.go('/');
  assert.equal(await page.evaluate("document.querySelectorAll('canvas').length"), 0);
  await page.go('/challenges/dodge');
  assert.equal(await page.evaluate("document.querySelectorAll('.series-grid article').length"),3);
  await page.go('/challenge/dodge/dd1-linha-1A2B3C4D');
  await page.waitFor("document.querySelector('.arena-ready button')?.disabled===false",{timeout:45000});
  await page.clickButton('Iniciar série');
  assert.equal(await page.evaluate("document.querySelector('.app-shell').dataset.session"),'running');
  await page.go('/');
  assert.equal(await page.evaluate("document.querySelectorAll('canvas').length"),0);
  await page.go('/timed/kiting/1');
  await page.waitFor("document.querySelector('.stage')?.dataset.visuals==='ready'",{timeout:45000});
  assert.equal(await page.evaluate("document.querySelector('select[aria-label=\"Comandos de Kiting\"]').options.length"),3);
  await page.go('/');
  assert.deepEqual(page.errors, []);
  console.log(JSON.stringify({ status: 'PASSOU', version: GAME_VERSION, productionAssets: true, sceneDisposed: true }, null, 2));
} finally { await page.close(); }
