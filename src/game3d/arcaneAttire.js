import * as THREE from 'three';
import { RIFT_PALETTE as P } from './artDirection.js';

/** Original attached runes. CC0 skeleton, animation and body remain reusable. */
export function addArcaneAttire(root){
 const emissive=new THREE.MeshStandardMaterial({color:P.blue,emissive:P.blue,emissiveIntensity:1.4,metalness:.35,roughness:.28});
 const silver=new THREE.MeshStandardMaterial({color:P.silver,metalness:.65,roughness:.38});
 const chest=root.getObjectByName('chest')??root,head=root.getObjectByName('head')??root;
 const details=[];
 function part(parent,geometry,material,name,position){const mesh=new THREE.Mesh(geometry,material);mesh.name=name;mesh.position.set(...position);mesh.frustumCulled=false;mesh.receiveShadow=false;mesh.raycast=()=>{};parent.add(mesh);details.push(mesh);return mesh;}
 const frame=part(chest,new THREE.TorusGeometry(.1,.018,4,4),silver,'duelist-sigil-frame',[0,.09,.39]);frame.rotation.z=Math.PI/4;
 const rune=part(chest,new THREE.OctahedronGeometry(.065),emissive,'duelist-heart-rune',[0,.09,.415]);rune.scale.y=1.3;
 for(const side of [-1,1]){const line=part(chest,new THREE.BoxGeometry(.025,.19,.018),emissive,'duelist-blue-inlay',[side*.13,.09,.385]);line.rotation.z=side*-.32;}
 const visor=part(head,new THREE.BoxGeometry(.18,.025,.018),emissive,'duelist-visor-rune',[0,.35,.56]);
 const cape=root.getObjectByName('Knight_Cape'),capeRest=cape?.rotation.x??0;
 let phase=0;
 root.userData.identity='arcane-duelist';
 return {update({moving,reducedMotion,ability},dt){phase+=Math.max(0,dt);emissive.emissiveIntensity=ability?2:1.4;if(cape&&!reducedMotion)cape.rotation.x=capeRest+(moving?Math.sin(phase*9)*.035:0);visor.visible=true;},details};
}
