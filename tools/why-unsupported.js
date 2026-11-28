/* Explains why card abilities are not supported yet: for each unsupported line it finds the part
   (tag, cost, trigger, condition, effect sentence) that the card reader does not understand.
   node tools/why-unsupported.js            the 60 most common reasons
   node tools/why-unsupported.js 200        more of them
   node tools/why-unsupported.js 0 B05086   only one card */
const fs=require("fs"),vm=require("vm"),path=require("path"),root=path.resolve(__dirname,"..");
const ctx={console};ctx.window=ctx;vm.createContext(ctx);
vm.runInContext(fs.readFileSync(root+"/assets/cards-data.js","utf8"),ctx);
let src=fs.readFileSync(root+"/assets/card-effects.js","utf8").replace("var api={parse:parse,nfkc:nfkc};","var api={parse:parse,nfkc:nfkc,__:{line:line,steps:steps,effect:effect,condition:condition,costs:costs,prepare:prepare,stash:stash,tagInfo:tagInfo,WHEN:WHEN,allyTrigger:allyTrigger,staticAbility:staticAbility,cutLine:cutLine,hiraLine:hiraLine}};");
vm.runInContext(src,ctx);
const F=ctx.ConanFx,I=F.__;
const only=process.argv[3];const seen=new Map();for(const c of ctx.CONAN_CARDS.cards)if(!seen.has(c.card_id)&&(!only||c.card_num===only))seen.set(c.card_id,c);
const norm=s=>s.replace(/\[[^\]]*\]/g,"[]").replace(/\d+/g,"#").replace(/「Q#」/g,"「Q」");
const reasons=new Map(),byCard=[];let lines=0;
function blame(k,card){reasons.set(k,(reasons.get(k)||[0,[]]));const r=reasons.get(k);r[0]++;if(r[1].length<3)r[1].push(card)}
for(const c of seen.values()){
  const r=F.parse(c);
  for(const raw of r.missing){
    lines++;
    let t=I.stash(raw),m,ab={conds:[]},tags=[];const blocks=[];
    const isCut=/^【カットイン】/.test(t),isHira=/^【ヒラメキ】/.test(t);
    t=t.replace(/^【(カットイン|ヒラメキ)】/,"");
    while((m=/^【([^【】]+)】/.exec(t))){if(m[1]==="スリープ"||/^[青緑白赤黄黒]$/.test(m[1]))break;tags.push(m[1]);t=t.slice(m[0].length)}
    for(const tg of tags)if(!["登場時","宣言","現場リムーブ時","変装時","疾風"].includes(tg)&&!I.tagInfo(tg,{conds:[]}))blocks.push("TAG 【"+norm(tg)+"】");
    if(tags.includes("宣言")){let ci=-1,d=0;for(let i=0;i<t.length;i++){const ch=t[i];if(ch==="〚"||ch==="[")d++;else if(ch==="〛"||ch==="]")d--;else if(ch===":"&&!d){ci=i;break}}
      if(ci>-1){const head=t.slice(0,ci);if(!I.costs(head))blocks.push("COST "+norm(head));t=t.slice(ci+1)}}
    t=I.prepare(t);let um=/^このイベントは、?(.+?)場合に使用できる。?$/.exec(t);if(um){if(!I.condition(um[1]))blocks.push("COND "+norm(um[1]));t=""}
    if((m=/この能力は(.+?)場合に宣言できる。?$/.exec(t))){if(!I.condition(m[1]))blocks.push("DECLCOND "+norm(m[1]));t=t.slice(0,m.index)}
    if(/\n/.test(t)&&/以下から/.test(t)){ if(!I.steps(t))blocks.push("CHOICE "+norm(t.split("\n")[0]))}
    else{
      const parts=t.split("。").map(x=>x.trim()).filter(Boolean);
      parts.forEach((s,i)=>{
        if(i===0&&c.type==="キャラ"&&!tags.some(x=>["登場時","宣言","現場リムーブ時"].includes(x))&&!isCut&&!isHira){
          let w=I.WHEN.find(x=>x[0].test(s));if(w){s=s.replace(w[0],"")}else{const al=I.allyTrigger(s);if(al)s=s.slice(al.len);else if(/とき、/.test(s)){blocks.push("TRIGGER "+norm(s.split("とき、")[0]+"とき"));s=s.split("とき、").slice(1).join("とき、")}else{if(!I.staticAbility(s,{conds:[]}))blocks.push("STATIC "+norm(s));return}}}
        if(!s)return;
        if(isCut&&/AP\+\d+$/.test(s))return;
        if(I.effect(s))return;
        if(I.steps(s))return;
        let mm=/^(.+?)場合、(.+)$/.exec(s);
        if(mm&&!/^(そうした|そうしなかった)/.test(s)&&(I.effect(mm[2])||I.steps(mm[2]))){if(!I.condition(mm[1]))blocks.push("COND "+norm(mm[1]));return}
        blocks.push("EFFECT "+norm(s));
      });
    }
    if(!blocks.length)blocks.push("WHOLE (parts parse, combination fails) "+norm(raw).slice(0,90));
    blocks.forEach(b=>blame(b,c.card_num));
    byCard.push([c.card_num,blocks,raw]);
  }
}
if(only){byCard.forEach(x=>console.log(x[0],x[2].replace(/\n/g," ")+"\n   blocked by: "+x[1].join(" | ")));if(!byCard.length)console.log("Every ability on this card is supported.");process.exit(0)}
const kinds={};for(const [k,v] of reasons){const kk=k.split(" ")[0];kinds[kk]=(kinds[kk]||0)+v[0]}
console.log("Unsupported lines:",lines,"\nWhat blocks them:",JSON.stringify(kinds),"\n(TAG/COST/TRIGGER/COND/EFFECT/STATIC = the part not understood; CHOICE = a \"choose from these\" block; WHOLE = every part is understood but not this combination)\n");
console.log([...reasons].sort((a,b)=>b[1][0]-a[1][0]).slice(0,+process.argv[2]||60).map(([k,v])=>v[0]+" "+k.slice(0,170)+"  ("+v[1].join(",")+")").join("\n"));

