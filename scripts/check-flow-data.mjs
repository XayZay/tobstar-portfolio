import assert from "node:assert/strict";
import { scenarios } from "../src/data/flowLab/index.ts";

// Every edge, step and layout entry must point at something that exists,
// so the Flow Lab never renders a hop to nowhere.
for (const scenario of scenarios) {
  const nodeIds = new Set(scenario.nodes.map(({ id }) => id));
  const edgeIds = new Set(scenario.edges.map(({ id }) => id));
  for (const edge of scenario.edges) {
    assert.ok(nodeIds.has(edge.from), `Unknown source node on ${scenario.id}/${edge.id}`);
    assert.ok(nodeIds.has(edge.to), `Unknown target node on ${scenario.id}/${edge.id}`);
  }
  for (const mode of ["desktop", "mobile"]) {
    for (const id of nodeIds) assert.ok(scenario.layout[mode][id], `No ${mode} position for ${scenario.id}/${id}`);
  }
  assert.ok(scenario.flows.length > 0, `Scenario ${scenario.id} has no flows`);
  for (const flow of scenario.flows) {
    assert.ok(flow.steps.length > 0, `Flow ${scenario.id}/${flow.id} has no steps`);
    for (const step of flow.steps) {
      assert.ok(edgeIds.has(step.edgeId), `Unknown edge on ${scenario.id}/${step.id}`);
      for (const id of Object.keys(step.nodeStates ?? {})) assert.ok(nodeIds.has(id), `Unknown node state on ${scenario.id}/${step.id}`);
    }
  }
}

console.log(`Flow Lab data check passed for ${scenarios.length} scenarios and ${scenarios.reduce((sum, s) => sum + s.flows.length, 0)} flows.`);
