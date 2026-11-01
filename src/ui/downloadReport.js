/** Explicit local download; no server, clipboard permission or retained object URL. */
export function downloadReport(document,name,report){
 const win=document.defaultView,url=win.URL.createObjectURL(new win.Blob([JSON.stringify(report,null,2)],{type:'application/json'})),anchor=document.createElement('a');
 anchor.href=url;anchor.download=name;anchor.hidden=true;document.body.append(anchor);
 try{anchor.click();}finally{anchor.remove();win.setTimeout(()=>win.URL.revokeObjectURL(url),1000);}
}
