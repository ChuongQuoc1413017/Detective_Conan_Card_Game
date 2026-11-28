/* Detective School: a short course for kids and young adults, from thinking like a detective to collecting
   and explaining evidence. Friendly cases only (lost hamsters, borrowed umbrellas, secret codes), no violence.
   Progress is saved in this browser ("conanSchool"). Every text is [English, Vietnamese]. */
(function(){
"use strict";
var root=document.getElementById("school");if(!root)return;
var LANG=(function(){try{var s=localStorage.getItem("conanLang");if(s==="vi"||s==="en")return s}catch(e){}return String(navigator.language||"en").toLowerCase().indexOf("vi")===0?"vi":"en"})();
function T(x,y){if(Array.isArray(x))return LANG==="vi"?x[1]:x[0];return LANG==="vi"?y:x}
function esc(v){return String(v==null?"":v).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
var KEY="conanSchool";
var ST={done:{},name:"",at:0};
try{var sv=JSON.parse(localStorage.getItem(KEY)||"null");if(sv){ST.done=sv.done||{};ST.name=sv.name||"";ST.at=+sv.at||0;if(sv.pos)ST.pos=sv.pos;ST.track=+sv.track||0}}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(ST))}catch(e){}}

/* ---------- the lessons ---------- */
var LESSONS=[
{id:"mind",ico:"🧠",title:["The detective mindset","Tư duy thám tử"],
 intro:["Every detective starts with curiosity. Conan never says “that's just how it is”; he asks “why?” and keeps an open mind until the facts are in.","Mọi thám tử đều bắt đầu từ sự tò mò. Conan không bao giờ nói “chuyện thường thôi”; cậu luôn hỏi “tại sao?” và giữ đầu óc cởi mở cho đến khi có đủ dữ kiện."],
 points:[["Be curious: notice when something is a little bit strange, and ask why.","Tò mò: để ý khi có điều gì hơi lạ, và hỏi tại sao."],
   ["Keep an open mind: your first idea might be wrong, and that is fine.","Cởi mở: ý nghĩ đầu tiên có thể sai, và điều đó không sao cả."],
   ["Use the six detective questions: Who? What? When? Where? Why? How?","Dùng sáu câu hỏi thám tử: Ai? Cái gì? Khi nào? Ở đâu? Tại sao? Như thế nào?"],
   ["Be patient: big cases are solved one small step at a time.","Kiên nhẫn: vụ lớn được giải từng bước nhỏ một."]],
 act:"wq"},
{id:"observe",ico:"👀",title:["Observe, don't just look","Quan sát, đừng chỉ nhìn"],
 intro:["Sherlock Holmes said: “You see, but you do not observe.” Observing means looking on purpose: slowly, part by part, and remembering what you saw.","Sherlock Holmes nói: “Anh nhìn, nhưng anh không quan sát.” Quan sát là nhìn có chủ đích: chậm rãi, từng phần một, và ghi nhớ điều mình thấy."],
 points:[["Scan in order: left to right, top to bottom, near to far.","Quét theo thứ tự: trái sang phải, trên xuống dưới, gần ra xa."],
   ["Use every sense: what can you hear or smell? Is something warm, wet or dusty?","Dùng mọi giác quan: bạn nghe hay ngửi thấy gì? Có thứ gì ấm, ướt hay bám bụi không?"],
   ["Look for what changed, and for what is missing: an empty hook can be a clue.","Tìm thứ đã thay đổi, và thứ bị thiếu: một cái móc trống cũng có thể là manh mối."],
   ["Say it in words: “Three red pencils, one is broken.” Words help you remember.","Nói thành lời: “Ba bút chì đỏ, một cây bị gãy.” Lời nói giúp bạn ghi nhớ."]],
 act:"memory"},
{id:"ask",ico:"💬",title:["Listen and ask good questions","Lắng nghe và đặt câu hỏi hay"],
 intro:["People who saw something are called witnesses. A good detective is polite, listens more than talks, and asks questions that let people tell the whole story.","Người đã chứng kiến sự việc được gọi là nhân chứng. Thám tử giỏi luôn lịch sự, nghe nhiều hơn nói, và đặt câu hỏi để người khác kể trọn câu chuyện."],
 points:[["Open questions start with what, how, where or tell me: “What did you see?”","Câu hỏi mở bắt đầu bằng gì, thế nào, ở đâu hoặc kể cho tôi: “Bạn đã thấy gì?”"],
   ["Closed questions get yes or no: useful for checking one detail, not for finding new ones.","Câu hỏi đóng chỉ nhận có hoặc không: hữu ích để kiểm tra một chi tiết, không phải để tìm điều mới."],
   ["Don't put words in someone's mouth: “It was a tall man, right?” can change what they remember.","Đừng mớm lời: “Là một người cao, đúng không?” có thể làm người ta nhớ sai."],
   ["Say thank you, and only talk to people you know or with a trusted adult nearby.","Nói lời cảm ơn, và chỉ hỏi người bạn quen biết hoặc khi có người lớn tin cậy ở gần."]],
 act:"questions"},
{id:"clues",ico:"🔍",title:["Finding and keeping clues","Tìm và giữ manh mối"],
 intro:["A clue is anything that helps answer the question. Evidence is a clue you can show to others. The secret is to find clues without spoiling them.","Manh mối là bất cứ điều gì giúp trả lời câu hỏi. Bằng chứng là manh mối bạn có thể đưa cho người khác xem. Bí quyết là tìm manh mối mà không làm hỏng chúng."],
 points:[["Three kinds of clues: things (a footprint, a crumb), records (a note, a photo, a receipt) and what people say.","Ba loại manh mối: đồ vật (dấu chân, vụn bánh), ghi chép (mẩu giấy, ảnh, hóa đơn) và lời kể của mọi người."],
   ["Look first, touch later: take a photo or draw a sketch before you move anything.","Nhìn trước, chạm sau: chụp ảnh hoặc vẽ phác trước khi di chuyển bất cứ thứ gì."],
   ["Label each clue: what it is, where you found it, and when.","Ghi nhãn từng manh mối: đó là gì, tìm thấy ở đâu, và khi nào."],
   ["Not everything is a clue: a good detective also decides what does not matter.","Không phải thứ gì cũng là manh mối: thám tử giỏi cũng biết điều gì không quan trọng."]],
 act:"spot"},
{id:"notes",ico:"📒",title:["Notes and timelines","Ghi chép và dòng thời gian"],
 intro:["Detective Takagi always carries a notebook. Memory fades and mixes things up; notes don't. A timeline puts events in order, so you can see what could and could not have happened.","Thanh tra Takagi luôn mang theo sổ tay. Trí nhớ phai dần và hay lẫn lộn; ghi chép thì không. Dòng thời gian xếp sự việc theo thứ tự, để bạn thấy điều gì có thể và không thể xảy ra."],
 points:[["Write the time, the place and exactly what you saw or heard.","Ghi thời gian, nơi chốn và chính xác điều bạn thấy hoặc nghe."],
   ["Keep facts and your own ideas apart, for example ideas in a different colour.","Tách riêng dữ kiện và ý kiến của bạn, ví dụ viết ý kiến bằng màu khác."],
   ["Put events on a timeline from earliest to latest.","Xếp sự việc lên dòng thời gian từ sớm nhất đến muộn nhất."],
   ["Look for gaps: a time when nobody knows what happened is worth a question.","Tìm khoảng trống: lúc không ai biết chuyện gì xảy ra là lúc đáng đặt câu hỏi."]],
 act:"timeline"},
{id:"facts",ico:"⚖️",title:["Fact, opinion or guess?","Dữ kiện, ý kiến hay phỏng đoán?"],
 intro:["Detectives sort what they hear. A fact can be checked. An opinion is what someone feels or believes. A guess is an idea that still needs proof.","Thám tử luôn phân loại điều mình nghe. Dữ kiện là điều kiểm chứng được. Ý kiến là điều ai đó cảm thấy hay tin. Phỏng đoán là ý tưởng vẫn cần chứng minh."],
 points:[["Fact: “The window was open at 3 pm.” You can check it.","Dữ kiện: “Cửa sổ mở lúc 3 giờ chiều.” Bạn có thể kiểm tra."],
   ["Opinion: “Kenta is the messiest kid in class.” It's a feeling, not proof.","Ý kiến: “Kenta là bạn bừa bộn nhất lớp.” Đó là cảm nhận, không phải bằng chứng."],
   ["Guess: “Maybe the wind blew the paper away.” Fine to have, but test it.","Phỏng đoán: “Có lẽ gió thổi tờ giấy bay mất.” Cứ đoán, nhưng phải kiểm tra."],
   ["Never treat a person as guilty because of an opinion.","Đừng bao giờ coi ai đó có lỗi chỉ vì một ý kiến."]],
 act:"sort"},
{id:"logic",ico:"🧩",title:["Reasoning: test every idea","Suy luận: kiểm tra mọi ý tưởng"],
 intro:["Now put it together. Make a list of possible answers, then test each one against every clue. Cross out the ones that don't fit. When one answer fits everything, you have your solution.","Giờ hãy ghép mọi thứ lại. Liệt kê các đáp án có thể, rồi kiểm tra từng đáp án với mọi manh mối. Gạch bỏ đáp án không khớp. Khi chỉ còn một đáp án khớp với tất cả, bạn đã có lời giải."],
 points:[["List every possibility, even the surprising ones.","Liệt kê mọi khả năng, kể cả những khả năng bất ngờ."],
   ["One clue that doesn't fit is enough to cross an idea out.","Chỉ một manh mối không khớp cũng đủ để gạch bỏ một ý tưởng."],
   ["Holmes: when you have ruled out the impossible, whatever remains must be the truth.","Holmes: khi đã loại bỏ điều bất khả, điều còn lại chính là sự thật."],
   ["If nothing fits, you are missing a clue: go back and look again.","Nếu không gì khớp, bạn đang thiếu manh mối: hãy quay lại và tìm tiếp."]],
 act:"puzzle"},
{id:"codes",ico:"🔐",title:["Codes and patterns","Mật mã và quy luật"],
 intro:["The Detective Boys love secret codes. Many codes follow a simple pattern, like moving every letter a few steps along the alphabet. Spotting patterns is a detective superpower.","Đội thám tử nhí rất thích mật mã. Nhiều mật mã theo một quy luật đơn giản, như dịch mỗi chữ cái vài bước trong bảng chữ cái. Nhận ra quy luật là siêu năng lực của thám tử."],
 points:[["Look for repeats: the same symbol again and again is probably a common letter like E or A.","Tìm điểm lặp: ký hiệu xuất hiện nhiều lần có lẽ là chữ phổ biến như E hoặc A."],
   ["Try simple rules first: backwards, shifted, every second letter.","Thử quy luật đơn giản trước: đọc ngược, dịch chữ, lấy cách một chữ."],
   ["Turn it around: numbers can look like letters (1412 → KID).","Xoay chiều: con số có thể trông như chữ cái (1412 → KID)."],
   ["Write down every attempt, even the ones that fail.","Ghi lại mọi lần thử, kể cả những lần thất bại."]],
 act:"cipher"},
{id:"explain",ico:"🤝",title:["Explaining it, the kind way","Trình bày kết luận một cách tử tế"],
 intro:["A case is not closed until you explain it clearly and fairly. Good detectives show their evidence, admit what they don't know, and are kind to everyone involved.","Vụ án chưa khép lại cho tới khi bạn trình bày rõ ràng và công bằng. Thám tử giỏi đưa ra bằng chứng, thừa nhận điều mình chưa biết, và tử tế với mọi người liên quan."],
 points:[["Tell it in order: the question, the clues, how you tested your ideas, the answer.","Kể theo thứ tự: câu hỏi, các manh mối, cách bạn kiểm tra ý tưởng, đáp án."],
   ["Point to evidence for every step, not just to feelings.","Mỗi bước đều chỉ ra bằng chứng, không chỉ dựa vào cảm giác."],
   ["Be kind: the goal is to solve the problem, not to embarrass someone.","Tử tế: mục tiêu là giải quyết vấn đề, không phải làm ai đó xấu hổ."],
   ["Stay safe and respect privacy: ask permission, never snoop in private things, and tell a trusted adult if anything feels wrong.","An toàn và tôn trọng riêng tư: xin phép, không lục lọi đồ riêng tư, và báo người lớn tin cậy nếu thấy điều gì không ổn."]],
 act:"choices"}
];

/* ---------- activities ---------- */
var ACT={};
ACT.wq={
  h:["Try it: the case of the open hamster cage","Thử nào: vụ chiếc lồng chuột mở toang"],
  scene:["Monday morning. The class hamster's cage is open and Mochi the hamster is not inside. Tap each detective question to see a good question for this case.","Sáng thứ Hai. Lồng chuột hamster của lớp mở toang và chú hamster Mochi không có bên trong. Chạm vào từng câu hỏi thám tử để xem một câu hỏi hay cho vụ này."],
  q:[["Who?","Ai?","Who fed Mochi last, and who was in the classroom after school?","Ai cho Mochi ăn lần cuối, và ai còn ở lớp sau giờ học?"],
     ["What?","Cái gì?","What else is different: is the food bowl full, is the latch broken?","Còn gì khác thường: bát thức ăn có đầy không, chốt lồng có hỏng không?"],
     ["When?","Khi nào?","When was the cage last seen closed?","Lần cuối thấy lồng đóng là khi nào?"],
     ["Where?","Ở đâu?","Where do hamsters like to hide: warm, dark, quiet places?","Hamster thích trốn ở đâu: chỗ ấm, tối, yên tĩnh?"],
     ["Why?","Tại sao?","Why would the cage be open: a loose latch, or someone forgot to close it?","Tại sao lồng lại mở: chốt lỏng, hay ai đó quên đóng?"],
     ["How?","Như thế nào?","How could Mochi get out: is the gap big enough?","Mochi ra ngoài bằng cách nào: khe hở có đủ rộng không?"]],
  render:function(){var a=this;return '<p>'+T(a.scene)+'</p><div class="sc-wq">'+a.q.map(function(q,i){return '<button type="button" class="sc-card" data-wq="'+i+'"><b>'+T(q[0],q[1])+'</b><span hidden>'+T(q[2],q[3])+'</span></button>'}).join("")+'</div><p class="sc-fb" id="wqfb"></p>'},
  click:function(t){var b=t.closest("[data-wq]");if(!b)return;b.querySelector("span").hidden=false;b.classList.add("on");
    var n=root.querySelectorAll(".sc-card.on").length;if(n===6){$("#wqfb").innerHTML="✅ "+T("All six! (Mochi was found asleep in a slipper under the teacher's desk.)","Đủ cả sáu! (Mochi được tìm thấy đang ngủ trong chiếc dép dưới bàn cô giáo.)");pass()}}
};
ACT.memory={
  h:["Try it: memory game","Thử nào: trò chơi trí nhớ"],
  pool:["🍎","🔑","📘","⏰","🎈","🧢","🕶️","🌂","✏️","🧸","🎲","🪴","🧦","🍪","📷","🔦","🧩","🎒"],
  render:function(){return '<p>'+T("Press Start and study the 9 objects on the desk for 8 seconds. Then one object will be swapped for a new one. Can you find it?","Bấm Bắt đầu và quan sát 9 đồ vật trên bàn trong 8 giây. Sau đó một món sẽ bị đổi thành món mới. Bạn tìm ra được không?")+'</p><div class="sc-grid" id="memgrid"></div><div class="pbtns"><button type="button" class="btn" data-mem="start">'+T("▶ Start","▶ Bắt đầu")+'</button></div><p class="sc-fb" id="memfb"></p>'},
  start:function(){
    var a=this,set=shuffle(a.pool.slice()),show=set.slice(0,9),g=$("#memgrid"),fb=$("#memfb");a.swap=Math.floor(Math.random()*9);a.newItem=set[9];a.old=show[a.swap];
    g.innerHTML=show.map(function(x){return '<span class="sc-cell">'+x+'</span>'}).join("");var s=8;fb.textContent=T("Memorise… ","Ghi nhớ… ")+s;
    clearInterval(a.tm);a.tm=setInterval(function(){s--;if(s>0){fb.textContent=T("Memorise… ","Ghi nhớ… ")+s;return}clearInterval(a.tm);
      show[a.swap]=a.newItem;g.innerHTML='<span class="sc-cover">🙈</span>';
      setTimeout(function(){g.innerHTML=show.map(function(x,i){return '<button type="button" class="sc-cell" data-memi="'+i+'">'+x+'</button>'}).join("");fb.textContent=T("Which object is new?","Món nào là món mới?")},900)},1000);
  },
  click:function(t){
    var a=this;if(t.closest("[data-mem]")){a.start();return}
    var b=t.closest("[data-memi]");if(!b)return;
    var ok=+b.dataset.memi===a.swap;b.classList.add(ok?"good":"bad");
    $("#memfb").innerHTML=ok?"✅ "+T("Sharp eyes! The "+a.old+" became "+a.newItem+".","Mắt tinh lắm! "+a.old+" đã thành "+a.newItem+"."):"❌ "+T("Not that one. Look again, or press Start for a new round.","Không phải món đó. Nhìn lại nhé, hoặc bấm Bắt đầu để chơi ván mới.");
    if(ok)pass();
  }
};
ACT.questions={
  h:["Try it: open or closed?","Thử nào: câu hỏi mở hay đóng?"],
  items:[["What did you notice when you came in?","Bạn để ý thấy gì khi bước vào?",1],["Was the door locked?","Cửa có khóa không?",0],["Tell me about your walk to school.","Kể cho tôi nghe đường bạn đi học nhé.",1],["Did you see a blue bike?","Bạn có thấy chiếc xe đạp xanh không?",0],["How did the room look before lunch?","Trước bữa trưa căn phòng trông thế nào?",1],["Is this your pencil?","Đây có phải bút chì của bạn không?",0]],
  render:function(){return '<p>'+T("Decide for each question: open (lets people tell more) or closed (yes or no)?","Với mỗi câu, hãy chọn: mở (để người ta kể thêm) hay đóng (có hoặc không)?")+'</p>'+sorter(this.items,[T("Open","Mở"),T("Closed","Đóng")],[1,0])},
  click:function(t){sortClick(t,this.items,[1,0],T("Great! Open questions find new clues; closed ones check details.","Tuyệt! Câu hỏi mở tìm manh mối mới; câu hỏi đóng kiểm tra chi tiết."))}
};
ACT.spot={
  h:["Try it: the missing library book","Thử nào: cuốn sách thư viện biến mất"],
  scene:["Yumi's library book, “Stars and Planets”, has gone from her desk. The question: where is the book now? Pick the four notes that are real clues to that question.","Cuốn sách thư viện “Các vì sao và hành tinh” của Yumi đã biến mất khỏi bàn. Câu hỏi là: cuốn sách giờ ở đâu? Hãy chọn bốn ghi chép là manh mối thật cho câu hỏi đó."],
  items:[["A library return slip for “Stars and Planets” is in the bin, dated today.","Phiếu trả sách “Các vì sao và hành tinh” nằm trong thùng rác, ghi ngày hôm nay.",1],
    ["The class goldfish was fed at 9 o'clock.","Cá vàng của lớp được cho ăn lúc 9 giờ.",0],
    ["Yumi's best friend says Yumi talked about a planet show at lunch.","Bạn thân của Yumi kể Yumi nói về một chương trình chiếu thiên văn lúc ăn trưa.",0],
    ["The library cart was wheeled past Yumi's desk at 11 o'clock.","Xe đẩy của thư viện đi ngang bàn Yumi lúc 11 giờ.",1],
    ["It is raining outside.","Bên ngoài trời đang mưa.",0],
    ["Yumi's desk has a sticky note: “Return books by Friday!”, and today is Friday.","Bàn Yumi có tờ giấy nhớ: “Trả sách trước thứ Sáu!”, và hôm nay là thứ Sáu.",1],
    ["The librarian says one returned book still had a bookmark with a star on it.","Cô thủ thư nói có một cuốn sách được trả vẫn còn kẹp một thẻ đánh dấu hình ngôi sao.",1],
    ["Yumi likes the colour green.","Yumi thích màu xanh lá.",0]],
  render:function(){var a=this;return '<p>'+T(a.scene)+'</p><div class="sc-list">'+a.items.map(function(x,i){return '<button type="button" class="sc-pick" data-spot="'+i+'" aria-pressed="false">'+T(x[0],x[1])+'</button>'}).join("")+'</div><div class="pbtns"><button type="button" class="btn" data-spotcheck="1">'+T("Check my clues","Kiểm tra manh mối")+'</button></div><p class="sc-fb" id="spotfb"></p>'},
  click:function(t){var a=this,b=t.closest("[data-spot]");
    if(b){var on=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",String(on));return}
    if(!t.closest("[data-spotcheck]"))return;
    var picked=[].map.call(root.querySelectorAll('[data-spot][aria-pressed="true"]'),function(x){return +x.dataset.spot}),right=0,wrong=0;
    picked.forEach(function(i){if(a.items[i][2])right++;else wrong++});
    root.querySelectorAll("[data-spot]").forEach(function(x){x.classList.remove("good","bad");if(x.getAttribute("aria-pressed")==="true")x.classList.add(a.items[+x.dataset.spot][2]?"good":"bad")});
    var fb=$("#spotfb");
    if(right===4&&!wrong){fb.innerHTML="✅ "+T("Case closed: the book is back in the library. It went onto the library cart at 11 o'clock, just in time for Friday's deadline, and Yumi's star bookmark was still inside. The goldfish, the rain and the colour green had nothing to do with it.","Phá án xong: cuốn sách đã về lại thư viện. Nó được đặt lên xe đẩy của thư viện lúc 11 giờ, vừa kịp hạn thứ Sáu, và thẻ đánh dấu hình ngôi sao của Yumi vẫn còn kẹp bên trong. Cá vàng, trời mưa và màu xanh lá chẳng liên quan gì cả.");pass()}
    else fb.innerHTML="🔎 "+T("You found "+right+" of 4 real clues"+(wrong?", and "+wrong+" note(s) that don't help answer where the book is":"")+". Try again!","Bạn tìm được "+right+"/4 manh mối thật"+(wrong?", và "+wrong+" ghi chép không giúp trả lời cuốn sách ở đâu":"")+". Thử lại nhé!");
  }
};
ACT.timeline={
  h:["Try it: put Saturday in order","Thử nào: sắp xếp ngày thứ Bảy"],
  ev:[["8:00 Ken waters the garden; the soil is now wet.","8:00 Ken tưới vườn; đất giờ đã ướt."],["9:30 Small muddy paw prints appear on the porch.","9:30 Những dấu chân nhỏ lấm bùn xuất hiện trên hiên nhà."],["10:00 Ken notices one sock missing from the washing line.","10:00 Ken phát hiện một chiếc tất biến mất khỏi dây phơi."],["10:15 The neighbour's puppy is seen napping on something striped.","10:15 Chú cún nhà hàng xóm được thấy đang ngủ trên một thứ có sọc."],["10:30 Ken finds his striped sock in the puppy's basket.","10:30 Ken tìm thấy chiếc tất sọc của mình trong giỏ của chú cún."]],
  render:function(){var a=this;a.order=shuffle(a.ev.map(function(x,i){return i}));if(a.order.every(function(v,i){return v===i}))a.order.reverse();return '<p>'+T("The events got mixed up. Use the arrows to put them in time order, from first to last.","Các sự việc bị xáo trộn. Dùng mũi tên để xếp theo thứ tự thời gian, từ đầu đến cuối.")+'</p><ol class="sc-tl" id="tl"></ol><div class="pbtns"><button type="button" class="btn" data-tlcheck="1">'+T("Check the order","Kiểm tra thứ tự")+'</button></div><p class="sc-fb" id="tlfb"></p>'},
  after:function(){this.draw()},
  draw:function(){var a=this;$("#tl").innerHTML=a.order.map(function(k,i){var e=a.ev[k],txt=T(e[0],e[1]).replace(/^\d+:\d+ /,"");return '<li><span>'+esc(txt)+'</span><button type="button" class="chip" data-tlup="'+i+'" aria-label="'+T("Move up","Lên")+'"'+(i?'':' disabled')+'>▲</button><button type="button" class="chip" data-tldn="'+i+'" aria-label="'+T("Move down","Xuống")+'"'+(i<a.order.length-1?'':' disabled')+'>▼</button></li>'}).join("")},
  click:function(t){var a=this,u=t.closest("[data-tlup]"),d=t.closest("[data-tldn]"),i,x;
    if(u){i=+u.dataset.tlup;x=a.order[i];a.order[i]=a.order[i-1];a.order[i-1]=x;a.draw();return}
    if(d){i=+d.dataset.tldn;x=a.order[i];a.order[i]=a.order[i+1];a.order[i+1]=x;a.draw();return}
    if(!t.closest("[data-tlcheck]"))return;
    var ok=a.order.every(function(v,i){return v===i});
    $("#tlfb").innerHTML=ok?"✅ "+T("Perfect timeline! Wet soil at 8:00 explains the muddy paws at 9:30: the sock thief was a sleepy puppy.","Dòng thời gian hoàn hảo! Đất ướt lúc 8:00 giải thích dấu chân bùn lúc 9:30: thủ phạm lấy tất là một chú cún buồn ngủ."):"🔎 "+T("Not quite. Hint: something had to make the ground muddy before the paw prints.","Chưa đúng. Gợi ý: phải có gì đó làm đất lấm bùn trước khi có dấu chân.");
    if(ok)pass();
  }
};
ACT.sort={
  h:["Try it: sort the statements","Thử nào: phân loại các câu nói"],
  items:[["The cookie jar was full at noon.","Hũ bánh còn đầy lúc 12 giờ trưa.",0],["Cookies are the best snack ever.","Bánh quy là món ăn vặt ngon nhất.",1],["Maybe the cat knocked the lid off.","Có lẽ con mèo đã làm rơi nắp hũ.",2],["There are crumbs on the blue chair.","Có vụn bánh trên chiếc ghế xanh.",0],["Hana looks like a cookie lover.","Trông Hana có vẻ mê bánh quy.",1],["Perhaps someone shared them at the party.","Có thể ai đó đã chia bánh ở bữa tiệc.",2]],
  render:function(){return '<p>'+T("Is each statement a fact, an opinion or a guess?","Mỗi câu là dữ kiện, ý kiến hay phỏng đoán?")+'</p>'+sorter(this.items,[T("Fact","Dữ kiện"),T("Opinion","Ý kiến"),T("Guess","Phỏng đoán")],[0,1,2])},
  click:function(t){sortClick(t,this.items,[0,1,2],T("Well sorted! Check the facts, respect opinions, and test your guesses.","Phân loại giỏi lắm! Kiểm tra dữ kiện, tôn trọng ý kiến và thử nghiệm phỏng đoán."))}
};
ACT.puzzle={
  h:["Try it: who borrowed the red umbrella?","Thử nào: ai đã mượn chiếc ô đỏ?"],
  clues:[["It rained only in the afternoon.","Trời chỉ mưa vào buổi chiều."],["The umbrella was back in the stand, still wet, at 4 pm.","Lúc 4 giờ chiều chiếc ô đã về lại giá, vẫn còn ướt."],["Ayumi was in the library all afternoon (the librarian saw her).","Ayumi ở thư viện suốt buổi chiều (cô thủ thư đã thấy cô bé)."],["Genta went home at lunchtime, before the rain, and came back at 5 pm.","Genta về nhà lúc trưa, trước khi mưa, và quay lại lúc 5 giờ chiều."],["Mitsuhiko came back from the post office at 3:45 pm with dry shoes.","Mitsuhiko từ bưu điện về lúc 3 giờ 45 chiều mà giày vẫn khô."]],
  who:[["Ayumi","Ayumi","She stayed in the library all afternoon, so she never went out in the rain.","Cô bé ở thư viện suốt buổi chiều nên không hề ra ngoài trời mưa."],["Genta","Genta","He only came back at 5 pm, but the umbrella was already back at 4 pm.","Cậu chỉ quay lại lúc 5 giờ, nhưng chiếc ô đã về giá từ 4 giờ."],["Mitsuhiko","Mitsuhiko","He was out in the afternoon rain, came back just before 4 pm, and his shoes stayed dry: he had an umbrella!","Cậu ra ngoài khi trời mưa buổi chiều, về ngay trước 4 giờ, mà giày vẫn khô: cậu đã có ô!"]],
  render:function(){var a=this;return '<p>'+T("Three friends could have borrowed the umbrella. Read the clues, test each friend, and choose.","Ba người bạn có thể đã mượn chiếc ô. Đọc manh mối, kiểm tra từng bạn rồi chọn.")+'</p><ul class="tight">'+a.clues.map(function(c){return '<li>'+T(c[0],c[1])+'</li>'}).join("")+'</ul><div class="pbtns">'+a.who.map(function(w,i){return '<button type="button" class="btn ghost" data-who="'+i+'">'+T(w[0],w[1])+'</button>'}).join("")+'</div><p class="sc-fb" id="pzfb"></p>'},
  click:function(t){var a=this,b=t.closest("[data-who]");if(!b)return;var i=+b.dataset.who,w=a.who[i];
    $("#pzfb").innerHTML=(i===2?"✅ "+T("Solved! ","Giải được rồi! "):"❌ "+T("Cross that one out: ","Gạch bỏ bạn này: "))+T(w[2],w[3])+(i===2?" "+T("(He borrowed it politely and brought it straight back.)","(Cậu đã mượn lịch sự và trả lại ngay.)"):"");
    if(i===2)pass();}
};
ACT.cipher={
  h:["Try it: crack the Detective Boys' code","Thử nào: giải mật mã của Đội thám tử nhí"],
  msg:"PHHW DW WKH SDUN DW IRXU",
  render:function(){return '<p>'+T("Every letter in this message was moved the same number of steps along the alphabet (A→B→C…). Slide to find the shift that makes real words.","Mỗi chữ cái trong tin nhắn đã bị dịch cùng một số bước trong bảng chữ cái (A→B→C…). Kéo thanh trượt để tìm số bước tạo ra chữ có nghĩa.")+'</p><p class="sc-code">'+this.msg+'</p><label class="sc-slider">'+T("Shift back by ","Dịch lùi ")+'<b id="shv">0</b><input type="range" id="sh" min="0" max="25" value="0"></label><p class="sc-code sc-out" id="shout">'+this.msg+'</p><p class="sc-fb" id="shfb"></p>'+
    '<details class="more"><summary>'+T("Make your own secret message","Tạo mật thư của riêng bạn")+'</summary><div class="inside"><label>'+T("Message","Tin nhắn")+' <input type="text" id="encin" maxlength="60" value="'+T("MEET AT THE LIBRARY","GAP NHAU O THU VIEN")+'"></label> <label>'+T("Shift","Dịch")+' <input type="number" id="encsh" min="1" max="25" value="3" style="width:4em"></label><p class="sc-code" id="encout"></p></div></details>'},
  after:function(){var a=this;function shift(t,n){return t.replace(/[A-Z]/g,function(c){return String.fromCharCode((c.charCodeAt(0)-65+n+26)%26+65)})}
    var sh=$("#sh"),enc=function(){$("#encout").textContent=shift(String($("#encin").value).toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/Đ/g,"D"),+$("#encsh").value||0)};
    sh.oninput=function(){var n=+sh.value;$("#shv").textContent=n;$("#shout").textContent=shift(a.msg,-n);
      if(n===3){$("#shfb").innerHTML="✅ "+T("“MEET AT THE PARK AT FOUR”: you cracked it! This is a Caesar cipher, one of the oldest codes in history.","“MEET AT THE PARK AT FOUR” (Hẹn ở công viên lúc 4 giờ): bạn giải được rồi! Đây là mật mã Caesar, một trong những mật mã cổ nhất lịch sử.");pass()}else $("#shfb").textContent=""};
    $("#encin").oninput=enc;$("#encsh").oninput=enc;enc();}
};
ACT.choices={
  h:["Try it: what would a good detective do?","Thử nào: thám tử giỏi sẽ làm gì?"],
  qs:[[["You think a classmate took your eraser. What do you do?","Bạn nghĩ một bạn cùng lớp đã lấy cục tẩy của bạn. Bạn làm gì?"],[["Tell the whole class they are a thief.","Nói với cả lớp rằng bạn ấy là kẻ trộm.",0],["Check your bag and desk first, then ask them kindly.","Kiểm tra cặp và bàn trước, rồi hỏi bạn ấy thật nhẹ nhàng.",1],["Look through their bag when they're not there.","Lục cặp bạn ấy khi bạn ấy không có mặt.",0]]],
     [["A stranger online asks where you live so they can “help with your case”.","Một người lạ trên mạng hỏi nhà bạn ở đâu để “giúp bạn phá án”."],[["Tell them, they want to help.","Nói cho họ biết, họ muốn giúp mà.",0],["Don't share it, and tell a trusted adult.","Không chia sẻ, và báo cho người lớn tin cậy.",1],["Send a photo of your street instead.","Gửi ảnh con đường nhà mình thay vào đó.",0]]],
     [["You explained your solution, then found a clue that proves you were wrong.","Bạn đã trình bày lời giải, rồi tìm thấy manh mối chứng minh bạn sai."],[["Hide the new clue.","Giấu manh mối mới đi.",0],["Say so honestly and update your answer.","Thành thật nói ra và sửa lại đáp án.",1],["Blame someone else for the mistake.","Đổ lỗi cho người khác.",0]]]],
  render:function(){var a=this;a.ok={};return a.qs.map(function(q,qi){return '<div class="sc-q"><p><b>'+T(q[0][0],q[0][1])+'</b></p><div class="sc-list">'+q[1].map(function(o,oi){return '<button type="button" class="sc-pick" data-cq="'+qi+'" data-co="'+oi+'">'+T(o[0],o[1])+'</button>'}).join("")+'</div></div>'}).join("")+'<p class="sc-fb" id="chfb"></p>'},
  click:function(t){var a=this,b=t.closest("[data-cq]");if(!b)return;var qi=+b.dataset.cq,o=a.qs[qi][1][+b.dataset.co];
    root.querySelectorAll('[data-cq="'+qi+'"]').forEach(function(x){x.classList.remove("good","bad")});b.classList.add(o[2]?"good":"bad");
    if(o[2])a.ok[qi]=1;else delete a.ok[qi];
    var n=Object.keys(a.ok).length;$("#chfb").innerHTML=n===a.qs.length?"✅ "+T("That's the heart of a true detective: kind, honest and safe.","Đó chính là trái tim của một thám tử thực thụ: tử tế, trung thực và an toàn."):T(n+" of "+a.qs.length+" answered well.",n+"/"+a.qs.length+" câu trả lời tốt.");
    if(n===a.qs.length)pass();}
};
/* shared: sort statements into groups */
function sorter(items,labels,vals){return '<div class="sc-sort">'+items.map(function(x,i){return '<div class="sc-row" data-row="'+i+'"><span>'+T(x[0],x[1])+'</span><span class="sc-opts">'+labels.map(function(l,k){return '<button type="button" class="chip" data-sv="'+vals[k]+'" data-si="'+i+'">'+l+'</button>'}).join("")+'</span></div>'}).join("")+'</div><p class="sc-fb" id="sortfb"></p>'}
var sortDone={};
function sortClick(t,items,vals,msg){
  var b=t.closest("[data-si]");if(!b)return;var i=+b.dataset.si,ok=+b.dataset.sv===items[i][2],row=b.closest(".sc-row");
  row.querySelectorAll("[data-si]").forEach(function(x){x.classList.remove("good","bad")});b.classList.add(ok?"good":"bad");
  if(ok)sortDone[i]=1;else delete sortDone[i];
  var n=Object.keys(sortDone).length;$("#sortfb").innerHTML=n===items.length?"✅ "+msg:T(n+" of "+items.length+" right so far.","Đúng "+n+"/"+items.length+" câu.");
  if(n===items.length)pass();
}
function $(s){return root.querySelector(s)}

/* ---------- reusable activities for the newer sections ---------- */
/* sort each statement into one of the groups; items are [English, Vietnamese, group number] */
function mkSort(h,prompt,labels,items,msg){
  var vals=labels.map(function(x,k){return k});
  return {h:h,render:function(){return '<p>'+T(prompt)+'</p>'+sorter(items,labels.map(function(l){return T(l)}),vals)},click:function(t){sortClick(t,items,vals,T(msg))}};
}
/* one or more questions with answer buttons; options are [English, Vietnamese, 1 if right] */
function mkChoice(h,qs,msg){
  var a={h:h,qs:qs,ok:{}};
  a.render=function(){a.ok={};return a.qs.map(function(q,qi){return '<div class="sc-q"><p><b>'+T(q[0])+'</b></p><div class="sc-list">'+q[1].map(function(o,oi){return '<button type="button" class="sc-pick" data-cq="'+qi+'" data-co="'+oi+'">'+T(o[0],o[1])+'</button>'}).join("")+'</div><p class="sc-why" data-why="'+qi+'"></p></div>'}).join("")+'<p class="sc-fb" id="chfb"></p>'};
  a.click=function(t){var b=t.closest("[data-cq]");if(!b)return;var qi=+b.dataset.cq,q=a.qs[qi],o=q[1][+b.dataset.co];
    root.querySelectorAll('[data-cq="'+qi+'"]').forEach(function(x){x.classList.remove("good","bad")});b.classList.add(o[2]?"good":"bad");
    var why=root.querySelector('[data-why="'+qi+'"]');if(why)why.textContent=q[2]?(o[2]?"✅ ":"🤔 ")+T(q[2]):"";
    if(o[2])a.ok[qi]=1;else delete a.ok[qi];
    var n=Object.keys(a.ok).length;$("#chfb").innerHTML=n===a.qs.length?"✅ "+T(msg):T(n+" of "+a.qs.length+" answered well.",n+"/"+a.qs.length+" câu trả lời tốt.");
    if(n===a.qs.length)pass();};
  return a;
}
/* put steps in the right order; steps are [English, Vietnamese] in the correct order */
function mkOrder(h,prompt,steps,okMsg,hint){
  var a={h:h,steps:steps};
  a.render=function(){a.order=shuffle(steps.map(function(x,i){return i}));if(a.order.every(function(v,i){return v===i}))a.order.reverse();return '<p>'+T(prompt)+'</p><ol class="sc-tl" id="tl"></ol><div class="pbtns"><button type="button" class="btn" data-tlcheck="1">'+T("Check the order","Kiểm tra thứ tự")+'</button></div><p class="sc-fb" id="tlfb"></p>'};
  a.after=function(){a.draw()};
  a.draw=function(){$("#tl").innerHTML=a.order.map(function(k,i){return '<li><span>'+esc(T(steps[k]))+'</span><button type="button" class="chip" data-tlup="'+i+'" aria-label="'+T("Move up","Lên")+'"'+(i?'':' disabled')+'>▲</button><button type="button" class="chip" data-tldn="'+i+'" aria-label="'+T("Move down","Xuống")+'"'+(i<a.order.length-1?'':' disabled')+'>▼</button></li>'}).join("")};
  a.click=function(t){var u=t.closest("[data-tlup]"),d=t.closest("[data-tldn]"),i,x;
    if(u){i=+u.dataset.tlup;x=a.order[i];a.order[i]=a.order[i-1];a.order[i-1]=x;a.draw();return}
    if(d){i=+d.dataset.tldn;x=a.order[i];a.order[i]=a.order[i+1];a.order[i+1]=x;a.draw();return}
    if(!t.closest("[data-tlcheck]"))return;
    var ok=a.order.every(function(v,i){return v===i});$("#tlfb").innerHTML=ok?"✅ "+T(okMsg):"🔎 "+T(hint);if(ok)pass();};
  return a;
}

/* ---------- section 2: body language ---------- */
var BODY=[
{id:"faces",ico:"🙂",title:["Reading faces","Đọc nét mặt"],
 intro:["Faces show feelings, often before words do. Conan notices when someone's smile does not reach their eyes. Learning the basic expressions helps you understand people, and be a kinder friend.","Khuôn mặt thể hiện cảm xúc, nhiều khi trước cả lời nói. Conan để ý khi nụ cười của ai đó không chạm tới ánh mắt. Học các biểu cảm cơ bản giúp bạn hiểu người khác, và trở thành người bạn tử tế hơn."],
 points:[["Happy: cheeks lift and little crinkles appear beside the eyes. A polite smile often moves only the mouth.","Vui: má nhô lên và mắt có nếp nhăn nhỏ ở đuôi. Nụ cười xã giao thường chỉ có miệng cử động."],
   ["Surprised: eyebrows go up, eyes open wide, the mouth may drop open. It only lasts a moment.","Ngạc nhiên: lông mày nhướn lên, mắt mở to, miệng có thể há ra. Chỉ kéo dài một chút thôi."],
   ["Sad: the inner ends of the eyebrows rise, the corners of the mouth go down, eyes look down.","Buồn: đầu trong của lông mày nhướn lên, khóe miệng trễ xuống, mắt nhìn xuống."],
   ["Worried or upset: eyebrows pull together, lips press tight. Ask gently: “Are you okay?”","Lo lắng hay bực bội: lông mày nhíu lại, môi mím chặt. Hãy hỏi nhẹ nhàng: “Bạn ổn chứ?”"]],
 act:"faces"},
{id:"gestures",ico:"🙌",title:["Posture and gestures","Dáng điệu và cử chỉ"],
 intro:["Bodies talk too: how people stand, where they point their feet, what their hands do. But a gesture can mean several things, so a good detective treats it as a question, not an answer.","Cơ thể cũng biết nói: cách đứng, hướng mũi chân, việc đôi tay đang làm. Nhưng một cử chỉ có thể mang nhiều nghĩa, nên thám tử giỏi coi đó là câu hỏi, không phải câu trả lời."],
 points:[["Open posture (arms relaxed, facing you) usually means comfortable and friendly.","Dáng mở (tay thả lỏng, quay về phía bạn) thường có nghĩa là thoải mái và thân thiện."],
   ["Feet often point where people want to go: towards the door can mean “I need to leave”.","Mũi chân thường hướng về nơi người ta muốn đi: hướng ra cửa có thể nghĩa là “Tôi cần đi rồi”."],
   ["Fidgeting, like tapping or playing with a sleeve, often just means nervous, bored or cold.","Bồn chồn, như gõ chân hay vân vê tay áo, thường chỉ có nghĩa là lo, chán hoặc lạnh."],
   ["Always think of at least two reasons for a gesture before you decide what it means.","Luôn nghĩ ra ít nhất hai lý do cho một cử chỉ trước khi quyết định nó có nghĩa gì."]],
 act:"gestures"},
{id:"blmyths",ico:"🧪",title:["Body language is a clue, not proof","Ngôn ngữ cơ thể là manh mối, không phải bằng chứng"],
 intro:["Many people believe you can spot a liar by their body. Scientists have found that is not true: honest people get nervous too, and habits differ between people and cultures. Use body language to decide what to ask next, never to decide who is guilty.","Nhiều người tin rằng có thể nhận ra kẻ nói dối qua cơ thể. Các nhà khoa học đã thấy điều đó không đúng: người trung thực cũng có thể lo lắng, và thói quen khác nhau giữa mỗi người, mỗi nền văn hóa. Hãy dùng ngôn ngữ cơ thể để quyết định nên hỏi gì tiếp, đừng bao giờ dùng để quyết định ai có lỗi."],
 points:[["Know the person's normal: someone who is always fidgety is not suddenly suspicious.","Biết trạng thái bình thường của người đó: người vốn hay cựa quậy không bỗng dưng thành đáng ngờ."],
   ["Culture matters: in some places looking an adult in the eye is polite, in others it is rude.","Văn hóa rất quan trọng: có nơi nhìn thẳng mắt người lớn là lịch sự, có nơi lại là vô lễ."],
   ["Look for changes, then ask a kind question about them.","Hãy để ý sự thay đổi, rồi hỏi một câu tử tế về điều đó."],
   ["Facts and evidence always beat a feeling about someone's face.","Dữ kiện và bằng chứng luôn đáng tin hơn cảm giác về nét mặt của ai đó."]],
 act:"blmyths"},
{id:"mybody",ico:"🫶",title:["Your own body language","Ngôn ngữ cơ thể của chính bạn"],
 intro:["Your body talks to others as well. When you look friendly and calm, people feel safe telling you what they saw. That makes you a better detective and a better friend.","Cơ thể bạn cũng nói chuyện với người khác. Khi bạn trông thân thiện và bình tĩnh, mọi người sẽ yên tâm kể cho bạn điều họ thấy. Điều đó giúp bạn thành thám tử giỏi hơn và người bạn tốt hơn."],
 points:[["Face the person, put your phone away and nod to show you are listening.","Quay về phía người nói, cất điện thoại và gật đầu để cho thấy bạn đang lắng nghe."],
   ["Keep a calm, friendly voice, even when you are excited about a clue.","Giữ giọng bình tĩnh, thân thiện, kể cả khi bạn đang hào hứng vì một manh mối."],
   ["Give people space; standing too close can make them uncomfortable.","Giữ khoảng cách; đứng quá gần có thể khiến người khác không thoải mái."],
   ["Standing tall and breathing slowly helps you feel braver too.","Đứng thẳng và thở chậm cũng giúp bạn thấy can đảm hơn."]],
 act:"mybody"}
];
ACT.faces=mkChoice(["Try it: what is this face saying?","Thử nào: khuôn mặt này nói gì?"],[
 [["Mia's eyebrows shoot up, her eyes open wide and her mouth makes an “O”.","Lông mày của Mia nhướn vọt lên, mắt mở to và miệng tròn chữ “O”."],[["😮 Surprised","😮 Ngạc nhiên",1],["😠 Angry","😠 Tức giận",0],["😴 Sleepy","😴 Buồn ngủ",0]],["Raised eyebrows plus an open mouth is the classic surprise face.","Lông mày nhướn cùng miệng mở là biểu cảm ngạc nhiên điển hình."]],
 [["Taro's cheeks lift and little crinkles appear beside his eyes.","Má của Taro nhô lên và đuôi mắt có những nếp nhăn nhỏ."],[["😊 Really happy","😊 Thật sự vui",1],["😐 Bored","😐 Chán",0],["😢 Sad","😢 Buồn",0]],["Eye crinkles usually come with a real, happy smile.","Nếp nhăn ở mắt thường đi kèm nụ cười vui thật sự."]],
 [["Sara's mouth corners point down and she keeps looking at the floor.","Khóe miệng Sara trễ xuống và bạn ấy cứ nhìn xuống sàn."],[["😄 Excited","😄 Phấn khích",0],["😢 Sad, maybe needs a friend","😢 Buồn, có lẽ cần một người bạn",1],["😮 Surprised","😮 Ngạc nhiên",0]],["A kind detective might sit nearby and ask if Sara is okay.","Một thám tử tử tế có thể ngồi cạnh và hỏi Sara có ổn không."]]
],["You read faces well. Remember: when in doubt, ask kindly.","Bạn đọc nét mặt giỏi lắm. Hãy nhớ: khi chưa chắc, hãy hỏi một cách tử tế."]);
ACT.gestures=mkChoice(["Try it: what might it mean?","Thử nào: điều đó có thể có nghĩa gì?"],[
 [["Ken keeps glancing at the clock and tapping his foot.","Ken cứ liếc đồng hồ và gõ chân."],[["He is definitely hiding something.","Chắc chắn cậu ấy đang che giấu điều gì.",0],["He might be in a hurry or bored; I could ask if he needs to go.","Có thể cậu ấy đang vội hoặc chán; mình có thể hỏi cậu ấy có cần đi không.",1],["It means nothing at all.","Chẳng có ý nghĩa gì cả.",0]],["Several reasons are possible, so a friendly question is the best next step.","Có nhiều lý do khả dĩ, nên một câu hỏi thân thiện là bước tiếp theo tốt nhất."]],
 [["Hana stands with her arms crossed while she watches the game.","Hana đứng khoanh tay trong lúc xem trận đấu."],[["She must be angry with everyone.","Chắc chắn bạn ấy đang giận mọi người.",0],["She could be cold, comfortable or a bit upset; I'd look for other clues.","Có thể bạn ấy lạnh, đang thoải mái hoặc hơi buồn; mình sẽ tìm thêm manh mối khác.",1],["She is lying.","Bạn ấy đang nói dối.",0]],["Crossed arms have many meanings. On a chilly day, the simplest one is “I'm cold”.","Khoanh tay có nhiều nghĩa. Vào hôm trời se lạnh, nghĩa đơn giản nhất là “Tôi lạnh”."]],
 [["While talking to you, Leo's feet are pointed towards the door.","Trong lúc nói chuyện với bạn, mũi chân của Leo hướng về phía cửa."],[["He might need to leave soon.","Có thể cậu ấy sắp phải đi.",1],["He wants to talk all day.","Cậu ấy muốn nói chuyện cả ngày.",0],["He took something.","Cậu ấy đã lấy thứ gì đó.",0]],["Feet often point where people want to go. Ask: “Do you need to go?”","Mũi chân thường hướng về nơi người ta muốn đi. Hãy hỏi: “Bạn có cần đi không?”"]]
],["Great thinking: a gesture opens a question, it doesn't close a case.","Suy nghĩ rất tốt: cử chỉ mở ra câu hỏi, chứ không khép lại vụ án."]);
ACT.blmyths=mkSort(["Try it: true or myth?","Thử nào: đúng hay ngộ nhận?"],["Decide whether each sentence is true or a myth.","Hãy xác định mỗi câu là đúng hay là ngộ nhận."],[["True","Đúng"],["Myth","Ngộ nhận"]],[
 ["Someone who won't look you in the eye must be lying.","Ai không nhìn thẳng vào mắt bạn chắc chắn đang nói dối.",1],
 ["Body language can mean different things in different countries.","Ngôn ngữ cơ thể có thể mang nghĩa khác nhau ở các quốc gia khác nhau.",0],
 ["Crossed arms always mean someone is angry.","Khoanh tay luôn có nghĩa là đang giận.",1],
 ["It helps to compare with how a person usually behaves.","So sánh với cách một người thường cư xử sẽ có ích.",0],
 ["Nervous people are guilty.","Người lo lắng là người có lỗi.",1],
 ["Body language tells you what to ask about, not what is true.","Ngôn ngữ cơ thể gợi ý nên hỏi gì, chứ không cho biết điều gì là sự thật.",0]
],["Exactly: body language is a hint for questions, and evidence decides the answer.","Chính xác: ngôn ngữ cơ thể gợi ý câu hỏi, còn bằng chứng mới quyết định câu trả lời."]);
ACT.mybody=mkSort(["Try it: am I a good listener?","Thử nào: mình có biết lắng nghe không?"],["Which of these show you are listening, and which don't?","Điều nào cho thấy bạn đang lắng nghe, điều nào không?"],[["Listening","Đang lắng nghe"],["Not listening","Không lắng nghe"]],[
 ["Turning to face the person","Quay mặt về phía người nói",0],
 ["Scrolling on my phone","Lướt điện thoại",1],
 ["Nodding and saying “I see”","Gật đầu và nói “Mình hiểu rồi”",0],
 ["Interrupting with my own idea","Ngắt lời để nói ý của mình",1],
 ["Using a calm, kind voice","Dùng giọng bình tĩnh, tử tế",0],
 ["Rolling my eyes","Đảo mắt",1]
],["You're a great listener, and people will trust you with their stories.","Bạn là người biết lắng nghe, mọi người sẽ tin tưởng kể chuyện cho bạn."]);

/* ---------- section 3: staying safe ---------- */
var SAFE=[
{id:"realsafe",ico:"🚦",title:["Real detectives stay safe","Thám tử thật luôn an toàn"],
 intro:["In the manga, Conan runs straight into trouble. That's a story. In real life, the smartest detectives know when a case is too big for them, and hand it to grown-ups whose job it is: parents, teachers, police officers.","Trong truyện, Conan lao thẳng vào rắc rối. Đó chỉ là truyện. Ngoài đời, những thám tử thông minh nhất biết khi nào vụ việc quá lớn với mình, và giao cho người lớn có trách nhiệm: bố mẹ, thầy cô, cảnh sát."],
 points:[["Trust your “uh-oh” feeling: if something feels wrong or scary, it's okay to leave right away.","Tin vào cảm giác “ối, không ổn”: nếu điều gì khiến bạn thấy sai sai hay sợ, cứ rời đi ngay."],
   ["Never follow, spy on or confront someone you think is doing something wrong. Tell a trusted adult instead.","Đừng bao giờ bám theo, theo dõi hay đối mặt với người bạn nghĩ đang làm điều sai. Hãy báo cho người lớn tin cậy."],
   ["Your safety matters more than any clue, toy or secret.","Sự an toàn của bạn quan trọng hơn mọi manh mối, đồ chơi hay bí mật."],
   ["Telling an adult is not tattling: it's how real cases get solved.","Báo cho người lớn không phải là mách lẻo: đó là cách các vụ việc thật được giải quyết."]],
 act:"whocall"},
{id:"strangers",ico:"🧍",title:["Tricky people and safe secrets","Người đáng ngờ và bí mật an toàn"],
 intro:["Most people are kind, but some try to trick children. Tricky people can look friendly and even know your name. The rule is not about how someone looks, but about what they ask you to do.","Hầu hết mọi người đều tốt bụng, nhưng có người tìm cách lừa trẻ em. Người đáng ngờ có thể trông thân thiện, thậm chí biết tên bạn. Quy tắc không dựa vào vẻ ngoài, mà dựa vào điều họ bảo bạn làm."],
 points:[["Never go anywhere, get into a car or take a gift from someone without checking with your grown-up first.","Không bao giờ đi đâu, lên xe hay nhận quà của ai mà chưa hỏi người lớn của mình trước."],
   ["Agree on a family code word. If someone says “your mum sent me” but doesn't know it, don't go.","Thống nhất một mật khẩu gia đình. Nếu ai nói “mẹ cháu nhờ chú đón” mà không biết mật khẩu, đừng đi."],
   ["Safe secrets are fun and end soon, like a surprise party. Unsafe secrets make you feel bad or scared: always tell.","Bí mật an toàn thì vui và sớm kết thúc, như bữa tiệc bất ngờ. Bí mật không an toàn khiến bạn thấy khó chịu hay sợ: luôn phải kể ra."],
   ["It's okay to say “No!” loudly, run to a safe place and tell an adult, even to a grown-up.","Được phép nói “Không!” thật to, chạy tới nơi an toàn và báo người lớn, kể cả khi đó là người lớn."]],
 act:"strangers"},
{id:"lost",ico:"🗺️",title:["If you get lost or need help","Khi bị lạc hoặc cần giúp đỡ"],
 intro:["Even great detectives get separated from their group sometimes. Knowing exactly what to do turns a scary moment into a solved case.","Ngay cả thám tử giỏi đôi khi cũng bị lạc nhóm. Biết chính xác phải làm gì sẽ biến khoảnh khắc đáng sợ thành một vụ án đã được giải."],
 points:[["Learn by heart your full name, your grown-up's phone number and your address.","Học thuộc họ tên đầy đủ, số điện thoại của người lớn và địa chỉ nhà."],
   ["Stop and stay where you are, so your family can find you, unless that place is unsafe.","Dừng lại và đứng yên tại chỗ để gia đình tìm thấy bạn, trừ khi chỗ đó không an toàn."],
   ["Safe helpers: a police officer, staff behind a shop counter, or a parent with children.","Người giúp đỡ an toàn: cảnh sát, nhân viên ở quầy cửa hàng, hoặc một phụ huynh đang đi cùng con."],
   ["Know your emergency number: in Vietnam 113 (police), 114 (fire), 115 (ambulance); 112 in Europe; 911 in the US and Canada; 999 in the UK; 000 in Australia. Only call it for a real emergency.","Biết số khẩn cấp: ở Việt Nam 113 (cảnh sát), 114 (cứu hỏa), 115 (cấp cứu); 112 ở châu Âu; 911 ở Mỹ và Canada; 999 ở Anh; 000 ở Úc. Chỉ gọi khi thật sự khẩn cấp."]],
 act:"lost"},
{id:"online",ico:"💻",title:["Safe online detective","Thám tử an toàn trên mạng"],
 intro:["The internet is full of clues and fun, but people online are not always who they say. Your personal information is treasure: keep it locked away like Kid guards his secret identity.","Internet đầy manh mối và niềm vui, nhưng người trên mạng không phải lúc nào cũng đúng như họ nói. Thông tin cá nhân là kho báu: hãy cất kỹ như cách Kid giữ bí mật danh tính của mình."],
 points:[["Keep private: full name, address, school, phone number, passwords and photos that show where you are.","Giữ riêng tư: họ tên đầy đủ, địa chỉ, trường học, số điện thoại, mật khẩu và ảnh lộ vị trí của bạn."],
   ["Never agree to meet someone from online without your grown-up.","Đừng bao giờ hẹn gặp người quen trên mạng khi không có người lớn của bạn."],
   ["If a message makes you uncomfortable, don't reply: take a screenshot and show a trusted adult.","Nếu tin nhắn khiến bạn khó chịu, đừng trả lời: chụp màn hình và đưa cho người lớn tin cậy xem."],
   ["Check before you believe: who made this site or video, and do other good sources agree?","Kiểm tra trước khi tin: ai làm ra trang web hay video này, và các nguồn đáng tin khác có nói giống vậy không?"]],
 act:"online"}
];
ACT.whocall=mkSort(["Try it: my case or a grown-up's case?","Thử nào: vụ của mình hay của người lớn?"],["Which of these can you look into yourself, and which should you hand to a grown-up straight away?","Việc nào bạn có thể tự tìm hiểu, việc nào phải báo ngay cho người lớn?"],[["I can solve it","Mình tự giải được"],["Tell a grown-up","Báo người lớn"]],[
 ["Who left a scarf in the classroom?","Ai để quên khăn quàng trong lớp?",0],
 ["Smoke is coming out of a neighbour's window.","Khói bốc ra từ cửa sổ nhà hàng xóm.",1],
 ["Someone you don't know is trying the handles of parked cars.","Một người lạ đang thử mở cửa những chiếc xe đỗ bên đường.",1],
 ["Which friend drew the funny cat on the board?","Bạn nào vẽ con mèo ngộ nghĩnh trên bảng?",0],
 ["Someone online asks you to send photos and keep it secret.","Một người trên mạng bảo bạn gửi ảnh và giữ bí mật.",1],
 ["Your friend left you a coded note to crack.","Bạn của bạn để lại một mẩu giấy mật mã cho bạn giải.",0]
],["Right! Smart detectives solve the fun mysteries and hand the risky ones to grown-ups.","Đúng rồi! Thám tử thông minh tự giải những bí ẩn vui, và giao việc nguy hiểm cho người lớn."]);
ACT.strangers=mkChoice(["Try it: what would you do?","Thử nào: bạn sẽ làm gì?"],[
 [["After school, a friendly stranger says: “Your mum is busy, she asked me to drive you home.” He doesn't know your family code word.","Sau giờ học, một người lạ thân thiện nói: “Mẹ cháu bận, mẹ nhờ chú chở cháu về.” Chú ấy không biết mật khẩu gia đình."],[["Go with him, he knows my mum.","Đi theo chú ấy, chú biết mẹ mình mà.",0],["Say “No”, go back inside the school and tell a teacher.","Nói “Không”, quay vào trường và báo thầy cô.",1],["Wait with him by the car.","Đứng đợi cùng chú ấy cạnh xe.",0]],["No code word means no ride, however friendly they seem.","Không có mật khẩu thì không đi, dù người đó trông thân thiện đến đâu."]],
 [["A friend's older cousin gives you a game and says: “Don't tell your parents about this.” It gives you an uh-oh feeling.","Anh họ của một người bạn cho bạn một trò chơi và nói: “Đừng kể với bố mẹ em nhé.” Bạn có cảm giác không ổn."],[["Keep the secret, I promised.","Giữ bí mật, mình đã hứa rồi.",0],["Tell a trusted adult; this is an unsafe secret.","Kể với người lớn tin cậy; đây là bí mật không an toàn.",1]],["Grown-ups who are safe don't ask kids to keep secrets from their parents.","Người lớn đáng tin không bảo trẻ em giấu bố mẹ điều gì."]],
 [["Your class is planning a surprise birthday party for your teacher next Friday.","Cả lớp đang chuẩn bị tiệc sinh nhật bất ngờ cho cô giáo vào thứ Sáu tới."],[["Keep it secret until Friday: it's a safe, happy secret.","Giữ bí mật đến thứ Sáu: đây là bí mật vui và an toàn.",1],["Tell the teacher right away.","Kể ngay với cô giáo.",0]],["Safe secrets are happy and end soon.","Bí mật an toàn thì vui và sẽ sớm kết thúc."]]
],["Well done: you know the difference between a friendly face and a safe choice.","Giỏi lắm: bạn đã phân biệt được gương mặt thân thiện và lựa chọn an toàn."]);
ACT.lost=mkOrder(["Try it: lost in a shopping centre","Thử nào: bị lạc trong trung tâm thương mại"],["You turn around and your family is gone. Put these steps in the best order.","Bạn quay lại và không thấy gia đình đâu. Hãy xếp các bước theo thứ tự tốt nhất."],[
 ["Stop, take a deep breath and stay calm.","Dừng lại, hít thở sâu và giữ bình tĩnh."],
 ["Stay where you are for a moment and look around for your family.","Đứng yên một lúc và nhìn quanh tìm gia đình."],
 ["Go to a safe helper nearby: staff at a shop counter or a security guard.","Tới chỗ người giúp đỡ an toàn gần đó: nhân viên quầy hàng hoặc bảo vệ."],
 ["Tell them your name and your grown-up's phone number.","Nói với họ tên của bạn và số điện thoại của người lớn."],
 ["Wait with the helper where you can be seen, until your family arrives.","Chờ cùng người giúp đỡ ở chỗ dễ nhìn thấy cho đến khi gia đình tới."]
],["Perfect plan: calm, stay, find a safe helper, share your number, wait together.","Kế hoạch hoàn hảo: bình tĩnh, đứng yên, tìm người giúp an toàn, đọc số điện thoại, cùng chờ."],["Not quite. Hint: first calm down, and only then look for help.","Chưa đúng. Gợi ý: trước tiên phải bình tĩnh, sau đó mới tìm người giúp."]);
ACT.online=mkSort(["Try it: share or keep private?","Thử nào: chia sẻ hay giữ riêng tư?"],["You're chatting in a game. Which of these are fine to share, and which should stay private?","Bạn đang trò chuyện trong một trò chơi. Điều nào có thể chia sẻ, điều nào nên giữ riêng tư?"],[["Fine to share","Có thể chia sẻ"],["Keep private","Giữ riêng tư"]],[
 ["Your favourite colour","Màu bạn yêu thích",0],
 ["Your home address","Địa chỉ nhà bạn",1],
 ["Your password","Mật khẩu của bạn",1],
 ["Your favourite Detective Conan character","Nhân vật Conan bạn thích nhất",0],
 ["The name of your school","Tên trường của bạn",1],
 ["A photo of you in your school uniform","Ảnh bạn mặc đồng phục trường",1],
 ["A drawing of Kid the Phantom Thief you made","Bức vẽ Siêu đạo chích Kid do bạn vẽ",0],
 ["Your phone number","Số điện thoại của bạn",1]
],["Great: share the fun stuff, keep the secret-identity stuff locked away, just like Kid.","Tuyệt: chia sẻ những điều vui, khóa kỹ thông tin danh tính, giống hệt Kid."]);

/* ---------- section 4: become a polymath ---------- */
var POLY=[
{id:"polywhat",ico:"🦉",title:["What is a polymath?","Người đa tài là gì?"],
 intro:["A polymath knows a lot about many different subjects. Leonardo da Vinci painted, invented machines and studied the human body. Conan solves cases with science, music, languages, maps and sport. The more you know, the more clues you can recognise.","Người đa tài hiểu biết sâu rộng về nhiều lĩnh vực. Leonardo da Vinci vẽ tranh, chế tạo máy móc và nghiên cứu cơ thể người. Conan phá án nhờ khoa học, âm nhạc, ngoại ngữ, bản đồ và thể thao. Bạn biết càng nhiều, càng nhận ra được nhiều manh mối."],
 points:[["Go deep in one or two things you love, and wide in many others (people call this being T-shaped).","Học sâu một hai thứ bạn yêu thích, và học rộng nhiều thứ khác (người ta gọi là kiểu chữ T)."],
   ["Connect subjects: maths helps music, history helps maps, science helps cooking.","Kết nối các môn: toán giúp âm nhạc, lịch sử giúp đọc bản đồ, khoa học giúp nấu ăn."],
   ["Keep a “questions notebook” for things you wonder about, then look them up.","Giữ một “sổ câu hỏi” cho những điều bạn thắc mắc, rồi tìm hiểu chúng."],
   ["Learn from everyone: grandparents, friends, librarians, videos made by real experts.","Học từ mọi người: ông bà, bạn bè, cô thủ thư, video của chuyên gia thật."]],
 act:"polywhat"},
{id:"skills",ico:"🛠️",title:["Learning a new skill","Học một kỹ năng mới"],
 intro:["Kid wasn't born a great magician; he practised. Any skill, from a card trick to a new language, grows the same way: small steps, lots of practice, and learning from mistakes.","Kid không sinh ra đã là ảo thuật gia tài ba; cậu đã luyện tập. Mọi kỹ năng, từ một trò bài đến một ngoại ngữ, đều lớn lên theo cùng một cách: từng bước nhỏ, luyện tập nhiều và học từ sai lầm."],
 points:[["Break the skill into tiny parts and practise one part at a time, slowly at first.","Chia kỹ năng thành phần nhỏ và luyện từng phần một, lúc đầu thật chậm."],
   ["A little every day beats a lot once a week: 15 minutes daily adds up fast.","Mỗi ngày một ít tốt hơn nhiều một lần mỗi tuần: 15 phút mỗi ngày cộng lại rất nhanh."],
   ["Get feedback: a teacher, a friend, or a video of yourself shows what to fix.","Nhận góp ý: thầy cô, bạn bè hay video quay chính mình cho thấy cần sửa gì."],
   ["Mistakes are information, not failure. Change one thing and try again.","Sai lầm là thông tin, không phải thất bại. Thay đổi một điều rồi thử lại."]],
 act:"skills"},
{id:"memory",ico:"🏛️",title:["Remember more, forget less","Nhớ nhiều hơn, quên ít hơn"],
 intro:["Detectives must remember faces, times and details. Scientists who study memory have found a few tricks that work much better than reading the same page again and again.","Thám tử phải nhớ khuôn mặt, thời gian và chi tiết. Các nhà khoa học nghiên cứu trí nhớ đã tìm ra vài mẹo hiệu quả hơn nhiều so với đọc đi đọc lại một trang sách."],
 points:[["Test yourself: closing the book and trying to recall beats rereading (this is called retrieval practice).","Tự kiểm tra: gấp sách lại và cố nhớ hiệu quả hơn đọc lại (gọi là luyện truy xuất)."],
   ["Space it out: review after one day, then three days, then a week.","Giãn cách: ôn lại sau một ngày, rồi ba ngày, rồi một tuần."],
   ["Make pictures: place things you need to remember in rooms of a house you know well (the memory palace).","Tạo hình ảnh: đặt những thứ cần nhớ vào các phòng trong ngôi nhà bạn thuộc lòng (cung điện trí nhớ)."],
   ["Chunk it: 0912345678 is easier as 0912 345 678. And sleep well: the brain saves memories while you sleep.","Chia cụm: 0912345678 dễ nhớ hơn khi viết 0912 345 678. Và ngủ đủ: não lưu trí nhớ trong lúc bạn ngủ."]],
 act:"palace"},
{id:"pbody",ico:"🏃",title:["A healthy body for a sharp brain","Cơ thể khỏe cho trí óc minh mẫn"],
 intro:["Your brain is part of your body. When you sleep, move, eat and drink well, you think faster, remember more and feel better. Even the greatest detective needs a good night's sleep.","Bộ não là một phần của cơ thể. Khi bạn ngủ, vận động, ăn uống tốt, bạn suy nghĩ nhanh hơn, nhớ nhiều hơn và thấy khỏe hơn. Ngay cả thám tử giỏi nhất cũng cần một giấc ngủ ngon."],
 points:[["Sleep: about 9 to 12 hours a night for ages 6 to 12, and 8 to 10 hours for teenagers.","Ngủ: khoảng 9 đến 12 tiếng mỗi đêm cho trẻ 6 đến 12 tuổi, và 8 đến 10 tiếng cho tuổi teen."],
   ["Move: at least an hour of active play or sport every day, like Shinichi's football or Ran's karate.","Vận động: ít nhất một tiếng vui chơi năng động hoặc thể thao mỗi ngày, như bóng đá của Shinichi hay karate của Ran."],
   ["Eat a rainbow of fruit and vegetables, have breakfast, and drink water during the day.","Ăn đủ màu rau củ quả, ăn sáng đầy đủ, và uống nước trong ngày."],
   ["Rest your eyes: every 20 minutes of screen time, look at something far away for 20 seconds.","Nghỉ mắt: cứ 20 phút nhìn màn hình, hãy nhìn ra xa 20 giây."]],
 act:"healthy"},
{id:"pmind",ico:"🧘",title:["A healthy, calm mind","Tâm trí khỏe mạnh, bình tĩnh"],
 intro:["Feelings are part of being human, and detectives have them too. A healthy mind is not one that never feels worried or sad, but one that knows what to do with those feelings.","Cảm xúc là một phần của con người, và thám tử cũng có cảm xúc. Tâm trí khỏe mạnh không phải là chẳng bao giờ lo hay buồn, mà là biết làm gì với những cảm xúc ấy."],
 points:[["Box breathing: breathe in for 4, hold for 4, out for 4, hold for 4. Repeat a few times to feel calmer.","Thở hình hộp: hít vào đếm 4, giữ 4, thở ra 4, giữ 4. Lặp lại vài lần để bình tĩnh hơn."],
   ["Say “I can't do it… yet.” Brains grow with practice; mistakes help them grow.","Nói “Mình chưa làm được… nhưng sẽ làm được.” Não phát triển nhờ luyện tập; sai lầm giúp não lớn lên."],
   ["Talk about feelings with someone you trust. If you feel sad or worried for a long time, tell a grown-up.","Chia sẻ cảm xúc với người bạn tin tưởng. Nếu buồn hay lo lắng kéo dài, hãy nói với người lớn."],
   ["Make time for fun, friends, nature and doing nothing at all: rest is part of thinking.","Dành thời gian vui chơi, bạn bè, thiên nhiên và cả những lúc chẳng làm gì: nghỉ ngơi cũng là một phần của suy nghĩ."]],
 act:"calm"}
];
ACT.polywhat=mkChoice(["Try it: which knowledge cracks the clue?","Thử nào: kiến thức nào giải được manh mối?"],[
 [["The visitor says he walked across the park, but his shoes have red clay on them, and the park only has grass and grey gravel.","Người khách nói đã đi bộ qua công viên, nhưng giày dính đất sét đỏ, trong khi công viên chỉ có cỏ và sỏi xám."],[["Science: soil and rocks","Khoa học: đất và đá",1],["Music","Âm nhạc",0],["Cooking","Nấu ăn",0]],["Knowing what different soils look like tells you where someone has really been.","Biết các loại đất trông thế nào giúp bạn biết người ta thật sự đã đi đâu."]],
 [["A secret note is written as notes on a music staff: do, re, mi…","Một mật thư được viết bằng nốt nhạc trên khuông: đô, rê, mi…"],[["Geography","Địa lý",0],["Music","Âm nhạc",1],["Sport","Thể thao",0]],["Reading music turns those notes into letters or numbers.","Biết đọc nhạc sẽ biến các nốt thành chữ cái hay con số."]],
 [["In a photo of the “morning” picnic, every shadow is very short.","Trong ảnh buổi dã ngoại “buổi sáng”, mọi cái bóng đều rất ngắn."],[["Science: the Sun and shadows","Khoa học: Mặt Trời và bóng",1],["Art","Mỹ thuật",0],["Languages","Ngoại ngữ",0]],["Shadows are shortest around midday, so the photo was probably taken near noon, not in the morning.","Bóng ngắn nhất vào khoảng giữa trưa, nên bức ảnh có lẽ chụp gần trưa chứ không phải buổi sáng."]]
],["Exactly: every subject you learn is a new tool in your detective kit.","Chính xác: mỗi môn bạn học là một công cụ mới trong bộ đồ nghề thám tử."]);
ACT.skills=mkOrder(["Try it: learning a magic trick like Kid","Thử nào: học một trò ảo thuật như Kid"],["Put the steps for learning a new skill in a good order.","Xếp các bước học một kỹ năng mới theo thứ tự hợp lý."],[
 ["Choose one small trick to learn first.","Chọn một trò nhỏ để học trước."],
 ["Watch someone do it well, slowly.","Xem người giỏi làm thật chậm."],
 ["Practise one part at a time, slowly.","Luyện từng phần một, thật chậm."],
 ["Show a friend and ask what to improve.","Biểu diễn cho bạn xem và hỏi cần cải thiện gì."],
 ["Fix one thing and practise a little every day.","Sửa một điều và luyện một chút mỗi ngày."],
 ["Teach the trick to someone else.","Dạy lại trò đó cho người khác."]
],["Great plan! Teaching it at the end shows you really understand it.","Kế hoạch tuyệt vời! Dạy lại ở bước cuối cho thấy bạn thật sự hiểu."],["Not quite. Hint: start small and slow, get feedback in the middle, and teach it last.","Chưa đúng. Gợi ý: bắt đầu nhỏ và chậm, nhận góp ý ở giữa, và dạy lại ở cuối."]);
ACT.palace={
  h:["Try it: build a memory palace","Thử nào: xây cung điện trí nhớ"],
  places:[["front door","cửa chính"],["sofa","ghế sofa"],["kitchen table","bàn bếp"],["bathtub","bồn tắm"],["bed","giường"],["window","cửa sổ"]],
  pool:[["🍌","banana","quả chuối"],["🔑","key","chìa khóa"],["📘","blue book","cuốn sách xanh"],["⏰","alarm clock","đồng hồ báo thức"],["🎈","balloon","quả bóng bay"],["🧢","cap","mũ lưỡi trai"],["🌂","umbrella","cái ô"],["🧸","teddy bear","gấu bông"],["🎲","dice","xúc xắc"],["🍪","cookie","bánh quy"],["🔦","torch","đèn pin"],["⚽","football","quả bóng đá"]],
  render:function(){var a=this,pool=shuffle(a.pool.slice());a.items=pool.slice(0,6);a.extra=pool.slice(6);
    return '<p>'+T("Imagine walking through your home. Picture each object doing something silly in its place: the sillier, the better. Take your time, then test yourself.","Hãy tưởng tượng bạn đi qua nhà mình. Hình dung mỗi đồ vật làm điều gì đó ngộ nghĩnh ở vị trí của nó: càng ngộ nghĩnh càng tốt. Cứ từ từ, rồi tự kiểm tra.")+'</p><div id="palace"><ol class="sc-palace">'+
      a.items.map(function(it,i){return '<li><b>'+T(a.places[i][0],a.places[i][1])+'</b>: '+it[0]+' '+T(it[1],it[2])+'</li>'}).join("")+'</ol><div class="pbtns"><button type="button" class="btn" data-pal="test">'+T("I've got it: test me","Mình nhớ rồi: kiểm tra đi")+'</button></div></div><p class="sc-fb" id="palfb"></p>'},
  click:function(t){var a=this;
    if(t.closest('[data-pal="test"]')){a.right={};
      $("#palace").innerHTML=a.places.map(function(pl,i){var opts=shuffle([a.items[i],a.items[(i+1)%6],a.extra[i%a.extra.length]]);return '<div class="sc-q"><p><b>'+T("What was at the ","Thứ gì ở ")+T(pl[0],pl[1])+'?</b></p><div class="pbtns">'+opts.map(function(o){return '<button type="button" class="chip" data-palq="'+i+'" data-pala="'+esc(o[1])+'">'+o[0]+' '+T(o[1],o[2])+'</button>'}).join("")+'</div></div>'}).join("");return}
    var b=t.closest("[data-palq]");if(!b)return;var i=+b.dataset.palq,ok=b.dataset.pala===a.items[i][1];
    root.querySelectorAll('[data-palq="'+i+'"]').forEach(function(x){x.classList.remove("good","bad")});b.classList.add(ok?"good":"bad");
    if(ok)a.right[i]=1;else delete a.right[i];
    var n=Object.keys(a.right).length;$("#palfb").innerHTML=n===6?"✅ "+T("All six! That's retrieval practice and a memory palace working together. Try it with your next spelling list.","Đủ cả sáu! Đó là luyện truy xuất và cung điện trí nhớ cùng phát huy tác dụng. Hãy thử với danh sách từ vựng tiếp theo của bạn."):T(n+" of 6 remembered.","Nhớ được "+n+"/6.");
    if(n===6)pass();}
};
ACT.healthy=mkSort(["Try it: brain fuel or brain drain?","Thử nào: tiếp sức hay rút cạn trí não?"],["Which habits help your detective brain, and which wear it out?","Thói quen nào giúp trí não thám tử, thói quen nào làm nó mệt mỏi?"],[["Helps my brain","Giúp trí não"],["Wears it out","Làm não mệt"]],[
 ["Sleeping about 10 hours on a school night (age 10)","Ngủ khoảng 10 tiếng vào đêm trước ngày đi học (10 tuổi)",0],
 ["Playing games on a screen until midnight","Chơi game trên màn hình đến nửa đêm",1],
 ["An hour of football, dancing or cycling","Một tiếng đá bóng, nhảy múa hay đạp xe",0],
 ["Skipping breakfast every day","Ngày nào cũng bỏ bữa sáng",1],
 ["Drinking water during the day","Uống nước trong ngày",0],
 ["Staring at a screen for hours without a break","Nhìn màn hình hàng giờ không nghỉ",1]
],["Spot on. A rested, active, well-fed body makes a sharper detective.","Chuẩn xác. Cơ thể được nghỉ ngơi, vận động và ăn uống tốt làm nên một thám tử sắc sảo hơn."]);
ACT.calm=mkChoice(["Try it: what helps here?","Thử nào: điều gì giúp ích lúc này?"],[
 [["Your heart is racing before you present your project to the class.","Tim bạn đập thình thịch trước khi trình bày dự án trước lớp."],[["Try box breathing: in 4, hold 4, out 4, hold 4.","Thử thở hình hộp: hít 4, giữ 4, thở 4, giữ 4.",1],["Run out of the room.","Chạy ra khỏi phòng.",0],["Tell yourself you'll be terrible.","Tự nhủ mình sẽ làm rất tệ.",0]],["Slow breathing tells your body it is safe, and your thoughts get clearer.","Thở chậm báo cho cơ thể rằng mọi thứ an toàn, và suy nghĩ trở nên sáng rõ hơn."]],
 [["You got a low mark on a maths test.","Bạn bị điểm thấp bài kiểm tra toán."],[["“I'm just bad at maths.”","“Mình dốt toán thôi.”",0],["“I can't do this yet. Let me see which questions I missed and practise those.”","“Mình chưa làm được. Để xem mình sai câu nào và luyện thêm phần đó.”",1]],["Mistakes show you exactly what to practise next.","Sai lầm cho bạn biết chính xác cần luyện gì tiếp theo."]],
 [["A friend has seemed sad and quiet for several weeks.","Một người bạn trông buồn và im lặng suốt mấy tuần nay."],[["Ignore it, it's not my business.","Kệ thôi, không phải việc của mình.",0],["Be kind, ask if they're okay, and suggest talking to a trusted adult.","Tử tế hỏi bạn ấy có ổn không, và gợi ý nói chuyện với người lớn tin cậy.",1]],["Caring about others is a detective skill too, and grown-ups can help with big feelings.","Quan tâm người khác cũng là kỹ năng thám tử, và người lớn có thể giúp với những cảm xúc lớn."]]
],["A calm, kind mind thinks best. Well done!","Tâm trí bình tĩnh và tử tế suy nghĩ tốt nhất. Giỏi lắm!"]);

/* ---------- section 5: be creative ---------- */
var CREATE=[
{id:"crwhat",ico:"💡",title:["Everyone can be creative","Ai cũng có thể sáng tạo"],
 intro:["Being creative means finding ideas that are new and useful. Conan turns a football, a belt and a skateboard into tools nobody else would think of; Dr. Agasa invents gadgets; Kid surprises everyone. Creativity is not magic: it's a skill you can practise.","Sáng tạo là tìm ra ý tưởng vừa mới vừa có ích. Conan biến quả bóng, chiếc thắt lưng và ván trượt thành công cụ không ai nghĩ tới; Tiến sĩ Agasa phát minh đồ nghề; Kid khiến mọi người bất ngờ. Sáng tạo không phải phép màu: đó là kỹ năng có thể luyện tập."],
 points:[["Two kinds of thinking: first go wide (many ideas), then go narrow (choose the best).","Hai kiểu tư duy: trước tiên nghĩ rộng (thật nhiều ý), sau đó thu hẹp (chọn ý hay nhất)."],
   ["Quantity first: the more ideas you have, the more likely one is brilliant.","Số lượng trước: càng nhiều ý tưởng, càng dễ có một ý xuất sắc."],
   ["No idea is too silly at the start. Silly ideas often lead to clever ones.","Lúc đầu không có ý nào là quá ngớ ngẩn. Ý ngớ ngẩn thường dẫn tới ý thông minh."],
   ["Ask “What else could this be?” about everyday objects.","Hỏi “Thứ này còn có thể là gì nữa?” với đồ vật hằng ngày."]],
 act:"uses"},
{id:"crview",ico:"🔄",title:["Change your point of view","Thay đổi góc nhìn"],
 intro:["When everyone looks at a problem the same way, they get stuck in the same place. Creative detectives turn the problem around, look from another angle, or ask “what if?”.","Khi mọi người nhìn vấn đề theo cùng một cách, họ sẽ bị kẹt ở cùng một chỗ. Thám tử sáng tạo xoay ngược vấn đề, nhìn từ góc khác, hoặc hỏi “nếu như…?”."],
 points:[["Flip it: instead of “How do I find the key?”, ask “Where would a key end up by accident?”","Lật ngược: thay vì “Làm sao tìm chìa khóa?”, hãy hỏi “Chìa khóa có thể vô tình rơi vào đâu?”"],
   ["Become someone else: how would a child, a cat, an engineer or a chef see this?","Hóa thân: một em bé, một chú mèo, một kỹ sư hay một đầu bếp sẽ nhìn việc này thế nào?"],
   ["Use SCAMPER questions: Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse.","Dùng câu hỏi SCAMPER: Thay thế, Kết hợp, Thích nghi, Điều chỉnh, Dùng vào việc khác, Loại bỏ, Đảo ngược."],
   ["Ask “What if…?”: what if it were giant? Tiny? Upside down? Made of paper?","Hỏi “Nếu như…?”: nếu nó khổng lồ? Tí hon? Lộn ngược? Làm bằng giấy?"]],
 act:"scamper"},
{id:"crconnect",ico:"🔗",title:["Connect ideas that don't belong together","Kết nối những ý tưởng tưởng như chẳng liên quan"],
 intro:["Most new ideas are old ideas combined in a new way. A voice changer plus a bow tie became Conan's most famous gadget. This is why polymaths are so creative: they have more ideas to combine.","Hầu hết ý tưởng mới là những ý tưởng cũ được kết hợp theo cách mới. Máy đổi giọng cộng chiếc nơ trở thành bảo bối nổi tiếng nhất của Conan. Đó là lý do người đa tài rất sáng tạo: họ có nhiều ý tưởng hơn để kết hợp."],
 points:[["Random word trick: pick any word and force a link to your problem.","Mẹo từ ngẫu nhiên: chọn một từ bất kỳ và tìm cách nối nó với vấn đề của bạn."],
   ["Borrow from nature: burrs that stuck to a dog's fur inspired the hook-and-loop fastener (Velcro).","Học từ thiên nhiên: quả ké bám vào lông chó đã gợi ý cho băng dính gai (Velcro)."],
   ["Mix two hobbies: music plus codes, sport plus maths, cooking plus science.","Trộn hai sở thích: âm nhạc với mật mã, thể thao với toán, nấu ăn với khoa học."],
   ["Write the connections down, even the strange ones.","Ghi lại các kết nối, kể cả những kết nối kỳ lạ."]],
 act:"randomword"},
{id:"crhabits",ico:"🌱",title:["Creative habits","Thói quen sáng tạo"],
 intro:["Ideas often arrive when you aren't trying: in the shower, on a walk, after sleeping. Creative people build habits that give ideas space to grow, and they make their team feel safe to share.","Ý tưởng thường đến khi bạn không cố gắng: lúc tắm, khi đi dạo, sau giấc ngủ. Người sáng tạo xây dựng thói quen cho ý tưởng có chỗ lớn lên, và giúp cả nhóm thấy an tâm chia sẻ."],
 points:[["Carry an idea notebook (or use a notes app) and write ideas down at once.","Mang theo sổ ý tưởng (hoặc ứng dụng ghi chú) và ghi lại ý tưởng ngay lập tức."],
   ["Stuck? Take a break and come back later: your brain keeps working quietly.","Bí ý? Hãy nghỉ một lát rồi quay lại: não bạn vẫn âm thầm làm việc."],
   ["In a group, say “Yes, and…” to build on ideas instead of “No, but…”.","Khi làm nhóm, nói “Đúng vậy, và…” để phát triển ý tưởng thay vì “Không, nhưng…”."],
   ["Be brave about mistakes: every inventor made lots of things that didn't work.","Dũng cảm với sai lầm: nhà phát minh nào cũng từng làm ra rất nhiều thứ không thành công."]],
 act:"crhabits"},
{id:"crsolve",ico:"🚀",title:["Creative problem solving","Giải quyết vấn đề sáng tạo"],
 intro:["Now put it all together, the way Dr. Agasa builds a gadget: understand the problem, imagine many solutions, pick and combine the best, build a small test, and improve it.","Giờ hãy ghép mọi thứ lại, như cách Tiến sĩ Agasa chế tạo một món đồ: hiểu vấn đề, tưởng tượng nhiều giải pháp, chọn và kết hợp những ý hay nhất, làm thử một bản nhỏ, rồi cải tiến."],
 points:[["Understand: what exactly is the problem, and who has it?","Hiểu: vấn đề chính xác là gì, và ai đang gặp nó?"],
   ["Imagine: brainstorm at least ten ideas before judging any of them.","Tưởng tượng: nghĩ ra ít nhất mười ý trước khi đánh giá ý nào."],
   ["Build a quick, cheap test (a prototype) from paper, cardboard or a drawing.","Làm một bản thử nhanh, rẻ (nguyên mẫu) bằng giấy, bìa hoặc hình vẽ."],
   ["Test it, learn what went wrong, improve it, and test again.","Thử nghiệm, rút kinh nghiệm, cải tiến, rồi thử lại."]],
 act:"crsolve"}
];
ACT.uses={
  h:["Try it: idea storm","Thử nào: cơn bão ý tưởng"],
  things:[["🖇️","a paperclip","một chiếc kẹp giấy"],["🌂","an umbrella","một chiếc ô"],["🥤","an empty plastic bottle","một chai nhựa rỗng"],["🧦","an odd sock","một chiếc tất lẻ"],["🥄","a spoon","một chiếc thìa"],["📦","a cardboard box","một thùng bìa các-tông"]],
  render:function(){var a=this;a.thing=a.things[Math.floor(Math.random()*a.things.length)];a.ideas=[];
    return '<p>'+T("How many different uses can you think of for ","Bạn nghĩ ra được bao nhiêu công dụng cho ")+'<b>'+a.thing[0]+' '+T(a.thing[1],a.thing[2])+'</b>? '+T("Detective uses, silly uses, anything! Aim for 6 ideas in 2 minutes.","Công dụng thám tử, công dụng ngộ nghĩnh, gì cũng được! Cố gắng đạt 6 ý trong 2 phút.")+'</p>'+
      '<div class="sc-ideaform"><input type="text" id="idea" maxlength="80" placeholder="'+T("Type an idea and press Enter","Gõ một ý tưởng rồi nhấn Enter")+'"><button type="button" class="btn" data-idea="add">'+T("Add","Thêm")+'</button><span class="sc-timer" id="ustimer">2:00</span></div><ol class="sc-ideas" id="ideas"></ol><p class="sc-fb" id="usfb"></p>'},
  after:function(){var a=this,inp=$("#idea");clearInterval(a.tm);a.left=120;a.started=false;
    inp.onkeydown=function(e){if(e.key==="Enter"){e.preventDefault();a.add()}}},
  add:function(){var a=this,inp=$("#idea"),v=String(inp.value||"").trim();if(!v)return;
    if(!a.started){a.started=true;a.tm=setInterval(function(){a.left--;var el=$("#ustimer");if(!el){clearInterval(a.tm);return}el.textContent=Math.floor(Math.max(0,a.left)/60)+":"+String(Math.max(0,a.left)%60).padStart(2,"0");if(a.left<=0){clearInterval(a.tm);el.classList.add("up")}},1000)}
    a.ideas.push(v);inp.value="";inp.focus();
    $("#ideas").innerHTML=a.ideas.map(function(x){return '<li>'+esc(x)+'</li>'}).join("");
    var n=a.ideas.length;$("#usfb").innerHTML=n>=6?"✅ "+T(n+" ideas! Now go narrow: which one is the most useful? Which one is the most surprising?",n+" ý tưởng! Giờ hãy thu hẹp: ý nào hữu ích nhất? Ý nào bất ngờ nhất?"):T(n+" so far. Keep going: no idea is too silly!","Đã có "+n+" ý. Tiếp tục nào: không có ý nào là quá ngớ ngẩn!");
    if(n>=6)pass();},
  click:function(t){if(t.closest('[data-idea="add"]'))this.add()}
};
ACT.scamper=mkChoice(["Try it: which SCAMPER trick is it?","Thử nào: đây là mẹo SCAMPER nào?"],[
 [["Putting a voice changer inside a bow tie.","Đặt máy đổi giọng vào trong chiếc nơ."],[["Combine","Kết hợp",1],["Eliminate","Loại bỏ",0],["Reverse","Đảo ngược",0]],["Two things that already existed became one new gadget.","Hai thứ có sẵn trở thành một bảo bối mới."]],
 [["Using an old toothbrush to clean a bicycle chain.","Dùng bàn chải đánh răng cũ để chùi xích xe đạp."],[["Put to another use","Dùng vào việc khác",1],["Modify","Điều chỉnh",0],["Combine","Kết hợp",0]],["Same object, brand-new job.","Cùng một đồ vật, công việc hoàn toàn mới."]],
 [["Instead of searching for the missing cat, you put its favourite food out and wait for it to come to you.","Thay vì đi tìm chú mèo đi lạc, bạn đặt đồ ăn khoái khẩu ra và chờ nó tự tìm về."],[["Reverse","Đảo ngược",1],["Substitute","Thay thế",0],["Adapt","Thích nghi",0]],["You flipped the problem: the cat comes to you.","Bạn đã lật ngược vấn đề: chú mèo tự đến với bạn."]]
],["You can SCAMPER! Try these seven questions on any object at home.","Bạn đã biết SCAMPER! Hãy thử bảy câu hỏi này với bất kỳ đồ vật nào trong nhà."]);
ACT.randomword={
  h:["Try it: the random word trick","Thử nào: mẹo từ ngẫu nhiên"],
  words:[["balloon","bóng bay"],["mirror","gương"],["kite","diều"],["torch","đèn pin"],["music","âm nhạc"],["shadow","cái bóng"],["paper cup","cốc giấy"],["rainbow","cầu vồng"],["string","sợi dây"],["bell","cái chuông"],["chalk","phấn"],["whistle","cái còi"]],
  render:function(){var a=this;a.n=0;a.word=null;
    return '<p>'+T("The problem: the Detective Boys want to send a secret signal across the playground, without phones and without shouting. Press the button for a random word and use it to invent a signal.","Vấn đề: Đội thám tử nhí muốn gửi tín hiệu bí mật qua sân trường, không dùng điện thoại và không la hét. Bấm nút để lấy một từ ngẫu nhiên rồi dùng nó nghĩ ra cách gửi tín hiệu.")+'</p>'+
      '<div class="pbtns"><button type="button" class="btn" data-rw="new">🎲 '+T("Random word","Từ ngẫu nhiên")+'</button><span class="sc-word" id="rword"></span></div><div class="sc-ideaform"><input type="text" id="rwidea" maxlength="100" placeholder="'+T("My signal idea…","Ý tưởng tín hiệu của mình…")+'"><button type="button" class="btn ghost" data-rw="add">'+T("Save idea","Lưu ý tưởng")+'</button></div><ol class="sc-ideas" id="rwlist"></ol><p class="sc-fb" id="rwfb"></p>'},
  after:function(){var a=this,inp=$("#rwidea");inp.onkeydown=function(e){if(e.key==="Enter"){e.preventDefault();a.save()}}},
  save:function(){var a=this,inp=$("#rwidea"),v=String(inp.value||"").trim();
    if(!a.word){$("#rwfb").textContent=T("First press 🎲 to get a random word.","Trước tiên hãy bấm 🎲 để lấy một từ ngẫu nhiên.");return}
    if(!v)return;a.n++;$("#rwlist").insertAdjacentHTML("beforeend",'<li><b>'+esc(T(a.word[0],a.word[1]))+'</b>: '+esc(v)+'</li>');inp.value="";
    $("#rwfb").innerHTML=a.n>=3?"✅ "+T("Three ideas from random words! Strange starting points lead to fresh ideas.","Ba ý tưởng từ những từ ngẫu nhiên! Điểm xuất phát lạ dẫn tới ý tưởng mới mẻ."):T(a.n+" idea(s). Roll another word and try again!","Đã có "+a.n+" ý. Lấy từ khác và thử tiếp nhé!");
    if(a.n>=3)pass();},
  click:function(t){var a=this;
    if(t.closest('[data-rw="new"]')){a.word=a.words[Math.floor(Math.random()*a.words.length)];$("#rword").textContent=T(a.word[0],a.word[1]);
      var ex={mirror:["Flash sunlight with a mirror: one flash = “come here”, two = “danger”.","Dùng gương phản chiếu nắng: một lần lóe = “lại đây”, hai lần = “cẩn thận”."]};
      if(!a.n&&ex[a.word[0]])$("#rwfb").textContent=T("Example: ","Ví dụ: ")+T(ex[a.word[0]]);return}
    if(t.closest('[data-rw="add"]'))a.save();}
};
ACT.crhabits=mkSort(["Try it: idea booster or idea blocker?","Thử nào: tiếp sức hay cản trở ý tưởng?"],["Does each habit help ideas grow, or block them?","Mỗi thói quen giúp ý tưởng lớn lên hay cản trở chúng?"],[["Booster","Tiếp sức"],["Blocker","Cản trở"]],[
 ["Writing down every idea, even silly ones","Ghi lại mọi ý tưởng, kể cả ý ngớ ngẩn",0],
 ["Saying “That will never work!” straight away","Nói ngay “Cái đó không bao giờ được đâu!”",1],
 ["Going for a walk when you're stuck","Đi dạo khi bị bí ý",0],
 ["Always copying the first answer you see","Lúc nào cũng chép đáp án đầu tiên bạn thấy",1],
 ["Answering a friend's idea with “Yes, and…”","Đáp lại ý của bạn bằng “Đúng vậy, và…”",0],
 ["Being too afraid of mistakes to try","Quá sợ sai đến mức không dám thử",1]
],["You know how to keep ideas flowing. Now use those boosters every day!","Bạn đã biết cách giữ dòng ý tưởng. Giờ hãy dùng những thói quen tiếp sức mỗi ngày!"]);
ACT.crsolve=mkOrder(["Try it: invent a lost-pencil finder","Thử nào: phát minh máy tìm bút chì thất lạc"],["Your class keeps losing pencils. Put the creative problem-solving steps in order.","Lớp bạn cứ làm mất bút chì. Hãy xếp các bước giải quyết vấn đề sáng tạo theo thứ tự."],[
 ["Ask classmates when and where pencils go missing.","Hỏi các bạn bút chì hay mất khi nào và ở đâu."],
 ["Brainstorm ten ideas, from name stickers to a pencil “parking lot”.","Nghĩ ra mười ý, từ nhãn dán tên đến “bãi đỗ” bút chì."],
 ["Pick the best two ideas and combine them.","Chọn hai ý hay nhất và kết hợp chúng."],
 ["Make a cardboard prototype and try it for a week.","Làm một nguyên mẫu bằng bìa và thử trong một tuần."],
 ["See what worked, improve it, and try again.","Xem điều gì hiệu quả, cải tiến rồi thử lại."]
],["That's how inventors work: understand, imagine, choose, build, improve.","Các nhà phát minh làm việc như vậy đấy: hiểu, tưởng tượng, chọn lọc, chế tạo, cải tiến."],["Not quite. Hint: understand the problem first, build only after you've imagined and chosen.","Chưa đúng. Gợi ý: hiểu vấn đề trước, và chỉ chế tạo sau khi đã tưởng tượng và chọn lọc."]);

var TRACKS=[
 {id:"detect",ico:"🕵️",title:["Become a detective","Trở thành thám tử"],sub:["Think, observe, collect clues and reason","Tư duy, quan sát, thu thập manh mối và suy luận"],cert:["Junior Detective","Thám tử nhí"],lessons:LESSONS},
 {id:"body",ico:"🙂",title:["Body language","Ngôn ngữ cơ thể"],sub:["Read faces and gestures, kindly and carefully","Đọc nét mặt và cử chỉ, tử tế và cẩn thận"],cert:["Body Language Reader","Người đọc ngôn ngữ cơ thể"],lessons:BODY},
 {id:"safe",ico:"🛡️",title:["Staying safe","Giữ an toàn"],sub:["What to do when something feels wrong","Làm gì khi thấy điều gì không ổn"],cert:["Safety Star","Ngôi sao an toàn"],lessons:SAFE},
 {id:"poly",ico:"🦉",title:["Become a polymath","Trở thành người đa tài"],sub:["Learn skills, remember more, keep body and mind healthy","Học kỹ năng, nhớ lâu, giữ thân và tâm khỏe mạnh"],cert:["Young Polymath","Nhà thông thái nhí"],lessons:POLY},
 {id:"create",ico:"💡",title:["Be creative","Sáng tạo"],sub:["Find the solution no one else imagined","Tìm ra lời giải không ai nghĩ tới"],cert:["Creative Thinker","Nhà tư duy sáng tạo"],lessons:CREATE}
];

/* ---------- page ---------- */
if(ST.pos===undefined){ST.pos={detect:Math.min(ST.at||0,LESSONS.length)};}
ST.track=Math.max(0,Math.min(TRACKS.length-1,+ST.track||0));
function track(){return TRACKS[ST.track]}
function lessons(){return track().lessons}
function at(){var p=ST.pos[track().id];return p===undefined?0:p}
function setAt(i){ST.pos[track().id]=Math.max(0,Math.min(lessons().length,i));save()}
function countIn(t){return t.lessons.filter(function(l){return ST.done[l.id]}).length}
function count(){return countIn(track())}
function pass(){var l=lessons()[at()];if(!l||ST.done[l.id])return;ST.done[l.id]=1;save();setTimeout(function(){renderNav();var b=$("#lessonDone");if(b)b.outerHTML=doneBadge()},50);if(window.ConanFX)ConanFX.toast('<span class="tb">'+l.ico+'</span><div><b>'+T("Lesson complete","Hoàn thành bài học")+'</b><br>'+T(l.title)+'</div>')}
function doneBadge(){var l=lessons()[at()];return ST.done[l.id]?'<p class="sc-done" id="lessonDone">✅ '+T("Lesson complete","Đã hoàn thành bài học")+'</p>':'<p class="sc-todo" id="lessonDone">'+T("Finish the activity to complete this lesson.","Hoàn thành hoạt động để xong bài học này.")+'</p>'}
function tabs(){
  return '<div class="sc-tracks" role="tablist">'+TRACKS.map(function(t,i){var n=countIn(t),all=n===t.lessons.length;return '<button type="button" role="tab" class="sc-track'+(i===ST.track?' on':'')+(all?' done':'')+'" data-track="'+i+'" aria-selected="'+(i===ST.track)+'"><span class="sc-track-ico">'+(all?'🏅':t.ico)+'</span><span><b>'+T(t.title)+'</b><small>'+T(t.sub)+'</small><small class="sc-track-n">'+n+' / '+t.lessons.length+'</small></span></button>'}).join("")+'</div>';
}
function renderNav(){
  var L=lessons(),n=count(),nav=$("#scnav");if(!nav)return;
  var tb=$("#sctabs");if(tb)tb.innerHTML=tabs();
  nav.innerHTML='<div class="sc-prog"><span class="mono">'+T(track().title)+' · '+n+' / '+L.length+'</span><div class="dbar"><i style="width:'+Math.round(100*n/L.length)+'%"></i></div></div><div class="sc-steps">'+
    L.map(function(l,i){return '<button type="button" class="sc-step'+(i===at()?' on':'')+(ST.done[l.id]?' done':'')+'" data-go="'+i+'" aria-current="'+(i===at()?'step':'false')+'"><span>'+(ST.done[l.id]?'✅':l.ico)+'</span><small>'+(i+1)+'. '+T(l.title)+'</small></button>'}).join("")+
    '<button type="button" class="sc-step'+(at()===L.length?' on':'')+'" data-go="'+L.length+'"><span>🎓</span><small>'+T("Certificate","Chứng nhận")+'</small></button></div>';
}
function certificate(){
  var t=track(),L=t.lessons,n=count(),all=n===L.length;
  return '<div class="panel sc-lesson"><span class="mono">'+T(t.title)+' · '+T("final step","bước cuối")+'</span><h2>🎓 '+T(t.cert)+' '+T("certificate","· chứng nhận")+'</h2>'+
    (all?'<p>'+T("You finished every lesson in this section. Type your name to make your certificate, then print it or save it as a PDF.","Bạn đã học xong mọi bài trong phần này. Nhập tên để tạo chứng nhận, rồi in ra hoặc lưu thành PDF.")+'</p><label class="sc-name">'+T("Your name","Tên của bạn")+' <input type="text" id="certname" maxlength="40" value="'+esc(ST.name)+'"></label>'+
      '<div class="sc-cert" id="cert"><div class="sc-cert-in"><span class="sc-cert-ico">'+t.ico+'</span><small>'+T("Detective School · Conan TCG primer","Trường thám tử · Trang học Conan TCG")+'</small><h3>'+T(t.cert)+'</h3><p>'+T("This certifies that","Chứng nhận rằng")+'</p><b class="sc-cert-name" id="certshow">'+esc(ST.name||T("Your name","Tên của bạn"))+'</b><p>'+T("has completed every lesson of “"+t.title[0]+"”: ","đã hoàn thành mọi bài học của phần “"+t.title[1]+"”: ")+L.map(function(l){return T(l.title).toLowerCase()}).join(", ")+'.</p><small>'+new Date().toLocaleDateString(LANG==="vi"?"vi-VN":"en-GB")+'</small></div></div><div class="pbtns"><button type="button" class="btn" data-print="1">🖨️ '+T("Print or save as PDF","In hoặc lưu PDF")+'</button>'+(ST.track<TRACKS.length-1?'<button type="button" class="btn ghost" data-track="'+(ST.track+1)+'">'+T("Next section: ","Phần tiếp: ")+T(TRACKS[ST.track+1].title)+' ▶</button>':'')+'</div>'
    :'<p>'+T("Finish all "+L.length+" lessons in this section to unlock your certificate. You have done "+n+".","Hoàn thành cả "+L.length+" bài trong phần này để mở khóa chứng nhận. Bạn đã xong "+n+" bài.")+'</p><div class="pbtns"><button type="button" class="btn" data-go="'+L.findIndex(function(l){return !ST.done[l.id]})+'">'+T("Continue ▶","Tiếp tục ▶")+'</button></div>')+'</div>';
}
function render(){
  var L=lessons(),i=at(),h='<div id="sctabs"></div><div class="sc-nav" id="scnav" role="navigation" aria-label="'+T("Lessons","Bài học")+'"></div><div id="sclesson">';
  if(i>=L.length)h+=certificate();
  else{
    var l=L[i],a=ACT[l.act];
    h+='<article class="panel sc-lesson"><span class="mono">'+T(track().title)+' · '+T("Lesson ","Bài ")+(i+1)+' / '+L.length+'</span><h2>'+l.ico+' '+T(l.title)+'</h2><p class="sc-intro">'+T(l.intro)+'</p>'+
      '<div class="sc-points">'+l.points.map(function(p,k){return '<div class="sc-point"><span>'+(k+1)+'</span><p>'+T(p)+'</p></div>'}).join("")+'</div>'+
      '<section class="sc-act"><h3>🕹️ '+T(a.h)+'</h3>'+a.render()+'</section>'+doneBadge()+
      '<div class="pbtns sc-pager">'+(i?'<button type="button" class="btn ghost" data-go="'+(i-1)+'">◀ '+T("Previous","Bài trước")+'</button>':'')+'<button type="button" class="btn" data-go="'+(i+1)+'">'+(i+1<L.length?T("Next lesson ▶","Bài tiếp ▶"):T("Certificate 🎓","Chứng nhận 🎓"))+'</button></div></article>';
  }
  root.innerHTML=h+'</div>';
  sortDone={};
  renderNav();
  if(i<L.length){var act=ACT[L[i].act];if(act.after)act.after()}
  var cn=$("#certname");if(cn)cn.oninput=function(){ST.name=cn.value;save();$("#certshow").textContent=cn.value||T("Your name","Tên của bạn")};
}
function top(){try{root.scrollIntoView({behavior:"smooth",block:"start"})}catch(x){}}
root.addEventListener("click",function(e){
  var tr=e.target.closest("[data-track]");
  if(tr){ST.track=+tr.dataset.track;save();render();top();return}
  var g=e.target.closest("[data-go]");
  if(g&&!g.disabled){setAt(+g.dataset.go);render();top();return}
  if(e.target.closest("[data-print]")){document.body.classList.add("printcert");window.print();setTimeout(function(){document.body.classList.remove("printcert")},500);return}
  var L=lessons();if(at()<L.length){var a=ACT[L[at()].act];if(a.click)a.click(e.target)}
});
document.addEventListener("conan-lang",function(e){LANG=e.detail&&e.detail.lang==="vi"?"vi":"en";render()});
/* a link like detective.html#safe opens that section */
(function(){var m=/#(detect|body|safe|poly|create)\b/.exec(location.hash);if(m){ST.track=TRACKS.findIndex(function(t){return t.id===m[1]})}})();
render();
window.__school={tracks:TRACKS,lessons:LESSONS,state:ST,track:function(i){ST.track=i;render()},go:function(i){setAt(i);render()}};
})();
