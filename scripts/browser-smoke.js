import assert from 'node:assert/strict';
import { checkTrainingFlow } from './training-flow.js';
import { mkdir,writeFile } from 'node:fs/promises';
import { openBrowserPage,pause } from './cdp.js';
const page=await openBrowserPage();const measurements=[],graphics=[];let originalPreferences,trainingFlow=[];
try{
 originalPreferences=await page.evaluate("localStorage.getItem('moba-training:preferences:v1')");
 await page.send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false});assert.equal(await page.evaluate("document.querySelector('h1').textContent"),'Mecânica afiada.\nPrecisão arcana.');
 await page.waitFor("document.querySelector('.hub-recent')?.getAttribute('aria-busy')==='false'");
 assert.equal(await page.evaluate("document.querySelector('.hub-recent').textContent.includes('Sua primeira sessão')"),true);
 for(let index=0;index<4;index++){
  await page.evaluate(`document.querySelectorAll('.hub-choice')[${index}].focus()`);await page.key('Space',' ');
  assert.equal(await page.evaluate(`document.querySelectorAll('.hub-choice')[${index}].getAttribute('aria-pressed')`),'true');
  assert.equal(await page.evaluate("document.querySelectorAll('.hub-choice[aria-pressed=true]').length"),1);
  assert.equal(await page.evaluate("document.querySelectorAll('.hub-step').length"),3);
  assert.equal(await page.evaluate("document.activeElement.classList.contains('hub-choice')"),true);
 }
 await page.evaluate(`(async()=>{
  const {createAttemptRepository}=await import('/src/persistence/attemptRepository.js');
  const {kitingRecord}=await import('/tests/fixtures/kitingRecord.js');
  const repository=createAttemptRepository();try{const record=kitingRecord({id:'home-resume',level:7,controlProfile:'quick-attack'});await repository.saveCompletedAttempt(record);window.qaHomeRecord=JSON.stringify(await repository.getAttemptById(record.attemptId));}finally{repository.close();}
 })()`);
 await page.go('/levels');await page.go('/');await page.waitFor("document.querySelector('.hub-recent a')?.getAttribute('href')==='#/train/kiting/7'");
 await page.evaluate("document.querySelector('.hub-recent a').click()");await page.waitFor("location.hash==='#/train/kiting/7'&&document.querySelector('h1')?.textContent==='Kiting'");
 assert.equal(await page.evaluate("document.querySelectorAll('canvas').length"),0,'Retomada abre a preparação, sem iniciar a sessão.');
 await page.go('/');await page.waitFor("document.querySelector('.hub-recent')?.getAttribute('aria-busy')==='false'");
 await page.evaluate("document.querySelectorAll('.hub-choice')[2].click()");
 assert.equal(await page.evaluate("document.querySelector('.hub-step a[href=\"#/timed/kiting/7\"]')!==null"),true);
 assert.equal(await page.evaluate(`(async()=>{const {createAttemptRepository}=await import('/src/persistence/attemptRepository.js');const repository=createAttemptRepository();try{return await repository.countCompletedAttempts({modality:'kiting'})===1&&JSON.stringify(await repository.getAttemptById('home-resume'))===qaHomeRecord;}finally{repository.close();}})()`),true,'A central apenas consulta os registros.');
 for(const path of ['/levels','/diagnostics','/profile','/settings','/dpi']){await page.go(path);assert.equal(await page.evaluate("document.querySelectorAll('main').length"),1);assert.equal(await page.evaluate("document.documentElement.scrollWidth>innerWidth"),false,`Sem overflow em ${path}`);}
 await page.go('/levels');assert.equal(await page.evaluate("document.querySelectorAll('.level').length"),30);await page.go('/train/dodge');assert.equal(await page.evaluate("document.querySelector('select').options.length"),20);assert.equal(await page.evaluate("/Laboratório|sem pontuação/.test(document.querySelector('main').textContent)"),false);await page.go('/diagnostics');assert.equal(await page.evaluate("document.querySelectorAll('a[href^=\"#/assessment/\"]').length"),4);
 if(!process.env.QA_MENUS_ONLY){
 await page.go('/settings');await page.evaluate("(()=>{const form=[...document.querySelectorAll('form')].find(f=>f.textContent.includes('Qualidade gráfica'));form.querySelectorAll('select')[2].value='leve';form.querySelector('button[type=submit]').click();})()");
 // Record the loop owned by a scene; the wrapper itself never retains completed callbacks.
 await page.evaluate(`(()=>{const request=window.requestAnimationFrame.bind(window),cancel=window.cancelAnimationFrame.bind(window);window.qaFrames=new Set();window.requestAnimationFrame=callback=>{const id=request(time=>{qaFrames.delete(id);callback(time);});qaFrames.add(id);return id;};window.cancelAnimationFrame=id=>{qaFrames.delete(id);cancel(id);};})()`);
 for(let cycle=0;cycle<10;cycle++){if(process.env.QA_TRACE)console.log(`Reentry ${cycle+1}/10 (leve)`);await page.go('/preview');await page.waitFor("document.querySelectorAll('canvas').length===1&&document.querySelector('.stage').dataset.visuals==='ready'",{timeout:30000});await pause(100);const running=await page.evaluate('qaFrames.size');assert.equal(running,1);await page.go('/');await page.send('HeapProfiler.collectGarbage');measurements.push({cycle:cycle+1,frames:await page.evaluate('qaFrames.size'),canvases:await page.evaluate("document.querySelectorAll('canvas').length"),heap:(await page.send('Runtime.getHeapUsage')).usedSize});assert.equal(measurements.at(-1).frames,0);assert.equal(measurements.at(-1).canvases,0);}
 assert.ok(measurements.at(-1).heap-measurements[1].heap<5*1024*1024,'Heap após aquecimento cresce menos de 5 MiB nesta sequência.');
 await page.send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:2,mobile:false});
 for(const [quality,expected]of [['leve',1],['medio',1.2],['alto',1.5],['ultra',1.75]]){
  if(process.env.QA_TRACE)console.log(`Graphics ${quality}`);await page.go('/settings');await page.evaluate(`(()=>{const form=[...document.querySelectorAll('form')].find(f=>f.textContent.includes('Qualidade gráfica'));form.querySelectorAll('select')[2].value='${quality}';form.querySelector('button[type=submit]').click();})()`);await page.go('/preview');await page.waitFor("document.querySelectorAll('canvas').length===1&&document.querySelector('.stage').dataset.visuals==='ready'",{timeout:30000});await pause(100);const dimensions=await page.evaluate("(()=>{const c=document.querySelector('canvas'),r=c.getBoundingClientRect();return {css:r.width,internal:c.width,dpr:devicePixelRatio};})()");assert.equal(dimensions.dpr,2);assert.ok(Math.abs(dimensions.internal/dimensions.css-expected)<.01);graphics.push({quality,...dimensions});await page.go('/');
 }
 }
 if(!process.env.QA_MENUS_ONLY)trainingFlow=await checkTrainingFlow(page,{records:true});
 for(const [width,height]of [[1366,768],[1920,1080],[390,844]]){
  await page.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
  for(const path of ['/','/levels','/train/dodge','/profile']){
   await page.go(path);if(path==='/profile')await page.waitFor("document.querySelectorAll('.rank-badge').length===4");assert.equal(await page.evaluate('document.documentElement.scrollWidth>innerWidth'),false,`Sem overflow em ${path} / ${width}`);
   if(path==='/'){
    await page.waitFor("document.querySelector('.hub-recent')?.getAttribute('aria-busy')==='false'");
    await page.evaluate("document.documentElement.dataset.textSize='large';document.documentElement.dataset.contrast='high'");
    for(let i=0;i<4;i++){await page.evaluate(`document.querySelectorAll('.hub-choice')[${i}].click()`);assert.equal(await page.evaluate('document.documentElement.scrollWidth>innerWidth'),false,`Central sem overflow, texto ampliado, foco ${i} / ${width}`);}
    await page.evaluate("document.documentElement.dataset.textSize='normal';document.documentElement.dataset.contrast='normal'");
   }
   if(process.env.QA_ARTIFACT_DIR){await mkdir(process.env.QA_ARTIFACT_DIR,{recursive:true});const shot=await page.send('Page.captureScreenshot',{format:'png'});await writeFile(`${process.env.QA_ARTIFACT_DIR}/${path==='/'?'home':path.split('/').at(-1)}-${width}.png`,Buffer.from(shot.data,'base64'));}
  }
 }
 assert.deepEqual(page.errors,[]);console.log(JSON.stringify({status:'PASSOU',scope:process.env.QA_MENUS_ONLY?'menus-and-profile':'full',navigation:6,otherTrainingLevels:30,dodgeLevels:20,diagnostics:4,reentryQuality:process.env.QA_MENUS_ONLY?null:'leve',reentries:measurements,graphics,trainingFlow},null,2));
}finally{try{if(originalPreferences!==undefined)await page.evaluate(originalPreferences===null?"localStorage.removeItem('moba-training:preferences:v1')":`localStorage.setItem('moba-training:preferences:v1',${JSON.stringify(originalPreferences)})`);}finally{await page.close();}}
