const NotFound = () => (
  <section className="shell flex min-h-[70vh] flex-col justify-center py-32">
    <p className="meta text-accent">404</p>
    <h1 className="mt-7 max-w-[16ch] text-display-sm font-medium text-ink display-tight">
      No route to host.
    </h1>
    <p className="mt-6 max-w-measure text-[0.975rem] leading-relaxed text-muted">
      That page doesn't exist. The link may be out of date, or the address mistyped.
    </p>
    <a href="/" className="link-draw mt-10 inline-flex self-start text-sm text-accent">
      Back to the homepage
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  </section>
);

export default NotFound;
