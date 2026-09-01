export function TeachingFlowVisual() {
  return (
    <div className="flow-stage" aria-label="Animated preview of the teacher workflow">
      <div className="flow-aura" />
      <div className="flow-window">
        <div className="flow-window-bar"><span /><span /><span /><b>SATTVA / TEACHING SPACE</b></div>
        <div className="flow-app">
          <aside className="flow-sidebar"><i>ॐ</i><span className="active" /><span /><span /><span /></aside>
          <div className="flow-dashboard">
            <div className="flow-dash-head"><div><small>Good morning, teacher</small><strong>Begin with what you notice.</strong></div><em>SEPT 01</em></div>
            <div className="flow-metrics"><div><small>Students</small><strong>12</strong><i>+2 this month</i></div><div><small>Practice hours</small><strong>48</strong><i>steady rhythm</i></div><div className="metric-dark"><small>Class pulse</small><strong>●</strong><i>ready to teach</i></div></div>
            <div className="flow-list">
              <div className="flow-list-title"><strong>Today’s students</strong><small>View journey →</small></div>
              <div className="flow-person"><i>MA</i><span><b>Maya</b><small>09:30 · Vinyasa</small></span><em className="light-green">STEADY</em></div>
              <div className="flow-person"><i>EL</i><span><b>Elena</b><small>11:00 · Private</small></span><em className="light-amber">OBSERVE</em></div>
              <div className="flow-person"><i>JO</i><span><b>Jon</b><small>16:30 · Hatha</small></span><em className="light-red">CARE</em></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flow-float flow-float-one"><span>01</span><div><small>NOTICE</small><strong>Class pulse captured</strong><i>Energy 4 · Comfort 3 · Focus 4</i></div></div>
      <div className="flow-float flow-float-two"><span>02</span><div><small>REFLECT</small><strong>One issue is improving</strong><i>Shoulder tension · monitor lightly</i></div></div>
      <div className="flow-float flow-float-three"><span>03</span><div><small>TEACH</small><strong>Next sequence is ready</strong><i>6 poses · safety cues included</i></div></div>
      <div className="flow-cursor"><span>✦</span><small>AI COACH</small></div>
    </div>
  );
}
