"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/_-[]";

export function useTextScramble(text: string, duration = 480) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) {
      setDisplay(text);
      return;
    }

    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const lockedCharacters = Math.floor(progress * text.length);
      const scrambled = [...text]
        .map((character, index) => {
          if (index < lockedCharacters || /[\s./-]/.test(character)) return character;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");

      setDisplay(progress >= 1 ? text : scrambled);
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [duration, text]);

  return display;
}
