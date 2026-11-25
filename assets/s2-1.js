{
const {fr,fx,$,C,txt,fig}=SITE;
const expand=o=>Object.entries(o).flatMap(([v,n])=>Array(n).fill(+v));
const DS=[
 {k:'sym',l:'Symétrique',t:'Note sur 10 à un quiz (35 étudiants)',lo:0,hi:10,u:'',d:expand({1:1,2:2,3:4,4:6,5:9,6:6,7:4,8:2,9:1}),x:10},
 {k:'asy',l:'Asymétrique',t:'Heures de travail rémunéré par semaine (27 étudiants)',lo:0,hi:45,u:' h',d:[0,0,0,0,0,0,0,3,4,5,5,6,6,6,8,8,10,10,12,14,15,18,20,24,28,32,40],x:45},
 {k:'bi',l:'Bimodale',t:'Âge des personnes inscrites à un cours du soir (48 personnes)',lo:15,hi:60,u:' ans',d:expand({18:4,19:7,20:8,21:5,22:3,23:2,38:2,39:4,40:8,41:3,42:2}),x:60},
 {k:'multi',l:'Multimodale',t:'Note sur 10 à un quiz dans trois groupes réunis (30 étudiants)',lo:0,hi:10,u:'',d:expand({0:2,1:4,2:5,3:2,4:1,5:1,6:5,7:2,8:1,9:5,10:2}),x:10}];
let di=1,extra=false;
const stats=a=>{const s=[...a].sort((x,y)=>x-y),n=s.length,mean=s.reduce((p,v)=>p+v,0)/n,med=n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2,c={};s.forEach(v=>c[v]=(c[v]||0)+1);const mx=Math.max(...Object.values(c)),modes=mx>1?Object.keys(c).filter(k=>c[k]===mx).map(Number):[];return {n,mean,med,modes,mx,c}};
const data=()=>{const D=DS[di];return extra?[...D.d,D.x]:D.d};
$('ds').innerHTML=DS.map((d,i)=>`<button data-i="${i}">${d.l}</button>`).join('');
const fa=fig('f21a',(W,H,m)=>{const D=DS[di],a=data(),S=stats(a),pl=16,pr=16,pt=46,pb=56,X=v=>pl+(v-D.lo)/(D.hi-D.lo)*(W-pl-pr),base=H-pb,step=Math.min(16,(base-pt)/Math.max(S.mx,1)),r=Math.min(step*.42,(W-pl-pr)/(D.hi-D.lo)*.42,7);let s='';
  s+=`<line x1="${pl}" x2="${W-pr}" y1="${base}" y2="${base}" stroke="${C.ink}"/>`;
  const tk=D.hi-D.lo>20?5:1;for(let v=D.lo;v<=D.hi;v+=tk)s+=`<line x1="${X(v)}" x2="${X(v)}" y1="${base}" y2="${base+5}" stroke="${C.mute}"/>`+txt(X(v),base+18,v,{a:'middle',fs:11,c:C.mute});
  Object.entries(S.c).forEach(([v,n])=>{const mo=S.modes.includes(+v);for(let i=0;i<n;i++)s+=`<circle cx="${X(+v)}" cy="${base-r-2-i*step}" r="${r}" fill="${C.ink}" ${mo?`stroke="${C.ink}" stroke-width="0"`:''}/>`;
    if(mo)s+=`<rect x="${X(+v)-r-4}" y="${base-n*step-6}" width="${2*r+8}" height="${n*step+4}" rx="${r+3}" fill="none" stroke="${C.ink}" stroke-width="2" stroke-dasharray="3 3"/>`+txt(X(+v),base-n*step-12,'mode',{a:'middle',fs:12,w:700,halo:1})});
  s+=`<line x1="${X(S.med)}" x2="${X(S.med)}" y1="${pt-14}" y2="${base}" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`;
  const left=a.filter(v=>v<S.med).length,right=a.filter(v=>v>S.med).length;
  s+=txt(X(S.med)-8,pt-18,`← ${left}`,{a:'end',fs:12,c:C.blue,w:700})+txt(X(S.med)+8,pt-18,`${right} →`,{fs:12,c:C.blue,w:700})+txt(X(S.med),pt-34,'médiane',{a:'middle',fs:12,c:C.blue,w:700});
  s+=`<path d="M${X(S.mean)},${base+24}l-11,18h22z" fill="${C.org}"/>`+txt(X(S.mean)+14,base+40,`moyenne ${fx(S.mean,1)}`,{fs:12,w:700,c:C.org,halo:1});
  return s});
function upa(){document.querySelectorAll('#ds button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.i===di));const D=DS[di],S=stats(data());
  $('xtr').textContent=extra?'Retirer la valeur extrême':`Ajouter une valeur extrême (${D.x}${D.u})`;
  $('st21').innerHTML=`<div><span>Moyenne</span><b style="color:var(--org)">${fx(S.mean,1)}${D.u}</b></div><div><span>Médiane</span><b style="color:var(--blue)">${fx(S.med,1)}${D.u}</b></div><div><span>Mode</span><b>${S.modes.length?S.modes.join(' et ')+D.u:'aucun'}</b></div>`;
  const msg={sym:'Distribution symétrique : la moyenne, la médiane et le mode coïncident.',asy:'Asymétrie à droite : quelques grandes valeurs tirent la moyenne loin à droite de la médiane. Le mode, lui, est à 0 : le cas le plus fréquent est de ne pas travailler.',bi:'Deux groupes d\'âge, le premier plus nombreux : la médiane reste dans le groupe des jeunes, la moyenne tombe dans le creux, là où personne ne se trouve. Ici, les deux modes décrivent mieux les données.',multi:'Trois valeurs sont à égalité pour la plus grande fréquence : la distribution a trois modes.'}[D.k];
  $('c21a').innerHTML=`<span class="fn">Figure 2.1-a</span>${D.t}. ${msg}${extra?` Avec la valeur extrême, la moyenne bouge nettement; la médiane, à peine.`:''}`;fa()}
$('ds').onclick=e=>{const i=e.target.dataset.i;if(i!==undefined){di=+i;extra=false;upa()}};$('xtr').onclick=()=>{extra=!extra;upa()};upa();

/* ================= b : équilibre ================= */
const B0=[2,3,5,6,7,9];
const fb=fig('f21b',(W,H,m)=>{const v=+$('sl21').value,a=[...B0,v],mean=a.reduce((p,q)=>p+q,0)/a.length,pl=16,pr=16,X=x=>pl+x/42*(W-pl-pr),base=H-70;let s='';
  s+=`<line x1="${pl}" x2="${W-pr}" y1="${base}" y2="${base}" stroke="${C.ink}" stroke-width="3"/>`;
  for(let t=0;t<=40;t+=5)s+=txt(X(t),base+20,t,{a:'middle',fs:11,c:C.mute});
  const sorted=[...a].sort((x,y)=>x-y);let L=0,R=0;
  sorted.forEach((x,i)=>{const y=base-26-i*((base-60)/a.length),d=x-mean;if(d<0)L-=d;else R+=d;
    s+=`<line x1="${X(mean)}" x2="${X(x)}" y1="${y}" y2="${y}" stroke="${d<0?C.blue:C.org}" stroke-width="5" stroke-linecap="round" opacity=".8"/>`;
    s+=`<circle cx="${X(x)}" cy="${y}" r="6" fill="${C.ink}"/>`+txt(X(x)+(d<0?-10:10),y+4,`${d>0?'+':''}${fx(d,1)}`,{a:d<0?'end':'start',fs:11,c:d<0?C.blue:C.org,w:700,halo:1})});
  s+=`<path d="M${X(mean)},${base+2}l-14,26h28z" fill="${C.ink}"/>`+txt(X(mean),base+46,`x̄ = ${fx(mean,2)}`,{a:'middle',fs:14,w:700,halo:1});
  s+=txt(pl,20,`écarts à gauche : ${fx(L,2)}`,{fs:14,w:700,c:C.blue})+txt(W-pr,20,`écarts à droite : ${fx(R,2)}`,{a:'end',fs:14,w:700,c:C.org});
  return s});
function upb(){const v=+$('sl21').value;$('o21').textContent=v;const a=[...B0,v],mean=a.reduce((p,q)=>p+q,0)/a.length;
  $('c21b').innerHTML=`<span class="fn">Figure 2.1-b</span>Données : ${a.join(', ')}. Chaque trait est l'écart x − x̄. À gauche et à droite, les écarts totalisent la même chose : Σ(x − x̄) = 0. La moyenne est le point où le diagramme tient en équilibre${v>20?' : une seule grande valeur suffit à la déplacer':''}.`;fb()}
$('sl21').oninput=upb;upb();
}
