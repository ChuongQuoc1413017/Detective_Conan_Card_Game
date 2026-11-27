/* Turns the Japanese card text into English or Vietnamese using cards-i18n.js.
   Anything without a translation is left in Japanese. */
(function(){
"use strict";
var D=window.CONAN_I18N||{s:{},k:{},n:{}};
var has=Object.prototype.hasOwnProperty;
var HEAD=/^(【+[^【】]*】|〚[^〛]*〛(?=[\s　]*([：:（【〚]|$))|[：:])[\s　]*/;
var TOK=/〚[^〛]*〛|【[^【】]*】|［[^］]*］/g;
function get(map,key){return has.call(map,key)?map[key]:null}

/* a card name, a trait, or several joined with , or ＆ */
function name(jp,i){
  var t=String(jp||"").trim(),hit=get(D.n,t);
  if(hit)return hit[i];
  var parts=t.split(/([,、＆&])/);
  if(parts.length<2)return null;
  var done=parts.map(function(p,x){return x%2?(p==="＆"||p==="&"?" & ":", "):name(p,i)});
  return done.indexOf(null)>-1?null:done.join("");
}
function nameOr(jp,i){var v=name(jp,i);return v===null?jp:v}

function token(raw,i){
  var inner=[],key=raw.replace(/［([^］]*)］/g,function(m,x){inner.push(x);return "［］"});
  var bare=raw.replace(/^[【〚［]+|[】〛］]+$/g,"");
  if(/^【+絆./.test(raw))return "["+(i?"Gắn kết: ":"Bond: ")+nameOr(bare.slice(1),i)+"]";
  var hit=get(D.k,key)||get(D.k,key.replace(/^【+/,"【"));
  if(!hit)return raw;
  var out=hit[i].replace(/\{[nv](\d)\}/g,function(m,x){return inner[x]===undefined?"":nameOr(inner[x],i)});
  /* a bare name or trait is shown in brackets */
  if(/^\{n0\}$/.test(hit[i]))out="["+out+"]";
  return out;
}

function sentence(s,i){
  var head="",m;
  while((m=HEAD.exec(s))){
    var colon=/^[：:]/.test(m[1]);
    head=colon?head.replace(/\s+$/,"")+": ":head+token(m[1],i)+" ";
    s=s.slice(m[0].length);
  }
  var tokens=[],body=s.replace(TOK,function(t){tokens.push(t);return "{"+tokens.length+"}"});
  if(!body)return head.trim();
  var hit=get(D.s,body);
  if(!hit)return head+s;
  return head+hit[i].replace(/\{(\d+)\}/g,function(x,n){return tokens[n-1]===undefined?x:token(tokens[n-1],i)});
}

function text(jp,lang){
  var i=lang==="vi"?1:0;
  return String(jp||"").split(/\r?\n|<br\s*\/?>/).map(function(line){
    return line.trim().split(/(?<=。)(?![）」』〛\]］])/).map(function(x){return x.trim()}).filter(Boolean)
      .map(function(x){return sentence(x,i)}).join(" ");
  }).filter(Boolean).join("\n");
}

window.ConanTr={
  text:text,
  box:function(code,lang){var b=D.b&&get(D.b,code);return b?b[lang==="vi"?1:0]:null},
  name:function(jp,lang){return name(jp,lang==="vi"?1:0)}
};
})();
