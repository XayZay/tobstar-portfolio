import { profile } from "@/data/portfolio";

export const Footer = () => (
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
        <span className="meta text-dim">© {new Date().getFullYear()}</span>
      </div>
    </div>
  </footer>
);
