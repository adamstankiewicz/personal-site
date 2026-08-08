"use client";

import { useEffect, useRef, useState } from "react";

interface ReplayStep {
  kind: "task" | "call" | "result" | "write" | "pass";
  label?: string;
  text: string;
}

// A scripted reconstruction of how a run works, using the server's
// real tools — not a recorded transcript, and never a live model.
const STEPS: ReplayStep[] = [
  {
    kind: "task",
    label: "Task",
    text: "A ticket arrives: build a small feature UI.",
  },
  {
    kind: "call",
    label: "search-components",
    text: "The agent finds the right components by name or description.",
  },
  {
    kind: "call",
    label: "get-component",
    text: "It pulls the full API: props, variants, subcomponents, examples.",
  },
  {
    kind: "call",
    label: "get-design-tokens",
    text: "Semantic color, spacing, and typography values, resolved from source.",
  },
  {
    kind: "result",
    text: "Real components and real values, instead of invented markup and guessed hex.",
  },
  {
    kind: "write",
    label: "agent writes",
    text: "The UI is assembled from system primitives.",
  },
  {
    kind: "call",
    label: "validate-component-usage",
    text: "The JSX is linted for incorrect props, accessibility issues, and design-token violations.",
  },
  {
    kind: "pass",
    label: "pass",
    text: "One attempt, about six steps. The baseline agent thrashed for two attempts and thirteen.",
  },
];

/**
 * Step through a Spellbook MCP run at your own pace. Entirely
 * scripted: no model, no network, just the shape of the loop the
 * evaluation measured. Click, Enter, or Space advances.
 */
export function SpellbookReplay() {
  const [shown, setShown] = useState(1);
  const logRef = useRef<HTMLOListElement>(null);
  const done = shown >= STEPS.length;

  const advance = () => {
    setShown((n) => (n >= STEPS.length ? 1 : n + 1));
  };

  // Keep the newest line in view inside the panel's own scroll area.
  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    log.scrollTop = log.scrollHeight;
  }, [shown]);

  return (
    <div className="replay">
      <div className="flex items-baseline justify-between gap-4 border-b border-line px-4 py-2.5">
        <p className="mono-label text-ink-muted">
          Spellbook MCP · <span className="text-accent">replay</span>
        </p>
        <p className="mono-label text-ink-muted">scripted · no live model</p>
      </div>

      <button
        type="button"
        className="replay-stage"
        onClick={advance}
        aria-label={
          done
            ? "Replay the Spellbook MCP walkthrough from the start"
            : "Advance the Spellbook MCP walkthrough one step"
        }
      >
        <ol ref={logRef} className="replay-log" aria-live="polite">
          {STEPS.slice(0, shown).map((step, index) => (
            <li key={index} className="replay-line" data-kind={step.kind}>
              {step.label ? (
                <span className="replay-chip" data-kind={step.kind}>
                  {step.label}
                </span>
              ) : null}
              <span className="replay-text">{step.text}</span>
            </li>
          ))}
        </ol>
      </button>

      <div className="flex items-baseline justify-between gap-4 border-t border-line px-4 py-2.5">
        <span className="mono-label tabular-nums text-ink-muted">
          {shown} / {STEPS.length}
        </span>
        <span className="mono-label text-accent">
          {done ? "replay ↺" : "click to step →"}
        </span>
      </div>
    </div>
  );
}
