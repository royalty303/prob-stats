{
const {fr,fx,$,C,txt,fig,npdf,path,area}=SITE;
const seg=(id,cb)=>{$(id).onclick=e=>{const b=e.target.closest('button');if(!b)return;$(id).querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));cb(b.dataset)}};
/* aire entre 0 et z (série entière, précise pour |z| < 5) */
const T0=z=>{let t=z,s=z;for(let n=1;n<200;n++){t*=-z*z/(2*n);const u=t/(2*n+1);s+=u;if(Math.abs(u)<1e-17)break}return s/Math.sqrt(2*Math.PI)};
const r2=z=>Math.round(z*100)/100;
const TAB=z=>Math.round(T0(Math.abs(r2(z)))*1e4)/1e4;          /* lecture de la table, 4 décimales */
const f4=v=>fx(v,4),f2=z=>fx(z,2);
/* lecture inverse selon la règle du cours */
const CELLS=[];for(let i=0;i<=399;i++){const z=i/100;CELLS.push([z,Math.round(T0(z)*1e4)])}
function inv(p){const P=Math.round(p*1e4);let dm=1e9;CELLS.forEach(([z,v])=>dm=Math.min(dm,Math.abs(v-P)));
  const c=CELLS.filter(([z,v])=>Math.abs(v-P)===dm);
  if(dm===0)return {k:'exact',z:c[0][0],cells:[c[0][0]],P};
  const lo=c.filter(([z,v])=>v<P),hi=c.filter(([z,v])=>v>P);
  if(lo.length&&hi.length){const a=lo[lo.length-1],b=hi[0];return {k:'mil',z:(a[0]+b[0])/2,cells:[a[0],b[0]],P,a,b}}
  const ch=c[0];const other=ch[1]<P?CELLS.find(([z,v])=>v>P):[...CELLS].reverse().find(([z,v])=>v<P);
  return {k:'proche',z:ch[0],cells:[ch[0]],P,ch,other}}
const invTxt=r=>r.k==='exact'?`L'aire ${f4(r.P/1e4)} est dans la table : <b>z = ${f2(r.z)}</b>`:r.k==='mil'?`L'aire ${f4(r.P/1e4)} tombe pile entre ${f4(r.a[1]/1e4)} et ${f4(r.b[1]/1e4)} : on fait la moyenne, <b>z = (${f2(r.a[0])} + ${f2(r.b[0])}) ÷ 2 = ${fx(r.z,3)}</b>`:`L'aire ${f4(r.P/1e4)} n'est pas dans la table; la plus proche est ${f4(r.ch[1]/1e4)} (plutôt que ${f4(r.other[1]/1e4)}) : <b>z = ${f2(r.z)}</b>`;
/* décomposition d'une aire en morceaux de table */
function decomp(L,U){const t=[];if(L===U)return {t,v:0};
  if(L===-Infinity){t.push({s:1,h:1,a:-Infinity,b:0});if(U>=0)t.push({s:1,a:0,b:U,z:U});else t.push({s:-1,a:U,b:0,z:-U})}
  else if(U===Infinity){t.push({s:1,h:1,a:0,b:Infinity});if(L<=0)t.unshift({s:1,a:L,b:0,z:-L});else t.push({s:-1,a:0,b:L,z:L})}
  else if(L<0&&U>0){t.push({s:1,a:L,b:0,z:-L},{s:1,a:0,b:U,z:U})}
  else if(L>=0){t.push({s:1,a:0,b:U,z:U},{s:-1,a:0,b:L,z:L})}
  else{t.push({s:1,a:L,b:0,z:-L},{s:-1,a:U,b:0,z:-U})}
  t.forEach(o=>o.v=o.h?.5:TAB(o.z));const v=t.reduce((a,o)=>a+o.s*o.v,0);return {t,v:Math.round(v*1e4)/1e4}}
const decTxt=d=>d.t.length?d.t.map((o,i)=>`${i?(o.s>0?' + ':' − '):(o.s>0?'':'− ')}${f4(o.v)}`).join('')+` = ${f4(d.v)}`:'0';

/* a : planche de Galton */
const R=12;let bins=Array(R+1).fill(0),balls=[],raf=0,last=0;
const drop=(k,stag)=>{const now=performance.now();for(let i=0;i<k;i++){const p=[];let s=0;for(let r=0;r<R;r++){const d=Math.random()<.5?1:0;s+=d;p.push(s)}balls.push({p,t:-(stag?i*.12:0)*14,b:s})}if(!raf){last=now;raf=requestAnimationFrame(step)}};
function step(now){const dt=Math.min(.05,(now-last)/1000);last=now;balls.forEach(b=>b.t+=dt*14);
  balls=balls.filter(b=>{if(b.t>=R+1.6){bins[b.b]++;return false}return true});fa();upa();raf=balls.length?requestAnimationFrame(step):0}
const fa=fig('f42a',(W,H,m)=>{const cx=W/2,dx=Math.min(34,(W-20)/(R+2)),top=26,dy=Math.min(17,(H*.48)/R),bt=top+R*dy+14,bb=H-30;let s='';
  for(let r=0;r<R;r++)for(let j=0;j<=r;j++)s+=`<circle cx="${cx+(j-r/2)*dx}" cy="${top+r*dy}" r="2.6" fill="${C.mute}"/>`;
  for(let b=0;b<=R+1;b++){const x=cx+(b-R/2-.5)*dx;s+=`<line x1="${x}" x2="${x}" y1="${bt}" y2="${bb}" stroke="${C.line}"/>`}
  s+=`<line x1="${cx-(R/2+.5)*dx}" x2="${cx+(R/2+.5)*dx}" y1="${bb}" y2="${bb}" stroke="${C.ink}"/>`;
  const N=bins.reduce((a,b)=>a+b,0),sd=Math.sqrt(R/4),exp=b=>N*npdf((b-R/2)/sd)/sd,mx=Math.max(1,...bins,exp(R/2))*1.08,Yb=v=>bb-v/mx*(bb-bt-6);
  bins.forEach((c,b)=>{if(c)s+=`<rect x="${cx+(b-R/2)*dx-dx*.42}" y="${Yb(c)}" width="${dx*.84}" height="${bb-Yb(c)}" fill="${C.ink}" opacity=".85"/>`;s+=txt(cx+(b-R/2)*dx,bb+16,b,{a:'middle',fs:m?10:11,c:C.mute})});
  if(N>=20)s+=`<path d="${path(b=>exp(b),v=>cx+(v-R/2)*dx,Yb,-.5,R+.5,160)}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`;
  balls.forEach(o=>{if(o.t<0)return;const t=Math.min(o.t,R+1.6),r=Math.min(R,Math.floor(t)),f=t-Math.floor(t);
    const pos=k=>{const kk=Math.min(k,R),sk=kk?o.p[kk-1]:0;return [cx+(sk-kk/2)*dx,top+kk*dy-dy*.6]};
    let x,y;if(t<R){const [x0,y0]=pos(r),[x1,y1]=pos(r+1);x=x0+(x1-x0)*f;y=y0+(y1-y0)*f-Math.sin(Math.PI*f)*dy*.45}else{[x]=pos(R);y=top+R*dy-dy*.6+(t-R)/1.6*(bb-top-R*dy)}
    s+=`<circle cx="${x}" cy="${y}" r="${Math.max(3,dx*.17)}" fill="${C.org}"/>`});
  s+=txt(8,16,`${fr(N)} bille${N>1?'s':''} arrivée${N>1?'s':''}`,{fs:12,w:700,c:C.ink});
  return s});
function upa(){const N=bins.reduce((a,b)=>a+b,0),mean=N?bins.reduce((a,c,b)=>a+c*b,0)/N:0;
  $('c42a').innerHTML=`<span class="fn">Figure 4.2-a</span>Chaque bille fait 12 petits choix au hasard; sa case finale compte ses rebonds vers la droite. Les cases extrêmes demandent 12 rebonds du même côté : rarissime. Les cases du centre se remplissent, car beaucoup de chemins y mènent.${N>=20?` Moyenne observée : ${fx(mean,2)}. En pointillé, la loi normale de moyenne 6 et d'écart type √3 ≈ 1,73.`:''} Taille, erreurs de mesure, masse d'un produit : chaque fois que de nombreux petits effets indépendants s'additionnent, la cloche apparaît.`}
$('g1').onclick=()=>drop(1);$('g50').onclick=()=>drop(50,1);
$('g1000').onclick=()=>{for(let i=0;i<1000;i++){let s=0;for(let r=0;r<R;r++)s+=Math.random()<.5?1:0;bins[s]++}fa();upa()};
$('g0').onclick=()=>{bins.fill(0);balls=[];fa();upa()};upa();

/* b : allure de la cloche */
const fb=fig('f42b',(W,H,m)=>{const mu=+$('bm').value,sg=+$('bs').value,pl=14,pr=14,pt=34,pb=44,ym=.072,X=v=>pl+v/100*(W-pl-pr),Y=v=>pt+(1-v/ym)*(H-pt-pb);
  const g=(M,S)=>x=>npdf((x-M)/S)/S;let s='';
  for(let v=0;v<=100;v+=10)s+=`<line x1="${X(v)}" x2="${X(v)}" y1="${Y(0)}" y2="${Y(0)+5}" stroke="${C.mute}"/>`+txt(X(v),Y(0)+20,v,{a:'middle',fs:12,c:C.mute});
  s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(0)}" y2="${Y(0)}" stroke="${C.ink}"/>`+txt(W-pr,Y(0)+38,'résultat (%)',{a:'end',fs:12,c:C.mute});
  s+=`<path d="${path(g(60,10),X,Y,0,100,300)}" fill="none" stroke="${C.mute}" stroke-width="1.5" opacity=".6"/>`;
  s+=`<path d="${area(g(mu,sg),X,Y,0,100)}" fill="var(--bluesoft)" opacity=".7"/><path d="${path(g(mu,sg),X,Y,0,100,300)}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`;
  const top=g(mu,sg)(mu);s+=`<line x1="${X(mu)}" x2="${X(mu)}" y1="${Y(top)-14}" y2="${Y(0)}" stroke="${C.blue}" stroke-width="1.5"/>`;
  s+=txt(X(mu),Y(top)-20,`axe de symétrie : μ = ${mu} %`,{a:'middle',fs:12,w:700,c:C.blue,halo:1});
  const yi=Y(g(mu,sg)(mu+sg));[mu-sg,mu+sg].forEach(v=>s+=`<circle cx="${X(v)}" cy="${yi}" r="4.5" fill="var(--bg)" stroke="${C.blue}" stroke-width="2"/>`);
  s+=`<line x1="${X(mu)}" x2="${X(mu+sg)}" y1="${yi}" y2="${yi}" stroke="${C.blue}" stroke-width="1.5" marker-end=""/>`+txt((X(mu)+X(mu+sg))/2,yi-6,`σ = ${sg} %`,{a:'middle',fs:12,w:700,c:C.blue,halo:1});
  if(!m||mu+sg<85)s+=txt(X(mu+sg)+8,yi+4,'point d\'inflexion',{fs:11,c:C.blue,halo:1});
  s+=txt(X(mu),Y(top*.35),'aire = 1',{a:'middle',fs:13,w:700,c:C.ink,halo:1});
  return s});
function upb(){const mu=+$('bm').value,sg=+$('bs').value;$('obm').textContent=mu+' %';$('obs').textContent=sg+' %';
  $('c42b').innerHTML=`<span class="fn">Figure 4.2-b</span>En gris, la cloche de départ (μ = 60 %, σ = 10 %). ${mu!==60?`Changer μ <b>déplace</b> la cloche sans la déformer. `:''}${sg>10?`Un σ plus grand <b>étale</b> la cloche et abaisse son sommet : l'aire doit rester 1. `:sg<10?`Un σ plus petit <b>resserre</b> la cloche et élève son sommet : l'aire doit rester 1. `:''}La cloche est symétrique autour de μ; la moyenne, la médiane et le mode y coïncident. Elle change de courbure à μ − σ et μ + σ. Hauteur du sommet : 1 ÷ (σ√(2π)) ≈ ${fx(1/(sg*Math.sqrt(2*Math.PI)),4)}.`;fb()}
['bm','bs'].forEach(id=>$(id).oninput=upb);upb();

/* c : la table */
let tm='dir',tp=.45;
$('ztab').innerHTML=`<thead><tr><th>z</th>${[...Array(10)].map((_,j)=>`<th data-c="${j}">${fx(j/100,2)}</th>`).join('')}</tr></thead><tbody>`+[...Array(40)].map((_,i)=>`<tr><th data-r="${i}">${fx(i/10,2)}</th>${[...Array(10)].map((_,j)=>{const k=i*10+j;return `<td data-z="${k}">${f4(CELLS[k][1]/1e4)}</td>`}).join('')}</tr>`).join('')+'</tbody>';
const fc=fig('f42c',(W,H,m)=>{const z=cz(),pl=10,pr=10,pt=20,pb=36,X=v=>pl+(v+3.6)/7.2*(W-pl-pr),Y=v=>pt+(1-v/.42)*(H-pt-pb);let s='';
  s+=`<path d="${area(npdf,X,Y,-3.6,3.6)}" fill="var(--bluesoft)" opacity=".7"/>`;
  if(z>0)s+=`<path d="${area(npdf,X,Y,0,Math.min(z,3.6))}" fill="${C.org}" opacity=".9"/>`;
  s+=`<path d="${path(npdf,X,Y,-3.6,3.6,300)}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`;
  s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(0)}" y2="${Y(0)}" stroke="${C.ink}"/>`;
  for(let v=-3;v<=3;v++)s+=txt(X(v),Y(0)+16,v,{a:'middle',fs:11,c:C.mute});
  s+=`<line x1="${X(0)}" x2="${X(0)}" y1="${Y(npdf(0))-4}" y2="${Y(0)}" stroke="${C.blue}" stroke-width="1.5"/>`;
  s+=txt(X(z),Y(0)+32,`z = ${tm==='inv'&&ires.k==='mil'?fx(z,3):f2(z)}`,{a:'middle',fs:13,w:700,c:C.org});
  if(z>.35)s+=txt(X(z/2),Y(.12),f4(tm==='inv'?tp:TAB(z)),{a:'middle',fs:13,w:700,c:'#fff'});
  return s});
let ires=inv(tp);
const cz=()=>tm==='dir'?+$('tz').value:ires.z;
function upc(){document.querySelectorAll('#ztab .hit,#ztab .alt,#ztab .rh').forEach(e=>e.classList.remove('hit','alt','rh'));
  $('tdir').hidden=tm!=='dir';$('tinv').hidden=tm!=='inv';const T=$('ztab'),box=T.parentElement;
  let first=null;
  if(tm==='dir'){const z=+$('tz').value,k=Math.round(z*100);$('otz').textContent=f2(z);
    const c=T.querySelector(`td[data-z="${k}"]`);c.classList.add('hit');first=c;T.querySelector(`th[data-r="${Math.floor(k/10)}"]`).classList.add('rh');T.querySelector(`th[data-c="${k%10}"]`).classList.add('rh');
    $('t42c').innerHTML=`Ligne ${fx(Math.floor(k/10)/10,2)}, colonne ${fx((k%10)/100,2)} : <b>P(0 ≤ Z ≤ ${f2(z)}) = ${f4(TAB(z))}</b>`}
  else{ires=inv(tp);ires.cells.forEach(z=>{const c=T.querySelector(`td[data-z="${Math.round(z*100)}"]`);c.classList.add('hit');first=first||c});
    if(ires.k==='proche'){const c=T.querySelector(`td[data-z="${Math.round(ires.other[0]*100)}"]`);c.classList.add('alt')}
    $('t42c').innerHTML=invTxt(ires)}
  if(first){const top=first.offsetTop-box.clientHeight/2;box.scrollTo({top:Math.max(0,top),behavior:'smooth'})}
  $('c42c').innerHTML=`<span class="fn">Figure 4.2-c</span>${tm==='dir'?'Lecture directe : la ligne donne z jusqu\'au dixième, la colonne ajoute le centième. La case donne l\'aire orange, entre le centre et z.':'Lecture inverse : on cherche l\'aire à l\'intérieur de la table, puis on remonte à la ligne et à la colonne. Aire présente : sa cote z. Aire absente : la plus proche. Pile au milieu de deux aires : la moyenne des deux cotes z.'} L'intégrale de la cloche ne se calcule pas à la main : ces aires viennent d'une méthode numérique.`;fc()}
seg('tm',d=>{tm=d.m;upc()});$('tz').oninput=upc;
seg('tp',d=>{tp=+d.p;$('tpx').value=tp;upc()});$('tpx').oninput=()=>{const v=+$('tpx').value;if(v>0&&v<.499){tp=v;$('tp').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.p===v));upc()}};
$('ztab').onclick=e=>{const c=e.target.closest('td[data-z]');if(!c)return;tm='dir';$('tm').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m==='dir'));$('tz').value=+c.dataset.z/100;upc()};
upc();

/* d : double axe */
const MU=100,SG=15;let dq='le';
const zx=x=>r2((x-MU)/SG);
function dstate(){const a=+$('da').value,b=+$('db').value,p=+$('dp').value/100;
  if(dq==='le')return {L:-Infinity,U:zx(a),xs:[[a,zx(a)]]};
  if(dq==='ge')return {L:zx(a),U:Infinity,xs:[[a,zx(a)]]};
  if(dq==='ab'){const lo=Math.min(a,b),hi=Math.max(a,b);return {L:zx(lo),U:zx(hi),xs:[[lo,zx(lo)],[hi,zx(hi)]]}}
  const r=inv(.5-p),z=dq==='hi'?r.z:-r.z,x=MU+z*SG;return dq==='hi'?{L:z,U:Infinity,xs:[[x,z]],r,p,inv:1}:{L:-Infinity,U:z,xs:[[x,z]],r,p,inv:1}}
const fd=fig('f42d',(W,H,m)=>{const S=dstate(),pl=34,pr=12,pt=58,pb=78,X=z=>pl+(z+3.5)/7*(W-pl-pr),Y=v=>pt+(1-v/.42)*(H-pt-pb),ax=Y(0),az=ax+38;let s='';
  const L=Math.max(S.L,-3.5),U=Math.min(S.U,3.5);
  s+=`<path d="${area(npdf,X,Y,-3.5,3.5)}" fill="var(--bluesoft)" opacity=".7"/>`;if(U>L)s+=`<path d="${area(npdf,X,Y,L,U)}" fill="${C.org}" opacity=".85"/>`;
  s+=`<path d="${path(npdf,X,Y,-3.5,3.5,300)}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`;
  s+=`<line x1="${X(0)}" x2="${X(0)}" y1="${Y(npdf(0))}" y2="${ax}" stroke="${C.blue}" stroke-width="1.5"/>`;
  /* morceaux de table */
  const d=decomp(S.L,S.U);d.t.forEach((o,i)=>{const a=Math.max(o.a,-3.5),b=Math.min(o.b,3.5),y=12+i*22,c=o.s>0?C.org:C.blue;
    s+=`<path d="M${X(a)},${y+8}v-6H${X(b)}v6" fill="none" stroke="${c}" stroke-width="1.5"/>`+txt((X(a)+X(b))/2,y-2+12-14,`${o.s>0?'+':'−'} ${o.h?'0,5':'table('+f2(o.z)+') = '+f4(o.v)}`,{a:'middle',fs:11,w:700,c,halo:1})});
  /* axes */
  [ax,az].forEach(y=>s+=`<line x1="${pl}" x2="${W-pr}" y1="${y}" y2="${y}" stroke="${C.ink}"/>`);
  s+=txt(4,ax+18,'x',{fs:13,w:700,it:1})+txt(4,az+18,'z',{fs:13,w:700,it:1,c:C.blue});
  const mk=S.xs.map(([x,z])=>X(z));
  for(let k=-3;k<=3;k++){const xx=X(k),hide=mk.some(v=>Math.abs(v-xx)<(m?30:36));s+=`<line x1="${xx}" x2="${xx}" y1="${ax}" y2="${ax+5}" stroke="${C.mute}"/><line x1="${xx}" x2="${xx}" y1="${az}" y2="${az+5}" stroke="${C.mute}"/>`;
    if(!hide)s+=txt(xx,ax+18,MU+k*SG,{a:'middle',fs:11,c:C.mute})+txt(xx,az+18,k,{a:'middle',fs:11,c:C.mute})}
  S.xs.forEach(([x,z])=>{const xx=X(z);s+=`<line x1="${xx}" x2="${xx}" y1="${Y(npdf(z))}" y2="${az}" stroke="${C.org}" stroke-width="2" stroke-dasharray="4 3"/>`;
    s+=S.inv?`<path d="M${xx},${ax+23}l-5,8h10z" fill="${C.org}"/>`:`<path d="M${xx},${az-3}l-5,-8h10z" fill="${C.org}"/>`;
    s+=txt(xx,ax+18,fx(x,1).replace(/,0$/,''),{a:'middle',fs:12,w:700,c:C.org,halo:1})+txt(xx,az+18,S.inv&&S.r.k==='mil'?fx(z,3):f2(z),{a:'middle',fs:12,w:700,c:C.org,halo:1})});
  s+=txt(W-pr,az+40,`z = (x − μ) ÷ σ = (x − 100) ÷ 15`,{a:'end',fs:12,c:C.mute});
  return s});
function upd(){const S=dstate(),a=+$('da').value,b=+$('db').value;$('oda').textContent=a;$('odb').textContent=b;$('odp').textContent=$('dp').value+' %';
  $('sa').hidden=S.inv;$('sb').hidden=dq!=='ab';$('sp').hidden=!S.inv;const d=decomp(S.L,S.U),T=$('t42d');
  const zl=(x,z)=>`z = (${x} − 100) ÷ 15 = ${f2(z)}`;
  if(dq==='le')T.innerHTML=`${zl(a,S.U)} &nbsp;→&nbsp; P(X ≤ ${a}) = P(Z ≤ ${f2(S.U)}) = ${decTxt(d)}`;
  else if(dq==='ge')T.innerHTML=`${zl(a,S.L)} &nbsp;→&nbsp; P(X ≥ ${a}) = P(Z ≥ ${f2(S.L)}) = ${decTxt(d)}`;
  else if(dq==='ab'){const [l,h]=S.xs;T.innerHTML=`${zl(l[0],l[1])} et ${zl(h[0],h[1])}<br>P(${l[0]} ≤ X ≤ ${h[0]}) = P(${f2(l[1])} ≤ Z ≤ ${f2(h[1])}) = ${decTxt(d)}`}
  else{const r=S.r,z=S.xs[0][1],x=S.xs[0][0],zs=r.k==='mil'?fx(z,3):f2(z);T.innerHTML=`Aire à chercher dans la table : 0,5 − ${fx(S.p,2)} = ${f4(.5-S.p)}. ${invTxt(r)}${dq==='lo'?', côté gauche : z = −'+(r.k==='mil'?fx(r.z,3):f2(r.z)):''}.<br>x = μ + zσ = 100 + (${zs}) × 15 = <b>${fr(x,2)}</b>`}
  T.innerHTML=T.innerHTML.replace(/ = ([0-9,]+)$/,' = <b>$1</b>');
  $('c42d').innerHTML=`<span class="fn">Figure 4.2-d</span>${S.inv?'Ici, on lit le double axe de bas en haut : la probabilité donne une cote z dans la table, puis la cote z redevient un QI.':'On lit le double axe de haut en bas : chaque valeur de x se convertit en cote z juste en dessous; la question sur X devient une question sur Z, celle de la table.'} Au-dessus de la cloche, les morceaux qu'on additionne ou soustrait : la table part toujours du centre, et chaque moitié vaut 0,5.`;fd()}
seg('dq',d=>{dq=d.q;upd()});['da','db','dp'].forEach(id=>$(id).oninput=upd);upd();

/* e : approximation de la binomiale */
let eq='ge',ec=1;
const comb=(n,k)=>{let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return r};
const pmf=(n,p,k)=>k<0||k>n?0:comb(n,k)*p**k*(1-p)**(n-k);
function est(){const n=+$('en').value,p=+$('ep').value/100,k=+$('ek').value,mm=+$('em').value,mu=n*p,sd=Math.sqrt(n*p*(1-p));
  let lo=0,hi=n,nL=-Infinity,nU=Infinity;      /* valeurs incluses lo..hi; bornes « sans manteau » nL..nU */
  if(eq==='ge'){lo=k;nL=k}else if(eq==='gt'){lo=k+1;nL=k}else if(eq==='le'){hi=k;nU=k}else if(eq==='lt'){hi=k-1;nU=k}else if(eq==='eq'){lo=hi=k;nL=nU=k}
  else if(eq==='ii'){lo=k;hi=mm;nL=k;nU=mm}else{lo=k+1;hi=mm-1;nL=k;nU=mm}
  let ex=0;for(let x=Math.max(0,lo);x<=Math.min(n,hi);x++)ex+=pmf(n,p,x);
  const cL=eq==='le'||eq==='lt'?-Infinity:lo-.5,cU=eq==='ge'||eq==='gt'?Infinity:hi+.5;
  const Z=v=>v===Infinity||v===-Infinity?v:r2((v-mu)/sd);
  const d0=nL>nU?{t:[],v:0}:decomp(Z(nL),Z(nU)),d1=hi<lo?{t:[],v:0}:decomp(Z(cL),Z(cU));
  return {n,p,k,mm,mu,sd,lo,hi,nL,nU,cL,cU,ex,d0,d1,Z}}
const ff=fig('f42e',(W,H,m)=>{const S=est(),{n,p,mu,sd}=S;const a=Math.max(-.5,Math.floor(mu-4.2*sd)-.5),b=Math.min(n+.5,Math.ceil(mu+4.2*sd)+.5);
  const pl=40,pr=10,pt=26,pb=96,P=[];for(let x=Math.ceil(a);x<=b;x++)P.push([x,pmf(n,p,x)]);const ym=Math.max(...P.map(q=>q[1]),npdf(0)/sd)*1.15;
  const X=v=>pl+(v-a)/(b-a)*(W-pl-pr),Y=v=>pt+(1-v/ym)*(H-pt-pb),g=x=>npdf((x-mu)/sd)/sd;let s='';
  const L=ec?S.cL:S.nL,U=ec?S.cU:S.nU,inc=x=>x>=S.lo&&x<=S.hi;
  P.forEach(([x,v])=>s+=`<rect x="${X(x-.5)}" y="${Y(v)}" width="${X(x+.5)-X(x-.5)}" height="${Y(0)-Y(v)}" fill="${C.ink}" opacity="${inc(x)?.85:.18}" stroke="var(--bg)" stroke-width="1"/>`);
  if(U>L){const l=Math.max(L,a),u=Math.min(U,b);if(u>l)s+=`<path d="${area(g,X,Y,l,u)}" fill="${C.org}" opacity=".55"/>`}
  else if(U===L&&L>=a&&L<=b)s+=`<line x1="${X(L)}" x2="${X(L)}" y1="${Y(0)}" y2="${Y(g(L))}" stroke="${C.org}" stroke-width="3"/>`;
  s+=`<path d="${path(g,X,Y,a,b,300)}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`;
  s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(0)}" y2="${Y(0)}" stroke="${C.ink}"/>`;
  const every=Math.max(1,Math.ceil((b-a)/(m?12:22)));
  const near=x=>every>1&&S.hi>=S.lo&&x!==S.lo&&x!==S.hi&&(Math.abs(x-S.lo)<every/1.5||Math.abs(x-S.hi)<every/1.5);P.forEach(([x])=>{if((x%every===0&&!near(x))||((x===S.lo||x===S.hi)&&S.hi>=S.lo))s+=txt(X(x),Y(0)+16,x,{a:'middle',fs:11,w:inc(x)?700:400,c:inc(x)?C.org:C.mute})});
  /* la flèche et les manteaux, sous l'axe */
  const ya=Y(0)+38;const bnd=[];if(L>-Infinity)bnd.push(L);if(U<Infinity&&U!==L)bnd.push(U);
  const l=Math.max(L,a),u=Math.min(U,b);
  if(u>l){s+=`<line x1="${X(l)}" x2="${X(u)}" y1="${ya}" y2="${ya}" stroke="${C.org}" stroke-width="2.5"/>`;if(U>=b)s+=`<path d="M${X(u)},${ya}l-9,-5v10z" fill="${C.org}"/>`;if(L<=a)s+=`<path d="M${X(l)},${ya}l9,-5v10z" fill="${C.org}"/>`}
  bnd.forEach(v=>{if(v<a||v>b)return;s+=`<line x1="${X(v)}" x2="${X(v)}" y1="${Y(0)}" y2="${ya+6}" stroke="${C.org}" stroke-width="2"/>`+txt(X(v),ya+22,fr(v),{a:'middle',fs:12,w:700,c:C.org,halo:1})});
  if(ec){[[S.lo,S.cL],[S.hi,S.cU]].forEach(([v,c])=>{if(!isFinite(c)||v<a||v>b||S.hi<S.lo)return;const y=ya+34;s+=`<path d="M${X(v-.5)},${y-6}v6H${X(v+.5)}v-6" fill="none" stroke="${C.org}" stroke-width="1.5"/>`});
    if(S.hi>=S.lo&&!m){const v=isFinite(S.cL)?S.lo:S.hi;if(v>=a&&v<=b)s+=txt(X(v)+(isFinite(S.cL)?-14:14),ya+50,`terrain de ${v} : de ${fr(v-.5)} à ${fr(v+.5)}`,{a:isFinite(S.cL)?'end':'start',fs:11,c:C.org,halo:1})}}
  else if(S.nL===S.nU){{const r=X(S.nL)>W/2;s+=txt(X(S.nL)+(r?-8:8),Y(g(S.nL))-8,m?'une ligne : aire nulle':'sans terrain : une simple ligne, aire nulle',{a:r?'end':'start',fs:12,w:700,c:C.org,halo:1})}}
  else{const v=isFinite(S.nL)?S.nL:S.nU;if(v>=a&&v<=b&&S.lo<=S.hi&&(v===S.lo||v===S.hi)){const r=X(v)>W/2;s+=txt(X(v)+(r?-8:8),Y(pmf(n,p,v))-10,`${v} ne compte qu'à moitié`,{a:r?'end':'start',fs:12,w:700,c:C.org,halo:1})}
    else if(v>=a&&v<=b&&!(v===S.lo||v===S.hi)){const r=X(v)>W/2;s+=txt(X(v)+(r?-8:8),Y(pmf(n,p,v))-10,`la moitié de ${v} est comptée en trop`,{a:r?'end':'start',fs:12,w:700,c:C.org,halo:1})}}
  s+=txt(W-pr,pt-10,`μ = np = ${fx(mu,1)} · σ = ${fx(sd,2)}`,{a:'end',fs:12,w:700,c:C.blue,halo:1});
  return s});
function upe(){const n=+$('en').value;['ek','em'].forEach(id=>{$(id).max=n;if(+$(id).value>n)$(id).value=n});
  const S=est();$('oen').textContent=n;$('oep').textContent=fx(S.p,2);$('oek').textContent=S.k;$('oem').textContent=S.mm;$('sem').hidden=!(eq==='ii'||eq==='ee');
  const q={ge:`X ≥ ${S.k}`,gt:`X > ${S.k}`,le:`X ≤ ${S.k}`,lt:`X < ${S.k}`,eq:`X = ${S.k}`,ii:`${S.k} ≤ X ≤ ${S.mm}`,ee:`${S.k} < X < ${S.mm}`}[eq];
  const bad=S.hi<S.lo;
  const zs=(L,U)=>L===-Infinity?`Z ≤ ${f2(S.Z(U))}`:U===Infinity?`Z ≥ ${f2(S.Z(L))}`:L===U?`Z = ${f2(S.Z(L))}`:`${f2(S.Z(L))} ≤ Z ≤ ${f2(S.Z(U))}`;
  const xs=(L,U)=>L===-Infinity?`X ≤ ${fr(U)}`:U===Infinity?`X ≥ ${fr(L)}`:L===U?`X = ${fr(L)}`:`${fr(L)} ≤ X ≤ ${fr(U)}`;
  const e0=Math.abs(S.d0.v-S.ex),e1=Math.abs(S.d1.v-S.ex);
  $('e3').innerHTML=bad?'<p class="calc">Aucune valeur entière ne respecte cette condition.</p>':`<div><span class="lab">Binomiale exacte</span><b>${f4(S.ex)}</b></div><div class="${ec?'':'on'}"><span class="lab">Normale sans terrain</span><b>${f4(S.d0.v)}</b><small>P(${xs(S.nL,S.nU)}) = P(${zs(S.nL,S.nU)})<br>écart : ${f4(e0)}</small></div><div class="${ec?'on':''}"><span class="lab">Normale avec terrain</span><b>${f4(S.d1.v)}</b><small>P(${xs(S.cL,S.cU)}) = P(${zs(S.cL,S.cU)})<br>écart : ${f4(e1)}</small></div>`;
  const c1=S.n*S.p,c2=S.n*(1-S.p),ok=c1>=5&&c2>=5;
  $('c42e').innerHTML=`<span class="fn">Figure 4.2-e</span>P(${q}). Chaque barre a une largeur de 1 : son aire est sa probabilité. ${ec?`Chaque valeur incluse apporte son terrain entier, de −0,5 à +0,5 : elle retrouve tout son poids sous la cloche.`:`Sans terrain, on coupe en plein milieu du terrain des bornes${eq==='eq'?' et, pour une seule valeur, il ne reste qu\'une ligne sans aire':''}.`} Conditions : np = ${fx(c1,1)} et n(1 − p) = ${fx(c2,1)} ${ok?'sont tous deux ≥ 5.':'— <b>une condition n\'est pas respectée</b> : l\'approximation devient douteuse.'}`;ff()}
seg('eq',d=>{eq=d.q;if((eq==='ii'||eq==='ee')&&+$('em').value<=+$('ek').value)$('em').value=Math.min(+$('en').value,+$('ek').value+3);upe()});seg('ec',d=>{ec=+d.c;upe()});
['en','ep','ek','em'].forEach(id=>$(id).oninput=upe);upe();
}
