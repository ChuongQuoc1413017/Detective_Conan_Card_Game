/* Guided demo: one scripted match, one tap at a time. Every step is [English, Vietnamese]. */
(function(){
var $=function(s){return document.querySelector(s)};
var lang=function(){return document.documentElement.lang==="vi"?1:0};

/* card id -> [name, set, image number] */
var C={
  mitsu:["Mitsuhiko","CT-D01","D01010"], kogoro:["Kogoro","CT-D01","D01005"], genta:["Genta","CT-D01","D01011"],
  ran:["Ran","CT-D01","D01007"], shin:["Shinichi","CT-D01","D01004"], ayumi:["Ayumi","CT-D01","D01009"],
  agasa:["Dr. Agasa","CT-D01","D01008"], blow:["Ran's Blow","CT-D01","D01015"], chianti:["Chianti","CT-D07","D07020"],
  me:["Conan (Partner)","CT-D01","D01001"], op:["Sherry (Partner)","CT-D07","D07001"]
};

/* The table at the start. Each step only lists what changes. */
var state={
  turn:["Getting ready","Chuẩn bị"],
  me:{ev:0,file:0,deck:35,rem:0,phase:0,partner:"active",scene:[],hand:["mitsu","kogoro","genta","ran","shin"]},
  op:{ev:0,file:0,deck:35,rem:0,phase:0,partner:"active",scene:[],hand:5}
};

/* t = title, p = explanation, f = face, set = changes ("me.ev": 1), hl = what to light up */
var STEPS=[
 {f:"👋",t:["Meet the two detectives","Gặp hai thám tử"],p:["You play the blue Conan deck. Your opponent plays the black deck. Each side has a Partner, a Case and 40 cards. You each drew 5 cards. You may swap some cards once, but you keep yours. Only your cards are face up.","Bạn chơi bộ Conan màu xanh. Đối thủ chơi bộ màu đen. Mỗi bên có Cộng sự, Vụ án và 40 lá. Mỗi người đã rút 5 lá. Bạn được đổi bài một lần, nhưng bạn giữ nguyên. Chỉ bài của bạn được nhìn thấy."],hl:["me.hand"]},
 {f:"🎯",t:["Your goal","Mục tiêu của bạn"],p:["You go first, so your Case needs 7 evidence. (The second player needs only 6.) Get the evidence, turn your Case to its solution side, then say “Case Solved!”","Bạn đi trước nên Vụ án cần 7 chứng cứ. (Người đi sau chỉ cần 6.) Hãy gom chứng cứ, lật Vụ án sang giai đoạn giải đáp, rồi hô “Phá án!”"],hl:["me.ev"]},

 {f:"🌅",t:["Your turn 1: draw","Lượt 1 của bạn: rút bài"],p:["Every turn starts with the Auto phase. Wake up your cards, then draw 1 card. You drew Ayumi.","Mỗi lượt bắt đầu bằng giai đoạn Tự động. Đánh thức các lá, rồi rút 1 lá. Bạn rút được Ayumi."],set:{turn:["Your turn 1","Lượt 1 của bạn"],"me.hand":["mitsu","kogoro","genta","ran","shin","ayumi"],"me.deck":34},hl:["me.hand"]},
 {f:"📁",t:["Fill your FILE area","Đặt bài vào Khu FILE"],p:["Put cards from your deck face down into FILE. On the very first turn you put only 1. The number of FILE cards is the highest card level you can play.","Đặt úp bài từ bộ bài vào Khu FILE. Riêng lượt đầu tiên chỉ đặt 1 lá. Số lá trong FILE là cấp cao nhất bạn được đánh."],set:{"me.file":1,"me.deck":33},hl:["me.file"]},
 {f:"🔍",t:["Your Partner investigates","Cộng sự đi điều tra"],p:["Your hand has no level 1 card, so you play nothing. But your Partner can Deduce: Conan turns sideways (sleeps) and you get 1 evidence from the top of your deck. 1 of 7!","Tay bạn không có lá cấp 1 nên chưa đánh gì. Nhưng Cộng sự có thể Suy luận: Conan xoay ngang (ngủ) và bạn nhận 1 chứng cứ từ đầu bộ bài. Được 1 trên 7!"],set:{"me.partner":"sleep","me.ev":1,"me.deck":32},hl:["me.partner","me.ev"]},

 {f:"🦹",t:["Opponent's turn","Lượt của đối thủ"],p:["The opponent draws 1 and puts 2 cards in FILE. They play Chianti (level 2), then their Partner deduces for 1 evidence. A character that just arrived (✨) cannot deduce or attack yet.","Đối thủ rút 1 lá và đặt 2 lá vào FILE. Họ đánh Chianti (cấp 2), rồi Cộng sự của họ suy luận lấy 1 chứng cứ. Nhân vật vừa vào (✨) chưa được suy luận hay tấn công."],set:{turn:["Opponent's turn","Lượt đối thủ"],"op.file":2,"op.hand":5,"op.scene":[["chianti","new"]],"op.partner":"sleep","op.ev":1,"op.deck":31},hl:["op.scene","op.ev"]},

 {f:"⏰",t:["Your turn 2: wake up","Lượt 2 của bạn: thức dậy"],p:["Your Partner wakes up. Draw 1 (Dr. Agasa), then put 2 more cards in FILE. Now you have 3.","Cộng sự thức dậy. Rút 1 lá (Tiến sĩ Agasa), rồi đặt thêm 2 lá vào FILE. Giờ bạn có 3."],set:{turn:["Your turn 2","Lượt 2 của bạn"],"me.partner":"active","me.hand":["mitsu","kogoro","genta","ran","shin","ayumi","agasa"],"me.file":3,"me.deck":29},hl:["me.file","me.hand"]},
 {f:"🧢",t:["Play your first character","Đánh nhân vật đầu tiên"],p:["Mitsuhiko is level 3 and you have 3 FILE cards, so you can play him to the Scene. You may play only 1 card from your hand each turn.","Mitsuhiko cấp 3 và bạn có 3 lá FILE, nên được đưa vào Hiện trường. Mỗi lượt chỉ được đánh 1 lá từ tay."],set:{"me.hand":["kogoro","genta","ran","shin","ayumi","agasa"],"me.scene":[["mitsu","new"]]},hl:["me.scene"]},
 {f:"🔍",t:["Deduce again","Suy luận tiếp"],p:["Mitsuhiko just arrived, so he waits. Your Partner deduces: 2 evidence now.","Mitsuhiko vừa vào nên phải chờ. Cộng sự suy luận: giờ có 2 chứng cứ."],set:{"me.partner":"sleep","me.ev":2,"me.deck":28},hl:["me.ev"]},

 {f:"🦹",t:["Opponent's turn","Lượt của đối thủ"],p:["Their Chianti is no longer new, so she deduces: they have 2 evidence. Deducing leaves her asleep (💤). A sleeping character can be attacked!","Chianti của họ không còn mới nên suy luận: họ có 2 chứng cứ. Suy luận xong cô ấy ngủ (💤). Nhân vật đang ngủ có thể bị tấn công!"],set:{turn:["Opponent's turn","Lượt đối thủ"],"op.file":4,"op.hand":6,"op.scene":[["chianti","sleep"]],"op.partner":"active","op.ev":2,"op.deck":27},hl:["op.scene","op.ev"]},

 {f:"⏰",t:["Your turn 3","Lượt 3 của bạn"],p:["Wake up, draw 1 (Ran's Blow), add 2 FILE cards. You have 5.","Thức dậy, rút 1 lá (Cú đá của Ran), thêm 2 lá FILE. Bạn có 5."],set:{turn:["Your turn 3","Lượt 3 của bạn"],"me.partner":"active","me.scene":[["mitsu",""]],"me.hand":["kogoro","genta","ran","shin","ayumi","agasa","blow"],"me.file":5,"me.deck":25},hl:["me.file"]},
 {f:"⚔️",t:["Attack a sleeping character","Tấn công nhân vật đang ngủ"],p:["Mitsuhiko takes an Action against the sleeping Chianti. This is a Contact: compare AP. 2000 is higher than 1000, so Chianti goes to the Remove area. (Either player may use a Cut-in card here. Nobody does.)","Mitsuhiko Hành động vào Chianti đang ngủ. Đây là Tiếp xúc: so AP. 2000 lớn hơn 1000, nên Chianti vào Khu loại bỏ. (Lúc này hai bên được dùng lá Cut-in. Không ai dùng.)"],set:{"me.scene":[["mitsu","sleep"]],"op.scene":[],"op.rem":1},hl:["me.scene","op.rem"]},
 {f:"🥋",t:["Kogoro charges in","Kogoro xông vào"],p:["Play Kogoro (level 5). He has Assault, so he can take an Action on the same turn he arrives.","Đánh Kogoro (cấp 5). Ông có Đột kích nên được Hành động ngay trong lượt vào sân."],set:{"me.hand":["genta","ran","shin","ayumi","agasa","blow"],"me.scene":[["mitsu","sleep"],["kogoro","new"]]},hl:["me.scene"]},
 {f:"🕵️",t:["Steal evidence from their Case","Cướp chứng cứ từ Vụ án của họ"],p:["Kogoro takes an Action against their Case. They have no active character to guard. They lose 1 evidence and you gain 1.","Kogoro Hành động vào Vụ án của họ. Họ không có nhân vật nào đỡ đòn. Họ mất 1 chứng cứ và bạn được 1."],set:{"me.scene":[["mitsu","sleep"],["kogoro","sleep"]],"me.ev":3,"me.deck":24,"op.ev":1,"op.rem":2},hl:["me.ev","op.ev"]},
 {f:"🔍",t:["Partner deduces too","Cộng sự cũng suy luận"],p:["Do not forget your Partner: 1 more evidence. You have 4 of 7.","Đừng quên Cộng sự: thêm 1 chứng cứ. Bạn có 4 trên 7."],set:{"me.partner":"sleep","me.ev":4,"me.deck":23},hl:["me.partner","me.ev"]},

 {f:"🦹",t:["Opponent's turn","Lượt của đối thủ"],p:["The opponent's Partner deduces. They are back to 2 evidence. In this demo they do not attack. In a real game, watch out for your sleeping characters!","Cộng sự đối thủ suy luận. Họ lại có 2 chứng cứ. Trong ván mẫu này họ không tấn công. Ở ván thật, hãy coi chừng các nhân vật đang ngủ của bạn!"],set:{turn:["Opponent's turn","Lượt đối thủ"],"op.file":6,"op.hand":7,"op.partner":"sleep","op.ev":2,"op.deck":23},hl:["op.ev"]},

 {f:"⏰",t:["Your turn 4","Lượt 4 của bạn"],p:["Wake everything up, draw 1 (another Genta), add 2 FILE cards. You have 7.","Đánh thức tất cả, rút 1 lá (thêm một Genta), thêm 2 lá FILE. Bạn có 7."],set:{turn:["Your turn 4","Lượt 4 của bạn"],"me.partner":"active","me.scene":[["mitsu",""],["kogoro",""]],"me.hand":["genta","ran","shin","ayumi","agasa","blow","genta"],"me.file":7,"me.deck":20},hl:["me.file"]},
 {f:"🔍",t:["Both characters work","Hai nhân vật làm việc"],p:["Mitsuhiko deduces (+1 evidence). Kogoro takes an Action on their Case (+1 for you, −1 for them). You have 6.","Mitsuhiko suy luận (+1 chứng cứ). Kogoro Hành động vào Vụ án của họ (bạn +1, họ −1). Bạn có 6."],set:{"me.scene":[["mitsu","sleep"],["kogoro","sleep"]],"me.ev":6,"me.deck":18,"op.ev":1,"op.rem":3},hl:["me.ev","op.ev"]},
 {f:"🤝",t:["Assist!","Hỗ trợ!"],p:["Your Partner goes into the FILE area. That makes 7 + 1 = 8 cards there. With 7 or more, your Case flips to its solution phase.","Cộng sự đi vào Khu FILE. Ở đó có 7 + 1 = 8 lá. Từ 7 lá trở lên, Vụ án lật sang giai đoạn giải đáp."],set:{"me.partner":"file","me.phase":1},hl:["me.file","me.case"]},
 {f:"🌟",t:["The big hero arrives","Nhân vật chủ lực xuất hiện"],p:["With 8 in FILE you can play Shinichi (level 8). He has an entry effect, which we skip to keep things simple.","Có 8 lá trong FILE, bạn đánh được Shinichi (cấp 8). Anh có hiệu ứng khi vào sân, ta bỏ qua cho đơn giản."],set:{"me.hand":["genta","ran","ayumi","agasa","blow","genta"],"me.scene":[["mitsu","sleep"],["kogoro","sleep"],["shin","new"]]},hl:["me.scene"]},

 {f:"🦹",t:["Opponent's last chance","Cơ hội cuối của đối thủ"],p:["They deduce once more (2 evidence) but cannot stop you this time.","Họ suy luận thêm (2 chứng cứ) nhưng lần này không ngăn được bạn."],set:{turn:["Opponent's turn","Lượt đối thủ"],"op.file":8,"op.hand":8,"op.partner":"sleep","op.ev":2,"op.deck":19},hl:["op.ev"]},

 {f:"⏰",t:["Your turn 5","Lượt 5 của bạn"],p:["Your Partner comes back and wakes up. Your Case stays on the solution side. Draw 1 and add 2 FILE cards.","Cộng sự quay về và thức dậy. Vụ án vẫn ở giai đoạn giải đáp. Rút 1 lá và thêm 2 lá FILE."],set:{turn:["Your turn 5","Lượt 5 của bạn"],"me.partner":"active","me.scene":[["mitsu",""],["kogoro",""],["shin",""]],"me.hand":["genta","ran","ayumi","agasa","blow","genta","mitsu"],"me.file":9,"me.deck":15},hl:["me.partner","me.case"]},
 {f:"🧠",t:["The last clues","Manh mối cuối cùng"],p:["Shinichi has LP 2, so his deduction gives 2 evidence. You have 8. You only need 7!","Shinichi có LP 2 nên suy luận được 2 chứng cứ. Bạn có 8. Chỉ cần 7 thôi!"],set:{"me.scene":[["mitsu",""],["kogoro",""],["shin","sleep"]],"me.ev":8,"me.deck":13},hl:["me.ev"]},
 {f:"🏆",t:["Case Solved! You win!","Phá án! Bạn thắng!"],p:["Enough evidence ✔ Solution phase ✔ Awake Partner ✔. Your Partner sleeps and you declare “Case Solved!” Now you try it yourself.","Đủ chứng cứ ✔ Giai đoạn giải đáp ✔ Cộng sự đang thức ✔. Cộng sự đi ngủ và bạn hô “Phá án!” Giờ đến lượt bạn thử."],set:{"me.partner":"sleep"},hl:["me.case","me.partner","me.ev"]}
];

/* Build the full table for every step once. */
var FRAMES=[];
STEPS.forEach(function(s){
  state=JSON.parse(JSON.stringify(state));
  Object.keys(s.set||{}).forEach(function(k){var p=k.split(".");if(p[1])state[p[0]][p[1]]=s.set[k];else state[p[0]]=s.set[k]});
  FRAMES.push(state);
});

var i=0,timer=null;
function img(id,extra,cls){
  var c=C[id];
  return '<figure class="dc '+(extra||"")+(cls||"")+'"><img src="Card_List/'+c[1]+'/'+c[2]+'.webp" alt="'+c[0]+'" onerror="this.style.visibility=\'hidden\'"><figcaption>'+c[0]+'</figcaption></figure>';
}
function side(key,s,hl){
  var vi=lang(),T=function(en,v){return vi?v:en};
  var on=function(z){return hl.indexOf(key+"."+z)>-1?" hl":""};
  var need=key==="me"?7:6,pid=key==="me"?"me":"op";
  var where={active:T("Awake","Đang thức"),sleep:T("Asleep 💤","Đang ngủ 💤"),file:T("In FILE","Ở Khu FILE")}[s.partner];
  var zones='<div class="dzones">'+
    '<div class="dz'+on("ev")+'"><small>🔎 '+T("Evidence","Chứng cứ")+'</small><strong>'+s.ev+' / '+need+'</strong></div>'+
    '<div class="dz'+on("file")+'"><small>📁 FILE</small><strong>'+s.file+(s.partner==="file"?" + 1":"")+'</strong></div>'+
    '<div class="dz'+on("case")+'"><small>📜 '+T("Case","Vụ án")+'</small><strong style="font-size:1rem">'+(s.phase?T("Solution ⭐","Giải đáp ⭐"):T("Case phase","Giai đoạn vụ án"))+'</strong></div>'+
    '<div class="dz'+on("partner")+'"><small>🤝 '+T("Partner","Cộng sự")+'</small><strong style="font-size:1rem">'+where+'</strong></div>'+
    '<div class="dz"><small>🂠 '+T("Deck","Bộ bài")+'</small><strong>'+s.deck+'</strong></div>'+
    '<div class="dz'+on("rem")+'"><small>🗑 '+T("Removed","Loại bỏ")+'</small><strong>'+s.rem+'</strong></div>'+
    '<div class="dz'+on("hand")+'"><small>✋ '+T("Hand","Tay")+'</small><strong>'+(key==="me"?s.hand.length:s.hand)+'</strong></div></div>';
  var scene='<div class="drow'+on("scene")+'"><small>🎭 '+T("Scene","Hiện trường")+'</small>'+img(pid,s.partner==="active"?"":s.partner==="sleep"?"sleep":"")+s.scene.map(function(x){return img(x[0],x[1])}).join("")+'</div>';
  var head='<b>'+(key==="me"?T("🙂 You (blue)","🙂 Bạn (xanh)"):T("🦹 Opponent (black)","🦹 Đối thủ (đen)"))+'</b>';
  if(key==="op")return '<div class="dside">'+head+zones+scene+'</div>';
  var hand='<div class="drow'+on("hand")+'"><small>✋ '+T("Your hand","Bài trên tay bạn")+'</small>'+s.hand.map(function(id){return img(id)}).join("")+'</div>';
  return '<div class="dside me">'+head+scene+zones+hand+'</div>';
}
function render(){
  var s=STEPS[i],f=FRAMES[i],v=lang(),hl=s.hl||[],n=STEPS.length;
  $("#dBar").style.width=((i+1)/n*100)+"%";
  $("#dSay").innerHTML='<div class="face" aria-hidden="true">'+s.f+'</div><div><span class="mono">'+f.turn[v]+' · '+(v?"Bước ":"Step ")+(i+1)+' / '+n+'</span><h2>'+s.t[v]+'</h2><p>'+s.p[v]+'</p></div>';
  $("#dTable").innerHTML=side("op",f.op,hl)+side("me",f.me,hl);
  $("#dPrev").disabled=i===0;
  $("#dPrev").textContent=v?"◀ Quay lại":"◀ Back";
  $("#dNext").textContent=i===n-1?(v?"↻ Xem lại":"↻ Watch again"):(v?"Tiếp ▶":"Next ▶");
  $("#dAuto").textContent=timer?(v?"⏸ Dừng":"⏸ Pause"):(v?"⏵ Tự chạy":"⏵ Auto play");
}
function stop(){clearInterval(timer);timer=null}
function go(n){i=(n+STEPS.length)%STEPS.length;render()}
$("#dPrev").onclick=function(){stop();if(i>0)go(i-1)};
$("#dNext").onclick=function(){stop();go(i+1)};
$("#dAuto").onclick=function(){
  if(timer){stop();render();return}
  if(i===STEPS.length-1)i=0;
  timer=setInterval(function(){if(i>=STEPS.length-1){stop();render()}else go(i+1)},6000);
  render();
};
document.addEventListener("keydown",function(e){if(e.key==="ArrowRight"){stop();if(i<STEPS.length-1)go(i+1)}else if(e.key==="ArrowLeft"){stop();if(i>0)go(i-1)}});
document.addEventListener("conan-lang",function(){render()});
render();
})();
