"use client";

import { useEffect, useRef, useState } from "react";

// A recorded AG-UI event stream driving a real A2UI renderer. The
// event names and fields follow the AG-UI protocol (RUN_STARTED,
// TEXT_MESSAGE_*, CUSTOM, RUN_FINISHED); the UI payloads are A2UI
// v0.9 messages (createSurface / updateComponents) rendered from the
// spec's basic catalog as a flat component list with ID references,
// placeholders included, exactly as the spec's progressive-rendering
// model describes. No live model, no network: the stream is a
// recording, replayed — the same honesty contract as the Spellbook
// replay above.

interface AgUiEvent {
  type: string;
  [key: string]: unknown;
}

interface A2uiComponent {
  id: string;
  component: string;
  text?: string;
  label?: string;
  variant?: string;
  child?: string;
  children?: string[];
  axis?: string;
}

const CATALOG_ID =
  "https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json";

const a2ui = (message: Record<string, unknown>): AgUiEvent => ({
  type: "CUSTOM",
  name: "a2ui",
  value: { version: "v0.9", ...message },
});

function run(
  runId: string,
  narration: string,
  surfaceId: string,
  batches: A2uiComponent[][]
): AgUiEvent[] {
  return [
    { type: "RUN_STARTED", threadId: "lab", runId },
    { type: "TEXT_MESSAGE_START", messageId: `${runId}-m1`, role: "assistant" },
    { type: "TEXT_MESSAGE_CONTENT", messageId: `${runId}-m1`, delta: narration },
    { type: "TEXT_MESSAGE_END", messageId: `${runId}-m1` },
    a2ui({ createSurface: { surfaceId, catalogId: CATALOG_ID } }),
    ...batches.map((components) =>
      a2ui({ updateComponents: { surfaceId, components } })
    ),
    { type: "RUN_FINISHED", outcome: "success" },
  ];
}

const RUNS: Record<string, { label: string; events: AgUiEvent[] }> = {
  pricing: {
    label: "Pricing card",
    events: run("run_pricing", "Rendering a pricing card…", "pricing_card", [
      [
        { id: "root", component: "Card", child: "col" },
        { id: "col", component: "Column", children: ["plan", "price", "blurb", "div", "cta"] },
      ],
      [
        { id: "plan", component: "Text", text: "Studio plan" },
        { id: "price", component: "Text", text: "$12/mo" },
        { id: "blurb", component: "Text", text: "Everything in Free, plus unlimited projects." },
      ],
      [
        { id: "div", component: "Divider", axis: "horizontal" },
        { id: "cta", component: "Button", child: "cta_label" },
        { id: "cta_label", component: "Text", text: "Start free trial" },
      ],
    ]),
  },
  login: {
    label: "Login form",
    events: run("run_login", "Rendering a login form…", "login_form", [
      [
        { id: "root", component: "Card", child: "col" },
        { id: "col", component: "Column", children: ["title", "email", "password", "submit"] },
      ],
      [
        { id: "title", component: "Text", text: "Welcome back" },
        { id: "email", component: "TextField", label: "Email", variant: "shortText" },
        { id: "password", component: "TextField", label: "Password", variant: "obscured" },
      ],
      [
        { id: "submit", component: "Button", child: "submit_label" },
        { id: "submit_label", component: "Text", text: "Sign in" },
      ],
    ]),
  },
  profile: {
    label: "Profile tile",
    events: run("run_profile", "Rendering a profile tile…", "profile_tile", [
      [
        { id: "root", component: "Card", child: "col" },
        { id: "col", component: "Column", children: ["name", "title", "row"] },
      ],
      [
        { id: "name", component: "Text", text: "Adam Stankiewicz" },
        { id: "title", component: "Text", text: "Product · design systems" },
      ],
      [
        { id: "row", component: "Row", children: ["follow", "msg"] },
        { id: "follow", component: "Button", child: "follow_label" },
        { id: "follow_label", component: "Text", text: "Follow" },
        { id: "msg", component: "Button", child: "msg_label" },
        { id: "msg_label", component: "Text", text: "Message" },
      ],
    ]),
  },
};

function describeEvent(e: AgUiEvent): string {
  if (e.type === "CUSTOM") {
    const v = e.value as Record<string, unknown>;
    const key = Object.keys(v).find((k) => k !== "version");
    if (key === "updateComponents") {
      const n = (v.updateComponents as { components: unknown[] }).components.length;
      return `CUSTOM a2ui · updateComponents · ${n} components`;
    }
    return `CUSTOM a2ui · ${key}`;
  }
  if (e.type === "TEXT_MESSAGE_CONTENT") return `TEXT_MESSAGE_CONTENT · "${e.delta}"`;
  if (e.type === "RUN_STARTED") return `RUN_STARTED · ${e.runId}`;
  if (e.type === "RUN_FINISHED") return `RUN_FINISHED · ${e.outcome}`;
  return e.type;
}

// Renders the flat component list from the root down, with the spec's
// placeholder behavior for children that haven't streamed in yet.
function Component({
  id,
  registry,
}: {
  id: string;
  registry: Map<string, A2uiComponent>;
}) {
  const node = registry.get(id);
  if (!node) return <span className="genui-placeholder" aria-hidden="true" />;
  switch (node.component) {
    case "Card":
      return (
        <div className="genui-card">
          {node.child ? <Component id={node.child} registry={registry} /> : null}
        </div>
      );
    case "Column":
    case "Row":
      return (
        <div
          className="genui-stack"
          style={{ flexDirection: node.component === "Row" ? "row" : "column" }}
        >
          {node.children?.map((c) => (
            <Component key={c} id={c} registry={registry} />
          ))}
        </div>
      );
    case "Text":
      return <p className="genui-text">{node.text}</p>;
    case "Button":
      return (
        <button type="button" className="genui-btn genui-btn-primary">
          {node.child ? <Component id={node.child} registry={registry} /> : null}
        </button>
      );
    case "TextField":
      return (
        <label className="genui-field">
          <span className="mono-label text-ink-muted">{node.label}</span>
          <input
            type={node.variant === "obscured" ? "password" : "text"}
            className="genui-input"
          />
        </label>
      );
    case "Divider":
      return <hr className="w-full border-line" />;
    default:
      return null;
  }
}

export function AgentUiReplay() {
  const [runKey, setRunKey] = useState<string | null>(null);
  const [eventCount, setEventCount] = useState(0);
  const [playing, setPlaying] = useState(false);
  const logRef = useRef<HTMLOListElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const events = runKey ? RUNS[runKey].events : [];
  const shown = events.slice(0, eventCount);

  // Fold the shown events into A2UI client state.
  const registry = new Map<string, A2uiComponent>();
  let surfaceCreated = false;
  for (const e of shown) {
    if (e.type !== "CUSTOM") continue;
    const v = e.value as Record<string, unknown>;
    if (v.createSurface) surfaceCreated = true;
    const update = v.updateComponents as { components: A2uiComponent[] } | undefined;
    update?.components.forEach((c) => registry.set(c.id, c));
  }

  const play = (key: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setRunKey(key);
    setPlaying(true);
    const total = RUNS[key].events.length;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setEventCount(total);
      setPlaying(false);
      return;
    }
    setEventCount(0);
    let i = 0;
    const step = () => {
      i += 1;
      setEventCount(i);
      if (i < total) {
        timerRef.current = setTimeout(step, 340);
      } else {
        setPlaying(false);
      }
    };
    timerRef.current = setTimeout(step, 200);
  };

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [eventCount]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="flex h-full min-h-[20rem] flex-col gap-3 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(RUNS).map(([key, r]) => (
            <button
              key={key}
              type="button"
              className="lab-chip"
              data-active={runKey === key}
              disabled={playing}
              onClick={() => play(key)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <p className="mono-label text-ink-muted">recorded stream · no live model</p>
      </div>

      <div className="grid flex-1 gap-3 sm:grid-cols-2">
        <ol
          ref={logRef}
          className="genui-log"
          aria-label="AG-UI event stream"
          aria-live="polite"
        >
          {shown.length === 0 ? (
            <li className="mono-label text-ink-muted">
              pick a surface to stream →
            </li>
          ) : (
            shown.map((e, i) => (
              <li key={i} className="genui-log-line" data-kind={e.type}>
                {describeEvent(e)}
              </li>
            ))
          )}
        </ol>
        <div className="genui-stage">
          {surfaceCreated ? (
            <Component id="root" registry={registry} />
          ) : (
            <p className="mono-label text-ink-muted">surface not created yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
