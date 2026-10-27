import { useEffect, useRef } from "react";
import type { HeroFrame } from "@/data/flowLab/heroFrames";

/**
 * Compact, blueprint-style teaser for the lab architectures. It shows only
 * generic role bindings from the small hero frame module, never live resources.
 */
const LABEL = {
  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
  fontSize: 9,
  letterSpacing: 1.4,
  textAnchor: "middle" as const,
};

const ROLE_POINTS = {
  client: { x: 62, y: 150 },
  edge: { x: 150, y: 150 },
  gate: { x: 184, y: 108 },
  compute: { x: 244, y: 150 },
  storage: { x: 344, y: 86 },
  state: { x: 344, y: 210 },
  control: { x: 96, y: 236 },
} as const;

const subLabel = (frame: HeroFrame, role: keyof HeroFrame["bindings"]) => frame.bindings[role];

export const Topology = ({ frame, paused, reducedMotion, className = "" }: {
  frame: HeroFrame;
  paused: boolean;
  reducedMotion: boolean;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const routePath = frame.route
    .map((role) => ROLE_POINTS[role])
    .filter(Boolean)
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const firstPoint = ROLE_POINTS[frame.route[0]] ?? ROLE_POINTS.client;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (paused) svg.pauseAnimations();
    else svg.unpauseAnimations();
  }, [paused, frame.scenarioId]);

  return (
  <svg
    ref={svgRef}
    viewBox="0 0 420 300"
    fill="none"
    role="img"
    aria-label={`Simulated architecture teaser: ${frame.focusTitle}. ${frame.route.join(" to ")}.`}
    preserveAspectRatio="xMidYMid meet"
    className={className}
  >
    {/* faint grid */}
    <g stroke="rgb(var(--line))" strokeWidth="1" opacity="0.55">
      {[60, 120, 180, 240].map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="420" y2={y} />
      ))}
      {[105, 210, 315].map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="300" />
      ))}
    </g>

    {/* edges */}
    <g stroke="rgb(var(--line-strong))" strokeWidth="1.25" strokeLinecap="round">
      <path d="M62 150 H150" />
      <path d="M150 150 H196" />
      <path d="M244 150 C 280 150, 285 92, 322 92" />
      <path d="M244 150 C 280 150, 285 210, 322 210" />
      <path d="M322 92 V 210" strokeDasharray="2 6" opacity="0.7" />
    </g>

    {/* The packet route changes with the teaser frame. The SVG timeline pauses
        offscreen, on hover/focus, and while the tab is hidden. */}
    <path
      d={routePath}
      fill="none"
      stroke="rgb(var(--accent))"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="3 7"
      className="flow-dash"
      style={{ animationPlayState: paused ? "paused" : "running" }}
    />
    {!reducedMotion ? (
      <circle r="2.8" fill="rgb(var(--accent))">
        <animateMotion dur="3.5s" repeatCount="indefinite" path={routePath} />
      </circle>
    ) : (
      <circle cx={firstPoint.x} cy={firstPoint.y} r="2.8" fill="rgb(var(--accent))" />
    )}

    {/* client */}
    <g opacity={frame.route.includes("client") ? 1 : 0.5}>
      <circle cx="46" cy="150" r="7" fill="rgb(var(--base))" stroke="rgb(var(--line-strong))" strokeWidth="1.25" />
      <circle cx="46" cy="150" r="2.5" fill="rgb(var(--muted))" />
      <text x="46" y="176" {...LABEL} fill="rgb(var(--dim))">
        CLIENT
      </text>
      {subLabel(frame, "client") && <text x="46" y="188" {...LABEL} fontSize="7" letterSpacing="0.6" fill="rgb(var(--muted))">{subLabel(frame, "client")}</text>}
    </g>

    {/* edge */}
    <g opacity={frame.route.includes("edge") ? 1 : 0.5}>
      <rect x="136" y="136" width="28" height="28" rx="2" fill="rgb(var(--base))" stroke="rgb(var(--line-strong))" strokeWidth="1.25" />
      <path d="M144 150 h12 M150 144 v12" stroke="rgb(var(--muted))" strokeWidth="1.1" strokeLinecap="round" />
      <text x="150" y="182" {...LABEL} fill="rgb(var(--dim))">
        EDGE
      </text>
      {subLabel(frame, "edge") && <text x="150" y="194" {...LABEL} fontSize="7" letterSpacing="0.6" fill="rgb(var(--muted))">{subLabel(frame, "edge")}</text>}
    </g>

    {subLabel(frame, "gate") && <g opacity={frame.route.includes("gate") ? 1 : 0.5}>
      <path d="M184 98 194 108 184 118 174 108 184 98Z" fill="rgb(var(--base))" stroke="rgb(var(--line-strong))" strokeWidth="1.1" />
      <path d="M180 108h8" stroke="rgb(var(--muted))" strokeWidth="1" />
      <text x="184" y="132" {...LABEL} fontSize="7.5" fill="rgb(var(--dim))">GATE</text>
      <text x="184" y="143" {...LABEL} fontSize="6.5" letterSpacing="0.4" fill="rgb(var(--muted))">{subLabel(frame, "gate")}</text>
    </g>}

    {/* compute */}
    <g opacity={frame.route.includes("compute") ? 1 : 0.5}>
      <rect x="196" y="130" width="48" height="40" rx="2" fill="rgb(var(--raised))" stroke="rgb(var(--accent))" strokeWidth="1.25" />
      <g stroke="rgb(var(--accent))" strokeWidth="1" opacity="0.75">
        <line x1="206" y1="142" x2="234" y2="142" />
        <line x1="206" y1="150" x2="228" y2="150" />
        <line x1="206" y1="158" x2="231" y2="158" />
      </g>
      <text x="220" y="188" {...LABEL} fill="rgb(var(--muted))">
        COMPUTE
      </text>
      {subLabel(frame, "compute") && <text x="220" y="200" {...LABEL} fontSize="7" letterSpacing="0.6" fill="rgb(var(--muted))">{subLabel(frame, "compute")}</text>}
    </g>

    {/* storage */}
    <g opacity={frame.route.includes("storage") ? 1 : 0.5}>
      <ellipse cx="344" cy="86" rx="22" ry="6" fill="rgb(var(--base))" stroke="rgb(var(--line-strong))" strokeWidth="1.25" />
      <path d="M322 86 v14 c0 3.3 9.8 6 22 6 s22 -2.7 22 -6 V86" fill="rgb(var(--base))" stroke="rgb(var(--line-strong))" strokeWidth="1.25" />
      <text x="344" y="126" {...LABEL} fill="rgb(var(--dim))">
        STORAGE
      </text>
      {subLabel(frame, "storage") && <text x="344" y="138" {...LABEL} fontSize="7" letterSpacing="0.5" fill="rgb(var(--muted))">{subLabel(frame, "storage")}</text>}
    </g>

    {/* state */}
    <g opacity={frame.route.includes("state") ? 1 : 0.5}>
      <rect x="326" y="196" width="36" height="28" rx="2" fill="rgb(var(--base))" stroke="rgb(var(--line-strong))" strokeWidth="1.25" />
      <g stroke="rgb(var(--dim))" strokeWidth="1">
        <line x1="334" y1="206" x2="354" y2="206" />
        <line x1="334" y1="214" x2="348" y2="214" />
      </g>
      <text x="344" y="242" {...LABEL} fill="rgb(var(--dim))">
        STATE
      </text>
      {subLabel(frame, "state") && <text x="344" y="254" {...LABEL} fontSize="7" letterSpacing="0.5" fill="rgb(var(--muted))">{subLabel(frame, "state")}</text>}
    </g>
    {subLabel(frame, "control") && <g opacity={frame.route.includes("control") ? 1 : 0.5}>
      <circle cx="96" cy="236" r="7" fill="rgb(var(--base))" stroke="rgb(var(--line-strong))" strokeWidth="1.2" />
      <path d="M93 236h6M96 233v6" stroke="rgb(var(--muted))" strokeWidth="1" />
      <text x="96" y="258" {...LABEL} fontSize="7.5" fill="rgb(var(--dim))">CONTROL</text>
      <text x="96" y="270" {...LABEL} fontSize="6.5" letterSpacing="0.4" fill="rgb(var(--muted))">{subLabel(frame, "control")}</text>
    </g>}
  </svg>
  );
};
