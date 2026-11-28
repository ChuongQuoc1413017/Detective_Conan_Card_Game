/* Reads the Japanese card text and turns it into effects the practice game can run.
   Strict on purpose: an ability is used only when every part of it is understood.
   Anything else is reported in `missing` and does nothing in the game. */
(function(root){
"use strict";

function nfkc(s){return String(s||"").normalize("NFKC").replace(/レべル/g,"レベル").replace(/[−–]/g,"-")}
var NUM=function(x){return +x};

/* ---------- targets ---------- */
/* "相手の現場にいるレベル7以下のスリープ状態の【青】のキャラ" -> filter object, or null */
function filter(src){
  var s=String(src),f={side:"any",zone:"scene",kind:null};
  var alts=[];
  function eat(re,fn){var m=re.exec(s);if(!m)return false;s=s.slice(0,m.index)+s.slice(m.index+m[0].length);if(fn)fn(m);return true}
  eat(/^自分か相手の現場にいる/);
  eat(/^相手の現場にいる、?/,function(){f.side="opp"});
  eat(/^自分の現場にいる、?/,function(){f.side="own"});
  eat(/^自分のリムーブエリアにある、?/,function(){f.side="own";f.zone="rem"});
  eat(/^手札から/,function(){f.side="own";f.zone="hand"});
  var guard=0;
  while(s&&guard++<30){
    if(eat(/^このキャラ以外の/,function(){f.other=true}))continue;
    if(eat(/^このキャラのAP以下のAPの/,function(){f.apSelf=true}))continue;
    if(eat(/^自分のFILEエリアの枚数以下のレベルの/,function(){f.lvFile=true}))continue;
    if(eat(/^レベル(\d+)(以下|以上)?の?/,function(m){if(m[2]==="以下")f.lvMax=+m[1];else if(m[2]==="以上")f.lvMin=+m[1];else{f.lvMin=+m[1];f.lvMax=+m[1]}}))continue;
    if(eat(/^元?の?AP(\d+)(以下|以上)の?/,function(m){if(m[2]==="以下")f.apMax=+m[1];else f.apMin=+m[1]}))continue;
    if(eat(/^LP(\d+)(以下|以上)?の/,function(m){if(m[2]==="以下")f.lpMax=+m[1];else if(m[2]==="以上")f.lpMin=+m[1];else{f.lpMin=+m[1];f.lpMax=+m[1]}}))continue;
    if(eat(/^スリープ状態かスタン状態の/,function(){f.state=["sleep","stun"]}))continue;
    if(eat(/^アクティブ状態かスリープ状態の/,function(){f.state=["sleep","active"]}))continue;
    if(eat(/^スリープ状態の/,function(){f.state=["sleep"]}))continue;
    if(eat(/^スタン状態の/,function(){f.state=["stun"]}))continue;
    if(eat(/^アクティブ状態の/,function(){f.state=["active"]}))continue;
    if(eat(/^裏向きのカードがセットされていない/,function(){f.noFaceDown=true}))continue;
    if(eat(/^裏向きのカードがセットされている/,function(){f.hasFaceDown=true}))continue;
    if(eat(/^カードがセットされている/,function(){f.hasSet=true}))continue;
    if(eat(/^【(カットイン|現場リムーブ時|ヒラメキ|変装)】を持つ/,function(m){f.has={"カットイン":"cut","現場リムーブ時":"leave","ヒラメキ":"hira","変装":"disguise"}[m[1]]}))continue;
    if(eat(/^【([青緑白赤黄黒])】以外の色を持つ/,function(m){f.notOnly=m[1]}))continue;
    if(eat(/^〚カード名\[([^\]]+)\]〛以外の/,function(m){f.notName=m[1]}))continue;
    break;
  }
  if(eat(/(イベント)$/,function(){f.kind="e"}));
  else if(eat(/(キャラ)$/,function(){f.kind="c"}));
  else eat(/(カード)$/);
  s=s.replace(/の$/,"");
  if(s){
    var parts=s.split("か"),i,last=null,color=null;
    for(i=0;i<parts.length;i++){
      var p=parts[i].replace(/の$/,""),m,a=null;
      if((m=/^【([青緑白赤黄黒])】$/.exec(p)))a={color:m[1]};
      else if((m=/^〚特徴\[([^\]]+)\]〛$/.exec(p))){a={trait:m[1]};last="trait"}
      else if((m=/^〚カード名\[([^\]]+)\]〛$/.exec(p))){a={name:m[1]};last="name"}
      else if((m=/^【([青緑白赤黄黒])】の〚特徴\[([^\]]+)\]〛$/.exec(p))){a={color:m[1],trait:m[2]};last="trait"}
      else if(last&&(m=/^〚\[([^\]]+)\]〛$/.exec(p))){a={};a[last]=m[1]}
      else if((m=/^特徴\[([^\]]+)\]$/.exec(p))){a={trait:m[1]};last="trait"}
      else if((m=/^カード名\[([^\]]+)\]$/.exec(p))){a={name:m[1]};last="name"}
      else if(last&&(m=/^\[([^\]]+)\]$/.exec(p))){a={};a[last]=m[1]}
      else if((m=/^〚ミスリード〛を持つ$/.exec(p))){a={kw:"md"}}
      if(!a)return null;
      alts.push(a);
    }
    f.alts=alts;
  }
  /* a bare name means a character of that name */
  if(!f.kind&&alts.length&&alts.every(function(x){return x.name}))f.kind="c";
  if(alts.length===1&&alts[0].kw){f.hasKw=alts[0].kw;delete f.alts;f.kind="c"}
  if(f.zone==="scene"){if(!f.kind&&!alts.length&&!f.has)return null;f.kind="c"}
  return f;
}
function handFilter(x){return x==="カード"?{side:"own",zone:"hand"}:filter("手札から"+x.replace(/のカード$/,""))}

/* ---------- keywords ---------- */
function keyword(t){
  var m;
  if(t==="迅速")return {k:"swift"};
  if(t==="突撃")return {k:"assault"};
  if(t==="突撃[キャラ]")return {k:"assaultChar"};
  if(t==="突撃[事件]")return {k:"assaultCase"};
  if(t==="ブレット")return {k:"bullet"};
  if((m=/^ミスリード(\d)$/.exec(t)))return {k:"md",v:+m[1]};
  if(/^捜査\d$/.test(t))return null;
  return null;
}
var KW="(〚(?:迅速|突撃|突撃\\[キャラ\\]|突撃\\[事件\\]|ブレット|ミスリード\\d)〛)";
function kwVerb(x){var k=keyword(x.slice(1,-1));return {v:"kw",kw:k.k,n:k.v}}

/* quoted abilities are set aside so their full stops do not split the sentence */
var QUOTES=[];
function stash(text){
  return text.replace(/「(?!Q)([^「」]*)」/g,function(m,x){QUOTES.push(x);return "「Q"+(QUOTES.length-1)+"」"});
}
function grant(ref){
  var inner=QUOTES[+ref];
  if(inner===undefined)return null;
  var simple={"このキャラは相手の現場にいるアクティブ状態のキャラを指定してアクションできる。":"hitActive","このキャラは推理できない。":"noDeduce",
    "このキャラはスリープ状態でもガードできる。":"sleepGuard","このキャラはガードできる場合、必ずガードする。":"mustGuard",
    "このキャラはオートフェイズにアクティブにならない。":"noWake","このキャラはコンタクトによってリムーブされない。":"noContactKO"};
  if(simple[inner])return {v:"kw",kw:simple[inner]};
  var ab=line(inner,false);
  return ab?{v:"grant",ab:ab}:null;
}

/* ---------- "…を1枚まで選び、<what>" ---------- */
function verbs(text){
  var out=[],m,i;
  if((m=/^(アクティブにする|スリープさせる)か、(ターン終了時まで.+)$/.exec(text))||(m=/^(.+?を与える)か、(ターン終了時まで.+)$/.exec(text))){
    var a=verbs(m[1]),b=verbs(m[2]);return a&&b?[{v:"choose",a:a,b:b}]:null;
  }
  var one={"リムーブする":"remove","リムーブし":"remove","スリープさせる":"sleep","スリープさせ":"sleep","スタンさせる":"stun","スタンさせ":"stun",
    "アクティブにする":"activate","アクティブにし":"activate","デッキの下に移す":"bottom","手札に移す":"bounce","手札に移し":"bounce","手札に加える":"toHand",
    "登場させる":"enter","デッキの上に移す":"top","パートナーエリアに移す":"toPA","裏向きでこのキャラにセットする":"toSet","このキャラの下に重ねる":"toSet"};
  if(one[text])return [{v:one[text]}];
  if(text==="スリープ状態で登場させる")return [{v:"enter",sleep:true}];
  if(/^(自分の|相手の|持ち主の)デッキのカードを上から1枚裏向きで(選んだキャラに)?セットする$/.test(text))return [{v:"setTop"}];
  if(text==="デッキの上か下に移す")return [{v:"topOrBottom"}];
  if((m=new RegExp("^ターン終了時まで"+KW+"か"+KW+"を与える$").exec(text)))return [{v:"choose",a:[kwVerb(m[1])],b:[kwVerb(m[2])]}];
  /* "A、B" chains: verb followed by more verbs */
  if((m=/^(リムーブし|スリープさせ|スタンさせ|アクティブにし)、(.+)$/.exec(text))){var h=verbs(m[1]),t2=verbs(m[2]);return h&&t2?h.concat(t2):null}
  if((m=/^(自分の|相手の)デッキのカードを上から1枚裏向きでセットし、(.+)$/.exec(text))){var r=verbs(m[2]);return r?[{v:"setTop"}].concat(r):null}
  var t=text;
  if((m=/^ターン終了時まで(.+)$/.exec(t)))t=m[1];
  else if((m=/^アクション終了時まで(.+)$/.exec(t)))t=m[1];
  else if((m=/^このコンタクト中、(.+)$/.exec(t)))t=m[1];
  else return null;
  var parts=t.split(/し、(?![^「]*」)/);
  for(i=0;i<parts.length;i++){
    var p=parts[i].replace(/^ターン終了時まで/,"");
    if((m=/^(AP|LP|レベル)([+-])(\d+)(する|)$/.exec(p)))out.push({v:{AP:"ap",LP:"lp","レベル":"lv"}[m[1]],n:(m[2]==="-"?-1:1)*+m[3]});
    else if((m=new RegExp("^"+KW+"(?:と"+KW+")?を(与え|持)(る|つ|)$").exec(p))){out.push(kwVerb(m[1]));if(m[2])out.push(kwVerb(m[2]))}
    else if((m=new RegExp("^"+KW+"と「Q(\\d+)」を(?:与える|持つ)$").exec(p))){var g0=grant(m[2]);if(!g0)return null;out.push(kwVerb(m[1]),g0)}
    else if((m=/^「Q(\d+)」(?:と「Q(\d+)」)?を(与える|与え|持つ)$/.exec(p))){
      var g1=grant(m[1]),g2=m[2]!==undefined?grant(m[2]):0;
      if(!g1||g2===null)return null;out.push(g1);if(g2)out.push(g2);
    }
    else if(/^元の能力を無効にする$/.test(p))return null;
    else return null;
  }
  return out;
}

/* ---------- conditions ("…場合") ---------- */
function condition(c){
  var m,f,g;
  c=c.replace(/の$/,"");
  if((m=/^(.+?)で、(.+)$/.exec(c))){f=condition(m[1]);g=condition(m[2]);if(f&&g)return {c:"all",list:[f,g]}}
  if(c==="自分の証拠の数が相手の証拠の数以下")return {c:"evLE"};
  if((m=/^お互いの現場にキャラが合わせて(\d+)枚以上いる$/.exec(c)))return {c:"bothScene",n:+m[1]};
  if((m=/^(.+?)を登場させた$/.exec(c))&&(f=filter("自分の現場にいる"+m[1])))return {c:"entered",f:f};
  if(c==="コンタクトによってリムーブされた")return {c:"byContact"};
  if(c==="能力や効果によって登場した"||c==="自分の能力や効果によって登場した"||c==="自分のキャラの能力によって登場した")return {c:"byEffect",lv:0};
  if((m=/^レベル(\d+)以上のキャラの能力やレベル\d+以上のイベントの効果によって登場した$/.exec(c)))return {c:"byEffect",lv:+m[1]};
  if((m=/^自分の現場に(.+?)が(\d+)枚以上いる$/.exec(c))&&(f=filter("自分の現場にいる"+m[1])))return {c:"count",f:f,min:+m[2]};
  if((m=/^自分の現場にそれぞれカード名の異なる(.+?)が(\d+)枚以上いる$/.exec(c))&&(f=filter("自分の現場にいる"+m[1])))return {c:"count",f:f,min:+m[2],distinct:true};
  if((m=/^自分の現場に(.+?)がい(る|ない)$/.exec(c))&&(f=filter("自分の現場にいる"+m[1])))return m[2]==="る"?{c:"count",f:f,min:1}:{c:"not",x:{c:"count",f:f,min:1}};
  if((m=/^自分の現場に(.+?)か(このキャラ以外の.+?)がいる$/.exec(c))){f=filter("自分の現場にいる"+m[1]);g=filter("自分の現場にいる"+m[2]);if(f&&g)return {c:"any",list:[{c:"count",f:f,min:1},{c:"count",f:g,min:1}]}}
  if((m=/^相手の現場にキャラが(\d+)枚以上いる$/.exec(c)))return {c:"count",f:{side:"opp",zone:"scene",kind:"c"},min:+m[1]};
  if((m=/^相手の現場にスリープ状態かスタン状態のキャラが合わせて(\d+)枚以上いる$/.exec(c)))return {c:"count",f:{side:"opp",zone:"scene",kind:"c",state:["sleep","stun"]},min:+m[1]};
  if((m=/^自分の現場にスリープ状態かスタン状態のキャラが合わせて(\d+)枚以上いる$/.exec(c)))return {c:"count",f:{side:"own",zone:"scene",kind:"c",state:["sleep","stun"]},min:+m[1]};
  if((m=/^自分の手札が(\d+)枚(以下|以上)(ある)?$/.exec(c)))return {c:"hand",op:m[2],n:+m[1]};
  if((m=/^自分のFILEエリアにあるカードが(\d+)枚(以下|以上)$/.exec(c)))return {c:"file",op:m[2],n:+m[1]};
  if((m=/^自分のFILEエリアにカードが(\d+)枚以上ある$/.exec(c)))return {c:"file",op:"以上",n:+m[1]};
  if(c==="自分の事件が解決編")return {c:"solution"};
  if(c==="お互いの証拠が合わせて5つ以上ある")return {c:"evBoth",n:5};
  if((m=/^自分のリムーブエリアに(.+?)が(合わせて)?(\d+)枚以上ある$/.exec(c))&&(f=filter("自分のリムーブエリアにある"+m[1])))return {c:"remCount",f:f,min:+m[3]};
  if((m=/^自分のリムーブエリアに(.+?)がある$/.exec(c))&&(f=filter("自分のリムーブエリアにある"+m[1])))return {c:"remCount",f:f,min:1};
  if((m=/^自分のパートナーエリアに(.+?)が(\d+)枚以上ある$/.exec(c))&&(f=handFilter(m[1])))return {c:"paCount",f:f,min:+m[2]};
  if((m=/^自分のパートナーエリアに(.+?)がある$/.exec(c))&&(f=handFilter(m[1])))return {c:"paCount",f:f,min:1};
  if(c==="このキャラがスリープ状態")return {c:"selfState",s:["sleep"]};
  if((m=/^自分のリムーブエリアにカードが(\d+)枚以上ある$/.exec(c)))return {c:"remCount",f:{side:"own",zone:"rem"},min:+m[1]};
  if(c==="このキャラがアクティブ状態")return {c:"selfState",s:["active"]};
  if(c==="このキャラがスリープ状態かスタン状態")return {c:"selfState",s:["sleep","stun"]};
  if((m=/^このキャラがAP(\d+)以上$/.exec(c)))return {c:"selfAp",n:+m[1]};
  if(c==="このキャラにカードがセットされている")return {c:"selfSet"};
  if((m=/^自分の証拠が(\d+)つ(以下|以上)(ある)?$/.exec(c)))return {c:"ev",op:m[2],n:+m[1]};
  if((m=/^相手の証拠が(\d+)つ以上ある$/.exec(c)))return {c:"oppEv",n:+m[1]};
  if(c==="相手の手札が自分の手札の枚数以上ある")return {c:"oppHandMore"};
  if((m=/^相手の手札が(\d+)枚以上ある$/.exec(c)))return {c:"oppHand",n:+m[1]};
  if(c==="自分の現場にこのキャラ以外のキャラがいない")return {c:"alone"};
  if((m=/^〚痕跡\[(発見済み|未発見)\]〛$/.exec(c)))return {c:"trace",found:m[1]==="発見済み"};
  if((m=/^レベル(\d+)(以上|以下)のカードが発見された$/.exec(c)))return {c:"found",op:m[2],n:+m[1]};
  if((m=/^自分の事件が【([青緑白赤黄黒])】以外の色を持(つ|たない)$/.exec(c)))return {c:"caseOther",color:m[1],has:m[2]==="つ"};
  return null;
}

/* ---------- one effect sentence ---------- */
function effect(s){
  var m,f,v,op,V;
  s=s.replace(/^自分は(?=手札|カード|証拠)/,"");
  if((m=/^そうした場合、(.+)$/.exec(s))){op=effect(m[1]);if(!op||op.ifDid)return null;op.ifDid=true;return op}
  if((m=/^(.+?)場合、(.+)$/.exec(s))){
    var c=condition(m[1]);op=c&&effect(m[2]);
    if(!op||op.cond)return null;op.cond=c;return op;
  }

  /* cards and hands */
  if((m=/^カードを(\d+)枚引き、手札を(\d+)枚リムーブする$/.exec(s)))return {op:"seq",list:[{op:"draw",n:+m[1]},{op:"discard",n:+m[2]}]};
  if((m=/^カードを(\d+)枚引(く|いてもよい)$/.exec(s)))return {op:"draw",n:+m[1]};
  if((m=/^手札を(\d+)枚リムーブ(する|してもよい)$/.exec(s)))return {op:"discard",n:+m[1],opt:m[2]==="してもよい"};
  if((m=/^手札から(.+?)を(\d+)枚リムーブ(する|してもよい)$/.exec(s))&&(f=handFilter(m[1])))return {op:"discardF",f:f,n:+m[2],opt:m[3]!=="する"};
  if((m=/^手札から(.+?)を(\d+)枚公開してもよい$/.exec(s))&&(f=handFilter(m[1])))return {op:"showF",f:f,n:+m[2]};
  if((m=/^相手は手札を(\d+)枚(ランダムに)?リムーブする$/.exec(s)))return {op:"discard",n:+m[1],opp:true,random:!!m[2]};
  if((m=/^相手はカードを(\d+)枚引く$/.exec(s)))return {op:"draw",n:+m[1],opp:true};
  if(s==="相手は手札を公開する")return {op:"reveal"};
  if((m=/^手札から(.+?)を1枚まで(スリープ状態で)?登場させ(る|てもよい)$/.exec(s))){
    f=handFilter(m[1]);if(!f||f.kind==="e")return null;f.kind="c";return {op:"fromHand",f:f,sleep:!!m[2]};
  }
  if((m=/^手札から(.+?)を1枚まで使用する$/.exec(s))&&(f=handFilter(m[1]))&&f.kind==="e")return {op:"useEvent",f:f};

  /* evidence */
  if((m=/^(?:自分は)?証拠を(\d+)つ(得る|得てもよい)$/.exec(s)))return {op:"gain",n:+m[1],opt:m[2]==="得てもよい"};
  if((m=/^相手に証拠を(\d+)つ与え(る|てもよい)$/.exec(s)))return {op:"gain",n:+m[1],opp:true,opt:m[2]!=="る"};
  if((m=/^手札からカードを(\d+)枚裏向きで証拠として得る$/.exec(s)))return {op:"handToEv",n:+m[1]};
  if((m=/^(自分の|相手の)?(裏向き|表向き)の証拠を(\d+)つ(まで)?(選び、)?(表向き|裏向き)に(する|してもよい)$/.exec(s)))
    return {op:"flip",who:m[1]==="相手の"?"opp":m[1]?"own":"any",to:m[6]==="表向き"?"up":"down",n:+m[3],opt:m[7]!=="する"||!!m[4]};
  if((m=/^相手の証拠を(\d+)つまで選び、デッキの下に移す$/.exec(s)))return {op:"evBottom",n:+m[1]};
  if(s==="このキャラを表向きのまま証拠として得る"||s==="このカードを表向きのまま証拠として得る")return {op:"selfToEvidence"};
  if(s==="相手はこのアクションによって証拠を得られない")return {op:"flag",f:"noEvidence"};
  if(/^このターン中、自分はネクストヒントできない$/.test(s))return {op:"flag",f:"noHint"};
  if(/^(このターン中、|アクション終了時まで)?相手は【カットイン】を(使用|発動)できない$/.test(s))return {op:"flag",f:"noCut"};
  if(/^このターン中、相手は【カットイン】と【変装】を使用できない$/.test(s))return {op:"flag",f:"noCutDis"};
  if(s==="自分のリムーブエリアにあるすべてのカードをデッキの下に移し、デッキをシャッフルする")return {op:"remToDeck"};

  /* deck and FILE */
  if((m=/^自分のデッキのカードを上から(\d+)枚(まで)?リムーブ(する|してもよい)$/.exec(s)))return {op:"mill",n:+m[1],opt:m[3]!=="する"};
  if((m=/^相手のデッキのカードを上から(\d+)枚リムーブ(する|してもよい)$/.exec(s)))return {op:"mill",n:+m[1],opp:true,opt:m[2]!=="する"};
  if((m=/^自分のFILEエリアにあるカードを上から(\d+)枚手札に加え(る|てもよい)$/.exec(s)))return {op:"fileToHand",n:+m[1],opt:m[2]!=="る"};
  if((m=/^自分のFILEエリアにあるカードを上から(\d+)枚リムーブする$/.exec(s)))return {op:"fileRemove",n:+m[1]};
  if((m=/^自分のデッキのカードを下から(\d+)枚手札に加える$/.exec(s)))return {op:"bottomToHand",n:+m[1]};
  if((m=/^自分のデッキのカードを上から(.+?)が出るまで1枚ずつ公開し、それを(手札に加える|登場させる)$/.exec(s))){
    f=filter("手札から"+m[1].replace(/のカード$/,""));return f?{op:"dig",f:f,enter:m[2]==="登場させる"}:null;
  }
  if(/^(残りの公開したカードを|公開したカードを)(デッキの下に移し、デッキをシャッフルする|シャッフルしてデッキの下に移す)$/.test(s))return {op:"nothing"};
  if(s==="デッキをシャッフルする")return {op:"nothing"};
  if((m=/^〚捜査(\d)〛(?:する)?$/.exec(s))||(m=/^捜査(\d)する$/.exec(s)))return {op:"investigate",n:+m[1]};
  if((m=/^自分のデッキのカードを上から(\d+)枚見る$/.exec(s)))return {op:"look",n:+m[1]};
  if((m=/^その中から(.+?)を(\d+)枚(まで)?(?:公開して)?手札に加え、残りを(好きな順番でデッキの下に移す|シャッフルしてデッキの下に移す|リムーブエリアに移す)$/.exec(s))){
    f=handFilter(m[1]);return f?{op:"take",f:f,count:+m[2],rest:/リムーブ/.test(m[4])?"rem":"bottom"}:null;
  }
  if((m=/^その中から(.+?)を(\d+)枚まで(スリープ状態で)?登場させ、残りを(好きな順番でデッキの下に移す|シャッフルしてデッキの下に移す|リムーブエリアに移す)$/.exec(s))){
    f=handFilter(m[1]);return f?{op:"take",f:f,count:+m[2],enter:true,sleep:!!m[3],rest:/リムーブ/.test(m[4])?"rem":"bottom"}:null;
  }

  /* cards set on characters, and the Partner area */
  if((m=/^自分のデッキのカードを上から(\d+)枚裏向きで(このキャラ|そのキャラ)にセットする$/.exec(s)))return {op:"setTop",n:+m[1],on:m[2]==="このキャラ"?"self":"that"};
  if((m=/^このイベントを(.+?)(\d+)枚にセットする$/.exec(s))&&(f=filter(m[1])))return {op:"attach",f:f};
  if(s==="このイベントをそのキャラにセットする")return {op:"attach",that:true};
  if((m=/^(自分か相手の|相手の|自分の)?現場にいるキャラに(裏向きで)?セットされているカードを(合わせて)?(\d+)枚(まで)?(?:選び、)?リムーブ(する|してもよい)$/.exec(s)))
    return {op:"unset",who:m[1]==="相手の"?"opp":m[1]==="自分の"?"own":"any",down:!!m[2],n:+m[4],opt:m[6]!=="する"||!!m[5]};
  if(s==="このカードをパートナーエリアに移す"||s==="このイベントをパートナーエリアに移す")return {op:"selfToPA"};
  if((m=/^自分のパートナーエリアにある(.+?)を(\d+)枚リムーブしてもよい$/.exec(s))&&(f=handFilter(m[1])))return {op:"paRemove",f:f,n:+m[2]};

  /* everything at once */
  if((m=/^(自分の現場にいる|相手の現場にいる|自分と相手の現場にいる)?(.*?)すべてのキャラを(.+)$/.exec(s))){
    var pre=m[1]==="自分の現場にいる"?"自分の現場にいる":m[1]==="相手の現場にいる"?"相手の現場にいる":"";
    f=filter(pre+(m[2]?m[2].replace(/の$/,"")+"の":"")+"キャラ");v=f&&verbs(m[3]);
    return v?{op:"all",f:f,list:v}:null;
  }
  /* optional costs paid with your own character */
  if((m=/^(自分の現場にいる.*?)を1枚(スリープさせ|デッキの下に移し|リムーブし)てもよい$/.exec(s))&&(f=filter(m[1]))){
    return {op:"target",f:f,n:1,own:true,list:[{v:{"スリープさせ":"sleep","デッキの下に移し":"bottom","リムーブし":"remove"}[m[2]]}]};
  }
  if((m=/^相手の証拠を上から(\d+)つ表向きにする$/.exec(s)))return {op:"flip",who:"opp",to:"up",n:+m[1]};
  if((m=/^自分の証拠を上から(\d+)つ(手札に加えてもよい|手札に加える|リムーブする)$/.exec(s)))return {op:"evTake",n:+m[1],rem:m[2]==="リムーブする",opt:/もよい/.test(m[2])};
  if((m=/^自分の証拠を(\d+)つ選び、手札に加え(る|てもよい)$/.exec(s)))return {op:"evTake",n:+m[1],opt:m[2]!=="る"};
  if((m=/^相手はデッキのカードを上から(\d+)枚公開する$/.exec(s)))return {op:"oppReveal",n:+m[1]};
  if(s==="そのカードをデッキの上か下に移す")return {op:"oppTopBottom"};
  if((m=/^ターン終了時までこのキャラを(LP|AP)([+-]\d+)するか、(LP|AP)([+-]\d+)する$/.exec(s)))
    return {op:"self",list:[{v:"choose",a:[{v:m[1].toLowerCase(),n:+m[2]}],b:[{v:m[3].toLowerCase(),n:+m[4]}]}]};
  if((m=new RegExp("^ターン終了時までこのキャラは"+KW+"を持つか、ターン終了時までこのキャラは"+KW+"を持つ$").exec(s)))
    return {op:"self",list:[{v:"choose",a:[kwVerb(m[1])],b:[kwVerb(m[2])]}]};

  /* this card */
  if(s==="このキャラをアクティブにする")return {op:"self",list:[{v:"activate"}]};
  if(s==="このキャラをスリープさせる"||s==="このキャラをスリープさせてもよい")return {op:"self",list:[{v:"sleep"}],opt:/もよい$/.test(s)};
  if(s==="このキャラをスタンさせる"||s==="このキャラをスタンさせてもよい")return {op:"self",list:[{v:"stun"}],opt:/もよい$/.test(s)};
  if(s==="このキャラをリムーブする"||s==="このキャラをリムーブしてもよい")return {op:"self",list:[{v:"remove"}],opt:/もよい$/.test(s)};
  if(/^このキャラを現場からリムーブ(する|してもよい)$/.test(s))return {op:"self",list:[{v:"remove"}],opt:/もよい$/.test(s)};
  if(/^このキャラを現場からデッキの下に移(す|してもよい)$/.test(s))return {op:"self",list:[{v:"bottom"}],opt:/もよい$/.test(s)};
  if(s==="このキャラを現場から手札に移す"||s==="このキャラを手札に移す")return {op:"self",list:[{v:"bounce"}]};
  if(s==="このキャラを登場させる")return {op:"enterSelf"};
  if(s==="このキャラを手札に加える"||s==="このカードを手札に加える")return {op:"takeSelf"};
  if((m=/^このキャラをスリープさせ、手札を(\d+)枚リムーブしてもよい$/.exec(s)))return {op:"seq",opt:true,needSelfActive:true,list:[{op:"self",list:[{v:"sleep"}]},{op:"discard",n:+m[1]}]};
  if((m=/^(?:アクション終了時まで|そのコンタクト中、|このコンタクト中、)このキャラをAP([+-]\d+)する$/.exec(s)))return {op:"self",list:[{v:"battle",n:+m[1]}]};
  if((m=/^このキャラはこのコンタクトによってリムーブされない$/.exec(s)))return {op:"self",list:[{v:"kw",kw:"noContactKO"}]};
  if((m=/^ターン終了時までこのキャラをAP([+-]\d+)し、(.+)$/.exec(s))){
    var a=effect("ターン終了時までこのキャラ"+(/^[〚「]/.test(m[2])?"は":"を")+m[2]);
    return a&&a.op==="self"?{op:"self",list:[{v:"ap",n:+m[1]}].concat(a.list)}:null;
  }
  if((m=/^ターン終了時までこのキャラを(AP|LP|レベル)([+-]\d+)する$/.exec(s)))return {op:"self",list:[{v:{AP:"ap",LP:"lp","レベル":"lv"}[m[1]],n:+m[2]}]};
  if((m=/^(ターン終了時まで)このキャラは(.+を持つ)$/.exec(s))){v=verbs(m[1]+m[2]);return v?{op:"self",list:v}:null}
  /* "that character" is the one just chosen or entered */
  if((m=/^(ターン終了時まで|アクション終了時まで)そのキャラ(に|を)(.+)$/.exec(s))){v=verbs(m[1]+m[3]);return v?{op:"that",list:v}:null}
  if(s==="そのキャラをアクティブにする")return {op:"that",list:[{v:"activate"}]};
  if(s==="そのキャラをリムーブする")return {op:"that",list:[{v:"remove"}]};

  /* contact and the attacker */
  if((m=/^コンタクト中のキャラを1枚まで選び、このコンタクト中、AP([+-]\d+)する$/.exec(s)))return {op:"battle",n:+m[1]};
  if((m=/^アクション中のキャラを1枚まで選び、(.+)$/.exec(s))){v=verbs(m[1]);return v?{op:"attacker",list:v}:null}
  if(/^相手の現場にいるキャラを1枚まで選び、このキャラとのコンタクトを発生させる$/.test(s))return {op:"startContact",f:{side:"opp",zone:"scene",kind:"c"}};

  /* choose characters, or cards in the Remove area */
  if((m=/^(自分の現場にいる.*?)を好きな数選び、(.+)$/.exec(s))){f=filter(m[1]);v=f&&verbs(m[2]);return v?{op:"target",f:f,n:9,list:v}:null}
  if((m=/^(.+?)を(\d+)(?:枚|つ)(まで)?選び、(.+)$/.exec(s))){
    f=filter(m[1]);
    if(!f)return null;
    var n=+m[2],rest=m[4];
    v=verbs(rest);
    if(v){
      var first=v[0].v;
      if(f.zone==="rem"){if(["toHand","enter","bottom","toPA","toSet","top"].indexOf(first)<0)return null}
      else if(["toHand","enter","toPA"].indexOf(first)>-1)return null;
      return {op:"target",f:f,n:n,list:v};
    }
    /* "…、リムーブし、<another effect>" */
    var mm=/^(リムーブし|スリープさせ|スタンさせ|アクティブにし|手札に移し)、(.+)$/.exec(rest);
    if(mm&&f.zone==="scene"){var nx=effect(mm[2]);V=verbs(mm[1]);if(nx&&V&&!nx.ifDid)return {op:"seq",list:[{op:"target",f:f,n:n,list:V},nx]}}
    return null;
  }
  return null;
}

/* ---------- a run of sentences ---------- */
function revealTop(text){
  var m=/^([\s\S]*?)自分のデッキのカードを上から1枚公開する。公開したカードが(.+?)の場合、(手札に加える|手札に加えてもよい|登場させる)。(?:公開したカードがそれ以外の場合、(デッキの下に移す|手札に加える)。?)?$/.exec(text);
  if(!m)return null;
  var f=handFilter(m[2]),before=m[1].trim()?steps(m[1].trim()):[];
  return f&&before?before.concat([{op:"revealTop",f:f,enter:m[3]==="登場させる",elseHand:m[4]==="手札に加える"}]):null;
}
var JOIN={"し":"する","き":"く","え":"える","せ":"せる"};
function steps(text){
  var rv=revealTop(text);if(rv)return rv;
  var pick=/^([\s\S]*?)以下から1つ選んで行う。\s*\n([・•][\s\S]+)$/.exec(text);
  if(pick){
    var before=pick[1].trim()?steps(pick[1].trim()):[];
    var options=pick[2].split("\n").map(function(b){return steps(b.replace(/^[・•]/,""))});
    if(!before||options.indexOf(null)>-1)return null;
    return before.concat([{op:"oneOf",list:options,text:pick[2].split("\n")}]);
  }
  if(/\n/.test(text))return null;
  var out=[],parts=text.split(/。/).map(function(x){return x.trim()}).filter(Boolean),i,j;
  for(i=0;i<parts.length;i++){
    var s=parts[i],op=effect(s);
    if(!op){
      /* "Aし、B": two effects joined in one sentence */
      var re=/(し|き|え|せ)、/g,hit,done=false;
      while(!done&&(hit=re.exec(s))){
        var left=effect(s.slice(0,hit.index)+JOIN[hit[1]]),right=effect(s.slice(hit.index+2));
        if(left&&right&&left.op!=="target"&&left.op!=="look"&&!left.ifDid&&!left.cond){out.push(left,right);done=true}
        else if(left&&right&&left.ifDid&&left.op!=="target"){right.ifDid=true;out.push(left,right);done=true}
      }
      if(!done)return null;
      continue;
    }
    out.push(op);
  }
  /* "look at N" must be followed by what to take */
  for(j=0;j<out.length;j++){
    if(out[j].op==="look"){
      var t=out[j+1];
      if(!t||t.op!=="take")return null;
      out.splice(j,2,{op:"search",n:out[j].n,f:t.f,rest:t.rest,count:t.count,enter:t.enter,sleep:t.sleep,cond:out[j].cond,ifDid:out[j].ifDid});
    }else if(out[j].op==="take")return null;
  }
  return out.length?out:null;
}
function prepare(text){
  return text.replace(/\((?:[^()]|\([^()]*\))*\)/g,"")
    .replace(/この能力はパートナーエリアでも(宣言できる|発動する|有効になる)。?/g,"")
    .replace(/カードを手札に加えた場合、/g,"そうした場合、")
    .replace(/(^|。)カードを手札に加え、/g,"$1そうした場合、")
    .replace(/。残りの公開したカードをデッキの下に移し、デッキをシャッフルする/g,"")
    .trim();
}

/* ---------- costs (left of the colon) ---------- */
function costs(head){
  var out=[],t=head,m,f;
  while(t){
    if((m=/^【スリープ】/.exec(t))){out.push({c:"sleep"});t=t.slice(m[0].length);continue}
    if(t.charAt(0)==="、"){t=t.slice(1);continue}
    if(t.charAt(0)!=="〚")return null;
    /* find the matching bracket: costs may contain card names in brackets */
    var depth=0,i,end=-1;
    for(i=0;i<t.length;i++){if(t[i]==="〚")depth++;else if(t[i]==="〛"&&!--depth){end=i;break}}
    if(end<0)return null;
    var x=t.slice(1,end);t=t.slice(end+1);
    if((m=/^手札を(\d+)枚リムーブする$/.exec(x)))out.push({c:"discard",n:+m[1]});
    else if(x==="デッキの下に移す")out.push({c:"bottomSelf"});
    else if(x==="リムーブエリアに移す")out.push({c:"removeSelf"});
    else if((m=/^デッキのカードを上から(\d+)枚リムーブする$/.exec(x)))out.push({c:"mill",n:+m[1]});
    else if((m=/^FILEエリアにあるカードを上から(\d+)枚リムーブする$/.exec(x)))out.push({c:"fileRemove",n:+m[1]});
    else if((m=/^裏向きの証拠を(\d+)つ(以上)?表向きにする$/.exec(x)))out.push({c:"flip",n:+m[1]});
    else if(/^このキャラに(裏向きで)?セットされているカードを1枚リムーブする$/.test(x))out.push({c:"unsetSelf"});
    else if(/^現場にいるキャラに(裏向きで)?セットされているカードを1枚リムーブする$/.test(x))out.push({c:"unsetAny",n:1});
    else if((m=/^手札から(.+?)を(\d+)枚リムーブする$/.exec(x))&&(f=handFilter(m[1])))out.push({c:"discardF",f:f,n:+m[2]});
    else if((m=/^手札から(.+?)を(\d+)枚公開する$/.exec(x))&&(f=handFilter(m[1])))out.push({c:"showF",f:f,n:+m[2]});
    else if((m=/^(?:現場にいる)?(.+?)を1枚スリープさせる$/.exec(x))&&(f=x==="このキャラ以外のキャラを1枚スリープさせる"?{side:"own",zone:"scene",kind:"c",other:true}:filter("自分の現場にいる"+m[1])))out.push({c:"sleepOther",f:f});
    else if((m=/^パートナーエリアにある(.+?)を(\d+)枚リムーブする$/.exec(x))&&(f=handFilter(m[1])))out.push({c:"paRemove",f:f,n:+m[2]});
    else return null;
  }
  return out;
}

/* ---------- conditions written as tags ---------- */
function tagInfo(tag,ab){
  var m;
  if(tag==="解決編")ab.conds.push({c:"solution"});
  else if(tag==="事件編")ab.conds.push({c:"casePhase"});
  else if(tag==="自分ターン中")ab.turn="own";
  else if(tag==="相手ターン中")ab.turn="opp";
  else if((m=/^ターン(\d)$/.exec(tag)))ab.once=+m[1];
  else if((m=/^FILE(\d)$/.exec(tag)))ab.conds.push({c:"file",op:"以上",n:+m[1]});
  else if((m=/^パートナー([青緑白赤黄黒])(?:or([青緑白赤黄黒]))?$/.exec(tag)))ab.conds.push({c:"partner",colors:m[1]+(m[2]||"")});
  else if((m=/^絆(.+)$/.exec(tag)))ab.conds.push({c:"count",f:{side:"own",zone:"scene",kind:"c",alts:[{name:m[1]}]},min:1});
  else if((m=/^事件([青緑白赤黄黒](?:&[青緑白赤黄黒])*)$/.exec(tag)))ab.conds.push({c:"caseColor",colors:m[1].replace(/&/g,"")});
  else if((m=/^事件(.+)$/.exec(tag)))ab.conds.push({c:"caseTrait",t:m[1]});
  else if((m=/^(\d)枚以上$/.exec(tag)))ab.conds.push({c:"under",n:+m[1]});
  else return false;
  return true;
}

var WHEN=[
  [/^このキャラがアクションしたとき、/,"action"],
  [/^このキャラが推理かアクションしたとき、/,"actded"],
  [/^このキャラが推理したとき、/,"deduce"],
  [/^このキャラがコンタクトしたとき、/,"contact"],
  [/^自分のターン終了時、/,"end"],
  [/^相手のターン終了時、/,"oppEnd"],
  [/^自分のターンのメインフェイズ開始時、/,"main"],
  [/^このキャラがアクション\[事件\]したとき、/,"actionCase"],
  [/^このキャラがアクション\[キャラ\]したとき、/,"actionChar"],
  [/^このキャラがガードしたとき、/,"guard"],
  [/^このキャラのアクション\[事件\]によって証拠を得たとき、/,"caseGain"],
  [/^相手の現場にいるキャラがこのキャラとのコンタクトによってリムーブされたとき、/,"ko"],
  [/^このキャラのアクション終了時、/,"actEnd"],
  [/^相手の現場にいるキャラがこのキャラを指定してアクションしたとき、/,"targeted"],
  [/^相手の現場にいるキャラがアクションしたとき、/,"oppAction"],
  [/^相手の現場にいるキャラが推理かアクションしたとき、/,"oppActded"],
  [/^相手の現場にいるキャラが推理したとき、/,"oppDeduce"],
  [/^相手の現場にいるキャラがコンタクトによってリムーブされたとき、/,"oppKO"],
  [/^相手の現場にいるキャラがリムーブされたとき、/,"oppRemoved"],
  [/^このキャラがスリープ状態で登場したとき、/,"enterAsleep"],
  [/^ターン終了時、/,"end"],
  [/^自分がネクストヒントで手札を使用したとき、/,"hintUse"],
  [/^相手の証拠がリムーブされたとき、/,"oppEvRemoved"],
  [/^このキャラのコンタクト中に自分が【カットイン】を使用したとき、/,"cutinUsed"]
];
function allyTrigger(t){
  var m,f,list=[
    [/^このキャラか自分の現場にいる(.+?)がリムーブされたとき、/,"allyRemovedSelf"],
    [/^自分の現場にいる(.+?)がリムーブされたとき、/,"allyRemoved"],
    [/^自分の現場にいる(.+?)がコンタクトしたとき、/,"allyContact"],
    [/^自分の現場にいる(.+?)が推理かアクションしたとき、/,"allyActded"],
    [/^(.+?)が自分の現場に登場したとき、/,"allyEnter"],
    [/^自分が(.+?)を使用したとき、/,"allyEvent"],
    [/^自分の現場にいる(.+?)がアクションしたとき、/,"allyAction"],
    [/^自分の現場にいる(.+?)が推理したとき、/,"allyDeduce"],
    [/^自分の現場に(.+?)が登場したとき、/,"allyEnter"]
  ],i;
  for(i=0;i<list.length;i++)if((m=list[i][0].exec(t))&&(f=list[i][1]==="allyEvent"?filter("手札から"+m[1]):filter("自分の現場にいる"+m[1].replace(/^自分の現場にいる/,"")))){
    var tg=list[i][1]==="allyRemovedSelf"?"allyRemoved":list[i][1];
    return {trig:tg,who:f,len:m[0].length,self:list[i][1]==="allyRemovedSelf"};
  }
  return null;
}

/* ---------- one printed line of a character, event or case ---------- */
function line(raw,isEvent){
  var t=stash(raw),ab={conds:[]},m,tags=[];
  while((m=/^【([^【】]+)】/.exec(t))){
    if(m[1]==="スリープ"||/^[青緑白赤黄黒]$/.test(m[1]))break;
    tags.push(m[1]);t=t.slice(m[0].length);
  }
  var i,trig=null,onDisguise=false;
  for(i=0;i<tags.length;i++){
    if(tags[i]==="登場時")trig="enter";
    else if(tags[i]==="宣言")trig="decl";
    else if(tags[i]==="現場リムーブ時")trig="leave";
    else if(tags[i]==="変装時")onDisguise=true;
    else if(tags[i]==="疾風"){trig="enter";ab.conds.push({c:"gale"})}
    else if(!tagInfo(tags[i],ab))return null;
  }
  if(onDisguise){if(trig==="enter")ab.alsoDisguise=true;else trig="disguised"}
  /* keyword lines such as 〚迅速〛 or 〚ミスリード1〛 */
  var km=/^〚([^〚〛]+)〛\s*(\([^)]*\))?。?$/.exec(t);
  if(km&&!trig&&!isEvent){
    var kw=keyword(km[1]);
    if(!kw)return null;
    ab.trig="static";ab.give=[{v:"kw",kw:kw.k,n:kw.v}];ab.self=true;return ab;
  }
  if(trig==="decl"){
    /* the colon that ends the cost */
    var ci=-1,depth=0;
    for(i=0;i<t.length;i++){var ch=t[i];if(ch==="〚"||ch==="[")depth++;else if(ch==="〛"||ch==="]")depth--;else if(ch===":"&&!depth){ci=i;break}}
    var cs=costs(ci>-1?t.slice(0,ci):"");
    if(!cs)return null;
    ab.cost=cs;t=ci>-1?t.slice(ci+1):t;
  }else if(/^【スリープ】/.test(t))return null;
  t=prepare(t);
  /* "can be declared only if…" */
  if((m=/この能力は(.+?)場合に宣言できる。?$/.exec(t))){
    var dc=condition(m[1]);if(!dc||trig!=="decl")return null;
    ab.conds.push(dc);t=t.slice(0,m.index).trim();
  }
  if(!trig&&!isEvent){
    for(i=0;i<WHEN.length;i++){if(WHEN[i][0].test(t)){trig=WHEN[i][1];t=t.replace(WHEN[i][0],"");break}}
    if(!trig){
      var al=allyTrigger(t);
      if(al){trig=al.trig;ab.who=al.who;ab.withSelf=al.self;t=t.slice(al.len)}
    }
    if(!trig)return staticAbility(t,ab);
  }
  if(trig==="enterAsleep"){trig="enter";ab.conds.push({c:"selfState",s:["sleep"]})}
  ab.trig=trig||"event";
  ab.steps=steps(t);
  return ab.steps?ab:null;
}

/* continuous abilities */
function staticAbility(t,ab){
  var s=t.replace(/。$/,""),m,f,v;
  ab.trig="static";
  function self(list){ab.self=true;ab.give=list;return ab}
  var fixed={"このキャラはスリープ状態で登場する":"entersSleep","このキャラはスリープ状態でもガードできる":"sleepGuard",
    "このキャラは事件を指定してアクションできない":"noCase","このキャラは相手の現場にいるアクティブ状態のキャラを指定してアクションできる":"hitActive",
    "このキャラはオートフェイズにアクティブにならない":"noWake","このキャラはアクションできず、ガードできない":"noActGuard",
    "相手の能力や効果によって選ばれない":"untargetable","このキャラは推理できず、アクションできず、ガードできない":"idle",
    "このキャラはガードできる場合、必ずガードする":"mustGuard","このキャラは推理できない":"noDeduce",
    "手札から使用する場合、このキャラは事件カードの色を無視できる":"anyColor",
    "相手の現場にいるキャラはこのキャラを指定してアクションできない":"noTarget",
    "相手は【カットイン】を使用できない":"jamCut",
    "このキャラは相手の現場にいるカードがセットされているアクティブ状態のキャラを指定してアクションできる":"hitActiveSet",
    "ネクストヒントで手札から使用する場合、このキャラは事件カードの色を無視できる":"anyColorHint",
    "このキャラの下に重なっているカードの数につき、以下の能力を持つ":"none"};
  if(fixed[s])return self(fixed[s]==="none"?[]:[{v:"kw",kw:fixed[s]}]);
  if(/^犯人\[[^\]]+\]はデッキに何枚でも入れることができる$/.test(s))return self([]);
  if((m=/^(AP|LP)\+(\d+)$/.exec(s)))return self([{v:m[1].toLowerCase(),n:+m[2]}]);
  var km=new RegExp("^"+KW+"$").exec(s);
  if(km)return self([kwVerb(km[1])]);
  if((m=/^現場にいるこのキャラは〚特徴\[([^\]]+)\]〛を持つ$/.exec(s)))return self([{v:"trait",n:m[1]}]);
  if((m=/^現場にいるこのキャラは〚カード名\[([^\]]+)\]〛としても扱う$/.exec(s)))return self([{v:"name",n:m[1]}]);
  if((m=/^現場にいるこのキャラをレベル([+-]\d+)する$/.exec(s)))return self([{v:"lv",n:+m[1]}]);
  if((m=/^相手の現場にいるキャラをレベル([+-]\d+)する$/.exec(s))){ab.f={side:"opp",zone:"scene",kind:"c"};ab.give=[{v:"lv",n:+m[1]}];return ab}
  /* events set on a character */
  if((m=/^このイベントがセットされているキャラは(.+)を持つ$/.exec(s))){
    v=verbs("ターン終了時まで"+m[1]+"を持つ");
    if(!v)return null;
    ab.trig="whenSet";ab.give=v;return ab;
  }
  if((m=/^(.+?)場合、(.+)$/.exec(s))){var c=condition(m[1]);if(!c)return null;ab.conds.push(c);s=m[2]}
  if((m=/^このキャラを(AP|LP|レベル)([+-]\d+)(し、(AP|LP)([+-]\d+))?する$/.exec(s))){
    var list=[{v:{AP:"ap",LP:"lp","レベル":"lv"}[m[1]],n:+m[2]}];if(m[4])list.push({v:m[4].toLowerCase(),n:+m[5]});return self(list);
  }
  if((m=new RegExp("^このキャラは"+KW+"を持つ$").exec(s)))return self([kwVerb(m[1])]);
  if((m=/^このキャラは「Q(\d+)」を持つ$/.exec(s))){v=grant(m[1]);return v?self([v]):null}
  if(fixed[s])return self([{v:"kw",kw:fixed[s]}]);
  if((m=/^このキャラにセットされているカード1枚につき、このキャラをAP\+(\d+)する$/.exec(s))){ab.per="set";return self([{v:"ap",n:+m[1]}])}
  if((m=/^このキャラの下に重なっているカード1枚につき、このキャラをAP\+(\d+)する$/.exec(s))){ab.per="set";return self([{v:"ap",n:+m[1]}])}
  if((m=/^自分のパートナーエリアにある(.+?)1枚につき、このキャラをAP\+(\d+)する$/.exec(s))&&(f=handFilter(m[1]))){ab.per={pa:f};return self([{v:"ap",n:+m[2]}])}
  if((m=/^自分の現場にいる(このキャラ以外の.+?)1枚につき、このキャラをAP\+(\d+)する$/.exec(s))&&(f=filter("自分の現場にいる"+m[1]))){ab.per=f;return self([{v:"ap",n:+m[2]}])}
  if((m=/^自分の(裏|表)向きの証拠1つにつき、このキャラをAP\+(\d+)する$/.exec(s))){ab.per={ev:m[1]==="表"};return self([{v:"ap",n:+m[2]}])}
  if((m=/^(自分の現場にいる.+?|相手の現場にいる.+?)を(AP|LP)([+-]\d+)する$/.exec(s))&&(f=filter(m[1]))){ab.f=f;ab.give=[{v:m[2].toLowerCase(),n:+m[3]}];return ab}
  if((m=/^相手は自分の現場にいる(.+?)を指定してアクションできない$/.exec(s))&&(f=filter("自分の現場にいる"+m[1]))){ab.f=f;ab.give=[{v:"kw",kw:"noTarget"}];return ab}
  if((m=/^(相手の現場にいる.+?|自分の現場にいる.+?)はオートフェイズにアクティブにならない$/.exec(s))&&(f=filter(m[1]))){ab.f=f;ab.give=[{v:"kw",kw:"noWake"}];return ab}
  if((m=/^(自分の現場にいる.+?)は(.+を持つ)$/.exec(s))&&(f=filter(m[1]))){v=verbs("ターン終了時まで"+m[2]);if(!v)return null;ab.f=f;ab.give=v;return ab}
  return null;
}

/* ---------- Cut-in, Flash of insight, Disguise ---------- */
function cutLine(raw){
  var t=stash(raw).replace(/^【カットイン】/,""),ab={conds:[],trig:"cutin",ap:0},m,f;
  while((m=/^【([^【】]+)】/.exec(t))){if(!tagInfo(m[1],ab))return null;t=t.slice(m[0].length)}
  t=prepare(t).replace(/。$/,"");
  if((m=/^自分の現場にいる(.+?)1枚につき、AP\+(\d+)$/.exec(t))&&(f=filter("自分の現場にいる"+m[1]))){ab.per=f;ab.ap=+m[2];return ab}
  if((m=/^AP\+(\d+)、(.+?)に【カットイン】(?:する|した)場合、代わりにAP\+(\d+)$/.exec(t))&&(f=filter(m[2]))){ab.ap=+m[1];ab.alt={f:f,ap:+m[3]};return ab}
  if((m=/^(.+?)に【カットイン】(?:する|した)場合、AP\+(\d+)$/.exec(t))&&(f=filter(m[1]))){ab.alt={f:f,ap:+m[2]};return ab}
  if((m=/^AP\+(\d+)、(.+?)に【カットイン】(?:する|した)場合、(.+)$/.exec(t))&&(f=filter(m[2]))){
    ab.ap=+m[1];ab.steps=steps(m[3]);ab.stepsIf=f;return ab.steps?ab:null;
  }
  if((m=/^AP\+(\d+)(?:、(.+))?$/.exec(t))){
    ab.ap=+m[1];
    if(m[2]){ab.steps=steps(m[2]);if(!ab.steps)return null}
    return ab;
  }
  ab.steps=steps(t);return ab.steps?ab:null;
}
function hiraLine(raw){
  var t=stash(raw).replace(/^【ヒラメキ】/,"").replace(/^\((?:[^()]|\([^()]*\))*\)/,""),ab={trig:"hira",conds:[]},m;
  while((m=/^【([^【】]+)】/.exec(t))){if(!tagInfo(m[1],ab))break;t=t.slice(m[0].length)}
  ab.steps=steps(prepare(t));
  return ab.steps?ab:null;
}
function disguiseLine(raw){
  var t=nfkc(raw).replace(/^【変装】/,""),ab={trig:"disguise",conds:[]},m;
  while((m=/^【([^【】]+)】/.exec(t))){if(!tagInfo(m[1],ab))return null;t=t.slice(m[0].length)}
  return prepare(t).replace(/。/g,"")?null:ab;
}

function split(text){
  var out=[];
  nfkc(text).split(/\r?\n|<br\s*\/?>/).map(function(x){return x.trim()}).filter(Boolean).forEach(function(l){
    /* bullet lines belong to the line above */
    if(/^[・•]/.test(l)&&out.length)out[out.length-1]+="\n"+l;else out.push(l);
  });
  return out;
}

function parse(card){
  var type=card.type,out={abs:[],missing:[]},isEvent=type==="イベント";
  QUOTES=[];
  function add(l,fn){var ab=null;try{ab=fn(l)}catch(e){ab=null}if(ab)out.abs.push(ab);else out.missing.push(l)}
  var lines=split(card.feature),i;
  if(type==="キャラ"){
    lines.forEach(function(l){add(l,function(x){return line(x,false)})});
  }else if(isEvent){
    /* an event is one piece: if a line that runs when played is unknown, none of it runs */
    var failed=false,useConds=[];
    lines=lines.filter(function(l){
      var u=/^このイベントは、?(.+?)場合に使用できる。?$/.exec(l),c=u&&condition(u[1]);
      if(c){useConds.push(c);return false}
      return true;
    });
    lines.forEach(function(l){
      var quoted=/^このイベントがセットされているキャラ/.test(l);
      var ab=null;try{ab=line(l,!quoted)}catch(e){ab=null}
      if(ab)out.abs.push(ab);else{failed=true;out.missing.push(l)}
    });
    if(failed){out.abs=[];out.missing=split(card.feature)}
    else out.abs.forEach(function(a){if(a.trig==="event")a.conds=a.conds.concat(useConds)});
  }else if(type==="事件"){
    for(i=0;i<lines.length;i++){
      var l=lines[i],m;
      if((m=/^この事件が解決編に(?:なった|移行した)とき、(.+)$/.exec(l))){
        var st=steps(prepare(m[1]));
        if(st){out.abs.push({trig:"solved",conds:[],steps:st});continue}
      }
      if(/^自分の【黒】のパートナーの【事件解決】能力を以下の能力に書き換える。?$/.test(l)&&/相手はゲームに敗北する/.test(lines[i+1]||"")){out.abs.push({trig:"destroy",conds:[]});i++;continue}
      if(/【宣言】/.test(l))add(l,function(x){var a=line(x,false);return a&&a.trig==="decl"&&a.cost.every(function(k){return ["flip","discard","discardF","showF","sleepOther","mill","fileRemove","unsetAny","paRemove"].indexOf(k.c)>-1})?a:null});
      else out.missing.push(l);
    }
  }else{
    /* partners: the two standard abilities are built into the game */
    lines.forEach(function(l){if(!/【事件解決】|【アシスト】/.test(l))out.missing.push(l)});
  }
  if(type==="キャラ"||isEvent){
    split(card.hirameki).forEach(function(l){add(l,hiraLine)});
    split(card.cut_in).forEach(function(l){add(l,cutLine)});
    if(card.disguise)add(split(card.disguise).join(""),disguiseLine);
  }
  return out;
}

var api={parse:parse,nfkc:nfkc};
if(typeof module!=="undefined"&&module.exports)module.exports=api;
root.ConanFx=api;
})(typeof window!=="undefined"?window:globalThis);
