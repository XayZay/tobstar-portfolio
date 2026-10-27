import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Hero } from "@/components/Hero";
import { Learning } from "@/components/Learning";
import { NowAndNext } from "@/components/NowAndNext";
import { SelectedWork } from "@/components/SelectedWork";
import { Stack } from "@/components/Stack";

const Index = () => (
  <>
    <Hero />
    <SelectedWork />
    <Experience />
    <Learning />
    <NowAndNext />
    <Stack />
    <About />
    <Contact />
  </>
);

export default Index;
