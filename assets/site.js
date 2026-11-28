(function(){
var $=function(s){return document.querySelector(s)};

/* ===== Language (EN / VI) ===== */
var LANG=(function(){try{var s=localStorage.getItem("conanLang");if(s==="vi"||s==="en")return s}catch(e){}return String(navigator.language||"en").toLowerCase().indexOf("vi")===0?"vi":"en"})();
function L(en,vi){return LANG==="vi"?vi:en}
var VS={"u": {"Detective Conan Trading Card Game": "Game bài Thám tử lừng danh Conan", "Conan TCG Primer": "Hướng dẫn nhanh Conan TCG", "Learn the rules in the order you will meet them at the table, then try them on small tools and a quiz. You play a detective, gather evidence faster than your opponent, and solve the case first.": "Học luật chơi theo đúng thứ tự bạn sẽ gặp trên bàn chơi, rồi thử bằng các công cụ nhỏ và một bài kiểm tra. Bạn vào vai một thám tử, thu thập chứng cứ nhanh hơn đối thủ và phá án trước.", "Source: <a href=\"https://www.takaratomy.co.jp/products/conan-cardgame/pdf/rule/rule_manual.pdf\" target=\"_blank\" rel=\"noopener\">Official Rule Manual (Japanese PDF, Takara Tomy)</a>": "Nguồn: <a href=\"https://www.takaratomy.co.jp/products/conan-cardgame/pdf/rule/rule_manual.pdf\" target=\"_blank\" rel=\"noopener\">Sách luật chính thức (PDF tiếng Nhật, Takara Tomy)</a>", "<b>Win condition</b><span>Have at least as many evidence cards as your case's level, with the case in its solution phase, then declare Case Solved.</span>": "<b>Điều kiện thắng</b><span>Có số lá chứng cứ ít nhất bằng cấp của vụ án, khi vụ án đang ở giai đoạn giải đáp, rồi tuyên bố Phá án.</span>", "<b>How you get evidence</b><span>Deduce with characters or your partner, or take Actions against the opponent's case.</span>": "<b>Cách có chứng cứ</b><span>Suy luận bằng nhân vật hoặc cộng sự của bạn, hoặc dùng Hành động tấn công vụ án của đối thủ.</span>", "<b>How you lose ground</b><span>Your characters get removed in Contact, your evidence gets taken, and an empty deck hands your opponent evidence.</span>": "<b>Cách bị mất thế</b><span>Nhân vật của bạn bị loại bỏ trong Tiếp xúc, chứng cứ của bạn bị lấy đi, và khi bộ bài hết thì đối thủ nhận thêm chứng cứ.</span>", "Practice table": "Bàn chơi thử", "Play a practice game": "Chơi thử một ván", "Pick one of six starter decks and play a full game against a bot. Pick its level (Novice, Sleuth or Master Sleuth) and its deck, or leave the deck random. The page greys out moves you cannot make and tells you why. Tap a character in Scene to read its ability.": "Chọn một trong sáu bộ bài khởi đầu và chơi trọn một ván với bot. Hãy chọn độ khó (Tân binh, Thám tử hoặc Thám tử bậc thầy) và bộ bài của bot hoặc để ngẫu nhiên. Trang sẽ làm mờ những nước đi bạn không thể thực hiện và cho biết lý do. Chạm vào một nhân vật ở Hiện trường để đọc năng lực của nó.", "Decks: CT-D01 Conan (blue), CT-D07 Black Organization (black), CT-D02 Heiji Hattori (green) and CT-D03 Kid the Phantom Thief (white). CT-D04 Akai (red) and CT-D05 Amuro (yellow). Ability text is paraphrased. Simplified: no Disguise (none of these decks use it), cards put on the bottom of the deck are not ordered, and only the Detective vs Sleuth bot plans several turns ahead. Check the official manual for exact wording.": "Các bộ bài: CT-D01 Conan (xanh dương), CT-D07 Tổ chức Áo Đen (đen), CT-D02 Heiji Hattori (xanh lá) và CT-D03 Siêu đạo chích Kid (trắng). CT-D04 Akai (đỏ) và CT-D05 Amuro (vàng). Nội dung năng lực đã được diễn giải lại. Đã đơn giản hóa: không có Cải trang (các bộ này không dùng), các lá đặt dưới đáy bộ bài không được sắp thứ tự, và chỉ bot Thám tử đối đầu mới tính trước nhiều lượt. Hãy xem sách luật chính thức để biết nội dung chính xác.", "Manual FILE.1 · Getting ready": "Sách luật FILE.1 · Chuẩn bị", "The eight areas of your side": "Tám khu vực ở phía của bạn", "Each player has the same areas. Cards never move into your opponent's areas. Tap an area to read what it holds.": "Mỗi người chơi có các khu vực giống nhau. Bài không bao giờ di chuyển vào khu vực của đối thủ. Chạm vào một khu vực để đọc nội dung nó chứa.", "<b>Scene</b><span class=\"slots\"><i></i><i></i><i></i><i></i><i></i></span>": "<b>Hiện trường</b><span class=\"slots\"><i></i><i></i><i></i><i></i><i></i></span>", "<b>Partner</b>": "<b>Cộng sự</b>", "<b>Case</b>": "<b>Vụ án</b>", "<b>Evidence area</b>": "<b>Khu chứng cứ</b>", "<b>FILE area</b>": "<b>Khu FILE</b>", "<b>Deck</b>": "<b>Bộ bài</b>", "<b>Remove area</b>": "<b>Khu loại bỏ</b>", "<b>Hand</b>": "<b>Bài trên tay</b>", "Manual FILE.1 · Card types": "Sách luật FILE.1 · Các loại bài", "Four kinds of card": "Bốn loại bài", "Partner": "Cộng sự", "Your sidekick. Every partner shares the same two abilities, <b>Assist</b> and <b>Case Solved</b>, and can also deduce. Its LP tells you how much evidence a deduction earns.": "Người trợ thủ của bạn. Mọi cộng sự đều có chung hai năng lực, <b>Hỗ trợ</b> và <b>Phá án</b>, và cũng có thể suy luận. LP của nó cho biết một lần suy luận mang lại bao nhiêu chứng cứ.", "Character": "Nhân vật", "Enters Scene to deduce and take Actions. Has a level, AP, LP, a color (some have two), a trait and abilities.": "Vào Hiện trường để suy luận và dùng Hành động. Có cấp, AP, LP, màu (một số lá có hai màu), đặc điểm và năng lực.", "Event": "Sự kiện", "A one-shot effect. Played from hand, resolved, then placed in the Remove area.": "Hiệu ứng dùng một lần. Đánh từ tay, thực hiện xong rồi đặt vào Khu loại bỏ.", "Case": "Vụ án", "The case you must solve. Its level is the evidence you need, and it differs for first and second player. It starts in its case phase and later flips to its solution phase.": "Vụ án bạn phải phá. Cấp của nó là số chứng cứ bạn cần, và khác nhau giữa người đi trước và người đi sau. Ban đầu nó ở giai đoạn vụ án, sau đó lật sang giai đoạn giải đáp.", "Reading a character card": "Cách đọc lá nhân vật", "Level": "Cấp", "How many cards you need in your FILE area to play it from hand.": "Số lá bạn cần có trong Khu FILE để đánh nó từ tay.", "AP": "AP", "Action Point. Compared against the other character in a Contact.": "Action Point (điểm hành động). Được so sánh với nhân vật còn lại trong một Tiếp xúc.", "LP": "LP", "Logic Point, shown by a keyhole. The amount of evidence you gain when this character deduces.": "Logic Point (điểm logic), biểu thị bằng lỗ khóa. Là lượng chứng cứ bạn nhận được khi nhân vật này suy luận.", "Color": "Màu", "Limits when you can play it. A two-color character counts as either color.": "Giới hạn khi nào bạn được đánh lá này. Nhân vật hai màu được tính là một trong hai màu.", "ID": "ID", "Decides whether two cards are \"the same card\".": "Quyết định hai lá có phải là “cùng một lá” hay không.", "Level, AP and LP have no lower limit. A character at 0 or below is not removed because of that.": "Cấp, AP và LP không có giới hạn dưới. Nhân vật có chỉ số bằng 0 hoặc thấp hơn không bị loại bỏ vì lý do đó.", "Same card, different art": "Cùng một lá, khác hình", "Parallel versions and reprints with a matching ID count as the same card.": "Các phiên bản song song và bản in lại có cùng ID được tính là cùng một lá.", "All versions together count toward the limit of 3 copies in a deck.": "Tất cả các phiên bản cộng lại được tính vào giới hạn 3 bản trong một bộ bài.", "If a card is missing some printed information because of its design, it still has the information of the same card.": "Nếu một lá thiếu thông tin in vì thiết kế của nó, nó vẫn có thông tin của lá cùng loại.", "A corrected card text applies to every version.": "Nội dung bài đã được đính chính áp dụng cho mọi phiên bản.", "Three card states": "Ba trạng thái của lá bài", "Active": "Hoạt động", "Sleep": "Ngủ", "Stun": "Choáng", "Deducing, taking Actions, guarding, and abilities that need sleep turn a card sideways. A stunned card is upside down, and when it would be activated it becomes sleeping instead. Sleeping or stunning a card that is already stunned changes nothing.": "Suy luận, dùng Hành động, đỡ đòn và các năng lực cần ngủ sẽ xoay lá bài nằm ngang. Lá bị choáng nằm ngược đầu, và khi nó được kích hoạt thì nó chuyển sang ngủ. Cho ngủ hoặc làm choáng một lá đã bị choáng thì không thay đổi gì.", "Manual FILE.2 · Flow of the game": "Sách luật FILE.2 · Diễn tiến ván đấu", "Setup and deck rules": "Chuẩn bị và luật xây bộ bài", "Build the deck": "Xây bộ bài", "Exactly <b>40</b> cards, characters and events only.": "Đúng <b>40</b> lá, chỉ gồm nhân vật và sự kiện.", "At most <b>3</b> of the same card (same ID).": "Tối đa <b>3</b> lá giống nhau (cùng ID).", "Any colors may go in the deck. Colors limit what you can play during the game.": "Bộ bài có thể chứa mọi màu. Màu chỉ giới hạn những gì bạn đánh được trong ván.", "Besides the deck you need one partner and one case, 42 cards in total.": "Ngoài bộ bài, bạn cần một cộng sự và một vụ án, tổng cộng 42 lá.", "Before turn one": "Trước lượt đầu tiên", "Place your case and partner face down.": "Đặt úp vụ án và cộng sự của bạn.", "Shuffle your deck and place it.": "Xáo bộ bài và đặt xuống.", "Decide first player at random, for example rock-paper-scissors. The winner goes first.": "Chọn người đi trước ngẫu nhiên, ví dụ oẳn tù tì. Người thắng đi trước.", "Draw 5 cards.": "Rút 5 lá.", "You may redraw once: put any number back, shuffle, draw that many. The first player decides first.": "Bạn được rút lại một lần: trả về số lá tùy ý, xáo bài, rồi rút bằng số đó. Người đi trước quyết định trước.", "Flip your case and partner face up and begin.": "Lật ngửa vụ án và cộng sự rồi bắt đầu.", "Manual FILE.2 · Turn flow": "Sách luật FILE.2 · Diễn tiến lượt", "One turn, three phases": "Một lượt, ba giai đoạn", "Players alternate turns. Each turn runs Auto, Main, then End. Step through it below.": "Hai người chơi lần lượt thay phiên nhau. Mỗi lượt gồm giai đoạn Tự động, Chính, rồi Kết thúc. Hãy xem từng bước bên dưới.", "Can I play this card? Level check": "Mình đánh được lá này không? Kiểm tra cấp", "You can play a card whose level is no higher than the number of cards in your FILE area. Your partner counts while it sits in the FILE area after an Assist.": "Bạn có thể đánh một lá có cấp không cao hơn số lá trong Khu FILE của bạn. Cộng sự của bạn được tính khi nó nằm trong Khu FILE sau một lần Hỗ trợ.", "Face-down cards in FILE area": "Số lá úp trong Khu FILE", "Way of playing": "Cách đánh", "Manual FILE.2 · Main phase": "Sách luật FILE.2 · Giai đoạn Chính", "What you can do in the Main phase": "Bạn có thể làm gì trong giai đoạn Chính", "Do these in any order and as often as you like, with one exception: playing from hand is limited to once per turn. You cannot interrupt one action with another.": "Làm theo thứ tự bất kỳ và bao nhiêu lần tùy ý, trừ một ngoại lệ: đánh bài từ tay chỉ được một lần mỗi lượt. Bạn không thể ngắt một hành động bằng hành động khác.", "Can I win this turn? Case checker": "Lượt này mình thắng được không? Kiểm tra vụ án", "Case level": "Cấp vụ án", "Evidence you hold": "Chứng cứ bạn đang có", "Cards in FILE area (partner not included)": "Số lá trong Khu FILE (không tính cộng sự)", "Your case is in": "Vụ án của bạn đang ở", "Your partner is": "Cộng sự của bạn đang", "Manual FILE.2 · Contact": "Sách luật FILE.2 · Tiếp xúc", "Contact: comparing AP": "Tiếp xúc: so sánh AP", "A Contact happens when an Action targets a character that was not guarded, or when a guard is declared. The attacker's AP is compared with the other character's AP. The lower-AP player gets to act first. The attacker is never removed.": "Tiếp xúc xảy ra khi một Hành động nhắm vào nhân vật không bị đỡ, hoặc khi có người tuyên bố đỡ đòn. AP của bên tấn công được so với AP của nhân vật còn lại. Bên có AP thấp hơn được hành động trước. Bên tấn công không bao giờ bị loại bỏ.", "Attacker's AP (your turn)": "AP bên tấn công (lượt của bạn)", "vs": "đấu với", "Defender's AP": "AP bên phòng thủ", "Cut-in with AP +2000 is the manual's own example. Real cards differ, so read the card. Each player may act once per Contact, with a Cut-in or a Disguise, or pass.": "Cut-in cộng AP +2000 là ví dụ riêng của sách luật. Các lá thực tế có thể khác, nên hãy đọc lá bài. Mỗi người chơi được hành động một lần trong mỗi Tiếp xúc, bằng Cut-in hoặc Cải trang, hoặc bỏ qua.", "Manual FILE.3 · Terms": "Sách luật FILE.3 · Thuật ngữ", "Glossary": "Bảng thuật ngữ", "English labels are my own translations. Japanese terms are shown so you can match them to your cards.": "Các nhãn tiếng Anh là bản dịch riêng của tôi; nhãn tiếng Việt được dịch từ đó. Thuật ngữ tiếng Nhật được hiển thị để bạn đối chiếu với lá bài của mình.", "Search terms": "Tìm thuật ngữ", "Refresh": "Làm mới (Refresh)", "When your deck runs out, even mid-action, shuffle your Remove area into a new deck and your opponent gains 1 evidence. If your Remove area is empty when you must refresh, you lose.": "Khi bộ bài của bạn hết, kể cả giữa chừng một hành động, hãy xáo Khu loại bỏ thành bộ bài mới và đối thủ nhận 1 chứng cứ. Nếu Khu loại bỏ của bạn trống khi phải làm mới, bạn thua.", "Effects that draw, gain evidence, or place cards from the deck finish the remaining count after the refresh. Effects that only look at or reveal cards use what is left and do not refresh.": "Các hiệu ứng rút bài, nhận chứng cứ hoặc đặt bài từ bộ bài sẽ hoàn tất phần còn lại sau khi làm mới. Các hiệu ứng chỉ xem hoặc lật bài thì dùng số bài còn lại và không làm mới.", "MR cards": "Lá MR", "From expansion pack 5. An MR enters Scene as a character. Only one MR can exist across your Scene and partner area, so a new MR removes the old one.": "Từ gói mở rộng 5. MR vào Hiện trường như một nhân vật. Trong Hiện trường và khu cộng sự của bạn chỉ có thể tồn tại một MR, nên MR mới sẽ loại bỏ MR cũ.", "If an MR leaves Scene during your opponent's turn, it moves to your partner area. There it cannot deduce or act, but its abilities still work.": "Nếu MR rời Hiện trường trong lượt của đối thủ, nó chuyển sang khu cộng sự. Ở đó nó không thể suy luận hay hành động, nhưng các năng lực của nó vẫn có hiệu lực.", "Names with several characters": "Tên có nhiều nhân vật", "A card named with &amp; or parentheses, such as a double name, counts as every name in it, in every area. Bond and similar checks treat it as each of those names.": "Lá có tên ghi với &amp; hoặc dấu ngoặc, chẳng hạn như tên đôi, được tính là mọi tên trong đó, ở mọi khu vực. Gắn kết (Bond) và các kiểm tra tương tự xem nó là từng tên đó.", "Check yourself": "Tự kiểm tra", "Rules quiz": "Bài kiểm tra luật chơi", "Author": "Tác giả", "Get in touch": "Liên hệ", "<b>Quoc Chuong Nguyen</b> built this study aid. Questions, corrections to card text or rules, and requests for more decks are welcome.": "<b>Quoc Chuong Nguyen</b> đã tạo ra tài liệu học này. Câu hỏi, đính chính nội dung bài hoặc luật, và đề nghị thêm bộ bài đều được hoan nghênh.", "Email": "Email", "Copy": "Sao chép", "This is an unofficial study aid based on the Detective Conan Trading Card Game <a href=\"https://www.takaratomy.co.jp/products/conan-cardgame/pdf/rule/rule_manual.pdf\" target=\"_blank\" rel=\"noopener\">Official Rule Manual</a> Ver.2.6. It is not made or endorsed by the rights holders. Individual card text can override the general rules here, and the official manual and rulings take priority.": "Đây là tài liệu học không chính thức dựa trên <a href=\"https://www.takaratomy.co.jp/products/conan-cardgame/pdf/rule/rule_manual.pdf\" target=\"_blank\" rel=\"noopener\">Sách luật chính thức</a> của game bài Thám tử lừng danh Conan, phiên bản 2.6. Nó không do chủ sở hữu bản quyền tạo ra hay xác nhận. Nội dung từng lá bài có thể ghi đè luật chung ở đây, và sách luật cùng các phán quyết chính thức được ưu tiên.", "@t:This is the first player's very first turn": "Đây là lượt đầu tiên của người đi trước", "@t:My partner is in the FILE area (Assist)": "Cộng sự của tôi đang ở Khu FILE (Hỗ trợ)", "@t:Cut-in AP +2000": "Cut-in AP +2000"}, "attr": {"Levels you can play": "Các cấp bạn có thể đánh", "Try \"refresh\" or スイッチ": "Thử “làm mới” hoặc スイッチ"}, "opt": {"From hand": "Từ tay", "With Next Hint": "Bằng Gợi ý kế tiếp", "Case phase": "Giai đoạn vụ án", "Solution phase": "Giai đoạn giải đáp", "Active": "Hoạt động", "Sleeping": "Đang ngủ"}, "nav": {"goal": "Mục tiêu", "practice": "Chơi thử", "board": "Bàn chơi", "cards": "Các lá bài", "setup": "Chuẩn bị", "turn": "Lượt", "actions": "Hành động", "contact": "Tiếp xúc", "terms": "Thuật ngữ", "quiz": "Kiểm tra", "author": "Tác giả"}, "title": "Hướng dẫn nhanh Conan TCG"};
/* ===== Vietnamese data for the page script ===== */
var AREAS_VI={
 scene:["Hiện trường","Nhân vật vào đây từ tay bạn. Tối đa 5 nhân vật đứng ở Hiện trường, và bạn có thể có nhiều bản của cùng một lá. Khi Hiện trường đầy, bạn vẫn có thể đánh thêm một nhân vật bằng cách loại bỏ một nhân vật đang ở đó (Đổi chỗ)."],
 partner:["Cộng sự","Cộng sự của bạn nằm ở đây. Nó suy luận, và dùng Hỗ trợ và Phá án. Lá MR và một số lá có đặc điểm đặc biệt cũng có thể được đặt ở đây."],
 case:["Vụ án","Lá vụ án của bạn. Nó cho biết bạn đang ở giai đoạn vụ án hay giai đoạn giải đáp, và bạn cần bao nhiêu chứng cứ."],
 evidence:["Khu chứng cứ","Chứng cứ là những lá trên cùng của bộ bài, đặt úp từng lá một. Chứng cứ mới nhất nằm trên cùng."],
 file:["Khu FILE","Giai đoạn Tự động đặt bài úp vào đây. Chúng quyết định bạn đánh được những cấp nào. Cộng sự của bạn cũng được tính khi nó ở đây sau một lần Hỗ trợ."],
 deck:["Bộ bài","40 lá, úp xuống. Bạn rút bài từ đây, và suy luận lấy chứng cứ từ đây."],
 remove:["Khu loại bỏ","Các lá bị loại bỏ và sự kiện đã dùng. Nó trở thành bộ bài mới khi bạn làm mới, và nếu Khu loại bỏ trống vào lúc đó thì bạn thua."],
 hand:["Bài trên tay","Những lá bạn có thể đánh. Hãy giấu chúng khỏi đối thủ. Không có giới hạn số lá trên tay."]
};
var STEPS_VI=function(first){return [
 {p:"Giai đoạn Tự động",t:"Kích hoạt cộng sự",d:"Xoay nó thẳng lại. Nếu nó đang ở Khu FILE sau một lần Hỗ trợ, trước tiên nó quay về khu cộng sự."},
 {p:"Giai đoạn Tự động",t:"Kích hoạt các nhân vật",d:"Mọi nhân vật ở Hiện trường trở thành hoạt động. Nhân vật bị choáng thì chuyển sang ngủ."},
 {p:"Giai đoạn Tự động",t:"Rút 1 lá",d:"Người đi trước cũng rút bài ở lượt một."},
 {p:"Giai đoạn Tự động",t:first?"Đặt 1 lá vào Khu FILE":"Đặt 2 lá vào Khu FILE",d:first?"Chỉ ở lượt đầu tiên của người đi trước: đặt úp đúng 1 lá trên cùng bộ bài vào Khu FILE.":"Đặt úp 2 lá trên cùng bộ bài vào Khu FILE, từng lá một."},
 {p:"Giai đoạn Chính",t:"Thực hiện hành động",d:"Đánh bài từ tay, Gợi ý kế tiếp, năng lực của cộng sự, năng lực của nhân vật, suy luận và dùng Hành động, theo thứ tự tùy ý."},
 {p:"Giai đoạn Kết thúc",t:"Lượt kết thúc",d:"Các năng lực cuối lượt được kích hoạt và giải quyết, rồi các hiệu ứng “đến hết lượt” hết hiệu lực. Hãy thông báo kết thúc lượt."}
]};
var ACT_VI=[
 {n:"Đánh bài từ tay",b:"một lần mỗi lượt",h:"<p>Đánh một lá từ tay có cấp không cao hơn số lá trong Khu FILE của bạn. Nhân vật vào Hiện trường ở trạng thái hoạt động. Sự kiện được thực hiện rồi vào Khu loại bỏ.</p><ul class='tight'><li>Bạn không thể làm vậy nếu đã dùng Gợi ý kế tiếp trong lượt này.</li><li>Lá bài phải có chung màu với vụ án của bạn. Lá hai màu cần vụ án của bạn có cả hai màu.</li><li>Nhân vật vào bằng hiệu ứng, và Cut-in, bỏ qua giới hạn màu.</li><li>Khi Hiện trường đầy, hãy loại bỏ một nhân vật đang ở đó để lấy chỗ (Đổi chỗ).</li></ul>"},
 {n:"Gợi ý kế tiếp",h:"<p>Biến các lá FILE thành một lượt đánh bài.</p><ol class='tight'><li>Lấy lá trên cùng của Khu FILE vào tay bạn. Cộng sự không bị lấy.</li><li>Sau đó đánh một lá từ tay có cấp không cao hơn số lá còn lại trong Khu FILE. Bạn có thể bỏ qua không đánh. Lá bạn vừa lấy không được tính, nhưng bạn có thể đánh nó.</li></ol><p>Bạn không thể làm gì khác giữa hai bước, và quyền đánh bài không được giữ lại cho về sau. Bạn không thể dùng Gợi ý kế tiếp khi Khu FILE trống.</p>"},
 {n:"Hỗ trợ",h:"<p>Tuyên bố <b>Hỗ trợ</b>: cho cộng sự ngủ và chuyển nó vào Khu FILE. Khi ở đó nó được tính là một lá FILE của bạn.</p><p>Sau đó, nếu bạn có <b>7 lá trở lên</b> trong Khu FILE, kể cả cộng sự, vụ án của bạn chuyển sang giai đoạn giải đáp. Việc này là bắt buộc, và vụ án không bao giờ quay lại giai đoạn vụ án.</p><p>Bạn cần một cộng sự đang hoạt động. Cộng sự quay về trong giai đoạn Tự động kế tiếp của bạn.</p>"},
 {n:"Phá án",h:"<p>Tuyên bố <b>Phá án</b> và cho cộng sự ngủ. Nếu bạn có chứng cứ ít nhất bằng cấp của vụ án, bạn thắng ván đấu.</p><p>Bạn chỉ có thể tuyên bố khi ở giai đoạn giải đáp và có cộng sự đang hoạt động.</p>"},
 {n:"Năng lực",h:"<p>Dùng các năng lực kích hoạt trên nhân vật ở Hiện trường, vụ án của bạn, và MR ở khu cộng sự.</p><ul class='tight'><li>Trả chi phí trước, tức mọi thứ bên trái dấu hai chấm. Nếu bất kỳ phần nào không trả được, bạn không thể dùng năng lực.</li><li>Nhân vật có thể dùng các năng lực này ngay trong lượt nó vào.</li><li>Năng lực cần nhân vật ngủ thì đòi hỏi nó đang hoạt động. Các năng lực khác dùng được dù nó đang ngủ hay bị choáng.</li></ul>"},
 {n:"Suy luận",h:"<p>Nhận chứng cứ từ LP.</p><ol class='tight'><li>Tuyên bố suy luận và cho cộng sự đang hoạt động hoặc một nhân vật đang hoạt động ở Hiện trường đi ngủ.</li><li>Đối thủ có thể dùng Đánh lạc hướng.</li><li>Bạn nhận số chứng cứ bằng LP của lá đó: đặt úp các lá trên cùng bộ bài, từng lá một, vào Khu chứng cứ.</li></ol><p>Nhân vật không thể suy luận trong lượt nó vào trừ khi có Nhanh nhẹn. LP từ 0 trở xuống không cho gì. Không giới hạn số lần mỗi lượt, và một lá đã được kích hoạt có thể suy luận lại.</p>"},
 {n:"Hành động",h:"<p>Tấn công bàn chơi hoặc vụ án của đối thủ bằng một nhân vật đang hoạt động. Nhân vật không thể dùng Hành động trong lượt nó vào trừ khi có Nhanh nhẹn hoặc Đột kích.</p><ol class='tight'><li>Chọn mục tiêu: một <b>nhân vật đối phương đang ngủ hoặc bị choáng</b>, hoặc <b>vụ án đối phương</b> nếu nó có ít nhất một chứng cứ. Cho nhân vật tấn công đi ngủ.</li><li>Đối thủ có thể <b>đỡ đòn</b> bằng một nhân vật đang hoạt động, nhân vật đó đi ngủ. Nhân vật vừa vào vẫn đỡ được và AP không quan trọng.</li><li>Nếu bị đỡ, có một Tiếp xúc giữa bên tấn công và bên đỡ. Nếu không: với nhân vật thì Tiếp xúc với nó. Với vụ án thì lá chứng cứ trên cùng của họ bị loại bỏ và bạn nhận 1 chứng cứ.</li></ol><p>Một Hành động lên vụ án chuyển đúng 1 chứng cứ, bất kể LP của bên tấn công. Nếu chứng cứ bị loại bỏ có Tia linh cảm (Hirameki), đối thủ có thể kích hoạt nó, kể cả khi nó đã được lật ngửa.</p>"}
];
var GL_VI=[
 ["Hiện trường","Nơi các nhân vật của bạn đứng. Tối đa 5."],
 ["Cộng sự","Lá trợ thủ của bạn. Suy luận, Hỗ trợ, phá án."],
 ["Vụ án / Giải đáp","Vụ án bạn phải phá. Ban đầu ở giai đoạn vụ án và lật sang giai đoạn giải đáp."],
 ["Chứng cứ","Các lá trong Khu chứng cứ của bạn. Bạn cần số chứng cứ bằng cấp vụ án để thắng."],
 ["Khu FILE","Nhận 2 lá mỗi lượt. Số lượng của nó quyết định bạn đánh được những cấp nào."],
 ["Suy luận","Cho cộng sự hoặc nhân vật ngủ để nhận chứng cứ bằng LP của nó."],
 ["Hành động","Tấn công một nhân vật đang ngủ hoặc bị choáng, hoặc vụ án đối phương."],
 ["Đỡ đòn","Cho một nhân vật đang hoạt động ngủ để nhận Tiếp xúc thay cho một Hành động."],
 ["Tiếp xúc","So sánh AP. Bên tấn công thắng khi hòa và không bao giờ bị loại bỏ."],
 ["Cut-in","Đánh một lá có hiệu ứng Cut-in từ tay trong một Tiếp xúc. Mỗi lần dùng một lá."],
 ["Cải trang","Thay nhân vật đang Tiếp xúc bằng một nhân vật có Cải trang từ tay. Lá cũ xuống đáy bộ bài của bạn."],
 ["Gợi ý kế tiếp","Lấy lá FILE trên cùng vào tay, rồi đánh một lá."],
 ["Hỗ trợ","Chuyển cộng sự vào Khu FILE. Khi có 7 lá trở lên ở đó, vụ án của bạn chuyển sang giai đoạn giải đáp."],
 ["Phá án","Thắng nếu bạn đang ở giai đoạn giải đáp và có đủ chứng cứ."],
 ["Đổi chỗ","Loại bỏ một nhân vật khỏi Hiện trường đầy để đánh nhân vật khác."],
 ["Vừa vào","Nhân vật vào trong lượt này không thể suy luận hay dùng Hành động. Nó vẫn đỡ đòn và dùng năng lực được."],
 ["Nhanh nhẹn","Có thể suy luận hoặc dùng Hành động ngay trong lượt nó vào."],
 ["Đột kích","Có thể dùng Hành động ngay trong lượt nó vào. Các biến thể giới hạn cho nhân vật hoặc cho vụ án."],
 ["Đạn","Hành động của nhân vật này không thể bị đỡ."],
 ["Đánh lạc hướng X","Khi đối thủ suy luận, cho một nhân vật Đánh lạc hướng đang hoạt động ngủ để khiến người suy luận bị LP −X cho đến hết lần suy luận đó. Dùng được bao nhiêu lần tùy ý."],
 ["Điều tra X","Đối thủ lật X lá trên cùng bộ bài của họ và đặt chúng xuống đáy theo thứ tự tùy ý. Hiệu ứng sau đó xem các lá này là đã bị phát hiện."],
 ["Dấu vết","Được xem là đã phát hiện nếu đối thủ đã làm mới trong ván này, nếu không là chưa phát hiện. Không bao giờ quay lại, và lần làm mới của chính bạn không được tính."],
 ["Tia linh cảm","Năng lực trên một lá chứng cứ. Nếu một Hành động lên vụ án của bạn loại bỏ nó, bạn có thể kích hoạt nó."],
 ["Gắn kết","Biểu tượng chỉ có tác dụng khi một nhân vật có tên được nêu đang ở Hiện trường của bạn. Cộng sự không được tính."],
 ["Làm mới","Xáo Khu loại bỏ thành bộ bài mới khi bộ bài hết. Đối thủ nhận 1 chứng cứ."],
 ["Loại bỏ","Đưa một lá vào Khu loại bỏ."],
 ["Đặt dưới","Một hiệu ứng đặt một lá dưới một nhân vật. Khi nhân vật đó rời đi hoặc bị đè dưới lá khác, các lá được đặt dưới bị loại bỏ."],
 ["LP / AP","LP cho chứng cứ khi suy luận, AP dùng cho Tiếp xúc."],
 ["Cấp","Số lá trong Khu FILE cần có để đánh một lá từ tay."]
];
var Q_VI=[
 {q:"Một bộ bài có bao nhiêu lá?",o:["30","40","42","50"],e:"Bộ bài có đúng 40 lá. Cùng với cộng sự và vụ án, bạn cầm tổng cộng 42 lá."},
 {q:"Bạn được cho vào tối đa bao nhiêu bản của cùng một lá (cùng ID), tính cả mọi phiên bản hình?",o:["1","2","3","4"],e:"Tối đa 3, bất kể hình. Các phiên bản song song có cùng ID là cùng một lá."},
 {q:"Những lá nào được vào bộ bài 40 lá?",o:["Nhân vật và sự kiện","Nhân vật, sự kiện và cộng sự","Cộng sự và vụ án","Bất kỳ lá nào"],e:"Chỉ nhân vật và sự kiện. Cộng sự và vụ án nằm ngoài bộ bài."},
 {q:"Trong giai đoạn Tự động bình thường, có bao nhiêu lá chuyển từ bộ bài sang Khu FILE?",o:["1","2","3","Tùy ý"],e:"Hai lá, từng lá một và úp xuống. Lượt đầu tiên của người đi trước chỉ đặt 1 lá."},
 {q:"Người đi trước có rút bài trong lượt đầu tiên của mình không?",o:["Có","Không"],e:"Có. Người đi trước rút bài như bình thường và chỉ việc đặt vào Khu FILE bị giảm còn 1."},
 {q:"Bạn có 4 lá trong Khu FILE. Cấp cao nhất bạn có thể đánh từ tay là bao nhiêu?",o:["Cấp 3","Cấp 4","Cấp 5","Cấp 7"],e:"Cấp của lá phải không cao hơn số lá FILE của bạn, nên là cấp 4."},
 {q:"Có thể có bao nhiêu nhân vật đứng ở Hiện trường?",o:["3","4","5","7"],e:"Năm. Nếu Hiện trường đầy, bạn có thể loại bỏ một nhân vật để đánh nhân vật khác, gọi là Đổi chỗ."},
 {q:"Trong một Tiếp xúc, AP của bên tấn công bằng AP của bên phòng thủ. Chuyện gì xảy ra?",o:["Không có gì","Cả hai bị loại bỏ","Nhân vật của bên phòng thủ bị loại bỏ","Bên tấn công bị loại bỏ"],e:"Bên tấn công loại bỏ nhân vật đối phương khi AP của nó lớn hơn hoặc bằng. Bên tấn công không bao giờ bị loại bỏ."},
 {q:"Ai hành động trước trong một Tiếp xúc khi AP bằng nhau?",o:["Bên tấn công","Bên phòng thủ (người không có lượt)","Người có nhiều bài hơn","Ngẫu nhiên"],e:"AP thấp hơn hành động trước, và khi AP bằng nhau thì người không có lượt đi trước."},
 {q:"Cần gì để tuyên bố Phá án?",o:["Chỉ cần đủ chứng cứ","Cộng sự đang hoạt động, giai đoạn giải đáp và đủ chứng cứ","Một nhân vật có Nhanh nhẹn","7 lá trong Khu FILE"],e:"Bạn cần giai đoạn giải đáp, cộng sự đang hoạt động và chứng cứ ít nhất bằng cấp vụ án. 7 lá chỉ quan trọng với Hỗ trợ."},
 {q:"Bộ bài của bạn hết. Chuyện gì xảy ra?",o:["Bạn thua ngay","Bạn làm mới và đối thủ nhận 1 chứng cứ","Bạn làm mới và nhận 1 chứng cứ","Không có gì"],e:"Xáo Khu loại bỏ thành bộ bài mới và đối thủ nhận 1 chứng cứ. Bạn chỉ thua nếu Khu loại bỏ của bạn trống vào lúc đó."},
 {q:"Một nhân vật vừa vào Hiện trường trong lượt này. Nó làm được gì?",o:["Suy luận","Dùng Hành động","Đỡ đòn","Không làm được gì"],e:"Nó không thể suy luận hay dùng Hành động trừ khi có Nhanh nhẹn hoặc Đột kích, nhưng nó đỡ đòn và dùng năng lực được."},
 {q:"Một nhân vật bị choáng được kích hoạt trong giai đoạn Tự động của bạn. Chuyện gì xảy ra?",o:["Nó trở thành hoạt động","Nó chuyển sang ngủ","Nó bị loại bỏ","Nó vẫn bị choáng"],e:"Nhân vật bị choáng khi được kích hoạt sẽ chuyển sang ngủ."}
];

var regUnits=[],regTexts=[],regOpts=[];
(function collect(){
  var INL={B:1,A:1,I:1,EM:1,STRONG:1,SPAN:1,BR:1,CODE:1,SMALL:1},SKIP={SCRIPT:1,STYLE:1,svg:1,SVG:1,INPUT:1,SELECT:1,NAV:1};
  var dyn=["dBar","dSay","dTable","dPrev","dNext","dAuto","phaseList","actTabs","actPanel","glList","quizBox","lvlOut","winOut","contactOut","areaInfo","lvlChips","pgame","funfact","cotd","homestats","school","nextStep","prevStep"];
  function isUnit(el){for(var i=0;i<el.childNodes.length;i++){var c=el.childNodes[i];if(c.nodeType===1){if(!INL[c.tagName]||!isUnit(c))return false}}return true}
  function walk(el){
    if(SKIP[el.tagName]||dyn.indexOf(el.id)>-1||el.hasAttribute("data-langsw")||el.hasAttribute("data-vi"))return;
    if(!el.textContent.trim())return;
    if(isUnit(el)){var k=el.innerHTML.trim();if(VS.u[k])regUnits.push({el:el,en:el.innerHTML,k:k});return}
    for(var i=0;i<el.childNodes.length;i++){var c=el.childNodes[i];
      if(c.nodeType===3){var t=c.nodeValue.trim();if(t&&VS.u["@t:"+t])regTexts.push({n:c,en:c.nodeValue,k:t})}
      else if(c.nodeType===1)walk(c)}
  }
  walk(document.body);
  document.querySelectorAll("select option").forEach(function(o){if(VS.opt[o.textContent.trim()])regOpts.push({el:o,en:o.textContent})});
})();
var attrEls=[];document.querySelectorAll("[placeholder],[aria-label]").forEach(function(e){if(e.closest("#pgame")||e.hasAttribute("data-langsw"))return;["placeholder","aria-label"].forEach(function(a){var v=e.getAttribute(a);if(v&&VS.attr[v])attrEls.push({el:e,a:a,en:v})})});
var dataVi=[].slice.call(document.querySelectorAll("[data-vi]")).map(function(e){return {el:e,en:e.innerHTML}});
function applyStatic(){
  var vi=LANG==="vi";
  regUnits.forEach(function(r){r.el.innerHTML=vi?VS.u[r.k]:r.en});
  regTexts.forEach(function(r){r.n.nodeValue=vi?r.en.replace(r.k,VS.u["@t:"+r.k]):r.en});
  regOpts.forEach(function(r){r.el.textContent=vi?VS.opt[r.en.trim()]:r.en});
  attrEls.forEach(function(r){r.el.setAttribute(r.a,vi?VS.attr[r.en]:r.en)});
  dataVi.forEach(function(r){r.el.innerHTML=vi?r.el.getAttribute("data-vi"):r.en});
  document.title=document.body.getAttribute(vi?"data-title-vi":"data-title");document.documentElement.lang=vi?"vi":"en";
  document.querySelectorAll("[data-langsw] button").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.l===LANG))});
}
function setLang(l,fromEvent){
  if(l!=="en"&&l!=="vi")return;LANG=l;
  try{localStorage.setItem("conanLang",l)}catch(e){}
  applyStatic();
  if(window.__redraw)window.__redraw();
  if(!fromEvent)try{document.dispatchEvent(new CustomEvent("conan-lang",{detail:{lang:l}}))}catch(e){}
}
document.querySelectorAll("[data-langsw] button").forEach(function(b){b.addEventListener("click",function(){setLang(b.dataset.l)})});
document.addEventListener("conan-lang",function(e){if(e.detail&&e.detail.lang&&e.detail.lang!==LANG)setLang(e.detail.lang,true)});

/* Areas */
var AREAS={
 scene:["Scene","Characters enter here from your hand. Up to 5 can stand in Scene, and you can have several copies of the same card. When Scene is full you can still play a character by removing one already there (a Switch)."],
 partner:["Partner","Your partner sits here. It deduces, and uses Assist and Case Solved. MR cards can also be placed here, and certain cards with special traits."],
 case:["Case","Your case card. It shows whether you are in the case phase or the solution phase, and how much evidence you need."],
 evidence:["Evidence area","Evidence is the top cards of your deck, placed face down one at a time. The newest evidence goes on top."],
 file:["FILE area","The Auto phase puts cards here face down. They count toward which levels you can play. Your partner counts too while it is here after an Assist."],
 deck:["Deck","40 cards, face down. Draw from here, and deduction pulls evidence from here."],
 remove:["Remove area","Removed cards and used events. It becomes your new deck when you refresh, and an empty Remove area at that moment loses you the game."],
 hand:["Hand","Cards you can play. Keep them hidden from your opponent. There is no hand size limit."]
};
var bb=document.querySelectorAll(".area");
bb.forEach(function(b){b.addEventListener("click",function(){
  bb.forEach(function(x){x.setAttribute("aria-pressed","false")});b.setAttribute("aria-pressed","true");
  curArea=b.dataset.area;showArea();});});
var curArea=null;
function showArea(){if(!$("#areaInfo"))return;if(!curArea){$("#areaInfo").textContent=L("Tap an area above.","Chạm vào một khu vực ở trên.");return}var a=(LANG==="vi"?AREAS_VI:AREAS)[curArea];$("#areaInfo").innerHTML="<b>"+a[0]+"</b><br>"+a[1];}

/* Turn stepper */
if($("#phaseList")){
var cur=0;
function steps(){
  var first=$("#firstTurn").checked;
  if(LANG==="vi")return STEPS_VI(first);
  return [
   {p:"Auto phase",t:"Activate your partner",d:"Turn it upright. If it was in the FILE area after an Assist, it returns to the partner area first."},
   {p:"Auto phase",t:"Activate your characters",d:"Every character in Scene becomes active. Stunned characters turn sleeping instead."},
   {p:"Auto phase",t:"Draw 1 card",d:"The first player also draws on turn one."},
   {p:"Auto phase",t:first?"Place 1 card in FILE":"Place 2 cards in FILE",d:first?"Only on the first player's first turn: put just 1 card from the top of your deck face down into the FILE area.":"Put the top 2 cards of your deck into the FILE area one at a time, face down."},
   {p:"Main phase",t:"Take actions",d:"Play from hand, Next Hint, partner abilities, character abilities, deduce and take Actions, in any order."},
   {p:"End phase",t:"Turn ends",d:"End-of-turn abilities trigger and resolve, then \"until end of turn\" effects expire. Announce the end of your turn."}
  ];
}
function renderSteps(){
  var s=steps();if(cur>=s.length)cur=s.length-1;
  $("#phaseList").innerHTML=s.map(function(x,i){return '<li'+(i===cur?' aria-current="step"':'')+'><div class="mono">'+x.p+'</div><div><b>'+x.t+'</b><p>'+x.d+'</p></div></li>'}).join("");
  $("#prevStep").disabled=cur===0;
  $("#nextStep").textContent=cur===s.length-1?L("Restart","Làm lại"):L("Next step","Bước tiếp");$("#prevStep").textContent=L("Back","Quay lại");
}
$("#nextStep").onclick=function(){cur=cur>=steps().length-1?0:cur+1;renderSteps()};
$("#prevStep").onclick=function(){if(cur>0)cur--;renderSteps()};
$("#firstTurn").onchange=renderSteps;renderSteps();

}
/* Level check */
if($("#lvlOut")){
function lvl(){
  var n=Math.max(0,parseInt($("#fileCount").value)||0), mode=$("#lvlMode").value, pin=$("#partnerIn").checked;
  var total=n+(pin?1:0), out=$("#lvlOut"), chips="";
  var avail=mode==="hint"?total-1:total;
  if(mode==="hint"&&n===0){ avail=-1; }
  var max=Math.max(8,total);
  for(var i=1;i<=max;i++){chips+='<span class="'+(i<=avail?'ok':'')+'">'+i+'</span>'}
  $("#lvlChips").innerHTML=chips;
  if(mode==="hint"){
    if(n===0){out.className="out bad";out.innerHTML=L("<b>Next Hint is not possible.</b> You need at least one face-down card in the FILE area. A partner there is not taken into your hand.","<b>Không thể dùng Gợi ý kế tiếp.</b> Bạn cần ít nhất một lá úp trong Khu FILE. Cộng sự ở đó không được lấy vào tay.");return;}
    out.className="out good";
    out.innerHTML=LANG==="vi"?"<b>Gợi ý kế tiếp:</b> lá FILE trên cùng được đưa vào tay bạn, còn lại "+avail+" lá để tính. Sau đó bạn có thể đánh một lá cấp "+(avail<1?"... không có, vì chỉ còn cấp 0":"tối đa "+avail)+", hoặc không đánh. Lá bạn vừa lấy không được tính.":"<b>Next Hint:</b> the top FILE card goes to your hand, leaving "+avail+" card"+(avail===1?"":"s")+" to count. You may then play one card of level "+(avail<1?"... none, since level 0 is the only option":"up to "+avail)+", or none. It does not count the card you just took.";
  } else {
    out.className="out"+(avail>0?" good":"");
    out.innerHTML=LANG==="vi"?"<b>Từ tay:</b> có thể đánh lá cấp "+(avail>0?"từ 1 đến "+avail:"0 hoặc thấp hơn")+", một lần mỗi lượt, và không được nếu bạn đã dùng Gợi ý kế tiếp trong lượt này. Lá bài cũng phải hợp màu với vụ án của bạn.":"<b>From hand:</b> level "+(avail>0?"1 to "+avail:"0 or lower only")+" can be played, once per turn, and not if you already used Next Hint this turn. The card must also match your case's color.";
  }
}
["#fileCount","#lvlMode","#partnerIn"].forEach(function(s){$(s).addEventListener("input",lvl);$(s).addEventListener("change",lvl)});lvl();

}
/* Actions */
var ACT=[
 {n:"Play from hand",b:"once per turn",h:"<p>Play one card from your hand whose level is at most the number of cards in your FILE area. A character enters Scene active. An event resolves and goes to the Remove area.</p><ul class='tight'><li>You cannot do this if you already used Next Hint this turn.</li><li>The card must share a color with your case. A two-color card needs your case to have both colors.</li><li>Characters entered by an effect, and Cut-ins, ignore the color limit.</li><li>With a full Scene, remove any character already there to make room (Switch).</li></ul>"},
 {n:"Next Hint",h:"<p>Convert FILE cards into a play.</p><ol class='tight'><li>Take the top card of your FILE area into your hand. Your partner is not taken.</li><li>Then play one card from your hand whose level is at most the cards left in your FILE area. You may skip playing. The card you just took does not count, but you can play it.</li></ol><p>You cannot do anything else between the two steps, and the right to play does not carry over to later. You cannot Next Hint with an empty FILE area.</p>"},
 {n:"Assist",h:"<p>Declare <b>Assist</b>: sleep your partner and move it to the FILE area. While there it counts as one of your FILE cards.</p><p>Then if you have <b>7 or more</b> cards in the FILE area including the partner, your case moves to its solution phase. This is mandatory, and the case never goes back to the case phase.</p><p>You need an active partner. The partner returns during your next Auto phase.</p>"},
 {n:"Case Solved",h:"<p>Declare <b>Case Solved</b> and sleep your partner. If you have at least as much evidence as your case level, you win the game.</p><p>You can only declare it in the solution phase and with an active partner.</p>"},
 {n:"Abilities",h:"<p>Use activated abilities on your characters in Scene, your case, and an MR in the partner area.</p><ul class='tight'><li>Pay the cost first, everything left of the colon. If any part cannot be paid, you cannot use the ability.</li><li>A character can use these the turn it enters.</li><li>Abilities that need the character to sleep need it to be active. Others work even if it is sleeping or stunned.</li></ul>"},
 {n:"Deduce",h:"<p>Gain evidence from LP.</p><ol class='tight'><li>Declare deduction and sleep your active partner or an active character in Scene.</li><li>Your opponent may use Misdirect.</li><li>You gain evidence equal to that card's LP: place cards from the top of your deck face down, one at a time, onto the evidence area.</li></ol><p>A character cannot deduce the turn it entered unless it has Swift. LP of 0 or less gives nothing. There is no limit per turn, and an activated card can deduce again.</p>"},
 {n:"Action",h:"<p>Attack the opponent's board or case with an active character. A character cannot take an Action the turn it entered unless it has Swift or Assault.</p><ol class='tight'><li>Choose a target: an opposing <b>sleeping or stunned character</b>, or the <b>opposing case</b> if it has at least one evidence. Sleep your attacker.</li><li>Your opponent may <b>guard</b> with one active character, which sleeps. A just-entered character can guard and AP does not matter.</li><li>If guarded, there is a Contact between your attacker and the guard. Otherwise: against a character, Contact with it. Against the case, the top card of their evidence is removed and you gain 1 evidence.</li></ol><p>An Action on the case moves exactly 1 evidence, whatever the attacker's LP. If the removed evidence has Flash of insight (Hirameki), the opponent may activate it, even if it was face up.</p>"}
];
if($("#actTabs")){
var aIdx=0;
function renderTabs(){
  var AC=LANG==="vi"?ACT_VI:ACT;
  $("#actTabs").innerHTML=AC.map(function(a,i){return '<button class="tab" role="tab" aria-selected="'+(i===aIdx)+'" data-i="'+i+'">'+a.n+'</button>'}).join("");
  var a=AC[aIdx];$("#actPanel").innerHTML=(a.b?'<span class="badge">'+a.b+'</span>':'')+a.h;
  document.querySelectorAll(".tab").forEach(function(t){t.onclick=function(){aIdx=+t.dataset.i;renderTabs()}});
}
renderTabs();

}
/* Win checker */
if($("#winOut")){
function win(){
  var Lv=+$("#caseLevel").value||0, E=+$("#evCount").value||0, F=+$("#fileW").value||0, ph=$("#casePhase").value, pt=$("#partnerState").value;
  var h="";
  var active=pt==="active";
  // Case Solved
  var okSolve=ph==="solution"&&active&&E>=Lv;
  var why=[];
  if(ph!=="solution")why.push(LANG==="vi"?"vụ án của bạn phải ở giai đoạn giải đáp":"your case must be in its solution phase");
  if(!active)why.push(LANG==="vi"?"cộng sự của bạn phải đang hoạt động":"your partner must be active");
  if(E<Lv)why.push(LANG==="vi"?"bạn cần thêm "+(Lv-E)+" chứng cứ":"you need "+(Lv-E)+" more evidence");
  h+=LANG==="vi"?'<div class="out '+(okSolve?'good':'bad')+'"><b>Phá án: '+(okSolve?'bạn thắng.':'chưa được.')+'</b> '+(okSolve?'Cho cộng sự ngủ và tuyên bố.':'Còn thiếu: '+why.join(", ")+'.')+'</div>':'<div class="out '+(okSolve?'good':'bad')+'"><b>Case Solved: '+(okSolve?'you win.':'not yet.')+'</b> '+(okSolve?'Sleep your partner and declare it.':'Missing: '+why.join(", ")+'.')+'</div>';
  // Assist
  if(ph==="case"){
    var after=F+1;
    h+=LANG==="vi"?'<div class="out '+(active?'good':'bad')+'"><b>Hỗ trợ: '+(active?'dùng được.':'không dùng được.')+'</b> '+(active?('Khu FILE của bạn sẽ có '+after+' lá tính cả cộng sự. '+(after>=7?'Đó là 7 lá trở lên, nên vụ án của bạn chuyển sang giai đoạn giải đáp.':'Bạn cần 7 lá trở lên, nên cần thêm '+(7-after)+' lá trước.')):'Cộng sự của bạn phải đang hoạt động.')+'</div>':'<div class="out '+(active?'good':'bad')+'"><b>Assist: '+(active?'available.':'not available.')+'</b> '+(active?('Your FILE area would have '+after+' card'+(after===1?'':'s')+' with the partner. '+(after>=7?'That is 7 or more, so your case moves to the solution phase.':'You need 7 or more, so you need '+(7-after)+' more first.')):'Your partner must be active.')+'</div>';
  } else {
    h+=LANG==="vi"?'<div class="out"><b>Hỗ trợ:</b> vụ án của bạn đã ở giai đoạn giải đáp, và không bao giờ quay lại.</div>':'<div class="out"><b>Assist:</b> your case is already in the solution phase, which never reverts.</div>';
  }
  if(okSolve){h+='<div class="note">'+L("Assist moves your partner away, so use Case Solved while it is still in front of you.","Hỗ trợ đưa cộng sự của bạn đi chỗ khác, nên hãy dùng Phá án khi nó còn ở trước mặt bạn.")+'</div>';}
  $("#winOut").innerHTML=h;
}
["#caseLevel","#evCount","#fileW","#casePhase","#partnerState"].forEach(function(s){$(s).addEventListener("input",win);$(s).addEventListener("change",win)});win();

}
/* Contact */
if($("#contactOut")){
function contact(){
  var a=+$("#apA").value||0,d=+$("#apD").value||0;
  var first=LANG==="vi"?(a<d?"Bạn (bên tấn công) hành động trước vì AP của bạn thấp hơn.":(a>d?"Bên phòng thủ hành động trước vì AP của họ thấp hơn.":"Bên phòng thủ hành động trước vì AP bằng nhau và người không có lượt đi trước.")):(a<d?"You (the attacker) act first because your AP is lower.":(a>d?"The defender acts first because their AP is lower.":"The defender acts first because the APs are equal and the non-turn player goes first."));
  var fa=a+($("#cutA").checked?2000:0),fd=d+($("#cutD").checked?2000:0);
  var rm=fa>=fd;
  $("#contactOut").innerHTML=LANG==="vi"?'<div class="out"><b>Thứ tự hành động</b><br>'+first+' Thứ tự được quyết định bằng AP in trên lá, trước khi ai hành động.</div>'+
   '<div class="out '+(rm?'good':'bad')+'"><b>Kết quả: '+(rm?"nhân vật của bên phòng thủ bị loại bỏ.":"không có gì xảy ra.")+'</b><br>AP cuối cùng: bên tấn công '+fa+', bên phòng thủ '+fd+'. '+(fa===fd?'AP bằng nhau vẫn loại bỏ nhân vật. ':'')+'Bên tấn công không bao giờ bị loại bỏ.</div>':'<div class="out"><b>Order of play</b><br>'+first+' Order is decided by the printed AP before anyone acts.</div>'+
   '<div class="out '+(rm?'good':'bad')+'"><b>Result: '+(rm?"the defender's character is removed.":"nothing happens.")+'</b><br>Final AP: attacker '+fa+', defender '+fd+'. '+(fa===fd?'Equal AP still removes the character. ':'')+'The attacker is never removed.</div>';
}
["#apA","#apD","#cutA","#cutD"].forEach(function(s){$(s).addEventListener("input",contact);$(s).addEventListener("change",contact)});contact();

}
/* Glossary */
var GL=[
["Scene","現場","Where your characters stand. Up to 5."],
["Partner","パートナー","Your sidekick card. Deduces, Assists, solves the case."],
["Case / Solution","事件 / 事件編・解決編","The case you must solve. It starts in the case phase and flips to the solution phase."],
["Evidence","証拠","Cards in your evidence area. You need your case level in evidence to win."],
["FILE area","FILEエリア","Receives 2 cards a turn. Its size decides which levels you can play."],
["Deduce","推理","Sleep a partner or character to gain evidence equal to its LP."],
["Action","アクション","Attack a sleeping or stunned character, or the opposing case."],
["Guard","ガード","Sleep one active character to take the Contact for an Action."],
["Contact","コンタクト","Compare AP. The attacker wins ties and never gets removed."],
["Cut-in","カットイン","Play a hand card with the Cut-in effect during a Contact. One per use."],
["Disguise","変装","Swap a hand character with Disguise in for the character in Contact. The old one goes to the bottom of your deck."],
["Next Hint","ネクストヒント","Take the top FILE card into your hand, then play a card."],
["Assist","アシスト","Move your partner into the FILE area. With 7 or more cards there, your case becomes the solution phase."],
["Case Solved","事件解決","Win if you are in the solution phase and have enough evidence."],
["Switch","スイッチ","Remove a character from a full Scene to play another."],
["Just-entered","名乗り状態","A character that entered this turn cannot deduce or take Actions. It can still guard and use abilities."],
["Swift","迅速","Can deduce or take Actions the turn it enters."],
["Assault","突撃","Can take Actions the turn it enters. Variants limit it to characters or to the case."],
["Bullet","ブレット","This character's Actions cannot be guarded."],
["Misdirect X","ミスリードX","When the opponent deduces, sleep an active Misdirect character to give the deducer LP −X until that deduction ends. Any number can be used."],
["Investigate X","捜査X","The opponent reveals the top X cards of their deck and puts them on the bottom in any order. The effect then treats those cards as discovered."],
["Trace","痕跡","Discovered once the opponent has refreshed this game, otherwise undiscovered. It never reverts, and your own refresh does not count."],
["Flash of insight","ヒラメキ","An ability on an evidence card. If an Action on your case removes it, you may activate it."],
["Bond","絆","An icon that works only while a named character is in your Scene. The partner does not count."],
["Refresh","リフレッシュ","Shuffle the Remove area into a new deck when the deck runs out. The opponent gains 1 evidence."],
["Remove","リムーブ","Send a card to the Remove area."],
["Set","セット","An effect places a card under a character. When that character leaves or is stacked under another, the set cards are removed."],
["LP / AP","ロジックポイント / アクションポイント","LP for evidence when deducing, AP for Contact."],
["Level","レベル","The FILE-area count needed to play a card from hand."]
];
if($("#glList")){
function renderGl(){
  var q=($("#glSearch").value||"").toLowerCase(),vi=LANG==="vi";
  var rows=GL.map(function(g,i){return vi?[GL_VI[i][0]+" ("+g[0]+")",g[1],GL_VI[i][1]]:g});
  $("#glList").innerHTML=rows.filter(function(g){return (g[0]+g[1]+g[2]).toLowerCase().indexOf(q)>-1}).map(function(g){return '<div><b>'+g[0]+'</b> <span class="jp">'+g[1]+'</span><p>'+g[2]+'</p></div>'}).join("")||'<p>'+L("No term found.","Không tìm thấy thuật ngữ.")+'</p>';
}
$("#glSearch").addEventListener("input",renderGl);renderGl();

}
/* Quiz */
var Q=[
 {q:"How many cards are in a deck?",o:["30","40","42","50"],a:1,e:"The deck is exactly 40. With the partner and case you hold 42 cards in total."},
 {q:"How many copies of the same card (same ID) may you include, counting all art versions?",o:["1","2","3","4"],a:2,e:"Up to 3, whatever the art. Parallel versions with the same ID are the same card."},
 {q:"Which cards can go into the 40-card deck?",o:["Characters and events","Characters, events and the partner","Partners and cases","Anything"],a:0,e:"Only characters and events. The partner and the case sit outside the deck."},
 {q:"How many cards go from your deck to the FILE area in a normal Auto phase?",o:["1","2","3","As many as you want"],a:1,e:"Two, one at a time and face down. The first player's first turn places only 1."},
 {q:"Does the first player draw a card on their first turn?",o:["Yes","No"],a:0,e:"Yes. The first player draws as usual and only the FILE placement is reduced to 1."},
 {q:"You have 4 cards in your FILE area. What is the highest level you can play from hand?",o:["Level 3","Level 4","Level 5","Level 7"],a:1,e:"A card's level must be at most your FILE card count, so level 4."},
 {q:"How many characters can stand in Scene?",o:["3","4","5","7"],a:2,e:"Five. If Scene is full you can remove a character to play another, called a Switch."},
 {q:"In a Contact, the attacker's AP equals the defender's AP. What happens?",o:["Nothing","Both are removed","The defender's character is removed","The attacker is removed"],a:2,e:"The attacker removes the opposing character when its AP is greater than or equal. The attacker is never removed."},
 {q:"Who acts first in a Contact when AP is equal?",o:["The attacker","The defender (non-turn player)","Whoever has more cards","It is random"],a:1,e:"The lower AP acts first, and on equal AP the non-turn player goes first."},
 {q:"What is required to declare Case Solved?",o:["Only enough evidence","Active partner, solution phase and enough evidence","A character with Swift","7 cards in the FILE area"],a:1,e:"You need the solution phase, an active partner, and at least as much evidence as the case level. The 7 cards matter for Assist."},
 {q:"Your deck runs out. What happens?",o:["You lose at once","You refresh and your opponent gains 1 evidence","You refresh and gain 1 evidence","Nothing"],a:1,e:"Shuffle the Remove area into a new deck and the opponent gains 1 evidence. You lose only if your Remove area is empty at that moment."},
 {q:"A character entered Scene this turn. What can it do?",o:["Deduce","Take an Action","Guard","Nothing"],a:2,e:"It cannot deduce or take Actions unless it has Swift or Assault, but it can guard and use abilities."},
 {q:"A stunned character is activated in your Auto phase. What happens?",o:["It becomes active","It becomes sleeping","It is removed","It stays stunned"],a:1,e:"A stunned character that would be activated becomes sleeping instead."}
];
if($("#quizBox")){
var qi=0,score=0,answered=false,qSel=null;
function best(){try{return +localStorage.getItem("conanTcgBest")||0}catch(e){return 0}}
function saveBest(s){try{if(s>best())localStorage.setItem("conanTcgBest",String(s));if(s===Q.length)localStorage.setItem("conanQuizPerfect","1")}catch(e){}}
function renderQ(){
  var box=$("#quizBox");
  if(qi>=Q.length){
    saveBest(score);
    var vi=LANG==="vi";
    var msg=score>=Q.length-1?L("You are ready for a game.","Bạn đã sẵn sàng cho một ván chơi."):(score>=Q.length*0.6?L("Good grasp. Review the missed topics once more.","Nắm khá tốt. Hãy xem lại các phần bạn làm sai một lần nữa."):L("Re-read the Setup, Turn and Actions chapters, then try again.","Hãy đọc lại các chương Chuẩn bị, Lượt và Hành động, rồi thử lại."));
    box.innerHTML='<h3>'+L("Score","Điểm")+': '+score+' / '+Q.length+'</h3><p>'+msg+' '+L("Best on this device","Cao nhất trên thiết bị này")+': '+best()+'.</p><button class="btn" id="qRestart">'+L("Try again","Thử lại")+'</button>';
    $("#qRestart").onclick=function(){qi=0;score=0;qSel=null;renderQ()};return;
  }
  var q=Q[qi],qv=Q_VI[qi],vi2=LANG==="vi",txt=vi2?qv:q;answered=false;
  box.innerHTML='<div class="bar"><i style="width:'+(qi/Q.length*100)+'%"></i></div><span class="mono">'+L("Question "+(qi+1)+" of "+Q.length,"Câu hỏi "+(qi+1)+" trên "+Q.length)+'</span><h3 style="margin:6px 0 4px">'+txt.q+'</h3>'+
    txt.o.map(function(o,i){return '<button class="q-opt" data-i="'+i+'">'+o+'</button>'}).join("")+'<div id="qFb" aria-live="polite"></div>';
  function answer(i,replay){
    answered=true;qSel=i;
    box.querySelectorAll(".q-opt").forEach(function(x,j){x.disabled=true;if(j===q.a)x.classList.add("right");else if(j===i)x.classList.add("wrong")});
    if(i===q.a&&!replay)score++;
    $("#qFb").innerHTML='<div class="out '+(i===q.a?'good':'bad')+'"><b>'+(i===q.a?L('Correct.','Chính xác.'):L('Not quite.','Chưa đúng.'))+'</b> '+txt.e+'</div><div class="controls"><button class="btn" id="qNext">'+(qi===Q.length-1?L('See score','Xem điểm'):L('Next question','Câu tiếp theo'))+'</button></div>';
    $("#qNext").onclick=function(){qi++;qSel=null;renderQ()};if(!replay)$("#qNext").focus();
  }
  box.querySelectorAll(".q-opt").forEach(function(b){b.onclick=function(){if(answered)return;answer(+b.dataset.i,false)}});
  if(qSel!==null)answer(qSel,true);
}
renderQ();
}
/* home page: your streak and badges, and a card of the day */
function dayKey(d){d=d||new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function homeStats(){
  var el=$("#homestats");if(!el)return;
  var r={};try{r=JSON.parse(localStorage.getItem("conanRecord")||"{}")||{}}catch(e){}
  var d=r.daily||{},y=dayKey(new Date(Date.now()-864e5)),today=dayKey(),streak=(d.last===today||d.last===y)?d.streak||0:0;
  var wins=0;Object.keys(r.w||{}).forEach(function(k){wins+=r.w[k]||0});
  var badges=Object.keys(r.badges||{}).length;
  el.innerHTML='<a href="practice.html"><span>🔥</span><b>'+streak+'</b>'+L(streak===1?"day streak":"day streak","ngày liên tiếp")+(d.last===today?" ✅":"")+'</a>'+
    '<a href="practice.html"><span>📅</span>'+(d.last===today?L("Today's case is solved","Đã phá vụ án hôm nay"):L("Today's case is waiting","Vụ án hôm nay đang chờ"))+'</a>'+
    '<a href="practice.html"><span>🏅</span><b>'+badges+'</b>'+L("badges","huy hiệu")+'</a>'+
    '<a href="practice.html"><span>🏆</span><b>'+wins+'</b>'+L(wins===1?"win":"wins","trận thắng")+'</a>';
}
var COTD=null;
function loadScript(src){return new Promise(function(ok,bad){var s=document.createElement("script");s.src=src;s.onload=ok;s.onerror=bad;document.head.appendChild(s)})}
function hashDay(t){var h=2166136261;for(var i=0;i<t.length;i++)h=Math.imul(h^t.charCodeAt(i),16777619);return h>>>0}
function cotd(){
  var el=$("#cotd");if(!el)return;
  if(!COTD){
    var need=[];if(!window.CONAN_CARDS)need.push("assets/cards-data.js");if(!window.CONAN_I18N)need.push("assets/cards-i18n.js");if(!window.ConanTr)need.push("assets/cards-translate.js");
    need.reduce(function(p,src){return p.then(function(){return loadScript(src)})},Promise.resolve()).then(function(){
      var D=window.CONAN_CARDS,seen={},pool=[];
      D.cards.forEach(function(c){if((c.type==="キャラ"||c.type==="イベント")&&/^https:\/\//.test(c.image_url||"")&&!seen[c.card_id]){seen[c.card_id]=1;pool.push(c)}});
      pool.sort(function(a,b){return a.card_num<b.card_num?-1:1});
      COTD={c:pool[hashDay("cotd-"+dayKey())%pool.length],names:D.names||{}};cotd();
    }).catch(function(){el.innerHTML='<p class="why">'+L("The card list could not be loaded.","Không tải được danh sách lá bài.")+'</p>'});
    return;
  }
  var c=COTD.c,tr=window.ConanTr,lang=LANG,nm=(tr&&tr.name(c.title,lang))||COTD.names[c.title]||c.title_romaji||c.title;
  var esc=function(v){return String(v==null?"":v).replace(/[&<>"]/g,function(x){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[x]})};
  var COLS={"青":["blue","Blue","Xanh dương"],"緑":["green","Green","Xanh lá"],"白":["white","White","Trắng"],"赤":["red","Red","Đỏ"],"黄":["yellow","Yellow","Vàng"],"黒":["black","Black","Đen"]};
  var colors=String(c.color||"").split("").filter(function(x){return COLS[x]});
  function chip(k,v){return '<div class="cotd-stat"><span>'+k+'</span><b>'+v+'</b></div>'}
  var stats=chip(L("Type","Loại"),c.type==="キャラ"?L("Character","Nhân vật"):L("Event","Sự kiện"));
  if(c.cost!=null)stats+=chip(L("Level","Cấp"),esc(c.cost));
  if(c.ap!=null)stats+=chip("AP",esc(c.ap));
  if(c.lp!=null)stats+=chip("LP",esc(c.lp));
  stats+=chip(L("Rarity","Độ hiếm"),esc(c.rarity||"–"));
  function block(label,jp){if(!jp)return "";var t=tr?tr.text(jp,lang):jp;return '<div class="cotd-text"><span class="mono">'+label+'</span><p>'+esc(t).replace(/\n/g,"<br>")+'</p></div>'}
  var text=block(L("Ability","Năng lực"),c.feature)+block(L("Flash of insight","Tia linh cảm"),c.hirameki)+block("Cut-in",c.cut_in);
  var link="deck.html#card="+encodeURIComponent(c.card_num);
  el.innerHTML='<div class="cotd-head"><span class="cotd-badge">📦 '+esc(c.package_code||"")+((tr&&tr.box&&tr.box(c.package_code,lang))?' · '+esc(tr.box(c.package_code,lang)):'')+'</span><span class="cotd-date">'+dayKey()+'</span></div>'+
    '<div class="cotd-body"><a class="cotd-img" href="'+link+'" aria-label="'+esc(L("Open ","Mở ")+nm)+'"><img loading="lazy" referrerpolicy="no-referrer" src="'+esc(c.image_url)+'" alt="'+esc(nm)+'"></a>'+
    '<div class="cotd-info"><h3>'+colors.map(function(x){return '<span class="dot dk-'+COLS[x][0]+'" title="'+esc(L(COLS[x][1],COLS[x][2]))+'"></span>'}).join("")+esc(nm)+'</h3>'+
    '<p class="cotd-sub"><span lang="ja">'+esc(c.title)+'</span> · '+esc(c.card_num)+'</p>'+
    '<div class="cotd-stats">'+stats+'</div>'+(text||'<div class="cotd-text"><p>'+L("This card has no ability text.","Lá này không có chữ năng lực.")+'</p></div>')+'</div></div>'+
    '<div class="cotd-foot"><a class="btn" href="'+link+'">'+L("🃏 Build a deck around it","🃏 Xếp bộ bài quanh lá này")+'</a><small>'+L("A different card every day. Unofficial translation.","Mỗi ngày một lá khác. Bản dịch không chính thức.")+'</small></div>';
}
/* Play page: a random "Did you know?" from assets/facts.js, with a detective tip.
   A different fact on every visit or refresh (never the same one twice in a row). */
var FACTS=window.CONAN_FACTS||[];
var lastFact=-1;
function factPick(){
  var prev=-1;try{prev=+sessionStorage.getItem("conanFact")}catch(e){}
  var i;do{i=Math.floor(Math.random()*FACTS.length)}while(FACTS.length>1&&(i===prev||i===lastFact));
  lastFact=i;try{sessionStorage.setItem("conanFact",String(i))}catch(e){}
  return i;
}
function funFact(next){
  var el=$("#funfact");if(!el||!FACTS.length)return;
  var i=next||el.dataset.i===undefined?factPick():+el.dataset.i,f=FACTS[i],k=LANG==="vi"?1:0;
  el.dataset.i=i;
  el.innerHTML='<div class="ff-ico" aria-hidden="true">'+f.ico+'</div><div class="ff-main"><span class="mono">'+L("Did you know? · Fact "+(i+1)+" of "+FACTS.length,"Bạn có biết? · Mẩu "+(i+1)+"/"+FACTS.length)+'</span>'+
    '<h3>'+f.who[k]+'</h3><p class="ff-src">'+f.src[k]+'</p><p>'+f.t[k]+'</p><p class="ff-to"><span>'+L("Inspired","Lấy cảm hứng cho")+'</span> '+f.to[k]+'</p></div>'+
    '<button type="button" class="btn ghost ff-next" id="ffNext">'+L("🔄 Another fact","🔄 Mẩu khác")+'</button>'+
    (f.tip?'<div class="ff-tip"><b>🔎 '+L("Detective tip","Mẹo thám tử")+'</b><p>'+f.tip[k]+'</p><a href="detective.html">'+L("More in Detective School ▶","Học thêm ở Trường thám tử ▶")+'</a></div>':'');
  $("#ffNext").onclick=function(){funFact(true)};
}
funFact();
homeStats();if($("#cotd")){if("requestIdleCallback" in window)requestIdleCallback(cotd,{timeout:1500});else setTimeout(cotd,300)}
/* copy the email address; if the browser refuses, select it so it can be copied by hand */
var mc=$("#mailCopy");if(mc)mc.addEventListener("click",function(){
  var el=$("#mailTxt"),t=el.textContent;
  function show(msg){mc.textContent=msg;setTimeout(function(){mc.textContent=L("Copy","Sao chép")},1800)}
  function byHand(){try{var r=document.createRange();r.selectNodeContents(el);var s=getSelection();s.removeAllRanges();s.addRange(r)}catch(e){}var k=/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent)?"⌘C":"Ctrl+C";show(L("Selected: press "+k,"Đã chọn: nhấn "+k))}
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(function(){show(L("Copied","Đã sao chép"))},byHand);else byHand();
});
window.__redraw=function(){showArea();[["#phaseList",function(){renderSteps()}],["#lvlOut",function(){lvl()}],["#actTabs",function(){renderTabs()}],["#winOut",function(){win()}],["#contactOut",function(){contact()}],["#glList",function(){renderGl()}],["#quizBox",function(){renderQ()}],["#funfact",function(){funFact(false)}],["#homestats",homeStats],["#cotd",function(){if(COTD)cotd()}]].forEach(function(x){if($(x[0]))x[1]()})};
applyStatic();if(LANG==="vi")window.__redraw();
})();
/* offline support: only when served over http(s); opening the files directly still works without it */
if("serviceWorker" in navigator&&/^https?:$/.test(location.protocol)){
  window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){})});
}
