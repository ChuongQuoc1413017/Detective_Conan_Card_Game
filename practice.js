
(function(){
var root=document.getElementById("pgame"); if(!root) return;
var OVER={over:true}, G=null, UID=0, OPP="random", lastAsk=null, OPP_HAND_REVEALED=false;
var BOTS={easy:{name:"Novice",tag:"Easy",desc:"Plays at random and often misses chances. Good for your first games."},
  normal:{name:"Sleuth",tag:"Normal",desc:"Plays its strongest cards and mostly gathers evidence."},
  hard:{name:"Master Sleuth",tag:"Hard",desc:"Attacks your evidence, picks off sleeping characters and guards with care."},
  expert:{name:"Detective vs Sleuth",tag:"Expert",desc:"Thinks ahead: tries each move it could make, plays the next few turns out in its head, and picks the move that works out best. It never looks at your hand or the order of either deck."}};
var BOT="normal";
try{var savedBot=localStorage.getItem("conanBot");if(BOTS[savedBot])BOT=savedBot}catch(e){}
/* ===== Language (EN / VI) for the practice game ===== */
var LANG=(function(){try{var s=localStorage.getItem("conanLang");if(s==="vi"||s==="en")return s}catch(e){}return String(navigator.language||"en").toLowerCase().indexOf("vi")===0?"vi":"en"})();
var SUBJ={"You":"Bạn","Opponent":"Đối thủ","you":"bạn","opponent":"đối thủ"};
function S(x){return SUBJ[x]||x}
var COL={blue:"xanh dương",black:"đen",green:"xanh lá",white:"trắng",red:"đỏ",yellow:"vàng"};
var NAMES=[
 ["Piano Sonata “Moonlight” Murder Case","Vụ án Sonata “Ánh trăng”"],["Codename: Sherry","Mật danh: Sherry"],["And Then the Mermaid Vanished","Rồi nàng tiên cá biến mất"],["Reunion","Cuộc tái ngộ"],["The Scarlet Return","Sự trở lại của sắc đỏ"],["The Scarlet Suspicion","Nghi vấn sắc đỏ"],
 ["The Detective Who Shrank","Thám tử bị thu nhỏ"],["Ran's Blow","Cú đấm của Ran"],["“Traitors can't hide their scent...”","“Kẻ phản bội không giấu nổi mùi của mình...”"],["Shadow of Renya Karasuma","Bóng dáng Renya Karasuma"],["Omamori (Charm)","Omamori (Bùa hộ mệnh)"],["Heiji's Insight","Trực giác của Heiji"],["“Ladies and... Gentlemen!!”","“Thưa quý ông... quý bà!!”"],["“April Fool...”","“Cá tháng Tư...”"],["The Mysterious Passenger","Hành khách bí ẩn"],["Akai's Shot","Phát bắn của Akai"],["Private Eye","Thám tử tư"],["Amuro's Strike","Đòn đánh của Amuro"],
 ["Black Organization","Tổ chức Áo Đen"],["Kid the Phantom Thief","Siêu đạo chích Kid"],["Detective Boys","Thám tử nhí"],["Dr. Agasa","Tiến sĩ Agasa"]
];
function nmz(s){if(LANG!=="vi")return s;for(var i=0;i<NAMES.length;i++){if(s.indexOf(NAMES[i][0])>-1)s=s.split(NAMES[i][0]).join(NAMES[i][1])}return s}
var EX={
 "The top FILE card of the opponent moves to their hand. This is not a free draw: their FILE area is 1 smaller.":"Lá FILE trên cùng của đối thủ chuyển lên tay họ. Đây không phải rút bài miễn phí: Khu FILE của họ giảm 1 lá.",
 "Use Next Hint?":"Dùng Gợi ý kế tiếp?",
 "This is not a free draw. The top card of your FILE area moves to your hand, so your FILE area gets 1 smaller. Then you may play one card.":"Đây không phải rút bài miễn phí. Lá trên cùng Khu FILE chuyển lên tay bạn, nên Khu FILE giảm 1 lá. Sau đó bạn được đánh một lá.",
 "Use Next Hint":"Dùng Gợi ý kế tiếp",
 "What the opponent is doing":"Đối thủ đang làm gì",
 "What the opponent did last turn":"Đối thủ đã làm gì ở lượt trước",
 /* interface */
 "Scene":"Hiện trường","Partner":"Cộng sự","Case":"Vụ án","Evidence area":"Khu chứng cứ","FILE area":"Khu FILE","Deck":"Bộ bài","Remove area":"Khu loại bỏ","cards left":"lá còn lại",
 "Your turn actions":"Hành động trong lượt của bạn","Back to deck choice":"Quay lại chọn bộ bài","Play again":"Chơi lại","Needed to solve the case":"Cần để phá án","Game log · view":"Nhật ký ván · xem",
 "Revealed by card effect":"Được lật bởi hiệu ứng của lá bài","Finish reveal":"Xong lật bài","Hidden":"Lá bài","card":"ẩn","Hidden until a reveal effect resolves.":"Ẩn cho đến khi một hiệu ứng lật bài được thực hiện.",
 "Case phase":"Giai đoạn vụ án","Solution phase":"Giai đoạn giải đáp","Active":"Hoạt động","Sleeping":"Đang ngủ","Stunned":"Bị choáng","Just arrived":"Vừa vào","In FILE area":"Trong Khu FILE","In hand":"Trên tay",
 "Random":"Ngẫu nhiên","Bot plays":"Bot chơi bộ",
 "Bot level":"Độ khó","Novice":"Tân binh","Sleuth":"Thám tử","Master Sleuth":"Thám tử bậc thầy","Detective vs Sleuth":"Thám tử đối đầu","Expert":"Chuyên gia",
 "Thinks ahead: tries each move it could make, plays the next few turns out in its head, and picks the move that works out best. It never looks at your hand or the order of either deck.":"Biết tính trước: thử từng nước có thể đi, nhẩm trước vài lượt tiếp theo trong đầu rồi chọn nước có kết quả tốt nhất. Bot không bao giờ nhìn bài trên tay bạn hay thứ tự của bộ bài.","Easy":"Dễ","Normal":"Thường","Hard":"Khó","Bot:":"Bot:",
 "Plays at random and often misses chances. Good for your first games.":"Chơi ngẫu nhiên và hay bỏ lỡ cơ hội. Hợp cho những ván đầu tiên.",
 "Plays its strongest cards and mostly gathers evidence.":"Dùng các lá mạnh nhất và chủ yếu lo thu chứng cứ.",
 "Attacks your evidence, picks off sleeping characters and guards with care.":"Tấn công chứng cứ của bạn, hạ các nhân vật đang ngủ và đỡ đòn cẩn thận.",
 "Card images were not found. To see them, keep this HTML file next to your":"Không tìm thấy ảnh lá bài. Để xem ảnh, hãy để tệp HTML này cạnh thư mục",
 "folder (with the CT-D01 to CT-D07 subfolders) and open it from there. The game works without them.":"(chứa các thư mục con CT-D01 đến CT-D07) và mở nó từ đó. Trò chơi vẫn chạy được khi không có ảnh.",
 "Choose your deck, and which deck the bot plays. You play first or second by coin toss, start with 5 cards and one redraw, and win by gathering enough evidence and solving the case in its solution phase.":"Chọn bộ bài của bạn và bộ bài mà bot dùng. Bạn đi trước hoặc đi sau bằng tung đồng xu, bắt đầu với 5 lá và một lần rút lại, và thắng bằng cách thu đủ chứng cứ rồi phá án ở giai đoạn giải đáp.",
 "You win.":"Bạn thắng.","You lose.":"Bạn thua.","Opening hand":"Bài khởi đầu","Keep this hand":"Giữ bài này",
 "Tap the cards in your Hand area that you want to put back and redraw, or keep your hand. You may do this once.":"Chạm vào các lá trong vùng Bài trên tay mà bạn muốn trả lại để rút lại, hoặc giữ nguyên bài. Bạn chỉ được làm một lần.",
 "Nothing has been removed yet.":"Chưa có lá nào bị loại bỏ.","Close":"Đóng","Game log":"Nhật ký ván","Opponent":"Đối thủ","You":"Bạn","Enlarge":"Phóng to",
 "Next Hint":"Gợi ý kế tiếp","Assist":"Hỗ trợ","Case Solved":"Phá án","Evidence Destruction":"Tiêu hủy chứng cứ","Deduce":"Suy luận","Action":"Hành động","Ability":"Năng lực","Skip playing":"Bỏ qua việc đánh bài","End turn":"Kết thúc lượt","Greyed out because:":"Bị làm mờ vì:",
 "Level":"Cấp","Current AP":"AP hiện tại","Status":"Trạng thái","Traits":"Đặc điểm","Event":"Sự kiện","Not applicable":"Không áp dụng","None":"Không có","No additional card text.":"Không có nội dung bài bổ sung.","Standard case":"Vụ án thông thường","Alternative win condition":"Điều kiện thắng khác",
 "Details":"Chi tiết","Card":"Lá bài",
 /* traits */
 "Police":"Cảnh sát","Phantom thief":"Siêu trộm","Magistrate":"Quan tòa","Suzuki family":"Gia đình Suzuki","Detective":"Thám tử","Mouri Detective Agency":"Văn phòng thám tử Mouri","High schooler":"Học sinh cấp ba","Karate":"Karate","Inventor":"Nhà phát minh","Scientist":"Nhà khoa học","FBI":"FBI","Akai family":"Gia đình Akai","CIA":"CIA","Shogi player":"Kỳ thủ shogi","Metropolitan Police":"Cảnh sát Thủ đô","Public Security":"Công an",
 /* deck text */
 "Blue. Fast Swift and Assault attackers, many Cut-ins, and big removal effects.":"Xanh dương. Các nhân vật tấn công nhanh với Nhanh nhẹn và Đột kích, nhiều Cut-in và các hiệu ứng loại bỏ mạnh.",
 "Black. Powerful removal, Rum's team boost, and Evidence Destruction to win.":"Đen. Loại bỏ mạnh, tăng sức mạnh cho cả đội của Rum, và Tiêu hủy chứng cứ để thắng.",
 "Green. Heiji and Kazuha put opposing characters to sleep, Heizo blocks Cut-ins, and Shizuka hands out Assault.":"Xanh lá. Heiji và Kazuha cho nhân vật đối phương đi ngủ, Heizo chặn Cut-in, và Shizuka trao Đột kích.",
 "White. Stun effects keep opposing characters down longer, plus Makoto's tough comeback and Hakuba's card draw.":"Trắng. Hiệu ứng làm choáng giữ nhân vật đối phương gục lâu hơn, cùng khả năng lội ngược dòng bền bỉ của Makoto và việc rút bài của Hakuba.",
 "Red (CT-D04). FBI attackers with unguardable Actions, case-hitting bonuses and hand disruption.":"Đỏ (CT-D04). Các nhân vật FBI tấn công bằng Hành động không thể đỡ, thưởng khi đánh vào vụ án và phá bài trên tay đối thủ.",
 "Yellow (CT-D05). Public Security and Metropolitan Police: team AP boosts and bringing characters back from the Remove area.":"Vàng (CT-D05). Công an và Cảnh sát Thủ đô: tăng AP cho cả đội và đưa nhân vật quay lại từ Khu loại bỏ.",
 /* card texts */
 "Evidence needed: 7 if you go first, 6 if you go second.":"Cần có chứng cứ: 7 nếu bạn đi trước, 6 nếu bạn đi sau.",
 "Evidence needed: 7 if you go first, 6 if you go second. Your partner's Case Solved becomes Evidence Destruction: in the solution phase, sleep the partner and remove evidence equal to the case level. The opponent then loses.":"Cần có chứng cứ: 7 nếu bạn đi trước, 6 nếu bạn đi sau. Phá án của cộng sự trở thành Tiêu hủy chứng cứ: ở giai đoạn giải đáp, cho cộng sự ngủ và loại bỏ số chứng cứ bằng cấp của vụ án. Sau đó đối thủ thua.",
 "Swift: can deduce or take Actions the turn it enters.":"Nhanh nhẹn: có thể suy luận hoặc dùng Hành động ngay trong lượt nó vào.",
 "Assault: can take Actions the turn it enters.":"Đột kích: có thể dùng Hành động ngay trong lượt nó vào.",
 "Declare, once per turn: sleep another of your characters to draw 1, remove 1 card from hand, and give this +1 LP this turn. Flash: draw 1.":"Tuyên bố, một lần mỗi lượt: cho một nhân vật khác của bạn ngủ để rút 1 lá, loại bỏ 1 lá từ tay, và cho lá này +1 LP trong lượt này. Linh cảm: rút 1 lá.",
 "On entry: you may remove 1 card from hand. If you do, remove up to 1 character with AP 8000 or less.":"Khi vào: bạn có thể loại bỏ 1 lá từ tay. Nếu làm vậy, loại bỏ tối đa 1 nhân vật có AP từ 8000 trở xuống.",
 "Declare, once per turn, and on entry: up to 1 character gets +1000 AP this turn. Flash: draw 1.":"Tuyên bố, một lần mỗi lượt, và khi vào: tối đa 1 nhân vật được +1000 AP trong lượt này. Linh cảm: rút 1 lá.",
 "Cut-in: during a Contact, remove from hand to give +2000 AP.":"Cut-in: trong một Tiếp xúc, loại bỏ từ tay để cộng +2000 AP.",
 "On entry: you may enter a Detective Boys character of level 4 or less from hand, asleep. If you do not, up to 1 character gets +1000 AP this turn.":"Khi vào: bạn có thể cho một nhân vật Thám tử nhí cấp 4 trở xuống từ tay vào Hiện trường, ở trạng thái ngủ. Nếu không, tối đa 1 nhân vật được +1000 AP trong lượt này.",
 "Cut-in: +1000 AP.":"Cut-in: +1000 AP.","Cut-in: +2000 AP.":"Cut-in: +2000 AP.","Misdirect 1. Cut-in: +1000 AP.":"Đánh lạc hướng 1. Cut-in: +1000 AP.",
 "Remove up to 1 character with AP 8000 or less.":"Loại bỏ tối đa 1 nhân vật có AP từ 8000 trở xuống.",
 "Declare: sleep this character and put it on the bottom of your deck. Enter a character of level 5 or less from hand and give it Assault this turn. Flash: sleep up to 1 character.":"Tuyên bố: cho nhân vật này ngủ và đặt nó xuống đáy bộ bài. Cho một nhân vật cấp 5 trở xuống từ tay vào Hiện trường và trao nó Đột kích trong lượt này. Linh cảm: cho tối đa 1 nhân vật ngủ.",
 "When removed from Scene during the opponent's turn: remove up to 1 opposing character of level 4 or less. If you do, the opponent draws 1.":"Khi bị loại bỏ khỏi Hiện trường trong lượt của đối thủ: loại bỏ tối đa 1 nhân vật đối phương cấp 4 trở xuống. Nếu làm vậy, đối thủ rút 1 lá.",
 "During your turn: when this contacts a character of level 6 or less, remove that character. Flash: draw 1.":"Trong lượt của bạn: khi lá này Tiếp xúc với một nhân vật cấp 6 trở xuống, loại bỏ nhân vật đó. Linh cảm: rút 1 lá.",
 "When this takes an Action: it gets +1000 AP until the Action ends for each sleeping or stunned character in the opponent's Scene. Flash: draw 1.":"Khi lá này dùng Hành động: nó được +1000 AP cho đến hết Hành động với mỗi nhân vật đang ngủ hoặc bị choáng ở Hiện trường của đối thủ. Linh cảm: rút 1 lá.",
 "Once per turn: when this or a card named Heiji Hattori enters your Scene, sleep up to 1 character. Flash: sleep up to 1 character.":"Một lần mỗi lượt: khi lá này hoặc một lá tên Heiji Hattori vào Hiện trường của bạn, cho tối đa 1 nhân vật ngủ. Linh cảm: cho tối đa 1 nhân vật ngủ.",
 "When this takes an Action: the opponent cannot use Cut-in until the Action ends. When an opposing character is removed by a Contact with this, draw 1. Flash: draw 1.":"Khi lá này dùng Hành động: đối thủ không thể dùng Cut-in cho đến hết Hành động. Khi một nhân vật đối phương bị loại bỏ bởi Tiếp xúc với lá này, rút 1 lá. Linh cảm: rút 1 lá.",
 "Declare, once per turn, remove 1 card from hand: give another of your characters of level 6 or less Assault until end of turn. Can only be declared while the opponent has 2 or more sleeping or stunned characters in total.":"Tuyên bố, một lần mỗi lượt, loại bỏ 1 lá từ tay: trao Đột kích đến hết lượt cho một nhân vật khác của bạn cấp 6 trở xuống. Chỉ tuyên bố được khi đối thủ có tổng cộng 2 nhân vật trở lên đang ngủ hoặc bị choáng.",
 "On entry: you may remove 1 card from hand. If you do, stun up to 1 character and gain 1 evidence. (Activating a stunned character puts it to sleep instead.)":"Khi vào: bạn có thể loại bỏ 1 lá từ tay. Nếu làm vậy, làm choáng tối đa 1 nhân vật và nhận 1 chứng cứ. (Kích hoạt một nhân vật bị choáng sẽ khiến nó chuyển sang ngủ.)",
 "When removed from Scene during the opponent's turn: stun up to 1 sleeping character of level 5 or less. Flash: draw 1.":"Khi bị loại bỏ khỏi Hiện trường trong lượt của đối thủ: làm choáng tối đa 1 nhân vật đang ngủ cấp 5 trở xuống. Linh cảm: rút 1 lá.",
 "Once per turn: when this deduces or takes an Action, draw 1.":"Một lần mỗi lượt: khi lá này suy luận hoặc dùng Hành động, rút 1 lá.",
 "At the end of your turn: you may remove 1 card from hand. If you do, make this character active. Flash: draw 1.":"Cuối lượt của bạn: bạn có thể loại bỏ 1 lá từ tay. Nếu làm vậy, cho nhân vật này hoạt động. Linh cảm: rút 1 lá.",
 "When removed from Scene during the opponent's turn: draw 1. Flash: sleep up to 1 character.":"Khi bị loại bỏ khỏi Hiện trường trong lượt của đối thủ: rút 1 lá. Linh cảm: cho tối đa 1 nhân vật ngủ.",
 "Bullet: this character's Actions cannot be guarded. Flash: draw 1.":"Đạn: Hành động của nhân vật này không thể bị đỡ. Linh cảm: rút 1 lá.",
 "When a character in your Scene takes an Action against a case: this character gains Assault until end of turn. Flash: draw 1.":"Khi một nhân vật ở Hiện trường của bạn dùng Hành động lên một vụ án: nhân vật này có Đột kích đến hết lượt. Linh cảm: rút 1 lá.",
 "Misdirect 1. Once per turn, when an Action by a character in your Scene against a case gains you evidence: you may remove 1 card from hand. If you do, gain 1 evidence.":"Đánh lạc hướng 1. Một lần mỗi lượt, khi một Hành động của nhân vật ở Hiện trường của bạn lên một vụ án giúp bạn nhận chứng cứ: bạn có thể loại bỏ 1 lá từ tay. Nếu làm vậy, nhận 1 chứng cứ.",
 "When removed from Scene during the opponent's turn: the opponent removes 1 card from hand. Flash: sleep up to 1 character.":"Khi bị loại bỏ khỏi Hiện trường trong lượt của đối thủ: đối thủ loại bỏ 1 lá từ tay. Linh cảm: cho tối đa 1 nhân vật ngủ.",
 "On entry: the opponent reveals their hand (then returns it). Flash: draw 1.":"Khi vào: đối thủ lật bài trên tay của họ (rồi cầm lại). Linh cảm: rút 1 lá.",
 /* prompts */
 "Choose a card from your hand to remove.":"Chọn một lá từ tay để loại bỏ.","Cancel":"Hủy","Do not use":"Không dùng","Do not enter":"Không cho vào","Do not guard":"Không đỡ","Back":"Quay lại","Pass":"Bỏ qua","No":"Không","Remove a card":"Loại bỏ một lá","Activate":"Kích hoạt","Skip":"Bỏ qua","Add nothing":"Không lấy lá nào","Enter nothing":"Không cho lá nào vào",
 "You pass.":"Bạn bỏ qua.","Your Scene is full":"Hiện trường của bạn đã đầy",
 "Kid: stun a sleeping character?":"Kid: làm choáng một nhân vật đang ngủ?","Up to 1 sleeping character of level 5 or less.":"Tối đa 1 nhân vật đang ngủ cấp 5 trở xuống.",
 "Rye: remove an opposing character?":"Rye: loại bỏ một nhân vật đối phương?","Level 4 or less. If you remove one, the opponent draws 1.":"Cấp 4 trở xuống. Nếu bạn loại bỏ một nhân vật, đối thủ rút 1 lá.",
 "If you do, enter a character of level 4 or less from your Remove area, asleep.":"Nếu làm vậy, cho một nhân vật cấp 4 trở xuống từ Khu loại bỏ của bạn vào Hiện trường, ở trạng thái ngủ.",
 "Enter which character from your Remove area?":"Cho nhân vật nào từ Khu loại bỏ vào Hiện trường?","Level 4 or less, entering asleep.":"Cấp 4 trở xuống, vào ở trạng thái ngủ.",
 "Kazuha: sleep a character?":"Kazuha: cho một nhân vật ngủ?","Once per turn, when she or Heiji Hattori enters your Scene. Up to 1 character, either side.":"Một lần mỗi lượt, khi cô ấy hoặc Heiji Hattori vào Hiện trường của bạn. Tối đa 1 nhân vật, bên nào cũng được.",
 "If you do, stun up to 1 character and gain 1 evidence.":"Nếu làm vậy, làm choáng tối đa 1 nhân vật và nhận 1 chứng cứ.",
 "Up to 1 character, either side. Stunned characters become sleeping instead of active in the Auto phase.":"Tối đa 1 nhân vật, bên nào cũng được. Nhân vật bị choáng sẽ chuyển sang ngủ thay vì hoạt động trong giai đoạn Tự động.",
 "If you do, you may then remove one character with AP 8000 or less, from either side.":"Nếu làm vậy, bạn có thể loại bỏ một nhân vật có AP từ 8000 trở xuống, của bên nào cũng được.",
 "Remove which character?":"Loại bỏ nhân vật nào?","AP 8000 or less, either side.":"AP từ 8000 trở xuống, bên nào cũng được.",
 "Up to 1 character, either side, until end of turn.":"Tối đa 1 nhân vật, bên nào cũng được, đến hết lượt.",
 "Dr. Agasa: enter a Detective Boys character?":"Dr. Agasa: cho một nhân vật Thám tử nhí vào Hiện trường?","You may enter one of level 4 or less from your hand, asleep.":"Bạn có thể cho một nhân vật cấp 4 trở xuống từ tay vào Hiện trường, ở trạng thái ngủ.","Do not enter":"Không cho vào",
 "Add up to 1 of them to your hand. The rest go to the bottom of your deck.":"Thêm tối đa 1 lá trong số đó vào tay bạn. Các lá còn lại xuống đáy bộ bài.",
 "Enter up to 1 character of level 4 or less, asleep. The rest go to the bottom of your deck.":"Cho tối đa 1 nhân vật cấp 4 trở xuống vào Hiện trường, ở trạng thái ngủ. Các lá còn lại xuống đáy bộ bài.",
 "This card was removed from your evidence by an Action. Activate it?":"Lá này bị loại bỏ khỏi chứng cứ của bạn bởi một Hành động. Kích hoạt nó?","Flash: sleep which character?":"Linh cảm: cho nhân vật nào ngủ?","Up to 1 character, either side.":"Tối đa 1 nhân vật, bên nào cũng được.",
 "You used Next Hint this turn, so you cannot play from hand.":"Bạn đã dùng Gợi ý kế tiếp trong lượt này, nên không thể đánh bài từ tay.",
 "You already played from hand this turn. It is limited to once per turn.":"Bạn đã đánh bài từ tay trong lượt này. Chỉ được một lần mỗi lượt.",
 "Misdirect?":"Đánh lạc hướng?",
 "Case Solved needs your case in its solution phase. Get there with an Assist while holding 7 or more FILE cards.":"Phá án cần vụ án của bạn ở giai đoạn giải đáp. Hãy đạt được điều đó bằng một lần Hỗ trợ khi giữ 7 lá FILE trở lên.",
 "Case Solved needs an active partner.":"Phá án cần một cộng sự đang hoạt động.",
 "Conan's ability needs another active character to sleep.":"Năng lực của Conan cần một nhân vật khác đang hoạt động để cho ngủ.",
 "Shizuka's ability needs a card in hand to remove.":"Năng lực của Shizuka cần một lá trên tay để loại bỏ.",
 "Shizuka's ability needs 2 or more sleeping or stunned characters in the opponent's Scene.":"Năng lực của Shizuka cần 2 nhân vật trở lên đang ngủ hoặc bị choáng ở Hiện trường của đối thủ.",
 "Shizuka needs another character of level 6 or less in your Scene.":"Shizuka cần một nhân vật khác cấp 6 trở xuống ở Hiện trường của bạn.",
 "Vermouth must be active to use her ability.":"Vermouth phải đang hoạt động để dùng năng lực của mình.",
 "Vermouth's ability needs a level 5 or lower character in your hand.":"Năng lực của Vermouth cần một nhân vật cấp 5 trở xuống trên tay bạn.",
 "Cost: put another of your active characters to sleep.":"Chi phí: cho một nhân vật đang hoạt động khác của bạn ngủ.",
 "Level 6 or less. First remove 1 card from your hand as the cost.":"Cấp 6 trở xuống. Trước tiên hãy loại bỏ 1 lá từ tay bạn làm chi phí.",
 "Level 5 or less. It gets Assault this turn.":"Cấp 5 trở xuống. Nó có Đột kích trong lượt này.",
 "Conan gets +1 LP this turn.":"Conan được +1 LP trong lượt này.",
 "Play one Cut-in from hand or pass. Each player acts at most once per Contact.":"Đánh một lá Cut-in từ tay hoặc bỏ qua. Mỗi người chơi hành động tối đa một lần trong mỗi Tiếp xúc.",
 "Guarding puts the guard to sleep and starts a Contact with it. The guard is removed if the attacker's AP is equal or higher. Any active character can guard, even one that just arrived.":"Đỡ đòn khiến nhân vật đỡ đi ngủ và bắt đầu một Tiếp xúc với nó. Nhân vật đỡ bị loại bỏ nếu AP của bên tấn công bằng hoặc cao hơn. Mọi nhân vật đang hoạt động đều đỡ được, kể cả nhân vật vừa vào.",
 "If you do, gain 1 evidence.":"Nếu làm vậy, nhận 1 chứng cứ.",
 "Opponent uses Next Hint.":"Đối thủ dùng Gợi ý kế tiếp.",
 "You use Next Hint: the top FILE card goes to your hand.":"Bạn dùng Gợi ý kế tiếp: lá FILE trên cùng được đưa vào tay bạn.","You skip the play.":"Bạn bỏ qua việc đánh bài.",
 "Assist: the partner sleeps in the FILE area and counts as a FILE card. With 7 or more FILE cards your case moves to the solution phase.":"Hỗ trợ: cộng sự ngủ trong Khu FILE và được tính là một lá FILE. Khi có 7 lá FILE trở lên, vụ án của bạn chuyển sang giai đoạn giải đáp.",
 "Use which ability?":"Dùng năng lực nào?","Declare abilities can be used once per turn, even the turn the character enters.":"Năng lực Tuyên bố dùng được một lần mỗi lượt, kể cả trong lượt nhân vật vào.",
 "Deduce with which card?":"Suy luận bằng lá nào?","It goes to sleep and you gain evidence equal to its LP, taken from the top of your deck. The opponent may use Misdirect.":"Nó đi ngủ và bạn nhận chứng cứ bằng LP của nó, lấy từ trên cùng bộ bài của bạn. Đối thủ có thể dùng Đánh lạc hướng.",
 "Evidence cards come face down from your deck. Watch your deck size: running out means a refresh.":"Chứng cứ là các lá úp lấy từ bộ bài của bạn. Hãy để ý số lá còn lại: hết bài nghĩa là phải làm mới.",
 "Take an Action with which character?":"Dùng Hành động với nhân vật nào?","The character goes to sleep. The opponent may guard before anything else happens.":"Nhân vật đi ngủ. Đối thủ có thể đỡ đòn trước khi có gì khác xảy ra.",
 "You can only target the opposing case if it has evidence, or an opposing character that is sleeping.":"Bạn chỉ có thể nhắm vào vụ án đối phương nếu nó có chứng cứ, hoặc một nhân vật đối phương đang ngủ.",
 "Main phase: play, deduce, take Actions, or end your turn.":"Giai đoạn Chính: đánh bài, suy luận, dùng Hành động, hoặc kết thúc lượt.",
 "Needs":"Cần",
 "Next Hint needs at least 1 card in your FILE area.":"Gợi ý kế tiếp cần ít nhất 1 lá trong Khu FILE của bạn.","Assist needs an active partner.":"Hỗ trợ cần một cộng sự đang hoạt động.",
 "Deduce needs an active partner, or an active character that did not just arrive unless it has Swift.":"Suy luận cần một cộng sự đang hoạt động, hoặc một nhân vật đang hoạt động không phải vừa vào, trừ khi nó có Nhanh nhẹn.",
 "Action needs an active character that did not just arrive unless it has Swift or Assault.":"Hành động cần một nhân vật đang hoạt động không phải vừa vào, trừ khi nó có Nhanh nhẹn hoặc Đột kích.",
 "There is no target: the opposing case has no evidence and no opposing character is sleeping.":"Không có mục tiêu: vụ án đối phương không có chứng cứ và không có nhân vật đối phương nào đang ngủ.",
 "None of your characters in Scene has a Declare ability.":"Không nhân vật nào của bạn ở Hiện trường có năng lực Tuyên bố."
};
var RULES=[];
function RU(re,fn){RULES.push([re,fn])}
var CW="(blue|black|green|white|red|yellow)";
RU(/^On entry: look at your top 4, add up to 1 (\w+) card to hand, put the rest on the bottom, then remove 1 card from hand if you added one\. Flash: draw 1\.$/,function(m){return "Khi vào: xem 4 lá trên cùng bộ bài, thêm tối đa 1 lá màu "+(COL[m[1]]||m[1])+" vào tay, đặt phần còn lại xuống đáy, rồi loại bỏ 1 lá từ tay nếu bạn đã thêm một lá. Linh cảm: rút 1 lá."});
RU(/^Look at your top 3, add up to 1 (\w+) character to hand, put the rest on the bottom\. Then enter a (\w+) character from hand whose level is at most your FILE count\.$/,function(m){return "Xem 3 lá trên cùng bộ bài, thêm tối đa 1 nhân vật màu "+(COL[m[1]]||m[1])+" vào tay, đặt phần còn lại xuống đáy. Sau đó cho một nhân vật màu "+(COL[m[2]]||m[2])+" từ tay có cấp không cao hơn số lá FILE của bạn vào Hiện trường."});
RU(/^When removed from Scene during the opponent's turn: look at your top 3, enter up to 1 (\w+) character of level 4 or less asleep, put the rest on the bottom\. Flash: sleep up to 1 character\.$/,function(m){return "Khi bị loại bỏ khỏi Hiện trường trong lượt của đối thủ: xem 3 lá trên cùng bộ bài, cho tối đa 1 nhân vật màu "+(COL[m[1]]||m[1])+" cấp 4 trở xuống vào Hiện trường ở trạng thái ngủ, đặt phần còn lại xuống đáy. Linh cảm: cho tối đa 1 nhân vật ngủ."});
RU(/^During your turn: your other (\w+) characters get \+1000 AP\. Flash: draw 1\.$/,function(m){return "Trong lượt của bạn: các nhân vật màu "+(COL[m[1]]||m[1])+" khác của bạn được +1000 AP. Linh cảm: rút 1 lá."});
RU(/^On entry: you may remove 1 card from hand\. If you do, enter a (\w+) character of level 4 or less from your Remove area, asleep\.$/,function(m){return "Khi vào: bạn có thể loại bỏ 1 lá từ tay. Nếu làm vậy, cho một nhân vật màu "+(COL[m[1]]||m[1])+" cấp 4 trở xuống từ Khu loại bỏ của bạn vào Hiện trường, ở trạng thái ngủ."});
/* interface with numbers */
RU(/^(You|Opponent) · (.+)$/,function(m){return S(m[1])+" · "+m[2]});
RU(/^Turn (\d+) · (Your turn|Opponent's turn)$/,function(m){return "Lượt "+m[1]+" · "+(m[2]==="Your turn"?"Lượt của bạn":"Lượt của đối thủ")});
RU(/^Hand \((\d+)\)$/,function(m){return "Bài trên tay ("+m[1]+")"});
RU(/^Opponent hand \((\d+)\)$/,function(m){return "Bài trên tay đối thủ ("+m[1]+")"});
RU(/^(Active|Sleeping|In FILE area) · LP (-?\d+)$/,function(m){return EX[m[1]]+" · LP "+m[2]});
RU(/^Level cap (\d+)( \(partner counts\))?$/,function(m){return "Giới hạn cấp "+m[1]+(m[2]?" (tính cả cộng sự)":"")});
RU(/^(\d+) cards? · view list$/,function(m){return m[1]+" lá · xem danh sách"});
RU(/^Latest: (.+)$/,function(m){return "Mới nhất: "+m[1]});
RU(/^Level (\d+) · AP (-?\d+) · LP (-?\d+)$/,function(m){return "Cấp "+m[1]+" · AP "+m[2]+" · LP "+m[3]});
RU(/^Event · Level (\d+)$/,function(m){return "Sự kiện · Cấp "+m[1]});
RU(/^Partner: (.+)\. Case: (.+)\.$/,function(m){return "Cộng sự: "+m[1]+". Vụ án: "+m[2]+"."});
RU(/^Play (.+)$/,function(m){return "Chơi bộ "+m[1]});
RU(/^Redraw (\d+) cards?$/,function(m){return "Rút lại "+m[1]+" lá"});
RU(/^(Opponent|Your) Remove area$/,function(m){return "Khu loại bỏ của "+(m[1]==="Your"?"bạn":"đối thủ")});
RU(/^· (\d+) cards?, newest first\. The number shows the order they were removed \(1 is the oldest\)\.$/,function(m){return "· "+m[1]+" lá, mới nhất trước. Con số cho biết thứ tự bị loại bỏ (1 là cũ nhất)."});
RU(/^· newest first\.$/,function(){return "· mới nhất trước."});
RU(/^· Level (\d+) · (.*)$/,function(m){return "· Cấp "+m[1]+" · "+m[2]});
RU(/^· Level (\d+)$/,function(m){return "· Cấp "+m[1]});
RU(/^Partner: (.+)$/,function(m){return "Cộng sự: "+m[1]});
RU(/^Case: (.+)$/,function(m){return "Vụ án: "+m[1]});
RU(/^Partner \(LP (\d+)\)\. While active it can deduce, use Assist \(moves to the FILE area\) and declare Case Solved\.$/,function(m){return "Cộng sự (LP "+m[1]+"). Khi đang hoạt động nó có thể suy luận, dùng Hỗ trợ (chuyển vào Khu FILE) và tuyên bố Phá án."});
RU(/^Deduce for LP (\d+)\. Assist moves this card to the FILE area\. Case Solved is available in the solution phase when the evidence requirement is met\.$/,function(m){return "Suy luận với LP "+m[1]+". Hỗ trợ chuyển lá này vào Khu FILE. Phá án dùng được ở giai đoạn giải đáp khi đã đủ chứng cứ."});
RU(/^(Your|Opponent) Remove area$/,function(m){return "Khu loại bỏ của "+(m[1]==="Your"?"bạn":"đối thủ")});
/* messages */
RU(/^(You|Opponent) had to refresh with an empty Remove area\.$/,function(m){return S(m[1])+" phải làm mới khi Khu loại bỏ trống."});
RU(/^(You|Opponent) refresh: the Remove area becomes the new deck, and (the opponent gains|you gain) 1 evidence\.$/,function(m){return S(m[1])+" làm mới: Khu loại bỏ trở thành bộ bài mới, và "+(m[2]==="you gain"?"bạn nhận":"đối thủ nhận")+" 1 chứng cứ."});
RU(/^Auto phase for (you|opponent): activate everything, draw 1, put (\d+) cards? in the FILE area\.$/,function(m){return "Giai đoạn Tự động của "+S(m[1])+": kích hoạt mọi thứ, rút 1 lá, đặt "+m[2]+" lá vào Khu FILE."});
RU(/^(.+) \(Lv (\d+)\)$/,function(m){return m[1]+" (Cấp "+m[2]+")"});
RU(/^(.+) \(event\)$/,function(m){return m[1]+" (sự kiện)"});
RU(/^(.+): remove 1 card from hand$/,function(m){return m[1]+": loại bỏ 1 lá từ tay"});
RU(/^(.+): you must remove 1 card from hand$/,function(m){return m[1]+": bạn phải loại bỏ 1 lá từ tay"});
RU(/^(.+): (you|opponent) must remove 1 card from hand\.$/,function(m){return m[1]+": "+S(m[2])+" phải loại bỏ 1 lá từ tay."});
RU(/^(.+): remove a card from hand\?$/,function(m){return m[1]+": loại bỏ một lá từ tay?"});
RU(/^(You|Opponent) removes? (.+?) from hand( to use (.+))?\.$/,function(m){return S(m[1])+" loại bỏ "+m[2]+" từ tay"+(m[4]?" để dùng "+m[4]:"")+"."});
function why(w){if(w==="switch")return "đổi chỗ";if(w==="lost the Contact")return "thua Tiếp xúc";var e=/^(.+)'s effect$/.exec(w);return e?"hiệu ứng của "+e[1]:w}
RU(/^(.+) is removed from (the opponent's|your) Scene(?: \((.+)\))?\.$/,function(m){return m[1]+" bị loại bỏ khỏi Hiện trường "+(m[2]==="your"?"của bạn":"của đối thủ")+(m[3]?" ("+why(m[3])+")":"")+"."});
RU(/^(You|Opponent) draws? (\d+) cards?(?: \((Jirokichi|Hakuba|Heizo)\))?\.$/,function(m){return S(m[1])+" rút "+m[2]+" lá"+(m[3]?" ("+m[3]+")":"")+"."});
RU(/^(.+) is stunned\.$/,function(m){return m[1]+" bị choáng."});
RU(/^Switch out one character to enter (.+)\.$/,function(m){return "Loại bỏ một nhân vật để cho "+m[1]+" vào Hiện trường."});
RU(/^Remove (.+)$/,function(m){return "Loại bỏ "+m[1]});
RU(/^(You|Opponent) enters? (.+) \(level (\d+)\)( asleep)?\.$/,function(m){return S(m[1])+" cho "+m[2]+" (cấp "+m[3]+") vào Hiện trường"+(m[4]?" ở trạng thái ngủ":"")+"."});
RU(/^(You|Opponent) reveals? (your|their) hand: (.*)\.$/,function(m){return S(m[1])+" lật bài trên tay: "+(m[3]==="no cards"?"không có lá nào":m[3])+"."});
RU(/^(.+) falls asleep(?: \(Kazuha\))?\.$/,function(m){return m[1]+" đi ngủ"+(/\(Kazuha\)/.test(m[0])?" (Kazuha)":"")+"."});
RU(/^(.+): stun which character\?$/,function(m){return m[1]+": làm choáng nhân vật nào?"});
RU(/^(You|Opponent) gains? (\d+) evidence\.$/,function(m){return S(m[1])+" nhận "+m[2]+" chứng cứ."});
RU(/^(You|Opponent) gains? 1 more evidence \((.+)\)\.$/,function(m){return S(m[1])+" nhận thêm 1 chứng cứ ("+m[2]+")."});
RU(/^(.+): \+1000 AP to which character\?$/,function(m){return m[1]+": +1000 AP cho nhân vật nào?"});
RU(/^(.+) gets \+(\d+) AP (this turn|during this Action)\.$/,function(m){return m[1]+" được +"+m[2]+" AP "+(m[3]==="this turn"?"trong lượt này":"trong Hành động này")+"."});
RU(/^Look at your top (\d+) cards$/,function(m){return "Xem "+m[1]+" lá trên cùng bộ bài của bạn"});
RU(/^(You|Opponent) looks? at the top (\d+) cards and adds? (.+) to hand\.$/,function(m){return S(m[1])+" xem "+m[2]+" lá trên cùng và thêm "+m[3]+" vào tay."});
RU(/^(You|Opponent) looks? at the top (\d+) cards and adds? nothing\.$/,function(m){return S(m[1])+" xem "+m[2]+" lá trên cùng và không thêm lá nào."});
RU(/^(.+): remove which character\?$/,function(m){return m[1]+": loại bỏ nhân vật nào?"});
RU(/^(.+): enter a character$/,function(m){return m[1]+": cho một nhân vật vào Hiện trường"});
RU(/^Level (\d+) or less \(your FILE count\)\.$/,function(m){return "Cấp "+m[1]+" trở xuống (số lá FILE của bạn)."});
RU(/^Flash of insight: (.+)$/,function(m){return "Tia linh cảm: "+m[1]});
RU(/^(You|Opponent) activates? the Flash of insight on (.+)\.$/,function(m){return S(m[1])+" kích hoạt Linh cảm của "+m[2]+"."});
RU(/^Level (\d+) needs (\d+) cards in the FILE area\. You have (\d+)\.$/,function(m){return "Cấp "+m[1]+" cần "+m[2]+" lá trong Khu FILE. Bạn có "+m[3]+"."});
RU(/^(You|Opponent) plays? the event (.+)\.$/,function(m){return S(m[1])+" đánh sự kiện "+m[2]+"."});
RU(/^(You|Opponent) deduces? with (.+) \(LP (-?\d+)\)\.$/,function(m){return S(m[1])+" suy luận bằng "+(m[2]==="partner"?"cộng sự":m[2])+" (LP "+m[3]+")."});
RU(/^Sleep a character with Misdirect to give the deducing card LP -(\d+) until the deduction ends\. Current LP: (-?\d+)\.$/,function(m){return "Cho một nhân vật có Đánh lạc hướng ngủ để lá đang suy luận bị LP -"+m[1]+" cho đến hết lần suy luận. LP hiện tại: "+m[2]+"."});
RU(/^(.+) \(Misdirect (\d+)\)$/,function(m){return m[1]+" (Đánh lạc hướng "+m[2]+")"});
RU(/^(You|Opponent) uses? Misdirect with (.+) \(LP now (\d+)\)\.$/,function(m){return S(m[1])+" dùng Đánh lạc hướng với "+m[2]+" (LP hiện còn "+m[3]+")."});
RU(/^(You|Opponent) uses? Assist: the partner moves to the FILE area\.$/,function(m){return S(m[1])+" dùng Hỗ trợ: cộng sự chuyển vào Khu FILE."});
RU(/^(Your|Opponent's) case moves to the solution phase \(7 or more FILE cards\)\.$/,function(m){return "Vụ án của "+(m[1]==="Your"?"bạn":"đối thủ")+" chuyển sang giai đoạn giải đáp (7 lá FILE trở lên)."});
RU(/^(You|Opponent) used Evidence Destruction, removing (\d+) evidence\. (You lose|The opponent loses)\.$/,function(m){return S(m[1])+" đã dùng Tiêu hủy chứng cứ, loại bỏ "+m[2]+" chứng cứ. "+(m[3]==="You lose"?"Bạn thua.":"Đối thủ thua.")});
RU(/^(You|Opponent) solved the case with (\d+) evidence against level (\d+)\.$/,function(m){return S(m[1])+" đã phá án với "+m[2]+" chứng cứ so với cấp "+m[3]+"."});
RU(/^Case Solved declared with only (\d+) evidence\. It needs (\d+), so nothing happens and the partner falls asleep\.$/,function(m){return "Tuyên bố Phá án chỉ với "+m[1]+" chứng cứ. Cần "+m[2]+", nên không có gì xảy ra và cộng sự đi ngủ."});
RU(/^Evidence Destruction needs (\d+) evidence to remove as its cost\. You have (\d+)\.$/,function(m){return "Tiêu hủy chứng cứ cần "+m[1]+" chứng cứ để loại bỏ làm chi phí. Bạn có "+m[2]+"."});
RU(/^(.+) already used its ability this turn\.$/,function(m){return m[1]+" đã dùng năng lực của mình trong lượt này."});
RU(/^(.+): sleep which character\?$/,function(m){return m[1]+": cho nhân vật nào ngủ?"});
RU(/^(You|Opponent) sleeps? (.+) to use Conan's ability\.$/,function(m){return S(m[1])+" cho "+m[2]+" ngủ để dùng năng lực của Conan."});
RU(/^(You|Opponent) uses? Ran's ability\.$/,function(m){return S(m[1])+" dùng năng lực của Ran."});
RU(/^(.+): give Assault to which character\?$/,function(m){return m[1]+": trao Đột kích cho nhân vật nào?"});
RU(/^(.+) gains Assault this turn\.$/,function(m){return m[1]+" có Đột kích trong lượt này."});
RU(/^(You|Opponent) puts? Vermouth on the bottom of the deck\.$/,function(m){return S(m[1])+" đặt Vermouth xuống đáy bộ bài."});
RU(/^Gin's ability triggers: (.+) \(level (\d+)\) is removed on contact\.$/,function(m){return "Năng lực của Gin được kích hoạt: "+m[1]+" (cấp "+m[2]+") bị loại bỏ khi Tiếp xúc."});
RU(/^Contact: (.+) \(AP (\d+)\) vs (.+) \(AP (\d+)\)\. (You|Opponent) can act first because (equal AP puts the non-turn player first|the lower AP goes first)\.$/,function(m){return "Tiếp xúc: "+m[1]+" (AP "+m[2]+") đấu với "+m[3]+" (AP "+m[4]+"). "+S(m[5])+" hành động trước "+(m[6].indexOf("equal")===0?"vì AP bằng nhau nên người không có lượt đi trước.":"vì AP thấp hơn được đi trước.")});
RU(/^(You|Opponent) cannot use Cut-in during this Action\.$/,function(m){return S(m[1])+" không thể dùng Cut-in trong Hành động này."});
RU(/^Contact: your (.+) has AP (\d+) against (\d+)$/,function(m){return "Tiếp xúc: "+m[1]+" của bạn có AP "+m[2]+" so với "+m[3]});
RU(/^(.+) \(Cut-in \+(\d+)\)$/,function(m){return m[1]+" (Cut-in +"+m[2]+")"});
RU(/^(You|Opponent) plays? the Cut-in (.+) \(AP \+(\d+)\)\.$/,function(m){return S(m[1])+" đánh Cut-in "+m[2]+" (AP +"+m[3]+")."});
RU(/^Result: attacker AP (\d+) vs (\d+)\. (.+) is removed\.$/,function(m){return "Kết quả: AP bên tấn công "+m[1]+" so với "+m[2]+". "+m[3]+" bị loại bỏ."});
RU(/^Result: attacker AP (\d+) vs (\d+)\. Nothing happens\.$/,function(m){return "Kết quả: AP bên tấn công "+m[1]+" so với "+m[2]+". Không có gì xảy ra."});
RU(/^Opponent's (.+) \(AP (\d+)\) attacks (your case|your sleeping (.+))\. Guard\?$/,function(m){return m[1]+" của đối thủ (AP "+m[2]+") tấn công "+(m[4]?"nhân vật đang ngủ "+m[4]+" của bạn":"vụ án của bạn")+". Đỡ đòn?"});
RU(/^(You|Opponent) takes? an Action with (.+) against (the opposing case|the sleeping (.+))\.$/,function(m){return S(m[1])+" dùng Hành động với "+m[2]+" nhắm vào "+(m[4]?"nhân vật đang ngủ "+m[4]:"vụ án đối phương")+"."});
RU(/^(.+) has Bullet: this Action cannot be guarded\.$/,function(m){return m[1]+" có Đạn: Hành động này không thể bị đỡ."});
RU(/^(You|Opponent) guards? with (.+)\.$/,function(m){return S(m[1])+" đỡ đòn bằng "+m[2]+"."});
RU(/^Not guarded: the top evidence card of the opposing case is removed, and (you|opponent) gains? 1 evidence\.$/,function(m){return "Không bị đỡ: lá chứng cứ trên cùng của vụ án đối phương bị loại bỏ, và "+S(m[1])+" nhận 1 chứng cứ."});
RU(/^(You|Opponent) declares (Evidence Destruction|Case Solved)\.$/,function(m){return S(m[1])+" tuyên bố "+(m[2]==="Case Solved"?"Phá án":"Tiêu hủy chứng cứ")+"."});
RU(/^(You|Opponent) ends? (the|your) turn\.$/,function(m){return S(m[1])+" kết thúc "+(m[2]==="the"?"lượt":"lượt của mình")+"."});
RU(/^(.+): remove a card to become active\?$/,function(m){return m[1]+": loại bỏ một lá để trở lại hoạt động?"});
RU(/^At the end of your turn you may remove 1 card from hand to make this character active( \(a stunned character becomes sleeping instead\))?\.$/,function(m){return "Cuối lượt của bạn, bạn có thể loại bỏ 1 lá từ tay để cho nhân vật này hoạt động"+(m[1]?" (nhân vật bị choáng sẽ chuyển sang ngủ)":"")+"."});
RU(/^(.+) is (active again|now sleeping)\.$/,function(m){return m[1]+(m[2]==="active again"?" lại hoạt động.":" giờ đang ngủ.")});
RU(/^Played (.+?)\.( It cannot deduce or take Actions this turn(, except it has Swift, so it can\.|, except it has Assault, so it can take Actions\.|, but it can still guard and use abilities\.))?$/,function(m){var t="Đã đánh "+m[1]+".";if(m[2]){t+=" Nó không thể suy luận hay dùng Hành động trong lượt này"+(m[3].indexOf("Swift")>-1?", nhưng nó có Nhanh nhẹn nên làm được.":(m[3].indexOf("Assault")>-1?", nhưng nó có Đột kích nên dùng được Hành động.":", song nó vẫn đỡ đòn và dùng năng lực được."))}return t});
RU(/^Now play one card of level (\d+) or lower, or skip\. The card you just took does not count toward the FILE total, but you may play it\.$/,function(m){return "Bây giờ hãy đánh một lá cấp "+m[1]+" trở xuống, hoặc bỏ qua. Lá bạn vừa lấy không được tính vào tổng số lá FILE, nhưng bạn có thể đánh nó."});
RU(/^Partner (.+) \(LP (\d+)\)$/,function(m){return "Cộng sự "+m[1]+" (LP "+m[2]+")"});
RU(/^Opposing case \((\d+) evidence\)$/,function(m){return "Vụ án đối phương ("+m[1]+" chứng cứ)"});
RU(/^(.+) \(AP (-?\d+), (stunned|sleeping)\)$/,function(m){return m[1]+" (AP "+m[2]+", "+(m[3]==="stunned"?"bị choáng":"đang ngủ")+")"});
RU(/^(.+) \(AP (-?\d+), (sleeping|stunned)$/,function(m){return m[0]});
RU(/^Target of (.+)'s Action$/,function(m){return "Mục tiêu Hành động của "+m[1]});
RU(/^(You|Opponent) redraws? (\d+) cards?\.$/,function(m){return S(m[1])+" rút lại "+m[2]+" lá."});
RU(/^(You go|The opponent goes) first \(coin toss\)\. Case levels: first player (\d+) evidence, second player (\d+)(?: evidence)?\. Each side draws 5 cards\.$/,function(m){return (m[1]==="You go"?"Bạn đi trước":"Đối thủ đi trước")+" (tung đồng xu). Cấp vụ án: người đi trước cần "+m[2]+" chứng cứ, người đi sau cần "+m[3]+". Mỗi bên rút 5 lá."});
RU(/^Opponent evidence: (\d+) → (\d+)\. Your evidence: (\d+) → (\d+)\.$/,function(m){return "Chứng cứ đối thủ: "+m[1]+" → "+m[2]+". Chứng cứ của bạn: "+m[3]+" → "+m[4]+"."});
function tr(c){
  if(EX.hasOwnProperty(c))return EX[c];
  for(var i=0;i<RULES.length;i++){var m=RULES[i][0].exec(c);if(m)return RULES[i][1](m)}
  return c;
}
function V(s){
  if(LANG!=="vi"||typeof s!=="string")return s;
  var m=/^(\s*)([\s\S]*?)(\s*)$/.exec(s);if(!m[2])return s;
  return m[1]+nmz(tr(m[2]))+m[3];
}
function xlate(el){
  if(LANG!=="vi"||!el)return;
  var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false),n,arr=[];
  while(n=w.nextNode())arr.push(n);
  arr.forEach(function(t){var v=V(t.nodeValue);if(v!==t.nodeValue)t.nodeValue=v});
  el.querySelectorAll("[title]").forEach(function(e){e.title=V(e.title)});
}
function setLang(l,fromEvent){
  if(l!=="en"&&l!=="vi")return;LANG=l;
  try{localStorage.setItem("conanLang",l)}catch(e){}
  syncSw();
  if(typeof render==="function")render();
  if(!fromEvent)try{document.dispatchEvent(new CustomEvent("conan-lang",{detail:{lang:l}}))}catch(e){}
}
function syncSw(){var b=document.querySelectorAll("[data-gamelang] button");for(var i=0;i<b.length;i++)b[i].setAttribute("aria-pressed",String(b[i].dataset.l===LANG))}
(function mountSwitch(){
  if(!document.getElementById("conan-lang-css")){var st=document.createElement("style");st.id="conan-lang-css";st.textContent=".plang{display:flex;justify-content:flex-end;align-items:center;gap:0;margin:10px 0 0}.plang span{font:600 .7rem/1 ui-monospace,Menlo,monospace;letter-spacing:.05em;margin-right:8px;opacity:.7}.plang button{font:inherit;font-weight:700;font-size:.8rem;padding:6px 12px;cursor:pointer;border:2px solid #8a5a3c;background:transparent;color:inherit}.plang button:first-of-type{border-radius:6px 0 0 6px}.plang button:last-of-type{border-radius:0 6px 6px 0;border-left-width:0}.plang button[aria-pressed=true]{background:#8a5a3c;color:#fff}";document.head.appendChild(st)}
  var bar=document.createElement("div");bar.className="plang";bar.setAttribute("data-gamelang","1");bar.setAttribute("role","group");bar.setAttribute("aria-label","Language");
  bar.innerHTML='<span>LANG</span><button type="button" data-l="en" aria-pressed="false">EN</button><button type="button" data-l="vi" aria-pressed="false">VI</button>';
  var host=root.parentNode&&root.parentNode.classList&&root.parentNode.classList.contains("pwide")?root.parentNode:root;
  host.parentNode.insertBefore(bar,host);
  bar.addEventListener("click",function(e){var b=e.target.closest("button[data-l]");if(b)setLang(b.dataset.l)});
  syncSw();
})();
document.addEventListener("conan-lang",function(e){if(e.detail&&e.detail.lang&&e.detail.lang!==LANG)setLang(e.detail.lang,true)});
window.addEventListener("storage",function(e){if(e.key==="conanLang"&&e.newValue&&e.newValue!==LANG)setLang(e.newValue,true)});


/* ---------- Card data (read from the two starter deck images) ---------- */
var DECKS={
 conan:{key:"conan",name:"Conan",color:"blue",
  blurb:"Blue. Fast Swift and Assault attackers, many Cut-ins, and big removal effects.",
  partner:{n:"Conan",lp:1},
  caze:{n:"Piano Sonata “Moonlight” Murder Case",lv:[7,6],alt:0,txt:"Evidence needed: 7 if you go first, 6 if you go second."},
  cards:[
   {k:"c7",n:"Conan",lv:7,ap:6000,lp:1,tr:["det","mouri","boys"],x:3,swift:1,txt:"Swift: can deduce or take Actions the turn it enters."},
   {k:"c4",n:"Conan",lv:4,ap:4000,lp:1,tr:["det","mouri","boys"],x:3,decl:"conan4",hira:"draw1",txt:"Declare, once per turn: sleep another of your characters to draw 1, remove 1 card from hand, and give this +1 LP this turn. Flash: draw 1."},
   {k:"shin",n:"Shinichi Kudo",lv:8,ap:7000,lp:2,tr:["det","hs"],x:3,enter:"snipe",txt:"On entry: you may remove 1 card from hand. If you do, remove up to 1 character with AP 8000 or less."},
   {k:"kogoro",n:"Kogoro Mouri",lv:5,ap:5000,lp:0,tr:["det","mouri"],x:3,assault:1,txt:"Assault: can take Actions the turn it enters."},
   {k:"ran6",n:"Ran Mouri",lv:6,ap:6000,lp:0,tr:["hs","mouri","karate"],x:3,decl:"ran6",enter:"boost",hira:"draw1",txt:"Declare, once per turn, and on entry: up to 1 character gets +1000 AP this turn. Flash: draw 1."},
   {k:"ran3",n:"Ran Mouri",lv:3,ap:2000,lp:1,tr:["hs","mouri","karate"],x:3,cutin:2000,txt:"Cut-in: during a Contact, remove from hand to give +2000 AP."},
   {k:"agasa",n:"Dr. Agasa",lv:6,ap:5000,lp:1,tr:["inv"],x:3,enter:"agasa",txt:"On entry: you may enter a Detective Boys character of level 4 or less from hand, asleep. If you do not, up to 1 character gets +1000 AP this turn."},
   {k:"ayumi",n:"Ayumi Yoshida",lv:4,ap:4000,lp:1,tr:["boys"],x:3,cutin:1000,txt:"Cut-in: +1000 AP."},
   {k:"mitsu",n:"Mitsuhiko Tsuburaya",lv:3,ap:2000,lp:1,tr:["boys"],x:3,md:1,cutin:1000,txt:"Misdirect 1. Cut-in: +1000 AP."},
   {k:"genta",n:"Genta Kojima",lv:2,ap:1000,lp:1,tr:["boys"],x:3,cutin:2000,txt:"Cut-in: +2000 AP."},
   {k:"ai5",n:"Ai Haibara",lv:5,ap:5000,lp:1,tr:["boys","sci"],x:3,leave:"haibara",hira:"sleep1",txt:"When removed from Scene during the opponent's turn: look at your top 3, enter up to 1 blue character of level 4 or less asleep, put the rest on the bottom. Flash: sleep up to 1 character."},
   {k:"ai4",n:"Ai Haibara",lv:4,ap:4000,lp:1,tr:["boys","sci"],x:2,enter:"search4",hira:"draw1",txt:"On entry: look at your top 4, add up to 1 blue card to hand, put the rest on the bottom, then remove 1 card from hand if you added one. Flash: draw 1."},
   {k:"ev1",n:"The Detective Who Shrank",t:"e",lv:1,x:2,ev:"search3enter",txt:"Look at your top 3, add up to 1 blue character to hand, put the rest on the bottom. Then enter a blue character from hand whose level is at most your FILE count."},
   {k:"ev5",n:"Ran's Blow",t:"e",lv:5,x:3,ev:"snipeEv",txt:"Remove up to 1 character with AP 8000 or less."}
  ]},
 org:{key:"org",name:"Black Organization",color:"black",
  blurb:"Black. Powerful removal, Rum's team boost, and Evidence Destruction to win.",
  partner:{n:"Sherry",lp:1},
  caze:{n:"Codename: Sherry",lv:[7,6],alt:1,txt:"Evidence needed: 7 if you go first, 6 if you go second. Your partner's Case Solved becomes Evidence Destruction: in the solution phase, sleep the partner and remove evidence equal to the case level. The opponent then loses."},
  cards:[
   {k:"sh2",n:"Sherry",lv:2,ap:1000,lp:1,tr:["org"],x:3,cutin:2000,txt:"Cut-in: during a Contact, remove from hand to give +2000 AP."},
   {k:"gin8",n:"Gin",lv:8,ap:7000,lp:2,tr:["org"],x:3,enter:"snipe",txt:"On entry: you may remove 1 card from hand. If you do, remove up to 1 character with AP 8000 or less."},
   {k:"bourbon",n:"Bourbon",lv:7,ap:6000,lp:1,tr:["org"],x:3,swift:1,txt:"Swift: can deduce or take Actions the turn it enters."},
   {k:"vermouth",n:"Vermouth",lv:6,ap:5000,lp:1,tr:["org"],x:3,decl:"vermouth",hira:"sleep1",txt:"Declare: sleep this character and put it on the bottom of your deck. Enter a character of level 5 or less from hand and give it Assault this turn. Flash: sleep up to 1 character."},
   {k:"rum",n:"Rum",lv:6,ap:6000,lp:1,tr:["org"],x:3,stat:"rum",hira:"draw1",txt:"During your turn: your other black characters get +1000 AP. Flash: draw 1."},
   {k:"vodka",n:"Vodka",lv:5,ap:5000,lp:0,tr:["org"],x:3,assault:1,txt:"Assault: can take Actions the turn it enters."},
   {k:"rye",n:"Rye",lv:5,ap:5000,lp:1,tr:["org"],x:3,leave:"rye",txt:"When removed from Scene during the opponent's turn: remove up to 1 opposing character of level 4 or less. If you do, the opponent draws 1."},
   {k:"kir",n:"Kir",lv:3,ap:2000,lp:1,tr:["org"],x:3,md:1,cutin:1000,txt:"Misdirect 1. Cut-in: +1000 AP."},
   {k:"gin4",n:"Gin",lv:4,ap:4000,lp:1,tr:["org"],x:3,contact:"gin4",hira:"draw1",txt:"During your turn: when this contacts a character of level 6 or less, remove that character. Flash: draw 1."},
   {k:"sh4",n:"Sherry",lv:4,ap:4000,lp:1,tr:["org"],x:2,enter:"search4",hira:"draw1",txt:"On entry: look at your top 4, add up to 1 black card to hand, put the rest on the bottom, then remove 1 card from hand if you added one. Flash: draw 1."},
   {k:"chianti",n:"Chianti",lv:2,ap:1000,lp:1,tr:["org"],x:3,cutin:2000,txt:"Cut-in: +2000 AP."},
   {k:"korn",n:"Korn",lv:3,ap:2000,lp:1,tr:["org"],x:3,cutin:2000,txt:"Cut-in: +2000 AP."},
   {k:"ev5b",n:"“Traitors can't hide their scent...”",t:"e",lv:5,x:3,ev:"snipeEv",txt:"Remove up to 1 character with AP 8000 or less."},
   {k:"ev1b",n:"Shadow of Renya Karasuma",t:"e",lv:1,x:2,ev:"search3enter",txt:"Look at your top 3, add up to 1 black character to hand, put the rest on the bottom. Then enter a black character from hand whose level is at most your FILE count."}
  ]},
 heiji:{key:"heiji",name:"Heiji Hattori",color:"green",
  blurb:"Green. Heiji and Kazuha put opposing characters to sleep, Heizo blocks Cut-ins, and Shizuka hands out Assault.",
  partner:{n:"Heiji Hattori",lp:1},
  caze:{n:"And Then the Mermaid Vanished",lv:[7,6],alt:0,txt:"Evidence needed: 7 if you go first, 6 if you go second."},
  cards:[
   {k:"h8",n:"Heiji Hattori",lv:8,ap:7000,lp:2,tr:["det","hs"],x:3,enter:"snipe",txt:"On entry: you may remove 1 card from hand. If you do, remove up to 1 character with AP 8000 or less."},
   {k:"h7",n:"Heiji Hattori",lv:7,ap:6000,lp:1,tr:["det","hs"],x:3,swift:1,txt:"Swift: can deduce or take Actions the turn it enters."},
   {k:"h4",n:"Heiji Hattori",lv:4,ap:4000,lp:1,tr:["det","hs"],x:3,actbonus:1,hira:"draw1",txt:"When this takes an Action: it gets +1000 AP until the Action ends for each sleeping or stunned character in the opponent's Scene. Flash: draw 1."},
   {k:"kaz6",n:"Kazuha Toyama",lv:6,ap:5000,lp:1,tr:["hs"],x:3,kazuha:1,hira:"sleep1",txt:"Once per turn: when this or a card named Heiji Hattori enters your Scene, sleep up to 1 character. Flash: sleep up to 1 character."},
   {k:"kaz3",n:"Kazuha Toyama",lv:3,ap:2000,lp:1,tr:["hs"],x:3,cutin:2000,txt:"Cut-in: +2000 AP."},
   {k:"oki",n:"Soji Okita",lv:5,ap:5000,lp:0,tr:["hs"],x:3,assault:1,txt:"Assault: can take Actions the turn it enters."},
   {k:"heizo",n:"Heizo Hattori",lv:6,ap:6000,lp:1,tr:["police"],x:3,nocut:1,heizodraw:1,hira:"draw1",txt:"When this takes an Action: the opponent cannot use Cut-in until the Action ends. When an opposing character is removed by a Contact with this, draw 1. Flash: draw 1."},
   {k:"ginshiro",n:"Ginshiro Toyama",lv:3,ap:2000,lp:1,tr:["police"],x:3,md:1,cutin:1000,txt:"Misdirect 1. Cut-in: +1000 AP."},
   {k:"muga",n:"Muga Iori",lv:4,ap:4000,lp:1,tr:["magistrate"],x:3,cutin:1000,txt:"Cut-in: +1000 AP."},
   {k:"momi4",n:"Momiji Ooka",lv:4,ap:4000,lp:1,tr:["hs"],x:2,enter:"search4",hira:"draw1",txt:"On entry: look at your top 4, add up to 1 green card to hand, put the rest on the bottom, then remove 1 card from hand if you added one. Flash: draw 1."},
   {k:"momi2",n:"Momiji Ooka",lv:2,ap:1000,lp:1,tr:["hs"],x:3,cutin:2000,txt:"Cut-in: +2000 AP."},
   {k:"shizuka",n:"Shizuka Hattori",lv:5,ap:5000,lp:1,tr:[],x:3,decl:"shizuka",txt:"Declare, once per turn, remove 1 card from hand: give another of your characters of level 6 or less Assault until end of turn. Can only be declared while the opponent has 2 or more sleeping or stunned characters in total."},
   {k:"ev1h",n:"Omamori (Charm)",t:"e",lv:1,x:2,ev:"search3enter",txt:"Look at your top 3, add up to 1 green character to hand, put the rest on the bottom. Then enter a green character from hand whose level is at most your FILE count."},
   {k:"ev5h",n:"Heiji's Insight",t:"e",lv:5,x:3,ev:"snipeEv",txt:"Remove up to 1 character with AP 8000 or less."}
  ]},
 kid:{key:"kid",name:"Kid the Phantom Thief",color:"white",
  blurb:"White. Stun effects keep opposing characters down longer, plus Makoto's tough comeback and Hakuba's card draw.",
  partner:{n:"Kid the Phantom Thief",lp:1},
  caze:{n:"Reunion",lv:[7,6],alt:0,txt:"Evidence needed: 7 if you go first, 6 if you go second."},
  cards:[
   {k:"k8",n:"Kid the Phantom Thief",lv:8,ap:7000,lp:2,tr:["thief"],x:3,enter:"stungain",txt:"On entry: you may remove 1 card from hand. If you do, stun up to 1 character and gain 1 evidence. (Activating a stunned character puts it to sleep instead.)"},
   {k:"k7",n:"Kid the Phantom Thief",lv:7,ap:6000,lp:1,tr:["thief"],x:3,swift:1,txt:"Swift: can deduce or take Actions the turn it enters."},
   {k:"k4",n:"Kid the Phantom Thief",lv:4,ap:4000,lp:1,tr:["thief"],x:3,leave:"kid4",hira:"draw1",txt:"When removed from Scene during the opponent's turn: stun up to 1 sleeping character of level 5 or less. Flash: draw 1."},
   {k:"aoko",n:"Aoko Nakamori",lv:2,ap:1000,lp:1,tr:["hs"],x:3,cutin:2000,txt:"Cut-in: +2000 AP."},
   {k:"ginzo",n:"Ginzo Nakamori",lv:5,ap:5000,lp:0,tr:["police"],x:3,assault:1,txt:"Assault: can take Actions the turn it enters."},
   {k:"saguru6",n:"Saguru Hakuba",lv:6,ap:5000,lp:1,tr:["det","hs"],x:3,hakdraw:1,txt:"Once per turn: when this deduces or takes an Action, draw 1."},
   {k:"saguru3",n:"Saguru Hakuba",lv:3,ap:2000,lp:1,tr:["det","hs"],x:3,cutin:2000,txt:"Cut-in: +2000 AP."},
   {k:"son4",n:"Sonoko Suzuki",lv:4,ap:4000,lp:1,tr:["hs","suzuki"],x:2,enter:"search4",hira:"draw1",txt:"On entry: look at your top 4, add up to 1 white card to hand, put the rest on the bottom, then remove 1 card from hand if you added one. Flash: draw 1."},
   {k:"son3",n:"Sonoko Suzuki",lv:3,ap:2000,lp:1,tr:["hs","suzuki"],x:3,md:1,cutin:1000,txt:"Misdirect 1. Cut-in: +1000 AP."},
   {k:"makoto",n:"Makoto Kyogoku",lv:6,ap:7000,lp:0,tr:["hs","karate"],x:3,endact:1,hira:"draw1",txt:"At the end of your turn: you may remove 1 card from hand. If you do, make this character active. Flash: draw 1."},
   {k:"tomoko",n:"Tomoko Suzuki",lv:4,ap:4000,lp:1,tr:["suzuki"],x:3,cutin:1000,txt:"Cut-in: +1000 AP."},
   {k:"jiro",n:"Jirokichi Suzuki",lv:5,ap:5000,lp:1,tr:["suzuki"],x:3,leave:"jiro",hira:"sleep1",txt:"When removed from Scene during the opponent's turn: draw 1. Flash: sleep up to 1 character."},
   {k:"ev1k",n:"\u201cLadies and... Gentlemen!!\u201d",t:"e",lv:1,x:2,ev:"search3enter",txt:"Look at your top 3, add up to 1 white character to hand, put the rest on the bottom. Then enter a white character from hand whose level is at most your FILE count."},
   {k:"ev5k",n:"\u201cApril Fool...\u201d",t:"e",lv:5,x:3,ev:"snipeEv",txt:"Remove up to 1 character with AP 8000 or less."}
  ]},
 akai:{key:"akai",name:"Akai",color:"red",
  blurb:"Red (CT-D04). FBI attackers with unguardable Actions, case-hitting bonuses and hand disruption.",
  partner:{n:"Shuichi Akai",lp:1},
  caze:{n:"The Scarlet Return",lv:[7,6],alt:0,txt:"Evidence needed: 7 if you go first, 6 if you go second."},
  cards:[
   {k:"a8",n:"Shuichi Akai",lv:8,ap:7000,lp:2,tr:["fbi","akai"],x:3,enter:"snipe",txt:"On entry: you may remove 1 card from hand. If you do, remove up to 1 character with AP 8000 or less."},
   {k:"a7",n:"Shuichi Akai",lv:7,ap:6000,lp:1,tr:["fbi","akai"],x:3,swift:1,txt:"Swift: can deduce or take Actions the turn it enters."},
   {k:"a4",n:"Shuichi Akai",lv:4,ap:4000,lp:1,tr:["fbi","akai"],x:3,bullet:1,hira:"draw1",txt:"Bullet: this character's Actions cannot be guarded. Flash: draw 1."},
   {k:"mas6",n:"Masumi Sera",lv:6,ap:5000,lp:1,tr:["det","hs","akai"],x:3,masumi:1,hira:"draw1",txt:"When a character in your Scene takes an Action against a case: this character gains Assault until end of turn. Flash: draw 1."},
   {k:"shu",n:"Shukichi Haneda",lv:3,ap:2000,lp:1,tr:["shogi","akai"],x:3,cutin:2000,txt:"Cut-in: during a Contact, remove from hand to give +2000 AP."},
   {k:"mary",n:"Mary Sera",lv:6,ap:6000,lp:1,tr:["akai"],x:3,md:1,mary:1,txt:"Misdirect 1. Once per turn, when an Action by a character in your Scene against a case gains you evidence: you may remove 1 card from hand. If you do, gain 1 evidence."},
   {k:"mas3",n:"Masumi Sera",lv:3,ap:2000,lp:1,tr:["det","hs","akai"],x:3,md:1,cutin:1000,txt:"Misdirect 1. Cut-in: +1000 AP."},
   {k:"hondo",n:"Hidemi Hondo",lv:2,ap:1000,lp:1,tr:["cia"],x:3,cutin:2000,txt:"Cut-in: +2000 AP."},
   {k:"jodie5",n:"Jodie Starling",lv:5,ap:5000,lp:1,tr:["fbi"],x:3,leave:"jodie",hira:"sleep1",txt:"When removed from Scene during the opponent's turn: the opponent removes 1 card from hand. Flash: sleep up to 1 character."},
   {k:"jodie4",n:"Jodie Starling",lv:4,ap:4000,lp:1,tr:["fbi"],x:2,enter:"search4",hira:"draw1",txt:"On entry: look at your top 4, add up to 1 red card to hand, put the rest on the bottom, then remove 1 card from hand if you added one. Flash: draw 1."},
   {k:"james",n:"James Black",lv:4,ap:4000,lp:1,tr:["fbi"],x:3,cutin:1000,txt:"Cut-in: +1000 AP."},
   {k:"camel",n:"Andre Camel",lv:5,ap:5000,lp:0,tr:["fbi"],x:3,assault:1,txt:"Assault: can take Actions the turn it enters."},
   {k:"ev1a",n:"The Mysterious Passenger",t:"e",lv:1,x:2,ev:"search3enter",txt:"Look at your top 3, add up to 1 red character to hand, put the rest on the bottom. Then enter a red character from hand whose level is at most your FILE count."},
   {k:"ev5a",n:"Akai's Shot",t:"e",lv:5,x:3,ev:"snipeEv",txt:"Remove up to 1 character with AP 8000 or less."}
  ]},
 amuro:{key:"amuro",name:"Amuro",color:"yellow",
  blurb:"Yellow (CT-D05). Public Security and Metropolitan Police: team AP boosts and bringing characters back from the Remove area.",
  partner:{n:"Toru Amuro",lp:1},
  caze:{n:"The Scarlet Suspicion",lv:[7,6],alt:0,txt:"Evidence needed: 7 if you go first, 6 if you go second."},
  cards:[
   {k:"f8",n:"Rei Furuya",lv:8,ap:7000,lp:2,tr:["police","koan"],x:3,enter:"snipe",txt:"On entry: you may remove 1 card from hand. If you do, remove up to 1 character with AP 8000 or less."},
   {k:"f7",n:"Rei Furuya",lv:7,ap:6000,lp:1,tr:["police","koan"],x:3,swift:1,txt:"Swift: can deduce or take Actions the turn it enters."},
   {k:"f4",n:"Rei Furuya",lv:4,ap:4000,lp:1,tr:["police","koan"],x:3,enter:"reveal",hira:"draw1",txt:"On entry: the opponent reveals their hand (then returns it). Flash: draw 1."},
   {k:"kuroda",n:"Hyoe Kuroda",lv:6,ap:6000,lp:1,tr:["police","mpd"],x:3,stat:"rum",hira:"draw1",txt:"During your turn: your other yellow characters get +1000 AP. Flash: draw 1."},
   {k:"megure",n:"Juzo Megure",lv:6,ap:5000,lp:1,tr:["police","mpd"],x:3,enter:"megure",txt:"On entry: you may remove 1 card from hand. If you do, enter a yellow character of level 4 or less from your Remove area, asleep."},
   {k:"mat5",n:"Jinpei Matsuda",lv:5,ap:5000,lp:1,tr:["police","mpd"],x:3,leave:"haibara",hira:"sleep1",txt:"When removed from Scene during the opponent's turn: look at your top 3, enter up to 1 yellow character of level 4 or less asleep, put the rest on the bottom. Flash: sleep up to 1 character."},
   {k:"mat3",n:"Jinpei Matsuda",lv:3,ap:2000,lp:1,tr:["police","mpd"],x:3,cutin:2000,txt:"Cut-in: +2000 AP."},
   {k:"kaz5",n:"Yusuke Kazami",lv:5,ap:5000,lp:0,tr:["police","mpd","koan"],x:3,assault:1,txt:"Assault: can take Actions the turn it enters."},
   {k:"kaz2",n:"Yusuke Kazami",lv:2,ap:1000,lp:1,tr:["police","mpd","koan"],x:3,cutin:2000,txt:"Cut-in: +2000 AP."},
   {k:"shira",n:"Ninzaburo Shiratori",lv:3,ap:2000,lp:1,tr:["police","mpd"],x:3,md:1,cutin:1000,txt:"Misdirect 1. Cut-in: +1000 AP."},
   {k:"sato",n:"Miwako Sato",lv:4,ap:4000,lp:1,tr:["police","mpd"],x:2,enter:"search4",hira:"draw1",txt:"On entry: look at your top 4, add up to 1 yellow card to hand, put the rest on the bottom, then remove 1 card from hand if you added one. Flash: draw 1."},
   {k:"taka",n:"Wataru Takagi",lv:4,ap:4000,lp:1,tr:["police","mpd"],x:3,cutin:1000,txt:"Cut-in: +1000 AP."},
   {k:"ev1y",n:"Private Eye",t:"e",lv:1,x:2,ev:"search3enter",txt:"Look at your top 3, add up to 1 yellow character to hand, put the rest on the bottom. Then enter a yellow character from hand whose level is at most your FILE count."},
   {k:"ev5y",n:"Amuro's Strike",t:"e",lv:5,x:3,ev:"snipeEv",txt:"Remove up to 1 character with AP 8000 or less."}
  ]}
};

/* ---------- card images (optional, from a local Card_List folder) ---------- */
var SETS={conan:["CT-D01","D01",null,16],heiji:["CT-D02","D02",null,16],kid:["CT-D03","D03",null,16],akai:["CT-D04","D04",null,16],amuro:["CT-D05","D05",null,16],org:["CT-D07","D07",[2,4,6,8,10,12,14,16,18,19,20,21,22,23],24]};
Object.keys(DECKS).forEach(function(k){
  var S=SETS[k],d=DECKS[k];
  d.set=S[0];d.cardNo=S[1]+("00"+S[3]).slice(-3);d.partnerNo=S[1]+"001";
  var jc={blue:"青",green:"緑",white:"白",red:"赤",yellow:"黄",black:"黒"}[d.color];d.partner.col=[jc];d.cards.forEach(function(c){c.col=[jc]});
  d.cards.forEach(function(c,i){c.set=S[0];c.img=S[1]+("00"+(S[2]?S[2][i]:i+2)).slice(-3)});
});
var BASES=["Card_List/{s}/","Card_List/","Card_list/{s}/","Card list/{s}/","Card_List/Card list/{s}/","Card_List/Card_List/{s}/"];
var baseOK=-1;
function imgUrl(set,no,b){return BASES[b].replace("{s}",set)+no+".webp"}
function cimg(set,no,cls,alt){
  if(set==="remote")return no?'<img class="cimg remote '+cls+'" loading="lazy" referrerpolicy="no-referrer" alt="'+String(alt||"").replace(/"/g,"")+'" src="'+no+'">':"";
  if(!no||baseOK===-2)return "";
  var b=baseOK>=0?baseOK:0;
  return '<img class="cimg '+cls+'" data-b="'+b+'" data-s="'+set+'" data-n="'+no+'" alt="'+(alt||"")+'" src="'+imgUrl(set,no,b)+'">';
}
function probe(){
  var i=0;(function t(){
    var im=new Image();
    im.onload=function(){baseOK=i;if(!G)render()};
    im.onerror=function(){i++;if(i<BASES.length)t();else{baseOK=-2;if(!G)render()}};
    im.src=imgUrl("CT-D01","D01002",i);
  })();
}
root.addEventListener("error",function(e){
  var im=e.target;if(!im||im.tagName!=="IMG"||!im.classList.contains("cimg"))return;
  if(im.classList.contains("remote")){im.style.display="none";return}
  var b=+im.dataset.b+1;
  if(baseOK>=0&&b-1!==baseOK){im.dataset.b=baseOK;im.src=imgUrl(im.dataset.s,im.dataset.n,baseOK);return}
  if(baseOK===-1&&b<BASES.length){im.dataset.b=b;im.src=imgUrl(im.dataset.s,im.dataset.n,b);return}
  if(baseOK===-1)baseOK=-2;
  im.style.display="none";
},true);
root.addEventListener("load",function(e){var im=e.target;if(im&&im.classList&&im.classList.contains("cimg")&&!im.classList.contains("remote")&&baseOK===-1)baseOK=+im.dataset.b},true);

/* ---------- helpers ---------- */
function rnd(n){return Math.floor(Math.random()*n)}
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=rnd(i+1),t=a[i];a[i]=a[j];a[j]=t}return a}
function sleep(ms){return (G&&G.sim)?Promise.resolve():new Promise(function(r){setTimeout(r,ms)})}
function nm(i){return i?"Opponent":"You"}
function isHuman(pi){return !G.sim&&pi===0}
/* bot levels: easy = Novice, normal = Sleuth, hard = Master Sleuth, expert = Detective vs Sleuth. No level looks at hidden cards. */
function lvlOf(pi){return (G&&G.bot&&G.bot[pi])||"normal"}
function chance(n){return rnd(100)<n}
function mkDeck(def){var d=[];def.cards.forEach(function(k){for(var i=0;i<k.x;i++)d.push(Object.assign({t:"c"},k,{uid:++UID}))});return shuffle(d)}
function mkP(i,def){return {i:i,def:def,deck:mkDeck(def),hand:[],file:[],ev:[],rem:[],scene:[],pa:[],caseSrc:(def.fx||[]).some(function(a){return a.trig==="decl"})?{n:def.caze.n,fx:def.fx,uid:++UID,decl:"fx",isCase:true,under:[]}:null,partner:"active",phase:"case",lv:7,usedHand:false,usedHint:false}}
function cap(p){return p.file.length+(p.partner==="file"?1:0)}
function apOf(c,o){return baseAp(c,o)+(c.battle||0)+(c.state?statics(c).ap:0)}
function baseAp(c,o){
  var b=c.ap+(c.mod||0)+(c.actBonus||0);
  if(G.cur===o.i){var n=o.scene.filter(function(x){return x!==c&&x.stat==="rum"}).length;b+=1000*n}
  return b;
}
function lpOf(c){return Math.max(0,c.lp+(c.lpm||0)+(c.state?statics(c).lp:0))}
function isDown(c){return c.state==="sleep"||c.state==="stun"}
function activate(c){c.state=c.state==="stun"?"sleep":"active"}
function downCount(o){return o.scene.filter(isDown).length}
function canAct(c){return c.state==="active"&&mayAct(c)&&(mayHit(c,"char")||mayHit(c,"case"))}
function canDeduce(c){return c.state==="active"&&!has(c,"idle")&&!has(c,"noDeduce")&&(!c.fresh||has(c,"swift"))}
function score(c){return c.lp*2+c.ap/2000+(c.swift?1:0)+(c.assault?0.6:0)+(c.cutin?0.8:0)+(c.hira?0.5:0)}
function cardVal(c){if(c.t==="e")return c.ev==="snipeEv"?4:2.5;return score(c)+c.lv*0.1}
function val(c,o){return lpOf(c)*2+apOf(c,o)/2000}
function best(list){return list.slice().sort(function(a,b){return cardVal(b)-cardVal(a)})[0]}
function log(t){if(G.cur===1&&G.recap)G.recap.push(t);G.log.unshift(t);if(G.log.length>40)G.log.pop();render()}
function tip(t){G.tip=t;render()}
function mkChar(b){var c=Object.assign({},b);c.base=b;c.state="active";c.fresh=true;c.mod=0;c.lpm=0;c.usedTurn=false;c.tmpAssault=false;return c}
function trName(c){if(c.custom)return c.trTxt||"";var T={police:"Police",thief:"Phantom thief",magistrate:"Magistrate",suzuki:"Suzuki family",det:"Detective",mouri:"Mouri Detective Agency",boys:"Detective Boys",hs:"High schooler",karate:"Karate",inv:"Inventor",sci:"Scientist",org:"Black Organization",fbi:"FBI",akai:"Akai family",cia:"CIA",shogi:"Shogi player",mpd:"Metropolitan Police",koan:"Public Security"};return (c.tr||[]).map(function(x){return V(T[x])}).join(", ")}

/* ---------- game end, deck handling ---------- */
function endGame(w,why){G.over={w:w,why:why};G.act=null;G.ask=null;render();throw OVER}
function takeTop(p){var c=p.deck.pop();if(c)delete c.up;if(!p.deck.length)refresh(p);return c}
function refresh(p){
  if(!p.rem.length){endGame(1-p.i,nm(p.i)+(p.i?" had":" had")+" to refresh with an empty Remove area.")}
  log(nm(p.i)+" refresh: the Remove area becomes the new deck, and "+(p.i?"you gain":"the opponent gains")+" 1 evidence.");
  p.refreshed=true;
  p.deck=shuffle(p.rem.splice(0));
  var o=G.p[1-p.i];o.ev.push(takeTop(o));
}
function draw(p,n){for(var i=0;i<n;i++)p.hand.push(takeTop(p))}
function cleanup(){G.noCutin=null;G.p.forEach(function(p){p.noCut=false;p.noDisguise=false;p.noHint=false;if(p.caseSrc){p.caseSrc.used=null;p.caseSrc.botUsed=false}p.scene.forEach(function(c){c.mod=0;c.lpm=0;c.lvm=0;c.battle=0;c.tmpKw=null;c.used=null;c.botUsed=false;c.granted=null;c.tmpTrait=null;c.gale=false;c.tmpAssault=false;c.trig=false});p.pa.forEach(function(c){if(c.mrPA){c.used=null;c.botUsed=false;c.granted=null}})})}
function autoPhase(p){
  p.partner="active";
  p.scene.forEach(function(c){if(!has(c,"noWake"))activate(c);c.fresh=false;c.usedTurn=false});
  paMR(p).forEach(function(c){c.state="active";c.usedTurn=false});
  draw(p,1);
  var n=G.turn===1?1:2;
  for(var i=0;i<n;i++)p.file.push(takeTop(p));
  p.usedHand=false;p.usedHint=false;G.p.forEach(function(q){q.entered=0});
  log("Auto phase for "+nm(p.i).toLowerCase()+": activate everything, draw 1, put "+n+" card"+(n>1?"s":"")+" in the FILE area.");
}

/* ---------- prompts ---------- */
function ask(title,note,opts){return new Promise(function(r){G.ask={title:title,note:note,opts:opts,r:r};render()})}
async function pick(pi,title,note,opts,pref){
  if(isHuman(pi))return await ask(title,note,opts);
  return pref===undefined?opts[0].v:pref;
}
function waitAct(){return new Promise(function(r){G.act=r;render()})}
function allChars(filter){var r=[];G.p.forEach(function(o){o.scene.forEach(function(c){if(!filter||filter(c,o))r.push({c:c,o:o})})});return r}
async function pickChar(pi,title,note,filter,mode){
  var cands=allChars(filter);
  if(!cands.length)return null;
  var opts=cands.map(function(x){return {l:(x.o.i===pi?"Your ":"Their ")+x.c.n+" (AP "+apOf(x.c,x.o)+(x.c.state==="sleep"?", sleeping":(x.c.state==="stun"?", stunned":""))+")",v:x.c.uid}});
  opts.push({l:"No target",v:null});
  var pref=null;
  if(!isHuman(pi)){
    var en=cands.filter(function(x){return x.o.i!==pi}),own=cands.filter(function(x){return x.o.i===pi}),pool=[];
    if(mode==="harm")pool=en;
    else if(mode==="sleep")pool=en.filter(function(x){return x.c.state==="active"});
    else if(mode==="boost"){pool=own.filter(function(x){return canAct(x.c)||canDeduce(x.c)});if(!pool.length)pool=own}
    pool.sort(function(a,b){return val(b.c,b.o)-val(a.c,a.o)});
    pref=pool.length?pool[0].c.uid:null;
    if(lvlOf(pi)==="easy"&&pool.length)pref=chance(20)?null:pool[rnd(pool.length)].c.uid;
  }
  var v=await pick(pi,title,note,opts,pref);
  if(v===null||v===undefined)return null;
  return cands.find(function(x){return x.c.uid===v})||null;
}
async function removeHandCard(p,title){
  if(!p.hand.length)return;
  var v=await pick(p.i,title,"Choose a card from your hand to remove.",p.hand.map(function(c){return {l:c.n+(c.t==="c"?" (Lv "+c.lv+")":" (event)"),v:c.uid}}),p.hand.slice().sort(function(a,b){return cardVal(a)-cardVal(b)})[0].uid);
  var c=p.hand.find(function(x){return x.uid===v})||p.hand[0];
  p.hand=p.hand.filter(function(x){return x.uid!==c.uid});p.rem.push(c);
  log(nm(p.i)+" remove"+(p.i?"s":"")+" "+c.n+" from hand.");
}

/* ---------- Scene changes and triggers ---------- */
async function removeChar(o,c,why){
  if(!leaveScene(o,c))return false;
  o.rem.push(c.base);
  log(c.n+" is removed from "+(o.i?"the opponent's":"your")+" Scene"+(why?" ("+why+")":"")+".");
  settleMR();
  await onLeave(o,c,why);
  await flushSetGone();
  await allyTriggers(o,c,"allyRemoved",c);
  var foe=G.p[1-o.i],fs=foe.scene.slice();
  var rctx={byMyFx:G.curOwner===foe.i&&why!=="lost the Contact"};
  for(var fi=0;fi<fs.length;fi++)if(foe.scene.indexOf(fs[fi])>-1)await trigger(foe,fs[fi],why==="lost the Contact"?"oppKO":"oppRemoved",rctx);
  await paWatch(foe,why==="lost the Contact"?"oppKO":"oppRemoved",rctx);
  if(why==="lost the Contact"){for(fi=0;fi<fs.length;fi++)if(foe.scene.indexOf(fs[fi])>-1)await trigger(foe,fs[fi],"oppRemoved",{});await paWatch(foe,"oppRemoved",{})}
  return true;
}
async function onLeave(o,c,why){
  if(c.custom){await trigger(o,c,"leave",{byContact:why==="lost the Contact",byOwnFx:G.curOwner===o.i&&why!=="lost the Contact"&&why!=="switch"});return}
  if(G.cur===o.i)return;
  if(c.leave==="jiro"){draw(o,1);log(nm(o.i)+" draw"+(o.i?"s":"")+" 1 card (Jirokichi).")}
  else if(c.leave==="jodie"){
    var op2=G.p[1-o.i];
    if(op2.hand.length){log(c.n+": "+nm(op2.i).toLowerCase()+" must remove 1 card from hand.");await removeHandCard(op2,c.n+": you must remove 1 card from hand")}
  }
  else if(c.leave==="kid4"){
    var kt=await pickChar(o.i,"Kid: stun a sleeping character?","Up to 1 sleeping character of level 5 or less.",function(x){return x.state==="sleep"&&x.lv<=5},"harm");
    if(kt){kt.c.state="stun";log(kt.c.n+" is stunned.")}
  }
  else if(c.leave==="rye"){
    var opp=G.p[1-o.i];
    var t=await pickChar(o.i,"Rye: remove an opposing character?","Level 4 or less. If you remove one, the opponent draws 1.",function(x,ow){return ow.i!==o.i&&x.lv<=4},"harm");
    if(t){await removeChar(t.o,t.c,"Rye");draw(opp,1);log(nm(opp.i)+" draw"+(opp.i?"s":"")+" 1 card.")}
  }else if(c.leave==="haibara"){
    var added=await lookEnter(o,3,function(x){return x.t==="c"&&x.lv<=4});
  }
}
async function enterChar(p,b,opts){
  opts=opts||{};
  if(p.scene.length>=5){
    var v=await pick(p.i,"Your Scene is full","Switch out one character to enter "+b.n+".",p.scene.map(function(x){return {l:"Remove "+x.n,v:x.uid}}).concat([{l:"Cancel",v:null}]),p.scene.slice().sort(function(a,c){return val(a,p)-val(c,p)})[0].uid);
    if(v===null||v===undefined)return null;
    var sw=p.scene.find(function(x){return x.uid===v});
    if(!sw)return null;
    await removeChar(p,sw,"switch");
  }
  p.hand=p.hand.filter(function(x){return x.uid!==b.uid});
  var ch=mkChar(b);
  p.entered=(p.entered||0)+1;ch.gale=p.entered===1;
  if(G.curSrc&&!opts.fromHand)ch.byEffect=Math.max(1,G.curSrc.lv||1);
  if(opts.sleep||(ch.fx||[]).some(function(a){return a.trig==="static"&&a.give.some(function(g){return g.kw==="entersSleep"})}))ch.state="sleep";
  if(opts.assault)ch.tmpAssault=true;
  p.scene.push(ch);
  log(nm(p.i)+" enter"+(p.i?"s":"")+" "+b.n+" (level "+b.lv+")"+(opts.sleep?" asleep":"")+".");
  if(ch.mr)await mrEnters(p,ch);
  await onEnter(p,ch);
  await kazuhaTrig(p,ch);
  if(p.scene.indexOf(ch)>-1)await allyTriggers(p,ch,"allyEnter");
  return ch;
}
/* MR rule: when an MR enters your Scene, MR cards already in your Scene or Partner area are removed */
async function mrEnters(p,ch){
  var old=p.scene.filter(function(x){return x!==ch&&x.mr});
  for(var i=0;i<old.length;i++){old[i].noMRMove=true;await removeChar(p,old[i],TT("MR rule: a new MR entered","luật MR: có MR mới vào sân"))}
  paMR(p).forEach(function(x){p.pa.splice(p.pa.indexOf(x),1);p.rem.push(x.base);log(x.n+TT(" is removed from the Partner area (MR rule: a new MR entered)."," bị loại khỏi khu Cộng sự (luật MR: có MR mới vào sân)."))});
}
async function onEnter(p,ch){
  if(ch.custom)await trigger(p,ch,"enter",{});
  else if(ch.enter==="snipe")await snipe(p,ch);
  else if(ch.enter==="boost")await boost(p,ch);
  else if(ch.enter==="agasa")await agasa(p,ch);
  else if(ch.enter==="stungain")await stunGain(p,ch);
  else if(ch.enter==="reveal"){
    var ro=G.p[1-p.i];
    if(p.i===0&&!G.sim){OPP_HAND_REVEALED=true;render()}
    log(nm(ro.i)+" reveal"+(ro.i?"s":"")+" "+(ro.i?"their":"your")+" hand: "+(ro.hand.length?ro.hand.map(function(x){return x.n}).join(", "):"no cards")+".");
  }
  else if(ch.enter==="megure")await megure(p,ch);
  else if(ch.enter==="search4"){
    var added=await lookAdd(p,4,function(){return true});
    if(added)await removeHandCard(p,ch.n+": remove 1 card from hand");
  }
}
async function megure(p,src){
  var ok=function(c){return c.t==="c"&&c.lv<=4};
  var cands=p.rem.filter(ok);
  if(!p.hand.length||(!cands.length&&!(isHuman(p.i)&&p.hand.some(ok))))return;
  var card=null;
  if(isHuman(p.i)){
    var v=await ask(src.n+": remove a card from hand?","If you do, enter a character of level 4 or less from your Remove area, asleep.",p.hand.map(function(c){return {l:c.n,v:c.uid}}).concat([{l:"Do not use",v:null}]));
    if(v===null)return;
    card=p.hand.find(function(c){return c.uid===v});
  }else{
    var lo=p.hand.slice().sort(function(a,b){return cardVal(a)-cardVal(b)})[0];
    if(cardVal(best(cands))<=cardVal(lo)+0.5)return;
    card=lo;
  }
  p.hand=p.hand.filter(function(c){return c.uid!==card.uid});p.rem.push(card);
  log(nm(p.i)+" remove"+(p.i?"s":"")+" "+card.n+" from hand to use "+src.n+".");
  cands=p.rem.filter(function(c){return c.t==="c"&&c.lv<=4});
  if(!cands.length)return;
  var cv=await pick(p.i,"Enter which character from your Remove area?","Level 4 or less, entering asleep.",cands.map(function(c){return {l:c.n+" (Lv "+c.lv+")",v:c.uid}}).concat([{l:"Do not enter",v:null}]),best(cands).uid);
  if(cv===null)return;
  var b=cands.find(function(c){return c.uid===cv})||cands[0];
  p.rem=p.rem.filter(function(c){return c.uid!==b.uid});
  var e=await enterChar(p,b,{sleep:true});
  if(!e)p.rem.push(b);
}
async function kazuhaTrig(p,ch){
  var ks=p.scene.filter(function(k){return k.kazuha&&!k.trig&&(k===ch||ch.n==="Heiji Hattori")});
  for(var i=0;i<ks.length;i++){
  ks[i].trig=true;
  var t=await pickChar(p.i,"Kazuha: sleep a character?","Once per turn, when she or Heiji Hattori enters your Scene. Up to 1 character, either side.",function(x){return x.state==="active"},"sleep");
  if(t){t.c.state="sleep";log(t.c.n+" falls asleep (Kazuha).")}
  }
}
async function stunGain(p,src){
  if(!p.hand.length)return;
  var yes=await pick(p.i,src.n+": remove a card from hand?","If you do, stun up to 1 character and gain 1 evidence.",[{l:"Remove a card",v:true},{l:"Do not use",v:false}],true);
  if(!yes)return;
  await removeHandCard(p,src.n+": remove 1 card from hand");
  var t=await pickChar(p.i,src.n+": stun which character?","Up to 1 character, either side. Stunned characters become sleeping instead of active in the Auto phase.",function(x){return x.state!=="stun"},"sleep");
  if(t){t.c.state="stun";log(t.c.n+" is stunned.")}
  p.ev.push(takeTop(p));log(nm(p.i)+" gain"+(p.i?"s":"")+" 1 evidence.");
}
async function snipe(p,src){
  if(!p.hand.length)return;
  var cands=allChars(function(c,o){return apOf(c,o)<=8000});
  if(!cands.length)return;
  var card=null;
  if(isHuman(p.i)){
    var v=await ask(src.n+": remove a card from hand?","If you do, you may then remove one character with AP 8000 or less, from either side.",p.hand.map(function(c){return {l:c.n,v:c.uid}}).concat([{l:"Do not use",v:null}]));
    if(v===null)return;
    card=p.hand.find(function(c){return c.uid===v});
  }else{
    if(!cands.some(function(x){return x.o.i!==p.i}))return;
    card=p.hand.slice().sort(function(a,b){return cardVal(a)-cardVal(b)})[0];
  }
  p.hand=p.hand.filter(function(c){return c.uid!==card.uid});p.rem.push(card);
  log(nm(p.i)+" remove"+(p.i?"s":"")+" "+card.n+" from hand to use "+src.n+".");
  var t=await pickChar(p.i,"Remove which character?","AP 8000 or less, either side.",function(c,o){return apOf(c,o)<=8000},"harm");
  if(t)await removeChar(t.o,t.c,src.n+"'s effect");
}
async function boost(p,src){
  var t=await pickChar(p.i,src.n+": +1000 AP to which character?","Up to 1 character, either side, until end of turn.",function(){return true},"boost");
  if(t){t.c.mod=(t.c.mod||0)+1000;log(t.c.n+" gets +1000 AP this turn.")}
}
async function agasa(p,src){
  var opts=p.hand.filter(function(c){return c.t==="c"&&c.lv<=4&&c.tr&&c.tr.indexOf("boys")>-1});
  var entered=false;
  if(opts.length){
    var v=await pick(p.i,"Dr. Agasa: enter a Detective Boys character?","You may enter one of level 4 or less from your hand, asleep.",opts.map(function(c){return {l:c.n+" (Lv "+c.lv+")",v:c.uid}}).concat([{l:"Do not enter",v:null}]),best(opts).uid);
    if(v!==null&&v!==undefined){
      var b=opts.find(function(c){return c.uid===v});
      if(b){var e=await enterChar(p,b,{sleep:true});entered=!!e}
    }
  }
  if(!entered)await boost(p,src);
}
async function lookAdd(p,n,filter){
  var k=Math.min(n,p.deck.length),looked=p.deck.splice(p.deck.length-k,k);
  var cands=looked.filter(filter),chosen=null;
  if(cands.length){
    var v=await pick(p.i,"Look at your top "+k+" cards","Add up to 1 of them to your hand. The rest go to the bottom of your deck.",cands.map(function(c){return {l:c.n+(c.t==="c"?" (Lv "+c.lv+")":" (event)"),v:c.uid}}).concat([{l:"Add nothing",v:null}]),best(cands).uid);
    if(v!==null&&v!==undefined)chosen=cands.find(function(c){return c.uid===v})||null;
  }
  p.deck=looked.filter(function(c){return c!==chosen}).concat(p.deck);
  if(chosen)p.hand.push(chosen);
  log(nm(p.i)+" look"+(p.i?"s":"")+" at the top "+k+" cards"+(chosen?" and add"+(p.i?"s ":" ")+chosen.n+" to hand.":" and add"+(p.i?"s":"")+" nothing."));
  if(!p.deck.length)refresh(p);
  return chosen;
}
async function lookEnter(p,n,filter){
  var k=Math.min(n,p.deck.length),looked=p.deck.splice(p.deck.length-k,k);
  var cands=looked.filter(filter),chosen=null;
  if(cands.length){
    var v=await pick(p.i,"Look at your top "+k+" cards","Enter up to 1 character of level 4 or less, asleep. The rest go to the bottom of your deck.",cands.map(function(c){return {l:c.n+" (Lv "+c.lv+")",v:c.uid}}).concat([{l:"Enter nothing",v:null}]),best(cands).uid);
    if(v!==null&&v!==undefined)chosen=cands.find(function(c){return c.uid===v})||null;
  }
  p.deck=looked.filter(function(c){return c!==chosen}).concat(p.deck);
  if(!p.deck.length&&!chosen)refresh(p);
  if(chosen){
    var e=null;
    if(p.scene.length<5||isHuman(p.i)||true)e=await enterChar(p,chosen,{sleep:true});
    if(!e)p.deck=[chosen].concat(p.deck);
    if(!p.deck.length)refresh(p);
  }
  return chosen;
}
async function resolveEvent(p,c){
  if(c.ev==="fx"){var abs=eventAbility(c),ec={isEvent:true};for(var n=0;n<abs.length;n++)await runAbility(p,c,abs[n],ec);return !!ec.claimed}
  else if(c.ev==="snipeEv"){
    var t=await pickChar(p.i,c.n+": remove which character?","AP 8000 or less, either side.",function(x,o){return apOf(x,o)<=8000},"harm");
    if(t)await removeChar(t.o,t.c,c.n);
  }else if(c.ev==="search3enter"){
    await lookAdd(p,3,function(x){return x.t==="c"});
    var opts=p.hand.filter(function(x){return x.t==="c"&&x.lv<=cap(p)});
    if(opts.length){
      var v=await pick(p.i,c.n+": enter a character","Level "+cap(p)+" or less (your FILE count).",opts.map(function(x){return {l:x.n+" (Lv "+x.lv+")",v:x.uid}}).concat([{l:"Do not enter",v:null}]),best(opts).uid);
      if(v!==null&&v!==undefined){var b=opts.find(function(x){return x.uid===v});if(b)await enterChar(p,b,{})}
    }
  }
}
async function hirameki(o,c){
  if(!c.hira)return;
  var yes=await pick(o.i,"Flash of insight: "+c.n,"This card was removed from your evidence by an Action. Activate it?",[{l:"Activate",v:true},{l:"Skip",v:false}],true);
  if(!yes)return;
  log(nm(o.i)+" activate"+(o.i?"s":"")+" the Flash of insight on "+c.n+".");
  if(c.hira==="fx"){
    var ctx={fromEvidence:true},hs=c.fx.filter(function(a){return a.trig==="hira"});
    for(var h=0;h<hs.length;h++)if(ready(hs[h],o,c))await runSteps(o,c,hs[h].steps,ctx);
    return ctx.claimed;
  }
  if(c.hira==="draw1")draw(o,1);
  else if(c.hira==="sleep1"){
    var t=await pickChar(o.i,"Flash: sleep which character?","Up to 1 character, either side.",function(){return true},"sleep");
    if(t){if(t.c.state==="active")t.c.state="sleep";log(t.c.n+" falls asleep.")}
  }
}

/* ---------- custom decks: your deck from the Deck page ----------
   Card abilities are read by assets/card-effects.js. An ability the reader does not
   fully understand does nothing, and the card says so. */
function TT(en,vi){return LANG==="vi"?vi:en}
var CSSCOL={"青":"blue","緑":"green","白":"white","赤":"red","黄":"yellow","黒":"black"};
function colorsOf(c){return String(c.color||"").split("").filter(function(x){return CSSCOL[x]})}
function jn(s){return window.ConanFx?ConanFx.nfkc(s).trim():String(s||"")}
function cardNames(jp){return [jn(jp)].concat(jn(jp).split("&")).map(function(x){return x.trim()})}
function clean(s){return String(s||"").replace(/[<>]/g,"")}
function showName(c){var t=window.ConanTr&&ConanTr.name(c.title,LANG);return clean(t||c.title_romaji||c.title)}
function showText(c,missing){
  var parts=[c.feature,c.hirameki,c.cut_in].filter(Boolean).map(function(x){return window.ConanTr?ConanTr.text(x,LANG):x});
  var s=clean(parts.join(" ").replace(/\n/g," "));
  if(missing)s="⚠️ "+TT("Some text on this card is not automated and does nothing here. ","Một phần chữ trên lá này chưa được tự động hóa và không có tác dụng ở đây. ")+s;
  return s||TT("No card text.","Không có nội dung.");
}
function buildCard(raw,count){
  var fx=ConanFx.parse(raw),c={k:raw.card_num,n:showName(raw),jnames:cardNames(raw.title),col:colorsOf(raw),
    jt:[raw.category1,raw.category_more].filter(Boolean).join(",").split(",").map(jn),
    tr:[],lv:+raw.cost||0,x:count,set:"remote",img:/^https:\/\//.test(raw.image_url||"")?clean(raw.image_url).replace(/"/g,""):"",
    fx:fx.abs,missing:fx.missing.length,custom:true,mr:!!fx.mr};
  c.trTxt=[raw.category1,raw.category_more].filter(Boolean).join(",").split(",").filter(Boolean).map(function(t){return clean((window.ConanTr&&ConanTr.name(t,LANG))||t)}).join(", ");
  if(raw.type==="イベント"){c.t="e";c.ev="fx"}else{c.ap=+raw.ap||0;c.lp=+raw.lp||0}
  c.txt=showText(raw,c.missing);
  fx.abs.forEach(function(a){
    if(a.trig==="disguise")c.disguise=1;
    if(a.trig==="cutin"){c.cut=a;c.cutin=a.ap||(a.alt&&a.alt.ap)||1}
    else if(a.trig==="hira")c.hira="fx";
    else if(a.trig==="decl"&&c.t!=="e")c.decl="fx";
    else if(a.trig==="static"&&a.self&&!a.conds.length&&!a.turn&&!a.per){
      if(a.give.every(function(g){return g.v==="kw"})){a.printed=true;a.give.forEach(function(g){if(g.kw==="md")c.md=g.n;else c[g.kw]=1})}
    }
  });
  return c;
}
/* the deck saved on the Deck page: {deck} or {error} */
function customDeck(){
  var data=window.CONAN_CARDS,saved=null;
  try{saved=JSON.parse(localStorage.getItem("conanDeck"))}catch(e){}
  if(!data||!window.ConanFx||!saved||!saved.list)return {error:""};
  var by={};data.cards.forEach(function(c){by[c.card_num]=c});
  var p=by[saved.partner],k=by[saved.caze];
  var list=Object.keys(saved.list).filter(function(n){return by[n]&&(by[n].type==="キャラ"||by[n].type==="イベント")});
  var total=list.reduce(function(s,n){return s+(+saved.list[n]||0)},0);
  if(!p||p.type!=="パートナー"||!k||k.type!=="事件"||total!==40)return {error:TT("Your deck needs 1 Partner, 1 Case and exactly 40 Character or Event cards. It has "+total+" now.","Bộ bài cần 1 Cộng sự, 1 Vụ án và đúng 40 lá Nhân vật hoặc Sự kiện. Hiện có "+total+" lá.")};
  var cards=list.map(function(n){return buildCard(by[n],+saved.list[n])});
  var kfx=ConanFx.parse(k),cc=colorsOf(k);
  var img=function(c){return /^https:\/\//.test(c.image_url||"")?clean(c.image_url).replace(/"/g,""):""};
  var full=cards.reduce(function(s,c){return s+(c.missing?0:c.x)},0);
  return {full:full,deck:{key:"custom",custom:true,name:TT("My deck","Bộ bài của tôi"),color:CSSCOL[cc[0]]||"blue",set:"remote",cardNo:img(k),partnerNo:img(p),
    blurb:TT("The deck you saved on the Deck page.","Bộ bài bạn đã lưu ở trang Bộ bài."),
    partner:{n:showName(p),lp:+p.lp||1,col:colorsOf(p)},caseColors:cc,
    caseTags:[k.category1,k.category_more,k.title].filter(Boolean).join(",").split(",").map(jn),
    caze:{n:showName(k),lv:[+k.case_first||7,+k.case_second||6],alt:kfx.abs.some(function(a){return a.trig==="destroy"})?1:0,txt:showText(k,kfx.missing.length)},
    fx:kfx.abs,cards:cards}};
}
function loadCustom(){var r=customDeck();if(r.deck)DECKS.custom=r.deck;else delete DECKS.custom;return r}

/* ---------- reading the state ---------- */
var inStatic=false;
function ownerOf(c){for(var i=0;G&&i<G.p.length;i++)if(G.p[i].scene.indexOf(c)>-1||G.p[i].pa.indexOf(c)>-1)return G.p[i];return null}
/* every ability a card has now: printed, granted, or given by Events set on it */
function abilitiesOf(c){
  var list=(c.fx||[]).concat(c.granted||[]);
  (c.under||[]).forEach(function(u){
    if(!u.up)return;
    (u.card.fx||[]).forEach(function(a){
      if(a.trig!=="whenSet")return;
      if(a.host&&!match(c,ownerOf(c)||G.p[0],Object.assign({},a.host,{side:"any"}),ownerOf(c)||G.p[0],c))return;
      a.give.forEach(function(g){
        if(g.v==="grant")list.push(g.ab);
        else{a.parts=a.parts||[];var i=a.give.indexOf(g);a.parts[i]=a.parts[i]||{trig:"static",self:true,conds:[],give:[g]};list.push(a.parts[i])}
      });
    });
  });
  (c.fx||[]).forEach(function(a){
    if(a.trig==="static"&&a.self&&!a.conds.length)a.give.forEach(function(g){if(g.v==="grant"&&list.indexOf(g.ab)<0)list.push(g.ab)});
  });
  return list;
}
/* what continuous abilities in play currently give to character c */
function statics(c){
  var r={ap:0,lp:0,lv:0,kw:{},md:0,trait:[],name:[]};
  if(inStatic||!G)return r;
  var o=ownerOf(c);if(!o)return r;
  inStatic=true;
  try{
    G.p.forEach(function(p){p.scene.forEach(function(src){
      abilitiesOf(src).forEach(function(a){
        if(a.trig!=="static"||a.printed)return;
        if(a.self?src!==c:!match(c,o,a.f,p,src))return;
        if(!ready(a,p,src))return;
        var times=1;
        if(a.per==="set")times=(src.under||[]).length;
        else if(a.per&&a.per.pa)times=p.pa.filter(function(x){return match(x,p,Object.assign({},a.per.pa,{side:"any"}),p,src)}).length;
        else if(a.per&&a.per.ev!==undefined)times=p.ev.filter(function(x){return !!x.up===a.per.ev}).length;
        else if(a.per)times=countChars(a.per,p,src);
        a.give.forEach(function(g){
          if(g.v==="kw"){if(g.kw==="md")r.md=g.n;else r.kw[g.kw]=1}
          else if(g.v==="trait")r.trait.push(g.n);
          else if(g.v==="name")r.name.push(g.n);
          else if(g.v==="ap"||g.v==="lp"||g.v==="lv")r[g.v]+=g.n*times;
        });
      });
    })});
  }finally{inStatic=false}
  return r;
}
function has(c,k){return !!(c[k]||(c.tmpKw&&c.tmpKw[k])||statics(c).kw[k]||(k==="assault"&&c.tmpAssault))}
function mdOf(c){return statics(c).md||(c.tmpKw&&c.tmpKw.md)||c.md||0}
function lvOf(c){return c.lv+(c.lvm||0)+(c.state?statics(c).lv:0)}
function hasTrig(c,t){return abilitiesOf(c).some(function(a){return a.trig===t})}
/* o = owner of the target, p = player whose ability is looking, src = that ability's card */
function match(c,o,f,p,src){
  if(f.side==="own"&&o!==p)return false;
  if(f.side==="opp"&&o===p)return false;
  if(f.other&&c===src)return false;
  if(f.kind==="c"&&c.t==="e")return false;
  if(f.kind==="e"&&c.t!=="e")return false;
  var scene=!!c.state,lv=scene?lvOf(c):c.lv;
  if(f.lvMin!==undefined&&!(lv>=f.lvMin))return false;
  if(f.lvMax!==undefined&&!(lv<=f.lvMax))return false;
  if(f.lvFile&&!(lv<=cap(p)))return false;
  var ap=scene?apOf(c,o):c.ap,lp=scene?lpOf(c):c.lp;
  if(f.apSelf&&!(ap<=apOf(src,p)))return false;
  if(f.apMin!==undefined&&!(ap>=f.apMin))return false;
  if(f.apMax!==undefined&&!(ap<=f.apMax))return false;
  if(f.lpMin!==undefined&&!(lp>=f.lpMin))return false;
  if(f.lpMax!==undefined&&!(lp<=f.lpMax))return false;
  if(f.state&&f.state.indexOf(c.state)<0)return false;
  var under=c.under||[];
  if(f.noFaceDown&&under.some(function(u){return !u.up}))return false;
  if(f.hasFaceDown&&!under.some(function(u){return !u.up}))return false;
  if(f.hasSet&&!under.length)return false;
  if(f.has==="cut"&&!c.cutin)return false;
  if(f.has==="hira"&&!c.hira)return false;
  if(f.has==="leave"&&!hasTrig(c,"leave"))return false;
  if(f.has==="disguise"&&!c.disguise)return false;
  if(f.hasKw==="md"&&!(c.state?mdOf(c):c.md))return false;
  if((f.hasKw==="assault"||f.hasKw==="swift")&&!(c.state?has(c,f.hasKw):c[f.hasKw]))return false;
  if(f.has==="gale"&&!(c.fx||[]).some(function(a){return a.conds&&a.conds.some(function(k){return k.c==="gale"})}))return false;
  if(f.vanilla&&!(c.custom&&(c.fx||[]).every(function(a){return a.trig==="cutin"||a.trig==="hira"})&&!c.missing))return false;
  if(f.notOnly&&!(c.col||[]).some(function(x){return x!==f.notOnly}))return false;
  var st=scene?statics(c):null,names=(c.jnames||[]).concat(st?st.name:[]);
  if(f.notName&&names.indexOf(f.notName)>-1)return false;
  if(f.alts){
    var traits=(c.jt||[]).concat(st?st.trait:[],c.tmpTrait||[]);
    return f.alts.some(function(a){
      return (!a.color||(c.col||[]).indexOf(a.color)>-1)&&(!a.trait||traits.indexOf(a.trait)>-1)&&(!a.name||names.indexOf(a.name)>-1)&&(a.lvMax===undefined||lv<=a.lvMax)&&(a.lvMin===undefined||lv>=a.lvMin);
    });
  }
  return true;
}
function countChars(f,p,src){return allChars(function(c,o){return match(c,o,f,p,src)}).length}
function holds(k,p,src,ctx){
  var n,opp=G.p[1-p.i];
  if(k.c==="solution")return p.phase==="solution";
  if(k.c==="casePhase")return p.phase==="case";
  if(k.c==="file")return k.op==="以上"?cap(p)>=k.n:cap(p)<=k.n;
  if(k.c==="partner")return (p.def.partner.col||[]).some(function(x){return k.colors.indexOf(x)>-1});
  if(k.c==="caseColor")return k.colors.split("").every(function(x){return (p.def.caseColors||[]).indexOf(x)>-1});
  if(k.c==="count"){
    if(!k.distinct)return countChars(k.f,p,src)>=k.min;
    var seen={};allChars(function(c,o){return match(c,o,k.f,p,src)}).forEach(function(x){seen[x.c.n]=1});return Object.keys(seen).length>=k.min;
  }
  if(k.c==="any")return k.list.some(function(x){return holds(x,p,src,ctx)});
  if(k.c==="all")return k.list.every(function(x){return holds(x,p,src,ctx)});
  if(k.c==="evLE")return p.ev.length<=opp.ev.length;
  if(k.c==="bothScene")return p.scene.length+opp.scene.length>=k.n;
  if(k.c==="byContact")return !!(ctx&&ctx.byContact);
  if(k.c==="byEffect")return !!src.byEffect&&src.byEffect>=k.lv;
  if(k.c==="entered")return !!(ctx&&ctx.that&&match(ctx.that.c,ctx.that.o,k.f,p,src));
  if(k.c==="under")return (src.under||[]).length>=k.n;
  if(k.c==="not")return !holds(k.x,p,src,ctx);
  if(k.c==="paCount")return p.pa.filter(function(x){return match(x,p,Object.assign({},k.f,{side:"any"}),p,src)}).length>=k.min;
  if(k.c==="selfAp")return apOf(src,p)>=k.n;
  if(k.c==="selfSet")return (src.under||[]).length>0;
  if(k.c==="oppEv")return opp.ev.length>=k.n;
  if(k.c==="oppHand")return opp.hand.length>=k.n;
  if(k.c==="trace")return !!opp.refreshed===k.found;
  if(k.c==="found")return ((ctx&&ctx.found)||[]).some(function(c){return k.op==="以上"?c.lv>=k.n:c.lv<=k.n});
  if(k.c==="caseOther")return (p.def.caseColors||[]).some(function(x){return x!==k.color})===k.has;
  if(k.c==="caseTrait")return (p.def.caseTags||[]).indexOf(k.t)>-1;
  if(k.c==="hand"||k.c==="ev"){n=(k.c==="hand"?p.hand:p.ev).length;return k.op==="以上"?n>=k.n:n<=k.n}
  if(k.c==="evBoth")return G.p[0].ev.length+G.p[1].ev.length>=k.n;
  if(k.c==="remCount")return p.rem.filter(function(c){return match(c,p,Object.assign({},k.f,{zone:"rem"}),p,src)}).length>=k.min;
  if(k.c==="selfState")return k.s.indexOf(src.state)>-1;
  if(k.c==="oppHandMore")return G.p[1-p.i].hand.length>=p.hand.length;
  if(k.c==="alone")return p.scene.every(function(c){return c===src});
  if(k.c==="gale")return !!src.gale;
  if(k.c==="hit"){var hl=(k.cost?G.costHits:G.hits)||[];return hl.filter(function(h){return (k.verb==="remove"?h.verb==="remove":k.verb==="toHand"?h.verb==="toHand":h.verb===k.verb)&&match(h.c,p,Object.assign({},k.f,{side:"any"}),p,src)}).length>=k.min}
  if(k.c==="allOwn")return p.scene.length>0&&p.scene.every(function(c){return match(c,p,k.f,p,src)});
  if(k.c==="gap")return !!(ctx&&ctx.target&&apOf(ctx.target.c,ctx.target.o)<=apOf(src,p)-k.n);
  if(k.c==="byOwnFx")return !!(ctx&&ctx.byOwnFx);
  if(k.c==="byMyFx")return !!(ctx&&ctx.byMyFx);
  return false;
}
function ready(a,p,src,ctx){
  if(a.turn==="own"&&G.cur!==p.i)return false;
  if(a.turn==="opp"&&G.cur===p.i)return false;
  return a.conds.every(function(k){return holds(k,p,src,ctx)});
}
/* take a character off the Scene; cards set on it go to the Remove area */
function leaveScene(o,c){
  var i=o.scene.indexOf(c);if(i<0)return false;
  o.scene.splice(i,1);
  (c.under||[]).forEach(function(u){if(u.card.t==="e"&&(u.card.fx||[]).some(function(a){return a.trig==="setGone"}))(G.setGone=G.setGone||[]).push({o:o,card:u.card})});
  /* MR rule: leaving the Scene during the opponent's turn sends it on to the Partner area (see settleMR) */
  if(c.mr&&!c.noMRMove&&G&&G.cur!==o.i)(G.mrOut=G.mrOut||[]).push({o:o,card:c.base,n:c.n});
  (c.under||[]).forEach(function(u){delete u.card.up;o.rem.push(u.card)});c.under=[];
  return true;
}
/* MR rule: the card first lands where it was sent, then moves to its owner's Partner area */
function settleMR(){
  if(!G||!G.mrOut||!G.mrOut.length)return;
  var list=G.mrOut;G.mrOut=[];
  list.forEach(function(x){
    var o=x.o,found=false;
    G.p.forEach(function(q){
      ["rem","deck","hand","ev","file"].forEach(function(z){var i=q[z].indexOf(x.card);if(i>-1&&!found){q[z].splice(i,1);found=true}});
      q.scene.forEach(function(s){(s.under||[]).forEach(function(u,i){if(u.card===x.card&&!found){s.under.splice(i,1);found=true}})});
    });
    if(!found)return;
    delete x.card.up;
    var ch=mkChar(x.card);ch.fresh=false;ch.mrPA=true;
    o.pa.push(ch);
    log(x.n+TT(" is an MR card: it moves to the Partner area."," là lá MR: chuyển vào khu Cộng sự."));
  });
}
/* "when you gain evidence": once per gain, not again while it is resolving */
async function evGained(p){
  if(G.inEvGain)return;G.inEvGain=true;
  try{var s=p.scene.slice();for(var i=0;i<s.length;i++)if(p.scene.indexOf(s[i])>-1)await trigger(p,s[i],"evGain",{});await paWatch(p,"evGain",{})}
  finally{G.inEvGain=false}
}
/* MR cards waiting in the Partner area */
function paMR(p){return p.pa.filter(function(x){return x.mrPA})}
/* abilities of MR cards in the Partner area that also work there */
async function paWatch(p,when,ctx,actor){
  var list=paMR(p);
  for(var i=0;i<list.length;i++){
    var s=list[i],abs=abilitiesOf(s).filter(function(a){return a.inPA&&a.trig===when});
    for(var j=0;j<abs.length;j++){
      if(p.pa.indexOf(s)<0)break;
      if(actor&&abs[j].who&&!match(actor,p,abs[j].who,p,s))continue;
      await runAbility(p,s,abs[j],Object.assign({},ctx));
    }
  }
}
/* "when this event, set on a character, is put into the Remove area" */
async function flushSetGone(){
  while(G&&G.setGone&&G.setGone.length){
    var x=G.setGone.shift();
    if(x.o.rem.indexOf(x.card)<0)continue;
    var abs=(x.card.fx||[]).filter(function(a){return a.trig==="setGone"});
    for(var i=0;i<abs.length;i++)await runAbility(x.o,x.card,abs[i],{});
  }
}
function takeSet(o,c,entry){
  if(entry.card.t==="e"&&(entry.card.fx||[]).some(function(a){return a.trig==="setGone"}))(G.setGone=G.setGone||[]).push({o:o,card:entry.card});c.under.splice(c.under.indexOf(entry),1);delete entry.card.up;o.rem.push(entry.card)}
function putSet(c,card,up){c.under=c.under||[];c.under.push({card:card,up:!!up})}

/* ---------- running effects ---------- */
/* each card an ability (or its cost) removed, sent to hand, entered... so "if this removed a [trait] character" can be checked */
function hit(c,verb){if(!G||!c)return;(G.payingCost?(G.costHits=G.costHits||[]):(G.hits=G.hits||[])).push({c:c,verb:verb})}
function usedCount(src,a){return (src.used||[]).filter(function(x){return x===a}).length}
function markUsed(src,a){(src.used=src.used||[]).push(a)}
async function runAbility(p,src,a,ctx){
  if(!ready(a,p,src,ctx))return;
  if(a.once&&usedCount(src,a)>=a.once)return;
  if((G.depth||0)>10)return;
  G.depth=(G.depth||0)+1;
  var prevSrc=G.curSrc,prevOwner=G.curOwner,prevHits=G.hits,prevCost=G.costHits;G.curSrc=src;G.curOwner=p.i;G.hits=[];
  try{
    var did=await runSteps(p,src,a.steps||[],ctx||{});
    if(did&&a.once)markUsed(src,a);
  }finally{G.depth--;G.curSrc=prevSrc;G.curOwner=prevOwner;G.hits=prevHits;G.costHits=prevCost}
}
async function trigger(p,src,when,ctx){
  var list=abilitiesOf(src).filter(function(a){return a.trig===when||(when==="disguised"&&a.alsoDisguise)});
  for(var i=0;i<list.length;i++)await runAbility(p,src,list[i],Object.assign({},ctx));
}
async function allyCutin(p,mine,pair){
  var list=p.scene.concat(paMR(p));
  for(var i=0;i<list.length;i++){
    var s=list[i],abs=abilitiesOf(s).filter(function(a){return a.trig==="allyCutin"&&(p.scene.indexOf(s)>-1||a.inPA)});
    for(var j=0;j<abs.length;j++)if(match(mine,p,abs[j].who,p,s))await runAbility(p,s,abs[j],{contact:pair,that:{c:mine,o:p}});
  }
}
/* abilities that watch your other characters */
async function allyTriggers(p,actor,when,extra){
  await paWatch(p,when,{},actor);
  var list=p.scene.slice();
  if(extra&&list.indexOf(extra)<0)list.push(extra);
  for(var i=0;i<list.length;i++){
    var s=list[i],abs=abilitiesOf(s).filter(function(a){return a.trig===when});
    for(var j=0;j<abs.length;j++){
      var gone=p.scene.indexOf(s)<0;
      if(gone&&!(s===extra&&abs[j].withSelf))continue;
      if(s===actor&&!abs[j].withSelf)continue;
      if(match(actor,p,abs[j].who,p,s)||(s===actor&&abs[j].withSelf))await runAbility(p,s,abs[j],{});
    }
  }
}
async function runSteps(p,src,list,ctx){
  var last=false,any=false;
  for(var i=0;i<list.length;i++){
    var op=list[i];
    if(op.ifDid&&!last)continue;
    if(op.cond&&!holds(op.cond,p,src,ctx)){last=false;continue}
    last=await runOp(p,src,op,ctx);
    settleMR();
    if(G.setGone&&G.setGone.length)await flushSetGone();
    any=any||last;
  }
  return any;
}
async function yesNo(p,src,question,pref){
  return await pick(p.i,src.n,question,[{l:TT("Yes","Có"),v:true},{l:TT("No","Không"),v:false}],pref);
}
function harmful(list){return list.some(function(v){return ["remove","bottom","bounce","stun","sleep"].indexOf(v.v)>-1||((v.v==="ap"||v.v==="lp"||v.v==="lv")&&v.n<0)})}
var VERBS={topOrBottom:["put on top or bottom of the deck","đặt lên đầu hoặc đáy bộ bài"],top:["put on top of the deck","đặt lên đầu bộ bài"],toPA:["move to the Partner area","chuyển vào khu Cộng sự"],toSet:["set under this character","gắn vào nhân vật này"],setTop:["set a card on it","gắn 1 lá vào nó"],grant:["give an ability","trao năng lực"],trait:["give a trait","trao đặc điểm"],name:["give a name","trao tên"],battle:["AP","AP"],remove:["remove","loại bỏ"],sleep:["put to sleep","cho ngủ"],stun:["stun","làm choáng"],activate:["make active","cho hoạt động"],bottom:["put on the bottom of the deck","đặt xuống đáy bộ bài"],bounce:["return to hand","đưa về tay"],toHand:["add to hand","đưa lên tay"],enter:["enter into Scene","cho vào Hiện trường"],kw:["give an ability","trao năng lực"]};
var KWN={md:["Misdirect","Đánh lạc hướng"],noDeduce:["cannot deduce","không thể suy luận"],sleepGuard:["can guard while asleep","đỡ đòn được khi ngủ"],mustGuard:["must guard","bắt buộc đỡ đòn"],noWake:["does not wake up","không tỉnh lại"],noContactKO:["not removed by Contact","không bị loại bởi Tiếp xúc"],swift:["Swift","Nhanh nhẹn"],assault:["Assault","Đột kích"],assaultChar:["Assault (characters)","Đột kích (nhân vật)"],assaultCase:["Assault (case)","Đột kích (vụ án)"],bullet:["Bullet","Đạn"],hitActive:["can attack active characters","đánh được nhân vật đang hoạt động"]};
function verbLabel(v){
  if(v.v==="ap"||v.v==="lp"||v.v==="lv")return (v.v==="lv"?TT("level","cấp"):v.v.toUpperCase())+" "+(v.n>0?"+":"")+v.n;
  if(v.v==="kw")return KWN[v.kw]?TT(KWN[v.kw][0],KWN[v.kw][1]):TT("an ability","một năng lực");
  if(v.v==="choose")return v.a.map(verbLabel).join(", ")+TT(" or "," hoặc ")+v.b.map(verbLabel).join(", ");
  return TT(VERBS[v.v][0],VERBS[v.v][1]);
}
async function applyVerbs(p,src,t,list){
  for(var i=0;i<list.length;i++){
    var v=list[i],c=t.c,o=t.o;
    if(o.scene.indexOf(c)<0)return;
    if(v.v==="choose"){
      var yes=await pick(p.i,src.n,TT("Choose one for ","Chọn một cho ")+c.n,[{l:v.a.map(verbLabel).join(", "),v:true},{l:v.b.map(verbLabel).join(", "),v:false}],true);
      await applyVerbs(p,src,t,yes?v.a:v.b);
    }
    else if(v.v==="remove"){if(o!==p&&((src.t==="e"&&has(c,"noEventRemove"))||has(c,"noFxRemove"))){log(c.n+TT(" cannot be removed by this."," không thể bị loại bởi hiệu ứng này."));continue}hit(c,"remove");await removeChar(o,c,src.n)}
    else if(v.v==="topOrBottom"){var under2=await pick(p.i,src.n,c.n+TT(": top or bottom of the deck?",": đặt lên đầu hay xuống đáy bộ bài?"),[{l:TT("Bottom","Xuống đáy"),v:true},{l:TT("Top","Lên đầu"),v:false}],true);leaveScene(o,c);if(under2)o.deck.unshift(c.base);else o.deck.push(c.base);log(c.n+TT(" leaves the Scene for the deck."," rời Hiện trường về bộ bài."))}
    else if(v.v==="top"){leaveScene(o,c);o.deck.push(c.base);log(c.n+TT(" is put on top of the deck."," bị đặt lên đầu bộ bài."))}
    else if(v.v==="setTop"){if(o.deck.length){putSet(c,takeTop(o),false);log(TT("A card is set on "+c.n+".","1 lá được gắn vào "+c.n+"."))}}
    else if(v.v==="grant"){(c.granted=c.granted||[]).push(v.ab);log(c.n+TT(" gains an ability this turn."," nhận một năng lực trong lượt này."))}
    else if(v.v==="trait"){(c.tmpTrait=c.tmpTrait||[]).push(v.n)}
    else if((v.v==="sleep"||v.v==="stun")&&o!==p&&has(c,"noFxSleep")){log(c.n+TT(" is protected."," được bảo vệ."));continue}
    else if(v.v==="sleep"){if(c.state==="active"){c.state="sleep";hit(c,"sleep");log(c.n+TT(" falls asleep."," đi ngủ."))}}
    else if(v.v==="stun"){c.state="stun";log(c.n+TT(" is stunned."," bị choáng."))}
    else if(v.v==="activate"){activate(c);log(c.n+(c.state==="active"?TT(" is active."," hoạt động."):TT(" is now sleeping."," chuyển sang ngủ.")))}
    else if(v.v==="bottom"||v.v==="bounce"){
      hit(c,v.v);leaveScene(o,c);
      if(v.v==="bottom"){o.deck.unshift(c.base);log(c.n+TT(" is put on the bottom of the deck."," bị đặt xuống đáy bộ bài."))}
      else{o.hand.push(c.base);log(c.n+TT(" returns to hand."," trở về tay."))}
    }
    else if(v.v==="ap"){c.mod=(c.mod||0)+v.n;log(c.n+" AP "+(v.n>0?"+":"")+v.n+".")}
    else if(v.v==="battle"){c.battle=(c.battle||0)+v.n;log(c.n+" AP +"+v.n+".")}
    else if(v.v==="lp"){c.lpm=(c.lpm||0)+v.n;log(c.n+" LP "+(v.n>0?"+":"")+v.n+".")}
    else if(v.v==="lv"){c.lvm=(c.lvm||0)+v.n;log(c.n+TT(" level "," cấp ")+(v.n>0?"+":"")+v.n+".")}
    else if(v.v==="kw"){c.tmpKw=c.tmpKw||{};c.tmpKw[v.kw]=v.n||1;if(v.kw==="assault")c.tmpAssault=true;log(c.n+": "+verbLabel(v)+".")}
  }
}
function untargetable(c,o,p){return o!==p&&has(c,"untargetable")}
async function chooseCard(p,src,cards,question,none){
  if(!cards.length)return null;
  var opts=cards.map(function(c){return {l:c.n+(c.t==="c"?" (Lv "+c.lv+")":""),v:c.uid}});
  opts.push({l:none||TT("Choose nothing","Không chọn"),v:null});
  var v=await pick(p.i,src.n,question,opts,best(cards).uid);
  return v===null||v===undefined?null:cards.find(function(c){return c.uid===v})||null;
}
async function discardN(p,src,n){
  var done=0;
  for(var i=0;i<n&&p.hand.length;i++){await removeHandCard(p,src.n+TT(": remove 1 card from hand",": loại bỏ 1 lá trên tay"));done++}
  return done===n;
}
async function runOp(p,src,op,ctx){
  var o=G.p[1-p.i],who=op.opp?o:p,i,c,list;
  switch(op.op){
  case "seq":
    if(op.needSelfActive&&src.state!=="active")return false;
    if(op.opt){
      var cost=op.list.filter(function(x){return x.op==="discard"}).reduce(function(s,x){return s+x.n},0);
      if(p.hand.length<cost)return false;
      if(!await yesNo(p,src,TT("Pay this cost: sleep this character and remove a card from hand?","Trả chi phí: cho nhân vật này ngủ và loại bỏ 1 lá trên tay?"),p.hand.length>1))return false;
    }
    var ok=false;
    for(i=0;i<op.list.length;i++)ok=await runOp(p,src,op.list[i],ctx)||ok;
    return ok;
  case "draw":draw(who,op.n);log(nm(who.i)+TT(" draw"+(who.i?"s ":" ")+op.n+" card(s)."," rút "+op.n+" lá."));return true;
  case "discard":
    if(!who.hand.length)return false;
    if(op.opt){
      if(p.hand.length<op.n)return false;
      if(!await yesNo(p,src,TT("Remove "+op.n+" card(s) from your hand?","Loại bỏ "+op.n+" lá trên tay?"),p.hand.length>op.n))return false;
    }
    if(op.random){for(i=0;i<op.n&&who.hand.length;i++){c=who.hand.splice(rnd(who.hand.length),1)[0];who.rem.push(c);log(nm(who.i)+TT(" lose"+(who.i?"s ":" ")+c.n+" at random."," bị loại ngẫu nhiên "+c.n+"."))}return true}
    return await discardN(who,src,op.n);
  case "gain":
    var gets=op.opp?o:p;
    if(op.opt&&!await yesNo(p,src,TT("Give or take "+op.n+" evidence?","Thực hiện nhận "+op.n+" chứng cứ?"),!op.opp))return false;
    for(i=0;i<op.n;i++)gets.ev.push(takeTop(gets));
    ctx.gained=true;
    await evGained(gets);
    log(nm(gets.i)+TT(" gain"+(gets.i?"s ":" ")+op.n+" evidence."," nhận "+op.n+" chứng cứ."));return true;
  case "mill":
    if(op.opt&&!await yesNo(p,src,TT("Remove "+op.n+" card(s) from the top of "+(op.opp?"the opponent's":"your")+" deck?","Loại bỏ "+op.n+" lá trên cùng bộ bài"+(op.opp?" đối thủ":"")+"?"),!!op.opp))return false;
    for(i=0;i<op.n;i++){var mc=takeTop(who);who.rem.push(mc);hit(mc,"remove")}
    log(nm(who.i)+TT(" move"+(who.i?"s ":" ")+op.n+" card(s) from the deck to the Remove area."," chuyển "+op.n+" lá từ bộ bài vào Khu loại bỏ."));return true;
  case "self":
    if(p.scene.indexOf(src)<0)return false;
    if(op.list[0].v==="battle")return await applyVerbs(p,src,{c:src,o:p},op.list),true;
    if(op.opt&&!await yesNo(p,src,op.list.map(verbLabel).join(", ")+"?",false))return false;
    await applyVerbs(p,src,{c:src,o:p},op.list);return true;
  case "takeSelf":
    if(!ctx.fromEvidence)return false;
    p.hand.push(src.base||src);ctx.claimed=true;log(src.n+TT(" is added to hand."," được đưa lên tay."));return true;
  case "selfToEvidence":
    if(p.scene.indexOf(src)>-1){leaveScene(p,src);src.base.up=true;p.ev.push(src.base)}
    else if(ctx.fromEvidence){src.up=true;p.ev.push(src);ctx.claimed=true}
    else return false;
    log(src.n+TT(" becomes evidence."," trở thành chứng cứ."));return true;
  case "fileToHand":
    if(!p.file.length||(op.opt&&!await yesNo(p,src,TT("Take the top card of your FILE area into your hand? Your FILE area gets smaller.","Đưa lá trên cùng Khu FILE lên tay? Khu FILE sẽ giảm."),false)))return false;
    for(i=0;i<op.n&&p.file.length;i++)p.hand.push(p.file.pop());return true;
  case "fileRemove":
    if(!p.file.length)return false;p.rem.push(p.file.pop());return true;
  case "battle":
    var inC=(ctx.contact||[]).filter(function(x){return x.o.scene.indexOf(x.c)>-1});
    if(!inC.length)return false;
    var t0=op.n>0?inC.find(function(x){return x.o===p}):inC.find(function(x){return x.o!==p});
    if(!t0)return false;
    t0.c.battle=(t0.c.battle||0)+op.n;log(t0.c.n+" AP "+(op.n>0?"+":"")+op.n+".");return true;
  case "target":return await runTarget(p,src,op,ctx);
  case "fromHand":
    c=await chooseCard(p,src,handMatch(p,src,op.f).filter(function(x){return x.t==="c"}),TT("Enter a character from your hand?","Cho một nhân vật từ tay vào sân?"));
    if(!c)return false;
    var came=await enterChar(p,c,{sleep:op.sleep});
    if(came)ctx.that={c:came,o:p};
    return !!came;
  case "useEvent":
    c=await chooseCard(p,src,handMatch(p,src,op.f).filter(function(x){return x.t==="e"&&!eventReason(p,x)}),TT("Use an Event from your hand?","Dùng một Sự kiện từ tay?"));
    if(!c)return false;
    p.hand.splice(p.hand.indexOf(c),1);log(nm(p.i)+TT(" use"+(p.i?"s ":" ")+c.n+"."," dùng "+c.n+"."));
    if(!await resolveEvent(p,c))p.rem.push(c);
    return true;
  case "discardF":case "showF":
    list=handMatch(p,src,op.f);
    if(list.length<op.n)return false;
    var chosen=[];
    for(i=0;i<op.n;i++){
      c=await chooseCard(p,src,list.filter(function(x){return chosen.indexOf(x)<0}),op.op==="showF"?TT("Reveal which card?","Lật lá nào?"):TT("Remove which card from hand?","Loại bỏ lá nào trên tay?"));
      if(!c)return false;
      chosen.push(c);
    }
    if(op.op==="showF"){log(TT("Revealed: ","Lật: ")+chosen.map(function(x){return x.n}).join(", ")+".");return true}
    chosen.forEach(function(x){p.hand.splice(p.hand.indexOf(x),1);p.rem.push(x);log(nm(p.i)+TT(" remove"+(p.i?"s ":" ")+x.n+" from hand."," loại bỏ "+x.n+" từ tay."))});
    return true;
  case "handToEv":
    var put=0;
    for(i=0;i<op.n&&p.hand.length;i++){
      c=await chooseCard(p,src,p.hand,TT("Which card becomes evidence?","Lá nào làm chứng cứ?"));
      if(!c)break;
      p.hand.splice(p.hand.indexOf(c),1);delete c.up;p.ev.push(c);put++;
    }
    return put>0;
  case "flip":
    var sides=op.who==="opp"?[o]:op.who==="own"?[p]:[p,o],want=op.to==="up";
    var found2=[];sides.forEach(function(q){q.ev.forEach(function(x){if(!!x.up!==want)found2.push({x:x,q:q})})});
    if(!found2.length)return false;
    if(op.opt&&!await yesNo(p,src,TT("Turn "+op.n+" evidence face "+op.to+"?",(want?"Lật ngửa ":"Úp ")+op.n+" chứng cứ?"),true))return false;
    found2.slice(-op.n).forEach(function(z){z.x.up=want});
    log(TT(Math.min(op.n,found2.length)+" evidence turned face "+op.to+".",(want?"Lật ngửa ":"Úp ")+Math.min(op.n,found2.length)+" chứng cứ."));
    return true;
  case "evBottom":
    if(!o.ev.length)return false;
    c=o.ev.pop();delete c.up;o.deck.unshift(c);log(TT("1 evidence goes to the bottom of the deck.","1 chứng cứ bị đặt xuống đáy bộ bài."));return true;
  case "flag":
    if(op.f==="noEvidence")G.noEvidence=true;
    else if(op.f==="forceGuard")G.forceGuard=true;
    else if(op.f==="noHint")p.noHint=true;
    else if(op.f==="noCutDis"){o.noCut=true;o.noDisguise=true}
    else if(ctx.inAction)G.noCutin=o.i;
    else o.noCut=true;
    return true;
  case "bottomToHand":
    for(i=0;i<op.n&&p.deck.length;i++){p.hand.push(p.deck.shift());if(!p.deck.length)refresh(p)}
    return true;
  case "investigate":
    var n2=Math.min(op.n,o.deck.length),top=o.deck.splice(o.deck.length-n2,n2);
    ctx.found=top;o.deck=top.concat(o.deck);
    log(TT("Investigate "+op.n+": ","Điều tra "+op.n+": ")+top.map(function(x){return x.n+" (Lv "+x.lv+")"}).join(", ")+".");
    return true;
  case "setTop":
    var on=op.on==="self"?{c:src,o:p}:ctx.that;
    if(!on||on.o.scene.indexOf(on.c)<0)return false;
    for(i=0;i<op.n&&p.deck.length;i++)putSet(on.c,takeTop(p),false);
    log(TT(op.n+" card(s) set on "+on.c.n+".",op.n+" lá được gắn vào "+on.c.n+"."));return true;
  case "attach":
    if(!ctx.isEvent)return false;
    var host=op.that?ctx.that:null;
    if(!op.that){
      var hs=allChars(function(x,q){return match(x,q,op.f,p,src)});
      if(!hs.length)return false;
      var hv=await pick(p.i,src.n,TT("Set this Event on which character?","Gắn Sự kiện này vào nhân vật nào?"),hs.map(function(x){return {l:x.c.n+" (AP "+apOf(x.c,x.o)+")",v:x.c.uid}}),hs.slice().sort(function(a,b){return val(b.c,b.o)-val(a.c,a.o)})[0].c.uid);
      host=hs.find(function(x){return x.c.uid===hv})||hs[0];
    }
    if(!host||host.o.scene.indexOf(host.c)<0)return false;
    putSet(host.c,src,true);ctx.claimed=true;ctx.that=host;
    log(src.n+TT(" is set on "," được gắn vào ")+host.c.n+".");return true;
  case "unset":
    var done=0;
    for(i=0;i<op.n;i++){
      var opts3=allChars(function(x,q){return (op.who==="any"||(op.who==="own")===(q===p))&&(x.under||[]).some(function(u){return !op.down||!u.up})});
      if(!opts3.length)break;
      var mineFirst=opts3.slice().sort(function(a,b){return (a.o===p?0:1)-(b.o===p?0:1)});
      var uv=await pick(p.i,src.n,TT("Remove a set card from which character?","Loại bỏ lá được gắn của nhân vật nào?"),opts3.map(function(x){return {l:(x.o===p?TT("Your ","Của bạn: "):TT("Their ","Đối thủ: "))+x.c.n,v:x.c.uid}}).concat(op.opt?[{l:TT("None","Không"),v:null}]:[]),mineFirst[0].c.uid);
      if(uv===null||uv===undefined)break;
      var z=opts3.find(function(x){return x.c.uid===uv});if(!z)break;
      takeSet(z.o,z.c,z.c.under.find(function(u){return !op.down||!u.up}));done++;
    }
    return done>0;
  case "selfToPA":
    if(ctx.fromEvidence||ctx.isEvent){p.pa.push(src);ctx.claimed=true;log(src.n+TT(" moves to the Partner area."," chuyển vào khu Cộng sự."));return true}
    return false;
  case "paRemove":
    list=p.pa.filter(function(x){return match(x,p,Object.assign({},op.f,{side:"any",zone:"hand"}),p,src)});
    if(list.length<op.n||!await yesNo(p,src,TT("Remove "+op.n+" card(s) from your Partner area?","Loại bỏ "+op.n+" lá ở khu Cộng sự?"),true))return false;
    list.slice(0,op.n).forEach(function(x){p.pa.splice(p.pa.indexOf(x),1);p.rem.push(x)});return true;
  case "enterSelf":
    var card=src.base||src;
    if(ctx.fromEvidence){var e1=await enterChar(p,card,{keepHand:true});if(e1)ctx.claimed=true;return !!e1}
    var at=p.rem.indexOf(card);if(at<0)return false;
    p.rem.splice(at,1);
    if(await enterChar(p,card,{keepHand:true}))return true;
    p.rem.push(card);return false;
  case "that":
    if(!ctx.that||ctx.that.o.scene.indexOf(ctx.that.c)<0)return false;
    await applyVerbs(p,src,ctx.that,op.list);return true;
  case "attacker":
    if(!G.attacker||G.attacker.o.scene.indexOf(G.attacker.c)<0)return false;
    await applyVerbs(p,src,G.attacker,op.list);return true;
  case "startContact":
    if(p.scene.indexOf(src)<0)return false;
    list=allChars(function(x,q){return q!==p&&!untargetable(x,q,p)});
    if(!list.length)return false;
    var cv=await pick(p.i,src.n,TT("Start a Contact with which character?","Cho Tiếp xúc với nhân vật nào?"),list.map(function(x){return {l:x.c.n+" (AP "+apOf(x.c,x.o)+")",v:x.c.uid}}).concat([{l:TT("No target","Không chọn"),v:null}]),(list.filter(function(x){return apOf(x.c,x.o)<=apOf(src,p)}).sort(function(a,b){return val(b.c,b.o)-val(a.c,a.o)})[0]||{c:{uid:null}}).c.uid);
    var foe=list.find(function(x){return x.c.uid===cv});if(!foe)return false;
    await contact(p.i,src,foe.c);return true;
  case "search":
    var k=Math.min(op.n,p.deck.length),looked=p.deck.splice(p.deck.length-k,k),picks=[];
    for(i=0;i<(op.count||1);i++){
      c=await chooseCard(p,src,looked.filter(function(x){return picks.indexOf(x)<0&&(!op.enter||x.t==="c")&&match(x,p,Object.assign({},op.f,{side:"any"}),p,src)}),op.enter?TT("You look at your top "+k+" cards. Enter one?","Bạn xem "+k+" lá trên cùng. Cho một lá vào sân?"):TT("You look at your top "+k+" cards. Add one to your hand?","Bạn xem "+k+" lá trên cùng. Đưa một lá lên tay?"));
      if(!c)break;picks.push(c);
    }
    var rest=looked.filter(function(x){return picks.indexOf(x)<0});
    if(op.rest==="rem")p.rem=p.rem.concat(rest);else p.deck=rest.concat(p.deck);
    log(nm(p.i)+TT(" look"+(p.i?"s":"")+" at the top "+k+" cards"+(picks.length?" and take"+(p.i?"s ":" ")+picks.map(function(x){return x.n}).join(", ")+".":".")," xem "+k+" lá trên cùng"+(picks.length?" và lấy "+picks.map(function(x){return x.n}).join(", ")+".":".")));
    for(i=0;i<picks.length;i++){
      if(!op.enter){p.hand.push(picks[i]);continue}
      var inn=await enterChar(p,picks[i],{keepHand:true,sleep:op.sleep});
      if(inn)ctx.that={c:inn,o:p};else p.rem.push(picks[i]);
    }
    if(!p.deck.length)refresh(p);
    return picks.length>0;
  case "dig":
    var seen=[],got=null;
    while(p.deck.length&&!got){var x=p.deck.pop();if(match(x,p,Object.assign({},op.f,{side:"any"}),p,src))got=x;else seen.push(x)}
    p.deck=shuffle(seen.concat(p.deck));
    if(got){
      log(nm(p.i)+TT(" reveal"+(p.i?"s":"")+" cards until "+got.n+"."," lật bài đến khi gặp "+got.n+"."));
      if(op.enter){if(!await enterChar(p,got,{keepHand:true}))p.rem.push(got)}else p.hand.push(got);
    }
    if(!p.deck.length)refresh(p);
    return !!got;
  case "revealTop":
    if(!p.deck.length)return false;
    c=p.deck.pop();
    var isHit=match(c,p,Object.assign({},op.f,{side:"any"}),p,src);
    log(TT("Revealed: ","Lật được: ")+c.n+".");
    if(isHit&&op.enter){if(!await enterChar(p,c,{keepHand:true}))p.rem.push(c)}
    else if(isHit||op.elseHand)p.hand.push(c);
    else p.deck.unshift(c);
    if(!p.deck.length)refresh(p);
    return isHit;
  case "reveal":
    if(p.i===0&&!G.sim){OPP_HAND_REVEALED=true;render()}
    log(TT("Revealed hand: ","Lật bài trên tay: ")+(o.hand.map(function(x){return x.n}).join(", ")||"-"));return true;
  case "oneOf":
    var opts=op.list.map(function(s,n){return {l:TT("Option ","Lựa chọn ")+(n+1)+": "+clean(window.ConanTr?ConanTr.text(op.text[n].replace(/^[・•]/,""),LANG):op.text[n]),v:n}});
    if(op.both&&holds(op.both,p,src,ctx)){var rb=false;for(var bi=0;bi<op.list.length;bi++)rb=await runSteps(p,src,op.list[bi],ctx)||rb;return rb}
    if(op.k>=op.list.length){var ra=false;for(var ai=0;ai<op.list.length;ai++)ra=await runSteps(p,src,op.list[ai],ctx)||ra;return ra}
    if(op.k===2){
      var first=await pick(p.i,src.n,TT("Choose the first of two.","Chọn lựa chọn thứ nhất (trong hai)."),opts,0);
      var rest2=opts.filter(function(x){return x.v!==first});
      var second=await pick(p.i,src.n,TT("Choose the second.","Chọn lựa chọn thứ hai."),rest2,rest2[0].v);
      var r1=await runSteps(p,src,op.list[first]||op.list[0],ctx);
      return await runSteps(p,src,op.list[second]||op.list[1],ctx)||r1;
    }
    var pickN=await pick(p.i,src.n,TT("Choose one.","Chọn một."),opts,0);
    return await runSteps(p,src,op.list[pickN]||op.list[0],ctx);
  case "nothing":return true;
  case "drawTo":
    var want=op.n-p.hand.length;if(want<=0)return false;
    draw(p,want);log(nm(p.i)+TT(" draw"+(p.i?"s ":" ")+want+" card(s)."," rút "+want+" lá."));return true;
  case "oppFileUp":
    var fl=o.file.slice(-op.n);if(!fl.length)return false;
    fl.forEach(function(x){x.up=true});log(TT("The opponent's top FILE card is turned face up: ","Lá FILE trên cùng của đối thủ được lật ngửa: ")+fl.map(function(x){return x.n}).join(", ")+".");return true;
  case "reenterSelf":
    var base=src.base||src,ri=p.rem.indexOf(base);
    if(ri<0||p.scene.length>=5)return false;
    if(!await yesNo(p,src,TT("Enter "+src.n+" again from the Remove area, asleep?","Cho "+src.n+" vào sân lại từ Khu loại bỏ, ở trạng thái ngủ?"),true))return false;
    p.rem.splice(ri,1);p.hand.push(base);
    return !!(await enterChar(p,base,{sleep:true}));
  case "remToDeck":
    if(!p.rem.length)return false;
    p.deck=shuffle(p.rem.splice(0).concat(p.deck));log(nm(p.i)+TT(" shuffle"+(p.i?"s":"")+" the Remove area into the deck."," xáo Khu loại bỏ vào bộ bài."));return true;
  case "all":
    var everyone=allChars(function(x,q){return !untargetable(x,q,p)&&match(x,q,op.f,p,src)});
    for(i=0;i<everyone.length;i++)await applyVerbs(p,src,everyone[i],op.list);
    return everyone.length>0;
  case "evTake":
    if(p.ev.length<op.n)return false;
    if(op.opt&&!await yesNo(p,src,op.rem?TT("Remove your top evidence?","Loại bỏ chứng cứ trên cùng?"):TT("Take "+op.n+" evidence into your hand?","Đưa "+op.n+" chứng cứ lên tay?"),p.ev.length>=p.lv))return false;
    for(i=0;i<op.n;i++){c=p.ev.pop();delete c.up;if(op.rem)p.rem.push(c);else p.hand.push(c)}
    log(nm(p.i)+TT(op.rem?" remove"+(p.i?"s ":" ")+op.n+" evidence.":" take"+(p.i?"s ":" ")+op.n+" evidence into hand.",op.rem?" loại bỏ "+op.n+" chứng cứ.":" đưa "+op.n+" chứng cứ lên tay."));
    return true;
  case "oppReveal":
    if(!o.deck.length)return false;
    ctx.revealed=o.deck[o.deck.length-1];log(TT("Opponent reveals ","Đối thủ lật ")+ctx.revealed.n+".");return true;
  case "oppTopBottom":
    if(!ctx.revealed||o.deck[o.deck.length-1]!==ctx.revealed)return false;
    var down=await pick(p.i,src.n,ctx.revealed.n+TT(": top or bottom of their deck?",": đặt lên đầu hay xuống đáy bộ bài?"),[{l:TT("Bottom","Xuống đáy"),v:true},{l:TT("Top","Lên đầu"),v:false}],ctx.revealed.lv>=5);
    if(down)o.deck.unshift(o.deck.pop());return true;
  }
  return false;
}
function handMatch(p,src,f){return p.hand.filter(function(x){return match(x,p,Object.assign({},f,{side:"any",zone:"hand"}),p,src)})}
async function runTarget(p,src,op,ctx){
  var f=op.f,v=op.list[0],done=false,picked=[];
  for(var n=0;n<op.n;n++){
    if(f.zone==="rem"){
      var c=await chooseCard(p,src,p.rem.filter(function(x){return x!==src&&match(x,p,f,p,src)&&(v.v!=="enter"||x.t==="c")&&!(f.distinct&&picked.some(function(y){return y.n===x.n}))}),verbLabel(v)+TT(" (from your Remove area)"," (từ Khu loại bỏ)"));
      if(!c)break;
      picked.push(c);p.rem.splice(p.rem.indexOf(c),1);hit(c,v.v);
      if(v.v==="toHand"){p.hand.push(c);log(c.n+TT(" returns to hand."," được đưa lên tay."))}
      else if(v.v==="bottom")p.deck.unshift(c);
      else if(v.v==="top")p.deck.push(c);
      else if(v.v==="toPA"){p.pa.push(c);log(c.n+TT(" moves to the Partner area."," chuyển vào khu Cộng sự."))}
      else if(v.v==="toSet"){if(p.scene.indexOf(src)<0){p.rem.push(c);break}putSet(src,c,true)}
      else{
        var e=await enterChar(p,c,{sleep:v.sleep,keepHand:true});
        if(!e){p.rem.push(c);break}
        ctx.that={c:e,o:p};
      }
      done=true;continue;
    }
    var cands=allChars(function(x,o){return picked.indexOf(x)<0&&!untargetable(x,o,p)&&match(x,o,f,p,src)&&!(f.distinct&&picked.some(function(y){return y.n===x.n}))});
    if(v.v==="toSet")cands=cands.filter(function(x){return x.c!==src&&x.o===p});
    if(op.list.length===1&&v.v==="activate")cands=cands.filter(function(x){return x.c.state!=="active"});
    if(op.list.length===1&&v.v==="sleep")cands=cands.filter(function(x){return x.c.state==="active"});
    if(!cands.length)break;
    var opts=cands.map(function(x){return {l:(x.o===p?TT("Your ","Của bạn: "):TT("Their ","Đối thủ: "))+x.c.n+" (AP "+apOf(x.c,x.o)+")",v:x.c.uid}});
    opts.push({l:TT("No target","Không chọn"),v:null});
    var pool=cands.filter(function(x){return op.own?x.o===p:harmful(op.list)?x.o!==p:x.o===p});
    pool.sort(function(a,b){return op.own?val(a.c,a.o)-val(b.c,b.o):val(b.c,b.o)-val(a.c,a.o)});
    var pref=pool.length?pool[0].c.uid:null;
    if(lvlOf(p.i)==="easy"&&pool.length)pref=chance(20)?null:pool[rnd(pool.length)].c.uid;
    var uid=await pick(p.i,src.n,TT("Choose a character: ","Chọn nhân vật: ")+op.list.map(verbLabel).join(", "),opts,pref);
    if(uid===null||uid===undefined)break;
    var t=cands.find(function(x){return x.c.uid===uid});
    if(!t)break;
    picked.push(t.c);ctx.that=t;
    if(v.v==="toSet"){if(p.scene.indexOf(src)<0)break;var card=t.c.base;leaveScene(t.o,t.c);putSet(src,card,true);log(card.n+TT(" is set under "," được đặt dưới ")+src.n+".")}
    else await applyVerbs(p,src,t,op.list);
    done=true;
  }
  return done;
}

/* ---------- custom events, Declare and Cut-in ---------- */
function eventAbility(c){return (c.fx||[]).filter(function(a){return a.trig==="event"})}
function eventReason(p,c){
  var abs=eventAbility(c);
  if(!abs.length)return c.missing?TT(c.n+": this event is not automated yet.",c.n+": sự kiện này chưa được tự động hóa."):TT(c.n+" can only be used as a Cut-in.",c.n+" chỉ dùng được làm Cut-in.");
  if(!abs.some(function(a){return ready(a,p,c)}))return TT(c.n+": its conditions are not met.",c.n+": chưa thỏa điều kiện.");
  return "";
}
function costMatches(p,c,k){return handMatch(p,c,k.f)}
function costPayable(p,c,k){
  if(k.c==="sleep")return c.state==="active";
  if(k.c==="discard")return p.hand.length>=k.n;
  if(k.c==="mill")return p.deck.length>k.n;
  if(k.c==="sleepOther")return p.scene.some(function(x){return (x!==c||k.self)&&x.state==="active"&&(x===c||match(x,p,k.f,p,c))});
  if(k.c==="flip")return p.ev.filter(function(x){return !x.up}).length>=k.n;
  if(k.c==="fileRemove")return p.file.length>=k.n;
  if(k.c==="unsetSelf")return (c.under||[]).length>0;
  if(k.c==="unsetAny")return allChars(function(x){return true}).reduce(function(s,x){return s+(x.c.under||[]).length},0)>=(k.n||1);
  if(k.c==="remBottom")return p.rem.filter(function(x){return match(x,p,Object.assign({},k.f,{zone:"rem"}),p,c)}).length>=k.n;
  if(k.c==="bottomOther")return p.scene.filter(function(x){return x!==c&&match(x,p,k.f,p,c)}).length>=k.n;
  if(k.c==="discardF"||k.c==="showF")return costMatches(p,c,k).length>=k.n;
  if(k.c==="paRemove")return p.pa.filter(function(x){return match(x,p,Object.assign({},k.f,{side:"any",zone:"hand"}),p,c)}).length>=k.n;
  return true;
}
function declAbilities(p,c){
  var inPA=!!c.mrPA;
  return abilitiesOf(c).filter(function(a){
    if(a.trig!=="decl"||!ready(a,p,c))return false;
    if(inPA&&(!a.inPA||a.cost.some(function(k){return k.c==="bottomSelf"||k.c==="removeSelf"||k.c==="unsetSelf"})))return false;
    if(a.once?usedCount(c,a)>=a.once:false)return false;
    return a.cost.every(function(k){return costPayable(p,c,k)});
  });
}
function hasDecl(c){return !!c.decl||hasTrig(c,"decl")}
/* characters (and your Case) that have a Declare ability */
function declarers(p){return p.scene.filter(hasDecl).concat(paMR(p).filter(function(x){return abilitiesOf(x).some(function(a){return a.trig==="decl"&&a.inPA})}),p.caseSrc?[p.caseSrc]:[])}
async function useCustomDecl(p,c){
  var usable=declAbilities(p,c);if(!usable.length)return;
  var a=usable[0];
  if(usable.length>1&&isHuman(p.i)){
    var w=await ask(c.n,TT("This card has more than one ability. Which one?","Lá này có nhiều năng lực. Dùng cái nào?"),usable.map(function(x,n){return {l:TT("Ability ","Năng lực ")+(n+1)+": "+x.steps.map(function(s){return s.op}).join(", "),v:n}}));
    a=usable[w]||a;
  }
  var tired=null,i,k;
  for(i=0;i<a.cost.length;i++)if(a.cost[i].c==="sleepOther"){
    k=a.cost[i];
    var list=p.scene.filter(function(x){return (x!==c||k.self)&&x.state==="active"&&(x===c||match(x,p,k.f,p,c))});
    var v=await pick(p.i,c.n,TT("Cost: sleep which character?","Chi phí: cho nhân vật nào ngủ?"),list.map(function(x){return {l:x.n,v:x.uid}}).concat(isHuman(p.i)?[{l:TT("Cancel","Hủy"),v:null}]:[]),list.slice().sort(function(a,b){return val(a,p)-val(b,p)})[0].uid);
    if(v===null||v===undefined)return;
    tired=list.find(function(x){return x.uid===v});
  }
  if(a.once)markUsed(c,a);
  c.botUsed=true;
  var keepOwner=G.curOwner,keepSrc=G.curSrc,keepHits=G.hits,keepCost=G.costHits;G.curOwner=p.i;G.curSrc=c;G.hits=[];G.costHits=[];G.payingCost=true;
  try{
  log(nm(p.i)+TT(" use"+(p.i?"s":"")+" "+c.n+"'s ability."," dùng năng lực của "+c.n+"."));
  for(i=0;i<a.cost.length;i++){
    k=a.cost[i];
    if(k.c==="sleep")c.state="sleep";
    else if(k.c==="discard")await discardN(p,c,k.n);
    else if(k.c==="mill"){for(var m=0;m<k.n;m++){var mc2=takeTop(p);p.rem.push(mc2);hit(mc2,"remove")}}
    else if(k.c==="sleepOther"&&tired){tired.state="sleep";hit(tired,"sleep")}
    else if(k.c==="unsetAny"&&k.n>1){for(var un=0;un<k.n;un++)await runOp(p,c,{op:"unset",who:"any",n:1},{})}
    else if(k.c==="remBottom"){for(var rb=0;rb<k.n;rb++){var rc=await chooseCard(p,c,p.rem.filter(function(x){return match(x,p,Object.assign({},k.f,{zone:"rem"}),p,c)}),TT("Cost: put a card from your Remove area on the bottom of your deck","Chi phí: đặt 1 lá từ Khu loại bỏ xuống đáy bộ bài"));if(!rc)break;p.rem.splice(p.rem.indexOf(rc),1);p.deck.unshift(rc);hit(rc,"bottom")}}
    else if(k.c==="bottomOther"){for(var bo=0;bo<k.n;bo++){var bl=p.scene.filter(function(x){return x!==c&&match(x,p,k.f,p,c)});if(!bl.length)break;var bv=await pick(p.i,c.n,TT("Cost: put which character on the bottom of your deck?","Chi phí: đặt nhân vật nào xuống đáy bộ bài?"),bl.map(function(x){return {l:x.n,v:x.uid}}),bl.slice().sort(function(a,b){return val(a,p)-val(b,p)})[0].uid);var bc=bl.find(function(x){return x.uid===bv})||bl[0];hit(bc,"bottom");leaveScene(p,bc);p.deck.unshift(bc.base)}}
    else if(k.c==="bottomSelf"){var base=c.base;leaveScene(p,c);p.deck.unshift(base)}
    else if(k.c==="removeSelf")await removeChar(p,c,c.n);
    else if(k.c==="flip")p.ev.filter(function(x){return !x.up}).slice(-k.n).forEach(function(x){x.up=true});
    else if(k.c==="fileRemove"){for(var f=0;f<k.n;f++)p.rem.push(p.file.pop())}
    else if(k.c==="unsetSelf")takeSet(p,c,c.under[c.under.length-1]);
    else if(k.c==="unsetAny"&&!(k.n>1))await runOp(p,c,{op:"unset",who:"any",n:1},{});
    else if(k.c==="discardF"||k.c==="showF")await runOp(p,c,{op:k.c,f:k.f,n:k.n},{});
    else if(k.c==="paRemove")p.pa.filter(function(x){return match(x,p,Object.assign({},k.f,{side:"any",zone:"hand"}),p,c)}).slice(0,k.n).forEach(function(x){p.pa.splice(p.pa.indexOf(x),1);p.rem.push(x.base||x)});
  }
  settleMR();
  G.payingCost=false;
  await runSteps(p,c,a.steps,{});
  if(p.scene.indexOf(c)>-1)await allyTriggers(p,c,"allyDecl");
  }finally{G.payingCost=false;G.curOwner=keepOwner;G.curSrc=keepSrc;G.hits=keepHits;G.costHits=keepCost}
}
/* Disguise: swap a hand card for your character in a Contact */
function canDisguise(card,p){return card.disguise&&(card.fx||[]).some(function(a){return a.trig==="disguise"&&ready(a,p,card)})}
async function disguiseSwap(p,old,card){
  var at=p.scene.indexOf(old);if(at<0)return null;
  p.hand.splice(p.hand.indexOf(card),1);
  var base=old.base,state=old.state,fresh=old.fresh;
  leaveScene(p,old);
  var nc=mkChar(card);nc.state=state;nc.fresh=fresh;
  p.scene.splice(at,0,nc);p.deck.unshift(base);settleMR();
  log(nm(p.i)+TT(" disguise"+(p.i?"s ":" ")+base.n+" into "+card.n+"."," cải trang "+base.n+" thành "+card.n+"."));
  await trigger(p,nc,"disguised",{});
  return nc;
}

/* AP a Cut-in card would give to character `mine` right now */
function cutValue(card,p,mine){
  if(!card.cut)return card.cutin||0;
  var a=card.cut;
  if(!ready(a,p,card))return 0;
  if(a.alt&&mine&&match(mine,p,Object.assign({},a.alt.f,{side:"any"}),p,card))return a.alt.ap;
  return a.per?a.ap*countChars(a.per,p,card):a.ap;
}
function cutUsable(card,p,mine){
  if(!card.cutin)return false;
  if(!card.cut)return card.t==="c";
  return ready(card.cut,p,card)&&(cutValue(card,p,mine)>0||!!card.cut.steps);
}

/* ---------- who can attack and be attacked ---------- */
function mayAct(c){return !has(c,"noActGuard")&&!has(c,"idle")}
function canBeTargeted(c){return !has(c,"noTarget")}
function mayHit(atk,kind){
  if(kind==="case"&&has(atk,"noCase"))return false;
  if(!atk.fresh||has(atk,"swift")||has(atk,"assault"))return true;
  return has(atk,kind==="case"?"assaultCase":"assaultChar");
}
function targetsOf(atk,o){
  return o.scene.filter(function(c){return mayHit(atk,"char")&&canBeTargeted(c)&&(isDown(c)||has(atk,"hitActive")||(has(atk,"hitActiveSet")&&(c.under||[]).length))});
}
function caseOpen(atk,o){return o.ev.length>0&&mayHit(atk,"case")}
function guardsOf(o){return o.scene.filter(function(c){return mayAct(c)&&(c.state==="active"||(c.state==="sleep"&&has(c,"sleepGuard")))})}
/* Whether a hand card is worth offering to a bot at all */
function botPlayable(p,c){
  if(c.lv>cap(p)||colorReason(p,c)||playLock(p,c))return false;
  if(c.t==="c")return true;
  var o=G.p[1-p.i];
  if(c.ev==="snipeEv")return o.scene.some(function(x){return apOf(x,o)<=8000});
  if(c.ev==="fx")return !eventReason(p,c);
  return p.scene.length<5;
}
function colorReason(p,c,viaHint){
  if((c.fx||[]).some(function(a){return a.trig==="static"&&a.give.some(function(g){return g.kw==="anyColor"||(viaHint&&g.kw==="anyColorHint")})}))return "";
  if(!p.def.caseColors||!p.def.caseColors.length||!(c.col||[]).length)return "";
  if(c.col.some(function(x){return p.def.caseColors.indexOf(x)>-1}))return "";
  return TT(c.n+" does not share a color with your Case.",c.n+" không cùng màu với Vụ án của bạn.");
}
async function caseSolved(p){
  var list=(p.def.fx||[]).filter(function(a){return a.trig==="solved"});
  var src=p.caseSrc||{n:p.def.caze.n,fx:p.def.fx,uid:0};
  for(var i=0;i<list.length;i++)await runAbility(p,src,list[i],{});
}

/* ---------- main-phase actions ---------- */
function playLock(p,c){
  if(c.t!=="c")return "";
  for(var i=0;i<p.scene.length;i++){var s=p.scene[i],abs=abilitiesOf(s);for(var j=0;j<abs.length;j++){var a=abs[j];
    if(a.trig==="static"&&a.only&&ready(a,p,s)&&!match(c,p,Object.assign({},a.only,{side:"any",zone:"hand"}),p,s))return TT(s.n+" lets you play only certain characters from hand.",s.n+" chỉ cho phép chơi một số nhân vật nhất định từ tay.")}}
  return "";
}
function canPlay(p,c,viaHint){
  var lock=playLock(p,c);if(lock)return lock;
  if(!viaHint){
    if(p.usedHint)return "You used Next Hint this turn, so you cannot play from hand.";
    if(p.usedHand)return "You already played from hand this turn. It is limited to once per turn.";
  }
  if(c.lv>cap(p))return "Level "+c.lv+" needs "+c.lv+" cards in the FILE area. You have "+cap(p)+".";
  var col=colorReason(p,c,viaHint);if(col)return col;
  if(c.ev==="fx"){var er=eventReason(p,c);if(er)return er}
  return "";
}
async function playFromHand(p,c,viaHint){
  var keepSrc=G.curSrc;G.curSrc=null;
  if(c.t==="c"){
    var e=await enterChar(p,c,{fromHand:true});
    G.curSrc=keepSrc;
    if(!e)return false;
  }else{
    G.curSrc=keepSrc;
    p.hand=p.hand.filter(function(x){return x.uid!==c.uid});
    log(nm(p.i)+" play"+(p.i?"s":"")+" the event "+c.n+".");
    if(!await resolveEvent(p,c))p.rem.push(c);
    await allyTriggers(p,c,"allyEvent");
  }
  if(!viaHint)p.usedHand=true;
  else{var hs=p.scene.slice();for(var hi=0;hi<hs.length;hi++)if(p.scene.indexOf(hs[hi])>-1)await trigger(p,hs[hi],"hintUse",{});await paWatch(p,"hintUse",{})}
  return true;
}
async function deduce(p,src){
  var o=G.p[1-p.i],lp,who;
  if(src==="partner"){p.partner="sleep";lp=p.def.partner.lp;who="partner"}
  else{src.state="sleep";lp=lpOf(src);who=src.n}
  log(nm(p.i)+" deduce"+(p.i?"s":"")+" with "+who+" (LP "+lp+").");
  if(src!=="partner"&&src.hakdraw&&!src.trig){src.trig=true;draw(p,1);log(nm(p.i)+" draw"+(p.i?"s":"")+" 1 card (Hakuba).")}
  if(src!=="partner"){
    await trigger(p,src,"deduce",{});await trigger(p,src,"actded",{});await allyTriggers(p,src,"allyDeduce");await allyTriggers(p,src,"allyActded");
    var ow=o.scene.slice();for(var oi=0;oi<ow.length;oi++)if(o.scene.indexOf(ow[oi])>-1){await trigger(o,ow[oi],"oppDeduce",{});await trigger(o,ow[oi],"oppActded",{})}
    await paWatch(o,"oppDeduce",{});await paWatch(o,"oppActded",{});
    lp=p.scene.indexOf(src)>-1?lpOf(src):lp;
  }
  var md=o.scene.filter(function(c){return c.state==="active"&&mdOf(c)});
  while(md.length&&lp>0){
    var v=await pick(o.i,"Misdirect?","Sleep a character with Misdirect to give the deducing card LP -"+mdOf(md[0])+" until the deduction ends. Current LP: "+lp+".",md.map(function(c){return {l:c.n+" (Misdirect "+mdOf(c)+")",v:c.uid}}).concat([{l:"No",v:null}]),lvlOf(o.i)==="easy"&&chance(60)?null:md[0].uid);
    if(v===null||v===undefined)break;
    var m=md.find(function(c){return c.uid===v});if(!m)break;
    var cut=mdOf(m);m.state="sleep";lp-=cut;log(nm(o.i)+" use"+(o.i?"s":"")+" Misdirect with "+m.n+" (LP now "+Math.max(lp,0)+").");
    md=o.scene.filter(function(c){return c.state==="active"&&mdOf(c)});
  }
  var g=Math.max(lp,0);
  for(var i=0;i<g;i++)p.ev.push(takeTop(p));
  log(nm(p.i)+" gain"+(p.i?"s ":" ")+g+" evidence.");
  if(g>0)await evGained(p);
}
async function assist(p){
  p.partner="file";
  log(nm(p.i)+" use"+(p.i?"s":"")+" Assist: the partner moves to the FILE area.");
  if(p.phase==="case"&&cap(p)>=7){p.phase="solution";log(nm(p.i)+(p.i?"'s":"r")+" case moves to the solution phase (7 or more FILE cards).");await caseSolved(p)}
}
function solveCase(p){
  p.partner="sleep";
  if(p.def.caze.alt){
    for(var i=0;i<p.lv;i++)p.rem.push(p.ev.pop());
    endGame(p.i,nm(p.i)+" used Evidence Destruction, removing "+p.lv+" evidence. "+(p.i?"You lose.":"The opponent loses."));
  }
  if(p.ev.length>=p.lv)endGame(p.i,nm(p.i)+" solved the case with "+p.ev.length+" evidence against level "+p.lv+".");
  log("Case Solved declared with only "+p.ev.length+" evidence. It needs "+p.lv+", so nothing happens and the partner falls asleep.");
}
function solveReason(p){
  if(p.phase!=="solution")return "Case Solved needs your case in its solution phase. Get there with an Assist while holding 7 or more FILE cards.";
  if(p.partner!=="active")return "Case Solved needs an active partner.";
  if(p.def.caze.alt&&p.ev.length<p.lv)return "Evidence Destruction needs "+p.lv+" evidence to remove as its cost. You have "+p.ev.length+".";
  return "";
}
function declReason(p,c){
  if(c.decl==="fx"||!c.decl)return declAbilities(p,c).length?"":TT(c.n+": its ability cannot be used now.",c.n+": hiện không dùng được năng lực.");
  if(c.usedTurn)return c.n+" already used its ability this turn.";
  if(c.decl==="conan4"&&!p.scene.some(function(x){return x!==c&&x.state==="active"}))return "Conan's ability needs another active character to sleep.";
  if(c.decl==="shizuka"){
    if(!p.hand.length)return "Shizuka's ability needs a card in hand to remove.";
    if(downCount(G.p[1-p.i])<2)return "Shizuka's ability needs 2 or more sleeping or stunned characters in the opponent's Scene.";
    if(!p.scene.some(function(x){return x!==c&&x.lv<=6}))return "Shizuka needs another character of level 6 or less in your Scene.";
  }
  if(c.decl==="vermouth"){
    if(c.state!=="active")return "Vermouth must be active to use her ability.";
    if(!p.hand.some(function(x){return x.t==="c"&&x.lv<=5}))return "Vermouth's ability needs a level 5 or lower character in your hand.";
  }
  return "";
}
async function useDecl(p,c){
  if(c.decl==="fx"||!c.decl)return useCustomDecl(p,c);
  c.usedTurn=true;
  if(c.decl==="conan4"){
    var others=p.scene.filter(function(x){return x!==c&&x.state==="active"});
    var opts=others.map(function(x){return {l:x.n+" (AP "+apOf(x,p)+")",v:x.uid}});
    if(isHuman(p.i))opts.push({l:"Cancel",v:null});
    var pref=others.slice().sort(function(a,b){return val(a,p)-val(b,p)})[0].uid;
    var v=await pick(p.i,"Conan: sleep which character?","Cost: put another of your active characters to sleep.",opts,pref);
    if(v===null||v===undefined){c.usedTurn=false;return}
    var s=others.find(function(x){return x.uid===v});if(!s){c.usedTurn=false;return}
    s.state="sleep";log(nm(p.i)+" sleep"+(p.i?"s ":" ")+s.n+" to use Conan's ability.");
    draw(p,1);await removeHandCard(p,"Conan: remove 1 card from hand");
    c.lpm=(c.lpm||0)+1;log("Conan gets +1 LP this turn.");
  }else if(c.decl==="ran6"){
    log(nm(p.i)+" use"+(p.i?"s":"")+" Ran's ability.");
    await boost(p,c);
  }else if(c.decl==="shizuka"){
    var tg=p.scene.filter(function(x){return x!==c&&x.lv<=6});
    var sv=await pick(p.i,"Shizuka: give Assault to which character?","Level 6 or less. First remove 1 card from your hand as the cost.",tg.map(function(x){return {l:x.n+" (AP "+apOf(x,p)+")",v:x.uid}}).concat(isHuman(p.i)?[{l:"Cancel",v:null}]:[]),(tg.filter(function(x){return x.fresh&&x.state==="active"}).sort(function(a,b){return val(b,p)-val(a,p)})[0]||tg[0]).uid);
    if(sv===null||sv===undefined){c.usedTurn=false;return}
    await removeHandCard(p,"Shizuka: remove 1 card from hand");
    var tt=tg.find(function(x){return x.uid===sv});
    if(tt){tt.tmpAssault=true;log(tt.n+" gains Assault this turn.")}
  }else if(c.decl==="vermouth"){
    leaveScene(p,c);p.deck=[c.base].concat(p.deck);
    log(nm(p.i)+" put"+(p.i?"s":"")+" Vermouth on the bottom of the deck.");
    var hs=p.hand.filter(function(x){return x.t==="c"&&x.lv<=5});
    var hv=await pick(p.i,"Vermouth: enter a character","Level 5 or less. It gets Assault this turn.",hs.map(function(x){return {l:x.n+" (Lv "+x.lv+")",v:x.uid}}).concat([{l:"Do not enter",v:null}]),best(hs).uid);
    if(hv===null)return;
    var b=hs.find(function(x){return x.uid===hv})||hs[0];
    await enterChar(p,b,{assault:true});
  }
}

/* ---------- Actions and Contact ---------- */
async function contact(pi,atk,def){
  var dpi=1-pi,p=G.p[pi],o=G.p[dpi];
  var pair=[{c:atk,o:p},{c:def,o:o}];
  await trigger(p,atk,"contact",{contact:pair});await trigger(o,def,"contact",{contact:pair});
  await allyTriggers(p,atk,"allyContact");await allyTriggers(o,def,"allyContact");
  if(p.scene.indexOf(atk)<0||o.scene.indexOf(def)<0)return;
  if(atk.contact==="gin4"&&G.cur===pi&&def.lv<=6){
    log("Gin's ability triggers: "+def.n+" (level "+def.lv+") is removed on contact.");
    await removeChar(o,def,"Gin");return;
  }
  var a0=apOf(atk,p),d0=apOf(def,o);
  var first=a0<d0?pi:dpi;
  log("Contact: "+atk.n+" (AP "+a0+") vs "+def.n+" (AP "+d0+"). "+nm(first)+" can act first"+(a0===d0?" because equal AP puts the non-turn player first.":" because the lower AP goes first."));
  /* the Contact's progress is kept in G, so the look-ahead bot can imagine it from any point */
  var keep=G.cc;
  G.cc={pi:pi,atk:atk,def:def,ba:0,bd:0,pair:pair,first:first,step:0,r1:null,r2:null};
  try{await contactRun()}finally{G.cc=keep}
}
async function contactRun(){
  var s=G.cc,pi=s.pi,dpi=1-pi,p=G.p[pi],o=G.p[dpi];
  async function turnOf(pl){
    async function swap(card){
      var side=pl===pi,old=side?s.atk:s.def,nc=await disguiseSwap(G.p[pl],old,card);
      if(!nc)return;
      if(side){s.atk=nc;s.ba=0}else{s.def=nc;s.bd=0}
      s.pair[side?0:1].c=nc;
    }
    var mineA=(pl===pi),mine=mineA?s.atk:s.def,me=G.p[pl];
    var blocked=G.noCutin===pl||me.noCut||G.p[1-pl].scene.some(function(x){return has(x,"jamCut")});
    var cis=blocked?[]:me.hand.filter(function(c){return cutUsable(c,me,mine)});
    var dis=me.scene.indexOf(mine)>-1&&!me.noDisguise?me.hand.filter(function(c){return canDisguise(c,me)}):[];
    if(!cis.length&&!dis.length){if(blocked)log(nm(pl)+" cannot use Cut-in during this Action.");return null}
    var a1=apOf(s.atk,p),d1=apOf(s.def,o),my=mineA?a1+s.ba:d1+s.bd,their=mineA?d1+s.bd:a1+s.ba,card=null;
    var CV=function(c){return cutValue(c,me,mine)};
    var forced=G.force&&G.force.kind==="cut"&&G.force.pl===pl?G.force:null;
    if(forced)G.force=null;
    if(forced){
      if(typeof forced.v==="string"){var dc=dis.find(function(c){return "d"+c.uid===forced.v});if(dc){await swap(dc);return true}}
      card=forced.v===null?null:cis.find(function(c){return c.uid===forced.v})||null;
    }else if(isHuman(pl)){
      var opts=cis.map(function(c){return {l:c.n+" (Cut-in +"+CV(c)+")",v:c.uid}});dis.forEach(function(c){opts.push({l:c.n+TT(" (Disguise, AP "+c.ap+")"," (Cải trang, AP "+c.ap+")"),v:"d"+c.uid})});opts.push({l:"Pass",v:null});
      var v=await ask("Contact: your "+(mineA?s.atk:s.def).n+" has AP "+my+" against "+their,"Play one Cut-in from hand or pass. Each player acts at most once per Contact.",opts);
      if(typeof v==="string"&&v.charAt(0)==="d"){await swap(dis.find(function(c){return "d"+c.uid===v}));return true}
      card=v===null?null:cis.find(function(c){return c.uid===v});
    }else if(lvlOf(pl)==="expert"&&!G.imagined&&LOOK.cut){
      await sleep(500);
      var choice=await expertCutin(pl,cis,dis,my,their,mineA);
      if(typeof choice==="string"){var dc2=dis.find(function(c){return "d"+c.uid===choice});if(dc2){await swap(dc2);return true}}
      card=choice===null?null:cis.find(function(c){return c.uid===choice})||null;
    }else{
      await sleep(500);
      var need=mineA?their:their+1;
      if(lvlOf(pl)!=="easy"&&my<need){var better=dis.find(function(c){return c.ap>=need});if(better){await swap(better);return true}}
      card=lvlOf(pl)==="easy"&&chance(70)?null:cis.slice().sort(function(x,y){return CV(x)-CV(y)}).find(function(c){return mineA?(my<their&&my+CV(c)>=their):(their>=my&&my+CV(c)>their)})||null;
    }
    if(card){
      G.p[pl].hand=G.p[pl].hand.filter(function(c){return c.uid!==card.uid});G.p[pl].rem.push(card);
      var gain=CV(card);
      if(mineA)s.ba+=gain;else s.bd+=gain;
      log(nm(pl)+" play"+(pl?"s":"")+" the Cut-in "+card.n+" (AP +"+gain+").");
      if(card.cut&&card.cut.steps&&(!card.cut.stepsIf||match(mine,me,Object.assign({},card.cut.stepsIf,{side:"any"}),me,card)))await runSteps(me,card,card.cut.steps,{contact:s.pair,inAction:true});
      await trigger(me,mine,"cutinUsed",{contact:s.pair});
      await allyCutin(me,mine,s.pair);
    }else if(isHuman(pl)){log("You pass.")}
    return card;
  }
  if(s.step===0){s.r1=await turnOf(s.first);s.step=1}
  if(s.step===1){s.r2=await turnOf(1-s.first);s.step=2}
  if(s.step===2){if(!s.r1&&s.r2)await turnOf(s.first);s.step=3}
  var atk=s.atk,def=s.def;
  if(p.scene.indexOf(atk)<0||o.scene.indexOf(def)<0){log(TT("The Contact ends: a character left the Scene.","Tiếp xúc kết thúc: một nhân vật đã rời Hiện trường."));return}
  var fa=apOf(atk,p)+s.ba,fd=apOf(def,o)+s.bd;
  if(fa>=fd&&has(def,"noContactKO"))log(def.n+TT(" is not removed by this Contact."," không bị loại bỏ bởi lần Tiếp xúc này."));
  else if(fa>=fd){
    log("Result: attacker AP "+fa+" vs "+fd+". "+def.n+" is removed.");
    await removeChar(o,def,"lost the Contact");
    if(p.scene.indexOf(atk)>-1)await trigger(p,atk,"ko",{});
    if(atk.heizodraw){draw(p,1);log(nm(pi)+" draw"+(pi?"s":"")+" 1 card (Heizo).")}
  }else log("Result: attacker AP "+fa+" vs "+fd+". Nothing happens.");
  atk.battle=0;def.battle=0;
}
async function chooseGuard(dpi,atk,tgt,guards,pi){
  var p=G.p[pi],o=G.p[dpi];
  if(isHuman(dpi)){
    var what=tgt.kind==="case"?"your case":"your sleeping "+tgt.c.n;
    var opts=guards.map(function(c){return {l:c.n+" (AP "+apOf(c,o)+")",v:c.uid}});opts.push({l:"Do not guard",v:null});
    var v=await ask("Opponent's "+atk.n+" (AP "+apOf(atk,p)+") attacks "+what+". Guard?","Guarding puts the guard to sleep and starts a Contact with it. The guard is removed if the attacker's AP is equal or higher. Any active character can guard, even one that just arrived.",opts);
    return v===null?null:guards.find(function(c){return c.uid===v});
  }
  if(G.force&&G.force.kind==="guard"){var fv=G.force.v;G.force=null;return fv===null?null:guards.find(function(c){return c.uid===fv})||null}
  if(lvlOf(dpi)==="easy")return chance(20)?guards[rnd(guards.length)]:null;
  if(lvlOf(dpi)==="expert"&&!G.imagined&&LOOK.guard)return await expertGuard(dpi,atk,tgt,guards,pi);
  if(lvlOf(dpi)==="hard"||lvlOf(dpi)==="expert")return hardGuard(p,o,atk,tgt,guards);
  var s=guards.filter(function(c){return apOf(c,o)>apOf(atk,p)}).sort(function(a,b){return apOf(a,o)-apOf(b,o)})[0];
  if(s)return s;
  if(tgt.kind==="case"&&rnd(10)<3)return guards.slice().sort(function(a,b){return val(a,o)-val(b,o)})[0];
  return null;
}
async function doAction(pi,atk,tgt){
  var p=G.p[pi],o=G.p[1-pi];
  atk.state="sleep";
  if(atk.actbonus){atk.actBonus=1000*downCount(o);if(atk.actBonus)log(atk.n+" gets +"+atk.actBonus+" AP during this Action.")}
  if(atk.nocut)G.noCutin=1-pi;
  if(tgt.kind==="case")p.scene.forEach(function(m){if(m.masumi){m.tmpAssault=true;log(m.n+" gains Assault this turn.")}});
  if(atk.hakdraw&&!atk.trig){atk.trig=true;draw(p,1);log(nm(pi)+" draw"+(pi?"s":"")+" 1 card (Hakuba).")}
  try{
    var kind=tgt.kind==="case"?"actionCase":"actionChar",ac={inAction:true,target:tgt.kind==="char"?{c:tgt.c,o:o}:null};
    G.noEvidence=false;G.attacker={c:atk,o:p};
    await trigger(p,atk,"action",ac);await trigger(p,atk,"actded",ac);await trigger(p,atk,kind,ac);await allyTriggers(p,atk,"allyAction");await allyTriggers(p,atk,"allyActded");await allyTriggers(p,atk,kind==="actionCase"?"allyActionCase":"allyActionChar");
    var ow=o.scene.slice();for(var oi=0;oi<ow.length;oi++)if(o.scene.indexOf(ow[oi])>-1){await trigger(o,ow[oi],"oppAction",{});await trigger(o,ow[oi],"oppActded",{});await trigger(o,ow[oi],kind==="actionCase"?"oppActionCase":"oppActionChar",{})}
    await paWatch(o,"oppAction",{});await paWatch(o,"oppActded",{});await paWatch(o,kind==="actionCase"?"oppActionCase":"oppActionChar",{});
    if(tgt.kind==="char"&&o.scene.indexOf(tgt.c)>-1)await trigger(o,tgt.c,"targeted",{contact:[{c:atk,o:p},{c:tgt.c,o:o}]});
    if(p.scene.indexOf(atk)<0||(tgt.kind==="char"&&o.scene.indexOf(tgt.c)<0))return;
    await doActionInner(pi,atk,tgt);
    if(p.scene.indexOf(atk)>-1)await trigger(p,atk,"actEnd",{});
  }finally{atk.actBonus=0;atk.battle=0;G.noCutin=null;G.attacker=null;G.noEvidence=false;G.forceGuard=false}
}
async function doActionInner(pi,atk,tgt){
  var p=G.p[pi],o=G.p[1-pi];
  log(nm(pi)+" take"+(pi?"s":"")+" an Action with "+atk.n+" against "+(tgt.kind==="case"?"the opposing case":"the sleeping "+tgt.c.n)+".");
  var guards=guardsOf(o);
  if(has(atk,"bullet")&&guards.length){guards=[];log(atk.n+" has Bullet: this Action cannot be guarded.")}
  var forced=guards.filter(function(c){return has(c,"mustGuard")});
  if(!forced.length&&G.forceGuard&&guards.length)forced=guards.slice().sort(function(a,b){return val(a,o)-val(b,o)});
  var g=forced.length?forced[0]:guards.length?await chooseGuard(1-pi,atk,tgt,guards,pi):null;
  if(g){g.state="sleep";log(nm(1-pi)+" guard"+(pi?"":"s")+" with "+g.n+".");await trigger(o,g,"guard",{});if(p.scene.indexOf(atk)>-1&&o.scene.indexOf(g)>-1)await contact(pi,atk,g);return}
  if(tgt.kind==="char"){await contact(pi,atk,tgt.c);return}
  if(o.ev.length){
    var c=o.ev.pop();delete c.up;
    var ps=p.scene.slice();for(var pi2=0;pi2<ps.length;pi2++)if(p.scene.indexOf(ps[pi2])>-1)await trigger(p,ps[pi2],"oppEvRemoved",{});
    await paWatch(p,"oppEvRemoved",{});
    log("Not guarded: the top evidence card of the opposing case is removed, and "+nm(pi).toLowerCase()+" gain"+(pi?"s":"")+" 1 evidence.");
    var claimed=await hirameki(o,c);
    if(!claimed)o.rem.push(c);
    if(G.noEvidence){log(TT("No evidence is gained from this Action.","Hành động này không nhận được chứng cứ."));return}
    p.ev.push(takeTop(p));
    if(p.scene.indexOf(atk)>-1)await trigger(p,atk,"caseGain",{});
    await allyTriggers(p,atk,"allyCaseGain");
    await evGained(p);
    for(var mi=0;mi<p.scene.length;mi++){
      var mm=p.scene[mi];
      if(mm.mary&&!mm.trig&&p.hand.length){
        var my=await pick(p.i,mm.n+": remove a card from hand?","If you do, gain 1 evidence.",[{l:"Remove a card",v:true},{l:"Do not use",v:false}],p.hand.length>2);
        if(my){mm.trig=true;await removeHandCard(p,mm.n+": remove 1 card from hand");p.ev.push(takeTop(p));log(nm(p.i)+" gain"+(p.i?"s":"")+" 1 more evidence ("+mm.n+").")}
      }
    }
  }
}

/* ---------- bot ---------- */
async function aiPlays(p){
  async function tryPlay(){
    var cands=p.hand.filter(function(c){return botPlayable(p,c)}).sort(function(a,b){return cardVal(b)-cardVal(a)});
    for(var i=0;i<cands.length;i++){
      var c=cands[i];
      if(c.t==="c"&&p.scene.length>=5){
        var w=p.scene.slice().sort(function(a,b){return val(a,p)-val(b,p)})[0];
        if(val(w,p)>=score(c))continue;
      }
      if(await playFromHand(p,c,false))return true;
    }
    return false;
  }
  var played=await tryPlay();
  if(!played&&!p.noHint&&p.file.length>=2&&p.scene.length<3&&p.hand.some(function(c){return c.t==="c"&&c.lv<=cap(p)-1})){
    p.hand.push(p.file.pop());p.usedHint=true;log("Opponent uses Next Hint.");log("The top FILE card of the opponent moves to their hand. This is not a free draw: their FILE area is 1 smaller.");
    var c2=p.hand.filter(function(c){return c.t==="c"&&botPlayable(p,c)}).sort(function(a,b){return cardVal(b)-cardVal(a)})[0];
    if(c2)await playFromHand(p,c2,true);
  }
}
async function aiSolve(p){
  if(p.phase==="solution"&&p.partner==="active"&&p.ev.length>=p.lv){
    log(nm(p.i)+" declares "+(p.def.caze.alt?"Evidence Destruction.":"Case Solved."));solveCase(p);
  }
}
async function aiDeclares(p){
  var list=declarers(p);
  for(var i=0;i<list.length;i++){
    var c=list[i];
    if((!c.isCase&&!c.mrPA&&p.scene.indexOf(c)<0)||(c.mrPA&&p.pa.indexOf(c)<0)||declReason(p,c))continue;
    if(c.decl==="fx"||!c.decl){if(!c.botUsed&&!declAbilities(p,c)[0].cost.some(function(k){return k.c==="bottomSelf"||k.c==="removeSelf"}))await useDecl(p,c)}
    else if(c.decl==="ran6")await useDecl(p,c);
    else if(c.decl==="conan4"){
      if(p.scene.some(function(x){return x!==c&&x.state==="active"&&!canAct(x)&&!canDeduce(x)}))await useDecl(p,c);
    }else if(c.decl==="vermouth"){
      var hs=p.hand.filter(function(x){return x.t==="c"&&x.lv<=5});
      if(hs.length&&score(best(hs))>score(c))await useDecl(p,c);
    }else if(c.decl==="shizuka"){
      if(p.scene.some(function(x){return x!==c&&x.lv<=6&&x.fresh&&x.state==="active"&&!canAct(x)}))await useDecl(p,c);
    }
    await sleep(400);
  }
}
async function endTurnEffects(p){
  var mine=p.scene.slice();
  for(var e=0;e<mine.length;e++)if(p.scene.indexOf(mine[e])>-1)await trigger(p,mine[e],"end",{});
  await paWatch(p,"end",{});
  var op=G.p[1-p.i],theirs=op.scene.slice();
  for(e=0;e<theirs.length;e++)if(op.scene.indexOf(theirs[e])>-1)await trigger(op,theirs[e],"oppEnd",{});
  await paWatch(op,"oppEnd",{});
  var list=p.scene.filter(function(c){return c.endact&&c.state!=="active"});
  for(var i=0;i<list.length;i++){
    var c=list[i];if(!p.hand.length||p.scene.indexOf(c)<0)continue;
    var low=p.hand.slice().sort(function(a,b){return cardVal(a)-cardVal(b)})[0];
    var yes=await pick(p.i,c.n+": remove a card to become active?","At the end of your turn you may remove 1 card from hand to make this character active"+(c.state==="stun"?" (a stunned character becomes sleeping instead)":"")+".",[{l:"Remove a card",v:true},{l:"No",v:false}],cardVal(low)<3);
    if(yes){await removeHandCard(p,c.n+": remove 1 card from hand");activate(c);log(c.n+" is "+(c.state==="active"?"active again.":"now sleeping."))}
  }
}
/* ---------- Novice: plays at random and misses chances ---------- */
async function easyTurn(pi){
  var p=G.p[pi],o=G.p[1-pi];
  await sleep(700);
  await aiSolve(p);
  var cands=p.hand.filter(function(c){return botPlayable(p,c)&&(c.t!=="c"||p.scene.length<5)});
  if(cands.length&&!chance(25)){await playFromHand(p,cands[rnd(cands.length)],false);await sleep(600)}
  var ds=declarers(p).filter(function(c){return c.decl==="ran6"||c.decl==="fx"||!c.decl});
  for(var d=0;d<ds.length;d++){if((ds[d].isCase||p.scene.indexOf(ds[d])>-1)&&!declReason(p,ds[d])&&chance(35))await useDecl(p,ds[d])}
  if(p.phase==="case"&&p.partner==="active"&&p.file.length>=6&&chance(55)){await assist(p);await sleep(600)}
  var units=p.scene.filter(function(c){return canAct(c)||canDeduce(c)});
  for(var i=0;i<units.length;i++){
    var c=units[i];
    if(c.state!=="active"||p.scene.indexOf(c)<0||chance(25))continue;
    var sl=targetsOf(c,o);
    if(canAct(c)&&sl.length&&chance(25))await doAction(pi,c,{kind:"char",c:sl[rnd(sl.length)]});
    else if(canAct(c)&&caseOpen(c,o)&&chance(15))await doAction(pi,c,{kind:"case"});
    else if(canDeduce(c))await deduce(p,c);
    await sleep(650);
  }
  await aiSolve(p);
  if(p.partner==="active"&&chance(75)){await deduce(p,"partner");await sleep(500)}
  await endTurnEffects(p);
  log(nm(pi)+" end"+(pi?"s":"")+" the turn.");
}

/* ---------- Master Sleuth: values removal, evidence swings and guarding ---------- */
function hardGuard(p,o,atk,tgt,guards){
  var a=apOf(atk,p),cheap=guards.slice().sort(function(x,y){return val(x,o)-val(y,o)});
  var big=cheap.filter(function(c){return apOf(c,o)>a})[0];
  if(big)return big;
  var cut=Math.max.apply(null,[0].concat(o.hand.filter(function(c){return c.cutin}).map(function(c){return cutValue(c,o,null)})));
  if(cut&&G.noCutin!==o.i){
    var helped=cheap.filter(function(c){return apOf(c,o)+cut>a})[0];
    if(helped&&(tgt.kind==="case"||val(tgt.c,o)>=val(helped,o)))return helped;
  }
  if(tgt.kind==="case")return (p.ev.length>=p.lv-2||o.ev.length>=o.lv-1)?cheap[0]:null;
  return val(tgt.c,o)>val(cheap[0],o)+2?cheap[0]:null;
}
function playValue(p,c){
  var o=G.p[1-p.i],v=cardVal(c),t=o.scene.filter(function(x){return apOf(x,o)<=8000});
  if((c.enter==="snipe"&&p.hand.length>1)||c.ev==="snipeEv"){
    if(t.length)v+=Math.max.apply(null,t.map(function(x){return val(x,o)}))*0.8;
    else if(c.ev==="snipeEv")v=0;
  }
  return v;
}
async function hardPlay(p,viaHint){
  var o=G.p[1-p.i];
  var cands=p.hand.filter(function(c){return botPlayable(p,c)}).sort(function(a,b){return playValue(p,b)-playValue(p,a)});
  for(var i=0;i<cands.length;i++){
    var c=cands[i];
    if(c.t==="c"&&p.scene.length>=5){
      var w=p.scene.slice().sort(function(a,b){return val(a,p)-val(b,p)})[0];
      if(val(w,p)+1>=score(c))continue;
    }
    if(await playFromHand(p,c,viaHint))return true;
  }
  return false;
}
async function hardPlays(p){
  var played=await hardPlay(p,false);
  var want=(!played&&p.scene.length<3)||(p.phase==="solution"&&p.scene.length<4);
  if(want&&!p.noHint&&p.file.length>=2&&p.hand.some(function(c){return c.t==="c"&&c.lv<=cap(p)-1})){
    p.hand.push(p.file.pop());p.usedHint=true;log("Opponent uses Next Hint.");log("The top FILE card of the opponent moves to their hand. This is not a free draw: their FILE area is 1 smaller.");
    await hardPlay(p,true);
  }
}
function hardMove(p,o){
  var top=null;
  function offer(v,c,kind,t){if(!top||v>top.v)top={v:v,c:c,kind:kind,t:t}}
  p.scene.forEach(function(c){
    if(c.state!=="active")return;
    var ap=apOf(c,p)+(c.actbonus?1000*downCount(o):0);
    var blockers=has(c,"bullet")?[]:guardsOf(o);
    var walled=blockers.some(function(g){return apOf(g,o)>ap});
    if(canDeduce(c)){
      var lp=lpOf(c),wins=p.phase==="solution"&&p.partner==="active"&&p.ev.length+lp>=p.lv;
      if(lp>0)offer(wins?100:lp+0.1,c,"deduce");
    }
    if(!canAct(c))return;
    if(caseOpen(c,o)){
      var v=2;
      if(o.ev.length>=o.lv)v+=4;else if(o.ev.length>=o.lv-2)v+=1;
      if(walled)v=v*0.3;
      else if(blockers.length)v+=0.2;
      offer(v,c,"case");
    }
    targetsOf(c,o).forEach(function(t){
      if(apOf(t,o)>ap)return;
      var w=val(t,o)*0.7+(t.stat||t.decl||t.md?0.8:0);
      if(walled)w=w*0.5;
      offer(w,c,"char",t);
    });
  });
  return top;
}
async function hardTurn(pi){
  var p=G.p[pi],o=G.p[1-pi];
  await sleep(700);
  await aiSolve(p);
  await hardPlays(p);await sleep(600);
  await aiDeclares(p);
  if(p.phase==="case"&&p.partner==="active"&&p.file.length>=6){await assist(p);await sleep(600)}
  for(var n=0;n<12;n++){
    await aiSolve(p);
    var m=hardMove(p,o);
    if(!m)break;
    if(m.kind==="deduce")await deduce(p,m.c);
    else await doAction(pi,m.c,m.kind==="case"?{kind:"case"}:{kind:"char",c:m.t});
    await sleep(650);
  }
  await aiSolve(p);
  if(p.partner==="active"){await deduce(p,"partner");await sleep(500)}
  await endTurnEffects(p);
  log(nm(pi)+" end"+(pi?"s":"")+" the turn.");
}

/* ---------- Detective vs Sleuth: looks several moves ahead ----------
   For every move it could make now, it plays the game forward in its head a number of times
   (the rest of its turn, your turn and its next turn, with Master Sleuth play for both sides)
   and keeps the move whose futures turn out best on average.
   It does not peek: before each imagined game it reshuffles what it cannot see
   (your hand together with your deck, and its own deck). */
var LOOK={tries:24,turns:40,margin:0.06,guard:true,cut:true};
/* a repeatable random source, so every move is tried against the same imagined draws */
function seeded(seed){var s=seed>>>0||1;return function(){s=(s+0x6D2B79F5)>>>0;var z=s;z=Math.imul(z^(z>>>15),z|1);z^=z+Math.imul(z^(z>>>7),z|61);return ((z^(z>>>14))>>>0)/4294967296}}
function cloneState(x,memo){
  if(x===null||typeof x!=="object")return x;
  if(memo.has(x))return memo.get(x);
  /* ability data never changes, so it is shared (cards also have a true/false "trig" flag; abilities have a text one) */
  if(!Array.isArray(x)&&typeof x.trig==="string"&&Array.isArray(x.conds))return x;
  var y=Array.isArray(x)?[]:{};memo.set(x,y);
  if(Array.isArray(x)){for(var i=0;i<x.length;i++)y[i]=cloneState(x[i],memo);return y}
  for(var k in x){
    if(!Object.prototype.hasOwnProperty.call(x,k))continue;
    var v=x[k];
    if(k==="def"||k==="fx"||k==="cut"||k==="only"||k==="host"||k==="who")y[k]=v;
    else if(k==="act"||k==="ask"||k==="mull")y[k]=null;
    else y[k]=cloneState(v,memo);
  }
  return y;
}
/* how good the position is for player pi */
function judge(pi){
  if(G.over){if(G.over.w===pi)return 100000-G.turn*10;if(G.over.w===1-pi)return -100000+G.turn*10;return 0}
  function side(p){
    var o=G.p[1-p.i],s=0;
    s+=p.ev.length/p.lv*100+(p.phase==="solution"?25:0)+Math.min(cap(p),8)*2;
    if(p.phase==="solution"&&p.ev.length>=p.lv)s+=60;
    p.scene.forEach(function(c){s+=val(c,p)*3+(c.state==="active"?2:0)});
    s+=p.hand.length*2.5+p.pa.length*4;
    if(p.deck.length<6&&!p.rem.length)s-=40;
    return s;
  }
  return side(G.p[pi])-side(G.p[1-pi]);
}
/* every move the bot could make now */
function expertMoves(p){
  var o=G.p[1-p.i],out=[],seen={};
  if(!solveReason(p)&&(p.ev.length>=p.lv||p.def.caze.alt))return [{t:"solve"}];
  if(!p.usedHand&&!p.usedHint)p.hand.forEach(function(c){
    if(canPlay(p,c,false)||!botPlayable(p,c))return;
    var key=c.k+"|"+c.n;if(seen[key])return;seen[key]=1;
    out.push({t:"play",uid:c.uid});
  });
  if(!p.usedHint&&!p.usedHand&&p.file.length>=2&&!p.noHint)out.push({t:"hint"});
  if(p.phase==="case"&&p.partner==="active"&&cap(p)>=6)out.push({t:"assist"});
  declarers(p).forEach(function(c){if(!declReason(p,c)&&!c.botUsed)out.push({t:"decl",uid:c.uid})});
  p.scene.forEach(function(c){
    if(canDeduce(c)&&lpOf(c)>0)out.push({t:"ded",uid:c.uid});
    if(!canAct(c))return;
    if(caseOpen(c,o))out.push({t:"act",uid:c.uid,to:"case"});
    targetsOf(c,o).forEach(function(x){out.push({t:"act",uid:c.uid,to:x.uid})});
  });
  out.push({t:"end"});
  return out;
}
function findIn(list,uid){return list.find(function(x){return x.uid===uid})}
/* make the move in whichever game G is now (the real one or an imagined one) */
async function doMove(p,m){
  var o=G.p[1-p.i],c;
  if(m.t==="solve"){await aiSolve(p);if(!G.over&&p.def.caze.alt&&!solveReason(p))solveCase(p);return true}
  if(m.t==="play"){c=findIn(p.hand,m.uid);return !!(c&&!canPlay(p,c,false)&&await playFromHand(p,c,false))}
  if(m.t==="hint"){
    if(!p.file.length)return false;
    p.hand.push(p.file.pop());p.usedHint=true;log(nm(p.i)+(p.i?" uses":" use")+" Next Hint.");
    await hardPlay(p,true);return true;
  }
  if(m.t==="assist"){await assist(p);return true}
  if(m.t==="decl"){c=findIn(declarers(p),m.uid);if(!c||declReason(p,c))return false;await useDecl(p,c);return true}
  if(m.t==="ded"){c=findIn(p.scene,m.uid);if(!c||!canDeduce(c))return false;await deduce(p,c);return true}
  if(m.t==="act"){
    c=findIn(p.scene,m.uid);if(!c||!canAct(c))return false;
    if(m.to==="case"){if(!caseOpen(c,o))return false;await doAction(p.i,c,{kind:"case"});return true}
    var t=findIn(o.scene,m.to);if(!t||targetsOf(c,o).indexOf(t)<0)return false;
    await doAction(p.i,c,{kind:"char",c:t});return true;
  }
  return false;
}
/* the rest of a turn, played the Master Sleuth way */
async function finishTurnHard(p){
  var o=G.p[1-p.i];
  await aiSolve(p);
  if(!p.usedHand&&!p.usedHint)await hardPlays(p);
  await aiDeclares(p);
  if(p.phase==="case"&&p.partner==="active"&&p.file.length>=6)await assist(p);
  for(var n=0;n<12;n++){
    await aiSolve(p);
    var m=hardMove(p,o);if(!m)break;
    if(m.kind==="deduce")await deduce(p,m.c);
    else await doAction(p.i,m.c,m.kind==="case"?{kind:"case"}:{kind:"char",c:m.t});
  }
  await aiSolve(p);
  if(p.partner==="active")await deduce(p,"partner");
  await endTurnEffects(p);
}
/* one more whole turn in an imagined game */
async function imagineTurn(){
  G.turn++;G.cur=1-G.cur;
  if(G.turn>200){G.over={w:-1,why:"turn cap"};throw OVER}
  var p=G.p[G.cur];
  cleanup();autoPhase(p);
  var st=p.scene.slice();for(var s=0;s<st.length;s++)if(p.scene.indexOf(st[s])>-1)await trigger(p,st[s],"main",{});
  await paWatch(p,"main",{});
  await hardTurn(G.cur);
  cleanup();
}
/* imagine move m a few times; returns the average result */
async function weigh(pi,m,seed){
  var real=G,total=0,keepRandom=Math.random;
  try{
  for(var r=0;r<LOOK.tries;r++){
    Math.random=seeded(seed+r*7919);
    var g=cloneState(real,new Map());
    g.sim=true;g.bot=["hard","hard"];g.log=[];g.recap=null;g.imagined=true;
    /* reshuffle what the bot cannot see */
    var me=g.p[pi],op=g.p[1-pi],pool=shuffle(op.hand.concat(op.deck)),hn=op.hand.length;
    op.hand=pool.slice(0,hn);op.deck=pool.slice(hn);me.deck=shuffle(me.deck.slice());
    G=g;
    try{
      if(m.t==="end")await endTurnEffects(G.p[pi]);
      else if(m.t==="react")await m.run();
      else{await doMove(G.p[pi],m);await finishTurnHard(G.p[pi])}
      for(var k=0;k<LOOK.turns&&!G.over;k++)await imagineTurn();
    }catch(e){if(e!==OVER){G=real;total+=-500;continue}}
    total+=judge(pi)>0?1:0;
    G=real;
  }
  }finally{Math.random=keepRandom;G=real}
  return total/LOOK.tries;
}
/* what Master Sleuth would do now, in its usual order: the move to beat */
function hardDefault(p,moves){
  var o=G.p[1-p.i],m;
  function find(f){return moves.find(f)}
  if(!p.usedHand&&!p.usedHint){
    var cands=p.hand.filter(function(x){return botPlayable(p,x)&&!canPlay(p,x,false)}).sort(function(a,b){return playValue(p,b)-playValue(p,a)});
    for(var i=0;i<cands.length;i++){
      var c=cands[i];
      if(c.t==="c"&&p.scene.length>=5){var w=p.scene.slice().sort(function(a,b){return val(a,p)-val(b,p)})[0];if(val(w,p)+1>=score(c))continue}
      m=find(function(x){return x.t==="play"&&x.uid===c.uid})||find(function(x){var h=x.t==="play"&&findIn(p.hand,x.uid);return h&&h.k===c.k&&h.n===c.n});
      if(m)return m;
    }
    var want=p.scene.length<3||(p.phase==="solution"&&p.scene.length<4);
    if(want&&!p.noHint&&p.file.length>=2&&p.hand.some(function(x){return x.t==="c"&&x.lv<=cap(p)-1})){m=find(function(x){return x.t==="hint"});if(m)return m}
  }
  m=find(function(x){
    if(x.t!=="decl")return false;
    var c=findIn(declarers(p),x.uid);if(!c)return false;
    if(c.decl==="fx"||!c.decl){var ab=declAbilities(p,c)[0];return !!ab&&!ab.cost.some(function(k){return k.c==="bottomSelf"||k.c==="removeSelf"})}
    if(c.decl==="ran6")return true;
    if(c.decl==="conan4")return p.scene.some(function(y){return y!==c&&y.state==="active"&&!canAct(y)&&!canDeduce(y)});
    return false;
  });
  if(m)return m;
  if(p.phase==="case"&&p.partner==="active"&&p.file.length>=6){m=find(function(x){return x.t==="assist"});if(m)return m}
  var h=hardMove(p,o);
  if(h){m=find(function(x){return h.kind==="deduce"?(x.t==="ded"&&x.uid===h.c.uid):(x.t==="act"&&x.uid===h.c.uid&&(h.kind==="case"?x.to==="case":x.to===h.t.uid))});if(m)return m}
  return find(function(x){return x.t==="end"});
}
/* reactions on the opponent's turn (and its own): guard, Cut-in or Disguise, each imagined to the end of the game */
async function afterAction(){
  var a=G.attacker;if(!a)return;
  if(a.o.scene.indexOf(a.c)>-1)await trigger(a.o,a.c,"actEnd",{});
  a.c.actBonus=0;a.c.battle=0;G.noCutin=null;G.attacker=null;G.noEvidence=false;G.forceGuard=false;
}
async function pickReaction(pi,options,def){
  var seed=(Math.random()*1e9)|0,best=def,bestV=await weigh(pi,{t:"react",run:options[def]},seed);
  for(var k in options){
    if(k===def)continue;
    var v=await weigh(pi,{t:"react",run:options[k]},seed);
    if(v>bestV+LOOK.margin){bestV=v;best=k}
  }
  return best;
}
async function expertGuard(dpi,atk,tgt,guards,pi){
  var o=G.p[dpi],p=G.p[pi],options={},h=hardGuard(p,o,atk,tgt,guards);
  function plan(v){return async function(){
    G.force={kind:"guard",v:v};
    var a=findIn(G.p[pi].scene,atk.uid);if(!a)return;
    var t2=tgt.kind==="case"?{kind:"case"}:{kind:"char",c:findIn(G.p[dpi].scene,tgt.c.uid)};
    if(t2.kind==="char"&&!t2.c)return;
    await doActionInner(pi,a,t2);await afterAction();
    await finishTurnHard(G.p[G.cur]);
  }}
  options.none=plan(null);guards.forEach(function(g){options["g"+g.uid]=plan(g.uid)});
  var pickK=await pickReaction(dpi,options,h?"g"+h.uid:"none");
  return pickK==="none"?null:guards.find(function(g){return "g"+g.uid===pickK})||null;
}
async function expertCutin(pl,cis,dis,my,their,mineA){
  var me=G.p[pl],mine=mineA?G.cc.atk:G.cc.def,CV=function(c){return cutValue(c,me,mine)},options={},seen={};
  /* the Master Sleuth choice is the one to beat */
  var need=mineA?their:their+1,def="pass";
  var better=my<need?dis.find(function(c){return c.ap>=need}):null;
  if(better)def="d"+better.uid;
  else{var hc=cis.slice().sort(function(x,y){return CV(x)-CV(y)}).find(function(c){return mineA?(my<their&&my+CV(c)>=their):(their>=my&&my+CV(c)>their)});if(hc)def="c"+hc.uid}
  function plan(v){return async function(){
    G.force={kind:"cut",pl:pl,v:v};
    await contactRun();await afterAction();
    await finishTurnHard(G.p[G.cur]);
  }}
  options.pass=plan(null);
  cis.forEach(function(c){var key=c.k+"|"+CV(c);if(seen[key]&&"c"+c.uid!==def)return;seen[key]=1;options["c"+c.uid]=plan(c.uid)});
  dis.forEach(function(c){options["d"+c.uid]=plan("d"+c.uid)});
  if(!options[def])def="pass";
  var k=await pickReaction(pl,options,def);
  return k==="pass"?null:k.charAt(0)==="d"?k:+k.slice(1);
}
async function expertTurn(pi){
  var p=G.p[pi];
  if(!G.sim)log(TT("The opponent thinks a few turns ahead…","Đối thủ đang tính trước vài lượt…"));
  await sleep(700);
  for(var n=0;n<16;n++){
    await aiSolve(p);
    var moves=expertMoves(p);
    if(moves.length===1&&moves[0].t==="end")break;
    if(moves[0].t==="solve"){await doMove(p,moves[0]);break}
    var seed=(Math.random()*1e9)|0,def=hardDefault(p,moves),best=def,bestV=await weigh(pi,def,seed);
    for(var i=0;i<moves.length;i++){
      if(moves[i]===def)continue;
      var v=await weigh(pi,moves[i],seed);
      if(v>bestV+LOOK.margin){bestV=v;best=moves[i]}
    }
    if(!best||best.t==="end")break;
    var did=await doMove(p,best);
    if(!did)break;
    await sleep(650);
  }
  await aiSolve(p);
  if(p.partner==="active"){await deduce(p,"partner");await sleep(500)}
  await endTurnEffects(p);
  log(nm(pi)+" end"+(pi?"s":"")+" the turn.");
}

/* ---------- Sleuth ---------- */
async function aiTurn(pi){
  if(lvlOf(pi)==="easy")return easyTurn(pi);
  if(lvlOf(pi)==="hard")return hardTurn(pi);
  if(lvlOf(pi)==="expert")return expertTurn(pi);
  var p=G.p[pi],o=G.p[1-pi];
  await sleep(700);
  await aiSolve(p);
  await aiPlays(p);await sleep(600);
  await aiDeclares(p);
  if(p.phase==="case"&&p.partner==="active"&&p.file.length>=6){await assist(p);await sleep(600)}
  var units=p.scene.filter(function(c){return canAct(c)||canDeduce(c)});
  for(var i=0;i<units.length;i++){
    var c=units[i];
    if(c.state!=="active"||p.scene.indexOf(c)<0)continue;
    var sl=targetsOf(c,o).filter(function(x){return apOf(x,o)<=apOf(c,p)}).sort(function(a,b){return val(b,o)-val(a,o)});
    if(canAct(c)&&sl.length&&rnd(10)<7)await doAction(pi,c,{kind:"char",c:sl[0]});
    else if(canAct(c)&&caseOpen(c,o)&&rnd(10)<4)await doAction(pi,c,{kind:"case"});
    else if(canDeduce(c))await deduce(p,c);
    await sleep(650);
  }
  await aiSolve(p);
  if(p.partner==="active"){await deduce(p,"partner");await sleep(500)}
  await endTurnEffects(p);
  log(nm(pi)+" end"+(pi?"s":"")+" the turn.");
}

/* ---------- human turn ---------- */
async function humanPlay(p,uid,viaHint){
  var c=p.hand.find(function(x){return x.uid===uid});if(!c)return false;
  var r=canPlay(p,c,viaHint);
  if(r){tip(r);return false}
  var ok=await playFromHand(p,c,viaHint);
  if(ok)tip("Played "+c.n+"."+(c.t==="c"?(" It cannot deduce or take Actions this turn"+(c.swift?", except it has Swift, so it can.":(c.assault?", except it has Assault, so it can take Actions.":", but it can still guard and use abilities."))):""));
  return ok;
}
async function humanTurn(){
  var p=G.p[0],o=G.p[1];
  for(;;){
    var a=await waitAct();
    if(a.t==="end"){await endTurnEffects(p);log("You end your turn.");G.tip="";return}
    if(a.t==="hand"){await humanPlay(p,a.v,false)}
    else if(a.t==="hint"){
      var sure=await ask("Use Next Hint?","This is not a free draw. The top card of your FILE area moves to your hand, so your FILE area gets 1 smaller. Then you may play one card.",[{l:"Use Next Hint",v:true},{l:"Back",v:null}]);
      if(!sure)continue;
      p.hand.push(p.file.pop());p.usedHint=true;
      log("You use Next Hint: the top FILE card goes to your hand.");
      G.hintMode=true;tip("Now play one card of level "+cap(p)+" or lower, or skip. The card you just took does not count toward the FILE total, but you may play it.");
      for(;;){
        var b=await waitAct();
        if(b.t==="skip"){log("You skip the play.");break}
        if(b.t==="hand"){var ok=await humanPlay(p,b.v,true);if(ok)break}
      }
      G.hintMode=false;
    }
    else if(a.t==="assist"){await assist(p);tip("Assist: the partner sleeps in the FILE area and counts as a FILE card. With 7 or more FILE cards your case moves to the solution phase.")}
    else if(a.t==="solve"){var sr=solveReason(p);if(sr)tip(sr);else solveCase(p)}
    else if(a.t==="abil"){
      var us=[];
      declarers(p).forEach(function(c){if(!declReason(p,c))us.push({l:c.isCase?TT("Case: ","Vụ án: ")+c.n:c.mrPA?c.n+TT(" (MR, Partner area)"," (MR, khu Cộng sự)"):c.n+" (AP "+apOf(c,p)+")",v:c.uid})});
      us.push({l:"Back",v:null});
      var av=await ask("Use which ability?","Declare abilities can be used once per turn, even the turn the character enters.",us);
      if(av!==null){var cc=declarers(p).find(function(c){return c.uid===av});if(cc)await useDecl(p,cc)}
    }
    else if(a.t==="deduce"){
      var uu=[];
      if(p.partner==="active")uu.push({l:"Partner "+p.def.partner.n+" (LP "+p.def.partner.lp+")",v:"partner"});
      p.scene.filter(canDeduce).forEach(function(c){uu.push({l:c.n+" (LP "+lpOf(c)+")",v:c.uid})});
      uu.push({l:"Back",v:null});
      var v=await ask("Deduce with which card?","It goes to sleep and you gain evidence equal to its LP, taken from the top of your deck. The opponent may use Misdirect.",uu);
      if(v!==null){await deduce(p,v==="partner"?"partner":p.scene.find(function(c){return c.uid===v}));tip("Evidence cards come face down from your deck. Watch your deck size: running out means a refresh.")}
    }
    else if(a.t==="action"){
      var ats=p.scene.filter(canAct).map(function(c){return {l:c.n+" (AP "+apOf(c,p)+")",v:c.uid}});ats.push({l:"Back",v:null});
      var av2=await ask("Take an Action with which character?","The character goes to sleep. The opponent may guard before anything else happens.",ats);
      if(av2===null)continue;
      var atk=p.scene.find(function(c){return c.uid===av2});
      var ts=[];
      if(caseOpen(atk,o))ts.push({l:"Opposing case ("+o.ev.length+" evidence)",v:"case"});
      targetsOf(atk,o).forEach(function(c){ts.push({l:c.n+" (AP "+apOf(c,o)+(c.state==="stun"?", stunned)":c.state==="sleep"?", sleeping)":")"),v:c.uid})});
      ts.push({l:"Back",v:null});
      var tv=await ask("Target of "+atk.n+"'s Action","You can only target the opposing case if it has evidence, or an opposing character that is sleeping.",ts);
      if(tv===null)continue;
      await doAction(0,atk,tv==="case"?{kind:"case"}:{kind:"char",c:o.scene.find(function(c){return c.uid===tv})});
    }
  }
}

/* ---------- game setup ---------- */
async function startGame(keyA,keyB,sim,bots){
  if(!sim)loadCustom();
  G={p:[mkP(0,DECKS[keyA]),mkP(1,DECKS[keyB])],turn:0,cur:0,over:null,log:[],tip:"",act:null,ask:null,mull:null,hintMode:false,info:null,sim:!!sim,bot:bots||["normal",BOT]};
  var first=rnd(2);
  G.p[first].lv=G.p[first].def.caze.lv[0];
  G.p[1-first].lv=G.p[1-first].def.caze.lv[1];
  try{
    log((first===0?"You go":"The opponent goes")+" first (coin toss). Case levels: first player "+G.p[first].lv+" evidence, second player "+G.p[1-first].lv+". Each side draws 5 cards.");
    [0,1].forEach(function(i){draw(G.p[i],5)});
    var humanMull=!G.sim;
    if(humanMull){
      var sel=await new Promise(function(r){G.mull={sel:{},r:r};render()});
      G.mull=null;
      var h=G.p[0];
      if(sel.length){
        var back=h.hand.filter(function(c){return sel.indexOf(c.uid)>-1});
        h.hand=h.hand.filter(function(c){return sel.indexOf(c.uid)<0});
        h.deck=shuffle(h.deck.concat(back));
        draw(h,back.length);
        log("You redraw "+back.length+" card"+(back.length>1?"s":"")+".");
      }
    }
    var mullers=G.sim?[0,1]:[1];
    mullers.forEach(function(i){
      if(lvlOf(i)==="easy")return;
      var ai=G.p[i],ab=ai.hand.filter(function(c){return c.t==="c"&&c.lv>=6});
      if(ab.length){
        ai.hand=ai.hand.filter(function(c){return !(c.t==="c"&&c.lv>=6)});ai.deck=shuffle(ai.deck.concat(ab));
        draw(ai,ab.length);
        log(nm(i)+" redraw"+(i?"s ":" ")+ab.length+" card"+(ab.length>1?"s":"")+".");
      }
    });
    for(;;){
      G.turn++;G.cur=(first+G.turn-1)%2;
      if(G.sim&&G.turn>200){G.over={w:-1,why:"turn cap"};throw OVER}
      var p=G.p[G.cur];
      if(G.sim){
        G.p.forEach(function(q){
          var n=q.deck.length+q.hand.length+q.file.length+q.ev.length+q.rem.length+q.scene.length+q.pa.length+q.scene.reduce(function(s,c){return s+(c.under||[]).length},0);
          if(n!==40)throw new Error("card count "+n+" for player "+q.i+" on turn "+G.turn);
        });
      }
      cleanup();
      if(G.cur===1){G.recap=[];G.recapStart=[G.p[0].ev.length,G.p[1].ev.length]}
      autoPhase(p);
      var starters=p.scene.slice();
      for(var s=0;s<starters.length;s++)if(p.scene.indexOf(starters[s])>-1)await trigger(p,starters[s],"main",{});
      await paWatch(p,"main",{});
      if(G.sim||G.cur===1)await aiTurn(G.cur);
      else{G.tip="Main phase: play, deduce, take Actions, or end your turn.";await humanTurn()}
      cleanup();
    }
  }catch(e){if(e!==OVER)throw e}
  render();
  return G;
}

/* ---------- hint for the player ---------- */
function suggest(){
  var p=G.p[0],o=G.p[1];
  if(!solveReason(p)&&p.ev.length>=p.lv)return TT("💡 You have enough evidence and an active partner: declare Case Solved now to win!","💡 Bạn đã đủ chứng cứ và Cộng sự đang thức: tuyên bố Phá án ngay để thắng!");
  var hand=p.hand.filter(function(c){return !canPlay(p,c,false)}).sort(function(a,b){return playValue(p,b)-playValue(p,a)});
  var swift=hand.filter(function(c){return c.t==="c"&&c.swift&&lpOf(c)>0})[0];
  if(p.phase==="solution"&&swift)return TT("💡 Play "+swift.n+" first. It has Swift, so it can deduce this turn.","💡 Hãy chơi "+swift.n+" trước. Lá này có Nhanh nhẹn nên suy luận được ngay lượt này.");
  if(!swift&&!p.usedHint&&p.file.length&&!p.noHint&&p.phase==="solution"&&p.scene.length<5){
    var top=p.file[p.file.length-1];
    if(top&&top.t==="c"&&top.swift&&top.lv<=cap(p)-1)return TT("💡 Nothing in your hand helps. Try Next Hint: the top FILE card ("+top.n+") comes to your hand and you may play it.","💡 Bài trên tay không giúp được. Thử Gợi ý kế tiếp: lá FILE trên cùng ("+top.n+") về tay và bạn có thể chơi nó.");
  }
  if(hand.length&&p.scene.length<5)return TT("💡 Play "+hand[0].n+" from your hand. It is your strongest card you can play now.","💡 Chơi "+hand[0].n+" từ tay. Đây là lá mạnh nhất bạn chơi được lúc này.");
  if(p.phase==="case"&&p.partner==="active"&&p.file.length>=6)return TT("💡 Use Assist: your partner joins the FILE area, you reach 7 FILE cards and your case moves to the solution phase.","💡 Dùng Hỗ trợ: Cộng sự vào khu FILE, bạn có 7 lá FILE và Vụ án chuyển sang giai đoạn phá án.");
  var m=hardMove(p,o);
  if(m){
    if(m.kind==="deduce")return TT("💡 Deduce with "+m.c.n+" (LP "+lpOf(m.c)+")."+(p.phase==="solution"?" Keep your partner awake: it must be active to declare Case Solved.":""),"💡 Suy luận với "+m.c.n+" (LP "+lpOf(m.c)+")."+(p.phase==="solution"?" Giữ Cộng sự thức: phải thức mới tuyên bố Phá án được.":""));
    if(m.kind==="case")return TT("💡 Take an Action with "+m.c.n+" against the opposing case to knock away their evidence.","💡 Dùng "+m.c.n+" thực hiện Hành động vào Vụ án của đối thủ để loại chứng cứ của họ.");
    return TT("💡 Take an Action with "+m.c.n+" (AP "+apOf(m.c,p)+") against the sleeping "+m.t.n+" (AP "+apOf(m.t,o)+").","💡 Dùng "+m.c.n+" (AP "+apOf(m.c,p)+") thực hiện Hành động vào "+m.t.n+" đang ngủ (AP "+apOf(m.t,o)+").");
  }
  if(p.partner==="active"&&p.phase==="case")return TT("💡 Deduce with your partner before you end the turn: free evidence.","💡 Suy luận bằng Cộng sự trước khi kết thúc lượt: chứng cứ miễn phí.");
  return TT("💡 Nothing more to gain this turn. End your turn.","💡 Lượt này không còn gì để làm. Kết thúc lượt.");
}

/* ---------- puzzles: win this turn ---------- */
var PUZZLES=[
 {name:["Partner last","Cộng sự sau cùng"],goal:["You have 6 of 7 evidence in the solution phase. Solve the case this turn.","Bạn có 6/7 chứng cứ ở giai đoạn phá án. Hãy phá án trong lượt này."],
  setup:function(me){me.scene=[onScene(me,"ayumi")];me.ev=takeN(me,6);me.file=takeN(me,7)}},
 {name:["Swift arrival","Đến thật nhanh"],goal:["5 of 7 evidence and one awake character. Which card do you play to win?","5/7 chứng cứ và một nhân vật đang thức. Bạn chơi lá nào để thắng?"],
  setup:function(me){me.scene=[onScene(me,"genta")];me.hand=[take(me,"kogoro"),take(me,"ayumi"),take(me,"c7")];me.ev=takeN(me,5);me.file=takeN(me,7)}},
 {name:["A hint from the FILE","Gợi ý từ FILE"],goal:["5 of 7 evidence, and your hand cannot help. Look at your FILE area and solve the case this turn.","5/7 chứng cứ và bài trên tay không giúp được. Hãy nhìn khu FILE và phá án trong lượt này."],
  setup:function(me){var top=take(me,"c7");me.scene=[onScene(me,"ran3")];me.hand=[take(me,"shin")];me.ev=takeN(me,5);me.file=takeN(me,7).concat([top])}}
];
function take(p,k){var i=p.deck.findIndex(function(c){return c.k===k});return i<0?null:p.deck.splice(i,1)[0]}
function takeN(p,n){var out=[];for(var i=0;i<n;i++){var j=p.deck.findIndex(function(c){return c.t==="c"&&!c.swift&&c.k!=="c4"});out.push(p.deck.splice(j,1)[0])}return out}
function onScene(p,k){var c=mkChar(take(p,k));c.fresh=false;return c}
async function startPuzzle(i){
  var z=PUZZLES[i];
  G={p:[mkP(0,DECKS.conan),mkP(1,DECKS.org)],turn:5,cur:0,over:null,log:[],tip:"",act:null,ask:null,mull:null,hintMode:false,info:null,sim:false,bot:["normal","normal"],puzzle:i};
  var me=G.p[0],op=G.p[1];
  me.hand=[];me.lv=7;me.phase="solution";z.setup(me);
  op.lv=6;op.scene=[onScene(op,"vodka"),onScene(op,"korn")];op.scene.forEach(function(c){c.state="sleep"});op.hand=[take(op,"chianti")];op.ev=takeN(op,2);op.file=takeN(op,5);
  log(TT("Puzzle "+(i+1)+": "+z.name[0]+".","Câu đố "+(i+1)+": "+z.name[1]+"."));
  G.tip="🧩 "+TT(z.goal[0],z.goal[1]);
  try{
    await humanTurn();
    G.over={w:1,why:TT("The turn ended before the case was solved. Try again!","Lượt đã hết mà chưa phá được án. Thử lại nhé!")};
  }catch(e){if(e!==OVER)throw e}
  G.act=null;G.ask=null;
  if(G.over&&G.over.w===0){try{var d=JSON.parse(localStorage.getItem("conanPuzzles")||"{}");d[i]=1;localStorage.setItem("conanPuzzles",JSON.stringify(d))}catch(e){}}
  render();
  return G;
}
function puzzlesDone(){try{return JSON.parse(localStorage.getItem("conanPuzzles")||"{}")}catch(e){return {}}}

/* ---------- deck test: own deck against each starter deck, bot vs bot ---------- */
var TEST=null;
async function deckTest(per){
  per=per||50;
  var ks=Object.keys(DECKS).filter(function(k){return k!=="custom"});
  TEST={running:true,done:0,total:ks.length*per*2,res:{},errors:0};
  render();
  for(var i=0;i<ks.length;i++){
    var r=TEST.res[ks[i]]=[0,0];
    for(var n=0;n<per*2;n++){
      var mineFirst=n%2===0;
      try{
        var g=await startGame(mineFirst?"custom":ks[i],mineFirst?ks[i]:"custom",true,["normal","normal"]);
        var w=g.over&&g.over.w;if(w===(mineFirst?0:1))r[0]++;else if(w===0||w===1)r[1]++;
      }catch(e){TEST.errors++}
      G=null;TEST.done++;
      if(TEST.done%4===0){render();await new Promise(function(res){setTimeout(res,0)})}
    }
  }
  TEST.running=false;render();
}
function testPanel(){
  if(!TEST)return "";
  var h='<div class="note" style="margin:0 0 12px"><b>'+TT("🧪 Deck test","🧪 Thử bộ bài")+'</b> · '+(TEST.running?TT("Playing "+TEST.done+" of "+TEST.total+" bot-vs-bot games…","Đang chơi "+TEST.done+"/"+TEST.total+" ván bot đấu bot…"):TT("Your deck, played by the Sleuth bot against each starter deck.","Bộ bài của bạn do bot Thám tử chơi, đấu với từng bộ khởi đầu."));
  h+='<table class="ttable"><tr><th>'+TT("Against","Đấu với")+'</th><th>'+TT("Won","Thắng")+'</th><th>'+TT("Win rate","Tỉ lệ thắng")+'</th></tr>';
  Object.keys(TEST.res).forEach(function(k){var r=TEST.res[k],n=r[0]+r[1];h+='<tr><td><span class="dot dk-'+DECKS[k].color+'"></span>'+DECKS[k].name+'</td><td>'+r[0]+' / '+n+'</td><td><span class="tbar"><i style="width:'+(n?Math.round(100*r[0]/n):0)+'%"></i></span> '+(n?Math.round(100*r[0]/n):0)+'%</td></tr>'});
  h+='</table>';
  if(!TEST.running)h+='<p class="why" style="margin:6px 0 0">'+TT("Each match-up is played "+(TEST.total/6)+" times, half going first. Only the abilities the game understands are used, so treat this as a rough guide.","Mỗi cặp đấu chơi "+(TEST.total/6)+" ván, một nửa đi trước. Chỉ những năng lực trò chơi hiểu mới được dùng, nên đây chỉ là gợi ý tham khảo.")+(TEST.errors?" ("+TEST.errors+" errors)":"")+'</p>';
  return h+'</div>';
}

/* ---------- rendering ---------- */
function slot(c,o){
  if(!c)return '<div class="slot"></div>';
  var st=c.state==="sleep"?"Sleeping":c.state==="stun"?"Stunned":(c.fresh?"Just arrived":"Active");
  return '<button class="slot ch '+c.state+(c.fresh&&c.state==="active"?" fresh":"")+'" data-a="info" data-v="'+c.uid+'">'+cimg(c.set,c.img,"sl",c.n)+'<b>'+c.n+'</b><span>AP '+apOf(c,o)+' · LP '+lpOf(c)+'</span><span class="s2">'+st+((c.under||[]).length?' · 📎'+c.under.length:'')+'</span></button>';
}
function mat(p,isMe){
  var d=p.def,pt={active:"Active",sleep:"Sleeping",file:"In FILE area"}[p.partner],pips="";
  for(var k=0;k<p.lv;k++)pips+='<i class="'+(k<p.ev.length?"on":"")+'"></i>';
  var last=p.rem[p.rem.length-1];
  var h='<div class="mat '+(isMe?"mat-me":"mat-op")+'"><div class="mono matlabel">'+(isMe?"You":"Opponent")+' · '+d.name+'</div>';
  h+='<div class="cell c-scene"><div class="mono">Scene</div><div class="slotrow">'+[0,1,2,3,4].map(function(n){return slot(p.scene[n],p)}).join("")+'</div></div>';
  h+='<div class="cell c-partner"><div class="mono">Partner</div><button type="button" class="imgbtn pos-'+p.partner+'" data-a="zoomp" data-v="'+p.i+'" title="Enlarge">'+cimg(d.set,d.partnerNo,"pt",d.partner.n)+'</button><b>'+d.partner.n+'</b><span>'+pt+' · LP '+d.partner.lp+'</span>'+(p.pa.length?'<span>'+TT("Partner area: ","Khu Cộng sự: ")+p.pa.map(function(x){return x.n}).join(", ")+'</span>':'')+'</div>';
  h+='<div class="cell c-case"><div class="mono">Case</div><button type="button" class="imgbtn" data-a="zoomk" data-v="'+p.i+'" title="Enlarge">'+cimg(d.set,d.cardNo,"cs",d.caze.n)+'</button><b>'+d.caze.n+'</b><span class="'+(p.phase==="solution"?"hotx":"")+'">'+(p.phase==="case"?"Case phase":"Solution phase")+'</span></div>';
  h+='<div class="cell c-evidence"><div class="mono">Evidence area</div><div class="big">'+p.ev.length+' / '+p.lv+'</div><div class="pips">'+pips+'</div><span>Needed to solve the case</span>'+(p.ev.some(function(x){return x.up})?'<span>'+TT("Face up: ","Ngửa: ")+p.ev.filter(function(x){return x.up}).map(function(x){return x.n}).join(", ")+'</span>':'')+'</div>';
  h+='<div class="cell c-file"><div class="mono">FILE area</div><div class="big">'+p.file.length+(p.partner==="file"?" + 1":"")+'</div><span>Level cap '+cap(p)+(p.partner==="file"?" (partner counts)":"")+'</span>'+(p.partner==="file"?'<span class="filepartner">'+cimg(d.set,d.partnerNo,"pt",d.partner.n)+'</span>':'')+'</div>';
  h+='<div class="cell c-deck"><div class="mono">Deck</div><div class="big">'+p.deck.length+'</div><span>cards left</span></div>';
  h+='<div class="cell c-remove"><div class="mono">Remove area</div><button type="button" class="chip" data-a="rem" data-v="'+p.i+'">'+p.rem.length+' card'+(p.rem.length===1?"":"s")+' · view list</button>'+(last?'<span class="lastrem">Latest: '+last.n+'</span>':'')+(isMe?'<button type="button" class="chip" data-a="log">Game log · view</button>':'')+'</div>';
  if(isMe)h+='<div class="cell c-hand"><div class="mono">Hand ('+p.hand.length+')</div><div class="hand">'+p.hand.map(function(c){return handCard(c,p)}).join("")+'</div></div><div class="cell c-act"><div class="mono">Your turn actions</div>'+controls(p)+'<div class="action-prompt-slot"></div>'+((G.over||G.act)?'<div><button class="btn ghost" data-a="menu">'+(G.over?"Play again":"Back to deck choice")+'</button></div>':'')+'</div>';
  else {var rev=OPP_HAND_REVEALED;h+='<div class="cell c-hand opp-hand'+(rev?' opp-revealed':'')+'"><div class="mono">Opponent hand ('+p.hand.length+')</div>'+(rev?'<span class="reveal-note">Revealed by card effect</span><button type="button" class="btn ghost finish-reveal" data-a="finishReveal">Finish reveal</button><div class="hand">'+p.hand.map(opponentHandCard).join("")+'</div>':'<div class="hand">'+p.hand.map(function(){return '<div class="card-back">Hidden<br>card</div>'}).join("")+'</div><span>Hidden until a reveal effect resolves.</span>')+'</div>'; }
  return h+'</div>';
}
function opponentHandCard(c){var head=c.t==="c"?'<b>'+c.n+'</b><span>Level '+c.lv+' · AP '+c.ap+' · LP '+c.lp+'</span>':'<b>'+c.n+'</b><span>Event · Level '+c.lv+'</span>';return '<div class="pc opp-card" data-v="'+c.uid+'">'+cimg(c.set,c.img,"th",c.n)+head+'<small>'+c.txt+'</small></div>';}
function handCard(c,p){
  var ok=!canPlay(p,c,G.hintMode);
  var sel=G.mull&&G.mull.sel[c.uid];
  var cls="pc"+(ok&&G.act?" ok":"")+(sel?" sel":"");
  var en=G.mull||G.act;
  var head=c.t==="c"?'<b>'+c.n+'</b><span>Level '+c.lv+' · AP '+c.ap+' · LP '+c.lp+'</span>':'<b>'+c.n+'</b><span>Event · Level '+c.lv+'</span>';
  var im=c.img?'<span class="zm" data-a="zoom" data-v="'+c.uid+'" title="Enlarge">'+cimg(c.set,c.img,"th",c.n)+'</span>':"";
  return '<button class="'+cls+'" data-a="'+(G.mull?"mull":"hand")+'" data-v="'+c.uid+'"'+(en?"":" disabled")+'>'+im+head+'<i>'+c.txt+'</i></button>';
}
function controls(p){
  var o=G.p[1],live=!!G.act&&!G.over,hm=G.hintMode,R={};
  var atk=p.scene.some(canAct),tg=p.scene.some(function(c){return canAct(c)&&(caseOpen(c,o)||targetsOf(c,o).length>0)});
  var units=p.scene.some(canDeduce)||p.partner==="active";
  var decls=declarers(p);
  var usable=decls.filter(function(c){return !declReason(p,c)});
  if(!p.file.length)R.hint="Next Hint needs at least 1 card in your FILE area.";
  if(p.noHint)R.hint=TT("A card effect stops Next Hint this turn.","Hiệu ứng lá bài chặn Gợi ý kế tiếp trong lượt này.");
  if(p.partner!=="active")R.assist="Assist needs an active partner.";
  var sr=solveReason(p);if(sr)R.solve=sr;
  if(!units)R.deduce="Deduce needs an active partner, or an active character that did not just arrive unless it has Swift.";
  if(!atk)R.action="Action needs an active character that did not just arrive unless it has Swift or Assault.";
  else if(!tg)R.action="There is no target: the opposing case has no evidence and no opposing character is sleeping.";
  if(!decls.length)R.abil="None of your characters in Scene has a Declare ability.";
  else if(!usable.length)R.abil=declReason(p,decls[0]);
  var defs=[["hint","Next Hint"],["assist","Assist"],["solve",p.def.caze.alt?"Evidence Destruction":"Case Solved"],["deduce","Deduce"],["action","Action"],["abil","Ability"]];
  var h='<div class="pbtns">';
  defs.forEach(function(d){h+='<button class="btn ghost" data-a="'+d[0]+'"'+((!live||hm||R[d[0]])?" disabled":"")+'>'+d[1]+'</button>'});
  h+='<button class="btn ghost hintbtn" data-a="hintme"'+(live?"":" disabled")+'>'+TT("💡 Hint","💡 Gợi ý")+'</button>';
  h+=hm?'<button class="btn" data-a="skip"'+(live?"":" disabled")+'>Skip playing</button>':'<button class="btn" data-a="end"'+(live?"":" disabled")+'>End turn</button>';
  h+='</div>';
  if(live&&!hm){
    var w=defs.filter(function(d){return R[d[0]]}).map(function(d){return "<li>"+R[d[0]]+"</li>"}).join("");
    if(w)h+='<div class="why">Greyed out because:<ul class="tight">'+w+'</ul></div>';
  }
  return h;
}
function puzzleMenu(){
  var done=puzzlesDone();
  return '<h3 style="margin-top:18px">'+TT("🧩 Puzzles: win this turn","🧩 Câu đố: thắng trong lượt này")+'</h3><p class="why">'+TT("Short challenges with a fixed board. Find the moves that solve the case in one turn. Stuck? Press 💡 Hint.","Thử thách ngắn với bàn chơi cố định. Tìm nước đi để phá án trong một lượt. Bí quá? Bấm 💡 Gợi ý.")+'</p><div class="pbtns">'+
    PUZZLES.map(function(z,i){return '<button class="btn '+(done[i]?'':'ghost')+'" data-a="puzzle" data-v="'+i+'">'+(done[i]?'✅ ':'')+(i+1)+'. '+(LANG==="vi"?z.name[1]:z.name[0])+'</button>'}).join("")+'</div>';
}
function findChar(uid){var r=null;G.p.forEach(function(o){o.scene.forEach(function(c){if(c.uid===uid)r=c})});return r}
function render(){if(G&&G.sim)return;render0();xlate(root)}
function render0(){
  if(G&&G.sim)return;
  if(!G){
    var mine=loadCustom();
    var note=mine.deck?TT("Your saved deck is ready: "+mine.full+" of its 40 cards are fully automated. The others still work as characters, but some of their text does nothing.","Bộ bài đã lưu sẵn sàng: "+mine.full+"/40 lá được tự động hóa đầy đủ. Các lá còn lại vẫn dùng được làm nhân vật, nhưng một phần chữ không có tác dụng."):(mine.error||TT("To play your own cards, build a deck first.","Muốn chơi bài của riêng bạn, hãy xếp bộ bài trước."));
    root.innerHTML='<div class="panel"><div class="note" style="margin:0 0 12px">🃏 '+note+' <a href="deck.html">'+TT("Open the Deck page","Mở trang Bộ bài")+'</a>'+(mine.deck?' <button class="btn ghost" data-a="decktest"'+(TEST&&TEST.running?' disabled':'')+'>'+TT("🧪 Test my deck","🧪 Thử bộ bài")+'</button>':'')+'</div>'+testPanel()+(baseOK===-2?'<div class="note" style="margin:0 0 12px">Card images were not found. To see them, keep this HTML file next to your <b>Card_List</b> folder (with the CT-D01 to CT-D07 subfolders) and open it from there. The game works without them.</div>':'')+'<p>Choose your deck, and which deck the bot plays. You play first or second by coin toss, start with 5 cards and one redraw, and win by gathering enough evidence and solving the case in its solution phase.</p><div class="pbtns botpick" style="margin-bottom:4px"><span class="mono" style="align-self:center">Bot level</span>'+Object.keys(BOTS).map(function(k){var b=BOTS[k];return '<button class="btn '+(BOT===k?'':'ghost')+'" data-a="botlv" data-v="'+k+'" aria-pressed="'+(BOT===k)+'"><span>'+b.name+'</span> · <small>'+b.tag+'</small></button>'}).join('')+'</div><p class="why" style="margin:0 0 14px">'+BOTS[BOT].desc+'</p><div class="pbtns" style="margin-bottom:12px"><span class="mono" style="align-self:center">Bot plays</span>'+['random'].concat(Object.keys(DECKS)).map(function(k){return '<button class="btn '+(OPP===k?'':'ghost')+'" data-a="opp" data-v="'+k+'">'+(k==='random'?'':'<span class="dot dk-'+DECKS[k].color+'"></span>')+(k==='random'?'Random':DECKS[k].name)+'</button>'}).join('')+'</div><div class="cols">'+
      Object.keys(DECKS).map(function(k){var d=DECKS[k];return '<div class="panel ctype dk dk-'+d.color+'"><h3 class="dkh">'+d.name+'</h3><p>'+d.blurb+'</p><p class="why">Partner: '+d.partner.n+'. Case: '+d.caze.n+'.</p><button class="btn" data-a="start" data-v="'+k+'">Play '+d.name+'</button></div>'}).join("")+'</div>'+puzzleMenu()+'</div>';
    return;
  }
  var me=G.p[0],op=G.p[1],h="";
  if(G.turn>0)h+='<div class="turnbar"><span>Turn '+G.turn+' · '+(G.cur===0?"Your turn":"Opponent\'s turn")+'</span> <small>(<span>Bot:</span> <span>'+BOTS[lvlOf(1)].name+'</span>)</small></div>';
  if(G.recap&&G.recap.length)h+='<div class="note recap" style="margin:0"><b>'+(G.cur===1?"What the opponent is doing":"What the opponent did last turn")+'</b><ol class="tight" style="margin:6px 0">'+G.recap.map(function(l){return "<li>"+l+"</li>"}).join("")+'</ol><span>'+"Opponent evidence: "+G.recapStart[1]+" → "+op.ev.length+". Your evidence: "+G.recapStart[0]+" → "+me.ev.length+"."+'</span></div>';
  h+=mat(op,false)+mat(me,true);
  h+='<div class="under">';
  h+='<div class="mid">';
  if(G.over){
    h+='<div class="out '+(G.over.w===0?"good":"bad")+'"><b>'+(G.puzzle!==undefined?(G.over.w===0?TT("🧩 Puzzle solved!","🧩 Giải được câu đố!"):TT("🧩 Not yet.","🧩 Chưa được.")):(G.over.w===0?"You win.":"You lose."))+'</b> '+G.over.why+
      (G.puzzle!==undefined?'<div class="pbtns" style="margin-top:8px"><button class="btn ghost" data-a="puzzle" data-v="'+G.puzzle+'">'+TT("Try again","Thử lại")+'</button>'+(G.puzzle+1<PUZZLES.length?'<button class="btn" data-a="puzzle" data-v="'+(G.puzzle+1)+'">'+TT("Next puzzle ▶","Câu đố tiếp ▶")+'</button>':'')+'</div>':'')+'</div>';
  }
  if(G.mull){
    var n=Object.keys(G.mull.sel).filter(function(k){return G.mull.sel[k]}).length;
    h+='<div class="prompt"><b>Opening hand</b><p>Tap the cards in your Hand area that you want to put back and redraw, or keep your hand. You may do this once.</p><button class="btn" data-a="mullok">'+(n?"Redraw "+n+" card"+(n>1?"s":""):"Keep this hand")+'</button></div>';
  }
  if(G.ask){
    h+='<div class="prompt"><b>'+G.ask.title+'</b><p>'+G.ask.note+'</p><div class="pbtns">'+G.ask.opts.map(function(o,i){return '<button class="btn ghost" data-a="ask" data-v="'+i+'">'+o.l+'</button>'}).join("")+'</div></div>';
  }
  if(G.remView!==null&&G.remView!==undefined){
    var rp=G.p[G.remView];
    h+='<div class="note" style="margin:0"><b>'+(G.remView?"Opponent":"Your")+' Remove area</b> · '+rp.rem.length+' card'+(rp.rem.length===1?"":"s")+', newest first. The number shows the order they were removed (1 is the oldest).'+
      (rp.rem.length?'<div class="remgrid">'+rp.rem.map(function(c,i){return {c:c,n:i+1}}).reverse().map(function(x){var c=x.c;return '<div class="remc"><span class="rn">'+x.n+'</span>'+cimg(c.set,c.img,"rm",c.n)+'<small>'+c.n+'</small></div>'}).join("")+'</div>':'<div class="why" style="margin-top:6px">Nothing has been removed yet.</div>')+
      '<div><button class="btn ghost" data-a="remclose" style="margin-top:8px">Close</button></div></div>';
  }
  if(G.logView){
    h+='<div class="note" style="margin:0"><b>Game log</b> · newest first.<ul class="plog" style="margin-top:6px;max-height:18em">'+G.log.slice(0,40).map(function(l){return "<li>"+l+"</li>"}).join("")+'</ul><div><button class="btn ghost" data-a="logclose" style="margin-top:8px">Close</button></div></div>';
  }
  if(G.info){var ic=findChar(G.info);if(ic)h+='<div class="note infoimg" style="margin:0">'+cimg(ic.set,ic.img,"big",ic.n)+'<div><b>'+ic.n+'</b> · Level '+ic.lv+' · '+trName(ic)+'<br>'+ic.txt+'</div></div>'}
  if(G.zoom){h+='<div class="note infoimg" style="margin:0">'+cimg(G.zoom.set,G.zoom.img,"big",G.zoom.n)+'<div><b>'+G.zoom.n+'</b>'+(G.zoom.lv!==undefined?' · Level '+G.zoom.lv:'')+'<br>'+G.zoom.txt+'<br><button class="btn ghost" data-a="unzoom" style="margin-top:8px">Close</button></div></div>'}
  if(G.tip&&!G.over)h+='<div class="note" style="margin:0">'+G.tip+'</div>';
  h+='</div></div>';
  root.innerHTML=h;
  var ps=root.querySelector(".mat-me .action-prompt-slot"),pp=root.querySelector(".under .prompt");if(ps&&pp)ps.appendChild(pp);
  if(G.ask&&G.ask!==lastAsk){var pr=root.querySelector(".prompt");if(pr&&pr.scrollIntoView)try{pr.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(e){}}
  lastAsk=G.ask||null;
}
var lens=document.createElement("aside");lens.className="lens";document.body.appendChild(lens);var lt=null,lx=20,ly=20,lf=0;
function E(v){return String(v==null?"":v).replace(/[&<>\"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function R(k,v){return '<div class="lr"><span class="lk">'+E(k)+'</span><span class="lv">'+E(v)+'</span></div>'}
function B(img,rows){return '<div class="lb">'+img+'<div>'+rows+'</div></div>'}
function cardBody(c,o){var st=c.state?(c.state==="sleep"?"Sleeping":c.state==="stun"?"Stunned":c.fresh?"Just arrived":"Active"):"In hand";return B(cimg(c.set,c.img,"lensimg",c.n),R("Level",c.lv)+R("Current AP",c.ap===undefined?"Not applicable":o?apOf(c,o):c.ap)+R("LP",c.lp===undefined?"Not applicable":o?lpOf(c):c.lp)+R("Status",st)+R("Traits",(c.tr&&c.tr.length)||c.trTxt?trName(c):"None")+R("Ability",c.txt||"No additional card text."))}
function content(t){if(!G)return null;var p,c,o,title="Details",uid=+(t.dataset.v||0);if(t.classList.contains("pc")){var hp=t.classList.contains("opp-card")?G.p[1]:G.p[0];c=hp.hand.find(function(x){return x.uid===uid});if(!c)return null;title=c.n;return [title,cardBody(c,null)]}if(t.classList.contains("slot")){G.p.forEach(function(q){var x=q.scene.find(function(z){return z.uid===uid});if(x){c=x;o=q}});return [c.n,cardBody(c,o)]}if(t.classList.contains("c-partner")){p=G.p[+(t.querySelector('[data-a="zoomp"]').dataset.v)];var d=p.def,st={active:"Active",sleep:"Sleeping",file:"In FILE area"}[p.partner];return [d.partner.n,B(cimg(d.set,d.partnerNo,"lensimg",d.partner.n),R("Level","Partner")+R("Current AP","Not applicable")+R("LP",d.partner.lp)+R("Status",st)+R("Traits","Partner")+R("Ability","Deduce for LP "+d.partner.lp+". Assist moves this card to the FILE area. Case Solved is available in the solution phase when the evidence requirement is met."))]}if(t.classList.contains("c-case")){p=G.p[+(t.querySelector('[data-a="zoomk"]').dataset.v)];var d=p.def;return [d.caze.n,B(cimg(d.set,d.cardNo,"lensimg",d.caze.n),R("Level",p.lv)+R("Current AP","Not applicable")+R("LP","Not applicable")+R("Status",p.phase==="case"?"Case phase":"Solution phase")+R("Traits",d.caze.alt?"Alternative win condition":"Standard case")+R("Ability",d.caze.txt))]}if(t.dataset.a==="rem"){p=G.p[+t.dataset.v];return [(p.i?"Opponent":"Your")+" Remove area",'<div>'+p.rem.slice().reverse().slice(0,14).map(function(x){return R(x.t==="e"?"Event":"Card",x.n)}).join("")+'</div>']}if(t.dataset.a==="log")return ["Game log",G.log.slice(0,14).map(function(x){return R("Event",x)}).join("")];return null}
function pos(){lf=0;var w=lens.offsetWidth,h=lens.offsetHeight,x=lx+18,y=ly+18;if(x+w>innerWidth-10)x=lx-w-18;if(y+h>innerHeight-10)y=innerHeight-h-10;lens.style.left=Math.max(10,x)+"px";lens.style.top=Math.max(10,y)+"px"}
root.addEventListener("pointerover",function(e){var t=e.target.closest('.pc,.slot.ch,.c-partner,.c-case,[data-a="rem"],[data-a="log"]');if(!t||t===lt)return;var z=content(t);if(!z)return;if(lt)lt.classList.remove("lens-target");lt=t;t.classList.add("lens-target");lens.innerHTML='<div class="lh">'+E(z[0])+'</div>'+z[1];xlate(lens);lens.classList.add("on");pos()});root.addEventListener("pointermove",function(e){lx=e.clientX;ly=e.clientY;if(!lf)lf=requestAnimationFrame(pos)});root.addEventListener("pointerout",function(e){if(!lt)return;if(e.relatedTarget&&lt.contains(e.relatedTarget))return;lt.classList.remove("lens-target");lt=null;lens.classList.remove("on")});
root.addEventListener("click",function(e){
  var b=e.target.closest("[data-a]");if(!b||b.disabled)return;
  var a=b.dataset.a,v=b.dataset.v,nv=(v!==undefined&&v!==""&&!isNaN(v))?+v:v;
  if(a==="hintme"&&G&&G.act){tip(suggest());return}
  if(a==="puzzle"){if(G&&!G.over)return;startPuzzle(+v);return}
  if(a==="decktest"){if(TEST&&TEST.running)return;loadCustom();if(DECKS.custom)deckTest();return}
  if(a==="finishReveal"){OPP_HAND_REVEALED=false;render();return}
  if(a==="opp"){OPP=v;render();return}
  if(a==="botlv"&&BOTS[v]){BOT=v;try{localStorage.setItem("conanBot",v)}catch(x){}render();return}
  if(a==="start"){if(TEST&&TEST.running)return;loadCustom();if(!DECKS[nv]){render();return}if(!DECKS[OPP])OPP="random";var ks=Object.keys(DECKS).filter(function(k){return k!=="custom"}),other=OPP==="random"?ks[rnd(ks.length)]:OPP;startGame(nv,other,false);return}
  if(a==="menu"){G=null;render();return}
  if(a==="rem"&&G){G.remView=(G.remView===nv?null:nv);render();return}
  if(a==="remclose"&&G){G.remView=null;render();return}
  if(a==="log"&&G){G.logView=!G.logView;render();return}
  if(a==="logclose"&&G){G.logView=false;render();return}
  if(a==="zoomp"&&G){var d=G.p[nv].def;G.zoom={n:"Partner: "+d.partner.n,set:d.set,img:d.partnerNo,txt:"Partner (LP "+d.partner.lp+"). While active it can deduce, use Assist (moves to the FILE area) and declare Case Solved."};render();return}
  if(a==="zoomk"&&G){var d2=G.p[nv].def;G.zoom={n:"Case: "+d2.caze.n,set:d2.set,img:d2.cardNo,txt:d2.caze.txt};render();return}
  if(a==="zoom"&&G){var zc=G.p[0].hand.find(function(c){return c.uid===nv});G.zoom=zc||null;render();return}
  if(a==="unzoom"&&G){G.zoom=null;render();return}
  if(a==="info"&&G){G.info=(G.info===nv?null:nv);render();return}
  if(a==="ask"&&G&&G.ask){var q=G.ask;G.ask=null;var val2=q.opts[+v].v;render();q.r(val2);return}
  if(a==="mull"&&G&&G.mull){G.mull.sel[nv]=!G.mull.sel[nv];render();return}
  if(a==="mullok"&&G&&G.mull){var m=G.mull;m.r(Object.keys(m.sel).filter(function(k){return m.sel[k]}).map(Number));return}
  if(G&&G.act){var f=G.act;G.act=null;f({t:a,v:nv===undefined?null:nv})}
});
loadCustom();
render();
probe();
if(typeof window!=="undefined")window.__practice={look:LOOK,sim:startGame,puzzle:startPuzzle,PUZZLES:PUZZLES,suggest:function(){return suggest()},act:function(a){var f=G&&G.act;if(f){G.act=null;f(a)}return !!f},answer:function(i){var q=G&&G.ask;if(!q)return false;G.ask=null;q.r(q.opts[i].v);return true},loadCustom:loadCustom,DECKS:DECKS,dbg:function(){return G},render:render};
})();

