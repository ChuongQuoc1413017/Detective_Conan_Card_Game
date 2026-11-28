/* Runs single card abilities on a prepared board and checks what they did.
   Also runs every supported ability once on its own and checks no card is lost or duplicated.
   node tests/cards.js */
"use strict";
const { load, expectFinish, finish } = require("./harness");
expectFinish();
const EXPOSE = 'window.__t2={removeChar:removeChar,eventReason:eventReason};window.__t={G:function(v){if(v!==undefined)G=v;return G},mkP:mkP,mkChar:mkChar,buildCard:buildCard,runAbility:runAbility,trigger:trigger,enterChar:enterChar,deduce:deduce,doAction:doAction,apOf:apOf,lpOf:lpOf,lvOf:lvOf,has:has,declAbilities:declAbilities,useDecl:useDecl,resolveEvent:resolveEvent,contact:contact,hirameki:hirameki,declReason:declReason,mdOf:mdOf,declarers:declarers};';
const ctx = load({ practice: true, patch: s => {
  if (!s.includes("window.__practice={")) throw new Error("practice.js hook not found");
  return s.replace("window.__practice={", EXPOSE + "window.__practice={");
} });
const T=ctx.__t,D=ctx.CONAN_CARDS.cards,F=ctx.ConanFx;
let uid=1000;const card=n=>{const raw=D.find(c=>c.card_num===n);return Object.assign({t:'c'},T.buildCard(raw,1),{uid:++uid})};
const find=pred=>D.find(c=>{if(c.type!=='キャラ'&&c.type!=='イベント')return false;return pred(F.parse(c),c)});
const plain=(lv,ap,lp,extra)=>Object.assign({t:'c',n:'Dummy '+lv,jnames:['ダミー'],jt:[],col:['青'],lv,ap,lp,fx:[],uid:++uid,custom:true},extra);
const def={custom:true,name:'t',partner:{n:'P',lp:1,col:['青']},caseColors:['青'],caseTags:[],caze:{n:'C',lv:[7,6]},fx:[],cards:[]};
function board(){const G={p:[T.mkP(0,def),T.mkP(1,def)],turn:3,cur:0,log:[],sim:true,bot:['normal','normal'],over:null};T.G(G);
  for(const p of G.p){p.deck=[];for(let i=0;i<20;i++)p.deck.push(plain(1+i%8,3000,1));p.lv=7;p.file=[plain(1,1,1),plain(1,1,1),plain(1,1,1),plain(1,1,1),plain(1,1,1),plain(1,1,1),plain(1,1,1),plain(1,1,1)]}return G}
function put(p,c,state){const ch=T.mkChar(c);ch.state=state||'active';ch.fresh=false;p.scene.push(ch);return ch}
let ok=0,bad=0;const check=(name,cond,info)=>{if(cond)ok++;else{bad++;console.log('FAIL',name,info||'')}};
const shape=(trig,op,more)=>find((r,c)=>r.abs.some(a=>a.trig===trig&&a.conds.length===0&&!a.turn&&a.steps&&a.steps.length===1&&a.steps[0].op===op&&!a.steps[0].cond&&(!more||more(a.steps[0],a))));
(async()=>{
  let G,p,o,raw,c,ch;
  raw=shape('enter','target',(s,a)=>s.f.side==='any'&&s.list[0].v==='remove'&&s.f.apMax===8000&&s.n===1);
  if(raw){G=board();[p,o]=G.p;const big=put(o,plain(8,9000,1)),mid=put(o,plain(5,8000,1));c=card(raw.card_num);p.hand=[c];await T.enterChar(p,c,{});
    check('remove AP<=8000 on enter',o.scene.includes(big)&&!o.scene.includes(mid),raw.card_num)}else check('has remove card',false);
  raw=shape('enter','draw',s=>s.n===1);
  if(raw){G=board();[p]=G.p;c=card(raw.card_num);p.hand=[c];await T.enterChar(p,c,{});check('draw 1 on enter',p.hand.length===1&&p.deck.length===19,raw.card_num+' '+p.hand.length)}
  raw=find(r=>r.abs.some(a=>a.trig==='static'&&a.printed!==true&&a.self&&!a.conds.length&&!a.per&&a.give.length===1&&a.give[0].v==='lv'&&a.give[0].n>0));
  if(raw){G=board();[p]=G.p;ch=put(p,card(raw.card_num));check('level up static',T.lvOf(ch)>ch.lv,raw.card_num)}
  raw=find(r=>r.abs.some(a=>a.trig==='static'&&a.per==='set'));
  if(raw){G=board();[p]=G.p;ch=put(p,card(raw.card_num));const b=T.apOf(ch,p);ch.under=[{card:plain(1,1,1),up:false},{card:plain(1,1,1),up:false}];check('AP per set card',T.apOf(ch,p)>=b+2000,raw.card_num+' '+(T.apOf(ch,p)-b))}
  raw=shape('enter','setTop',s=>s.on==='self'&&s.n===1);
  if(raw){G=board();[p]=G.p;c=card(raw.card_num);p.hand=[c];ch=await T.enterChar(p,c,{});check('set top card on self',(ch.under||[]).length===1&&p.deck.length===19,raw.card_num)}
  raw=find((r,c)=>c.type==='イベント'&&r.abs.some(a=>a.trig==='event'&&a.steps.some(s=>s.op==='attach'))&&r.abs.some(a=>a.trig==='whenSet')&&r.abs.every(a=>a.trig!=='event'||!a.conds.length));
  if(raw){G=board();[p]=G.p;c=card(raw.card_num);const host=put(p,plain(9,5000,1,{col:['青','緑','白','赤','黄','黒'],jnames:[F.nfkc('江戸川コナン')],jt:['探偵']}));
    const claimed=await T.resolveEvent(p,c);check('event is set on a character',claimed===true&&host.under&&host.under.length===1,raw.card_num+' '+claimed)}
  else console.log('(no attach event found)');
  raw=shape('enter','investigate');
  G=board();[p,o]=G.p;if(raw){c=card(raw.card_num);p.hand=[c];const top=o.deck[o.deck.length-1];await T.enterChar(p,c,{});check('investigate moves top card to bottom',o.deck.length===20&&o.deck[o.deck.length-1]!==top,raw.card_num)}
  raw=find(r=>r.abs.some(a=>a.trig==='disguise'&&a.conds.every(k=>k.c==='file')));
  if(raw){G=board();[p,o]=G.p;const mine=put(p,plain(2,1000,1)),foe=put(o,plain(3,2000,1),'sleep');const d=card(raw.card_num);d.ap=9000;p.hand=[d];G.sim=true;
    await T.contact(0,mine,foe);check('disguise swaps in and wins',p.scene.length===1&&p.scene[0].uid===d.uid&&!o.scene.includes(foe)&&p.deck[0].lv===2,raw.card_num+' '+p.scene.map(x=>x.n))}
  raw=find((r,c)=>r.abs.some(a=>a.trig==='hira'&&a.steps.length===1&&a.steps[0].op==='selfToPA'));
  if(raw){G=board();[p]=G.p;c=card(raw.card_num);const claimed=await T.hirameki(p,c);check('flash moves card to Partner area',claimed===true&&p.pa[0]===c,raw.card_num)}
  raw=find((r,c)=>r.abs.some(a=>a.trig==='hira'&&!a.conds.length&&a.steps.length===1&&a.steps[0].op==='flip'&&a.steps[0].to==='down'));
  if(raw){G=board();[p]=G.p;c=card(raw.card_num);const e=plain(1,1,1);e.up=true;p.ev=[e];await T.hirameki(p,c);check('flash turns evidence face down',!e.up,raw.card_num)}
  raw=find(r=>r.abs.some(a=>a.trig==='static'&&a.printed&&a.give.some(g=>g.kw==='noDeduce'||g.kw==='mustGuard')));
  G=board();[p,o]=G.p;const guard=put(o,plain(2,1000,1,{mustGuard:1})),atk=put(p,plain(5,5000,1));o.ev=[plain(1,1,1)];await T.doAction(0,atk,{kind:'case'});
  check('must guard takes the hit',!o.scene.includes(guard)&&o.ev.length===1);
  // granted ability from a quoted effect
  G=board();[p,o]=G.p;const g=put(p,plain(5,5000,1,{granted:[{trig:'action',conds:[],steps:[{op:'draw',n:1}]}]}));o.ev=[plain(1,1,1)];await T.doAction(0,g,{kind:'case'});check('granted ability triggers',p.hand.length===1);
  // case Declare ability pays by turning evidence face up
  const k=D.find(x=>x.type==='事件'&&F.parse(x).abs.some(a=>a.trig==='decl'&&a.cost.length===1&&a.cost[0].c==='flip'));
  if(k){const fx=F.parse(k).abs;G=board();G.p[0]=T.mkP(0,Object.assign({},def,{fx}));p=G.p[0];p.deck=[plain(1,1,1)];p.phase='solution';const need=fx.find(a=>a.trig==='decl').cost[0].n;
    check('case offers nothing without evidence',T.declReason(p,p.caseSrc)!=='');p.ev=[];for(let i=0;i<need;i++)p.ev.push(plain(1,1,1));
    const a=fx.find(a=>a.trig==='decl');if(a.conds.every(x=>x.c==='solution')){await T.useDecl(p,p.caseSrc);check('case ability pays with evidence',p.ev.every(x=>x.up),k.card_num)}}

  // round 3: "sleep all opposing characters", "when this or an ally is removed", event use conditions
  raw=find((r,c)=>c.type==='イベント'&&r.abs.some(a=>a.trig==='event'&&!a.conds.length&&a.steps.length===1&&a.steps[0].op==='all'&&a.steps[0].f.side==='opp'&&a.steps[0].list[0].v==='sleep'));
  if(raw){G=board();[p,o]=G.p;put(o,plain(3,2000,1));put(o,plain(6,6000,1));await T.resolveEvent(p,card(raw.card_num));check('sleep all opposing',o.scene.every(x=>x.state==='sleep'),raw.card_num)}
  raw=find(r=>r.abs.some(a=>a.trig==='allyRemoved'&&a.withSelf&&!a.turn&&!a.once&&a.steps.length===1&&a.steps[0].op==='draw'));
  if(raw){G=board();[p,o]=G.p;ch=put(p,card(raw.card_num));await ctx.__t2.removeChar(p,ch,'test');check('draw when this is removed',p.hand.length>=1,raw.card_num)}
  raw=find((r,c)=>c.type==='イベント'&&r.abs.some(a=>a.trig==='event'&&a.conds.some(k=>k.c==='evLE')));
  if(raw){G=board();[p,o]=G.p;p.def=Object.assign({},def,{partner:{n:'P',lp:1,col:['青','緑','白','赤','黄','黒']}});const ev=card(raw.card_num);p.ev=[plain(1,1,1),plain(1,1,1)];o.ev=[];check('event blocked by its condition',ctx.__t2.eventReason(p,ev)!=='',raw.card_num);o.ev=[plain(1,1,1),plain(1,1,1)];check('event allowed when condition met',ctx.__t2.eventReason(p,ev)==='',raw.card_num)}
  // round 4: abilities that look back at what they did, react to your own effects, or watch a kind of Action
  const ALL=['青','緑','白','赤','黄','黒'],allDef=Object.assign({},def,{partner:{n:'P',lp:1,col:ALL},caseColors:ALL});
  const fxOf=n=>JSON.parse(JSON.stringify(F.parse(D.find(c=>c.card_num===n)).abs));
  // B05068: remove the top 3 of your deck; if that removed an Akai-family character, gain Assault
  G=board();[p]=G.p;p.def=allDef;ch=put(p,card('B05068'));
  let ab=fxOf('B05068').find(a=>a.trig==='enter');ab.steps[0].opt=false;
  p.deck.push(plain(3,1000,1,{jt:['赤井家']}));await T.runAbility(p,ch,ab,{});
  check('"if this removed an Akai-family character" sees the removed card',T.has(ch,'assault'));
  G=board();[p]=G.p;p.def=allDef;ch=put(p,card('B05068'));ab=fxOf('B05068').find(a=>a.trig==='enter');ab.steps[0].opt=false;
  await T.runAbility(p,ch,ab,{});check('...and stays off when none was removed',!T.has(ch,'assault'));
  // B03116: removed by your own effect on your turn -> may enter again asleep, then draw 1
  G=board();[p]=G.p;p.def=allDef;G.cur=0;ch=put(p,card('B03116'));G.curOwner=0;
  await ctx.__t2.removeChar(p,ch,'test');G.curOwner=undefined;
  check('removed by your own effect: enters again asleep and draws',p.scene.some(x=>x.k==='B03116'&&x.state==='sleep')&&p.hand.length===1,JSON.stringify(G.log.slice(0,3)));
  G=board();[p,o]=G.p;p.def=allDef;G.cur=0;ch=put(p,card('B03116'));
  await ctx.__t2.removeChar(p,ch,'lost the Contact');
  check('...but not when it loses a Contact',!p.scene.length);
  // B01036: when your green character takes an Action against a character, sleep up to 1 character
  G=board();[p,o]=G.p;p.def=allDef;put(p,card('B01036'));const grn=put(p,plain(5,5000,1,{col:['緑']}));
  const foe=put(o,plain(2,1000,1),'sleep'),awake=put(o,plain(6,9000,1));
  await T.doAction(0,grn,{kind:'char',c:foe});
  check('"when your green character takes an Action [character]" fires',awake.state==='sleep');
  // B10010: cannot be removed by the opponent's events (while Ran Mori is in Scene)
  G=board();[p,o]=G.p;o.def=allDef;const shin=put(o,card('B10010'));put(o,plain(1,1000,1,{jnames:[F.nfkc('毛利蘭')]}));
  await T.runAbility(p,{t:'e',n:'Test event',uid:++uid},{trig:'event',conds:[],steps:[{op:'target',f:{side:'opp',zone:'scene',kind:'c',lvMin:4},n:1,list:[{v:'remove'}]}]},{});
  check('protected from removal by opposing events',o.scene.includes(shin));
  // B03059: Declare cost puts a white character from the Remove area on the bottom of the deck
  G=board();[p,o]=G.p;p.def=allDef;ch=put(p,card('B03059'));const white=plain(3,2000,1,{col:['白']});p.rem=[white];
  await T.useDecl(p,ch);
  check('cost: Remove area card to the bottom of the deck',!p.rem.length&&p.deck[0]===white);
  // B10025: in the solution phase, when you gain evidence on your turn, sleep up to 1 character
  G=board();[p,o]=G.p;p.def=allDef;G.cur=0;p.phase='solution';put(p,card('B10025'));const ded=put(p,plain(3,2000,1));const wake=put(o,plain(6,6000,1));
  await T.deduce(p,ded);
  check('"when you gain evidence" fires',wake.state==='sleep');
  // B11021: Action against a character with AP 4000+ lower -> remove up to 1 level 7 or lower character
  G=board();[p,o]=G.p;p.def=allDef;const big=put(p,card('B11021'));const low=put(o,plain(2,2000,1),'sleep'),extra=put(o,plain(6,5000,1),'sleep');
  await T.doAction(0,big,{kind:'char',c:low});
  check('"against a character with AP 4000 or more lower" fires',!o.scene.includes(extra));
  G=board();[p,o]=G.p;p.def=allDef;const big2=put(p,card('B11021'));const near=put(o,plain(2,6000,1),'sleep'),extra2=put(o,plain(6,5000,1),'sleep');
  await T.doAction(0,big2,{kind:'char',c:near});
  check('...and not against a stronger one',o.scene.includes(extra2));

  // B05041: an event set on a character protects it from the opponent's remove / sleep / stun effects
  G=board();[p,o]=G.p;p.def=allDef;const host=put(p,plain(5,5000,1,{col:['緑']}));
  await T.resolveEvent(p,card('B05041'));
  await T.runAbility(o,{t:'c',n:'Foe',uid:++uid},{trig:'event',conds:[],steps:[{op:'target',f:{side:'opp',zone:'scene',kind:'c'},n:1,list:[{v:'sleep'}]}]},{});
  check('set event protects its character from opposing sleep',(host.under||[]).length===1&&host.state==='active');
  // B06064: when the set event goes to the Remove area on the opponent's turn, enter a YAIBA character asleep
  G=board();[p,o]=G.p;p.def=allDef;const yaiba=put(p,plain(8,7000,1,{jt:['YAIBA']}));const back=plain(3,2000,1,{jt:['YAIBA']});
  await T.resolveEvent(p,card('B06064'));p.rem=[back];G.cur=1;
  await ctx.__t2.removeChar(p,yaiba,'test');
  check('"when this set event is put into the Remove area" fires',p.scene.some(x=>x.uid===back.uid&&x.state==='sleep'),JSON.stringify(G.log.slice(0,4)));

  // every playable ability on every card runs without throwing
  let runs=0,errs={};
  for(const raw of D){if(raw.type!=='キャラ'&&raw.type!=='イベント')continue;for(let idx=0;idx<F.parse(raw).abs.length;idx++){
    G=board();[p,o]=G.p;const c=card(raw.card_num);const a=c.fx[idx];if(!a||!a.steps)continue;
    for(const q of G.p){q.hand=[plain(2,2000,1),plain(4,4000,1,{cutin:1000})];q.rem=[plain(2,2000,1),Object.assign(card(raw.card_num),{})];q.ev=[plain(1,1,1),plain(1,1,1)];put(q,plain(5,5000,1),'sleep');put(q,plain(7,8000,2))}
    const me=c.t==='e'?c:put(p,c);const x=put(p,plain(3,3000,1,{under:[{card:plain(1,1,1),up:false}]}));
    const count=()=>G.p.reduce((s,q)=>s+q.deck.length+q.hand.length+q.file.length+q.ev.length+q.rem.length+q.scene.length+q.pa.length+q.scene.reduce((n,y)=>n+(y.under||[]).length,0),0);
    const before=count();G.attacker={c:o.scene[0],o};const rc={isEvent:c.t==='e',fromEvidence:a.trig==='hira',found:[plain(8,1,1)],contact:[{c:me,o:p},{c:o.scene[0],o}]};
    if(rc.fromEvidence||rc.isEvent){/* the card itself is outside every zone */}
    try{runs++;for(const cond of [a]){const keep=cond.conds,t=cond.turn;cond.conds=[];cond.turn=undefined;await T.runAbility(p,me,cond,rc);cond.conds=keep;cond.turn=t}
      const extra=rc.claimed?1:0;if(count()!==before+extra)errs['card count '+(count()-before-extra)+' '+JSON.stringify(a.steps).slice(0,160)]=raw.card_num}
    catch(e){if(!(e&&e.over))errs[String(e&&e.message||e)+' '+(e.stack||'').split('\n')[1]]=raw.card_num}
  }}
  console.log('Ability runs:',runs,'problems:',Object.keys(errs).length);Object.entries(errs).slice(0,15).forEach(e=>console.log('  ',e[1],e[0]));
  console.log('Checks passed:',ok,'failed:',bad);
  finish();if(bad||Object.keys(errs).length){console.log('FAIL');process.exit(1)}console.log('OK');
})();
