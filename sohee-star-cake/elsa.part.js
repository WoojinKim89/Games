// =====================================================================
//  ELSA'S ICE CASTLE CONCERT + STORYBOOK
//  (original song "티니핑 친구들" — original lyrics & melody)
// =====================================================================
const SONG={bpm:112,lines:[
  {t:"반짝반짝 티니핑",n:[[76,.5],[79,.5],[76,.5],[79,.5],[81,.5],[79,.5],[76,1]],ch:"C"},
  {t:"우리 친구 티니핑",n:[[74,.5],[76,.5],[77,.5],[76,.5],[74,.5],[71,.5],[72,1]],ch:"G"},
  {t:"하츄핑 하트 뿅뿅",n:[[72,.5],[76,.5],[79,1],[81,.5],[79,.5],[76,.5],[79,.5]],ch:"F",who:"hachu"},
  {t:"사랑을 나눠요",n:[[77,.5],[76,.5],[74,.5],[76,.5],[74,.5],[72,1.5]],ch:"C"},
  {t:"다이아나 반짝반짝",n:[[76,.5],[76,.5],[79,.5],[79,.5],[81,.5],[81,.5],[79,.5],[76,.5]],ch:"C",who:"diana"},
  {t:"오로라는 무지개",n:[[77,.5],[77,.5],[76,.5],[74,.5],[76,.5],[74,.5],[72,1]],ch:"F",who:"aurora"},
  {t:"이클립스 달빛마법",n:[[69,.5],[72,.5],[74,.5],[76,.5],[79,.5],[76,.5],[74,.5],[72,.5]],ch:"Am",who:"eclipse"},
  {t:"모두 함께 놀아요",n:[[74,.5],[76,.5],[77,.5],[76,.5],[74,.5],[76,.5],[74,1]],ch:"G"},
  {t:"티니핑 티니핑",n:[[79,.5],[81,.5],[79,1],[76,.5],[77,.5],[76,1]],ch:"C",chorus:1},
  {t:"손을 잡고 랄랄라",n:[[74,.5],[76,.5],[77,.5],[79,.5],[81,.5],[79,.5],[76,1]],ch:"F",chorus:1},
  {t:"소이랑 준이랑",n:[[79,.5],[81,.5],[79,1],[76,.5],[77,.5],[76,1]],ch:"C",chorus:1},
  {t:"리온이도 멍멍멍",n:[[74,.5],[76,.5],[77,.5],[76,.5],[74,.5],[74,.5],[72,1]],ch:"G",chorus:1,rion:1},
  {t:"티니핑 티니핑",n:[[79,.5],[81,.5],[79,1],[76,.5],[77,.5],[76,1]],ch:"C",chorus:1},
  {t:"우리 모두 랄랄라",n:[[74,.5],[76,.5],[77,.5],[79,.5],[81,.5],[83,.5],[84,1]],ch:"F",chorus:1},
  {t:"얼음 성에 반짝반짝",n:[[84,.5],[83,.5],[81,.5],[79,.5],[81,.5],[79,.5],[76,.5],[79,.5]],ch:"G",chorus:1},
  {t:"티니핑 친구들!",n:[[79,.5],[76,.5],[74,.5],[76,.5],[72,2]],ch:"C",chorus:1}
]};
const CHORD={C:[48,52,55],G:[43,47,50],F:[41,45,48],Am:[45,48,52],E:[40,44,47]};
let songBus=null;
function songOut(){const a=audio();if(!songBus||songBus.context!==a){songBus=a.createGain();songBus.gain.value=1;songBus.connect(a.destination);}return songBus;}
function stopSong(){if(songBus){try{songBus.gain.cancelScheduledValues(0);songBus.gain.value=0;songBus.disconnect();}catch(e){}songBus=null;}}
function singNote(f,t0,dur,vol=.16){const a=audio(),out=songOut();
  const g=a.createGain();g.gain.setValueAtTime(0.0001,t0);g.gain.exponentialRampToValueAtTime(vol,t0+.04);g.gain.setValueAtTime(vol*.85,t0+dur*.7);g.gain.exponentialRampToValueAtTime(.0001,t0+dur*.98);
  const f1=a.createBiquadFilter(),f2=a.createBiquadFilter();f1.type=f2.type="bandpass";f1.frequency.value=850;f2.frequency.value=1350;f1.Q.value=f2.Q.value=1.4;
  const mix=a.createGain();mix.gain.value=1.6;
  const o1=a.createOscillator(),o2=a.createOscillator(),o3=a.createOscillator(),lfo=a.createOscillator(),lg=a.createGain();
  o1.type="sawtooth";o2.type="sawtooth";o3.type="sine";o1.frequency.value=f;o2.frequency.value=f*1.004;o3.frequency.value=f;
  lfo.frequency.value=5.6;lg.gain.setValueAtTime(0,t0);lg.gain.linearRampToValueAtTime(f*.012,t0+Math.min(.3,dur*.6));lfo.connect(lg);lg.connect(o1.frequency);lg.connect(o2.frequency);lg.connect(o3.frequency);
  o1.connect(f1);o2.connect(f2);f1.connect(mix);f2.connect(mix);const sg=a.createGain();sg.gain.value=.5;o3.connect(sg);sg.connect(g);mix.connect(g);g.connect(out);
  [o1,o2,o3,lfo].forEach(o=>{o.start(t0);o.stop(t0+dur+.05);});}
function instr(type,f,t0,dur,vol){const a=audio(),out=songOut();const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(vol,t0+.015);g.gain.exponentialRampToValueAtTime(.0001,t0+dur);o.connect(g);g.connect(out);o.start(t0);o.stop(t0+dur+.02);}
function drum(kind,t0){const a=audio(),out=songOut();
  if(kind==="k"){const o=a.createOscillator(),g=a.createGain();o.frequency.setValueAtTime(150,t0);o.frequency.exponentialRampToValueAtTime(45,t0+.15);g.gain.setValueAtTime(.5,t0);g.gain.exponentialRampToValueAtTime(.001,t0+.2);o.connect(g);g.connect(out);o.start(t0);o.stop(t0+.22);return;}
  const n=a.createBufferSource();n.buffer=noise();const f=a.createBiquadFilter(),g=a.createGain();f.type=kind==="h"?"highpass":"bandpass";f.frequency.value=kind==="h"?7000:1800;
  g.gain.setValueAtTime(kind==="h"?.08:.22,t0);g.gain.exponentialRampToValueAtTime(.001,t0+(kind==="h"?.05:.14));n.connect(f);f.connect(g);g.connect(out);n.start(t0);n.stop(t0+.16);}
const mf=m=>440*Math.pow(2,(m-69)/12);
// schedule the whole song; returns per-syllable timing for karaoke
function playSong(opts={}){
  const a=audio();const beat=60/(opts.bpm||SONG.bpm);let t0=a.currentTime+.25;const marks=[];const box=!!opts.musicBox;
  SONG.lines.forEach((ln,li)=>{let t=t0;const ch=CHORD[ln.ch];
    if(!box){for(let b=0;b<4;b++){const tb=t0+b*beat;drum("k",tb);if(b%2)drum("s",tb);drum("h",tb);drum("h",tb+beat/2);
        instr("triangle",mf(ch[0]),tb,beat*.9,.22);ch.forEach((m,i)=>instr("sine",mf(m+12),tb+beat/2+i*.02,beat*.45,.05));}}
    else{ch.forEach((m,i)=>instr("sine",mf(m+12),t0+i*.05,beat*3.5,.04));}
    ln.n.forEach(([m,d],si)=>{if(box){instr("triangle",mf(m+12),t,d*beat*.95,.07);instr("sine",mf(m+24),t,d*beat*.6,.025);}else{singNote(mf(m),t,d*beat*.96,ln.chorus?.17:.15);instr("triangle",mf(m+12),t,d*beat*.5,.025);}
      marks.push({li,si,at:t});t+=d*beat;});
    t0+=4*beat;});
  return {marks,end:t0,start:a.currentTime};
}
function syl(txt){return [...txt].filter(c=>c.trim());}
function startElsa(){
  mode="elsa";clearGame();show(null);field.className="elsa";window.__musicHold=true;stopMusic();
  hud("❄️ 엘사의 얼음 성");
  const w=el(`<div class="elsaw">
    <div class="ice-sky"></div><div class="snowfall"></div>
    <svg class="icecastle" viewBox="0 0 400 300"><defs><linearGradient id="iceC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#bdeaff"/><stop offset="1" stop-color="#7cc8f0"/></linearGradient></defs>
      ${[[60,120,40],[340,120,40],[120,80,50],[280,80,50],[200,20,70]].map(([x,y,w])=>`<path d="M${x-w/2} 300L${x-w/2} ${y+40}L${x} ${y}L${x+w/2} ${y+40}L${x+w/2} 300Z" fill="url(#iceC)" stroke="#fff" stroke-width="3" opacity=".95"/>`).join("")}
      <path d="M90 300L90 170Q200 120 310 170L310 300Z" fill="url(#iceC)" stroke="#fff" stroke-width="3"/>
      ${[0,1,2,3,4,5].map(i=>`<path d="M${110+i*36} 200l8 -16l8 16z" fill="#e8fbff"/>`).join("")}
      <path d="M200 40l6 12l12 2l-9 8l2 13l-11 -6l-11 6l2 -13l-9 -8l12 -2z" fill="#fff"/></svg>
    <div class="doors"><div class="door l"></div><div class="door r"></div></div>
    <div class="elsa-stage"><img class="elsa-img" src="${IMG.elsa2}"><div class="notes"></div></div>
    <div class="pdance"></div>
    <div class="karaoke"><div class="kl"></div><div class="kn"></div></div>
    <div class="elsabtns"><button class="pick" data-a="sing">🎤 노래 불러줘</button><button class="pick" data-a="book">📖 동화책 읽어줘</button></div>
  </div>`);
  field.appendChild(w);
  const snow=w.querySelector(".snowfall");for(let i=0;i<40;i++){const f=el(`<i>${i%5?"❄":"✦"}</i>`);f.style.left=Math.random()*100+"%";f.style.animationDuration=(5+Math.random()*7)+"s";f.style.animationDelay=(-Math.random()*10)+"s";f.style.fontSize=(10+Math.random()*16)+"px";snow.appendChild(f);}
  const pd=w.querySelector(".pdance");const PK=[["hachu","하츄핑",72],["diana","다이아나핑",76],["aurora","오로라핑",79],["eclipse","이클립스핑",84]];
  PK.forEach(([k,n,m],i)=>{const p=el(`<button class="pping" data-k="${k}"><img src="${rpgImg(k).src}"></button>`);p.style.animationDelay=(i*.13)+"s";
    p.onpointerdown=e=>{e.stopPropagation();p.classList.remove("jump");void p.offsetWidth;p.classList.add("jump");instr("triangle",mf(m+12),audio().currentTime,.4,.18);instr("sine",mf(m+24),audio().currentTime,.3,.06);
      const r=p.getBoundingClientRect();bubble(r.left,r.top,["띠링!","♪","랄라~","반짝!"][i]);};pd.appendChild(p);});
  // kids & Rion join the stage
  [["sohee",kidPNG("sohee")],["jun",kidPNG("jun")],["rion",dogPNG()]].forEach(([k,src],i)=>{const p=el(`<button class="pping kidp" data-k="${k}"><img src="${src}"></button>`);p.style.animationDelay=(.5+i*.13)+"s";
    p.onpointerdown=e=>{e.stopPropagation();p.classList.remove("jump");void p.offsetWidth;p.classList.add("jump");if(k==="rion"){sfx.bark();}else{tone(k==="jun"?523:659,.2,"triangle",.15);}const r=p.getBoundingClientRect();bubble(r.left,r.top,k==="rion"?"멍멍!":"랄랄라~");};pd.appendChild(p);});
  const doors=w.querySelector(".doors"),stage=w.querySelector(".elsa-stage"),kara=w.querySelector(".karaoke"),btns=w.querySelector(".elsabtns");
  say("쉿! 얼음 성 문이 열린다!");
  timers.push(setTimeout(()=>{doors.classList.add("open");tone(523,.3,"sine",.1);tone(784,.4,"sine",.1,.15);tone(1047,.6,"sine",.1,.3);
    for(let i=0;i<10;i++)setTimeout(()=>tone(1500+Math.random()*1500,.15,"sine",.05),i*80);},1400));
  timers.push(setTimeout(()=>{stage.classList.add("out");},2300));
  timers.push(setTimeout(()=>{speakSeq([["안녕! 나는 엘사야. 얼음 성에 놀러 와 줘서 고마워! 오늘은 티니핑 친구들 노래를 불러 줄게!","ko"]]);setElsaVoice();},3200));
  timers.push(setTimeout(()=>sing(),9000));
  function setElsaVoice(){}
  let singing=false;
  function sing(){
    if(singing)return;singing=true;stopSong();btns.hidden=true;kara.hidden=false;try{speechSynthesis.cancel();}catch(e){}
    const {marks,end,start}=playSong();const a=audio();
    w.classList.add("singing");w.style.setProperty("--beat",(60/SONG.bpm)+"s");
    const kl=kara.querySelector(".kl"),kn=kara.querySelector(".kn");
    const showLine=li=>{const ln=SONG.lines[li];kl.innerHTML=syl(ln.t).map((c,i)=>`<span data-i="${i}">${c}</span>`).join("").replace(/<\/span><span data-i="(\d+)">/g,(m)=>m);
      kl.innerHTML=[...ln.t].map(c=>c===" "?"&nbsp;":`<span>${c}</span>`).join("");const nx=SONG.lines[li+1];kn.textContent=nx?nx.t:"";
      pd.querySelectorAll(".pping").forEach(p=>p.classList.toggle("star",p.dataset.k===ln.who||(ln.rion&&p.dataset.k==="rion")||(ln.chorus&&/sohee|jun/.test(p.dataset.k)&&li>=10&&li<=11)));};
    marks.forEach(mk=>{const ms=(mk.at-a.currentTime)*1000;timers.push(setTimeout(()=>{if(mk.si===0)showLine(mk.li);const sp=kl.querySelectorAll("span")[mk.si];if(sp)sp.classList.add("on");
      const n=el(`<i>${["♪","♫","❄","♬"][mk.si%4]}</i>`);n.style.left=(30+Math.random()*50)+"%";w.querySelector(".notes").appendChild(n);setTimeout(()=>n.remove(),1600);},Math.max(0,ms)));});
    timers.push(setTimeout(()=>{singing=false;w.classList.remove("singing");kara.hidden=true;btns.hidden=false;confetti();sfx.yay();
      speakSeq([["와아! 다 같이 잘 불렀어! 이제 내가 동화책을 읽어 줄게. 동화책 버튼을 눌러 봐!","ko"]]);},(end-a.currentTime)*1000+400));
  }
  btns.querySelector('[data-a=sing]').onclick=()=>sing();
  btns.querySelector('[data-a=book]').onclick=()=>{stopSong();singing=false;openStorybook();};
  kara.hidden=true;btns.hidden=true;timers.push(setTimeout(()=>{if(!singing)btns.hidden=false;},9000));
}
function kidPNG(k){const [c,x]=makeCanvas(200,230);drawKid(x,k,100,215,"down",0,false,2.3);return c.toDataURL();}
function dogPNG(){const [c,x]=makeCanvas(200,150);drawDog(x,100,140,"left",0,false,2.6);return c.toDataURL();}
// ---------- storybook ----------
const STORY=[
  {bg:"castle",title:"엘사와 사라진 마법 별",text:"옛날 옛날, 반짝반짝 얼음 성에 엘사 언니가 살았어요. 어느 날, 창밖에서 '티니핑 티니핑~' 노랫소리가 들려왔어요.",
   it:[{img:"elsa2",x:62,y:18,w:40,cls:"glow",say:"누가 노래하나?"},{e:"🏰",x:6,y:10,w:30},{e:"🎵",x:40,y:12,w:12}]},
  {bg:"meadow",text:"노래를 부르던 건 하츄핑이랑 티니핑 친구들이었어요. 그런데 하츄핑이 훌쩍훌쩍 울고 있었어요. '내 마법 별이 사라졌어요!'",
   it:[{ping:"hachu",x:36,y:38,w:28,cls:"cry",say:"흑흑... 내 별!"},{ping:"diana",x:6,y:44,w:22,say:"어떡해!"},{ping:"aurora",x:70,y:44,w:22,say:"같이 찾자!"},{e:"💧",x:54,y:36,w:8}]},
  {bg:"meadow",text:"그때 소이 공주님과 준이 기사님, 그리고 강아지 리온이가 나타났어요. '걱정 마! 우리가 도와줄게!'",
   it:[{kid:"sohee",x:14,y:30,w:28,say:"내가 도와줄게!"},{kid:"jun",x:44,y:30,w:28,say:"출발!"},{dog:1,x:70,y:52,w:28,say:"멍멍!"}]},
  {bg:"forest",text:"모두 함께 눈 덮인 숲으로 별을 찾으러 갔어요. 리온이가 킁킁 냄새를 맡더니... 뿡! 방구를 뀌었어요. 모두 깔깔깔 웃었어요!",
   it:[{dog:1,x:38,y:50,w:30,say:"뿡!",fart:1},{e:"💨",x:20,y:56,w:14},{kid:"sohee",x:6,y:28,w:22,say:"깔깔깔!"},{kid:"jun",x:72,y:28,w:22,say:"으악 냄새!"},{e:"🌲",x:2,y:2,w:18},{e:"🌲",x:80,y:4,w:18}]},
  {bg:"forest",text:"리온이가 앞발로 눈을 파고 또 팠어요. 그러자... 반짝! 눈 속에서 마법 별이 나왔어요! 리온이 코가 최고예요!",
   it:[{dog:1,x:20,y:50,w:30,say:"찾았다 멍!"},{e:"⭐",x:58,y:46,w:22,cls:"glow",say:"반짝반짝!"},{e:"❄️",x:80,y:20,w:10}]},
  {bg:"lake",text:"엘사 언니가 얼음 마법으로 별을 반짝반짝 닦아 주었어요. 호수의 인어공주, 은율 엄마도 예쁜 진주 목걸이를 선물했어요.",
   it:[{img:"elsa2",x:2,y:14,w:40,say:"얼음 마법!"},{face:"eunface",x:62,y:32,w:26,say:"소이야, 선물이야!"},{e:"⭐",x:42,y:20,w:14,cls:"glow"},{e:"📿",x:68,y:64,w:12}]},
  {bg:"party",text:"그날 밤, 얼음 성에서 큰 파티가 열렸어요. 모두 함께 티니핑 노래를 부르며 춤을 추었답니다. 끝!",
   it:[{ping:"hachu",x:4,y:46,w:20,cls:"dance"},{kid:"sohee",x:24,y:30,w:24,cls:"dance"},{kid:"jun",x:48,y:30,w:24,cls:"dance"},{ping:"diana",x:74,y:46,w:20,cls:"dance"},{e:"🎆",x:10,y:4,w:16},{e:"🎇",x:70,y:2,w:16},{dog:1,x:36,y:64,w:24,cls:"dance",say:"멍멍 랄랄라!"}]}
];
function openStorybook(){
  const w=field.querySelector(".elsaw");if(w)w.classList.add("reading");
  const ov=el(`<div class="book"><div class="bk-reader"><img src="${IMG.elsaface}"><span>엘사 언니가 읽어줘요</span></div>
    <div class="bk-open"><div class="bk-page"></div></div>
    <div class="bk-text"></div>
    <div class="bk-nav"><button class="pick" data-a="prev">◀</button><span class="bk-no"></span><button class="pick" data-a="play">⏸</button><button class="pick" data-a="next">▶</button></div></div>`);
  field.appendChild(ov);
  // soft music-box background of the same song
  let bgmT=null;const loopBgm=()=>{const s=playSong({musicBox:true,bpm:84});bgmT=setTimeout(loopBgm,(s.end-audio().currentTime)*1000);timers.push(bgmT);};
  stopSong();loopBgm();
  const pageEl=ov.querySelector(".bk-page"),textEl=ov.querySelector(".bk-text"),noEl=ov.querySelector(".bk-no");
  let pi=0,auto=true,token=0;
  const DOGSRC=dogPNG(),KIDS={sohee:kidPNG("sohee"),jun:kidPNG("jun")};
  function itemHTML(it){
    let inner="";if(it.e)inner=`<span class="bk-emo">${it.e}</span>`;else if(it.ping)inner=`<img src="${rpgImg(it.ping).src}">`;else if(it.kid)inner=`<img src="${KIDS[it.kid]}">`;else if(it.dog)inner=`<img src="${DOGSRC}">`;else if(it.face)inner=`<img class="round" src="${IMG[it.face]}">`;else if(it.img)inner=`<img class="soft" src="${IMG[it.img]}">`;
    return `<button class="bk-it ${it.cls||""}" style="left:${it.x}%;top:${it.y}%;width:${it.w}%;${it.e?`font-size:${it.w*.5}cqw`:""}">${inner}</button>`;}
  function show(i,dir){
    pi=Math.max(0,Math.min(STORY.length-1,i));const pg=STORY[pi];token++;const my=token;
    pageEl.className="bk-page bg-"+pg.bg+(dir?" flip"+(dir>0?"N":"P"):"");
    pageEl.innerHTML=(pg.title?`<div class="bk-title">${pg.title}</div>`:"")+pg.it.map(itemHTML).join("");
    pageEl.querySelectorAll(".bk-it").forEach((b,k)=>{const it=pg.it[k];b.onclick=e=>{e.stopPropagation();b.classList.remove("wig");void b.offsetWidth;b.classList.add("wig");
      if(it.fart){fart();}else if(it.dog)sfx.bark();else tone(880+k*120,.15,"triangle",.12);if(it.say){const r=b.getBoundingClientRect();bubble(r.left+r.width/2-30,r.top+20,it.say);}};});
    noEl.textContent=`${pi+1} / ${STORY.length}`;
    // sentence-by-sentence highlight while Elsa reads
    const sents=pg.text.match(/[^.!?]+[.!?]?['’]?/g).map(s=>s.trim()).filter(Boolean);
    textEl.innerHTML=sents.map((s,k)=>`<span data-k="${k}">${s} </span>`).join("");
    tone(600,.08,"sine",.06);
    if(!auto)return;
    let k=0;const next=()=>{if(my!==token)return;if(k>=sents.length){timers.push(setTimeout(()=>{if(my===token&&auto){if(pi<STORY.length-1)show(pi+1,1);else theEnd();}},1600));return;}
      textEl.querySelectorAll("span").forEach((s,j)=>s.classList.toggle("on",j===k));
      const txt=sents[k];k++;let done=false;const fin=()=>{if(done)return;done=true;timers.push(setTimeout(next,350));};
      try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(txt.replace(/['’]/g,""));u.lang="ko-KR";u.rate=.92;u.pitch=1.25;u.onend=fin;u.onerror=fin;speechSynthesis.speak(u);}catch(e){}
      timers.push(setTimeout(fin,Math.max(2200,txt.length*190)));};
    timers.push(setTimeout(next,dir?700:400));
  }
  function theEnd(){auto=false;ov.querySelector('[data-a=play]').textContent="▶";
    const end=el(`<div class="bk-end"><div>🎉 동화 끝! 🎉</div><button class="pick" data-a="again">📖 처음부터</button><button class="pick" data-a="sing2">🎤 노래 또 듣기</button></div>`);ov.appendChild(end);confetti();sfx.yay();
    say("재미있었지? 엘사 언니가 소이랑 준이 정말 사랑해!");
    end.querySelector('[data-a=again]').onclick=()=>{end.remove();auto=true;ov.querySelector('[data-a=play]').textContent="⏸";show(0);};
    end.querySelector('[data-a=sing2]').onclick=()=>{clearTimeout(bgmT);stopSong();ov.remove();if(w)w.classList.remove("reading");const b=field.querySelector('.elsabtns [data-a=sing]');if(b)b.click();};
    const q=QUESTS.find(z=>z.id==="elsa");if(q)setTimeout(()=>rewardOverlay(completeQuest("elsa"),`${q.icon} ${q.place}`),1200);}
  ov.querySelector('[data-a=prev]').onclick=()=>{try{speechSynthesis.cancel();}catch(e){}show(pi-1,-1);};
  ov.querySelector('[data-a=next]').onclick=()=>{try{speechSynthesis.cancel();}catch(e){}if(pi<STORY.length-1)show(pi+1,1);else theEnd();};
  ov.querySelector('[data-a=play]').onclick=e=>{auto=!auto;e.target.textContent=auto?"⏸":"▶";if(auto)show(pi);else{token++;try{speechSynthesis.cancel();}catch(_){}}};
  show(0);
}
