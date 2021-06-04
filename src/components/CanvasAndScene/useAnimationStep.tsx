import { useEffect } from "react";
import { useStore } from "../../store";
import { NUM_ANIMATION_STEPS } from "../../utils/constants";
import { useLocalStorageState } from "../../utils/hooks";

export function useAnimationStep() {
  const [animationStep, setAnimationStep] = useLocalStorageState(
    "animationStep",
    0
  );
  const scrollTopPct = useStore((s) => s.scrollTopPct);

  // const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    setAnimationStep(Math.round(scrollTopPct * NUM_ANIMATION_STEPS));
  }, [scrollTopPct, setAnimationStep]);

  return animationStep;
}
