{
const {fr,fx,$,C,txt,fig}=SITE;
const X=[0,1,2,3],P0=[.3,.4,null,.1];
const Pget=()=>{const p=[...P0];p[2]=+$('p2').value/100;return p};

/* a : somme = 1 */
const fa=fig('f31a',(W,H,m)=>{const P=Pget(),pl=40,pr=10,pt=20,pb=40,bw=(W-pl-pr)/4,Y=v=>pt+(1-v/.6)*(H-pt-pb);let s='';
  [0,.2,.4,.6].forEach(t=>s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(t)}" y2="${Y(t)}" stroke="${C.line}"/>`+txt(pl-6,Y(t)+4,fx(t,1),{a:'end',fs:11,c:C.mute}));
  X.forEach((x,i)=>{const p=P[i],xx=pl+i*bw;s+=`<rect x="${xx+bw*.2}" y="${Y(p)}" width="${bw*.6}" height="${Y(0)-Y(p)}" fill="${i===2?C.blue:C.ink}" rx="3"/>`+txt(xx+bw/2,Y(p)-8,fx(p,2),{a:'middle',fs:13,w:700,c:i===2?C.blue:C.ink})+txt(xx+bw/2,H-18,`x = ${x}`,{a:'middle',fs:13,w:700})});
  return s});
const fa2=fig('f31a2',(W,H,m)=>{const P=Pget(),tot=P.reduce((a,b)=>a+b,0),pt=20,pb=40,Hd=H-pt-pb,cw=Math.min(64,W*.5),x=(W-cw)/2,sc=Hd/1.3;let s='',y=pt+Hd;
  P.forEach((p,i)=>{const h=p*sc;y-=h;s+=`<rect x="${x}" y="${y}" width="${cw}" height="${h}" fill="${i===2?C.blue:C.ink}" stroke="var(--bg)" stroke-width="2" opacity="${i===2?1:.8}"/>`});
  const y1=pt+Hd-sc;if(tot<1-1e-9)s+=`<rect x="${x}" y="${y1}" width="${cw}" height="${(1-tot)*sc}" fill="var(--orgsoft)" stroke="${C.org}" stroke-width="2" stroke-dasharray="4 3"/>`+txt(x+cw/2,y1+(1-tot)*sc/2+4,'manque',{a:'middle',fs:11,w:700,c:C.org});
  if(tot>1+1e-9)s+=`<rect x="${x}" y="${y}" width="${cw}" height="${(tot-1)*sc}" fill="${C.org}"/>`;
  s+=`<line x1="${x-14}" x2="${x+cw+14}" y1="${y1}" y2="${y1}" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="6 4"/>`+txt(x+cw+16,y1+4,'1',{fs:13,w:700,c:C.blue});
  s+=txt(W/2,H-18,`Σ = ${fx(tot,2)}`,{a:'middle',fs:14,w:700,c:Math.abs(tot-1)<1e-9?C.blue:C.org});return s});
function upa(){const P=Pget(),tot=P.reduce((a,b)=>a+b,0);$('op2').textContent=fx(P[2],2);
  $('c31a').innerHTML=`<span class="fn">Figure 3.1-a</span>${Math.abs(tot-1)<1e-9?'<b>La somme vaut 1 : c\'est une distribution de probabilité.</b> Toutes les possibilités sont couvertes, une seule fois.':tot<1?`La somme ne vaut que ${fx(tot,2)} : il manque ${fx(1-tot,2)}. Une partie des possibilités n'est pas couverte.`:`La somme dépasse 1 (${fx(tot,2)}) : impossible, on compterait plus que toutes les possibilités.`} P(X = 2) = 1 − (0,3 + 0,4 + 0,1) = 0,2.`;fa();fa2()}
$('p2').oninput=upa;upa();

/* b : espérance */
const P=[.3,.4,.2,.1],MU=X.reduce((a,x,i)=>a+x*P[i],0),VAR=X.reduce((a,x,i)=>a+(x-MU)**2*P[i],0),SD=Math.sqrt(VAR);
fig('f31b',(W,H,m)=>{const pl=20,pr=20,X_=v=>pl+(v+.5)/4*(W-pl-pr),base=H-70,Y=v=>base-v/.45*(base-20);let s='';
  s+=`<rect x="${X_(MU-SD)}" y="20" width="${X_(MU+SD)-X_(MU-SD)}" height="${base-20}" fill="var(--bluesoft)" opacity=".7"/>`+txt(X_(MU+SD)-4,34,'μ ± σ',{a:'end',fs:12,c:C.blue,w:700});
  s+=`<line x1="${pl}" x2="${W-pr}" y1="${base}" y2="${base}" stroke="${C.ink}" stroke-width="3"/>`;
  X.forEach((x,i)=>{const bw=(W-pl-pr)/4*.45;s+=`<rect x="${X_(x)-bw/2}" y="${Y(P[i])}" width="${bw}" height="${base-Y(P[i])}" fill="${C.ink}" rx="3"/>`+txt(X_(x),Y(P[i])-8,fx(P[i],1),{a:'middle',fs:12,w:700})+txt(X_(x),base+20,x,{a:'middle',fs:13,w:700})});
  s+=`<line x1="${X_(MU)}" x2="${X_(MU)}" y1="20" y2="${base}" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`;
  s+=`<path d="M${X_(MU)},${base+28}l-13,24h26z" fill="${C.org}"/>`+txt(X_(MU)+18,base+48,`E(X) = ${fx(MU,1)} café`,{fs:14,w:700,c:C.org});
  return s});
$('t31').innerHTML=`<thead><tr><th>x</th><th>P(X = x)</th><th>x · P(X = x)</th><th>(x − μ)² · P(X = x)</th></tr></thead><tbody>`+X.map((x,i)=>`<tr><td>${x}</td><td>${fx(P[i],1)}</td><td>${fx(x*P[i],1)}</td><td>${fx((x-MU)**2*P[i],3)}</td></tr>`).join('')+`<tr class="tot"><td>Total</td><td>1</td><td>μ = ${fx(MU,1)}</td><td>σ² = ${fx(VAR,2)}</td></tr></tbody>`;
$('c31b').innerHTML=`<span class="fn">Figure 3.1-b</span>E(X) = Σ x · P(X = x) = ${fx(MU,1)} : à long terme, l'étudiante achète en moyenne 1,1 café par jour de cours, même si 1,1 n'est pas une valeur possible. Variance : σ² = ${fx(VAR,2)}, écart type σ ≈ ${fx(SD,2)} café.`;

/* c : pari du dé */
const E=-1/3,NJ=5;let N=2000,runs=[];
const jouer=()=>{runs=Array.from({length:NJ},()=>{const step=Math.max(1,Math.floor(N/400)),pts=[];let g=0;for(let i=1;i<=N;i++){g+=Math.random()<4/6?2:-5;if(i%step===0||i===N)pts.push([i,g])}return pts})};
const COL=['var(--ink)','#64748b','#94a3b8','#475569','#334155'];
const fc=fig('f31c',(W,H,m)=>{const pl=50,pr=10,pt=12,pb=30;let lo=0,hi=0;runs.forEach(r=>r.forEach(([i,g])=>{lo=Math.min(lo,g);hi=Math.max(hi,g)}));lo=Math.min(lo,E*N);hi=Math.max(hi,10);
  const X=i=>pl+i/N*(W-pl-pr),Y=v=>pt+(hi-v)/(hi-lo)*(H-pt-pb);let s='';
  s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(0)}" y2="${Y(0)}" stroke="${C.line}" stroke-width="2"/>`+txt(pl-6,Y(0)+4,'0 $',{a:'end',fs:11,c:C.mute})+txt(pl-6,Y(lo)+4,fr(Math.round(lo))+' $',{a:'end',fs:11,c:C.mute});
  s+=`<line x1="${X(0)}" x2="${X(N)}" y1="${Y(0)}" y2="${Y(E*N)}" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`+txt(X(N)-4,Y(E*N)+16,`attendu : ${fr(Math.round(E*N))} $`,{a:'end',fs:12,w:700,c:C.blue,halo:1});
  runs.forEach((r,j)=>{let d=`M${X(0)},${Y(0)}`;r.forEach(([i,g])=>d+=`L${X(i).toFixed(1)},${Y(g).toFixed(1)}`);s+=`<path d="${d}" fill="none" stroke="${COL[j]}" stroke-width="${j?1.2:2.2}" opacity="${j?.55:1}"/>`});
  s+=txt(W-pr,H-6,fr(N)+' parties',{a:'end',fs:11,c:C.mute});return s});
const fd=fig('f31d',(W,H,m)=>{const pl=50,pr=10,pt=12,pb=30,lo=-5,hi=2,X=i=>pl+i/N*(W-pl-pr),Y=v=>pt+(hi-Math.max(lo,Math.min(hi,v)))/(hi-lo)*(H-pt-pb);let s='';
  [-5,-3,-1,0,1,2].forEach(t=>s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(t)}" y2="${Y(t)}" stroke="${C.line}"/>`+txt(pl-6,Y(t)+4,t+' $',{a:'end',fs:11,c:C.mute}));
  s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(E)}" y2="${Y(E)}" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`+txt(W-pr,Y(E)-6,'E(X) = −0,33 $',{a:'end',fs:12,w:700,c:C.blue,halo:1});
  runs.forEach((r,j)=>{let d='';r.forEach(([i,g])=>d+=(d?'L':'M')+X(i).toFixed(1)+','+Y(g/i).toFixed(1));s+=`<path d="${d}" fill="none" stroke="${COL[j]}" stroke-width="${j?1.2:2.2}" opacity="${j?.55:1}"/>`});
  s+=txt(W-pr,H-6,fr(N)+' parties',{a:'end',fs:11,c:C.mute});return s});
function upc(){document.querySelectorAll('#np button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.n===N));const f=runs.map(r=>r[r.length-1][1]);
  $('c31c').innerHTML=`<span class="fn">Figure 3.1-c</span>Cinq joueurs (le premier en gras). À gauche, le gain total monte et descend en dents de scie, mais suit la pente de −1/3 $ par partie. À droite, le gain moyen par partie zigzague au début, puis se stabilise près de l'espérance : E(X) = 2 × 4/6 + (−5) × 2/6 = −1/3 ≈ <b>−0,33 $</b>. Après ${fr(N)} parties, les cinq joueurs sont à ${f.map(v=>fr(v)+' $').join(', ')}.`;fc();fd()}
$('np').onclick=e=>{const n=e.target.dataset.n;if(n){N=+n;jouer();upc()}};$('rj').onclick=()=>{jouer();upc()};jouer();upc();
}
