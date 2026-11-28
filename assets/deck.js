/* Deck builder. Card data comes only from the saved copy in cards-data.js. */
(function(){
"use strict";
var KEY="conanDeck", DECK_SIZE=40, PAGE=48;
var COLORS=[["青","blue","Blue","Xanh dương"],["緑","green","Green","Xanh lá"],["白","white","White","Trắng"],["赤","red","Red","Đỏ"],["黄","yellow","Yellow","Vàng"],["黒","black","Black","Đen"]];
var TYPES={"キャラ":["Character","Nhân vật"],"イベント":["Event","Sự kiện"],"パートナー":["Partner","Cộng sự"],"事件":["Case","Vụ án"]};
var $=function(s){return document.querySelector(s)};
var LANG="en";try{if(localStorage.getItem("conanLang")==="vi")LANG="vi"}catch(e){}
function T(en,vi){return LANG==="vi"?vi:en}
function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}

var cards=[],byNum={},boxes=[], savedOn="",shown=PAGE;
var deck={partner:null,caze:null,list:{}};
try{var sv=JSON.parse(localStorage.getItem(KEY));if(sv&&typeof sv.list==="object")deck={partner:sv.partner||null,caze:sv.caze||null,list:sv.list||{}}}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(deck))}catch(e){}}

/* lower case, without Vietnamese accents (Japanese marks are kept) and long-vowel spellings */
function norm(s){return String(s||"").normalize("NFKC").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").normalize("NFC").replace(/đ/g,"d").replace(/ou/g,"o").replace(/uu/g,"u")}
var TR=window.ConanTr;
function prep(raw,names){
  var colors=String(raw.color||"").split("").filter(function(ch){return COLORS.some(function(c){return c[0]===ch})});
  var img=String(raw.image_url||"");
  var c={num:String(raw.card_num),id:String(raw.card_id||raw.card_num),jp:raw.title||"",box:raw.package_code||"",rarity:raw.rarity||"",colors:colors,type:raw.type||"",
    cost:raw.cost,ap:raw.ap,lp:raw.lp,traits:raw.category1||"",text:raw.feature||"",hira:raw.hirameki||"",cut:raw.cut_in||"",
    img:/^https:\/\//.test(img)?img:"",limit:+raw.rcp_limit||3};
  var base=names[c.jp]||raw.title_romaji||c.jp, all=[c.num,c.jp,raw.title_romaji,base,c.traits,c.text,c.hira,c.cut];
  c.tr={};
  ["en","vi"].forEach(function(l){
    var t=c.tr[l]={name:(TR&&TR.name(c.jp,l))||base,traits:(TR&&c.traits&&TR.name(c.traits,l))||c.traits};
    ["text","hira","cut"].forEach(function(k){t[k]=TR&&c[k]?TR.text(c[k],l):c[k]});
    all.push(t.name,t.traits,t.text,t.hira,t.cut);
  });
  c.find=norm(all.join(" "));
  c.manual=window.ConanFx&&(c.type==="キャラ"||c.type==="イベント"||c.type==="事件")?ConanFx.parse(raw).missing.length:0;
  return c;
}
function setNames(){cards.forEach(function(c){c.name=c.tr[LANG].name})}
function boxName(p){return (TR&&TR.box(p.package_code,LANG))||String(p.package_name||"").replace(p.package_code,"").trim()}
function use(data){
  cards=data.cards.map(function(r){return prep(r,data.names||{})});
  setNames();
  byNum={};cards.forEach(function(c){byNum[c.num]=c});
  boxes=data.packages.filter(function(p){return cards.some(function(c){return c.box===p.package_code})});
  savedOn=data.date;
  fillBoxes();renderAll();
}

/* ---------- filtering ---------- */
function filtered(){
  var box=$("#fbox").value,type=$("#ftype").value,color=$("#fcolor").value,lv=$("#flv").value;
  var words=norm($("#fq").value).split(/\s+/).filter(Boolean);
  return cards.filter(function(c){
    if(box&&c.box!==box)return false;
    if(type&&c.type!==type)return false;
    if(color&&c.colors.indexOf(color)<0)return false;
    if(lv&&c.cost!==+lv)return false;
    return words.every(function(w){return c.find.indexOf(w)>-1});
  });
}
function opt(v,l){return '<option value="'+esc(v)+'">'+esc(l)+'</option>'}
function fillSelect(sel,html){var el=$(sel),v=el.value;el.innerHTML=html;el.value=v;if(el.selectedIndex<0)el.selectedIndex=0}
function fillBoxes(){
  fillSelect("#fbox",opt("",T("All boxes","Tất cả các hộp"))+boxes.map(function(p){return opt(p.package_code,p.package_code+" · "+boxName(p))}).join(""));
  fillSelect("#ftype",opt("",T("All types","Mọi loại"))+Object.keys(TYPES).map(function(k){return opt(k,T(TYPES[k][0],TYPES[k][1]))}).join(""));
  fillSelect("#fcolor",opt("",T("All colors","Mọi màu"))+COLORS.map(function(c){return opt(c[0],T(c[2],c[3]))}).join(""));
  fillSelect("#flv",opt("",T("All levels","Mọi cấp"))+[1,2,3,4,5,6,7,8,9].map(function(n){return opt(n,T("Level ","Cấp ")+n)}).join(""));
  $("#fq").placeholder=T("Name, card number or ability word…","Tên, số lá hoặc chữ trong năng lực…");
}

/* ---------- deck rules ---------- */
function copiesById(id){return Object.keys(deck.list).reduce(function(n,k){var c=byNum[k];return n+(c&&c.id===id?deck.list[k]:0)},0)}
function total(){return Object.keys(deck.list).reduce(function(n,k){return n+(byNum[k]?deck.list[k]:0)},0)}
function isMain(c){return c.type==="キャラ"||c.type==="イベント"}
function inDeck(c){return c.type==="パートナー"?(deck.partner===c.num?1:0):c.type==="事件"?(deck.caze===c.num?1:0):(deck.list[c.num]||0)}
function blocked(c){
  if(!isMain(c))return "";
  if(copiesById(c.id)>=c.limit)return T("Limit reached: "+c.limit+" copies of this card (all art versions count together).","Đã đủ "+c.limit+" bản của lá này (mọi phiên bản tranh tính chung).");
  if(total()>=DECK_SIZE)return T("The deck already has 40 cards.","Bộ bài đã đủ 40 lá.");
  return "";
}
function add(num){
  var c=byNum[num];if(!c)return;
  if(c.type==="パートナー")deck.partner=num;
  else if(c.type==="事件")deck.caze=num;
  else{var why=blocked(c);if(why){say(why);return}deck.list[num]=(deck.list[num]||0)+1}
  say(T("Added ","Đã thêm ")+c.name+".");save();renderAll();
}
function remove(num){
  if(deck.partner===num)deck.partner=null;
  else if(deck.caze===num)deck.caze=null;
  else if(deck.list[num]){if(--deck.list[num]<=0)delete deck.list[num]}
  save();renderAll();
}
function say(t){$("#msg").textContent=t}

/* ---------- keyword tips (tap a [keyword] in card text) ---------- */
var KW=[
 [["Declare","Tuyên bố"],["You choose to use this ability during your Main phase.","Bạn tự chọn dùng năng lực này trong giai đoạn Chính."]],
 [["Once per turn","lần mỗi lượt"],["Can be used only this many times each turn.","Chỉ dùng được bấy nhiêu lần mỗi lượt."]],
 [["On enter","Khi vào sân"],["Happens when this character enters your Scene.","Xảy ra khi nhân vật này vào Hiện trường của bạn."]],
 [["Cut-in"],["During a Contact, remove this card from your hand to give one of the characters in the Contact extra AP.","Trong một lần Tiếp xúc, loại lá này khỏi tay để cho một nhân vật đang Tiếp xúc thêm AP."]],
 [["Flash of insight","Tia linh cảm"],["Used when this card is turned over from your evidence, for example when an opposing Action hits your case.","Dùng khi lá này được lật ra từ chứng cứ của bạn, ví dụ khi Hành động của đối thủ đánh trúng Vụ án của bạn."]],
 [["Solution phase","Giai đoạn giải đáp"],["Works only while your case is in its solution phase (reached with Assist when you have 7 or more FILE cards).","Chỉ có tác dụng khi Vụ án của bạn ở giai đoạn giải đáp (đạt được bằng Hỗ trợ khi có từ 7 lá FILE)."]],
 [["Case phase","Giai đoạn vụ án"],["Works only while your case is still in its case phase.","Chỉ có tác dụng khi Vụ án của bạn còn ở giai đoạn vụ án."]],
 [["Your turn","Lượt của bạn"],["Works only during your own turn.","Chỉ có tác dụng trong lượt của bạn."]],
 [["Opponent's turn","Lượt đối thủ"],["Works only during your opponent's turn.","Chỉ có tác dụng trong lượt của đối thủ."]],
 [["When removed from Scene","Khi bị loại khỏi Hiện trường"],["Happens when this character leaves your Scene, for example after losing a Contact.","Xảy ra khi nhân vật này rời Hiện trường, ví dụ sau khi thua một lần Tiếp xúc."]],
 [["Assault","Đột kích"],["Can take Actions the turn it enters.","Có thể thực hiện Hành động ngay lượt vào sân."]],
 [["Swift","Nhanh nhẹn"],["Can deduce or take Actions the turn it enters.","Có thể suy luận hoặc thực hiện Hành động ngay lượt vào sân."]],
 [["Misdirect","Đánh lạc hướng"],["When your opponent deduces, you may put this character to sleep to lower the deducing card's LP by the number shown.","Khi đối thủ suy luận, bạn có thể cho nhân vật này ngủ để giảm LP của lá đang suy luận theo con số ghi trên lá."]],
 [["Disguise","Cải trang"],["During a Contact, this card comes from your hand and swaps places with your character in the Contact. The swapped character goes to the bottom of your deck.","Trong một lần Tiếp xúc, lá này từ tay vào thay chỗ nhân vật của bạn đang Tiếp xúc. Nhân vật bị thay xuống đáy bộ bài."]],
 [["Bond","Gắn kết"],["Works while you have the named character in your Scene.","Có tác dụng khi bạn có nhân vật được nêu tên ở Hiện trường."]],
 [["Partner","Cộng sự"],["Works only if your Partner matches (its color or name).","Chỉ có tác dụng nếu Cộng sự của bạn phù hợp (màu hoặc tên)."]],
 [["Case:","Vụ án:"],["Works only if your Case matches (its color or name).","Chỉ có tác dụng nếu Vụ án của bạn phù hợp (màu hoặc tên)."]],
 [["FILE"],["Needs at least this many cards in your FILE area.","Cần ít nhất bấy nhiêu lá trong khu FILE."]]
];
function kwOf(label){var l=label.toLowerCase();for(var i=0;i<KW.length;i++){if(KW[i][0].some(function(w){var x=w.toLowerCase();return l.indexOf(x)===0||(x==="lần mỗi lượt"&&l.indexOf(x)>-1)}))return i}return -1}
function kwify(html){return html.replace(/\[([^\]<]{1,60})\]/g,function(m,label){var i=kwOf(label);return i<0?m:'<button type="button" class="kw" data-kw="'+i+'" title="'+esc(T(KW[i][1][0],KW[i][1][1]))+'">'+m+'</button>'})}

/* ---------- deck numbers ---------- */
function mainCards(){var out=[];Object.keys(deck.list).forEach(function(k){var c=byNum[k];if(c)for(var i=0;i<deck.list[k];i++)out.push(c)});return out}
/* chance that n cards drawn from a 40-card deck include at least one of k wanted cards */
function atLeastOne(k,n){var miss=1;for(var i=0;i<n;i++)miss*=(DECK_SIZE-k-i)/(DECK_SIZE-i);return k?Math.round(100*(1-Math.max(0,miss))):0}
function deckStats(){
  var all=mainCards();if(!all.length)return "";
  var chars=all.filter(function(c){return c.type==="キャラ"}),evs=all.length-chars.length;
  var avg=function(l,f){var v=l.filter(function(c){return c[f]!=null});return v.length?v.reduce(function(s,c){return s+ +c[f]},0)/v.length:0};
  var col={};all.forEach(function(c){c.colors.forEach(function(x){col[x]=(col[x]||0)+1})});
  var swift=function(c){return /〚迅速〛/.test(c.text)},low=function(c){return c.cost<=3};
  var groups=[[T("Level 1–3 card","Lá cấp 1–3"),all.filter(low).length],[T("Cut-in card","Lá Cut-in"),all.filter(function(c){return c.cut}).length],[T("Swift character","Nhân vật Nhanh nhẹn"),all.filter(swift).length],[T("Event","Sự kiện"),evs]];
  var h='<h3>'+T("Deck numbers","Số liệu bộ bài")+'</h3><div class="dstats">'+
    '<div><b>'+chars.length+'</b><small>'+T("Characters","Nhân vật")+'</small></div><div><b>'+evs+'</b><small>'+T("Events","Sự kiện")+'</small></div>'+
    '<div><b>'+Math.round(avg(chars,"ap"))+'</b><small>'+T("Average AP","AP trung bình")+'</small></div><div><b>'+avg(chars,"lp").toFixed(1)+'</b><small>'+T("Average LP","LP trung bình")+'</small></div>'+
    '<div><b>'+all.filter(function(c){return c.cut}).length+'</b><small>Cut-in</small></div><div><b>'+all.filter(function(c){return c.hira}).length+'</b><small>'+T("Flash","Linh cảm")+'</small></div></div>';
  h+='<p class="why">'+COLORS.filter(function(c){return col[c[0]]}).map(function(c){return '<span class="dot dk-'+c[1]+'" data-l="'+LETTER[c[1]][LANG==="vi"?1:0]+'"></span>'+esc(T(c[2],c[3]))+' '+col[c[0]]}).join(" · ")+'</p>';
  h+='<table class="odds"><tr><th>'+T("At least one…","Có ít nhất một…")+'</th><th>'+T("Opening hand (5)","Tay đầu (5)")+'</th><th>'+T("By turn 3 (8)","Đến lượt 3 (8)")+'</th></tr>'+
    groups.filter(function(g){return g[1]}).map(function(g){return '<tr><td>'+esc(g[0])+' <small>('+g[1]+')</small></td><td>'+atLeastOne(g[1],5)+'%</td><td>'+atLeastOne(g[1],8)+'%</td></tr>'}).join("")+'</table>';
  h+='<p class="why">'+T("Odds of drawing at least one such card, before any redraw. By turn 3 counts your 5 starting cards plus 3 draws.","Xác suất rút được ít nhất một lá như vậy, trước khi đổi bài. Đến lượt 3 tính 5 lá đầu và 3 lần rút.")+'</p>';
  h+='<p><button type="button" class="btn ghost" id="samplebtn">'+T("🎴 Sample opening hand","🎴 Thử rút tay đầu")+'</button></p><div id="sample" class="samplehand"></div>';
  return h;
}
function sampleHand(){
  var all=mainCards();if(!all.length)return;
  for(var i=all.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),x=all[i];all[i]=all[j];all[j]=x}
  $("#sample").innerHTML=all.slice(0,5).map(function(c){return '<button type="button" class="cc-img" data-view="'+esc(c.num)+'" title="'+esc(c.name)+'">'+pic(c,"cimg2")+'</button>'}).join("");
  $("#samplebtn").textContent=T("🎴 Draw again","🎴 Rút lại");
}

/* ---------- share link and print ---------- */
function shareCode(){
  var parts=[];
  if(deck.partner)parts.push(deck.partner);
  if(deck.caze)parts.push(deck.caze);
  Object.keys(deck.list).sort().forEach(function(k){parts.push(deck.list[k]>1?k+"*"+deck.list[k]:k)});
  return parts.join(",");
}
function fromShareCode(code){
  return String(code||"").split(",").map(function(x){var m=/^([A-Za-z0-9-]+)(?:\*(\d+))?$/.exec(x.trim());return m?(m[2]||1)+" "+m[1]:""}).join("\n");
}
function printSheet(){
  var p=byNum[deck.partner],k=byNum[deck.caze],main=Object.keys(deck.list).map(function(x){return byNum[x]}).filter(Boolean).sort(function(a,b){return (a.type===b.type?0:a.type==="キャラ"?-1:1)||(a.cost-b.cost)||(a.num<b.num?-1:1)});
  var row=function(n,c){return '<tr><td>'+n+'</td><td>'+esc(c.num)+'</td><td>'+esc(c.name)+'<br><small lang="ja">'+esc(c.jp)+'</small></td><td>'+esc(T(TYPES[c.type][0],TYPES[c.type][1]))+'</td><td>'+(c.cost!=null?c.cost:"")+'</td></tr>'};
  $("#printsheet").innerHTML='<h1>'+T("Deck list","Danh sách bộ bài")+'</h1><p>'+T("Player name","Tên người chơi")+': ________________________ &nbsp; '+T("Date","Ngày")+': ____________</p>'+
    '<table><tr><th>'+T("Qty","SL")+'</th><th>'+T("Number","Số")+'</th><th>'+T("Card","Lá bài")+'</th><th>'+T("Type","Loại")+'</th><th>'+T("Lv","Cấp")+'</th></tr>'+
    (p?row(1,p):'')+(k?row(1,k):'')+main.map(function(c){return row(deck.list[c.num],c)}).join("")+'</table><p>'+T("Main deck","Bộ chính")+': '+total()+' / '+DECK_SIZE+'</p>';
  window.print();
}

/* ---------- rendering ---------- */
/* the letter inside each color dot helps players who cannot tell the colors apart */
var LETTER={blue:["B","X"],green:["G","L"],white:["W","T"],red:["R","Đ"],yellow:["Y","V"],black:["K","Đe"]};
function dots(c){return c.colors.map(function(ch){var k=COLORS.filter(function(x){return x[0]===ch})[0];return '<span class="dot dk-'+k[1]+'" data-l="'+LETTER[k[1]][LANG==="vi"?1:0]+'" role="img" aria-label="'+esc(T(k[2],k[3]))+'" title="'+esc(T(k[2],k[3]))+'"></span>'}).join("")}
function pic(c,cls){return c.img?'<img class="'+cls+'" loading="lazy" referrerpolicy="no-referrer" src="'+esc(c.img)+'" alt="'+esc(c.name)+'">':'<span class="'+cls+' noimg">'+esc(c.name)+'</span>'}
function stats(c){
  var a=[T(TYPES[c.type]?TYPES[c.type][0]:c.type,TYPES[c.type]?TYPES[c.type][1]:c.type)];
  if(c.cost!=null)a.push(T("Lv ","Cấp ")+c.cost);
  if(c.ap!=null)a.push("AP "+c.ap);
  if(c.lp!=null)a.push("LP "+c.lp);
  return a.join(" · ");
}
function renderResults(){
  var list=filtered(),box=$("#fbox").value;
  $("#count").textContent=list.length+" "+T("card"+(list.length===1?"":"s"),"lá")+(box?T(" in "+box," trong "+box):"");
  $("#results").innerHTML=list.slice(0,shown).map(function(c){
    var n=inDeck(c),why=blocked(c);
    return '<div class="cc"><button type="button" class="cc-img" data-view="'+esc(c.num)+'">'+pic(c,"cimg2")+(n?'<span class="qty">×'+n+'</span>':'')+'</button>'+
      '<b>'+dots(c)+esc(c.name)+'</b><small>'+esc(c.num)+' · '+esc(c.rarity)+'</small><small>'+esc(stats(c))+'</small>'+
      '<button type="button" class="btn" data-add="'+esc(c.num)+'"'+(why?' disabled title="'+esc(why)+'"':'')+'>'+(c.type==="パートナー"?T("Set partner","Chọn cộng sự"):c.type==="事件"?T("Set case","Chọn vụ án"):T("+ Add","+ Thêm"))+'</button></div>';
  }).join("")||'<p>'+T("No cards match. Try fewer words or choose “All boxes”.","Không có lá nào phù hợp. Thử ít chữ hơn hoặc chọn “Tất cả các hộp”.")+'</p>';
  $("#more").hidden=list.length<=shown;
  $("#source").textContent=T("Saved card list from "+savedOn+".","Danh sách lá bài đã lưu ngày "+savedOn+".");
}
function row(c,n,main){
  return '<li><button type="button" class="dname" data-view="'+esc(c.num)+'">'+dots(c)+(c.cost!=null?'<em>'+c.cost+'</em> ':'')+esc(c.name)+' <small>'+esc(c.num)+'</small></button>'+
    '<span class="dq"><button type="button" data-remove="'+esc(c.num)+'" aria-label="'+T("Remove one","Bớt một")+'">−</button>'+(main?'<b>'+n+'</b><button type="button" data-add="'+esc(c.num)+'" aria-label="'+T("Add one","Thêm một")+'"'+(blocked(c)?' disabled':'')+'>+</button>':'')+'</span></li>';
}
function renderDeck(){
  var p=byNum[deck.partner],k=byNum[deck.caze],n=total();
  var main=Object.keys(deck.list).map(function(x){return byNum[x]}).filter(Boolean).sort(function(a,b){return (a.type===b.type?0:a.type==="キャラ"?-1:1)||(a.cost-b.cost)||(a.num<b.num?-1:1)});
  var h='<div class="dcount'+(n===DECK_SIZE&&p&&k?' ok':'')+'"><b>'+n+' / '+DECK_SIZE+'</b> '+T("cards","lá")+'<div class="dbar"><i style="width:'+Math.min(100,n/DECK_SIZE*100)+'%"></i></div></div>';
  var todo=[];
  if(!p)todo.push(T("Choose 1 Partner.","Chọn 1 lá Cộng sự."));
  if(!k)todo.push(T("Choose 1 Case.","Chọn 1 lá Vụ án."));
  if(n<DECK_SIZE)todo.push(T("Add "+(DECK_SIZE-n)+" more Character or Event cards.","Thêm "+(DECK_SIZE-n)+" lá Nhân vật hoặc Sự kiện."));
  if(n>DECK_SIZE)todo.push(T("Remove "+(n-DECK_SIZE)+" cards.","Bớt "+(n-DECK_SIZE)+" lá."));
  var seen={};main.forEach(function(c){if(!seen[c.id]&&copiesById(c.id)>c.limit){seen[c.id]=1;todo.push(T("Too many copies of "+c.name+" (max "+c.limit+").","Quá nhiều bản "+c.name+" (tối đa "+c.limit+")."))}});
  h+=todo.length?'<ul class="tight todo">'+todo.map(function(t){return '<li>'+esc(t)+'</li>'}).join("")+'</ul>':'<p class="note ready">'+T("✅ Your deck follows the building rules.","✅ Bộ bài đúng luật xây dựng.")+'</p>';
  if(p&&k&&n===DECK_SIZE){
    var full=main.reduce(function(s,c){return s+(c.manual?0:deck.list[c.num])},0);
    h+='<p><a class="btn" href="practice.html">'+T("🎮 Play this deck","🎮 Chơi bộ bài này")+'</a></p><p class="why">'+T(full+" of 40 cards are fully automated against the bot.",full+"/40 lá được tự động hóa đầy đủ khi đấu bot.")+'</p>';
  }
  if(k){
    var off=main.reduce(function(s,c){return s+(c.colors.some(function(x){return k.colors.indexOf(x)>-1})?0:deck.list[c.num])},0);
    if(off)h+='<p class="note">'+esc(T("⚠️ "+off+" card(s) do not share a color with your Case. They are allowed in the deck, but you cannot play them from hand or Next Hint.","⚠️ "+off+" lá không cùng màu với Vụ án. Được phép bỏ vào bộ bài, nhưng không thể chơi từ tay hay bằng Next Hint."))+'</p>';
  }
  h+='<h3>'+T("Partner and Case","Cộng sự và Vụ án")+'</h3><ul class="dlist">'+
    (p?row(p,1,false):'<li class="empty">'+T("No partner yet","Chưa có cộng sự")+'</li>')+
    (k?row(k,1,false):'<li class="empty">'+T("No case yet","Chưa có vụ án")+'</li>')+'</ul>';
  [["キャラ",T("Characters","Nhân vật")],["イベント",T("Events","Sự kiện")]].forEach(function(g){
    var l=main.filter(function(c){return c.type===g[0]});if(!l.length)return;
    h+='<h3>'+g[1]+' ('+l.reduce(function(s,c){return s+deck.list[c.num]},0)+')</h3><ul class="dlist">'+l.map(function(c){return row(c,deck.list[c.num],true)}).join("")+'</ul>';
  });
  if(main.length){
    var lv={};main.forEach(function(c){lv[c.cost]=(lv[c.cost]||0)+deck.list[c.num]});
    var max=Math.max.apply(null,Object.keys(lv).map(function(x){return lv[x]}));
    h+='<h3>'+T("Cards per level","Số lá theo cấp")+'</h3><div class="curve">'+Object.keys(lv).sort(function(a,b){return a-b}).map(function(x){return '<div><small>'+lv[x]+'</small><i style="height:'+Math.round(lv[x]/max*60)+'px"></i><small>'+esc(x)+'</small></div>'}).join("")+'</div>';
  }
  h+=deckStats();
  $("#deck").innerHTML=h;
  $("#jump").textContent=T("My deck","Bộ bài")+" "+n+"/"+DECK_SIZE+" ▼";
}
function renderAll(){renderResults();renderDeck()}

var ISSUES="https://github.com/ChuongQuoc1413017/Detective_Conan_Card_Game/issues/new";
function reportUrl(c){
  var title="Card "+c.num+": ";
  var body="Card: "+c.num+" ("+c.jp+")\nLanguage: "+LANG.toUpperCase()+"\n\nWhat is wrong (translation, card data, or how it plays against the bot)?\n\n";
  return ISSUES+"?title="+encodeURIComponent(title)+"&body="+encodeURIComponent(body);
}
function view(num){
  var c=byNum[num];if(!c)return;
  var why=blocked(c),t=c.tr[LANG],block=function(h,v,tips){return v?'<p><b>'+h+'</b><br>'+(tips?kwify(esc(v)):esc(v)).replace(/\n/g,"<br>")+'</p>':''};
  var ja=block("能力",c.text)+block("ヒラメキ",c.hira)+block("カットイン",c.cut);
  $("#viewbody").innerHTML=pic(c,"big2")+'<div><h3>'+dots(c)+esc(c.name)+'</h3><p lang="ja">'+esc(c.jp)+'</p><p>'+esc(c.num)+' · '+esc(c.rarity)+' · '+esc(c.box)+'<br>'+esc(stats(c))+'</p>'+
    (c.traits?'<p>'+esc(t.traits)+'</p>':'')+
    block(T("Ability","Năng lực"),t.text,1)+block(T("Flash of insight","Tia linh cảm"),t.hira,1)+block("Cut-in",t.cut,1)+'<p class="note kwtip" id="kwtip" hidden></p>'+
    (ja?'<details class="more"><summary>'+T("Original Japanese","Bản gốc tiếng Nhật")+'</summary><div class="inside" lang="ja">'+ja+'</div></details>':'')+
    (c.manual?'<p class="note">'+T("⚠️ In the practice game, some text on this card is not automated and does nothing.","⚠️ Trong ván chơi thử, một phần chữ trên lá này chưa được tự động hóa và không có tác dụng.")+'</p>':'')+
    '<small>'+T("Unofficial translation. The Japanese card text is the correct one. Tap a [keyword] to see what it means.","Bản dịch không chính thức. Chữ tiếng Nhật trên lá bài mới là chuẩn. Chạm vào một [từ khóa] để xem nghĩa.")+'</small>'+
    '<p class="why"><a href="'+esc(reportUrl(c))+'" target="_blank" rel="noopener">'+T("🐞 Report a problem with this card","🐞 Báo lỗi lá bài này")+'</a></p>'+
    '<div class="pbtns"><button type="button" class="btn" data-add="'+esc(c.num)+'" data-close'+(why?' disabled':'')+'>'+T("+ Add to deck","+ Thêm vào bộ")+'</button><button type="button" class="btn ghost" data-close>'+T("Close","Đóng")+'</button></div>'+(why?'<p class="why">'+esc(why)+'</p>':'')+'</div>';
  $("#view").showModal();
}

/* ---------- copy / import ---------- */
function asText(){
  var out=[];
  [deck.partner,deck.caze].forEach(function(x){if(byNum[x])out.push("1 "+x+" "+byNum[x].name)});
  Object.keys(deck.list).sort().forEach(function(x){if(byNum[x])out.push(deck.list[x]+" "+x+" "+byNum[x].name)});
  return out.join("\n");
}
function importText(text){
  if(/[#&]deck=/.test(text))text=fromShareCode(decodeURIComponent(/[#&]deck=([^&\s]*)/.exec(text)[1]));
  var next={partner:null,caze:null,list:{}},bad=0,old=deck;
  deck=next;
  text.split(/\n/).forEach(function(line){
    if(!line.trim())return;
    var m=/^\s*(\d+)\s*[x×]?\s+([A-Za-z0-9-]+)/.exec(line),c=m&&byNum[m[2].toUpperCase()];
    if(!c){bad++;return}
    if(c.type==="パートナー")next.partner=c.num;
    else if(c.type==="事件")next.caze=c.num;
    else for(var i=0;i<Math.min(+m[1],DECK_SIZE);i++){if(blocked(c)){bad++;break}next.list[c.num]=(next.list[c.num]||0)+1}
  });
  if(!next.partner&&!next.caze&&!total()){deck=old;say(T("No cards found. Use one card per line, like: 3 D01002","Không tìm thấy lá nào. Mỗi dòng một lá, ví dụ: 3 D01002"));return}
  save();renderAll();
  say(T("Deck imported."+(bad?" "+bad+" line(s) were skipped or cut short.":""),"Đã nhập bộ bài."+(bad?" "+bad+" dòng bị bỏ qua hoặc cắt bớt.":"")));
}

/* ---------- events ---------- */
["#fbox","#ftype","#fcolor","#flv"].forEach(function(s){$(s).addEventListener("change",function(){shown=PAGE;renderResults()})});
var timer=null;
$("#fq").addEventListener("input",function(){clearTimeout(timer);timer=setTimeout(function(){shown=PAGE;renderResults()},150)});
$("#freset").addEventListener("click",function(){["#fbox","#ftype","#fcolor","#flv","#fq"].forEach(function(s){$(s).value=""});shown=PAGE;renderResults()});
$("#more").addEventListener("click",function(){shown+=PAGE;renderResults()});
$("#jump").addEventListener("click",function(){$("#deckpanel").scrollIntoView({behavior:"smooth"})});
document.addEventListener("click",function(e){
  var kw=e.target.closest(".kw");
  if(kw){var tipEl=$("#kwtip"),k=KW[+kw.dataset.kw];if(tipEl&&k){tipEl.hidden=false;tipEl.innerHTML='<b>'+esc(kw.textContent)+'</b> '+esc(T(k[1][0],k[1][1]))}return}
  if(e.target.closest("#samplebtn")){sampleHand();return}
  var b=e.target.closest("[data-add],[data-remove],[data-view],[data-close]");if(!b||b.disabled)return;
  if(b.hasAttribute("data-close"))$("#view").close();
  if(b.dataset.add)add(b.dataset.add);
  else if(b.dataset.remove)remove(b.dataset.remove);
  else if(b.dataset.view)view(b.dataset.view);
});
$("#view").addEventListener("click",function(e){if(e.target===this)this.close()});
$("#copy").addEventListener("click",function(){
  var t=asText();if(!t){say(T("The deck is empty.","Bộ bài đang trống."));return}
  $("#io").value=t;$("#iobox").open=true;
  var fail=function(){$("#io").select();say(T("Select the text below and copy it.","Hãy chọn và sao chép đoạn chữ bên dưới."))};
  if(navigator.clipboard)navigator.clipboard.writeText(t).then(function(){say(T("Deck list copied.","Đã sao chép danh sách."))},fail);else fail();
});
$("#import").addEventListener("click",function(){importText($("#io").value)});
$("#share").addEventListener("click",function(){
  var code=shareCode();if(!code){say(T("The deck is empty.","Bộ bài đang trống."));return}
  var url=location.href.split("#")[0]+"#deck="+code;
  $("#io").value=url;$("#iobox").open=true;
  var fail=function(){$("#io").select();say(T("Select the link below and copy it.","Hãy chọn và sao chép liên kết bên dưới."))};
  if(navigator.clipboard)navigator.clipboard.writeText(url).then(function(){say(T("Share link copied. Anyone who opens it gets this deck.","Đã sao chép liên kết. Ai mở liên kết sẽ nhận được bộ bài này."))},fail);else fail();
});
$("#print").addEventListener("click",function(){if(!total()&&!deck.partner&&!deck.caze){say(T("The deck is empty.","Bộ bài đang trống."));return}printSheet()});
/* a link like deck.html#deck=D01001,D01016,D01002*3 opens a shared deck */
function openShared(){
  var m=/[#&]deck=([^&]*)/.exec(location.hash);if(!m)return;
  var text=fromShareCode(decodeURIComponent(m[1]));
  try{history.replaceState(null,"",location.pathname+location.search)}catch(e){}
  if((total()||deck.partner||deck.caze)&&!confirm(T("Open the shared deck? It replaces the deck you have now.","Mở bộ bài được chia sẻ? Bộ bài hiện tại sẽ bị thay thế.")))return;
  importText(text);
}
$("#clear").addEventListener("click",function(){
  if(!confirm(T("Remove every card from this deck?","Xóa toàn bộ lá trong bộ bài này?")))return;
  deck={partner:null,caze:null,list:{}};save();renderAll();say(T("Deck cleared.","Đã xóa bộ bài."));
});
document.addEventListener("conan-lang",function(e){LANG=e.detail&&e.detail.lang==="vi"?"vi":"en";say("");$("#view").close();setNames();fillBoxes();renderAll()});

if(window.CONAN_CARDS){use(window.CONAN_CARDS);openShared();window.addEventListener("hashchange",openShared)}else $("#count").textContent=T("The card list file (assets/cards-data.js) is missing.","Thiếu tệp danh sách lá bài (assets/cards-data.js).");
})();
