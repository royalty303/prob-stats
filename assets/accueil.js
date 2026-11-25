{
const {fr,fx,$,C,txt,fig,npdf,tpdf11,cpdf,gauss,path,area}=SITE;
/* ================= accueil ================= */
const PLAN=[
 ["1. Probabilités et analyse combinatoire",[["1.1","Notions de probabilité de base"],["1.2","Analyse combinatoire"],["1.3","Probabilités conditionnelles"]]],
 ["2. Statistiques descriptives",[["2.1","Mesures de tendance centrale"],["2.2","Mesures de dispersion"],["2.3","Mesures de position"]]],
 ["3. Variables aléatoires discrètes",[["3.1","Introduction aux variables aléatoires"],["3.2","Loi binomiale"],["3.3","Loi de Poisson"]]],
 ["4. Variables aléatoires continues",[["4.1","Introduction aux variables aléatoires continues"],["4.2","Loi normale"]]],
 ["5. Estimation de paramètres",[["5.1","Introduction aux sondages"],["5.2","Théorème central limite","5-2-theoreme-central-limite.html"],["5.3","Intervalles de confiance sur une moyenne","5-3-intervalles-moyenne.html"],["5.4","Intervalles de confiance sur une proportion","5-4-intervalles-proportion.html"]]],
 ["6. Tests d'hypothèses",[["6.1","Tests sur une moyenne et sur une proportion","6-1-tests-hypotheses.html"],["6.2","Tests du khi-deux","6-2-khi-deux.html"]]]];
$('plan').innerHTML=PLAN.map(([t,ss])=>`<div><h3>${t}</h3><ol>${ss.map(([n,l,h])=>h?`<li><a href="${h}">${n} · ${l}</a></li>`:`<li><span>${n} · ${l}</span><small>en préparation</small></li>`).join('')}</ol></div>`).join('');
{ // vignettes
  const X=x=>150+x*34,Y=y=>108-y*230;let a='';
  [-3,-2.5,-2,-1.5,-1,-.5,0,.5,1,1.5,2,2.5].forEach(x=>{const h=npdf(x+.25)*(0.85+0.3*Math.abs(Math.sin(x*7)));a+=`<rect x="${X(x)+1}" y="${Y(h)}" width="15" height="${108-Y(h)}" fill="var(--ink)"/>`});
  a+=`<path d="${path(npdf,X,Y,-4,4)}" fill="none" stroke="var(--blue)" stroke-width="2.5" stroke-dasharray="6 4"/>`;$('th1').innerHTML=a;
  const X2=x=>150+x*34,Y2=y=>108-y*230;
  $('th2').innerHTML=`<path d="${area(npdf,X2,Y2,-4,-1.645)}" fill="var(--org)" opacity=".8"/><path d="${path(npdf,X2,Y2,-4.3,4.3)}" fill="none" stroke="var(--blue)" stroke-width="2.5" stroke-dasharray="6 4"/><line x1="${X2(-2)}" x2="${X2(-2)}" y1="20" y2="108" stroke="var(--ink)" stroke-width="3"/><circle cx="${X2(-2)}" cy="20" r="5" fill="var(--ink)"/><line x1="0" x2="300" y1="108" y2="108" stroke="var(--line)"/>`;
  const o=[62,41,25,24];{const X=x=>20+x*260,lines=[[.30,.62],[.36,.70],[.18,.52],[.42,.78],[.33,.66],[.55,.92],[.27,.6]];$('th4').innerHTML=lines.map(([u,v],i)=>{const ok=u<=.5&&.5<=v;return `<line x1="${X(u)}" x2="${X(v)}" y1="${14+i*14}" y2="${14+i*14}" stroke="var(--${ok?'ink':'org'})" stroke-width="5" stroke-linecap="round"/>`}).join('')+`<line x1="${X(.5)}" x2="${X(.5)}" y1="4" y2="112" stroke="var(--blue)" stroke-width="2.5" stroke-dasharray="6 4"/>`;
 const Xp=p=>20+p*260,Yp=v=>108-v*360;let d='';for(let i=0;i<=60;i++){const p=i/60;d+=(d?'L':'M')+Xp(p)+','+Yp(p*(1-p))}$('th5').innerHTML=`<path d="${d}" fill="none" stroke="var(--blue)" stroke-width="2.5" stroke-dasharray="6 4"/><circle cx="${Xp(.5)}" cy="${Yp(.25)}" r="6" fill="var(--ink)"/><line x1="${Xp(.5)}" x2="${Xp(.5)}" y1="${Yp(.25)}" y2="108" stroke="var(--ink)" stroke-dasharray="3 3"/><line x1="0" x2="300" y1="108" y2="108" stroke="var(--line)"/>`}
  $('th3').innerHTML=o.map((v,i)=>`<rect x="${20+i*70}" y="${108-v*1.5}" width="24" height="${v*1.5}" fill="var(--ink)"/><rect x="${46+i*70}" y="${108-32.3*1.5}" width="24" height="${32.3*1.5}" fill="var(--bluesoft)" stroke="var(--blue)" stroke-width="2" stroke-dasharray="4 3"/>`).join('')+`<line x1="0" x2="300" y1="108" y2="108" stroke="var(--line)"/>`;
}
}
