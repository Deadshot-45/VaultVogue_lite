// "use client";

// import { useRef, useCallback } from "react";

// type CartAction = {
//   variantId: string;
//   delta: number; // +1 or -1
// };

// export function useCartQueue(onFlush: (items: CartAction[]) => void, delay = 400) {
//   const queueRef = useRef<Map<string, number>>(new Map());
//   const timerRef = useRef<NodeJS.Timeout | null>(null);

//   const flush = useCallback(() => {
//     const actions: CartAction[] = [];

//     queueRef.current.forEach((delta, variantId) => {
//       if (delta !== 0) {
//         actions.push({ variantId, delta });
//       }
//     });

//     queueRef.current.clear();

//     if (actions.length > 0) {
//       onFlush(actions);
//     }
//   }, [onFlush]);

//   const scheduleFlush = useCallback(() => {
//     if (timerRef.current) clearTimeout(timerRef.current);

//     timerRef.current = setTimeout(() => {
//       flush();
//     }, delay);
//   }, [flush, delay]);

//   const add = useCallback((variantId: string, delta: number) => {
//     const prev = queueRef.current.get(variantId) || 0;
//     queueRef.current.set(variantId, prev + delta);

//     scheduleFlush();
//   }, [scheduleFlush]);

//   const clear = useCallback(() => {
//     queueRef.current.clear();
//     if (timerRef.current) clearTimeout(timerRef.current);
//   }, []);

//   return { add, clear };
// }

"use client";

import { useCallback, useRef } from "react";

type Action = {
  variantId: string;
  delta: number;
};

export function useCartQueue(onFlush: (actions: Action[]) => void) {
  const queue = useRef<Map<string, number>>(new Map());
  const timer = useRef<NodeJS.Timeout | null>(null);

  const flush = useCallback(() => {
    const actions: Action[] = [];

    queue.current.forEach((delta, variantId) => {
      actions.push({ variantId, delta });
    });

    queue.current.clear();
    onFlush(actions);
  }, [onFlush]);

  const scheduleFlush = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      flush();
    }, 300);
  }, [flush]);

  const add = useCallback(
    (variantId: string, delta = 1) => {
      const prev = queue.current.get(variantId) ?? 0;
      queue.current.set(variantId, prev + delta);
      scheduleFlush();
    },
    [scheduleFlush],
  );

  const remove = useCallback(
    (variantId: string) => {
      queue.current.set(variantId, -999); // force remove signal
      scheduleFlush();
    },
    [scheduleFlush],
  );

  const clear = useCallback(() => {
    queue.current.clear();
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return {
    add,
    remove,
    flush,
    clear,
  };
}
