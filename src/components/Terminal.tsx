import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/portfolio";

interface Line {
  kind: "input" | "output" | "accent";
  text: string;
}

const BANNER: Line[] = [
  { kind: "output", text: `${profile.brand} — type 'help' for commands, 'exit' to close.` },
];

const COMMANDS: Record<string, string[]> = {
  whoami: ["oluwatobiloba"],
  focus: ["cloud / infrastructure / security"],
  status: ["open_to_work — junior engineering roles"],
  stack: [
    "cloud      aws · docker · nginx",
    "network    huawei · cisco · pfsense",
    "security   kali · metasploit · wireshark",
    "code       python · typescript · sql",
  ],
  location: ["lagos, nigeria"],
  contact: [`email      ${profile.email}`, "github     github.com/XayZay", "linkedin   in/oluwatobilobaoyeyemi"],
  help: [
    "whoami     who is this",
    "focus      current direction",
    "status     availability",
    "stack      what i work with",
    "location   where i am",
    "contact    how to reach me",
    "clear      clear the screen",
    "exit       close terminal",
  ],
};

/**
 * Optional easter egg. Opens on backtick, or from the footer button.
 * Nothing on the site depends on it.
 */
export const Terminal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === "clear") {
      setLines(BANNER);
      return;
    }

    if (cmd === "exit" || cmd === "quit") {
      onClose();
      setLines(BANNER);
      return;
    }

    const output = COMMANDS[cmd];
    setLines((prev) => [
      ...prev,
      { kind: "input", text: cmd },
      ...(output
        ? output.map((text) => ({ kind: "output" as const, text }))
        : [{ kind: "accent" as const, text: `command not found: ${cmd} — try 'help'` }]),
    ]);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-base/70 p-4 backdrop-blur-sm md:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Terminal"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl border border-line-strong bg-base shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <span className="meta text-dim">tobstar — sh</span>
          <button
            type="button"
            onClick={onClose}
            className="meta text-dim transition-colors hover:text-accent"
            aria-label="Close terminal"
          >
            esc
          </button>
        </div>

        <div ref={scrollRef} className="max-h-[50vh] overflow-y-auto px-4 py-4">
          {lines.map((line, i) => (
            <p
              key={i}
              className={`whitespace-pre-wrap font-mono text-[0.8125rem] leading-relaxed ${
                line.kind === "input"
                  ? "text-ink"
                  : line.kind === "accent"
                    ? "text-accent"
                    : "text-muted"
              }`}
            >
              {line.kind === "input" && <span className="text-accent">$ </span>}
              {line.text}
            </p>
          ))}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(value);
              setValue("");
            }}
            className="mt-1 flex items-center gap-2"
          >
            <span aria-hidden="true" className="font-mono text-[0.8125rem] text-accent">
              $
            </span>
            <label htmlFor="terminal-input" className="sr-only">
              Terminal command
            </label>
            <input
              id="terminal-input"
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-transparent font-mono text-[0.8125rem] text-ink caret-accent outline-none"
            />
          </form>
        </div>
      </div>
    </div>
  );
};
