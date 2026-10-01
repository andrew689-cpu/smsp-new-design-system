"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "smsp-theme";
const CHANGE_EVENT = "smsp-theme-change";

/**
 * The theme already lives in the DOM: ThemeScript stamps `data-theme` before first paint, so
 * the attribute is the source of truth and React subscribes to it rather than keeping a
 * second copy. That avoids both the hydration mismatch and the cascading render that reading
 * localStorage inside an effect would cause.
 */
function subscribe(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

function getSnapshot(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "light" || attr === "dark" ? attr : "system";
}

/** No attribute is stamped during SSR, so "system" is the only honest server answer. */
function getServerSnapshot(): Theme {
  return "system";
}

function applyTheme(next: Theme) {
  const root = document.documentElement;
  try {
    if (next === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* Blocked storage: still apply the attribute, just don't remember the choice. */
  }
  if (next === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", next);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

const OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Terang" },
  { value: "dark", label: "Gelap" },
  { value: "system", label: "Sistem" },
];

/**
 * Theme control for the Showcase.
 *
 * Three states, not a boolean switch: "system" is a real choice and collapsing it into a
 * toggle loses it. Each option carries a text label and the active one carries a check mark,
 * because state is never signalled by colour alone.
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <fieldset className="border-border-default rounded-container border p-3">
      <legend className="text-caption text-text-muted tracking-wide px-2 uppercase">Tema</legend>
      <div className="flex gap-2" role="radiogroup" aria-label="Pilih tema">
        {OPTIONS.map((option) => {
          const active = theme === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => applyTheme(option.value)}
              // min-h-touch == 44px: the preferred touch target, as a named dimension token.
              className={[
                "text-small rounded-control min-h-touch px-4 font-bold",
                active
                  ? "bg-action-primary text-text-on-brand"
                  : "border-border-strong text-text-default border",
              ].join(" ")}
            >
              {active ? "✓ " : ""}
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
