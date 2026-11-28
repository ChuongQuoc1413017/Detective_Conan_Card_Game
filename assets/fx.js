/* Animations, sounds and small on-screen effects for the practice game and the deck page.
   Everything here is optional: the game works the same without this file (the tests run without it).
   Settings are saved in the browser: animations on/off, speed, sound on/off.
   People whose system asks for reduced motion get no movement unless they switch it on here. */
(function(){
"use strict";
var KEY="conanFx";
var reduce=false;try{reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}
var S={anim:!reduce,speed:1,sound:false};
try{var saved=JSON.parse(localStorage.getItem(KEY)||"null");if(saved)Object.keys(S).forEach(function(k){if(saved[k]!==undefined)S[k]=saved[k]})}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function on(){return S.anim&&!!document.body&&typeof document.body.animate==="function"}
function dur(ms){return Math.round(ms*(S.speed||1))}
function wait(ms){return new Promise(function(r){setTimeout(r,ms)})}
function layer(){
  var l=document.getElementById("fxlayer");
  if(!l){l=document.createElement("div");l.id="fxlayer";l.setAttribute("aria-hidden","true");document.body.appendChild(l)}
  return l;
}
function rectOf(el){if(!el||!el.getBoundingClientRect)return null;var r=el.getBoundingClientRect();return (r.width||r.height)?{x:r.left,y:r.top,w:r.width,h:r.height}:null}
function center(r){return {x:r.x+r.w/2,y:r.y+r.h/2}}

/* ---------- moving cards (FLIP: remember where each card was, then glide it from there) ---------- */
function snap(root){
  var m={};
  root.querySelectorAll("[data-u]").forEach(function(el){var r=rectOf(el);if(r)m[el.dataset.u]={el:el,r:r}});
  return m;
}
/* before: snap() taken before the page changed.
   from(uid): where a card that just appeared came from (a rectangle), or null.
   to(uid): where a card that just disappeared went (a rectangle), or null.
   flipNew(uid): true if a new card should flip over as it arrives.
   changed(uid): false if a card that is still shown stayed in the same area (then it does not glide). */
function flip(root,before,o){
  if(!on()||!before)return;
  o=o||{};
  var now=snap(root),D=dur(380);
  Object.keys(now).forEach(function(u){
    var n=now[u],b=before[u],from=b?b.r:(o.from?o.from(u):null);
    if(!from)return;
    /* a card that stayed in the same area does not move, even if the page around it shifted */
    if(b&&o.changed&&!o.changed(u))return;
    var dx=from.x-n.r.x,dy=from.y-n.r.y,sx=from.w/n.r.w,sy=from.h/n.r.h;
    if(Math.abs(dx)<3&&Math.abs(dy)<3&&Math.abs(1-sx)<0.05)return;
    var turn=!b&&o.flipNew&&o.flipNew(u);
    var k0="translate("+dx+"px,"+dy+"px) scale("+sx+","+sy+")"+(turn?" rotateY(90deg)":"");
    n.el.style.transformOrigin="0 0";
    var a=n.el.animate([{transform:k0,opacity:b?1:0.35},{transform:"none",opacity:1}],{duration:D+(turn?120:0),easing:"cubic-bezier(.2,.8,.25,1)"});
    a.onfinish=function(){n.el.style.transformOrigin=""};
  });
  Object.keys(before).forEach(function(u){
    if(now[u])return;
    var b=before[u],to=o.to?o.to(u):null;if(!to||!b.el)return;
    var g=b.el.cloneNode(true);
    g.removeAttribute("data-u");g.classList.add("fx-ghost");
    g.style.cssText+=";position:fixed;left:"+b.r.x+"px;top:"+b.r.y+"px;width:"+b.r.w+"px;height:"+b.r.h+"px;margin:0;transform-origin:0 0;pointer-events:none";
    layer().appendChild(g);
    var c=center(to),dx=c.x-b.r.w*0.2-b.r.x,dy=c.y-b.r.h*0.2-b.r.y;
    var a=g.animate([{transform:"none",opacity:1},{transform:"translate("+dx*0.15+"px,"+(dy*0.15-14)+"px) scale(1.05)",opacity:1,offset:0.25},{transform:"translate("+dx+"px,"+dy+"px) scale(.4)",opacity:0}],{duration:dur(560),easing:"ease-in"});
    a.onfinish=function(){g.remove()};
  });
}

/* ---------- small effects drawn over the page ---------- */
function floatText(r,text,cls){
  if(!on()||!r)return;
  var e=document.createElement("div");e.className="fx-float "+(cls||"");e.textContent=text;
  var c=center(r);e.style.left=c.x+"px";e.style.top=c.y+"px";layer().appendChild(e);
  e.animate([{transform:"translate(-50%,-30%) scale(.6)",opacity:0},{transform:"translate(-50%,-80%) scale(1.15)",opacity:1,offset:0.25},{transform:"translate(-50%,-190%) scale(1)",opacity:0}],{duration:dur(1300),easing:"ease-out"}).onfinish=function(){e.remove()};
}
function ring(r,kind){
  if(!on()||!r)return;
  var e=document.createElement("div");e.className="fx-ring fx-"+(kind||"guard");
  e.style.cssText="left:"+(r.x-6)+"px;top:"+(r.y-6)+"px;width:"+(r.w+12)+"px;height:"+(r.h+12)+"px";
  if(kind==="guard")e.innerHTML="<span>🛡️</span>";
  layer().appendChild(e);
  e.animate([{transform:"scale(.8)",opacity:0},{transform:"scale(1.04)",opacity:1,offset:0.3},{transform:"scale(1)",opacity:0}],{duration:dur(1100),easing:"ease-out"}).onfinish=function(){e.remove()};
}
/* a Contact: both cards slide in, AP counts up to the final total, the loser shakes and fades */
function clash(o){
  if(!on())return Promise.resolve();
  var box=document.createElement("div");box.className="fx-clash";
  function side(s,cls){return '<div class="fx-side '+cls+'"><div class="fx-card">'+(s.img||"")+'</div><b>'+s.name+'</b><span class="fx-ap" data-from="'+s.from+'" data-to="'+s.ap+'">AP '+s.from+'</span>'+(s.bonus?'<small>'+s.bonus+'</small>':'')+'</div>'}
  box.innerHTML='<div class="fx-clashin">'+side(o.a,"fx-a")+'<div class="fx-vs">'+(o.vs||"VS")+'</div>'+side(o.d,"fx-d")+'</div><div class="fx-result">'+(o.result||"")+'</div>';
  layer().appendChild(box);
  var T=dur(1500);
  box.animate([{opacity:0},{opacity:1,offset:0.12},{opacity:1,offset:0.86},{opacity:0}],{duration:T,fill:"forwards"});
  var A=box.querySelector(".fx-a"),Dd=box.querySelector(".fx-d");
  A.animate([{transform:"translateX(-60px) rotate(-8deg)",opacity:0},{transform:"translateX(8px) rotate(2deg)",opacity:1,offset:0.4},{transform:"none",opacity:1}],{duration:dur(520),easing:"ease-out",fill:"both"});
  Dd.animate([{transform:"translateX(60px) rotate(8deg)",opacity:0},{transform:"translateX(-8px) rotate(-2deg)",opacity:1,offset:0.4},{transform:"none",opacity:1}],{duration:dur(520),easing:"ease-out",fill:"both"});
  var t0=performance.now();
  (function count(){
    var k=Math.min(1,(performance.now()-t0)/dur(700));
    box.querySelectorAll(".fx-ap").forEach(function(s){var a=+s.dataset.from,b=+s.dataset.to;s.textContent="AP "+Math.round(a+(b-a)*k)});
    if(k<1&&box.isConnected)requestAnimationFrame(count);
  })();
  setTimeout(function(){
    sound("clash");
    var lose=o.lose==="a"?A:o.lose==="d"?Dd:null;
    if(lose)lose.animate([{transform:"none"},{transform:"translateX(-7px) rotate(-3deg)"},{transform:"translateX(7px) rotate(3deg)"},{transform:"translateX(-4px)"},{transform:"translateY(14px) scale(.9)",opacity:0.25,filter:"grayscale(1)"}],{duration:dur(560),fill:"forwards"});
    var res=box.querySelector(".fx-result");res.classList.add("on");
  },dur(720));
  return wait(T).then(function(){box.remove()});
}
/* end of a game: a big stamp and paper confetti for a win, a quieter card for a loss */
function celebrate(o){
  sound(o.win?"win":"lose");
  if(!on())return;
  var box=document.createElement("div");box.className="fx-end "+(o.win?"fx-win":"fx-lose");
  var bits="";
  if(o.win)for(var i=0;i<46;i++){var x=Math.random()*100,d=Math.random()*0.8,r=Math.random()*360,c=["#c4392f","#f2c200","#1f5fbf","#1f8a3b","#fff"][i%5];bits+='<i style="left:'+x+'%;background:'+c+';animation-delay:'+d+'s;transform:rotate('+r+'deg)"></i>'}
  box.innerHTML='<div class="fx-confetti">'+bits+'</div><div class="fx-stamp"><span class="fx-lens">🔍</span><b>'+o.title+'</b><small>'+(o.sub||"")+'</small></div>';
  layer().appendChild(box);
  box.style.setProperty("--d",(S.speed||1));
  var gone=false;function close(){if(gone)return;gone=true;box.animate([{opacity:1},{opacity:0}],{duration:250}).onfinish=function(){box.remove()}}
  box.addEventListener("click",close);
  setTimeout(close,dur(o.win?3200:2200));
}
function toast(html){
  var e=document.createElement("div");e.className="fx-toast";e.innerHTML=html;layer().appendChild(e);
  sound("badge");
  if(e.animate)e.animate([{transform:"translate(-50%,20px)",opacity:0},{transform:"translate(-50%,0)",opacity:1,offset:0.1},{transform:"translate(-50%,0)",opacity:1,offset:0.85},{transform:"translate(-50%,10px)",opacity:0}],{duration:4200}).onfinish=function(){e.remove()};
  else setTimeout(function(){e.remove()},4200);
}

/* ---------- sounds, made on the fly (no sound files) ---------- */
var AC=null;
function ctx(){if(!AC){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;AC=new C()}if(AC.state==="suspended")AC.resume();return AC}
function tone(f,t,len,type,vol,slide){
  var a=ctx();if(!a)return;var o=a.createOscillator(),g=a.createGain(),s=a.currentTime+t;
  o.type=type||"sine";o.frequency.setValueAtTime(f,s);if(slide)o.frequency.exponentialRampToValueAtTime(slide,s+len);
  g.gain.setValueAtTime(0.0001,s);g.gain.exponentialRampToValueAtTime(vol||0.12,s+0.012);g.gain.exponentialRampToValueAtTime(0.0001,s+len);
  o.connect(g);g.connect(a.destination);o.start(s);o.stop(s+len+0.02);
}
function noise(t,len,vol,hp){
  var a=ctx();if(!a)return;var n=Math.floor(a.sampleRate*len),b=a.createBuffer(1,n,a.sampleRate),d=b.getChannelData(0);
  for(var i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);
  var s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=b;f.type="highpass";f.frequency.value=hp||1800;g.gain.value=vol||0.08;
  s.connect(f);f.connect(g);g.connect(a.destination);s.start(a.currentTime+t);
}
var SOUNDS={
  draw:function(){noise(0,0.12,0.05,2600)},
  play:function(){tone(520,0,0.09,"triangle",0.1);tone(780,0.05,0.12,"triangle",0.08)},
  evidence:function(){tone(880,0,0.12,"sine",0.08);tone(1320,0.07,0.16,"sine",0.06)},
  clash:function(){tone(160,0,0.25,"sawtooth",0.12,60);noise(0,0.18,0.12,900)},
  guard:function(){tone(1200,0,0.3,"triangle",0.07,900)},
  remove:function(){tone(300,0,0.22,"square",0.05,120)},
  win:function(){[523,659,784,1047].forEach(function(f,i){tone(f,i*0.11,0.3,"triangle",0.11)})},
  lose:function(){[392,330,262].forEach(function(f,i){tone(f,i*0.16,0.35,"sine",0.09)})},
  badge:function(){tone(988,0,0.12,"sine",0.08);tone(1480,0.09,0.25,"sine",0.07)},
  turn:function(){tone(660,0,0.08,"sine",0.05)}
};
function sound(name){if(!S.sound||!SOUNDS[name])return;try{SOUNDS[name]()}catch(e){}}

/* ---------- foil shine: rare cards tilt toward the pointer and catch a light sweep ---------- */
function shine(container,selector){
  if(!container)return;
  container.addEventListener("pointermove",function(e){
    if(!S.anim)return;
    var el=e.target.closest&&e.target.closest(selector);if(!el)return;
    var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    el.style.setProperty("--mx",(x*100).toFixed(1)+"%");el.style.setProperty("--my",(y*100).toFixed(1)+"%");
    el.style.transform="perspective(600px) rotateY("+((x-0.5)*14).toFixed(1)+"deg) rotateX("+((0.5-y)*14).toFixed(1)+"deg) scale(1.04)";
    el.classList.add("shining");
  });
  container.addEventListener("pointerout",function(e){
    var el=e.target.closest&&e.target.closest(selector);if(!el||(e.relatedTarget&&el.contains(e.relatedTarget)))return;
    el.style.transform="";el.classList.remove("shining");
  });
}

window.ConanFX={settings:S,save:save,on:on,dur:dur,wait:wait,rectOf:rectOf,snap:snap,flip:flip,floatText:floatText,ring:ring,clash:clash,celebrate:celebrate,toast:toast,sound:sound,shine:shine};
})();
