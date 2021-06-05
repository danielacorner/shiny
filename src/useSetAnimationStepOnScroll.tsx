import { useEffect } from "react";
import { NUM_ANIMATION_STEPS } from "./utils/constants";
import { useStore } from "./store";

export function useSetAnimationStepOnScroll() {
  const set = useStore((s) => s.set);
  const scrollTopPct = useStore((s) => s.scrollTopPct);

  useEffect(() => {
    set({ animationStep: Math.round(scrollTopPct * NUM_ANIMATION_STEPS) });
  }, [scrollTopPct, set]);
}
