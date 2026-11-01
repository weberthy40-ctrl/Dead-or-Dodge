import assert from 'node:assert/strict';
import { mkdir,writeFile } from 'node:fs/promises';
import { openBrowserPage,pause } from './cdp.js';
process.env.CDP_TIMEOUT_MS??='45000';
let page=await openBrowserPage(),failure;const report={};
const hud="document.querySelector('.kiting-practice>p.muted').textContent";
async function reload(){
 const origin=await page.evaluate('performance.timeOrigin');await page.send('Page.reload');const deadline=Date.now()+45000;
 while(Date.now()<deadline){try{if(await page.evaluate(`performance.timeOrigin!==${origin}&&document.readyState==='complete'&&Boolean(document.querySelector('main'))`))return;}catch(error){if(!/Inspected target navigated or closed|Cannot find context|Execution context.*destroyed/.test(error.message))throw error;}await pause(100);}
 throw new Error('A página não terminou de recarregar.');
}
async function advance(milliseconds){for(let elapsed=0;elapsed<milliseconds;elapsed+=100){await page.evaluate('qaClock+=100');await page.evaluate('qaNextFrame()');}}
const count=async()=>Number((await page.evaluate(hud)).match(/(\d+) ATAQUES/)[1]);
async function readyToStart(){await page.waitFor("document.querySelector('.stage')?.dataset.visuals==='ready'&&Boolean(document.querySelector('.stage canvas'))&&[...document.querySelectorAll('.kiting-practice button')].some(b=>b.textContent==='Iniciar treino'&&!b.disabled&&!b.hidden)",{timeout:45000});}
try{
 await page.send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false});
 await page.evaluate(`(async()=>{const {DEFAULT_PREFERENCES,savePreferences}=await import('/src/settings/preferences.js');savePreferences(localStorage,{...DEFAULT_PREFERENCES,quality:'leve'});})()`);
 for(const profile of ['direct','attack-click','quick-attack']){
  if(profile!=='direct'){await page.close();page=await openBrowserPage();await page.send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false});await page.evaluate(`(async()=>{const {DEFAULT_PREFERENCES,savePreferences}=await import('/src/settings/preferences.js');savePreferences(localStorage,{...DEFAULT_PREFERENCES,quality:'leve'});})()`);}
  await page.go('/timed/kiting/1');await readyToStart();
  await page.evaluate(`(()=>{const s=document.querySelector('select[aria-label="Comandos de Kiting"]');s.value=${JSON.stringify(profile)};s.dispatchEvent(new Event('change'));})()`);
  await readyToStart();await page.clickButton('Iniciar treino');await page.waitFor("document.querySelector('.app-shell').dataset.session==='running'");
  assert.equal(await page.evaluate("document.querySelector('select[aria-label=\"Comandos de Kiting\"]').disabled"),true);
  // Software rendering must not let the cooldown expire between native protocol calls.
  await page.evaluate(`(()=>{window.qaClock=performance.now();const request=window.requestAnimationFrame.bind(window);window.qaRestoreClock=()=>{window.requestAnimationFrame=request;delete performance.now;};window.qaNextFrame=()=>new Promise(resolve=>request(()=>resolve(true)));window.requestAnimationFrame=callback=>request(()=>callback(window.qaClock));Object.defineProperty(performance,'now',{configurable:true,value:()=>window.qaClock});})()`);await page.evaluate('qaNextFrame()');
  const point=await page.evaluate("(()=>{const r=document.querySelector('.stage canvas').getBoundingClientRect();return {x:r.x+r.width*.7,y:r.y+r.height*.65};})()");
  await page.send('Input.dispatchMouseEvent',{type:'mouseMoved',...point});
  if(profile!=='direct'){await page.mouse(point);await pause(150);assert.equal(await count(),0);await page.key('KeyA','a');}
  if(profile!=='quick-attack')await page.mouse(point);
  await advance(300);await page.waitFor(`${hud}.includes('1 ATAQUES')`);
  if(profile!=='direct'){await page.key('KeyA','a');if(profile==='attack-click')await page.mouse(point);}else await page.mouse(point);
  await advance(1500);assert.equal(await count(),1,'Um comando durante recuperação não agenda outro disparo.');
  if(profile==='attack-click'){
   await page.key('KeyA','a');await page.key('Escape','Escape');await page.waitFor("document.querySelector('.app-shell').dataset.session==='paused'");await page.key('Escape','Escape');await page.mouse(point);await advance(400);assert.equal(await count(),1,'Pausa descarta comando armado.');
  }
  report[profile]={oneCommandOneShot:true,cooldownQueue:false,selectFrozen:true,clock:'Native inputs with controlled simulation time for cooldown boundaries'};
  if(process.env.QA_ARTIFACT_DIR){await mkdir(process.env.QA_ARTIFACT_DIR,{recursive:true});await writeFile(`${process.env.QA_ARTIFACT_DIR}/${profile}.png`,Buffer.from((await page.send('Page.captureScreenshot',{format:'png'})).data,'base64'));}
  await page.evaluate('qaRestoreClock()');await page.go('/');
 }
 await reload();await page.go('/timed/kiting/10');await readyToStart();
 assert.equal(await page.evaluate("document.querySelector('select[aria-label=\"Comandos de Kiting\"]').value"),'quick-attack');
 await page.clickButton('Iniciar treino');await page.waitFor("document.querySelector('dialog.kiting-result').textContent.includes('Salvo neste dispositivo')",{timeout:60000});
 report.storage=await page.evaluate(`(async()=>{
  const {createAttemptRepository}=await import('/src/persistence/attemptRepository.js'),{kitingRecord}=await import('/tests/fixtures/kitingRecord.js'),{createBackup,parseBackup}=await import('/src/persistence/backup.js');
  const r=createAttemptRepository(),copy=createAttemptRepository({databaseName:'qa-kiting-profile-copy'});
  try{
   const played=(await r.listCompletedAttempts({modality:'kiting'})).items;
   if(played.length!==1||played[0].metrics.controlProfile!=='quick-attack'||played[0].score.controlProfile!=='quick-attack')throw new Error('Tentativa real perdeu os comandos.');
   const old=structuredClone(kitingRecord({id:'legacy-control'}));delete old.metrics.controlProfile;delete old.score.controlProfile;
   const original=JSON.stringify(old);await r.saveCompletedAttempt(old);
   await r.saveCompletedAttempt(kitingRecord({id:'attack-click',controlProfile:'attack-click'}));
   const direct=await r.listCompletedAttempts({modality:'kiting',controlProfile:'direct'}),quick=await r.listCompletedAttempts({modality:'kiting',controlProfile:'quick-attack'});
   if(direct.total!==1||quick.total!==1)throw new Error('Filtro misturou comandos.');
   const scanned=[];await r.scanCompletedAttempts({modality:'kiting',controlProfile:'attack-click',onRecord:r=>scanned.push(r)});if(scanned.length!==1)throw new Error('Varredura misturou comandos.');
   const backup=parseBackup(createBackup(await r.exportBackupData()));await copy.mergeBackup(backup);
   const roundtrip=await copy.exportBackupData();if(roundtrip.attempts.length!==3||JSON.stringify(await copy.getAttemptById(old.attemptId))!==original)throw new Error('Backup alterou histórico.');
   return {playedProfile:played[0].metrics.controlProfile,legacyPreserved:true,filtered:true,backupAttempts:roundtrip.attempts.length};
  }finally{r.close();copy.close();}
 })()`);
 await page.go('/history/kiting');await page.waitFor("document.querySelector('table')?.textContent.includes('Clique direto')");
 await page.evaluate("(()=>{const s=document.querySelector('select[aria-label=\"Comandos de Kiting\"]');s.value='attack-click';s.dispatchEvent(new Event('change'));})()");await page.waitFor("document.querySelector('table')?.textContent.includes('A + clique')&&!document.querySelector('table').textContent.includes('Clique direto')");
 await page.go('/evolution/kiting');await page.waitFor("Boolean(document.querySelector('select[aria-label=\"Comandos de Kiting\"]'))");
 await page.evaluate("(()=>{const variant=document.querySelector('.data-controls select'),commands=document.querySelector('select[aria-label=\"Comandos de Kiting\"]');variant.value='static';commands.value='attack-click';commands.dispatchEvent(new Event('change'));})()");await page.waitFor("document.querySelector('svg')?.querySelectorAll('circle').length===1&&document.querySelector('table').textContent.includes('A + clique')");
 await page.go('/records/kiting');await page.evaluate("(()=>{const s=document.querySelector('.data-controls select');s.value='static';s.dispatchEvent(new Event('change'));})()");await page.waitFor("document.querySelectorAll('.data-content .mode-grid article').length===2");report.comparison={historyFilter:true,evolutionFilter:true,separateRecords:true};
 assert.deepEqual(page.errors,[]);console.log(JSON.stringify({status:'PASSOU',...report},null,2));
}catch(error){failure=error;console.error('Completed checks:',report);console.error(error);}
try{await page.close();}catch(error){failure??=error;console.error('Cleanup:',error.message);}
if(failure)throw failure;
