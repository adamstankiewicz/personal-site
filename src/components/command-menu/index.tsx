"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { hoverCapable } from "@/lib/hooks";

export interface Command {
  id: string;
  label: string;
  group: "Navigate" | "Actions" | "Elsewhere";
  hint?: string;
  run: () => void;
}

interface CommandMenuProps {
  open: boolean;
  onClose: () => void;
  commands: Command[];
}

/** Mount/unmount wrapper: the panel mounts fresh each open, so its
 * query and selection state reset without any effect choreography. */
export function CommandMenu({ open, onClose, commands }: CommandMenuProps) {
  if (!open) return null;
  return <CommandPanel onClose={onClose} commands={commands} />;
}

function CommandPanel({
  onClose,
  commands,
}: {
  onClose: () => void;
  commands: Command[];
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((command) =>
      `${command.group} ${command.label}`.toLowerCase().includes(q)
    );
  }, [commands, query]);

  const groups = useMemo(() => {
    const order: Command["group"][] = ["Navigate", "Actions", "Elsewhere"];
    return order
      .map((group) => ({
        group,
        items: filtered.filter((command) => command.group === group),
      }))
      .filter((section) => section.items.length > 0);
  }, [filtered]);

  // Lock background scroll while open; skip autofocus on touch devices
  // so the keyboard doesn't spring up.
  useEffect(() => {
    if (hoverCapable()) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previousOverflow;
    };
  }, []);

  const execute = useCallback(
    (command: Command) => {
      onClose();
      command.run();
    },
    [onClose]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Tab") {
        // Keep focus inside the dialog; arrow keys navigate the list.
        e.preventDefault();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => (s + 1) % Math.max(filtered.length, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected(
          (s) => (s - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1)
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const command = filtered[selected];
        if (command) execute(command);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtered, selected, execute, onClose]);

  // Keep the selected option in view while arrowing through the list.
  useEffect(() => {
    const el = listRef.current?.querySelector('[data-selected="true"]');
    el?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  let flatIndex = -1;

  return (
    <div
      className="command-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        className="command-panel mx-auto mt-[16vh] w-[min(34rem,calc(100vw-2rem))] border border-line-strong bg-paper shadow-[0_24px_80px_-24px_rgba(0,0,0,0.35)]"
      >
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          <span className="mono-label text-accent" aria-hidden="true">
            §
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            placeholder="Type a command…"
            className="w-full bg-transparent font-mono text-base tracking-wide outline-none placeholder:text-ink-muted sm:text-[0.8125rem]"
            aria-label="Search commands"
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          <kbd className="key-hint">esc</kbd>
        </div>

        <ul ref={listRef} className="max-h-[19rem] overflow-y-auto py-2" role="listbox">
          {groups.length === 0 ? (
            <li className="px-5 py-6 font-serif italic text-ink-muted">
              Nothing indexed under “{query}”.
            </li>
          ) : (
            groups.map((section) => (
              <li key={section.group}>
                <p className="mono-label px-5 pb-1 pt-3 text-ink-muted">
                  {section.group}
                </p>
                <ul>
                  {section.items.map((command) => {
                    flatIndex += 1;
                    const index = flatIndex;
                    return (
                      <li key={command.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={index === selected}
                          data-selected={index === selected}
                          onMouseEnter={() => setSelected(index)}
                          onClick={() => execute(command)}
                          className="command-option flex w-full cursor-pointer items-baseline justify-between gap-4 px-5 py-2.5 text-left"
                        >
                          <span className="command-option-label font-mono text-[0.8125rem] tracking-wide">
                            {command.label}
                          </span>
                          {command.hint ? (
                            <span className="mono-label text-ink-muted">
                              {command.hint}
                            </span>
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))
          )}
        </ul>

        <div className="flex items-center gap-4 border-t border-line px-5 py-3">
          <span className="mono-label text-ink-muted">
            <kbd className="key-hint">↑↓</kbd> navigate
          </span>
          <span className="mono-label text-ink-muted">
            <kbd className="key-hint">↵</kbd> select
          </span>
        </div>
      </div>
    </div>
  );
}
