{
const {fr,fx,$,C,txt,fig,gauss}=SITE;

/* Figure a : population, échantillon, statistique */
const NP=400,PI=.42,NS=40;
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
const POP=[];for(let i=0;i<NP;i++)POP.push({x:(i%25+.5+(rnd()-.5)*.5)/25,y:(Math.floor(i/25)+.5+(rnd()-.5)*.5)/16,t:false});
{const idx=[...POP.keys()].sort(()=>rnd()-.5).slice(0,Math.round(NP*PI));idx.forEach(i=>POP[i].t=true)}
let S=new Set(),hist=[];
function tirer(){const a=[...POP.keys()];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}S=new Set(a.slice(0,NS));hist.push([...S].filter(i=>POP[i].t).length/NS)}
const fa=fig('f51a',(W,H,m)=>{const pt=34,pbL=26,X=v=>8+v*(W-16),Y=v=>pt+v*(H-pt-pbL-8);let s='';
  const ly=H-8,lg=(x,f,big,l)=>`<circle cx="${x}" cy="${ly-4}" r="${big?5.5:3}" fill="${f?(big?C.ink:C.mute):'var(--bg)'}" stroke="${big?C.ink:C.mute}" stroke-width="${big?2:1}"/>`+txt(x+9,ly,l,{fs:12,c:C.mute});
  s+=lg(10,1,0,m?'appuie':'appuie')+lg(m?70:76,0,0,m?'non':'n\'appuie pas')+lg(m?120:180,1,1,m?'interrogé, appuie':'interrogé, appuie')+lg(m?240:320,0,1,m?'interrogé, non':'interrogé, n\'appuie pas');
  s+=txt(8,14,'Population : π = 42 %',{c:C.blue,w:700,fs:14})+txt(8,30,'paramètre, fixe',{c:C.mute,fs:12});
  POP.forEach((p,i)=>{if(S.has(i))return;const r=m?2.4:3;
    s+=`<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="${r}" fill="${p.t?C.mute:'var(--bg)'}" stroke="${C.mute}" stroke-width="1" opacity=".55"/>`});
  POP.forEach((p,i)=>{if(!S.has(i))return;const r=m?4.6:5.8;
    s+=`<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="${r}" fill="${p.t?C.ink:'var(--bg)'}" stroke="${C.ink}" stroke-width="2.2"/>`});
  return s});
const fa2=fig('f51a2',(W,H,m)=>{const pl=40,pr=12,pt=34,pb=30,X=v=>pl+v/.8*(W-pl-pr),cur=hist[hist.length-1];let s='';
  s+=txt(pl,14,`Cet échantillon : p = ${fr(cur*100,1)} %`,{w:700,fs:14})+txt(pl,30,'statistique, change à chaque tirage',{c:C.mute,fs:12});
  [0,.2,.4,.6,.8].forEach(t=>s+=txt(X(t),H-8,fr(t*100,0)+' %',{a:'middle',fs:12,c:C.mute}));
  s+=`<line x1="${pl}" x2="${W-pr}" y1="${H-pb}" y2="${H-pb}" stroke="${C.ink}"/>`;
  const cnt={};hist.forEach(v=>{const k=Math.round(v*NS);cnt[k]=(cnt[k]||0)+1});const mx=Math.max(...Object.values(cnt)),avail=H-pb-pt-30,dy=Math.min(9,avail/mx),rr=Math.max(1.6,Math.min(4,dy*.45));
  const col={};hist.forEach((v,i)=>{const k=Math.round(v*NS);col[k]=(col[k]||0)+1;const last=i===hist.length-1;
    s+=`<circle cx="${X(v)}" cy="${H-pb-rr-2-(col[k]-1)*dy}" r="${last?Math.max(rr,3.5):rr}" fill="${last?C.org:C.ink}"/>`});
  s+=`<line x1="${X(PI)}" x2="${X(PI)}" y1="${pt+4}" y2="${H-pb}" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`+txt(X(PI)+6,pt+16,'π',{c:C.blue,w:700,fs:15});
  return s});
function capA(){$('c51a').innerHTML=`<span class="fn">Figure 5.1-a</span>Plein : appuie le candidat; vide : n'appuie pas. Les gros points foncés forment l'échantillon. À droite, chaque point est la proportion p d'un échantillon (en orange, le dernier) : ${hist.length} échantillon${hist.length>1?'s':''}, et π n'a jamais bougé.`}
$('b51a').onclick=()=>{tirer();fa();fa2();capA()};
$('b51a2').onclick=()=>{for(let i=0;i<50;i++)tirer();fa();fa2();capA()};
$('b51a3').onclick=()=>{hist=[];tirer();fa();fa2();capA()};
tirer();fa();fa2();capA();

/* Figure b : anatomie d'un sondage */
const p0=.22,n0=2500,me0=1.96*Math.sqrt(p0*(1-p0)/n0);
$('anat').innerHTML=`<p class="phr">Sur <span class="tg" data-n="1">2 500 Canadiens</span> sondés, <span class="tg o" data-n="2">22 %</span> prévoient dépenser plus pour les Fêtes. Marge d'erreur : <span class="tg r" data-n="3">± ${fx(me0*100,1)} %</span>, <span class="tg b" data-n="4">19 fois sur 20</span>.</p>
<ol class="leg"><li><b>Échantillon</b> : n = 2 500</li><li><b>Estimation ponctuelle</b> : p = 22 % (une statistique)</li><li><b>Marge d'erreur</b> : 1,96 √(p(1 − p)/n)</li><li><b>Niveau de confiance</b> : 19/20 = 95 %, la fiabilité de la méthode sur des sondages répétés</li></ol><p class="calc" style="font-size:14px">Marge calculée ici pour l'illustration, comme pour un échantillon aléatoire simple. Le sondage a été fait en ligne, auprès d'un panel : ce n'est pas un échantillon aléatoire simple, et la formule ne décrit pas exactement sa précision.</p>`;
fig('f51b',(W,H,m)=>{const pl=16,pr=16,lo=.18,hi=.26,X=v=>pl+(v-lo)/(hi-lo)*(W-pl-pr),y=84;let s='';
  [.18,.2,.22,.24,.26].forEach(t=>s+=txt(X(t),H-6,fr(t*100,0)+' %',{a:'middle',fs:12,c:C.mute}));
  s+=`<line x1="${pl}" x2="${W-pr}" y1="${H-24}" y2="${H-24}" stroke="${C.line}"/>`;
  s+=`<line x1="${X(p0-me0)}" x2="${X(p0+me0)}" y1="${y}" y2="${y}" stroke="${C.org}" stroke-width="14"/><circle cx="${X(p0)}" cy="${y}" r="8" fill="${C.ink}"/>`;
  s+=txt(X(p0-me0)-6,y+5,fx((p0-me0)*100,1)+' %',{a:'end',fs:13,w:700})+txt(X(p0+me0)+6,y+5,fx((p0+me0)*100,1)+' %',{fs:13,w:700});
  s+=txt(X(p0),y+30,m?'p = 22 % : le centre':'p = 22 % : l\'estimation ponctuelle, au centre',{a:'middle',fs:13,w:700});
  s+=txt(X(p0),y+48,m?'intervalle de confiance à 95 %':'l\'intervalle : l\'estimation par intervalle à 95 %',{a:'middle',fs:13,c:C.org,it:1});
  const yb=y-36;s+=txt(X(p0),yb-14,m?'π : fixe, mais inconnu':'π, la vraie proportion : fixe, mais inconnue',{a:'middle',fs:13,c:C.blue,w:600});
  s+=txt(X(p0),yb+4,m?'dedans ou non? on ne le sait pas':'dans cet intervalle-ci? impossible à savoir',{a:'middle',fs:12,c:C.blue,it:1});
  return s});

/* Figure c : Literary Digest */
const PR=.625,PB=.43,NN=[10,30,100,300,1000,3000,10000,50000,300000,2400000];let RA=[],BI=[];
const sim=()=>{const f=(p,n)=>Math.min(.99,Math.max(.01,p+Math.sqrt(p*(1-p)/n)*gauss()));RA=NN.map(n=>f(PR,n));BI=NN.map(n=>f(PB,n))};
const fc=fig('f51c',(W,H,m)=>{const pl=44,pr=m?16:150,pt=24,pb=40,lx=Math.log10,X=n=>pl+(lx(n)-1)/(lx(2400000)-1)*(W-pl-pr),Y=v=>pt+(1-(v-.2)/(.85-.2))*(H-pt-pb);let s='';
  [.3,.4,.5,.6,.7,.8].forEach(t=>s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(t)}" y2="${Y(t)}" stroke="${C.line}"/>`+txt(pl-6,Y(t)+4,fr(t*100,0)+' %',{a:'end',fs:12,c:C.mute}));
  [[10,'10'],[100,'100'],[1000,'1 000'],[10000,'10 000'],[100000,'100 000'],[2400000,'2,4 M']].forEach(([n,l])=>s+=txt(X(n),H-pb+18,l,{a:'middle',fs:12,c:C.mute}));
  s+=txt(W-pr,H-4,'taille de l\'échantillon (échelle logarithmique)',{a:'end',fs:12,c:C.mute});
  s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(PR)}" y2="${Y(PR)}" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`+txt(X(1000),Y(.74),'vrai résultat : 62,5 % pour Roosevelt',{c:C.blue,w:700,halo:1,a:'middle'});
  s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(.5)}" y2="${Y(.5)}" stroke="${C.mute}" stroke-dasharray="2 3"/>`;
  const line=(A,c)=>{let d='';A.forEach((v,i)=>d+=(d?'L':'M')+X(NN[i])+','+Y(v));return `<path d="${d}" fill="none" stroke="${c}" stroke-width="2" opacity=".6"/>`+A.map((v,i)=>`<circle cx="${X(NN[i])}" cy="${Y(v)}" r="5" fill="${c}"/>`).join('')};
  s+=line(RA,C.ink)+line(BI,C.org);
  const lx2=X(2400000);
  if(!m){s+=txt(lx2+12,Y(RA[RA.length-1])+4,'liste aléatoire',{w:700,fs:13})+txt(lx2+12,Y(BI[BI.length-1])+4,'liste biaisée',{w:700,fs:13,c:C.org})+txt(lx2+12,Y(BI[BI.length-1])+20,'Digest : 43 %',{fs:12,c:C.org,it:1});
    s+=`<circle cx="${X(50000)}" cy="${Y(.557)}" r="7" fill="none" stroke="${C.ink}" stroke-width="2"/>`+txt(X(50000)+10,Y(.557)+16,'Gallup (quotas) : 55,7 %',{fs:12,it:1,halo:1})}
  return s});
$('b51c').onclick=()=>{sim();fc()};sim();fc();

/* Figure d : agrégation */
const SD=[{n:'Sondeur 1',v:36,t:600,a:9,f:25,rc:15},{n:'Sondeur 2',v:45,t:1500,a:3,f:25,rc:35},{n:'Sondeur 3',v:47,t:1200,a:1,f:50,rc:50}];
let on={t:true,r:true,f:true},mode='cours',hl=4;
function poids(){const T=SD.reduce((a,s)=>a+s.t,0);let rec;
  if(mode==='cours')rec=SD.map(s=>s.rc);else{const w=SD.map(s=>.5**(s.a/hl)),sw=w.reduce((a,b)=>a+b,0);rec=w.map(x=>x/sw*100)}
  return SD.map((s,i)=>{const c={t:s.t/T*100,r:rec[i],f:s.f},act=Object.keys(on).filter(k=>on[k]);const fin=act.length?act.reduce((a,k)=>a+c[k],0)/act.length:100/3;return {...c,fin}})}
const fd=fig('f51d',(W,H,m)=>{const P=poids(),agg=SD.reduce((a,s,i)=>a+P[i].fin/100*s.v,0),mean=SD.reduce((a,s)=>a+s.v,0)/3;
  const pl=m?84:170,pr=16,pt=14,pb=30,lo=30,hi=54,X=v=>pl+(v-lo)/(hi-lo)*(W-pl-pr),rh=(H-pt-pb)/4;let s='';
  [30,34,38,42,46,50,54].forEach(t=>s+=`<line x1="${X(t)}" x2="${X(t)}" y1="${pt}" y2="${H-pb}" stroke="${C.line}"/>`+txt(X(t),H-8,t+' %',{a:'middle',fs:12,c:C.mute}));
  SD.forEach((sd,i)=>{const y=pt+i*rh+rh/2,me=196*Math.sqrt(sd.v/100*(1-sd.v/100)/sd.t),r=4+P[i].fin/100*22;
    s+=txt(pl-12,y-2,sd.n,{a:'end',w:700,fs:14})+txt(pl-12,y+14,m?`n = ${fr(sd.t)}`:`n = ${fr(sd.t)} · il y a ${sd.a} j`,{a:'end',fs:12,c:C.mute});
    s+=`<line x1="${X(sd.v-me)}" x2="${X(sd.v+me)}" y1="${y}" y2="${y}" stroke="${C.org}" stroke-width="4" opacity=".7"/><circle cx="${X(sd.v)}" cy="${y}" r="${r}" fill="${C.ink}" opacity=".85"/>`;
    s+=txt(X(sd.v)+r+6,y-r-2,`${sd.v} %`,{fs:13,w:700,halo:1})});
  const y=pt+3*rh+rh/2;s+=`<line x1="${pl}" x2="${W-pr}" y1="${y-rh/2}" y2="${y-rh/2}" stroke="${C.ink}"/>`;
  s+=txt(pl-12,y+5,'Agrégat',{a:'end',w:700,fs:15});
  s+=`<path d="M${X(agg)},${y-11}l11,11l-11,11l-11,-11z" fill="${C.ink}"/>`+txt(X(agg)+16,y+5,fx(agg,1)+' %',{w:700,fs:16,halo:1});
  s+=`<line x1="${X(mean)}" x2="${X(mean)}" y1="${y-14}" y2="${y+14}" stroke="${C.mute}" stroke-width="2" stroke-dasharray="3 2"/>`;
  s+=txt(X(mean)-6,y+5,(m?'':'moyenne simple ')+fx(mean,1)+' %',{a:'end',fs:12,c:C.mute});
  $('c51d').innerHTML=`<span class="fn">Figure 5.1-d</span>La taille de chaque point montre son poids final; en orange, la marge d'erreur de chaque sondage. Prédiction : ${P.map((p,i)=>`${fx(p.fin/100,3)} × ${SD[i].v}`).join(' + ')} = <b>${fx(agg,1)} %</b>.`;
  const act=k=>on[k]?'':' class="off"',bar=(v,c)=>`<span class="mb"><i style="width:${v}%;background:${c}"></i></span>${fx(v,1)} %`;
  $('t51').innerHTML=`<thead><tr><th>Sondeur</th><th${act('t')}>Taille</th><th${act('r')}>Récence</th><th${act('f')}>Fiabilité</th><th>Poids final</th></tr></thead><tbody>`+P.map((p,i)=>`<tr><td>${SD[i].n}</td><td${act('t')}>${bar(p.t,C.mute)}</td><td${act('r')}>${bar(p.r,C.mute)}</td><td${act('f')}>${bar(p.f,C.mute)}</td><td><b>${bar(p.fin,C.ink)}</b></td></tr>`).join('')+'</tbody>';
  return s});
$('crit51').onclick=e=>{const c=e.target.dataset.c;if(!c)return;on[c]=!on[c];e.target.setAttribute('aria-pressed',on[c]);fd()};
$('rec51').onchange=e=>{mode=e.target.value;$('hl51').hidden=mode!=='expo';fd()};
const ho=()=>{hl=+$('sl51').value;$('o51').textContent=hl+' jour'+(hl>1?'s':'')};
$('sl51').oninput=()=>{ho();fd()};ho();
}
