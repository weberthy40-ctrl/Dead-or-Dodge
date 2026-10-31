import * as THREE from 'three';
import { RIFT_PALETTE as P } from './artDirection.js';

/** Original architecture lives outside the playable lane. No collision meshes. */
export function addArcaneStructures(group,{quality='medio',reducedMotion=false}={}){
 const silver=new THREE.MeshStandardMaterial({color:P.silver,metalness:.55,roughness:.42});
 const dark=new THREE.MeshStandardMaterial({color:P.graphite,metalness:.28,roughness:.7});
 const blue=new THREE.MeshStandardMaterial({color:P.blue,emissive:0x2575d2,emissiveIntensity:1.1,metalness:.4,roughness:.24});
 const violet=new THREE.MeshStandardMaterial({color:P.violet,emissive:0x4d3384,emissiveIntensity:.65,roughness:.45});
 const crystals=[];let time=0;
 function piece(geometry,material,x,y,z,name){const mesh=new THREE.Mesh(geometry,material);mesh.name=name;mesh.position.set(x,y,z);mesh.raycast=()=>{};mesh.castShadow=quality!=='leve';mesh.receiveShadow=quality!=='leve';group.add(mesh);return mesh;}
 for(const side of [-1,1])for(const z of [-18,0,18]){
  const x=side*16.7;
  piece(new THREE.CylinderGeometry(1,1.35,.45,6),dark,x,.2,z,'arcane-plinth');
  piece(new THREE.CylinderGeometry(.36,.65,2.1,6),silver,x,1.35,z,'arcane-pillar');
  const crystal=piece(new THREE.OctahedronGeometry(.68),z===0?violet:blue,x,3.05,z,'arcane-resonator');crystal.scale.y=1.7;crystals.push({mesh:crystal,y:3.05});
  const orbit=piece(new THREE.TorusGeometry(.96,.035,4,32),silver,x,3.05,z,'arcane-orbit');orbit.rotation.x=Math.PI/2.7;orbit.rotation.y=side*.3;
  if(quality==='ultra'){const outer=piece(new THREE.TorusGeometry(1.18,.018,4,40),blue,x,3.05,z,'arcane-outer-orbit');outer.rotation.x=Math.PI/2;}
 }
 for(const side of [-1,1]){
  piece(new THREE.BoxGeometry(12,.35,2.4),dark,0,0,side*25.5,'arcane-gate-base');
  for(const x of [-5.4,5.4]){piece(new THREE.BoxGeometry(.8,5.2,.9),silver,x,2.5,side*25.5,'arcane-gate-pier');piece(new THREE.BoxGeometry(.1,4.2,.93),blue,x,2.5,side*25.5,'arcane-gate-rune');}
  piece(new THREE.BoxGeometry(11.5,.45,.8),dark,0,5.1,side*25.5,'arcane-gate-lintel');
 }
 return {update(dt){if(reducedMotion||!Number.isFinite(dt)||dt<=0)return;time+=Math.min(.1,dt);for(const [i,{mesh,y}]of crystals.entries()){mesh.rotation.y=time*.13+i;mesh.position.y=y+Math.sin(time*.8+i)*.07;}}};
}
