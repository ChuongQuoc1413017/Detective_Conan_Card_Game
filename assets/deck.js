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

function norm(s){return String(s||"").normalize("NFKC").toLowerCase().replace(/ou/g,"o").replace(/uu/g,"u")}
function prep(raw,names){
  var colors=String(raw.color||"").split("").filter(function(ch){return COLORS.some(function(c){return c[0]===ch})});
  var img=String(raw.image_url||"");
  var c={num:String(raw.card_num),id:String(raw.card_id||raw.card_num),jp:raw.title||"",box:raw.package_code||"",rarity:raw.rarity||"",colors:colors,type:raw.type||"",
    cost:raw.cost,ap:raw.ap,lp:raw.lp,traits:raw.category1||"",text:raw.feature||"",hira:raw.hirameki||"",cut:raw.cut_in||"",
    img:/^https:\/\//.test(img)?img:"",limit:+raw.rcp_limit||3};
  c.name=names[c.jp]||raw.title_romaji||c.jp;
  c.find=norm([c.num,c.name,c.jp,raw.title_romaji,c.traits,c.text,c.hira,c.cut].join(" "));
  return c;
}
function use(data){
  cards=data.cards.map(function(r){return prep(r,data.names||{})});
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
  fillSelect("#fbox",opt("",T("All boxes","Tất cả các hộp"))+boxes.map(function(p){return opt(p.package_code,p.package_code+" · "+String(p.package_name||"").replace(p.package_code,"").trim())}).join(""));
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

/* ---------- rendering ---------- */
function dots(c){return c.colors.map(function(ch){var k=COLORS.filter(function(x){return x[0]===ch})[0];return '<span class="dot dk-'+k[1]+'" title="'+esc(T(k[2],k[3]))+'"></span>'}).join("")}
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
  $("#deck").innerHTML=h;
  $("#jump").textContent=T("My deck","Bộ bài")+" "+n+"/"+DECK_SIZE+" ▼";
}
function renderAll(){renderResults();renderDeck()}

function view(num){
  var c=byNum[num];if(!c)return;
  var why=blocked(c),block=function(t,v){return v?'<p><b>'+t+'</b><br>'+esc(v).replace(/\n/g,"<br>")+'</p>':''};
  $("#viewbody").innerHTML=pic(c,"big2")+'<div><h3>'+dots(c)+esc(c.name)+'</h3><p lang="ja">'+esc(c.jp)+'</p><p>'+esc(c.num)+' · '+esc(c.rarity)+' · '+esc(c.box)+'<br>'+esc(stats(c))+'</p>'+
    (c.traits?'<p lang="ja">'+esc(c.traits)+'</p>':'')+
    '<div lang="ja">'+block("能力",c.text)+block("ヒラメキ",c.hira)+block("カットイン",c.cut)+'</div>'+
    '<small>'+T("Card text is shown in the original Japanese.","Nội dung lá bài hiển thị bằng tiếng Nhật gốc.")+'</small>'+
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
$("#clear").addEventListener("click",function(){
  if(!confirm(T("Remove every card from this deck?","Xóa toàn bộ lá trong bộ bài này?")))return;
  deck={partner:null,caze:null,list:{}};save();renderAll();say(T("Deck cleared.","Đã xóa bộ bài."));
});
document.addEventListener("conan-lang",function(e){LANG=e.detail&&e.detail.lang==="vi"?"vi":"en";say("");fillBoxes();renderAll()});

if(window.CONAN_CARDS)use(window.CONAN_CARDS);else $("#count").textContent=T("The card list file (assets/cards-data.js) is missing.","Thiếu tệp danh sách lá bài (assets/cards-data.js).");
})();
