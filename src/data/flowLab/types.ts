export type Role = "client" | "edge" | "compute" | "storage" | "state" | "control" | "gate";
export type Outcome = "ok" | "cached" | "retry" | "blocked" | "error";
export type FlowBasis = "performed" | "illustrative";
export type LatencyBasis = "lab" | "illustrative";

export interface SimNode {
  id: string;
  role: Role;
  label: string;
  service?: string;
  explainer: {
    what: string;
    why: string;
    alternative?: string;
    security?: string;
  };
  gateRule?: string;
  ghost?: { reason: string };
}

export interface SimEdge {
  id: string;
  from: string;
  to: string;
  kind: "data" | "control";
  label?: string;
  ghost?: boolean;
}

export interface Step {
  id: string;
  edgeId: string;
  direction: "forward" | "return";
  outcome: Outcome;
  animMs: number;
  latencyMs: number;
  latencyBasis: LatencyBasis;
  focus: string;
  narration: string;
  nodeStates?: Record<string, "active" | "healthy" | "unhealthy" | "idle">;
  log?: { method?: string; target?: string; status?: string | number; note: string };
}

export interface Flow {
  id: string;
  title: string;
  basis: FlowBasis;
  takeaway: string;
  observedNotes?: string[];
  steps: Step[];
}

export interface Scenario {
  id: string;
  title: string;
  summary: string;
  provenance: { lab: string; label: string; href?: string };
  nodes: SimNode[];
  edges: SimEdge[];
  layout: {
    desktop: Record<string, { x: number; y: number }>;
    mobile: Record<string, { x: number; y: number }>;
  };
  flows: Flow[];
}

export interface CompiledStep {
  step: Step;
  index: number;
  startMs: number;
  endMs: number;
  durationMs: number;
}

export interface PlaybackPosition {
  state: "idle" | "playing" | "finished";
  currentStepIndex: number;
  completedStepCount: number;
  progress: number;
  elapsedMs: number;
}
