{
const {fr,fx,$,C,txt,fig}=SITE;
const pct=(v,d=1)=>fx(v*100,d)+' %';

/* ================= a : le bassin rétrécit ================= */
let ga='0';
const fa=fig('f13a',(W,H,m)=>{let s='';const dot=(x,y,r,e)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${e?C.ink:'var(--bg)'}" stroke="${C.ink}" stroke-width="1.3"/>`;
  if(ga==='0'){const gw=(W-30)/2,cols=10,rows=15,cw=gw/cols,rh=(H-30)/rows,r=Math.min(cw,rh)*.36;
    [['V',60],['T',90]].forEach(([g,ne],b)=>{const x0=b*(gw+30);s+=txt(x0+gw/2,14,g==='V'?'en voiture (150)':'en transport (150)',{a:'middle',fs:13,w:700});
      for(let i=0;i<150;i++){const cx=x0+(i%cols+.5)*cw,cy=26+(Math.floor(i/cols)+.5)*rh;s+=dot(cx,cy,r,i<ne)}});}
  else{const ne=ga==='V'?60:90,cols=15,rows=10,cw=(W-16)/cols,rh=(H-40)/rows,r=Math.min(cw,rh)*.38;
    s+=`<rect x="2" y="24" width="${W-4}" height="${H-28}" rx="10" fill="var(--bluesoft)" stroke="${C.blue}" stroke-width="2" stroke-dasharray="7 5"/>`;
    s+=txt(8,16,`Nouvel univers : les 150 ${ga==='V'?'en voiture':'en transport en commun'}`,{fs:13,w:700,c:C.blue});
    for(let i=0;i<150;i++)s+=dot(8+(i%cols+.5)*cw,32+(Math.floor(i/cols)+.5)*rh,r,i<ne)}
  return s});
function upa(){document.querySelectorAll('#ga button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.g===ga));
  const [n,d,lab]=ga==='0'?[150,300,'P(E)']:ga==='V'?[60,150,'P(E | voiture)']:[90,150,'P(E | transport)'];
  $('fra').innerHTML=`<div class="fl2">${lab}</div><div class="fbig"><span class="num">${n}</span><span class="den">${d}</span></div><div class="fl2">= <b>${fx(n/d,2)}</b></div><p class="note">● plein : a un emploi (E) &nbsp; ○ vide : pas d'emploi</p>`;
  $('c13a').innerHTML=`<span class="fn">Figure 1.3-a</span>${ga==='0'?'Sans information, on compte les emplois parmi les 300 : 150/300. Choisissez une condition.':`On sait qu'il vient ${ga==='V'?'en voiture':'en transport en commun'} : les 150 autres disparaissent. Le dénominateur n'est plus 300, mais 150 : P(E | ${ga==='V'?'V':'V′'}) = P(E ∩ ${ga==='V'?'V':'V′'}) / P(${ga==='V'?'V':'V′'}) = (${n}/300) / (150/300) = ${n}/150.`}`;fa()}
$('ga').onclick=e=>{const g=e.target.dataset.g;if(g){ga=g;upa()}};upa();

/* ================= b : un rapport ================= */
let mid=0;
function miniVenn(num,denom){const p='mv'+(mid++);const A=[52,40,30],B=[88,40,24];
  return `<svg viewBox="0 0 140 80" class="mv" aria-hidden="true"><defs><clipPath id="${p}a"><circle cx="${A[0]}" cy="${A[1]}" r="${A[2]}"/></clipPath></defs>
  ${denom==='V'?`<circle cx="${A[0]}" cy="${A[1]}" r="${A[2]}" fill="var(--bluesoft)" stroke="var(--blue)" stroke-width="2.5" stroke-dasharray="5 3"/>`:''}
  ${denom==='A'?`<circle cx="${B[0]}" cy="${B[1]}" r="${B[2]}" fill="var(--bluesoft)" stroke="var(--blue)" stroke-width="2.5" stroke-dasharray="5 3"/>`:''}
  ${num?`<circle cx="${B[0]}" cy="${B[1]}" r="${B[2]}" fill="var(--ink)" clip-path="url(#${p}a)"/>`:''}
  <circle cx="${A[0]}" cy="${A[1]}" r="${A[2]}" fill="none" stroke="var(--ink)" stroke-width="1.5"/><circle cx="${B[0]}" cy="${B[1]}" r="${B[2]}" fill="none" stroke="var(--ink)" stroke-width="1.5"/>
  <text x="${A[0]-18}" y="${A[1]+5}" font-size="13" font-weight="700" fill="var(--ink)">V</text><text x="${B[0]+6}" y="${B[1]+5}" font-size="13" font-weight="700" fill="var(--ink)">A</text></svg>`}
$('rat').innerHTML=[['P(A | V)','V','0,15','0,20','Accident, sachant une contravention'],['P(V | A)','A','0,08','0,375','Contravention, sachant un accident']].map(([l,d,dv,r,t])=>`<div class="rrow"><div class="rl"><b>${l}</b><span>${t}</span></div><div class="rfr"><div>${miniVenn(true,null)}<span>0,03</span></div><div>${miniVenn(false,d)}<span>${dv}</span></div></div><div class="rres">= <b>${r}</b></div></div>`).join('');

/* ================= c : quel type ================= */
const Q=[['42 % des étudiant(e)s du cégep possèdent une voiture.','s',[],'Aucun sous-groupe : P(V).'],
 ['18 % des étudiant(e)s ont un emploi étudiant et font du sport.','i',['et'],'« et » : P(E ∩ S).'],
 ['Parmi les étudiant(e)s qui travaillent, 65 % prennent l\'autobus.','c',['Parmi','qui'],'Les travailleurs forment le nouvel univers : P(Bus | Travail).'],
 ['30 % des étudiant(e)s suivent au moins un cours à distance.','s',[],'Tous les étudiants, aucune restriction : P(D).'],
 ['Si un(e) étudiant(e) vit en résidence, il y a 80 % de chances qu\'il ou elle mange à la cafétéria.','c',['Si'],'« si… » : P(Cafétéria | Résidence).'],
 ['22 % des étudiant(e)s font du sport et prennent le transport en commun.','i',['et'],'« et » : P(S ∩ T).']];
const QL={s:'P(A)',i:'P(A ∩ B)',c:'P(B | A)'};const qa={};
function upc(){$('ql').innerHTML=Q.map(([t,a,cues,ex],i)=>{const ans=qa[i];let tt=t;if(ans)cues.forEach(c=>{tt=tt.replace(new RegExp(`(^|[^\\wÀ-ÿ])(${c})(?=[^\\wÀ-ÿ])`),'$1<mark>$2</mark>')});
  return `<div class="qi"><p>${i+1}. ${tt}</p><div class="seg" data-i="${i}">${['s','i','c'].map(k=>`<button data-k="${k}" class="${ans?(k===a?'ok':k===ans?'ko':''):''}">${QL[k]}</button>`).join('')}</div>${ans?`<p class="note">${ans===a?'<b>Exact.</b> ':'<b>Non.</b> '}${ex}</p>`:''}</div>`}).join('')}
$('ql').onclick=e=>{const b=e.target.closest('button');if(!b)return;qa[b.closest('.seg').dataset.i]=b.dataset.k;upc()};upc();

/* ================= d : arbre et carré ================= */
const LV=[['R₁','',.68,'Réussir dès la 1re tentative'],['R₁′ ∩ R₂','',.32*.55,'Échouer, puis réussir'],['R₁′ ∩ R₂′','',.32*.45,'Échouer deux fois']];let lsel=1;
const ft=fig('tree',(W,H,m)=>{const N={S:[20,H/2],R1:[W*.42,H*.2],R1p:[W*.42,H*.68],R2:[W*.84,H*.5],R2p:[W*.84,H*.88]};
  const on=k=>({0:['S-R1'],1:['S-R1p','R1p-R2'],2:['S-R1p','R1p-R2p']})[lsel].includes(k);
  const ed=(a,b,p,k)=>{const [x1,y1]=N[a],[x2,y2]=N[b],sel=on(k);return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${sel?C.blue:C.line}" stroke-width="${sel?4:2.5}"/>`+txt((x1+x2)/2,(y1+y2)/2-8,p,{a:'middle',fs:13,w:700,c:sel?C.blue:C.mute,halo:1})};
  let s=ed('S','R1','0,68','S-R1')+ed('S','R1p','0,32','S-R1p')+ed('R1p','R2','0,55','R1p-R2')+ed('R1p','R2p','0,45','R1p-R2p');
  const nd=(k,l,leaf)=>{const [x,y]=N[k];return `<circle cx="${x}" cy="${y}" r="7" fill="${C.ink}"/>`+txt(x+(k==='S'?0:10),y-12,l,{fs:13,w:700,a:k==='S'?'start':'start',halo:1})+(leaf!==undefined?`<rect x="${x-60}" y="${y-22}" width="${W-x+60}" height="44" fill="transparent" data-l="${leaf}" style="cursor:pointer"/>`:'')};
  s+=nd('S','')+nd('R1','R₁',0)+nd('R1p','R₁′')+nd('R2','R₂',1)+nd('R2p','R₂′',2);
  return s});
const fsq=fig('sq',(W,H,m)=>{const pad=6,S=Math.min(W-2*pad,H-2*pad),x0=(W-S)/2,y0=pad,w1=S*.68,h2=S*.55;let s='';
  const R=[[x0,y0,w1,S,0],[x0+w1,y0,S-w1,h2,1],[x0+w1,y0+h2,S-w1,S-h2,2]];
  R.forEach(([x,y,w,h,k])=>{const sel=k===lsel;s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${sel?C.blue:'var(--soft)'}" stroke="var(--ink)" stroke-width="2" data-l="${k}" style="cursor:pointer"/>`;
    s+=`<text x="${x+w/2}" y="${y+h/2-4}" font-size="${m?12:14}" font-weight="700" text-anchor="middle" fill="${sel?'#fff':C.ink}" pointer-events="none">${LV[k][0]}</text><text x="${x+w/2}" y="${y+h/2+16}" font-size="13" text-anchor="middle" fill="${sel?'#fff':C.mute}" pointer-events="none">${fx(LV[k][2],3)}</text>`});
  s+=txt(x0+w1/2,y0+S-6,'largeur 0,68',{a:'middle',fs:11,c:lsel===0?'#fff':C.mute});
  return s});
function upd(){const l=LV[lsel],f=lsel===0?'0,68':lsel===1?'0,32 × 0,55':'0,32 × 0,45';
  $('c13d').innerHTML=`<span class="fn">Figure 1.3-d</span><b>${l[3]}</b> : on multiplie le long du chemin, ${f} = <b>${fx(l[2],3)}</b>. Dans le carré, c'est l'aire du rectangle : largeur × hauteur. Les trois rectangles couvrent tout le carré : 0,68 + 0,176 + 0,144 = 1.`;ft();fsq()}
['tree','sq'].forEach(id=>$(id).addEventListener('click',e=>{const l=e.target.dataset.l;if(l!==undefined){lsel=+l;upd()}}));upd();

/* ================= e : indépendance ================= */
const fe=fig('f13e',(W,H,m)=>{const x=+$('si').value/100,hA=x/.5,hAp=(.4-x)/.5,pl=40,pr=m?10:150,pt=10,pb=30,S=Math.min(W-pl-pr,H-pt-pb),x0=pl,y0=pt,X=v=>x0+v*S,Y=v=>y0+S-v*S;let s='';
  s+=`<rect x="${x0}" y="${y0}" width="${S}" height="${S}" fill="var(--soft)" stroke="var(--ink)" stroke-width="2"/><line x1="${X(.5)}" x2="${X(.5)}" y1="${y0}" y2="${y0+S}" stroke="var(--ink)" stroke-width="2"/>`;
  s+=`<rect x="${X(0)}" y="${Y(hA)}" width="${S*.5}" height="${hA*S}" fill="${C.org}" opacity=".9"/><rect x="${X(.5)}" y="${Y(hAp)}" width="${S*.5}" height="${hAp*S}" fill="${C.org}" opacity=".55"/>`;
  s+=`<line x1="${x0}" x2="${x0+S}" y1="${Y(.4)}" y2="${Y(.4)}" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`;
  s+=txt(X(.25),y0+18,'A : emploi',{a:'middle',fs:13,w:700})+txt(X(.75),y0+18,'A′ : sans emploi',{a:'middle',fs:13,w:700});
  if(hA>.08)s+=txt(X(.25),Y(hA/2)+5,`P(B|A) = ${pct(hA,0)}`,{a:'middle',fs:13,w:700,c:'#fff'});
  if(hAp>.08)s+=txt(X(.75),Y(hAp/2)+5,`P(B|A′) = ${pct(hAp,0)}`,{a:'middle',fs:13,w:700,c:'#fff'});
  s+=txt(pl-6,Y(.4)+4,'0,4',{a:'end',fs:12,c:C.blue});
  if(!m)s+=txt(x0+S+10,Y(.4)+4,'P(B) = 0,4 : la',{fs:13,c:C.blue})+txt(x0+S+10,Y(.4)+20,'hauteur moyenne',{fs:13,c:C.blue});
  return s});
function upe(){const x=+$('si').value/100;$('osi').textContent=fx(x,2);const ind=Math.abs(x-.2)<1e-9;
  $('c13e').innerHTML=`<span class="fn">Figure 1.3-e</span>P(A) · P(B) = 0,5 × 0,4 = 0,20; ici P(A ∩ B) = ${fx(x,2)}. ${ind?'<b>Égaux : A et B sont indépendants.</b> La hauteur de B est la même dans les deux bandes : savoir A ne change rien.':x===0?'<b>A et B sont incompatibles</b> : aucune part de B dans la bande A. Savoir A change tout : c\'est le contraire de l\'indépendance.':`<b>Différents : A et B sont dépendants.</b> La hauteur de B n'est pas la même selon qu'on a un emploi ou non.`}`;fe()}
$('si').oninput=upe;upe();

/* ================= f et g : kiosques ================= */
const K=[['A',.5,.02],['B',.3,.05],['C',.2,.01]],PE=K.reduce((a,k)=>a+k[1]*k[2],0),LOUPE=10;let view='o',bsel=1;
function carre(W,H,m,hi){const pl=6,pt=24,pb=30,Wd=W-2*pl,Hd=H-pt-pb;let s='',x=pl;
  K.forEach(([n,w,r],i)=>{const ww=w*Wd;s+=`<rect x="${x}" y="${pt}" width="${ww}" height="${Hd}" fill="var(--soft)" stroke="var(--ink)" stroke-width="2"/>`+txt(x+ww/2,pt-8,`${n} : ${pct(w,0)}`,{a:'middle',fs:13,w:700});
    const h=r*LOUPE*Hd,sel=hi===undefined||hi===i;s+=`<rect x="${x}" y="${pt+Hd-h}" width="${ww}" height="${h}" fill="${hi===i?C.blue:C.org}" opacity="${sel?1:.35}"/>`;
    s+=txt(x+ww/2,pt+Hd-h-8,m?pct(r,0):`${fx(w,1)} × ${fx(r,2)} = ${fx(w*r,3)}`,{a:'middle',fs:12,w:700,halo:1});x+=ww});
  s+=txt(W-pl,H-8,'hauteurs agrandies × 10',{a:'end',fs:11,c:C.mute});return s}
function pile(W,H,m,hi,title){const pt=24,pb=30,Hd=H-pt-pb,cw=Math.min(70,W*.5),x=(W-cw)/2,sc=Hd*.8/PE;let s='',y=pt+Hd;
  K.forEach(([n,w,r],i)=>{const h=w*r*sc;y-=h;s+=`<rect x="${x}" y="${y}" width="${cw}" height="${h}" fill="${hi===i?C.blue:C.org}" opacity="${hi===undefined||hi===i?1:.35}" stroke="var(--bg)"/>`+txt(x+cw/2,y+h/2+4,n,{a:'middle',fs:12,w:700,c:'#fff'})});
  s+=txt(W/2,y-8,title,{a:'middle',fs:13,w:700,halo:1});return s}
const ff=fig('f13f',(W,H,m)=>{if(view==='c')return carre(W,H,m);
  const pl=6,pt=24,pb=30,Wd=W-2*pl,Hd=H-pt-pb;let s='',x=pl;
  K.forEach(([n,w])=>{const ww=w*Wd;s+=`<rect x="${x}" y="${pt}" width="${ww}" height="${Hd}" fill="var(--soft)" stroke="var(--ink)" stroke-width="2"/>`+txt(x+ww/2,pt-8,n,{a:'middle',fs:14,w:700});x+=ww});
  s+=`<ellipse cx="${pl+Wd*.55}" cy="${pt+Hd*.55}" rx="${Wd*.38}" ry="${Hd*.25}" fill="${C.org}" opacity=".55" stroke="${C.org}" stroke-width="2.5"/>`+txt(pl+Wd*.55,pt+Hd*.55+6,'E : erreur',{a:'middle',fs:15,w:700,halo:1});
  s+=txt(W-pl,H-8,'les aires de l\'ovale ne disent rien des probabilités',{a:'end',fs:11,c:C.mute});return s});
const ff2=fig('f13f2',(W,H,m)=>pile(W,H,m,undefined,`P(E) = ${fx(PE,3)}`));
function upf(){document.querySelectorAll('#vw button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===view));
  $('c13f').innerHTML=`<span class="fn">Figure 1.3-f</span>${view==='o'?'Les kiosques forment une partition : ils couvrent toutes les commandes, sans chevauchement. L\'ovale E est découpé en trois morceaux, mais on ne voit pas leur taille. Redressez-le.':'Redressé, chaque morceau de E devient un rectangle : largeur P(kiosque) × hauteur P(E | kiosque). On les empile : <b>P(E) = 0,010 + 0,015 + 0,002 = 0,027</b>.'}`;ff();ff2()}
$('vw').onclick=e=>{const v=e.target.dataset.v;if(v){view=v;upf()}};upf();
const fg=fig('f13g',(W,H,m)=>carre(W,H,m,bsel));
const fg2=fig('f13g2',(W,H,m)=>{const k=K[bsel];return pile(W,H,m,bsel,`${fx(k[1]*k[2],3)} / ${fx(PE,3)}`)});
function upg(){document.querySelectorAll('#bk button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.k===bsel));const k=K[bsel],v=k[1]*k[2]/PE;
  $('c13g').innerHTML=`<span class="fn">Figure 1.3-g</span>Sachant que la commande est erronée, le nouvel univers est la pile des trois morceaux. P(${k[0]} | E) = morceau ${k[0]} / somme des morceaux = ${fx(k[1]*k[2],3)} / ${fx(PE,3)} ≈ <b>${fx(v,3)}</b>.${bsel===1?' Le kiosque B ne traite que 30 % des commandes, mais produit plus de la moitié des erreurs.':''}`;fg();fg2()}
$('bk').onclick=e=>{const k=e.target.dataset.k;if(k!==undefined){bsel=+k;upg()}};upg();

/* ================= h : dépistage ================= */
const PR={c:[.95,.05,'Diapo du cours : sensibilité 95 %, faux positifs 5 %'],m:[.90,.09,'Mammographie : sensibilité 90 %, faux positifs 9 %']};let dp='c';
const fh=fig('f13h',(W,H,m)=>{const p=+$('dprev').value/1000,[se,fp]=PR[dp],M=Math.round(1000*p),TP=Math.round(M*se),FP=Math.round((1000-M)*fp);
  const cols=40,rows=25,cw=W/cols,rh=(H-24)/rows,r=Math.min(cw,rh)*.38;let s='';
  for(let i=0;i<1000;i++){const sick=i<M,pos=sick?i<TP:(i-M)<FP;const cx=(i%cols+.5)*cw,cy=(Math.floor(i/cols)+.5)*rh;
    const fill=pos?(sick?C.ink:C.org):'var(--bg)',st=sick?C.ink:(pos?C.org:C.line);s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${st}" stroke-width="${sick?2:1}"/>`}
  s+=txt(0,H-6,'● malade et positif',{fs:12,w:700})+txt(m?120:150,H-6,'● sain mais positif',{fs:12,w:700,c:C.org})+(m?'':txt(300,H-6,'○ négatif',{fs:12,c:C.mute}));
  return s});
function uph(){document.querySelectorAll('#dp button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.p===dp));const p=+$('dprev').value/1000,[se,fp,lab]=PR[dp];$('odprev').textContent=pct(p,1);
  const M=Math.round(1000*p),TP=Math.round(M*se),FP=Math.round((1000-M)*fp),ppv=p*se/(p*se+(1-p)*fp);
  $('frh').innerHTML=`<div class="fl2">P(malade | positif)</div><div class="fbig"><span class="num">${TP}</span><span class="den">${TP} + ${FP}</span></div><div class="fl2">≈ <b>${pct(ppv,0)}</b></div><p class="note">Sur 1 000 personnes : ${M} malades, ${TP+FP} positifs.</p>`;
  $('c13h').innerHTML=`<span class="fn">Figure 1.3-h</span>${lab}. Le nouvel univers, ce sont les ${TP+FP} positifs (points pleins). Les faux positifs l'emportent parce que les personnes saines sont beaucoup plus nombreuses. Par Bayes : ${fx(p,3)} × ${fx(se,2)} / (${fx(p,3)} × ${fx(se,2)} + ${fx(1-p,3)} × ${fx(fp,2)}) ≈ <b>${fx(ppv,3)}</b>.${dp==='m'?' En 2007, la réponse la plus fréquente de 160 gynécologues à cette question était 90 %.':''}`;fh()}
$('dp').onclick=e=>{const p=e.target.dataset.p;if(p){dp=p;$('dprev').value=10;uph()}};$('dprev').oninput=uph;uph();
}
