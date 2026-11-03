import { addArcaneAttire } from './arcaneAttire.js';
import { applyDuelistReadability } from './duelistPresentation.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as cloneSkeleton } from 'three/addons/utils/SkeletonUtils.js';
const base=`${import.meta.env.BASE_URL}assets/kaykit/`;
let pending,baseArt;
const artBase=`${import.meta.env.BASE_URL}assets/arena/`;
/** Bounded model/texture caches; dodge does not request the noisy legacy floor. */
export function loadSceneAssets({includeArt=true}={}){
 if(!pending){const loader=new GLTFLoader();pending=Promise.all(['ranger.glb','knight.glb','barrier.glb','pillar_decorated.glb','rubble_large.glb','banner_patternA_blue.glb','torch_lit.glb'].map(file=>loader.loadAsync(base+file))).then(([ranger,knight,barrier,pillar,rubble,banner,torch])=>({ranger,knight,barrier,pillar,rubble,banner,torch})).catch(error=>{pending=undefined;throw error;});}
 if(!includeArt)return pending;
 if(!baseArt){const loader=new THREE.TextureLoader();baseArt=Promise.allSettled(['stone.webp','canopy.webp'].map(file=>loader.loadAsync(artBase+file))).then(values=>({stone:values[0].status==='fulfilled'?values[0].value:null,canopy:values[1].status==='fulfilled'?values[1].value:null}));}
 return Promise.all([pending,baseArt]).then(([models,art])=>({...models,...art}));
}
export function cloneModel(template){
 const object=cloneSkeleton(template.scene);
 object.traverse(node=>{if(node.isMesh){node.geometry=node.geometry.clone();node.material=Array.isArray(node.material)?node.material.map(m=>m.clone()):node.material.clone();node.castShadow=node.receiveShadow=true;node.raycast=()=>{};}});
 return object;
}
export function createAnimatedModel(template,{enemy=false,caster=false,ranged=false,dodge=false}={}){
 const root=cloneModel(template),mixer=new THREE.AnimationMixer(root),clips=new Map(template.animations.map(clip=>[clip.name,clip])),actions=new Map();
 const equipment=caster?[]:!enemy?['1H_Sword']:ranged?['1H_Crossbow']:enemy?['1H_Sword','Round_Shield']:['1H_Crossbow'];
 root.traverse(node=>{if(node.isMesh){node.visible=/^(Rogue_|Knight_)/.test(node.name)||equipment.includes(node.name);if(dodge||!enemy){node.receiveShadow=false;if(!enemy)node.frustumCulled=false;}}});
 root.traverse(node=>{if(node.isMesh&&node.material?.isMeshStandardMaterial){node.material.roughness=.7;node.material.metalness=.15;if(!dodge&&!enemy&&node.name==='Rogue_Head_Hooded')node.material.color.setHex(0x709caa);if(dodge||!enemy){node.material.customProgramCacheKey=()=> enemy?'rift-enemy-v1':'rift-duelist-v1';node.material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\n if(diffuseColor.g>diffuseColor.r*1.4 && diffuseColor.g>diffuseColor.b*1.2){ float luminance=diffuseColor.g; diffuseColor.rgb=vec3(.10,.23,.48)*luminance; }');if(!enemy)shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\n if(diffuseColor.r>diffuseColor.g*1.25 && diffuseColor.r>diffuseColor.b*1.15){ diffuseColor.rgb=vec3(.20,.70,1.0)*max(.4,diffuseColor.r); }');};}}});
 if(!enemy)root.traverse(node=>{if(node.isMesh&&node.material?.isMeshStandardMaterial){node.material.metalness=.38;node.material.roughness=.5;node.material.color.setHex(0xa7b7d3);if(dodge)applyDuelistReadability(node.material);if(node.name==='1H_Sword')node.scale.multiplyScalar(.68);}});
 let active;function play(name){const clip=clips.get(name)??clips.get('Idle');if(!clip)return;let next=actions.get(clip.name);if(!next){next=mixer.clipAction(clip);actions.set(clip.name,next);}if(next===active)return;if(active){active.fadeOut(dodge?.055:.12);next.reset().fadeIn(dodge?.055:.12).play();}else next.reset().play();active=next;}
 const proportions=[];root.traverse(node=>{if(node.isBone){const factor=node.name==='head'?[.49,.59,.49]:node.name.startsWith('upperleg')?[1,1.28,1]:node.name==='spine'?[1,1.12,1]:null;if(factor)proportions.push({node,base:node.scale.clone(),factor});}});function anatomy(){for(const {node,base,factor}of proportions)node.scale.set(base.x*factor[0],base.y*factor[1],base.z*factor[2]);}play('Idle');mixer.update(0);anatomy();root.updateMatrixWorld(true);const bounds=new THREE.Box3();root.traverse(node=>{if(node.isSkinnedMesh)node.skeleton.update();if(node.isMesh&&node.visible&&/^(Rogue_|Knight_)/.test(node.name)){node.computeBoundingBox?.();bounds.expandByObject(node);}});const height=bounds.max.y-bounds.min.y,scale=(dodge?3.45:2.45)/Math.max(.1,height);root.scale.multiplyScalar(scale);root.scale.x*=.84;root.scale.z*=.84;root.position.y-=bounds.min.y*scale;
 const attire=!enemy?addArcaneAttire(root):null;
 // Blend in-place gait clips with the existing cosmetic movement envelope. World movement
 // and facing have already been applied by the controller and never wait for this blend.
 function blendGait(weight){
  const idle=actions.get('Idle'),clip=clips.get('Running_A');
  if(!idle||!clip){play('Idle');return;}
  let running=actions.get(clip.name);
  if(!running&&weight>0){running=mixer.clipAction(clip);actions.set(clip.name,running);running.setEffectiveTimeScale(1.45).play();}
  if(active!==idle&&active!==running)active?.fadeOut(.055);
  active=idle;idle.stopFading().setEffectiveWeight(1-weight).play();
  if(running){running.stopFading().setEffectiveWeight(weight);running.paused=weight===0;}
 }
 return {root,update({moving,attackPhase,reducedMotion,ability,locomotion},dt){
  attire?.update({moving,reducedMotion,ability,runWeight:locomotion?.run,turn:locomotion?.roll},dt);if(reducedMotion)return;
  const gait=dodge&&!enemy&&attackPhase!=='windup';
  if(gait){const raw=Number.isFinite(locomotion?.run)?Math.max(0,Math.min(1,locomotion.run)):moving?1:0;const weight=raw<.001?0:raw>.999?1:raw;blendGait(weight);}
  else if(attackPhase==='windup'){if(dodge&&!enemy){const running=actions.get('Running_A');if(running){running.setEffectiveWeight(0);running.paused=true;}}const cast=enemy&&!ranged&&!caster?[...clips.keys()].find(n=>n.includes('Melee_Attack')):'1H_Ranged_Shoot';play(cast??'Idle');}
  else play(moving?'Running_A':'Idle');
  mixer.update(Math.min(.1,Math.max(0,dt))*(gait?1:moving?(dodge?1.45:1.2):1));anatomy();
 },dispose(){mixer.stopAllAction();mixer.uncacheRoot(root);}};
}
let dodgeArt;
/** CC0 nature assets are requested only by the dodge arena. */
export function loadDodgeArt(){
 if(!dodgeArt){const loader=new GLTFLoader(),nature=`${import.meta.env.BASE_URL}assets/kaykit-nature/`;dodgeArt=Promise.allSettled(['tree_single_A.gltf','tree_single_B.gltf','rock_single_C.gltf','waterplant_A.gltf'].map(file=>loader.loadAsync(nature+file))).then(values=>Object.fromEntries(['treeA','treeB','rock','reeds'].map((name,i)=>[name,values[i].status==='fulfilled'?values[i].value:null])));}
 return dodgeArt;
}
