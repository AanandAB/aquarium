import { useMemo } from "react";

export type Bubble = {
  left: number;
  size: number;
  duration: number;
  delay: number;
};

/** Deterministic pseudo-random bubbles (stable between SSR and client). */
export function useMemoBubbles(count: number): Bubble[] {
  return useMemo(() => {
    let seed = 1337;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    return Array.from({ length: count }, () => {
      const size = 4 + Math.round(rand() * 16);
      return {
        left: Math.round(rand() * 100),
        size,
        duration: 12 + Math.round(rand() * 16),
        delay: Math.round(rand() * 16),
      };
    });
  }, [count]);
}
