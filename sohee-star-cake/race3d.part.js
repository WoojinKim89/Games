// =====================================================================
//  TRUE 3D RENDERER for the parade Grand Prix (three.js r128)
// =====================================================================
function buildTrack3D(){
  const S=1.9,HY=1.3;
  const P=[[0,0,0],[50,0,0],[95,3,-15],[135,8,10],[140,10,55],[110,6,85],[70,2,70],[45,4,100],[60,9,140],[20,12,165],[-30,8,150],[-60,3,110],[-55,0,60],[-30,0,20]]
    .map(([x,y,z])=>new THREE.Vector3(x*S,y*HY,z*S));
  const curve=new THREE.CatmullRomCurve3(P,true,"centripetal");
  const L=curve.getLength(),N=Math.round(L);const up=new THREE.Vector3(0,1,0);
  const pts=[],tans=[],rights=[];
  for(let i=0;i<=N;i++){const u=(i/N)%1;const p=curve.getPointAt(u),tg=curve.getTangentAt(u);pts.push(p);tans.push(tg);rights.push(new THREE.Vector3().crossVectors(tg,up).normalize());}
  const segs=[];for(let i=0;i<N;i++){const d=tans[i+1].dot(rights[i]);segs.push({i,curve:Math.max(-6,Math.min(6,d*150)),y1:pts[i].y*200,y2:pts[i+1].y*200,spr:[]});}
  segs.forEach((s,i)=>{s.boost=false;s.box=null;s.fart=null;s.coins=null;s.spill=null;
    if(i%12===0)s.spr.push({k:i%24?"lamp":"tree",o:-1.4});if(i%12===6)s.spr.push({k:i%24===6?"balloon":"lamp",o:1.4});
    if(i%9===3)s.spr.push({k:"tree",o:(i%18===3?-1:1)*(2.6+((i*7)%10)/5)});
    if(i%60===25)s.spr.push({k:"crowd",o:-2.3});if(i%60===55)s.spr.push({k:"crowd",o:2.3});
    if(i%150===80)s.spr.push({k:"sign",o:i%300?-2.1:2.1});
    if(i>50&&i%85===0)s.box=[-.6,-.2,.2,.6].map(o=>({o,t:0}));
    if(i>40&&i%115===60)s.boost=(i%230===60)?-.45:.45;
    if(i>20&&i%37===0&&!s.box){const o=[-.5,0,.5][i%3];for(let k=0;k<5;k++){const t=segs[(i+k*2)%N]||null;if(t)(t.coins=t.coins||[]).push({o,t:0});}}
    if(i>90&&i%160===100)s.spill={o:i%320===100?-.3:.35};});
  // second pass for coins that wrapped
  segs.geo={curve,pts,tans,rights,N};
  return segs;
}
function cvTex(w,h,draw,rep){const [c,x]=makeCanvas(w,h);draw(x,w,h);const t=new THREE.CanvasTexture(c);if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;}t.anisotropy=4;return t;}
function create3DRace(segs,glcv,RAC,spr){
  const T=THREE,G=segs.geo,N=G.N,HW=10;
  const renderer=new T.WebGLRenderer({canvas:glcv,antialias:true,powerPreference:"high-performance"});
  renderer.setPixelRatio(Math.min(2,devicePixelRatio||1));renderer.outputEncoding=T.sRGBEncoding;
  const scene=new T.Scene();scene.fog=new T.Fog(0xf0a8d8,90,520);
  const cam=new T.PerspectiveCamera(66,1,.4,3000);
  scene.add(new T.HemisphereLight(0xd8c8ff,0x4f9a45,1.0));const dl=new T.DirectionalLight(0xfff0e6,.75);dl.position.set(120,200,60);scene.add(dl);
  // sky
  {const g=new T.SphereGeometry(2000,32,20);const pos=g.attributes.position;const col=[];const a=new T.Color(0xffb8d8),b=new T.Color(0x7a4fb0),c=new T.Color(0x150f3f);
    for(let i=0;i<pos.count;i++){const y=pos.getY(i)/2000;const cc=y<.02?a.clone():y<.25?a.clone().lerp(b,(y-.02)/.23):b.clone().lerp(c,Math.min(1,(y-.25)/.45));col.push(cc.r,cc.g,cc.b);}
    g.setAttribute("color",new T.Float32BufferAttribute(col,3));scene.add(new T.Mesh(g,new T.MeshBasicMaterial({vertexColors:true,side:T.BackSide,fog:false})));
    const sg=new T.BufferGeometry();const sp=[];for(let i=0;i<900;i++){const th=Math.random()*Math.PI*2,ph=Math.random()*1.2;sp.push(Math.cos(th)*Math.sin(ph)*1800,Math.cos(ph)*1800,Math.sin(th)*Math.sin(ph)*1800);}
    sg.setAttribute("position",new T.Float32BufferAttribute(sp,3));scene.add(new T.Points(sg,new T.PointsMaterial({color:0xffffff,size:2.2,sizeAttenuation:false,fog:false})));
    const moon=new T.Sprite(new T.SpriteMaterial({map:cvTex(128,128,(x)=>{const gg=x.createRadialGradient(64,64,10,64,64,64);gg.addColorStop(0,"#fffbe0");gg.addColorStop(.45,"#fff3b0");gg.addColorStop(.5,"rgba(255,240,180,.4)");gg.addColorStop(1,"rgba(255,240,180,0)");x.fillStyle=gg;x.fillRect(0,0,128,128);}),fog:false,depthWrite:false}));
    moon.scale.set(220,220,1);moon.position.set(-900,700,-600);scene.add(moon);}
  // ground
  {const tex=cvTex(256,256,(x)=>{x.fillStyle="#6abd55";x.fillRect(0,0,256,256);for(let i=0;i<1400;i++){x.fillStyle=Math.random()<.5?"#5fae4a":"#7fd06a";x.fillRect(Math.random()*256,Math.random()*256,2,4);}
      for(let i=0;i<40;i++){x.fillStyle=["#ff9ad5","#fff","#ffe066"][i%3];x.beginPath();x.arc(Math.random()*256,Math.random()*256,2.2,0,7);x.fill();}},true);tex.repeat.set(220,220);
    const gm=new T.Mesh(new T.PlaneGeometry(6000,6000),new T.MeshLambertMaterial({map:tex}));gm.rotation.x=-Math.PI/2;gm.position.set(100,-.6,150);scene.add(gm);}
  // ribbons along track
  const ribbon=(off1,off2,dy1,dy2,mat,vScale,y2abs)=>{const pos=[],uv=[],idx=[];
    for(let i=0;i<=N;i++){const p=G.pts[i],r=G.rights[i];const a=p.clone().addScaledVector(r,off1),b=p.clone().addScaledVector(r,off2);a.y+=dy1;b.y=y2abs!==undefined?y2abs:b.y+dy2;
      pos.push(a.x,a.y,a.z,b.x,b.y,b.z);uv.push(0,i/vScale,1,i/vScale);if(i<N){const k=i*2;idx.push(k,k+1,k+2,k+1,k+3,k+2);}}
    const g=new T.BufferGeometry();g.setAttribute("position",new T.Float32BufferAttribute(pos,3));g.setAttribute("uv",new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
    const m=new T.Mesh(g,mat);scene.add(m);return m;};
  const roadTex=cvTex(256,512,(x,w,h)=>{const g=x.createLinearGradient(0,0,w,0);g.addColorStop(0,"#8e52b8");g.addColorStop(.5,"#a86ad0");g.addColorStop(1,"#8e52b8");x.fillStyle=g;x.fillRect(0,0,w,h);
    for(let i=0;i<900;i++){x.fillStyle=`rgba(255,255,255,${Math.random()*.06})`;x.fillRect(Math.random()*w,Math.random()*h,2,2);}
    x.fillStyle="rgba(255,255,255,.85)";for(const lx of[w/3,2*w/3])for(let y=0;y<h;y+=128)x.fillRect(lx-3,y,6,64);
    x.fillStyle="#ffd34d";for(let y=32;y<h;y+=128)x.fillRect(w/2-4,y,8,64);
    for(let i=0;i<10;i++){x.font="22px serif";x.globalAlpha=.25;x.fillText("✦",Math.random()*w,Math.random()*h);x.globalAlpha=1;}},true);
  const roadSide=T.DoubleSide;
  ribbon(-HW,HW,.02,.02,new T.MeshLambertMaterial({map:roadTex,side:roadSide}),16);
  const curbTex=cvTex(64,128,(x)=>{x.fillStyle="#e8455a";x.fillRect(0,0,64,64);x.fillStyle="#fff";x.fillRect(0,64,64,64);},true);
  ribbon(-HW-1.8,-HW,.05,.05,new T.MeshLambertMaterial({map:curbTex,side:roadSide}),3);ribbon(HW,HW+1.8,.05,.05,new T.MeshLambertMaterial({map:curbTex,side:roadSide}),3);
  const bankTex=cvTex(64,64,(x)=>{x.fillStyle="#63b04e";x.fillRect(0,0,64,64);for(let i=0;i<60;i++){x.fillStyle="#4f9a40";x.fillRect(Math.random()*64,Math.random()*64,2,3);}},true);
  const bankM=new T.MeshLambertMaterial({map:bankTex,side:roadSide});ribbon(-HW-1.8,-HW-9,.05,0,bankM,4,-.55);ribbon(HW+1.8,HW+9,.05,0,bankM,4,-.55);
  // start line + arch
  {const ck=cvTex(128,32,(x)=>{for(let i=0;i<16;i++)for(let j=0;j<4;j++){x.fillStyle=(i+j)%2?"#fff":"#222";x.fillRect(i*8,j*8,8,8);}});
    const sg=new T.Group();placeAlong(sg,1,0,.07);const pl=new T.Mesh(new T.PlaneGeometry(HW*2,2.4),new T.MeshBasicMaterial({map:ck}));pl.rotation.x=-Math.PI/2;sg.add(pl);scene.add(sg);
    const arch=new T.Group();const pm=new T.MeshLambertMaterial({color:0x3a2a5a});for(const s of[-1,1]){const c=new T.Mesh(new T.CylinderGeometry(.8,.9,14,12),pm);c.position.set(s*(HW+2.5),7,0);arch.add(c);
      const ball=new T.Mesh(new T.SphereGeometry(1.3,16,12),new T.MeshLambertMaterial({color:0xffd34d,emissive:0x6a4a00}));ball.position.set(s*(HW+2.5),14.5,0);arch.add(ball);}
    const ban=new T.Mesh(new T.PlaneGeometry((HW+3.5)*2,5.2),new T.MeshBasicMaterial({map:new T.CanvasTexture(spr.arch),side:T.DoubleSide,transparent:true}));ban.position.set(0,12,0);arch.add(ban);
    placeAlong(arch,3,0,0,true);scene.add(arch);}
  function frameAt(i){i=((i%N)+N)%N;const f=Math.floor(i),k=i-f;const p=G.pts[f].clone().lerp(G.pts[f+1],k),tg=G.tans[f].clone().lerp(G.tans[f+1],k).normalize(),r=G.rights[f].clone().lerp(G.rights[f+1],k).normalize();return {p,tg,r};}
  function placeAlong(obj,segI,off,dy,face){const {p,tg,r}=frameAt(segI);obj.position.copy(p).addScaledVector(r,off*HW);obj.position.y+=dy||0;const yaw=Math.atan2(tg.x,tg.z);obj.rotation.set(0,yaw+(face?Math.PI:0),0);return obj;}
  // ---------- scenery ----------
  const lampList=[],treeList=[],balloonList=[];
  segs.forEach(s=>s.spr.forEach(sp=>{if(sp.k==="lamp")lampList.push([s.i,sp.o]);else if(sp.k==="tree")treeList.push([s.i,sp.o]);else if(sp.k==="balloon")balloonList.push([s.i,sp.o]);
    else if(sp.k==="crowd"){const g=new T.Group();const tex=new T.CanvasTexture(spr.crowd);const front=new T.Mesh(new T.PlaneGeometry(20,12.7),new T.MeshLambertMaterial({map:tex,transparent:true,side:T.DoubleSide}));front.position.y=6.4;front.rotation.x=-.25;g.add(front);
      const back=new T.Mesh(new T.BoxGeometry(20,.6,6),new T.MeshLambertMaterial({color:0x4a2f8a}));back.position.set(0,.3,-2);g.add(back);
      placeAlong(g,s.i,sp.o,0);const {p}=frameAt(s.i);g.lookAt(p.x,g.position.y,p.z);scene.add(g);}
    else if(sp.k==="sign"){const g=new T.Group();const pl=new T.Mesh(new T.PlaneGeometry(16,9),new T.MeshBasicMaterial({map:new T.CanvasTexture(spr.sign),transparent:true,side:T.DoubleSide}));pl.position.y=5.5;g.add(pl);
      placeAlong(g,s.i,sp.o,0);const {p}=frameAt(s.i+25);g.lookAt(p.x,g.position.y,p.z);scene.add(g);}}));
  {const post=new T.InstancedMesh(new T.CylinderGeometry(.22,.3,8,8),new T.MeshLambertMaterial({color:0x3a2a5a}),lampList.length);const bulb=new T.InstancedMesh(new T.SphereGeometry(.7,12,8),new T.MeshBasicMaterial({color:0xfff3b0}),lampList.length);
    const glowT=cvTex(64,64,(x)=>{const g=x.createRadialGradient(32,32,2,32,32,32);g.addColorStop(0,"rgba(255,250,210,1)");g.addColorStop(1,"rgba(255,220,120,0)");x.fillStyle=g;x.fillRect(0,0,64,64);});
    const m=new T.Object3D();lampList.forEach(([i,o],k)=>{placeAlong(m,i,o,4);m.updateMatrix();post.setMatrixAt(k,m.matrix);m.position.y+=4.3;m.updateMatrix();bulb.setMatrixAt(k,m.matrix);
      const gl=new T.Sprite(new T.SpriteMaterial({map:glowT,blending:T.AdditiveBlending,depthWrite:false,transparent:true}));gl.position.copy(m.position);gl.scale.set(5,5,1);scene.add(gl);});
    scene.add(post,bulb);}
  {const trunk=new T.InstancedMesh(new T.CylinderGeometry(.4,.55,3,8),new T.MeshLambertMaterial({color:0x7a5a35}),treeList.length);const crown=new T.InstancedMesh(new T.IcosahedronGeometry(2.6,1),new T.MeshLambertMaterial({color:0xffffff,flatShading:true}),treeList.length);
    const m=new T.Object3D(),c=new T.Color();const pal=[0x3f9a45,0x4fb25a,0x2f8a5a,0x5fbf5a,0xff9ad5];
    treeList.forEach(([i,o],k)=>{const s=.9+((i*13)%7)/10;placeAlong(m,i,o,1.5*s);m.scale.set(s,s,s);m.updateMatrix();trunk.setMatrixAt(k,m.matrix);m.position.y+=3.2*s;m.updateMatrix();crown.setMatrixAt(k,m.matrix);crown.setColorAt(k,c.setHex(pal[(i*7+k)%(k%9?4:5)]));});
    if(crown.instanceColor)crown.instanceColor.needsUpdate=true;scene.add(trunk,crown);}
  {const cnt=balloonList.length*5;const bm=new T.InstancedMesh(new T.SphereGeometry(.85,14,10),new T.MeshPhongMaterial({color:0xffffff,shininess:80}),cnt);const m=new T.Object3D(),c=new T.Color();const pal=[0xff6b8b,0xffe066,0x7fd6ff,0xb48cf0,0x7fe08a];let k=0;
    balloonList.forEach(([i,o])=>{for(let j=0;j<5;j++){placeAlong(m,i,o,6+(j%2)*1.4+Math.floor(j/2)*.9);const {r}=frameAt(i);m.position.addScaledVector(r,(j-2)*.9);m.scale.set(1,1.25,1);m.updateMatrix();bm.setMatrixAt(k,m.matrix);bm.setColorAt(k,c.setHex(pal[(j+i)%5]));k++;}});
    if(bm.instanceColor)bm.instanceColor.needsUpdate=true;scene.add(bm);}
  // ---------- landmarks ----------
  const center=new T.Vector3();G.pts.forEach(p=>center.add(p));center.divideScalar(G.pts.length);
  const castle=new T.Group();{const wall=new T.MeshLambertMaterial({color:0xe6d6ff}),roof=new T.MeshLambertMaterial({color:0xff8fc8}),roof2=new T.MeshLambertMaterial({color:0xb48cf0}),win=new T.MeshBasicMaterial({color:0xffe9a8});
    const add=(geo,mat,x,y,z)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);castle.add(m);return m;};
    add(new T.BoxGeometry(30,18,20),wall,0,9,0);add(new T.CylinderGeometry(6,6,30,16),wall,0,15,0);add(new T.ConeGeometry(7.5,16,16),roof,0,38,0);
    for(const [x,z] of[[-17,-11],[17,-11],[-17,11],[17,11]]){add(new T.CylinderGeometry(3.5,3.5,24,14),wall,x,12,z);add(new T.ConeGeometry(4.6,11,14),roof2,x,29.5,z);}
    for(let i=0;i<10;i++)add(new T.BoxGeometry(1.4,2.4,.3),win,-12+i*2.7,11,10.2);add(new T.BoxGeometry(6,9,.4),new T.MeshLambertMaterial({color:0x7a4fc0}),0,4.5,10.2);
    const flag=add(new T.ConeGeometry(.2,6,6),new T.MeshBasicMaterial({color:0xffd34d}),0,49,0);castle.position.copy(center);castle.position.y=-.5;castle.scale.setScalar(1.6);scene.add(castle);}
  const wheel=new T.Group();{const ring=new T.Mesh(new T.TorusGeometry(26,.7,8,48),new T.MeshLambertMaterial({color:0x9a7ae0}));wheel.add(ring);const ring2=ring.clone();ring2.position.z=3;wheel.add(ring2);
    const cols=[0xff6b8b,0xffe066,0x7fd6ff,0x7fe08a,0xb48cf0];for(let i=0;i<16;i++){const a=i/16*Math.PI*2;const sp=new T.Mesh(new T.BoxGeometry(.4,26,.4),new T.MeshLambertMaterial({color:0xc8b4ff}));sp.position.set(Math.cos(a)*13,Math.sin(a)*13,1.5);sp.rotation.z=a+Math.PI/2;wheel.add(sp);
      const cab=new T.Mesh(new T.BoxGeometry(3,3,3),new T.MeshLambertMaterial({color:cols[i%5],emissive:cols[i%5],emissiveIntensity:.25}));cab.position.set(Math.cos(a)*26,Math.sin(a)*26,1.5);cab.userData.cab=1;wheel.add(cab);}
    const hold=new T.Group();hold.add(wheel);wheel.position.y=32;for(const s of[-1,1]){const leg=new T.Mesh(new T.CylinderGeometry(.8,.8,36,8),new T.MeshLambertMaterial({color:0x7a5ac0}));leg.position.set(s*9,16,1.5);leg.rotation.z=s*.28;hold.add(leg);}
    hold.position.set(center.x+210,-.5,center.z-120);hold.lookAt(center.x,0,center.z);scene.add(hold);}
  {const pts=[];for(let i=0;i<=80;i++){const a=i/80*Math.PI*2;pts.push(new T.Vector3(center.x-230+Math.cos(a)*70,14+Math.sin(a*3)*10+Math.sin(a*7)*3,center.z+140+Math.sin(a)*45));}
    const cc=new T.CatmullRomCurve3(pts,true);scene.add(new T.Mesh(new T.TubeGeometry(cc,240,1.1,8,true),new T.MeshLambertMaterial({color:0xff6bd0})));
    for(let i=0;i<40;i++){const p=cc.getPointAt(i/40);const s=new T.Mesh(new T.CylinderGeometry(.35,.35,p.y+.5,6),new T.MeshLambertMaterial({color:0x7a5ac0}));s.position.set(p.x,p.y/2-.3,p.z);scene.add(s);}}
  {const car=new T.Group();const base=new T.Mesh(new T.CylinderGeometry(16,16,2,24),new T.MeshLambertMaterial({color:0xffd1e6}));car.add(base);const roof=new T.Mesh(new T.ConeGeometry(18,10,24),new T.MeshLambertMaterial({color:0xff6b8b}));roof.position.y=16;car.add(roof);
    for(let i=0;i<10;i++){const a=i/10*Math.PI*2;const pole=new T.Mesh(new T.CylinderGeometry(.25,.25,11,6),new T.MeshLambertMaterial({color:0xffd34d}));pole.position.set(Math.cos(a)*12,6.5,Math.sin(a)*12);car.add(pole);
      const horse=new T.Mesh(new T.BoxGeometry(1.4,2,3.2),new T.MeshLambertMaterial({color:[0xffffff,0x7fd6ff,0xffe066][i%3]}));horse.position.set(Math.cos(a)*12,5,Math.sin(a)*12);car.add(horse);}
    car.position.set(center.x+160,-.3,center.z+230);scene.add(car);var carousel=car;}
  for(let i=0;i<26;i++){const a=i/26*Math.PI*2;const m=new T.Mesh(new T.ConeGeometry(70+Math.random()*60,90+Math.random()*80,6),new T.MeshLambertMaterial({color:0x5a4a9a,flatShading:true}));m.position.set(center.x+Math.cos(a)*900,20,center.z+Math.sin(a)*900);scene.add(m);}
  // ---------- track objects ----------
  const boxTex=new T.CanvasTexture(spr.box);const boxGeo=new T.BoxGeometry(2.4,2.4,2.4);const boxMat=new T.MeshLambertMaterial({map:boxTex,emissive:0x553300,transparent:true,opacity:.95});
  const boxes=[];segs.forEach(s=>{if(s.box)s.box.forEach(b=>{const m=new T.Mesh(boxGeo,boxMat);placeAlong(m,s.i,b.o,2);scene.add(m);boxes.push({m,b,y:m.position.y});});});
  const starShape=new T.Shape();for(let i=0;i<10;i++){const rr=i%2?.42:1,a=Math.PI/2+i*Math.PI/5;i?starShape.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):starShape.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}
  const coinList=[];segs.forEach(s=>{if(s.coins)s.coins.forEach(c=>coinList.push([s.i,c]));});
  const coins=new T.InstancedMesh(new T.ExtrudeGeometry(starShape,{depth:.3,bevelEnabled:true,bevelSize:.08,bevelThickness:.08,bevelSegments:1}),new T.MeshPhongMaterial({color:0xffd34d,emissive:0x8a5a00,shininess:100}),Math.max(1,coinList.length));
  scene.add(coins);
  const boostTex=cvTex(128,256,(x)=>{const cols=["#ff6b8b","#ffb04d","#ffe066","#7fe08a","#6cc8f5","#b48cf0"];cols.forEach((c,i)=>{x.fillStyle=c;x.fillRect(i*128/6,0,128/6+1,256);});x.fillStyle="rgba(255,255,255,.85)";for(let k=0;k<3;k++){x.beginPath();x.moveTo(20,60+k*70);x.lineTo(64,20+k*70);x.lineTo(108,60+k*70);x.lineTo(108,80+k*70);x.lineTo(64,40+k*70);x.lineTo(20,80+k*70);x.fill();}});
  segs.forEach(s=>{if(s.boost!==false){const g=new T.Group();placeAlong(g,s.i+2,s.boost,.09);const m=new T.Mesh(new T.PlaneGeometry(6,8),new T.MeshBasicMaterial({map:boostTex,transparent:true}));m.rotation.x=-Math.PI/2;g.add(m);scene.add(g);}
    if(s.spill){const m=new T.Mesh(new T.CircleGeometry(3,24),new T.MeshBasicMaterial({color:0x7a3c14,transparent:true,opacity:.75}));const {p,r}=frameAt(s.i);m.position.copy(p).addScaledVector(r,s.spill.o*HW);m.position.y+=.07;m.rotation.x=-Math.PI/2;scene.add(m);
      const cup=new T.Sprite(new T.SpriteMaterial({map:cvTex(64,64,(x)=>{x.font="52px serif";x.textAlign="center";x.textBaseline="middle";x.fillText("🥤",32,34);}),transparent:true}));cup.position.copy(m.position);cup.position.y+=1.4;cup.scale.set(2.6,2.6,1);scene.add(cup);}});
  const fartTex=cvTex(128,128,(x)=>{x.font="110px serif";x.textAlign="center";x.textBaseline="middle";x.fillText("💨",64,70);});const farts=new Map();
  // ---------- karts ----------
  function faceTex(r){return cvTex(256,256,(x)=>{const im=rpgImg(r.face);x.beginPath();x.arc(128,140,104,0,7);x.fillStyle="#fff";x.fill();x.lineWidth=10;x.strokeStyle=shade(r.col,-.45);x.stroke();x.save();x.beginPath();x.arc(128,140,96,0,7);x.clip();
      if(im.complete&&im.naturalWidth){if(r.crop){const [u,v,s]=r.crop;const sw=im.naturalWidth*s;x.drawImage(im,im.naturalWidth*u-sw/2,im.naturalHeight*v-sw/2,sw,sw,32,44,192,192);}else{const s=220,ar=im.naturalHeight/im.naturalWidth;x.drawImage(im,128-s/2,140-s*ar/2,s,s*ar);}}x.restore();
      if(r.crown){x.font="64px serif";x.textAlign="center";x.fillText("👑",128,52);}});}
  function makeKart(r){
    const g=new T.Group();const body=new T.Group();g.add(body);const col=new T.Color(r.col);
    const paint=new T.MeshPhongMaterial({color:col,shininess:90,specular:0x666666});const dark=new T.MeshPhongMaterial({color:col.clone().multiplyScalar(.6),shininess:40});const gold=new T.MeshPhongMaterial({color:0xffd34d,emissive:0x4a3000,shininess:120});
    if(r.theme==="pumpkin"){const pk=new T.Mesh(new T.SphereGeometry(2,24,16),paint);pk.scale.set(1.05,.8,1.2);pk.position.y=1.6;body.add(pk);const st=new T.Mesh(new T.CylinderGeometry(.15,.25,.8,8),new T.MeshLambertMaterial({color:0x4caf50}));st.position.y=3.3;body.add(st);}
    else if(r.theme==="shell"){const sh=new T.Mesh(new T.SphereGeometry(2.2,24,12,0,Math.PI*2,0,Math.PI/2),paint);sh.scale.set(1,.7,1.15);sh.position.y=.9;body.add(sh);const base=new T.Mesh(new T.BoxGeometry(3.6,.7,4.4),dark);base.position.y=.9;body.add(base);}
    else{const base=new T.Mesh(new T.BoxGeometry(3.4,1.1,4.6),paint);base.position.y=1.05;body.add(base);const hood=new T.Mesh(new T.BoxGeometry(3,.7,1.6),paint);hood.position.set(0,1.85,1.4);hood.rotation.x=.25;body.add(hood);
      const back=new T.Mesh(new T.BoxGeometry(3.2,1.4,1.2),dark);back.position.set(0,2,-1.6);body.add(back);}
    const trim=new T.Mesh(new T.TorusGeometry(1.9,.12,6,30),gold);trim.rotation.x=Math.PI/2;trim.scale.set(1,1.25,1);trim.position.y=.55;body.add(trim);
    const wheels=[];for(const [x,z] of[[-1.75,1.4],[1.75,1.4],[-1.8,-1.5],[1.8,-1.5]]){const w=new T.Group();const tire=new T.Mesh(new T.CylinderGeometry(.75,.75,.6,18),new T.MeshLambertMaterial({color:0x221a33}));tire.rotation.z=Math.PI/2;w.add(tire);
      const hub=new T.Mesh(new T.CylinderGeometry(.38,.38,.64,10),gold);hub.rotation.z=Math.PI/2;w.add(hub);w.position.set(x,.75,z);body.add(w);wheels.push(w);}
    for(const [x,c2] of[[-1.4,0xff6b8b],[1.4,0xffe066]]){const st=new T.Mesh(new T.CylinderGeometry(.05,.05,2.4,4),new T.MeshBasicMaterial({color:0xffffff}));st.position.set(x,3,-1.7);body.add(st);const b=new T.Mesh(new T.SphereGeometry(.55,12,10),new T.MeshPhongMaterial({color:c2,shininess:90}));b.scale.y=1.2;b.position.set(x,4.4,-1.7);body.add(b);}
    for(const x of[-1,1]){const tl=new T.Mesh(new T.BoxGeometry(.7,.35,.1),new T.MeshBasicMaterial({color:0xff3d6e}));tl.position.set(x*1.2,1.3,-2.32);body.add(tl);}
    const flames=[];for(const x of[-.7,.7]){const f=new T.Mesh(new T.ConeGeometry(.45,2.2,10),new T.MeshBasicMaterial({color:0xffa040,transparent:true,opacity:.85,blending:T.AdditiveBlending,depthWrite:false}));f.rotation.x=-Math.PI/2;f.position.set(x,.8,-3.4);f.visible=false;body.add(f);flames.push(f);}
    const face=new T.Sprite(new T.SpriteMaterial({map:faceTex(r),transparent:true}));face.scale.set(3.4,3.4,1);face.position.set(0,3.9,-.3);g.add(face);
    const shadow=new T.Mesh(new T.CircleGeometry(2.6,20),new T.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.3,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.05;shadow.scale.set(1,1.3,1);g.add(shadow);
    const shield=new T.Mesh(new T.SphereGeometry(3.6,20,14),new T.MeshBasicMaterial({color:0xff7ab8,transparent:true,opacity:.28,depthWrite:false}));shield.position.y=2.2;shield.visible=false;g.add(shield);
    let label=null;if(r.k){label=new T.Sprite(new T.SpriteMaterial({map:cvTex(256,64,(x)=>{x.font="bold 34px Jua,sans-serif";x.textAlign="center";x.textBaseline="middle";x.lineWidth=8;x.strokeStyle="#2b1f40";x.strokeText(r.n,128,32);x.fillStyle="#fff";x.fillText(r.n,128,32);}),transparent:true,depthTest:false}));label.scale.set(6,1.5,1);label.position.y=6.6;g.add(label);}
    scene.add(g);return {g,body,wheels,flames,face,shield,label};
  }
  const karts={};RAC.forEach(r=>karts[r.k]=makeKart(r));
  // ---------- particles ----------
  const PN=600;const pg=new T.BufferGeometry();const pPos=new Float32Array(PN*3),pCol=new Float32Array(PN*3);pg.setAttribute("position",new T.BufferAttribute(pPos,3));pg.setAttribute("color",new T.BufferAttribute(pCol,3));
  const pts=new T.Points(pg,new T.PointsMaterial({size:.55,vertexColors:true,transparent:true,blending:T.AdditiveBlending,depthWrite:false}));scene.add(pts);const P=[];let pi=0;
  function emit(pos,vel,col,life){P[pi]={x:pos.x,y:pos.y,z:pos.z,vx:vel.x,vy:vel.y,vz:vel.z,c:new T.Color(col),l:life,L:life};pi=(pi+1)%PN;}
  const FN=900;const fg=new T.BufferGeometry();const fPos=new Float32Array(FN*3),fCol=new Float32Array(FN*3);fg.setAttribute("position",new T.BufferAttribute(fPos,3));fg.setAttribute("color",new T.BufferAttribute(fCol,3));
  scene.add(new T.Points(fg,new T.PointsMaterial({size:2.4,vertexColors:true,transparent:true,blending:T.AdditiveBlending,depthWrite:false,fog:false})));const F=[];let fi=0;
  function firework(){const c=new T.Color([0xff6b8b,0xffe066,0x7fd6ff,0xb48cf0,0x7fe08a][Math.floor(Math.random()*5)]);const a=Math.random()*Math.PI*2,d=250+Math.random()*250;
    const o=new T.Vector3(center.x+Math.cos(a)*d,90+Math.random()*90,center.z+Math.sin(a)*d);for(let i=0;i<70;i++){const v=new T.Vector3(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize().multiplyScalar(18+Math.random()*10);F[fi]={p:o.clone(),v,c,l:1.6};fi=(fi+1)%FN;}}
  // ---------- per-frame ----------
  const camPos=new T.Vector3(),camLook=new T.Vector3();let camInit=false,fovNow=66,W=1,H=1;
  function resize(w,h){W=w;H=h;renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();}
  const TL=N*RC.SEG;const toI=z=>(((z%TL)+TL)%TL)/RC.SEG;
  function placeKart(k,z,xo,yaw,roll,t,speed,state){const K=karts[k];const {p,tg,r}=frameAt(toI(z));K.g.position.copy(p).addScaledVector(r,xo*HW);K.g.position.y+=.05;
    K.g.rotation.set(0,Math.atan2(tg.x,tg.z)+yaw,0);K.body.rotation.set(-Math.asin(Math.max(-1,Math.min(1,tg.y)))*1,0,roll);
    K.wheels.forEach(w=>w.rotation.x+=speed*.00012);K.body.position.y=Math.sin(t*18)*.04*(speed>500?1:0);
    K.flames.forEach(f=>{f.visible=!!state.boost;if(f.visible){f.scale.set(1,1+Math.random()*.6,1);}});K.shield.visible=!!state.shield;return {p:K.g.position,tg,r};}
  function render(st){
    const {me,rivals,t,dt,pk,shake,moonT,boostOn,uni}=st;
    rivals.forEach(r=>placeKart(r.k,r.z,r.x,r.spin>0?t*12:0,0,t,r.speed,{boost:r.boost>0,shield:r.shield>0}));
    RAC.forEach(r=>{if(r.k!==pk&&!rivals.some(q=>q.k===r.k))karts[r.k].g.visible=false;});
    const yaw=me.spin>0?t*14:me.drift?me.driftDir*.42:me.steer*.12;
    const P0=placeKart(pk,me.pos+RC.PZ,me.x,yaw,me.drift?-me.driftDir*.08:-me.steer*.05,t,me.speed,{boost:boostOn||uni,shield:me.shield>0});
    if(karts[pk].label)karts[pk].label.visible=false;
    // particles from player
    const back=P0.p.clone().addScaledVector(P0.tg,-2.4);back.y+=.4;
    if(me.drift){const lv=me.driftCharge>2.2?3:me.driftCharge>1.4?2:me.driftCharge>.7?1:0;const col=[0xffffff,0x5fb8ff,0xffb04d,0xff5fd0][lv];
      for(let i=0;i<4;i++)for(const s of[-1,1]){const q=back.clone().addScaledVector(P0.r,s*1.8);emit(q,new T.Vector3((Math.random()-.5)*4,2+Math.random()*4,(Math.random()-.5)*4),col,.45);}}
    if(boostOn||uni)for(let i=0;i<5;i++)emit(back.clone().addScaledVector(P0.r,(Math.random()-.5)*1.6),P0.tg.clone().multiplyScalar(-6).add(new T.Vector3(0,Math.random()*2,0)),[0xff6b3d,0xffb04d,0xffe066][i%3],.35);
    if(Math.abs(me.x)>1.05)for(let i=0;i<3;i++)emit(back.clone(),new T.Vector3((Math.random()-.5)*5,3+Math.random()*3,(Math.random()-.5)*5),0xa07840,.6);
    for(let i=0;i<PN;i++){const q=P[i];if(!q||q.l<=0){pPos[i*3+1]=-999;continue;}q.l-=dt;q.vy-=9*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.z+=q.vz*dt;pPos[i*3]=q.x;pPos[i*3+1]=q.y;pPos[i*3+2]=q.z;const k=Math.max(0,q.l/q.L);pCol[i*3]=q.c.r*k;pCol[i*3+1]=q.c.g*k;pCol[i*3+2]=q.c.b*k;}
    pg.attributes.position.needsUpdate=true;pg.attributes.color.needsUpdate=true;
    if(Math.random()<dt*1.3)firework();
    for(let i=0;i<FN;i++){const q=F[i];if(!q||q.l<=0){fPos[i*3+1]=-999;continue;}q.l-=dt;q.v.y-=6*dt;q.v.multiplyScalar(.985);q.p.addScaledVector(q.v,dt);fPos[i*3]=q.p.x;fPos[i*3+1]=q.p.y;fPos[i*3+2]=q.p.z;const k=Math.min(1,q.l);fCol[i*3]=q.c.r*k;fCol[i*3+1]=q.c.g*k;fCol[i*3+2]=q.c.b*k;}
    fg.attributes.position.needsUpdate=true;fg.attributes.color.needsUpdate=true;
    // boxes/coins/farts
    boxes.forEach(o=>{o.m.visible=o.b.t<=0;o.m.rotation.y=t*1.6;o.m.rotation.x=.3;o.m.position.y=o.y+Math.sin(t*3+o.y)*.35;});
    const m=new T.Object3D();coinList.forEach(([i,c],k)=>{if(c.t>0){m.scale.setScalar(0.0001);}else{placeAlong(m,i,c.o,2.4+Math.sin(t*4+i)*.3);m.rotation.y=t*3+i;m.scale.setScalar(1);}m.updateMatrix();coins.setMatrixAt(k,m.matrix);});coins.instanceMatrix.needsUpdate=true;
    segs.forEach(s=>{if(s.fart&&!farts.has(s.i)){const sp=new T.Sprite(new T.SpriteMaterial({map:fartTex,transparent:true}));placeAlong(sp,s.i,s.fart.o,2.2);sp.scale.set(6,6,1);scene.add(sp);farts.set(s.i,sp);}
      else if(!s.fart&&farts.has(s.i)){scene.remove(farts.get(s.i));farts.delete(s.i);}});
    farts.forEach(sp=>{sp.material.rotation=Math.sin(t*3)*.2;});
    wheel.rotation.z=t*.12;carousel.rotation.y=t*.4;
    // camera
    const tgtPos=P0.p.clone().addScaledVector(P0.tg,-11).add(new T.Vector3(0,4.6,0)).addScaledVector(P0.r,-me.x*0);
    const look=P0.p.clone().addScaledVector(P0.tg,9).add(new T.Vector3(0,1.6,0));
    if(!camInit){camPos.copy(tgtPos);camLook.copy(look);camInit=true;}
    camPos.lerp(tgtPos,Math.min(1,dt*7));camLook.lerp(look,Math.min(1,dt*9));
    cam.position.copy(camPos);if(shake>0){cam.position.x+=(Math.random()-.5)*.8;cam.position.y+=(Math.random()-.5)*.6;}
    cam.lookAt(camLook);
    const fovT=(boostOn||uni)?82:me.drift?70:66;fovNow+=(fovT-fovNow)*Math.min(1,dt*4);cam.fov=fovNow;cam.updateProjectionMatrix();
    scene.fog.color.setHex(moonT>0?0x6a4fb0:0xf0a8d8);
    renderer.render(scene,cam);
  }
  return {render,resize,dispose:()=>{try{renderer.dispose();renderer.forceContextLoss();}catch(e){}}};
}
