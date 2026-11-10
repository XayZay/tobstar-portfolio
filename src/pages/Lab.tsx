import { useState } from "react";
import { scenarios } from "@/data/flowLab";
import type { Scenario } from "@/data/flowLab/types";
import { FlowBoard } from "@/components/FlowBoard";
import { Label, Led } from "@/components/bits";
import { basisWord, nodeName, outcomeMark, routes } from "@/lib/site";
import { useFlowPlayer } from "@/lib/useFlowPlayer";

/** Flow Lab: lab architectures replayed one hop at a time. A scripted walkthrough, not live infrastructure. */
const Lab = ({ scenario }: { scenario: Scenario }) => {
  const fp = useFlowPlayer(scenario);
  const [flash, setFlash] = useState<string | null>(null);
  const st = fp.current;
  const n = fp.flow.steps.length;
  const log = st?.log;

  const showNode = (id: string) => {
    const el = document.getElementById(`node-${id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    setFlash(id);
    window.setTimeout(() => setFlash((f) => (f === id ? null : f)), 1600);
  };

  const boardProps = {
    scenario,
    currentEdge: st?.edgeId ?? null,
    currentNodes: st ? [st.from.id, st.to.id] : [],
    mark: st?.outcome.mark ?? null,
    trail: fp.trail,
    touched: fp.touched,
    nodeStates: fp.nodeStates,
    onNode: showNode,
  };

  return (
    <section className="wrap">
      <header className="page-head">
        <Label>Flow Lab</Label>
        <h1>Follow the request.</h1>
        <p className="lede">
          These are architectures I built in hands-on cloud labs, replayed here as a scripted walkthrough, one hop at a time. The designs are real. Nothing on this page is
          running live, and timings are illustrative. Use ← and → to step, or press play.
        </p>
      </header>
      <nav className="sel" aria-label="Lab scenarios">
        {scenarios.map((x) => (
          <a key={x.id} href={routes.lab(x.id)} aria-current={x.id === scenario.id ? "page" : undefined}>
            <Led />
            {x.title}
          </a>
        ))}
      </nav>

      <div
        className="scenario"
        tabIndex={0}
        aria-label={`${scenario.title} walkthrough. Use left and right arrow keys to step.`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            fp.next();
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            fp.prev();
          }
        }}
      >
        <div className="scen-head">
          <h2>{scenario.title}</h2>
          <p className="muted">{scenario.summary}</p>
          <p className="prov mono">
            From: {scenario.provenance.lab} · {scenario.provenance.label}
          </p>
        </div>

        <div className="flows" role="group" aria-label="Pick a flow">
          {scenario.flows.map((f, i) => (
            <button key={f.id} type="button" aria-pressed={i === fp.flowIdx} onClick={() => fp.setFlow(i)}>
              <Led />
              {f.title}
              <small>{basisWord(f.basis)}</small>
            </button>
          ))}
        </div>

        <div className="bench">
          <div className="plate board" role="img" aria-label={`Diagram of ${scenario.title}: ${scenario.nodes.map(nodeName).join(", ")}`}>
            <FlowBoard mode="desktop" {...boardProps} />
            <FlowBoard mode="mobile" {...boardProps} />
          </div>
          <div className="plate step-card">
            <div>
              <Label>What's happening</Label>
            </div>
            <div aria-live="polite" style={{ display: "grid", gap: 12 }}>
              {st ? (
                <>
                  <p className="mono step-count">
                    Step {st.index + 1} of {n} · {basisWord(fp.flow.basis)}
                  </p>
                  <p className="focus">{st.focus}</p>
                  <p>{st.narration}</p>
                  <p className="outcome">
                    <span className="mark" aria-hidden="true">
                      {st.outcome.mark}
                    </span>
                    <span>
                      {nodeName(st.from)} → {nodeName(st.to)} · {st.outcome.word}
                    </span>
                  </p>
                  {log && (
                    <p className="log mono">
                      {[log.method, log.target, log.status].filter((x) => x != null && x !== "").join(" ")}
                      {log.note ? `${log.method || log.target || log.status ? " — " : ""}${log.note}` : ""}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="mono step-count">
                    {n} steps · {basisWord(fp.flow.basis)}
                  </p>
                  <p className="focus">{fp.flow.title}</p>
                  <p className="muted">Press play, or step through with Next, to send it through the diagram.</p>
                </>
              )}
            </div>
            <div className="controls">
              <button type="button" className="key" onClick={fp.prev} disabled={fp.stepIdx < 0}>
                ← Back
              </button>
              <button type="button" className="key" onClick={fp.togglePlay}>
                {fp.playing ? "Pause" : fp.done ? "Replay" : "Play"}
              </button>
              <button type="button" className="key" onClick={fp.next} disabled={fp.done}>
                Next →
              </button>
              <button type="button" className="key" onClick={fp.reset} disabled={fp.stepIdx < 0}>
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="flow-detail">
          <div className="plate">
            <div>
              <Label>Every step</Label>
            </div>
            <ol className="steps">
              {fp.flow.steps.map((s, k) => (
                <li key={s.id} className={k < fp.stepIdx ? "done" : k === fp.stepIdx ? "now" : undefined}>
                  <strong>
                    {outcomeMark[s.outcome].mark} {s.focus}
                  </strong>
                  <span>{s.narration}</span>
                </li>
              ))}
            </ol>
          </div>
          <aside className="plate takeaway">
            <div>
              <Label>The point</Label>
            </div>
            <p>{fp.flow.takeaway}</p>
            {fp.flow.observedNotes && fp.flow.observedNotes.length > 0 && (
              <>
                <div style={{ marginTop: 6 }}>
                  <Label>What I saw in the lab</Label>
                </div>
                <ul>
                  {fp.flow.observedNotes.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </>
            )}
          </aside>
        </div>

        <section className="block" aria-labelledby="pieces-h" style={{ paddingTop: 36 }}>
          <div className="sec-head">
            <div>
              <h3 id="pieces-h" style={{ fontSize: "1.7rem" }}>
                What each piece does
              </h3>
            </div>
            <p className="muted">Select a box in the diagram to jump to it.</p>
          </div>
          <div className="node-grid">
            {scenario.nodes.map((node) => (
              <article key={node.id} className={flash === node.id ? "plate ncard flash" : "plate ncard"} id={`node-${node.id}`}>
                <div>
                  <Label>{node.ghost ? "Not built" : node.label}</Label>
                </div>
                <h4>{nodeName(node)}</h4>
                {node.ghost && <p className="muted">{node.ghost.reason}</p>}
                <dl>
                  <dt>What it is</dt>
                  <dd>{node.explainer.what}</dd>
                  <dt>Why it's there</dt>
                  <dd>{node.explainer.why}</dd>
                  {node.explainer.alternative && (
                    <>
                      <dt>The alternative</dt>
                      <dd>{node.explainer.alternative}</dd>
                    </>
                  )}
                  {node.explainer.security && (
                    <>
                      <dt>Security</dt>
                      <dd>{node.explainer.security}</dd>
                    </>
                  )}
                </dl>
                {node.gateRule && <p className="rule mono">Rule: {node.gateRule}</p>}
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default Lab;
