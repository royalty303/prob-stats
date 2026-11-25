/* Outils communs à toutes les pages */
new MutationObserver(()=>{for(const c of document.querySelectorAll('.stack td:not([data-l])')){let i=0,p=c;while(p=p.previousElementSibling)i+=p.colSpan;c.dataset.l=c.closest('table').rows[0].cells[i]?.textContent||''}}).observe(document,{childList:true,subtree:true})
const SITE={};
{
/* ================= utilitaires ================= */
const fr=(x,d=2)=>x.toLocaleString('fr-CA',{maximumFractionDigits:d});
const fx=(x,d)=>x.toLocaleString('fr-CA',{minimumFractionDigits:d,maximumFractionDigits:d}).replace('-','−');
const $=id=>document.getElementById(id);
const C={ink:'var(--ink)',mute:'var(--mute)',blue:'var(--blue)',org:'var(--org)',line:'var(--line)',soft:'var(--soft)',bg:'var(--bg)'};
const txt=(x,y,s,o={})=>`<text x="${x}" y="${y}" font-size="${o.fs||13}" fill="${o.c||C.ink}" text-anchor="${o.a||'start'}"${o.w?` font-weight="${o.w}"`:''}${o.halo?' stroke="var(--bg)" stroke-width="5" paint-order="stroke"':''}${o.it?' class="ann" font-style="italic"':''}>${s}</text>`;
function fig(id,draw){const s=$(id),f=()=>{const W=s.clientWidth,H=s.clientHeight;if(W)s.innerHTML=draw(W,H,W<560)};new ResizeObserver(f).observe(s);return f}
const npdf=x=>Math.exp(-x*x/2)/Math.sqrt(2*Math.PI);
const tpdf11=x=>0.38998976*(1+x*x/11)**-6;
const G={1:1.7724539,3:0.8862269};
const cpdf=(x,k)=>x**(k/2-1)*Math.exp(-x/2)/(2**(k/2)*G[k]);
const gauss=()=>{let u=0;while(!u)u=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*Math.random())};
function path(f,X,Y,a,b,n=200,cap=Infinity){let d='';for(let i=0;i<=n;i++){const x=a+(b-a)*i/n,y=f(x);if(!isFinite(y)||y>cap)continue;d+=(d?'L':'M')+X(x).toFixed(1)+','+Y(y).toFixed(1)}return d}
function area(f,X,Y,a,b){let d=`M${X(a)},${Y(0)}`;for(let i=0;i<=60;i++){const x=a+(b-a)*i/60;d+=`L${X(x).toFixed(1)},${Y(f(x)).toFixed(1)}`}return d+`L${X(b)},${Y(0)}Z`}
Object.assign(SITE,{fr,fx,$,C,txt,fig,npdf,tpdf11,cpdf,gauss,path,area});
}
