{
const {fr,fx,$,C,txt,fig,gauss}=SITE;

/* Figure a : trois sondages */
const SV=[{n:'CCCD–Léger',x:911,m:2500,sup:false,q:'magasinage des Fêtes'},{n:'Deloitte',x:1305,m:1000,sup:true,q:'cadeaux, réceptions, expériences'},{n:'PwC',x:1487,m:1000,sup:true,q:'cadeaux, voyages, divertissement'}];
const S0=900;
fig('f53a',(W,H,m)=>{const pl=16,pr=16,pt=20,pb=36,lo=700,hi=1700,X=v=>pl+(v-lo)/(hi-lo)*(W-pl-pr),rh=(H-pt-pb)/3;let s='';
  [800,1000,1200,1400,1600].forEach(t=>s+=`<line x1="${X(t)}" x2="${X(t)}" y1="${pt}" y2="${H-pb}" stroke="${C.line}"/>`+txt(X(t),H-pb+18,fr(t)+' $',{a:'middle',fs:12,c:C.mute}));
  SV.forEach((v,i)=>{const me=1.96*S0/Math.sqrt(v.m),y=pt+i*rh+rh*.62;
    s+=`<line x1="${X(v.x-me)}" x2="${X(v.x+me)}" y1="${y}" y2="${y}" stroke="${C.org}" stroke-width="10" stroke-linecap="butt"/>`;
    s+=`<circle cx="${X(v.x)}" cy="${y}" r="7" fill="${C.ink}"/>`;
    const a=X(v.x)>W*.62?'end':'start',dx=a==='end'?-12:12;
    s+=txt(X(v.x)+dx,y-24,`${v.n} · ${fr(v.x)} $`,{a,fs:15,w:700,halo:1})+txt(X(v.x)+dx,y-8,m?`n = ${fr(v.m)}${v.sup?' (supposé)':''}`:`${v.q} · n = ${fr(v.m)}${v.sup?' (supposé)':''} · ± ${fr(me,0)} $`,{a,fs:12,c:C.mute,halo:1})});
  s+=txt(W-pr,pt+4,'s supposé = 900 $ · 95 %',{a:'end',fs:12,c:C.mute});
  return s});

/* Figure b : aiguillage */
SITE.aiguillage('aig53','m',[
 {t:'Sondage Léger pour le CCCD : 2 500 Canadiens, budget moyen des Fêtes x̄ = 911 $, s = 900 $ (supposé). Intervalle à 95 % sur le budget moyen de tous les Canadiens.',r:{a:'m',b:'big',c:'non'},h:{a:'Un montant moyen, et on donne s.',b:'n = 2 500.',c:'N = tous les adultes du Canada : n/N est minuscule.'}},
 {t:'On interroge 40 des 300 étudiants de Sciences de la nature d\'un collège : x̄ = 310 $, s = 220 $. Intervalle à 95 % sur le budget moyen du programme.',r:{a:'m',b:'big',c:'oui'},h:{a:'Un budget moyen, avec s.',b:'n = 40.',c:'Sans remise, N = 300 connu, n/N = 13 % > 5 %.'}},
 {t:'Douze amis notent leur budget des Fêtes : x̄ = 260 $, s = 150 $. Intervalle à 90 % sur le budget moyen.',r:{a:'m',b:'small',c:'non'},h:{a:'Une moyenne, avec s.',b:'n = 12 < 30 : Student, 11 ddl.',c:'N n\'est pas connu.'}},
 {t:'Sur les 2 500 répondants du même sondage, 22 % prévoient dépenser plus que l\'an dernier. Intervalle à 95 %.',r:{a:'p',b:'big',c:'non'},h:{a:'Un pourcentage de répondants : c\'est une proportion.'}}
],['5.4 · Intervalles sur une proportion','5-4-intervalles-proportion.html']);

/* Figure c : rideau de 100 intervalles */
const K=(911/900)**2,TH=900*900/911,MU=911,N40=40;
function rgamma(k){if(k<1)return rgamma(k+1)*Math.random()**(1/k);const d=k-1/3,c=1/Math.sqrt(9*d);for(;;){let x,v;do{x=gauss();v=1+c*x}while(v<=0);v=v*v*v;const u=Math.random();if(u<1-.0331*x**4||Math.log(u)<.5*x*x+d*(1-v+Math.log(v)))return d*v}}
const ZL={90:1.645,95:1.96,99:2.576};let niv=95,IV=[];
$('niv53').innerHTML=[90,95,99].map(v=>`<button data-v="${v}">${v} %</button>`).join('');
function tirer(){IV=[];for(let i=0;i<100;i++){const xs=[];for(let j=0;j<N40;j++)xs.push(TH*rgamma(K));const xb=xs.reduce((a,b)=>a+b,0)/N40,sd=Math.sqrt(xs.reduce((a,b)=>a+(b-xb)**2,0)/(N40-1));IV.push({xb,sd})}}
const fc=fig('f53c',(W,H,m)=>{if(!IV.length)return'';const z=ZL[niv],pl=10,pr=10,pt=40,pb=30,lo=200,hi=1700,X=v=>pl+(Math.max(lo,Math.min(hi,v))-lo)/(hi-lo)*(W-pl-pr),rh=(H-pt-pb)/100;let s='',miss=0;
  [400,800,1200,1600].forEach(t=>s+=txt(X(t),H-8,fr(t)+' $',{a:'middle',fs:12,c:C.mute}));
  IV.forEach((v,i)=>{const me=z*v.sd/Math.sqrt(N40),a=v.xb-me,b=v.xb+me,ok=a<=MU&&MU<=b;if(!ok)miss++;const y=pt+i*rh+rh/2;
    s+=`<line x1="${X(a)}" x2="${X(b)}" y1="${y}" y2="${y}" stroke="${ok?C.ink:C.org}" stroke-width="${ok?Math.max(1.5,rh*.55):Math.max(2.5,rh*.7)}" opacity="${ok?.55:1}"/>`});
  s+=`<line x1="${X(MU)}" x2="${X(MU)}" y1="${pt-10}" y2="${H-pb}" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`+txt(X(MU)+8,pt-14,'μ = 911 $',{c:C.blue,w:700,halo:1});
  s+=txt(pl,22,`${100-miss} sur 100`,{fs:22,w:700})+txt(pl+(m?110:120),22,'contiennent μ',{fs:15,c:C.mute});
  s+=txt(W-pr,22,`${miss} ratés`,{fs:18,w:700,c:C.org,a:'end'});
  $('c53c').innerHTML=`<span class="fn">Figure 5.3-c</span>Chaque trait est l'intervalle d'un sondage (x̄ ± ${fx(z,3).replace('.',',')} s/√40). En orange, ceux qui ratent μ : ${miss} sur 100 cette fois. À ${niv} %, on en attend environ ${100-niv}. Un seul sondage ne sait jamais s'il fait partie des ratés.`;
  return s});
function upd(){document.querySelectorAll('#niv53 button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.v===niv));fc()}
$('niv53').onclick=e=>{const v=e.target.dataset.v;if(v){niv=+v;upd()}};
$('re53').onclick=()=>{tirer();upd()};tirer();upd();


/* Figure e : facteur de correction */
const N0=300,s0=220;let n0=40;
const fe=fig('f53e',(W,H,m)=>{const pl=40,pr=16,pt=24,pb=36,X=r=>pl+r*(W-pl-pr),Y=v=>pt+(1-v)*(H-pt-pb);let s='',d='';
  s+=`<rect x="${X(0)}" y="${pt}" width="${X(.05)-X(0)}" height="${H-pt-pb}" fill="var(--soft)"/>`+txt(X(.05)+6,H-pb-10,'n/N ≤ 5 % : on néglige',{fs:12,c:C.mute});
  [0,.5,1].forEach(t=>s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(t)}" y2="${Y(t)}" stroke="${C.line}"/>`+txt(pl-6,Y(t)+4,fx(t,1),{a:'end',fs:12,c:C.mute}));
  for(let i=0;i<=200;i++){const r=i/200;d+=(d?'L':'M')+X(r).toFixed(1)+','+Y(Math.sqrt(Math.max(0,(N0-r*N0)/(N0-1)))).toFixed(1)}
  s+=`<path d="${d}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`;
  [[.05,'0,975'],[.25,'0,87'],[1,'0']].forEach(([r,l])=>{const v=Math.sqrt(Math.max(0,1-r)),near=Math.abs(r-n0/N0)<.07;s+=`<circle cx="${X(r)}" cy="${Y(v)}" r="4" fill="${C.blue}"/>`+(near?'':txt(X(r)+(r===1?-8:8),Y(v)-8,l,{fs:12,c:C.blue,a:r===1?'end':'start',halo:1}))});
  const r=n0/N0,f=Math.sqrt((N0-n0)/(N0-1));
  s+=`<line x1="${X(r)}" x2="${X(r)}" y1="${Y(f)}" y2="${H-pb}" stroke="${C.ink}" stroke-dasharray="3 3"/><circle cx="${X(r)}" cy="${Y(f)}" r="8" fill="${C.ink}"/>`;
  s+=txt(X(r)+(r>.6?-14:14),Y(f)+(r>.6?-14:-14),`facteur ${fx(f,3)}`,{a:r>.6?'end':'start',w:700,fs:15,halo:1});
  [0,.25,.5,.75,1].forEach(t=>s+=txt(X(t),H-pb+18,fr(t*100,0)+' %',{a:'middle',fs:12,c:C.mute}));
  s+=txt(W-pr,H-4,'fraction interrogée n/N',{a:'end',fs:12,c:C.mute});
  return s});
function upde(){n0=+$('sl53').value;const f=Math.sqrt((N0-n0)/(N0-1)),me=1.96*s0/Math.sqrt(n0);$('o53').textContent=`n = ${n0} (${fr(n0/N0*100,0)} %)`;
  $('c53e').innerHTML=`<span class="fn">Figure 5.3-e</span>Sans correction, la marge serait de ${fr(me,1)} $; avec correction, <b>${fr(me*f,1)} $</b>. ${n0/N0<=.05?'Sous 5 %, la différence est négligeable.':n0===N0?'On a interrogé tout le monde : il ne reste aucune incertitude.':'Plus on interroge une grande part de la population, plus l\'intervalle se resserre.'}`;fe()}
$('sl53').oninput=upde;upde();

/* Figure f : taille d'échantillon */
const fF=fig('f53f',(W,H,m)=>{const me=+$('sl53f').value,pl=56,pr=16,pt=24,pb=36,X=v=>pl+(v-10)/90*(W-pl-pr),ym=12000,Y=v=>pt+(1-Math.min(v,ym)/ym)*(H-pt-pb),nn=e=>(1.96*S0/e)**2;let s='',d='';
  [0,4000,8000,12000].forEach(t=>s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(t)}" y2="${Y(t)}" stroke="${C.line}"/>`+txt(pl-6,Y(t)+4,fr(t),{a:'end',fs:12,c:C.mute}));
  for(let e=10;e<=100;e+=.5){d+=(d?'L':'M')+X(e).toFixed(1)+','+Y(nn(e)).toFixed(1)}
  s+=`<path d="${d}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`;
  if(!m){[[50,1245],[25,4979]].forEach(([e])=>s+=`<circle cx="${X(e)}" cy="${Y(nn(e))}" r="4" fill="${C.blue}"/>`);s+=txt(X(37),Y(3200),'marge ÷ 2 → n × 4',{it:1,c:C.org,fs:15,a:'middle',halo:1})}
  const n=nn(me);s+=`<line x1="${X(me)}" x2="${X(me)}" y1="${Y(n)}" y2="${H-pb}" stroke="${C.ink}" stroke-dasharray="3 3"/><circle cx="${X(me)}" cy="${Y(n)}" r="8" fill="${C.ink}"/>`;
  s+=txt(X(me)+12,Y(n)-10,`n = ${fr(Math.ceil(n))}`,{w:700,fs:16,halo:1});
  [10,25,50,75,100].forEach(t=>s+=txt(X(t),H-pb+18,'± '+t+' $',{a:'middle',fs:12,c:C.mute}));
  return s});
function updf(){const me=+$('sl53f').value,n=(1.96*S0/me)**2;$('o53f').textContent=`± ${me} $`;
  $('c53f').innerHTML=`<span class="fn">Figure 5.3-f</span>n = (1,96 × 900 / ${me})² = ${fx(n,1)}, arrondi à l'entier supérieur : <b>${fr(Math.ceil(n))} répondants</b>. Le s de 900 $ vient du sondage précédent (valeur supposée ici) : sans cette information, on ne peut pas calculer n.`;fF()}
$('sl53f').oninput=updf;updf();
}
