type PoseIllustrationProps = { pose: string; className?: string };
type Point = [number, number];
type Figure = { head: Point; segments: Array<[Point, Point]>; joints?: Point[]; ground?: boolean; wall?: boolean };

const standing: Figure = { head: [50, 13], segments: [[[50, 21], [50, 48]], [[50, 28], [34, 43]], [[50, 28], [66, 43]], [[50, 48], [38, 74]], [[50, 48], [63, 74]]], joints: [[50, 28], [50, 48]], ground: true };

function figureFor(pose: string): Figure {
  const name = pose.toLowerCase();
  if (/savasana|corpse|constructive rest|大休息/.test(name)) return { head: [18, 59], segments: [[[25, 59], [58, 59]], [[37, 59], [27, 71]], [[42, 59], [52, 71]], [[58, 59], [78, 68]], [[58, 59], [82, 51]]], joints: [[37, 59], [58, 59]], ground: true };
  if (/pelvic|knee sway|reclined figure four/.test(name)) return { head: [18, 62], segments: [[[25, 61], [53, 59]], [[37, 60], [28, 72]], [[42, 60], [54, 72]], [[53, 59], [68, 42]], [[68, 42], [82, 62]]], joints: [[53, 59], [68, 42]], ground: true };
  if (/supine twist|仰臥扭轉/.test(name)) return { head: [22, 42], segments: [[[29, 44], [52, 49]], [[39, 46], [20, 64]], [[39, 46], [55, 30]], [[52, 49], [69, 66]], [[69, 66], [84, 65]]], joints: [[39, 46], [52, 49], [69, 66]], ground: true };
  if (/bridge|橋式/.test(name)) return { head: [18, 65], segments: [[[25, 64], [43, 45]], [[43, 45], [66, 50]], [[66, 50], [81, 70]], [[42, 47], [31, 70]]], joints: [[43, 45], [66, 50]], ground: true };
  if (/seated cat/.test(name)) return { head: [53, 17], segments: [[[51, 25], [48, 49]], [[48, 34], [35, 48]], [[48, 34], [63, 47]], [[48, 49], [33, 68]], [[48, 49], [68, 69]]], joints: [[48, 34], [48, 49]], ground: true };
  if (/bird dog/.test(name)) return { head: [72, 31], segments: [[[66, 36], [46, 43]], [[46, 43], [25, 33]], [[47, 43], [53, 69]], [[47, 43], [77, 57]]], joints: [[46, 43]], ground: true };
  if (/cat|cow|貓牛/.test(name)) return { head: [74, 35], segments: [[[67, 39], [47, 42]], [[47, 42], [29, 51]], [[49, 43], [53, 70]], [[30, 51], [23, 70]]], joints: [[47, 42], [29, 51]], ground: true };
  if (/child|嬰兒/.test(name)) return { head: [69, 61], segments: [[[62, 58], [46, 45]], [[46, 45], [31, 55]], [[31, 55], [24, 72]], [[47, 47], [69, 70]], [[50, 48], [79, 70]]], joints: [[46, 45], [31, 55]], ground: true };
  if (/cross-crawl/.test(name)) return { head: [49, 12], segments: [[[49, 20], [49, 47]], [[49, 29], [35, 43]], [[49, 29], [66, 49]], [[49, 47], [37, 74]], [[49, 47], [66, 50]]], joints: [[49, 29], [49, 47], [66, 50]], ground: true };
  if (/wall half sun/.test(name)) return { head: [55, 28], segments: [[[51, 34], [42, 48]], [[42, 48], [25, 42]], [[42, 48], [47, 71]], [[42, 48], [65, 71]]], joints: [[42, 48]], ground: true, wall: true };
  if (/half sun|forward fold/.test(name)) return { head: [72, 39], segments: [[[66, 40], [48, 34]], [[48, 34], [32, 66]], [[48, 34], [70, 70]], [[65, 41], [82, 61]]], joints: [[48, 34]], ground: true };
  if (/chair|幻椅/.test(name)) return { head: [58, 15], segments: [[[55, 23], [48, 45]], [[52, 28], [32, 16]], [[52, 28], [73, 16]], [[48, 45], [65, 57]], [[65, 57], [76, 74]], [[48, 45], [39, 73]]], joints: [[52, 28], [48, 45], [65, 57]], ground: true };
  if (/side angle/.test(name)) return { head: [61, 28], segments: [[[56, 33], [46, 47]], [[54, 36], [75, 18]], [[47, 46], [66, 54]], [[66, 54], [83, 72]], [[47, 46], [29, 72]], [[54, 36], [72, 54]]], joints: [[47, 46], [66, 54]], ground: true };
  if (/warrior three|warrior iii|戰士三/.test(name)) return { head: [76, 33], segments: [[[69, 35], [48, 43]], [[57, 40], [31, 36]], [[57, 40], [31, 47]], [[48, 43], [30, 69]], [[48, 43], [17, 27]]], joints: [[48, 43]], ground: true };
  if (/warrior|戰士二/.test(name)) return { head: [51, 12], segments: [[[51, 20], [51, 47]], [[51, 28], [21, 29]], [[51, 28], [82, 29]], [[51, 47], [32, 72]], [[51, 47], [78, 70]]], joints: [[51, 28], [51, 47]], ground: true };
  if (/low lunge|half split|低弓步/.test(name)) return { head: [54, 13], segments: [[[53, 21], [50, 45]], [[50, 29], [35, 44]], [[50, 29], [66, 43]], [[50, 45], [70, 57]], [[70, 57], [82, 73]], [[50, 45], [31, 69]]], joints: [[50, 29], [50, 45], [70, 57]], ground: true };
  if (/wide-legged/.test(name)) return { head: [51, 55], segments: [[[51, 49], [50, 30]], [[50, 31], [34, 66]], [[50, 31], [68, 66]], [[50, 30], [23, 72]], [[50, 30], [79, 72]]], joints: [[50, 30]], ground: true };
  if (/wall puppy/.test(name)) return { head: [56, 38], segments: [[[50, 41], [37, 48]], [[38, 48], [22, 34]], [[38, 48], [43, 72]], [[38, 48], [61, 72]]], joints: [[38, 48]], ground: true, wall: true };
  if (/sphinx|人面獅身/.test(name)) return { head: [72, 35], segments: [[[65, 40], [46, 52]], [[46, 52], [22, 62]], [[56, 47], [70, 67]], [[45, 52], [38, 68]]], joints: [[46, 52]], ground: true };
  if (/figure four/.test(name)) return { head: [49, 12], segments: [[[49, 20], [49, 47]], [[49, 30], [34, 42]], [[49, 30], [65, 42]], [[49, 47], [39, 74]], [[49, 47], [65, 55]], [[65, 55], [39, 57]]], joints: [[49, 30], [49, 47], [65, 55]], ground: true };
  if (/tree|樹式/.test(name)) return { head: [50, 12], segments: [[[50, 20], [50, 48]], [[50, 29], [37, 18]], [[50, 29], [63, 18]], [[50, 48], [49, 75]], [[50, 49], [67, 38]]], joints: [[50, 29], [50, 48]], ground: true };
  if (/triangle|三角式/.test(name)) return { head: [69, 17], segments: [[[64, 23], [48, 45]], [[57, 32], [77, 48]], [[57, 32], [43, 62]], [[48, 45], [25, 73]], [[48, 45], [77, 73]]], joints: [[57, 32], [48, 45]], ground: true };
  if (/half moon|半月式/.test(name)) return { head: [62, 24], segments: [[[57, 29], [45, 44]], [[53, 34], [70, 52]], [[53, 34], [38, 65]], [[45, 44], [49, 74]], [[45, 44], [17, 39]]], joints: [[53, 34], [45, 44]], ground: true };
  if (/downward|down dog|下犬/.test(name)) return { head: [66, 48], segments: [[[60, 47], [43, 29]], [[43, 29], [24, 69]], [[57, 44], [76, 70]], [[43, 29], [31, 70]]], joints: [[43, 29]], ground: true };
  if (/side plank|側平板/.test(name)) return { head: [59, 24], segments: [[[55, 30], [45, 49]], [[51, 38], [31, 20]], [[51, 38], [69, 17]], [[45, 49], [74, 69]], [[45, 49], [35, 72]]], joints: [[51, 38], [45, 49]], ground: true };
  if (/plank|平板式/.test(name)) return { head: [75, 35], segments: [[[69, 39], [48, 47]], [[48, 47], [23, 54]], [[57, 44], [69, 70]], [[49, 47], [42, 71]]], joints: [[48, 47]], ground: true };
  if (/boat|船式/.test(name)) return { head: [45, 18], segments: [[[45, 25], [50, 48]], [[48, 32], [28, 45]], [[48, 32], [69, 43]], [[50, 48], [70, 24]], [[50, 48], [78, 35]]], joints: [[48, 32], [50, 48]], ground: true };
  if (/bound angle|束角/.test(name)) return { head: [50, 16], segments: [[[50, 24], [50, 49]], [[50, 31], [34, 50]], [[50, 31], [66, 50]], [[50, 49], [31, 67]], [[31, 67], [50, 70]], [[50, 49], [69, 67]], [[69, 67], [50, 70]]], joints: [[50, 31], [50, 49]], ground: true };
  return standing;
}

export function PoseIllustration({ pose, className = "" }: PoseIllustrationProps) {
  const figure = figureFor(pose);
  return <svg aria-label={`${pose} anatomical pose guide`} className={className} role="img" viewBox="0 0 100 86">
    {figure.wall ? <line className="pose-support" x1="18" x2="18" y1="10" y2="76" /> : null}
    <circle className="pose-head" cx={figure.head[0]} cy={figure.head[1]} r="6" />
    {figure.segments.map(([a, b], index) => <line className="pose-line" key={index} x1={a[0]} x2={b[0]} y1={a[1]} y2={b[1]} />)}
    {figure.joints?.map(([x, y], index) => <circle className="pose-joint" cx={x} cy={y} key={`j-${index}`} r="2.2" />)}
    {figure.ground ? <line className="pose-ground" x1="10" x2="90" y1="76" y2="76" /> : null}
  </svg>;
}
