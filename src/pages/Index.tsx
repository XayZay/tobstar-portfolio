import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Hero } from "@/components/Hero";
import { Learning } from "@/components/Learning";
import { SelectedWork } from "@/components/SelectedWork";
import { Stack } from "@/components/Stack";

const Index = () => (
  <>
    <Hero />
    <SelectedWork />
    <Experience />
    <Learning />
    <Stack />
    <About />
    <Contact />
  </>
);

export default Index;
