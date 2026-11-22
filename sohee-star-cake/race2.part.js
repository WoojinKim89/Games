// =====================================================================
//  MAGIC PARADE RACE v2  (hills, drift mini-turbo, rocket start, coins,
//  rank-based items, smart rivals that fight back)
// =====================================================================
const RACERS=[
  {k:"soi",n:"소이 공주",face:"soiface",col:"#ff7fb6",theme:"heart",crown:1,st:{spd:3,acc:3,hdl:4,pow:3}},
  {k:"jun",n:"준이 기사",face:"jun",col:"#5b8fd8",theme:"shield",st:{spd:4,acc:2,hdl:3,pow:5}},
  {k:"mom",n:"은율 인어공주",face:"eunface",col:"#36c2b4",theme:"shell",crown:1,st:{spd:3,acc:4,hdl:5,pow:2}},
  {k:"rion",n:"리온",face:"rion",col:"#c98b55",theme:"bone",st:{spd:2,acc:5,hdl:4,pow:3}},
  {k:"elsa",n:"엘사",face:"elsa",crop:[.29,.24,.2],col:"#8fd8f5",theme:"snow",st:{spd:4,acc:3,hdl:4,pow:3}},
  {k:"cind",n:"신데렐라",face:"cinderella",crop:[.57,.12,.13],col:"#ffa53d",theme:"pumpkin",st:{spd:4,acc:4,hdl:3,pow:3}},
  {k:"rainbow",n:"무지개 괴물",face:"rainbow",crop:[.5,.5,.6],col:"#b48cf0",theme:"rainbow",st:{spd:5,acc:3,hdl:3,pow:4}}
];
const RC={SEG:200,ROADW:2000,CAMH:1000,FOV:100,DRAW:180,LAPS:3,MAX:9200};
RC.CAMD=1/Math.tan(RC.FOV/2*Math.PI/180);RC.PZ=RC.CAMH*RC.CAMD;
let raceSpr=null;
function makeCanvas(w,h){const c=document.createElement("canvas");c.width=w;c.height=h;return [c,c.getContext("2d")];}
IMGS.soiface=Object.assign(new Image(),{src:IMG.soiface});
const racerImg=r=>rpgImg(r.face);
function drawFloatSprite(r){
  const [c,x]=makeCanvas(260,250);const cx=130;
  x.fillStyle="rgba(0,0,0,.3)";x.beginPath();x.ellipse(cx,236,116,14,0,0,7);x.fill();
  for(const wx of[38,222]){const wg=x.createRadialGradient(wx-6,200,4,wx,206,30);wg.addColorStop(0,"#5a4a7a");wg.addColorStop(1,"#1d1530");x.fillStyle=wg;x.beginPath();x.ellipse(wx,206,24,31,0,0,7);x.fill();
    x.strokeStyle="#ffd34d";x.lineWidth=5;x.beginPath();x.ellipse(wx,206,14,21,0,0,7);x.stroke();x.fillStyle="#ffd34d";x.beginPath();x.arc(wx,206,5,0,7);x.fill();}
  const g=x.createLinearGradient(0,90,0,230);g.addColorStop(0,shade(r.col,.45));g.addColorStop(.55,r.col);g.addColorStop(1,shade(r.col,-.35));
  x.fillStyle=g;x.strokeStyle=shade(r.col,-.55);x.lineWidth=4;
  if(r.theme==="pumpkin"){x.beginPath();x.ellipse(cx,160,112,72,0,0,7);x.fill();x.stroke();x.strokeStyle=shade(r.col,-.35);x.lineWidth=3;for(const k of[-60,-25,25,60]){x.beginPath();x.ellipse(cx+k*.5,160,Math.abs(k)*.55+10,70,0,0,7);x.stroke();}
    x.fillStyle="#4caf50";x.beginPath();x.moveTo(cx-6,88);x.quadraticCurveTo(cx,70,cx+14,76);x.lineTo(cx+8,92);x.fill();}
  else if(r.theme==="shell"){x.beginPath();x.moveTo(cx-120,200);x.quadraticCurveTo(cx-120,80,cx,70);x.quadraticCurveTo(cx+120,80,cx+120,200);x.closePath();x.fill();x.stroke();
    x.strokeStyle="rgba(255,255,255,.55)";x.lineWidth=4;for(let i=-4;i<=4;i++){x.beginPath();x.moveTo(cx,200);x.lineTo(cx+i*28,86+Math.abs(i)*8);x.stroke();}}
  else{x.beginPath();x.moveTo(cx-118,210);x.lineTo(cx-104,110);x.quadraticCurveTo(cx,86,cx+104,110);x.lineTo(cx+118,210);x.quadraticCurveTo(cx,226,cx-118,210);x.fill();x.stroke();}
  // glossy highlight
  x.fillStyle="rgba(255,255,255,.28)";x.beginPath();x.ellipse(cx-40,122,46,12,-.15,0,7);x.fill();
  // exhaust pipes + tail lights
  x.fillStyle="#9aa4b8";for(const ex of[cx-60,cx+60]){x.beginPath();x.roundRect(ex-9,212,18,12,4);x.fill();}
  x.fillStyle="#ff3d6e";for(const lx of[cx-92,cx+92]){x.beginPath();x.roundRect(lx-10,176,20,10,4);x.fill();}
  x.strokeStyle="#ffd34d";x.lineWidth=7;x.beginPath();x.moveTo(cx-112,196);x.quadraticCurveTo(cx,214,cx+112,196);x.stroke();
  x.fillStyle="#fff";for(let i=0;i<9;i++){x.beginPath();x.arc(cx-96+i*24,200+Math.sin(i/8*Math.PI)*8,4,0,7);x.fill();}
  x.textAlign="center";x.textBaseline="middle";const deco={heart:"💖",shield:"🛡️",shell:"🐚",bone:"🦴",snow:"❄️",pumpkin:"✨",rainbow:"🌈"}[r.theme];
  x.font="34px serif";x.fillText(deco,cx,162);x.font="20px serif";x.fillText(deco,cx-66,168);x.fillText(deco,cx+66,168);
  for(const [bx,c2] of [[cx-100,"#ff6b8b"],[cx+100,"#ffe066"]]){x.strokeStyle="#fff";x.lineWidth=2;x.beginPath();x.moveTo(bx,112);x.lineTo(bx,40);x.stroke();x.fillStyle=c2;x.beginPath();x.ellipse(bx,30,15,19,0,0,7);x.fill();x.fillStyle="rgba(255,255,255,.5)";x.beginPath();x.ellipse(bx-5,24,4,7,-.4,0,7);x.fill();}
  const im=racerImg(r);const hy=84,R=40;
  x.save();x.beginPath();x.arc(cx,hy,R+5,0,7);x.fillStyle="#fff";x.fill();x.strokeStyle=shade(r.col,-.5);x.lineWidth=4;x.stroke();x.beginPath();x.arc(cx,hy,R,0,7);x.clip();
  if(im.complete&&im.naturalWidth){if(r.crop){const [u,v,s]=r.crop;const sw=im.naturalWidth*s,sx=im.naturalWidth*u-sw/2,sy=im.naturalHeight*v-sw/2;x.drawImage(im,sx,sy,sw,sw,cx-R,hy-R,R*2,R*2);}
    else{const s=R*2.3,ar=im.naturalHeight/im.naturalWidth;x.drawImage(im,cx-s/2,hy-s*ar/2,s,s*ar);}}
  x.restore();if(r.crown){x.font="30px serif";x.fillText("👑",cx,hy-48);}if(r.k==="jun"){x.font="28px serif";x.fillText("⚔️",cx+50,hy-30);}
  return c;
}
function buildRaceSprites(){
  const S={};
  {const [c,x]=makeCanvas(440,280);const g=x.createLinearGradient(0,110,0,280);g.addColorStop(0,"#8a5fd0");g.addColorStop(1,"#4a2f8a");x.fillStyle=g;x.beginPath();x.moveTo(0,280);x.lineTo(20,110);x.lineTo(420,110);x.lineTo(440,280);x.fill();
    x.fillStyle="#ff5fa8";x.fillRect(10,96,420,18);for(let i=0;i<14;i++){x.fillStyle=i%2?"#fff":"#ffe066";x.beginPath();x.moveTo(10+i*30,114);x.lineTo(25+i*30,132);x.lineTo(40+i*30,114);x.fill();}
    x.font="32px serif";x.textAlign="center";const fc=["🙋‍♀️","👧","🧒","👦","👩","🙌","👏","🧑","👨","🎈","👶","🙋"];
    for(let r=0;r<4;r++)for(let i=0;i<9;i++)x.fillText(fc[(r*5+i*7)%fc.length],30+i*46+(r%2)*20,150+r*34);S.crowd=c;}
  {const [c,x]=makeCanvas(90,380);x.fillStyle="#3a2a5a";x.fillRect(40,70,12,310);x.fillStyle="#ffd34d";x.beginPath();x.arc(46,58,20,0,7);x.fill();
    const g=x.createRadialGradient(46,58,4,46,58,44);g.addColorStop(0,"rgba(255,250,200,.95)");g.addColorStop(1,"rgba(255,230,120,0)");x.fillStyle=g;x.beginPath();x.arc(46,58,44,0,7);x.fill();
    x.fillStyle="#ff5fa8";x.beginPath();x.moveTo(52,110);x.lineTo(86,124);x.lineTo(52,140);x.fill();S.lamp=c;}
  {const [c,x]=makeCanvas(170,340);x.strokeStyle="#fff";x.lineWidth=2;const cols=["#ff6b8b","#ffe066","#7fd6ff","#b48cf0","#7fe08a","#ffb04d","#ff9ad5"];
    for(let i=0;i<7;i++){const bx=30+(i%4)*36+(i>3?18:0),by=40+Math.floor(i/4)*52;x.beginPath();x.moveTo(85,330);x.lineTo(bx,by+26);x.stroke();const g=x.createRadialGradient(bx-8,by-10,3,bx,by,30);g.addColorStop(0,"#fff");g.addColorStop(.3,cols[i]);g.addColorStop(1,shade(cols[i],-.3));x.fillStyle=g;x.beginPath();x.ellipse(bx,by,24,30,0,0,7);x.fill();}S.balloon=c;}
  {const [c,x]=makeCanvas(220,320);x.fillStyle="#7a5a35";x.fillRect(100,210,20,110);const g=x.createRadialGradient(80,90,10,110,120,110);g.addColorStop(0,"#9be07f");g.addColorStop(1,"#2f8a3a");x.fillStyle=g;x.beginPath();x.arc(110,120,100,0,7);x.fill();
    for(let i=0;i<10;i++){x.fillStyle=["#ff9ad5","#fff","#ffe066"][i%3];x.beginPath();x.arc(40+(i*53)%150,50+(i*37)%140,8,0,7);x.fill();}S.tree=c;}
  {const [c,x]=makeCanvas(440,250);const g=x.createLinearGradient(0,40,0,170);g.addColorStop(0,"#ff86bd");g.addColorStop(1,"#e8448a");x.fillStyle=g;x.beginPath();x.roundRect(20,40,400,120,20);x.fill();x.strokeStyle="#ffd34d";x.lineWidth=10;x.stroke();
    x.fillStyle="#fff";x.font="bold 62px Jua, sans-serif";x.textAlign="center";x.textBaseline="middle";x.fillText("PARADE!",220,100);x.fillStyle="#3a2a5a";x.fillRect(70,160,16,90);x.fillRect(354,160,16,90);
    for(let i=0;i<13;i++){x.fillStyle=["#ffe066","#fff","#7fd6ff"][i%3];x.beginPath();x.arc(30+i*32,40,7,0,7);x.fill();}S.sign=c;}
  {const [c,x]=makeCanvas(150,150);const g=x.createLinearGradient(0,20,0,150);g.addColorStop(0,"#fff9c4");g.addColorStop(.4,"#ffd34d");g.addColorStop(1,"#ff9a3d");x.fillStyle=g;x.strokeStyle="#c4620a";x.lineWidth=6;x.beginPath();x.roundRect(12,30,126,108,16);x.fill();x.stroke();
    x.fillStyle="rgba(255,255,255,.5)";x.beginPath();x.roundRect(22,38,50,20,8);x.fill();x.font="bold 70px Jua,sans-serif";x.textAlign="center";x.textBaseline="middle";x.fillStyle="#fff";x.strokeStyle="#c4620a";x.lineWidth=6;x.strokeText("?",75,88);x.fillText("?",75,88);S.box=c;}
  {const [c,x]=makeCanvas(90,90);const g=x.createRadialGradient(35,30,4,45,45,44);g.addColorStop(0,"#fff");g.addColorStop(.3,"#ffe066");g.addColorStop(1,"#e0a100");x.fillStyle=g;x.beginPath();for(let i=0;i<10;i++){const rr=i%2?18:42,a=-Math.PI/2+i*Math.PI/5;x.lineTo(45+Math.cos(a)*rr,47+Math.sin(a)*rr);}x.closePath();x.fill();x.strokeStyle="#fff";x.lineWidth=3;x.stroke();S.coin=c;}
  {const [c,x]=makeCanvas(200,150);x.font="120px serif";x.textAlign="center";x.textBaseline="middle";x.globalAlpha=.9;x.fillText("💨",100,80);S.fart=c;}
  {const [c,x]=makeCanvas(160,90);x.fillStyle="rgba(120,60,20,.75)";x.beginPath();x.ellipse(80,55,76,30,0,0,7);x.fill();x.fillStyle="rgba(255,255,255,.35)";x.beginPath();x.ellipse(60,48,26,8,0,0,7);x.fill();x.font="34px serif";x.textAlign="center";x.fillText("🥤",120,40);S.spill=c;}
  {const [c,x]=makeCanvas(1000,420);x.fillStyle="#3a2a5a";x.fillRect(40,60,50,360);x.fillRect(910,60,50,360);const g=x.createLinearGradient(0,30,0,130);g.addColorStop(0,"#ff86bd");g.addColorStop(1,"#c4467e");x.fillStyle=g;x.beginPath();x.roundRect(20,30,960,110,18);x.fill();
    for(let i=0;i<24;i++)for(let j=0;j<2;j++){x.fillStyle=(i+j)%2?"#fff":"#2b1f40";x.fillRect(60+i*36,140+j*18,36,18);}
    x.fillStyle="#fff";x.font="bold 70px Jua,sans-serif";x.textAlign="center";x.textBaseline="middle";x.fillText("🏁 MAGIC PARADE 🏁",500,86);
    for(let i=0;i<20;i++){x.fillStyle=["#ffe066","#7fd6ff","#fff"][i%3];x.beginPath();x.arc(40+i*48,30,8,0,7);x.fill();}S.arch=c;}
  raceSpr=S;
}
function buildBackground(W,H){
  const BW=Math.max(1200,W*2);const [far,f]=makeCanvas(BW,H*.62);
  const g=f.createLinearGradient(0,0,0,H*.62);g.addColorStop(0,"#1c1450");g.addColorStop(.5,"#6a3fa8");g.addColorStop(.85,"#ff8fc8");g.addColorStop(1,"#ffc4dc");f.fillStyle=g;f.fillRect(0,0,BW,H*.62);
  for(let i=0;i<90;i++){f.fillStyle=`rgba(255,255,255,${.3+Math.random()*.6})`;f.fillRect(Math.random()*BW,Math.random()*H*.3,1.5+Math.random()*1.5,1.5+Math.random()*1.5);}
  f.fillStyle="#fff6c8";f.beginPath();f.arc(BW*.15,H*.1,26,0,7);f.fill();f.fillStyle="#1c1450";f.beginPath();f.arc(BW*.15+12,H*.1-6,22,0,7);f.fill();
  const [mid,m]=makeCanvas(BW,H*.62);const base=H*.62;m.fillStyle="#5a3a9a";
  const castle=(cx,s)=>{m.fillRect(cx-90*s,base-120*s,180*s,120*s);m.fillRect(cx-130*s,base-170*s,40*s,170*s);m.fillRect(cx+90*s,base-170*s,40*s,170*s);m.fillRect(cx-25*s,base-210*s,50*s,100*s);
    for(const[a,b,w]of[[-110,-170,25],[110,-170,25],[0,-210,32]]){m.beginPath();m.moveTo(cx+(a-w)*s,base+b*s);m.lineTo(cx+a*s,base+(b-60)*s);m.lineTo(cx+(a+w)*s,base+b*s);m.fill();}
    m.fillStyle="#ffe9a8";for(const[a,b]of[[-110,-140],[110,-140],[-8,-180],[8,-180],[-50,-70],[50,-70]])m.fillRect(cx+a*s-3*s,base+b*s,7*s,12*s);m.fillStyle="#5a3a9a";};
  castle(BW*.5,1.1);castle(BW*.5+BW/2,1.1);
  const wheel=(cx,r)=>{m.strokeStyle="#7a5ac0";m.lineWidth=4;m.beginPath();m.arc(cx,base-r-20,r,0,7);m.stroke();for(let i=0;i<12;i++){const a=i*Math.PI/6;m.beginPath();m.moveTo(cx,base-r-20);m.lineTo(cx+Math.cos(a)*r,base-r-20+Math.sin(a)*r);m.stroke();
    m.fillStyle=["#ff6b8b","#ffe066","#7fd6ff"][i%3];m.fillRect(cx+Math.cos(a)*r-6,base-r-20+Math.sin(a)*r,12,12);}m.beginPath();m.moveTo(cx-30,base);m.lineTo(cx,base-r-20);m.lineTo(cx+30,base);m.stroke();};
  wheel(BW*.18,90);wheel(BW*.18+BW/2,90);
  m.strokeStyle="#6a4ab0";m.lineWidth=5;m.beginPath();for(let xx=0;xx<BW;xx+=8){const y=base-70-Math.sin(xx/70)*40-Math.sin(xx/23)*10;xx?m.lineTo(xx,y):m.moveTo(xx,y);}m.stroke();
  for(let xx=0;xx<BW;xx+=40){m.beginPath();m.moveTo(xx,base);m.lineTo(xx,base-70-Math.sin(xx/70)*40-Math.sin(xx/23)*10);m.stroke();}
  const [near,n]=makeCanvas(BW,H*.62);n.fillStyle="#3f7a4a";n.beginPath();n.moveTo(0,base);for(let xx=0;xx<=BW;xx+=30)n.lineTo(xx,base-18-Math.sin(xx/90)*14-Math.random()*6);n.lineTo(BW,base);n.fill();
  for(let i=0;i<40;i++){const xx=Math.random()*BW;n.fillStyle="#2f6a3a";n.beginPath();n.arc(xx,base-26,14+Math.random()*12,0,7);n.fill();}
  return {far,mid,near,BW};
}
function buildTrack(){
  const segs=[];let lastY=0;const ease=(a,b,p)=>a+(b-a)*((-Math.cos(p*Math.PI)/2)+.5);
  const road=(e,h,l,c,hill)=>{const sY=lastY,eY=sY+hill*RC.SEG,tot=e+h+l;let n=0;
    const push=cv=>{n++;const y=ease(sY,eY,n/tot);segs.push({i:segs.length,curve:cv,y1:lastY,y2:y,spr:[]});lastY=y;};
    for(let i=0;i<e;i++)push(ease(0,c,i/e));for(let i=0;i<h;i++)push(c);for(let i=0;i<l;i++)push(ease(c,0,i/l));};
  road(30,30,30,0,0);road(25,40,25,2.5,10);road(25,25,25,0,-14);road(25,50,25,-4.5,0);road(20,20,20,3.5,8);road(20,20,20,-3.5,-8);
  road(30,50,30,0,18);road(25,40,25,5,-12);road(25,30,25,-2.5,6);road(25,40,25,3,0);road(25,30,25,-4,-6);
  road(30,40,30,0,-lastY/RC.SEG);
  const N=segs.length;
  segs.forEach((s,i)=>{s.boost=false;s.box=null;s.fart=null;s.coins=null;s.spill=null;
    if(i%10===0)s.spr.push({k:i%20?"lamp":"tree",o:-1.35});if(i%10===5)s.spr.push({k:i%20===5?"balloon":"lamp",o:1.35});
    if(i%50===22)s.spr.push({k:"crowd",o:-2.2});if(i%50===47)s.spr.push({k:"crowd",o:2.2});
    if(i%130===70)s.spr.push({k:"sign",o:i%260?-2:2});
    if(i>50&&i%80===0)s.box=[-.6,-.2,.2,.6].map(o=>({o,t:0}));
    if(i>40&&i%110===60)s.boost=(i%220===60)?-.45:.45;
    if(i>20&&i%37===0&&!s.box){const o=[-.5,0,.5][i%3];for(let k=0;k<5;k++){const t=segs[(i+k*2)%N];(t.coins=t.coins||[]).push({o,t:0});}}
    if(i>90&&i%150===100)s.spill={o:i%300===100?-.3:.35};
  });
  segs[2].spr.push({k:"arch",o:0});
  return segs;
}
function startRace(){
  mode="race";clearGame();show(null);field.className="race";hud("🏁 매직 퍼레이드 레이스");
  if(!raceSpr)buildRaceSprites();
  const sel=el(`<div class="rsel"><div class="rs-t">🏁 매직 퍼레이드 그랑프리</div><div class="rs-s">마차를 골라요!</div><div class="rs-row"></div>
    <div class="rs-help">👆 화면 <b>왼쪽/오른쪽</b>을 눌러 운전 · <b>💨 드리프트</b>를 누른 채로 커브를 돌면 불꽃 → 떼면 <b>터보!</b> · 출발! 순간 화면을 누르면 <b>로켓 스타트</b> · ⭐ 별을 모으면 더 빨라져요</div></div>`);
  field.appendChild(sel);
  const bar=n=>"■".repeat(n)+"□".repeat(5-n);
  RACERS.slice(0,4).forEach(r=>{const b=el(`<button class="pick rs-card"><canvas width="260" height="250"></canvas><b>${r.n}</b><span class="rs-st">속도 ${bar(r.st.spd)}<br>가속 ${bar(r.st.acc)}<br>핸들 ${bar(r.st.hdl)}<br>펀치 ${bar(r.st.pow)}</span></button>`);
    const c=b.querySelector("canvas");const draw=()=>{const g=c.getContext("2d");g.clearRect(0,0,260,250);g.drawImage(drawFloatSprite(r),0,0);};draw();setTimeout(draw,400);
    b.onclick=()=>{sfx.ding();sel.remove();runRace(r.k);};sel.querySelector(".rs-row").appendChild(b);});
  say("매직 퍼레이드 그랑프리! 마차를 골라요. 이번엔 친구들이 훨씬 빨라요!");
}
function runRace(pk){
  const segs=buildTrack(),N=segs.length,TL=N*RC.SEG,MAX=RC.MAX;
  raceSpr.floats={};RACERS.forEach(r=>raceSpr.floats[r.k]=drawFloatSprite(r));
  const cv=el(`<canvas class="racecv"></canvas>`);field.appendChild(cv);const x=cv.getContext("2d");
  const ui=el(`<div class="rui"><div class="r-lap">LAP 1/${RC.LAPS}</div><div class="r-coin">⭐ 0</div><div class="r-rank">7<small>등</small></div></div>`);field.appendChild(ui);
  const itemBtn=el(`<button class="r-item"><span>❔</span><small>아이템</small></button>`);field.appendChild(itemBtn);
  const punchBtn=el(`<button class="r-punch">👊<small>펀치</small><i></i></button>`);field.appendChild(punchBtn);
  const driftBtn=el(`<button class="r-drift">💨<small>드리프트</small></button>`);field.appendChild(driftBtn);
  const cd=el(`<div class="r-count"></div>`);field.appendChild(cd);
  const ban=el(`<div class="r-banner"></div>`);field.appendChild(ban);
  let W=innerWidth,H=innerHeight,dpr=1,BG=null;function fit(){dpr=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;BG=buildBackground(W,H);}fit();addEventListener("resize",fit);
  const R=RACERS.find(r=>r.k===pk),ST=R.st;
  const me={k:pk,pos:0,x:.3,speed:0,lap:1,spin:0,shield:0,boost:0,item:null,punchCD:0,steer:0,coins:0,drift:0,driftDir:0,driftCharge:0,roulette:0,uni:0,done:false,y:0};
  const top=()=>MAX*(.93+ST.spd*.025)*(1+me.coins*.012),accel=MAX*(.3+ST.acc*.06),steerRate=1.6+ST.hdl*.15;
  // grid: rivals ahead of player, staggered
  const rivals=RACERS.filter(r=>r.k!==pk).map((r,i)=>({k:r.k,n:r.n,st:r.st,z:RC.PZ+(i+1)*260,x:[-.5,.5,-.5,.5,-.5,.5][i],tx:0,speed:0,spin:0,slow:0,lap:1,done:false,item:null,itemT:3+Math.random()*4,shield:0,boost:0,coins:0}));
  let t=0,last=performance.now(),state="count",countT=4,finishOrder=[],shake=0,fireworks=[],moonT=0,lastRank=7,rocketWin=0,parts=[],skyX=0,finalShown=false;
  const fx=[];
  const segAt=z=>segs[Math.floor(((z%TL)+TL)%TL/RC.SEG)%N];
  const prog=o=>(o.lap-1)*TL+o.z;const meZ=()=>me.pos+RC.PZ;const meP=()=>({lap:me.lap+(meZ()>=TL?1:0),z:meZ()%TL});
  // input: multi-touch steering on canvas halves
  const ptr=new Map();const updSteer=()=>{let s=0;for(const v of ptr.values())s+=v;me.steer=Math.max(-1,Math.min(1,s));};
  cv.addEventListener("pointerdown",e=>{audio();cv.setPointerCapture(e.pointerId);ptr.set(e.pointerId,e.clientX<W/2?-1:1);updSteer();if(state==="count"&&countT<=.95&&countT>.55){rocketWin=1;}else if(state==="count"&&countT>.95){rocketWin=-1;}});
  cv.addEventListener("pointermove",e=>{if(ptr.has(e.pointerId)){ptr.set(e.pointerId,e.clientX<W/2?-1:1);updSteer();}});
  const up=e=>{ptr.delete(e.pointerId);updSteer();};cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up);
  const keys={};const kd=e=>{keys[e.key]=e.type==="keydown";if(e.type==="keydown"){if(e.key===" ")useItem();if(e.key==="z"||e.key==="x")punch();if(e.key==="Shift")startDrift();}else if(e.key==="Shift")endDrift();};addEventListener("keydown",kd);addEventListener("keyup",kd);
  driftBtn.addEventListener("pointerdown",e=>{e.stopPropagation();driftBtn.setPointerCapture(e.pointerId);startDrift();});driftBtn.addEventListener("pointerup",e=>{endDrift();});driftBtn.addEventListener("pointercancel",()=>endDrift());
  itemBtn.onpointerdown=e=>{e.stopPropagation();useItem();};punchBtn.onpointerdown=e=>{e.stopPropagation();punch();};
  function startDrift(){if(state!=="race"||me.spin>0||me.speed<MAX*.45)return;me.drift=1;me.driftDir=me.steer||(segAt(meZ()).curve>0?1:-1)||1;me.driftCharge=0;tone(300,.12,"sawtooth",.06,0,500);driftBtn.classList.add("on");}
  function endDrift(){driftBtn.classList.remove("on");if(!me.drift)return;me.drift=0;const lv=me.driftCharge>2.2?3:me.driftCharge>1.4?2:me.driftCharge>.7?1:0;
    if(lv){me.boost=Math.max(me.boost,[0,.6,1.1,1.6][lv]);popText(["","터보!","슈퍼 터보!","울트라 터보!!"][lv],W/2,H*.6,["","#7fd6ff","#ffb04d","#ff7ad5"][lv]);tone(500+lv*200,.3,"sawtooth",.1,0,1800);}}
  const ITEMS={heart:{e:"💖",n:"하츄핑 하트 방패"},rainbow:{e:"🌈",n:"오로라핑 무지개 부스터"},star:{e:"⭐",n:"다이아나핑 별 미사일"},moon:{e:"🌙",n:"이클립스핑 달빛 마법"},
    fart:{e:"💨",n:"리온이 방구 폭탄"},candy:{e:"🍭",n:"왕 사탕 폭탄"},triple:{e:"🌈🌈🌈",n:"트리플 부스터"},unicorn:{e:"🦄",n:"무지개 유니콘 돌진"}};
  const pool=rank=>rank<=2?["heart","fart","star","heart","fart"]:rank<=4?["star","rainbow","candy","heart","moon"]:rank<=6?["rainbow","triple","moon","candy","star"]:["unicorn","triple","moon","unicorn","rainbow"];
  function popText(txt,sx,sy,col="#fff"){fx.push({txt,x:sx,y:sy,l:1.2,col});}
  function banner(txt){ban.textContent=txt;ban.classList.remove("go");void ban.offsetWidth;ban.classList.add("go");}
  function setItem(k){me.item=k;itemBtn.querySelector("span").textContent=k?ITEMS[k].e:"❔";itemBtn.classList.toggle("ready",!!k);}
  function rankOf(){const all=[{k:pk,p:me.done?1e12-finishOrder.indexOf(pk):prog(meP())},...rivals.map(r=>({k:r.k,p:r.done?1e12-finishOrder.indexOf(r.k):prog(r)}))].sort((a,b)=>b.p-a.p);return all.findIndex(a=>a.k===pk)+1;}
  function hitRacer(r,why,big){if(r.shield>0){r.shield=0;return;}r.spin=big?1.8:1.3;r.slow=1.2;r.coins=Math.max(0,r.coins-3);shake=.25;tone(160,.2,"square",.12,0,80);if(why)popText(why,W/2,H*.38,"#ffe066");}
  function hitMe(why){if(me.uni>0)return;if(me.shield>0){me.shield=0;popText("💖 막았다!",W/2,H*.6,"#ff9ad5");tone(900,.15,"triangle",.12);return;}
    me.spin=1.3;me.drift=0;me.coins=Math.max(0,me.coins-3);shake=.35;popText(why,W/2,H*.55,"#fff");tone(150,.25,"square",.13,0,70);say(["으앗!","아야!","빙글빙글~"][Math.floor(Math.random()*3)]);}
  function aheadOf(p){let best=null,bd=1e9;for(const r of rivals){const d=prog(r)-p;if(d>0&&d<bd){bd=d;best=r;}}return best;}
  function useItem(){
    const k=me.item;if(!k||state!=="race"||me.roulette>0)return;setItem(null);say(ITEMS[k].n+"!");[784,1047,1319].forEach((f,i)=>tone(f,.12,"triangle",.12,i*.05));
    if(k==="heart")me.shield=8;
    if(k==="rainbow")me.boost=Math.max(me.boost,2.4);
    if(k==="triple"){me.boost=2;setTimeout(()=>{me.boost=Math.max(me.boost,2);tone(900,.2,"sawtooth",.08,0,1600);},2000);setTimeout(()=>{me.boost=Math.max(me.boost,2);tone(900,.2,"sawtooth",.08,0,1600);},4000);}
    if(k==="star"){const r=aheadOf(prog(meP()));if(r){fx.push({proj:"⭐",l:.8});setTimeout(()=>hitRacer(r,`⭐ ${r.n} 명중!`),780);}}
    if(k==="moon"){moonT=4;rivals.forEach(r=>{if(prog(r)>prog(meP())-500)r.slow=4;});}
    if(k==="fart"){const s=segAt(meZ()-RC.SEG*4);s.fart={o:me.x,t:20};popText(fart(),W/2,H*.62,"#c98b55");}
    if(k==="candy"){rivals.forEach(r=>{const d=prog(r)-prog(meP());if(d>-800&&d<5000)setTimeout(()=>hitRacer(r,"🍭 사탕 폭탄 쾅!"),300);});shake=.35;}
    if(k==="unicorn"){me.uni=4;me.boost=4;banner("🦄 유니콘 돌진!");}
  }
  function punch(){
    if(me.punchCD>0||state!=="race")return;me.punchCD=1.5;punchBtn.classList.remove("cool");void punchBtn.offsetWidth;punchBtn.classList.add("cool");
    let hit=false;for(const r of rivals){const d=prog(r)-prog(meP());if(d>-500&&d<900&&Math.abs(r.x-me.x)<.8){hit=true;r.x+=(r.x>=me.x?1:-1)*(.4+ST.pow*.12);if(ST.pow>=r.st.pow||Math.random()<.5)hitRacer(r,"👊 쾅! 퍼레이드 펀치!");else{popText("버텼다!",W/2,H*.45);}}}
    hit?sfx.slap():(tone(300,.08,"sine",.1,0,200),popText("휙!",W/2,H*.6));
  }
  function rivalUseItem(r,rank){
    const k=pool(rank)[Math.floor(Math.random()*5)];const pr=prog(r);
    if(k==="heart")r.shield=6;else if(k==="rainbow"||k==="triple"||k==="unicorn")r.boost=k==="unicorn"?3.5:2;
    else if(k==="fart"){const s=segAt(r.z-RC.SEG*3);s.fart={o:r.x,t:18};}
    else if(k==="star"||k==="candy"||k==="moon"){
      const meAhead=prog(meP())>pr&&prog(meP())-pr<6000;const tgt=aheadOf(pr);
      if(meAhead&&(!tgt||prog(meP())<prog(tgt)||Math.random()<.6)){setTimeout(()=>hitMe(`${r.n}의 ${ITEMS[k].e} 공격!`),500);fx.push({incoming:ITEMS[k].e,l:.5});}
      else if(tgt)hitRacer(tgt,null);}
  }
  function update(dt){
    t+=dt;if(shake>0)shake-=dt;if(moonT>0)moonT-=dt;
    if(state==="count"){countT-=dt;const n=Math.ceil(countT-1);const txt=n>0?String(n):"출발!";if(cd.textContent!==txt&&countT>0){cd.textContent=txt;cd.classList.remove("go");void cd.offsetWidth;cd.classList.add("go");
        if(n>0){tone(660,.2,"square",.1);say(String(n));}else{tone(1320,.4,"square",.12);say("출발!");}}
      if(countT<=0){state="race";cd.textContent="";if(rocketWin===1){me.boost=1.5;me.speed=MAX*.6;banner("🚀 로켓 스타트!");}else if(rocketWin===-1){me.spin=.9;popText("너무 빨리 눌렀어요!",W/2,H*.5);}}
      for(const r of rivals){r.speed=0;}return;}
    for(const k of["spin","shield","boost","punchCD","uni"])me[k]=Math.max(0,me[k]-dt);
    if(me.roulette>0){me.roulette-=dt;itemBtn.querySelector("span").textContent=Object.values(ITEMS)[Math.floor(t*14)%8].e;if(me.roulette<=0){setItem(me.pending);tone(1200,.1,"square",.1);}}
    let steer=me.steer;if(keys.ArrowLeft)steer=-1;if(keys.ArrowRight)steer=1;
    const seg=segAt(meZ());const sp=me.speed/MAX;
    const tp=me.boost>0?top()*1.35:top();
    if(me.spin>0)me.speed=Math.max(0,me.speed-MAX*1.4*dt);else if(me.speed<tp)me.speed=Math.min(tp,me.speed+accel*dt);else me.speed=Math.max(tp,me.speed-MAX*.8*dt);
    const off=Math.abs(me.x)>1.02;if(off&&me.uni<=0){me.speed=Math.max(MAX*.38,me.speed-MAX*1.6*dt);if(Math.random()<.5)parts.push({x:W/2+(Math.random()-.5)*120,y:H-40,vx:(Math.random()-.5)*80,vy:-60-Math.random()*60,l:.6,c:"rgba(160,120,60,.7)",r:6});}
    // steering + drift
    if(me.drift){me.driftCharge+=dt*(1+Math.abs(steer)*.6);const lv=me.driftCharge>2.2?3:me.driftCharge>1.4?2:me.driftCharge>.7?1:0;
      me.x+=dt*sp*(me.driftDir*1.5+steer*.7)*1.1;
      const c=["#ffffff","#5fb8ff","#ffb04d","#ff5fd0"][lv];for(let i=0;i<2;i++)parts.push({x:W/2+(Math.random()<.5?-1:1)*Math.min(W*.42,300)*.38,y:H-34,vx:(Math.random()-.5)*120,vy:-80-Math.random()*80,l:.35,c,r:3+lv});
      if(me.speed<MAX*.35)endDrift();}
    else me.x+=steer*dt*steerRate*Math.max(.35,sp);
    me.x-=dt*sp*seg.curve*.42;if(me.uni>0)me.x+=(-me.x)*dt*3;
    me.x=Math.max(-1.7,Math.min(1.7,me.x));
    me.pos+=me.speed*dt;
    if(me.pos>=TL){me.pos-=TL;me.lap++;if(me.lap>RC.LAPS&&!me.done){me.done=true;finishOrder.push(pk);finish();}else if(me.lap<=RC.LAPS){if(me.lap===RC.LAPS){banner("🔥 마지막 바퀴!");say("마지막 바퀴!");}else{banner(`LAP ${me.lap}`);say(`${me.lap}바퀴째!`);}tone(1047,.3,"triangle",.12);}}
    const ps=segAt(meZ());me.y=ps.y1+(ps.y2-ps.y1)*((meZ()%RC.SEG)/RC.SEG);
    if(ps.boost!==false&&Math.abs(ps.boost-me.x)<.35&&me.boost<.9){me.boost=1.2;tone(900,.25,"sawtooth",.08,0,1600);popText("🌈 대시 발판!",W/2,H*.55,"#7ff0ff");}
    if(ps.box)for(const b of ps.box){if(b.t<=0&&Math.abs(b.o-me.x)<.22){b.t=5;if(!me.item&&me.roulette<=0){const p=pool(rankOf());me.pending=p[Math.floor(Math.random()*p.length)];me.roulette=1.1;tone(900,.08,"square",.08);}}}
    if(ps.coins)for(const c of ps.coins){if(c.t<=0&&Math.abs(c.o-me.x)<.2){c.t=20;if(me.coins<10){me.coins++;}tone(1568,.06,"square",.06);tone(2093,.08,"square",.05,.05);}}
    if(ps.spill&&Math.abs(ps.spill.o-me.x)<.3&&me.spin<=0&&me.uni<=0&&me.shield<=0){me.spin=.8;popText("🥤 미끌!",W/2,H*.55);tone(400,.3,"sine",.1,0,120);}
    if(ps.fart&&Math.abs(ps.fart.o-me.x)<.35&&me.spin<=0){ps.fart.t=0;hitMe("💨 으악 냄새!");}
    // rivals
    const rank=rankOf();
    rivals.forEach((r,ri)=>{
      r.spin=Math.max(0,r.spin-dt);r.slow=Math.max(0,r.slow-dt);r.shield=Math.max(0,r.shield-dt);r.boost=Math.max(0,r.boost-dt);
      const gap=prog(r)-prog(meP());
      let band=gap<-1200?1.12:gap<0?1.04:gap>4000?.94:1;           // stay close & fight
      let s=MAX*(.95+r.st.spd*.022)*(1+r.coins*.012)*band;if(r.boost>0)s*=1.3;if(r.slow>0)s*=.6;if(r.spin>0)s*=.3;
      r.speed+=(s-r.speed)*Math.min(1,dt*(1.2+r.st.acc*.25));r.z+=r.speed*dt;
      if(r.z>=TL){r.z-=TL;r.lap++;if(r.lap>RC.LAPS&&!r.done){r.done=true;finishOrder.push(r.k);if(!me.done)popText(`${r.n} 골인!`,W/2,H*.3,"#ffe066");}}
      const rs=segAt(r.z);
      // racing line: aim to the inside of upcoming curve, avoid hazards, grab coins
      let look=0;for(let k=1;k<12;k++)look+=segAt(r.z+k*RC.SEG).curve;r.tx=Math.max(-.75,Math.min(.75,look*.05+Math.sin(t*.3+ri)*.25));
      for(let k=1;k<6;k++){const h=segAt(r.z+k*RC.SEG);if((h.fart&&Math.abs(h.fart.o-r.x)<.4)||(h.spill&&Math.abs(h.spill.o-r.x)<.4))r.tx=r.x>0?-.6:.6;}
      r.x+=(r.tx-r.x)*dt*(1+r.st.hdl*.2);
      if(rs.fart&&Math.abs(rs.fart.o-r.x)<.35&&r.spin<=0){rs.fart.t=0;hitRacer(r,Math.abs(gap)<4000?`💨 ${r.n} 냄새 공격 성공!`:null);}
      if(rs.box&&!r.item&&rs.box.some(b=>b.t<=0&&Math.abs(b.o-r.x)<.3)){r.item=1;r.itemT=1+Math.random()*3;}
      if(r.item){r.itemT-=dt;if(r.itemT<=0){r.item=null;const rr=[...rivals,{k:pk}].length;rivalUseItem(r,Math.min(7,1+rivals.filter(q=>prog(q)>prog(r)).length+(prog(meP())>prog(r)?1:0)));}}
      if(rs.coins&&r.coins<10&&Math.random()<dt*2)r.coins++;
      // body contact with player
      if(Math.abs(gap)<RC.SEG*1.3&&Math.abs(r.x-me.x)<.42){
        if(me.uni>0||me.boost>0&&me.shield>0){hitRacer(r,"💥 돌진!",true);}
        else if(me.shield>0){hitRacer(r,"💖 방패로 튕겼다!");}
        else{const push=(r.st.pow-ST.pow)*.05;me.speed*=.8;r.speed*=.9;const dir=r.x>=me.x?1:-1;r.x+=dir*(.18-push);me.x-=dir*(.18+push);shake=.15;tone(200,.08,"square",.1);}}
    });
    segs.forEach(s=>{if(s.box)s.box.forEach(b=>b.t=Math.max(0,b.t-dt));if(s.coins)s.coins.forEach(c=>c.t=Math.max(0,c.t-dt));if(s.fart&&(s.fart.t-=dt)<=0)s.fart=null;});
    const nr=rankOf();if(nr!==lastRank&&state==="race"){if(nr<lastRank){popText(`⬆ ${nr}등!`,W*.78,H*.22,"#7fe08a");tone(880,.1,"triangle",.08);}else popText(`⬇ ${nr}등`,W*.78,H*.22,"#ff8a8a");lastRank=nr;}
    const rk=ui.querySelector(".r-rank");rk.innerHTML=`${nr}<small>등</small>`;rk.className="r-rank r"+Math.min(nr,4);
    ui.querySelector(".r-lap").textContent=`LAP ${Math.min(me.lap,RC.LAPS)}/${RC.LAPS}`;ui.querySelector(".r-coin").textContent=`⭐ ${me.coins}`;
    skyX+=seg.curve*sp*dt*40;
    if(Math.random()<dt*1.6)fireworks.push({x:Math.random()*W,y:H*(.05+Math.random()*.25),l:1,c:["#ff6b8b","#ffe066","#7fd6ff","#b48cf0","#7fe08a"][Math.floor(Math.random()*5)]});
    fireworks.forEach(f=>f.l-=dt*.8);fireworks=fireworks.filter(f=>f.l>0);
    for(let i=fx.length-1;i>=0;i--){fx[i].l-=dt;if(fx[i].l<=0)fx.splice(i,1);}
    for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.l-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=300*dt;if(p.l<=0)parts.splice(i,1);}
    if(me.boost>0)for(let i=0;i<3;i++)parts.push({x:W/2+(i-1)*30+(Math.random()-.5)*10,y:H-30,vx:(Math.random()-.5)*40,vy:60+Math.random()*80,l:.3,c:["#ff6b8b","#ffb04d","#ffe066"][i],r:7});
  }
  function finish(){
    state="end";const place=finishOrder.indexOf(pk)+1;say(place===1?`우승! ${R.n} 1등! 대단해!`:`${place}등! 다시 도전해서 1등 해보자!`);sfx.yay();if(place===1)confetti();
    banner(place===1?"🏆 1등!!":`${place}등 골인!`);
    setTimeout(()=>{const order=[...finishOrder];const rest=[{k:pk},...rivals].filter(z=>!order.includes(z.k)).sort((a,b)=>prog(b.k===pk?meP():b)-prog(a.k===pk?meP():a)).map(z=>z.k);order.push(...rest);
      const pod=el(`<div class="podium"><div class="pd-t">${place===1?"🏆 우승!":`🎉 ${place}등!`}</div><div class="pd-row"></div><div class="pd-list">${order.map((k,i)=>`<span class="${k===pk?"me":""}">${i+1}. ${RACERS.find(z=>z.k===k).n}</span>`).join("")}</div></div>`);
      order.slice(0,3).forEach((k,i)=>{const box=el(`<div class="pd-p p${i+1}"><img src="${raceSpr.floats[k].toDataURL()}"><b>${["🥇","🥈","🥉"][i]} ${RACERS.find(z=>z.k===k).n}</b><div class="pd-s"></div></div>`);pod.querySelector(".pd-row").appendChild(box);});
      field.appendChild(pod);},1800);
    timers.push(setTimeout(()=>win(place===1?`${R.n}가 매직 퍼레이드 그랑프리에서 우승했어요! 🏆`:`${R.n} ${place}등! 다시 도전해서 1등을 노려봐요!`),6000));
  }
  // ---------- render ----------
  function project(wx,wy,wz,camX,camY,camZ){const cz=wz-camZ;const sc=RC.CAMD/cz;return {x:Math.round(W/2+sc*(wx-camX)*W/2),y:Math.round(H/2-sc*(wy-camY)*H/2),w:Math.round(sc*RC.ROADW*W/2),sc,cz};}
  function quad(x1,y1,w1,x2,y2,w2,c){x.fillStyle=c;x.beginPath();x.moveTo(x1-w1,y1+.6);x.lineTo(x2-w2,y2-.6);x.lineTo(x2+w2,y2-.6);x.lineTo(x1+w1,y1+.6);x.closePath();x.fill();}
  function render(){
    x.setTransform(dpr,0,0,dpr,0,0);const sx=shake>0?(Math.random()-.5)*14:0,sy=shake>0?(Math.random()-.5)*10:0;x.translate(sx,sy);
    // parallax background
    const hz=H/2-me.y*.0;const bgY=H/2-BG.far.height+20;
    const lay=(c,f)=>{const ox=((-skyX*f)%BG.BW+BG.BW)%BG.BW;x.drawImage(c,-ox,bgY);x.drawImage(c,BG.BW-ox,bgY);};
    x.fillStyle="#1c1450";x.fillRect(0,0,W,H/2);lay(BG.far,.2);
    for(const f of fireworks){x.strokeStyle=f.c;x.globalAlpha=f.l;x.lineWidth=2.5;const r=(1-f.l)*70+8;for(let k=0;k<12;k++){const a=k*.5236;x.beginPath();x.moveTo(f.x+Math.cos(a)*r*.5,f.y+Math.sin(a)*r*.5);x.lineTo(f.x+Math.cos(a)*r,f.y+Math.sin(a)*r);x.stroke();}}x.globalAlpha=1;
    lay(BG.mid,.45);lay(BG.near,.8);
    x.fillStyle="#6fc25c";x.fillRect(0,H/2+18,W,H);
    const base=segAt(me.pos),basePct=(me.pos%RC.SEG)/RC.SEG;
    let dx=-(base.curve*basePct),cxw=0,maxy=H;const camX=me.x*RC.ROADW,camY=me.y+RC.CAMH;
    for(let n=0;n<RC.DRAW;n++){
      const s=segs[(base.i+n)%N];const looped=s.i<base.i;const camZ=me.pos-(looped?TL:0);
      const p1=project(cxw,s.y1,s.i*RC.SEG,camX,camY,camZ),p2=project(cxw+dx,s.y2,s.i*RC.SEG+RC.SEG,camX,camY,camZ);
      cxw+=dx;dx+=s.curve;s.p1=p1;s.clip=maxy;s.vis=false;
      if(p1.cz<=RC.CAMD||p2.y>=p1.y||p2.y>=maxy)continue;s.vis=true;
      const alt=Math.floor(s.i/3)%2;
      x.fillStyle=alt?"#79cc63":"#6abd55";x.fillRect(0,p2.y-1,W,p1.y-p2.y+2);
      quad(p1.x,p1.y,p1.w*1.22,p2.x,p2.y,p2.w*1.22,alt?"#ff9ad5":"#ffffff");
      quad(p1.x,p1.y,p1.w*1.1,p2.x,p2.y,p2.w*1.1,alt?"#e04a5a":"#ffffff");
      quad(p1.x,p1.y,p1.w,p2.x,p2.y,p2.w,alt?"#a86ad0":"#9d5fc5");
      if(s.i<3)for(let k=0;k<8;k++){const f1=-1+k/4,f2=f1+.25;x.fillStyle=(k+s.i)%2?"#fff":"#2b1f40";x.beginPath();x.moveTo(p1.x+p1.w*f1,p1.y);x.lineTo(p2.x+p2.w*f1,p2.y);x.lineTo(p2.x+p2.w*f2,p2.y);x.lineTo(p1.x+p1.w*f2,p1.y);x.fill();}
      else if(alt){for(const l of[-1/3,1/3])quad(p1.x+p1.w*l*2,p1.y,p1.w*.025,p2.x+p2.w*l*2,p2.y,p2.w*.025,"rgba(255,255,255,.8)");quad(p1.x,p1.y,p1.w*.03,p2.x,p2.y,p2.w*.03,"#ffd34d");}
      if(s.boost!==false){const cols=["#ff6b8b","#ffb04d","#ffe066","#7fe08a","#6cc8f5","#b48cf0"];cols.forEach((c,k)=>{const f1=s.boost*2+(k-3)/6*.5,f2=f1+.5/6;x.fillStyle=c;x.beginPath();x.moveTo(p1.x+p1.w*f1/2*2,p1.y);x.lineTo(p2.x+p2.w*f1,p2.y);x.lineTo(p2.x+p2.w*f2,p2.y);x.lineTo(p1.x+p1.w*f2,p1.y);x.fill();});}
      const fog=Math.min(1,Math.pow(n/RC.DRAW,1.6))*.85;if(fog>.02){x.globalAlpha=fog;x.fillStyle="#ffb8d8";x.fillRect(0,p2.y-1,W,p1.y-p2.y+2);x.globalAlpha=1;}
      maxy=p2.y;
    }
    for(let n=RC.DRAW-1;n>0;n--){
      const s=segs[(base.i+n)%N];if(!s.vis)continue;const p=s.p1;const fog=Math.min(1,Math.pow(n/RC.DRAW,1.6))*.7;
      const spr=(img,o,worldW,yo=0)=>{const w=worldW*p.sc*W/2,h=w*img.height/img.width;const X=p.x+p.sc*o*RC.ROADW*W/2-w/2,Y=p.y-h-yo*p.sc*W/2;if(w<2||Y>=s.clip)return null;
        x.save();x.beginPath();x.rect(-50,-50,W+100,s.clip+50);x.clip();x.globalAlpha=1-fog*.8;x.drawImage(img,X,Y,w,h);x.restore();return {X,Y,w,h};};
      for(const sp of s.spr)spr(raceSpr[sp.k],sp.o,{crowd:1700,lamp:320,balloon:520,tree:760,sign:1400,arch:RC.ROADW*2.7}[sp.k]);
      if(s.spill)spr(raceSpr.spill,s.spill.o,700);
      if(s.coins)for(const c of s.coins)if(c.t<=0)spr(raceSpr.coin,c.o,180,120+Math.sin(t*5+s.i)*30);
      if(s.box)for(const b of s.box)if(b.t<=0)spr(raceSpr.box,b.o,280,40+Math.sin(t*4+b.o*3)*30);
      if(s.fart)spr(raceSpr.fart,s.fart.o,520);
      for(const r of rivals){if(segAt(r.z)!==s)continue;const img=raceSpr.floats[r.k];const w=560*p.sc*W/2,h=w*img.height/img.width;const X=p.x+p.sc*r.x*RC.ROADW*W/2-w/2,Y=p.y-h;if(Y>=s.clip||w<3)continue;
        x.save();x.globalAlpha=1-fog*.7;x.translate(X+w/2,Y+h);if(r.spin>0)x.rotate(Math.sin(t*30)*.3);x.drawImage(img,-w/2,-h,w,h);
        if(r.shield>0){x.strokeStyle="rgba(255,120,190,.8)";x.lineWidth=Math.max(2,w*.03);x.beginPath();x.ellipse(0,-h*.45,w*.6,h*.6,0,0,7);x.stroke();}
        if(r.boost>0){x.fillStyle="rgba(255,180,80,.8)";x.beginPath();x.ellipse(0,0,w*.3,h*.08,0,0,7);x.fill();}
        x.restore();
        if(w>40){x.fillStyle="#fff";x.strokeStyle="#2b1f40";x.lineWidth=3;x.font=`${Math.max(11,Math.min(16,w*.09))}px Jua,sans-serif`;x.textAlign="center";x.strokeText(r.n,X+w/2,Y-4);x.fillText(r.n,X+w/2,Y-4);}}
    }
    // player
    const img=raceSpr.floats[pk];const pw=Math.min(W*.44,310),ph=pw*img.height/img.width;const px=W/2,py=H-26+Math.sin(t*16)*(me.speed>100?1.5:0);
    for(const p of parts){x.globalAlpha=Math.min(1,p.l*2);x.fillStyle=p.c;x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill();}x.globalAlpha=1;
    x.save();x.translate(px,py);let rot=me.steer*.05;if(me.drift)rot=me.driftDir*.16;if(me.spin>0)rot=Math.sin(t*30)*.35;x.rotate(rot);
    if(me.uni>0){x.font=`${pw*.5}px serif`;x.textAlign="center";x.fillText("🦄",0,-ph*1.05);}
    x.drawImage(img,-pw/2,-ph,pw,ph);x.restore();
    if(me.shield>0){x.strokeStyle=`rgba(255,120,190,${.6+.3*Math.sin(t*8)})`;x.lineWidth=6;x.beginPath();x.ellipse(W/2,py-ph*.45,pw*.62,ph*.62,0,0,7);x.stroke();}
    if(me.speed>top()*1.05||me.uni>0){x.strokeStyle="rgba(255,255,255,.6)";x.lineWidth=2;for(let i=0;i<16;i++){const a=i/16*Math.PI*2+t;const r1=Math.min(W,H)*.32,r2=r1+50+Math.random()*80;x.beginPath();x.moveTo(W/2+Math.cos(a)*r1,H*.52+Math.sin(a)*r1*.6);x.lineTo(W/2+Math.cos(a)*r2,H*.52+Math.sin(a)*r2*.6);x.stroke();}}
    if(me.drift){const lv=me.driftCharge>2.2?3:me.driftCharge>1.4?2:me.driftCharge>.7?1:0;x.fillStyle=["#fff","#5fb8ff","#ffb04d","#ff5fd0"][lv];x.font="bold 18px Jua,sans-serif";x.textAlign="center";x.fillText(["드리프트...","터보 준비!","슈퍼 터보!","울트라!!"][lv],W/2,py-ph-14);}
    x.textAlign="center";x.textBaseline="middle";
    for(const f of fx){if(f.proj){const k=1-f.l/.8;x.font="44px serif";x.fillText(f.proj,W/2,H*.75-k*H*.4);continue;}
      if(f.incoming){const k=1-f.l/.5;x.font="54px serif";x.fillText(f.incoming,W/2,H*.2+k*H*.5);continue;}
      x.globalAlpha=Math.min(1,f.l);x.font=`bold ${Math.min(28,W*.065)}px Jua,sans-serif`;x.lineWidth=5;x.strokeStyle="#2b1f40";x.strokeText(f.txt,f.x,f.y-(1.2-f.l)*40);x.fillStyle=f.col;x.fillText(f.txt,f.x,f.y-(1.2-f.l)*40);x.globalAlpha=1;}
    if(moonT>0){x.fillStyle="rgba(20,10,60,.22)";x.fillRect(0,0,W,H);}
    // progress bar
    const bw=Math.min(W*.62,320),bx=(W-bw)/2,by=122;x.fillStyle="rgba(255,255,255,.75)";x.beginPath();x.roundRect(bx,by,bw,10,5);x.fill();
    const pp=o=>Math.min(1,((o.lap-1)*TL+o.z)/(RC.LAPS*TL));
    rivals.forEach(r=>{const f=pp(r);x.fillStyle=RACERS.find(z=>z.k===r.k).col;x.beginPath();x.arc(bx+bw*f,by+5,6,0,7);x.fill();x.strokeStyle="#fff";x.lineWidth=2;x.stroke();});
    const f=pp(meP());x.fillStyle="#ff5fa8";x.beginPath();x.arc(bx+bw*f,by+5,9,0,7);x.fill();x.strokeStyle="#fff";x.lineWidth=3;x.stroke();
  }
  function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;update(dt);render();raf=requestAnimationFrame(frame);}
  say(`${R.n} 출전! 출발! 할 때 화면을 누르면 로켓 스타트!`);raf=requestAnimationFrame(frame);
}
