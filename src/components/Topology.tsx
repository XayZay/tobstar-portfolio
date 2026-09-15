/**
 * Hero visual: an abstract thin-line topology — edge, compute, storage.
 * Deliberately generic. It is not a claim about any specific deployment.
 *
 * Label styling is applied via attributes rather than the `.meta` class, so the
 * CSS font-size doesn't override the SVG user-unit sizing.
 */
const LABEL = {
  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
  fontSize: 9,
  letterSpacing: 1.4,
  textAnchor: "middle" as const,
};

export const Topology = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 420 300"
    fill="none"
    role="img"
    aria-label="Abstract diagram of a network topology: a client reaching an edge layer, which connects to compute nodes, a state store and object storage."
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

    {/* animated packet flow along the primary path */}
    <g stroke="rgb(var(--accent))" strokeWidth="1.5" strokeLinecap="round" opacity="0.9">
      <path className="flow-dash" d="M62 150 H196" />
      <path className="flow-dash" d="M244 150 C 280 150, 285 92, 322 92" />
    </g>

    {/* client */}
    <g>
      <circle cx="46" cy="150" r="7" fill="rgb(var(--base))" stroke="rgb(var(--line-strong))" strokeWidth="1.25" />
      <circle cx="46" cy="150" r="2.5" fill="rgb(var(--muted))" />
      <text x="46" y="176" {...LABEL} fill="rgb(var(--dim))">
        CLIENT
      </text>
    </g>

    {/* edge */}
    <g>
      <rect x="136" y="136" width="28" height="28" rx="2" fill="rgb(var(--base))" stroke="rgb(var(--line-strong))" strokeWidth="1.25" />
      <path d="M144 150 h12 M150 144 v12" stroke="rgb(var(--muted))" strokeWidth="1.1" strokeLinecap="round" />
      <text x="150" y="182" {...LABEL} fill="rgb(var(--dim))">
        EDGE
      </text>
    </g>

    {/* compute */}
    <g>
      <rect x="196" y="130" width="48" height="40" rx="2" fill="rgb(var(--raised))" stroke="rgb(var(--accent))" strokeWidth="1.25" />
      <g stroke="rgb(var(--accent))" strokeWidth="1" opacity="0.75">
        <line x1="206" y1="142" x2="234" y2="142" />
        <line x1="206" y1="150" x2="228" y2="150" />
        <line x1="206" y1="158" x2="231" y2="158" />
      </g>
      <text x="220" y="188" {...LABEL} fill="rgb(var(--muted))">
        COMPUTE
      </text>
    </g>

    {/* storage */}
    <g>
      <ellipse cx="344" cy="86" rx="22" ry="6" fill="rgb(var(--base))" stroke="rgb(var(--line-strong))" strokeWidth="1.25" />
      <path d="M322 86 v14 c0 3.3 9.8 6 22 6 s22 -2.7 22 -6 V86" fill="rgb(var(--base))" stroke="rgb(var(--line-strong))" strokeWidth="1.25" />
      <text x="344" y="126" {...LABEL} fill="rgb(var(--dim))">
        STORAGE
      </text>
    </g>

    {/* state */}
    <g>
      <rect x="326" y="196" width="36" height="28" rx="2" fill="rgb(var(--base))" stroke="rgb(var(--line-strong))" strokeWidth="1.25" />
      <g stroke="rgb(var(--dim))" strokeWidth="1">
        <line x1="334" y1="206" x2="354" y2="206" />
        <line x1="334" y1="214" x2="348" y2="214" />
      </g>
      <text x="344" y="242" {...LABEL} fill="rgb(var(--dim))">
        STATE
      </text>
    </g>
  </svg>
);
