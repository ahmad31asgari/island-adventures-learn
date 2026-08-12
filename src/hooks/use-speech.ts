import { useCallback, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { speakText } from "@/lib/tts.functions";
import { CHARACTERS } from "@/lib/characters";
import type { CharacterId } from "@/lib/types";

const cache = new Map<string, string>();

/** Plays a question with the voice that matches the presenting character. */
export function useSpeech() {
  const call = useServerFn(speakText);
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(
    async (text: string, character: CharacterId) => {
      const info = CHARACTERS[character];
      const key = `${character}:${text}`;
      try {
        setSpeaking(true);
        let url = cache.get(key);
        if (!url) {
          const result = await call({ data: { text, voice: info.voice, style: info.voiceStyle } });
          url = `data:${result.mime};base64,${result.audio}`;
          cache.set(key, url);
        }
        audioRef.current?.pause();
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => setSpeaking(false);
        await audio.play();
      } catch {
        setSpeaking(false);
      }
    },
    [call],
  );

  return { speak, speaking };
}
