import { useEffect } from "react";
import { NUM_ANIMATION_STEPS } from "../../utils/constants";
import { useStore } from "./store";

export function useSetAnimationStepOnScroll() {
  const setAnimationStep = useStore((s) => s.setAnimationStep);
  const scrollTopPct = useStore((s) => s.scrollTopPct);

  useEffect(() => {
    const step = scrollTopPct * NUM_ANIMATION_STEPS;
    console.log("🌟🚨 ~ useEffect ~ scrollTopPct", scrollTopPct);
    console.log("🌟🚨 ~ useEffect ~ step", step);
    setAnimationStep(Math.round(step));
  }, [scrollTopPct, setAnimationStep]);
}
