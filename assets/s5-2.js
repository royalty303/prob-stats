{
const {fr,fx,$,C,txt,fig,npdf,tpdf11,cpdf,gauss,path,area}=SITE;
// Figure a : un échantillon, une moyenne
  const expo=()=>-10*Math.log(1-Math.random()),MAXS=300;
  let cur=[2.4,5.1,16.8],obs=[...cur],means=[(2.4+5.1+16.8)/3];
  const stack=(vals,X,base,avail,r0,col,hiFrom)=>{let s='';const cnt={};vals.forEach(v=>{const b=Math.min(39.5,Math.floor(v)+.5);cnt[b]=(cnt[b]||0)+1});
    const mk=Math.max(1,...Object.values(cnt)),stp=Math.min(2*r0+1,avail/mk),r=Math.max(.9,Math.min(r0,stp*.45)),k={};let top=base;
    vals.forEach((v,i)=>{const b=Math.min(39.5,Math.floor(v)+.5);k[b]=(k[b]||0)+1;const y=base-r-(k[b]-1)*stp,hi=i>=hiFrom;
      s+=`<circle cx="${X(b)}" cy="${y}" r="${hi?Math.max(r,3.5):r}" fill="${hi?col[1]:col[0]}"/>`;if(hi)top=Math.min(top,y)});return {s,stp,r,cnt,top}};
  const sd=a=>{const m=a.reduce((x,y)=>x+y,0)/a.length;return Math.sqrt(a.reduce((x,y)=>x+(y-m)**2,0)/Math.max(1,a.length-1))};
  const fa=fig('f52a',(W,H,m)=>{const pl=16,pr=16,xm=40,X=v=>pl+Math.min(v,xm)/xm*(W-pl-pr),yT=Math.round(H*.44),yB=H-34;let s='';
    s+=txt(pl,16,`Temps d'attente individuels : ${obs.length}`,{c:C.mute,fs:13})+txt(W-pr,yT+50,`Moyennes de 3 temps : ${means.length}`,{c:C.mute,fs:13,a:'end'});
    [yT,yB].forEach(y=>{s+=`<line x1="${pl}" x2="${W-pr}" y1="${y}" y2="${y}" stroke="${C.line}" stroke-width="2"/>`;[0,10,20,30,40].forEach(t=>s+=txt(X(t),y+18,t===40?'40+':t,{a:'middle',fs:12,c:C.mute}))});
    s+=stack(obs,X,yT,yT-36,m?2.5:3.2,[C.mute,C.ink],obs.length-3).s;
    const SB=stack(means,X,yB,yB-yT-70,m?3:4,[C.ink,C.org],means.length-1);s+=SB.s;
    const mu=means[means.length-1];
    s+=`<path d="M${X(mu)-7},${yT+24}l7,-10l7,10z" fill="${C.org}"/><line x1="${X(mu)}" x2="${X(mu)}" y1="${yT+26}" y2="${SB.top-6}" stroke="${C.org}" stroke-width="1.5" stroke-dasharray="4 3"/>`;
    s+=txt(X(mu)+(mu>30?-12:12),yT+38,`moyenne ${fr(mu,1)}`,{a:mu>30?'end':'start',c:C.org,fs:14,w:700,it:1,halo:1});
    return s});
  const cap=()=>{const mu=means[means.length-1],mm=means.reduce((a,b)=>a+b,0)/means.length;
    $('c52a').innerHTML=`<span class="fn">Figure 5.2-a</span>(${cur.map(v=>fr(v,1)).join(' + ')}) ÷ 3 = ${fr(mu,1)} min. Chaque échantillon ajoute <b>3 temps</b> en haut, mais <b>un seul point</b> en bas.${means.length>=30?` Après ${means.length} échantillons : les temps individuels ont un écart type d'environ ${fr(sd(obs),1)} min; les moyennes, d'environ ${fr(sd(means),1)} min. Elles se tassent autour de ${fr(mm,1)} min, près de la moyenne de la population (10 min); avec seulement 3 temps, leur distribution reste asymétrique.`:' Tirez d\'autres échantillons : les moyennes s\'étalent beaucoup moins que les temps eux-mêmes.'}${means.length>=MAXS?' (Maximum atteint : effacez pour recommencer.)':''}`;
    $('b52a1').disabled=$('b52a2').disabled=means.length>=MAXS};
  const draw=()=>{if(means.length>=MAXS)return;cur=[expo(),expo(),expo()];obs.push(...cur);means.push(cur.reduce((a,b)=>a+b,0)/3)};
  $('b52a1').onclick=()=>{draw();fa();cap()};
  $('b52a2').onclick=()=>{for(let i=0;i<100;i++)draw();fa();cap()};
  $('b52a3').onclick=()=>{cur=[2.4,5.1,16.8];obs=[...cur];means=[(2.4+5.1+16.8)/3];fa();cap()};
  cap();

  // Figure b : laboratoire
  const POP={
    att:{mu:10,sd:10,lo:0,hi:60,u:'min',s:()=>-10*Math.log(1-Math.random()),pdf:x=>x<0?0:Math.exp(-x/10)/10,txt:'Attentes courtes fréquentes, longues attentes possibles.'},
    uni:{mu:10,sd:20/Math.sqrt(12),lo:0,hi:20,u:'mm',s:()=>20*Math.random(),pdf:x=>x>=0&&x<=20?1/20:0,txt:'Toutes les valeurs entre 0 et 20 mm sont également probables.'},
    tra:{mu:27.5,sd:Math.sqrt(168.75),lo:0,hi:60,u:'min',s:()=>Math.random()<.5?15+3*gauss():40+4*gauss(),pdf:x=>.5*npdf((x-15)/3)/3+.5*npdf((x-40)/4)/4,txt:'Deux types de trajets : courts (15 min) et longs (40 min).'},
    pan:{mu:.01,sd:Math.sqrt(.0099),lo:0,hi:1,u:'',s:()=>Math.random()<.01?1:0,disc:1,txt:'Chaque jour : 1 panne (1 %) ou aucune (99 %).'},
    sac:{mu:500,sd:8,lo:470,hi:530,u:'g',s:()=>500+8*gauss(),pdf:x=>npdf((x-500)/8)/8,txt:'Population déjà normale.'}};
  const CTX52={att:'Temps d\'attente à un comptoir de service : la plupart des attentes sont courtes, mais certaines s\'étirent beaucoup.',uni:'Mesures prises au hasard entre 0 et 20 mm : chaque valeur est aussi probable que les autres.',tra:'Durée du trajet vers le cégep : la moitié des étudiants habitent tout près (environ 15 min), l\'autre moitié loin (environ 40 min).',pan:'Une machine tombe en panne 1 jour sur 100. Chaque jour, X vaut 1 s\'il y a une panne, 0 sinon.',sac:'Masse de sachets remplis par une machine réglée à 500 g : la population est déjà en cloche.'};
  const NS=[1,5,30,100,300];let pk='att',n=30,M=[],same=0;
  $('n52').innerHTML=NS.map(v=>`<button data-n="${v}">${v}</button>`).join('');
  const L=fig('f52bL',(W,H,m)=>{const P=POP[pk],pl=10,pr=10,pt=26,pb=28,X=v=>pl+(v-P.lo)/(P.hi-P.lo)*(W-pl-pr);let s='';
    if(P.disc){const Y=v=>pt+(1-v)*(H-pt-pb);[[0,.99],[1,.01]].forEach(([x,p])=>{s+=`<rect x="${X(x)-(x?24:0)}" y="${Y(p)}" width="24" height="${Y(0)-Y(p)}" fill="var(--bluesoft)" stroke="${C.blue}" stroke-width="2" stroke-dasharray="4 3"/>`+txt(X(x)+(x?-12:12),Y(p)-6,fr(p*100,0)+' %',{a:'middle',fs:12,c:C.blue,w:700})})}
    else{let ym=0;for(let i=0;i<=200;i++)ym=Math.max(ym,P.pdf(P.lo+(P.hi-P.lo)*i/200));ym*=1.15;const Y=v=>pt+(1-v/ym)*(H-pt-pb);
      s+=`<path d="${area(P.pdf,X,Y,P.lo,P.hi)}" fill="var(--bluesoft)"/><path d="${path(P.pdf,X,Y,P.lo,P.hi)}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`}
    s+=`<line x1="${pl}" x2="${W-pr}" y1="${H-pb}" y2="${H-pb}" stroke="${C.ink}"/>`+txt(pl,H-8,fr(P.lo),{fs:12,c:C.mute})+txt(W-pr,H-8,fr(P.hi)+' '+P.u,{fs:12,c:C.mute,a:'end'});
    s+=`<line x1="${X(P.mu)}" x2="${X(P.mu)}" y1="${pt-8}" y2="${H-pb}" stroke="${C.blue}" stroke-width="1.5"/>`+txt(X(P.mu)+(P.disc?36:6),pt+(P.disc?24:4),`μ = ${fr(P.mu,2)}`,{fs:12,c:C.blue,w:700,halo:1});
    s+=txt(W-pr,pt+4,`σ = ${fr(P.sd,2)}`,{fs:13,a:'end',w:700,halo:1});return s});
  const R=fig('f52bR',(W,H,m)=>{if(!M.length)return'';const P=POP[pk],se=P.sd/Math.sqrt(n);
    let lo=Math.max(P.lo,P.mu-4.5*se),hi=Math.min(P.hi,P.mu+4.5*se);if(P.disc){lo=0;hi=Math.min(1,Math.max(.06,P.mu+6*se))}
    if(same){lo=P.lo;hi=P.hi}
    const nb=P.disc?Math.min(same?100:60,Math.round((hi-lo)*n)+1):same?120:40,bw=(hi-lo)/nb,cnt=new Array(nb).fill(0);
    for(const v of M){let b=Math.floor((v-lo)/bw);if(P.disc)b=Math.round((v-lo)/bw-.5);if(b>=0&&b<nb)cnt[b]++;else if(v===hi)cnt[nb-1]++}
    const dens=cnt.map(c=>c/(M.length*bw)),np=x=>npdf((x-P.mu)/se)/se,ym=Math.max(...dens,np(P.mu))*1.12,pl=10,pr=10,pt=26,pb=28,X=v=>pl+(v-lo)/(hi-lo)*(W-pl-pr),Y=v=>pt+(1-v/ym)*(H-pt-pb);let s='';
    dens.forEach((d,b)=>{if(d)s+=`<rect x="${X(lo+b*bw)+.5}" y="${Y(d)}" width="${Math.max(1.5,X(bw)-X(0)-1)}" height="${Y(0)-Y(d)}" fill="${C.ink}" opacity=".85"/>`});
    s+=`<path d="${path(np,X,Y,lo,hi,240)}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`;
    s+=`<line x1="${pl}" x2="${W-pr}" y1="${H-pb}" y2="${H-pb}" stroke="${C.ink}"/>`+txt(pl,H-8,fr(lo,2),{fs:12,c:C.mute})+txt(W-pr,H-8,fr(hi,2)+' '+P.u,{fs:12,c:C.mute,a:'end'});
    s+=`<line x1="${X(P.mu)}" x2="${X(P.mu)}" y1="${pt-8}" y2="${H-pb}" stroke="${C.blue}" stroke-width="1.5"/>`;
    s+=txt(W-pr,pt+4,`σ/√n = ${fr(se,3)}`,{fs:13,a:'end',w:700,halo:1});
    if(same&&n>1){const a=Math.max(lo,P.mu-2*se),b=Math.min(hi,P.mu+2*se),y=H-pb+4;s+=`<path d="M${X(a)},${y}v6M${X(a)},${y+3}H${X(b)}M${X(b)},${y}v6" stroke="${C.org}" stroke-width="2"/>`}
    if(P.disc&&n<=30&&!same)s+=txt(X(lo)+30,pt+40,`${fr(cnt[0]/M.length*100,0)} % des échantillons : aucune panne`,{it:1,c:C.org,fs:15,halo:1});
    return s});
  function run(){const P=POP[pk];$('ctx52').textContent=CTX52[pk];M=new Float64Array(5000);for(let i=0;i<5000;i++){let t=0;for(let j=0;j<n;j++)t+=P.s();M[i]=t/n}
    document.querySelectorAll('#n52 button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.n===n));
    $('h52bR').textContent=n===1?'5 000 observations (n = 1)':`5 000 moyennes X̄ de ${n} observations`;
    $('c52b').innerHTML=`<span class="fn">Figure 5.2-b</span>${P.txt} Barres : moyennes simulées. Pointillé : la loi normale N(μ, σ/√n) prédite par le théorème. ${pk==='pan'?(n<300?'Ici, la cloche n\'est pas encore là : un événement rare demande un très grand n.':'À n = 300, la forme commence à peine à s\'arrondir.'):n===1?'Avec n = 1, on retrouve la population.':'La cloche est là, et elle est beaucoup plus étroite que la population.'}${same?' Même échelle que la population : on voit directement combien les moyennes se resserrent.':' Attention : l\'axe de droite est zoomé sur les moyennes; pour comparer les largeurs, passez à « Même échelle ».'}`;
    L();R()}
  $('sc52').onclick=e=>{const v=e.target.dataset.s;if(v==null)return;same=+v;document.querySelectorAll('#sc52 button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.s===v));run()};
  $('pop52').onchange=e=>{pk=e.target.value;run()};
  $('n52').onclick=e=>{const v=e.target.dataset.n;if(v){n=+v;run()}};
  const demo=(p,a,b)=>{pk=p;$('pop52').value=p;n=a;run();setTimeout(()=>{n=b;run()},1100)};
  $('d1').onclick=()=>demo('uni',1,5);$('d2').onclick=()=>demo('att',1,30);$('d3').onclick=()=>demo('pan',30,300);
  run();

  // Figure c : sigma/racine n
  fig('f52c',(W,H,m)=>{const pl=46,pr=20,pt=24,pb=40,xm=70,X=v=>pl+v/xm*(W-pl-pr),Y=v=>pt+(1-v/10.5)*(H-pt-pb);let s='';
    [0,5,10].forEach(t=>s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(t)}" y2="${Y(t)}" stroke="${C.line}"/>`+txt(pl-8,Y(t)+4,t,{a:'end',fs:12,c:C.mute}));
    s+=`<path d="${path(x=>10/Math.sqrt(x),X,Y,1,xm)}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`;
    const P=[1,4,16,64];P.forEach((n,i)=>{const v=10/Math.sqrt(n);s+=`<circle cx="${X(n)}" cy="${Y(v)}" r="6" fill="${C.ink}"/>`+txt(X(n)+10,Y(v)-10,`n = ${n} : ${fr(v,2)}`,{fs:13,w:700,halo:1});
      if(i){const p=P[i-1];s+=txt((X(p)+X(n))/2,Y((10/Math.sqrt(p)+v)/2)+(m?22:28),'÷ 2',{a:'middle',it:1,c:C.org,fs:16,halo:1})}});
    [0,10,20,30,40,50,60,70].forEach(t=>s+=txt(X(t),H-pb+20,t,{a:'middle',fs:12,c:C.mute}));
    s+=txt(W-pr,H-4,'n',{a:'end',fs:13,c:C.mute})+txt(W-pr,14,'σ/√n (min)',{fs:13,c:C.mute,a:'end'});
    return s});
}
