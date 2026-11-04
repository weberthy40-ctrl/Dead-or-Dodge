import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { pause } from './cdp.js';

/** Real keyboard activation, modal focus, pause and abandoned navigation on the main four modes. */
export async function checkTrainingFlow(page, { matrix = [[1366, 768], [1920, 1080]], records = false } = {}) {
  const report = [], originalStyle = await page.evaluate("({size:document.documentElement.dataset.textSize,contrast:document.documentElement.dataset.contrast})");
  let originalRecords, originalPreferences;
  if (records) {
    originalRecords = await page.evaluate("(async()=>{const {createAttemptRepository}=await import('/src/persistence/attemptRepository.js'),r=createAttemptRepository();try{return JSON.stringify((await r.exportBackupData()).attempts);}finally{r.close();}})()");
    originalPreferences = await page.evaluate("localStorage.getItem('moba-training:preferences:v1')");
  }
  const shot = async name => {
    if (!process.env.QA_ARTIFACT_DIR) return;
    await mkdir(process.env.QA_ARTIFACT_DIR, { recursive: true }); const result = await page.send('Page.captureScreenshot', { format: 'png' });
    await writeFile(`${process.env.QA_ARTIFACT_DIR}/training-${name}.png`, Buffer.from(result.data, 'base64'));
  };
  const hud = () => page.evaluate("document.querySelector('.session-status')?.textContent??document.querySelector('.training-statistics').textContent");
  try {
    for (const [width, height] of matrix) {
      await page.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
      await page.evaluate(`document.documentElement.dataset.textSize='${width >= 1920 ? 'large' : 'normal'}';document.documentElement.dataset.contrast='${width >= 1920 ? 'high' : 'normal'}'`);
      for (const [name, path, title] of [['dodge', '/play/dodge/normal/1', 'Esquiva'], ['precision', '/timed/precision/1', 'Precisão'], ['kiting', '/timed/kiting/1', 'Kiting'], ['reflex', '/timed/reflex/1', 'Reflexos']]) {
        await page.go(path);
        await page.waitFor("document.querySelector('.training-ready button')?.disabled===false", { timeout: 45000 });
        assert.match(await page.evaluate("document.querySelector('.training-ready').textContent"), new RegExp(title));
        assert.equal(await page.evaluate("document.querySelectorAll('.training-ready .training-brief-facts>div').length"), 3);
        assert.equal(await page.evaluate("document.querySelector('.app-shell').dataset.session"), 'idle');
        const accessible = await page.evaluate("(()=>{const card=document.querySelector('.training-ready-card'),b=card.querySelector('button'),r=b.getBoundingClientRect(),selects=[...document.querySelectorAll('.training-controls select')];return {button:r.top>=0&&r.bottom<=innerHeight&&document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('button')===b,options:selects.every(s=>{const q=s.getBoundingClientRect();return q.top>=0&&q.bottom<=innerHeight&&document.elementFromPoint(q.x+q.width/2,q.y+q.height/2)?.closest('select')===s;}),overflow:document.documentElement.scrollWidth>innerWidth};})()");
        assert.deepEqual(accessible, { button: true, options: true, overflow: false }); await shot(`${name}-ready-${width}`);
        await page.evaluate("document.querySelector('.training-ready button').focus()"); await page.key('Space', ' ');
        await page.waitFor("document.querySelector('.app-shell').dataset.session==='running'");
        await page.key('Escape'); await page.waitFor("document.querySelector('.training-pause')?.matches(':modal')");
        assert.equal(await page.evaluate("document.activeElement===document.querySelector('.training-pause button')"), true);
        const frozen = await hud(); await pause(200); assert.equal(await hud(), frozen);
        for (let tab = 0; tab < 3; tab++) { await page.key('Tab'); assert.equal(await page.evaluate("document.querySelector('.training-pause').contains(document.activeElement)"), true); }
        await shot(`${name}-paused-${width}`);
        await page.evaluate("document.querySelector('.training-pause button').focus()"); await page.key('Escape');
        await page.waitFor("!document.querySelector('.training-pause').open&&document.querySelector('.app-shell').dataset.session==='running'");
        assert.equal(await page.evaluate(name === 'reflex' ? "document.activeElement===document.querySelector('.reflex-stage')" : "document.activeElement===document.querySelector('.stage canvas')"), true);
        // Lifecycle event simulation, separate from the trusted keyboard checks above.
        await page.evaluate("window.dispatchEvent(new Event('blur'))"); await page.waitFor("document.querySelector('.training-pause')?.matches(':modal')");
        await page.evaluate("window.dispatchEvent(new Event('focus'))"); assert.equal(await page.evaluate("document.querySelector('.app-shell').dataset.session"), 'paused');
        await page.evaluate("document.querySelector('.training-pause a').focus()"); await page.key('Enter');
        await page.waitFor("location.hash==='#/'&&document.querySelector('.hub-recent')?.getAttribute('aria-busy')==='false'");
        assert.equal(await page.evaluate("document.querySelectorAll('.training-pause,canvas').length"), 0);
        report.push({ modality: name, width, keyboardStart: true, modalFocus: true, frozen: true, explicitResume: true, simulatedBlur: true, abandonedExit: true });
      }
    }
    if (records) {
      assert.equal(await page.evaluate("(async()=>{const {createAttemptRepository}=await import('/src/persistence/attemptRepository.js'),r=createAttemptRepository();try{return JSON.stringify((await r.exportBackupData()).attempts);}finally{r.close();}})()"), originalRecords);
      assert.equal(await page.evaluate("localStorage.getItem('moba-training:preferences:v1')"), originalPreferences);
    }
    return report;
  } finally {
    await page.evaluate(`document.documentElement.dataset.textSize=${JSON.stringify(originalStyle.size)};document.documentElement.dataset.contrast=${JSON.stringify(originalStyle.contrast)}`);
  }
}
