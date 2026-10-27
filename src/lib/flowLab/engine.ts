import type { CompiledStep, Flow, PlaybackPosition } from "@/data/flowLab/types";

/** Compile a flow into a deterministic timeline. Speed affects animation time only. */
export const compileFlow = (flow: Flow, speed = 1): CompiledStep[] => {
  if (!Number.isFinite(speed) || speed <= 0) {
    throw new RangeError("Playback speed must be a finite number greater than zero.");
  }

  let cursor = 0;
  return flow.steps.map((step, index) => {
    if (!Number.isFinite(step.animMs) || step.animMs < 0) {
      throw new RangeError(`Step ${step.id} has an invalid animation duration.`);
    }

    const durationMs = step.animMs / speed;
    const compiled = { step, index, startMs: cursor, endMs: cursor + durationMs, durationMs };
    cursor = compiled.endMs;
    return compiled;
  });
};

/** Map elapsed playback time to a stable step boundary and progress value. */
export const getPlaybackPosition = (
  timeline: CompiledStep[],
  elapsedMs: number,
): PlaybackPosition => {
  const safeElapsed = Math.max(0, Number.isFinite(elapsedMs) ? elapsedMs : 0);
  if (timeline.length === 0) {
    return {
      state: "finished",
      currentStepIndex: -1,
      completedStepCount: 0,
      progress: 1,
      elapsedMs: safeElapsed,
    };
  }

  const totalMs = timeline[timeline.length - 1].endMs;
  if (safeElapsed >= totalMs) {
    return {
      state: "finished",
      currentStepIndex: timeline.length - 1,
      completedStepCount: timeline.length,
      progress: 1,
      elapsedMs: totalMs,
    };
  }

  const current = timeline.find((item) => safeElapsed < item.endMs) ?? timeline[0];
  const progress = current.durationMs === 0
    ? 1
    : Math.min(1, Math.max(0, (safeElapsed - current.startMs) / current.durationMs));

  return {
    state: safeElapsed === 0 ? "idle" : "playing",
    currentStepIndex: current.index,
    completedStepCount: timeline.filter((item) => item.endMs <= safeElapsed).length,
    progress,
    elapsedMs: safeElapsed,
  };
};

/** Return the event index to show after a keyboard or button step. */
export const stepIndex = (currentIndex: number, direction: -1 | 1, stepCount: number) => {
  if (stepCount <= 0) return -1;
  return Math.min(stepCount - 1, Math.max(0, currentIndex + direction));
};
