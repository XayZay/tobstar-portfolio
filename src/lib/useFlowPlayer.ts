import { useEffect, useMemo, useState } from "react";
import type { Scenario } from "@/data/flowLab/types";
import { outcomeMark } from "./site";

/**
 * Steps through one scenario's flows. A flow is a scripted sequence of hops
 * across the diagram; nothing here talks to real infrastructure.
 */
export function useFlowPlayer(scenario: Scenario) {
  const [flowIdx, setFlowIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);

  const flow = scenario.flows[flowIdx];
  const last = flow.steps.length - 1;
  const done = stepIdx >= last;

  const nodes = useMemo(() => Object.fromEntries(scenario.nodes.map((n) => [n.id, n])), [scenario]);
  const edges = useMemo(() => Object.fromEntries(scenario.edges.map((e) => [e.id, e])), [scenario]);

  useEffect(() => {
    if (!playing) return;
    if (stepIdx >= last) {
      setPlaying(false);
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => setStepIdx((i) => i + 1), stepIdx < 0 ? 0 : reduced ? 2600 : 1700);
    return () => window.clearTimeout(t);
  }, [playing, stepIdx, last]);

  const current = useMemo(() => {
    const s = flow.steps[stepIdx];
    if (!s) return null;
    const e = edges[s.edgeId];
    const [from, to] = s.direction === "return" ? [e.to, e.from] : [e.from, e.to];
    return { ...s, index: stepIdx, from: nodes[from], to: nodes[to], outcome: outcomeMark[s.outcome] };
  }, [flow, stepIdx, edges, nodes]);

  /** Edge id -> latest outcome on that edge, for every hop taken so far. */
  const trail = useMemo(() => {
    const m: Record<string, string> = {};
    for (let i = 0; i <= stepIdx; i++) m[flow.steps[i].edgeId] = flow.steps[i].outcome;
    return m;
  }, [flow, stepIdx]);

  /** Nodes reached so far, and any health state a step has set on them. */
  const { touched, nodeStates } = useMemo(() => {
    const t = new Set<string>();
    const ns: Record<string, string> = {};
    for (let i = 0; i <= stepIdx; i++) {
      const s = flow.steps[i];
      const e = edges[s.edgeId];
      t.add(e.from);
      t.add(e.to);
      Object.assign(ns, s.nodeStates ?? {});
    }
    return { touched: t, nodeStates: ns };
  }, [flow, stepIdx, edges]);

  return {
    flow,
    flowIdx,
    stepIdx,
    playing,
    done,
    current,
    trail,
    touched,
    nodeStates,
    setFlow: (i: number) => {
      setPlaying(false);
      setFlowIdx(i);
      setStepIdx(-1);
    },
    next: () => setStepIdx((i) => Math.min(i + 1, last)),
    prev: () => {
      setPlaying(false);
      setStepIdx((i) => Math.max(i - 1, -1));
    },
    reset: () => {
      setPlaying(false);
      setStepIdx(-1);
    },
    togglePlay: () => {
      if (playing) return setPlaying(false);
      if (done) setStepIdx(-1);
      setPlaying(true);
    },
  };
}
