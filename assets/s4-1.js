{
const {fr,fx,$,C,txt,fig,path,area}=SITE;
const INT=(a,b)=>`<span class="nk">∫<span class="sc"><sup>${b}</sup><sub>${a}</sub></span></span>`;
/* densité triangulaire : attente à la cafétéria, 0 à 6 min, mode 2 */
const ft=x=>x<0||x>6?0:x<=2?x/6:(6-x)/12;
const Ft=x=>x<=0?0:x<=2?x*x/12:x<=6?1/3+((6*x-x*x/2)-10)/12:1;
const MU=8/3,VAR=14/9,SD=Math.sqrt(VAR);
const tirage=()=>{const u=Math.random();return u<1/3?Math.sqrt(u*12):6-Math.sqrt((1-u)*24)};
const DATA=Array.from({length:100000},tirage);
const seg=(id,cb)=>{$(id).onclick=e=>{const b=e.target.closest('button');if(!b)return;$(id).querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));cb(b.dataset)}};
const axes=(s,W,H,pl,pr,X,Y,lo,hi,step,yt,unit)=>{
  for(let v=lo;v<=hi+1e-9;v+=step)s+=`<line x1="${X(v)}" x2="${X(v)}" y1="${Y(0)}" y2="${Y(0)+5}" stroke="${C.mute}"/>`+txt(X(v),Y(0)+20,fr(v),{a:'middle',fs:12,c:C.mute});
  yt.forEach(t=>s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(t)}" y2="${Y(t)}" stroke="${C.line}"/>`+txt(pl-6,Y(t)+4,fx(t,2),{a:'end',fs:11,c:C.mute}));
  s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(0)}" y2="${Y(0)}" stroke="${C.ink}"/>`+(W>560?txt(W-pr,Y(0)+36,unit,{a:'end',fs:12,c:C.mute}):'');return s};

/* a : histogramme → densité */
let aw=1,an=100;
const fa=fig('f41a',(W,H,m)=>{const pl=44,pr=12,pt=16,pb=44,d=DATA.slice(0,an),k=Math.round(6/aw),cnt=Array(k).fill(0);
  d.forEach(x=>cnt[Math.min(k-1,Math.floor(x/aw))]++);const h=cnt.map(c=>c/(an*aw)),ym=Math.max(.45,Math.max(...h)*1.08);
  const X=v=>pl+v/6*(W-pl-pr),Y=v=>pt+(1-v/ym)*(H-pt-pb);let s=axes('',W,H,pl,pr,X,Y,0,6,1,[0,.1,.2,.3,.4].filter(t=>t<ym),'minutes');
  const hl=Math.min(k-1,Math.floor(3/aw));
  h.forEach((v,i)=>s+=`<rect x="${X(i*aw)+.5}" y="${Y(v)}" width="${Math.max(.5,X(aw)-X(0)-1)}" height="${Y(0)-Y(v)}" fill="${i===hl?C.org:C.ink}" opacity="${i===hl?.95:.75}"/>`);
  s+=`<path d="${path(ft,X,Y,0,6,240)}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`;
  const xh=X((hl+.5)*aw),yh=Y(h[hl]);
  s+=txt(m?xh+8:xh+16,Math.max(pt+14,yh-34),`aire = ${fr(aw)} × ${fx(h[hl],3)} ≈ ${fx(cnt[hl]/an,3)}`,{fs:12,w:700,c:C.org,halo:1})+txt(m?xh+8:xh+16,Math.max(pt+30,yh-18),`la proportion des attentes entre ${fr(hl*aw)} et ${fr((hl+1)*aw)} min`,{fs:12,c:C.org,halo:1});
  s+=txt(X(.25),pt+8,'densité f(x)',{fs:12,w:700,c:C.blue,halo:1});
  return s});
function upa(){$('c41a').innerHTML=`<span class="fn">Figure 4.1-a</span>${fr(an)} attentes, classes de ${fr(aw)} min. La hauteur de chaque barre est choisie pour que son <b>aire</b> soit la proportion des attentes de la classe : l'aire totale des barres vaut donc 1. Avec beaucoup de données et des classes très étroites, les barres épousent la courbe : la probabilité devient l'aire sous la densité.`;fa()}
seg('aw',d=>{aw=+d.w;upa()});seg('an',d=>{an=+d.n;upa()});upa();

/* b : aire par formes */
let bf='tri';
const D={tri:{f:ft,hi:6,top:1/3,yt:[0,.1,.2,.3],unit:'minutes d\'attente'},rec:{f:x=>x<0||x>10?0:.1,hi:10,top:.1,yt:[0,.05,.1],unit:'minutes de retard'}};
const pieces=(a,b)=>{if(bf==='rec')return [[a,b]];const p=[];if(a<2)p.push([a,Math.min(b,2)]);if(b>2)p.push([Math.max(a,2),b]);return p.filter(([u,v])=>v>u)};
const fb=fig('f41b',(W,H,m)=>{const Dd=D[bf],a=+$('ba').value,b=+$('bb').value,pl=46,pr=14,pt=30,pb=50,ym=Dd.top*1.22;
  const X=v=>pl+v/Dd.hi*(W-pl-pr),Y=v=>pt+(1-v/ym)*(H-pt-pb);let s=axes('',W,H,pl,pr,X,Y,0,Dd.hi,1,Dd.yt,Dd.unit);
  s+=`<path d="${area(Dd.f,X,Y,0,Dd.hi)}" fill="var(--bluesoft)" opacity=".6"/>`;
  if(b>a){pieces(a,b).forEach(([u,v])=>{s+=`<path d="${area(Dd.f,X,Y,u,v)}" fill="${C.org}" opacity=".85" stroke="var(--bg)" stroke-width="2"/>`;
      const hu=Dd.f(u),hv=Dd.f(v),A=(hu+hv)/2*(v-u),cx=(X(u)+X(v))/2,cy=Y(Math.min(hu,hv)/2)+4;
      if(X(v)-X(u)>34)s+=txt(cx,cy,fx(A,4),{a:'middle',fs:m?11:13,w:700,c:'#fff'})});
    [[a,'a'],[b,'b']].forEach(([v,l])=>{const h=Dd.f(v);s+=`<line x1="${X(v)}" x2="${X(v)}" y1="${Y(0)}" y2="${Y(Math.max(h,0))}" stroke="${C.org}" stroke-width="2"/>`+txt(X(v),Y(0)+36,`${l} = ${fr(v)}`,{a:'middle',fs:12,w:700,c:C.org});
      if(h>0)s+=txt(X(v)+(l==='a'?-6:6),Y(h)-8,`f(${fr(v)}) = ${fx(h,4)}`,{a:l==='a'?'end':'start',fs:11,c:C.org,halo:1})})}
  s+=`<path d="${path(Dd.f,X,Y,-.001,Dd.hi+.001,400)}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`;
  const tot=bf==='tri'?'aire totale : 6 × 1/3 ÷ 2 = 1':'aire totale : 10 × 0,1 = 1';
  s+=txt(W-pr,pt-12,tot,{a:'end',fs:12,w:700,c:C.blue,halo:1});
  if(bf==='tri')s+=txt(X(2)+6,Y(1/3)-4,m?'hauteur 1/3':'hauteur 1/3 : pour que l\'aire totale fasse 1',{fs:11,c:C.blue,halo:1});
  else s+=txt(X(5),Y(.1)-8,'hauteur 0,1 : pour que l\'aire totale fasse 1',{a:'middle',fs:11,c:C.blue,halo:1});
  return s});
function upb(){const Dd=D[bf];$('ba').max=$('bb').max=Dd.hi;const a=+$('ba').value,b=+$('bb').value;$('oba').textContent=fr(a);$('obb').textContent=fr(b);
  const G=$('b41g'),I=$('b41i');
  if(b<=a){G.innerHTML=b===a?`a = b : l'intervalle n'a aucune largeur, donc aucune aire. <b>P = 0</b>`:'Choisissez a &lt; b.';I.innerHTML='';}
  else{const ps=pieces(a,b),tot=ps.reduce((t,[u,v])=>t+(Dd.f(u)+Dd.f(v))/2*(v-u),0);
    G.innerHTML=ps.map(([u,v])=>{const hu=Dd.f(u),hv=Dd.f(v),A=(hu+hv)/2*(v-u);
      if(bf==='rec')return `Rectangle : base × hauteur = ${fr(v-u)} × 0,1 = ${fx(A,4)}`;
      if(hu<1e-12||hv<1e-12)return `Triangle : ${fr(v-u)} × ${fx(Math.max(hu,hv),4)} ÷ 2 = ${fx(A,4)}`;
      return `Trapèze : (${fx(hu,4)} + ${fx(hv,4)}) × ${fr(v-u)} ÷ 2 = ${fx(A,4)}`}).join('<br>')+(ps.length>1?`<br><b>P(${fr(a)} ≤ X ≤ ${fr(b)}) = ${fx(tot,4)}</b>`:`<br><b>P(${fr(a)} ≤ X ≤ ${fr(b)}) = ${fx(tot,4)}</b>`);
    I.innerHTML=bf==='rec'?`${INT(fr(a),fr(b))} 0,1 dx = 0,1 × (${fr(b)} − ${fr(a)}) = <b>${fx(tot,4)}</b>`:ps.map(([u,v])=>v<=2?`${INT(fr(u),fr(v))} x/6 dx = (${fr(v)}² − ${fr(u)}²) ÷ 12 = ${fx((v*v-u*u)/12,4)}`:`${INT(fr(u),fr(v))} (6 − x)/12 dx = [(6 × ${fr(v)} − ${fr(v)}²/2) − (6 × ${fr(u)} − ${fr(u)}²/2)] ÷ 12 = ${fx(Ft(v)-Ft(u),4)}`).join('<br>')+`<br><b>Total : ${fx(tot,4)}</b>`}
  $('c41b').innerHTML=`<span class="fn">Figure 4.1-b</span>${bf==='tri'?'Attente à la cafétéria : la densité est un triangle de base 6 min. Sous un côté du triangle, l\'aire est un trapèze (ou un triangle si elle part de 0); si l\'intervalle chevauche le sommet, on le coupe en deux morceaux.':'Retard de l\'autobus, au hasard entre 0 et 10 min : la densité est un rectangle, et toute aire en est un aussi.'} Les deux méthodes donnent la même aire.`;fb()}
seg('bf',d=>{bf=d.f;if(bf==='rec'){$('ba').value=2;$('bb').value=5}else{$('ba').value=1;$('bb').value=4}upb()});
['ba','bb'].forEach(id=>$(id).oninput=upb);upb();

/* c : P(X = 3) = 0 */
let cw=2;const CW=[2,1,.5,.1,.01,0];
const fc=fig('f41c',(W,H,m)=>{const pl=46,pr=14,pt=24,pb=44,ym=.4,X=v=>pl+v/6*(W-pl-pr),Y=v=>pt+(1-v/ym)*(H-pt-pb);let s=axes('',W,H,pl,pr,X,Y,0,6,1,[0,.1,.2,.3],'minutes d\'attente');
  s+=`<path d="${area(ft,X,Y,0,6)}" fill="var(--bluesoft)" opacity=".6"/><path d="${path(ft,X,Y,0,6,240)}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`;
  const A=Ft(3+cw)-Ft(3);
  if(cw>0){const w=Math.max(2,X(3+cw)-X(3));s+=`<path d="M${X(3)},${Y(0)}L${X(3)},${Y(ft(3))}L${X(3)+w},${Y(ft(3+cw))}L${X(3)+w},${Y(0)}Z" fill="${C.org}"/>`}
  else s+=`<line x1="${X(3)}" x2="${X(3)}" y1="${Y(0)}" y2="${Y(ft(3))}" stroke="${C.org}" stroke-width="2.5"/>`;
  const lx=X(3+Math.max(cw,0))+12;
  s+=txt(lx,Y(.3),cw>0?`P(3 ≤ X ≤ ${fr(3+cw)}) ≈ ${fx(A,4)}`:'P(X = 3) = 0',{fs:14,w:700,c:C.org,halo:1});
  s+=txt(lx,Y(.3)+18,cw>0?`largeur ${fr(cw)} min`:'un segment n\'a pas de largeur, donc pas d\'aire',{fs:12,c:C.org,halo:1});
  return s});
$('f41c').closest('.fig').insertAdjacentHTML('afterend','<div class="scroll"><table class="qt" id="t41c"></table></div>');
function upc(){$('t41c').innerHTML=`<thead><tr><th>Intervalle</th><th>Largeur</th><th>Aire</th></tr></thead><tbody>`+CW.map(w=>`<tr${w===cw?' class="hl"':''}><td>${w?`3 ≤ X ≤ ${fr(3+w)}`:'X = 3'}</td><td>${fr(w)}</td><td>${w?fx(Ft(3+w)-Ft(3),4):'0'}</td></tr>`).join('')+'</tbody>';
  $('c41c').innerHTML=`<span class="fn">Figure 4.1-c</span>Plus l'intervalle se resserre autour de 3, plus l'aire fond. À la limite, il ne reste qu'un segment : <b>P(X = 3) = 0</b>, même si 3 minutes est une attente tout à fait possible. Conséquence : inclure ou non une borne ne change rien, P(X ≤ 3) = P(X &lt; 3).`;fc()}
seg('cw',d=>{cw=+d.w;upc()});upc();

/* d : équilibre */
const fd=fig('f41d',(W,H,m)=>{const c=+$('dc').value,pl=30,pr=30,pt=40,base=H-96,ym=.4,X=v=>pl+v/6*(W-pl-pr),Y=v=>base-v/ym*(base-pt);
  const ok=Math.abs(c-MU)<.04,dd=c<MU?X(6)+6-X(c):X(c)-X(0)+6,amax=Math.atan(26/dd)*180/Math.PI,ang=ok?0:Math.sign(MU-c)*Math.min(amax,Math.abs(MU-c)*6);let s='';
  if(ok)s+=`<rect x="${X(MU-SD)}" y="${pt-20}" width="${X(MU+SD)-X(MU-SD)}" height="${base-pt+20}" fill="var(--bluesoft)" opacity=".7"/>`+txt(X(MU+SD)-4,pt-6,'μ ± σ',{a:'end',fs:12,w:700,c:C.blue});
  s+=`<g transform="rotate(${ang} ${X(c)} ${base})"><path d="${area(ft,X,Y,0,6)}" fill="${C.ink}" opacity=".82"/><line x1="${X(0)-6}" x2="${X(6)+6}" y1="${base}" y2="${base}" stroke="${C.ink}" stroke-width="4"/>`;
  s+=`</g>`;for(let v=0;v<=6;v++)s+=txt(X(v),base+46,v,{a:'middle',fs:12,c:C.mute});
  if(ok)s+=`<line x1="${X(MU)}" x2="${X(MU)}" y1="${pt-20}" y2="${base}" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`;
  s+=`<path d="M${X(c)},${base+2}l-14,26h28z" fill="${C.org}"/>`+`<line x1="${pl}" x2="${W-pr}" y1="${base+28}" y2="${base+28}" stroke="${C.line}" stroke-width="2"/>`;
  s+=txt(W/2,base+68,ok?`équilibre : E(X) = 8/3 ≈ ${fx(MU,2)} min`:c<MU?'trop à gauche : la planche penche à droite':'trop à droite : la planche penche à gauche',{a:'middle',fs:13,w:700,c:ok?C.blue:C.org});
  return s});
function upd(){const c=+$('dc').value;$('odc').textContent=fx(c,2)+' min';
  $('c41d').innerHTML=`<span class="fn">Figure 4.1-d</span>L'espérance est le point d'équilibre de la densité, comme pour une distribution discrète; la somme Σ x · P(X = x) devient l'intégrale ∫ x · f(x) dx. Ici, E(X) = 8/3 ≈ ${fx(MU,2)} min : plus loin que le sommet (2 min), car la longue pente de droite pèse. Pour un triangle, c'est la moyenne des trois sommets : (0 + 2 + 6) ÷ 3. Variance : σ² = 14/9 ≈ ${fx(VAR,2)}, écart type σ ≈ ${fx(SD,2)} min.`;fd()}
$('dc').oninput=upd;upd();
}
