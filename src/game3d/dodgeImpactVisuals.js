import * as THREE from 'three';
import { IMPACT_ECHO_LIMIT,IMPACT_ECHO_SECONDS } from './impactPresentation.js';
import { PREMIUM_FAMILIES } from './artDirection.js';
import { VARIANTS } from '../training/dodge/projectiles.js';
import { disposeObject } from './resources.js';

/** Brief visual aftermath, below live warnings. No own clock, collider or event source. */
export function createDodgeImpactVisuals(scene,{effects=true,reducedMotion=false}={}){
 const group=new THREE.Group();group.name='Dodge impact echoes';scene.add(group);
 const ring=new THREE.RingGeometry(.965,1,48),disk=new THREE.CircleGeometry(1,40),box=new THREE.BoxGeometry(1,1,1),shard=new THREE.OctahedronGeometry(1);
 const colors=Object.fromEntries(Object.values(PREMIUM_FAMILIES).map(f=>[f.variant,f.color])),slots=[];let disposed=false;
 function make(){
  const root=new THREE.Group();root.visible=false;group.add(root);
  const material=()=>new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,depthTest:false,side:THREE.DoubleSide,toneMapped:false});
  const rimMat=material(),fillMat=material(),lightMat=material();
  function mesh(geometry,mat,name){const n=new THREE.Mesh(geometry,mat);n.name=name;n.renderOrder=85;n.raycast=()=>{};root.add(n);return n;}
  const rim=mesh(ring,rimMat,'impact-rim'),inner=mesh(ring,rimMat,'impact-inner'),fill=mesh(disk,fillMat,'impact-fill'),lane=mesh(box,fillMat,'impact-beam'),core=mesh(box,lightMat,'impact-beam-core');
  for(const n of [rim,inner,fill])n.rotation.x=-Math.PI/2;
  const pieces=Array.from({length:3},()=>mesh(shard,lightMat,'impact-spark'));
  return {root,rim,inner,fill,lane,core,pieces,rimMat,fillMat,lightMat};
 }
 function valid(e){return e&&Object.hasOwn(VARIANTS,e.variant)&&['bolt','beam','circle','ring'].includes(e.shape)&&['position','origin','direction'].every(k=>[e[k]?.x,e[k]?.z].every(Number.isFinite))&&[e.age,e.radius,e.length,e.wallWidth].every(Number.isFinite)&&e.age>=0&&e.age<IMPACT_ECHO_SECONDS&&e.radius>0&&e.radius<=20&&e.length>=0&&e.length<=200&&e.wallWidth>=0;}
 function floor(node,p,r,y){node.position.set(p.x,y,p.z);node.scale.set(r,r,1);node.visible=true;}
 return {sync(impacts=[]){
  if(disposed)return;for(const s of slots)s.root.visible=false;
  const accepted=Array.isArray(impacts)?impacts.slice(-IMPACT_ECHO_LIMIT).filter(valid):[];
  for(const [index,e]of accepted.entries()){
   const s=slots[index]??(slots[index]=make()),fade=1-e.age/IMPACT_ECHO_SECONDS,color=colors[e.variant]??VARIANTS[e.variant].color;
   s.root.visible=true;s.root.userData.impactId=e.id;s.root.userData.shape=e.shape;
   for(const n of [s.rim,s.inner,s.fill,s.lane,s.core,...s.pieces])n.visible=false;
   s.rimMat.color.setHex(color);s.fillMat.color.setHex(color);s.lightMat.color.setHex(0xdcecff);
   s.rimMat.opacity=fade*.65;s.fillMat.opacity=fade*(effects?.18:.08);s.lightMat.opacity=fade*.5;
   if(e.shape==='beam'){
    for(const [node,width,height]of [[s.lane,e.radius*2,.06],[s.core,e.radius*.32,.075]]){node.visible=true;node.position.set(e.origin.x+e.direction.x*e.length/2,.08,e.origin.z+e.direction.z*e.length/2);node.rotation.y=Math.atan2(e.direction.x,e.direction.z);node.scale.set(width,height,e.length);}
   }else if(e.shape==='ring'){
    floor(s.rim,e.origin,e.radius+e.wallWidth,.085);floor(s.inner,e.origin,Math.max(.01,e.radius-e.wallWidth),.085);
   }else{
    const point=e.shape==='circle'?e.origin:e.position;floor(s.rim,point,e.radius,.085);floor(s.fill,point,e.radius,.08);
   }
   if(effects)for(const [i,piece]of s.pieces.entries()){const angle=i*Math.PI*2/3,d=reducedMotion?.18:.18+e.age*.9;piece.visible=true;piece.position.set(e.position.x+Math.sin(angle)*d,.3+(reducedMotion?0:e.age*.6),e.position.z+Math.cos(angle)*d);piece.rotation.set(0,angle,Math.PI/4);piece.scale.set(.055,.14,.055);}
  }
 },dispose(){if(disposed)return;disposed=true;disposeObject(group);if(!slots.length)for(const geometry of [ring,disk,box,shard])geometry.dispose();slots.length=0;}};
}
