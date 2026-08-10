"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Dictation via the Web Speech API.
 *
 * This exists because the debrief is typed one-handed on a pavement. It's free
 * (no API call), works in Chrome on Android — which is what Utkarsh is on — and
 * silently hides itself everywhere else rather than showing a dead button.
 */

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: SpeechRecognitionAlternativeLike;
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [i: number]: SpeechRecognitionResultLike;
  };
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getCtor(): SpeechRecognitionCtor | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

/** Capability never changes after load, so the subscribe function is a no-op. */
const noopSubscribe = () => () => {};

export function VoiceInput({ onText }: { onText: (chunk: string) => void }) {
  // useSyncExternalStore is the SSR-safe way to read a browser-only capability:
  // the server snapshot is `false`, so markup matches and hydration stays quiet.
  const supported = useSyncExternalStore(
    noopSubscribe,
    () => Boolean(getCtor()),
    () => false,
  );

  const [listening, setListening] = useState(false);
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  const ensureRecognizer = useCallback((): SpeechRecognitionLike | null => {
    if (recRef.current) return recRef.current;
    const Ctor = getCtor();
    if (!Ctor) return null;

    const rec = new Ctor();
    // en-IN handles Hinglish noticeably better than en-US.
    rec.lang = "en-IN";
    rec.continuous = true;
    rec.interimResults = false;
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    // `onresult` is bound in toggle(), so it always sees the current onText
    // rather than one captured the first time the button was pressed.

    recRef.current = rec;
    return rec;
  }, []);

  // Stop the mic if the user navigates away mid-dictation.
  useEffect(() => {
    return () => {
      const rec = recRef.current;
      if (!rec) return;
      rec.onresult = null;
      rec.onend = null;
      rec.onerror = null;
      try {
        rec.stop();
      } catch {
        /* already stopped */
      }
    };
  }, []);

  if (!supported) return null;

  function toggle() {
    const rec = ensureRecognizer();
    if (!rec) return;

    if (listening) {
      rec.stop();
      setListening(false);
      return;
    }

    rec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        if (result.isFinal) onText(result[0].transcript);
      }
    };

    try {
      rec.start();
      setListening(true);
    } catch {
      /* start() throws if it is already running */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center gap-2 rounded-[12px] border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
        listening
          ? "border-[var(--tr-coral)] bg-[rgba(255,122,99,0.12)] text-[var(--tr-coral)]"
          : "border-line-2 bg-elevated text-fg-2 active:bg-card"
      }`}
    >
      <span className={listening ? "animate-pulse" : ""}>{listening ? "●" : "🎙"}</span>
      {listening ? "Listening — tap to stop" : "Dictate instead"}
    </button>
  );
}
