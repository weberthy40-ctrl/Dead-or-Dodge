// @vitest-environment jsdom
import { createEventBus } from '../../src/core/eventBus.js';
import { createFocusExercise } from '../../src/training/dodge/focusExercise.js';
import { createSession } from '../../src/training/session.js';
import { createDodgeMode } from '../../src/training/dodge/mode.js';
import { createDodgeReplay } from '../../src/training/dodge/replay.js';
import { describe, expect, it, vi } from 'vitest';
import { ARENA,isInsideArena } from '../../src/game3d/spatial.js';
import { createArena } from '../../src/game3d/arena.js';
import { createCharacter } from '../../src/game3d/character.js';
import { mountPreview } from '../../src/game3d/mountPreview.js';
describe('arena and character', () => {
  it('includes the boundary and rejects invalid/external coordinates', () => {
    expect(isInsideArena(ARENA.center)).toBe(true);
    expect(isInsideArena({x:ARENA.bounds.maxX,z:ARENA.bounds.minZ})).toBe(true);
    for (const p of [null,{x:NaN,z:0},{x:ARENA.bounds.maxX+1,z:0},{x:0,z:20}]) expect(isInsideArena(p)).toBe(false);
  });
  it('creates original meshes and disposes shared resources once', () => {
    const arena = createArena(); const resources = new Set();
    arena.group.traverse(node => { if(node.geometry) resources.add(node.geometry); if(node.material) resources.add(node.material); });
    const spies = [...resources].map(resource => vi.spyOn(resource,'dispose'));
    expect(arena.group.children.length).toBeGreaterThan(20); arena.dispose(); arena.dispose();
    spies.forEach(spy => expect(spy).toHaveBeenCalledTimes(1));
  });
  it('supports a passive pose, known front and finite validated inputs', () => {
    const character = createCharacter(); expect(character.group.position.y).toBe(ARENA.groundY);
    character.setPose({x:1,z:2}, Math.PI); expect(character.group.position.x).toBe(1);
    expect(() => character.setPose({x:Infinity,z:0})).toThrow();
    expect(() => createCharacter({scale:0})).toThrow(); character.dispose(); character.dispose();
  });
});
describe('preview lifecycle without WebGL', () => {
  function renderer() { return { domElement:document.createElement('canvas'), setPixelRatio:vi.fn(), setSize:vi.fn(),render:vi.fn(),dispose:vi.fn(),forceContextLoss:vi.fn() }; }
  it('mounts once, handles resize and replaces/releases previous resources', () => {
    const container = document.createElement('div'); const first = renderer(), second = renderer();
    const disconnect = vi.fn(); class Observer { observe() {} disconnect() {disconnect();} }
    const preview = mountPreview(container,{controls:false,createRenderer:()=>first,ResizeObserverClass:Observer});
    window.dispatchEvent(new Event('resize')); expect(first.render).toHaveBeenCalled();
    const next = mountPreview(container,{controls:false,createRenderer:()=>second,ResizeObserverClass:Observer});
    expect(first.dispose).toHaveBeenCalledTimes(1); expect(container.querySelectorAll('canvas')).toHaveLength(1);
    preview.dispose(); next.dispose(); next.dispose(); expect(second.dispose).toHaveBeenCalledTimes(1); expect(disconnect).toHaveBeenCalledTimes(2);
    expect(container.children).toHaveLength(0);
  });
  it('shows an accessible error and remains disposable on context creation failure', () => {
    const container = document.createElement('div'); const onError = vi.fn();
    const preview = mountPreview(container,{createRenderer:()=>{throw Error('No WebGL');},onError});
    expect(container.querySelector('[role=alert]').textContent).toContain('WebGL'); expect(onError).toHaveBeenCalledTimes(1);
    preview.dispose(); expect(container.children).toHaveLength(0);
  });
});

it.each([{rules:'challenge',step:50,lives:2},{rules:'survival',step:33,lives:0}])('renders a real accepted beam impact in $rules and read-only review with a frozen clock',({rules,step,lives})=>{
 vi.spyOn(document,'hidden','get').mockReturnValue(false);const events=createEventBus(),session=createSession({countdown:0,timeLimit:30,events}),mode=createDodgeMode({session,mode:rules,level:5,events}),exercise=createFocusExercise({family:'beam',events,attemptId:session.snapshot().id,isRunning:()=>session.snapshot().state==='running'}),recording=createDodgeReplay(),container=document.createElement('div');document.body.append(container);let callback,preview;
 const renderer={domElement:document.createElement('canvas'),setPixelRatio(){},setSize(){},render:vi.fn(),dispose(){},forceContextLoss(){}};
 preview=mountPreview(container,{exercise,session,events,createRenderer:()=>renderer,fullscreenControls:false,requestFrame:fn=>{callback=fn;return 1;},cancelFrame(){},onStep:(_dt,_from,to)=>recording.capture({...exercise.snapshot(),impactEchoes:preview.getImpactSnapshot()},to,0,{force:Boolean(mode.snapshot().outcome)})});
 session.start();callback(0);for(let t=step;t<=2750;t+=step)callback(t);expect(mode.snapshot().lives).toBe(lives);expect(exercise.snapshot().projectiles).toHaveLength(0);expect(preview.getImpactSnapshot()).toHaveLength(1);const liveScene=renderer.render.mock.calls.at(-1)[0];expect(liveScene.getObjectByName('impact-beam').parent.visible).toBe(true);if(lives===0){expect(session.snapshot().state).toBe('completed');expect(recording.snapshot().frames.at(-1).time).toBe(session.snapshot().elapsed);}
 const snapshot=preview.getImpactSnapshot();session.pause();callback(2800);expect(preview.getImpactSnapshot()).toEqual(snapshot);const state=session.snapshot(),frames=recording.snapshot().frames,frame=frames.at(-1),reviewHost=document.createElement('div'),reviewRenderer={...renderer,domElement:document.createElement('canvas'),render:vi.fn()};const review=mountPreview(reviewHost,{controls:false,exercise:{kind:'dodge',snapshot:()=>frame.snapshot},createRenderer:()=>reviewRenderer,fullscreenControls:false});
 review.presentFrame(frame);const reviewScene=reviewRenderer.render.mock.calls.at(-1)[0];expect(reviewScene.getObjectByName('impact-beam').parent.visible).toBe(true);review.presentFrame(frames[0]);expect(reviewScene.getObjectByName('impact-beam').parent.visible).toBe(false);expect(session.snapshot()).toEqual(state);review.dispose();preview.dispose();expect(events.emit('dodge:trajectory',{attemptId:session.snapshot().id,id:'late'})).toBe(0);exercise.dispose();mode.dispose();session.dispose();container.remove();
});
