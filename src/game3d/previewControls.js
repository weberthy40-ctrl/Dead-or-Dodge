import { createKitingCommands } from './kitingCommands.js';
import { KITING_CONTROLS } from '../settings/kitingControls.js';
import * as THREE from 'three';
import { createMovement,safeDelta,DODGE_MOVEMENT_SPEED,KITING_MOVEMENT_SPEED,DODGE_DASH_RANGE } from '../training/movement.js';
import { createCameraController,edgeIntent } from './cameraController.js';
import { loadPreferences } from '../settings/preferences.js';
import { loadCameraSettings } from '../settings/cameraSettings.js';
import { ARENA,DODGE_ARENA } from './spatial.js';
import { CAMERA,DODGE_CAMERA,DODGE_ZOOM } from './cameraConfig.js';
export function attachPreviewControls({container,renderer,camera,character,render,onError=()=>{},session,exercise,visuals,feedback,events,onTick=()=>{},onStep=()=>{},onVisualStep=()=>{},onFrame,onDiagnosticInput,requestFrame,cancelFrame}) {
  const document=container.ownerDocument, window=document.defaultView, canvas=renderer.domElement;
  const world=!['precision','reflex'].includes(exercise?.kind),dodge=Boolean(exercise)&&!['precision','reflex','kiting'].includes(exercise.kind);
  const arena=dodge?DODGE_ARENA:ARENA,viewConfig=dodge?DODGE_CAMERA:CAMERA;
  const movement=createMovement(dodge?{arena,speed:exercise.snapshot().playerSpeed??DODGE_MOVEMENT_SPEED}:exercise?.kind==='kiting'?{speed:exercise.snapshot().config?.playerSpeed??KITING_MOVEMENT_SPEED}:{}), controller=createCameraController(dodge?{arena,initialZoom:DODGE_ZOOM.initial,followSmoothing:.035,zoomLimits:DODGE_ZOOM}:{arena});
  const raycaster=new THREE.Raycaster(), plane=new THREE.Plane(new THREE.Vector3(0,1,0),-ARENA.groundY);
  const cursor=new THREE.Vector2(), point=new THREE.Vector3();
  let disposed=false, frame=null, last=null, pan={x:0,z:0},flashRemaining=0,dashRemaining=0,pointerKnown=false;
  let preferences;
  try {preferences=loadCameraSettings(window.localStorage);} catch {preferences=loadCameraSettings(null);}
  const status=document.createElement('p');status.className='preview-instructions';status.setAttribute('aria-live','polite');container.append(status);
  let bindings;try{bindings=loadPreferences(window.localStorage);}catch{bindings=loadPreferences(null);}
  const ability=document.createElement('p');ability.className='ability-hud';ability.hidden=!world;container.append(ability);
  const cameraButton=dodge?document.createElement('button'):null;
  if(cameraButton){cameraButton.type='button';cameraButton.className='button camera-toggle';cameraButton.title='Y alterna a câmera; Espaço centraliza sem travar.';cameraButton.addEventListener('click',()=>{toggleCamera();canvas.tabIndex=-1;canvas.focus({preventScroll:true});});container.append(cameraButton);}
  const running=()=>!session || session.snapshot().state==='running';
  const kiting=exercise?.kind==='kiting'?createKitingCommands({exercise,movement,isRunning:running,profile:exercise.snapshot().controlProfile}):null;
  const unsubscribe=events?.on?.('session:changed',s=>{if(kiting&&s.id===session?.snapshot().id&&s.state!=='running'){kiting.cancel();range();}});
  const stopAttackFeedback=kiting?events?.on?.('kiting:confirmed',event=>{if(event.attemptId===session?.snapshot().id&&running())character.onAbility?.('attack');}):null;
  function range(){visuals?.setRangeVisible?.(Boolean(kiting?.snapshot().rangeVisible));}
  const editable=target=>target?.closest?.('input,textarea,select,button,a,dialog,[contenteditable="true"]');
  function pose(dt=0,updateView=true,viewDelta=dt) {
    kiting?.update();if(kiting)range();if(running()) movement.update(dt);
    const snapshot=movement.snapshot(),combat=exercise?.kind==='kiting'?exercise.snapshot():null;
    if(dodge){const vitals=exercise.snapshot();character.setHealthVisible?.(Boolean(vitals.maxLives));if(vitals.maxLives)character.setHealth?.(vitals.lives/vitals.maxLives);}
    if(combat?.maxHealth)character.setHealth?.(combat.health/combat.maxHealth);
    character.setPose(snapshot.position,combat?.phase==='windup'?Math.atan2(combat.target.position.x-snapshot.position.x,combat.target.position.z-snapshot.position.z):snapshot.angle);
    if(!updateView)return;
    const center=controller.update(snapshot.position,running()?pan:{x:0,z:0},viewDelta,preferences), view=controller.snapshot();
    const fit=Math.max(1,1/camera.aspect),framing=dodge&&session?.snapshot().state==='idle'?1.7:view.zoom;
    const precision=exercise?.kind==='precision';
    camera.position.set(precision?0:center.x+viewConfig.x*framing*fit,precision?34:viewConfig.y*framing*fit,precision ? .001 : center.z+viewConfig.z*framing*fit);
    camera.lookAt(precision?0:center.x,0,precision?0:center.z);camera.updateMatrixWorld();
    if(cameraButton){const label=`Câmera ${view.locked?'travada':'livre'} · Y`;if(cameraButton.textContent!==label){cameraButton.textContent=label;cameraButton.setAttribute('aria-pressed',String(view.locked));}}
    const abilityText=`${bindings.flashKey.replace('Key','')} · Flash ${flashRemaining>0?Math.ceil(flashRemaining)+'s':'pronto'}${dodge?`   /   ${bindings.dashKey.replace('Key','')} · Dash ${dashRemaining>0?Math.ceil(dashRemaining)+'s':'pronto'}`:''}   /   ${bindings.stopKey.replace('Key','')} · Parar`;
    if(ability.textContent!==abilityText){ability.replaceChildren();const parts=abilityText.split('   /   ');for(const [i,text]of parts.entries()){if(i)ability.append(document.createTextNode('   /   '));const slot=document.createElement('span');slot.className='ability-slot';slot.dataset.ready=String(i===0?flashRemaining<=0:i===1&&dodge?dashRemaining<=0:true);slot.textContent=text;ability.append(slot);}}
    const instructionText=exercise?.kind==='reflex'?'TECLADO / MOUSE · responda ao sinal   /   ESC · pausar':precision?'ESQUERDO · acertar os alvos   /   ESC · pausar':`DIREITO · mover   /   ${exercise?.kind==='kiting'?`${KITING_CONTROLS[kiting.snapshot().profile].label.toUpperCase()}${kiting.snapshot().armed?' · CLIQUE PARA CONFIRMAR':''}   /   `:''}Y · câmera ${view.locked?'travada':'livre'}   /   ESPAÇO · centralizar   /   RODA · zoom   /   ESC · pausar`;
    if(status.textContent!==instructionText)status.textContent=instructionText;
  }
  function toggleCamera(){controller.toggle();if(dodge&&controller.snapshot().locked)controller.recenter(movement.snapshot().position);onDiagnosticInput?.('camera');pose();render();}
  function tick(time) {
    try { tickFrame(time); } catch(error) { api.dispose(); onError(error); }
  }
  function tickFrame(time,schedule=true) {
    if(schedule)frame=null;if(disposed||document.hidden)return;
    const wasAnimating=!session||['running','countdown'].includes(session.snapshot().state);
    const frameTime=last===null?time:Math.max(time,last),dt=last===null?0:(frameTime-last)/1000;last=frameTime;
    // Preserve real speed on slower frames, with bounded physics substeps and one render.
    const frameDelta=Number.isFinite(dt)?Math.max(0,Math.min(.5,dt)):0,steps=Math.max(1,Math.ceil(frameDelta/.05));
    for(let step=0;step<steps;step++){
      const elapsedBefore=session?.snapshot().elapsed;session?.update(frameDelta/steps);
      const activeDelta=session?session.snapshot().elapsed-elapsedBefore:safeDelta(frameDelta/steps);
      flashRemaining=Math.max(0,flashRemaining-activeDelta);dashRemaining=Math.max(0,dashRemaining-activeDelta);
      const previous=movement.snapshot().position;pose(activeDelta,!dodge);if(!running()){kiting?.cancel();visuals?.setRangeVisible?.(false);}
      if(running()&&exercise){if(dodge)exercise.update(activeDelta,previous,movement.snapshot().position,{allowSpawns:schedule});else exercise.update(activeDelta,previous,movement.snapshot().position);if(!dodge)visuals.sync(exercise.snapshot(),movement.snapshot().position);}
      const nextPosition=movement.snapshot().position;character.animate?.({moving:Math.hypot(nextPosition.x-previous.x,nextPosition.z-previous.z)>1e-6,attackPhase:exercise?.kind==='kiting'?exercise.snapshot().phase:null,state:session?.snapshot().state??'running'},activeDelta);feedback?.update(activeDelta);onVisualStep(activeDelta);onStep(activeDelta,previous,nextPosition);if(disposed)return;onTick();if(disposed)return;
    }
    if(dodge){pose(0,schedule,frameDelta);visuals?.sync?.(exercise?.snapshot(),movement.snapshot().position);}
    if(schedule){if(wasAnimating||!session||['running','countdown'].includes(session.snapshot().state)){render();onFrame?.();}if(!disposed)frame=requestFrame(tick);}
  }

  function start() {if(!disposed&&!document.hidden&&frame===null){last=null;frame=requestFrame(tick);}}
  function suspend() {kiting?.cancel();visuals?.setRangeVisible?.(false);pan={x:0,z:0};last=null;session?.pause();}
  function visibility() {suspend();if(document.hidden){if(frame!==null)cancelFrame(frame);frame=null;}else start();}
  function pointer(event) {const rect=canvas.getBoundingClientRect();if(rect.width>0&&rect.height>0){cursor.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);pointerKnown=true;}pan=edgeIntent(event.clientX-rect.left,event.clientY-rect.top,rect.width,rect.height);}
  function flush(){if(last!==null)tickFrame(window.performance.now(),false);}
  function down(event) {
    if(!running()||![0,2].includes(event.button))return;
    let displayedAim=null;
    if(dodge&&event.button===2){const rect=canvas.getBoundingClientRect();if(rect.width>0&&rect.height>0){cursor.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(cursor,camera);if(raycaster.ray.intersectPlane(plane,point))displayedAim={x:point.x,z:point.z};pointerKnown=true;}}
    if(exercise?.kind!=='precision')flush();if(disposed||!running())return;
    const rect=canvas.getBoundingClientRect();
    if(rect.width<=0||rect.height<=0||event.clientX<rect.left||event.clientY<rect.top||event.clientX>rect.left+rect.width||event.clientY>rect.top+rect.height)return;
    cursor.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
    pointerKnown=true;canvas.tabIndex=-1;canvas.focus({preventScroll:true});pose();raycaster.setFromCamera(cursor,camera);
    if(event.button===0){
      if(!['precision','kiting'].includes(exercise?.kind))return;
      if(exercise.kind==='kiting'){
        const aim=raycaster.ray.intersectPlane(plane,point)?{x:point.x,z:point.z}:movement.snapshot().position;
        kiting.leftClick(aim);range();
      }else{
        const hit=raycaster.intersectObjects(visuals.clickTargets(),false)[0],valid=hit&&(!visuals.acceptHit||visuals.acceptHit(raycaster,hit)),targetId=valid?hit.object.userData.targetId:null;
        // Pick the displayed pose, then catch up the clock before accepting the target identity.
        flush();if(disposed||!running())return;
        if(valid)exercise.hit(targetId);else exercise.miss();
      }
      visuals.sync(exercise.snapshot(),movement.snapshot().position);onTick();if(!disposed)render();return;
    }
    if(exercise?.kind==='precision'||exercise?.kind==='reflex')return;
    kiting?.cancel({stop:false});range();
    if((displayedAim?(point.set(displayedAim.x,arena.groundY,displayedAim.z),true):raycaster.ray.intersectPlane(plane,point))&&movement.moveTo({x:Math.max(arena.bounds.minX,Math.min(arena.bounds.maxX,point.x)),z:Math.max(arena.bounds.minZ,Math.min(arena.bounds.maxZ,point.z))})){exercise?.moveCommand?.();onDiagnosticInput?.('move');if(dodge)feedback?.move?.(movement.snapshot().target,0x79e4a1);else feedback?.move?.(movement.snapshot().target);if(dodge){pose();render();}onTick();}
  }
  function context(event){event.preventDefault();}
  function leave(){pan={x:0,z:0};pointerKnown=false;}
  function wheel(event) {if(event.ctrlKey||event.metaKey||event.altKey||!Number.isFinite(event.deltaY)||event.deltaY===0)return;event.preventDefault();controller.wheel(event.deltaY,event.deltaMode);pose();render();}
  function key(event) {
    if(event.repeat||event.ctrlKey||event.altKey||event.metaKey||editable(event.target))return;
    if(world&&event.code==='Space'){event.preventDefault();pan={x:0,z:0};controller.recenter(movement.snapshot().position);onDiagnosticInput?.('recenter');pose();render();return;}
    if(world&&running()&&[bindings.stopKey,bindings.flashKey,...(dodge?[bindings.dashKey]:[])].includes(event.code)){
      event.preventDefault();let visibleFlashAim=null;if(dodge&&event.code!==bindings.stopKey&&pointerKnown){raycaster.setFromCamera(cursor,camera);if(raycaster.ray.intersectPlane(plane,point))visibleFlashAim={x:point.x,z:point.z};}flush();if(disposed||!running())return;
      if(event.code===bindings.stopKey){kiting?.cancel();range();movement.stop();exercise?.moveCommand?.();onDiagnosticInput?.('stop');}
      else if(event.code===bindings.dashKey&&dodge){if(dashRemaining<=0){const current=movement.snapshot(),aim=visibleFlashAim??current.target??{x:current.position.x+Math.sin(current.angle)*DODGE_DASH_RANGE,z:current.position.z+Math.cos(current.angle)*DODGE_DASH_RANGE};if(movement.dash(aim,{continueMoving:true})){dashRemaining=5;character.onAbility?.('dash');events?.emit('player:ability',{attemptId:session?.snapshot().id,type:'dash',position:current.position});exercise?.moveCommand?.();exercise?.onControl?.({type:'dash'});onDiagnosticInput?.('dash');}}}
      else if(flashRemaining<=0){kiting?.cancel();range();pose();raycaster.setFromCamera(cursor,camera);const current=movement.snapshot(),aim=visibleFlashAim??(pointerKnown&&raycaster.ray.intersectPlane(plane,point)?{x:point.x,z:point.z}:current.target??{x:current.position.x+Math.sin(current.angle)*4,z:current.position.z+Math.cos(current.angle)*4});if(movement.blink(aim,4,{continueMoving:dodge})){flashRemaining=15;character.onAbility?.('flash');events?.emit('player:ability',{attemptId:session?.snapshot().id,type:'flash',position:movement.snapshot().position});if(dodge&&controller.snapshot().locked)controller.recenter(movement.snapshot().position);exercise?.moveCommand?.();feedback?.move?.(movement.snapshot().position);exercise?.onControl?.({type:'flash'});onDiagnosticInput?.('flash');}}
      pose();visuals?.sync?.(exercise?.snapshot(),movement.snapshot().position);onTick();if(!disposed)render();return;
    }
    if(event.code==='KeyA'&&kiting&&running()){event.preventDefault();flush();if(disposed||!running())return;pose();let aim=null;if(pointerKnown){raycaster.setFromCamera(cursor,camera);if(raycaster.ray.intersectPlane(plane,point))aim={x:point.x,z:point.z};}kiting.pressA(aim);range();pose();visuals.sync(exercise.snapshot(),movement.snapshot().position);if(!disposed)render();return;}
    if(event.key.toLowerCase()==='y') toggleCamera();
    if(event.key==='Escape'&&session){event.preventDefault();if(session.snapshot().state==='paused')session.resume();else {kiting?.cancel();range();session.pause();}}
  }
  function keyup(event){if(event.code==='KeyA'){kiting?.releaseA();range();}}
  window.addEventListener('keyup',keyup);
  canvas.addEventListener('pointerdown',down);canvas.addEventListener('contextmenu',context);canvas.addEventListener('pointermove',pointer);canvas.addEventListener('pointerleave',leave);canvas.addEventListener('wheel',wheel,{passive:false});
  window.addEventListener('keydown',key);window.addEventListener('blur',suspend);document.addEventListener('visibilitychange',visibility);
  const api = {movement,controller,getCommandState:()=>kiting?.snapshot()??null,dispose(){if(disposed)return;unsubscribe?.();stopAttackFeedback?.();kiting?.cancel();disposed=true;if(frame!==null)cancelFrame(frame);
    canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('contextmenu',context);canvas.removeEventListener('pointermove',pointer);canvas.removeEventListener('pointerleave',leave);canvas.removeEventListener('wheel',wheel);
    window.removeEventListener('keyup',keyup);visuals?.setRangeVisible?.(false);window.removeEventListener('keydown',key);window.removeEventListener('blur',suspend);document.removeEventListener('visibilitychange',visibility);status.remove();ability.remove();cameraButton?.remove();
  }};
  try { pose();start(); } catch(error) { api.dispose();throw error; }
  return api;
}
