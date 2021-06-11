import { useEffect, useState } from "react";
import { useAnimationStep } from "../store/store";
import {
  INITIAL_ROTATION,
  ROTATION_STEPS,
  useRotationSteps,
} from "../../utils/constants";
import isEqual from "lodash.isequal";

export function useRotateWithScroll() {
  const animationStep = useAnimationStep();

  const [rotation, setRotation] = useState(ROTATION_STEPS[0]);
  const rotationSteps = useRotationSteps();
  useEffect(() => {
    const rotationStep = animationStep - 2; // starting position
    const rotation = rotationSteps[rotationStep] || INITIAL_ROTATION;
    if (isEqual(rotation, INITIAL_ROTATION)) {
      return;
      // setRotation()
    } else {
      setRotation(rotation);
    }
  }, [animationStep, rotationSteps]);

  return rotation as { x: number; y: number; z: number };
}
