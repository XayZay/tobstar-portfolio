import type { Scenario } from "@/data/flowLab/types";
import { nodeName } from "@/lib/site";
import { Led } from "./bits";

type Props = {
  scenario: Scenario;
  mode: "desktop" | "mobile";
  currentEdge: string | null;
  currentNodes: string[];
  mark: string | null;
  trail: Record<string, string>;
  touched: Set<string>;
  nodeStates: Record<string, string>;
  onNode: (id: string) => void;
};

const f = (n: number) => n.toFixed(2);

/**
 * The lab diagram. Edges are SVG in a viewBox matched to the box's aspect, so
 * curves and the outcome marker stay round; nodes are buttons laid over it.
 */
export const FlowBoard = ({ scenario, mode, currentEdge, currentNodes, mark, trail, touched, nodeStates, onNode }: Props) => {
  const raw = scenario.layout[mode];
  // Phones get a taller board so stacked boxes have room.
  const W = mode === "desktop" ? 150 : 62;
  // On desktop, crop the vertical range to where the nodes actually sit.
  const ys = Object.values(raw).map((p) => p.y);
  const y0 = mode === "desktop" ? Math.max(0, Math.min(...ys) - 9) : 0;
  const y1 = mode === "desktop" ? Math.min(100, Math.max(...ys) + 9) : 100;
  const H = y1 - y0;
  const L: Record<string, { x: number; y: number }> = Object.fromEntries(
    Object.entries(raw).map(([id, p]) => [id, { x: p.x, y: ((p.y - y0) / H) * 100 }]),
  );
  const pt = (id: string) => ({ x: (L[id].x * W) / 100, y: (L[id].y * H) / 100 });

  const paths = scenario.edges
    .filter((e) => L[e.from] && L[e.to])
    .map((e) => {
      const a = pt(e.from);
      const b = pt(e.to);
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const k = len * 0.06;
      const cx = (a.x + b.x) / 2 - (dy / len) * k;
      const cy = (a.y + b.y) / 2 + (dx / len) * k;
      return { e, d: `M${f(a.x)} ${f(a.y)} Q${f(cx)} ${f(cy)} ${f(b.x)} ${f(b.y)}`, mx: 0.25 * a.x + 0.5 * cx + 0.25 * b.x, my: 0.25 * a.y + 0.5 * cy + 0.25 * b.y };
    });
  const cur = paths.find((p) => p.e.id === currentEdge);

  return (
    <div className={mode === "desktop" ? "board-d" : "board-m"} style={{ aspectRatio: `${W} / ${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {paths.map(({ e, d }) => {
          const cls = ["edge"];
          if (e.ghost) cls.push("ghost");
          if (e.kind === "control") cls.push("control");
          if (e.id in trail) cls.push("touched");
          if (e.id === currentEdge) cls.push("current");
          if (trail[e.id] === "blocked" || trail[e.id] === "error") cls.push("blocked");
          return (
            <path key={e.id} className={cls.join(" ")} d={d}>
              {e.label && <title>{e.label}</title>}
            </path>
          );
        })}
        {cur && mark && (
          <g className="packet" transform={`translate(${f(cur.mx)} ${f(cur.my)})`}>
            <circle r="3" />
            <text>{mark}</text>
          </g>
        )}
      </svg>
      {scenario.nodes
        .filter((n) => L[n.id])
        .map((n) => {
          const cls = ["bnode"];
          if (n.ghost) cls.push("ghost");
          if (touched.has(n.id)) cls.push("touched");
          if (currentNodes.includes(n.id)) cls.push("current");
          return (
            <button
              key={n.id}
              type="button"
              className={cls.join(" ")}
              data-state={nodeStates[n.id]}
              style={{ left: `${L[n.id].x}%`, top: `${L[n.id].y}%` }}
              onClick={() => onNode(n.id)}
              aria-label={`${n.label} ${nodeName(n)}${n.ghost ? ", not built" : ""}. Show details`}
            >
              <small>
                {!n.ghost && <Led />}
                {n.ghost ? "Not built" : n.label}
              </small>
              {nodeName(n)}
            </button>
          );
        })}
    </div>
  );
};
