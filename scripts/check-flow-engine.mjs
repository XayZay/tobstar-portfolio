import assert from "node:assert/strict";
import { compileFlow, getPlaybackPosition, stepIndex } from "../src/lib/flowLab/engine.ts";
import { scenario1 } from "../src/data/flowLab/scenario1.ts";
import { scenario2 } from "../src/data/flowLab/scenario2.ts";
import { scenario3 } from "../src/data/flowLab/scenario3.ts";
import { scenario4 } from "../src/data/flowLab/scenario4.ts";
import { scenario5 } from "../src/data/flowLab/scenario5.ts";

const scenarios = [scenario1, scenario2, scenario3, scenario4, scenario5];
const flow = scenario1.flows[0];
const timeline = compileFlow(flow, 2);
const halfStep = flow.steps[0].animMs / 4;

for (const scenario of scenarios) {
  const nodeIds = new Set(scenario.nodes.map(({ id }) => id));
  const edgeIds = new Set(scenario.edges.map(({ id }) => id));
  for (const edge of scenario.edges) {
    assert.ok(nodeIds.has(edge.from), `Unknown source node on ${scenario.id}/${edge.id}`);
    assert.ok(nodeIds.has(edge.to), `Unknown target node on ${scenario.id}/${edge.id}`);
  }
  for (const candidateFlow of scenario.flows) {
    assert.ok(candidateFlow.steps.length > 0, `Flow ${scenario.id}/${candidateFlow.id} has no steps`);
    for (const candidateStep of candidateFlow.steps) {
      assert.ok(edgeIds.has(candidateStep.edgeId), `Unknown edge on ${scenario.id}/${candidateStep.id}`);
      assert.ok(candidateStep.latencyMs >= 0, `Negative timing on ${scenario.id}/${candidateStep.id}`);
      if (candidateStep.latencyBasis === "lab") {
        assert.ok(scenario.id === "serverless-products-api" && [4, 29].includes(candidateStep.latencyMs), `Unexpected observed timing on ${scenario.id}/${candidateStep.id}`);
      }
    }
  }
}

assert.equal(timeline.length, flow.steps.length);
assert.equal(timeline[0].startMs, 0);
assert.equal(timeline[0].durationMs, flow.steps[0].animMs / 2);
assert.equal(timeline[1].startMs, timeline[0].endMs);
assert.equal(getPlaybackPosition(timeline, halfStep).currentStepIndex, 0);
assert.equal(getPlaybackPosition(timeline, halfStep).progress, 0.5);
assert.equal(getPlaybackPosition(timeline, timeline.at(-1).endMs).state, "finished");
assert.equal(getPlaybackPosition([], 0).currentStepIndex, -1);
assert.equal(stepIndex(0, -1, flow.steps.length), 0);
assert.equal(stepIndex(0, 1, flow.steps.length), 1);
assert.throws(() => compileFlow(flow, 0), RangeError);

console.log(`Flow engine check passed for ${scenarios.length} scenarios and ${scenarios.reduce((sum, item) => sum + item.flows.length, 0)} flows (${timeline.length} primary-route timing steps).`);
