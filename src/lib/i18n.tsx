import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "zh-TW" | "zh-CN" | "en";

const ZH_TW: Record<string, string> = {
  "Overview": "總覽", "Guidance": "教學指引", "Today at a glance": "今日概覽", "Students": "學員", "Student directory": "學員名錄", "Profiles & history": "資料與紀錄", "Add student": "新增學員", "Create a profile": "建立資料", "Record class": "記錄課堂", "Post-class notes": "課後筆記", "Teaching": "教學", "Teacher Studio": "教師工作室", "Profile & coaching": "檔案與教練建議", "AI Class Planner": "AI 課程規劃", "Build a timed sequence": "建立定時序列",
  "Teacher workspace · Presence over performance": "教師工作空間 · 覺察重於表現", "Practice with presence": "帶著覺察練習", "Return to the breath": "回到呼吸", "Your notes are a form of care.": "你的紀錄也是一種照顧。", "Main navigation": "主導覽", "Open navigation": "開啟導覽", "Close navigation": "關閉導覽", "Sattva student sanctuary home": "Sattva 學員空間首頁",
  "A mindful teaching companion": "一個有覺察的教學夥伴", "Hold every student": "清晰而用心地", "with clarity and care.": "承接每一位學員。", "A quiet place to remember the body, notice the practice and shape the next class—without losing the human in the notes.": "在安靜的空間裡記住身體、觀察練習並設計下一堂課，同時不讓紀錄失去人的溫度。", "Record today’s class": "記錄今天的課堂", "View students": "查看學員", "A simple teaching rhythm": "簡單的教學節奏", "Know the person": "了解學員", "Observe the practice": "觀察練習", "Teach the next breath": "設計下一次呼吸", "Add a student": "新增學員", "Plan next class": "規劃下一堂課", "Your sanctuary": "你的教學空間", "students": "位學員", "classes": "堂課", "Recent practice": "近期練習", "All students →": "所有學員 →", "Your recent classes will appear here.": "近期課堂將顯示於此。", "Health notes support observation and modification; they do not replace assessment by a qualified healthcare professional.": "健康紀錄用於協助觀察與調整，不能取代合格醫療專業人員的評估。",
  "Student sanctuary": "學員空間", "Today’s students": "今日學員", "Search by name": "依姓名搜尋", "No students found.": "找不到學員。", "Classes": "課堂數", "Experience": "經驗", "Status": "狀態", "Last class date": "最近上課日期", "Last class time": "最近上課時間", "View journey →": "查看歷程 →", "New student": "新增學員", "Name": "姓名", "Contact": "聯絡方式", "Age range": "年齡區間", "Experience level": "經驗程度", "Not set": "未設定", "Under 20": "20 歲以下", "Beginner": "初學者", "Some experience": "有一些經驗", "Intermediate": "中階", "Advanced": "進階", "Goals": "目標", "Areas that need support": "需要支援的部位", "Wellbeing context": "健康情況", "Injury details": "傷病詳情", "Teacher notes": "老師備註", "Save student": "儲存學員", "Saving...": "儲存中…", "Cancel": "取消", "Selected areas": "已選部位", "Tap a point on the body to record an area.": "點選身體部位以建立紀錄。", "Front": "正面", "Back": "背面",
  "New class note": "新增課堂紀錄", "Student": "學員", "Loading students...": "正在載入學員…", "Select a student": "選擇學員", "Class date": "上課日期", "Class time": "上課時間", "Class type": "課堂類型", "Yoga": "瑜伽", "Pilates": "皮拉提斯", "Barre": "芭蕾雕塑", "Private session": "私人課", "Group class": "團體課", "Class pulse": "課堂狀態", "A quick check-in across body, energy and mind.": "快速記錄身體、能量與專注狀態。", "Energy": "能量", "Body comfort": "身體舒適度", "Focus": "專注", "Depleted": "疲憊", "Vibrant": "充沛", "Sensitive": "敏感", "Easeful": "舒適", "Scattered": "分散", "Present": "專注當下", "Areas to support": "需要支援的地方", "Class highlight": "課堂亮點", "Teacher reflection": "老師反思", "Save class note": "儲存課堂紀錄",
  "Practice profile": "練習檔案", "Loading profile...": "正在載入資料…", "Add class note": "新增課堂紀錄", "Complete history": "完整紀錄", "No class notes yet.": "尚無課堂紀錄。", "Body conditions": "身體狀況", "Injury notes": "傷病紀錄", "Created": "建立日期", "Issue evolution": "問題變化", "Suggested sequence · teacher review required": "建議序列 · 需由老師審閱", "Based on complete class history": "依據完整課堂紀錄", "Next practice": "下次練習", "Safety + language": "安全與引導語",
  "Your teaching practice": "你的教學實踐", "The teacher is part of the practice, too.": "老師也是練習的一部分。", "Teaching identity": "教學定位", "The experience and traditions that shape how you hold a room.": "塑造你帶領課堂方式的經驗與傳承。", "Ways you teach": "你的教學方式", "Select the modes and communities that are already part of your practice.": "選擇你目前採用的教學形式與服務群體。", "Capability compass": "能力羅盤", "Self-rate honestly. This is a direction finder, not a performance score.": "如實自評；這是方向工具，不是績效評分。", "Reflection": "反思", "Give the coach the language and values behind your choices.": "讓教學教練理解你選擇背後的語言與價值。", "Teaching coach": "教學教練", "Preparing your coaching reflection…": "正在準備教學反思…", "Open AI Class Planner": "開啟 AI 課程規劃", "Next-class experiment": "下堂課實驗",
  "Capability profile": "能力檔案", "Teacher Studio · pre-class ritual": "教師工作室 · 課前準備", "Shape the room before it opens.": "在開課前，先設計好課堂。", "Select students, add the practical context and let the planner turn history into a connected, teachable arc. Review every suggestion before class.": "選擇學員並加入實際需求，讓規劃器把歷史紀錄轉為連貫且可教學的課程；上課前請審閱每項建議。", "Today’s container": "今日課堂設定", "Awaiting brief": "等待需求", "AI generated": "AI 生成", "Template fallback": "備援模板", "Select students…": "選擇學員…", "Required": "必填", "selected": "已選", "Class style": "課程風格", "Pace": "節奏", "Slow": "慢", "Balanced": "平衡", "Dynamic": "動態", "Hatha": "哈達", "Yin": "陰瑜伽", "Restorative": "修復瑜伽", "Mixed practice": "混合練習", "Class theme": "課堂主題", "Duration": "時長", "New students": "新學員", "Props / room setup": "輔具／場地配置", "Must include": "必須加入", "Avoid poses": "避免體式", "Teacher intention": "老師教學意圖", "Optional": "選填", "Be specific": "請具體描述", "Difficulty": "難度", "Vigorous": "高強度", "Selection context": "所選學員資料", "classes read": "堂課紀錄已讀", "latest energy": "最近能量", "latest comfort": "最近舒適度", "Goals and movement considerations from every selected profile will be included.": "將納入所有已選學員的目標與動作注意事項。", "Generate a new AI class plan →": "生成新的 AI 課程 →", "AI is designing the class…": "AI 正在設計課程…", "Your sequence will appear here": "課程序列將顯示於此", "Choose students and context on the left. The planner will combine their history with your teaching intention.": "選擇學員並填寫課堂需求；規劃器會結合其歷史紀錄與你的教學意圖。", "minutes · matched": "分鐘 · 已吻合", "poses / transitions": "體式／轉換", "requested level": "指定程度", "Individual considerations": "個別注意事項", "Profile + class history": "個人資料＋課堂紀錄", "Avoid:": "避免：", "Offer:": "建議：", "Key pose teaching notes": "重點體式教學", "How to teach it": "教學方式", "Cues & options": "口令與替代方案", "Why this order": "編排理由", "Prepare the room": "課堂準備", "Transition:": "轉換：", "Why this is a template": "使用模板的原因", "AI status": "AI 狀態"
  , "Open the selection box to choose one or more students.": "開啟選擇框以選取一位或多位學員。", "01 · Context": "01 · 課堂條件", "02 · Generated arc": "02 · 生成的課程弧線", "one step at a time": "一次一個步驟", "← Teacher Studio": "← 教師工作室", "30 minutes": "30 分鐘", "45 minutes": "45 分鐘", "60 minutes": "60 分鐘", "75 minutes": "75 分鐘", "90 minutes": "90 分鐘", "Hip mobility with steady strength…": "以穩定力量促進髖部活動…", "Chairs, blocks, blankets…": "椅子、瑜伽磚、毛毯…", "Tree, breathwork…": "樹式、呼吸練習…", "Plank, deep kneeling…": "平板式、深度跪姿…", "How should the room feel or learn?": "希望課堂帶來什麼感受或學習？", "Build confidence through repeated, predictable transitions…": "透過重複且可預期的轉換建立信心…", "1 = restorative · 5 = vigorous": "1＝修復 · 5＝高強度"
  , "Good morning, teacher": "老師，早安", "Teach the person, not the pose.": "教的是人，不只是體式。", "Today’s intention": "今日意圖", "Begin with what you notice.": "從你觀察到的事情開始。", "Short, grouped steps keep the notebook useful during a real teaching day.": "簡短且分組的步驟，讓紀錄在真實教學日中保持實用。", "Practice journey": "練習歷程", "Class pulse captured": "已記錄課堂狀態", "Built from the full body profile, complete history and the most recent trend.": "依據完整身體資料、全部歷史紀錄與最近趨勢建立。", "Adapt to today’s check-in": "依今天的狀態調整", "Intelligent planning": "智慧規劃", "Anatomy lens": "解剖觀點", "Language & cues": "語言與口令", "Injury prevention": "傷害預防", "Practice hours": "練習時數", "Community": "服務群體", "Confident": "有信心", "Learning": "學習中", "Sequencing": "課程編排", "Anatomy": "解剖", "Cueing": "口令引導", "Observation": "觀察", "Inclusive options": "共融選項", "Teaching philosophy": "教學理念", "What feels strong": "目前的優勢", "Where you want to grow": "希望成長之處", "Certifications & lineages": "證照與傳承", "Primary styles": "主要風格", "Teaching specialties": "教學專長", "Years teaching": "教學年資", "Teacher name": "老師姓名", "Capability overview": "能力概覽", "Name what feels natural, notice the edge you are growing into, and turn reflection into one observable experiment.": "說出自然擅長之處，留意正在成長的邊界，並把反思化為一個可觀察的實驗。", "Next sequence is ready": "下一套序列已準備好", "One issue is improving": "一項問題正在改善", "ready to teach": "可以開始教學", "steady rhythm": "穩定節奏", "students held in care": "位學員受到照顧", "classes remembered": "堂課已記錄", "Highlight ·": "亮點 ·", "Shoulder tension · monitor lightly": "肩部緊繃 · 持續輕度觀察", "Yoga Alliance scope of practice": "Yoga Alliance 執業範圍", "Educational planning support only—not diagnosis or treatment. Ask for consent before hands-on adjustments, modify for the individual, and refer concerns beyond your qualifications to a healthcare professional. Safety basis:": "僅供教學規劃，不作診斷或治療。接觸式調整前須取得同意，並依個人狀況修改；超出專業能力的問題應轉介醫療專業人員。安全依據："
  , "Choose all observations from today's practice.": "選擇今天練習中觀察到的所有項目。", "One short note is enough.": "簡短記錄即可。", "Optional cue, intention or follow-up for next time.": "可選填口令、意圖或下次追蹤事項。", "What opened, improved or felt joyful?": "哪些地方打開了、進步了，或感到愉悅？", "A cue to remember, a theme to revisit, or a moment of insight…": "值得記住的口令、想再次探索的主題或一刻洞見…", "Email, phone, or Line": "Email、電話或 Line", "Strength, flexibility, stress relief, posture...": "力量、柔軟度、紓壓、體態…", "Select one or more areas on the front or back body. This is an observation tool, not a diagnosis.": "在身體正面或背面選擇一個或多個部位；這是觀察工具，不是診斷。", "Add any broader context that may affect practice.": "加入任何可能影響練習的整體情況。", "Optional details that are not covered by the tags above.": "可補充上方標籤未涵蓋的細節。", "RYT 200, Yin training, Pilates…": "RYT 200、陰瑜伽培訓、皮拉提斯…"
  , "Pregnancy": "懷孕", "High blood pressure": "高血壓", "Low energy": "低能量", "Stress & anxiety": "壓力與焦慮", "Lower back tension": "下背緊繃", "Knee sensitivity": "膝部敏感", "Shoulder tension": "肩部緊繃", "Wrist pressure": "手腕壓力", "Hip tightness": "髖部緊繃", "Balance": "平衡", "Breath control": "呼吸控制", "No concern": "沒有問題", "Neck": "頸部", "Shoulders": "肩部", "Chest": "胸部", "Wrists": "手腕", "Abdomen": "腹部", "Hips": "髖部", "Knees": "膝部", "Ankles & feet": "足踝", "Upper back": "上背", "Lower back": "下背"
  , "Record goals, experience and areas that need support before planning shapes.": "在編排體式前，先記錄目標、經驗與需要支援的部位。", "After class, capture three scores and only the details that will matter next time.": "課後記下三項評分，以及下次真正需要的資訊。", "Open a profile to review trends, safe sequence ideas and concise teaching cues.": "開啟學員資料，查看趨勢、安全序列構想與精簡教學口令。", "Record a class": "記錄課堂", "Adaptive intelligence": "適應式智慧", "Yoga philosophy": "瑜伽哲學", "Older adults": "高齡學員", "Private sessions": "私人課程", "Stress care": "壓力照護", "Save & refresh coach": "儲存並更新教練建議", "Saving…": "儲存中…", "Refining plan…": "正在完善規劃…", "Studio profile saved. Your coaching focus has been refreshed.": "教師檔案已儲存，教練建議已更新。", "Begin before you teach": "在教學前先安定自己", "A 60-second focus ritual": "60 秒專注儀式", "Begin focus": "開始專注", "End ritual": "結束儀式", "Follow one breath at a time": "一次跟隨一個呼吸", "Hold softly": "輕柔停留", "4 inhale · 2 pause · 6 exhale": "吸氣 4 拍 · 停 2 拍 · 呼氣 6 拍", "No classes yet": "尚無課堂", "No date": "無日期", "None recorded": "尚未記錄", "Level not set": "程度未設定", "Comfort": "舒適度", "Student name": "學員姓名", "Class difficulty": "課程難度", "Plan requirement check": "課程需求檢查", "Animated preview of the teacher workflow": "教師工作流程動畫預覽", "Could not load students": "無法載入學員", "Could not load student": "無法載入學員資料", "Could not load profile": "無法載入檔案", "Could not load class notes": "無法載入課堂紀錄", "Could not create student": "無法建立學員", "Could not create class note": "無法建立課堂紀錄", "Could not generate guide": "無法生成指引", "Could not generate plan": "無法生成課程", "Could not save the profile. Please try again.": "無法儲存檔案，請再試一次。", "Select at least one student first": "請先選擇至少一位學員"
  , "Swipe to see all columns": "左右滑動查看所有欄位", "Scrollable student directory": "可橫向滑動的學員名錄", "Teaching Toolkit": "教學工具箱", "Checklists & cue library": "檢查表與口令庫", "Open AI Class Planner →": "開啟 AI 課程規劃 →", "Practical teaching support": "實用教學支援", "Small checks that make a class feel held.": "細小的檢查，讓課堂被穩穩承接。", "Use this space before or after class to prepare safer options, refine language and review the shape of your sequence.": "在課前或課後使用這個空間，準備更安全的選項、調整引導語並檢視序列結構。", "readiness checks": "項準備檢查", "01 · Before class": "01 · 課前", "Readiness checklist": "課前準備檢查", "Reset": "重設", "Review student context": "檢視學員狀況", "Check current symptoms, previous pain, health conditions and the alternatives each student may need.": "確認目前症狀、過往疼痛、健康狀況，以及每位學員可能需要的替代方案。", "Place props where they are easy to reach and leave clear routes for rest or changing position.": "把輔具放在容易拿取的位置，並保留休息或轉換姿勢的清楚動線。", "Plan visible options": "準備清楚可見的選項", "Prepare a base version first, then one progression. No student should need to earn the easier option.": "先準備基礎版本，再提供一個進階；學員不需要先證明自己才可以選擇簡易版本。", "Set consent language": "準備同意與選擇用語", "Explain that hands-on support is optional and that students may change or skip any movement.": "說明接觸式協助完全自願，學員可以修改或跳過任何動作。", "Protect integration time": "保留整合時間", "Reserve enough time for transition, cool-down and rest instead of filling every minute with poses.": "為轉換、緩和與休息保留足夠時間，不必用體式填滿每一分鐘。", "02 · In the room": "02 · 課堂中", "Inclusive cue library": "包容性口令庫", "Student agency": "學員自主", "Foundation": "根基", "Breath and pace": "呼吸與節奏", "Consent and choice": "同意與選擇", "Choose the version where your breath remains steady.": "選擇能讓呼吸保持穩定的版本。", "You are welcome to stay here, make it smaller, or rest.": "你可以停留在這裡、縮小幅度，或選擇休息。", "Notice what is useful today rather than chasing the deepest shape.": "觀察今天真正有幫助的感受，不必追求最深的體式。", "Let the whole foot receive the floor.": "讓整個腳掌承接地面的支持。", "Build the base first, then decide whether more range is useful.": "先建立穩定根基，再決定增加幅度是否有幫助。", "Keep enough space in the joint to move back out smoothly.": "在關節中保留足夠空間，讓你能順暢退出。", "Let the next inhale begin the movement.": "讓下一次吸氣帶動動作。", "Pause before the breath becomes strained.": "在呼吸變得費力之前停下來。", "Move at the pace that lets you notice the transition.": "以能清楚感受轉換的速度移動。", "Would you like a verbal cue, a demonstration, or space to explore?": "你希望得到口頭提示、動作示範，還是自行探索的空間？", "Hands-on support is optional and you can change your answer at any time.": "接觸式協助完全自願，你可以隨時改變決定。", "Skipping a pose is a complete practice choice.": "跳過一個體式也是完整的練習選擇。", "03 · Sequence review": "03 · 序列檢視", "Four-part arc audit": "四階段課程檢查", "Teacher review": "老師審閱", "Arrival": "進入課堂", "Observe breath, energy and current symptoms before adding load.": "增加負荷前，先觀察呼吸、能量與目前症狀。", "Preparation": "準備", "Rehearse the joint actions and transitions needed later in the class.": "預先練習課程後段所需的關節動作與轉換。", "Main exploration": "主要探索", "Repeat a coherent pattern with bilateral balance and visible options.": "重複連貫模式，兼顧左右平衡與清楚可見的選項。", "Integration": "整合", "Reduce complexity, revisit the intention and leave enough time for rest.": "降低複雜度、回到課堂意圖，並留下足夠休息時間。", "Teaching support only: do not diagnose or treat health conditions. Pause or adapt movements that reproduce symptoms, and refer concerns beyond your qualifications to an appropriate healthcare professional.": "僅供教學支援，不用於診斷或治療健康狀況。若動作再次引發症狀，請暫停或調整；超出專業能力的問題應轉介適當的醫療專業人員。"
};

const ZH_CN: Record<string, string> = Object.fromEntries(Object.entries(ZH_TW).map(([key, value]) => [key, value
  .replaceAll("學員", "学员").replaceAll("課", "课").replaceAll("錄", "录").replaceAll("體", "体").replaceAll("師", "师")
  .replaceAll("習", "习").replaceAll("導", "导").replaceAll("覽", "览").replaceAll("覺", "觉").replaceAll("與", "与")
  .replaceAll("種", "种").replaceAll("個", "个").replaceAll("這", "这").replaceAll("為", "为").replaceAll("來", "来")
  .replaceAll("將", "将").replaceAll("選", "选").replaceAll("擇", "择").replaceAll("開", "开").replaceAll("關", "关")
  .replaceAll("狀", "状").replaceAll("傷", "伤").replaceAll("儲", "储").replaceAll("進", "进").replaceAll("階", "阶")
  .replaceAll("時", "时").replaceAll("長", "长").replaceAll("動", "动").replaceAll("簡", "简").replaceAll("線", "线")
  .replaceAll("務", "务").replaceAll("團", "团").replaceAll("後", "后").replaceAll("應", "应").replaceAll("據", "据")
  .replaceAll("歷", "历").replaceAll("審", "审").replaceAll("閱", "阅").replaceAll("實", "实").replaceAll("驗", "验")
  .replaceAll("劃", "划").replaceAll("備", "备").replaceAll("顯", "显").replaceAll("則", "则").replaceAll("並", "并")
  .replaceAll("於", "于").replaceAll("從", "从").replaceAll("無", "无").replaceAll("發", "发").replaceAll("載", "载")
  .replaceAll("靜", "静").replaceAll("記", "记").replaceAll("護", "护").replaceAll("層", "层").replaceAll("點", "点")
  .replaceAll("態", "态").replaceAll("壓", "压").replaceAll("氣", "气").replaceAll("陰", "阴").replaceAll("總", "总")
  .replaceAll("員", "员").replaceAll("檔", "档").replaceAll("紀", "纪").replaceAll("頁", "页").replaceAll("資", "资")
  .replaceAll("輔", "辅").replaceAll("場", "场").replaceAll("醫", "医").replaceAll("專", "专").replaceAll("業", "业")
  .replaceAll("評", "评").replaceAll("間", "间").replaceAll("數", "数").replaceAll("觀", "观").replaceAll("療", "疗")
  .replaceAll("顧", "顾").replaceAll("傳", "传").replaceAll("領", "领").replaceAll("羅", "罗").replaceAll("讓", "让")
  .replaceAll("請", "请").replaceAll("處", "处").replaceAll("轉", "转").replaceAll("換", "换").replaceAll("薦", "荐")
  .replaceAll("規", "规").replaceAll("劃", "划").replaceAll("勁", "劲").replaceAll("憊", "惫").replaceAll("練", "练")
  .replaceAll("適", "适").replaceAll("專", "专").replaceAll("覺", "觉").replaceAll("複", "复").replaceAll("輸", "输")])) as Record<string, string>;

type I18nValue = { locale: Locale; setLocale: (locale: Locale) => void; t: (source: string) => string };
const I18nContext = createContext<I18nValue>({ locale: "zh-TW", setLocale: () => undefined, t: (source) => source });
const originalText = new WeakMap<Text, string>();
const lastAppliedText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();

function dictionary(locale: Locale) { return locale === "zh-TW" ? ZH_TW : locale === "zh-CN" ? ZH_CN : {}; }
function translate(source: string, locale: Locale) {
  if (locale === "en") return source;
  const translated = dictionary(locale)[source];
  if (translated) return translated;
  const selected = source.match(/^(\d+) (student|students) selected$/);
  if (selected) return locale === "zh-TW" ? `已選 ${selected[1]} 位學員` : `已选 ${selected[1]} 位学员`;
  const simpleSelected = source.match(/^(\d+) selected$/);
  if (simpleSelected) return locale === "zh-TW" ? `已選 ${simpleSelected[1]} 位` : `已选 ${simpleSelected[1]} 位`;
  const classCount = source.match(/^(\d+) classes$/);
  if (classCount) return locale === "zh-TW" ? `${classCount[1]} 堂課` : `${classCount[1]} 堂课`;
  return source;
}

function localizeDom(root: ParentNode, locale: Locale) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    const node = current as Text;
    if (!node.parentElement?.closest("script, style, pre, code, [data-i18n-explicit]")) {
      if (!originalText.has(node)) originalText.set(node, node.data);
      const source = originalText.get(node) || node.data;
      const trimmed = source.trim();
      const output = trimmed ? translate(trimmed, locale) : trimmed;
      const next = trimmed && output !== trimmed ? source.replace(trimmed, output) : source;
      if (node.data !== next) { lastAppliedText.set(node, next); node.data = next; }
    }
    current = walker.nextNode();
  }
  const elements = root instanceof Element ? [root, ...Array.from(root.querySelectorAll("*"))] : Array.from(root.querySelectorAll("*"));
  for (const element of elements) {
    if (element.closest("[data-i18n-explicit]")) continue;
    for (const attribute of ["placeholder", "aria-label", "title"]) {
      const value = element.getAttribute(attribute);
      if (!value) continue;
      if (!originalAttributes.has(element)) originalAttributes.set(element, new Map());
      const originals = originalAttributes.get(element)!;
      if (!originals.has(attribute)) originals.set(attribute, value);
      const source = originals.get(attribute)!;
      const output = translate(source, locale);
      if (value !== output) element.setAttribute(attribute, output);
    }
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("zh-TW");
  useEffect(() => {
    const saved = window.localStorage.getItem("sattva-locale") as Locale | null;
    if (saved === "zh-TW" || saved === "zh-CN" || saved === "en") setLocale(saved);
  }, []);
  useEffect(() => {
    window.localStorage.setItem("sattva-locale", locale);
    document.documentElement.lang = locale;
    localizeDom(document.body, locale);
    const observer = new MutationObserver((records) => records.forEach((record) => {
      if (record.type === "characterData") {
        const node = record.target as Text;
        if (lastAppliedText.get(node) === node.data) return;
        originalText.set(node, node.data);
        if (node.parentNode) localizeDom(node.parentNode, locale);
        return;
      }
      record.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) localizeDom(node as Element, locale);
        else if (node.nodeType === Node.TEXT_NODE && node.parentNode) localizeDom(node.parentNode, locale);
      });
    }));
    observer.observe(document.body, { characterData: true, childList: true, subtree: true });
    return () => observer.disconnect();
  }, [locale]);
  const value = useMemo(() => ({ locale, setLocale, t: (source: string) => translate(source, locale) }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() { return useContext(I18nContext); }
