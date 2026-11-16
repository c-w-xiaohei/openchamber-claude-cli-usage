(()=>{var _="openchamber.sdk",E=1;var qe=`
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
`;function oo(e){let r=e.documentElement;if(r.hasAttribute("data-oc-scrollbar-activity"))return;r.setAttribute("data-oc-scrollbar-activity","");let n=new WeakMap;e.addEventListener("scroll",(u)=>{let p=u.target===e?r:u.target;if(!(p instanceof Element))return;if(!p.hasAttribute("data-oc-scrolling"))p.setAttribute("data-oc-scrolling","");let S=n.get(p);if(S!==void 0)clearTimeout(S);n.set(p,setTimeout(()=>{n.delete(p),p.removeAttribute("data-oc-scrolling")},1000))},{capture:!0,passive:!0})}var Qo=`(${oo.toString()})(document);`;var et=128,tt=65536;var ge=128;var Ce=65536;var io=/^[a-z][a-z0-9-]{0,39}$/;var ro=(e)=>Object(e)===e&&!Array.isArray(e),ot=(e,r)=>Object.keys(e).every((n)=>r.includes(n)),no=(e)=>String(e)===e&&e.length>=1&&e.length<=60,so=(e)=>String(e)===e&&e.length>=1&&e.length<=80,ao=(e)=>{if(!Array.isArray(e)||e.length>4)return!1;let r=new Set;for(let n of e){if(!ro(n)||!io.test(n.id)||!no(n.label))return!1;if(n.disabled!==void 0&&n.disabled!==!0&&n.disabled!==!1)return!1;if(r.has(n.id))return!1;if(r.add(n.id),n.kind==="button"){if(!ot(n,["kind","id","label","disabled"]))return!1;continue}if(n.kind!=="select"||!ot(n,["kind","id","label","value","options","disabled"]))return!1;if(!so(n.value)||!Array.isArray(n.options)||n.options.length<1||n.options.length>16)return!1;let u=new Set;for(let p of n.options){if(!ro(p)||!ot(p,["value","label"])||!so(p.value)||!no(p.label)||u.has(p.value))return!1;u.add(p.value)}if(!u.has(n.value))return!1}return!0};var co=["{id}","{segment}","{segments+}"];var Ur=new Set(co);var lo=["turn-finished","turn-failed","permission-asked","question-asked","turn-started","session-created","session-archived","session-deleted"];var Mr=new Set(lo);var Ue=20000000,ke=256;var rt=(e)=>("bytes"in e)?e.bytes.byteLength:e.content.length,po=(e,r)=>{if(e.path!==r.path||e.readOnly!==r.readOnly)return!1;if(e.encoding==="text"||r.encoding==="text")return e.encoding==="text"&&r.encoding==="text"&&e.content===r.content;if(e.bytes.byteLength!==r.bytes.byteLength)return!1;for(let n=0;n<e.bytes.byteLength;n+=1)if(e.bytes[n]!==r.bytes[n])return!1;return!0};var uo=/^[A-Za-z0-9_-]{1,80}$/;var _o=["left","right","top","bottom"];var Eo=(e,r=0,n={remaining:16000})=>{if(--n.remaining<0||r>=32)return!1;if(e===null)return!0;let u=Array.isArray(e)?e:Object(e)===e?Object.values(e):[];for(let p of u)if(!Eo(p,r+1,n))return!1;return!0},nt=(e)=>{if(e===null||e===!0||e===!1)return!0;if(Array.isArray(e))return Object.keys(e).every((r)=>/^(0|[1-9]\d*)$/.test(r)&&Number(r)<e.length)&&e.every(nt);if(Object(e)===e){let r=Object.getPrototypeOf(e);return(r===null||r===Object.prototype)&&Object.values(e).every(nt)}return String(e)===e||Number.isFinite(e)},st=(e)=>{try{if(String(e.id)!==e.id||!uo.test(e.id)||!Number.isFinite(e.anchor.x)||Math.abs(e.anchor.x)>1e5||!Number.isFinite(e.anchor.y)||Math.abs(e.anchor.y)>1e5||!Number.isFinite(e.anchor.width)||!Number.isFinite(e.anchor.height)||e.anchor.width<=0||e.anchor.height<=0||e.anchor.width>1e5||e.anchor.height>1e5||!Number.isInteger(e.width)||e.width<160||e.width>640||!Number.isInteger(e.height)||e.height<48||e.height>480||e.side!==void 0&&!_o.includes(e.side)||e.focus!==void 0&&e.focus!==!0&&e.focus!==!1||!Eo(e.data)||!nt(e.data))return!1;return JSON.stringify(e.data).length<=16000}catch{return!1}};var at=2000;var To=["file","directory","other","missing"],ct=(e)=>Boolean(e&&"sessionId"in e),dt=(e)=>Boolean(e&&"sent"in e&&!("sessionId"in e));var fo=/^[0-9a-f]{7,64}$/i,lt=(e)=>fo.test(e),Me=500,ye=32000,Oo=16000,Ao=128,Ro=200,ho=2000,mo=16000,xo=80,Io=200,bo=16000;var go=2000;var pt=20000,Ne=1024,ve=2000000;var Le=64000,Pe=8000,ut=4000;var _t=960000;var Co=999,Uo=1e4,pe=500,ko=["HOST_UNAVAILABLE","HOST_TIMEOUT","HOST_REJECTED","DISCONNECTED","DISABLED","BAD_PATH","NO_INTEGRATION","NO_SERVICE","SERVICE_FAILED","REQUEST_FAILED","RESPONSE_TOO_LARGE","NO_SESSION","SESSION_BUSY","NOT_GRANTED","NO_DIRECTORY","NOT_FOUND","FILE_TOO_LARGE","DENIED","NO_MODEL","MODEL_FAILED","UNSUPPORTED"],Mo=["stopped","starting","ready","failed"],Zo=new Set(ko),yo=(e)=>Zo.has(e),No=(e)=>e&&yo(e)?e:"HOST_REJECTED",Y=(e)=>{if(e===void 0)return!1;if(e===null||e===!0||e===!1)return!0;if(String(e)===e)return!0;if(Number(e)===e)return Number.isFinite(e);if(Array.isArray(e))return e.every(Y);if(Object(e)===e)return Object.values(e).every(Y);return!1},vo=(e)=>Y(e)&&JSON.stringify(e).length<=bo,So=(e)=>e?.trim().slice(0,Io)??"",Z=(e)=>{let r=e.id.trim().slice(0,Ao),n=e.title.trim().slice(0,Ro),u=e.url.trim().slice(0,ho),p=e.text?.trim().slice(0,mo),S=e.author?.trim().slice(0,xo),y=e.kind==="pull"?"pull":"issue",R={providerId:e.providerId.trim(),id:r,title:n||r,url:u,kind:y};if(p)R.text=p;if(S)R.author=S;if(y==="pull"){let L=So(e.branches?.head),P=So(e.branches?.base);if(L&&P)R.branches={head:L,base:P}}if(vo(e.data))R.data=e.data;return R},Et=(e)=>{let r=Z(e);if(e.projectId)r.projectId=e.projectId;if(e.navigation)r.navigation=e.navigation;if(e.worktree)r.worktree=e.worktree;return r},St=(e)=>{let r={text:e.text.trim().slice(0,Oo)};if(e.send)r.send=!0;return r},Tt=(e)=>{if(e===null||!Number.isFinite(e))return null;return Math.min(Co,Math.max(0,Math.round(e)))},ft=(e)=>{if(!Number.isFinite(e))return 0;return Math.min(Uo,Math.max(0,Math.ceil(e)))};var q=(e)=>e.length>0&&e.length<=Ne&&!e.includes("\x00")&&!e.includes("\\");var we=(e)=>{if(!e.startsWith("/")||e.includes("\x00")||e.includes("\\")||e.includes("://"))return!1;if(e.length>go)return!1;return!e.split("/").some((n)=>n==="."||n==="..")},qo=new Set(Mo),Ot=(e)=>Boolean(e&&"status"in e&&qo.has(String(e.status))&&!("body"in e)),De=(e)=>Boolean(e&&"status"in e&&"body"in e&&Number.isInteger(e.status)),At=(e)=>Boolean(e&&"content"in e&&String(e.content)===e.content),Rt=(e)=>Boolean(e&&"written"in e&&e.written===!0),ht=(e)=>Boolean(e&&"entries"in e&&Array.isArray(e.entries)),er=new Set(To),mt=(e)=>Boolean(e&&"kind"in e&&"size"in e&&er.has(String(e.kind))&&Number.isFinite(e.size)),xt=(e)=>Boolean(e&&"text"in e&&String(e.text)===e.text&&!("status"in e)),tr=new Set(["workspace","shells","ready","directory","session","connection","settings","session-lifecycle","item","resolve","action","service-event","status-control-event","popover-closed","file-open","file-snapshot","file-saved","generate-late"]),or=(e)=>Object(e)===e?e:null,it=(e)=>String(e)===e&&e.length>0,rr=(e)=>{if(!it(e.id))return null;if(e.ok===!0){let r={channel:_,v:E,type:"result",id:e.id,ok:!0};if(Object(e.payload)===e.payload)r.payload=e.payload;return r}if(e.ok===!1&&it(e.error))return{channel:_,v:E,type:"result",id:e.id,ok:!1,error:e.error,code:No(it(e.code)?e.code:void 0)};return null},It=(e)=>{let r=or(e);if(!r||r.channel!==_||r.v!==E)return null;if(r.type==="result")return rr(r);if(!tr.has(String(r.type))||Object(r.payload)!==r.payload)return null;return r};var Lo=(e)=>("key"in e)&&("metaKey"in e)&&("ctrlKey"in e),nr=(e)=>(e.metaKey||e.ctrlKey)&&!e.altKey&&!e.shiftKey&&e.key.toLowerCase()==="s";class c extends Error{code;constructor(e,r){super(r);this.name="HostRequestError",this.code=e}}var Po=()=>Promise.reject(new c("BAD_PATH",'Request path must start with "/" and stay on the declared origin.')),Ge=()=>Promise.reject(new c("BAD_PATH",`File path must be 1 to ${Ne} characters without NUL or backslash.`)),He=(e)=>{if(e===void 0)return;if(Object(e)!==e||Array.isArray(e)||e.scope!==void 0&&e.scope!=="instance"&&e.scope!=="device")throw new c("HOST_REJECTED",'Storage scope must be "instance" or "device".');return e.scope==="device"?"device":void 0},l=(e)=>(e.value+=1,`oc-${e.value}`),bt=(e={})=>{let r=e.target??("window"in globalThis?window:null);if(!r)throw new c("HOST_UNAVAILABLE","No window. connectHost runs in a browser frame.");let n=e.acceptSource??((t)=>t===r.parent),u=e.requestTimeoutMs??pt,p=new Set,S=new Set,y=new Set,R=new Set,L=new Set,P=new Set,ne=new Set,fe=new Set,Oe=new Set,Ae=new Set,Re=new Set,W=new Set,ze=[],se=null,ie=null,he=new Set,me=new Set,ae=null,ce=null,Je=!1,z=new Map,J=new Map,Q=new Map,D=!1,d={value:0},a=null,H=null,de=!1,le=!1,Bt=null,Kt=(t)=>{if(!t)return null;return{sessionId:t.id,phase:t.busy?"started":"completed"}},N=(t)=>{r.parent.postMessage(t,"*")},jt=()=>{if(D||r.parent===r||W.size===0||a?.features?.lateGenerateResults!==!0)return;N({channel:_,v:E,type:"generate-late-listen"})},A=(t,o)=>{for(let s of t)try{s(o)}catch(i){console.error(i)}},Wt=(t)=>{if(!(t instanceof MessageEvent))return;if(!n(t.source))return;let o=It(t.data);if(!o)return;if(o.type==="workspace"){let i=J.get(o.payload.subscriptionId);if(i)A([i],o.payload.snapshot);return}if(o.type==="shells"){let i=Q.get(o.payload.subscriptionId);if(i)A([i],o.payload.snapshot);return}if(o.type==="ready"){if(a=o.payload,H=Kt(o.payload.session),A(p,o.payload),A(S,o.payload.directory),A(y,o.payload.session),H)A(R,H);if(A(L,o.payload.connection),A(P,o.payload.settings),A(ne,o.payload.item),o.payload.block)A(fe,o.payload.block);jt();return}if(o.type==="service-event"){A(Oe,o.payload);return}if(o.type==="generate-late"){if(W.size===0)ze.push(o.payload);else A(W,o.payload);return}if(o.type==="directory"){if(a)a={...a,directory:o.payload.directory};A(S,o.payload.directory);return}if(o.type==="session"){if(a)a={...a,session:o.payload.session};if(!o.payload.session)H=null;else if(H?.sessionId!==o.payload.session.id)H=Kt(o.payload.session);A(y,o.payload.session);return}if(o.type==="session-lifecycle"){H=o.payload,A(R,o.payload);return}if(o.type==="connection"){if(a)a={...a,connection:o.payload.connection};A(L,o.payload.connection);return}if(o.type==="settings"){if(a)a={...a,settings:o.payload.settings};A(P,o.payload.settings);return}if(o.type==="item"){if(a)a={...a,item:o.payload.item};A(ne,o.payload.item);return}if(o.type==="status-control-event"){A(Ae,o.payload);return}if(o.type==="popover-closed"){A(Re,o.payload);return}if(o.type==="action"){let i=(T)=>{if(!D)N({channel:_,v:E,type:"action-result",id:o.id,payload:T})},f=ie;if(!f){i({ok:!1,error:"This extension does not handle background actions."});return}Promise.resolve().then(()=>f(o.payload)).then(()=>i({ok:!0}),(T)=>{let b=(T instanceof Error?T.message:String(T)).trim();i({ok:!1,error:(b||"Action failed.").slice(0,pe)})});return}if(o.type==="file-open"){let i=o.payload;if(ce&&po(ce,i))return;ce=i,A(he,o.payload);return}if(o.type==="file-saved"){A(me,o.payload.version);return}if(o.type==="file-snapshot"){let i=(b)=>{if(!D)N({channel:_,v:E,type:"file-snapshot-result",id:o.id,payload:b})},f=(b)=>i({error:(b.trim()||"Could not read the edited file.").slice(0,pe)}),T=ae;if(!T){f("This extension does not edit files.");return}Promise.resolve().then(()=>T(o.payload.purpose)).then((b)=>{if(rt(b)>Ue){f(`The file is over ${Ue} ${"bytes"in b?"bytes":"characters"}.`);return}if(b.version.length>ke){f(`The snapshot version is over ${ke} characters.`);return}i({snapshot:"bytes"in b?{bytes:b.bytes,version:b.version}:{content:b.content,version:b.version}})},(b)=>f(b instanceof Error?b.message:String(b)));return}if(o.type==="resolve"){let i=(T)=>{N({channel:_,v:E,type:"resolve-result",id:o.id,payload:T})},f=se;if(!f){i({error:"This extension does not resolve commands."});return}Promise.resolve().then(()=>f(o.payload)).then((T)=>i({item:T?Z(T):null}),(T)=>{let b=(T instanceof Error?T.message:String(T)).trim();i({error:(b||"Command failed.").slice(0,pe)})});return}let s=z.get(o.id);if(!s)return;if(clearTimeout(s.timer),z.delete(o.id),o.ok){s.resolve(o.payload);return}s.reject(new c(o.code,o.error))};r.addEventListener("message",Wt),N({channel:_,v:E,type:"hello"});let g=(t,o=u)=>{if(D||r.parent===r)return Promise.reject(new c("HOST_UNAVAILABLE","No host frame. This page is not in an iframe."));return new Promise((s,i)=>{let f=setTimeout(()=>{z.delete(t.id),i(new c("HOST_TIMEOUT","Host did not answer in time."))},o);z.set(t.id,{resolve:s,reject:i,timer:f}),N(t)})},x=(t)=>g(t).then(()=>{return}),I={channel:_,v:E},Qe=(t)=>{if(!D&&r.parent!==r)N(t)},zt=()=>Qe({...I,type:"file-save"}),Jt=(t)=>{if(!Lo(t)||!nr(t))return;t.preventDefault(),zt()},Qt=(t)=>{if(!Lo(t)||t.key!=="Escape"||a?.surface!=="popover"||!a.popover)return;t.preventDefault(),eo(a.popover.id,"escape").catch(()=>{return})},xe=()=>{let t=a?.surface==="popover"?a.popover:void 0;if(!t)return;let o=de||le;if(Bt===o)return;Bt=o,to(t.id,o).catch(()=>{return})},Ie=()=>{if(a?.surface!=="popover"||de)return;de=!0,xe()},Yt=(t)=>{if(a?.surface!=="popover"||t.relatedTarget!==null||!de)return;de=!1,xe()},Zt=()=>{if(a?.surface!=="popover"||le)return;le=!0,xe()},qt=()=>{if(a?.surface!=="popover"||!le)return;le=!1,xe()},w=(t,o=1024)=>{if(!t.trim()||t.length>o)throw new c("HOST_REJECTED",`Identity must contain 1 to ${o} characters.`)},Ye=async(t)=>{if(t.kind!=="projects")w(t.projectId);let o=await g({...I,type:"workspace-read",id:l(d),payload:t});if(!o||!("kind"in o)||!("state"in o)||o.kind!==t.kind)throw new c("HOST_REJECTED","Host did not return workspace data.");return o},Ze=async(t,o)=>{if(t.kind!=="projects")w(t.projectId);let s=l(d);J.set(s,o);try{await x({...I,type:"workspace-subscribe",id:l(d),payload:{subscriptionId:s,query:t}})}catch(i){if(J.delete(s),!D)N({...I,type:"workspace-unsubscribe",id:l(d),payload:{subscriptionId:s}});throw i}return()=>{if(!J.delete(s)||D)return;N({...I,type:"workspace-unsubscribe",id:l(d),payload:{subscriptionId:s}})}},Jo=async(t,o)=>{if(t.kind==="session")w(t.sessionId);if(t.kind==="project")w(t.projectId);let s=l(d);Q.set(s,o);try{await x({...I,type:"shells-subscribe",id:l(d),payload:{subscriptionId:s,scope:t}})}catch(i){if(Q.delete(s),!D)N({...I,type:"shells-unsubscribe",id:l(d),payload:{subscriptionId:s}});throw i}return()=>{if(!Q.delete(s)||D)return;N({...I,type:"shells-unsubscribe",id:l(d),payload:{subscriptionId:s}})}},be=async(t)=>{if("key"in t&&(t.key.length===0||t.key.length>et))throw new c("HOST_REJECTED","Storage key must contain 1 to 128 characters.");if(t.op==="set"&&!Y(t.value))throw new c("HOST_REJECTED","Storage values must be JSON.");if(t.op==="set"&&new TextEncoder().encode(JSON.stringify(t.value)).length>tt)throw new c("HOST_REJECTED","Storage value exceeds 64 KiB.");if(t.scope==="device"&&a?.features?.deviceStorage!==!0)throw new c("UNSUPPORTED","This host does not support device storage.");let o=await g({...I,type:"storage",id:l(d),payload:t});if(!o||!("storage"in o)||o.op!==t.op)throw new c("HOST_REJECTED","Host did not return storage data.");return o},eo=(t,o)=>a?.features?.popovers!==!0&&!(a?.surface==="popover"&&a.popover?.id===t)?Promise.reject(new c("UNSUPPORTED","This host does not support popovers.")):x({...I,type:"popover-close",id:l(d),payload:o?{id:t,reason:o}:{id:t}}),to=(t,o)=>a?.features?.popovers!==!0&&!(a?.surface==="popover"&&a.popover?.id===t)?Promise.reject(new c("UNSUPPORTED","This host does not support popovers.")):x({...I,type:"popover-anchor",id:l(d),payload:{id:t,active:o}});return r.addEventListener("keydown",Qt,!0),r.addEventListener("pointerover",Ie),r.addEventListener("pointermove",Ie),r.addEventListener("pointerout",Yt),r.addEventListener("focus",Zt),r.addEventListener("blur",qt),{onAction:(t)=>(ie=t,()=>{if(ie===t)ie=null}),listProjects:async()=>{let t=await Ye({kind:"projects"});if(t.kind!=="projects")throw new c("HOST_REJECTED","Expected projects.");return t},listWorktrees:async(t)=>{let o=await Ye({kind:"worktrees",projectId:t});if(o.kind!=="worktrees")throw new c("HOST_REJECTED","Expected worktrees.");return o},listSessions:async(t)=>{let o=await Ye({kind:"sessions",projectId:t});if(o.kind!=="sessions")throw new c("HOST_REJECTED","Expected sessions.");return o},onProjects:(t)=>Ze({kind:"projects"},(o)=>{if(o.kind==="projects")t(o)}),onWorktrees:(t,o)=>Ze({kind:"worktrees",projectId:t},(s)=>{if(s.kind==="worktrees")o(s)}),onSessions:(t,o)=>Ze({kind:"sessions",projectId:t},(s)=>{if(s.kind==="sessions")o(s)}),onRunningShells:(t,o)=>Jo(t,o),readShellOutput:async(t,o)=>{w(t,ge);let s=o?.cursor;if(s!==void 0&&(!Number.isInteger(s)||s<0))throw new c("HOST_REJECTED","Shell output cursor must be a non-negative integer.");let i=o?.tailBytes;if(i!==void 0&&(!Number.isInteger(i)||i<1||i>Ce))throw new c("HOST_REJECTED",`Shell output tailBytes must be an integer between 1 and ${Ce}.`);let T=await g({...I,type:"shell-output",id:l(d),payload:{shellId:t,cursor:s,tailBytes:i}});if(!T||typeof T.output!=="string"||!Number.isFinite(T.cursor))throw new c("HOST_REJECTED","Host did not return shell output.");return T},stopShell:async(t)=>{if(w(t,ge),(await g({...I,type:"shell-stop",id:l(d),payload:{shellId:t}}))?.stopped!==!0)throw new c("HOST_REJECTED","Host did not stop the shell.");return{stopped:!0}},openSession:async(t)=>{w(t),await x({...I,type:"open-session",id:l(d),payload:{sessionId:t}})},storage:{get:async(t,o)=>{let s=He(o),i={op:"get",key:t};if(s)i.scope=s;let f=await be(i);return f.op==="get"&&f.found?f.value:void 0},set:async(t,o,s)=>{let i=He(s),f={op:"set",key:t,value:o};if(i)f.scope=i;await be(f)},delete:async(t,o)=>{let s=He(o),i={op:"delete",key:t};if(s)i.scope=s;await be(i)},keys:async(t)=>{let o=He(t),s={op:"keys"};if(o)s.scope=o;let i=await be(s);if(i.op!=="keys")throw new c("HOST_REJECTED","Expected storage keys.");return i.keys}},onReady:(t)=>{if(p.add(t),a)t(a);return()=>{p.delete(t)}},onDirectory:(t)=>{if(S.add(t),a)t(a.directory);return()=>{S.delete(t)}},onSession:(t)=>{if(y.add(t),a)t(a.session);return()=>{y.delete(t)}},onSessionLifecycle:(t)=>{if(R.add(t),H)t(H);return()=>{R.delete(t)}},onConnection:(t)=>{if(L.add(t),a)t(a.connection);return()=>{L.delete(t)}},onSettings:(t)=>{if(P.add(t),a)t(a.settings);return()=>{P.delete(t)}},onItem:(t)=>{if(ne.add(t),a)t(a.item);return()=>{ne.delete(t)}},onBlock:(t)=>{if(fe.add(t),a?.block)t(a.block);return()=>{fe.delete(t)}},onServiceEvent:(t)=>(Oe.add(t),()=>{Oe.delete(t)}),onStatusControl:(t)=>(Ae.add(t),()=>{Ae.delete(t)}),onPopoverClosed:(t)=>(Re.add(t),()=>{Re.delete(t)}),setStatusControls:(t)=>{if(a?.features?.statusControls!==!0)return Promise.reject(new c("UNSUPPORTED","This host does not support status controls."));if(!ao(t))return Promise.reject(new c("HOST_REJECTED","Status controls must have unique bounded ids and valid selected options."));return x({...I,type:"status-controls",id:l(d),payload:{controls:t}})},openPopover:(t)=>{if(a?.features?.popovers!==!0)return Promise.reject(new c("UNSUPPORTED","This host does not support popovers."));if(!st(t))return Promise.reject(new c("HOST_REJECTED","Popover requests need bounded geometry and JSON data."));return x({...I,type:"popover-open",id:l(d),payload:t})},closePopover:eo,setPopoverAnchorActive:to,onResolve:(t)=>(se=t,()=>{if(se===t)se=null}),toast:(t)=>{let o=t.message.trim();if(!o||o.length>Me)return Promise.reject(new c("HOST_REJECTED",`Toast message must contain 1 to ${Me} characters.`));if(t.copy&&t.copy!==!0&&(!t.copy.text.length||t.copy.text.length>ye))return Promise.reject(new c("HOST_REJECTED",`Toast copy text must contain 1 to ${ye} characters.`));return x({channel:_,v:E,type:"toast",id:l(d),payload:{...t,message:o}})},openUrl:(t)=>x({channel:_,v:E,type:"open-url",id:l(d),payload:{url:t}}),openCommit:(t)=>lt(t)?x({channel:_,v:E,type:"open-commit",id:l(d),payload:{sha:t}}):Promise.reject(new c("HOST_REJECTED","Commit id must be 7 to 64 hex characters.")),answerBlock:(t)=>x({channel:_,v:E,type:"block-answer",id:l(d),payload:{text:t.trim().slice(0,at)}}),openSurface:(t)=>x({channel:_,v:E,type:"open-surface",id:l(d),payload:{surfaceId:t}}),writeClipboard:(t)=>x({channel:_,v:E,type:"clipboard-write",id:l(d),payload:{text:t}}),compose:(t)=>x({channel:_,v:E,type:"compose",id:l(d),payload:t}),attach:(t)=>x({channel:_,v:E,type:"attach",id:l(d),payload:Z(t)}),startSession:async(t)=>{if(t.projectId!==void 0)w(t.projectId);let o=t.worktree;if(o&&o!==!0)if(o.kind==="existing")w(o.directory);else{if(o.name!==void 0)w(o.name,200);if(o.baseBranch!==void 0)w(o.baseBranch,200)}let s=await g({channel:_,v:E,type:"start-session",id:l(d),payload:Et(t)},e.requestTimeoutMs??180000);if(!ct(s))throw new c("HOST_REJECTED","Host did not return a session.");return s},prompt:(t)=>g({channel:_,v:E,type:"prompt",id:l(d),payload:St(t)}).then((o)=>{if(!dt(o))throw new c("HOST_REJECTED","Host did not return a prompt result.");return o}),sessionLink:(t)=>x({channel:_,v:E,type:"session-link",id:l(d),payload:Z(t)}),close:()=>x({channel:_,v:E,type:"close",id:l(d)}),oauthStart:()=>x({channel:_,v:E,type:"oauth-start",id:l(d)}),oauthDisconnect:()=>x({channel:_,v:E,type:"oauth-disconnect",id:l(d)}),request:(t)=>(we(t.path)?g({channel:_,v:E,type:"request",id:l(d),payload:t}):Po()).then((o)=>{if(!De(o))throw new c("HOST_REJECTED","Host request result was empty.");return o}),serviceRequest:(t)=>(we(t.path)?g({channel:_,v:E,type:"service-request",id:l(d),payload:t}):Po()).then((o)=>{if(!De(o))throw new c("HOST_REJECTED","Host service request result was empty.");return o}),serviceStatus:()=>g({channel:_,v:E,type:"service-status",id:l(d)}).then((t)=>{if(!Ot(t))throw new c("HOST_REJECTED","Host did not return service status.");return t}),readFile:(t)=>(q(t)?g({channel:_,v:E,type:"file-read",id:l(d),payload:{path:t}}):Ge()).then((o)=>{if(!At(o))throw new c("HOST_REJECTED","Host did not return file content.");return o}),writeFile:(t,o)=>{if(!q(t))return Ge();if(o.length>ve)return Promise.reject(new c("FILE_TOO_LARGE",`Content is over ${ve} characters.`));return g({channel:_,v:E,type:"file-write",id:l(d),payload:{path:t,content:o}}).then((s)=>{if(!Rt(s))throw new c("HOST_REJECTED","Host did not confirm the write.");return s})},listDir:(t)=>(q(t)?g({channel:_,v:E,type:"file-list",id:l(d),payload:{path:t}}):Ge()).then((o)=>{if(!ht(o))throw new c("HOST_REJECTED","Host did not return directory entries.");return o}),stat:(t)=>(q(t)?g({channel:_,v:E,type:"file-stat",id:l(d),payload:{path:t}}):Ge()).then((o)=>{if(!mt(o))throw new c("HOST_REJECTED","Host did not return file status.");return o}),generate:(t)=>{let o=t.prompt.trim(),s=t.system?.trim();if(o.length===0||o.length>Le)return Promise.reject(new c("HOST_REJECTED",`Prompt must be 1 to ${Le} characters.`));if(s!==void 0&&(s.length===0||s.length>Pe))return Promise.reject(new c("HOST_REJECTED",`System prompt must be 1 to ${Pe} characters.`));let i=t.maxOutputTokens===void 0?void 0:Math.min(ut,Math.max(1,Math.floor(t.maxOutputTokens)));if(i!==void 0&&!Number.isFinite(i))return Promise.reject(new c("HOST_REJECTED","maxOutputTokens must be a number."));let f={prompt:o};if(s!==void 0)f.system=s;if(i!==void 0)f.maxOutputTokens=i;return g({channel:_,v:E,type:"generate",id:l(d),payload:f},e.requestTimeoutMs??_t).then((T)=>{if(!xt(T))throw new c("HOST_REJECTED","Host did not return generated text.");return T})},onLateGenerateResult:(t)=>{W.add(t);for(let o of ze.splice(0))A([t],o);return jt(),()=>{W.delete(t)}},setBadge:(t)=>x({channel:_,v:E,type:"badge",id:l(d),payload:{count:Tt(t)}}),setHeight:(t)=>x({channel:_,v:E,type:"resize",id:l(d),payload:{height:ft(t)}}),onFileOpen:(t)=>{if(he.add(t),!Je)Je=!0,r.addEventListener("keydown",Jt,!0);if(ce)t(ce);return()=>{he.delete(t)}},onFileSnapshot:(t)=>(ae=t,()=>{if(ae===t)ae=null}),onFileSaved:(t)=>(me.add(t),()=>{me.delete(t)}),reportFileChange:(t)=>Qe({...I,type:"file-change",payload:{dirty:t.dirty,edited:t.edited}}),requestFileSave:zt,reportFileUnsupported:()=>Qe({...I,type:"file-unsupported"}),dispose:()=>{for(let t of J.keys())N({...I,type:"workspace-unsubscribe",id:l(d),payload:{subscriptionId:t}});J.clear();for(let t of Q.keys())N({...I,type:"shells-unsubscribe",id:l(d),payload:{subscriptionId:t}});if(Q.clear(),D=!0,se=null,ie=null,ae=null,he.clear(),me.clear(),Je)r.removeEventListener("keydown",Jt,!0);r.removeEventListener("message",Wt),r.removeEventListener("keydown",Qt,!0),r.removeEventListener("pointerover",Ie),r.removeEventListener("pointermove",Ie),r.removeEventListener("pointerout",Yt),r.removeEventListener("focus",Zt),r.removeEventListener("blur",qt);for(let t of z.values())clearTimeout(t.timer),t.reject(new c("HOST_UNAVAILABLE","Host client was disposed."));z.clear(),p.clear(),S.clear(),y.clear(),R.clear(),L.clear(),P.clear(),ne.clear(),fe.clear(),Oe.clear(),Ae.clear(),Re.clear(),W.clear(),ze.length=0}}};var wo=["browser.open","browser.snapshot","browser.click","browser.type","browser.select","browser.scroll","browser.back","browser.forward","browser.inspect","browser.capture","browser.resize","browser.close"];var Kr=new Set(wo);var Do=["none","agent","user"];var Wr=new Set(Do);var sr=[["--oc-bg","background"],["--oc-elevated","elevated"],["--oc-fg","foreground"],["--oc-muted","muted"],["--oc-subtle","subtle"],["--oc-border","border"],["--oc-hover","hover"],["--oc-selection","selection"],["--oc-focus","focus"],["--oc-primary","primary"],["--oc-muted-surface","mutedSurface"],["--oc-elevated-fg","elevatedForeground"],["--oc-active","active"],["--oc-selection-fg","selectionForeground"],["--oc-primary-fg","primaryForeground"],["--oc-primary-text","primaryText"],["--oc-success-text","successText"],["--oc-warning-text","warningText"],["--oc-error-text","errorText"],["--oc-info-text","infoText"],["--oc-success","success"],["--oc-warning","warning"],["--oc-error","error"],["--oc-info","info"],["--oc-font","font"],["--oc-mono","mono"],["--oc-radius","radius"],["--surface-background","background"],["--surface-elevated","elevated"],["--surface-foreground","foreground"],["--surface-muted-foreground","muted"],["--surface-subtle","subtle"],["--interactive-border","border"],["--interactive-hover","hover"],["--interactive-selection","selection"],["--interactive-focus-ring","focus"],["--primary","primary"],["--surface-muted","mutedSurface"],["--surface-elevated-foreground","elevatedForeground"],["--interactive-active","active"],["--interactive-selection-foreground","selectionForeground"],["--primary-foreground","primaryForeground"],["--primary-text","primaryText"],["--success-text","successText"],["--warning-text","warningText"],["--error-text","errorText"],["--info-text","infoText"],["--status-success","success"],["--status-warning","warning"],["--status-error","error"],["--status-info","info"],["--font-sans","font"],["--font-mono","mono"],["--radius","radius"]],ir=[["--oc-syntax-keyword","--syntax-keyword","syntaxKeyword"],["--oc-syntax-string","--syntax-string","syntaxString"],["--oc-syntax-number","--syntax-number","syntaxNumber"],["--oc-syntax-function","--syntax-function","syntaxFunction"],["--oc-syntax-type","--syntax-type","syntaxType"],["--oc-syntax-comment","--syntax-comment","syntaxComment"],["--oc-syntax-variable","--syntax-variable","syntaxVariable"],["--oc-syntax-operator","--syntax-operator","syntaxOperator"]],Go=(e,r)=>{r.style.colorScheme=e.mode;for(let[n,u]of sr)r.style.setProperty(n,e.tokens[u]);for(let[n,u,p]of ir){let S=e.tokens[p]??"";r.style.setProperty(n,S),r.style.setProperty(u,S)}r.style.setProperty("font-family",e.tokens.font),r.style.setProperty("font-size","0.875rem"),r.style.setProperty("line-height","1.45"),r.style.setProperty("color",e.tokens.foreground)},gt=(e,r)=>{if(Go(e.theme,r),r.dataset)r.dataset.ocSurface=e.surface,r.dataset.ocTheme=e.theme.mode};var ar={"surface-background":"bg","surface-elevated":"elevated","surface-elevated-foreground":"elevated-fg","surface-foreground":"fg","surface-muted-foreground":"muted","surface-muted":"muted-surface","surface-subtle":"subtle","interactive-border":"border","interactive-hover":"hover","interactive-active":"active","interactive-selection":"selection","interactive-selection-foreground":"selection-fg","interactive-focus-ring":"focus",primary:"primary","primary-foreground":"primary-fg","primary-text":"primary-text","success-text":"success-text","warning-text":"warning-text","error-text":"error-text","info-text":"info-text","status-success":"success","status-warning":"warning","status-error":"error","status-info":"info","font-sans":"font","font-mono":"mono",radius:"radius"},O=(e,r)=>`var(--${e}, var(--oc-${ar[e]}, ${r}))`,X=O("surface-background","transparent"),Xe=O("surface-elevated","transparent"),ee=O("surface-elevated-foreground","inherit"),v=O("surface-foreground","inherit"),h=O("surface-muted-foreground","gray"),cr=O("surface-muted","transparent"),B=O("interactive-border","currentColor"),U=O("interactive-hover","transparent"),K=O("interactive-active","transparent"),Ct=O("interactive-selection","transparent"),Ut=O("interactive-selection-foreground","inherit"),V=O("primary","currentColor"),kt=O("primary-text","inherit"),Mt=O("error-text","inherit"),dr=O("font-sans","inherit"),yt=O("font-mono","monospace"),$o=O("radius","9px"),Nt=`calc(${$o} - 2px)`,Ho=`calc(${$o} - 4px)`,m=(e,r,n="transparent")=>`color-mix(in srgb, ${e} ${r}%, ${n})`,Vo=`background-image: linear-gradient(${U}, ${U});`,vt=(e,r="0.5px")=>`box-shadow: inset 0 0 0 ${r} ${e}, var(--oc-sdk-field-lift);`,Lt="border-color: var(--oc-sdk-edge); box-shadow: var(--oc-sdk-raised-lift);",Xo="box-shadow: var(--oc-sdk-lit);",Pt=`inset 0 0.5px 0 0 ${m(v,8)}, 0 1px 2px 0 rgb(0 0 0 / 0.4)`,lr=`
:root {
  --oc-sdk-edge: ${m(v,16)};
  --oc-sdk-field-bg: ${Xe};
  --oc-sdk-raised-bg: ${X};
  --oc-sdk-field-lift: inset 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --oc-sdk-raised-lift: 0 1px 1.5px 0 rgb(0 0 0 / 0.08);
  --oc-sdk-lit: inset 0 1px 0 0 rgb(255 255 255 / 0.2), 0 1px 1.5px 0 rgb(0 0 0 / 0.1);
  --oc-sdk-float-edge: rgb(0 0 0 / 0.14);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.7), 0 1px 2px -0.5px rgb(0 0 0 / 0.06), 0 4px 8px -2px rgb(0 0 0 / 0.08), 0 12px 20px -4px rgb(0 0 0 / 0.06);
}
:root[data-oc-theme="dark"] {
  --oc-sdk-edge: ${m(v,14)};
  --oc-sdk-field-bg: ${m(X,50,Xe)};
  --oc-sdk-raised-bg: ${Xe};
  --oc-sdk-field-lift: ${Pt};
  --oc-sdk-raised-lift: ${Pt};
  --oc-sdk-lit: ${Pt};
  --oc-sdk-float-edge: rgb(0 0 0 / 0.55);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.04), inset 0 0 0 0.5px rgb(255 255 255 / 0.08), 0 8px 16px 0 rgb(0 0 0 / 0.25), 0 4px 8px 0 rgb(0 0 0 / 0.25);
}`,Ve=(e)=>{let r=O(`status-${e}`,"currentColor");return`
.oc-sdk[data-tone="${e}"], .oc-sdk [data-tone="${e}"] { --oc-sdk-tone: ${r}; --oc-sdk-tone-text: ${O(`${e}-text`,"inherit")}; }`},pr=`
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
`,Fo=`${lr}
.oc-sdk { color: ${v}; font-family: ${dr}; }
.oc-sdk :focus-visible, .oc-sdk:focus-visible { outline: none; }
.oc-sdk :where(button, a[href], [role="button"], [role="tab"], [role="option"]):focus-visible, button.oc-sdk:focus-visible { ${Vo} }
.oc-sdk-mono { font-family: ${yt}; }
.oc-sdk-muted { color: ${h}; }
${Ve("success")}${Ve("warning")}${Ve("error")}${Ve("info")}
.oc-sdk[data-tone="primary"], .oc-sdk [data-tone="primary"] { --oc-sdk-tone: ${V}; --oc-sdk-tone-text: ${kt}; }

.oc-sdk-btn { border-radius: ${Nt}; transition: background 150ms ease-out, color 150ms ease-out; }
.oc-sdk-btn[data-size="xs"] { border-radius: ${Ho}; }
.oc-sdk-btn[data-variant="default"] { color: ${kt}; background: ${m(V,10,X)}; border-color: ${m(V,12)}; ${Xo} }
.oc-sdk-btn[data-variant="default"]:hover { background: ${m(V,16,X)}; }
.oc-sdk-btn[data-variant="default"]:active { background: ${m(V,22,X)}; box-shadow: none; }
.oc-sdk-btn[data-variant="secondary"] { background: ${cr}; color: var(--oc-fg); }
.oc-sdk-btn[data-variant="secondary"]:hover { background-image: linear-gradient(${U}, ${U}); }
.oc-sdk-btn[data-variant="secondary"]:active { background-image: linear-gradient(${K}, ${K}); }
.oc-sdk-btn[data-variant="outline"] { background: var(--oc-sdk-raised-bg); color: ${ee}; ${Lt} }
.oc-sdk-btn[data-variant="outline"]:hover { background-image: linear-gradient(${U}, ${U}); }
.oc-sdk-btn[data-variant="outline"]:active { background-image: linear-gradient(${K}, ${K}); box-shadow: none; }
.oc-sdk-btn[data-variant="ghost"] { background: transparent; }
.oc-sdk-btn[data-variant="ghost"]:hover { background: ${U}; }
.oc-sdk-btn[data-variant="ghost"]:active { background: ${K}; }
.oc-sdk-btn[data-variant="destructive"] { --oc-sdk-tone: ${O("status-error","red")}; color: ${Mt}; background: ${m("var(--oc-sdk-tone)",7,X)}; border-color: ${m("var(--oc-sdk-tone)",12)}; ${Xo} }
.oc-sdk-btn[data-variant="destructive"]:hover { background: ${m("var(--oc-sdk-tone)",9,X)}; }
.oc-sdk-btn[data-variant="destructive"]:active { background: ${m("var(--oc-sdk-tone)",11,X)}; box-shadow: none; }

.oc-sdk-field-note { color: ${h}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-field-note { color: ${Mt}; }
.oc-sdk-input { border-radius: ${Nt}; background: var(--oc-sdk-field-bg); color: ${ee}; ${vt("var(--oc-sdk-edge)")} transition: background 150ms ease-out; }
.oc-sdk-input::placeholder { color: ${h}; }
.oc-sdk-input:hover:not(:focus) { background-image: linear-gradient(${U}, ${U}); }
.oc-sdk-input:focus, .oc-sdk-input:focus-visible { ${vt(m(v,26),"1px")} }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input, .oc-sdk-field[data-invalid="true"] .oc-sdk-input:focus { ${vt(O("status-error","red"),"1px")} }
.oc-sdk-input[data-mono="true"] { font-family: ${yt}; }

.oc-sdk-search-icon { color: ${h}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-icon { color: ${V}; }
.oc-sdk-search-clear { border-radius: ${Ho}; color: ${h}; }
.oc-sdk-search-clear:hover { background: ${U}; color: ${v}; }

.oc-sdk-trigger { border-radius: ${Nt}; background: var(--oc-sdk-raised-bg); color: ${ee}; ${Lt} transition: background 150ms ease-out; }
.oc-sdk-trigger:hover { background-image: linear-gradient(${U}, ${U}); }
.oc-sdk-trigger[aria-expanded="true"] { background-image: linear-gradient(${K}, ${K}); }
.oc-sdk-trigger-value[data-empty="true"] { color: ${h}; }
.oc-sdk-trigger-chevron { color: ${h}; }
/* The app's floating level: the glass edge (a hairline ring and a lit top line, dark outside and light inside in dark themes) over soft shadows. The outer ring is the border, over the page like the app's. */
.oc-sdk-popup { --surface-foreground: ${ee}; border-color: var(--oc-sdk-float-edge); border-radius: 12px; background: ${Xe}; background-clip: padding-box; color: ${ee}; box-shadow: var(--oc-sdk-float); }
.oc-sdk-option { border-radius: 8px; }
.oc-sdk-option[data-active="true"] { background: ${U}; }
/* A selected option shows a check mark in the text colour, like the app's own pickers. Options without the mark come
   from bundles built before it existed and keep the selection fill as their only sign of the choice. */
.oc-sdk-option[aria-selected="true"]:not([data-mark]) { background: ${Ct}; color: ${Ut}; }
.oc-sdk-option-check { color: ${v}; }
.oc-sdk-option[data-destructive="true"] { color: ${Mt}; }
.oc-sdk-option[data-destructive="true"][data-active="true"] { background: ${m(O("status-error","red"),10)}; }
.oc-sdk-option-hint { color: ${h}; }
.oc-sdk-popup-empty { color: ${h}; }

/* Checked stays neutral: the mark carries the state, and the primary colour stays with primary actions. */
.oc-sdk-check-box { border-color: ${B}; border-radius: 4px; color: ${v}; transition: border-color 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box { border-color: ${m(v,60,B)}; }
.oc-sdk-check-thumb { border-radius: 9999px; background: ${B}; transition: background 150ms ease-out; }
.oc-sdk-check-thumb::after { border-radius: 9999px; background: ${X}; transition: transform 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb { background: ${V}; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb::after { transform: translateX(16px); }
.oc-sdk-check:focus-visible { box-shadow: none; }
.oc-sdk-check:focus-visible .oc-sdk-check-box, .oc-sdk-check:focus-visible .oc-sdk-check-thumb { ${Vo} }
.oc-sdk-check-desc { color: ${h}; }

.oc-sdk-tabs { border-radius: 10px; }
.oc-sdk-tabs[data-track="true"] { background: ${m(v,4)}; box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.16); }
.oc-sdk-tab { border-radius: 8px; color: ${h}; transition: color 150ms ease-out, background 150ms ease-out; }
.oc-sdk-tab:hover { color: ${v}; }
.oc-sdk-tab[aria-selected="true"] { color: ${Ut}; background: ${Ct}; border-color: ${B}; }
.oc-sdk-tabs[data-track="true"] .oc-sdk-tab[aria-selected="true"] { color: ${ee}; background: var(--oc-sdk-raised-bg); ${Lt} }
.oc-sdk-tab-count { color: ${h}; }

/* The app's neutral badge: a step of the text colour, the same in every theme. */
.oc-sdk-badge { border-radius: 9999px; background: ${m(v,6)}; color: ${h}; }
.oc-sdk-badge[data-tone] { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); background: ${m("var(--oc-sdk-tone)",15)}; }

.oc-sdk-row { border-radius: 6px; transition: background 120ms ease-out; }
.oc-sdk-row:hover, .oc-sdk-row[data-active="true"] { background: ${U}; }
.oc-sdk-row[aria-selected="true"] { background: ${Ct}; color: ${Ut}; }
.oc-sdk-row-lead { font-family: ${yt}; color: ${h}; }
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
.oc-sdk-progress-track { border-radius: 9999px; background: ${m(v,6)}; }
.oc-sdk-progress-fill { border-radius: 9999px; background: var(--oc-sdk-tone, ${V}); }
.oc-sdk-progress-track[aria-valuenow="100"] > .oc-sdk-progress-fill:not([data-tone]) { background: ${O("status-success","currentColor")}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { color: ${O("success-text","inherit")}; }

.oc-sdk-text a { color: ${kt}; text-decoration: underline; text-underline-offset: 2px; }
.oc-sdk-text img { border-radius: 8px; border: 1px solid ${m(B,60)}; }
`,C=`
${qe}
${pr}
${Fo}`;var j=bt(),Ht=document.getElementById("root"),jo=document.getElementById("usage"),re=document.getElementById("message"),Wo=new Map,G=null,Dt=!1,We=!1,zo="en",Vt=!1,Ee="",_e=null,Gt=0,Bo=["◐","◓","◑","◒"],Ko=-1,oe=(e)=>String(e).padStart(2,"0"),$t=(e)=>typeof e==="number"&&Number.isFinite(e)&&e>0,Tr=(e,r=Date.now())=>{if(typeof e!=="number"||!Number.isFinite(e)||e<=0)return{label:"",minutes:0};let n=Math.max(0,Math.floor((r-e)/60000));return{label:n<1?"":`${n}m ago`,minutes:n}},fr=(e)=>{if(!$t(e))return"—";let r=new Date(e);return`${oe(r.getMonth()+1)}-${oe(r.getDate())} ${oe(r.getHours())}:${oe(r.getMinutes())}`},Or=(e)=>{if(!$t(e))return"—";let r=Math.max(0,Math.ceil((e-Date.now())/60000)),n=Math.floor(r/60);if(n>=24)return`${Math.floor(n/24)}d${oe(n%24)}h`;if(n)return`${n}h${oe(r%60)}m`;return r?`${r}m`:"—"},je=(e)=>{let r=document.createElement("span");return r.className=`cell ${e}`,r.setAttribute("role","cell"),r};for(let e of["5h","7d"]){let r=document.createElement("div");r.className="usage-row",r.setAttribute("role","row");let n=je("name");n.textContent=e;let u=je("reset"),p=document.createElement("span"),S=document.createElement("span");u.append(p,S);let y=je("countdown"),R=document.createElement("span");R.className="meter",R.setAttribute("role","progressbar"),R.setAttribute("aria-label",`${e} usage`),R.setAttribute("aria-valuemin","0"),R.setAttribute("aria-valuemax","100");let L=document.createElement("span");L.className="fill",R.append(L);let P=je("percent");r.append(n,u,y,R,P),jo.append(r),Wo.set(e,{row:r,reset:u,resetDate:p,resetTime:S,countdown:y,meter:R,fill:L,percent:P})}function Te(){let e=Vt||Boolean(G?.inflight);if(e&&_e===null)_e=setInterval(()=>{Gt=(Gt+1)%Bo.length,Te()},250);else if(!e&&_e!==null)clearInterval(_e),_e=null;let{minutes:r}=Tr(G?.cachedAt),u=[{kind:"button",id:"refresh",label:e?Bo[Gt]:r>=1?`↻ ${r}m`:"↻",disabled:e}],p=JSON.stringify(u);if(p===Ee)return;Ee=p,j.setStatusControls(u).catch(()=>{Ee=""})}function Xt(){let e=G?.usage?.windows,r=e&&["5h","7d"].some((n)=>e[n]);if(jo.hidden=!r,re.hidden=Boolean(r),!r)re.textContent=G?.lastAttempt?.error||(G?.inflight?"Reading usage…":"No usage available. Refresh to try again."),re.dataset.error=String(Boolean(G?.lastAttempt?.error));for(let[n,u]of Wo){let p=e?.[n];if(u.row.hidden=!p,!p)continue;let S=typeof p.usedPercent==="number"&&Number.isFinite(p.usedPercent)?Math.min(100,Math.max(0,p.usedPercent)):null;u.row.dataset.tone=S>=90?"error":S>=75?"warning":"default";let[y,R=""]=fr(p.resetAt).split(" ");if(u.resetDate.textContent=y,u.resetTime.textContent=R,u.reset.title=$t(p.resetAt)?`Resets ${new Date(p.resetAt).toLocaleString(zo)}`:"Reset time unavailable",u.countdown.textContent=Or(p.resetAt),u.countdown.title="Time until reset",u.percent.textContent=S===null?"—":`${Math.round(S)}%`,u.fill.style.width=`${S??0}%`,S===null)u.meter.removeAttribute("aria-valuenow");else u.meter.setAttribute("aria-valuenow",String(S))}Te()}function Ft(){return!document.hidden&&Ht.getBoundingClientRect().width>0}async function Se(e=!1){if(Dt||!Ft())return;if(Dt=!0,e)Vt=!0,Te();try{if(e){if((await j.serviceRequest({method:"POST",path:"/status",body:JSON.stringify({id:"refresh"})})).status!==200)throw Error("Could not refresh usage.")}let r=await j.serviceRequest({method:"GET",path:"/status-json"});if(r.status!==200)throw Error("Could not read usage.");let n=JSON.parse(r.body);if(n?.ok!==!0)throw Error("Usage service returned an invalid answer.");G=n,Xt()}catch(r){if(G)G.inflight=!1;re.hidden=!1,re.dataset.error="true",re.textContent=r instanceof Error?r.message:"Could not read usage."}finally{Dt=!1,Vt=!1,Te()}}j.onStatusControl((e)=>{if(e.id==="refresh")Se(!0)});j.onDirectory(()=>{if(Ee="",We)Te()});j.onReady((e)=>{if(gt(e,document.documentElement),zo=e.locale||"en",Ee="",We){Xt();return}We=!0,Se(!0),setInterval(()=>{Se()},5000),setInterval(()=>{Se(!0)},60000),setInterval(()=>{if(Ft()&&G)Xt()},1000)});document.addEventListener("visibilitychange",()=>{if(We&&Ft())Se()});new ResizeObserver(()=>{let e=Math.ceil(Ht.getBoundingClientRect().height);if(e===Ko)return;Ko=e,j.setHeight(e).catch(()=>{})}).observe(Ht);})();
