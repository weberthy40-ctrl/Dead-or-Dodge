import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { openBrowserPage, pause } from './cdp.js';
const page = await openBrowserPage(), code = 'dd1-linha-1A2B3C4D';
async function shot(name) {
  if (!process.env.QA_ARTIFACT_DIR) return;
  await mkdir(process.env.QA_ARTIFACT_DIR, { recursive: true });
  await writeFile(`${process.env.QA_ARTIFACT_DIR}/${name}.png`, Buffer.from((await page.send('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
}
try {
  await page.send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });
  await page.evaluate(`(async()=>{
    const {createAttemptRepository}=await import('/src/persistence/attemptRepository.js'),{recordFixture}=await import('/tests/fixtures/record.js'),{DEFAULT_PREFERENCES,savePreferences}=await import('/src/settings/preferences.js');
    savePreferences(localStorage,{...DEFAULT_PREFERENCES,quality:'leve'});
    const repository=createAttemptRepository();try{await repository.saveCompletedAttempt(recordFixture());}finally{repository.close();}
  })()`);
  await page.go('/profile'); await page.waitFor("document.querySelectorAll('.rank-badge').length===4");
  const originalRating = await page.evaluate("document.querySelector('.overall-rank').textContent");
  await page.go('/train/dodge');
  assert.equal(await page.evaluate("Boolean(document.querySelector('a[href=\"#/challenges/dodge\"]'))"), true);
  await page.go('/challenges/dodge'); assert.equal(await page.evaluate("document.querySelectorAll('.series-grid article').length"), 3);
  await shot('series-hub');
  await page.evaluate(`(()=>{const form=document.querySelector('.series-code-form');form.querySelector('input').value='dd2-linha-12345678';form.dispatchEvent(new Event('submit',{cancelable:true}));})()`);
  assert.equal(await page.evaluate('location.hash'), '#/challenges/dodge');
  await page.go(`/challenge/dodge/${code}`);
  for (let round = 1; round <= 2; round++) {
    await page.waitFor("document.querySelector('.arena-ready button')?.disabled===false", { timeout: 45000 });
    await page.clickButton('Iniciar série');
    if (round === 1) {
      await page.clickButton('Pausar'); const frozen = await page.evaluate("document.querySelector('.series-status').textContent");
      await pause(300); assert.equal(await page.evaluate("document.querySelector('.series-status').textContent"), frozen);
      await page.clickButton('Retomar');
    }
    await page.waitFor("document.querySelector('.series-save-status')?.textContent==='Salvo neste dispositivo'", { timeout: 45000 });
    await page.waitFor(`document.querySelectorAll('.series-history-table tbody tr').length===${round}`);
    assert.equal(await page.evaluate("document.querySelector('.result-actions').getBoundingClientRect().bottom<=innerHeight"), true);
    await shot(`series-result-${round}`);
    if (round === 1) await page.clickButton('Repetir a mesma série', 'dialog');
  }
  const persisted = await page.evaluate(`(async()=>{
    const {createAttemptRepository}=await import('/src/persistence/attemptRepository.js'),{createBackup,parseBackup}=await import('/src/persistence/backup.js'),{recordFixture}=await import('/tests/fixtures/record.js');
    const repository=createAttemptRepository(),name='series-qa-'+crypto.randomUUID(),restored=createAttemptRepository({databaseName:name});
    try{
      const before=await repository.exportBackupData(),challenges=before.attempts.filter(r=>r.modality==='dodge-challenge');
      const encoded=createBackup(before),backup=parseBackup(encoded),first=await restored.mergeBackup(backup),again=await restored.mergeBackup(backup),after=await restored.exportBackupData();
      return {codes:challenges.map(r=>r.code),ids:new Set(challenges.map(r=>r.attemptId)).size,legacyUnchanged:JSON.stringify(before.attempts.find(r=>r.modality==='dodge'))===JSON.stringify(recordFixture()),backupAdded:first.added,repeatAdded:again.added,restored:after.attempts.length};
    }finally{repository.close();restored.close();await new Promise((resolve,reject)=>{const request=indexedDB.deleteDatabase(name);request.onsuccess=resolve;request.onerror=()=>reject(request.error);});}
  })()`);
  assert.deepEqual(persisted, { codes: [code, code], ids: 2, legacyUnchanged: true, backupAdded: 3, repeatAdded: 0, restored: 3 });
  await page.go('/profile'); await page.waitFor("document.querySelectorAll('.rank-badge').length===4");
  assert.equal(await page.evaluate("document.querySelector('.overall-rank').textContent"), originalRating);
  await page.go('/challenges/dodge'); await page.waitFor("Boolean(document.querySelector('.series-recent a'))");
  assert.equal(await page.evaluate("document.querySelector('.series-recent a').hash"), `#/challenge/dodge/${code}`);
  // A different code must not display the two attempts above. Abandoning saves nothing.
  await page.go('/challenge/dodge/dd1-linha-00000000');
  await page.waitFor("document.querySelector('.arena-ready button')?.disabled===false", { timeout: 45000 });
  await page.clickButton('Iniciar série'); await page.go('/challenges/dodge');
  const count = await page.evaluate(`(async()=>{const {createAttemptRepository}=await import('/src/persistence/attemptRepository.js');const repository=createAttemptRepository();try{return await repository.countCompletedAttempts({modality:'dodge-challenge'});}finally{repository.close();}})()`);
  assert.equal(count, 2); assert.deepEqual(page.errors, []);
  console.log(JSON.stringify({ status: 'PASSOU', exactCodeRepeated: true, independentAttemptIds: true, pauseFrozen: true, profileUnchanged: true, officialRecordPreserved: true, nativeBackupRoundTrip: persisted.restored, backupIdempotent: true, recentSeriesDiscoverable: true, abandonmentNotSaved: true }, null, 2));
} finally { await page.close(); }
