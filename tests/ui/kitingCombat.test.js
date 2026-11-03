// @vitest-environment jsdom
import { it,expect,vi } from 'vitest';
import { createCore } from '../../src/core/createCore.js';
import { mountKiting } from '../../src/ui/kitingScreen.js';
import { DEFAULT_PREFERENCES,PREFERENCES_KEY } from '../../src/settings/preferences.js';
const flush=async()=>{for(let i=0;i<5;i++)await Promise.resolve();};
it('explains command state and cancellation from observed events while keeping saved metrics unchanged',async()=>{
 const screen=document.createElement('main');document.body.append(screen);const core=createCore(),repository={saveCompletedAttempt:vi.fn(async()=>{})};let current,commandState={armed:true,pending:null};
 const view=mountKiting({screen,core,timed:true,repository,loadPreview:async()=>({mountPreview(_stage,options){current=options;return {movement:{snapshot:()=>({position:{x:0,z:0}})},getCommandState:()=>commandState,dispose(){}};}})});await flush();
 expect(screen.querySelector('.kiting-timing').dataset.phase).toBe('idle');[...screen.querySelectorAll('button')].find(b=>b.textContent==='Iniciar treino').click();
 for(let i=0;i<31;i++)current.session.update(.1);current.onTick();expect(screen.querySelector('.kiting-timing').dataset.phase).toBe('armed');
 commandState={armed:false,pending:{x:10,z:10}};current.onTick();expect(screen.querySelector('.kiting-timing').dataset.phase).toBe('approach');commandState={armed:false,pending:null};
 current.exercise.click('kiting-target');current.onTick();expect(screen.querySelector('.kiting-timing').dataset.phase).toBe('windup');expect(screen.querySelector('.kiting-target-hint').textContent).toContain('dentro do alcance');current.exercise.moveCommand();current.onTick();expect(screen.querySelector('.kiting-phase-hint').textContent).toContain('Movimento, parada ou Flash');
 const value=screen.querySelector('progress').value;current.session.pause();current.exercise.update(.1);current.onTick();expect(screen.querySelector('.kiting-timing').dataset.phase).toBe('paused');expect(screen.querySelector('progress').value).toBe(value);current.session.resume();
 for(let i=0;i<600&&!screen.querySelector('dialog').open;i++){const before=current.session.snapshot().elapsed;current.session.update(.1);current.exercise.update(current.session.snapshot().elapsed-before);current.onTick();}await flush();
 expect(screen.querySelector('.kiting-coaching').textContent).toContain('Interrupções por comando: 1');expect(screen.querySelector('.kiting-coaching').textContent).toContain('Amostra curta');expect(screen.querySelector('.kiting-practice-link').hash).toBe('#/practice/kiting');expect(repository.saveCompletedAttempt).toHaveBeenCalledOnce();expect(repository.saveCompletedAttempt.mock.calls[0][0].metrics).not.toHaveProperty('lastCancellation');
 view.dispose();expect(core.events.emit('kiting:cancelled',{attemptId:current.session.snapshot().id,attackId:'attack-999',reason:'command'})).toBe(0);core.dispose();screen.remove();
});
it('ends a fatal combat in a centered summary, saves it once and replays with full health',async()=>{
 const screen=document.createElement('main');screen.className='training-screen';document.body.append(screen);const core=createCore(),repository={saveCompletedAttempt:vi.fn(async()=>{})};let current;
 const view=mountKiting({screen,core,timed:true,initialLevel:5,repository,loadPreview:async()=>({mountPreview(_stage,options){current=options;return {movement:{snapshot:()=>({position:{x:0,z:0}})},dispose(){}};}})});await flush();[...screen.querySelectorAll('button')].find(b=>b.textContent==='Iniciar treino').click();const originalId=current.session.snapshot().id;
 for(let i=0;i<600&&!screen.querySelector('dialog').open;i++){const before=current.session.snapshot().elapsed;current.session.update(.1);current.exercise.update(current.session.snapshot().elapsed-before);current.onTick();}await flush();const dialog=screen.querySelector('dialog');expect(dialog.open).toBe(true);expect(dialog.hidden).toBe(false);expect(dialog.textContent).toContain('Derrota');expect(dialog.textContent).toContain('Vida 0/100');expect(dialog.querySelector('.result-actions').textContent).toContain('Voltar ao menu');expect(repository.saveCompletedAttempt).toHaveBeenCalledOnce();expect(repository.saveCompletedAttempt.mock.calls[0][0]).toMatchObject({variant:'combat',endReason:'defeat',metrics:{health:0,damageTaken:100}});
 dialog.querySelector('.result-actions button').click();await flush();expect(dialog.open).toBe(false);expect(current.session.snapshot().id).not.toBe(originalId);expect(current.exercise.snapshot()).toMatchObject({health:100,defeated:false});view.dispose();core.dispose();screen.remove();
});
it('restores the input preference, freezes it during play and saves the selected profile',async()=>{
 localStorage.setItem(PREFERENCES_KEY,JSON.stringify({...DEFAULT_PREFERENCES,kitingControls:'attack-click'}));
 const screen=document.createElement('main');document.body.append(screen);const core=createCore(),repository={saveCompletedAttempt:vi.fn(async()=>{})};let current;
 const view=mountKiting({screen,core,timed:true,initialLevel:5,repository,loadPreview:async()=>({mountPreview(stage,options){current=options;stage.replaceChildren(document.createElement('canvas'));return {movement:{snapshot:()=>({position:{x:0,z:0}})},dispose(){}};}})});await flush();
 const select=screen.querySelector('[aria-label="Comandos de Kiting"]');expect(select.value).toBe('attack-click');select.value='quick-attack';select.dispatchEvent(new Event('change'));await flush();expect(JSON.parse(localStorage.getItem(PREFERENCES_KEY)).kitingControls).toBe('quick-attack');
 [...screen.querySelectorAll('button')].find(b=>b.textContent==='Iniciar treino').click();expect(select.disabled).toBe(true);expect(document.activeElement).toBe(screen.querySelector('canvas'));
 for(let i=0;i<600&&!screen.querySelector('dialog').open;i++){const before=current.session.snapshot().elapsed;current.session.update(.1);current.exercise.update(current.session.snapshot().elapsed-before);current.onTick();}await flush();
 expect(repository.saveCompletedAttempt.mock.calls[0][0]).toMatchObject({metrics:{controlProfile:'quick-attack'},score:{controlProfile:'quick-attack'}});expect(screen.querySelector('dialog').textContent).toContain('A imediato');expect(select.disabled).toBe(false);
 view.dispose();core.dispose();screen.remove();localStorage.clear();
});
