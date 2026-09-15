import { profile } from "@/data/portfolio";

export const Footer = ({ onOpenTerminal }: { onOpenTerminal?: () => void }) => (
  <footer className="border-t border-line">
    <div className="shell flex flex-wrap items-center justify-between gap-x-8 gap-y-5 py-9">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="font-mono text-sm font-semibold tracking-[0.2em] text-ink">
          {profile.brand}
        </span>
        <span aria-hidden="true" className="text-line-strong">
          /
        </span>
        <span className="meta text-dim">{profile.name}</span>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {onOpenTerminal && (
          <button
            type="button"
            onClick={onOpenTerminal}
            className="meta hidden text-dim transition-colors hover:text-accent md:inline"
          >
            Press{" "}
            <kbd className="border border-line px-1.5 py-0.5 font-mono text-[0.625rem] text-muted">
              `
            </kbd>{" "}
            for terminal
          </button>
        )}
        <span className="meta text-dim">© {new Date().getFullYear()}</span>
      </div>
    </div>
  </footer>
);
