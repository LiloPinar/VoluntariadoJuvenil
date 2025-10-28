import React, { useEffect, useState, useRef } from "react";

/**
 * SelectionReader
 * - Shows a small circular "listen" button near the current text selection.
 * - Clicking the button plays the selected text using the Web Speech API.
 */
export default function SelectionReader(): JSX.Element {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const floatRef = useRef<HTMLButtonElement | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const onSelection = () => {
      const sel = window.getSelection();
      const s = sel ? sel.toString().trim() : "";
      if (s) {
        setText(s);
        positionNearSelection();
        setVisible(true);
      } else {
        setVisible(false);
        setText("");
      }
    };

    const mouseup = () => setTimeout(onSelection, 0);
    const keyup = () => setTimeout(onSelection, 0);

    document.addEventListener("mouseup", mouseup);
    document.addEventListener("keyup", keyup);

    return () => {
      document.removeEventListener("mouseup", mouseup);
      document.removeEventListener("keyup", keyup);
    };
  }, []);

  function positionNearSelection() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0).cloneRange();
    let rect: DOMRect | undefined;
    try {
      rect = range.getBoundingClientRect();
    } catch (e) {
      rect = undefined;
    }
    const btn = floatRef.current;
    if (!btn) return;
    if (rect && (rect.top || rect.left)) {
      const top = window.scrollY + rect.top - 28; // above selection
      const left = Math.max(8, window.scrollX + rect.left + rect.width - 18);
      btn.style.top = `${top}px`;
      btn.style.left = `${left}px`;
    } else {
      btn.style.top = `${window.scrollY + 80}px`;
      btn.style.left = `20px`;
    }
  }

  function speak() {
    if (!text) return;
    stop();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1;
    utter.onend = () => {
      setSpeaking(false);
      utterRef.current = null;
    };
    utter.onerror = () => {
      setSpeaking(false);
      utterRef.current = null;
    };
    utterRef.current = utter;
    try {
      window.speechSynthesis.speak(utter);
      setSpeaking(true);
    } catch (e) {
      // Some browsers may throw if speech is unavailable
      console.error("SpeechSynthesis error:", e);
    }
  }

  function stop() {
    if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
    utterRef.current = null;
  }

  return (
    <button
      ref={floatRef}
      onClick={() => (speaking ? stop() : speak())}
      aria-label={speaking ? "Detener lectura" : "Leer selección"}
      title={speaking ? "Detener lectura" : "Leer selección"}
      style={{
        position: "absolute",
        zIndex: 9999,
        display: visible ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: 18,
        background: speaking ? "#ef4444" : "#06b6d4",
        color: "white",
        border: "none",
        boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
        cursor: "pointer",
        padding: 0,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
        {!speaking && (
          <path d="M16.5 8.5a4 4 0 010 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        )}
        {speaking && (
          <path d="M15 9l3 3-3 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        )}
      </svg>
    </button>
  );
}
