import { profile } from "@/data/portfolio";

export const Footer = ({ onOpenTerminal }: { onOpenTerminal: () => void }) => (
  <footer className="foot">
    <span>
      {profile.name} · {profile.location} · © {new Date().getFullYear()}
    </span>
    <span>
      <button type="button" className="linkbtn" onClick={onOpenTerminal}>
        Open the terminal
      </button>{" "}
      <span className="muted">(or press `)</span>
    </span>
  </footer>
);
