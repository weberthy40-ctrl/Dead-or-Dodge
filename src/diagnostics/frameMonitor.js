const BIN_MS=.25, MAX_MS=1000;
export const PROBE_COMMANDS=Object.freeze(['move','stop','dash','flash','camera','recenter']);

/** Bounded, local observer. Durations are real intervals between submitted renders. */
export function createFrameMonitor({warmupSeconds=2}={}){
 if(!Number.isFinite(warmupSeconds)||warmupSeconds<0)throw new TypeError('Aquecimento inválido.');
 const bins=new Uint32Array(MAX_MS/BIN_MS+1),commands=Object.fromEntries(PROBE_COMMANDS.map(key=>[key,0]));
 let last=null,frames=0,totalMs=0,maxMs=0,longFrames=0,stopped=false;
 function quantile(fraction){if(!frames)return null;const target=Math.ceil(frames*fraction);let count=0;for(let i=0;i<bins.length;i++){count+=bins[i];if(count>=target)return i===bins.length-1?MAX_MS:(i+.5)*BIN_MS;}return null;}
 const snapshot=()=>Object.freeze({status:frames>=30&&totalMs>=5000?'measured':'short',frames,observedSeconds:totalMs/1000,averageFps:totalMs?frames*1000/totalMs:null,medianMs:quantile(.5),p95Ms:quantile(.95),p95Capped:frames>0&&quantile(.95)===MAX_MS,maxMs:frames?maxMs:null,longFrames,longFrameThresholdMs:50,quantileResolutionMs:BIN_MS,commands:Object.freeze({...commands})});
 return {frame(time,{active=true,elapsed=Infinity}={}){
  if(stopped)return;
  if(!active||!Number.isFinite(time)||time<0||!(elapsed>=warmupSeconds)){last=null;return;}
  if(last===null){last=time;return;}if(time<=last)return;
  const dt=time-last;last=time;frames++;totalMs+=dt;maxMs=Math.max(maxMs,dt);if(dt>50)longFrames++;bins[Math.min(bins.length-1,Math.floor(dt/BIN_MS))]++;
 },command(type){if(!stopped&&Object.hasOwn(commands,type))commands[type]++;},suspend(){last=null;},snapshot,finish(){stopped=true;last=null;return snapshot();}};
}
