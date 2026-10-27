import type { Step } from "./types";

export const makeStep = (
  id: string,
  edgeId: string,
  focus: string,
  narration: string,
  options: Partial<Step> = {},
): Step => ({
  id,
  edgeId,
  direction: "forward",
  outcome: "ok",
  animMs: 620,
  latencyMs: 24,
  latencyBasis: "illustrative",
  focus,
  narration,
  ...options,
});

export const simpleLayout = (ids: string[]) => ({
  desktop: Object.fromEntries(ids.map((id, index) => [id, { x: 6 + (index % 6) * 17.5, y: index < 6 ? 35 : 70 }])),
  mobile: Object.fromEntries(ids.map((id, index) => [id, { x: 50, y: Math.min(93, 5 + index * (84 / Math.max(1, ids.length - 1))) }])),
});
