{
const {fr,fx,$,C,txt,fig}=SITE;
const mean=a=>a.reduce((p,v)=>p+v,0)/a.length,sd=a=>{const m=mean(a);return Math.sqrt(a.reduce((p,v)=>p+(v-m)**2,0)/(a.length-1))};
const GA=[58,62,66,68,70,70,72,74,78,82],GB=[42,50,58,65,70,74,80,86,90,85];

/* ================= a : étendue ================= */
let xe=false;
const fa=fig('f22a',(W,H,m)=>{const A=xe?[...GA,20]:GA,pl=m?70:90,pr=16,X=v=>pl+(v-10)/(100-10)*(W-pl-pr);let s='';
  [20,40,60,80,100].forEach(t=>s+=`<line x1="${X(t)}" x2="${X(t)}" y1="10" y2="${H-26}" stroke="${C.line}"/>`+txt(X(t),H-8,t+' %',{a:'middle',fs:11,c:C.mute}));
  [['Groupe A',A,H*.3],['Groupe B',GB,H*.68]].forEach(([l,a,y])=>{const mn=Math.min(...a),mx=Math.max(...a);
    s+=txt(pl-10,y+5,l,{a:'end',fs:13,w:700});
    s+=`<line x1="${X(mn)}" x2="${X(mx)}" y1="${y-22}" y2="${y-22}" stroke="${C.blue}" stroke-width="2"/><line x1="${X(mn)}" x2="${X(mn)}" y1="${y-28}" y2="${y-16}" stroke="${C.blue}" stroke-width="2"/><line x1="${X(mx)}" x2="${X(mx)}" y1="${y-28}" y2="${y-16}" stroke="${C.blue}" stroke-width="2"/>`;
    s+=txt((X(mn)+X(mx))/2,y-30,`étendue : ${mx-mn} %`,{a:'middle',fs:12,w:700,c:C.blue,halo:1});
    const seen={};a.forEach(v=>{seen[v]=(seen[v]||0)+1;s+=`<circle cx="${X(v)}" cy="${y-(seen[v]-1)*12}" r="6" fill="${v===20&&xe?C.org:C.ink}"/>`})});
  return s});
function upa(){const A=xe?[...GA,20]:GA;$('xe').textContent=xe?'Retirer l\'étudiant à 20 %':'Ajouter un étudiant à 20 % dans le groupe A';
  $('c22a').innerHTML=`<span class="fn">Figure 2.2-a</span>${xe?`Un seul étudiant de plus fait passer l'étendue du groupe A de 24 % à 62 %. L'étendue ne dépend que des deux valeurs extrêmes; l'écart type, lui, passe de ${fx(sd(GA),1)} % à ${fx(sd(A),1)} %.`:'L\'étendue se lit d\'un coup d\'œil : 24 % pour le groupe A, 48 % pour le groupe B. Le groupe B est plus dispersé.'}`;fa()}
$('xe').onclick=()=>{xe=!xe;upa()};upa();

/* ================= b : écart type en carrés ================= */
let g=0;
const fb=fig('f22b',(W,H,m)=>{const a=g?GB:GA,mu=mean(a),s_=sd(a),pl=14,pr=14,X=v=>pl+(v-35)/(100-35)*(W-pl-pr),ay=52;let s='';
  [40,50,60,70,80,90,100].forEach(t=>s+=txt(X(t),ay+22,t+' %',{a:'middle',fs:11,c:C.mute}));
  s+=`<line x1="${pl}" x2="${W-pr}" y1="${ay}" y2="${ay}" stroke="${C.ink}"/>`;
  s+=`<rect x="${X(mu-s_)}" y="${ay-30}" width="${X(mu+s_)-X(mu-s_)}" height="30" fill="var(--bluesoft)" opacity=".8"/>`+txt(X(mu+s_)+6,ay-18,'x̄ ± s',{fs:12,c:C.blue,w:700});
  a.forEach(v=>s+=`<line x1="${X(mu)}" x2="${X(v)}" y1="${ay-8}" y2="${ay-8}" stroke="${C.org}" stroke-width="3" opacity=".6"/><circle cx="${X(v)}" cy="${ay-8}" r="5" fill="${C.ink}"/>`);
  s+=`<line x1="${X(mu)}" x2="${X(mu)}" y1="${ay-36}" y2="${ay+4}" stroke="${C.ink}" stroke-width="2"/>`+txt(X(mu),ay-40,'x̄ = 70 %',{a:'middle',fs:12,w:700});
  /* rangée de carrés, à la même échelle pour les deux groupes */
  const devs=a.map(v=>Math.abs(v-mu)).sort((p,q)=>q-p),sumB=GB.map(v=>Math.abs(v-mean(GB))).reduce((p,q)=>p+q,0),gap=6,u=Math.min((W-pl-pr-gap*12-30)/(sumB+sd(GB)),(H-ay-110)/28);
  let x=pl;const y0=H-30;devs.forEach(d=>{const sz=d*u;if(sz>0)s+=`<rect x="${x}" y="${y0-sz}" width="${sz}" height="${sz}" fill="${C.org}" opacity=".75"/>`;x+=sz+gap});
  s+=txt(pl,y0+18,`Les ${a.length} carrés des écarts : Σ(x − x̄)² = ${fr(a.reduce((p,v)=>p+(v-mu)**2,0),0)}`,{fs:12,c:C.org,w:700});
  const ss=s_*u,bx=m?x+14:Math.max(x+20,W-pr-Math.max(ss,120));
  {s+=`<rect x="${bx}" y="${y0-ss}" width="${ss}" height="${ss}" fill="var(--bluesoft)" stroke="${C.blue}" stroke-width="2.5"/>`+txt(bx+ss/2,y0-ss-24,'carré moyen',{a:'middle',fs:12,c:C.blue,w:700})+txt(bx+ss/2,y0-ss-8,`côté s = ${fx(s_,1)} %`,{a:'middle',fs:13,c:C.blue,w:700})}
  return s});
function upb(){document.querySelectorAll('#gr button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.g===g));const a=g?GB:GA,ss=a.reduce((p,v)=>p+(v-70)**2,0);
  $('c22b').innerHTML=`<span class="fn">Figure 2.2-b</span>Chaque écart x − x̄ devient un carré d'aire (x − x̄)². On « moyenne » les aires : s² = ${fr(ss,0)} / (${a.length} − 1) ≈ ${fx(ss/9,1)}. L'écart type est le côté de ce carré moyen : <b>s ≈ ${fx(Math.sqrt(ss/9),1)} %</b>. ${g?'Le groupe B a de grands carrés : il est plus dispersé.':'Comparez avec le groupe B : même moyenne, carrés beaucoup plus grands.'}`;fb()}
$('gr').onclick=e=>{const v=e.target.dataset.g;if(v!==undefined){g=+v;upb()}};upb();

/* ================= c : coefficient de variation ================= */
const Z0=[-1.9,-1.4,-1.1,-.9,-.7,-.5,-.4,-.2,-.1,0,.1,.2,.4,.5,.6,.8,1,1.2,1.5,2];
const zm=mean(Z0),zs=sd(Z0),Z=Z0.map(z=>(z-zm)/zs);
const EP=Z.map(z=>120+50*z),LO=Z.map(z=>800+50*z);let ech='d';
const fc=fig('f22c',(W,H,m)=>{const pl=m?78:110,pr=16;let s='';
  const row=(l,a,mu,y,lo,hi)=>{const X=v=>pl+(v-lo)/(hi-lo)*(W-pl-pr),sv=sd(a);
    s+=`<line x1="${pl}" x2="${W-pr}" y1="${y+16}" y2="${y+16}" stroke="${C.line}"/>`;
    const ticks=ech==='d'?[0,200,400,600,800,1000]:[lo,mu/2,mu,mu*1.5,hi];ticks.forEach(t=>s+=txt(X(t),y+32,fr(t,0)+' $',{a:'middle',fs:11,c:C.mute}));
    s+=`<rect x="${X(mu-sv)}" y="${y-16}" width="${X(mu+sv)-X(mu-sv)}" height="26" fill="var(--bluesoft)"/>`;
    a.forEach(v=>s+=`<circle cx="${X(v)}" cy="${y-3}" r="4.5" fill="${C.ink}" opacity=".8"/>`);
    s+=txt(pl-10,y-2,l,{a:'end',fs:13,w:700})+txt(pl-10,y+14,`CV ${fr(sv/mu*100,0)} %`,{a:'end',fs:12,w:700,c:C.org})};
  if(ech==='d'){row('Épicerie',EP,120,H*.32,0,1000);row('Loyer',LO,800,H*.72,0,1000)}
  else{row('Épicerie',EP,120,H*.32,0,240);row('Loyer',LO,800,H*.72,0,1600)}
  return s});
function upc(){document.querySelectorAll('#ech button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.e===ech));
  $('c22c').innerHTML=`<span class="fn">Figure 2.2-d</span>${ech==='d'?'En dollars, les deux nuages ont exactement la même largeur : s = 50 $ dans les deux cas. Pourtant, 50 $ de plus ou de moins sur l\'épicerie, ce n\'est pas comme sur le loyer.':'À l\'échelle de sa propre moyenne, l\'épicerie (x̄ = 120 $) varie énormément, le loyer (x̄ = 800 $) presque pas. C\'est ce que mesure le CV : <b>50 / 120 ≈ 42 %</b> contre <b>50 / 800 ≈ 6 %</b>.'} La bande bleue montre x̄ ± s.`;fc()}
$('ech').onclick=e=>{const v=e.target.dataset.e;if(v){ech=v;upc()}};upc();

/* ================= c : pourquoi n − 1 ================= */
const MU=70,SG=10,gs=()=>{let u=0;while(!u)u=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*Math.random())};
let smp=[],simN=0,simD=0;
const draw=n=>Array.from({length:n},()=>Math.round((MU+SG*gs())*10)/10);
function simulate(n){let a=0,b=0;const R=5000;for(let r=0;r<R;r++){const x=draw(n),m=mean(x),ss=x.reduce((p,v)=>p+(v-m)**2,0);a+=ss/n;b+=ss/(n-1)}simN=a/R;simD=b/R}
const fd=fig('f22d',(W,H,m)=>{const pl=12,pr=12,X=v=>pl+(v-40)/60*(W-pl-pr),xb=mean(smp),n=smp.length,rh=Math.min(26,(H-110)/n);let s='';
  [40,50,60,70,80,90,100].forEach(t=>s+=txt(X(t),H-8,t+' %',{a:'middle',fs:11,c:C.mute}));
  s+=`<line x1="${X(MU)}" x2="${X(MU)}" y1="14" y2="${H-24}" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`+txt(X(MU)+5,14,'μ',{fs:14,w:700,c:C.blue});
  s+=`<line x1="${X(xb)}" x2="${X(xb)}" y1="24" y2="${H-24}" stroke="${C.ink}" stroke-width="2.5"/>`+txt(X(xb)+5,30,'x̄',{fs:14,w:700});
  [...smp].sort((p,q)=>p-q).forEach((v,i)=>{const y=44+i*rh;s+=`<line x1="${X(xb)}" x2="${X(v)}" y1="${y}" y2="${y}" stroke="${C.org}" stroke-width="5" opacity=".8"/><line x1="${X(MU)}" x2="${X(v)}" y1="${y+6}" y2="${y+6}" stroke="${C.blue}" stroke-width="2" stroke-dasharray="4 3"/><circle cx="${X(v)}" cy="${y+3}" r="6" fill="${C.ink}"/>`});
  const a=smp.reduce((p,v)=>p+(v-xb)**2,0),b=smp.reduce((p,v)=>p+(v-MU)**2,0),y0=44+n*rh+14;
  s+=txt(pl,y0+4,`Σ(x − x̄)² = ${fr(a,0)}`,{fs:13,w:700,c:C.org})+txt(pl,y0+22,`Σ(x − μ)² = ${fr(b,0)}`,{fs:13,w:700,c:C.blue});
  return s});
const fe=fig('f22e',(W,H,m)=>{if(!simD)return'';const n=+$('nn').value,pl=m?92:120,pr=16,X=v=>pl+v/130*(W-pl-pr);let s='';
  [0,25,50,75,100,125].forEach(t=>s+=`<line x1="${X(t)}" x2="${X(t)}" y1="20" y2="${H-40}" stroke="${C.line}"/>`+txt(X(t),H-24,t,{a:'middle',fs:11,c:C.mute}));
  [['÷ n',simN,H*.32],['÷ (n − 1)',simD,H*.6]].forEach(([l,v,y])=>{s+=`<rect x="${X(0)}" y="${y-18}" width="${X(v)-X(0)}" height="36" fill="${l==='÷ n'?C.org:C.ink}" rx="3"/>`+txt(pl-10,y+5,l,{a:'end',fs:15,w:700})+txt(X(v)+8,y+5,fx(v,1),{fs:14,w:700,halo:1})});
  s+=`<line x1="${X(100)}" x2="${X(100)}" y1="10" y2="${H-40}" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`+txt(X(100),H-6,'σ² = 100',{a:'middle',fs:12,w:700,c:C.blue});
  s+=txt(W-pr,14,`n = ${n}`,{a:'end',fs:12,c:C.mute});
  return s});
function upd(){const n=+$('nn').value;$('onn').textContent=n;const xb=mean(smp);
  $('c22d').innerHTML=`<span class="fn">Figure 2.2-c</span>À gauche, x̄ est calculée avec ces mêmes points : elle se place au milieu d'eux. Les écarts à x̄ (orange) sont donc, au total, plus petits que les écarts à la vraie moyenne μ (bleu), qu'on ne connaît pas. Diviser par n sous-estime la variance : en moyenne, on obtient ${fx(simN,0)} au lieu de 100, soit environ (n − 1)/n = ${fr((n-1)/n*100,0)} % de la vraie valeur. Diviser par n − 1 corrige exactement ce manque. Avec une population entière, on connaît μ : pas besoin de correction.`;fd();fe()}
$('ns').onclick=()=>{smp=draw(+$('nn').value);upd()};
$('nn').oninput=()=>{const n=+$('nn').value;smp=draw(n);simulate(n);upd()};
smp=draw(4);simulate(4);upd();
}
