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
try{var sv=JSON.parse(localStorage.getItem(KEY)||"null");if(sv){ST.done=sv.done||{};ST.name=sv.name||"";ST.at=+sv.at||0}}catch(e){}
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

/* ---------- page ---------- */
function count(){return LESSONS.filter(function(l){return ST.done[l.id]}).length}
function pass(){var l=LESSONS[ST.at];if(ST.done[l.id])return;ST.done[l.id]=1;save();setTimeout(function(){renderNav();var b=$("#lessonDone");if(b)b.outerHTML=doneBadge()},50);if(window.ConanFX)ConanFX.toast('<span class="tb">'+l.ico+'</span><div><b>'+T("Lesson complete","Hoàn thành bài học")+'</b><br>'+T(l.title)+'</div>')}
function doneBadge(){var l=LESSONS[ST.at];return ST.done[l.id]?'<p class="sc-done" id="lessonDone">✅ '+T("Lesson complete","Đã hoàn thành bài học")+'</p>':'<p class="sc-todo" id="lessonDone">'+T("Finish the activity to complete this lesson.","Hoàn thành hoạt động để xong bài học này.")+'</p>'}
function renderNav(){
  var n=count(),nav=$("#scnav");if(!nav)return;
  nav.innerHTML='<div class="sc-prog"><span class="mono">'+T("Your progress","Tiến độ của bạn")+' · '+n+' / '+LESSONS.length+'</span><div class="dbar"><i style="width:'+Math.round(100*n/LESSONS.length)+'%"></i></div></div><div class="sc-steps">'+
    LESSONS.map(function(l,i){return '<button type="button" class="sc-step'+(i===ST.at?' on':'')+(ST.done[l.id]?' done':'')+'" data-go="'+i+'" aria-current="'+(i===ST.at?'step':'false')+'"><span>'+(ST.done[l.id]?'✅':l.ico)+'</span><small>'+(i+1)+'. '+T(l.title)+'</small></button>'}).join("")+
    '<button type="button" class="sc-step'+(ST.at===LESSONS.length?' on':'')+'" data-go="'+LESSONS.length+'"><span>🎓</span><small>'+T("Certificate","Chứng nhận")+'</small></button></div>';
}
function certificate(){
  var n=count(),all=n===LESSONS.length;
  return '<div class="panel sc-lesson"><span class="mono">'+T("Final step","Bước cuối")+'</span><h2>🎓 '+T("Junior Detective Certificate","Chứng nhận Thám tử nhí")+'</h2>'+
    (all?'<p>'+T("You finished every lesson. Type your name to make your certificate, then print it or save it as a PDF.","Bạn đã học xong mọi bài. Nhập tên để tạo chứng nhận, rồi in ra hoặc lưu thành PDF.")+'</p><label class="sc-name">'+T("Your name","Tên của bạn")+' <input type="text" id="certname" maxlength="40" value="'+esc(ST.name)+'"></label>'+
      '<div class="sc-cert" id="cert"><div class="sc-cert-in"><span class="sc-cert-ico">🔍</span><small>'+T("Detective School · Conan TCG primer","Trường thám tử · Trang học Conan TCG")+'</small><h3>'+T("Junior Detective","Thám tử nhí")+'</h3><p>'+T("This certifies that","Chứng nhận rằng")+'</p><b class="sc-cert-name" id="certshow">'+esc(ST.name||T("Your name","Tên của bạn"))+'</b><p>'+T("has completed all "+LESSONS.length+" lessons: thinking, observing, asking, collecting clues, taking notes, sorting facts, reasoning, cracking codes and explaining kindly.","đã hoàn thành cả "+LESSONS.length+" bài học: tư duy, quan sát, đặt câu hỏi, thu thập manh mối, ghi chép, phân loại dữ kiện, suy luận, giải mật mã và trình bày tử tế.")+'</p><small>'+new Date().toLocaleDateString(LANG==="vi"?"vi-VN":"en-GB")+'</small></div></div><div class="pbtns"><button type="button" class="btn" data-print="1">🖨️ '+T("Print or save as PDF","In hoặc lưu PDF")+'</button></div>'
    :'<p>'+T("Finish all "+LESSONS.length+" lessons to unlock your certificate. You have done "+n+".","Hoàn thành cả "+LESSONS.length+" bài để mở khóa chứng nhận. Bạn đã xong "+n+" bài.")+'</p><div class="pbtns"><button type="button" class="btn" data-go="'+LESSONS.findIndex(function(l){return !ST.done[l.id]})+'">'+T("Continue the course ▶","Tiếp tục khóa học ▶")+'</button></div>')+'</div>';
}
function render(){
  var h='<div class="sc-nav" id="scnav" role="navigation" aria-label="'+T("Lessons","Bài học")+'"></div><div id="sclesson">';
  if(ST.at>=LESSONS.length)h+=certificate();
  else{
    var l=LESSONS[ST.at],a=ACT[l.act];
    h+='<article class="panel sc-lesson"><span class="mono">'+T("Lesson ","Bài ")+(ST.at+1)+' / '+LESSONS.length+'</span><h2>'+l.ico+' '+T(l.title)+'</h2><p class="sc-intro">'+T(l.intro)+'</p>'+
      '<div class="sc-points">'+l.points.map(function(p,i){return '<div class="sc-point"><span>'+(i+1)+'</span><p>'+T(p)+'</p></div>'}).join("")+'</div>'+
      '<section class="sc-act"><h3>🕹️ '+T(a.h)+'</h3>'+a.render()+'</section>'+doneBadge()+
      '<div class="pbtns sc-pager">'+(ST.at?'<button type="button" class="btn ghost" data-go="'+(ST.at-1)+'">◀ '+T("Previous","Bài trước")+'</button>':'')+'<button type="button" class="btn" data-go="'+(ST.at+1)+'">'+(ST.at+1<LESSONS.length?T("Next lesson ▶","Bài tiếp ▶"):T("Certificate 🎓","Chứng nhận 🎓"))+'</button></div></article>';
  }
  root.innerHTML=h+'</div>';
  sortDone={};
  renderNav();
  if(ST.at<LESSONS.length){var act=ACT[LESSONS[ST.at].act];if(act.after)act.after()}
  var cn=$("#certname");if(cn)cn.oninput=function(){ST.name=cn.value;save();$("#certshow").textContent=cn.value||T("Your name","Tên của bạn")};
}
root.addEventListener("click",function(e){
  var g=e.target.closest("[data-go]");
  if(g&&!g.disabled){ST.at=Math.max(0,Math.min(LESSONS.length,+g.dataset.go));save();render();try{root.scrollIntoView({behavior:"smooth",block:"start"})}catch(x){}return}
  if(e.target.closest("[data-print]")){document.body.classList.add("printcert");window.print();setTimeout(function(){document.body.classList.remove("printcert")},500);return}
  if(ST.at<LESSONS.length){var a=ACT[LESSONS[ST.at].act];if(a.click)a.click(e.target)}
});
document.addEventListener("conan-lang",function(e){LANG=e.detail&&e.detail.lang==="vi"?"vi":"en";render()});
render();
window.__school={lessons:LESSONS,state:ST,go:function(i){ST.at=i;render()}};
})();
