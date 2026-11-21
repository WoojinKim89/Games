// =====================================================================
//  PRINCESS PARADE DRESS-UP  (Soi dresses herself; layered SVG paper doll)
// =====================================================================
function shade(hex,a){let c=hex.replace("#","");if(c.length===3)c=c.split("").map(z=>z+z).join("");let n=parseInt(c,16),r=n>>16,g=n>>8&255,b=n&255;
  const f=a<0?0:255,p=Math.abs(a);r=Math.round((f-r)*p+r);g=Math.round((f-g)*p+g);b=Math.round((f-b)*p+b);return "#"+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);}
const SKIN="#f7d9c6",SKIN_D="#e9bba3";
const motif={
  star:(x,y,s,c)=>{let p="";for(let i=0;i<10;i++){const r=i%2?s*.42:s,a=-Math.PI/2+i*Math.PI/5;p+=`${i?"L":"M"}${(x+Math.cos(a)*r).toFixed(1)} ${(y+Math.sin(a)*r).toFixed(1)}`;}return `<path d="${p}Z" fill="${c}" stroke="#fff" stroke-width="${s*.12}" stroke-opacity=".7"/>`;},
  heart:(x,y,s,c)=>`<path d="M${x} ${y+s*.8}C${x-s*1.4} ${y-s*.1} ${x-s*.6} ${y-s*1.1} ${x} ${y-s*.35}C${x+s*.6} ${y-s*1.1} ${x+s*1.4} ${y-s*.1} ${x} ${y+s*.8}Z" fill="${c}"/>`,
  flower:(x,y,s,c)=>[0,1,2,3,4].map(i=>{const a=i*1.2566;return `<circle cx="${(x+Math.cos(a)*s*.55).toFixed(1)}" cy="${(y+Math.sin(a)*s*.55).toFixed(1)}" r="${s*.48}" fill="${c}"/>`;}).join("")+`<circle cx="${x}" cy="${y}" r="${s*.3}" fill="#ffe066"/>`,
  rose:(x,y,s,c)=>`<circle cx="${x}" cy="${y}" r="${s}" fill="${c}"/><path d="M${x-s*.55} ${y}a${s*.55} ${s*.55} 0 1 1 ${s*1.1} 0a${s*.35} ${s*.35} 0 1 1 ${-s*.7} 0" fill="none" stroke="${shade(c,-.35)}" stroke-width="${s*.18}"/><path d="M${x-s*1.6} ${y+s*.6}q${s*.6} ${-s*.9} ${s*.9} ${-s*.1}" fill="#4caf50"/>`,
  snow:(x,y,s,c)=>`<g stroke="${c}" stroke-width="${s*.16}" stroke-linecap="round">${[0,1,2].map(i=>{const a=i*1.047;return `<line x1="${x-Math.cos(a)*s}" y1="${y-Math.sin(a)*s}" x2="${x+Math.cos(a)*s}" y2="${y+Math.sin(a)*s}"/>`;}).join("")}</g>`,
  pearl:(x,y,s)=>`<circle cx="${x}" cy="${y}" r="${s*.5}" fill="url(#pearlG)"/>`,
  glint:(x,y,s,c="#fff")=>`<path d="M${x} ${y-s}Q${x} ${y} ${x+s} ${y}Q${x} ${y} ${x} ${y+s}Q${x} ${y} ${x-s} ${y}Q${x} ${y} ${x} ${y-s}Z" fill="${c}"/>`,
  shell:(x,y,s,c)=>`<path d="M${x-s} ${y+s*.5}Q${x} ${y-s*1.3} ${x+s} ${y+s*.5}Z" fill="${c}"/><g stroke="${shade(c,-.3)}" stroke-width="${s*.1}">${[-.5,0,.5].map(k=>`<line x1="${x}" y1="${y+s*.5}" x2="${x+k*s}" y2="${y-s*.4}"/>`).join("")}</g>`
};
function scatter(n,seed,fn){let s=seed;const r=()=>(s=(s*16807)%2147483647)/2147483647;let out="";for(let i=0;i<n;i++){const t=r(),y=380+t*330,half=55+t*120,x=200+(r()*2-1)*half*.9;out+=fn(x,y,r());}return out;}
// ---------- dresses ----------
const DRESSES=[
  {k:"blue",n:"푸른 무도회 드레스",c:"#5aa9f0",sil:"ball",sleeve:"puff",deco:"glint",acc:"#d6ecff",choker:1},
  {k:"rose",n:"장미 공주 드레스",c:"#ff7fb6",sil:"ball",sleeve:"off",deco:"rose",acc:"#ffd1e6",tiers:3},
  {k:"ice",n:"얼음 여왕 드레스",c:"#8fd8f5",sil:"aline",sleeve:"sheer",deco:"snow",acc:"#e8fbff",cape:1},
  {k:"lav",n:"라벤더 탑 드레스",c:"#b48cf0",sil:"ball",sleeve:"puff",deco:"flower",acc:"#ffc4e6",lace:1},
  {k:"gold",n:"황금 장미 드레스",c:"#ffc94a",sil:"ball",sleeve:"off",deco:"glint",acc:"#fff0b8",tiers:3},
  {k:"rainbow",n:"무지개 유니콘 튜튜",c:"#ff9ad5",sil:"tutu",sleeve:"cap",deco:"star",acc:"#fff",rainbow:1},
  {k:"ocean",n:"바다 인어 드레스",c:"#36c2b4",sil:"aline",sleeve:"off",deco:"shell",acc:"#c6fff4",pearls:1},
  {k:"apple",n:"사과 공주 드레스",c:"#ffe066",sil:"ball",sleeve:"puff",deco:"heart",acc:"#3b6fd8",bodice:"#3b6fd8",cape2:"#e53950"},
  {k:"night",n:"별빛 밤하늘 드레스",c:"#3a4aa8",sil:"ball",sleeve:"sheer",deco:"star",acc:"#ffd34d"},
  {k:"hanbok",n:"벚꽃 한복 드레스",c:"#ffb3cf",sil:"aline",sleeve:"hanbok",deco:"flower",acc:"#ffffff",hanbok:1}
];
function dressSVG(d,col){
  const c=col||d.c,L=shade(c,.45),LL=shade(c,.7),D=shade(c,-.25),DD=shade(c,-.45),acc=d.acc;
  const id="d"+Math.floor(Math.random()*1e6);
  let defs=`<linearGradient id="${id}s" x1="0" x2="1"><stop offset="0" stop-color="${D}"/><stop offset=".3" stop-color="${c}"/><stop offset=".5" stop-color="${L}"/><stop offset=".7" stop-color="${c}"/><stop offset="1" stop-color="${D}"/></linearGradient>
    <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${L}"/><stop offset="1" stop-color="${c}"/></linearGradient>
    <linearGradient id="${id}r" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ff6b8b"/><stop offset=".2" stop-color="#ffb04d"/><stop offset=".4" stop-color="#ffe066"/><stop offset=".6" stop-color="#7fe08a"/><stop offset=".8" stop-color="#6cc8f5"/><stop offset="1" stop-color="#b48cf0"/></linearGradient>
    <pattern id="${id}g" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="4" cy="5" r="1.1" fill="#fff" opacity=".8"/><circle cx="13" cy="12" r=".8" fill="#fff" opacity=".6"/><circle cx="9" cy="16" r=".6" fill="#fff" opacity=".7"/></pattern>`;
  let back="",skirt="",bod="",sl="",front="";
  // capes behind
  if(d.cape)back+=`<path d="M150 246Q120 520 60 790L340 790Q280 520 250 246Z" fill="${LL}" opacity=".55" stroke="#fff" stroke-opacity=".7"/>`+scatter(14,7,(x,y)=>motif.snow(x+(x-200)*.5,y+40,8,"#fff"));
  if(d.cape2)back+=`<path d="M145 240Q110 520 80 770L320 770Q290 520 255 240Z" fill="${d.cape2}" stroke="${shade(d.cape2,-.4)}" stroke-width="2"/><path d="M140 240Q200 200 260 240L262 262Q200 236 138 262Z" fill="#fff"/>`;
  // skirt silhouettes
  const waist=348;
  if(d.sil==="ball"){
    const tiers=d.tiers||1;
    skirt+=`<path d="M152 ${waist}Q112 470 70 650Q56 712 78 730Q200 768 322 730Q344 712 330 650Q288 470 248 ${waist}Z" fill="url(#${id}s)" stroke="${DD}" stroke-width="2.5"/>`;
    skirt+=`<path d="M78 728Q90 748 104 734Q118 752 132 738Q146 756 162 742Q178 758 194 744Q210 760 226 744Q242 758 258 742Q274 756 288 738Q302 752 314 734Q326 748 322 730Q200 768 78 728Z" fill="${LL}" stroke="${D}" stroke-width="1.5"/>`;
    for(let i=0;i<7;i++){const x0=168+i*11,x1=86+i*38;skirt+=`<path d="M${x0} ${waist+6}Q${(x0+x1)/2+((i%2)?8:-8)} 560 ${x1} 726" stroke="${D}" stroke-opacity=".35" stroke-width="3" fill="none"/>`;}
    for(let t=1;t<tiers;t++){const y=waist+t*125;const hw=70+t*62;skirt+=`<path d="M${200-hw} ${y}Q200 ${y+40} ${200+hw} ${y}" fill="none" stroke="${LL}" stroke-width="10" stroke-linecap="round" opacity=".9"/>`+[...Array(9)].map((_,i)=>{const x=200-hw+i*hw/4;return `<circle cx="${x}" cy="${y+20*Math.sin((i/8)*Math.PI)}" r="5" fill="${acc}"/>`;}).join("");}
    skirt+=`<path d="M152 ${waist}Q112 470 70 650Q56 712 78 730Q200 768 322 730Q344 712 330 650Q288 470 248 ${waist}Z" fill="url(#${id}g)"/>`;
  }else if(d.sil==="aline"){
    skirt+=`<path d="M155 ${waist}Q132 500 96 720Q200 752 304 720Q268 500 245 ${waist}Z" fill="url(#${id}s)" stroke="${DD}" stroke-width="2.5"/>`;
    skirt+=`<path d="M155 ${waist}Q120 520 88 735Q200 772 312 735Q280 520 245 ${waist}Z" fill="${LL}" opacity=".45" stroke="#fff" stroke-opacity=".8"/>`;
    for(let i=0;i<5;i++)skirt+=`<path d="M${175+i*12} ${waist+8}L${120+i*40} 728" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>`;
    skirt+=`<path d="M155 ${waist}Q132 500 96 720Q200 752 304 720Q268 500 245 ${waist}Z" fill="url(#${id}g)"/>`;
  }else{ // tutu
    const fills=d.rainbow?["#b48cf0","#6cc8f5","#7fe08a","#ffe066","#ffb04d","#ff6b8b"]:[D,c,L,LL];
    fills.forEach((f,i)=>{const y=470+i*6-fills.length*3,w=150-i*6;let p=`M${200-30} ${waist}`;for(let k=0;k<=12;k++){const x=200-w+k*w/6;p+=`L${x} ${y+(k%2?14:0)}`;}p+=`L${200+30} ${waist}Z`;skirt+=`<path d="${p}" fill="${f}" opacity=".88" stroke="#fff" stroke-opacity=".6"/>`;});
    skirt+=`<path d="M170 ${waist}L60 470L340 470L230 ${waist}Z" fill="url(#${id}g)" opacity=".8"/>`;
  }
  // decorations on skirt
  const deco={glint:(x,y,r)=>motif.glint(x,y,4+r*5),rose:(x,y,r)=>motif.rose(x,y,7+r*3,shade(c,-.15)),snow:(x,y,r)=>motif.snow(x,y,6+r*4,"#fff"),flower:(x,y,r)=>motif.flower(x,y,6+r*3,acc),
    star:(x,y,r)=>motif.star(x,y,5+r*5,d.k==="night"?"#ffd34d":"#fff"),shell:(x,y,r)=>motif.shell(x,y,7+r*3,"#fff0f6"),heart:(x,y,r)=>motif.heart(x,y,6+r*3,"#e53950")};
  if(d.sil!=="tutu")skirt+=scatter(d.deco==="glint"?26:16,d.k.length*31+7,deco[d.deco]);
  else skirt+=[...Array(9)].map((_,i)=>deco[d.deco](90+i*27,420+((i*37)%40),.5)).join("");
  if(d.pearls)skirt+=[...Array(12)].map((_,i)=>motif.pearl(110+i*16,705+Math.sin(i)*6,9)).join("");
  // bodice
  const bc=d.bodice||c;
  if(d.hanbok){
    bod+=`<path d="M150 246Q200 236 250 246L252 340Q200 352 148 340Z" fill="#fff4f8" stroke="${DD}" stroke-width="2"/><path d="M200 246L170 300M200 246L230 300" stroke="${c}" stroke-width="8"/>
      <path d="M200 300q-26 -16 -30 4q12 8 30 -4q26 -16 30 4q-12 8 -30 -4" fill="#e85a8a"/><path d="M196 304l-10 44M204 304l10 42" stroke="#e85a8a" stroke-width="6" stroke-linecap="round"/>`;
  }else{
    bod+=`<path d="M152 262Q176 244 200 262Q224 244 248 262L252 ${waist}Q200 ${waist+14} 148 ${waist}Z" fill="${bc===c?`url(#${id}b)`:bc}" stroke="${shade(bc,-.45)}" stroke-width="2.5"/>`;
    bod+=`<path d="M152 262Q176 244 200 262Q224 244 248 262" fill="none" stroke="${d.lace?"#fff":LL}" stroke-width="${d.lace?6:4}" ${d.lace?'stroke-dasharray="2 5" stroke-linecap="round"':''}/>`;
    if(d.lace)bod+=`<path d="M200 270L200 ${waist}" stroke="#ff9ad5" stroke-width="3" stroke-dasharray="6 6"/>`+[0,1,2,3].map(i=>`<path d="M188 ${282+i*16}L212 ${290+i*16}M212 ${282+i*16}L188 ${290+i*16}" stroke="#ff9ad5" stroke-width="2.5"/>`).join("");
    bod+=`<path d="M148 ${waist-4}Q200 ${waist+10} 252 ${waist-4}L253 ${waist+10}Q200 ${waist+24} 147 ${waist+10}Z" fill="${acc}" stroke="${shade(acc,-.35)}" stroke-width="1.5"/>`;
    bod+=`<path d="M200 ${waist+6}q-28 -18 -34 4q14 10 34 -4q28 -18 34 4q-14 10 -34 -4Z" fill="${acc}" stroke="${shade(acc,-.35)}" stroke-width="1.5"/><circle cx="200" cy="${waist+6}" r="5" fill="${shade(acc,-.15)}"/>`;
  }
  // sleeves
  if(d.sleeve==="puff")sl+=[146,254].map(x=>`<ellipse cx="${x}" cy="262" rx="28" ry="22" fill="url(#${id}b)" stroke="${DD}" stroke-width="2"/><path d="M${x-20} 256q20 -14 40 0" stroke="${LL}" stroke-width="3" fill="none"/>`).join("");
  if(d.sleeve==="off")sl+=`<path d="M118 280Q200 300 282 280L284 296Q200 318 116 296Z" fill="${acc}" stroke="${shade(acc,-.35)}" stroke-width="1.5"/>`+[...Array(11)].map((_,i)=>`<circle cx="${122+i*15.6}" cy="${290+Math.sin(i/10*Math.PI)*10}" r="3" fill="#fff"/>`).join("");
  if(d.sleeve==="cap")sl+=[150,250].map(x=>`<path d="M${x-18} 252q18 -18 36 0q-4 18 -36 0Z" fill="${L}" stroke="${D}"/>`).join("");
  if(d.sleeve==="sheer")sl+=`<path d="M146 250Q120 330 112 420L132 424Q140 340 160 262Z" fill="${LL}" opacity=".5"/><path d="M254 250Q280 330 288 420L268 424Q260 340 240 262Z" fill="${LL}" opacity=".5"/>`;
  if(d.sleeve==="hanbok")sl+=[["M150 250Q118 320 104 410L134 418Q144 330 166 262Z"],["M250 250Q282 320 296 410L266 418Q256 330 234 262Z"]].map(([p])=>`<path d="${p}" fill="#fff4f8" stroke="${DD}" stroke-width="2"/>`).join("")+
     [0,1,2,3].map(i=>`<path d="M${108+i*2} ${360+i*12}L${136-i*1} ${364+i*12}M${292-i*2} ${360+i*12}L${264+i*1} ${364+i*12}" stroke="${["#ff6b8b","#ffe066","#6cc8f5","#7fe08a"][i]}" stroke-width="9"/>`).join("");
  if(d.choker)front+=`<path d="M184 222Q200 230 216 222" stroke="${D}" stroke-width="5" fill="none"/>`;
  return {defs,back,skirt,bod,sl,front};
}
// ---------- accessories ----------
const GOLD=`<linearGradient id="goldG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6b0"/><stop offset=".45" stop-color="#ffcf3a"/><stop offset="1" stop-color="#b8860b"/></linearGradient>
  <linearGradient id="silverG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#d6dde8"/><stop offset="1" stop-color="#8f9bb0"/></linearGradient>
  <radialGradient id="pearlG" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#f3eefa"/><stop offset="1" stop-color="#c9bfd8"/></radialGradient>
  <radialGradient id="gemR" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffd0dc"/><stop offset=".4" stop-color="#ff3d6e"/><stop offset="1" stop-color="#9a0030"/></radialGradient>
  <radialGradient id="gemB" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#d6f1ff"/><stop offset=".4" stop-color="#3a9cff"/><stop offset="1" stop-color="#14408f"/></radialGradient>
  <radialGradient id="gemP" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffe0f8"/><stop offset=".4" stop-color="#e05fd0"/><stop offset="1" stop-color="#7a1a7a"/></radialGradient>
  <radialGradient id="gemW" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#e8f6ff"/><stop offset="1" stop-color="#9fc8e8"/></radialGradient>
  <radialGradient id="glowG"><stop offset="0" stop-color="#fff9c4"/><stop offset=".5" stop-color="#ffe066" stop-opacity=".6"/><stop offset="1" stop-color="#ffe066" stop-opacity="0"/></radialGradient>
  <linearGradient id="iceG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#bdeaff"/><stop offset="1" stop-color="#5fb8ef"/></linearGradient>`;
const gem=(x,y,r,g)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${g})" stroke="#fff" stroke-width="1"/><circle cx="${x-r*.35}" cy="${y-r*.35}" r="${r*.28}" fill="#fff" opacity=".9"/>`;
const CROWNS=[
  {k:"none",n:"없음",svg:""},
  {k:"gold",n:"황금 왕관",svg:`<path d="M146 84L140 34L166 58L183 22L200 52L217 22L234 58L260 34L254 84Z" fill="url(#goldG)" stroke="#8a6200" stroke-width="2"/>
    <rect x="144" y="78" width="112" height="16" rx="6" fill="url(#goldG)" stroke="#8a6200" stroke-width="2"/>
    ${[[140,32],[183,20],[217,20],[260,32]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6" fill="url(#pearlG)"/>`).join("")}
    ${gem(200,62,9,"gemR")}${gem(168,70,6,"gemB")}${gem(232,70,6,"gemB")}${[156,178,200,222,244].map((x,i)=>gem(x,86,4,i%2?"gemR":"gemP")).join("")}`},
  {k:"tiara",n:"다이아 티아라",svg:`<path d="M138 92Q200 52 262 92" fill="none" stroke="url(#silverG)" stroke-width="8" stroke-linecap="round"/>
    <path d="M168 80L176 56L188 74L200 30L212 74L224 56L232 80" fill="url(#silverG)" stroke="#7a8aa8" stroke-width="1.5"/>
    ${gem(200,48,9,"gemW")}${gem(176,62,5,"gemW")}${gem(224,62,5,"gemW")}${[148,160,186,214,240,252].map((x,i)=>gem(x,[86,79,72,72,79,86][i],3.5,"gemW")).join("")}
    ${motif.glint(200,22,8)}`},
  {k:"heart",n:"하트 티아라",svg:`<path d="M140 92Q200 58 260 92" fill="none" stroke="url(#goldG)" stroke-width="7" stroke-linecap="round"/>
    ${motif.heart(200,52,18,"url(#gemP)")}${motif.heart(172,68,9,"url(#gemR)")}${motif.heart(228,68,9,"url(#gemR)")}<path d="M195 44q5 -6 10 0" stroke="#fff" stroke-width="3" fill="none"/>${[150,250].map(x=>gem(x,82,4,"gemW")).join("")}`},
  {k:"ice",n:"얼음 왕관",svg:`${[[150,86,24],[166,82,40],[183,78,52],[200,76,64],[217,78,52],[234,82,40],[250,86,24]].map(([x,y,h])=>`<path d="M${x-9} ${y}L${x} ${y-h}L${x+9} ${y}Z" fill="url(#iceG)" stroke="#fff" stroke-width="1.5" opacity=".95"/>`).join("")}
    <path d="M140 92Q200 70 260 92" fill="none" stroke="url(#iceG)" stroke-width="8"/>${motif.snow(200,46,9,"#fff")}${gem(200,80,5,"gemW")}`},
  {k:"flower",n:"꽃 화관",svg:`<path d="M134 100Q200 50 266 100" fill="none" stroke="#5aa85a" stroke-width="5"/>
    ${[[138,96,"#ff9ad5"],[156,80,"#fff"],[176,70,"#ffd34d"],[200,64,"#ff6b8b"],[224,70,"#b48cf0"],[244,80,"#fff"],[262,96,"#ff9ad5"]].map(([x,y,c],i)=>`<path d="M${x-14} ${y+4}q8 -12 14 -2" fill="#5aa85a"/>`+motif.flower(x,y,10-(i%2)*2,c)).join("")}`},
  {k:"star",n:"별 티아라",svg:`<path d="M140 92Q200 62 260 92" fill="none" stroke="url(#goldG)" stroke-width="7" stroke-linecap="round"/><circle cx="200" cy="44" r="30" fill="url(#glowG)"/>
    ${motif.star(200,46,22,"url(#goldG)")}${motif.star(166,70,9,"#ffe066")}${motif.star(234,70,9,"#ffe066")}${gem(200,48,5,"gemB")}`},
  {k:"unicorn",n:"유니콘 머리띠",svg:`<path d="M132 104Q200 40 268 104" fill="none" stroke="#ff9ad5" stroke-width="8" stroke-linecap="round"/>
    <path d="M188 66L200 0L212 66Z" fill="url(#goldG)" stroke="#a07800" stroke-width="1.5"/>${[14,28,42,56].map(y=>`<path d="M${196-y*.08} ${y}L${206+y*.08} ${y+8}" stroke="#a07800" stroke-width="2"/>`).join("")}
    <path d="M148 72L140 40L168 60Z" fill="#fff" stroke="#e0a8c8" stroke-width="2"/><path d="M252 72L260 40L232 60Z" fill="#fff" stroke="#e0a8c8" stroke-width="2"/>
    ${motif.flower(170,72,8,"#b48cf0")}${motif.flower(230,72,8,"#6cc8f5")}${motif.flower(184,78,6,"#ff9ad5")}`},
  {k:"bow",n:"큰 리본",svg:`<path d="M200 70Q150 30 140 64Q136 92 200 76Q264 92 260 64Q250 30 200 70Z" fill="#ff5fa8" stroke="#b3226a" stroke-width="2.5"/><path d="M200 74l-18 40l12 -4l6 10M200 74l18 40l-12 -4l-6 10" fill="#ff5fa8" stroke="#b3226a" stroke-width="2"/>
    <ellipse cx="200" cy="72" rx="12" ry="10" fill="#ff86bd" stroke="#b3226a" stroke-width="2"/><path d="M156 56q12 -8 26 6M244 56q-12 -8 -26 6" stroke="#ffc4e0" stroke-width="3" fill="none"/>`}
];
const NECKS=[
  {k:"none",n:"없음",svg:""},
  {k:"pearl",n:"진주 목걸이",svg:[...Array(13)].map((_,i)=>{const a=Math.PI*(.15+i*.7/12);return motif.pearl(200-Math.cos(a)*40,200+Math.sin(a)*42,10);}).join("")},
  {k:"heart",n:"하트 목걸이",svg:`<path d="M168 220Q200 262 232 220" fill="none" stroke="url(#goldG)" stroke-width="3"/>${motif.heart(200,250,10,"url(#gemR)")}<path d="M196 244q4 -4 8 0" stroke="#fff" stroke-width="2" fill="none"/>`},
  {k:"diamond",n:"다이아 목걸이",svg:`<path d="M166 220Q200 258 234 220" fill="none" stroke="url(#silverG)" stroke-width="3"/><path d="M200 238L212 250L200 272L188 250Z" fill="url(#gemW)" stroke="#8fb0d0" stroke-width="1.5"/>${motif.glint(212,240,6)}`},
  {k:"star",n:"별 목걸이",svg:`<path d="M168 220Q200 258 232 220" fill="none" stroke="url(#goldG)" stroke-width="3"/>${motif.star(200,252,11,"url(#goldG)")}`},
  {k:"choker",n:"리본 초커",svg:`<path d="M182 214Q200 224 218 214" stroke="#ff5fa8" stroke-width="7" fill="none" stroke-linecap="round"/>${gem(200,224,5,"gemP")}`}
];
const SHOES=[
  {k:"glass",n:"유리 구두",svg:[178,222].map(x=>`<path d="M${x-15} 742Q${x-14} 728 ${x} 728Q${x+14} 728 ${x+15} 742L${x+15} 750L${x-15} 750Z" fill="url(#iceG)" opacity=".85" stroke="#fff" stroke-width="2"/><path d="M${x+8} 748l4 10" stroke="#bdeaff" stroke-width="4"/>${motif.glint(x-6,734,5)}`).join("")},
  {k:"ballet",n:"발레 슈즈",svg:[178,222].map(x=>`<ellipse cx="${x}" cy="742" rx="16" ry="9" fill="#ffb3cf" stroke="#d9789e" stroke-width="2"/><path d="M${x-10} 736Q${x} 712 ${x+10} 736" stroke="#ff86bd" stroke-width="2.5" fill="none"/>${motif.flower(x,738,4,"#fff")}`).join("")},
  {k:"gold",n:"황금 구두",svg:[178,222].map(x=>`<path d="M${x-16} 744Q${x-14} 728 ${x} 728Q${x+14} 728 ${x+16} 744Z" fill="url(#goldG)" stroke="#8a6200" stroke-width="2"/>${gem(x,736,3.5,"gemR")}`).join("")},
  {k:"boots",n:"반짝 부츠",svg:[178,222].map(x=>`<path d="M${x-11} 700L${x+11} 700L${x+12} 738Q${x+18} 740 ${x+18} 750L${x-14} 750Z" fill="#fff" stroke="#d9789e" stroke-width="2"/><path d="M${x-11} 708L${x+11} 708" stroke="#ff9ad5" stroke-width="5"/>${[0,1,2].map(i=>motif.glint(x-4+i*5,720+i*8,3,"#ff9ad5")).join("")}`).join("")},
  {k:"sneaker",n:"불빛 운동화",svg:[178,222].map(x=>`<path d="M${x-16} 748Q${x-16} 730 ${x-4} 728L${x+6} 734Q${x+18} 736 ${x+18} 748Z" fill="#fff" stroke="#8a8a9a" stroke-width="2"/><rect x="${x-17}" y="745" width="35" height="6" rx="3" fill="#ff6bd0"/><circle cx="${x+10}" cy="748" r="2" fill="#7ff0ff"/>`).join("")}
];
const HANDS=[
  {k:"none",n:"없음",svg:""},
  {k:"wand",n:"별 요술봉",svg:`<line x1="282" y1="436" x2="300" y2="320" stroke="url(#goldG)" stroke-width="6" stroke-linecap="round"/><circle cx="302" cy="306" r="36" fill="url(#glowG)"/>${motif.star(302,306,22,"#ffe066")}${motif.glint(330,284,7)}${motif.glint(276,288,5)}<path d="M302 320q-14 18 -6 30M302 320q14 18 6 30" stroke="#ff9ad5" stroke-width="3" fill="none"/>`},
  {k:"scepter",n:"하트 지팡이",svg:`<line x1="282" y1="440" x2="296" y2="300" stroke="url(#goldG)" stroke-width="7" stroke-linecap="round"/>${motif.heart(298,286,22,"url(#gemP)")}<circle cx="298" cy="284" r="6" fill="#fff" opacity=".7"/>${gem(290,360,5,"gemB")}`},
  {k:"bouquet",n:"장미 꽃다발",svg:`<path d="M268 470L282 420L300 470Z" fill="#fff" stroke="#e0a8c8" stroke-width="2"/>${[[270,404,"#ff5f8a"],[292,398,"#ff9ad5"],[282,384,"#e53950"],[260,388,"#fff"],[302,382,"#ffd1e6"]].map(([x,y,c])=>motif.rose(x,y,11,c)).join("")}<path d="M276 432q-14 10 -6 22q8 -10 6 -22M288 432q14 10 6 22q-8 -10 -6 -22" fill="#ff86bd"/>`},
  {k:"balloon",n:"퍼레이드 풍선",svg:`<path d="M282 430Q300 330 320 200" stroke="#fff" stroke-width="2" fill="none"/>${motif.heart(322,170,36,"#ff5f8a")}<ellipse cx="308" cy="150" rx="8" ry="12" fill="#fff" opacity=".5" transform="rotate(-25 308 150)"/>`},
  {k:"fan",n:"레이스 부채",svg:`<path d="M282 430L240 350A90 90 0 0 1 330 344Z" fill="#fff4f8" stroke="#e0a8c8" stroke-width="2"/>${[0,1,2,3,4].map(i=>`<line x1="282" y1="430" x2="${244+i*21}" y2="${350-Math.sin(i/4*Math.PI)*12}" stroke="#ffb3cf" stroke-width="2"/>`).join("")}${[0,1,2,3,4,5].map(i=>`<circle cx="${246+i*17}" cy="${352-Math.sin(i/5*Math.PI)*12}" r="4" fill="#ff9ad5"/>`).join("")}`},
  {k:"flag",n:"퍼레이드 깃발",svg:`<line x1="282" y1="440" x2="282" y2="250" stroke="#c48a3a" stroke-width="5" stroke-linecap="round"/><path d="M284 254L348 274L284 298Z" fill="#ff6b8b"/><path d="M284 268L326 278L284 288Z" fill="#ffe066"/>${motif.star(300,276,6,"#fff")}<circle cx="282" cy="248" r="6" fill="url(#goldG)"/>`},
  {k:"lolli",n:"왕 막대사탕",svg:`<line x1="282" y1="440" x2="292" y2="320" stroke="#fff" stroke-width="6" stroke-linecap="round"/><circle cx="294" cy="296" r="30" fill="#ff9ad5" stroke="#fff" stroke-width="3"/><path d="M294 296m-22 0a22 22 0 1 1 44 0a16 16 0 1 1 -32 0a10 10 0 1 1 20 0" fill="none" stroke="#fff" stroke-width="5"/><path d="M286 330q8 8 16 0" stroke="#7fd6ff" stroke-width="6" fill="none"/>`}
];
const GLOVES=[{k:"none",n:"없음",svg:""},
  {k:"long",n:"공주 긴 장갑",svg:`<path d="M126 340Q118 380 114 418L136 424Q138 384 148 344Z" fill="#fff" stroke="#d6d0e0" stroke-width="2"/><path d="M274 340Q282 380 286 418L264 424Q262 384 252 344Z" fill="#fff" stroke="#d6d0e0" stroke-width="2"/><circle cx="120" cy="428" r="15" fill="#fff" stroke="#d6d0e0" stroke-width="2"/><circle cx="280" cy="428" r="15" fill="#fff" stroke="#d6d0e0" stroke-width="2"/>`},
  {k:"lace",n:"레이스 장갑",svg:[120,280].map(x=>`<circle cx="${x}" cy="428" r="15" fill="#fff" opacity=".85" stroke="#ffb3cf" stroke-width="2" stroke-dasharray="3 3"/><path d="M${x-14} 414Q${x} 404 ${x+14} 414" stroke="#ff9ad5" stroke-width="4" fill="none"/>`).join("")}];
const BACKS=[{k:"none",n:"없음",svg:""},
  {k:"fairy",n:"요정 날개",svg:`<defs><linearGradient id="wingG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8f8ff" stop-opacity=".9"/><stop offset=".5" stop-color="#c4a8ff" stop-opacity=".55"/><stop offset="1" stop-color="#ff9ad5" stop-opacity=".5"/></linearGradient></defs>
    <g class="wingL"><path d="M190 280Q90 140 40 210Q20 290 170 310Z" fill="url(#wingG)" stroke="#fff" stroke-width="2.5"/><path d="M180 316Q80 330 70 400Q110 440 182 336Z" fill="url(#wingG)" stroke="#fff" stroke-width="2.5"/><path d="M180 296Q110 230 60 220M176 326Q120 360 90 392" stroke="#fff" stroke-opacity=".7" stroke-width="1.5" fill="none"/></g>
    <g class="wingR"><path d="M210 280Q310 140 360 210Q380 290 230 310Z" fill="url(#wingG)" stroke="#fff" stroke-width="2.5"/><path d="M220 316Q320 330 330 400Q290 440 218 336Z" fill="url(#wingG)" stroke="#fff" stroke-width="2.5"/><path d="M220 296Q290 230 340 220M224 326Q280 360 310 392" stroke="#fff" stroke-opacity=".7" stroke-width="1.5" fill="none"/></g>
    ${motif.glint(70,220,6)}${motif.glint(330,220,6)}${motif.glint(96,386,4)}${motif.glint(304,386,4)}`},
  {k:"angel",n:"천사 날개",svg:[[-1],[1]].map(([s])=>`<g transform="translate(200 0) scale(${s} 1)">${[0,1,2,3,4].map(i=>`<path d="M-10 ${280+i*6}Q${-60-i*22} ${210+i*28} ${-150+i*12} ${230+i*36}Q${-90+i*6} ${290+i*14} -12 ${300+i*8}Z" fill="${i%2?"#ffffff":"#f3f0ff"}" stroke="#d8d0f0" stroke-width="1.5"/>`).join("")}</g>`).join("")},
  {k:"cape",n:"벨벳 망토",svg:`<path d="M146 238Q100 500 70 770L330 770Q300 500 254 238Z" fill="#a0284a" stroke="#6a1030" stroke-width="2.5"/><path d="M150 250Q120 500 100 760" stroke="#c8406a" stroke-width="6" fill="none" opacity=".6"/>
    <path d="M136 236Q200 210 264 236L268 262Q200 238 132 262Z" fill="#fff" stroke="#ddd" stroke-width="1.5"/>${[148,170,192,214,236,252].map(x=>`<ellipse cx="${x}" cy="248" rx="2.5" ry="4" fill="#222"/>`).join("")}
    <path d="M70 770Q200 790 330 770L330 756Q200 776 70 756Z" fill="#fff"/>${[90,130,170,210,250,290].map(x=>`<ellipse cx="${x}" cy="768" rx="2.5" ry="4" fill="#222"/>`).join("")}`},
  {k:"butterfly",n:"나비 날개",svg:`${[[-1],[1]].map(([s])=>`<g transform="translate(200 0) scale(${s} 1)"><path d="M-8 290Q-120 150 -170 230Q-170 300 -10 306Z" fill="#ffb04d" stroke="#6a3a00" stroke-width="3"/><path d="M-8 312Q-130 330 -130 410Q-80 440 -10 322Z" fill="#ff6b8b" stroke="#6a3a00" stroke-width="3"/><circle cx="-120" cy="230" r="14" fill="#fff" opacity=".85"/><circle cx="-90" cy="390" r="10" fill="#ffe066"/><circle cx="-150" cy="250" r="6" fill="#6a3a00"/></g>`).join("")}`}
];
const HAIRS=[{k:"none",n:"그대로",svg:""},
  {k:"long",n:"긴 웨이브",svg:`<path d="M140 100Q110 160 122 250Q100 320 124 400Q110 440 140 460Q150 380 156 300Q150 220 160 140Z" fill="#2e1d17"/><path d="M260 100Q290 160 278 250Q300 320 276 400Q290 440 260 460Q250 380 244 300Q250 220 240 140Z" fill="#2e1d17"/>
    <path d="M130 200Q118 280 130 380M270 200Q282 280 270 380" stroke="#5a3a2c" stroke-width="3" fill="none" opacity=".8"/>`},
  {k:"braids",n:"양갈래 땋기",svg:[[146],[254]].map(([x])=>`${[0,1,2,3,4,5,6].map(i=>`<ellipse cx="${x+(x<200?-16:16)+Math.sin(i)*3}" cy="${210+i*28}" rx="15" ry="17" fill="${i%2?"#3a261d":"#2e1d17"}" stroke="#1a100c" stroke-width="1.5"/>`).join("")}<path d="M${x+(x<200?-28:4)} 410q12 -10 24 0q-12 10 -24 0" fill="#ff5fa8"/>`).join("")},
  {k:"golden",n:"금빛 롱헤어",svg:`<path d="M138 96Q100 180 118 280Q96 360 128 440Q140 460 160 452Q150 360 158 280Q148 200 166 130Z" fill="#f2c14e"/><path d="M262 96Q300 180 282 280Q304 360 272 440Q260 460 240 452Q250 360 242 280Q252 200 234 130Z" fill="#f2c14e"/>
    <path d="M126 200Q116 290 132 400M274 200Q284 290 268 400" stroke="#fff1b0" stroke-width="4" fill="none" opacity=".8"/>`}
];
const STICKERS=[{k:"none",n:"없음",svg:""},{k:"blush",n:"볼터치",svg:`<ellipse cx="160" cy="158" rx="15" ry="9" fill="#ff7aa8" opacity=".35"/><ellipse cx="240" cy="158" rx="15" ry="9" fill="#ff7aa8" opacity=".35"/>`},
  {k:"stars",n:"별 스티커",svg:`${motif.star(152,148,7,"#ffe066")}${motif.star(248,150,6,"#ff9ad5")}${motif.glint(258,134,4)}`},
  {k:"hearts",n:"하트 스티커",svg:`${motif.heart(154,152,7,"#ff5f8a")}${motif.heart(246,152,6,"#ff86bd")}`},
  {k:"glitter",n:"반짝이",svg:[...Array(9)].map((_,i)=>motif.glint(150+((i*37)%100),130+((i*23)%40),2+i%3,["#fff","#ffe066","#ff9ad5"][i%3])).join("")}];
const FX=[{k:"none",n:"없음"},{k:"sparkle",n:"반짝반짝"},{k:"petals",n:"꽃잎 비"},{k:"bubbles",n:"비눗방울"},{k:"rainbow",n:"무지개"}];
const BGS=[
  {k:"parade",n:"퍼레이드 거리",svg:`<defs><linearGradient id="skyP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b1f63"/><stop offset=".55" stop-color="#7a4fb0"/><stop offset="1" stop-color="#ff9ad5"/></linearGradient></defs><rect width="400" height="800" fill="url(#skyP)"/>
    ${[...Array(30)].map((_,i)=>`<circle cx="${(i*67)%400}" cy="${(i*41)%300}" r="${1+i%3}" fill="#fff" opacity=".8"/>`).join("")}
    <g fill="#4a3a8a" opacity=".85"><rect x="140" y="250" width="120" height="250"/><rect x="120" y="200" width="40" height="300"/><rect x="240" y="200" width="40" height="300"/><path d="M116 200L140 140L164 200Z"/><path d="M236 200L260 140L284 200Z"/><path d="M170 250L200 170L230 250Z"/></g>
    <g fill="#ffe9a8" opacity=".9">${[[132,240],[262,240],[190,300],[210,300],[150,330],[250,330]].map(([x,y])=>`<rect x="${x}" y="${y}" width="10" height="16" rx="5"/>`).join("")}</g>
    ${[[60,120,"#ff6b8b"],[330,90,"#ffe066"],[300,180,"#7fd6ff"]].map(([x,y,c])=>[...Array(12)].map((_,i)=>{const a=i*.52;return `<line x1="${x}" y1="${y}" x2="${x+Math.cos(a)*30}" y2="${y+Math.sin(a)*30}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;}).join("")).join("")}
    <path d="M0 300Q100 330 200 300Q300 330 400 300" stroke="#ffe066" stroke-width="2" fill="none"/>${[...Array(9)].map((_,i)=>`<circle cx="${i*50+10}" cy="${310+Math.sin(i)*6}" r="6" fill="${["#ff6b8b","#ffe066","#7fd6ff","#7fe08a"][i%4]}"/>`).join("")}
    <rect y="560" width="400" height="240" fill="#e8c9a0"/><path d="M0 560L400 560" stroke="#c9a878" stroke-width="4"/>${[...Array(8)].map((_,i)=>`<path d="M${i*60-20} 800L${i*50+20} 560" stroke="#d9b68a" stroke-width="2"/>`).join("")}`},
  {k:"ball",n:"무도회장",svg:`<rect width="400" height="800" fill="#ffe3ef"/><path d="M0 0L80 0Q60 300 0 520Z" fill="#ff8fb8"/><path d="M400 0L320 0Q340 300 400 520Z" fill="#ff8fb8"/><path d="M0 0L400 0L400 40Q200 90 0 40Z" fill="#e8669a"/>
    <g transform="translate(200 70)"><path d="M-60 0Q0 70 60 0" stroke="url(#goldG)" stroke-width="5" fill="none"/>${[-60,-30,0,30,60].map(x=>`<line x1="${x}" y1="${x===0?40:8}" x2="${x}" y2="${x===0?70:46}" stroke="#fff" stroke-width="2"/><circle cx="${x}" cy="${x===0?74:50}" r="5" fill="url(#gemW)"/>`).join("")}</g>
    <rect y="560" width="400" height="240" fill="#fff4e0"/>${[...Array(6)].map((_,i)=>`<path d="M0 ${580+i*40}L400 ${580+i*40}" stroke="#f0dcc0"/>`).join("")}${[...Array(8)].map((_,i)=>`<path d="M${i*60} 560L${i*70-60} 800" stroke="#f0dcc0"/>`).join("")}`},
  {k:"garden",n:"꽃 정원",svg:`<rect width="400" height="800" fill="#cdeeff"/><circle cx="330" cy="90" r="40" fill="#fff6b0"/><path d="M0 520Q200 470 400 520L400 800L0 800Z" fill="#9be07f"/>
    <path d="M60 560Q60 260 200 230Q340 260 340 560" stroke="#7a5a35" stroke-width="10" fill="none"/>${[...Array(18)].map((_,i)=>{const a=Math.PI*(1-i/17);return motif.rose(200+Math.cos(a)*140,560-Math.sin(a)*320+30,11,["#ff9ad5","#fff","#ff6b8b"][i%3]);}).join("")}
    ${[...Array(26)].map((_,i)=>motif.flower((i*53)%400,600+((i*37)%180),7,["#ff9ad5","#ffe066","#fff","#b48cf0"][i%4])).join("")}`},
  {k:"stars",n:"별빛 하늘",svg:`<defs><radialGradient id="skyS" cx=".5" cy=".3" r=".9"><stop offset="0" stop-color="#4a4fb0"/><stop offset="1" stop-color="#14123a"/></radialGradient></defs><rect width="400" height="800" fill="url(#skyS)"/>
    ${[...Array(60)].map((_,i)=>`<circle cx="${(i*73)%400}" cy="${(i*131)%560}" r="${.8+i%3*.7}" fill="#fff" opacity="${.4+(i%5)*.12}"/>`).join("")}<path d="M330 80a40 40 0 1 0 30 60a32 32 0 1 1 -30 -60Z" fill="#fff6b0"/>
    <path d="M0 600Q200 560 400 600L400 800L0 800Z" fill="#2a2470"/>`}
];
const DOLL_DEF={dress:"blue",col:null,crown:"gold",neck:"pearl",shoes:"glass",hand:"wand",gloves:"none",back:"none",hair:"long",stick:"blush",fx:"sparkle",bg:"parade"};
let doll=Object.assign({},DOLL_DEF);
try{const v=JSON.parse(localStorage.getItem("dollSave")||"null");if(v)doll=Object.assign({},DOLL_DEF,v);}catch(e){}
function dollSVG(o={}){
  const s=Object.assign({},doll,o);const d=DRESSES.find(z=>z.k===s.dress)||DRESSES[0];const dr=dressSVG(d,s.col);
  const get=(list,k)=>(list.find(z=>z.k===k)||list[0]).svg;
  const shortSkirt=d.sil==="tutu";
  const legs=`<g fill="${SKIN}" stroke="${SKIN_D}" stroke-width="2">${shortSkirt?`<path d="M168 470L172 740L188 740L192 470Z"/><path d="M208 470L212 740L228 740L232 470Z"/>`:`<path d="M170 690L172 740L188 740L188 690Z"/><path d="M212 690L212 740L228 740L230 690Z"/>`}</g>`+(shortSkirt?`<g fill="#fff" opacity=".85"><rect x="170" y="560" width="20" height="170" rx="8"/><rect x="210" y="560" width="20" height="170" rx="8"/></g>`:"");
  const body=`<path d="M186 190L214 190L216 236L184 236Z" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="2"/>
    <path d="M146 246Q200 226 254 246Q262 300 248 352L152 352Q138 300 146 246Z" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="2"/>
    <path d="M150 252Q124 300 118 342Q112 384 116 420" stroke="${SKIN_D}" stroke-width="27" stroke-linecap="round" fill="none"/><path d="M150 252Q124 300 118 342Q112 384 116 420" stroke="${SKIN}" stroke-width="23" stroke-linecap="round" fill="none"/>
    <path d="M250 252Q276 300 282 342Q288 384 284 420" stroke="${SKIN_D}" stroke-width="27" stroke-linecap="round" fill="none"/><path d="M250 252Q276 300 282 342Q288 384 284 420" stroke="${SKIN}" stroke-width="23" stroke-linecap="round" fill="none"/>
    <circle cx="118" cy="428" r="15" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="2"/><circle cx="282" cy="428" r="15" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="2"/>`;
  const face=`<image href="${IMG.soiface}" x="134" y="54" width="132" height="152" preserveAspectRatio="xMidYMid slice"/>`;
  const fxs={sparkle:[...Array(14)].map((_,i)=>`<g class="tw" style="animation-delay:${(i*.23)%1.6}s">${motif.glint(30+((i*97)%340),60+((i*151)%660),5+i%4,i%3?"#fff":"#ffe066")}</g>`).join(""),
    petals:[...Array(14)].map((_,i)=>`<g class="fall" style="animation-delay:${-(i*.7)}s;transform-origin:${30+((i*89)%340)}px 0">${motif.heart(30+((i*89)%340),0,6,i%2?"#ff9ad5":"#ffc4e0")}</g>`).join(""),
    bubbles:[...Array(12)].map((_,i)=>`<circle class="rise" style="animation-delay:${-(i*.8)}s" cx="${30+((i*83)%340)}" cy="820" r="${8+i%4*4}" fill="rgba(255,255,255,.18)" stroke="#fff" stroke-opacity=".8"/>`).join(""),
    rainbow:`<g opacity=".55">${["#ff6b8b","#ffb04d","#ffe066","#7fe08a","#6cc8f5","#b48cf0"].map((c,i)=>`<path d="M${-20+i*10} 560A${220-i*10} ${220-i*10} 0 0 1 ${420-i*10} 560" stroke="${c}" stroke-width="10" fill="none"/>`).join("")}</g>`,none:""};
  const bg=(BGS.find(b=>b.k===s.bg)||BGS[0]).svg;
  return `<svg class="dollsvg" viewBox="0 0 400 800" xmlns="http://www.w3.org/2000/svg"><defs>${GOLD}${dr.defs}</defs>
    ${o.noBg?"":bg}${s.fx==="rainbow"?fxs.rainbow:""}
    <ellipse cx="200" cy="752" rx="130" ry="18" fill="rgba(0,0,0,.18)"/>
    ${get(BACKS,s.back)}${dr.back}${get(HAIRS,s.hair)}
    ${legs}${get(SHOES,s.shoes)}${body}${dr.skirt}${dr.bod}${dr.sl}${get(GLOVES,s.gloves)}${dr.front}${get(NECKS,s.neck)}
    ${face}${get(STICKERS,s.stick)}${get(CROWNS,s.crown)}${get(HANDS,s.hand)}
    ${s.fx!=="rainbow"?fxs[s.fx]||"":""}</svg>`;
}
const DCATS=[
  {k:"dress",ic:"👗",n:"드레스",list:DRESSES,thumb:"40 230 320 540"},
  {k:"crown",ic:"👑",n:"왕관",list:CROWNS,thumb:"120 -10 160 130"},
  {k:"neck",ic:"💎",n:"목걸이",list:NECKS,thumb:"150 190 100 90"},
  {k:"hand",ic:"🪄",n:"손에 들기",list:HANDS,thumb:"220 130 150 340"},
  {k:"shoes",ic:"👠",n:"구두",list:SHOES,thumb:"150 690 100 70"},
  {k:"gloves",ic:"🧤",n:"장갑",list:GLOVES,thumb:"95 320 210 130"},
  {k:"back",ic:"🦋",n:"날개·망토",list:BACKS,thumb:"20 120 360 680"},
  {k:"hair",ic:"💇‍♀️",n:"머리",list:HAIRS,thumb:"90 80 220 400"},
  {k:"stick",ic:"🌟",n:"얼굴 스티커",list:STICKERS,thumb:"130 120 140 60"},
  {k:"fx",ic:"✨",n:"마법 효과",list:FX},
  {k:"bg",ic:"🏰",n:"배경",list:BGS,thumb:"0 0 400 800"}
];
const DCOLORS=["#5aa9f0","#ff7fb6","#b48cf0","#ffc94a","#36c2b4","#ff6b6b","#8fd8f5","#3a4aa8","#ffffff","#ffb3cf"];
const FX_ICON={none:"🚫",sparkle:"✨",petals:"🌸",bubbles:"🫧",rainbow:"🌈"};
function itemThumb(cat,it){
  if(cat.k==="fx")return `<span class="dt-emo">${FX_ICON[it.k]}</span>`;
  if(it.k==="none")return `<span class="dt-emo">🚫</span>`;
  if(cat.k==="dress"){const dr=dressSVG(it);return `<svg viewBox="${cat.thumb}"><defs>${GOLD}${dr.defs}</defs>${dr.back}${dr.skirt}${dr.bod}${dr.sl}</svg>`;}
  if(cat.k==="bg")return `<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice"><defs>${GOLD}</defs>${it.svg}</svg>`;
  return `<svg viewBox="${cat.thumb}"><defs>${GOLD}</defs>${it.svg}</svg>`;
}
function startParade(){
  mode="parade";clearGame();show(null);field.className="parade";
  hud("👸 소이 공주 꾸미기");
  const w=el(`<div class="dwrap2"><div class="dstage"><div class="dollbox"></div>
      <button class="dbtnR" data-a="random">🎲<small>깜짝 변신</small></button>
      <button class="dbtnR go" data-a="go">🎉<small>퍼레이드!</small></button></div>
    <div class="dpanel"><div class="dtabs"></div><div class="dcolors"></div><div class="ditems"></div></div></div>`);
  field.appendChild(w);
  const box=w.querySelector(".dollbox"),tabs=w.querySelector(".dtabs"),items=w.querySelector(".ditems"),cols=w.querySelector(".dcolors");
  let cur=DCATS[0];
  const render=()=>{box.innerHTML=dollSVG();try{localStorage.setItem("dollSave",JSON.stringify(doll));}catch(e){}};
  function drawTabs(){tabs.innerHTML="";DCATS.forEach(c=>{const b=el(`<button class="dtab${c===cur?" on":""}"><span>${c.ic}</span><small>${c.n}</small></button>`);b.onclick=()=>{cur=c;sfx.pop();say(c.n+"!");drawTabs();drawItems();};tabs.appendChild(b);});}
  function drawItems(){
    items.innerHTML="";cur.list.forEach(it=>{const sel=doll[cur.k]===it.k;const b=el(`<button class="ditem${sel?" on":""}" aria-label="${it.n}">${itemThumb(cur,it)}<small>${it.n}</small></button>`);
      b.onclick=()=>{doll[cur.k]=it.k;if(cur.k==="dress")doll.col=null;render();drawItems();sfx.ding();tone(1568,.25,"sine",.1,.08);
        say(it.k==="none"?"없음!":`${it.n}! ${["예쁘다!","너무 잘 어울려!","반짝반짝!","공주님 같아!"][Math.floor(Math.random()*4)]}`);
        box.classList.remove("pop");void box.offsetWidth;box.classList.add("pop");};
      items.appendChild(b);});
    cols.hidden=cur.k!=="dress";cols.innerHTML="";if(cur.k==="dress")DCOLORS.forEach(c=>{const b=el(`<button class="dcol" style="background:${c}"></button>`);b.onclick=()=>{doll.col=c;render();sfx.pop();say("색깔 바꾸기!");};cols.appendChild(b);});
  }
  w.querySelector('[data-a=random]').onclick=()=>{
    const pick=l=>l[Math.floor(Math.random()*l.length)].k;
    Object.assign(doll,{dress:pick(DRESSES),col:Math.random()<.4?DCOLORS[Math.floor(Math.random()*DCOLORS.length)]:null,crown:pick(CROWNS.slice(1)),neck:pick(NECKS),shoes:pick(SHOES),hand:pick(HANDS),gloves:pick(GLOVES),back:pick(BACKS),hair:pick(HAIRS),stick:pick(STICKERS),fx:pick(FX),bg:pick(BGS)});
    render();drawItems();[523,784,1047,1568].forEach((f,i)=>tone(f,.15,"triangle",.14,i*.06));say("깜짝 변신!");box.classList.remove("spin");void box.offsetWidth;box.classList.add("spin");};
  w.querySelector('[data-a=go]').onclick=()=>paradeShow();
  render();drawTabs();drawItems();
  say("소이 공주님! 내일 퍼레이드에 입을 옷을 골라봐요! 아래에서 드레스, 왕관, 목걸이를 눌러봐요!");
}
function paradeShow(){
  const o=el(`<div class="pshow"><div class="ps-sky"></div><div class="ps-fw"></div>
    <div class="ps-float"><div class="ps-doll">${dollSVG({noBg:true})}</div>
      <svg class="ps-car" viewBox="0 0 400 200"><defs>${GOLD}<linearGradient id="carG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd1e6"/><stop offset="1" stop-color="#ff86bd"/></linearGradient></defs>
        <path d="M30 60Q200 20 370 60L350 150L50 150Z" fill="url(#carG)" stroke="#c4467e" stroke-width="4"/>
        <path d="M30 60Q200 20 370 60" stroke="url(#goldG)" stroke-width="10" fill="none"/>
        ${[...Array(12)].map((_,i)=>motif.rose(50+i*27,70+Math.sin(i)*6,12,["#fff","#ff6b8b","#ffe066"][i%3])).join("")}
        ${[90,310].map(x=>`<g class="wheel" style="transform-origin:${x}px 160px"><circle cx="${x}" cy="160" r="36" fill="#fff" stroke="url(#goldG)" stroke-width="8"/>${[0,1,2,3,4,5].map(k=>`<line x1="${x}" y1="160" x2="${x+Math.cos(k)*32}" y2="${160+Math.sin(k)*32}" stroke="#e0a100" stroke-width="4"/>`).join("")}<circle cx="${x}" cy="160" r="8" fill="url(#goldG)"/></g>`).join("")}
        ${motif.star(200,105,16,"url(#goldG)")}</svg></div>
    <div class="ps-crowd">${"🙋‍♀️👏🧒🙌👧👏🙋‍♂️🎈👨‍👩‍👧👏🧑‍🧒🙌".match(/./gu).filter(c=>c.trim()).map((c,i)=>`<span style="animation-delay:${i*.13}s">${c}</span>`).join("")}</div>
    <div class="ps-title">🎉 소이 공주님 퍼레이드! 🎉</div>
    <div class="ps-btns" hidden><button class="pick" data-a="photo">📸 사진 모드</button><button class="pick" data-a="again">👗 다시 꾸미기</button><button class="pick" data-a="world">🗺️ 마을로</button></div></div>`);
  document.body.appendChild(o);
  const fw=o.querySelector(".ps-fw");const fwT=setInterval(()=>{const f=el(`<div class="fwb" style="left:${10+Math.random()*80}%;top:${8+Math.random()*30}%;color:${["#ff6b8b","#ffe066","#7fd6ff","#b48cf0","#7fe08a"][Math.floor(Math.random()*5)]}"></div>`);fw.appendChild(f);tone(200+Math.random()*100,.25,"sawtooth",.04,0,60);setTimeout(()=>f.remove(),1200);},500);
  let mi=0;const mel=[784,784,880,784,1047,988,0,784,784,880,784,1175,1047,0,784,1568,1319,1047,988,880,0,1397,1397,1319,1047,1175,1047];
  const muT=setInterval(()=>{const n=mel[mi++%mel.length];if(n){tone(n,.22,"triangle",.09);tone(n/2,.22,"sine",.06);}},230);
  confetti();say("빠밤! 소이 공주님 퍼레이드 시작! 모두 손 흔들어 주세요!");
  setTimeout(()=>{confetti();say("우와! 소이 공주님 최고! 내일 퍼레이드도 화이팅!");o.querySelector(".ps-btns").hidden=false;
    const q=QUESTS.find(z=>z.id==="parade");if(q)rewardOverlay(completeQuest("parade"),`${q.icon} ${q.place}`);},6500);
  const close=()=>{clearInterval(fwT);clearInterval(muT);o.remove();};
  o.querySelector('[data-a=photo]').onclick=()=>{o.classList.add("photo");say("찰칵! 화면을 캡처해서 사진으로 남겨요!");tone(1200,.08,"square",.1);setTimeout(()=>tone(800,.1,"square",.1),90);};
  o.addEventListener("click",e=>{if(o.classList.contains("photo")&&!e.target.closest("button")){o.classList.remove("photo");}});
  o.querySelector('[data-a=again]').onclick=()=>{close();startParade();};
  o.querySelector('[data-a=world]').onclick=()=>{close();goWorld();};
}
