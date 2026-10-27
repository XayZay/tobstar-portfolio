import { useState } from "react";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { FlowLabSection } from "@/components/FlowLabSection";
import { Hero } from "@/components/Hero";
import { Learning } from "@/components/Learning";
import { NowAndNext } from "@/components/NowAndNext";
import { SelectedWork } from "@/components/SelectedWork";
import { Stack } from "@/components/Stack";

const Index = () => {
  const [heroScenarioId, setHeroScenarioId] = useState("web-tier");
  const [requestedScenarioId, setRequestedScenarioId] = useState<string | null>(null);

  return (
    <>
      <Hero onFrameChange={setHeroScenarioId} onExplore={() => setRequestedScenarioId(heroScenarioId)} />
      <SelectedWork />
      <FlowLabSection requestedScenarioId={requestedScenarioId} onScenarioOpened={() => setRequestedScenarioId(null)} />
      <Experience />
      <Learning />
      <NowAndNext />
      <Stack />
      <About />
      <Contact />
    </>
  );
};

export default Index;
