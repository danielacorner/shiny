import create from "zustand";

type GlobalStateType = {
  isZoomed: boolean;
  isSpinning: boolean;
  isScrollable: boolean;
  /** is the game paused / temperature === 0 */
  paused: boolean;
  /** if a property in the store is animating e.g. scale, can turn things on/off */
  isPropertyAnimating: boolean;
  scrollTopPct: number;
  set: (newState: any) => any;
};

// zustand https://github.com/pmndrs/zustand
// with typescript https://react-tracked.js.org/docs/tutorial-zustand-01/
export const useStore = create<GlobalStateType>(
  (set): GlobalStateType => ({
    isSpinning: false,
    isScrollable: false,
    paused: false,
    isZoomed: false,
    isPropertyAnimating: false,
    scrollTopPct: 0,
    set: (newState) => set((state) => ({ ...state, ...newState })),
  })
);
