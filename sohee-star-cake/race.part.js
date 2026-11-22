// =====================================================================
//  MAGIC PARADE RACE  (pseudo-3D kart racing + item battle + punches)
// =====================================================================
const RACERS=[
  {k:"soi",n:"소이 공주",face:"soiface",col:"#ff7fb6",col2:"#ffd1e6",theme:"heart",crown:1},
  {k:"jun",n:"준이 기사",face:"jun",col:"#5b8fd8",col2:"#cfe0ff",theme:"shield"},
  {k:"mom",n:"은율 인어공주",face:"eunface",col:"#36c2b4",col2:"#c6fff4",theme:"shell",crown:1},
  {k:"rion",n:"리온",face:"rion",col:"#c98b55",col2:"#fff3e0",theme:"bone"},
  {k:"elsa",n:"엘사",face:"elsa",crop:[.29,.24,.2],col:"#8fd8f5",col2:"#ffffff",theme:"snow"},
  {k:"cind",n:"신데렐라",face:"cinderella",crop:[.57,.12,.13],col:"#ffa53d",col2:"#fff0c8",theme:"pumpkin"},
  {k:"rainbow",n:"무지개 괴물",face:"rainbow",crop:[.5,.5,.6],col:"#b48cf0",col2:"#ffe066",theme:"rainbow"}
];
const RC={SEG:200,ROADW:2000,CAMH:1000,FOV:100,DRAW:170,LAPS:3};
RC.CAMD=1/Math.tan(RC.FOV/2*Math.PI/180);RC.PZ=RC.CAMH*RC.CAMD;
let raceSpr=null;
function makeCanvas(w,h){const c=document.createElement("canvas");c.width=w;c.height=h;return [c,c.getContext("2d")];}
function racerImg(r){const im=rpgImg(r.face==="soiface"?"soiface":r.face);return im;}
IMGS.soiface=Object.assign(new Image(),{src:IMG.soiface});
function drawFloatSprite(r,spin){
  const [c,x]=makeCanvas(260,250);const cx=130;
  // shadow
  x.fillStyle="rgba(0,0,0,.28)";x.beginPath();x.ellipse(cx,236,112,14,0,0,7);x.fill();
  // wheels
  for(const wx of[40,220]){x.fillStyle="#2b2340";x.beginPath();x.ellipse(wx,206,22,30,0,0,7);x.fill();x.strokeStyle="#ffd34d";x.lineWidth=5;x.beginPath();x.ellipse(wx,206,14,21,0,0,7);x.stroke();}
  // body shape per theme
  const g=x.createLinearGradient(0,90,0,230);g.addColorStop(0,shade(r.col,.35));g.addColorStop(.6,r.col);g.addColorStop(1,shade(r.col,-.3));
  x.fillStyle=g;x.strokeStyle=shade(r.col,-.5);x.lineWidth=4;
  if(r.theme==="pumpkin"){x.beginPath();x.ellipse(cx,160,110,72,0,0,7);x.fill();x.stroke();x.strokeStyle=shade(r.col,-.35);x.lineWidth=3;for(const k of[-60,-25,25,60]){x.beginPath();x.ellipse(cx+k*.5,160,Math.abs(k)*.55+10,70,0,0,7);x.stroke();}
    x.fillStyle="#4caf50";x.beginPath();x.moveTo(cx-6,88);x.quadraticCurveTo(cx,70,cx+14,76);x.lineTo(cx+8,92);x.fill();}
  else if(r.theme==="shell"){x.beginPath();x.moveTo(cx-120,200);x.quadraticCurveTo(cx-120,80,cx,70);x.quadraticCurveTo(cx+120,80,cx+120,200);x.closePath();x.fill();x.stroke();
    x.strokeStyle="rgba(255,255,255,.55)";x.lineWidth=4;for(let i=-4;i<=4;i++){x.beginPath();x.moveTo(cx,200);x.lineTo(cx+i*28,86+Math.abs(i)*8);x.stroke();}}
  else{x.beginPath();x.moveTo(cx-118,210);x.lineTo(cx-104,110);x.quadraticCurveTo(cx,86,cx+104,110);x.lineTo(cx+118,210);x.quadraticCurveTo(cx,226,cx-118,210);x.fill();x.stroke();}
  // trim
  x.strokeStyle="#ffd34d";x.lineWidth=7;x.beginPath();x.moveTo(cx-112,196);x.quadraticCurveTo(cx,214,cx+112,196);x.stroke();
  x.fillStyle="#fff";for(let i=0;i<9;i++){x.beginPath();x.arc(cx-96+i*24,200+Math.sin(i/8*Math.PI)*8,4,0,7);x.fill();}
  // theme decorations
  x.textAlign="center";x.textBaseline="middle";
  const deco={heart:"💖",shield:"🛡️",shell:"🐚",bone:"🦴",snow:"❄️",pumpkin:"✨",rainbow:"🌈"}[r.theme];
  x.font="34px serif";x.fillText(deco,cx,166);x.font="20px serif";x.fillText(deco,cx-70,170);x.fillText(deco,cx+70,170);
  // balloons / flags
  for(const [bx,c2] of [[cx-100,"#ff6b8b"],[cx+100,"#ffe066"]]){x.strokeStyle="#fff";x.lineWidth=2;x.beginPath();x.moveTo(bx,112);x.lineTo(bx,40);x.stroke();x.fillStyle=c2;x.beginPath();x.ellipse(bx,30,15,19,0,0,7);x.fill();x.fillStyle="rgba(255,255,255,.5)";x.beginPath();x.ellipse(bx-5,24,4,7,-.4,0,7);x.fill();}
  // rider head
  const im=racerImg(r);const hy=84,R=40;
  x.save();x.beginPath();x.arc(cx,hy,R+5,0,7);x.fillStyle="#fff";x.fill();x.strokeStyle=shade(r.col,-.5);x.lineWidth=4;x.stroke();
  x.beginPath();x.arc(cx,hy,R,0,7);x.clip();
  if(im.complete&&im.naturalWidth){if(r.crop){const [u,v,s]=r.crop;const sw=im.naturalWidth*s,sx=im.naturalWidth*u-sw/2,sy=im.naturalHeight*v-sw/2;x.drawImage(im,sx,sy,sw,sw,cx-R,hy-R,R*2,R*2);}
    else{const s=R*2.3,ar=im.naturalHeight/im.naturalWidth;x.drawImage(im,cx-s/2,hy-s*ar/2,s,s*ar);}}
  x.restore();
  if(r.crown){x.font="30px serif";x.fillText("👑",cx,hy-48);}
  if(r.k==="jun"){x.font="28px serif";x.fillText("⚔️",cx+50,hy-30);}
  return c;
}
function buildRaceSprites(){
  const S={};
  {const [c,x]=makeCanvas(420,260);x.fillStyle="#7a4fb0";x.fillRect(0,120,420,140);x.fillStyle="#9a6bd0";for(let r=0;r<4;r++){x.fillRect(0,130+r*32,420,6);}
    x.font="34px serif";x.textAlign="center";const fc="🙋‍♀️👧🧒👦👩🙌👏👨‍👩‍👧🧑🎈".match(/\p{Extended_Pictographic}(‍\p{Extended_Pictographic}|️)*/gu)||["🙂"];
    for(let r=0;r<4;r++)for(let i=0;i<9;i++){x.fillText(fc[(r*9+i*7)%fc.length],24+i*46+(r%2)*20,126+r*34);}
    x.fillStyle="#ffd34d";x.fillRect(0,250,420,10);S.crowd=c;}
  {const [c,x]=makeCanvas(80,360);x.fillStyle="#4a3a6a";x.fillRect(34,60,12,300);x.fillStyle="#ffd34d";x.beginPath();x.arc(40,50,24,0,7);x.fill();
    const g=x.createRadialGradient(40,50,4,40,50,40);g.addColorStop(0,"rgba(255,250,200,.95)");g.addColorStop(1,"rgba(255,230,120,0)");x.fillStyle=g;x.beginPath();x.arc(40,50,40,0,7);x.fill();S.lamp=c;}
  {const [c,x]=makeCanvas(160,320);x.strokeStyle="#fff";x.lineWidth=2;const cols=["#ff6b8b","#ffe066","#7fd6ff","#b48cf0","#7fe08a","#ffb04d"];
    for(let i=0;i<6;i++){const bx=40+(i%3)*40,by=40+Math.floor(i/3)*50;x.beginPath();x.moveTo(80,310);x.lineTo(bx,by+26);x.stroke();x.fillStyle=cols[i];x.beginPath();x.ellipse(bx,by,24,30,0,0,7);x.fill();x.fillStyle="rgba(255,255,255,.5)";x.beginPath();x.ellipse(bx-8,by-10,6,10,-.4,0,7);x.fill();}S.balloon=c;}
  {const [c,x]=makeCanvas(200,300);x.fillStyle="#7a5a35";x.fillRect(90,200,20,100);x.fillStyle="#3f9a45";x.beginPath();x.arc(100,120,90,0,7);x.fill();x.fillStyle="#5fbf5a";x.beginPath();x.arc(85,100,70,0,7);x.fill();
    for(let i=0;i<9;i++){x.fillStyle=["#ff9ad5","#fff","#ffe066"][i%3];x.beginPath();x.arc(40+(i*53)%130,60+(i*37)%120,8,0,7);x.fill();}S.tree=c;}
  {const [c,x]=makeCanvas(420,240);x.fillStyle="#ff5fa8";x.fillRect(20,40,380,120);x.strokeStyle="#ffd34d";x.lineWidth=10;x.strokeRect(20,40,380,120);
    x.fillStyle="#fff";x.font="bold 64px Jua, sans-serif";x.textAlign="center";x.textBaseline="middle";x.fillText("PARADE!",210,100);
    x.fillStyle="#4a3a6a";x.fillRect(60,160,16,80);x.fillRect(344,160,16,80);
    for(let i=0;i<12;i++){x.fillStyle=["#ffe066","#fff","#7fd6ff"][i%3];x.beginPath();x.arc(30+i*32,40,7,0,7);x.fill();}S.sign=c;}
  {const [c,x]=makeCanvas(140,140);const g=x.createLinearGradient(0,0,0,140);g.addColorStop(0,"#ffe066");g.addColorStop(1,"#ff9a3d");x.fillStyle=g;x.strokeStyle="#c4620a";x.lineWidth=6;x.beginPath();x.roundRect(10,30,120,100,14);x.fill();x.stroke();
    x.fillStyle="#ff5fa8";x.fillRect(60,30,20,100);x.fillRect(10,70,120,18);x.font="54px serif";x.textAlign="center";x.textBaseline="middle";x.fillText("❓",70,80);
    x.fillStyle="#ff5fa8";x.beginPath();x.ellipse(52,24,22,14,-.4,0,7);x.ellipse(88,24,22,14,.4,0,7);x.fill();S.box=c;}
  {const [c,x]=makeCanvas(200,150);x.font="120px serif";x.textAlign="center";x.textBaseline="middle";x.globalAlpha=.85;x.fillText("💨",100,80);x.globalAlpha=1;x.font="40px serif";x.fillText("🟤",60,110);S.fart=c;}
  S.floats={};RACERS.forEach(r=>S.floats[r.k]=drawFloatSprite(r));
  raceSpr=S;
}
function buildTrack(){
  const segs=[];const add=(n,curve)=>{for(let i=0;i<n;i++)segs.push({i:segs.length,curve,spr:[]});};
  const ease=(a,b,p)=>a+(b-a)*((-Math.cos(p*Math.PI)/2)+.5);
  const road=(e,h,l,c)=>{for(let i=0;i<e;i++)segs.push({i:segs.length,curve:ease(0,c,i/e),spr:[]});for(let i=0;i<h;i++)segs.push({i:segs.length,curve:c,spr:[]});for(let i=0;i<l;i++)segs.push({i:segs.length,curve:ease(c,0,i/l),spr:[]});};
  road(25,25,25,0);road(25,50,25,3);road(25,40,25,0);road(25,45,25,-4);road(20,20,20,2);road(20,20,20,-2);road(25,60,25,0);road(25,40,25,4);road(25,30,25,-3);road(20,40,20,0);
  segs.forEach(s=>{s.boost=false;s.box=null;s.fart=null;});
  segs.forEach((s,i)=>{
    if(i%9===0)s.spr.push({k:i%18?"lamp":"tree",o:-1.35});if(i%9===4)s.spr.push({k:i%18===4?"balloon":"lamp",o:1.35});
    if(i%45===20){s.spr.push({k:"crowd",o:-2.1});}if(i%45===40){s.spr.push({k:"crowd",o:2.1});}
    if(i%120===60)s.spr.push({k:"sign",o:Math.random()<.5?-1.9:1.9});
    if(i>40&&i%70===0){s.box=[-.55,0,.55].map(o=>({o,t:0}));}
    if(i>30&&i%95===50){s.boost=Math.random()<.5?-.4:.4;}
  });
  return segs;
}
function startRace(){
  mode="race";clearGame();show(null);field.className="race";
  hud("🏁 매직 퍼레이드 레이스");
  const sel=el(`<div class="rsel"><div class="rs-t">🏁 매직 퍼레이드 레이스 🎠</div><div class="rs-s">누구 마차를 탈까요?</div><div class="rs-row"></div>
    <div class="rs-help">👆 손가락을 좌우로 움직여 운전 · 🎁 상자를 먹고 <b>아이템</b> · 👊 <b>펀치</b>로 옆 마차를 쾅!</div></div>`);
  field.appendChild(sel);if(!raceSpr)buildRaceSprites();
  RACERS.slice(0,4).forEach(r=>{const b=el(`<button class="pick rs-card"><canvas width="260" height="250"></canvas><b>${r.n}</b></button>`);
    const c=b.querySelector("canvas");const draw=()=>{c.getContext("2d").clearRect(0,0,260,250);c.getContext("2d").drawImage(drawFloatSprite(r),0,0);};draw();setTimeout(draw,400);
    b.onclick=()=>{sfx.ding();sel.remove();runRace(r.k);};sel.querySelector(".rs-row").appendChild(b);});
  say("매직 퍼레이드 레이스! 누구 마차를 탈까? 소이 공주, 준이 기사, 은율 인어공주, 리온!");
}
function runRace(pk){
  setTimeout(()=>{raceSpr.floats={};RACERS.forEach(r=>raceSpr.floats[r.k]=drawFloatSprite(r));},50);
  const segs=buildTrack(),N=segs.length,TL=N*RC.SEG;
  const cv=el(`<canvas class="racecv"></canvas>`);field.appendChild(cv);const x=cv.getContext("2d");
  const ui=el(`<div class="rui"><div class="r-lap">🏁 1/${RC.LAPS}</div><div class="r-rank">1등</div></div>`);field.appendChild(ui);
  const itemBtn=el(`<button class="r-item"><span>❔</span><small>아이템</small></button>`);field.appendChild(itemBtn);
  const punchBtn=el(`<button class="r-punch">👊<small>펀치</small><i></i></button>`);field.appendChild(punchBtn);
  const cd=el(`<div class="r-count"></div>`);field.appendChild(cd);
  let W=innerWidth,H=innerHeight,dpr=1;function fit(){dpr=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;}fit();addEventListener("resize",fit);
  const MAX=8200;
  const me={k:pk,pos:0,x:0,speed:0,lap:1,spin:0,shield:0,boost:0,item:null,punchCD:0,steer:0,done:false,finishT:0};
  const rivals=RACERS.filter(r=>r.k!==pk).slice(0,5).map((r,i)=>({k:r.k,n:r.n,z:(i+1)*-420+TL,lapAdj:-1,x:[-.5,.5,0,-.6,.6][i],tx:0,speed:0,base:MAX*(.86+i*.02),spin:0,slow:0,lap:1,done:false}));
  rivals.forEach((r,i)=>{r.z=((i+1)*350)%TL;r.lap=1;r.x=[-.55,.55,-.2,.25,0][i];});
  // player starts behind
  me.pos=0;
  let t=0,last=performance.now(),state="count",countT=3.6,finishOrder=[],shake=0,fireworks=[],speedLines=0,moonT=0;
  const fx=[];// floating texts/projectiles in screen space
  const findSeg=z=>segs[Math.floor(((z%TL)+TL)%TL/RC.SEG)%N];
  const prog=o=>(o.lap-1)*TL+o.z;
  me.z=RC.PZ;
  const pointer=e=>{if(e.target!==cv)return;me.steer=Math.max(-1,Math.min(1,(e.clientX-W/2)/(W*.28)));};
  cv.addEventListener("pointerdown",e=>{audio();pointer(e);});cv.addEventListener("pointermove",e=>{if(e.buttons||e.pointerType==="touch")pointer(e);});
  cv.addEventListener("pointerup",()=>{me.steer=0;});cv.addEventListener("pointercancel",()=>{me.steer=0;});
  const keys={};const kd=e=>{keys[e.key]=e.type==="keydown";if(e.key===" "&&e.type==="keydown")useItem();if((e.key==="z"||e.key==="x")&&e.type==="keydown")punch();};addEventListener("keydown",kd);addEventListener("keyup",kd);
  const ITEMS=[{k:"heart",e:"💖",n:"하츄핑 하트 방패",ping:"hachu"},{k:"rainbow",e:"🌈",n:"오로라핑 무지개 부스터",ping:"aurora"},{k:"star",e:"⭐",n:"다이아나핑 별 미사일",ping:"diana"},
    {k:"moon",e:"🌙",n:"이클립스핑 달빛 마법",ping:"eclipse"},{k:"fart",e:"💨",n:"리온이 방구 폭탄",ping:null},{k:"candy",e:"🍭",n:"왕 사탕 폭탄",ping:null}];
  function setItem(it){me.item=it;itemBtn.querySelector("span").textContent=it?it.e:"❔";itemBtn.classList.toggle("ready",!!it);}
  itemBtn.onpointerdown=e=>{e.stopPropagation();useItem();};punchBtn.onpointerdown=e=>{e.stopPropagation();punch();};
  function popText(txt,sx,sy,col="#fff"){fx.push({txt,x:sx,y:sy,l:1.2,col});}
  function ahead(){let best=null,bd=1e9;for(const r of rivals){const d=prog(r)-prog(meP());if(d>0&&d<bd){bd=d;best=r;}}return best;}
  const meP=()=>({lap:me.lap,z:me.pos+RC.PZ});
  function hitRival(r,why){if(r.shield)return;r.spin=1.3;r.slow=1.2;shake=.25;tone(160,.2,"square",.12,0,80);popText(why,W/2,H*.4,"#ffe066");}
  function useItem(){
    const it=me.item;if(!it||state!=="race")return;setItem(null);if(it.ping)say(it.n+"!");else say(it.n+"!");
    [784,1047,1319].forEach((f,i)=>tone(f,.12,"triangle",.12,i*.05));
    if(it.k==="heart"){me.shield=6;}
    if(it.k==="rainbow"){me.boost=3.2;}
    if(it.k==="star"){const r=ahead();if(r){fx.push({proj:"⭐",x:W/2,y:H*.75,l:.7,tgt:r});setTimeout(()=>hitRival(r,"⭐ 별 미사일 명중!"),650);}}
    if(it.k==="moon"){moonT=3.5;rivals.forEach(r=>{r.slow=3.5;});}
    if(it.k==="fart"){const s=findSeg(me.pos+RC.PZ-RC.SEG*3);s.fart={o:me.x,t:12};const w=fart();popText(w,W/2,H*.62,"#c98b55");}
    if(it.k==="candy"){rivals.forEach(r=>{const d=prog(r)-prog(meP());if(d>-600&&d<4000)setTimeout(()=>hitRival(r,"🍭 사탕 폭탄 쾅!"),300);});shake=.35;}
  }
  function punch(){
    if(me.punchCD>0||state!=="race")return;me.punchCD=1.4;punchBtn.classList.remove("cool");void punchBtn.offsetWidth;punchBtn.classList.add("cool");
    let hit=false;for(const r of rivals){const d=prog(r)-prog(meP());if(d>-500&&d<900&&Math.abs(r.x-me.x)<.75){hit=true;r.x+=(r.x>=me.x?1:-1)*.7;hitRival(r,"👊 쾅! 퍼레이드 펀치!");}}
    if(!hit){tone(300,.08,"sine",.1,0,200);popText("휙!",W/2,H*.6);}else{sfx.slap();}
  }
  function update(dt){
    t+=dt;if(shake>0)shake-=dt;if(moonT>0)moonT-=dt;
    if(state==="count"){countT-=dt;const n=Math.ceil(countT-.6);const txt=n>0?String(n):"출발!";if(cd.textContent!==txt){cd.textContent=txt;cd.classList.remove("go");void cd.offsetWidth;cd.classList.add("go");
        if(n>0){tone(660,.2,"square",.1);say(String(n));}else{tone(1320,.4,"square",.12);say("출발!");}}
      if(countT<=0){state="race";cd.textContent="";}return;}
    // player
    for(const k of["spin","shield","boost","punchCD"])me[k]=Math.max(0,me[k]-dt);
    let steer=me.steer;if(keys.ArrowLeft)steer=-1;if(keys.ArrowRight)steer=1;
    const seg=findSeg(me.pos+RC.PZ);const sp=me.speed/MAX;
    const top=me.boost>0?MAX*1.45:MAX;let acc=me.spin>0?-MAX*.9:MAX*.55;
    me.speed=Math.max(0,Math.min(top,me.speed+acc*dt));if(me.boost<=0&&me.speed>MAX)me.speed-=MAX*dt;
    if(Math.abs(me.x)>1.05)me.speed=Math.max(MAX*.45,me.speed-MAX*1.2*dt);
    me.x+=steer*dt*2.2*Math.max(.3,sp);me.x-=dt*2*sp*seg.curve*.32;me.x=Math.max(-1.6,Math.min(1.6,me.x));
    if(state==="race"||state==="end"){me.pos+=me.speed*dt;}
    if(me.pos>=TL){me.pos-=TL;me.lap++;if(me.lap>RC.LAPS&&!me.done){me.done=true;finishOrder.push(pk);finish();}else if(me.lap<=RC.LAPS){say(me.lap===RC.LAPS?"마지막 바퀴!":`${me.lap}바퀴째!`);tone(1047,.3,"triangle",.12);}}
    // boost pad / boxes / farts at player segment
    const ps=findSeg(me.pos+RC.PZ);
    if(ps.boost!==false&&Math.abs(ps.boost-me.x)<.35&&me.boost<1){me.boost=1.4;tone(900,.25,"sawtooth",.08,0,1600);popText("🌈 부스터!",W/2,H*.55,"#7ff0ff");}
    if(ps.box)for(const b of ps.box){if(b.t<=0&&Math.abs(b.o-me.x)<.3){b.t=4;if(!me.item){const it=ITEMS[Math.floor(Math.random()*ITEMS.length)];setItem(it);sfx.ding();popText(it.e+" "+it.n,W/2,H*.5,"#ffe066");}}}
    // rivals
    for(const r of rivals){
      r.spin=Math.max(0,r.spin-dt);r.slow=Math.max(0,r.slow-dt);
      const gap=prog(r)-prog(meP());let band=gap>2500?.9:gap<-2500?1.12:1;
      let s=r.base*band;if(r.slow>0)s*=.55;if(r.spin>0)s*=.35;r.speed+=(s-r.speed)*Math.min(1,dt*2);
      if(state!=="count")r.z+=r.speed*dt;
      if(r.z>=TL){r.z-=TL;r.lap++;if(r.lap>RC.LAPS&&!r.done){r.done=true;finishOrder.push(r.k);}}
      if(Math.random()<dt*.5)r.tx=(Math.random()*2-1)*.7;r.x+=(r.tx-r.x)*dt*1.2;
      const rs=findSeg(r.z);if(rs.fart&&Math.abs(rs.fart.o-r.x)<.4&&r.spin<=0){r.spin=1.5;rs.fart.t=0;popText("💨 으악 냄새!",W/2,H*.4,"#c98b55");}
      // collide with player
      const d=prog(r)-prog(meP());if(Math.abs(d)<RC.SEG*1.2&&Math.abs(r.x-me.x)<.42&&state==="race"){
        if(me.shield>0||me.boost>0){hitRival(r,me.shield>0?"💖 방패 튕기기!":"🌈 부스터 돌진!");}
        else{me.speed*=.72;r.x+=(r.x>=me.x?.25:-.25);me.x+=(r.x>=me.x?-.18:.18);shake=.15;tone(200,.08,"square",.1);}}
      // rival attacks player occasionally
      if(state==="race"&&!r.done&&d>200&&d<3000&&Math.random()<dt*.05&&me.spin<=0){
        if(me.shield>0){popText("💖 막았다!",W/2,H*.6,"#ff9ad5");me.shield=0;}else{me.spin=1.1;shake=.3;popText(`${RACERS.find(z=>z.k===r.k).n}의 눈뭉치 공격!`,W/2,H*.55,"#fff");tone(150,.2,"square",.12,0,70);}}
    }
    segs.forEach(s=>{if(s.box)s.box.forEach(b=>b.t=Math.max(0,b.t-dt));if(s.fart&&(s.fart.t-=dt)<=0)s.fart=null;});
    // rank
    const all=[{k:pk,p:me.done?1e12-finishOrder.indexOf(pk):prog(meP())},...rivals.map(r=>({k:r.k,p:r.done?1e12-finishOrder.indexOf(r.k):prog(r)}))].sort((a,b)=>b.p-a.p);
    const rank=all.findIndex(a=>a.k===pk)+1;ui.querySelector(".r-rank").textContent=`${rank}등`;ui.querySelector(".r-rank").className="r-rank r"+Math.min(rank,4);
    ui.querySelector(".r-lap").textContent=`🏁 ${Math.min(me.lap,RC.LAPS)}/${RC.LAPS}`;
    // fireworks
    if(Math.random()<dt*1.4)fireworks.push({x:Math.random()*W,y:H*(.06+Math.random()*.25),l:1,c:["#ff6b8b","#ffe066","#7fd6ff","#b48cf0","#7fe08a"][Math.floor(Math.random()*5)]});
    fireworks.forEach(f=>f.l-=dt*.8);fireworks=fireworks.filter(f=>f.l>0);
    fx.forEach(f=>f.l-=dt);for(let i=fx.length-1;i>=0;i--)if(fx[i].l<=0)fx.splice(i,1);
  }
  function finish(){
    state="end";const place=finishOrder.indexOf(pk)+1;const r=RACERS.find(z=>z.k===pk);
    say(place===1?`우승! ${r.n} 1등!`:`${place}등! 끝까지 잘 달렸어!`);sfx.yay();confetti();
    setTimeout(()=>{const pod=el(`<div class="podium"><div class="pd-t">${place===1?"🏆 우승!":`🎉 ${place}등!`}</div><div class="pd-row"></div></div>`);
      const order=[...finishOrder];RACERS.forEach(z=>{if(!order.includes(z.k)&&(z.k===pk||rivals.some(q=>q.k===z.k)))order.push(z.k);});
      order.slice(0,3).forEach((k,i)=>{const c=raceSpr.floats[k];const box=el(`<div class="pd-p p${i+1}"><img src="${c.toDataURL()}"><b>${["🥇","🥈","🥉"][i]} ${RACERS.find(z=>z.k===k).n}</b><div class="pd-s"></div></div>`);pod.querySelector(".pd-row").appendChild(box);});
      field.appendChild(pod);},1500);
    timers.push(setTimeout(()=>win(place===1?`${r.n}가 매직 퍼레이드 레이스에서 우승했어요! 🏆`:`${r.n}가 매직 퍼레이드 레이스에서 ${place}등! 최고의 퍼레이드였어요!`),5200));
  }
  // ---------- render ----------
  function project(wx,wz,camX,camZ){const cz=wz-camZ;const sc=RC.CAMD/cz;return {x:Math.round(W/2+sc*(wx-camX)*W/2),y:Math.round(H/2-sc*(0-RC.CAMH)*H/2*.9+H*.08),w:Math.round(sc*RC.ROADW*W/2),sc};}
  function poly(x1,y1,w1,x2,y2,w2,c){x.fillStyle=c;x.beginPath();x.moveTo(x1-w1,y1);x.lineTo(x2-w2,y2);x.lineTo(x2+w2,y2);x.lineTo(x1+w1,y1);x.closePath();x.fill();}
  function drawSky(curveOff){
    const g=x.createLinearGradient(0,0,0,H*.55);g.addColorStop(0,moonT>0?"#0d0b2a":"#2b1f63");g.addColorStop(.6,moonT>0?"#2a2060":"#7a4fb0");g.addColorStop(1,"#ff9ad5");x.fillStyle=g;x.fillRect(0,0,W,H*.6);
    x.fillStyle="#fff";for(let i=0;i<40;i++){x.globalAlpha=.4+.4*Math.sin(t*2+i);x.fillRect((i*97)%W,(i*53)%(H*.3),2,2);}x.globalAlpha=1;
    // castle silhouette
    const cx=W/2-curveOff*.5,hy=H*.5;x.fillStyle="#4a3a8a";
    x.fillRect(cx-90,hy-110,180,110);x.fillRect(cx-130,hy-160,40,160);x.fillRect(cx+90,hy-160,40,160);x.fillRect(cx-25,hy-200,50,90);
    x.beginPath();x.moveTo(cx-135,hy-160);x.lineTo(cx-110,hy-215);x.lineTo(cx-85,hy-160);x.moveTo(cx+85,hy-160);x.lineTo(cx+110,hy-215);x.lineTo(cx+135,hy-160);x.moveTo(cx-32,hy-200);x.lineTo(cx,hy-265);x.lineTo(cx+32,hy-200);x.fill();
    x.fillStyle="#ffe9a8";for(const[a,b]of[[-110,-130],[110,-130],[-10,-170],[10,-170],[-50,-70],[50,-70],[0,-60]])x.fillRect(cx+a-4,hy+b,8,14);
    for(const f of fireworks){x.strokeStyle=f.c;x.globalAlpha=f.l;x.lineWidth=2.5;const r=(1-f.l)*70+8;for(let k=0;k<12;k++){const a=k*.5236;x.beginPath();x.moveTo(f.x+Math.cos(a)*r*.5,f.y+Math.sin(a)*r*.5);x.lineTo(f.x+Math.cos(a)*r,f.y+Math.sin(a)*r);x.stroke();}}x.globalAlpha=1;
  }
  function render(){
    x.setTransform(dpr,0,0,dpr,0,0);
    const sx=shake>0?(Math.random()-.5)*14:0,sy=shake>0?(Math.random()-.5)*10:0;x.translate(sx,sy);
    const base=findSeg(me.pos);const basePct=(me.pos%RC.SEG)/RC.SEG;
    let curveSum=0;for(let n=0;n<40;n++)curveSum+=segs[(base.i+n)%N].curve;
    drawSky(curveSum*6);
    const horizon=H*.5;x.fillStyle="#f4d9b0";x.fillRect(0,horizon-2,W,H-horizon+2);
    let dx=-(base.curve*basePct),cxw=0,maxy=H;const camX=me.x*RC.ROADW;
    for(let n=0;n<RC.DRAW;n++){
      const s=segs[(base.i+n)%N];const looped=s.i<base.i;const camZ=me.pos-(looped?TL:0);
      const z1=s.i*RC.SEG,z2=z1+RC.SEG;
      const p1=project(cxw,z1,camX,camZ+0),p2=project(cxw+dx,z2,camX,camZ);
      // shift for camera height already in project
      s.p1=p1;s.clip=maxy;s.cx=cxw;
      cxw+=dx;dx+=s.curve;
      if(z1-camZ<=RC.CAMD*10||p2.y>=p1.y||p2.y>=maxy){s.vis=false;continue;}
      s.vis=true;
      const alt=Math.floor(s.i/3)%2;
      x.fillStyle=alt?"#f4d9b0":"#ecc99a";x.fillRect(0,p2.y,W,p1.y-p2.y+1);
      poly(p1.x,p1.y,p1.w*1.14,p2.x,p2.y,p2.w*1.14,alt?"#ffd34d":"#fff");
      poly(p1.x,p1.y,p1.w,p2.x,p2.y,p2.w,alt?"#c96bb0":"#bd5ea6");
      if(alt){const lw1=p1.w*.03,lw2=p2.w*.03;for(const l of[-1/3,1/3])poly(p1.x+p1.w*l*2,p1.y,lw1,p2.x+p2.w*l*2,p2.y,lw2,"rgba(255,255,255,.85)");}
      if(s.boost!==false){const bx1=p1.x+p1.w*s.boost,bx2=p2.x+p2.w*s.boost;const cols=["#ff6b8b","#ffb04d","#ffe066","#7fe08a","#6cc8f5","#b48cf0"];
        cols.forEach((c,k)=>{const f1=(k-2.5)/6,f2=(k-1.5)/6;x.fillStyle=c;x.beginPath();x.moveTo(bx1+p1.w*.28*f1,p1.y);x.lineTo(bx2+p2.w*.28*f1,p2.y);x.lineTo(bx2+p2.w*.28*f2,p2.y);x.lineTo(bx1+p1.w*.28*f2,p1.y);x.fill();});}
      maxy=p2.y;
    }
    // sprites + racers back to front
    for(let n=RC.DRAW-1;n>0;n--){
      const s=segs[(base.i+n)%N];if(!s.vis&&!s.p1)continue;const p=s.p1;if(!p||p.sc<=0)continue;
      const drawSpr=(img,o,worldW,clip=true)=>{const w=worldW*p.sc*W/2,h=w*img.height/img.width;const X=p.x+p.sc*o*RC.ROADW*W/2-w/2,Y=p.y-h;if(Y>s.clip||w<2)return;
        x.save();if(clip){x.beginPath();x.rect(0,0,W,s.clip);x.clip();}x.drawImage(img,X,Y,w,h);x.restore();};
      for(const sp of s.spr)drawSpr(raceSpr[sp.k],sp.o,{crowd:1600,lamp:300,balloon:500,tree:700,sign:1300}[sp.k]);
      if(s.box)for(const b of s.box)if(b.t<=0){const bob=Math.sin(t*4+b.o*3)*.04;drawSpr(raceSpr.box,b.o,260+bob*200);}
      if(s.fart)drawSpr(raceSpr.fart,s.fart.o,500);
      for(const r of rivals){if(findSeg(r.z)!==s)continue;const img=raceSpr.floats[r.k];const w=560*p.sc*W/2,h=w*img.height/img.width;const X=p.x+p.sc*r.x*RC.ROADW*W/2-w/2,Y=p.y-h;if(Y>s.clip)continue;
        x.save();x.translate(X+w/2,Y+h);if(r.spin>0)x.rotate(Math.sin(t*30)*.25);x.drawImage(img,-w/2,-h,w,h);x.restore();
        if(r.slow>0&&moonT>0){x.font=`${Math.max(10,w*.18)}px serif`;x.fillText("💤",X+w*.8,Y+h*.15);}
        if(w>40){x.fillStyle="#fff";x.strokeStyle="#4a2f4f";x.lineWidth=3;x.font=`${Math.max(11,Math.min(16,w*.09))}px Jua,sans-serif`;x.textAlign="center";const nm=RACERS.find(z=>z.k===r.k).n;x.strokeText(nm,X+w/2,Y-4);x.fillText(nm,X+w/2,Y-4);}}
    }
    // player float
    const img=raceSpr.floats[pk];const pw=Math.min(W*.42,300),ph=pw*img.height/img.width;const px=W/2-pw/2+me.steer*8,py=H-ph-26+Math.sin(t*14)*(me.speed>100?2:0);
    if(me.boost>0){const cols=["#ff6b8b","#ffb04d","#ffe066","#7fe08a","#6cc8f5","#b48cf0"];cols.forEach((c,k)=>{x.fillStyle=c;x.globalAlpha=.7;x.fillRect(px+pw*.2+k*pw*.1,py+ph*.9,pw*.1,H-py);});x.globalAlpha=1;}
    x.save();x.translate(px+pw/2,py+ph);x.rotate(me.spin>0?Math.sin(t*30)*.3:me.steer*.06);x.drawImage(img,-pw/2,-ph,pw,ph);x.restore();
    if(me.shield>0){x.strokeStyle=`rgba(255,120,190,${.6+.3*Math.sin(t*8)})`;x.lineWidth=6;x.beginPath();x.ellipse(W/2,py+ph*.55,pw*.62,ph*.62,0,0,7);x.stroke();}
    // speed lines
    if(me.speed>MAX*1.05){x.strokeStyle="rgba(255,255,255,.6)";x.lineWidth=2;for(let i=0;i<14;i++){const a=i/14*Math.PI*2+t;const r1=Math.min(W,H)*.35,r2=r1+40+Math.random()*60;x.beginPath();x.moveTo(W/2+Math.cos(a)*r1,H*.55+Math.sin(a)*r1*.6);x.lineTo(W/2+Math.cos(a)*r2,H*.55+Math.sin(a)*r2*.6);x.stroke();}}
    // fx texts
    x.textAlign="center";x.textBaseline="middle";
    for(const f of fx){if(f.proj){const r=f.tgt;const k=1-f.l/.7;x.font="44px serif";x.fillText(f.proj,W/2,H*.75-k*H*.35);continue;}
      x.globalAlpha=Math.min(1,f.l);x.font=`bold ${Math.min(28,W*.06)}px Jua,sans-serif`;x.lineWidth=5;x.strokeStyle="#4a2f4f";x.strokeText(f.txt,f.x,f.y-(1.2-f.l)*40);x.fillStyle=f.col;x.fillText(f.txt,f.x,f.y-(1.2-f.l)*40);x.globalAlpha=1;}
    if(moonT>0){x.fillStyle="rgba(20,10,60,.25)";x.fillRect(0,0,W,H);}
    // mini progress bar
    const bw=Math.min(W*.6,300),bx=(W-bw)/2,by=118;x.fillStyle="rgba(255,255,255,.75)";x.beginPath();x.roundRect(bx,by,bw,10,5);x.fill();
    const pp=o=>Math.min(1,((o.lap-1)*TL+o.z)/(RC.LAPS*TL));
    rivals.forEach(r=>{const f=pp(r);x.fillStyle=RACERS.find(z=>z.k===r.k).col;x.beginPath();x.arc(bx+bw*f,by+5,6,0,7);x.fill();x.strokeStyle="#fff";x.lineWidth=2;x.stroke();});
    const f=pp(meP());x.fillStyle="#ff5fa8";x.beginPath();x.arc(bx+bw*f,by+5,9,0,7);x.fill();x.strokeStyle="#fff";x.lineWidth=3;x.stroke();
  }
  function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;update(dt);render();raf=requestAnimationFrame(frame);}
  say(`${RACERS.find(r=>r.k===pk).n} 출전! 준비~`);raf=requestAnimationFrame(frame);
}
