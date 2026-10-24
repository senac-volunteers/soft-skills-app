"use client";
import { useCallback, useEffect, useState } from "react";

// Leitura em voz alta (Web Speech API) para quem tem dificuldade de leitura.
export function useSpeech() {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState<string | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback(
    (text: string, id = text) => {
      if (!supported) return;
      const synth = window.speechSynthesis;
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "pt-BR";
      utter.rate = 0.95;
      const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith("pt"));
      if (voice) utter.voice = voice;
      utter.onend = () => setSpeaking((s) => (s === id ? null : s));
      utter.onerror = () => setSpeaking(null);
      setSpeaking(id);
      synth.speak(utter);
    },
    [supported],
  );

  const stop = useCallback(() => {
    if (supported) window.speechSynthesis.cancel();
    setSpeaking(null);
  }, [supported]);

  return { supported, speaking, speak, stop };
}
