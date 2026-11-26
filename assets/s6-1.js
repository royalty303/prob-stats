{
const {fr,fx,$,C,txt,fig,npdf,tpdf11,cpdf,gauss,path,area}=SITE;
// Figure a : sens du test
  const mini=d=>{const X=x=>75+x*17,Y=y=>50-y*110;let s='';
    if(d!=='d')s+=`<path d="${area(npdf,X,Y,-4,d==='b'?-1.96:-1.645)}" fill="var(--org)"/>`;
    if(d!=='g')s+=`<path d="${area(npdf,X,Y,d==='b'?1.96:1.645,4)}" fill="var(--org)"/>`;
    return `<svg viewBox="0 0 150 56" aria-hidden="true">${s}<path d="${path(npdf,X,Y,-4.2,4.2,80)}" fill="none" stroke="var(--blue)" stroke-width="2" stroke-dasharray="5 3"/><line x1="0" x2="150" y1="50" y2="50" stroke="var(--line)"/></svg>`};
  const Q=[["Les sachets contiennent-ils moins que les 500 g annoncés?","g","H₁ : μ < 500 g. On cherche une preuve de « moins »."],
    ["Une pièce de monnaie est-elle truquée?","b","H₁ : π ≠ 0,5. Truquée dans un sens ou dans l'autre."],
    ["Le nouveau service d'aide fait-il passer le taux de réussite au-delà de 70 %?","d","H₁ : π > 0,70. On cherche une preuve d'amélioration."],
    ["Le temps moyen de livraison a-t-il changé depuis le déménagement de l'entrepôt?","b","H₁ : μ ≠ μ₀. « A changé » : plus long ou plus court."],
    ["Les batteries durent-elles moins que les 10 h annoncées?","g","H₁ : μ < 10 h."],
    ["Plus de 40 % des cégépiens travaillent-ils plus de 15 h par semaine?","d","H₁ : π > 0,40."]];
  const LAB={g:'À gauche',d:'À droite',b:'Bilatéral'};let qi=0;
  function showQ(){const [q,a,e]=Q[qi];$('q61').textContent=q;$('fb61').innerHTML='';$('qn61').textContent=`Question ${qi+1} sur ${Q.length}`;
    $('ch61').innerHTML=['g','d','b'].map(k=>`<button data-k="${k}">${mini(k)}<span>${LAB[k]}</span></button>`).join('')}
  $('ch61').onclick=e=>{const b=e.target.closest('button');if(!b)return;const [q,a,ex]=Q[qi];
    $('ch61').querySelectorAll('button').forEach(x=>x.className=x.dataset.k===a?'ok':x===b?'ko':'');
    $('fb61').innerHTML=(b.dataset.k===a?'<b>Exact.</b> ':'<b>Pas tout à fait.</b> ')+ex};
  $('qp61').onclick=()=>{qi=(qi+Q.length-1)%Q.length;showQ()};$('qs61').onclick=()=>{qi=(qi+1)%Q.length;showQ()};showQ();

  // Figure b : règle de décision
  const CR={z:{u:{10:1.282,5:1.645,1:2.326},b:{10:1.645,5:1.960,1:2.576}},t:{u:{10:1.363,5:1.796,1:2.718},b:{10:1.796,5:2.201,1:3.106}}};
  const S={sac:{law:'z',dir:'g',cote:-2,h:'H₀ : μ = 500 g · H₁ : μ < 500 g',d:'64 sachets : x̄ = 496 g, σ = 16 g. n ≥ 30 : loi normale.',f:'z = (496 − 500) / (16/√64) = −2,00',yes:'les sachets sont sous-remplis en moyenne',no:'les sachets sont sous-remplis en moyenne'},
    ker:{law:'z',dir:'b',cote:1.34,h:'H₀ : π = 0,5 · H₁ : π ≠ 0,5',d:'10 000 lancers : 5 067 faces, p = 0,5067. Loi normale.',f:'z = (0,5067 − 0,5) / √(0,5 × 0,5 / 10 000) = 1,34',yes:'la pièce est déséquilibrée',no:'la pièce est déséquilibrée'},
    bat:{law:'t',dir:'g',cote:-2.31,h:'H₀ : μ = 10 h · H₁ : μ < 10 h',d:'12 batteries : x̄ = 9,4 h, s = 0,9 h. n < 30, σ inconnu : loi de Student, 11 ddl.',f:'t = (9,4 − 10) / (0,9/√12) = −2,31',yes:'les batteries durent moins de 10 h en moyenne',no:'les batteries durent moins de 10 h en moyenne'}};
  let sk='sac',al=5;
  $('a61').innerHTML=[1,5,10].map(a=>`<button data-a="${a}">${a} %</button>`).join('');
  const fb=fig('f61b',(W,H,m)=>{const st=S[sk],f=st.law==='z'?npdf:tpdf11,c=CR[st.law][st.dir==='b'?'b':'u'][al],pl=14,pr=14,pt=40,pb=34,X=v=>pl+(v+4.2)/8.4*(W-pl-pr),Y=v=>pt+(1-v/.42)*(H-pt-pb);let s='';
    if(st.dir!=='d')s+=`<path d="${area(f,X,Y,-4.2,-c)}" fill="${C.org}" opacity=".85"/>`;
    if(st.dir!=='g')s+=`<path d="${area(f,X,Y,c,4.2)}" fill="${C.org}" opacity=".85"/>`;
    s+=`<path d="${path(f,X,Y,-4.2,4.2)}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`;
    s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(0)}" y2="${Y(0)}" stroke="${C.ink}"/>`;
    [-4,-2,0,2,4].forEach(t=>s+=txt(X(t),H-pb+18,fr(t),{a:'middle',fs:12,c:C.mute}));
    const crit=[];if(st.dir!=='d')crit.push(-c);if(st.dir!=='g')crit.push(c);
    crit.forEach(v=>s+=`<line x1="${X(v)}" x2="${X(v)}" y1="${Y(f(v))-30}" y2="${Y(0)}" stroke="${C.org}" stroke-width="2"/>`+txt(X(v),Y(f(v))-36,fx(v,3),{a:'middle',fs:13,c:C.org,w:700,halo:1}));
    s+=`<line x1="${X(st.cote)}" x2="${X(st.cote)}" y1="${pt-4}" y2="${Y(0)}" stroke="${C.ink}" stroke-width="3"/><circle cx="${X(st.cote)}" cy="${pt-4}" r="6" fill="${C.ink}"/>`;
    s+=txt(X(st.cote)+(st.cote<0?-10:10),pt,`cote ${fx(st.cote,2)}`,{a:st.cote<0?'end':'start',fs:15,w:700,halo:1});
    s+=txt(W-pr,16,st.law==='z'?'loi normale centrée réduite':'loi de Student, 11 ddl',{a:'end',fs:13,c:C.blue});
    if(st.law==='t'&&!m)s+=txt(pl,16,'queues plus épaisses : bornes plus éloignées',{fs:13,c:C.mute,it:1});
    return s});
  function upd(){const st=S[sk],c=CR[st.law][st.dir==='b'?'b':'u'][al],v=st.cote;
    const rej=st.dir==='g'?v<-c:st.dir==='d'?v>c:Math.abs(v)>c;
    const rule=st.dir==='g'?`${st.law} < −${fx(c,3)}`:st.dir==='d'?`${st.law} > ${fx(c,3)}`:`${st.law} < −${fx(c,3)} ou ${st.law} > ${fx(c,3)}`;
    document.querySelectorAll('#a61 button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.a===al));
    $('d61').innerHTML=`<b>${st.h}</b><br>${st.d}<br>${st.f}`;
    $('c61b').innerHTML=`<span class="fn">Figure 6.1-b</span>Règle : on rejette H₀ si ${rule}. Cote = ${fx(v,2)} : ${rej?`<b style="color:var(--org)">on rejette H₀</b>. Au seuil de ${al} %, on peut conclure que ${st.yes}.`:`<b>on ne rejette pas H₀</b>. Au seuil de ${al} %, les données ne permettent pas de conclure que ${st.no}.`}`;fb()}
  $('sit61').onchange=e=>{sk=e.target.value;upd()};$('a61').onclick=e=>{const a=e.target.dataset.a;if(a){al=+a;upd()}};upd();

}
