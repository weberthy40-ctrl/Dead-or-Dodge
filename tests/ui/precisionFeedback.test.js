// @vitest-environment jsdom
import { expect,it,vi } from 'vitest';
import { createCore } from '../../src/core/createCore.js';
import { mountPrecisionPractice } from '../../src/ui/precisionPracticeScreen.js';
const flush=async()=>{for(let i=0;i<5;i++)await Promise.resolve();};
it('shows observed errors, pauses feedback and presents a saved result without adding transient fields',async()=>{
 const screen=document.createElement('main');document.body.append(screen);const core=createCore(),repository={saveCompletedAttempt:vi.fn(async()=>{})};let current;
 const view=mountPrecisionPractice({screen,core,timed:true,repository,loadPreview:async()=>({mountPreview(stage,options){current=options;stage.replaceChildren(document.createElement('canvas'));return {dispose(){}};}})});await flush();
 [...screen.querySelectorAll('button')].find(b=>b.textContent==='Iniciar treino').click();expect(document.activeElement).toBe(screen.querySelector('canvas'));for(let i=0;i<31;i++)current.session.update(.1);
 for(let group=0;group<2;group++){const total=current.exercise.snapshot().targets.length;for(let i=0;i<total;i++)current.exercise.hit(current.exercise.snapshot().targets[0].id);}
 const wrong=current.exercise.snapshot().targets[1];current.exercise.hit(wrong.id);current.onTick();expect(screen.querySelector('.precision-feedback').textContent).toContain('Ordem incorreta');current.exercise.miss();current.onTick();expect(screen.querySelector('.precision-feedback').textContent).toContain('sem alvo');
 current.session.pause();const frozen=current.exercise.snapshot();current.session.update(.1);current.onTick();expect(screen.querySelector('.precision-guidance').dataset.mode).toBe('paused');expect(current.exercise.snapshot()).toEqual(frozen);current.session.resume();
 for(let i=0;i<600&&!screen.querySelector('dialog').open;i++){const before=current.session.snapshot().elapsed;current.session.update(.1);current.exercise.update(current.session.snapshot().elapsed-before);current.onTick();}await flush();
 expect(screen.querySelector('dialog').open).toBe(true);expect(screen.querySelector('.precision-save-status').textContent).toContain('Salvo neste dispositivo');expect(screen.querySelector('.precision-coaching').textContent).toContain('Cliques sem alvo');expect(screen.querySelector('.precision-coaching').textContent).toContain('Erros de ordem');expect(screen.querySelector('.precision-practice-link').hash).toBe('#/practice/precision');expect(repository.saveCompletedAttempt).toHaveBeenCalledOnce();const metrics=repository.saveCompletedAttempt.mock.calls[0][0].metrics;expect(metrics).toMatchObject({misses:2,orderErrors:1});expect(metrics).not.toHaveProperty('feedback');
 const old=current.session.snapshot().id;screen.querySelector('.result-actions button').click();await flush();expect(current.session.snapshot().id).not.toBe(old);expect(screen.querySelector('dialog').open).toBe(false);expect(current.exercise.snapshot().misses).toBe(0);view.dispose();expect(core.events.emit('precision:feedback',{attemptId:old,type:'miss'})).toBe(0);core.dispose();screen.remove();
});
it('preserves the technical level-four configuration and keeps practice out of official persistence',async()=>{
 const screen=document.createElement('main');document.body.append(screen);const core=createCore(),repository={saveCompletedAttempt:vi.fn()};let current;
 const view=mountPrecisionPractice({screen,core,repository,loadPreview:async()=>({mountPreview(_stage,options){current=options;return {dispose(){}};}})});await flush();[...screen.querySelectorAll('button')].find(b=>b.textContent==='Iniciar prática').click();expect(current.exercise.snapshot().groupTotal).toBe(6);current.exercise.miss();current.onTick();expect(repository.saveCompletedAttempt).not.toHaveBeenCalled();expect(screen.querySelector('dialog').open).toBe(false);view.dispose();core.dispose();screen.remove();
});
