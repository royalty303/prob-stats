{
const {fr,fx,$,C,txt,fig}=SITE;

/* ================= a : par valeur ================= */
const V=[0,1,2,3,4,5,6,7],F=[18,22,26,20,14,10,6,4],N=F.reduce((a,b)=>a+b,0);
const CUM=F.map((_,i)=>F.slice(0,i+1).reduce((a,b)=>a+b,0)/N*100);
const QS=[['Q₁',25],['Médiane',50],['Q₃',75],['D₉',90],['C₉₅',95]];let qk=1;
const qval=k=>{for(let i=0;i<V.length;i++)if(CUM[i]>=k-1e-9)return [V[i],i]};
$('qv').innerHTML=QS.map(([l],i)=>`<button data-i="${i}">${l}</button>`).join('');
const fa=fig('f23a',(W,H,m)=>{const k=QS[qk][1],[q,i]=qval(k),pl=40,pr=10,pt=10,pb=34,bw=(W-pl-pr)/V.length,Y=v=>pt+(1-v/100)*(H-pt-pb);let s='';
  [0,25,50,75,100].forEach(t=>s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(t)}" y2="${Y(t)}" stroke="${C.line}"/>`+txt(pl-6,Y(t)+4,t+' %',{a:'end',fs:11,c:C.mute}));
  V.forEach((v,j)=>{const x=pl+j*bw;s+=`<rect x="${x+3}" y="${Y(CUM[j])}" width="${bw-6}" height="${Y(0)-Y(CUM[j])}" fill="${j===i?C.org:j<i?C.ink:'var(--soft)'}" stroke="${j<=i?'none':C.line}" opacity="${j<i?.35:1}"/>`+txt(x+bw/2,H-14,v,{a:'middle',fs:13,w:700})});
  s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(k)}" y2="${Y(k)}" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`+txt(W-pr,Y(k)-6,`${k} %`,{a:'end',fs:13,w:700,c:C.blue,halo:1});
  s+=txt(pl+(i+.5)*bw,Y(CUM[i])-8,`${fx(CUM[i],1)} %`,{a:'middle',fs:12,w:700,c:C.org,halo:1});
  s+=txt((W+pl)/2,H-1,'cafés par semaine',{a:'middle',fs:11,c:C.mute});
  return s});
function upa(){document.querySelectorAll('#qv button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.i===qk));const [l,k]=QS[qk],[q,i]=qval(k);
  $('tq').innerHTML=`<thead><tr><th>Cafés</th><th>Fréquence</th><th>% cumulé</th></tr></thead><tbody>`+V.map((v,j)=>`<tr class="${j===i?'hl':''}"><td>${v}</td><td>${F[j]}</td><td>${fx(CUM[j],1)} %</td></tr>`).join('')+`<tr class="tot"><td>Total</td><td>${N}</td><td></td></tr></tbody>`;
  $('c23a').innerHTML=`<span class="fn">Figure 2.3-a</span>${l} : on cherche ${k} %. La première valeur dont le pourcentage cumulé atteint ${k} % est ${V[i]} (${fx(CUM[i],1)} %) : <b>${l} = ${fx(q,1)} café${q>1?'s':''}</b>. ${i>0?`La valeur précédente, ${V[i-1]}, n'atteint que ${fx(CUM[i-1],1)} %.`:''}`;fa()}
$('qv').onclick=e=>{const i=e.target.dataset.i;if(i!==undefined){qk=+i;upa()}};upa();

/* ================= b : pince de crabe ================= */
const CL=[[0,10,30],[10,20,70],[20,30,80],[30,40,45],[40,50,25]],NC=250;let acc=0;const CC=CL.map(c=>(acc+=c[2])/NC*100);
const fb=fig('f23b',(W,H,m)=>{const k=+$('slk').value,i=CC.findIndex(c=>c>=k),[a,b]=CL[i],pb_=i?CC[i-1]:0,pa=CC[i],fr_=(k-pb_)/(pa-pb_),x=fr_*(b-a);
  const L=W*.16,R=W*.84,M=L+(R-L)*Math.min(.85,Math.max(.15,fr_)),yt=H*.42,yb=H*.62;let s='';
  const arc=(x1,x2,y,up,lab,col,big)=>{const h=(x2-x1)*(big?.4:.27),cy=up?y-h:y+h;return `<path d="M${x1},${y}Q${(x1+x2)/2},${cy} ${x2},${y}" fill="none" stroke="${col}" stroke-width="${big?3:2.5}"/>`+txt((x1+x2)/2,up?(y+cy)/2-6:(y+cy)/2+16,lab,{a:'middle',fs:15,w:700,c:col,halo:1})};
  s+=arc(L,R,yt-18,true,fx(b-a,0),C.ink,true)+arc(L,M,yt-18,true,'x',C.org,false);
  s+=arc(L,R,yb+14,false,fx(pa-pb_,0),C.ink,true)+arc(L,M,yb+14,false,fx(k-pb_,1),C.org,false);
  s+=txt(L,yt,fx(a,0),{a:'middle',fs:20,w:700})+txt(R,yt,fx(b,0),{a:'middle',fs:20,w:700})+txt(M,yt,'?',{a:'middle',fs:22,w:700,c:C.org});
  s+=txt(L,yb,fx(pb_,0)+' %',{a:'middle',fs:18,w:700})+txt(R,yb,fx(pa,0)+' %',{a:'middle',fs:18,w:700})+txt(M,yb,fx(k,0)+' %',{a:'middle',fs:18,w:700,c:C.blue});
  return s});
function upb(){const k=+$('slk').value,i=CC.findIndex(c=>c>=k),[a,b]=CL[i],pb_=i?CC[i-1]:0,pa=CC[i],x=(k-pb_)/(pa-pb_)*(b-a);$('ok').textContent=`${k} %`;
  $('tc').innerHTML=`<thead><tr><th>Durée (min)</th><th>Fréquence</th><th>% cumulé</th></tr></thead><tbody>`+CL.map(([u,v,f],j)=>`<tr class="${j===i?'hl':j===i-1?'hb':''}"><td>[${u} ; ${v}[</td><td>${f}</td><td>${fx(CC[j],0)} %</td></tr>`).join('')+`<tr class="tot"><td>Total</td><td>${NC}</td><td></td></tr></tbody>`;
  $('pcalc').innerHTML=`x / ${b-a} = ${fx(k-pb_,1)} / ${fx(pa-pb_,0)} &nbsp;→&nbsp; x ≈ ${fx(x,2)} &nbsp;→&nbsp; <b>C<sub>${k}</sub> ≈ ${a} + ${fx(x,2)} ≈ ${fx(a+x,1)} min</b>`;fb()}
$('slk').oninput=upb;upb();

/* ================= c : cote z ================= */
const SUB=[['Mathématiques',68,6,'zm'],['Chimie',75,5,'zc']];
const fc=fig('f23c',(W,H,m)=>{const pl=m?16:130,pr=16,X=z=>pl+(z+3)/6*(W-pl-pr);let s='';
  SUB.forEach(([l,mu,sd,id],r)=>{const y=H*(r?.72:.3),x=+$(id).value,z=(x-mu)/sd,zc=Math.max(-3,Math.min(3,z));
    s+=`<line x1="${X(-3)}" x2="${X(3)}" y1="${y}" y2="${y}" stroke="${C.ink}" stroke-width="2"/>`;
    for(let k=-3;k<=3;k++){s+=`<line x1="${X(k)}" x2="${X(k)}" y1="${y-6}" y2="${y+6}" stroke="${C.ink}" stroke-width="${k?1.5:3}"/>`+txt(X(k),y+22,`${mu+k*sd} %`,{a:'middle',fs:11,c:C.mute})+txt(X(k),y-12,k===0?'x̄':(k>0?'+':'−')+Math.abs(k)+'s',{a:'middle',fs:11,c:C.blue,w:600})}
    s+=`<line x1="${X(0)}" x2="${X(zc)}" y1="${y}" y2="${y}" stroke="${C.org}" stroke-width="6" stroke-linecap="round"/><circle cx="${X(zc)}" cy="${y}" r="9" fill="${C.org}"/>`;
    s+=txt(X(zc),y-30,`z = ${z>0?'+':''}${fx(z,2)}`,{a:'middle',fs:15,w:700,c:C.org,halo:1});
    if(m)s+=txt(pl,y-44,`${l} : x̄ = ${mu} %, s = ${sd} %`,{fs:12,w:700});else s+=txt(pl-14,y+5,l,{a:'end',fs:14,w:700})+txt(pl-14,y+21,`x̄ = ${mu} %, s = ${sd} %`,{a:'end',fs:11,c:C.mute})});
  return s});
function upc(){const zm=(+$('zm').value-68)/6,zc=(+$('zc').value-75)/5;$('ozm').textContent=$('zm').value+' %';$('ozc').textContent=$('zc').value+' %';
  const best=Math.abs(zm-zc)<1e-9?'Les deux cotes sont égales : elle se démarque autant dans les deux matières.':zm>zc?'Sa cote est plus élevée en mathématiques : c\'est là qu\'elle se démarque le plus.':'Sa cote est plus élevée en chimie : c\'est là qu\'elle se démarque le plus.';
  $('c23c').innerHTML=`<span class="fn">Figure 2.3-c</span>Chaque règle est graduée en écarts types autour de la moyenne du groupe. Mathématiques : z = (${$('zm').value} − 68) / 6 = ${fx(zm,2)}. Chimie : z = (${$('zc').value} − 75) / 5 = ${fx(zc,2)}. ${best}`;fc()}
$('zm').oninput=upc;$('zc').oninput=upc;upc();
}
