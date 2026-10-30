const ANG=['正面','俯视','仰视','侧面','斜侧'];
const LINES=(META.lines&&META.lines.length)?META.lines:['全身单人·性感风','全身单人·标准风','上半身单人','双人互动'];
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Number(n).toLocaleString('zh-CN');
const catOf=d=>(d.cat||'').trim();
const S={line:'',cat:'',ang:'',q:'',view:'pose'};

const POSES=[];const PMAP={};
D.forEach(d=>{
  const k=d.line+'|'+(d.num||d.id);
  if(!PMAP[k]){PMAP[k]={key:k,line:d.line,num:d.num,name:d.name,cat:catOf(d),a:{},items:[]};POSES.push(PMAP[k])}
  const p=PMAP[k];p.items.push(d);if(d.ang&&!p.a[d.ang])p.a[d.ang]=d;
});
POSES.sort((x,y)=>(LINES.indexOf(x.line)-LINES.indexOf(y.line))||String(x.num).localeCompare(String(y.num),'zh'));
POSES.forEach(p=>{p.order=ANG.map(a=>p.a[a]).filter(Boolean);p.items.forEach(d=>{if(!p.order.includes(d))p.order.push(d)})});

const SHOWN=LINES.filter(l=>D.some(d=>d.line===l));

function drawTabs(){
  const t=[['','全部',D.length,POSES.length],...SHOWN.map(l=>[l,l,D.filter(d=>d.line===l).length,POSES.filter(p=>p.line===l).length])];
  $('#tabs').innerHTML=t.map(([v,l,n,np])=>`<button class="tab" role="tab" data-v="${esc(v)}" aria-selected="${S.line===v}">${esc(l)}<em>${fmt(n)}张·${fmt(np)}姿势</em></button>`).join('');
}
$('#tabs').onclick=e=>{const b=e.target.closest('.tab');if(!b)return;S.line=b.dataset.v;S.cat='';drawTabs();drawCats();draw()};
function drawCats(){
  const c=[...new Set(D.filter(d=>!S.line||d.line===S.line).map(catOf).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'zh'));
  $('#cat').innerHTML='<option value="">分类：全部</option>'+c.map(x=>`<option${x===S.cat?' selected':''}>${esc(x)}</option>`).join('');
}
$('#ang').innerHTML=['',...ANG].map(a=>`<button data-v="${a}" aria-pressed="${a===''}">${a||'全部角度'}</button>`).join('');
$('#ang').onclick=e=>{const b=e.target.closest('button');if(!b)return;S.ang=b.dataset.v;[...$('#ang').children].forEach(x=>x.setAttribute('aria-pressed',x===b));draw()};
$('#view').onclick=e=>{const b=e.target.closest('button');if(!b)return;S.view=b.dataset.v;[...$('#view').children].forEach(x=>x.setAttribute('aria-pressed',x===b));draw()};
$('#cat').onchange=e=>{S.cat=e.target.value;draw()};
let qt;$('#q').oninput=e=>{clearTimeout(qt);qt=setTimeout(()=>{S.q=e.target.value.trim().toLowerCase();draw()},120)};

function hit(d){return (!S.line||d.line===S.line)&&(!S.cat||catOf(d)===S.cat)&&(!S.ang||d.ang===S.ang)&&
  (!S.q||(d.name+' '+d.id+' '+catOf(d)+' '+d.num+' '+(d.name_jp||'')).toLowerCase().includes(S.q))}
let VIEWLIST=[];
function draw(){
  const g=$('#grid');
  if(S.view==='pose'){
    const ps=POSES.filter(p=>p.items.some(hit));VIEWLIST=ps.map(p=>({p,d:(S.ang&&p.a[S.ang])||p.order[0]}));
    $('#count').textContent=`显示 ${fmt(ps.length)} 个姿势 · ${fmt(ps.reduce((n,p)=>n+p.items.filter(hit).length,0))} 张`;
    g.innerHTML=VIEWLIST.map(({p,d},i)=>{
      return `<article class="card" tabindex="0" data-i="${i}"><div class="ph"><img loading="lazy" decoding="async" src="${esc(d.thumb)}" alt="${esc(p.name)}">
      <div class="badge"><span>${esc(p.num||'')}</span></div></div>
      <div class="meta"><h3>${esc(p.name)}</h3><div class="id">${esc(p.line)}·${esc(p.num)}</div>${p.cat?`<div class="cat">${esc(p.cat)}</div>`:''}</div>
      <div class="strip">${ANG.filter(a=>p.a[a]).map(a=>{const x=p.a[a];return `<button data-a="${a}" class="${x===d?'on':''}" title="${a}"><img loading="lazy" decoding="async" src="${esc(x.thumb)}" alt="${a}"><span>${a}</span></button>`}).join('')}</div></article>`}).join('');
  }else{
    const ds=D.filter(hit);VIEWLIST=ds.map(d=>({p:PMAP[d.line+'|'+(d.num||d.id)],d}));
    $('#count').textContent=`显示 ${fmt(ds.length)} 张`;
    g.innerHTML=VIEWLIST.map(({d},i)=>`<article class="card" tabindex="0" data-i="${i}"><div class="ph"><img loading="lazy" decoding="async" src="${esc(d.thumb)}" alt="${esc(d.name)}">
      <div class="badge"><span>${esc(d.ang||'—')}</span></div></div>
      <div class="meta"><h3>${esc(d.name)}</h3><div class="id">${esc(d.id)}</div><div class="cat">${esc(d.line)}${catOf(d)?'·'+esc(catOf(d)):''}</div></div></article>`).join('');
  }
  if(!VIEWLIST.length)g.innerHTML=`<div class="empty" style="grid-column:1/-1"><b>${D.length?'没有符合条件的图片':'没有图片'}</b>${D.length?'请调整筛选条件。':''}</div>`;
}
$('#grid').addEventListener('mouseover',e=>{const b=e.target.closest('.strip button');if(!b)return;const c=b.closest('.card'),it=VIEWLIST[c.dataset.i];const d=it.p.a[b.dataset.a];
  c.querySelector('.ph img').src=d.thumb;c.querySelectorAll('.strip button').forEach(x=>x.classList.toggle('on',x===b))});
$('#grid').addEventListener('click',e=>{const c=e.target.closest('.card');if(!c)return;const it=VIEWLIST[c.dataset.i];const b=e.target.closest('.strip button');
  openM(+c.dataset.i,b?it.p.a[b.dataset.a]:it.d)});
$('#grid').addEventListener('keydown',e=>{if(e.key==='Enter'){const c=e.target.closest('.card');if(c)openM(+c.dataset.i,VIEWLIST[c.dataset.i].d)}});

let M={i:0,d:null};
function openM(i,d){M={i,d};$('#modal').classList.add('open');document.body.style.overflow='hidden';showM()}
function closeM(){$('#modal').classList.remove('open');document.body.style.overflow='';const c=document.querySelector(`.card[data-i="${M.i}"]`);c&&c.focus()}
function showM(){
  const p=VIEWLIST[M.i].p,d=M.d,img=$('#mimg');
  img.src=d.thumb;
  const full=new Image();full.onload=()=>{if(M.d===d)img.src=d.full};full.src=d.full;
  img.alt=d.name+' '+d.ang;
  const dl=$('#mdl');dl.href=d.full;dl.setAttribute('download',d.id+'.png');
  $('#mtitle').textContent=d.name;$('#mid').textContent=d.id;
  $('#mang').innerHTML=ANG.filter(a=>p.a[a]).map(a=>{const x=p.a[a];return `<button data-a="${a}" class="${x===d?'on':''}"><img src="${esc(x.thumb)}" alt="${a}"><span>${a}</span></button>`}).join('');
  $('#mkv').innerHTML=[['系列',d.line],['姿势编号',d.num||'—'],['分类',catOf(d)],['角度',d.ang||'—']].filter(([k,v])=>k!=='分类'||v)
    .map(([k,v])=>`<dt>${k}</dt><dd>${esc(v)}</dd>`).join('');
}
function stepA(n){const o=VIEWLIST[M.i].p.order;if(o.length<2)return;M.d=o[(o.indexOf(M.d)+n+o.length)%o.length];showM()}
function stepP(n){const j=M.i+n;if(j<0||j>=VIEWLIST.length)return;const np=VIEWLIST[j].p;M.i=j;M.d=np.a[M.d.ang]||VIEWLIST[j].d;showM()}
$('#mang').onclick=e=>{const b=e.target.closest('button');if(!b)return;M.d=VIEWLIST[M.i].p.a[b.dataset.a];showM()};
$('#mprev').onclick=()=>stepA(-1);$('#mnext').onclick=()=>stepA(1);$('#mclose').onclick=closeM;
$('#modal').onclick=e=>{if(e.target.id==='modal')closeM()};
document.addEventListener('keydown',e=>{if(!$('#modal').classList.contains('open'))return;
  if(e.key==='Escape')closeM();else if(e.key==='ArrowRight')stepA(1);else if(e.key==='ArrowLeft')stepA(-1);
  else if(e.key==='ArrowDown'){e.preventDefault();stepP(1)}else if(e.key==='ArrowUp'){e.preventDefault();stepP(-1)}});
let tx=null;$('#mimg').addEventListener('touchstart',e=>{tx=e.touches[0].clientX},{passive:true});
$('#mimg').addEventListener('touchend',e=>{if(tx===null)return;const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>40)stepA(dx<0?1:-1);tx=null});

$('#ftog').onclick=()=>{const o=$('#more').classList.toggle('open');$('#ftog').setAttribute('aria-expanded',o)};
function badge(){const n=[S.cat,S.ang].filter(Boolean).length+(S.view==='card'?1:0);$('#fn').textContent=n||''}
const _draw=draw;draw=function(){_draw();badge()};
drawTabs();drawCats();draw();

(()=>{const nav=document.getElementById('infotabs');if(!nav)return;
  const tabs=[...nav.querySelectorAll('.itab')];let cur=null;
  const close=(back)=>{if(!cur)return;const t=cur;t.setAttribute('aria-expanded','false');document.getElementById(t.getAttribute('aria-controls')).hidden=true;cur=null;if(back)t.focus()};
  const open=t=>{if(cur===t){close(true);return}close(false);cur=t;t.setAttribute('aria-expanded','true');const p=document.getElementById(t.getAttribute('aria-controls'));p.hidden=false;
    if(innerWidth<=560){const r=t.getBoundingClientRect();p.style.top=(r.bottom+8)+'px'}else p.style.top='';p.focus({preventScroll:true})};
  tabs.forEach((t,i)=>{t.addEventListener('click',()=>open(t));t.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const n=tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];n.focus();if(cur)open(n)}})});
  nav.querySelectorAll('.ipclose').forEach(b=>b.addEventListener('click',()=>close(true)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&cur){e.stopPropagation();close(true)}},true);
  let swallow=false;
  document.addEventListener('pointerdown',e=>{if(cur&&!nav.contains(e.target)){close(false);swallow=true;setTimeout(()=>swallow=false,600)}},true);
  document.addEventListener('click',e=>{if(swallow){swallow=false;e.preventDefault();e.stopPropagation()}},true);
  addEventListener('scroll',()=>{if(cur&&innerWidth<=560)close(false)},{passive:true});
  addEventListener('resize',()=>close(false));
})();
