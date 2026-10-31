import assert from 'node:assert/strict';
import { mkdir,writeFile } from 'node:fs/promises';
import { openBrowserPage } from './cdp.js';
process.env.CDP_TIMEOUT_MS??='45000';
const page=await openBrowserPage(),report={};
async function shot(name){if(!process.env.QA_ARTIFACT_DIR)return;await mkdir(process.env.QA_ARTIFACT_DIR,{recursive:true});await writeFile(`${process.env.QA_ARTIFACT_DIR}/${name}.png`,Buffer.from((await page.send('Page.captureScreenshot',{format:'png'})).data,'base64'));}
async function advance(ms){for(let t=0;t<ms;t+=100){await page.evaluate('qaClock+=100');await page.evaluate('qaNextFrame()');}}
try{
 await page.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
 assert.equal(await page.evaluate("document.title"),'RIFT LAB');assert.equal(await page.evaluate("Boolean(document.querySelector('a[href=\"#/journey/dodge\"]'))"),true);await shot('rift-entry');
 await page.evaluate(`(async()=>{const {createAttemptRepository}=await import('/src/persistence/attemptRepository.js'),{kitingRecord}=await import('/tests/fixtures/kitingRecord.js');const r=createAttemptRepository();try{await r.saveCompletedAttempt(kitingRecord({id:'rift-existing'}));window.qaExisting=JSON.stringify(await r.getAttemptById('rift-existing'));}finally{r.close();}})()`);
 await page.go('/profile');await page.waitFor("document.querySelectorAll('.rank-badge').length===4");const originalRank=await page.evaluate("document.querySelector('.overall-rank').textContent");
 await page.go('/journey/dodge');assert.equal(await page.evaluate("document.querySelectorAll('.journey-step').length"),4);assert.equal(await page.evaluate("document.querySelectorAll('.focus-card').length"),5);await shot('rift-journey');
 await page.go('/prepare/dodge');assert.match(await page.evaluate("document.querySelector('.preparation-controls').textContent"),/Flash.*dash.*Y/);await shot('rift-preparation');
 await page.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});assert.equal(await page.evaluate('document.documentElement.scrollWidth>innerWidth'),false);await page.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
 await page.go('/settings');assert.equal(await page.evaluate("[...document.querySelectorAll('form')].find(f=>f.textContent.includes('Qualidade gráfica')).querySelectorAll('select')[2].options.length"),4);
 await page.go('/play/dodge/normal/20');await page.waitFor("document.querySelector('.arena-ready button')?.disabled===false",{timeout:45000});assert.equal(await page.evaluate('location.hash'),'#/play/dodge/normal/20');assert.equal(await page.evaluate("localStorage.getItem('moba-training:dodge-placement:v1')"),null);await shot('rift-expert-preparation');
 report.families=[];
 for(const [family,quality,time]of [['linear','leve',2200],['lance','medio',2600],['hook','alto',2800],['beam','ultra',2700],['area','medio',1700]]){
  await page.go('/');await page.evaluate(`(async()=>{const {loadPreferences,savePreferences}=await import('/src/settings/preferences.js');savePreferences(localStorage,{...loadPreferences(localStorage),quality:${JSON.stringify(quality)},muted:true});})()`);
  await page.go(`/focus/dodge/${family}`);await page.waitFor("document.querySelector('.arena-ready button')?.disabled===false&&document.querySelector('.stage')?.dataset.visuals==='ready'",{timeout:45000});await page.clickButton('Iniciar exercício');
  await page.evaluate(`(()=>{window.qaClock=performance.now();const request=window.requestAnimationFrame.bind(window);window.qaNextFrame=()=>new Promise(resolve=>request(()=>resolve(true)));window.qaRestoreClock=()=>{window.requestAnimationFrame=request;delete performance.now;};window.requestAnimationFrame=callback=>request(()=>callback(window.qaClock));Object.defineProperty(performance,'now',{configurable:true,value:()=>window.qaClock});})()`);await page.evaluate('qaNextFrame()');
  await advance(time);await shot(`rift-${family}-${quality}`);report.families.push({family,quality});
  if(family==='area'){
   const point={x:1080,y:520};await page.send('Input.dispatchMouseEvent',{type:'mouseMoved',...point});await page.key('KeyD','d');await advance(900);await shot('rift-area-impact');
   await advance(8000);await page.waitFor("document.querySelector('dialog.result-metrics').open");assert.match(await page.evaluate("document.querySelector('dialog').textContent"),/Treino focado/);assert.equal(await page.evaluate("document.querySelector('.series-save-status')===null"),true);await shot('rift-focus-result');
   await page.clickButton('Rever últimos 6 s','dialog');await page.waitFor("document.querySelector('.replay-stage')?.dataset.visuals==='ready'",{timeout:45000});await shot('rift-focus-review');await page.clickButton('Fechar revisão','dialog');
  }
  await page.evaluate('qaRestoreClock()');
 }
 await page.go('/profile');await page.waitFor("document.querySelectorAll('.rank-badge').length===4");assert.equal(await page.evaluate("document.querySelector('.overall-rank').textContent"),originalRank);
 assert.deepEqual(await page.evaluate(`(async()=>{const {createAttemptRepository}=await import('/src/persistence/attemptRepository.js');const r=createAttemptRepository();try{return {count:(await r.exportBackupData()).attempts.length,unchanged:JSON.stringify(await r.getAttemptById('rift-existing'))===qaExisting,placement:localStorage.getItem('moba-training:dodge-placement:v1')};}finally{r.close();}})()`),{count:1,unchanged:true,placement:null});
 assert.deepEqual(page.errors,[]);console.log(JSON.stringify({status:'PASSOU',...report,journeyOptional:true,expertNormal:true,focusedReview:true,existingProgressPreserved:true,clock:'Controlled simulation for reproducible visual captures; physical performance is not measured'},null,2));
}finally{await page.close();}
