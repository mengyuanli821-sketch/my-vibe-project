import type { PoseGuide } from "@/lib/poseLibrary";
import type { SequenceItem } from "@/lib/sequences";

type SequenceRow = { item: SequenceItem; pose: PoseGuide };

export function buildReadiness(rows: SequenceRow[], duration: number, propsText = "") {
  const props = Array.from(new Set(rows.flatMap(({ pose }) => pose.props))).slice(0, 5);
  const advanced = rows.filter(({ pose }) => pose.level === "進階").map(({ pose }) => pose.zh);
  const supportHeavy = rows.filter(({ pose }) => pose.position === "手臂支撐").map(({ pose }) => pose.zh);
  const restMinutes = rows.filter(({ item }) => item.phase === "休息" || item.phase === "緩和整合").reduce((sum, { item }) => sum + item.minutes, 0);
  const planned = rows.reduce((sum, { item }) => sum + item.minutes, 0);
  return [
    { id: "sequence", title: `確認 ${rows.length} 個步驟與轉換`, detail: rows.length ? `從「${rows[0].pose.zh}」走到「${rows.at(-1)?.pose.zh}」，實際演練容易卡住的換位與左右側。` : "先完成課程序列，再進行課前檢查。" },
    { id: "timing", title: "核對課程時間", detail: `目前安排 ${planned}／${duration} 分鐘，緩和與休息共 ${restMinutes} 分鐘；保留換邊、示範與提問時間。` },
    { id: "props", title: "把輔具放在可取得的位置", detail: `${propsText ? `課程設定：${propsText}。` : ""}${props.length ? `體式可能使用：${props.join("、")}。` : "依學生需要準備瑜伽磚、毛毯或椅子。"}` },
    { id: "options", title: "先示範支撐版本", detail: supportHeavy.length ? `${supportHeavy.slice(0, 3).join("、")}含上肢承重，先說明減少負重與休息選項。` : "為主要體式準備一個減少幅度或增加支撐的版本。" },
    { id: "risk", title: advanced.length ? "重新確認進階體式條件" : "確認學生當天狀態", detail: advanced.length ? `${advanced.join("、")}屬進階體式；確認經驗、禁忌、退出方式及安全空間。` : "課前詢問疼痛、暈眩、疲勞或近期變化，必要時調整今天的版本。" }
  ];
}

export function buildCueGroups(rows: SequenceRow[]) {
  // This order is deliberately deterministic: every selected pose is processed once,
  // followed by every transition, then a support option for every pose.
  const poseCues = rows.flatMap(({ pose }) => pose.cues.slice(0, 1).map((cue) => `${pose.zh}：${cue}`));
  const transitions = rows.slice(0, -1).map(({ pose }, index) => `從${pose.zh}到${rows[index + 1].pose.zh}：先穩定呼吸，再移動支撐點。`);
  const options = rows.map(({ pose }) => `${pose.zh}可以減少幅度，或使用${pose.props.slice(0, 2).join("／") || "地面支撐"}。`);
  return [
    { id: "sequence", label: "主要體式", cues: poseCues.length ? poseCues : ["完成序列後，這裡會產生對應口令。"] },
    { id: "transition", label: "體式轉換", cues: transitions.length ? transitions : ["先建立下一個支撐點，再慢慢轉移重量。"] },
    { id: "options", label: "替代選項", cues: options.length ? options : ["選擇呼吸仍然穩定的版本，也可以隨時休息。"] },
    { id: "agency", label: "自主選擇", cues: ["你可以留在目前的版本、減少幅度，或跳過這個體式。", "感受今天真正有用的範圍，不需要追求最深的位置。", "若出現疼痛、麻木或暈眩，請退出並告訴老師。"] }
  ];
}
