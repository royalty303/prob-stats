{
const {fr,fx,$,C,txt,fig,gauss}=SITE;
const me=(p,n)=>1.96*Math.sqrt(p*(1-p)/n);

/* Figure a : trois proportions */
const P=[['dépenser plus',.22],['dépenser autant',.52],['dépenser moins',.22]];
fig('f54a',(W,H,m)=>{const pl=m?110:140,pr=60,pt=16,pb=34,X=v=>pl+v/.6*(W-pl-pr),rh=(H-pt-pb)/3;let s='';
  [0,.1,.2,.3,.4,.5,.6].forEach(t=>s+=`<line x1="${X(t)}" x2="${X(t)}" y1="${pt}" y2="${H-pb}" stroke="${C.line}"/>`+txt(X(t),H-pb+18,fr(t*100,0)+' %',{a:'middle',fs:12,c:C.mute}));
  P.forEach(([l,p],i)=>{const e=me(p,2500),y=pt+i*rh+rh/2;
    s+=txt(pl-12,y+5,l,{a:'end',fs:14});
    s+=`<line x1="${X(p-e)}" x2="${X(p+e)}" y1="${y}" y2="${y}" stroke="${C.org}" stroke-width="12"/><circle cx="${X(p)}" cy="${y}" r="7" fill="${C.ink}"/>`;
    s+=txt(X(p+e)+10,y+5,`${fr(p*100,0)} % ± ${fx(e*100,1)} %`,{w:700,fs:14,halo:1})});
  return s});

/* Figure b : aiguillage */
SITE.aiguillage('aig54','p',[
 {t:'Sondage Léger pour le CCCD : sur 2 500 Canadiens, 22 % prévoient dépenser plus que l\'an dernier pour les Fêtes. Intervalle à 95 % sur la proportion de tous les Canadiens.',r:{a:'p',b:'big',c:'non'},h:{a:'Un pourcentage de répondants.',b:'n = 2 500.',c:'N = tous les adultes du Canada : n/N est minuscule.'}},
 {t:'On interroge 60 des 400 étudiants de première année d\'un collège : 35 % auront un emploi pendant les Fêtes. Intervalle à 95 %.',r:{a:'p',b:'big',c:'oui'},h:{a:'Un pourcentage d\'étudiants.',b:'n = 60.',c:'Sans remise, N = 400 connu, n/N = 15 % > 5 %.'}},
 {t:'Sur 2 500 répondants, 52 % prévoient dépenser à peu près autant que l\'an dernier. Intervalle à 99 %.',r:{a:'p',b:'big',c:'non'},h:{a:'Un pourcentage de répondants.',b:'n = 2 500.',c:'N n\'est pas une petite population connue.'}},
 {t:'Les Québécois du même sondage prévoient dépenser en moyenne 664 $ (s = 700 $, supposé). Intervalle à 95 % sur le budget moyen.',r:{a:'m',b:'big',c:'non'},h:{a:'Un montant moyen avec un écart type : c\'est une moyenne.'}}
],['5.3 · Intervalles sur une moyenne','5-3-intervalles-moyenne.html']);

/* Figure c : 19 fois sur 20 */
const PI=.22,NS=2500;let IV=[];
const tirer=()=>{IV=[];for(let i=0;i<20;i++){const x=Math.round(NS*PI+Math.sqrt(NS*PI*(1-PI))*gauss());IV.push(x/NS)}};
const fc=fig('f54c',(W,H,m)=>{if(!IV.length)return'';const pl=10,pr=10,pt=44,pb=30,lo=.18,hi=.26,X=v=>pl+(v-lo)/(hi-lo)*(W-pl-pr),rh=(H-pt-pb)/20;let s='',miss=0;
  [.19,.2,.21,.22,.23,.24,.25].forEach(t=>s+=txt(X(t),H-8,fr(t*100,0)+' %',{a:'middle',fs:12,c:C.mute}));
  IV.forEach((p,i)=>{const e=me(p,NS),ok=p-e<=PI&&PI<=p+e;if(!ok)miss++;const y=pt+i*rh+rh/2;
    s+=`<line x1="${X(p-e)}" x2="${X(p+e)}" y1="${y}" y2="${y}" stroke="${ok?C.ink:C.org}" stroke-width="${ok?5:7}" opacity="${ok?.6:1}" stroke-linecap="round"/><circle cx="${X(p)}" cy="${y}" r="4" fill="${ok?C.ink:C.org}"/>`});
  s+=`<line x1="${X(PI)}" x2="${X(PI)}" y1="${pt-10}" y2="${H-pb}" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`+txt(X(PI)+8,pt-14,'π = 22 %',{c:C.blue,w:700,halo:1});
  s+=txt(pl,24,`${20-miss} sur 20`,{fs:22,w:700})+txt(pl+(m?100:110),24,'contiennent π',{fs:15,c:C.mute});
  $('c54c').innerHTML=`<span class="fn">Figure 5.4-c</span>Chaque trait est l'intervalle p ± 1,96 √(p(1 − p)/2 500) d'un sondage. ${miss?`${miss} en orange rate${miss>1?'nt':''} π cette fois.`:'Aucun ne rate π cette fois.'} « 19 fois sur 20 » veut dire qu'en moyenne, 1 sondage sur 20 se trompe sans le savoir.`;
  return s});
$('re54').onclick=()=>{tirer();fc()};tirer();fc();

/* Figure d : facteur de correction */
const N0=400,p0=.35;let n0=60;
const fd=fig('f54d',(W,H,m)=>{const pl=40,pr=16,pt=24,pb=36,X=r=>pl+r*(W-pl-pr),Y=v=>pt+(1-v)*(H-pt-pb);let s='',d='';
  s+=`<rect x="${X(0)}" y="${pt}" width="${X(.05)-X(0)}" height="${H-pt-pb}" fill="var(--soft)"/>`+txt(X(.05)+6,H-pb-10,'n/N ≤ 5 % : on néglige',{fs:12,c:C.mute});
  [0,.5,1].forEach(t=>s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(t)}" y2="${Y(t)}" stroke="${C.line}"/>`+txt(pl-6,Y(t)+4,fx(t,1),{a:'end',fs:12,c:C.mute}));
  for(let i=0;i<=200;i++){const r=i/200;d+=(d?'L':'M')+X(r).toFixed(1)+','+Y(Math.sqrt(Math.max(0,(N0-r*N0)/(N0-1)))).toFixed(1)}
  s+=`<path d="${d}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`;
  [[.05,'0,975'],[.25,'0,87'],[1,'0']].forEach(([r,l])=>{const v=Math.sqrt(Math.max(0,1-r));s+=`<circle cx="${X(r)}" cy="${Y(v)}" r="4" fill="${C.blue}"/>`+txt(X(r)+(r===1?-8:8),Y(v)-8,l,{fs:12,c:C.blue,a:r===1?'end':'start',halo:1})});
  const r=n0/N0,f=Math.sqrt((N0-n0)/(N0-1));
  s+=`<line x1="${X(r)}" x2="${X(r)}" y1="${Y(f)}" y2="${H-pb}" stroke="${C.ink}" stroke-dasharray="3 3"/><circle cx="${X(r)}" cy="${Y(f)}" r="8" fill="${C.ink}"/>`;
  s+=txt(X(r)+(r>.6?-14:14),Y(f)-14,`facteur ${fx(f,3)}`,{a:r>.6?'end':'start',w:700,fs:15,halo:1});
  [0,.25,.5,.75,1].forEach(t=>s+=txt(X(t),H-pb+18,fr(t*100,0)+' %',{a:'middle',fs:12,c:C.mute}));
  s+=txt(W-pr,H-4,'fraction interrogée n/N',{a:'end',fs:12,c:C.mute});
  return s});
function upd(){n0=+$('sl54').value;const f=Math.sqrt((N0-n0)/(N0-1)),e=me(p0,n0);$('o54').textContent=`n = ${n0} (${fr(n0/N0*100,0)} %)`;
  $('c54d').innerHTML=`<span class="fn">Figure 5.4-d</span>Sans correction, la marge serait de ± ${fx(e*100,1)} %; avec correction, <b>± ${fx(e*f*100,1)} %</b>. ${n0===N0?'On a interrogé tout le monde : il ne reste aucune incertitude.':'Plus on interroge une grande part de la population, plus l\'intervalle se resserre.'}`;fd()}
$('sl54').oninput=upd;upd();

/* Figure e : p(1-p) et la taille d'échantillon */
const nn=p=>1.96**2*p*(1-p)/.03**2;
const fe=fig('f54e',(W,H,m)=>{const p=+$('sl54e').value/100,pl=50,pr=16,pt=30,pb=36,X=v=>pl+v*(W-pl-pr),Y=v=>pt+(1-v/1200)*(H-pt-pb);let s='',d='';
  [0,400,800,1200].forEach(t=>s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(t)}" y2="${Y(t)}" stroke="${C.line}"/>`+txt(pl-6,Y(t)+4,fr(t),{a:'end',fs:12,c:C.mute}));
  for(let i=0;i<=200;i++){const q=i/200;d+=(d?'L':'M')+X(q).toFixed(1)+','+Y(nn(q)).toFixed(1)}
  s+=`<path d="${d}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`;
  s+=`<circle cx="${X(.5)}" cy="${Y(nn(.5))}" r="5" fill="${C.blue}"/>`+txt(X(.5),Y(nn(.5))-12,'p = 0,5 : 1 068 (le maximum)',{a:'middle',fs:13,c:C.blue,w:700,halo:1});
  if(!m)s+=`<circle cx="${X(.25)}" cy="${Y(nn(.25))}" r="5" fill="${C.blue}"/>`+txt(X(.25)-10,Y(nn(.25))+22,'p = 0,25 (sondage 2025) : 801',{a:'end',fs:13,c:C.blue,halo:1});
  const n=nn(p);s+=`<line x1="${X(p)}" x2="${X(p)}" y1="${Y(n)}" y2="${H-pb}" stroke="${C.ink}" stroke-dasharray="3 3"/><circle cx="${X(p)}" cy="${Y(n)}" r="8" fill="${C.ink}"/>`;
  s+=txt(X(p)+(p>.6?-12:12),Y(n)+(Math.abs(p-.5)<.12?28:-12),`n = ${fr(Math.ceil(n))}`,{a:p>.6?'end':'start',w:700,fs:16,halo:1});
  [0,.25,.5,.75,1].forEach(t=>s+=txt(X(t),H-pb+18,fx(t,2),{a:'middle',fs:12,c:C.mute}));
  s+=txt(W-pr,H-4,'p',{a:'end',fs:12,c:C.mute})+txt(pl,16,'n pour ± 3 % à 95 %',{fs:12,c:C.mute});
  return s});
function upde(){const p=+$('sl54e').value/100,n=nn(p);$('o54e').textContent=`p = ${fx(p,2)}`;
  $('c54e').innerHTML=`<span class="fn">Figure 5.4-e</span>n = 1,96² × ${fx(p,2)} × ${fx(1-p,2)} / 0,03² = ${fx(n,1)} → <b>${fr(Math.ceil(n))} répondants</b>. Sans aucune information, p = 0,5 donne le plus grand n : on ne peut pas se tromper par défaut. Avec l'information de l'an dernier (25 % prévoyaient dépenser plus), 801 suffisent.`;fe()}
$('sl54e').oninput=upde;upde();
}
