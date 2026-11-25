/* Outils communs à toutes les pages */
new MutationObserver(()=>{for(const c of document.querySelectorAll('.stack td:not([data-l])')){let i=0,p=c;while(p=p.previousElementSibling)i+=p.colSpan;c.dataset.l=c.closest('table').rows[0].cells[i]?.textContent||''}}).observe(document,{childList:true,subtree:true})
const SITE={};
{
/* ================= utilitaires ================= */
const fr=(x,d=2)=>x.toLocaleString('fr-CA',{maximumFractionDigits:d}).replace('-','−');
const fx=(x,d)=>x.toLocaleString('fr-CA',{minimumFractionDigits:d,maximumFractionDigits:d}).replace('-','−');
const $=id=>document.getElementById(id);
const C={ink:'var(--ink)',mute:'var(--mute)',blue:'var(--blue)',org:'var(--org)',line:'var(--line)',soft:'var(--soft)',bg:'var(--bg)'};
const txt=(x,y,s,o={})=>`<text x="${x}" y="${y}" font-size="${o.fs||13}" fill="${o.c||C.ink}" text-anchor="${o.a||'start'}"${o.w?` font-weight="${o.w}"`:''}${o.halo?' stroke="var(--bg)" stroke-width="5" paint-order="stroke"':''}${o.it?' class="ann" font-style="italic"':''}>${s}</text>`;
function fig(id,draw){const s=$(id),f=()=>{const W=s.clientWidth,H=s.clientHeight;if(W)s.innerHTML=draw(W,H,W<560)};new ResizeObserver(f).observe(s);return f}
const npdf=x=>Math.exp(-x*x/2)/Math.sqrt(2*Math.PI);
const tpdf11=x=>0.38998976*(1+x*x/11)**-6;
const G={1:1.7724539,3:0.8862269};
const cpdf=(x,k)=>x**(k/2-1)*Math.exp(-x/2)/(2**(k/2)*G[k]);
const gauss=()=>{let u=0;while(!u)u=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*Math.random())};
function path(f,X,Y,a,b,n=200,cap=Infinity){let d='';for(let i=0;i<=n;i++){const x=a+(b-a)*i/n,y=f(x);if(!isFinite(y)||y>cap)continue;d+=(d?'L':'M')+X(x).toFixed(1)+','+Y(y).toFixed(1)}return d}
function area(f,X,Y,a,b){let d=`M${X(a)},${Y(0)}`;for(let i=0;i<=60;i++){const x=a+(b-a)*i/60;d+=`L${X(x).toFixed(1)},${Y(f(x)).toFixed(1)}`}return d+`L${X(b)},${Y(0)}Z`}
Object.assign(SITE,{fr,fx,$,C,txt,fig,npdf,tpdf11,cpdf,gauss,path,area});
}

/* ================= Aiguillage des intervalles de confiance (5.3 et 5.4) ================= */
{
const {$}=SITE;
const Z='<i>z</i><sub>α/2</sub>',T='<i>t</i><sub>α/2 ; n−1</sub>';
const fr_=(a,b)=>`<span class="frx"><span>${a}</span><span>${b}</span></span>`;
const sq=a=>`<span class="sqx">√<span>${a}</span></span>`;
const COR=sq(fr_('<i>N</i> − <i>n</i>','<i>N</i> − 1'));
function formules(k,big,cor){
  const mult=big?Z:T;
  if(k==='m'){
    const ic=`<i>μ</i> ∈ <span class="obs">x̄</span> <span class="mg">± <span class="pc" data-p="b">${mult}</span> (${fr_('<i>s</i>','√<i>n</i>')})<span class="pc" data-p="c">${cor?' '+COR:''}</span></span>`;
    const n=cor?`<i>n</i> = ${fr_(`<i>N</i> (${Z})² <i>s</i>²`,`(<i>ME</i>)²(<i>N</i> − 1) + (${Z})² <i>s</i>²`)}`:`<i>n</i> = (${fr_(`${Z} <i>s</i>`,'<i>ME</i>')})²`;
    return {ic,n:big?n:'',note:''}}
  const ic=`<i>π</i> ∈ <span class="obs"><i>p</i></span> <span class="mg">± <span class="pc" data-p="b">${Z}</span> ${sq(fr_('<i>p</i>(1 − <i>p</i>)','<i>n</i>'))}<span class="pc" data-p="c">${cor?' '+COR:''}</span></span>`;
  const n=cor?`<i>n</i> = ${fr_(`(${Z})² <i>N p</i>(1 − <i>p</i>)`,`(<i>N</i> − 1)(<i>ME</i>)² + (${Z})² <i>p</i>(1 − <i>p</i>)`)}`:`<i>n</i> = ${fr_(`(${Z})² <i>p</i>(1 − <i>p</i>)`,'(<i>ME</i>)²')}`;
  return {ic,n,note:''}}
SITE.aiguillage=function(root,page,E,autre){
  const R=$(root);let st={a:page,b:'big',c:'non'},ei=0,prev=null;
  const Q=[['a','a) Moyenne ou proportion?',[['m','Moyenne'],['p','Proportion']]],['b',page==='m'?'b) Loi normale ou Student?':'b) Taille de l\'échantillon',page==='m'?[['big','n ≥ 30 : normale'],['small','n < 30 : Student']]:[['big','n ≥ 30 : normale']]],['c','c) Facteur de correction?',[['oui','Oui'],['non','Non']]]];
  R.innerHTML=`<div class="aig"><div class="enonce"><div class="en-h"><span id="${root}-num"></span><span><button id="${root}-prev">Précédent</button> <button id="${root}-next">Suivant</button></span></div><p id="${root}-txt"></p></div>
  <div class="sw3">${Q.map(([k,t,o])=>`<div><div class="qt">${t}</div><div class="seg" data-q="${k}">${o.map(([v,l])=>`<button data-v="${v}">${l}</button>`).join('')}</div><div class="fbq" id="${root}-fb-${k}"></div></div>`).join('')}</div>
  <div class="tools"><button class="go" id="${root}-chk">Vérifier mes réponses</button></div>
  <div class="formbox" id="${root}-f"></div></div>`;
  const draw=()=>{R.querySelectorAll('.seg').forEach(g=>g.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',st[g.dataset.q]===b.dataset.v)));
    const F=$(root+'-f');
    if(st.a!==page){F.innerHTML=`<p class="formula">Une ${st.a==='m'?'moyenne':'proportion'} se traite dans une autre section.</p><p><a href="${autre[1]}">→ ${autre[0]}</a></p>`;prev=null;return}
    const f=formules(page,st.b==='big',st.c==='oui');
    F.innerHTML=`<div class="fl"><span class="lab">Intervalle</span><div class="formula">${f.ic}</div></div>${f.n?`<div class="fl"><span class="lab">Taille d'échantillon</span><div class="formula">${f.n}</div></div>`:''}${f.note?`<p class="note">${f.note}</p>`:''}`;
    if(prev){F.querySelectorAll('.pc').forEach(p=>{if(prev[p.dataset.p]!==st[p.dataset.p])p.classList.add('flash')})}
    prev={...st}};
  const show=()=>{const e=E[ei];$(root+'-num').textContent=`Énoncé ${ei+1} sur ${E.length}`;$(root+'-txt').innerHTML=e.t;Q.forEach(([k])=>$(root+'-fb-'+k).innerHTML='')};
  R.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const g=b.closest('.seg');if(g){st[g.dataset.q]=b.dataset.v;draw()}});
  $(root+'-chk').onclick=()=>{const e=E[ei];Q.forEach(([k])=>{const ok=st[k]===e.r[k]||(k!=='a'&&e.r.a!==page);$(root+'-fb-'+k).innerHTML=(ok?'<b class="ok">✓</b> ':'<b class="ko">✗</b> ')+(e.h[k]||'')})};
  $(root+'-prev').onclick=()=>{ei=(ei+E.length-1)%E.length;show()};$(root+'-next').onclick=()=>{ei=(ei+1)%E.length;show()};
  show();draw()};
}

/* ================= Navigation commune ================= */
{
/* sections publiées, dans l'ordre du cours : à compléter au fil des ajouts */
const P=[['1-1-notions-probabilite.html','1.1','Notions de probabilité de base'],['1-2-analyse-combinatoire.html','1.2','Analyse combinatoire'],['1-3-probabilites-conditionnelles.html','1.3','Probabilités conditionnelles'],['2-1-tendance-centrale.html','2.1','Mesures de tendance centrale'],['2-2-dispersion.html','2.2','Mesures de dispersion'],['2-3-position.html','2.3','Mesures de position'],['3-1-variables-aleatoires.html','3.1','Introduction aux variables aléatoires'],['3-2-loi-binomiale.html','3.2','Loi binomiale'],['3-3-loi-de-poisson.html','3.3','Loi de Poisson'],['5-1-sondages.html','5.1','Introduction aux sondages'],['5-2-theoreme-central-limite.html','5.2','Théorème central limite'],['5-3-intervalles-moyenne.html','5.3','Intervalles de confiance sur une moyenne'],['5-4-intervalles-proportion.html','5.4','Intervalles de confiance sur une proportion'],['6-1-tests-hypotheses.html','6.1','Tests sur une moyenne et sur une proportion'],['6-2-khi-deux.html','6.2','Tests du khi-deux']];
const here=location.pathname.split('/').pop()||'index.html',n=document.getElementById('nav');
if(n)n.innerHTML=`<a href="index.html"${here==='index.html'?' aria-current="page"':''}>Plan du cours</a>`;
const i=P.findIndex(x=>x[0]===here),w=document.querySelector('main .wrap');
if(i>=0&&w){const pr=P[i-1],nx=P[i+1],f=w.querySelector('.foot');
  const h=`<nav class="pn" aria-label="Sections voisines">${pr?`<a class="pv" href="${pr[0]}"><span>← Section précédente</span><b>${pr[1]} · ${pr[2]}</b></a>`:'<span></span>'}${nx?`<a class="nx" href="${nx[0]}"><span>Section suivante →</span><b>${nx[1]} · ${nx[2]}</b></a>`:'<span></span>'}</nav>`;
  f?f.insertAdjacentHTML('beforebegin',h):w.insertAdjacentHTML('beforeend',h)}
}
