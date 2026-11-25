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

/* ================= c : l'arbre ================= */
const K=[['A',.5,.02],['B',.3,.05],['C',.2,.01]],PE=K.reduce((a,k)=>a+k[1]*k[2],0);
let tm='1',leaf=3;/* feuilles : 2k = E′ du kiosque k, 2k+1 = E */
const ftree=fig('tree',(W,H,m)=>{const rx=W/2,ry=22,ly=H*.36,fy=H*.72,kx=k=>W*(k+.5)/3,lx=(k,e)=>kx(k)+(e?1:-1)*W*(m?.07:.075);
  const onE=k=>tm==='all'||(leaf===2*k+1),onEp=k=>tm!=='all'&&leaf===2*k,onK=k=>tm==='all'||Math.floor(leaf/2)===k;
  let s='';
  if(tm==='all'){let d=`M${lx(0,1)},${fy}`;d+=`C${lx(0,1)},${fy+46} ${lx(1,1)},${fy+46} ${lx(1,1)},${fy}`;d+=`C${lx(1,1)},${fy+46} ${lx(2,1)},${fy+46} ${lx(2,1)},${fy}`;
    s+=`<path d="${d}" fill="none" stroke="${C.org}" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" opacity=".3"/>`;
    s+=txt(W/2,fy+58,`P(E) = ${K.map(k=>fx(k[1]*k[2],3)).join(' + ')} = ${fx(PE,3)}`,{a:'middle',fs:m?13:16,w:700,c:C.org,halo:1})}
  const ln=(x1,y1,x2,y2,on)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${on?C.blue:C.line}" stroke-width="${on?4:2.5}"/>`;
  K.forEach(([n,p,e],k)=>{s+=ln(rx,ry,kx(k),ly,onK(k))+ln(kx(k),ly,lx(k,0),fy,onEp(k))+ln(kx(k),ly,lx(k,1),fy,onE(k));
    s+=txt((rx+kx(k))/2+(k===1?8:0),(ry+ly)/2-(k===1?0:6),m?fx(p,1):`P(${n}) = ${fx(p,1)}`,{a:k===0?'end':k===2?'start':'start',fs:13,w:700,c:onK(k)?C.blue:C.mute,halo:1});
    s+=txt((kx(k)+lx(k,0))/2-4,(ly+fy)/2,m?fx(1-e,2):`P(E′|${n}) = ${fx(1-e,2)}`,{a:'end',fs:12,c:onEp(k)?C.blue:C.mute,halo:1});
    s+=txt((kx(k)+lx(k,1))/2+4,(ly+fy)/2,m?fx(e,2):`P(E|${n}) = ${fx(e,2)}`,{fs:12,w:700,c:onE(k)?C.blue:C.mute,halo:1});
    s+=`<circle cx="${kx(k)}" cy="${ly}" r="8" fill="${C.ink}"/>`+txt(kx(k)+12,ly+5,n,{fs:16,w:700,halo:1});
    [[0,'E′'],[1,'E']].forEach(([ee,l])=>{const x=lx(k,ee),id=2*k+ee;s+=`<circle cx="${x}" cy="${fy}" r="8" fill="${ee?C.org:C.ink}"/>`+txt(x,fy+24,l,{a:'middle',fs:14,w:700,c:ee?C.org:C.ink,halo:1})+`<rect x="${x-26}" y="${fy-30}" width="52" height="64" fill="transparent" data-l="${id}" style="cursor:pointer"/>`})});
  s+=`<circle cx="${rx}" cy="${ry}" r="8" fill="${C.ink}"/>`;
  return s});
function upt(){document.querySelectorAll('#tm button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.t===tm));
  let c;if(tm==='all')c=`Toutes les branches qui mènent à E sont rassemblées. Chaque chemin donne une intersection, P(kiosque) × P(E | kiosque), et on les additionne : <b>P(E) = ${fx(PE,3)}</b>. C'est la probabilité totale.`;
  else{const k=Math.floor(leaf/2),e=leaf%2,[n,p,r]=K[k],q=e?r:1-r;c=`Chemin ${n} puis ${e?'E':'E′'} : on multiplie le long du chemin, P(${n}) × P(${e?'E':'E′'} | ${n}) = ${fx(p,1)} × ${fx(q,2)} = <b>${fx(p*q,3)}</b> = P(${n} ∩ ${e?'E':'E′'}). Cliquez sur une autre feuille.`}
  $('c13d').innerHTML=`<span class="fn">Figure 1.3-c</span>${c}`;ftree()}
$('tm').onclick=e=>{const t=e.target.dataset.t;if(t){tm=t;upt()}};
$('tree').addEventListener('click',e=>{const l=e.target.dataset.l;if(l!==undefined){leaf=+l;tm='1';upt()}});upt();

/* ================= d : partition ================= */
const LOUPE=10;let view='o';
/* ovale découpé : renvoie les morceaux de E dans chaque bande */
function ovale(W,H,o={}){const pl=o.pl??6,pt=o.pt??24,pb=o.pb??30,Wd=W-2*pl,Hd=H-pt-pb,ex=pl+Wd*.55,ey=pt+Hd*.55,erx=Wd*.38,ery=Hd*.27,id='ov'+Math.random().toString(36).slice(2,7);let s='<defs>',x=pl;const B=[];
  K.forEach(([n,w])=>{const ww=w*Wd;B.push([x,ww]);s+=`<clipPath id="${id}${n}"><rect x="${x}" y="${pt}" width="${ww}" height="${Hd}"/></clipPath>`;x+=ww});s+='</defs>';
  B.forEach(([bx,bw],i)=>{s+=`<rect x="${bx}" y="${pt}" width="${bw}" height="${Hd}" fill="var(--soft)" stroke="var(--ink)" stroke-width="2"/>`;if(o.top!==false)s+=txt(bx+bw/2,pt-8,o.short?K[i][0]:`${K[i][0]} : ${fx(K[i][1]*100,0)} %`,{a:'middle',fs:o.fs||13,w:700})});
  B.forEach(([bx,bw],i)=>{const f=o.fill?o.fill(i):C.org,op=o.op?o.op(i):.85;if(f)s+=`<ellipse cx="${ex}" cy="${ey}" rx="${erx}" ry="${ery}" fill="${f}" opacity="${op}" clip-path="url(#${id}${K[i][0]})"/>`;
    if(o.labels){const a=Math.max(bx,ex-erx),b=Math.min(bx+bw,ex+erx);s+=txt((a+b)/2,ey+5,`${K[i][0]} ∩ E`,{a:'middle',fs:o.fs||14,w:700,c:'#fff'})}});
  s+=`<ellipse cx="${ex}" cy="${ey}" rx="${erx}" ry="${ery}" fill="none" stroke="${C.org}" stroke-width="2.5"/>`;
  B.slice(1).forEach(([bx])=>s+=`<line x1="${bx}" x2="${bx}" y1="${pt}" y2="${pt+Hd}" stroke="var(--ink)" stroke-width="2"/>`);
  return s}
function carre(W,H,m){const pl=6,pt=24,pb=30,Wd=W-2*pl,Hd=H-pt-pb;let s='',x=pl;
  K.forEach(([n,w,r])=>{const ww=w*Wd;s+=`<rect x="${x}" y="${pt}" width="${ww}" height="${Hd}" fill="var(--soft)" stroke="var(--ink)" stroke-width="2"/>`+txt(x+ww/2,pt-8,`${n} : ${fx(w*100,0)} %`,{a:'middle',fs:13,w:700});
    const h=r*LOUPE*Hd;s+=`<rect x="${x}" y="${pt+Hd-h}" width="${ww}" height="${h}" fill="${C.org}"/>`;
    s+=txt(x+ww/2,pt+Hd-h/2+5,`${n} ∩ E`,{a:'middle',fs:m?12:14,w:700,c:'#fff'});
    s+=txt(x+ww/2,pt+Hd-h-8,m?fx(w*r,3):`${fx(w,1)} × ${fx(r,2)} = ${fx(w*r,3)}`,{a:'middle',fs:12,w:700,halo:1});x+=ww});
  s+=txt(W-pl,H-8,'hauteurs agrandies × 10',{a:'end',fs:11,c:C.mute});return s}
function pile(W,H,m){const pt=24,pb=30,Hd=H-pt-pb,cw=Math.min(76,W*.6),x=(W-cw)/2,sc=Hd*.8/PE;let s='',y=pt+Hd;
  K.forEach(([n,w,r])=>{const h=w*r*sc;y-=h;s+=`<rect x="${x}" y="${y}" width="${cw}" height="${h}" fill="${C.org}" stroke="var(--bg)" stroke-width="2"/>`+(h>14?txt(x+cw/2,y+h/2+4,`${n} ∩ E`,{a:'middle',fs:11,w:700,c:'#fff'}):'')});
  s+=txt(W/2,y-8,`P(E) = ${fx(PE,3)}`,{a:'middle',fs:13,w:700,halo:1});return s}
const ff=fig('f13f',(W,H,m)=>ovale(W,H,{labels:true})+txt(W-6,H-8,'dans l\'ovale, les aires ne sont pas à l\'échelle',{a:'end',fs:11,c:C.mute}));
const ff2=fig('f13f2',(W,H,m)=>pile(W,H,m));
function upf(){
  $('c13f').innerHTML=`<span class="fn">Figure 1.3-d</span>${true?'Les kiosques forment une partition : ils couvrent toutes les commandes, sans chevauchement. La partition découpe E en trois zones, A ∩ E, B ∩ E et C ∩ E, qui ne se chevauchent pas : ensemble, elles reconstituent E.':'Redressée, chaque zone A ∩ E, B ∩ E, C ∩ E devient un rectangle : largeur P(kiosque) × hauteur P(E | kiosque). On les empile : <b>P(E) = 0,010 + 0,015 + 0,002 = 0,027</b>.'}`;ff();ff2()}
upf();

/* ================= e : Bayes ================= */
let bsel=1;
function upg(){document.querySelectorAll('#bk button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.k===bsel));const [n,p,r]=K[bsel],v=p*r/PE;
  const mini=f=>`<svg viewBox="0 0 220 120" class="mini" aria-hidden="true">${ovale(220,120,{pt:18,pb:6,short:true,fs:12,fill:f})}</svg>`;
  $('bay').innerHTML=`<div class="bfrac"><div class="bl">P(${n} | E) =</div><div class="bfr"><div>${mini(i=>i===bsel?C.org:null)}<span>${n} ∩ E</span></div><div>${mini(()=>C.org)}<span>toute la zone E</span></div></div></div>
  <div class="bform"><p><span class="tag">Définition</span> P(${n} | E) = <span class="fr2"><span>P(${n} ∩ E)</span><span>P(E)</span></span></p>
  <p><span class="tag">Bayes</span> P(${n} | E) = <span class="fr2"><span>P(${n}) · P(E | ${n})</span><span>${K.map(k=>`P(${k[0]}) · P(E | ${k[0]})`).join(' + ')}</span></span></p>
  <p><span class="tag">Calcul</span> P(${n} | E) = <span class="fr2"><span>${fx(p,1)} × ${fx(r,2)}</span><span>${K.map(k=>fx(k[1]*k[2],3)).join(' + ')}</span></span> = ${fx(p*r,3)} / ${fx(PE,3)} ≈ <b>${fx(v,3)}</b></p></div>`;
  $('c13g').innerHTML=`<span class="fn">Figure 1.3-e</span>Sachant que la commande est erronée, le nouvel univers est toute la zone orange E. Bayes n'est que la définition de la probabilité conditionnelle, avec le numérateur calculé par un chemin de l'arbre et le dénominateur par la probabilité totale.${bsel===1?' Le kiosque B ne traite que 30 % des commandes, mais produit plus de la moitié des erreurs.':''}`}
$('bk').onclick=e=>{const k=e.target.dataset.k;if(k!==undefined){bsel=+k;upg()}};upg();
}
