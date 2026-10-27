import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { scenarios } from "@/data/flowLab";
import type { Flow, Scenario, SimNode } from "@/data/flowLab/types";
import { compileFlow, getPlaybackPosition, stepIndex } from "@/lib/flowLab/engine";
import { FlowCanvas, type FlowCanvasHandle } from "./FlowCanvas";

interface FlowLabPlayerProps {
  requestedScenarioId?: string | null;
  onScenarioOpened?: () => void;
}

const basisText = (basis: Flow["basis"]) => basis === "performed" ? "Performed in lab" : "Illustrative behaviour";

const statusMarker: Record<Flow["steps"][number]["outcome"], string> = {
  ok: "✓",
  cached: "◇",
  retry: "↻",
  blocked: "×",
  error: "×",
};

interface LogEntry {
  id: string;
  edgeId: string;
  text: string;
}

const logLine = (step: Flow["steps"][number]) => {
  const parts = [
    [step.log?.method, step.log?.target].filter(Boolean).join(" ") || step.focus,
    step.log?.status ?? statusMarker[step.outcome],
    `${step.latencyMs} ms`,
    step.latencyBasis === "lab" ? "Observed in lab" : "illustrative",
  ];
  return parts.join(" · ");
};

const NodeExplainer = ({ node, onClose }: { node: SimNode; onClose: () => void }) => {
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => closeRef.current?.focus(), []);

  const trapFocus = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab" || !dialogRef.current) return;
    const items = [...dialogRef.current.querySelectorAll<HTMLElement>("button, a[href], select, [tabindex]:not([tabindex='-1'])")];
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
  <div className="fixed inset-0 z-[80] flex items-end justify-center bg-base/80 p-4 backdrop-blur-sm md:items-center" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={dialogRef} onKeyDown={trapFocus} role="dialog" aria-modal="true" aria-labelledby="node-explainer-title" className="w-full max-w-xl border border-line-strong bg-raised p-6 shadow-2xl md:p-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="meta text-dim">{node.ghost ? "Not built" : node.label}</p>
          <h3 id="node-explainer-title" className="mt-3 text-2xl font-medium text-ink">{node.service ?? node.label}</h3>
        </div>
        <button ref={closeRef} type="button" onClick={onClose} className="min-h-11 min-w-11 border border-line-strong text-lg text-muted hover:text-ink" aria-label="Close explainer">×</button>
      </div>
      {node.ghost && <p className="meta mt-5 text-muted">Not built — {node.ghost.reason}</p>}
      <dl className="mt-7 space-y-5">
        <div><dt className="meta text-dim">What it is</dt><dd className="mt-2 text-sm leading-relaxed text-ink">{node.explainer.what}</dd></div>
        <div><dt className="meta text-dim">Why it is used here</dt><dd className="mt-2 text-sm leading-relaxed text-muted">{node.explainer.why}</dd></div>
        {node.explainer.alternative && <div><dt className="meta text-dim">Alternative</dt><dd className="mt-2 text-sm leading-relaxed text-muted">{node.explainer.alternative}</dd></div>}
        {(node.gateRule || node.explainer.security) && <div><dt className="meta text-dim">Security</dt><dd className="mt-2 text-sm leading-relaxed text-muted">{node.gateRule ?? node.explainer.security}</dd></div>}
      </dl>
    </section>
  </div>
  );
};

const FlowLabPlayer = ({ requestedScenarioId, onScenarioOpened }: FlowLabPlayerProps) => {
  const [scenarioId, setScenarioId] = useState(scenarios[0]?.id ?? "");
  const scenario: Scenario = scenarios.find((item) => item.id === scenarioId) ?? scenarios[0];
  const [flowId, setFlowId] = useState(scenario.flows[0]?.id ?? "");
  const flow = scenario.flows.find((item) => item.id === flowId) ?? scenario.flows[0];
  const timeline = useMemo(() => {
    const selectedScenario = scenarios.find((item) => item.id === scenarioId) ?? scenarios[0];
    const selectedFlow = selectedScenario.flows.find((item) => item.id === flowId) ?? selectedScenario.flows[0];
    return compileFlow(selectedFlow);
  }, [scenarioId, flowId]);
  const totalMs = timeline.at(-1)?.endMs ?? 0;
  const [elapsedMs, setElapsedMs] = useState(0);
  const elapsedRef = useRef(0);
  const [speed, setSpeed] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [ambient, setAmbient] = useState(false);
  const [waitingBetweenLoops, setWaitingBetweenLoops] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [explicitPlayback, setExplicitPlayback] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(() => typeof document !== "undefined" && !document.hidden);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [activeNode, setActiveNode] = useState<SimNode | null>(null);
  const [highlightedEdgeId, setHighlightedEdgeId] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches);
  const canvasAreaRef = useRef<HTMLDivElement>(null);
  const canvasControllerRef = useRef<FlowCanvasHandle>(null);
  const nodeTriggerRef = useRef<HTMLElement | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const logAtBottomRef = useRef(true);
  const loggedStepCountRef = useRef(0);
  const position = useMemo(() => getPlaybackPosition(timeline, elapsedMs), [timeline, elapsedMs]);
  const currentStep = flow.steps[position.currentStepIndex] ?? flow.steps[0];

  const setElapsed = useCallback((value: number) => {
    elapsedRef.current = value;
    setElapsedMs(value);
  }, []);

  const stopAmbientForInteraction = useCallback(() => {
    setInteracted(true);
    if (ambient) setPlaying(false);
    setAmbient(false);
    setWaitingBetweenLoops(false);
  }, [ambient]);

  useEffect(() => {
    if (!requestedScenarioId) return;
    if (scenarios.some((item) => item.id === requestedScenarioId)) setScenarioId(requestedScenarioId);
    onScenarioOpened?.();
  }, [requestedScenarioId, onScenarioOpened]);

  useEffect(() => {
    const first = scenarios.find((item) => item.id === scenarioId) ?? scenarios[0];
    setFlowId(first.flows[0]?.id ?? "");
  }, [scenarioId]);

  useEffect(() => {
    loggedStepCountRef.current = 0;
    setElapsed(0);
    setPlaying(false);
    setLogs([]);
    setHighlightedEdgeId(null);
    setActiveNode(null);
  }, [scenarioId, flowId, setElapsed]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setSectionVisible(entry.isIntersecting && entry.intersectionRatio >= 0.5),
      { threshold: [0, 0.5, 1] },
    );
    if (canvasAreaRef.current) observer.observe(canvasAreaRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setDocumentVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    if ((!sectionVisible || !documentVisible || reducedMotion) && playing) setPlaying(false);
    if (sectionVisible && documentVisible && !reducedMotion && !interacted) setAmbient(true);
  }, [sectionVisible, documentVisible, reducedMotion, interacted, playing]);

  useEffect(() => {
    if (ambient && sectionVisible && documentVisible && !reducedMotion && !waitingBetweenLoops && position.state !== "finished") {
      setPlaying(true);
    }
  }, [ambient, sectionVisible, documentVisible, reducedMotion, waitingBetweenLoops, position.state]);

  useEffect(() => {
    if (position.state !== "finished" || !ambient || !sectionVisible || !documentVisible) return;
    setPlaying(false);
    setWaitingBetweenLoops(true);
    const timer = window.setTimeout(() => {
      loggedStepCountRef.current = 0;
      setElapsed(0);
      setWaitingBetweenLoops(false);
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [position.state, ambient, sectionVisible, documentVisible, setElapsed]);

  useEffect(() => {
    if (!playing || !sectionVisible || !documentVisible || totalMs <= 0) return;
    let previous = performance.now();
    let frame = 0;
    let completedCount = getPlaybackPosition(timeline, elapsedRef.current).completedStepCount;
    const tick = (now: number) => {
      const next = Math.min(totalMs, elapsedRef.current + (now - previous) * speed);
      previous = now;
      elapsedRef.current = next;
      const nextPosition = getPlaybackPosition(timeline, next);
      canvasControllerRef.current?.updatePacketPosition(nextPosition.currentStepIndex, nextPosition.progress);
      if (nextPosition.completedStepCount !== completedCount || nextPosition.state === "finished") {
        completedCount = nextPosition.completedStepCount;
        setElapsedMs(next);
      }
      if (next >= totalMs) {
        setElapsedMs(totalMs);
        setPlaying(false);
      } else {
        frame = window.requestAnimationFrame(tick);
      }
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [playing, sectionVisible, documentVisible, totalMs, speed, setElapsed, timeline]);

  useEffect(() => {
    if (position.completedStepCount <= loggedStepCountRef.current) return;
    const completed = flow.steps.slice(loggedStepCountRef.current, position.completedStepCount);
    loggedStepCountRef.current = position.completedStepCount;
    const additions = completed.map((item, index) => ({
      id: `${item.id}-${position.completedStepCount}-${index}`,
      edgeId: item.edgeId,
      text: logLine(item),
    }));
    setLogs((previous) => [...previous, ...additions].slice(-50));
  }, [position.completedStepCount, flow]);

  useEffect(() => {
    if (logAtBottomRef.current && logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const play = () => {
    stopAmbientForInteraction();
    setExplicitPlayback(true);
    if (position.state === "finished") setElapsed(0);
    setPlaying(true);
  };

  const pause = () => {
    stopAmbientForInteraction();
    setExplicitPlayback(true);
    setPlaying(false);
  };

  const restart = () => {
    stopAmbientForInteraction();
    setExplicitPlayback(true);
    loggedStepCountRef.current = 0;
    setLogs([]);
    setElapsed(0);
    setPlaying(false);
  };

  const step = (direction: -1 | 1) => {
    stopAmbientForInteraction();
    setExplicitPlayback(true);
    setPlaying(false);
    if (direction > 0 && position.currentStepIndex >= flow.steps.length - 1) {
      setElapsed(totalMs);
      return;
    }
    const nextIndex = stepIndex(position.currentStepIndex, direction, flow.steps.length);
    setElapsed(timeline[nextIndex]?.startMs ?? 0);
  };

  const changeScenario = (id: string) => {
    stopAmbientForInteraction();
    setScenarioId(id);
  };

  const changeFlow = (id: string) => {
    stopAmbientForInteraction();
    setFlowId(id);
  };

  const onKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLElement && event.target.closest("select, input, textarea, [contenteditable=true]")) return;
    if (event.key === " ") {
      if (event.target instanceof HTMLElement && event.target.closest("button")) return;
      event.preventDefault();
      if (playing) pause();
      else play();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "Escape") {
      setActiveNode(null);
    }
  };

  const maxLatency = Math.max(1, ...flow.steps.map((item) => item.latencyMs));

  return (
    <div className="mt-12" onKeyDown={onKeyboard} onPointerDownCapture={stopAmbientForInteraction} onFocusCapture={stopAmbientForInteraction}>
      <div className="grid min-w-0 grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-y-12">
        <section className="order-1 min-w-0 lg:col-start-2 lg:row-start-1" aria-label="Scenario and flow selection">
          <div className="border-t border-line-strong pt-5">
            <p className="meta text-dim">Scenarios</p>
            <div className="mt-4 grid grid-cols-1 gap-2" role="group" aria-label="Flow scenarios">
              {scenarios.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={item.id === scenarioId}
                  onClick={() => changeScenario(item.id)}
                  className={`min-h-11 w-full whitespace-normal break-words border px-3 py-2 text-left text-xs leading-relaxed transition-colors ${item.id === scenarioId ? "border-ink text-ink" : "border-line-strong text-muted hover:border-muted hover:text-ink"}`}
                >
                  {item.title}
                </button>
              ))}
            </div>

            <label className="meta mt-7 block text-dim" htmlFor="flow-select">Flow</label>
            <select
              id="flow-select"
              value={flow.id}
              onChange={(event) => changeFlow(event.target.value)}
              className="mt-3 min-h-11 w-full border border-line-strong bg-base px-3 text-sm text-ink"
            >
              {scenario.flows.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>

            <div className="mt-7 flex flex-wrap gap-2">
              <span className="meta max-w-full whitespace-normal break-words border border-line-strong px-2.5 py-2 leading-relaxed text-muted">Built in: {scenario.provenance.lab}</span>
              <span className="meta max-w-full whitespace-normal break-words border border-dashed border-line-strong px-2.5 py-2 leading-relaxed text-dim">{scenario.provenance.label}</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="meta border border-line-strong px-2.5 py-2 text-muted">{basisText(flow.basis)}</span>
              <span className="meta text-dim">{position.currentStepIndex + 1} / {flow.steps.length}</span>
            </div>
            {flow.observedNotes?.map((note) => (
              <p key={note} className="mt-4 border-l border-line-strong pl-3 text-xs leading-relaxed text-muted">
                <span className="meta mr-2 text-dim">Observed in lab</span>{note}
              </p>
            ))}
          </div>
        </section>

        <section className="order-2 min-w-0 lg:col-start-1 lg:row-span-2 lg:row-start-1" aria-label="Simulated architecture playback">
          <div ref={canvasAreaRef}>
            <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="meta border border-line-strong px-2.5 py-2 text-muted">Simulation</span>
              <p className="min-w-0 flex-1 text-xs leading-relaxed text-dim">Every request shown here is scripted; no lab resources are running.</p>
            </div>
            <FlowCanvas
              ref={canvasControllerRef}
              scenario={scenario}
              flow={flow}
              stepIndex={position.currentStepIndex}
              progress={position.progress}
              highlightedEdgeId={highlightedEdgeId}
              reducedMotion={reducedMotion}
              onSelectNode={(node) => {
                nodeTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
                setActiveNode(node);
              }}
            />
          </div>
          {scenario.nodes.some((node) => node.ghost) && (
            <ul className="mt-4 space-y-2 border-t border-line pt-4">
              {scenario.nodes.filter((node) => node.ghost).map((node) => (
                <li key={node.id} className="text-xs leading-relaxed text-dim">
                  <span className="meta mr-2 text-muted">Not built</span>— {node.ghost?.reason}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3" aria-label="Playback controls">
            <button type="button" onClick={playing ? pause : play} className="min-h-11 min-w-11 border border-line-strong px-4 text-sm text-ink hover:border-ink" aria-label={playing ? "Pause flow" : "Play flow"}>
              {playing ? "Pause" : "Play"}
            </button>
            <button type="button" onClick={restart} className="min-h-11 min-w-11 border border-line px-3 text-sm text-muted hover:border-line-strong hover:text-ink" aria-label="Restart flow">Restart</button>
            <button type="button" onClick={() => step(-1)} className="min-h-11 min-w-11 border border-line px-3 text-sm text-muted hover:border-line-strong hover:text-ink" aria-label="Step back">← Step back</button>
            <button type="button" onClick={() => step(1)} className="min-h-11 min-w-11 border border-line px-3 text-sm text-muted hover:border-line-strong hover:text-ink" aria-label="Step forward">Step forward →</button>
            <label htmlFor="flow-speed" className="meta ml-auto text-dim">Speed</label>
            <select
              id="flow-speed"
              aria-label="Playback speed"
              value={speed}
              onChange={(event) => { stopAmbientForInteraction(); setSpeed(Number(event.target.value)); }}
              className="min-h-11 border border-line bg-base px-3 text-sm text-ink"
            >
              <option value={0.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option>
            </select>
          </div>
          <p className="meta mt-3 text-dim">Space play/pause · ← / → step · click a node to inspect</p>
        </section>

        <section className="order-3 lg:col-start-2 lg:row-start-2" aria-label="Flow narration and request log">
          <div className="border-t border-line-strong pt-5">
            <p className="meta text-dim">Current focus</p>
            <h3 className="mt-3 text-lg font-medium text-ink">{currentStep?.focus ?? flow.title}</h3>
            <p className="mt-3 text-sm leading-[1.75] text-muted" aria-live={explicitPlayback ? "polite" : "off"}>
              {currentStep?.narration ?? flow.takeaway}
            </p>
            <p className="mt-5 border-t border-line pt-4 text-sm leading-[1.75] text-ink">{flow.takeaway}</p>
          </div>

          <details className="mt-8 border-t border-line pt-5" open={!isMobile}>
            <summary className="meta min-h-11 cursor-pointer py-2 text-dim">Request log</summary>
            <div
              ref={logRef}
              onScroll={(event) => {
                const target = event.currentTarget;
                logAtBottomRef.current = target.scrollTop + target.clientHeight >= target.scrollHeight - 28;
              }}
              className="mt-3 max-h-56 overflow-y-auto border border-line bg-base p-3 font-mono text-xs leading-relaxed text-muted"
              aria-label="Text transcript of completed flow steps"
            >
              {logs.length === 0 ? (
                <p className="text-dim">Waiting for the first step.</p>
              ) : (
                <ol className="space-y-2">
                  {logs.map((line, i) => (
                    <li
                      key={line.id}
                      onMouseEnter={() => setHighlightedEdgeId(line.edgeId)}
                      onMouseLeave={() => setHighlightedEdgeId(null)}
                      onFocus={() => setHighlightedEdgeId(line.edgeId)}
                      onBlur={() => setHighlightedEdgeId(null)}
                      tabIndex={0}
                      className="rounded-sm px-1 py-0.5 focus-visible:outline"
                    >
                      <span aria-hidden="true" className="mr-2 text-ink">{i + 1}.</span>{line.text}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </details>
        </section>

        <section className="order-4 border-t border-line pt-5 lg:col-span-2" aria-labelledby="waterfall-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 id="waterfall-heading" className="meta text-dim">Latency waterfall</h3>
            <p className="text-xs text-dim">Timings are illustrative unless marked Observed in lab.</p>
          </div>
          <div className="mt-5 overflow-x-auto pb-2" aria-label="Illustrative latency per flow step">
            <ol className="flex min-w-max items-end gap-2">
              {flow.steps.map((item, index) => (
                <li key={item.id} className="flex w-24 shrink-0 flex-col items-center gap-2 text-center">
                  <span className="font-mono text-[0.65rem] text-muted">{item.latencyMs} ms</span>
                  <span className={`w-full border border-line-strong bg-raised ${index === position.currentStepIndex ? "outline outline-1 outline-ink" : ""}`} style={{ height: `${Math.max(6, (item.latencyMs / maxLatency) * 48)}px` }} />
                  <span className="line-clamp-2 text-[0.625rem] leading-tight text-dim">{item.focus}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>

      {activeNode && <NodeExplainer node={activeNode} onClose={() => { setActiveNode(null); nodeTriggerRef.current?.focus(); }} />}
    </div>
  );
};

export default FlowLabPlayer;
