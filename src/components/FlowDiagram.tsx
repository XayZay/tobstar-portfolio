interface FlowDiagramProps {
  caption: string;
  layers: { label: string; nodes: string[] }[];
}

/**
 * Architecture flow, built in CSS rather than SVG so it reflows to a vertical
 * stack on narrow screens instead of shrinking to unreadable text.
 *
 * Only describes architecture that is actually documented for the project.
 */
export const FlowDiagram = ({ caption, layers }: FlowDiagramProps) => (
  <figure className="border border-line bg-raised/40">
    <div className="flex flex-col gap-px bg-line md:flex-row">
      {layers.map((layer, i) => (
        <div key={layer.label} className="relative flex-1 bg-base p-5 md:p-6">
          <p className="meta text-dim">
            <span className="text-accent/70">{String(i + 1).padStart(2, "0")}</span>{" "}
            {layer.label}
          </p>

          <ul className="mt-4 space-y-2">
            {layer.nodes.map((node, j) => (
              <li
                key={node}
                className={
                  j === 0
                    ? "font-mono text-[0.8125rem] leading-snug text-ink"
                    : "font-mono text-[0.75rem] leading-snug text-muted"
                }
              >
                {node}
              </li>
            ))}
          </ul>

          {/* Connector chevron between layers. Decorative only. */}
          {i < layers.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute right-0 top-1/2 hidden h-4 w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center bg-base text-accent md:flex"
            >
              <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </div>
      ))}
    </div>

    <figcaption className="meta border-t border-line px-5 py-3 text-dim md:px-6">
      {caption}
    </figcaption>
  </figure>
);
