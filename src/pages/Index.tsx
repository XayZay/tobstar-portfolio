import { Hero } from "@/components/Hero";

const destinations = [
  { href: "/work", name: "Work", detail: "Projects, systems and case studies.", tone: "bg-raised" },
  { href: "/lab", name: "Flow Lab", detail: "Walk a request through the architecture.", tone: "bg-accent text-white" },
  { href: "/field-notes", name: "Field notes", detail: "What I am learning, using and building toward.", tone: "bg-signal/50" },
  { href: "/about", name: "About", detail: "The route here and how to get in touch.", tone: "bg-ink text-white" },
];

const Index = () => (
  <>
    <Hero />
    <section className="shell py-16 md:py-24" aria-labelledby="explore-heading">
      <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <div>
          <p className="text-sm font-medium text-accent">Explore</p>
          <h2 id="explore-heading" className="mt-4 max-w-[11ch] text-[clamp(2rem,4vw,4rem)] font-semibold leading-[.94] text-ink display-tight">Pick a place to start.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {destinations.map((destination) => (
            <a key={destination.href} href={destination.href} className={`group min-h-52 p-6 transition-transform duration-300 hover:-translate-y-1 ${destination.tone}`}>
              <span className="text-sm font-medium">{destination.name}</span>
              <p className="mt-16 max-w-[19ch] text-sm leading-relaxed opacity-80">{destination.detail}</p>
              <span className="mt-5 inline-block text-sm font-medium">Enter ↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default Index;
