import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type CSSProperties } from "react";
import type { Flow, Outcome, Scenario, SimEdge, SimNode } from "@/data/flowLab/types";

interface FlowCanvasProps {
  scenario: Scenario;
  flow: Flow;
  stepIndex: number;
  progress: number;
  highlightedEdgeId: string | null;
  reducedMotion: boolean;
  onSelectNode: (node: SimNode) => void;
}

export interface FlowCanvasHandle {
  updatePacketPosition: (stepIndex: number, progress: number) => void;
}

const GLYPH: Record<SimNode["role"], "circle" | "square" | "server" | "database" | "gate"> = {
  client: "circle",
  edge: "square",
  compute: "server",
  storage: "database",
  state: "server",
  control: "circle",
  gate: "gate",
};

const curveFor = (edge: SimEdge, nodes: Map<string, SimNode>, positions: Record<string, { x: number; y: number }>) => {
  const from = positions[edge.from];
  const to = positions[edge.to];
  if (!from || !to || !nodes.has(edge.from) || !nodes.has(edge.to)) return "";
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const bend = Math.max(4, Math.min(16, Math.abs(dx + dy) * 0.16));
  const controlX = Math.abs(dx) > Math.abs(dy) ? bend * Math.sign(dx) : 0;
  const controlY = Math.abs(dy) >= Math.abs(dx) ? bend * Math.sign(dy) : 0;
  return `M ${from.x} ${from.y} C ${from.x + controlX} ${from.y + controlY}, ${to.x - controlX} ${to.y - controlY}, ${to.x} ${to.y}`;
};

const NodeGlyph = ({ role }: { role: SimNode["role"] }) => {
  const glyph = GLYPH[role];
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0 text-muted">
      {glyph === "circle" && <circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.3" />}
      {glyph === "square" && <><rect x="5" y="5" width="14" height="14" rx="1" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.2" /></>}
      {glyph === "server" && <><rect x="4" y="5" width="16" height="14" rx="1" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M7 9h10M7 12h7M7 15h9" stroke="currentColor" strokeWidth="1" /></>}
      {glyph === "database" && <><ellipse cx="12" cy="6.5" rx="7" ry="2.5" fill="none" stroke="currentColor" strokeWidth="1.2" /><path d="M5 6.5v11c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-11M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" fill="none" stroke="currentColor" strokeWidth="1.2" /></>}
      {glyph === "gate" && <><path d="M12 3.5 20.5 12 12 20.5 3.5 12 12 3.5Z" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M8.5 12h7" stroke="currentColor" strokeWidth="1.2" /></>}
    </svg>
  );
};

const outcomeMarker: Record<Outcome, string> = {
  ok: "✓",
  cached: "◇",
  retry: "↻",
  blocked: "×",
  error: "×",
};

export const FlowCanvas = forwardRef<FlowCanvasHandle, FlowCanvasProps>(({
  scenario,
  flow,
  stepIndex,
  progress,
  highlightedEdgeId,
  reducedMotion,
  onSelectNode,
}, ref) => {
  const pathRefs = useRef(new Map<string, SVGPathElement>());
  const packetRef = useRef<SVGGElement>(null);
  const currentStep = flow.steps[stepIndex];
  const currentEdge = scenario.edges.find((edge) => edge.id === currentStep?.edgeId);
  const nodes = new Map(scenario.nodes.map((node) => [node.id, node]));
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches,
  );
  const positions = isMobile ? scenario.layout.mobile : scenario.layout.desktop;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const updatePacketPosition = useCallback((nextStepIndex: number, nextProgress: number) => {
    const packet = packetRef.current;
    const nextStep = flow.steps[nextStepIndex];
    const nextEdge = scenario.edges.find((edge) => edge.id === nextStep?.edgeId);
    const path = nextEdge && pathRefs.current.get(nextEdge.id);
    if (!packet || !path || !nextStep) return;

    const length = path.getTotalLength();
    const settledProgress = reducedMotion ? 1 : Math.min(1, Math.max(0, nextProgress));
    const directedProgress = nextStep.direction === "return" ? 1 - settledProgress : settledProgress;
    const point = path.getPointAtLength(length * directedProgress);
    packet.setAttribute("transform", `translate(${point.x} ${point.y})`);
    packet.setAttribute("aria-label", `${outcomeMarker[nextStep.outcome]} ${nextStep.outcome}`);
  }, [flow, scenario, reducedMotion]);

  useImperativeHandle(ref, () => ({ updatePacketPosition }), [updatePacketPosition]);

  useEffect(() => {
    updatePacketPosition(stepIndex, progress);
  }, [currentEdge, currentStep, stepIndex, progress, updatePacketPosition]);

  return (
    <div className="relative overflow-hidden border border-line bg-base/80" role="region" aria-label={`${scenario.title} architecture canvas`}>
      <div
        className="relative aspect-[0.8] w-full md:aspect-[1.5]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(var(--line) / 0.4) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--line) / 0.4) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      >
        <div className="sr-only" role="img" aria-label={`Architecture for ${scenario.title}. ${scenario.nodes.map((node) => `${node.label} ${node.service ?? ""}`).join("; ")}.`} />

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
          {scenario.edges.map((edge) => {
            const d = curveFor(edge, nodes, positions);
            const selected = highlightedEdgeId === edge.id || (!highlightedEdgeId && currentEdge?.id === edge.id);
            const forward = selected && currentStep?.direction === "forward";
            const failure = selected && (currentStep?.outcome === "error" || currentStep?.outcome === "blocked");
            const patterned = edge.kind === "control" || forward;
            return (
              <g key={edge.id}>
                <path
                  ref={(element) => {
                    if (element) pathRefs.current.set(edge.id, element);
                    else pathRefs.current.delete(edge.id);
                  }}
                  d={d}
                  fill="none"
                  stroke={selected ? "rgb(var(--ink))" : "rgb(var(--line-strong))"}
                  strokeWidth={selected ? 0.55 : 0.32}
                  strokeDasharray={edge.ghost ? "0.4 1.2" : failure ? "1 1.5" : patterned ? "1.4 1.2" : undefined}
                  opacity={selected ? 0.95 : edge.ghost ? 0.4 : 0.75}
                  vectorEffect="non-scaling-stroke"
                />
                {edge.label && <title>{edge.label}</title>}
              </g>
            );
          })}
          <g ref={packetRef}>
            {currentStep?.outcome === "blocked" || currentStep?.outcome === "error" ? (
              <><circle r="2.1" fill="rgb(var(--base))" stroke="rgb(var(--ink))" strokeWidth="0.35" /><text x="0" y="0.9" textAnchor="middle" fontSize="2.6" fill="rgb(var(--ink))">×</text></>
            ) : (
              <><circle r="1.35" fill="rgb(var(--base))" stroke="rgb(var(--ink))" strokeWidth="0.4" /><text x="0" y="0.75" textAnchor="middle" fontSize="1.7" fill="rgb(var(--ink))">{currentStep ? outcomeMarker[currentStep.outcome] : "·"}</text></>
            )}
          </g>
        </svg>

        {scenario.nodes.map((node) => {
          const point = positions[node.id];
          const mobilePoint = scenario.layout.mobile[node.id];
          const desktopPoint = scenario.layout.desktop[node.id];
          if (!point || !mobilePoint || !desktopPoint) return null;
          const state = currentStep?.nodeStates?.[node.id];
          const active = currentEdge?.from === node.id || currentEdge?.to === node.id;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => onSelectNode(node)}
              aria-label={`${node.label}${node.service ? `, ${node.service}` : ""}${node.ghost ? `, Not built: ${node.ghost.reason}` : ""}`}
              className={`absolute left-[var(--mobile-x)] top-[var(--mobile-y)] z-10 flex min-h-11 max-w-[34%] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 border bg-base/95 px-1.5 py-2 text-center transition-colors focus-visible:z-20 md:left-[var(--desktop-x)] md:top-[var(--desktop-y)] md:max-w-[18%] ${node.ghost ? "border-dashed border-line-strong opacity-65" : active ? "border-ink" : "border-line-strong hover:border-muted"}`}
              style={{ "--mobile-x": `${mobilePoint.x}%`, "--mobile-y": `${mobilePoint.y}%`, "--desktop-x": `${desktopPoint.x}%`, "--desktop-y": `${desktopPoint.y}%` } as CSSProperties}
            >
              <span className="hidden md:block"><NodeGlyph role={node.role} /></span>
              <span className="min-w-0">
                <span className="meta block whitespace-normal break-words text-[0.52rem] leading-tight text-dim md:text-center">{node.ghost ? "NOT BUILT" : node.label}</span>
                <span className="mt-1 block max-w-[14ch] break-words font-mono text-[0.62rem] leading-tight text-ink md:mt-0 md:text-center">{node.service ?? node.ghost?.reason}</span>
                {state && <span className="meta mt-1 block text-[0.5rem] text-muted md:text-center">{state}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

FlowCanvas.displayName = "FlowCanvas";
