{
const {fr,fx,$,C,txt,fig}=SITE;
const fact=n=>{let f=1;for(let i=2;i<=n;i++)f*=i;return f};
const pois=(l,k)=>Math.exp(-l)*l**k/fact(k);
/* a : pluie d'événements */
let hours=[],counts=[];
const sim=()=>{const l=+$('pl').value;hours=[];counts=[];for(let h=0;h<500;h++){const ev=[];let t=-Math.log(1-Math.random())/l;while(t<1){ev.push(t);t+=-Math.log(1-Math.random())/l}if(h<12)hours.push(ev);counts.push(ev.length)}};
const fa=fig('f33a',(W,H,m)=>{const pl=40,pr=34,rh=(H-30)/12,X=t=>pl+t*(W-pl-pr);let s='';
  [0,15,30,45,60].forEach(t=>s+=txt(X(t/60),H-6,t+' min',{a:'middle',fs:10,c:C.mute}));
  hours.forEach((ev,h)=>{const y=8+h*rh+rh/2;s+=`<line x1="${X(0)}" x2="${X(1)}" y1="${y}" y2="${y}" stroke="${C.line}" stroke-width="2"/>`+txt(pl-6,y+4,`h${h+1}`,{a:'end',fs:10,c:C.mute});
    ev.forEach(t=>s+=`<circle cx="${X(t)}" cy="${y}" r="5" fill="${C.ink}"/>`);s+=txt(X(1)+8,y+4,ev.length,{fs:13,w:700,c:C.org})});
  return s});
const fb=fig('f33b',(W,H,m)=>{const l=+$('pl').value,K=Math.max(10,Math.ceil(l*2.6)),obs=Array(K+1).fill(0);counts.forEach(c=>obs[Math.min(c,K)]++);
  const P=obs.map((_,k)=>pois(l,k)),mx=Math.max(...obs.map(o=>o/500),...P)*1.15,pl=36,pr=8,pt=10,pb=28,bw=(W-pl-pr)/(K+1),X=k=>pl+(k+.5)*bw,Y=v=>pt+(1-v/mx)*(H-pt-pb);let s='';
  obs.forEach((o,k)=>{const v=o/500;s+=`<rect x="${X(k)-bw*.36}" y="${Y(v)}" width="${bw*.72}" height="${Y(0)-Y(v)}" fill="${C.ink}" opacity=".8"/>`;if(K<=14||k%2===0)s+=txt(X(k),H-10,k,{a:'middle',fs:11,w:600})});
  let d='';P.forEach((v,k)=>d+=(d?'L':'M')+X(k)+','+Y(v));s+=`<path d="${d}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`;P.forEach((v,k)=>s+=`<circle cx="${X(k)}" cy="${Y(v)}" r="4" fill="var(--bg)" stroke="${C.blue}" stroke-width="2"/>`);
  s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(0)}" y2="${Y(0)}" stroke="${C.ink}"/>`;return s});
function upa(){const l=+$('pl').value;$('opl').textContent=l;const m=counts.reduce((a,b)=>a+b,0)/500,v=counts.reduce((a,b)=>a+(b-m)**2,0)/499;
  $('c33a').innerHTML=`<span class="fn">Figure 3.3-a</span>À gauche, chaque ligne est une heure et chaque point un appel, tombé au hasard. Le chiffre orange compte les appels de l'heure. À droite, les barres donnent la proportion des 500 heures simulées selon le nombre d'appels; le pointillé bleu est la loi de Poisson de paramètre λ = ${l}, qui les suit de près. Sur ces 500 heures : moyenne ${fx(m,2)}, variance ${fx(v,2)}, toutes deux proches de λ.`;fa();fb()}
$('pl').oninput=()=>{sim();upa()};$('ps').onclick=()=>{sim();upa()};sim();upa();
/* c : λ selon l'intervalle */
let hr=1,pt_='eq';
const sel=(t,k,x)=>t==='eq'?x===k:t==='le'?x<=k:x>=k;
const fc=fig('f33c',(W,H,m)=>{const l=3*hr,k=+$('pk').value,K=Math.max(12,Math.ceil(l+4*Math.sqrt(l))),P=Array.from({length:K+1},(_,x)=>pois(l,x)),mx=Math.max(...P)*1.2,pl=40,pr=10,pt=24,pb=34,bw=(W-pl-pr)/(K+1),X=x=>pl+(x+.5)*bw,Y=v=>pt+(1-v/mx)*(H-pt-pb);let s='';
  [0,mx/2].forEach(t=>s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(t)}" y2="${Y(t)}" stroke="${C.line}"/>`+txt(pl-6,Y(t)+4,fx(t,2),{a:'end',fs:11,c:C.mute}));
  P.forEach((v,x)=>{const on=sel(pt_,k,x);s+=`<rect x="${X(x)-bw*.38}" y="${Y(v)}" width="${bw*.76}" height="${Y(0)-Y(v)}" fill="${on?C.org:C.ink}" opacity="${on?1:.3}" rx="2"/>`;if(K<=16||x%2===0)s+=txt(X(x),H-14,x,{a:'middle',fs:12,w:700})});
  s+=txt(W-pr,H-1,pt_==='ge'?'… et ainsi de suite, sans fin':'',{a:'end',fs:11,c:C.org});
  const xm=pl+(l+.5)*bw;s+=`<line x1="${xm}" x2="${xm}" y1="${pt-10}" y2="${Y(0)}" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`+txt(xm+6,pt,`λ = ${fx(l,1)}`,{fs:12,w:700,c:C.blue,halo:1});
  return s});
function upc(){const l=3*hr,k=+$('pk').value;$('opk').textContent=k;document.querySelectorAll('#iv button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.h===hr));document.querySelectorAll('#pt button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.t===pt_));
  let tot=0;if(pt_==='ge'){let c=0;for(let x=0;x<k;x++)c+=pois(l,x);tot=1-c}else for(let x=0;x<=k;x++)if(sel(pt_,k,x))tot+=pois(l,x);
  const lab={eq:`P(X = ${k})`,le:`P(X ≤ ${k})`,ge:`P(X ≥ ${k})`}[pt_],iv={0.5:'30 minutes',1:'1 heure',2:'2 heures',3:'3 heures'}[hr];
  $('c33c').innerHTML=`<span class="fn">Figure 3.3-b</span>Intervalle de ${iv} : λ = 3 × ${fx(hr,1)} = <b>${fx(l,1)}</b> appels en moyenne. La distribution se déplace et s'étale avec λ. <b>${lab} ≈ ${fx(tot,4)}</b>.${pt_==='ge'?` Les barres orange continuent sans fin : on calcule 1 − P(X ≤ ${k-1}).`:''} Espérance = variance = ${fx(l,1)}.`;fc()}
$('iv').onclick=e=>{const h=e.target.dataset.h;if(h){hr=+h;upc()}};$('pt').onclick=e=>{const t=e.target.dataset.t;if(t){pt_=t;upc()}};$('pk').oninput=upc;upc();
}
