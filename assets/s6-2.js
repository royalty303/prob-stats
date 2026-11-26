{
const {fr,fx,$,C,txt,fig,npdf,tpdf11,cpdf,gauss,path,area}=SITE;
const T=[["1re classe","1re"],["2e classe","2e"],["3e classe","3e"],["Équipage","Équip."]],F=[[203,122],[118,167],[178,528],[212,673]];
const S=F.reduce((a,r)=>a+r[0],0),D=F.reduce((a,r)=>a+r[1],0),N=S+D,col=[S,D],g=S/N;
const cells=[];F.forEach((r,i)=>[0,1].forEach(j=>{const n=r[0]+r[1],t=n*col[j]/N;cells.push({i,j,o:r[j],t,n,c:(t-r[j])**2/t})}));
const chi=cells.reduce((a,c)=>a+c.c,0);
fig('fa',(W,H,m)=>{
  const pl=m?62:96,pr=m?44:150,pt=40,pb=26,X=v=>pl+v/70*(W-pl-pr),rh=(H-pt-pb)/4;let s='';
  [0,20,40,60].forEach(t=>s+=`<line x1="${X(t)}" x2="${X(t)}" y1="${pt}" y2="${H-pb}" stroke="${C.line}"/>`+txt(X(t),H-6,t+' %',{c:C.mute,fs:12,a:'middle'}));
  s+=`<line x1="${X(g*100)}" x2="${X(g*100)}" y1="${pt-14}" y2="${H-pb}" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="6 5"/>`;
  F.forEach((r,i)=>{const p=r[0]/(r[0]+r[1])*100,y=pt+i*rh+rh*.22,h=rh*.56;
    s+=txt(pl-10,y+h/2+5,m?T[i][1]:T[i][0],{a:'end'})+`<rect x="${X(0)}" y="${y}" width="${X(p)-X(0)}" height="${h}" fill="${C.ink}" rx="2"/>`+txt(X(p)+8,y+h/2+5,fr(p,0)+' %',{w:700,halo:1})});
  s+=txt(X(g*100)+8,pt-16,m?'H₀ : 32,3 %':'H₀ : 32,3 % pour tous',{c:C.blue,w:700});
  if(!m){const p=F[0][0]/325*100;s+=txt(X(p)+60,pt+rh*.5+5,'presque le double',{it:1,c:C.org,fs:15})}
  return s});
let sel=0;
const fb=fig('fb',(W,H,m)=>{
  const pl=m?96:150,pr=24,pt=36,pb=28,max=700,X=v=>pl+v/max*(W-pl-pr),rh=(H-pt-pb)/8;let s='';
  [0,200,400,600].forEach(t=>s+=`<line x1="${X(t)}" x2="${X(t)}" y1="${pt}" y2="${H-pb}" stroke="${C.line}"/>`+txt(X(t),H-8,t,{c:C.mute,fs:12,a:'middle'}));
  s+=`<circle cx="${pl}" cy="14" r="6" fill="${C.ink}"/>`+txt(pl+12,19,'f<tspan baseline-shift="sub" font-size="10">o</tspan> observé')+`<circle cx="${pl+(m?96:120)}" cy="14" r="6" fill="none" stroke="${C.blue}" stroke-width="2" stroke-dasharray="3 2"/>`+txt(pl+(m?108:132),19,m?'f<tspan baseline-shift="sub" font-size="10">t</tspan> si H₀':'f<tspan baseline-shift="sub" font-size="10">t</tspan> si H₀ vraie',{c:C.blue});
  cells.forEach((c,k)=>{const y=pt+k*rh+rh/2,lab=(m?T[c.i][1]:T[c.i][0])+(c.j?' · décès':' · survie');
    if(k===sel)s+=`<rect x="0" y="${y-rh/2}" width="${W}" height="${rh}" fill="${C.soft}"/>`;
    if(c.j===0&&k)s+=`<line x1="0" x2="${W}" y1="${y-rh/2}" y2="${y-rh/2}" stroke="${C.line}"/>`;
    s+=txt(pl-12,y+5,lab,{a:'end',fs:m?12:13,w:k===sel?700:400});
    s+=`<line x1="${X(c.t)}" x2="${X(c.o)}" y1="${y}" y2="${y}" stroke="${C.org}" stroke-width="${Math.min(8,1+c.c/12)}" stroke-linecap="round" opacity=".85"/>`;
    s+=`<circle cx="${X(c.t)}" cy="${y}" r="7" fill="var(--bg)" stroke="${C.blue}" stroke-width="2.2" stroke-dasharray="3 2"/><circle cx="${X(c.o)}" cy="${y}" r="6" fill="${C.ink}"/>`;
    s+=`<rect x="0" y="${y-rh/2}" width="${W}" height="${rh}" fill="transparent" data-k="${k}" style="cursor:pointer"/>`});
  return s});
function capB(){const c=cells[sel];$('fbcap').innerHTML=`<span class="fn">Figure 6.2-b</span>Le trait orange est l'écart entre f<sub>o</sub> et f<sub>t</sub>. Choisissez une ligne. <b>${T[c.i][0]}, ${c.j?'décès':'survie'}</b> : f<sub>t</sub> = ${c.n} × ${fr(col[c.j])} ÷ ${fr(N)} = ${fr(c.t)}, alors qu'on observe f<sub>o</sub> = ${c.o}.`}
$('fb').addEventListener('click',e=>{const k=e.target.dataset.k;if(k!==undefined){sel=+k;fb();capB()}});capB();
{let h='<div class="h l"></div><div class="h">Survie</div><div class="h">Décès</div><div class="h">Total</div>';
F.forEach((r,i)=>{h+=`<div class="l">${T[i][0]}</div>`+(i<3?`<div class="free">?</div><div class="ded">déduit</div>`:`<div class="ded">déduit</div><div class="ded">déduit</div>`)+`<div class="tot">${r[0]+r[1]}</div>`});
h+=`<div class="l"><b>Total</b></div><div class="tot">${S}</div><div class="tot">${fr(D)}</div><div class="tot">${fr(N)}</div>`;$('fd').innerHTML=h}
fig('fc',(W,H,m)=>{
  const pl=m?96:150,pr=m?44:60,pt=10,pb=40,max=95,X=v=>pl+v/max*(W-pl-pr),rh=(H-pt-pb)/8;let s='';
  cells.forEach((c,k)=>{const y=pt+k*rh+rh*.2,h=rh*.6;
    s+=txt(pl-12,y+h/2+5,(m?T[c.i][1]:T[c.i][0])+(c.j?' · décès':' · survie'),{a:'end',fs:m?12:13});
    s+=`<rect x="${pl}" y="${y}" width="${Math.max(2,X(c.c)-pl)}" height="${h}" fill="${C.org}" rx="2"/>`+txt(X(c.c)+6,y+h/2+5,fr(c.c,1),{w:700})});
  s+=`<line x1="${pl}" x2="${W-pr}" y1="${H-pb+8}" y2="${H-pb+8}" stroke="${C.ink}"/>`+txt(pl,H-8,`Total : χ² = ${fr(chi,1)}`,{w:700,fs:15});
  if(!m)s+=txt(X(cells[0].c)-8,pt+rh*1.45,'91,5 sur 190,4',{it:1,c:C.org,a:'end',fs:15});
  return s});
fig('fe',(W,H,m)=>{
  const pl=20,pr=m?20:40,pt=30,pb=30,xm=16,ym=.26,X=v=>pl+v/xm*(W-pl-pr),Y=v=>pt+(1-Math.min(v,ym)/ym)*(H-pt-pb),cr=7.815,f=x=>cpdf(x,3);let s='';
  s+=`<path d="${area(f,X,Y,cr,xm)}" fill="${C.org}" opacity=".35"/>`;
  s+=`<path d="${path(f,X,Y,.04,xm,240)}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`;
  s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(0)}" y2="${Y(0)}" stroke="${C.ink}"/>`;
  [0,4,8,12,16].forEach(t=>s+=txt(X(t),H-8,t,{c:C.mute,fs:12,a:'middle'}));
  s+=`<line x1="${X(cr)}" x2="${X(cr)}" y1="${pt+20}" y2="${Y(0)}" stroke="${C.org}" stroke-width="2" stroke-dasharray="5 4"/>`+txt(X(cr),pt+12,'7,81',{c:C.org,w:700,a:'middle'});
  s+=txt(X(10.5),Y(.03)-8,'5 %',{c:C.org,w:700,a:'middle'});
  s+=txt(X(2.2),Y(.24)-4,m?'loi du χ², 3 ddl':'loi du χ² à 3 ddl (si H₀ est vraie)',{c:C.blue});
  const ay=Y(.12);s+=`<defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="${C.ink}"/></marker></defs><line x1="${X(12)}" x2="${W-pr+(m?8:24)}" y1="${ay}" y2="${ay}" stroke="${C.ink}" stroke-width="2" marker-end="url(#ar)"/>`;
  s+=txt(W-pr,ay-10,m?'χ² = 190,4 →':'notre χ² = 190,4, très loin →',{a:'end',w:700,it:1,fs:15});
  return s});
const O=[109,65,22,3,1],lam=.61,Pp=[0,1,2,3].map(k=>{let f=1;for(let i=2;i<=k;i++)f*=i;return Math.exp(-lam)*lam**k/f});Pp.push(1-Pp.reduce((a,b)=>a+b,0));
const Ft=Pp.map(p=>200*p);
const ST=[{c:[[0],[1],[2],[3],[4]],b:'Regrouper 3 et 4 ou plus',t:'Deux classes ont f<sub>t</sub> &lt; 5 : on ne peut pas encore lire la table.'},
 {c:[[0],[1],[2],[3,4]],b:'Regrouper 2 et plus',t:'Regroupées : 4,11 + 0,71 = 4,82. <b>Encore sous 5</b> : on revérifie toujours après un regroupement.'},
 {c:[[0],[1],[2,3,4]],b:'Revenir au départ',t:''}];
const lab=c=>c.length>1||c[0]===4?`${c[0]} ou +`:String(c[0]);
let ps=0;
const ff=fig('ff',(W,H,m)=>{
  const st=ST[ps],R=st.c.map(c=>({l:lab(c),o:c.reduce((a,k)=>a+O[k],0),t:c.reduce((a,k)=>a+Ft[k],0)}));
  const pl=36,pr=10,pt=36,pb=48,ym=120,Y=v=>pt+(1-v/ym)*(H-pt-pb),gw=(W-pl-pr)/5,bw=Math.min(46,gw*.32);let s='';
  [0,50,100].forEach(t=>s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(t)}" y2="${Y(t)}" stroke="${C.line}"/>`+txt(pl-6,Y(t)+4,t,{c:C.mute,fs:12,a:'end'}));
  R.forEach((r,i)=>{const cx=pl+gw*i+gw/2,warn=r.t<5;
    s+=`<rect x="${cx-bw-2}" y="${Y(r.o)}" width="${bw}" height="${Y(0)-Y(r.o)}" fill="${C.ink}" rx="2"/>`;
    s+=`<rect x="${cx+2}" y="${Y(r.t)}" width="${bw}" height="${Math.max(1,Y(0)-Y(r.t))}" fill="${warn?'var(--orgsoft)':'var(--bluesoft)'}" stroke="${warn?C.org:C.blue}" stroke-width="2" stroke-dasharray="4 3" rx="2"/>`;
    s+=txt(cx-bw/2-2,Y(r.o)-(m?20:6),r.o,{a:'middle',fs:12,w:600});
    s+=txt(cx+bw/2+2,Y(r.t)-6,fr(r.t,warn?2:1),{a:'middle',fs:12,w:700,c:warn?C.org:C.blue});
    s+=txt(cx,H-pb+20,r.l,{a:'middle',fs:14,w:600});
    if(warn&&!m)s+=txt(cx,Y(r.t)-24,'< 5',{a:'middle',it:1,c:C.org,fs:15})});
  s+=txt(W/2,H-6,'décès par corps-année',{a:'middle',c:C.mute});
  return s});
function capF(){const st=ST[ps];$('pbtn').textContent=st.b;let t=st.t;
  if(ps===2){const R=st.c.map(c=>({o:c.reduce((a,k)=>a+O[k],0),t:c.reduce((a,k)=>a+Ft[k],0)}));const x=R.reduce((a,r)=>a+(r.t-r.o)**2/r.t,0);
    t=`Toutes les f<sub>t</sub> ≥ 5. ddl = 3 modalités (après regroupement) − 1 paramètre estimé (λ) − 1 = 1. χ² = ${fr(x,3)} &lt; 3,84 (α = 5 %) : <b>on ne rejette pas H₀</b> : au seuil de 5 %, les écarts observés ne suffisent pas à écarter le modèle de Poisson.`}
  $('ffcap').innerHTML=`<span class="fn">Figure 6.2-f</span>${t}`}
$('pbtn').addEventListener('click',()=>{ps=(ps+1)%3;ff();capF()});capF();
}

/* Ajustement à une normale : les queues */
{
const {fr,fx,$,C,txt,fig,npdf,path,area}=SITE;
const T0=z=>{let t=z,s=z;for(let n=1;n<200;n++){t*=-z*z/(2*n);const u=t/(2*n+1);s+=u;if(Math.abs(u)<1e-17)break}return s/Math.sqrt(2*Math.PI)};
const TAB=z=>Math.sign(z)*Math.round(T0(Math.abs(Math.round(z*100)/100))*1e4)/1e4;
const MU=164,SG=6.5,N=200,B=[152,158,164,170,176],FO=[33,66,63,38];let op=0;
const P=(a,b)=>(b===Infinity?.5:TAB((b-MU)/SG))-(a===-Infinity?-.5:TAB((a-MU)/SG));
const cls=()=>B.slice(0,4).map((a,i)=>{const lo=op&&i===0?-Infinity:a,hi=op&&i===3?Infinity:B[i+1];return {lo,hi,p:P(lo,hi)}});
const fn=fig('fn',(W,H,m)=>{const pl=12,pr=12,pt=40,pb=96,x0=142,x1=186,X=v=>pl+(v-x0)/(x1-x0)*(W-pl-pr),g=x=>npdf((x-MU)/SG)/SG,ym=g(MU)*1.15,Y=v=>pt+(1-v/ym)*(H-pt-pb);let s='';
  const K=cls(),cols=['var(--bluesoft)','#c9d8f5'];
  K.forEach((k,i)=>s+=`<path d="${area(g,X,Y,Math.max(k.lo,x0),Math.min(k.hi,x1))}" fill="${cols[i%2]}" stroke="var(--bg)" stroke-width="1.5"/>`);
  if(!op)[[x0,152],[176,x1]].forEach(([a,b])=>s+=`<path d="${area(g,X,Y,a,b)}" fill="${C.org}" opacity=".85"/>`);
  s+=`<path d="${path(g,X,Y,x0,x1,300)}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/><line x1="${pl}" x2="${W-pr}" y1="${Y(0)}" y2="${Y(0)}" stroke="${C.ink}"/>`;
  B.forEach((b,i)=>{const lab=op&&i===0?'−∞':op&&i===4?'+∞':b;s+=`<line x1="${X(b)}" x2="${X(b)}" y1="${Y(0)}" y2="${Y(0)+5}" stroke="${C.ink}"/>`+txt(X(b),Y(0)+18,(op&&(i===0||i===4))?b:lab,{a:'middle',fs:11,c:(op&&(i===0||i===4))?C.line:C.mute})});
  if(op){s+=txt(pl,Y(0)+18,'−∞ ←',{fs:12,w:700,c:C.blue})+txt(W-pr,Y(0)+18,'→ +∞',{a:'end',fs:12,w:700,c:C.blue})}
  else{const ql=P(-Infinity,152);s+=txt(X(148),Y(g(150))-14,`oubliée : ${fx(ql*100,2)} %`,{a:'middle',fs:12,w:700,c:C.org,halo:1})+txt(X(180),Y(g(178))-14,`oubliée : ${fx(ql*100,2)} %`,{a:'middle',fs:12,w:700,c:C.org,halo:1})}
  const yr=Y(0)+42;s+=txt(pl,yr,'f',{fs:13,w:700,it:1})+txt(pl+7,yr+4,'t',{fs:10,it:1})+txt(pl,yr+22,'f',{fs:13,w:700,it:1,c:C.mute})+txt(pl+7,yr+26,'o',{fs:10,it:1,c:C.mute});
  K.forEach((k,i)=>{const cx=X((B[i]+B[i+1])/2),ed=op&&(i===0||i===3);s+=txt(cx,yr,fx(N*k.p,2),{a:'middle',fs:13,w:700,c:ed?C.blue:C.ink})+txt(cx,yr+22,FO[i],{a:'middle',fs:13,c:C.mute})});
  const tot=K.reduce((a,k)=>a+k.p,0);
  s+=txt(pl,22,`aire couverte : ${fx(tot*100,2)} %`,{fs:15,w:700,c:op?C.blue:C.org});
  s+=txt(m?pl:W-pr,m?44:22,`Σ fₜ = ${fx(N*tot,2)} ${op?'=':'≠'} 200 = Σ fₒ`,{a:m?'start':'end',fs:15,w:700,c:op?C.blue:C.org});
  return s});
function upn(){const K=cls(),tot=K.reduce((a,k)=>a+k.p,0);document.querySelectorAll('#nq button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.o===op));
  $('fncap').innerHTML=`<span class="fn">Figure 6.2-g</span>${op?`Les deux classes extrêmes s'étirent jusqu'à −∞ et +∞ : elles récupèrent les queues. Les probabilités font 100 %, et les f<sub>t</sub> totalisent 200, comme les f<sub>o</sub>. On peut comparer.`:`Avec les bornes des données, les quatre classes ne couvrent que ${fx(tot*100,2)} % de la loi normale. Les deux queues orange sont oubliées : les f<sub>t</sub> totalisent ${fx(N*tot,2)} au lieu de 200, et le test comparerait des totaux différents.`} Calculs faits avec la table, z arrondi à deux décimales. Données fictives.`;fn()}
$('nq').onclick=e=>{const o=e.target.dataset.o;if(o==null)return;op=+o;upn()};upn();
}
