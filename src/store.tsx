import create from "zustand";
import { useEffect } from "react";
import { useLocalStorageState } from "./utils/hooks";

export function useSyncStoreStateToLS(stateKey: keyof GlobalStateType) {
  const set = useStore((s) => s.set);
  const state = useStore((s) => s[stateKey]);
  const [stateLS, setStateLS] = useLocalStorageState(
    `store:${stateKey}`,
    state
  );

  // sync with store state, state with store
  useEffect(() => {
    setStateLS(state);
    if (JSON.stringify(state) !== JSON.stringify(stateLS)) {
      set({ [stateKey]: stateLS });
    }
  }, [set, state, stateKey, stateLS, setStateLS]);
}

type GlobalStateType = {
  isZoomed: boolean;
  isSpinning: boolean;
  /** is the game paused / temperature === 0 */
  paused: boolean;
  /** if a property in the store is animating e.g. scale, can turn things on/off */
  isPropertyAnimating: boolean;
  scrollTopPct: number;
  animationStep: number;
  set: (newState: any) => any;
};

// zustand https://github.com/pmndrs/zustand
// with typescript https://react-tracked.js.org/docs/tutorial-zustand-01/
export const useStore = create<GlobalStateType>(
  (set): GlobalStateType => ({
    isSpinning: false,
    paused: false,
    isZoomed: false,
    isPropertyAnimating: false,
    scrollTopPct: 0,
    animationStep: 0,
    set: (newState) => set((state) => ({ ...state, ...newState })),
  })
);

export function useAnimationStep() {
  return useStore((s) => s.animationStep);
}

export function useIsZoomed() {
  const animationStep = useAnimationStep();
  return animationStep > 0;
}
export function useIsSpinning() {
  const isZoomed = useIsZoomed();
  return !isZoomed;
}
