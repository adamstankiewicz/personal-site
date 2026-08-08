"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks";
import { TextMorph } from "torph/react";
import { Card } from "@/components/ui/card";

interface ReplayLine {
  kind: "call" | "read" | "write" | "error" | "result" | "pass" | "fail";
  label?: string;
  text: string;
}

const TASK = "Build a small feature UI from a ticket.";

// Both columns are scripted reconstructions shaped by the evaluation
// (40 prompts × 5 conditions): the baseline agent averaged 2.35
// attempts and ~27 steps; the MCP agent converged in one attempt and
// ~6 steps. No live model, no network.
const MCP_STEPS: ReplayLine[] = [
  {
    kind: "call",
    label: "get-design-context",
    text: "One call fans out across components, design tokens, and guidelines for the task.",
  },
  {
    kind: "call",
    label: "get-component",
    text: "The full spec: props, valid variants, subcomponents, constraints.",
  },
  {
    kind: "call",
    label: "get-story",
    text: "A real Storybook snippet for the pattern, not JSX synthesized from memory.",
  },
  {
    kind: "call",
    label: "get-design-tokens",
    text: "Semantic tokens with resolved values. No guessed hex.",
  },
  {
    kind: "write",
    label: "writes",
    text: "Assembles the UI from system primitives.",
  },
  {
    kind: "call",
    label: "validate-component-usage",
    text: "Lints the JSX: invalid variants, missing required props, unregistered color classes.",
  },
  {
    kind: "pass",
    label: "pass",
    text: "Done. One attempt, about six steps.",
  },
];

const BASELINE_STEPS: ReplayLine[] = [
  {
    kind: "read",
    label: "grep",
    text: "Greps the component library for likely names.",
  },
  {
    kind: "read",
    label: "read",
    text: "Opens component source, reads the props by hand.",
  },
  {
    kind: "write",
    label: "writes",
    text: "Writes JSX, guessing at two props.",
  },
  {
    kind: "error",
    label: "tsc ✕",
    text: "Error: prop does not exist on this component.",
  },
  {
    kind: "read",
    label: "read",
    text: "Reads more source, tries a different prop.",
  },
  {
    kind: "error",
    label: "tsc ✕",
    text: "Error: wrong variant name.",
  },
  {
    kind: "write",
    label: "writes",
    text: "Styles it with a Tailwind primitive the app never registered. It compiles; it renders nothing.",
  },
  {
    kind: "result",
    text: "Attempt two begins.",
  },
  {
    kind: "read",
    label: "read",
    text: "Rereads the source tree.",
  },
  {
    kind: "write",
    label: "writes",
    text: "Rewrites the JSX from scratch.",
  },
  {
    kind: "error",
    label: "tsc ✓",
    text: "Compiles this time.",
  },
  {
    kind: "fail",
    label: "done",
    text: "Two attempts and ~26 steps. In the eval, 45% of baseline runs hit the step ceiling.",
  },
];

const TOTAL = BASELINE_STEPS.length;

function ReplayColumn({
  title,
  steps,
  shown,
  summary,
}: {
  title: string;
  steps: ReplayLine[];
  shown: number;
  summary: string;
}) {
  const logRef = useRef<HTMLOListElement>(null);
  const visible = Math.min(shown, steps.length);
  const done = shown >= steps.length;

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [visible]);

  return (
    <div className="replay-column" data-done={done || undefined}>
      <p className="mono-label border-b border-line px-3 py-2 text-ink-muted">
        {title}
      </p>
      <ol ref={logRef} className="replay-log" aria-live="polite">
        {steps.slice(0, visible).map((line, index) => (
          <li key={index} className="replay-line" data-kind={line.kind}>
            {line.label ? (
              <span className="replay-chip" data-kind={line.kind}>
                {line.label}
              </span>
            ) : null}
            <span className="replay-text">{line.text}</span>
          </li>
        ))}
      </ol>
      <p
        className="replay-summary mono-label border-t border-line px-3 py-2"
        data-visible={done || undefined}
      >
        {summary}
      </p>
    </div>
  );
}

/**
 * The same ticket, twice: a baseline agent with filesystem access
 * only, and an agent with the Spellbook MCP tools. One click advances
 * both. The MCP side finishes while the baseline is still thrashing —
 * which is the whole point. Entirely scripted; never a live model.
 */
export function SpellbookReplay() {
  const [shown, setShown] = useState(1);
  const done = shown >= TOTAL;
  const rootRef = useRef<HTMLDivElement>(null);
  const shownRef = useRef(shown);
  const userTookOverRef = useRef(false);
  const playedThroughRef = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    shownRef.current = shown;
  });

  const advance = () => {
    userTookOverRef.current = true;
    setShown((n) => (n >= TOTAL ? 1 : n + 1));
  };

  // The race plays itself the first time it scrolls into view, one
  // step a second — pausing off-screen, stopping for good once it has
  // run through or the visitor clicks. Never under reduced motion.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || reduced) return;
    let timer: ReturnType<typeof setInterval> | null = null;
    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        const eligible =
          entry.isIntersecting &&
          !playedThroughRef.current &&
          !userTookOverRef.current;
        if (!eligible) {
          stop();
          return;
        }
        if (timer) return;
        timer = setInterval(() => {
          if (userTookOverRef.current) {
            stop();
            return;
          }
          if (shownRef.current >= TOTAL) {
            playedThroughRef.current = true;
            stop();
            return;
          }
          setShown((n) => Math.min(n + 1, TOTAL));
        }, 1000);
      },
      { threshold: 0.45 }
    );
    observer.observe(el);
    return () => {
      stop();
      observer.disconnect();
    };
  }, [reduced]);

  return (
    <Card className="replay" ref={rootRef}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line px-4 py-2.5">
        <p className="mono-label text-ink-muted">
          Spellbook MCP · <span className="text-accent">before / after</span>
        </p>
        <p className="mono-label text-ink-muted">scripted · no live model</p>
      </div>

      <p className="border-b border-line px-4 py-2.5 text-[0.875rem]">
        <span className="mono-label mr-2 text-ink-muted">Task</span>
        {TASK}
      </p>

      {/* Pointer convenience only: the real, focusable control is the
          button below. Keeping the log outside any button also keeps
          its aria-live region and list semantics intact. */}
      <div className="replay-stage" onClick={advance}>
        <div className="grid sm:grid-cols-2">
          <ReplayColumn
            title="Filesystem only"
            steps={BASELINE_STEPS}
            shown={shown}
            summary="2.35 attempts avg · ~27 steps"
          />
          <ReplayColumn
            title="With Spellbook MCP"
            steps={MCP_STEPS}
            shown={shown}
            summary="1 attempt · ~6 steps · pass"
          />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-4 border-t border-line px-4 py-2.5">
        <span className="mono-label tabular-nums text-ink-muted">
          <TextMorph as="span">{`step ${Math.min(shown, TOTAL)} / ${TOTAL}`}</TextMorph>
        </span>
        <button
          type="button"
          className="mono-label cursor-pointer text-accent"
          onClick={advance}
        >
          {done ? "replay ↺" : "click to step both →"}
        </button>
      </div>
    </Card>
  );
}
