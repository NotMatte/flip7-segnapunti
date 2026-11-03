const KEY='flip7-score-v1';
const MODS=[2,4,6,8,10];
let uid=()=>Math.random().toString(36).slice(2,9);
function blank(){return{nums:[],mods:[],x2:false,bust:false,manual:''}}
function example(){
  const p=[{id:'a',name:'Anna'},{id:'b',name:'Marco'},{id:'c',name:'Giulia'}];
  return{target:200,example:true,players:p,
    rounds:[{a:38,b:0,c:21},{a:17,b:64,c:30}],
    cur:{a:{nums:[3,8,12],mods:[4],x2:false,bust:false,manual:''},b:blank(),c:{nums:[5,9,11,2],mods:[],x2:true,bust:false,manual:''}}};
}
let S;
try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(!S||!S.players)S=example();
let confirming=false;
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function cur(id){return S.cur[id]||(S.cur[id]=blank())}

function calc(c){
  if(c.manual!==''&&c.manual!=null&&!isNaN(+c.manual))return{pts:+c.manual,txt:'scritto a mano',f7:false};
  if(c.bust)return{pts:0,txt:'sballato',f7:false};
  const s=c.nums.reduce((a,b)=>a+b,0), m=c.mods.reduce((a,b)=>a+b,0), f7=c.nums.length>=7;
  let pts=(c.x2?s*2:s)+m+(f7?15:0);
  let parts=[];
  if(c.nums.length)parts.push(c.x2?`${s}×2`:`${s}`);
  if(m)parts.push(`+${m}`);
  if(f7)parts.push('+15');
  return{pts,txt:parts.join(' ')||'nessuna carta',f7};
}
function totals(){
  const t={};S.players.forEach(p=>t[p.id]=0);
  S.rounds.forEach(r=>S.players.forEach(p=>t[p.id]+=(r[p.id]||0)));
  return t;
}
function winner(){
  const t=totals(),max=Math.max(...S.players.map(p=>t[p.id]));
  if(!S.rounds.length||max<S.target)return null;
  return S.players.filter(p=>t[p.id]===max);
}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function render(){
  document.getElementById('target').value=S.target;
  document.getElementById('roundLbl').textContent=`· mano ${S.rounds.length+1}`;
  document.getElementById('banner').innerHTML=S.example?`<div class="banner">Partita di esempio, per vedere come funziona.<button id="startReal">Inizia la tua partita</button></div>`:'';
  const t=totals(),w=winner();
  const sorted=[...S.players].sort((a,b)=>t[b.id]-t[a.id]);
  const lead=sorted.length?t[sorted[0].id]:0;
  let html=w?`<div class="winner">🏆 Vince ${w.map(p=>esc(p.name)).join(' e ')} con ${t[w[0].id]} punti</div>`:'';
  html+=sorted.map((p,i)=>{
    const v=t[p.id],miss=Math.max(0,S.target-v),gap=lead-v,live=calc(cur(p.id)).pts;
    const sub=[miss?`mancano ${miss}`:'traguardo raggiunto', i&&gap?`−${gap} dal primo`:(i===0&&sorted[1]?`+${lead-t[sorted[1].id]} sul secondo`:''), live?`con questa mano: ${v+live}`:''].filter(Boolean).join(' · ');
    return`<div class="row ${i===0&&v>0?'lead':''}"><div class="pos">${i+1}</div><div style="min-width:0"><div class="nm">${esc(p.name)}</div><div class="bar"><i style="width:${Math.min(100,v/S.target*100)}%"></i></div><div class="sub">${sub}</div></div><div class="tot">${v}<small>/ ${S.target}</small></div></div>`;
  }).join('');
  if(!S.players.length)html='<div class="sub">Aggiungi i giocatori qui sotto per iniziare.</div>';
  document.getElementById('board').innerHTML=html;

  document.getElementById('hand').innerHTML=S.players.map(p=>{
    const c=cur(p.id),r=calc(c);
    const nums=[...Array(13).keys()].map(n=>`<button class="n ${c.nums.includes(n)?'on':''}" data-p="${p.id}" data-n="${n}" aria-pressed="${c.nums.includes(n)}">${n}</button>`).join('');
    const mods=MODS.map(m=>`<button class="m ${c.mods.includes(m)?'on':''}" data-p="${p.id}" data-m="${m}">+${m}</button>`).join('')+`<button class="m x2 ${c.x2?'on':''}" data-p="${p.id}" data-x2="1">×2</button>`;
    return`<div class="pl ${c.bust?'isbust':''} ${r.f7?'isf7':''}">
      <div class="plhead"><div><div class="nm">${esc(p.name)} ${r.f7?'<span class="tag f7">Flip 7!</span>':''} ${c.bust?'<span class="tag b">Sballato</span>':''}</div><div class="sub">${c.nums.length}/7 numeri</div></div>
      <div><div class="score">${c.bust&&c.manual===''?0:r.pts}</div><div class="calc">${r.txt}</div></div></div>
      <div class="nums">${nums}</div>
      <div class="mods">${mods}</div>
      <div class="acts"><button class="bustbtn ${c.bust?'on':''}" data-p="${p.id}" data-bust="1">Sballato</button><button data-p="${p.id}" data-clear="1">Azzera</button><input type="number" id="man-${p.id}" data-p="${p.id}" data-man="1" placeholder="punti" value="${esc(c.manual)}" aria-label="Punteggio scritto a mano per ${esc(p.name)}"></div>
    </div>`;
  }).join('');
  document.getElementById('closeBtn').disabled=!S.players.length||!!w;
  document.getElementById('closeBtn').textContent=w?'Partita finita':'Chiudi la mano e segna';

  document.getElementById('hist').innerHTML=S.rounds.length?`<table><thead><tr><th>Mano</th>${S.players.map(p=>`<th>${esc(p.name)}</th>`).join('')}</tr></thead><tbody>${S.rounds.map((r,i)=>`<tr><td>${i+1}</td>${S.players.map(p=>{const v=r[p.id]||0;return`<td class="${v===0?'z':''} ${r._f7&&r._f7.includes(p.id)?'f':''}">${v}${r._f7&&r._f7.includes(p.id)?' ★':''}</td>`}).join('')}</tr>`).join('')}</tbody><tfoot><tr><td>Totale</td>${S.players.map(p=>`<td>${t[p.id]}</td>`).join('')}</tr></tfoot></table>`:'<div class="sub" style="padding:12px">Nessuna mano ancora. Segna la prima qui sopra.</div>';
  document.getElementById('undoBtn').disabled=!S.rounds.length;

  document.getElementById('players').innerHTML=S.players.map(p=>`<span class="pchip">${esc(p.name)}<button data-rm="${p.id}" aria-label="Rimuovi ${esc(p.name)}">×</button></span>`).join('');
  document.getElementById('newGameBox').innerHTML=confirming
    ?`<span>Cancellare i punti e ricominciare con gli stessi giocatori?</span><button class="primary" id="ngYes">Sì, nuova partita</button><button id="ngNo">No</button>`
    :`<button id="ngAsk">Nuova partita</button>`;
  save();
}

document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  const d=b.dataset,c=d.p?cur(d.p):null;
  if(d.n!=null){const n=+d.n;c.nums=c.nums.includes(n)?c.nums.filter(x=>x!==n):[...c.nums,n];if(c.nums.length>7)c.nums.pop();}
  else if(d.m){const m=+d.m;c.mods=c.mods.includes(m)?c.mods.filter(x=>x!==m):[...c.mods,m];}
  else if(d.x2)c.x2=!c.x2;
  else if(d.bust)c.bust=!c.bust;
  else if(d.clear)S.cur[d.p]=blank();
  else if(d.rm){S.players=S.players.filter(p=>p.id!==d.rm);delete S.cur[d.rm];}
  else if(b.id==='closeBtn'){
    const r={},f7=[];S.players.forEach(p=>{const x=calc(cur(p.id));r[p.id]=x.pts;if(x.f7&&!cur(p.id).bust)f7.push(p.id)});
    if(f7.length)r._f7=f7;S.rounds.push(r);S.players.forEach(p=>S.cur[p.id]=blank());
  }
  else if(b.id==='undoBtn')S.rounds.pop();
  else if(b.id==='addBtn')addPlayer();
  else if(b.id==='ngAsk')confirming=true;
  else if(b.id==='ngNo')confirming=false;
  else if(b.id==='ngYes'){S.rounds=[];S.cur={};confirming=false;S.example=false;}
  else if(b.id==='startReal'){S={target:200,example:false,players:[],rounds:[],cur:{}};}
  else return;
  render();
});
function addPlayer(){const i=document.getElementById('newName'),n=i.value.trim();if(!n)return;S.players.push({id:uid(),name:n});i.value='';render();i.focus();}
document.getElementById('newName').addEventListener('keydown',e=>{if(e.key==='Enter')addPlayer()});
document.getElementById('target').addEventListener('change',e=>{S.target=Math.max(1,+e.target.value||200);render()});
document.addEventListener('change',e=>{if(e.target.dataset.man){cur(e.target.dataset.p).manual=e.target.value;render()}});
render();
