{
const {fr,fx,$,C,txt,fig}=SITE;
const NK=(L,n,k)=>`<span class="nk">${L}<span class="sc"><sup>${n}</sup><sub>${k}</sub></span></span>`;
const fact=n=>{let f=1;for(let i=2;i<=n;i++)f*=i;return f};

/* ================= Figure a : la recette ================= */
const E=[
 {t:'Un cadenas s\'ouvre avec une suite de trois nombres <b>différents</b> entre 0 et 39, dans le bon ordre. Combien de suites possibles?',a:{q1:'p',q2:'n',q3:'n'},g:[],s:`Des places (l'ordre compte), sans répétition : 40 × 39 × 38 = ${NK('A',40,3)} = <b>59 280</b>.`},
 {t:'Un mot de passe de 6 lettres minuscules, répétitions permises. Combien de mots de passe?',a:{q1:'p',q2:'o'},g:[],s:'Des places, avec répétition : 26 à chaque case, 26<sup>6</sup> = <b>308 915 776</b>.'},
 {t:'Combien d\'anagrammes du mot ANANAS?',a:{q1:'p',q2:'n',q3:'o'},g:[],s:'On place les 6 lettres; 3 A et 2 N identiques : 6! / (3! 2! 1!) = <b>60</b>.'},
 {t:'Parmi 10 collègues, on forme une délégation de 3 personnes, sans rôle. Combien de délégations?',a:{q1:'g'},g:[],s:`Changer l'ordre ne change pas la délégation : un groupe, ${NK('C',10,3)} = <b>120</b>.`},
 {t:'Parmi les mêmes 10 collègues, on choisit un porte-parole, une secrétaire et une trésorière. De combien de façons?',a:{q1:'p',q2:'n',q3:'n'},g:[],s:`Trois rôles distincts : des places, ${NK('A',10,3)} = 10 × 9 × 8 = <b>720</b>.`},
 {t:'On tire 3 prix <b>identiques</b> parmi 50 membres; une personne ne peut gagner qu\'une fois. Combien de résultats?',a:{q1:'g'},g:[],s:`Prix identiques : un groupe de gagnants, ${NK('C',50,3)} = <b>19 600</b>.`},
 {t:'Avec 5 chiffres de 0 à 9, répétitions permises, combien de codes?',a:{q1:'p',q2:'o'},g:[],s:'10 choix à chaque case : 10<sup>5</sup> = <b>100 000</b>.'},
 {t:'Avec les lettres de ROBUSTE (toutes différentes), combien de codes de 3 lettres distinctes commencent par une voyelle?',a:{q1:'p',q2:'n',q3:'n'},g:['f'],gx:{f:'La 1<sup>re</sup> case est imposée : une voyelle (3 choix). On la remplit en premier, puis les autres.'},s:`On fixe la 1<sup>re</sup> case (O, U ou E : 3 choix), puis ${NK('A',6,2)} = 30 : 3 × 30 = <b>90</b>.`},
 {t:'3 cahiers de maths, 2 de chimie et 4 de physique, tous différents, sur une tablette, chaque matière groupée. Combien de dispositions?',a:{q1:'p',q2:'n',q3:'n'},g:['c'],gx:{c:'Les cahiers d\'une même matière restent ensemble : chaque matière devient un seul bloc.'},s:'On colle chaque matière en bloc : 3! × 3! × 2! × 4! = <b>1 728</b>.'},
 {t:'Combien d\'anagrammes de STATISTIQUE ont leurs trois T consécutifs?',a:{q1:'p',q2:'n',q3:'o'},g:['c'],gx:{c:'Les trois T restent côte à côte : ils forment un seul bloc TTT.'},s:'Le bloc TTT et 8 autres lettres : 9 objets, dont 2 S et 2 I identiques : 9! / (2! 2!) = <b>90 720</b>.'},
 {t:'Sept personnes font la file. Alice et Benoît ne doivent pas être côte à côte. Combien de files?',a:{q1:'p',q2:'n',q3:'n'},g:['r','c'],gx:{r:'Compter les files « permises » directement est pénible; on compte toutes les files, puis on enlève les interdites.',c:'Pour compter les interdites, on colle Alice et Benoît en un bloc (AB ou BA).'},s:'Toutes les files, moins celles où le bloc AB ou BA est collé : 7! − 2 × 6! = <b>3 600</b>.'},
 {t:'Examen de 15 questions vrai ou faux. De combien de façons obtenir <b>au moins</b> 13 bonnes réponses?',a:{q1:'g'},g:['d'],gx:{d:'« Au moins 13 », c\'est 13 <b>ou</b> 14 <b>ou</b> 15 : trois cas qu\'on additionne.'},s:`On choisit le groupe des bonnes réponses; 13, 14 ou 15 : ${NK('C',15,13)} + ${NK('C',15,14)} + ${NK('C',15,15)} = 105 + 15 + 1 = <b>121</b>.`},
 {t:'Comité de 5 parmi 8 personnes de SN et 6 de SH, avec exactement 3 SN <b>et</b> 2 SH. Combien de comités?',a:{q1:'g'},g:['d'],gx:{d:'3 SN <b>et</b> 2 SH : deux étapes, qu\'on multiplie.'},s:`Deux étapes reliées par « et » : ${NK('C',8,3)} × ${NK('C',6,2)} = 56 × 15 = <b>840</b>.`},
 {t:'Sous-comité de 3 parmi 8 professeurs et 12 personnes de soutien, avec <b>au moins un</b> professeur. Combien?',a:{q1:'g'},g:['r'],gx:{r:'« Au moins un » a beaucoup de cas; son contraire, « aucun », n\'en a qu\'un. Total − aucun.'},s:`Total moins « aucun professeur » : ${NK('C',20,3)} − ${NK('C',12,3)} = 1 140 − 220 = <b>920</b>.`},
 {t:'Nombres de 4 chiffres distincts formés avec 1, 3, 5, 6, 7, 8, supérieurs à 3 000 et multiples de 5. Combien?',a:{q1:'p',q2:'n',q3:'n'},g:['f'],gx:{f:'Deux cases sont imposées : la dernière (5, pour un multiple de 5) et la première (plus grande que 3). On les remplit d\'abord.'},s:'Dernière case fixée (5), puis la première (3, 6, 7 ou 8) : 4 × 4 × 3 × 1 = <b>48</b>.'}];
const GN={f:'Fixer',c:'Coller',d:'Découper',r:'Retrancher'};
const GP={
 f:`<svg viewBox="0 0 64 30" class="gp"><rect x="2" y="6" width="18" height="18" rx="3" fill="var(--org)"/><rect x="7" y="13" width="8" height="7" rx="1" fill="#fff"/><path d="M8.5,13v-2.5a2.5,2.5 0 0 1 5,0V13" fill="none" stroke="#fff" stroke-width="1.6"/><rect x="23" y="6" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="44" y="6" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
 c:`<svg viewBox="0 0 64 30" class="gp"><rect x="2" y="7" width="16" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="21" y="3" width="40" height="24" rx="5" fill="none" stroke="var(--org)" stroke-width="2.4"/><text x="32" y="20" font-size="12" font-weight="700" text-anchor="middle" fill="currentColor">A</text><text x="50" y="20" font-size="12" font-weight="700" text-anchor="middle" fill="currentColor">B</text></svg>`,
 d:`<svg viewBox="0 0 64 30" class="gp"><rect x="2" y="9" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="15" y="9" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="32" y="20" font-size="15" font-weight="700" text-anchor="middle" fill="var(--org)">+</text><rect x="38" y="9" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="51" y="9" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`,
 r:`<svg viewBox="0 0 64 30" class="gp"><rect x="2" y="5" width="32" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><text x="18" y="19" font-size="10" text-anchor="middle" fill="currentColor">tout</text><text x="40" y="20" font-size="15" font-weight="700" text-anchor="middle" fill="var(--org)">−</text><rect x="47" y="9" width="15" height="12" rx="2" fill="var(--orgsoft)" stroke="var(--org)" stroke-width="1.6"/><path d="M48,20l13,-10" stroke="var(--org)" stroke-width="1.6"/></svg>`};
const GD={f:'Une place est imposée : on la remplit d\'abord.',c:'Des éléments restent ensemble : un seul bloc.',d:'Plusieurs cas : « et » ×, « ou » +.',r:'Plus simple de compter l\'interdit : total − interdits.'};

let ri=0,R={q1:null,q2:null,q3:null,g:new Set()},checked=false;
function result(){if(R.q1==='g')return `Un groupe : ${NK('C','n','k')}`;if(R.q1!=='p')return '…';if(R.q2==='o')return 'Avec répétition : n<sup>k</sup>';if(R.q2!=='n')return '…';if(R.q3==='o')return 'n! / (n₁! n₂! …)';if(R.q3==='n')return `${NK('A','n','k')} (n! si on place tout)`;return '…'}
function drawR(){const e=E[ri],act2=R.q1==='p',act3=act2&&R.q2==='n';
  const mark=(q,v)=>{if(!checked)return '';const want=e.a[q];if(want===undefined)return '';return R[q]===v?(want===v?' ok':' ko'):(want===v?' miss':'')};
  const btn=(q,v,l)=>`<button data-q="${q}" data-v="${v}" aria-pressed="${R[q]===v}" class="${mark(q,v)}">${l}</button>`;
  $('rec').innerHTML=`<div class="rs s0"><span class="rn">0</span>Je dessine des cases.</div>
  <div class="rs"><span class="rn">1</span><div><p>Si je change l'ordre, est-ce une nouvelle réponse?</p><div class="seg">${btn('q1','g','Non : un groupe')}${btn('q1','p','Oui : des places')}</div></div></div>
  <div class="rs${act2?'':' off'}"><span class="rn">2</span><div><p>Un même élément peut-il revenir?</p><div class="seg">${btn('q2','o','Oui')}${btn('q2','n','Non')}</div></div></div>
  <div class="rs${act3?'':' off'}"><span class="rn">3</span><div><p>Y a-t-il des éléments identiques?</p><div class="seg">${btn('q3','o','Oui')}${btn('q3','n','Non')}</div></div></div>
  <div class="rs res"><span class="rn">=</span><div class="rf">${result()}</div></div>
  <div class="rs"><span class="rn">+</span><div><p>Contraintes : quels gestes?</p><div class="gchips">${Object.entries(GN).map(([k,l])=>{const want=e.g.includes(k),has=R.g.has(k);const c=checked?(has?(want?' ok':' ko'):(want?' miss':'')):'';return `<button data-gg="${k}" aria-pressed="${has}" class="${c}">${GP[k]}<span><b>${l}</b><small>${GD[k]}</small></span></button>`}).join('')}</div><p class="note">Aucun geste? Ne rien cocher. <a href="#gestes">Les quatre gestes en images ↓</a></p></div></div>`;
  $('rnum').textContent=`Énoncé ${ri+1} sur ${E.length}`;$('rtxt').innerHTML=e.t;
  const S=$('rsol');S.hidden=!checked;if(checked){let ok=Object.keys(e.a).every(q=>R[q]===e.a[q])&&e.g.length===R.g.size&&e.g.every(k=>R.g.has(k));
    S.innerHTML=`<p><b>${ok?'Exact.':'À revoir.'}</b> ${e.s}</p>${e.g.length?e.g.map(k=>`<div class="gx">${GP[k]}<p><b>${GN[k].toUpperCase()}</b> · ${e.gx&&e.gx[k]?e.gx[k]:GD[k]}</p></div>`).join(''):`<p class="note">Aucun geste : le modèle de base suffit.</p>`}`}}
$('rec').addEventListener('click',ev=>{const b=ev.target.closest('button');if(!b)return;checked=false;
  if(b.dataset.gg){const k=b.dataset.gg;R.g.has(k)?R.g.delete(k):R.g.add(k)}
  else{const q=b.dataset.q,v=b.dataset.v;if(b.closest('.off'))return;R[q]=v;if(q==='q1'){R.q2=null;R.q3=null}if(q==='q2')R.q3=null}
  drawR()});
const reset=()=>{R={q1:null,q2:null,q3:null,g:new Set()};checked=false};
$('rchk').onclick=()=>{checked=true;drawR()};$('rclr').onclick=()=>{reset();drawR()};
$('rprev').onclick=()=>{ri=(ri+E.length-1)%E.length;reset();drawR()};$('rnext').onclick=()=>{ri=(ri+1)%E.length;reset();drawR()};
drawR();

/* ================= Figure b : tout est cases ================= */
const LET='ABCDEFGH';let cn=5,ck=3,rep=false,fill=[];
function drawC(){$('ocn').textContent=cn;$('ock').textContent=ck;$('ck').max=rep?5:Math.min(5,cn);if(ck>+$('ck').max){ck=+$('ck').max;$('ck').value=ck;$('ock').textContent=ck}
  const used=new Set(fill);$('pool').innerHTML=[...LET.slice(0,cn)].map(l=>`<button data-l="${l}" ${(!rep&&used.has(l))||fill.length>=ck?'disabled':''}>${l}</button>`).join('');
  let h='';for(let i=0;i<ck;i++){const ch=rep?cn:cn-i;h+=`<div class="case${i<fill.length?' full':''}${i===fill.length?' next':''}"><span class="ch">${ch} choix</span><span class="cv">${fill[i]||''}</span></div>${i<ck-1?'<span class="x">×</span>':''}`}
  $('cases').innerHTML=h;
  const fs=[];for(let i=0;i<ck;i++)fs.push(rep?cn:cn-i);const tot=fs.reduce((a,b)=>a*b,1);
  const name=rep?`n<sup>k</sup> = ${cn}<sup>${ck}</sup>`:ck===cn?`n! = ${cn}!`:`${NK('A',cn,ck)} = ${cn}! / ${cn-ck}!`;
  $('ccalc').innerHTML=`${fs.join(' × ')} = <b>${fr(tot)}</b> &nbsp;·&nbsp; ${name}${fill.length===ck?` &nbsp;·&nbsp; votre suite <b>${fill.join('')}</b> en est une parmi ${fr(tot)}.`:''}`}
$('pool').onclick=e=>{const l=e.target.dataset.l;if(!l||fill.length>=ck)return;fill.push(l);drawC()};
$('cn').oninput=e=>{cn=+e.target.value;fill=[];drawC()};$('ck').oninput=e=>{ck=+e.target.value;fill=[];drawC()};
$('crep').onclick=e=>{const r=e.target.dataset.r;if(r===undefined)return;rep=r==='1';document.querySelectorAll('#crep button').forEach(b=>b.setAttribute('aria-pressed',b===e.target));fill=[];drawC()};
$('cvid').onclick=()=>{fill=[];drawC()};drawC();

/* ================= Figure c : doublons ================= */
let dm='c',grouped=false;
function perms(a){if(a.length<=1)return [a];const r=[];a.forEach((x,i)=>perms([...a.slice(0,i),...a.slice(i+1)]).forEach(p=>r.push([x,...p])));return r}
const P4=['A','B','C','D'];
function ordered3(){const r=[];for(const a of P4)for(const b of P4)for(const c of P4)if(a!==b&&b!==c&&a!==c)r.push([a,b,c]);return r}
const GCOL=['#2563eb','#0f766e','#b45309','#7c3aed','#be185d','#475569'];
function drawD(){let items,key,lab,title,cap;
  if(dm==='c'){items=ordered3();key=x=>[...x].sort().join('');lab=x=>x.join('');
    cap=grouped?`<span class="fn">Figure 1.2-c</span>Chaque comité apparaissait <b>3! = 6 fois</b>, une fois par ordre de choix. 24 ÷ 6 = <b>4 comités</b> : ${NK('C',4,3)} = ${NK('A',4,3)} / 3!.`:`<span class="fn">Figure 1.2-c</span>Choisir 3 personnes parmi A, B, C, D, une case à la fois : ${NK('A',4,3)} = 4 × 3 × 2 = <b>24</b> suites ordonnées. La couleur montre le comité formé.`}
  else{items=perms(['P₁','A₁','P₂','A₂']);key=x=>x.map(s=>s[0]).join('');lab=x=>grouped?x.map(s=>s[0]).join(''):x.join('');
    cap=grouped?`<span class="fn">Figure 1.2-c</span>Sans les indices, chaque mot apparaissait <b>2! × 2! = 4 fois</b> (échanger les P, échanger les A). 24 ÷ 4 = <b>6 anagrammes</b> : 4! / (2! 2!).`:`<span class="fn">Figure 1.2-c</span>Si les deux P et les deux A étaient différents (P₁, P₂, A₁, A₂), il y aurait 4! = <b>24</b> mots. La couleur montre le mot qu'on lit vraiment.`}
  const keys=[...new Set(items.map(key))],col=k=>GCOL[keys.indexOf(k)%GCOL.length];
  if(!grouped)$('dup').innerHTML=`<div class="chips">${items.map(x=>`<span class="chip" style="--c:${col(key(x))}">${lab(x)}</span>`).join('')}</div>`;
  else $('dup').innerHTML=keys.map(k=>{const g=items.filter(x=>key(x)===k);return `<div class="grp"><span class="chip big" style="--c:${col(k)}">${dm==='c'?k.split('').join(''):k}</span><span class="dups">${g.map(x=>`<span class="chip ghost" style="--c:${col(k)}">${dm==='c'?x.join(''):x.join('')}</span>`).join('')}</span><span class="cnt">× ${g.length}</span></div>`}).join('');
  $('dcap').innerHTML=cap;$('dgo').textContent=grouped?'Revenir aux 24':(dm==='c'?'Oublier l\'ordre':'Effacer les indices')}
$('dmode').onclick=e=>{const m=e.target.dataset.m;if(!m)return;dm=m;grouped=false;document.querySelectorAll('#dmode button').forEach(b=>b.setAttribute('aria-pressed',b===e.target));drawD()};
$('dgo').onclick=()=>{grouped=!grouped;drawD()};drawD();

/* ================= Figure d : les gestes ================= */
const cs=(arr)=>arr.map(([n,cls,lab,ord],i)=>`<div class="case ${cls||''}"><span class="ch">${lab||''}</span><span class="cv">${n}</span>${ord?`<span class="ord">${ord}</span>`:''}</div>${i<arr.length-1?'<span class="x">×</span>':''}`).join('');
$('gfix').innerHTML=cs([[4,'fixed','3, 6, 7, 8','②'],[4,'','',  '③'],[3,'','','④'],[1,'fixed','le 5','①']]);
$('gcol').innerHTML=[['M',3],['C',2],['P',4]].map(([l,k])=>`<span class="blk">${Array.from({length:k},(_,i)=>`<i>${l}${i+1}</i>`).join('')}<small>${k}!</small></span>`).join('')+'<span class="blkx">et 3! pour l\'ordre des blocs</span>';
$('gdec').innerHTML=`<div class="br"><b>1 médecin et 2 autres</b><span>${NK('C',5,1)} × ${NK('C',4,2)} = 5 × 6 = 30</span></div><div class="plus">+</div><div class="br"><b>2 médecins et 1 autre</b><span>${NK('C',5,2)} × ${NK('C',4,1)} = 10 × 4 = 40</span></div>`;
$('gret').innerHTML=`<div class="bar"><span class="keep" style="width:${3600/5040*100}%">permises : 3 600</span><span class="cut" style="width:${1440/5040*100}%">AB collés : 1 440</span></div><p class="note">Toutes les files : 7! = 5 040</p>`;

}
