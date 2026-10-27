import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Section } from "./Section";

const FlowLabPlayer = lazy(() => import("./flowLab/FlowLabPlayer"));

interface FlowLabSectionProps {
  requestedScenarioId: string | null;
  onScenarioOpened: () => void;
}

const RESERVED_SPACE = "min-h-[1680px] md:min-h-[1120px]";

export const FlowLabSection = ({ requestedScenarioId, onScenarioOpened }: FlowLabSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || nearViewport) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "700px 0px", threshold: 0 },
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [nearViewport]);

  return (
    <Section
      id="flow-lab"
      index="01"
      label="Flow Lab"
      title="Follow the request."
      intro="Scripted traffic through architectures I built in hands-on cloud labs. The designs are real; the requests are simulated and the timings are illustrative."
      className="flow-lab-section"
    >
      <div ref={sectionRef} className={`${RESERVED_SPACE} relative`}>
        {nearViewport ? (
          <Suspense fallback={<div role="status" className={`${RESERVED_SPACE} border-t border-line pt-5 text-sm text-dim`}>Loading the local scenario player…</div>}>
            <FlowLabPlayer requestedScenarioId={requestedScenarioId} onScenarioOpened={onScenarioOpened} />
          </Suspense>
        ) : (
          <div className={`${RESERVED_SPACE} border-t border-line pt-5`} aria-hidden="true">
            <p className="meta text-dim">Scenario player loads as you scroll</p>
          </div>
        )}
      </div>
    </Section>
  );
};
