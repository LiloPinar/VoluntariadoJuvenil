import React, { useEffect, useState, useRef } from "react";
import { useLocale } from "../i18n/LocaleContext";

/**
 * SelectionReader
 * - Shows a small circular "listen" button near the current text selection.
 * - Clicking the button plays the selected text using the Web Speech API.
 * - Only appears if voiceReading is enabled in settings.
 * - Uses the application's selected language (es/en) for speech synthesis.
 */
export default function SelectionReader(): JSX.Element {
  const { locale } = useLocale();
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    return localStorage.getItem('voiceReading') === 'true';
  });
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const floatRef = useRef<HTMLButtonElement | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Cargar las voces disponibles
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };

    // Las voces pueden cargarse de forma asíncrona
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Escuchar cambios en la configuración de voz
  useEffect(() => {
    const handleStorageChange = () => {
      setVoiceEnabled(localStorage.getItem('voiceReading') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    
    // También escuchar eventos personalizados para cambios en la misma pestaña
    const handleVoiceChange = () => {
      setVoiceEnabled(localStorage.getItem('voiceReading') === 'true');
    };
    
    window.addEventListener('voiceReadingChanged', handleVoiceChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('voiceReadingChanged', handleVoiceChange);
    };
  }, []);

  // Detener la lectura si cambia el idioma (para que use la voz correcta al reiniciar)
  useEffect(() => {
    if (speaking) {
      stop();
    }
  }, [locale]);

  useEffect(() => {
    // Si la lectura por voz está deshabilitada, no mostrar el botón
    if (!voiceEnabled) {
      setVisible(false);
      stop();
      return;
    }

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
  }, [voiceEnabled]);

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

  /**
   * Obtiene la mejor voz disponible para el idioma de la aplicación
   * Prioriza voces nativas y de alta calidad
   */
  function getVoiceForLanguage(lang: 'es' | 'en'): SpeechSynthesisVoice | null {
    const voices = window.speechSynthesis.getVoices();
    
    if (voices.length === 0) {
      return null;
    }
    
    // Convertir el locale de la app al formato del sintetizador
    const speechLang = lang === 'en' ? 'en-US' : 'es-ES';
    
    // Patrones de búsqueda según el idioma
    const patterns = lang === 'en' 
      ? ['en-US', 'en_US', 'en-GB', 'en_GB', 'en'] // Inglés de US o UK
      : ['es-ES', 'es_ES', 'es-MX', 'es_MX', 'es-AR', 'es']; // Español de España, México o Argentina
    
    // Buscar voces que coincidan con los patrones
    for (const pattern of patterns) {
      // Primero buscar voces locales/nativas (suelen ser de mejor calidad)
      const localVoice = voices.find(v => 
        v.lang.toLowerCase().includes(pattern.toLowerCase()) && v.localService
      );
      if (localVoice) return localVoice;
      
      // Si no hay local, buscar cualquier voz que coincida
      const anyVoice = voices.find(v => 
        v.lang.toLowerCase().includes(pattern.toLowerCase())
      );
      if (anyVoice) return anyVoice;
    }
    
    return null;
  }

  function speak() {
    if (!text) return;
    stop();
    
    // Asegurarse de que las voces estén cargadas
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      // Intentar cargar voces y reintentar
      window.speechSynthesis.getVoices();
      setTimeout(() => speak(), 100);
      return;
    }
    
    // Usar el idioma seleccionado en la aplicación
    const language = locale === 'en' ? 'en-US' : 'es-ES';
    console.log('Using application language:', language, 'for speech synthesis');
    
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = language;
    utter.rate = 1;
    utter.pitch = 1;
    
    // Intentar asignar una voz específica del idioma
    const voice = getVoiceForLanguage(locale);
    if (voice) {
      utter.voice = voice;
      console.log('Using voice:', voice.name, '(', voice.lang, ')');
    } else {
      console.warn('No voice found for language:', language);
    }
    
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
