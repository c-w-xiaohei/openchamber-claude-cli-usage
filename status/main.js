(()=>{var u="openchamber.sdk",E=1;var Ze=`
:root {
  /* Quiet at rest like the app's own thumbs; hover gives a clear grab target. */
  --oc-scrollbar-thumb: color-mix(in srgb, var(--oc-muted, currentColor) 18%, transparent);
  --oc-scrollbar-thumb-hover: color-mix(in srgb, var(--oc-muted, currentColor) 36%, transparent);
  scrollbar-gutter: stable;
}
* {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
:hover, [data-oc-scrolling] {
  scrollbar-color: var(--oc-scrollbar-thumb) transparent;
}
/* Chromium's standard scrollbar properties otherwise override its pseudo-elements. */
@supports selector(::-webkit-scrollbar) {
  *, :hover, [data-oc-scrolling] { scrollbar-width: auto; scrollbar-color: auto; }
  ::-webkit-scrollbar { width: 6px; height: 6px; background: transparent; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 999px;
    min-width: 24px;
    min-height: 24px;
  }
  :hover::-webkit-scrollbar-thumb, [data-oc-scrolling]::-webkit-scrollbar-thumb { background: var(--oc-scrollbar-thumb); }
  ::-webkit-scrollbar-thumb:hover { background: var(--oc-scrollbar-thumb-hover); }
  ::-webkit-scrollbar-corner { background: transparent; }
  ::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
}
@media (forced-colors: active) {
  *, :hover, [data-oc-scrolling] { scrollbar-color: auto; }
  ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb:hover { background: CanvasText; }
}
`;function oo(e){let r=e.documentElement;if(r.hasAttribute("data-oc-scrollbar-activity"))return;r.setAttribute("data-oc-scrollbar-activity","");let n=new WeakMap;e.addEventListener("scroll",(_)=>{let p=_.target===e?r:_.target;if(!(p instanceof Element))return;if(!p.hasAttribute("data-oc-scrolling"))p.setAttribute("data-oc-scrolling","");let S=n.get(p);if(S!==void 0)clearTimeout(S);n.set(p,setTimeout(()=>{n.delete(p),p.removeAttribute("data-oc-scrolling")},1000))},{capture:!0,passive:!0})}var zo=`(${oo.toString()})(document);`;var qe=128,et=65536;var xe=128;var Ie=65536;var io=/^[a-z][a-z0-9-]{0,39}$/;var ro=(e)=>Object(e)===e&&!Array.isArray(e),tt=(e,r)=>Object.keys(e).every((n)=>r.includes(n)),no=(e)=>String(e)===e&&e.length>=1&&e.length<=60,so=(e)=>String(e)===e&&e.length>=1&&e.length<=80,ao=(e)=>{if(!Array.isArray(e)||e.length>4)return!1;let r=new Set;for(let n of e){if(!ro(n)||!io.test(n.id)||!no(n.label))return!1;if(n.disabled!==void 0&&n.disabled!==!0&&n.disabled!==!1)return!1;if(r.has(n.id))return!1;if(r.add(n.id),n.kind==="button"){if(!tt(n,["kind","id","label","disabled"]))return!1;continue}if(n.kind!=="select"||!tt(n,["kind","id","label","value","options","disabled"]))return!1;if(!so(n.value)||!Array.isArray(n.options)||n.options.length<1||n.options.length>16)return!1;let _=new Set;for(let p of n.options){if(!ro(p)||!tt(p,["value","label"])||!so(p.value)||!no(p.label)||_.has(p.value))return!1;_.add(p.value)}if(!_.has(n.value))return!1}return!0};var co=["{id}","{segment}","{segments+}"];var br=new Set(co);var lo=["turn-finished","turn-failed","permission-asked","question-asked","turn-started","session-created","session-archived","session-deleted"];var Ur=new Set(lo);var ge=20000000,be=256;var ot=(e)=>("bytes"in e)?e.bytes.byteLength:e.content.length,po=(e,r)=>{if(e.path!==r.path||e.readOnly!==r.readOnly)return!1;if(e.encoding==="text"||r.encoding==="text")return e.encoding==="text"&&r.encoding==="text"&&e.content===r.content;if(e.bytes.byteLength!==r.bytes.byteLength)return!1;for(let n=0;n<e.bytes.byteLength;n+=1)if(e.bytes[n]!==r.bytes[n])return!1;return!0};var uo=/^[A-Za-z0-9_-]{1,80}$/;var Eo=["left","right","top","bottom"];var _o=(e,r=0,n={remaining:16000})=>{if(--n.remaining<0||r>=32)return!1;if(e===null)return!0;let _=Array.isArray(e)?e:Object(e)===e?Object.values(e):[];for(let p of _)if(!_o(p,r+1,n))return!1;return!0},rt=(e)=>{if(e===null||e===!0||e===!1)return!0;if(Array.isArray(e))return Object.keys(e).every((r)=>/^(0|[1-9]\d*)$/.test(r)&&Number(r)<e.length)&&e.every(rt);if(Object(e)===e){let r=Object.getPrototypeOf(e);return(r===null||r===Object.prototype)&&Object.values(e).every(rt)}return String(e)===e||Number.isFinite(e)},nt=(e)=>{try{if(String(e.id)!==e.id||!uo.test(e.id)||!Number.isFinite(e.anchor.x)||Math.abs(e.anchor.x)>1e5||!Number.isFinite(e.anchor.y)||Math.abs(e.anchor.y)>1e5||!Number.isFinite(e.anchor.width)||!Number.isFinite(e.anchor.height)||e.anchor.width<=0||e.anchor.height<=0||e.anchor.width>1e5||e.anchor.height>1e5||!Number.isInteger(e.width)||e.width<160||e.width>640||!Number.isInteger(e.height)||e.height<48||e.height>480||e.side!==void 0&&!Eo.includes(e.side)||e.focus!==void 0&&e.focus!==!0&&e.focus!==!1||!_o(e.data)||!rt(e.data))return!1;return JSON.stringify(e.data).length<=16000}catch{return!1}};var it=2000;var To=["file","directory","other","missing"],at=(e)=>Boolean(e&&"sessionId"in e),ct=(e)=>Boolean(e&&"sent"in e&&!("sessionId"in e));var fo=/^[0-9a-f]{7,64}$/i,dt=(e)=>fo.test(e),Ce=500,Ue=32000,Oo=16000,Ao=128,Ro=200,ho=2000,mo=16000,xo=80,Io=200,go=16000;var bo=2000;var lt=20000,ke=1024,Me=2000000;var ye=64000,Ne=8000,pt=4000;var ut=960000;var Co=999,Uo=1e4,le=500,ko=["HOST_UNAVAILABLE","HOST_TIMEOUT","HOST_REJECTED","DISCONNECTED","DISABLED","BAD_PATH","NO_INTEGRATION","NO_SERVICE","SERVICE_FAILED","REQUEST_FAILED","RESPONSE_TOO_LARGE","NO_SESSION","SESSION_BUSY","NOT_GRANTED","NO_DIRECTORY","NOT_FOUND","FILE_TOO_LARGE","DENIED","NO_MODEL","MODEL_FAILED","UNSUPPORTED"],Mo=["stopped","starting","ready","failed"],Qo=new Set(ko),yo=(e)=>Qo.has(e),No=(e)=>e&&yo(e)?e:"HOST_REJECTED",Q=(e)=>{if(e===void 0)return!1;if(e===null||e===!0||e===!1)return!0;if(String(e)===e)return!0;if(Number(e)===e)return Number.isFinite(e);if(Array.isArray(e))return e.every(Q);if(Object(e)===e)return Object.values(e).every(Q);return!1},vo=(e)=>Q(e)&&JSON.stringify(e).length<=go,So=(e)=>e?.trim().slice(0,Io)??"",Y=(e)=>{let r=e.id.trim().slice(0,Ao),n=e.title.trim().slice(0,Ro),_=e.url.trim().slice(0,ho),p=e.text?.trim().slice(0,mo),S=e.author?.trim().slice(0,xo),N=e.kind==="pull"?"pull":"issue",R={providerId:e.providerId.trim(),id:r,title:n||r,url:_,kind:N};if(p)R.text=p;if(S)R.author=S;if(N==="pull"){let P=So(e.branches?.head),w=So(e.branches?.base);if(P&&w)R.branches={head:P,base:w}}if(vo(e.data))R.data=e.data;return R},Et=(e)=>{let r=Y(e);if(e.projectId)r.projectId=e.projectId;if(e.navigation)r.navigation=e.navigation;if(e.worktree)r.worktree=e.worktree;return r},_t=(e)=>{let r={text:e.text.trim().slice(0,Oo)};if(e.send)r.send=!0;return r},St=(e)=>{if(e===null||!Number.isFinite(e))return null;return Math.min(Co,Math.max(0,Math.round(e)))},Tt=(e)=>{if(!Number.isFinite(e))return 0;return Math.min(Uo,Math.max(0,Math.ceil(e)))};var Z=(e)=>e.length>0&&e.length<=ke&&!e.includes("\x00")&&!e.includes("\\");var ve=(e)=>{if(!e.startsWith("/")||e.includes("\x00")||e.includes("\\")||e.includes("://"))return!1;if(e.length>bo)return!1;return!e.split("/").some((n)=>n==="."||n==="..")},Yo=new Set(Mo),ft=(e)=>Boolean(e&&"status"in e&&Yo.has(String(e.status))&&!("body"in e)),Le=(e)=>Boolean(e&&"status"in e&&"body"in e&&Number.isInteger(e.status)),Ot=(e)=>Boolean(e&&"content"in e&&String(e.content)===e.content),At=(e)=>Boolean(e&&"written"in e&&e.written===!0),Rt=(e)=>Boolean(e&&"entries"in e&&Array.isArray(e.entries)),Zo=new Set(To),ht=(e)=>Boolean(e&&"kind"in e&&"size"in e&&Zo.has(String(e.kind))&&Number.isFinite(e.size)),mt=(e)=>Boolean(e&&"text"in e&&String(e.text)===e.text&&!("status"in e)),qo=new Set(["workspace","shells","ready","directory","session","connection","settings","session-lifecycle","item","resolve","action","service-event","status-control-event","popover-closed","file-open","file-snapshot","file-saved","generate-late"]),er=(e)=>Object(e)===e?e:null,st=(e)=>String(e)===e&&e.length>0,tr=(e)=>{if(!st(e.id))return null;if(e.ok===!0){let r={channel:u,v:E,type:"result",id:e.id,ok:!0};if(Object(e.payload)===e.payload)r.payload=e.payload;return r}if(e.ok===!1&&st(e.error))return{channel:u,v:E,type:"result",id:e.id,ok:!1,error:e.error,code:No(st(e.code)?e.code:void 0)};return null},xt=(e)=>{let r=er(e);if(!r||r.channel!==u||r.v!==E)return null;if(r.type==="result")return tr(r);if(!qo.has(String(r.type))||Object(r.payload)!==r.payload)return null;return r};var Lo=(e)=>("key"in e)&&("metaKey"in e)&&("ctrlKey"in e),or=(e)=>(e.metaKey||e.ctrlKey)&&!e.altKey&&!e.shiftKey&&e.key.toLowerCase()==="s";class c extends Error{code;constructor(e,r){super(r);this.name="HostRequestError",this.code=e}}var Po=()=>Promise.reject(new c("BAD_PATH",'Request path must start with "/" and stay on the declared origin.')),Pe=()=>Promise.reject(new c("BAD_PATH",`File path must be 1 to ${ke} characters without NUL or backslash.`)),we=(e)=>{if(e===void 0)return;if(Object(e)!==e||Array.isArray(e)||e.scope!==void 0&&e.scope!=="instance"&&e.scope!=="device")throw new c("HOST_REJECTED",'Storage scope must be "instance" or "device".');return e.scope==="device"?"device":void 0},l=(e)=>(e.value+=1,`oc-${e.value}`),It=(e={})=>{let r=e.target??("window"in globalThis?window:null);if(!r)throw new c("HOST_UNAVAILABLE","No window. connectHost runs in a browser frame.");let n=e.acceptSource??((t)=>t===r.parent),_=e.requestTimeoutMs??lt,p=new Set,S=new Set,N=new Set,R=new Set,P=new Set,w=new Set,re=new Set,_e=new Set,Se=new Set,Te=new Set,fe=new Set,j=new Set,We=[],ne=null,se=null,Oe=new Set,Ae=new Set,ie=null,ae=null,ze=!1,W=new Map,z=new Map,J=new Map,G=!1,d={value:0},a=null,H=null,ce=!1,de=!1,Bt=null,Kt=(t)=>{if(!t)return null;return{sessionId:t.id,phase:t.busy?"started":"completed"}},v=(t)=>{r.parent.postMessage(t,"*")},jt=()=>{if(G||r.parent===r||j.size===0||a?.features?.lateGenerateResults!==!0)return;v({channel:u,v:E,type:"generate-late-listen"})},A=(t,o)=>{for(let s of t)try{s(o)}catch(i){console.error(i)}},Wt=(t)=>{if(!(t instanceof MessageEvent))return;if(!n(t.source))return;let o=xt(t.data);if(!o)return;if(o.type==="workspace"){let i=z.get(o.payload.subscriptionId);if(i)A([i],o.payload.snapshot);return}if(o.type==="shells"){let i=J.get(o.payload.subscriptionId);if(i)A([i],o.payload.snapshot);return}if(o.type==="ready"){if(a=o.payload,H=Kt(o.payload.session),A(p,o.payload),A(S,o.payload.directory),A(N,o.payload.session),H)A(R,H);if(A(P,o.payload.connection),A(w,o.payload.settings),A(re,o.payload.item),o.payload.block)A(_e,o.payload.block);jt();return}if(o.type==="service-event"){A(Se,o.payload);return}if(o.type==="generate-late"){if(j.size===0)We.push(o.payload);else A(j,o.payload);return}if(o.type==="directory"){if(a)a={...a,directory:o.payload.directory};A(S,o.payload.directory);return}if(o.type==="session"){if(a)a={...a,session:o.payload.session};if(!o.payload.session)H=null;else if(H?.sessionId!==o.payload.session.id)H=Kt(o.payload.session);A(N,o.payload.session);return}if(o.type==="session-lifecycle"){H=o.payload,A(R,o.payload);return}if(o.type==="connection"){if(a)a={...a,connection:o.payload.connection};A(P,o.payload.connection);return}if(o.type==="settings"){if(a)a={...a,settings:o.payload.settings};A(w,o.payload.settings);return}if(o.type==="item"){if(a)a={...a,item:o.payload.item};A(re,o.payload.item);return}if(o.type==="status-control-event"){A(Te,o.payload);return}if(o.type==="popover-closed"){A(fe,o.payload);return}if(o.type==="action"){let i=(T)=>{if(!G)v({channel:u,v:E,type:"action-result",id:o.id,payload:T})},f=se;if(!f){i({ok:!1,error:"This extension does not handle background actions."});return}Promise.resolve().then(()=>f(o.payload)).then(()=>i({ok:!0}),(T)=>{let g=(T instanceof Error?T.message:String(T)).trim();i({ok:!1,error:(g||"Action failed.").slice(0,le)})});return}if(o.type==="file-open"){let i=o.payload;if(ae&&po(ae,i))return;ae=i,A(Oe,o.payload);return}if(o.type==="file-saved"){A(Ae,o.payload.version);return}if(o.type==="file-snapshot"){let i=(g)=>{if(!G)v({channel:u,v:E,type:"file-snapshot-result",id:o.id,payload:g})},f=(g)=>i({error:(g.trim()||"Could not read the edited file.").slice(0,le)}),T=ie;if(!T){f("This extension does not edit files.");return}Promise.resolve().then(()=>T(o.payload.purpose)).then((g)=>{if(ot(g)>ge){f(`The file is over ${ge} ${"bytes"in g?"bytes":"characters"}.`);return}if(g.version.length>be){f(`The snapshot version is over ${be} characters.`);return}i({snapshot:"bytes"in g?{bytes:g.bytes,version:g.version}:{content:g.content,version:g.version}})},(g)=>f(g instanceof Error?g.message:String(g)));return}if(o.type==="resolve"){let i=(T)=>{v({channel:u,v:E,type:"resolve-result",id:o.id,payload:T})},f=ne;if(!f){i({error:"This extension does not resolve commands."});return}Promise.resolve().then(()=>f(o.payload)).then((T)=>i({item:T?Y(T):null}),(T)=>{let g=(T instanceof Error?T.message:String(T)).trim();i({error:(g||"Command failed.").slice(0,le)})});return}let s=W.get(o.id);if(!s)return;if(clearTimeout(s.timer),W.delete(o.id),o.ok){s.resolve(o.payload);return}s.reject(new c(o.code,o.error))};r.addEventListener("message",Wt),v({channel:u,v:E,type:"hello"});let b=(t,o=_)=>{if(G||r.parent===r)return Promise.reject(new c("HOST_UNAVAILABLE","No host frame. This page is not in an iframe."));return new Promise((s,i)=>{let f=setTimeout(()=>{W.delete(t.id),i(new c("HOST_TIMEOUT","Host did not answer in time."))},o);W.set(t.id,{resolve:s,reject:i,timer:f}),v(t)})},x=(t)=>b(t).then(()=>{return}),I={channel:u,v:E},Je=(t)=>{if(!G&&r.parent!==r)v(t)},zt=()=>Je({...I,type:"file-save"}),Jt=(t)=>{if(!Lo(t)||!or(t))return;t.preventDefault(),zt()},Qt=(t)=>{if(!Lo(t)||t.key!=="Escape"||a?.surface!=="popover"||!a.popover)return;t.preventDefault(),eo(a.popover.id,"escape").catch(()=>{return})},Re=()=>{let t=a?.surface==="popover"?a.popover:void 0;if(!t)return;let o=ce||de;if(Bt===o)return;Bt=o,to(t.id,o).catch(()=>{return})},he=()=>{if(a?.surface!=="popover"||ce)return;ce=!0,Re()},Yt=(t)=>{if(a?.surface!=="popover"||t.relatedTarget!==null||!ce)return;ce=!1,Re()},Zt=()=>{if(a?.surface!=="popover"||de)return;de=!0,Re()},qt=()=>{if(a?.surface!=="popover"||!de)return;de=!1,Re()},D=(t,o=1024)=>{if(!t.trim()||t.length>o)throw new c("HOST_REJECTED",`Identity must contain 1 to ${o} characters.`)},Qe=async(t)=>{if(t.kind!=="projects")D(t.projectId);let o=await b({...I,type:"workspace-read",id:l(d),payload:t});if(!o||!("kind"in o)||!("state"in o)||o.kind!==t.kind)throw new c("HOST_REJECTED","Host did not return workspace data.");return o},Ye=async(t,o)=>{if(t.kind!=="projects")D(t.projectId);let s=l(d);z.set(s,o);try{await x({...I,type:"workspace-subscribe",id:l(d),payload:{subscriptionId:s,query:t}})}catch(i){if(z.delete(s),!G)v({...I,type:"workspace-unsubscribe",id:l(d),payload:{subscriptionId:s}});throw i}return()=>{if(!z.delete(s)||G)return;v({...I,type:"workspace-unsubscribe",id:l(d),payload:{subscriptionId:s}})}},Wo=async(t,o)=>{if(t.kind==="session")D(t.sessionId);if(t.kind==="project")D(t.projectId);let s=l(d);J.set(s,o);try{await x({...I,type:"shells-subscribe",id:l(d),payload:{subscriptionId:s,scope:t}})}catch(i){if(J.delete(s),!G)v({...I,type:"shells-unsubscribe",id:l(d),payload:{subscriptionId:s}});throw i}return()=>{if(!J.delete(s)||G)return;v({...I,type:"shells-unsubscribe",id:l(d),payload:{subscriptionId:s}})}},me=async(t)=>{if("key"in t&&(t.key.length===0||t.key.length>qe))throw new c("HOST_REJECTED","Storage key must contain 1 to 128 characters.");if(t.op==="set"&&!Q(t.value))throw new c("HOST_REJECTED","Storage values must be JSON.");if(t.op==="set"&&new TextEncoder().encode(JSON.stringify(t.value)).length>et)throw new c("HOST_REJECTED","Storage value exceeds 64 KiB.");if(t.scope==="device"&&a?.features?.deviceStorage!==!0)throw new c("UNSUPPORTED","This host does not support device storage.");let o=await b({...I,type:"storage",id:l(d),payload:t});if(!o||!("storage"in o)||o.op!==t.op)throw new c("HOST_REJECTED","Host did not return storage data.");return o},eo=(t,o)=>a?.features?.popovers!==!0&&!(a?.surface==="popover"&&a.popover?.id===t)?Promise.reject(new c("UNSUPPORTED","This host does not support popovers.")):x({...I,type:"popover-close",id:l(d),payload:o?{id:t,reason:o}:{id:t}}),to=(t,o)=>a?.features?.popovers!==!0&&!(a?.surface==="popover"&&a.popover?.id===t)?Promise.reject(new c("UNSUPPORTED","This host does not support popovers.")):x({...I,type:"popover-anchor",id:l(d),payload:{id:t,active:o}});return r.addEventListener("keydown",Qt,!0),r.addEventListener("pointerover",he),r.addEventListener("pointermove",he),r.addEventListener("pointerout",Yt),r.addEventListener("focus",Zt),r.addEventListener("blur",qt),{onAction:(t)=>(se=t,()=>{if(se===t)se=null}),listProjects:async()=>{let t=await Qe({kind:"projects"});if(t.kind!=="projects")throw new c("HOST_REJECTED","Expected projects.");return t},listWorktrees:async(t)=>{let o=await Qe({kind:"worktrees",projectId:t});if(o.kind!=="worktrees")throw new c("HOST_REJECTED","Expected worktrees.");return o},listSessions:async(t)=>{let o=await Qe({kind:"sessions",projectId:t});if(o.kind!=="sessions")throw new c("HOST_REJECTED","Expected sessions.");return o},onProjects:(t)=>Ye({kind:"projects"},(o)=>{if(o.kind==="projects")t(o)}),onWorktrees:(t,o)=>Ye({kind:"worktrees",projectId:t},(s)=>{if(s.kind==="worktrees")o(s)}),onSessions:(t,o)=>Ye({kind:"sessions",projectId:t},(s)=>{if(s.kind==="sessions")o(s)}),onRunningShells:(t,o)=>Wo(t,o),readShellOutput:async(t,o)=>{D(t,xe);let s=o?.cursor;if(s!==void 0&&(!Number.isInteger(s)||s<0))throw new c("HOST_REJECTED","Shell output cursor must be a non-negative integer.");let i=o?.tailBytes;if(i!==void 0&&(!Number.isInteger(i)||i<1||i>Ie))throw new c("HOST_REJECTED",`Shell output tailBytes must be an integer between 1 and ${Ie}.`);let T=await b({...I,type:"shell-output",id:l(d),payload:{shellId:t,cursor:s,tailBytes:i}});if(!T||typeof T.output!=="string"||!Number.isFinite(T.cursor))throw new c("HOST_REJECTED","Host did not return shell output.");return T},stopShell:async(t)=>{if(D(t,xe),(await b({...I,type:"shell-stop",id:l(d),payload:{shellId:t}}))?.stopped!==!0)throw new c("HOST_REJECTED","Host did not stop the shell.");return{stopped:!0}},openSession:async(t)=>{D(t),await x({...I,type:"open-session",id:l(d),payload:{sessionId:t}})},storage:{get:async(t,o)=>{let s=we(o),i={op:"get",key:t};if(s)i.scope=s;let f=await me(i);return f.op==="get"&&f.found?f.value:void 0},set:async(t,o,s)=>{let i=we(s),f={op:"set",key:t,value:o};if(i)f.scope=i;await me(f)},delete:async(t,o)=>{let s=we(o),i={op:"delete",key:t};if(s)i.scope=s;await me(i)},keys:async(t)=>{let o=we(t),s={op:"keys"};if(o)s.scope=o;let i=await me(s);if(i.op!=="keys")throw new c("HOST_REJECTED","Expected storage keys.");return i.keys}},onReady:(t)=>{if(p.add(t),a)t(a);return()=>{p.delete(t)}},onDirectory:(t)=>{if(S.add(t),a)t(a.directory);return()=>{S.delete(t)}},onSession:(t)=>{if(N.add(t),a)t(a.session);return()=>{N.delete(t)}},onSessionLifecycle:(t)=>{if(R.add(t),H)t(H);return()=>{R.delete(t)}},onConnection:(t)=>{if(P.add(t),a)t(a.connection);return()=>{P.delete(t)}},onSettings:(t)=>{if(w.add(t),a)t(a.settings);return()=>{w.delete(t)}},onItem:(t)=>{if(re.add(t),a)t(a.item);return()=>{re.delete(t)}},onBlock:(t)=>{if(_e.add(t),a?.block)t(a.block);return()=>{_e.delete(t)}},onServiceEvent:(t)=>(Se.add(t),()=>{Se.delete(t)}),onStatusControl:(t)=>(Te.add(t),()=>{Te.delete(t)}),onPopoverClosed:(t)=>(fe.add(t),()=>{fe.delete(t)}),setStatusControls:(t)=>{if(a?.features?.statusControls!==!0)return Promise.reject(new c("UNSUPPORTED","This host does not support status controls."));if(!ao(t))return Promise.reject(new c("HOST_REJECTED","Status controls must have unique bounded ids and valid selected options."));return x({...I,type:"status-controls",id:l(d),payload:{controls:t}})},openPopover:(t)=>{if(a?.features?.popovers!==!0)return Promise.reject(new c("UNSUPPORTED","This host does not support popovers."));if(!nt(t))return Promise.reject(new c("HOST_REJECTED","Popover requests need bounded geometry and JSON data."));return x({...I,type:"popover-open",id:l(d),payload:t})},closePopover:eo,setPopoverAnchorActive:to,onResolve:(t)=>(ne=t,()=>{if(ne===t)ne=null}),toast:(t)=>{let o=t.message.trim();if(!o||o.length>Ce)return Promise.reject(new c("HOST_REJECTED",`Toast message must contain 1 to ${Ce} characters.`));if(t.copy&&t.copy!==!0&&(!t.copy.text.length||t.copy.text.length>Ue))return Promise.reject(new c("HOST_REJECTED",`Toast copy text must contain 1 to ${Ue} characters.`));return x({channel:u,v:E,type:"toast",id:l(d),payload:{...t,message:o}})},openUrl:(t)=>x({channel:u,v:E,type:"open-url",id:l(d),payload:{url:t}}),openCommit:(t)=>dt(t)?x({channel:u,v:E,type:"open-commit",id:l(d),payload:{sha:t}}):Promise.reject(new c("HOST_REJECTED","Commit id must be 7 to 64 hex characters.")),answerBlock:(t)=>x({channel:u,v:E,type:"block-answer",id:l(d),payload:{text:t.trim().slice(0,it)}}),openSurface:(t)=>x({channel:u,v:E,type:"open-surface",id:l(d),payload:{surfaceId:t}}),writeClipboard:(t)=>x({channel:u,v:E,type:"clipboard-write",id:l(d),payload:{text:t}}),compose:(t)=>x({channel:u,v:E,type:"compose",id:l(d),payload:t}),attach:(t)=>x({channel:u,v:E,type:"attach",id:l(d),payload:Y(t)}),startSession:async(t)=>{if(t.projectId!==void 0)D(t.projectId);let o=t.worktree;if(o&&o!==!0)if(o.kind==="existing")D(o.directory);else{if(o.name!==void 0)D(o.name,200);if(o.baseBranch!==void 0)D(o.baseBranch,200)}let s=await b({channel:u,v:E,type:"start-session",id:l(d),payload:Et(t)},e.requestTimeoutMs??180000);if(!at(s))throw new c("HOST_REJECTED","Host did not return a session.");return s},prompt:(t)=>b({channel:u,v:E,type:"prompt",id:l(d),payload:_t(t)}).then((o)=>{if(!ct(o))throw new c("HOST_REJECTED","Host did not return a prompt result.");return o}),sessionLink:(t)=>x({channel:u,v:E,type:"session-link",id:l(d),payload:Y(t)}),close:()=>x({channel:u,v:E,type:"close",id:l(d)}),oauthStart:()=>x({channel:u,v:E,type:"oauth-start",id:l(d)}),oauthDisconnect:()=>x({channel:u,v:E,type:"oauth-disconnect",id:l(d)}),request:(t)=>(ve(t.path)?b({channel:u,v:E,type:"request",id:l(d),payload:t}):Po()).then((o)=>{if(!Le(o))throw new c("HOST_REJECTED","Host request result was empty.");return o}),serviceRequest:(t)=>(ve(t.path)?b({channel:u,v:E,type:"service-request",id:l(d),payload:t}):Po()).then((o)=>{if(!Le(o))throw new c("HOST_REJECTED","Host service request result was empty.");return o}),serviceStatus:()=>b({channel:u,v:E,type:"service-status",id:l(d)}).then((t)=>{if(!ft(t))throw new c("HOST_REJECTED","Host did not return service status.");return t}),readFile:(t)=>(Z(t)?b({channel:u,v:E,type:"file-read",id:l(d),payload:{path:t}}):Pe()).then((o)=>{if(!Ot(o))throw new c("HOST_REJECTED","Host did not return file content.");return o}),writeFile:(t,o)=>{if(!Z(t))return Pe();if(o.length>Me)return Promise.reject(new c("FILE_TOO_LARGE",`Content is over ${Me} characters.`));return b({channel:u,v:E,type:"file-write",id:l(d),payload:{path:t,content:o}}).then((s)=>{if(!At(s))throw new c("HOST_REJECTED","Host did not confirm the write.");return s})},listDir:(t)=>(Z(t)?b({channel:u,v:E,type:"file-list",id:l(d),payload:{path:t}}):Pe()).then((o)=>{if(!Rt(o))throw new c("HOST_REJECTED","Host did not return directory entries.");return o}),stat:(t)=>(Z(t)?b({channel:u,v:E,type:"file-stat",id:l(d),payload:{path:t}}):Pe()).then((o)=>{if(!ht(o))throw new c("HOST_REJECTED","Host did not return file status.");return o}),generate:(t)=>{let o=t.prompt.trim(),s=t.system?.trim();if(o.length===0||o.length>ye)return Promise.reject(new c("HOST_REJECTED",`Prompt must be 1 to ${ye} characters.`));if(s!==void 0&&(s.length===0||s.length>Ne))return Promise.reject(new c("HOST_REJECTED",`System prompt must be 1 to ${Ne} characters.`));let i=t.maxOutputTokens===void 0?void 0:Math.min(pt,Math.max(1,Math.floor(t.maxOutputTokens)));if(i!==void 0&&!Number.isFinite(i))return Promise.reject(new c("HOST_REJECTED","maxOutputTokens must be a number."));let f={prompt:o};if(s!==void 0)f.system=s;if(i!==void 0)f.maxOutputTokens=i;return b({channel:u,v:E,type:"generate",id:l(d),payload:f},e.requestTimeoutMs??ut).then((T)=>{if(!mt(T))throw new c("HOST_REJECTED","Host did not return generated text.");return T})},onLateGenerateResult:(t)=>{j.add(t);for(let o of We.splice(0))A([t],o);return jt(),()=>{j.delete(t)}},setBadge:(t)=>x({channel:u,v:E,type:"badge",id:l(d),payload:{count:St(t)}}),setHeight:(t)=>x({channel:u,v:E,type:"resize",id:l(d),payload:{height:Tt(t)}}),onFileOpen:(t)=>{if(Oe.add(t),!ze)ze=!0,r.addEventListener("keydown",Jt,!0);if(ae)t(ae);return()=>{Oe.delete(t)}},onFileSnapshot:(t)=>(ie=t,()=>{if(ie===t)ie=null}),onFileSaved:(t)=>(Ae.add(t),()=>{Ae.delete(t)}),reportFileChange:(t)=>Je({...I,type:"file-change",payload:{dirty:t.dirty,edited:t.edited}}),requestFileSave:zt,reportFileUnsupported:()=>Je({...I,type:"file-unsupported"}),dispose:()=>{for(let t of z.keys())v({...I,type:"workspace-unsubscribe",id:l(d),payload:{subscriptionId:t}});z.clear();for(let t of J.keys())v({...I,type:"shells-unsubscribe",id:l(d),payload:{subscriptionId:t}});if(J.clear(),G=!0,ne=null,se=null,ie=null,Oe.clear(),Ae.clear(),ze)r.removeEventListener("keydown",Jt,!0);r.removeEventListener("message",Wt),r.removeEventListener("keydown",Qt,!0),r.removeEventListener("pointerover",he),r.removeEventListener("pointermove",he),r.removeEventListener("pointerout",Yt),r.removeEventListener("focus",Zt),r.removeEventListener("blur",qt);for(let t of W.values())clearTimeout(t.timer),t.reject(new c("HOST_UNAVAILABLE","Host client was disposed."));W.clear(),p.clear(),S.clear(),N.clear(),R.clear(),P.clear(),w.clear(),re.clear(),_e.clear(),Se.clear(),Te.clear(),fe.clear(),j.clear(),We.length=0}}};var wo=["browser.open","browser.snapshot","browser.click","browser.type","browser.select","browser.scroll","browser.back","browser.forward","browser.inspect","browser.capture","browser.resize","browser.close"];var Fr=new Set(wo);var Do=["none","agent","user"];var Kr=new Set(Do);var rr=[["--oc-bg","background"],["--oc-elevated","elevated"],["--oc-fg","foreground"],["--oc-muted","muted"],["--oc-subtle","subtle"],["--oc-border","border"],["--oc-hover","hover"],["--oc-selection","selection"],["--oc-focus","focus"],["--oc-primary","primary"],["--oc-muted-surface","mutedSurface"],["--oc-elevated-fg","elevatedForeground"],["--oc-active","active"],["--oc-selection-fg","selectionForeground"],["--oc-primary-fg","primaryForeground"],["--oc-primary-text","primaryText"],["--oc-success-text","successText"],["--oc-warning-text","warningText"],["--oc-error-text","errorText"],["--oc-info-text","infoText"],["--oc-success","success"],["--oc-warning","warning"],["--oc-error","error"],["--oc-info","info"],["--oc-font","font"],["--oc-mono","mono"],["--oc-radius","radius"],["--surface-background","background"],["--surface-elevated","elevated"],["--surface-foreground","foreground"],["--surface-muted-foreground","muted"],["--surface-subtle","subtle"],["--interactive-border","border"],["--interactive-hover","hover"],["--interactive-selection","selection"],["--interactive-focus-ring","focus"],["--primary","primary"],["--surface-muted","mutedSurface"],["--surface-elevated-foreground","elevatedForeground"],["--interactive-active","active"],["--interactive-selection-foreground","selectionForeground"],["--primary-foreground","primaryForeground"],["--primary-text","primaryText"],["--success-text","successText"],["--warning-text","warningText"],["--error-text","errorText"],["--info-text","infoText"],["--status-success","success"],["--status-warning","warning"],["--status-error","error"],["--status-info","info"],["--font-sans","font"],["--font-mono","mono"],["--radius","radius"]],nr=[["--oc-syntax-keyword","--syntax-keyword","syntaxKeyword"],["--oc-syntax-string","--syntax-string","syntaxString"],["--oc-syntax-number","--syntax-number","syntaxNumber"],["--oc-syntax-function","--syntax-function","syntaxFunction"],["--oc-syntax-type","--syntax-type","syntaxType"],["--oc-syntax-comment","--syntax-comment","syntaxComment"],["--oc-syntax-variable","--syntax-variable","syntaxVariable"],["--oc-syntax-operator","--syntax-operator","syntaxOperator"]],Go=(e,r)=>{r.style.colorScheme=e.mode;for(let[n,_]of rr)r.style.setProperty(n,e.tokens[_]);for(let[n,_,p]of nr){let S=e.tokens[p]??"";r.style.setProperty(n,S),r.style.setProperty(_,S)}r.style.setProperty("font-family",e.tokens.font),r.style.setProperty("font-size","0.875rem"),r.style.setProperty("line-height","1.45"),r.style.setProperty("color",e.tokens.foreground)},gt=(e,r)=>{if(Go(e.theme,r),r.dataset)r.dataset.ocSurface=e.surface,r.dataset.ocTheme=e.theme.mode};var sr={"surface-background":"bg","surface-elevated":"elevated","surface-elevated-foreground":"elevated-fg","surface-foreground":"fg","surface-muted-foreground":"muted","surface-muted":"muted-surface","surface-subtle":"subtle","interactive-border":"border","interactive-hover":"hover","interactive-active":"active","interactive-selection":"selection","interactive-selection-foreground":"selection-fg","interactive-focus-ring":"focus",primary:"primary","primary-foreground":"primary-fg","primary-text":"primary-text","success-text":"success-text","warning-text":"warning-text","error-text":"error-text","info-text":"info-text","status-success":"success","status-warning":"warning","status-error":"error","status-info":"info","font-sans":"font","font-mono":"mono",radius:"radius"},O=(e,r)=>`var(--${e}, var(--oc-${sr[e]}, ${r}))`,X=O("surface-background","transparent"),Ge=O("surface-elevated","transparent"),q=O("surface-elevated-foreground","inherit"),L=O("surface-foreground","inherit"),h=O("surface-muted-foreground","gray"),ir=O("surface-muted","transparent"),B=O("interactive-border","currentColor"),U=O("interactive-hover","transparent"),K=O("interactive-active","transparent"),bt=O("interactive-selection","transparent"),Ct=O("interactive-selection-foreground","inherit"),V=O("primary","currentColor"),Ut=O("primary-text","inherit"),kt=O("error-text","inherit"),ar=O("font-sans","inherit"),Mt=O("font-mono","monospace"),$o=O("radius","9px"),yt=`calc(${$o} - 2px)`,Ho=`calc(${$o} - 4px)`,m=(e,r,n="transparent")=>`color-mix(in srgb, ${e} ${r}%, ${n})`,Vo=`background-image: linear-gradient(${U}, ${U});`,Nt=(e,r="0.5px")=>`box-shadow: inset 0 0 0 ${r} ${e}, var(--oc-sdk-field-lift);`,vt="border-color: var(--oc-sdk-edge); box-shadow: var(--oc-sdk-raised-lift);",Xo="box-shadow: var(--oc-sdk-lit);",Lt=`inset 0 0.5px 0 0 ${m(L,8)}, 0 1px 2px 0 rgb(0 0 0 / 0.4)`,cr=`
:root {
  --oc-sdk-edge: ${m(L,16)};
  --oc-sdk-field-bg: ${Ge};
  --oc-sdk-raised-bg: ${X};
  --oc-sdk-field-lift: inset 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --oc-sdk-raised-lift: 0 1px 1.5px 0 rgb(0 0 0 / 0.08);
  --oc-sdk-lit: inset 0 1px 0 0 rgb(255 255 255 / 0.2), 0 1px 1.5px 0 rgb(0 0 0 / 0.1);
  --oc-sdk-float-edge: rgb(0 0 0 / 0.14);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.7), 0 1px 2px -0.5px rgb(0 0 0 / 0.06), 0 4px 8px -2px rgb(0 0 0 / 0.08), 0 12px 20px -4px rgb(0 0 0 / 0.06);
}
:root[data-oc-theme="dark"] {
  --oc-sdk-edge: ${m(L,14)};
  --oc-sdk-field-bg: ${m(X,50,Ge)};
  --oc-sdk-raised-bg: ${Ge};
  --oc-sdk-field-lift: ${Lt};
  --oc-sdk-raised-lift: ${Lt};
  --oc-sdk-lit: ${Lt};
  --oc-sdk-float-edge: rgb(0 0 0 / 0.55);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.04), inset 0 0 0 0.5px rgb(255 255 255 / 0.08), 0 8px 16px 0 rgb(0 0 0 / 0.25), 0 4px 8px 0 rgb(0 0 0 / 0.25);
}`,De=(e)=>{let r=O(`status-${e}`,"currentColor");return`
.oc-sdk[data-tone="${e}"], .oc-sdk [data-tone="${e}"] { --oc-sdk-tone: ${r}; --oc-sdk-tone-text: ${O(`${e}-text`,"inherit")}; }`},dr=`
.oc-sdk { box-sizing: border-box; font-size: 0.875rem; line-height: 1.45; }
.oc-sdk *, .oc-sdk *::before, .oc-sdk *::after { box-sizing: border-box; }
/* :where() keeps the reset at zero specificity so every primitive class below overrides it. */
:where(.oc-sdk) :where(button, input, textarea), :where(button.oc-sdk, input.oc-sdk, textarea.oc-sdk) { font: inherit; color: inherit; margin: 0; }
:where(.oc-sdk) :where(button), :where(button.oc-sdk) { cursor: pointer; background: none; border: 0; padding: 0; }
.oc-sdk button:disabled, button.oc-sdk:disabled, .oc-sdk[aria-disabled="true"], .oc-sdk [aria-disabled="true"] { opacity: .5; pointer-events: none; }

.oc-sdk-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 32px; padding: 0 12px; border: 1px solid transparent; font-size: 0.875rem; font-weight: 500; line-height: 1; white-space: nowrap; }
.oc-sdk-btn[data-size="sm"] { gap: 6px; height: 28px; padding: 0 10px; font-size: 0.8125rem; }
.oc-sdk-btn[data-size="xs"] { gap: 4px; height: 24px; padding: 0 8px; font-size: 0.75rem; }
.oc-sdk-btn[data-loading="true"] { opacity: .5; pointer-events: none; }
.oc-sdk-btn > .oc-sdk-spinner-ring { width: 14px; height: 14px; }

.oc-sdk-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.oc-sdk-field-label { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-field-note { font-size: 0.75rem; }
.oc-sdk-input { display: block; width: 100%; min-width: 0; height: 32px; padding: 0 10px; border: 0; font-size: 0.875rem; line-height: 1.45; appearance: none; }
textarea.oc-sdk-input { height: auto; padding: 8px 10px; resize: vertical; }

.oc-sdk-search { position: relative; min-width: 0; }
.oc-sdk-search .oc-sdk-input { padding-left: 34px; padding-right: 34px; }
.oc-sdk-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); pointer-events: none; }
.oc-sdk-search-clear { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); display: none; align-items: center; justify-content: center; width: 24px; height: 24px; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-clear { display: inline-flex; }

.oc-sdk-select { position: relative; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.oc-sdk-trigger { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; width: auto; max-width: 100%; min-width: 0; height: 28px; padding: 0 10px; border: 1px solid transparent; font-size: 0.8125rem; text-align: left; }
.oc-sdk-trigger-value { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-trigger-chevron { flex: 0 0 auto; }
.oc-sdk-popup { position: fixed; z-index: 50; display: flex; flex-direction: column; gap: 2px; min-width: 160px; max-width: calc(100vw - 16px); max-height: min(320px, calc(100vh - 16px)); overflow: auto; padding: 4px; border: 1px solid transparent; }
.oc-sdk-popup-search { flex: 0 0 auto; padding: 2px 2px 4px; }
.oc-sdk-popup-search .oc-sdk-input { height: 28px; font-size: 0.8125rem; }
.oc-sdk-option { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 8px; font-size: 0.8125rem; text-align: left; }
.oc-sdk-option-label { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-option-hint { flex: 0 0 auto; font-size: 0.75rem; }
.oc-sdk-option-check { flex: 0 0 auto; display: inline-flex; width: 14px; visibility: hidden; }
.oc-sdk-option[aria-selected="true"] > .oc-sdk-option-check { visibility: visible; }
.oc-sdk-popup-empty { padding: 8px; font-size: 0.8125rem; }

.oc-sdk-check { display: inline-flex; align-items: flex-start; gap: 8px; width: 100%; text-align: left; }
.oc-sdk-check-box { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; margin-top: 3px; border: 1px solid transparent; }
.oc-sdk-check-box > svg { display: none; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box > svg { display: block; }
.oc-sdk-check-thumb { flex: 0 0 auto; position: relative; width: 36px; height: 20px; }
.oc-sdk-check-thumb::after { content: ""; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; }
.oc-sdk-check-text { display: flex; flex-direction: column; min-width: 0; }
.oc-sdk-check-label { font-size: 0.875rem; }
.oc-sdk-check-desc { font-size: 0.75rem; }

.oc-sdk-tabs { display: inline-flex; gap: 2px; padding: 2px; max-width: 100%; overflow: auto; }
.oc-sdk-tab { display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border: 1px solid transparent; font-size: 0.8125rem; font-weight: 500; white-space: nowrap; }
.oc-sdk-tab-count { font-size: 0.75rem; font-variant-numeric: tabular-nums; }

.oc-sdk-badge { display: inline-flex; align-items: center; padding: 1px 6px; font-size: 11px; font-weight: 500; line-height: 16px; white-space: nowrap; }

.oc-sdk-list { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.oc-sdk-row { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 8px; text-align: left; }
.oc-sdk-row-lead { flex: 0 0 auto; width: 64px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; }
.oc-sdk-row-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-row-sub { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-meta { flex: 0 0 auto; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-list-empty { padding: 16px 8px; text-align: center; font-size: 0.8125rem; }

.oc-sdk-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 40px 16px; text-align: center; }
.oc-sdk-empty-title { margin: 0; font-size: 0.8125rem; font-weight: 600; }
.oc-sdk-empty-body { margin: 0; max-width: 32rem; font-size: 0.8125rem; }
.oc-sdk-empty-action { margin-top: 12px; }

@keyframes oc-sdk-spin { to { transform: rotate(360deg); } }
.oc-sdk-spinner { display: inline-flex; align-items: center; gap: 8px; font-size: 0.8125rem; }
.oc-sdk-spinner-ring { width: 16px; height: 16px; border: 2px solid transparent; animation: oc-sdk-spin .8s linear infinite; }
.oc-sdk-spinner[data-size="sm"] .oc-sdk-spinner-ring { width: 12px; height: 12px; }

.oc-sdk-banner { display: flex; align-items: flex-start; gap: 12px; padding: 8px 12px; border: 1px solid transparent; }
.oc-sdk-banner-text { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.oc-sdk-banner-title { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-banner-body { font-size: 0.8125rem; }
.oc-sdk-banner-action { flex: 0 0 auto; }

.oc-sdk-separator { display: flex; align-items: center; gap: 8px; width: 100%; margin: 8px 0; font-size: 0.75rem; }
.oc-sdk-separator::before, .oc-sdk-separator::after { content: ""; flex: 1 1 auto; height: 1px; }
.oc-sdk-separator[data-labeled="false"]::after { display: none; }
.oc-sdk-popup > .oc-sdk-separator { margin: 4px 0; }

.oc-sdk-progress { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.oc-sdk-progress-label { display: flex; justify-content: space-between; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-progress-track { height: 6px; overflow: hidden; }
.oc-sdk-progress-fill { height: 100%; transform-origin: left; transition: transform 200ms ease-out; }
.oc-sdk-progress-value { display: inline-flex; align-items: center; gap: 2px; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { font-weight: 600; }

.oc-sdk-menu { position: relative; display: inline-flex; }

.oc-sdk-text { white-space: pre-wrap; overflow-wrap: anywhere; }
.oc-sdk-text img { display: block; max-width: 100%; margin: 8px 0; }
`,Fo=`${cr}
.oc-sdk { color: ${L}; font-family: ${ar}; }
.oc-sdk :focus-visible, .oc-sdk:focus-visible { outline: none; }
.oc-sdk :where(button, a[href], [role="button"], [role="tab"], [role="option"]):focus-visible, button.oc-sdk:focus-visible { ${Vo} }
.oc-sdk-mono { font-family: ${Mt}; }
.oc-sdk-muted { color: ${h}; }
${De("success")}${De("warning")}${De("error")}${De("info")}
.oc-sdk[data-tone="primary"], .oc-sdk [data-tone="primary"] { --oc-sdk-tone: ${V}; --oc-sdk-tone-text: ${Ut}; }

.oc-sdk-btn { border-radius: ${yt}; transition: background 150ms ease-out, color 150ms ease-out; }
.oc-sdk-btn[data-size="xs"] { border-radius: ${Ho}; }
.oc-sdk-btn[data-variant="default"] { color: ${Ut}; background: ${m(V,10,X)}; border-color: ${m(V,12)}; ${Xo} }
.oc-sdk-btn[data-variant="default"]:hover { background: ${m(V,16,X)}; }
.oc-sdk-btn[data-variant="default"]:active { background: ${m(V,22,X)}; box-shadow: none; }
.oc-sdk-btn[data-variant="secondary"] { background: ${ir}; color: var(--oc-fg); }
.oc-sdk-btn[data-variant="secondary"]:hover { background-image: linear-gradient(${U}, ${U}); }
.oc-sdk-btn[data-variant="secondary"]:active { background-image: linear-gradient(${K}, ${K}); }
.oc-sdk-btn[data-variant="outline"] { background: var(--oc-sdk-raised-bg); color: ${q}; ${vt} }
.oc-sdk-btn[data-variant="outline"]:hover { background-image: linear-gradient(${U}, ${U}); }
.oc-sdk-btn[data-variant="outline"]:active { background-image: linear-gradient(${K}, ${K}); box-shadow: none; }
.oc-sdk-btn[data-variant="ghost"] { background: transparent; }
.oc-sdk-btn[data-variant="ghost"]:hover { background: ${U}; }
.oc-sdk-btn[data-variant="ghost"]:active { background: ${K}; }
.oc-sdk-btn[data-variant="destructive"] { --oc-sdk-tone: ${O("status-error","red")}; color: ${kt}; background: ${m("var(--oc-sdk-tone)",7,X)}; border-color: ${m("var(--oc-sdk-tone)",12)}; ${Xo} }
.oc-sdk-btn[data-variant="destructive"]:hover { background: ${m("var(--oc-sdk-tone)",9,X)}; }
.oc-sdk-btn[data-variant="destructive"]:active { background: ${m("var(--oc-sdk-tone)",11,X)}; box-shadow: none; }

.oc-sdk-field-note { color: ${h}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-field-note { color: ${kt}; }
.oc-sdk-input { border-radius: ${yt}; background: var(--oc-sdk-field-bg); color: ${q}; ${Nt("var(--oc-sdk-edge)")} transition: background 150ms ease-out; }
.oc-sdk-input::placeholder { color: ${h}; }
.oc-sdk-input:hover:not(:focus) { background-image: linear-gradient(${U}, ${U}); }
.oc-sdk-input:focus, .oc-sdk-input:focus-visible { ${Nt(m(L,26),"1px")} }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input, .oc-sdk-field[data-invalid="true"] .oc-sdk-input:focus { ${Nt(O("status-error","red"),"1px")} }
.oc-sdk-input[data-mono="true"] { font-family: ${Mt}; }

.oc-sdk-search-icon { color: ${h}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-icon { color: ${V}; }
.oc-sdk-search-clear { border-radius: ${Ho}; color: ${h}; }
.oc-sdk-search-clear:hover { background: ${U}; color: ${L}; }

.oc-sdk-trigger { border-radius: ${yt}; background: var(--oc-sdk-raised-bg); color: ${q}; ${vt} transition: background 150ms ease-out; }
.oc-sdk-trigger:hover { background-image: linear-gradient(${U}, ${U}); }
.oc-sdk-trigger[aria-expanded="true"] { background-image: linear-gradient(${K}, ${K}); }
.oc-sdk-trigger-value[data-empty="true"] { color: ${h}; }
.oc-sdk-trigger-chevron { color: ${h}; }
/* The app's floating level: the glass edge (a hairline ring and a lit top line, dark outside and light inside in dark themes) over soft shadows. The outer ring is the border, over the page like the app's. */
.oc-sdk-popup { --surface-foreground: ${q}; border-color: var(--oc-sdk-float-edge); border-radius: 12px; background: ${Ge}; background-clip: padding-box; color: ${q}; box-shadow: var(--oc-sdk-float); }
.oc-sdk-option { border-radius: 8px; }
.oc-sdk-option[data-active="true"] { background: ${U}; }
/* A selected option shows a check mark in the text colour, like the app's own pickers. Options without the mark come
   from bundles built before it existed and keep the selection fill as their only sign of the choice. */
.oc-sdk-option[aria-selected="true"]:not([data-mark]) { background: ${bt}; color: ${Ct}; }
.oc-sdk-option-check { color: ${L}; }
.oc-sdk-option[data-destructive="true"] { color: ${kt}; }
.oc-sdk-option[data-destructive="true"][data-active="true"] { background: ${m(O("status-error","red"),10)}; }
.oc-sdk-option-hint { color: ${h}; }
.oc-sdk-popup-empty { color: ${h}; }

/* Checked stays neutral: the mark carries the state, and the primary colour stays with primary actions. */
.oc-sdk-check-box { border-color: ${B}; border-radius: 4px; color: ${L}; transition: border-color 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box { border-color: ${m(L,60,B)}; }
.oc-sdk-check-thumb { border-radius: 9999px; background: ${B}; transition: background 150ms ease-out; }
.oc-sdk-check-thumb::after { border-radius: 9999px; background: ${X}; transition: transform 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb { background: ${V}; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb::after { transform: translateX(16px); }
.oc-sdk-check:focus-visible { box-shadow: none; }
.oc-sdk-check:focus-visible .oc-sdk-check-box, .oc-sdk-check:focus-visible .oc-sdk-check-thumb { ${Vo} }
.oc-sdk-check-desc { color: ${h}; }

.oc-sdk-tabs { border-radius: 10px; }
.oc-sdk-tabs[data-track="true"] { background: ${m(L,4)}; box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.16); }
.oc-sdk-tab { border-radius: 8px; color: ${h}; transition: color 150ms ease-out, background 150ms ease-out; }
.oc-sdk-tab:hover { color: ${L}; }
.oc-sdk-tab[aria-selected="true"] { color: ${Ct}; background: ${bt}; border-color: ${B}; }
.oc-sdk-tabs[data-track="true"] .oc-sdk-tab[aria-selected="true"] { color: ${q}; background: var(--oc-sdk-raised-bg); ${vt} }
.oc-sdk-tab-count { color: ${h}; }

/* The app's neutral badge: a step of the text colour, the same in every theme. */
.oc-sdk-badge { border-radius: 9999px; background: ${m(L,6)}; color: ${h}; }
.oc-sdk-badge[data-tone] { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); background: ${m("var(--oc-sdk-tone)",15)}; }

.oc-sdk-row { border-radius: 6px; transition: background 120ms ease-out; }
.oc-sdk-row:hover, .oc-sdk-row[data-active="true"] { background: ${U}; }
.oc-sdk-row[aria-selected="true"] { background: ${bt}; color: ${Ct}; }
.oc-sdk-row-lead { font-family: ${Mt}; color: ${h}; }
.oc-sdk-row-sub { color: ${h}; }
.oc-sdk-row-meta { color: ${h}; }
.oc-sdk-row[aria-selected="true"] .oc-sdk-row-lead, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-sub, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-meta { color: inherit; opacity: .75; }
.oc-sdk-list-empty { color: ${h}; }

.oc-sdk-empty-body { color: ${h}; }

.oc-sdk-spinner { color: ${h}; }
.oc-sdk-spinner-ring { border-color: ${B}; border-top-color: ${V}; border-radius: 9999px; }

/* Set apart by its tint alone, like the app's banners. */
.oc-sdk-banner { border-color: transparent; border-radius: 8px; background: ${m("var(--oc-sdk-tone)",10)}; }
.oc-sdk-banner-title { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); }
.oc-sdk-banner-body { color: ${h}; }

.oc-sdk-separator { color: ${h}; }
.oc-sdk-separator::before, .oc-sdk-separator::after { background: ${m(B,40)}; }

.oc-sdk-progress-label { color: ${h}; }
/* The app's progress: a groove a step of the text colour, green once done. Older bundles mark done only through aria-valuenow. */
.oc-sdk-progress-track { border-radius: 9999px; background: ${m(L,6)}; }
.oc-sdk-progress-fill { border-radius: 9999px; background: var(--oc-sdk-tone, ${V}); }
.oc-sdk-progress-track[aria-valuenow="100"] > .oc-sdk-progress-fill:not([data-tone]) { background: ${O("status-success","currentColor")}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { color: ${O("success-text","inherit")}; }

.oc-sdk-text a { color: ${Ut}; text-decoration: underline; text-underline-offset: 2px; }
.oc-sdk-text img { border-radius: 8px; border: 1px solid ${m(B,60)}; }
`,C=`
${Ze}
${dr}
${Fo}`;var Ee=It(),Dt=document.getElementById("root"),Ko=document.getElementById("usage"),oe=document.getElementById("message"),Ke=document.getElementById("refresh"),Fe=document.getElementById("updated"),jo=new Map,y=null,wt=!1,Gt=!1,$t="en",Ht=!1,Bo=-1,te=(e)=>String(e).padStart(2,"0"),je=(e)=>typeof e==="number"&&Number.isFinite(e)&&e>0,_r=(e,r=Date.now())=>{if(typeof e!=="number"||!Number.isFinite(e)||e<=0)return{label:"Not updated yet",stale:!1};let n=Math.max(0,Math.floor((r-e)/60000));return{label:`Updated ${n<1?"<1":n} min ago`,stale:n>=5}},Sr=(e)=>{if(!je(e))return"—";let r=new Date(e);return`${te(r.getMonth()+1)}-${te(r.getDate())} ${te(r.getHours())}:${te(r.getMinutes())}`},Tr=(e)=>{if(!je(e))return"—";let r=Math.max(0,Math.ceil((e-Date.now())/60000)),n=Math.floor(r/60);if(n>=24)return`${Math.floor(n/24)}d${te(n%24)}h`;if(n)return`${n}h${te(r%60)}m`;return r?`${r}m`:"—"},Be=(e)=>{let r=document.createElement("span");return r.className=`cell ${e}`,r.setAttribute("role","cell"),r};for(let e of["5h","7d"]){let r=document.createElement("div");r.className="usage-row",r.setAttribute("role","row");let n=Be("name");n.textContent=e;let _=Be("reset"),p=document.createElement("span"),S=document.createElement("span");_.append(p,S);let N=Be("countdown"),R=document.createElement("span");R.className="meter",R.setAttribute("role","progressbar"),R.setAttribute("aria-label",`${e} usage`),R.setAttribute("aria-valuemin","0"),R.setAttribute("aria-valuemax","100");let P=document.createElement("span");P.className="fill",R.append(P);let w=Be("percent");r.append(n,_,N,R,w),Ko.append(r),jo.set(e,{row:r,reset:_,resetDate:p,resetTime:S,countdown:N,meter:R,fill:P,percent:w})}function Vt(){let e=_r(y?.cachedAt),r=Ht||Boolean(y?.inflight),n=`${e.label}${e.stale?"; refresh suggested":""}`;if(Fe.textContent!==n)Fe.textContent=n;Fe.dataset.stale=String(e.stale);let p=`Updated ${je(y?.cachedAt)?new Date(y.cachedAt).toLocaleString($t):"never"}${y?.lastAttempt?.error?`
${y.lastAttempt.error}`:""}`;Fe.title=p,Ke.title=`${r?"Refreshing usage…":"Refresh usage"}
${p}`,Ke.disabled=r,Ke.setAttribute("aria-busy",String(r))}function Xt(){let e=y?.usage?.windows,r=e&&["5h","7d"].some((n)=>e[n]);if(Ko.hidden=!r,oe.hidden=Boolean(r),!r)oe.textContent=y?.lastAttempt?.error||(y?.inflight?"Reading usage…":"No usage available. Refresh to try again."),oe.dataset.error=String(Boolean(y?.lastAttempt?.error));for(let[n,_]of jo){let p=e?.[n];if(_.row.hidden=!p,!p)continue;let S=typeof p.usedPercent==="number"&&Number.isFinite(p.usedPercent)?Math.min(100,Math.max(0,p.usedPercent)):null;_.row.dataset.tone=S>=90?"error":S>=75?"warning":"default";let[N,R=""]=Sr(p.resetAt).split(" ");if(_.resetDate.textContent=N,_.resetTime.textContent=R,_.reset.title=je(p.resetAt)?`Resets ${new Date(p.resetAt).toLocaleString($t)}`:"Reset time unavailable",_.countdown.textContent=Tr(p.resetAt),_.countdown.title="Time until reset",_.percent.textContent=S===null?"—":`${Math.round(S)}%`,_.fill.style.width=`${S??0}%`,S===null)_.meter.removeAttribute("aria-valuenow");else _.meter.setAttribute("aria-valuenow",String(S))}Vt()}function Ft(){return!document.hidden&&Dt.getBoundingClientRect().width>0}async function ue(e=!1){if(wt||!Ft())return;if(wt=!0,e)Ht=!0,Vt();try{if(e){if((await Ee.serviceRequest({method:"POST",path:"/status",body:JSON.stringify({id:"refresh"})})).status!==200)throw Error("Could not refresh usage.")}let r=await Ee.serviceRequest({method:"GET",path:"/status-json"});if(r.status!==200)throw Error("Could not read usage.");let n=JSON.parse(r.body);if(n?.ok!==!0)throw Error("Usage service returned an invalid answer.");y=n,Xt()}catch(r){if(y)y.inflight=!1;oe.hidden=!1,oe.dataset.error="true",oe.textContent=r instanceof Error?r.message:"Could not read usage."}finally{wt=!1,Ht=!1,Vt()}}Ke.addEventListener("click",()=>{ue(!0)});Ee.onReady((e)=>{if(gt(e,document.documentElement),$t=e.locale||"en",Ee.setStatusControls([]).catch(()=>{}),Gt){Xt();return}Gt=!0,ue(!0),setInterval(()=>{ue()},5000),setInterval(()=>{ue(!0)},60000),setInterval(()=>{if(Ft()&&y)Xt()},1000)});document.addEventListener("visibilitychange",()=>{if(Gt&&Ft())ue()});new ResizeObserver(()=>{let e=Math.ceil(Dt.getBoundingClientRect().height);if(e===Bo)return;Bo=e,Ee.setHeight(e).catch(()=>{})}).observe(Dt);})();
