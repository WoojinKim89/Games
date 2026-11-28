// =====================================================================
//  SANTA & RUDOLPH TREASURE HUNT  →  BIRTHDAY PARTY with Elsa & Cinderella
// =====================================================================
function playTune(lines,bpm,onMark){
  const a=audio(),beat=60/bpm;let t=a.currentTime+.3;const marks=[];
  lines.forEach((ln,li)=>{let tt=t;const tot=ln.n.reduce((s,[,d])=>s+d,0);
    (ln.ch||["C"]).forEach((c,ci,arr)=>{const seg=tot/arr.length;CHORD[c].forEach((m,i)=>instr("sine",mf(m+12),t+ci*seg*beat+i*.03,seg*beat*.95,.05));instr("triangle",mf(CHORD[c][0]),t+ci*seg*beat,seg*beat*.9,.18);});
    ln.n.forEach(([m,d],si)=>{singNote(mf(m),tt,d*beat*.95,.17);instr("triangle",mf(m+12),tt,d*beat*.4,.03);marks.push({li,si,at:tt});tt+=d*beat;});
    t=tt+beat*.25;});
  return {marks,end:t};
}
function startSanta(){
  mode="santa";clearGame();show(null);field.className="santa";
  hud("🎅 산타의 보물찾기");
  const cv=el(`<canvas class="santacv"></canvas>`);field.appendChild(cv);const x=cv.getContext("2d");
  const score=el(`<div class="sscore"><span class="me"><img src="${IMG.santaface}"> <b>0</b></span><span class="vs">VS</span><span class="rv"><img src="${IMG.rion}"> <b>0</b></span></div>`);field.appendChild(score);
  const hint=el(`<div class="shint">🔴 루돌프 코가 밝아지면 보물이 가까워요!</div>`);field.appendChild(hint);
  let W=innerWidth,H=innerHeight,dpr=1;const top=150,bot=()=>H-30;
  function fit(){dpr=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;}fit();addEventListener("resize",fit);
  const im={santa:Object.assign(new Image(),{src:IMG.santaface}),rud:Object.assign(new Image(),{src:IMG.rudolph}),rion:Object.assign(new Image(),{src:dogPNG()})};
  const GOAL=4,TOTAL=7;const TRE=["🎁","💎","👑","⭐","🧸","🍰","🎀","💍","🦄"];
  // mounds
  const mounds=[];let tries=0;while(mounds.length<12&&tries++<2000){const m={x:40+Math.random()*(W-80),y:top+30+Math.random()*(bot()-top-70)};
    if(mounds.every(o=>Math.hypot(o.x-m.x,o.y-m.y)>Math.min(W,H)*.17))mounds.push(m);}
  mounds.forEach(m=>{m.dug=false;m.t=null;m.by=null;m.dig=0;});
  [...mounds].sort(()=>Math.random()-.5).slice(0,TOTAL).forEach((m,i)=>m.t=TRE[i%TRE.length]);
  const deco=[...Array(16)].map(()=>({x:Math.random()*W,y:top-20+Math.random()*(H-top),s:.7+Math.random()*.7,k:Math.random()<.8?"🌲":"⛄"})).filter(d=>mounds.every(m=>Math.hypot(m.x-d.x,m.y-d.y)>60));
  const flakes=[...Array(50)].map(()=>({x:Math.random()*W,y:Math.random()*H,v:20+Math.random()*40,r:1+Math.random()*3}));
  const P={x:W*.25,y:bot()-60,tx:null,ty:null,target:null,dig:0,cnt:0,face:1,found:[]};
  const R={x:W*.75,y:bot()-60,target:null,dig:0,cnt:0,face:-1,wait:2.5,speed:Math.min(W,H)*.26};
  const parts=[];let t=0,last=performance.now(),over=false,beepT=0,glow=0,voiceT=4;
  say("산타 할아버지랑 루돌프 출발! 리온이보다 먼저 보물 4개를 찾아요! 눈 더미를 눌러봐요!");
  cv.addEventListener("pointerdown",e=>{if(over)return;audio();const m=mounds.find(m=>!m.dug&&Math.hypot(m.x-e.clientX,m.y-e.clientY)<46);
    if(m){P.target=m;P.tx=m.x-28*Math.sign(m.x-P.x||1);P.ty=m.y+6;}else{P.target=null;P.tx=e.clientX;P.ty=Math.max(top,e.clientY);}sfx.pop();});
  function snowBurst(m){for(let i=0;i<14;i++)parts.push({x:m.x,y:m.y,vx:(Math.random()-.5)*220,vy:-120-Math.random()*160,l:.8,e:"❄"});}
  function reveal(m,who){m.dug=true;m.by=who;snowBurst(m);
    if(m.t){if(who==="me"){P.cnt++;P.found.push(m.t);sfx.yay();bubble(m.x-20,m.y-50,`${m.t} 찾았다!`);say(["호호호! 보물이다!","루돌프 최고!","찾았다!"][P.cnt%3]);for(let i=0;i<10;i++)parts.push({x:m.x,y:m.y,vx:(Math.random()-.5)*200,vy:-180-Math.random()*100,l:1,e:"✨"});}
      else{R.cnt++;sfx.bark();bubble(m.x-20,m.y-50,`멍! 리온이가 ${m.t} 찾았다!`);say("앗! 리온이가 먼저 찾았어!");}
      score.querySelector(".me b").textContent=P.cnt;score.querySelector(".rv b").textContent=R.cnt;}
    else{if(who==="me"){tone(300,.2,"sine",.1,0,200);bubble(m.x-20,m.y-50,"여긴 없어요~");}else{if(Math.random()<.5){const w=fart();bubble(m.x-20,m.y-50,`${w} 없잖아 멍!`);}}}
    if(P.cnt>=GOAL&&!over){over=true;setTimeout(()=>santaWin(),1400);}
    else if(R.cnt>=GOAL&&!over){over=true;setTimeout(()=>santaLose(),1400);}
    else if(!mounds.some(z=>!z.dug&&z.t)&&!over){over=true;setTimeout(()=>P.cnt>=R.cnt?santaWin():santaLose(),1400);}}
  function santaWin(){say("우리가 이겼다! 호호호! 이제 생일파티 하러 가자!");confetti();timers.push(setTimeout(()=>birthdaySetup(P.found),2200));}
  function santaLose(){const o=el(`<div class="slose"><div>🐶 리온이가 먼저 ${GOAL}개를 찾았어요!</div><button class="pick">🔁 다시 도전!</button></div>`);field.appendChild(o);say("아깝다! 리온이가 이겼어. 다시 도전해 볼까?");o.querySelector("button").onclick=()=>startSanta();}
  function step(dt){
    t+=dt;
    // player
    if(P.dig>0){P.dig-=dt;if(P.dig<=0)reveal(P.target,"me"),P.target=null;}
    else if(P.tx!==null){const dx=P.tx-P.x,dy=P.ty-P.y,d=Math.hypot(dx,dy),sp=Math.min(W,H)*.42;if(Math.abs(dx)>2)P.face=dx>0?1:-1;
      if(d<sp*dt){P.x=P.tx;P.y=P.ty;P.tx=null;if(P.target&&!P.target.dug){if(P.target.dig){P.target=null;}else{P.dig=.9;P.target.dig=1;tone(500,.1,"square",.06);}}}else{P.x+=dx/d*sp*dt;P.y+=dy/d*sp*dt;}}
    // rion AI
    if(R.dig>0){R.dig-=dt;if(R.dig<=0){reveal(R.target,"rion");R.target=null;R.wait=.8+Math.random()*1.4;}}
    else if(R.wait>0)R.wait-=dt;
    else{if(!R.target||R.target.dug||R.target.dig){const c=mounds.filter(m=>!m.dug&&!m.dig);if(c.length){c.sort((a,b)=>Math.hypot(a.x-R.x,a.y-R.y)-Math.hypot(b.x-R.x,b.y-R.y));R.target=c[Math.floor(Math.random()*Math.min(3,c.length))];}}
      if(R.target){const tx=R.target.x+24,ty=R.target.y+6,dx=tx-R.x,dy=ty-R.y,d=Math.hypot(dx,dy),sp=R.speed*(.85+.3*(R.cnt<P.cnt));if(Math.abs(dx)>2)R.face=dx>0?1:-1;
        if(d<sp*dt){R.target.dig=1;R.dig=1.3;}else{R.x+=dx/d*sp*dt;R.y+=dy/d*sp*dt;}}}
    // rudolph nose hint
    let nd=1e9;for(const m of mounds)if(!m.dug&&m.t)nd=Math.min(nd,Math.hypot(m.x-P.x,m.y-P.y));
    const g=Math.max(0,1-nd/(Math.min(W,H)*.55));glow+=(g-glow)*Math.min(1,dt*5);
    beepT-=dt;if(beepT<=0&&!over){beepT=.25+(1-glow)*1.4;tone(500+glow*900,.06,"sine",.04+glow*.06);}
    voiceT-=dt;if(voiceT<=0&&!over){voiceT=7;say(glow>.7?"루돌프 코가 엄청 반짝여! 바로 근처야!":glow>.4?"따뜻해 따뜻해! 가까워지고 있어!":"루돌프 코가 어두워... 다른 곳을 찾아봐!");}
    for(const f of flakes){f.y+=f.v*dt;f.x+=Math.sin(t+f.r)*10*dt;if(f.y>H)f.y=-5;}
    for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.l-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=380*dt;if(p.l<=0)parts.splice(i,1);}
  }
  function draw(){
    x.setTransform(dpr,0,0,dpr,0,0);
    const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,"#cfe6ff");g.addColorStop(.25,"#f4f9ff");g.addColorStop(1,"#e6f0fb");x.fillStyle=g;x.fillRect(0,0,W,H);
    x.fillStyle="rgba(170,200,235,.35)";for(let i=0;i<8;i++){x.beginPath();x.ellipse((i*137)%W,top+((i*89)%(H-top)),90,24,0,0,7);x.fill();}
    // frozen pond
    x.fillStyle="rgba(150,210,255,.55)";x.beginPath();x.ellipse(W*.5,top+(H-top)*.55,W*.16,34,0,0,7);x.fill();x.strokeStyle="#fff";x.lineWidth=3;x.stroke();
    const ents=[];
    deco.forEach(d=>ents.push({y:d.y,f:()=>{x.font=`${46*d.s}px serif`;x.textAlign="center";x.textBaseline="bottom";x.fillText(d.k,d.x,d.y);if(d.k==="🌲"){x.fillStyle="#fff";x.beginPath();x.ellipse(d.x,d.y-40*d.s,12*d.s,5*d.s,0,0,7);x.fill();}}}));
    mounds.forEach(m=>ents.push({y:m.y,f:()=>{
      if(!m.dug){const sh=m.dig?Math.sin(t*40)*2:0;x.fillStyle="rgba(120,150,190,.25)";x.beginPath();x.ellipse(m.x,m.y+12,40,10,0,0,7);x.fill();
        const gg=x.createRadialGradient(m.x-10+sh,m.y-14,4,m.x+sh,m.y,40);gg.addColorStop(0,"#ffffff");gg.addColorStop(1,"#c8dcf2");x.fillStyle=gg;x.beginPath();x.ellipse(m.x+sh,m.y,38,24,0,Math.PI,0);x.lineTo(m.x+38,m.y+8);x.lineTo(m.x-38,m.y+8);x.fill();
        x.fillStyle="#fff";x.beginPath();x.arc(m.x-12+sh,m.y-10,7,0,7);x.arc(m.x+10+sh,m.y-14,9,0,7);x.fill();}
      else{x.fillStyle="#9fb8d8";x.beginPath();x.ellipse(m.x,m.y+4,30,10,0,0,7);x.fill();x.fillStyle="#7a96bc";x.beginPath();x.ellipse(m.x,m.y+4,18,5,0,0,7);x.fill();
        if(m.t){x.globalAlpha=m.by==="me"?1:.5;x.font="34px serif";x.textAlign="center";x.textBaseline="bottom";x.fillText(m.t,m.x,m.y);x.globalAlpha=1;x.font="16px serif";x.fillText(m.by==="me"?"🎅":"🐶",m.x+22,m.y-22);}}}}));
    // rion
    ents.push({y:R.y,f:()=>{x.save();x.translate(R.x,R.y);if(R.face>0)x.scale(-1,1);const w=96,h=72;const bob=R.dig>0?Math.sin(t*30)*3:Math.abs(Math.sin(t*10))*-4;
      if(im.rion.complete)x.drawImage(im.rion,-w/2,-h+bob,w,h);x.restore();if(R.dig>0&&Math.random()<.5)parts.push({x:R.x-20,y:R.y-10,vx:(Math.random()-.5)*120,vy:-100,l:.5,e:"❄"});}});
    // santa + rudolph sleigh
    ents.push({y:P.y,f:()=>{x.save();x.translate(P.x,P.y);if(P.face<0)x.scale(-1,1);const bob=P.dig>0?Math.sin(t*30)*2:Math.abs(Math.sin(t*9))*-3;
      x.fillStyle="rgba(0,0,0,.15)";x.beginPath();x.ellipse(0,4,70,10,0,0,7);x.fill();
      // sleigh
      x.fillStyle="#d92b3a";x.strokeStyle="#ffd34d";x.lineWidth=4;x.beginPath();x.moveTo(-70,-8);x.quadraticCurveTo(-74,-46,-46,-46);x.lineTo(-10,-30);x.lineTo(-8,-6);x.closePath();x.fill();x.stroke();
      x.strokeStyle="#ffd34d";x.lineWidth=3;x.beginPath();x.moveTo(-78,0);x.lineTo(-4,0);x.quadraticCurveTo(6,0,4,-10);x.stroke();
      if(im.santa.complete)x.drawImage(im.santa,-66,-98+bob,52,75);
      // reins
      x.strokeStyle="#7a3a1a";x.lineWidth=2;x.beginPath();x.moveTo(-20,-40);x.quadraticCurveTo(10,-30,30,-36);x.stroke();
      // rudolph
      if(im.rud.complete)x.drawImage(im.rud,4,-104+bob,58,106);
      const nx=4+58*.475,ny=-104+bob+106*.66;const r=6+glow*6;const ng=x.createRadialGradient(nx,ny,1,nx,ny,r*4);ng.addColorStop(0,`rgba(255,60,60,${.5+glow*.5})`);ng.addColorStop(1,"rgba(255,60,60,0)");
      x.fillStyle=ng;x.beginPath();x.arc(nx,ny,r*4,0,7);x.fill();x.fillStyle="#ff2a2a";x.beginPath();x.arc(nx,ny,r,0,7);x.fill();x.fillStyle="rgba(255,255,255,.8)";x.beginPath();x.arc(nx-r*.3,ny-r*.3,r*.3,0,7);x.fill();
      x.restore();
      if(P.dig>0&&Math.random()<.6)parts.push({x:P.x+40*P.face,y:P.y-10,vx:(Math.random()-.5)*160,vy:-120,l:.5,e:"❄"});}});
    ents.sort((a,b)=>a.y-b.y).forEach(e=>e.f());
    x.textAlign="center";x.textBaseline="middle";for(const p of parts){x.globalAlpha=Math.min(1,p.l*2);x.font="18px serif";x.fillStyle="#fff";x.fillText(p.e,p.x,p.y);}x.globalAlpha=1;
    x.fillStyle="#fff";for(const f of flakes){x.beginPath();x.arc(f.x,f.y,f.r,0,7);x.fill();}
    if(P.tx!==null&&!P.target){x.strokeStyle="rgba(255,80,80,.6)";x.lineWidth=3;x.beginPath();x.arc(P.tx,P.ty,10+Math.sin(t*8)*3,0,7);x.stroke();}
  }
  function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(!over||true)step(dt);draw();raf=requestAnimationFrame(frame);}
  raf=requestAnimationFrame(frame);
}
// ---------- birthday party ----------
function birthdaySetup(found){
  clearGame();show(null);field.className="bday";hud("🎂 생일파티");window.__musicHold=true;stopMusic();
  const who=[["sohee","소이",IMG.soiface],["jun","준이",IMG.jun],["rion","리온",IMG.rion],["mom","엄마",IMG.eunface]];
  const sel=el(`<div class="bsel"><div class="bs-t">🎉 누구 생일이에요? 🎂</div><div class="bs-row">${who.map(([k,n,src])=>`<button class="pick" data-k="${k}"><img src="${src}">${n}</button>`).join("")}</div></div>`);
  field.appendChild(sel);say("누구 생일이에요? 골라주세요!");
  sel.querySelectorAll("[data-k]").forEach(b=>b.onclick=()=>{const w=who.find(z=>z[0]===b.dataset.k);sel.remove();birthdayParty(w,found);});
}
function birthdayParty([k,name,face],found){
  const pos=name.endsWith("이")||name==="리온"?name:name; // name as is
  const w=el(`<div class="party">
    <div class="garland">${[...Array(14)].map((_,i)=>`<i style="background:${["#ff6b8b","#ffe066","#7fd6ff","#b48cf0","#7fe08a"][i%5]}"></i>`).join("")}</div>
    <div class="pballoons">${["#ff6b8b","#ffe066","#7fd6ff","#b48cf0","#7fe08a","#ff9ad5"].map((c,i)=>`<b style="background:radial-gradient(circle at 35% 30%,#fff,${c} 35%,${shade(c,-.25)});left:${4+i*16}%;animation-delay:${i*.3}s"></b>`).join("")}</div>
    <div class="banner2">🎉 사랑하는 ${name}의 생일 🎉</div>
    <img class="guest g-elsa" src="${IMG.elsa2}"><img class="guest g-cind" src="${IMG.cinderella}">
    <div class="guest2"><img class="g-santa" src="${IMG.santaface}"><img class="g-rud" src="${IMG.rudolph}"></div>
    <div class="bdperson"><img src="${face}"><span>🎂 ${name}</span></div>
    <div class="cake"><svg viewBox="0 0 300 260">
      <ellipse cx="150" cy="240" rx="140" ry="16" fill="#fff" stroke="#e6d0dc" stroke-width="3"/>
      <rect x="40" y="150" width="220" height="86" rx="18" fill="#ffb3cf"/><path d="M40 168q20 22 40 0q20 22 40 0q20 22 40 0q20 22 40 0q20 22 40 0q20 22 20 0" fill="#fff"/>
      <rect x="70" y="86" width="160" height="70" rx="16" fill="#fff0f6"/><path d="M70 102q16 18 32 0q16 18 32 0q16 18 32 0q16 18 32 0q16 18 32 0" fill="#ff86bd"/>
      ${[70,110,150,190,230].map(x=>`<circle cx="${x}" cy="150" r="9" fill="#e53950"/><path d="M${x} 141q4 -8 8 -6" stroke="#4caf50" stroke-width="3" fill="none"/>`).join("")}
      ${[60,100,140,180,220,250].map((x,i)=>`<circle cx="${x}" cy="${200+(i%2)*14}" r="5" fill="${["#ffe066","#7fd6ff","#fff"][i%3]}"/>`).join("")}
      <text x="150" y="132" text-anchor="middle" font-size="22" fill="#c4467e" font-family="Jua,sans-serif">HAPPY BIRTHDAY</text>
    </svg><div class="candles"></div></div>
    <div class="pstep"></div>
    <div class="gifts"></div>
  </div>`);
  field.appendChild(w);
  const candles=w.querySelector(".candles"),stepEl=w.querySelector(".pstep"),gifts=w.querySelector(".gifts");
  const KO=["하나","둘","셋","넷","다섯","여섯","일곱","여덟","아홉","열"];let n=0;
  say(`와! 엘사 언니랑 신데렐라 언니, 산타 할아버지랑 루돌프도 왔어요! 사랑하는 ${name}의 생일 파티를 시작해요! 케이크에 초를 꽂아요!`);
  const setStep=(html)=>{stepEl.innerHTML=html;};
  setStep(`<button class="pick big" data-a="add">🕯️ 초 꽂기</button><button class="pick" data-a="done" hidden>🎵 노래 부르기</button>`);
  stepEl.querySelector('[data-a=add]').onclick=()=>{if(n>=10)return;const c=el(`<button class="candle"><i class="fl"></i></button>`);candles.appendChild(c);n++;
    tone(500+n*60,.15,"triangle",.12);speakSeq([[KO[n-1],"ko"]]);stepEl.querySelector('[data-a=done]').hidden=false;};
  stepEl.querySelector('[data-a=done]').onclick=()=>{if(!n)return;sing();};
  function sing(){
    setStep(`<div class="karaoke2"><div class="kl"></div></div>`);const kl=stepEl.querySelector(".kl");
    const nm=[...name];const L=[
      {t:"생일 축하합니다",n:[[67,.75],[67,.25],[69,1],[67,1],[72,1],[71,.5],[71,1.5]],ch:["C","G"]},
      {t:"생일 축하합니다",n:[[67,.75],[67,.25],[69,1],[67,1],[74,1],[72,.5],[72,1.5]],ch:["G","C"]},
      {t:`사랑하는 ${name}의`,n:[[67,.75],[67,.25],[79,1],[76,1],[72,1],[71,1],[69,2]],ch:["C","F"]},
      {t:"생일 축하합니다",n:[[77,.75],[77,.25],[76,1],[72,1],[74,1],[72,.5],[72,2]],ch:["C","G","C"]}];
    stopSong();const {marks,end}=playTune(L,92);const a=audio();w.classList.add("singing");
    marks.forEach(mk=>{timers.push(setTimeout(()=>{if(mk.si===0)kl.innerHTML=[...L[mk.li].t].map(c=>c===" "?"&nbsp;":`<span>${c}</span>`).join("");const sp=kl.querySelectorAll("span")[mk.si];if(sp)sp.classList.add("on");},Math.max(0,(mk.at-a.currentTime)*1000)));});
    timers.push(setTimeout(()=>{w.classList.remove("singing");blow();},(end-a.currentTime)*1000+300));
  }
  function blow(){
    setStep(`<div class="pmsg">🌬️ 촛불을 눌러서 후~ 불어요!</div>`);say("이제 촛불을 후~ 불어요! 촛불을 하나씩 눌러봐요!");
    const cs=[...candles.querySelectorAll(".candle")];let left=cs.length;
    cs.forEach(c=>c.onclick=()=>{if(c.classList.contains("out"))return;c.classList.add("out");left--;
      const a=audio();const nn=a.createBufferSource();nn.buffer=noise();const f=a.createBiquadFilter(),g=a.createGain();f.type="lowpass";f.frequency.value=900;g.gain.setValueAtTime(.25,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.5);nn.connect(f);f.connect(g);g.connect(a.destination);nn.start();nn.stop(a.currentTime+.5);
      if(!left){setTimeout(celebrate,500);}});
  }
  function celebrate(){
    confetti();sfx.yay();setTimeout(confetti,900);w.classList.add("cheer");
    say(`생일 축하해, ${name}! 엘사 언니랑 신데렐라 언니가 축하한대! 산타 할아버지가 찾은 보물 선물도 열어 봐요!`);
    setStep(`<div class="pmsg">🎁 선물을 눌러서 열어봐요!</div>`);
    const list=(found&&found.length?found:["🎁","💎","⭐","🧸"]).slice(0,6);let opened=0;
    list.forEach((g,i)=>{const b=el(`<button class="gift" style="animation-delay:${i*.15}s"><span class="box">🎁</span><span class="in">${g}</span></button>`);gifts.appendChild(b);
      b.onclick=()=>{if(b.classList.contains("open"))return;b.classList.add("open");opened++;[784,988,1175].forEach((f,k)=>tone(f,.12,"triangle",.12,k*.06));
        bubble(b.getBoundingClientRect().left,b.getBoundingClientRect().top,["우와!","예쁘다!","고마워요!","최고!"][i%4]);
        if(opened===list.length){setTimeout(()=>{const o=el(`<div class="pend"><div>🎂 생일 축하해, ${name}! 🎂</div><button class="pick" data-a="again">🎅 보물찾기 또 하기</button><button class="pick" data-a="world">🗺️ 마을로</button></div>`);w.appendChild(o);confetti();
          say(`호호호! 메리 크리스마스! 그리고 생일 축하해, ${name}!`);
          const q=QUESTS.find(z=>z.id==="santa");if(q)rewardOverlay(completeQuest("santa"),`${q.icon} ${q.place}`);
          o.querySelector('[data-a=again]').onclick=()=>startSanta();o.querySelector('[data-a=world]').onclick=()=>goWorld();},900);}};});
  }
}
