export type PoseLevel = "基礎" | "中階" | "進階";
export type PosePosition = "站姿" | "坐姿" | "跪姿" | "俯臥" | "仰臥" | "手臂支撐";

export type PoseGuide = {
  id: string;
  zh: string;
  en: string;
  sanskrit: string;
  position: PosePosition;
  level: PoseLevel;
  focus: string[];
  tags: string[];
  summary: string;
  enter: string[];
  exit: string;
  cues: string[];
  cautions: string[];
  regressions: string[];
  progressions: string[];
  props: string[];
  traditions?: string[];
  source: { label: string; url: string };
};

const YJ = "https://www.yogajournal.com/pose-finder/pose-finder/";
const YI = "https://yogainternational.com/article/view/beginner-yoga-poses/";

const CORE_POSES: PoseGuide[] = [
  {
    id: "mountain", zh: "山式", en: "Mountain Pose", sanskrit: "Tadasana", position: "站姿", level: "基礎",
    focus: ["姿勢覺察", "足踝穩定", "核心"], tags: ["平衡", "站立", "根基", "暖身", "體態"],
    summary: "建立站姿的足底承重、軀幹堆疊與呼吸覺察，是多數站姿和平衡體式的起點。",
    enter: ["雙腳約髖寬、內側大致平行，腳趾自然展開。", "平均感受大拇趾球、小拇趾球、內外腳跟四點承重。", "骨盆回到中立，胸廓疊在骨盆上，頭頂向上延伸。"],
    exit: "放鬆手臂與視線，保持穩定呼吸後自然走出。",
    cues: ["腳底向下扎根，頭頂向上延伸。", "膝蓋保持有彈性，不必向後鎖死。"],
    cautions: ["有平衡困難或暈眩時靠近牆面練習。", "不要為了『站直』過度挺胸或夾緊臀部。"],
    regressions: ["雙腳加寬，背靠牆感受堆疊。", "坐在椅子上練習軀幹延伸。"], progressions: ["閉眼短暫停留。", "踮腳或加入手臂上舉。"], props: ["牆", "椅子"], source: { label: "Yoga International · Beginner poses", url: YI }
  },
  {
    id: "chair", zh: "幻椅式", en: "Chair Pose", sanskrit: "Utkatasana", position: "站姿", level: "基礎",
    focus: ["股四頭肌", "臀肌", "核心"], tags: ["強化", "站立", "腿力", "核心", "暖身"],
    summary: "以髖膝屈曲建立下肢耐力與軀幹控制，可作為深蹲及站姿流動的準備。",
    enter: ["從山式開始，吸氣延伸脊柱。", "吐氣時髖部向後、屈膝，重量保留在整個腳掌。", "胸骨延伸，手臂向前或上舉，保持呼吸。"],
    exit: "吸氣踩穩雙腳、伸直雙腿回到山式，再放下手臂。",
    cues: ["想像身後有一張椅子。", "膝蓋朝腳趾方向移動，腳跟維持有重量。"],
    cautions: ["膝部不適時減少屈膝幅度並觀察症狀。", "下背敏感時保持肋骨與骨盆較中立，手臂可不舉高。"],
    regressions: ["臀部輕觸牆或坐向椅面。", "雙手扶髖，縮短停留。"], progressions: ["停留更久或踮腳。", "加入扭轉幻椅式。"], props: ["牆", "椅子", "瑜伽磚"], source: { label: "Yoga Journal · Pose library", url: YJ }
  },
  {
    id: "tree", zh: "樹式", en: "Tree Pose", sanskrit: "Vrksasana", position: "站姿", level: "基礎",
    focus: ["足踝穩定", "臀中肌", "核心"], tags: ["平衡", "單腳", "專注", "髖部", "站立"],
    summary: "經典單腳平衡，訓練足踝、髖部穩定與視覺定點專注。",
    enter: ["從山式把重量移到一腳，站立腿保持有彈性。", "另一腳放在腳踝、小腿或大腿內側，避開直接壓膝關節。", "骨盆朝前，找到固定視點；雙手合十或上舉。"],
    exit: "雙手回到胸前，屈抬起的膝後把腳有控制地放回地面，再換邊。",
    cues: ["站立腳四點均勻扎根。", "腳與腿互相推，讓骨盆中央向上延伸。"],
    cautions: ["平衡不穩或有跌倒風險時務必靠牆或椅。", "抬起的腳不要直接壓在膝關節側面。"],
    regressions: ["腳尖點地、腳跟靠腳踝。", "一手扶牆或椅背。"], progressions: ["手臂上舉或緩慢移動視線。", "在安全環境短暫閉眼。"], props: ["牆", "椅子"], source: { label: "Yoga Journal · Balancing poses", url: "https://www.yogajournal.com/poses/types/balancing/" }
  },
  {
    id: "warrior-two", zh: "戰士二式", en: "Warrior II", sanskrit: "Virabhadrasana II", position: "站姿", level: "基礎",
    focus: ["腿部力量", "臀肌", "髖部活動"], tags: ["強化", "站立", "髖部", "耐力", "胸肩"],
    summary: "寬站姿中結合前腿屈曲、後腿穩定與手臂延伸，建立下肢耐力和方向感。",
    enter: ["雙腳打開約一腿長，前腳轉向短邊，後腳略內扣。", "屈前膝並讓膝蓋朝前腳方向，骨盆與胸口朝側面。", "雙臂向兩側延伸，視線越過前手。"],
    exit: "吸氣伸直前腿，雙腳轉回平行，再換邊或走回山式。",
    cues: ["後腳外側與前腳一起承重。", "肩膀在骨盆上方，雙臂向兩端延伸。"],
    cautions: ["膝或髖不適時縮短站距、減少屈膝。", "頸部敏感時看向側面而非前手。"],
    regressions: ["縮短站距或前臂支撐在前大腿。", "背靠牆確認軀幹堆疊。"], progressions: ["加深前膝屈曲並延長停留。", "轉換到側角式或反戰士。"], props: ["牆", "椅子"], source: { label: "Yoga Journal · Pose library", url: YJ }
  },
  {
    id: "triangle", zh: "三角式", en: "Triangle Pose", sanskrit: "Trikonasana", position: "站姿", level: "基礎",
    focus: ["腿後側", "內收肌", "側腰"], tags: ["伸展", "站立", "腿後側", "髖部", "側彎"],
    summary: "在直腿寬站姿中探索髖部折疊、腿部穩定與軀幹側向延伸。",
    enter: ["雙腳打開，前腳轉向短邊、後腳略內扣，雙腿伸直但不鎖死。", "吸氣向前延伸軀幹，吐氣從髖部折疊。", "下手放小腿、瑜伽磚或椅子，上手向上，胸口保持可呼吸的空間。"],
    exit: "踩穩雙腳，吸氣由上側腰帶領回正，雙腳轉平行。",
    cues: ["延長軀幹兩側，不用追求手碰地。", "前膝蓋與第二腳趾方向大致一致。"],
    cautions: ["腿後側、下背或薦髂關節敏感時減少幅度。", "頸部不適時視線向前或向下。"],
    regressions: ["下手放高瑜伽磚或椅面。", "縮短站距，靠牆練習。"], progressions: ["上手越過耳側延伸。", "由三角式轉入半月式。"], props: ["瑜伽磚", "椅子", "牆"], source: { label: "Yoga Journal · Pose library", url: YJ }
  },
  {
    id: "half-moon", zh: "半月式", en: "Half Moon Pose", sanskrit: "Ardha Chandrasana", position: "站姿", level: "中階",
    focus: ["足踝穩定", "臀中肌", "核心"], tags: ["平衡", "單腳", "強化", "髖部", "站立"],
    summary: "單腳支撐配合骨盆外展與軀幹旋轉，挑戰下肢、側臀和核心的整合。",
    enter: ["從三角式屈前膝，下手落在前腳前外側的瑜伽磚。", "重心前移，後腿抬到約與地面平行。", "站穩後逐步打開骨盆與胸口，上手向上，視線可留在地面。"],
    exit: "屈站立膝，把後腳有控制地送回原處，回到三角式或寬站姿。",
    cues: ["先建立站立腿和下手的支點，再打開胸口。", "後腳跟向後推，頭頂向前延伸。"],
    cautions: ["有跌倒風險、暈眩或急性踝膝傷時避免無支撐練習。", "站立膝不要僵硬鎖死。"],
    regressions: ["背部靠牆、下手放高磚。", "後腳腳趾留在地面做支撐半月。"], progressions: ["視線轉向上手。", "進入束角半月式。"], props: ["牆", "瑜伽磚", "椅子"], source: { label: "Yoga Journal · Balancing poses", url: "https://www.yogajournal.com/poses/types/balancing/" }
  },
  {
    id: "warrior-three", zh: "戰士三式", en: "Warrior III", sanskrit: "Virabhadrasana III", position: "站姿", level: "中階",
    focus: ["臀肌", "腿後側", "核心"], tags: ["平衡", "單腳", "強化", "後鏈", "站立"],
    summary: "軀幹與抬起腿形成長線，訓練單腳平衡、髖部控制和後鏈力量。",
    enter: ["從高弓步把重量移到前腳，手可先扶磚或椅。", "後腳推離地面，同時軀幹向前，髖骨盡量朝地。", "找到穩定後手臂留在身側、向前或合十。"],
    exit: "屈站立膝，後腳緩慢退回弓步，再回山式。",
    cues: ["後腳跟向後、胸骨向前，形成雙向延伸。", "站立腳保持三點承重，骨盆盡量等高。"],
    cautions: ["平衡困難時使用固定支撐並清空周圍。", "下背壓迫感出現時抬高軀幹或降低後腿。"],
    regressions: ["雙手扶牆，身體形成 L 形。", "後腳趾點地做斜板式站姿。"], progressions: ["雙臂向前伸展。", "加入小幅屈伸站立腿。"], props: ["牆", "椅子", "瑜伽磚"], source: { label: "Yoga Journal · Balancing poses", url: "https://www.yogajournal.com/poses/types/balancing/" }
  },
  {
    id: "down-dog", zh: "下犬式", en: "Downward-Facing Dog", sanskrit: "Adho Mukha Svanasana", position: "手臂支撐", level: "基礎",
    focus: ["背部鏈", "肩胛穩定", "腿後側"], tags: ["伸展", "強化", "倒置", "肩部", "腿後側", "全身"],
    summary: "以手腳為基底的倒 V 形，結合脊柱延伸、肩胛穩定與後側鏈伸展。",
    enter: ["四足跪姿，手腕在肩下、膝蓋稍在髖後，手指自然展開。", "吐氣抬膝，把髖部送向後上方；先屈膝以延長脊柱。", "手掌與指根推地，肩頸保持空間；合適時再逐步伸腿。"],
    exit: "吐氣屈膝輕放地面，回四足跪姿或嬰兒式。",
    cues: ["優先把坐骨送高、脊柱拉長，腳跟不必落地。", "手掌均勻推地，耳朵位於上臂之間。"],
    cautions: ["腕、肩疼痛或高血壓、青光眼等需調整時先依專業建議。", "出現手部麻木、暈眩或疼痛應退出。"],
    regressions: ["雙手扶牆做半下犬。", "手放椅背，或在墊上保持屈膝。"], progressions: ["單腿下犬式。", "由下犬式流動到平板式。"], props: ["牆", "椅子", "瑜伽磚"], source: { label: "Yoga International · Beginner poses", url: YI }
  },
  {
    id: "plank", zh: "平板式", en: "Plank Pose", sanskrit: "Phalakasana", position: "手臂支撐", level: "基礎",
    focus: ["核心", "肩胛穩定", "手臂"], tags: ["強化", "核心", "肩部", "手腕", "全身"],
    summary: "全身直線的負重支撐，建立肩帶、軀幹與腿部共同出力。",
    enter: ["從四足跪姿將雙腳依次向後，腳趾踩地。", "肩膀大致在手腕上方，從頭頂到腳跟延伸。", "推開地面、收攏前側肋骨，保持均勻呼吸。"],
    exit: "屈膝回到地面，坐回嬰兒式或回四足跪姿。",
    cues: ["推地讓肩胛骨貼合胸廓。", "大腿向上提，尾骨朝腳跟方向延伸。"],
    cautions: ["手腕、肩部或下背症狀出現時降低負荷或退出。", "不要屏息或讓腰部無控制地下沉。"],
    regressions: ["膝蓋落地。", "前臂撐地或雙手扶牆。"], progressions: ["交替抬腳。", "轉入側平板式。"], props: ["牆", "瑜伽磚", "毛毯"], source: { label: "Yoga Journal · Pose library", url: YJ }
  },
  {
    id: "side-plank", zh: "側平板式", en: "Side Plank", sanskrit: "Vasisthasana", position: "手臂支撐", level: "中階",
    focus: ["側核心", "肩胛穩定", "臀中肌"], tags: ["平衡", "強化", "手臂", "核心", "肩部"],
    summary: "單側手臂與腳支撐，整合肩帶、側軀幹與髖部穩定。",
    enter: ["從平板式把重量移到一手與同側腳外緣。", "雙腳可疊放或前後錯開，上側髖向上提。", "上手放髖或向上延伸，視線可向前。"],
    exit: "上手回地，轉回平板式；膝蓋落地休息後再換邊。",
    cues: ["下手推地，上側髖遠離地面。", "頭、胸廓、骨盆與雙腳保持同一長線。"],
    cautions: ["腕肩不適時改用前臂或膝蓋版本。", "平衡不足時避免雙腳完全疊放。"],
    regressions: ["下膝落地、小腿向後。", "前臂側平板或背靠牆。"], progressions: ["抬上側腿。", "進入樹式腿側平板。"], props: ["牆", "毛毯"], source: { label: "Yoga Journal · Pose library", url: YJ }
  },
  {
    id: "cat-cow", zh: "貓牛式", en: "Cat–Cow", sanskrit: "Marjaryasana–Bitilasana", position: "跪姿", level: "基礎",
    focus: ["脊柱活動", "核心", "胸椎"], tags: ["暖身", "脊柱", "活動度", "呼吸", "四足跪姿"],
    summary: "以呼吸帶動脊柱屈伸的溫和暖身，可用來觀察軀幹各段的活動與控制。",
    enter: ["四足跪姿，手腕在肩下、膝蓋在髖下。", "吸氣坐骨向後、胸口向前上方延伸，進入溫和伸展。", "吐氣推地、腹部向內，脊柱逐段拱起。"],
    exit: "回到中立四足跪姿，再坐向腳跟休息。",
    cues: ["讓呼吸開始動作，幅度保持可控制。", "移動整條脊柱，頸部跟隨而非甩動。"],
    cautions: ["腕膝敏感時增加墊高或改為坐姿。", "脊柱急性疼痛時避免追求大幅度屈伸。"],
    regressions: ["坐椅版本的貓牛式。", "前臂落地以減少手腕負重。"], progressions: ["加入側彎或畫圈。", "抬膝做懸膝貓牛式。"], props: ["毛毯", "瑜伽磚", "椅子"], source: { label: "Yoga International · Beginner poses", url: YI }
  },
  {
    id: "child", zh: "嬰兒式", en: "Child’s Pose", sanskrit: "Balasana", position: "跪姿", level: "基礎",
    focus: ["背部放鬆", "髖部屈曲", "呼吸"], tags: ["休息", "伸展", "髖部", "背部", "恢復"],
    summary: "跪姿前屈的休息選項，提供背部空間並讓呼吸回穩；不一定適合每一雙膝蓋。",
    enter: ["從四足跪姿讓臀部向腳跟方向移動。", "膝蓋可併攏或打開，額頭放向墊面或支撐物。", "手臂向前伸或放在身側，讓肩頸放鬆。"],
    exit: "雙手走回肩下，吸氣抬起軀幹回到跪坐或四足跪姿。",
    cues: ["讓支撐物主動迎接身體。", "把呼吸送往後側肋骨。"],
    cautions: ["膝、踝或髖部不適時不要強迫臀部碰腳跟。", "懷孕或腹部需要空間時加寬雙膝並墊高軀幹。"],
    regressions: ["胸口和額頭放抱枕。", "膝窩夾毛毯，或改為仰臥抱膝。"], progressions: ["手走向單側做側腰伸展。", "延長停留並練習後側呼吸。"], props: ["抱枕", "毛毯", "瑜伽磚"], source: { label: "Yoga International · Beginner poses", url: YI }
  },
  {
    id: "low-lunge", zh: "低弓步", en: "Low Lunge", sanskrit: "Anjaneyasana", position: "跪姿", level: "基礎",
    focus: ["髖屈肌", "股四頭肌", "胸部"], tags: ["伸展", "髖部", "大腿前側", "弓步", "開胸"],
    summary: "前後分腿跪姿，主要探索後腿髖前側伸展與前腿穩定。",
    enter: ["從四足跪姿把一腳踩到雙手之間，前膝大致在腳踝上方。", "後膝放地並墊軟，骨盆向前移到可呼吸的範圍。", "手留在磚上或抬起軀幹，胸骨向上延伸。"],
    exit: "雙手落地，把前腳退回四足跪姿，再換邊。",
    cues: ["前腳完整踩地，後膝有舒適支撐。", "骨盆前移的同時保持下腹有支撐。"],
    cautions: ["前膝或後膝疼痛時縮短站距並加厚墊子。", "下背敏感時避免過度後彎。"],
    regressions: ["雙手扶瑜伽磚或椅座。", "保持軀幹向前、減少骨盆下沉。"], progressions: ["屈後膝做股四頭肌伸展。", "加入溫和側彎或後彎。"], props: ["毛毯", "瑜伽磚", "椅子"], source: { label: "Yoga Journal · Pose library", url: YJ }
  },
  {
    id: "bound-angle", zh: "束角式", en: "Bound Angle Pose", sanskrit: "Baddha Konasana", position: "坐姿", level: "基礎",
    focus: ["內收肌", "髖部活動", "姿勢覺察"], tags: ["伸展", "坐姿", "髖部", "大腿內側", "恢復"],
    summary: "腳掌相對的坐姿髖外旋，探索內側腿與髖部空間。",
    enter: ["坐直後屈膝，雙腳腳掌相對，腳跟與骨盆保持舒適距離。", "雙手扶腳踝或小腿，坐骨均勻落地。", "先延長脊柱；若前傾，從髖部開始並保留背部長度。"],
    exit: "雙手托住大腿外側讓膝蓋合回，再把雙腿向前伸直。",
    cues: ["把高度帶入坐骨下方，讓骨盆較容易直立。", "膝蓋自然下沉，不用用手向下壓。"],
    cautions: ["髖、腹股溝或膝部疼痛時增加支撐或退出。", "不要為追求膝蓋貼地而彈壓。"],
    regressions: ["坐在摺疊毛毯上，膝下放磚。", "雙腳離骨盆更遠。"], progressions: ["保持長脊柱向前折疊。", "進入仰臥束角式。"], props: ["毛毯", "瑜伽磚", "抱枕"], source: { label: "Yoga Journal · Pose library", url: YJ }
  },
  {
    id: "boat", zh: "船式", en: "Boat Pose", sanskrit: "Paripurna Navasana", position: "坐姿", level: "中階",
    focus: ["核心", "髖屈肌", "脊柱穩定"], tags: ["強化", "坐姿", "核心", "平衡", "耐力"],
    summary: "以坐骨為基底的軀幹與腿部平衡，訓練核心控制和髖屈肌耐力。",
    enter: ["坐姿屈膝、腳踩地，雙手扶大腿後側。", "胸口抬起，身體稍向後傾，保持脊柱延伸。", "逐一抬腳讓小腿平行地面；穩定後可放開雙手。"],
    exit: "吐氣屈膝、腳掌有控制地回地，坐直休息。",
    cues: ["胸骨向上，肚臍向內，不用憋氣。", "保持背部長度比伸直膝蓋更重要。"],
    cautions: ["下背或髖前側有壓迫感時把腳放回地面。", "懷孕、近期腹部手術或疝氣等情況應依醫療專業建議調整。"],
    regressions: ["腳尖點地或雙手留在大腿後側。", "背部靠牆、縮短停留。"], progressions: ["逐步伸直雙腿。", "高船式與低船式之間控制移動。"], props: ["牆", "瑜伽帶"], source: { label: "Yoga Journal · Pose library", url: YJ }
  },
  {
    id: "sphinx", zh: "人面獅身式", en: "Sphinx Pose", sanskrit: "Salamba Bhujangasana", position: "俯臥", level: "基礎",
    focus: ["胸椎伸展", "胸部", "腹部前側"], tags: ["後彎", "伸展", "開胸", "俯臥", "脊柱"],
    summary: "前臂支撐的溫和俯臥後彎，著重胸椎延伸與胸前側開展。",
    enter: ["俯臥、雙腿向後延伸，前臂放地，肘部約在肩下或稍前。", "前臂推地，胸骨向前上方延伸。", "下腹與骨盆保留接觸，肩膀遠離耳朵。"],
    exit: "吐氣降低胸口，額頭放在交疊手臂上休息。",
    cues: ["想像胸骨向前，而不是把腰擠向下。", "前臂向後拉、胸口向前延伸。"],
    cautions: ["下背疼痛或懷孕時避免俯臥後彎。", "手臂麻木或肩頸壓迫時降低高度。"],
    regressions: ["肘部向前移，降低後彎角度。", "胸下墊薄毛毯。"], progressions: ["眼鏡蛇式。", "加入單腿屈膝。"], props: ["毛毯", "抱枕"], source: { label: "Yoga Journal · Pose library", url: YJ }
  },
  {
    id: "bridge", zh: "橋式", en: "Bridge Pose", sanskrit: "Setu Bandha Sarvangasana", position: "仰臥", level: "基礎",
    focus: ["臀肌", "腿後側", "胸椎伸展"], tags: ["強化", "後彎", "開胸", "仰臥", "臀部"],
    summary: "仰臥抬髖，建立臀腿後側力量，同時探索胸前側開展。",
    enter: ["仰臥屈膝、腳掌約髖寬踩地，腳跟靠近坐骨但保持舒適。", "吐氣踩腳，逐步抬起骨盆與軀幹。", "大腿保持大致平行，手臂壓地；頸部保持中立。"],
    exit: "吐氣從上背到骨盆逐步回到地面，雙膝可相靠休息。",
    cues: ["雙腳向下踩，膝蓋朝腳趾方向延伸。", "抬起胸骨，而不是把重量推到頭頸。"],
    cautions: ["停留時不要轉頭。", "頸肩、腰部不適或無法順暢呼吸時降低高度並退出。"],
    regressions: ["骨盆下放瑜伽磚做支撐橋式。", "只抬到舒適高度並縮短停留。"], progressions: ["雙手在背後交扣。", "穩定後交替抬腳做單腿橋式準備。"], props: ["瑜伽磚", "瑜伽帶", "毛毯"], source: { label: "Yoga Journal · Pose library", url: YJ }
  },
  {
    id: "supine-twist", zh: "仰臥扭轉", en: "Supine Twist", sanskrit: "Supta Matsyendrasana", position: "仰臥", level: "基礎",
    focus: ["胸椎旋轉", "臀部", "側腰"], tags: ["伸展", "扭轉", "仰臥", "恢復", "脊柱"],
    summary: "在地面支撐下探索軀幹旋轉，常放在課程後段做緩和與左右整合。",
    enter: ["仰臥屈膝、腳踩地，雙臂向兩側打開。", "膝蓋靠攏後緩慢倒向一側，可在腿下加支撐。", "肩膀保持舒適接地，視線朝上或反方向。"],
    exit: "吐氣收攏腹部，雙膝回到中央，再換邊。",
    cues: ["讓腿落在支撐物上，不用把膝蓋壓到地面。", "每次吐氣觀察胸廓是否能柔和旋轉。"],
    cautions: ["椎間盤、脊柱或薦髂關節症狀者依專業建議調整。", "孕期避免長時間平躺，並使用側躺或墊高版本。"],
    regressions: ["膝下放抱枕，縮小旋轉角度。", "只讓雙膝左右小幅擺動。"], progressions: ["上側腿伸直並用瑜伽帶支撐。", "延長停留並加入側肋呼吸。"], props: ["抱枕", "瑜伽磚", "毛毯"], source: { label: "Yoga Journal · Pose library", url: YJ }
  },
  {
    id: "corpse", zh: "大休息式", en: "Corpse Pose", sanskrit: "Savasana", position: "仰臥", level: "基礎",
    focus: ["全身放鬆", "呼吸", "整合"], tags: ["休息", "恢復", "仰臥", "冥想", "課程收尾"],
    summary: "以充分支撐的靜止姿勢整合練習；舒適與安全比固定外形更重要。",
    enter: ["坐在墊上，側身後有控制地躺下。", "雙腿與手臂放到舒適寬度，手心可向上或向內。", "調整頭頸、膝蓋與溫度支撐，讓呼吸回到自然。"],
    exit: "加深呼吸、活動手腳，屈膝後側躺停留，再用手推地慢慢坐起。",
    cues: ["讓地面承接重量，不必刻意改變呼吸。", "若靜止並不舒適，可以調整、側躺或保持眼睛張開。"],
    cautions: ["孕期或仰臥不適時改為側躺或墊高上半身。", "下背不適時在膝下墊抱枕；注意保暖與起身暈眩。"],
    regressions: ["小腿放椅面做建設性休息。", "側躺大休息式。"], progressions: ["延長停留並加入身體掃描。", "加入非控制性的自然呼吸覺察。"], props: ["抱枕", "毛毯", "眼枕", "椅子"], source: { label: "Yoga Journal · Pose library", url: YJ }
  }
];

type ExtraPose = Pick<PoseGuide, "id" | "zh" | "en" | "sanskrit" | "position" | "level" | "focus" | "tags" | "summary"> & Partial<Pick<PoseGuide, "enter" | "exit" | "cues" | "cautions" | "regressions" | "progressions" | "props" | "traditions" | "source">>;

const POSITION_GUIDANCE: Record<PosePosition, Pick<PoseGuide, "enter" | "exit" | "cues" | "cautions" | "regressions" | "progressions" | "props">> = {
  "站姿": { enter: ["從山式建立雙腳承重，再依體式方向調整站距。", "先找到骨盆與胸廓的堆疊，再逐步加入腿部、手臂與視線。", "保持呼吸可控，在穩定範圍停留。"], exit: "先縮小動作幅度、回正視線，踩穩雙腳後回到山式。", cues: ["從腳底建立方向，讓脊柱保持延伸。", "關節不鎖死，保留能平順退出的空間。"], cautions: ["平衡不穩時靠牆或椅練習。", "膝、髖或足踝出現疼痛時縮小幅度或退出。"], regressions: ["縮短站距並使用牆面。", "雙手扶椅或瑜伽磚。"], progressions: ["延長停留或加入視線變化。", "在控制下增加活動幅度。"], props: ["牆", "椅子", "瑜伽磚"] },
  "坐姿": { enter: ["坐在墊面或摺疊毛毯上，先讓坐骨均勻承重。", "依體式屈伸或打開雙腿，膝蓋保持有支撐。", "吸氣延長脊柱，再進入折疊、扭轉或平衡。"], exit: "回到軀幹中立，以雙手協助雙腿回正，再伸腿休息。", cues: ["先創造脊柱長度，再增加體式幅度。", "讓髖部移動，不用以膝蓋代償。"], cautions: ["髖、膝或下背不適時墊高骨盆並減少幅度。", "不要以彈震或拉扯進入更深位置。"], regressions: ["坐高並屈膝。", "使用瑜伽帶或在膝下放支撐。"], progressions: ["在脊柱保持長度下增加幅度。", "延長停留並配合均勻呼吸。"], props: ["毛毯", "瑜伽帶", "瑜伽磚"] },
  "跪姿": { enter: ["從四足跪姿開始，手腕、膝蓋與髖部先找到舒適支撐。", "依體式移動骨盆或軀幹，動作保持緩慢。", "以穩定呼吸確認目前幅度。"], exit: "雙手回到肩下，骨盆回正，坐向腳跟或回四足跪姿休息。", cues: ["讓支撐點均勻承重。", "以胸骨和骨盆的方向帶動，而非擠壓關節。"], cautions: ["腕膝敏感時增加襯墊或改用椅子版本。", "出現尖銳疼痛、麻木或暈眩時退出。"], regressions: ["膝下墊毛毯並減少活動幅度。", "前臂或雙手放在較高支撐面。"], progressions: ["延長停留或減少手部支撐。", "在控制下加入側彎或後彎。"], props: ["毛毯", "椅子", "瑜伽磚"] },
  "俯臥": { enter: ["俯臥並把雙腿向後延伸，額頭先得到支撐。", "啟動腿部與下腹，再逐步抬起胸口或四肢。", "頸部延續脊柱方向，保持均勻呼吸。"], exit: "吐氣有控制地降低身體，額頭放在手臂上休息。", cues: ["胸骨向前延伸，避免只從腰部擠壓。", "腿部向後延伸，讓後彎分布更平均。"], cautions: ["懷孕或腹部、腰椎急性症狀時避免俯臥練習。", "下背壓迫或呼吸不順時降低高度。"], regressions: ["降低抬起高度並縮短停留。", "在胸骨或骨盆下使用薄毛毯。"], progressions: ["延長停留或加入手臂變化。", "在無壓迫感下增加後彎幅度。"], props: ["毛毯", "瑜伽帶", "抱枕"] },
  "仰臥": { enter: ["由側身有控制地躺下，調整頭頸與骨盆位置。", "依體式屈伸雙腿或加入輔具，保持肩頸放鬆。", "在自然呼吸下逐步進入動作。"], exit: "把動作幅度縮小並回到中立，屈膝側躺後再慢慢起身。", cues: ["讓地面承接重量，臉部與呼吸保持柔和。", "只進入能保持骨盆和脊柱舒適的位置。"], cautions: ["孕期或仰臥不適者使用墊高或側躺版本。", "頸背症狀、暈眩或呼吸困難時退出。"], regressions: ["膝下放抱枕或小腿放椅面。", "減少腿部伸展與停留時間。"], progressions: ["延長停留或增加腿部活動。", "在穩定下加入核心控制。"], props: ["抱枕", "毛毯", "瑜伽帶"] },
  "手臂支撐": { enter: ["從四足跪姿建立手掌或前臂支撐，手指均勻展開。", "推開地面並穩定肩胛，再逐步轉移重量。", "保持視線穩定與連續呼吸。"], exit: "有控制地把腳或膝蓋放回地面，進入四足跪姿或嬰兒式。", cues: ["推地讓肩胛穩定貼合胸廓。", "先保持呼吸與肩頸空間，再考慮抬高雙腳。"], cautions: ["腕、肘、肩或頸部症狀時降低負重或避免。", "倒置和高階平衡需在合格老師指導與安全環境下練習。"], regressions: ["膝蓋落地或改用前臂。", "使用牆面、瑜伽磚或椅子分擔重量。"], progressions: ["延長停留或逐步減少支撐。", "僅在根基穩定時進入完整平衡。"], props: ["牆", "瑜伽磚", "毛毯"] }
};

function completePose(pose: ExtraPose): PoseGuide {
  const guide = POSITION_GUIDANCE[pose.position];
  const tailored = {
    enter: [
      `先建立穩定的${pose.position}起始位置，準備進入${pose.zh}（${pose.sanskrit}）。`,
      `${pose.summary} 依自己的活動範圍逐步完成動作，不以末端幅度為目標。`,
      `停留時依序檢查${pose.focus.join("、")}，確認呼吸仍然連續。`
    ],
    exit: `先減少${pose.zh}的動作幅度，穩定支撐點與視線，再循原路回到中立位置。`,
    cues: [`在${pose.focus[0]}建立穩定，再延伸${pose.focus[1] ?? "脊柱"}。`, `保持能順暢呼吸與退出的${pose.zh}版本。`]
  };
  return { ...guide, ...tailored, traditions: ["哈達"], source: { label: "Yoga Journal · Pose library", url: YJ }, ...pose };
}

const ASHTANGA = { label: "Ashtanga Primary Series · complete guide", url: "https://ashtanga.yoga/primary-series" };
const IYENGAR = { label: "Iyengar Yoga · Level I curriculum", url: "https://iyengar.hu/wp-content/uploads/2017/11/Curriculum-Level-I.pdf" };

const ADDITIONAL_POSES: PoseGuide[] = [
  completePose({ id: "upward-hands", zh: "上舉手式", en: "Upward Hands Pose", sanskrit: "Urdhva Hastasana", position: "站姿", level: "基礎", focus: ["肩部活動", "側腰", "姿勢覺察"], tags: ["伸展", "站立", "暖身", "拜日式"], summary: "由山式向上延伸雙臂，是拜日式中建立呼吸與全身延展的基礎動作。", traditions: ["Ashtanga", "愛揚格", "哈達"], source: ASHTANGA }),
  completePose({ id: "standing-forward-fold", zh: "站立前屈式", en: "Standing Forward Bend", sanskrit: "Uttanasana", position: "站姿", level: "基礎", focus: ["腿後側", "背部", "髖部"], tags: ["伸展", "前屈", "站立", "拜日式"], summary: "從髖部折疊的站姿前彎，伸展身體後側並連接拜日式動作。", traditions: ["Ashtanga", "愛揚格", "哈達"], source: ASHTANGA }),
  completePose({ id: "half-forward-fold", zh: "半站立前屈式", en: "Half Forward Bend", sanskrit: "Ardha Uttanasana", position: "站姿", level: "基礎", focus: ["背部伸展", "核心", "腿後側"], tags: ["伸展", "站立", "拜日式", "脊柱"], summary: "以前傾長脊柱連接前屈與支撐動作，訓練軀幹延伸和髖部折疊。", traditions: ["Ashtanga", "愛揚格"], source: ASHTANGA }),
  completePose({ id: "extended-hand-to-toe", zh: "手抓腳趾伸展式", en: "Extended Hand-to-Big-Toe Pose", sanskrit: "Utthita Hasta Padangusthasana", position: "站姿", level: "中階", focus: ["平衡", "腿後側", "髖部"], tags: ["平衡", "單腳", "伸展", "站立"], summary: "單腳站立並伸展另一腿，整合平衡、腿後側活動與骨盆控制。", traditions: ["Ashtanga", "愛揚格"], source: ASHTANGA }),
  completePose({ id: "eagle", zh: "鷹式", en: "Eagle Pose", sanskrit: "Garudasana", position: "站姿", level: "中階", focus: ["平衡", "外側髖", "肩胛"], tags: ["平衡", "單腳", "肩部", "髖部"], summary: "手腳交纏的單腳平衡，訓練專注、髖部穩定並伸展上背。", traditions: ["愛揚格", "哈達"], source: IYENGAR }),
  completePose({ id: "dancer", zh: "舞王式", en: "Dancer Pose", sanskrit: "Natarajasana", position: "站姿", level: "中階", focus: ["平衡", "大腿前側", "開胸"], tags: ["平衡", "後彎", "單腳", "站立"], summary: "結合單腳平衡、股四頭肌伸展與後彎的站姿。", traditions: ["愛揚格", "哈達"], source: IYENGAR }),
  completePose({ id: "warrior-one", zh: "戰士一式", en: "Warrior I", sanskrit: "Virabhadrasana I", position: "站姿", level: "基礎", focus: ["腿部力量", "髖屈肌", "胸部"], tags: ["強化", "弓步", "開胸", "站立"], summary: "前後分腿並抬起軀幹，建立腿部力量、髖前側延展與胸口上提。", traditions: ["Ashtanga", "愛揚格", "哈達"], source: ASHTANGA }),
  completePose({ id: "reverse-warrior", zh: "反戰士式", en: "Reverse Warrior", sanskrit: "Viparita Virabhadrasana", position: "站姿", level: "基礎", focus: ["側腰", "腿部力量", "胸部"], tags: ["伸展", "側彎", "站立", "髖部"], summary: "在戰士二式腿部基礎上加入側彎，延展軀幹側面並維持下肢耐力。" }),
  completePose({ id: "extended-side-angle", zh: "側角伸展式", en: "Extended Side Angle", sanskrit: "Utthita Parsvakonasana", position: "站姿", level: "基礎", focus: ["腿部力量", "側腰", "髖部"], tags: ["強化", "伸展", "側彎", "站立"], summary: "前腿屈曲與全身斜線延展並行，訓練下肢與側軀幹。", traditions: ["Ashtanga", "愛揚格"], source: ASHTANGA }),
  completePose({ id: "revolved-triangle", zh: "扭轉三角式", en: "Revolved Triangle", sanskrit: "Parivrtta Trikonasana", position: "站姿", level: "中階", focus: ["胸椎旋轉", "腿後側", "平衡"], tags: ["扭轉", "平衡", "伸展", "站立"], summary: "窄站距前屈結合軀幹旋轉，需要腿部穩定與胸椎活動。", traditions: ["Ashtanga", "愛揚格"], source: ASHTANGA }),
  completePose({ id: "pyramid", zh: "金字塔式", en: "Pyramid Pose", sanskrit: "Parsvottanasana", position: "站姿", level: "基礎", focus: ["腿後側", "小腿", "髖部"], tags: ["伸展", "前屈", "站立", "腿後側"], summary: "前後站姿中的髖部折疊，集中伸展前腿後側並訓練骨盆方向。", traditions: ["Ashtanga", "愛揚格"], source: ASHTANGA }),
  completePose({ id: "wide-forward-fold", zh: "雙角式", en: "Wide-Legged Forward Bend", sanskrit: "Prasarita Padottanasana", position: "站姿", level: "基礎", focus: ["腿後側", "內收肌", "背部"], tags: ["伸展", "前屈", "寬站姿", "倒置"], summary: "寬站姿前屈，伸展大腿內後側並讓脊柱向地面延伸。", traditions: ["Ashtanga", "愛揚格"], source: ASHTANGA }),
  completePose({ id: "garland", zh: "花環式", en: "Garland Pose", sanskrit: "Malasana", position: "站姿", level: "基礎", focus: ["踝部活動", "髖部", "內收肌"], tags: ["深蹲", "伸展", "髖部", "站立"], summary: "深蹲姿勢探索髖、膝與踝的屈曲活動，可使用支撐保持脊柱延伸。", traditions: ["愛揚格", "哈達"], source: IYENGAR }),
  completePose({ id: "staff", zh: "手杖式", en: "Staff Pose", sanskrit: "Dandasana", position: "坐姿", level: "基礎", focus: ["姿勢覺察", "核心", "腿部"], tags: ["坐姿", "強化", "根基", "體態"], summary: "雙腿前伸的基礎坐姿，建立坐骨承重、腿部啟動與脊柱堆疊。", traditions: ["Ashtanga", "愛揚格"], source: ASHTANGA }),
  completePose({ id: "easy-seat", zh: "簡易坐", en: "Easy Pose", sanskrit: "Sukhasana", position: "坐姿", level: "基礎", focus: ["髖部", "姿勢覺察", "呼吸"], tags: ["坐姿", "冥想", "呼吸", "恢復"], summary: "交叉腿坐姿，適合呼吸、靜心與課程開始或結束。" }),
  completePose({ id: "hero", zh: "英雄坐", en: "Hero Pose", sanskrit: "Virasana", position: "坐姿", level: "基礎", focus: ["股四頭肌", "踝部", "姿勢覺察"], tags: ["坐姿", "伸展", "大腿前側", "冥想"], summary: "跪坐姿勢延展大腿前側與足踝，可透過墊高骨盆調整膝部負荷。", traditions: ["愛揚格", "哈達"], source: IYENGAR }),
  completePose({ id: "lotus", zh: "蓮花式", en: "Lotus Pose", sanskrit: "Padmasana", position: "坐姿", level: "進階", focus: ["髖部外旋", "姿勢覺察", "呼吸"], tags: ["坐姿", "髖部", "冥想", "Ashtanga"], summary: "需要充分髖外旋的經典冥想坐姿，不應以膝關節代償進入。", cautions: ["膝、踝或髖部敏感者避免；不可用手強壓膝蓋。", "先具備舒適的半蓮花與髖外旋，再在合格老師指導下練習。"], regressions: ["簡易坐或半蓮花。", "坐高並支撐雙膝。"], traditions: ["Ashtanga", "愛揚格", "哈達"], source: ASHTANGA }),
  completePose({ id: "cow-face", zh: "牛面式", en: "Cow Face Pose", sanskrit: "Gomukhasana", position: "坐姿", level: "中階", focus: ["外側髖", "肩部", "肱三頭肌"], tags: ["伸展", "坐姿", "髖部", "肩部"], summary: "上下交疊雙腿配合背後扣手，同時探索髖與肩部活動。", traditions: ["愛揚格", "哈達"], source: IYENGAR }),
  completePose({ id: "seated-forward-fold", zh: "坐姿前屈式", en: "Seated Forward Bend", sanskrit: "Paschimottanasana", position: "坐姿", level: "基礎", focus: ["腿後側", "背部", "髖部"], tags: ["伸展", "前屈", "坐姿", "腿後側"], summary: "雙腿前伸的髖部折疊，探索整體後側鏈延展。", traditions: ["Ashtanga", "愛揚格"], source: ASHTANGA }),
  completePose({ id: "head-to-knee", zh: "頭碰膝式", en: "Head-to-Knee Pose", sanskrit: "Janu Sirsasana", position: "坐姿", level: "基礎", focus: ["腿後側", "內收肌", "背部"], tags: ["伸展", "前屈", "坐姿", "單腿"], summary: "單腿伸直的坐姿前屈，結合髖部方向與腿後側伸展。", traditions: ["Ashtanga", "愛揚格"], source: ASHTANGA }),
  completePose({ id: "wide-seated-fold", zh: "坐角式", en: "Wide-Angle Seated Forward Bend", sanskrit: "Upavistha Konasana", position: "坐姿", level: "基礎", focus: ["內收肌", "腿後側", "髖部"], tags: ["伸展", "坐姿", "寬腿", "前屈"], summary: "寬腿坐姿中建立內側腿伸展與骨盆前傾控制。", traditions: ["Ashtanga", "愛揚格"], source: ASHTANGA }),
  completePose({ id: "half-lord-fishes", zh: "半魚王式", en: "Half Lord of the Fishes", sanskrit: "Ardha Matsyendrasana", position: "坐姿", level: "中階", focus: ["胸椎旋轉", "臀部", "姿勢覺察"], tags: ["扭轉", "坐姿", "脊柱", "髖部"], summary: "坐姿脊柱扭轉，從坐骨根基向上建立胸椎旋轉。", traditions: ["愛揚格", "哈達"], source: IYENGAR }),
  completePose({ id: "marichyasana-c", zh: "聖哲瑪里琪三式", en: "Marichi’s Pose C", sanskrit: "Marichyasana C", position: "坐姿", level: "中階", focus: ["胸椎旋轉", "髖部", "核心"], tags: ["扭轉", "坐姿", "Ashtanga", "脊柱"], summary: "一腿屈曲的坐姿扭轉，是 Ashtanga 初級序列的重要旋轉體式。", traditions: ["Ashtanga"], source: ASHTANGA }),
  completePose({ id: "scale", zh: "天秤式", en: "Scale Pose", sanskrit: "Tolasana", position: "手臂支撐", level: "進階", focus: ["手臂", "核心", "髖部"], tags: ["手臂平衡", "強化", "Ashtanga", "核心"], summary: "以雙手推地抬起交叉腿或蓮花坐，強化肩帶、手臂與核心。", traditions: ["Ashtanga"], source: ASHTANGA }),
  completePose({ id: "cobra", zh: "眼鏡蛇式", en: "Cobra Pose", sanskrit: "Bhujangasana", position: "俯臥", level: "基礎", focus: ["胸椎伸展", "背肌", "胸部"], tags: ["後彎", "開胸", "俯臥", "脊柱"], summary: "手掌輕支撐的俯臥後彎，以背肌參與和胸骨前伸為主。", traditions: ["愛揚格", "哈達"], source: IYENGAR }),
  completePose({ id: "up-dog", zh: "上犬式", en: "Upward-Facing Dog", sanskrit: "Urdhva Mukha Svanasana", position: "手臂支撐", level: "中階", focus: ["手臂", "背肌", "胸部"], tags: ["後彎", "強化", "開胸", "拜日式"], summary: "手腳支撐、軀幹離地的後彎，是 Ashtanga 拜日式和 vinyasa 的核心動作。", traditions: ["Ashtanga", "愛揚格"], source: ASHTANGA }),
  completePose({ id: "locust", zh: "蝗蟲式", en: "Locust Pose", sanskrit: "Salabhasana", position: "俯臥", level: "基礎", focus: ["背肌", "臀肌", "腿後側"], tags: ["強化", "後彎", "後鏈", "俯臥"], summary: "不依賴手臂推地的主動後彎，強化背部、臀部與腿後側。", traditions: ["愛揚格", "哈達"], source: IYENGAR }),
  completePose({ id: "bow", zh: "弓式", en: "Bow Pose", sanskrit: "Dhanurasana", position: "俯臥", level: "中階", focus: ["背肌", "胸部", "大腿前側"], tags: ["後彎", "伸展", "俯臥", "開胸"], summary: "雙手抓腳踝形成弓形，結合主動後彎與大腿前側伸展。", traditions: ["愛揚格", "哈達"], source: IYENGAR }),
  completePose({ id: "frog", zh: "青蛙式", en: "Frog Pose", sanskrit: "Bhekasana", position: "俯臥", level: "進階", focus: ["股四頭肌", "髖屈肌", "胸部"], tags: ["後彎", "伸展", "大腿前側", "俯臥"], summary: "深度屈膝的俯臥後彎，需要充分膝踝活動與循序準備。", cautions: ["膝、踝、髖或下背不適者避免。", "不可強壓腳掌；應在專業指導下逐步練習。"], traditions: ["愛揚格", "哈達"], source: IYENGAR }),
  completePose({ id: "camel", zh: "駱駝式", en: "Camel Pose", sanskrit: "Ustrasana", position: "跪姿", level: "中階", focus: ["大腿前側", "胸部", "髖屈肌"], tags: ["後彎", "開胸", "跪姿", "伸展"], summary: "高跪姿後彎，結合大腿穩定、髖前側延展與胸椎伸展。", traditions: ["愛揚格", "哈達"], source: IYENGAR }),
  completePose({ id: "gate", zh: "門閂式", en: "Gate Pose", sanskrit: "Parighasana", position: "跪姿", level: "基礎", focus: ["側腰", "內收肌", "腿後側"], tags: ["側彎", "伸展", "跪姿", "髖部"], summary: "一腿側伸的跪姿側彎，延展側腰與伸直腿內側。", traditions: ["愛揚格", "哈達"], source: IYENGAR }),
  completePose({ id: "puppy", zh: "融心式", en: "Extended Puppy Pose", sanskrit: "Uttana Shishosana", position: "跪姿", level: "基礎", focus: ["肩部", "胸部", "背部"], tags: ["伸展", "開胸", "跪姿", "肩部"], summary: "髖部留在膝上、胸口向地面延伸，集中打開肩部與胸椎。" }),
  completePose({ id: "tiger", zh: "虎式", en: "Tiger Pose", sanskrit: "Vyaghrasana", position: "跪姿", level: "基礎", focus: ["核心", "臀肌", "肩胛穩定"], tags: ["平衡", "強化", "四足跪姿", "核心"], summary: "四足跪姿中伸展對側手腳，訓練軀幹抗旋轉與髖肩穩定。" }),
  completePose({ id: "happy-baby", zh: "快樂嬰兒式", en: "Happy Baby", sanskrit: "Ananda Balasana", position: "仰臥", level: "基礎", focus: ["髖部", "內收肌", "下背"], tags: ["伸展", "仰臥", "髖部", "恢復"], summary: "仰臥屈髖屈膝，以手支撐腿部探索髖關節空間。" }),
  completePose({ id: "reclined-hand-to-toe", zh: "仰臥手抓腳趾式", en: "Reclining Hand-to-Big-Toe", sanskrit: "Supta Padangusthasana", position: "仰臥", level: "基礎", focus: ["腿後側", "小腿", "髖部"], tags: ["伸展", "仰臥", "腿後側", "單腿"], summary: "在仰臥支撐下伸展單腿後側，較容易維持骨盆與脊柱中立。", traditions: ["Ashtanga", "愛揚格"], source: ASHTANGA }),
  completePose({ id: "knees-to-chest", zh: "抱膝式", en: "Knees-to-Chest Pose", sanskrit: "Apanasana", position: "仰臥", level: "基礎", focus: ["下背", "臀部", "呼吸"], tags: ["恢復", "仰臥", "背部", "暖身"], summary: "仰臥抱膝的溫和動作，可用於觀察下背與髖部舒適度。", traditions: ["愛揚格", "哈達"], source: IYENGAR }),
  completePose({ id: "legs-up-wall", zh: "靠牆抬腿式", en: "Legs-Up-the-Wall", sanskrit: "Viparita Karani", position: "仰臥", level: "基礎", focus: ["全身放鬆", "腿部", "呼吸"], tags: ["恢復", "倒置", "仰臥", "休息"], summary: "以牆面支撐雙腿的恢復性倒置，減少肌肉用力並便於休息。", traditions: ["愛揚格", "修復"], source: IYENGAR }),
  completePose({ id: "fish", zh: "魚式", en: "Fish Pose", sanskrit: "Matsyasana", position: "仰臥", level: "中階", focus: ["胸部", "胸椎伸展", "頸部"], tags: ["後彎", "開胸", "仰臥", "Ashtanga"], summary: "仰臥胸椎後彎，是 Ashtanga 收尾序列中的肩倒立反向體式。", traditions: ["Ashtanga", "愛揚格"], source: ASHTANGA }),
  completePose({ id: "plow", zh: "犁式", en: "Plow Pose", sanskrit: "Halasana", position: "仰臥", level: "進階", focus: ["背部", "肩部", "腿後側"], tags: ["倒置", "伸展", "仰臥", "Ashtanga"], summary: "雙腿越過頭部的肩部倒置，需要充分準備、頸肩支撐與專業監督。", cautions: ["頸椎、肩部、高血壓、青光眼或其他倒置禁忌者避免。", "不可在姿勢中轉頭；初學者應由合格老師指導。"], traditions: ["Ashtanga", "愛揚格"], source: ASHTANGA }),
  completePose({ id: "shoulderstand", zh: "肩倒立式", en: "Supported Shoulderstand", sanskrit: "Salamba Sarvangasana", position: "仰臥", level: "進階", focus: ["肩帶穩定", "核心", "全身整合"], tags: ["倒置", "平衡", "仰臥", "Ashtanga"], summary: "以肩與上臂支撐的倒置，對頸肩承重與動作控制要求高。", cautions: ["頸椎、肩部、高血壓、青光眼、骨質疏鬆或其他倒置禁忌者避免。", "不可在姿勢中轉頭；需有合格老師與適當肩部墊高。"], traditions: ["Ashtanga", "愛揚格"], source: ASHTANGA }),
  completePose({ id: "chaturanga", zh: "四柱支撐式", en: "Four-Limbed Staff Pose", sanskrit: "Chaturanga Dandasana", position: "手臂支撐", level: "中階", focus: ["手臂", "胸肌", "核心"], tags: ["強化", "手臂支撐", "拜日式", "Ashtanga"], summary: "低位平板支撐，是 Ashtanga vinyasa 的關鍵轉換並需要肩胛與核心控制。", traditions: ["Ashtanga"], source: ASHTANGA }),
  completePose({ id: "crow", zh: "烏鴉式", en: "Crow Pose", sanskrit: "Bakasana", position: "手臂支撐", level: "中階", focus: ["手臂", "核心", "平衡"], tags: ["手臂平衡", "強化", "核心", "平衡"], summary: "雙膝支撐於上臂的手臂平衡，訓練重心前移與全身協調。" }),
  completePose({ id: "forearm-plank", zh: "前臂平板式", en: "Forearm Plank", sanskrit: "Makara Adho Mukha Svanasana", position: "手臂支撐", level: "基礎", focus: ["核心", "肩胛穩定", "手臂"], tags: ["強化", "核心", "前臂", "全身"], summary: "以前臂支撐的平板體式，減少手腕角度並訓練軀幹穩定。" }),
  completePose({ id: "dolphin", zh: "海豚式", en: "Dolphin Pose", sanskrit: "Ardha Pincha Mayurasana", position: "手臂支撐", level: "中階", focus: ["肩部", "手臂", "腿後側"], tags: ["強化", "倒置", "肩部", "前臂"], summary: "前臂支撐的倒 V 形，是前臂倒立的肩帶力量與活動度準備。" }),
  completePose({ id: "forearm-stand", zh: "前臂倒立式", en: "Forearm Stand", sanskrit: "Pincha Mayurasana", position: "手臂支撐", level: "進階", focus: ["肩部", "核心", "平衡"], tags: ["倒置", "手臂平衡", "強化", "進階"], summary: "以前臂與肘部為基底的全身倒置，需要成熟的肩帶穩定與跌落策略。", cautions: ["肩、肘、頸部症狀，高血壓、青光眼或其他倒置禁忌者避免。", "僅在合格老師指導、牆面與安全落地空間下練習。"], traditions: ["愛揚格", "Ashtanga"], source: IYENGAR }),
  completePose({ id: "headstand", zh: "頭倒立式", en: "Supported Headstand", sanskrit: "Salamba Sirsasana", position: "手臂支撐", level: "進階", focus: ["肩帶穩定", "核心", "平衡"], tags: ["倒置", "平衡", "進階", "Ashtanga"], summary: "以前臂、頭部與肩帶共同建立的倒置，必須先具備充分支撐能力。", cautions: ["頸椎、肩部、高血壓、青光眼、骨質疏鬆或其他倒置禁忌者避免。", "不適合自行嘗試；需由合格老師評估並指導。"], traditions: ["Ashtanga", "愛揚格"], source: ASHTANGA }),
  completePose({ id: "handstand", zh: "手倒立式", en: "Handstand", sanskrit: "Adho Mukha Vrksasana", position: "手臂支撐", level: "進階", focus: ["肩部", "手臂", "核心"], tags: ["倒置", "手臂平衡", "平衡", "進階"], summary: "以雙手為基底的全身倒置，要求腕肩承重、核心控制與安全落地能力。", cautions: ["腕、肩、頸部症狀，高血壓、青光眼或其他倒置禁忌者避免。", "只在專業指導與安全空間中練習，不以踢牆代替控制。"], traditions: ["愛揚格", "Ashtanga"], source: IYENGAR }),
  completePose({ id: "upward-plank", zh: "反平板式", en: "Upward Plank", sanskrit: "Purvottanasana", position: "手臂支撐", level: "中階", focus: ["後鏈", "手臂", "胸部"], tags: ["強化", "後彎", "手臂支撐", "Ashtanga"], summary: "手腳支撐並向上抬起身體前側，強化後鏈並延展胸肩。", traditions: ["Ashtanga", "愛揚格"], source: ASHTANGA }),
  completePose({ id: "firefly", zh: "螢火蟲式", en: "Firefly Pose", sanskrit: "Tittibhasana", position: "手臂支撐", level: "進階", focus: ["手臂", "核心", "腿後側"], tags: ["手臂平衡", "強化", "平衡", "進階"], summary: "雙腿伸展越過上臂的高階平衡，需要髖部活動、手臂推力與核心整合。", traditions: ["Ashtanga"], source: ASHTANGA }),
  completePose({ id: "half-split", zh: "半神猴式", en: "Half Split", sanskrit: "Ardha Hanumanasana", position: "跪姿", level: "基礎", focus: ["腿後側", "小腿", "髖部"], tags: ["伸展", "腿後側", "弓步", "準備"], summary: "由低弓步將骨盆後移、前腿逐步伸直，以長脊柱探索前腿後側。" }),
  completePose({ id: "lizard", zh: "蜥蜴式", en: "Lizard Pose", sanskrit: "Utthan Pristhasana", position: "跪姿", level: "中階", focus: ["髖部", "髖屈肌", "內收肌"], tags: ["伸展", "髖部", "弓步"], summary: "前腳置於同側手外的低弓步，可用瑜伽磚墊高手部，逐步探索髖前與大腿內側。" }),
  completePose({ id: "pigeon", zh: "鴿子式", en: "Pigeon Pose", sanskrit: "Eka Pada Rajakapotasana Prep", position: "跪姿", level: "中階", focus: ["外側髖", "臀部", "髖屈肌"], tags: ["伸展", "髖部", "單腿"], summary: "前腿外旋、後腿延伸的髖部體式；前腳跟可貼近骨盆，骨盆下方應充分支撐。", cautions: ["膝或髖部疼痛時不要勉強進入，改做仰臥四字式。", "骨盆懸空時以毛毯或瑜伽磚支撐。"] }),
  completePose({ id: "side-plank", zh: "側板式", en: "Side Plank", sanskrit: "Vasisthasana", position: "手臂支撐", level: "中階", focus: ["側腹核心", "肩胛穩定", "平衡"], tags: ["強化", "核心", "手臂支撐", "平衡"], summary: "由平板轉向單手與單腳側邊支撐，可讓下側膝著地以降低負荷。" }),
  completePose({ id: "wheel", zh: "輪式", en: "Wheel Pose", sanskrit: "Urdhva Dhanurasana", position: "仰臥", level: "進階", focus: ["胸椎伸展", "肩部", "腿部力量"], tags: ["後彎", "強化", "開胸", "進階"], summary: "手腳推地的完整後彎，需要肩部活動、腿部推力與均勻的脊柱伸展。", cautions: ["腕、肩、頸或腰部不適者避免，先使用橋式。", "需充分熱身並在合格老師指導下練習。"] }),
  completePose({ id: "figure-four", zh: "仰臥四字式", en: "Reclined Figure Four", sanskrit: "Supta Kapotasana", position: "仰臥", level: "基礎", focus: ["外側髖", "臀部", "下背"], tags: ["伸展", "髖部", "恢復", "仰臥"], summary: "仰臥將一側腳踝跨過另一側大腿，雙手抱腿靠近，在地面支撐下探索外側髖。" }),
  completePose({ id: "constructive-rest", zh: "建設性休息式", en: "Constructive Rest", sanskrit: "—", position: "仰臥", level: "基礎", focus: ["呼吸", "下背", "骨盆覺察"], tags: ["恢復", "呼吸", "暖身", "仰臥"], summary: "仰臥屈膝、雙腳踩地，讓骨盆與背部被地面承接，適合課堂開始時觀察呼吸與症狀。" }),
  completePose({ id: "seated-side-bend", zh: "坐姿側彎", en: "Seated Side Bend", sanskrit: "Parsva Sukhasana", position: "坐姿", level: "基礎", focus: ["側腰", "胸廓", "肩部"], tags: ["側彎", "伸展", "呼吸", "坐姿"], summary: "穩定坐骨後將一手落地、另一手越過耳側延伸，以呼吸探索側腰與胸廓空間。" }),
  completePose({ id: "big-toe", zh: "站立手抓大腳趾式", en: "Big Toe Pose", sanskrit: "Padangusthasana", position: "站姿", level: "基礎", focus: ["腿後側", "小腿", "髖部折疊"], tags: ["前屈", "伸展", "站立", "Ashtanga"], summary: "雙腳髖寬，從髖部向前折疊，以食指與中指勾住大腳趾；可屈膝保持腹部與大腿靠近。", traditions: ["Ashtanga"], source: ASHTANGA }),
  completePose({ id: "hand-under-foot", zh: "手掌墊腳式", en: "Hand Under Foot Pose", sanskrit: "Padahastasana", position: "站姿", level: "中階", focus: ["腿後側", "手腕", "背部"], tags: ["前屈", "伸展", "站立", "Ashtanga"], summary: "站立前屈後將手掌滑到腳底下、腳趾靠近腕橫紋；先放鬆頸部，再逐步伸展雙腿。", traditions: ["Ashtanga"], source: ASHTANGA }),
  completePose({ id: "high-lunge", zh: "高弓步", en: "High Lunge", sanskrit: "Ashta Chandrasana", position: "站姿", level: "基礎", focus: ["腿部力量", "髖屈肌", "平衡"], tags: ["弓步", "強化", "站立", "髖部"], summary: "前膝屈曲、後腳跟抬起，後腿保持延伸；軀幹從骨盆向上延長，手可扶髖或舉高。", source: { label: "Yoga Journal · Standing poses", url: "https://www.yogajournal.com/poses/types/standing/" } }),
  completePose({ id: "revolved-side-angle", zh: "扭轉側角式", en: "Revolved Side Angle", sanskrit: "Parivrtta Parsvakonasana", position: "站姿", level: "中階", focus: ["胸椎旋轉", "腿部力量", "平衡"], tags: ["扭轉", "弓步", "站立", "核心"], summary: "從弓步延長脊柱，再讓軀幹朝前腿旋轉；下手可放瑜伽磚，先保持後膝著地以建立穩定。", source: { label: "Yoga Journal · Standing poses", url: "https://www.yogajournal.com/poses/types/standing/" } }),
  completePose({ id: "revolved-head-to-knee", zh: "扭轉頭碰膝式", en: "Revolved Head-to-Knee Pose", sanskrit: "Parivrtta Janu Sirsasana", position: "坐姿", level: "中階", focus: ["側腰", "腿後側", "胸椎旋轉"], tags: ["側彎", "扭轉", "坐姿", "伸展"], summary: "一腿伸直、一腿屈曲，軀幹側彎朝伸直腿並把胸口逐步轉向上方；下手可扶小腿或瑜伽帶。", source: { label: "Yoga Journal · Pose library", url: "https://www.yogajournal.com/poses/" } }),
  completePose({ id: "marichyasana-a", zh: "聖哲瑪里琪一式", en: "Marichi’s Pose A", sanskrit: "Marichyasana A", position: "坐姿", level: "中階", focus: ["腿後側", "髖部", "肩部"], tags: ["前屈", "坐姿", "單腿", "Ashtanga"], summary: "一腿伸直、另一膝屈曲踩地，軀幹向伸直腿前屈；手臂可環抱屈膝腿，無需強求背後扣手。", traditions: ["Ashtanga"], source: ASHTANGA }),
  completePose({ id: "half-frog", zh: "半青蛙式", en: "Half Frog Pose", sanskrit: "Ardha Bhekasana", position: "俯臥", level: "中階", focus: ["股四頭肌", "髖屈肌", "胸部"], tags: ["後彎", "伸展", "俯臥", "單腿"], summary: "俯臥以前臂支撐胸口，屈一膝並由同側手扶腳；保持膝蓋朝後，腳跟只靠近舒適範圍。", source: { label: "Yoga Journal · Leg poses", url: "https://www.yogajournal.com/poses/anatomy/legs/" } }),
  completePose({ id: "peacock", zh: "孔雀式", en: "Peacock Pose", sanskrit: "Mayurasana", position: "手臂支撐", level: "進階", focus: ["手腕", "手臂", "核心"], tags: ["手臂平衡", "強化", "核心", "進階"], summary: "雙肘靠近腹部、身體水平離地的進階平衡；先以腳尖留地練習前移重心與手掌推力。", cautions: ["腕、肘、肩或腹部狀況者避免。", "需在合格老師指導與安全落地空間中練習。"], source: { label: "Yoga Journal · Leg poses", url: "https://www.yogajournal.com/poses/anatomy/legs/" } }),
  completePose({ id: "ear-pressure", zh: "耳壓式", en: "Ear Pressure Pose", sanskrit: "Karnapidasana", position: "仰臥", level: "進階", focus: ["背部", "肩部", "腿後側"], tags: ["倒置", "前屈", "Ashtanga", "進階"], summary: "由犁式屈膝，膝蓋靠近耳朵兩側；重量留在肩背而非頸椎，手臂保持支撐。", cautions: ["頸肩、高血壓、青光眼或其他倒置禁忌者避免。", "不可在姿勢中轉頭，初學者需由合格老師指導。"], traditions: ["Ashtanga"], source: ASHTANGA }),
  completePose({ id: "yoga-seal", zh: "瑜伽身印", en: "Yoga Seal", sanskrit: "Yoga Mudrasana", position: "坐姿", level: "中階", focus: ["髖部", "背部", "肩部"], tags: ["前屈", "冥想", "坐姿", "Ashtanga"], summary: "在舒適交叉坐姿中延長脊柱後前屈，雙手可留在地面；蓮花坐與背後扣手只適合已有充分活動度者。", traditions: ["Ashtanga"], source: ASHTANGA }),
  completePose({ id: "extended-leg", zh: "伸腿式", en: "Extended Leg Pose", sanskrit: "Uttana Padasana", position: "仰臥", level: "中階", focus: ["核心", "髖屈肌", "胸部"], tags: ["強化", "仰臥", "核心", "Ashtanga"], summary: "由有支撐的胸椎伸展抬起雙腿與手臂，保持腹部控制；可讓頭背完整著地並一次抬一腿。", traditions: ["Ashtanga"], source: ASHTANGA })
];

export const POSE_LIBRARY: PoseGuide[] = [...CORE_POSES, ...ADDITIONAL_POSES];

export const POSITION_FILTERS = ["全部", "站姿", "坐姿", "跪姿", "俯臥", "仰臥", "手臂支撐"] as const;
export const FOCUS_FILTERS = ["全部", "平衡", "強化", "伸展", "核心", "髖部", "肩部", "脊柱", "恢復"] as const;
export const TRADITION_FILTERS = ["全部", "Ashtanga", "愛揚格", "哈達", "修復"] as const;
