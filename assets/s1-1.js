{
const {fr,fx,$,C,txt,fig}=SITE;

/* ---------- géométrie des diagrammes de Venn ---------- */
const G2={c:[[155,150,92],[245,150,92]],n:['A','B'],lab:[[95,72],[305,72]],pos:{1:[108,150],2:[292,150],3:[200,150],0:[38,36]}};
const G3={c:[[160,122,82],[240,122,82],[200,192,82]],n:['A','B','C'],lab:[[92,58],[308,58],[200,292]],pos:{1:[118,98],2:[282,98],4:[200,246],3:[200,92],5:[150,182],6:[250,182],7:[200,147],0:[38,36]}};
let uid=0;
/* dessine un diagramme : shade = {région: remplissage}, extra = chaîne SVG ajoutée par-dessus */
function venn(g,shade,o={}){const p='v'+(uid++),k=g.c.length,names=o.names||g.n;let d='<defs>';
  g.c.forEach(([x,y,r],i)=>d+=`<clipPath id="${p}c${i}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath>`);
  for(let m=0;m<(1<<k);m++){d+=`<mask id="${p}m${m}"><rect x="0" y="0" width="400" height="300" fill="#fff"/>`;g.c.forEach(([x,y,r],i)=>{if(!(m>>i&1))d+=`<circle cx="${x}" cy="${y}" r="${r}" fill="#000"/>`});d+='</mask>'}
  d+=(o.defs||'')+'</defs>';
  let s=`<rect x="8" y="8" width="384" height="284" rx="6" fill="var(--bg)" stroke="var(--ink)" stroke-width="1.5"/>`;
  for(const [m,fill] of Object.entries(shade)){const mm=+m;let open='',close='';g.c.forEach((_,i)=>{if(mm>>i&1){open+=`<g clip-path="url(#${p}c${i})">`;close+='</g>'}});
    s+=`${open}<rect x="9" y="9" width="382" height="282" rx="6" fill="${fill}" mask="url(#${p}m${mm})"/>${close}`}
  g.c.forEach(([x,y,r])=>s+=`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="var(--ink)" stroke-width="2"/>`);
  g.c.forEach((_,i)=>{const [x,y]=g.lab[i];s+=txt(x,y,names[i],{a:'middle',fs:o.lfs||22,w:700,halo:1})});
  s+=txt(380,30,'S',{a:'end',fs:18,w:700,c:C.mute});
  return d+s+(o.extra||'')}
/* région sous un point du diagramme */
function regionAt(g,svg,ev){const pt=svg.createSVGPoint();pt.x=ev.clientX;pt.y=ev.clientY;const q=pt.matrixTransform(svg.getScreenCTM().inverse());
  if(q.x<8||q.x>392||q.y<8||q.y>292)return -1;let m=0;g.c.forEach(([x,y,r],i)=>{if((q.x-x)**2+(q.y-y)**2<=r*r)m|=1<<i});return m}

/* ---------- analyseur d'expressions ---------- */
function evalExpr(str,k){const tk=[...str.replace(/\s/g,'')],U=(1<<(1<<k))-1;let i=0;
  const letter=c=>{const j='ABC'.indexOf(c);let s=0;for(let m=0;m<(1<<k);m++)if(m>>j&1)s|=1<<m;return s};
  const prim=()=>{const c=tk[i];if(c&&'ABC'.slice(0,k).includes(c)){i++;return letter(c)}if(c==='('){i++;const v=expr();if(tk[i]!==')')throw 0;i++;return v}throw 0};
  const un=()=>{let v=prim();while(tk[i]==='′'){i++;v=U&~v}return v};
  const inter=()=>{let v=un();while(tk[i]==='∩'){i++;v&=un()}return v};
  const expr=()=>{let v=inter();while(tk[i]==='∪'||tk[i]==='\\'){const op=tk[i++],w=inter();v=op==='∪'?v|w:v&~w}return v};
  const v=expr();if(i<tk.length)throw 0;return v}
const toShade=(bits,k,fill)=>{const o={};for(let m=0;m<(1<<k);m++)if(bits>>m&1)o[m]=fill;return o};

/* ---------- Figure a : construire / défi ---------- */
let K=2,mode='c',ex='',sel=new Set(),dq='',checked=false;
const DEF={2:['A ∩ B′','A \\ B','B \\ A','(A ∪ B)′','A′ ∪ B','(A ∩ B)′','A′ ∩ B′'],3:['A ∩ B ∩ C','A \\ (B ∪ C)','(A ∪ B) ∩ C′','(A ∩ B) ∪ C','A′ ∩ B′ ∩ C′','(A ∩ C) \\ B','(A ∪ B ∪ C)′','C \\ A']};
const keys=()=>['A','B',...(K===3?['C']:[]),'∪','∩','\\','′','(',')','⌫','Effacer'];
function drawA(){const g=K===2?G2:G3,sv=$('v11');
  if(mode==='c'){$('kp11').innerHTML=keys().map(k=>`<button data-k="${k}">${k}</button>`).join('');
    let shade={},msg;if(!ex){msg='Composez une expression avec les boutons.'}else{try{const b=evalExpr(ex,K);shade=toShade(b,K,'color-mix(in srgb,var(--blue) 70%,transparent)');msg=b?`Les régions en bleu forment <b>${ex.replace(/\\/g,'\\')}</b>.`:`<b>${ex}</b> est vide : ∅.`}catch(e){msg='Expression incomplète…'}}
    $('expr11').textContent=ex||'—';sv.innerHTML=venn(g,shade);sv.style.cursor='default';
    $('c11a').innerHTML=`<span class="fn">Figure 1.1-a</span>${msg} Essayez A \\ B puis B \\ A : la différence n'est pas symétrique.`}
  else{const sh={};let extra='';
    if(checked){const b=evalExpr(dq,K);for(let m=0;m<(1<<K);m++){const want=b>>m&1,has=sel.has(m);if(want&&has)sh[m]='var(--blue)';else if(has)sh[m]='var(--org)';else if(want)sh[m]='url(#miss)'}}
    else sel.forEach(m=>sh[m]='var(--ink)');
    sv.innerHTML=venn(g,sh,{defs:'<pattern id="miss" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="var(--bluesoft)"/><line x1="0" y1="0" x2="0" y2="10" stroke="var(--blue)" stroke-width="3"/></pattern>',extra});sv.style.cursor='pointer';
    $('dq11').innerHTML=`Coloriez : <b>${dq}</b>`;
    let msg='Cliquez sur les régions pour les colorier, puis vérifiez.';
    if(checked){const b=evalExpr(dq,K);let ok=true;for(let m=0;m<(1<<K);m++)if(!!(b>>m&1)!==sel.has(m))ok=false;
      msg=ok?'<b>Exact.</b> Toutes les régions sont les bonnes.':'<b>Pas tout à fait.</b> En bleu, les bonnes régions coloriées; en orange, celles en trop; hachurées, celles qui manquent.'}
    $('c11a').innerHTML=`<span class="fn">Figure 1.1-a</span>${msg}`}}
function newDefi(){const L=DEF[K];let q;do{q=L[Math.floor(Math.random()*L.length)]}while(q===dq&&L.length>1);dq=q;sel=new Set();checked=false;drawA()}
$('kp11').onclick=e=>{const k=e.target.dataset.k;if(!k)return;if(k==='⌫')ex=ex.trimEnd().replace(/\S$/,'').trimEnd();else if(k==='Effacer')ex='';else ex+=(['∪','∩','\\'].includes(k)?` ${k} `:k);ex=ex.replace(/\s+/g,' ');drawA()};
$('nb11').onclick=e=>{const n=e.target.dataset.n;if(!n)return;K=+n;ex='';document.querySelectorAll('#nb11 button').forEach(b=>b.setAttribute('aria-pressed',b===e.target));if(mode==='d')newDefi();else drawA()};
$('mode11').onclick=e=>{const m=e.target.dataset.m;if(!m)return;mode=m;document.querySelectorAll('#mode11 button').forEach(b=>b.setAttribute('aria-pressed',b===e.target));$('build11').hidden=m!=='c';$('defi11').hidden=m!=='d';if(m==='d')newDefi();else drawA()};
$('v11').addEventListener('click',ev=>{if(mode!=='d')return;const r=regionAt(K===2?G2:G3,$('v11'),ev);if(r<0)return;checked=false;sel.has(r)?sel.delete(r):sel.add(r);drawA()});
$('dchk11').onclick=()=>{checked=true;drawA()};$('dnew11').onclick=newDefi;
drawA();

/* ---------- Figure b : De Morgan ---------- */
let law=1,st=0;
const HATCH='<pattern id="hA" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="12" stroke="var(--blue)" stroke-width="3"/></pattern><pattern id="hB" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><line x1="0" y1="0" x2="0" y2="12" stroke="var(--ink)" stroke-width="2.5"/></pattern>';
function drawB(){const L1=law===1,ins=L1?'A ∪ B':'A ∩ B',res=L1?'A′ ∩ B′':'A′ ∪ B′';
  const inner=L1?[1,2,3]:[3],outer=[0,1,2,3].filter(m=>!inner.includes(m));
  let sl={},hl=`1. ${ins}`;if(st>=1){inner.forEach(m=>sl[m]='var(--bluesoft)')}
  if(st>=2){sl={};outer.forEach(m=>sl[m]='color-mix(in srgb,var(--blue) 70%,transparent)');hl=`2. (${ins})′`}
  if(st===0)hl=`(${ins})′`;
  const Ap=[0,2],Bp=[0,1];
  $('dmL').innerHTML=venn(G2,sl,{defs:HATCH});
  let sh={};if(st>=3){(L1?[0]:[0,1,2]).forEach(m=>sh[m]='color-mix(in srgb,var(--blue) 70%,transparent)')}
  $('dmR').innerHTML=venn(G2,sh,{defs:HATCH,extra:''});
  // hachures en superposition (après coloriage)
  const svgR=$('dmR');let over='';
  if(st>=1&&st<3){over+=overlay(Ap,'hA')}if(st>=2&&st<3){over+=overlay(Bp,'hB')}
  svgR.insertAdjacentHTML('beforeend',over);
  $('dml11').textContent=st===0?`Chemin 1 : (${ins})′`:st===1?`Chemin 1 : d'abord ${ins}`:`Chemin 1 : puis le complément (${ins})′`;
  $('dmr11h').textContent=st===0?`Chemin 2 : ${res}`:st===1?'Chemin 2 : A′ hachuré ╱':st===2?`Chemin 2 : B′ hachuré ╲ ${L1?'· les deux à la fois?':'· l\'un ou l\'autre?'}`:`Chemin 2 : ${res}`;
  const cap=[`Appuyez sur « Étape suivante » pour construire les deux côtés de la loi.`,`À gauche, ${ins}. À droite, A′ : tout ce qui n'est pas dans A.`,`À gauche, le complément de ${ins}. À droite, B′ s'ajoute : ${L1?'l\'intersection A′ ∩ B′ est la zone hachurée deux fois.':'l\'union A′ ∪ B′ est toute zone hachurée au moins une fois.'}`,`<b>Même région des deux côtés : (${ins})′ = ${res}.</b> ${L1?'Ni dans A ni dans B, c\'est être hors de A et hors de B.':'Pas dans les deux à la fois, c\'est être hors de A ou hors de B.'}`];
  $('c11b').innerHTML=`<span class="fn">Figure 1.1-b</span>${cap[Math.min(st,3)]}`;
  $('dmn11').disabled=st>=3}
function overlay(regs,pat){/* calque transparent de hachures sur les régions */const p='o'+(uid++);let d='<defs>';G2.c.forEach(([x,y,r],i)=>d+=`<clipPath id="${p}c${i}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath>`);
  regs.forEach(m=>{d+=`<mask id="${p}m${m}"><rect width="400" height="300" fill="#fff"/>`;G2.c.forEach(([x,y,r],i)=>{if(!(m>>i&1))d+=`<circle cx="${x}" cy="${y}" r="${r}" fill="#000"/>`});d+='</mask>'});d+='</defs>';
  let s='';regs.forEach(m=>{let o='',c='';G2.c.forEach((_,i)=>{if(m>>i&1){o+=`<g clip-path="url(#${p}c${i})">`;c+='</g>'}});s+=`${o}<rect x="9" y="9" width="382" height="282" rx="6" fill="url(#${pat})" mask="url(#${p}m${m})"/>${c}`});
  return d+s+G2.c.map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="var(--ink)" stroke-width="2"/>`).join('')}
$('law11').onclick=e=>{const l=e.target.dataset.l;if(!l)return;law=+l;st=0;document.querySelectorAll('#law11 button').forEach(b=>b.setAttribute('aria-pressed',b===e.target));drawB()};
$('dmn11').onclick=()=>{st++;drawB()};$('dmr11').onclick=()=>{st=0;drawB()};drawB();

/* ---------- Figure c : compté deux fois ---------- */
const kind=i=>i<18?'A':i<30?'AB':i<63?'B':'N';let cs=0;
function drawC(){let s='';for(let i=0;i<100;i++){const x=15+(i%10)*30,y=15+Math.floor(i/10)*30,k=kind(i);
    let fill='var(--bg)',stroke='var(--mute)',lab='';
    if(cs>=1&&(k==='A'||k==='AB')){fill='var(--ink)';stroke='var(--ink)'}
    if(cs>=2&&k==='B'){fill='var(--ink)';stroke='var(--ink)'}
    if(cs>=2&&k==='AB'){fill='var(--org)';stroke='var(--org)';lab='2'}
    if(cs>=3&&k==='AB'){fill='var(--ink)';stroke='var(--ink)';lab=''}
    if(cs>=4&&k==='N'){fill='var(--blue)';stroke='var(--blue)'}
    s+=`<circle cx="${x}" cy="${y}" r="11" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;if(lab)s+=`<text x="${x}" y="${y+4.5}" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">${lab}</text>`}
  $('dots11').innerHTML=s;
  const T=[['On part de 100 étudiants.','',''],['On marque ceux qui ont un emploi.','30','marques'],['On marque ceux qui font du sport.','30 + 45 = 75','marques'],['Mais combien de personnes marquées?','75 − 12 = 63','personnes : n(A ∪ B)'],['Ni emploi ni sport :','100 − 63 = 37','P = 0,37 = 1 − P(A ∪ B)']];
  const t=T[cs];$('cnt11').innerHTML=`<p class="cstep">${t[0]}</p>${t[1]?`<p class="cbig${cs===2?' o':cs===4?' b':''}">${t[1]}</p><p class="cstep">${t[2]}</p>`:''}${cs===2?'<p class="cstep" style="color:var(--org)">Les 12 en orange ont reçu deux marques.</p>':''}`;
  $('cn11').disabled=cs>=4}
$('cn11').onclick=()=>{cs++;drawC()};$('cr11').onclick=()=>{cs=0;drawC()};drawC();

/* ---------- Figure d : règle d'or ---------- */
const STEPS=[[7,20,'Le centre d\'abord : les trois sports, 20.'],[3,15,'Basketball et volleyball seulement : 35 − 20 = 15.'],[5,10,'Basketball et badminton seulement : 30 − 20 = 10.'],[6,20,'Volleyball et badminton seulement : 40 − 20 = 20.'],[1,45,'Basketball seulement : 90 − 15 − 10 − 20 = 45.'],[2,55,'Volleyball seulement : 110 − 15 − 20 − 20 = 55.'],[0,50,'Aucun sport, à l\'extérieur : 50.'],[4,35,'Badminton seulement : 250 − 50 − 45 − 55 − 15 − 10 − 20 − 20 = 35.']];
const WRONG={1:90,2:110,3:35,5:30,6:40,7:20,0:50};
let ss=0,wrong=false,pick=-1;
function drawD(){const g={...G3};let sh={},extra='',vals={};
  if(wrong){Object.assign(vals,WRONG);vals[4]=250-Object.values(WRONG).reduce((a,b)=>a+b,0)}
  else for(let i=0;i<ss;i++)vals[STEPS[i][0]]=STEPS[i][1];
  if(!wrong&&ss>0&&ss<=STEPS.length)sh[STEPS[ss-1][0]]='var(--bluesoft)';
  if(wrong)sh[4]='var(--orgsoft)';
  if(!wrong&&ss===STEPS.length&&pick>=0)sh={[pick]:'var(--blue)'};
  for(const [m,v] of Object.entries(vals)){const [x,y]=G3.pos[m];const bad=wrong&&+m===4;extra+=txt(x,y+7,String(v).replace('-','−'),{a:'middle',fs:20,w:700,c:bad?C.org:(!wrong&&ss===STEPS.length&&+m===pick?'#fff':C.ink),halo:!(ss===STEPS.length&&+m===pick)})}
  $('sp11').innerHTML=venn(G3,sh,{names:['B','V','M'],extra});$('sp11').style.cursor=(!wrong&&ss===STEPS.length)?'pointer':'default';
  if(wrong){$('scalc11').innerHTML=`<span style="color:var(--org)"><b>Dans le désordre :</b> on écrit 90 dans « basketball seulement », 110 dans « volleyball seulement », 35, 30 et 40 dans les zones doubles… Le total dépasse déjà 250, et il resterait ${String(vals[4]).replace('-','−')} personnes pour le badminton seulement!</span>`;
    $('c11d').innerHTML='<span class="fn">Figure 1.1-d</span>Les 90 joueurs de basketball comprennent ceux qui jouent aussi à autre chose : écrire 90 dans « basketball seulement », c\'est compter ces personnes deux fois.';return}
  $('scalc11').innerHTML=ss?STEPS[ss-1][2]:'Données de départ : n(S) = 250.';
  $('c11d').innerHTML=`<span class="fn">Figure 1.1-d</span>${ss<STEPS.length?'Chaque région se calcule à partir de celles qui sont déjà remplies, en partant du centre.':pick<0?'<b>35 pratiquent uniquement le badminton.</b> Cliquez sur une région pour lire sa probabilité.':`P(cette région) = ${vals[pick]} / 250 = <b>${fx(vals[pick]/250,3)}</b>`}`;
  $('sn11').disabled=ss>=STEPS.length}
$('sn11').onclick=()=>{wrong=false;ss=Math.min(ss+1,STEPS.length);drawD()};$('sr11').onclick=()=>{wrong=false;ss=0;pick=-1;drawD()};$('sx11').onclick=()=>{wrong=!wrong;drawD()};
$('sp11').addEventListener('click',ev=>{if(wrong||ss<STEPS.length)return;const r=regionAt(G3,$('sp11'),ev);if(r<0)return;pick=r;drawD()});
drawD();

/* ---------- Figure e : convergence ---------- */
const HIST=[['Buffon',4040,2048/4040],['Kerrich',10000,.5067],['Pearson',24000,12012/24000]];
let run=[];
function lancer(){run=[];let h=0;const N=100000;let next=1;for(let n=1;n<=N;n++){if(Math.random()<.5)h++;if(n>=next){run.push([n,h/n]);next=Math.ceil(next*1.06)}}}
const fe=fig('f11e',(W,H,m)=>{const pl=44,pr=34,pt=20,pb=40,lx=Math.log10,X=n=>pl+lx(n)/5*(W-pl-pr),Y=v=>pt+(1-(v-.3)/.4)*(H-pt-pb);let s='';
  [.3,.4,.5,.6,.7].forEach(t=>s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(t)}" y2="${Y(t)}" stroke="${C.line}"/>`+txt(pl-6,Y(t)+4,fr(t*100,0)+' %',{a:'end',fs:12,c:C.mute}));
  let up='',dn='';for(let e=.3;e<=5;e+=.05){const n=10**e,b=1.96*.5/Math.sqrt(n);up+=(up?'L':'M')+X(n)+','+Y(Math.min(.7,.5+b));dn=`L${X(n)},${Y(Math.max(.3,.5-b))}`+dn}
  s+=`<path d="${up}${dn}Z" fill="var(--bluesoft)" opacity=".8"/>`;
  s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(.5)}" y2="${Y(.5)}" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`+txt(X(1.3),Y(.5)+20,m?'classique : 50 %':'probabilité classique : 50 %',{c:C.blue,w:700,fs:13,halo:1});
  let d='';run.forEach(([n,v])=>d+=(d?'L':'M')+X(n).toFixed(1)+','+Y(Math.max(.3,Math.min(.7,v))).toFixed(1));
  s+=`<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="2"/>`;
  HIST.forEach(([nm,n,v],i)=>{s+=`<circle cx="${X(n)}" cy="${Y(v)}" r="7" fill="var(--bg)" stroke="${C.org}" stroke-width="3"/>`;const L=[[-12,-14,'end'],[0,-34,'middle'],[0,30,'middle']][i];s+=txt(X(n)+L[0],Y(v)+L[1],m?nm:`${nm} : ${fx(v*100,2)} %`,{a:L[2],fs:m?11:13,w:700,c:C.org,halo:1})});
  [[1,'1'],[10,'10'],[100,'100'],[1000,'1 000'],[10000,'10 000'],[100000,'100 000']].forEach(([n,l])=>s+=txt(X(n),H-pb+18,l,{a:n===100000?'end':'middle',fs:12,c:C.mute}));
  s+=txt(W-pr,H-4,'nombre de lancers (échelle logarithmique)',{a:'end',fs:12,c:C.mute});
  return s});
$('re11').onclick=()=>{lancer();fe()};lancer();fe();
}
