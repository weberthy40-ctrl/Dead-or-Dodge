import assert from 'node:assert/strict';
import { mkdir,writeFile } from 'node:fs/promises';
import { openBrowserPage,pause } from './cdp.js';
import { GAME_VERSION } from '../src/app/version.js';
process.env.CDP_TIMEOUT_MS??='45000';
const page=await openBrowserPage(),reports=[];
async function shot(name){if(!process.env.QA_ARTIFACT_DIR)return;await mkdir(process.env.QA_ARTIFACT_DIR,{recursive:true});await writeFile(`${process.env.QA_ARTIFACT_DIR}/${name}.png`,Buffer.from((await page.send('Page.captureScreenshot',{format:'png'})).data,'base64'));}
try{
 await page.send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false});
 await page.evaluate(`(async()=>{const {DEFAULT_PREFERENCES,savePreferences}=await import('/src/settings/preferences.js');savePreferences(localStorage,{...DEFAULT_PREFERENCES,quality:'medio',muted:true});const {createAttemptRepository}=await import('/src/persistence/attemptRepository.js'),{kitingRecord}=await import('/tests/fixtures/kitingRecord.js');const repository=createAttemptRepository();try{await repository.saveCompletedAttempt(kitingRecord({id:'quality-existing'}));window.qaQualityExisting=JSON.stringify(await repository.getAttemptById('quality-existing'));}finally{repository.close();}})()`);
 const savedPreferences=await page.evaluate("localStorage.getItem('moba-training:preferences:v1')");
 await page.go('/prepare/dodge');assert.equal(await page.evaluate("Boolean(document.querySelector('a[href=\"#/check/dodge\"]'))"),true);await page.go('/check/dodge');
 await page.waitFor("document.querySelector('.probe-intro button')?.disabled===false",{timeout:45000});
 await page.evaluate("(()=>{const select=document.querySelector('.probe-intro select');select.value='leve';select.dispatchEvent(new Event('change'));})()");await page.waitFor("document.querySelector('.probe-intro button')?.disabled===false&&document.querySelector('.probe-intro select').value==='leve'",{timeout:45000});await shot('quality-ready');
 await page.evaluate("(()=>{const create=URL.createObjectURL.bind(URL);URL.createObjectURL=blob=>{window.qaQualityReport=blob.text().then(JSON.parse);return create(blob);};document.addEventListener('click',event=>{if(event.target.closest('a[download]'))event.preventDefault();},true);})()");
 for(const [index,quality]of ['leve','ultra'].entries()){
  if(index){await page.evaluate("document.querySelector('.probe-next-quality select').value='ultra'");await page.clickButton('Repetir verificação','dialog');await page.waitFor("document.querySelector('.probe-intro button')?.disabled===false&&document.querySelector('.stage')?.dataset.visuals==='ready'",{timeout:45000});}
  await page.clickButton('Iniciar verificação');
  if(index===0){
   const point={x:900,y:430};await page.send('Input.dispatchMouseEvent',{type:'mouseMoved',...point});await page.mouse(point,'right');for(const [code,key]of [['KeyE','e'],['KeyD','d'],['KeyS','s'],['KeyY','y'],['Space',' ']])await page.key(code,key);
   await page.waitFor("(document.querySelector('.probe-commands').textContent.match(/✓/g)||[]).length===6",{timeout:15000});await page.clickButton('Pausar','.probe-hud');await page.waitFor("document.querySelector('.probe-status').textContent.startsWith('Pausado')");const status=await page.evaluate("document.querySelector('.probe-status').textContent");await pause(350);assert.equal(await page.evaluate("document.querySelector('.probe-status').textContent"),status);await shot('quality-paused');await page.clickButton('Retomar','.probe-hud');
  }
  await page.waitFor("document.querySelector('dialog.probe-result')?.open",{timeout:120000,interval:250});assert.equal(await page.evaluate("document.querySelectorAll('.probe-comparison tbody tr').length"),index+1);
  await page.clickButton('Baixar relatório','dialog');const report=await page.evaluate('qaQualityReport');assert.equal(report.quality,quality);assert.equal(report.gameVersion,GAME_VERSION);assert.equal(report.metrics.status,'measured');assert.equal(report.scenario,'rift-fluency-v1');assert.ok(report.metrics.averageFps>0&&Number.isFinite(report.metrics.p95Ms));assert.equal(report.render.quality,quality);assert.equal(report.viewportChanges,0);assert.equal(await page.evaluate("localStorage.getItem('moba-training:preferences:v1')"),savedPreferences);
  if(index===0)for(const command of ['move','stop','dash','flash','camera','recenter'])assert.equal(report.metrics.commands[command],1);
  reports.push(report);await page.evaluate("document.querySelector('.probe-comparison').scrollIntoView({block:'center'})");await pause(100);await shot(`quality-${quality}-report`);
 }
 await page.go('/');assert.equal(await page.evaluate("document.querySelectorAll('canvas').length"),0);
 assert.deepEqual(await page.evaluate(`(async()=>{const {createAttemptRepository}=await import('/src/persistence/attemptRepository.js');const r=createAttemptRepository();try{return {count:(await r.exportBackupData()).attempts.length,unchanged:JSON.stringify(await r.getAttemptById('quality-existing'))===qaQualityExisting,placement:localStorage.getItem('moba-training:dodge-placement:v1')};}finally{r.close();}})()`),{count:1,unchanged:true,placement:null});
 await page.go('/check/dodge');await page.waitFor("document.querySelector('.probe-intro button')?.disabled===false",{timeout:45000});await page.clickButton('Iniciar verificação');await page.go('/');assert.equal(await page.evaluate("document.querySelectorAll('canvas').length"),0);assert.deepEqual(page.errors,[]);
 if(process.env.QA_ARTIFACT_DIR)await writeFile(`${process.env.QA_ARTIFACT_DIR}/observed-reports.json`,JSON.stringify({environment:'Automated headless QA; these values do not certify physical hardware or input latency',reports},null,2));
 console.log(JSON.stringify({status:'PASSOU',naturalClock:true,temporaryQuality:true,pause:true,acceptedNativeCommands:true,comparisonRows:2,explicitExport:true,officialDataPreserved:true,cancelledSceneDisposed:true,physicalHardware:'Not certified by headless QA'},null,2));
}finally{await page.close();}
