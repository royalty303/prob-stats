{
const {fr,fx,$,C,txt,fig}=SITE;
const comb=(n,k)=>{if(k<0||k>n)return 0;let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return Math.round(r)};
const NK=(L,n,k)=>`<span class="nk">${L}<span class="sc"><sup>${n}</sup><sub>${k}</sub></span></span>`;
const pw=(b,e)=>e===0?'':e===1?b:`${b}<sup>${e}</sup>`;

/* a : configurations */
function upa(){const n=+$('bn').value;$('bk').max=n;if(+$('bk').value>n)$('bk').value=n;const k=+$('bk').value,p=+$('bp').value/100,q=1-p;
  $('obn').textContent=n;$('obk').textContent=k;$('obp').textContent=fx(p,2);
  const rows=[];for(let m=0;m<(1<<n);m++){let c=0;for(let i=0;i<n;i++)if(m>>(n-1-i)&1)c++;if(c===k)rows.push(m)}
  const one=p**k*q**(n-k);
  $('confs').innerHTML=rows.map(m=>`<div class="cf">${Array.from({length:n},(_,i)=>`<i class="${m>>(n-1-i)&1?'s':'e'}"></i>`).join('')}<span>${[pw('p',k),pw('(1 − p)',n-k)].filter(Boolean).join(' ')||'1'}</span></div>`).join('');
  $('ccalc').innerHTML=`${rows.length} configuration${rows.length>1?'s':''} = ${NK('C',n,k)} &nbsp;·&nbsp; chacune : ${fx(p,2)}<sup>${k}</sup> × ${fx(q,2)}<sup>${n-k}</sup> ≈ ${fx(one,4)} &nbsp;·&nbsp; <b>P(X = ${k}) ≈ ${rows.length} × ${fx(one,4)} ≈ ${fx(rows.length*one,4)}</b>`}
['bn','bk','bp'].forEach(id=>$(id).oninput=upa);upa();

/* b : loi binomiale */
let lt='eq';
const pmf=(n,p,k)=>comb(n,k)*p**k*(1-p)**(n-k);
const sel=(t,k,x)=>t==='eq'?x===k:t==='le'?x<=k:x>=k;
const fb=fig('f32b',(W,H,m)=>{const n=+$('ln').value,p=+$('lp').value/100,k=+$('lk').value,P=Array.from({length:n+1},(_,x)=>pmf(n,p,x)),mx=Math.max(...P)*1.18,pl=40,pr=10,pt=24,pb=34,bw=(W-pl-pr)/(n+1),X=x=>pl+(x+.5)*bw,Y=v=>pt+(1-v/mx)*(H-pt-pb);let s='';
  [0,mx/2].forEach(t=>s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(t)}" y2="${Y(t)}" stroke="${C.line}"/>`+txt(pl-6,Y(t)+4,fx(t,2),{a:'end',fs:11,c:C.mute}));
  P.forEach((v,x)=>{const on=sel(lt,k,x);s+=`<rect x="${X(x)-bw*.38}" y="${Y(v)}" width="${bw*.76}" height="${Y(0)-Y(v)}" fill="${on?C.org:C.ink}" opacity="${on?1:.3}" rx="2"/>`;if(n<=12||x%2===0)s+=txt(X(x),H-14,x,{a:'middle',fs:12,w:700});if(on&&n<=12)s+=txt(X(x),Y(v)-6,fx(v,3),{a:'middle',fs:11,w:700,c:C.org,halo:1})});
  const mu=n*p,xm=pl+(mu+.5)*bw;s+=`<line x1="${xm}" x2="${xm}" y1="${pt-10}" y2="${Y(0)}" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="7 5"/>`+txt(xm+6,pt,`E(X) = np = ${fx(mu,1)}`,{fs:12,w:700,c:C.blue,halo:1});
  return s});
function upb(){const n=+$('ln').value,p=+$('lp').value/100;$('lk').max=n;if(+$('lk').value>n)$('lk').value=n;const k=+$('lk').value;
  $('oln').textContent=n;$('olp').textContent=fx(p,2);$('olk').textContent=k;document.querySelectorAll('#lt button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.t===lt));
  let tot=0;for(let x=0;x<=n;x++)if(sel(lt,k,x))tot+=pmf(n,p,x);
  const lab={eq:`P(X = ${k})`,le:`P(X ≤ ${k})`,ge:`P(X ≥ ${k})`}[lt],extra=lt==='ge'&&k>0?` On peut aussi passer par le complément : 1 − P(X ≤ ${k-1}).`:lt==='le'?` C'est ce qu'on additionne dans la table, ligne par ligne, de 0 à ${k}.`:'';
  $('c32b').innerHTML=`<span class="fn">Figure 3.2-b</span>n = ${n}, p = ${fx(p,2)}. <b>${lab} ≈ ${fx(tot,4)}</b> : la somme des barres orange.${extra} Espérance np = ${fx(n*p,2)}, variance np(1 − p) = ${fx(n*p*(1-p),2)}.`;fb()}
['ln','lp','lk'].forEach(id=>$(id).oninput=upb);$('lt').onclick=e=>{const t=e.target.dataset.t;if(t){lt=t;upb()}};upb();
}
