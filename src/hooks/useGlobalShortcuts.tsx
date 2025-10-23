import { useEffect } from "react";

type ShortcutHandler = () => void;
type ShortcutsMap = Record<string, ShortcutHandler>;

function eventToKey(event: KeyboardEvent) {
  const parts: string[] = [];
  if (event.ctrlKey) parts.push("ctrl");
  if (event.metaKey) parts.push("meta");
  if (event.altKey) parts.push("alt");
  if (event.shiftKey) parts.push("shift");
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key.toLowerCase();
  parts.push(key);
  return parts.join("+");
}

export default function useGlobalShortcuts(shortcuts: ShortcutsMap) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      try {
        const active = document.activeElement;
        if (active) {
          const tag = (active.tagName || "").toLowerCase();
          const editable = tag === "input" || tag === "textarea" || (active as HTMLElement).isContentEditable || tag === "select";
          if (editable) return;
        }

        const key = eventToKey(e);
        const handler = shortcuts[key];
        if (handler) {
          e.preventDefault();
          handler();
        }
      } catch (err) {
        // no dejar que un handler rompa el listener global
        console.error("useGlobalShortcuts handler error", err);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shortcuts]);
}
