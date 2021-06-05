import * as React from "react";
import styled from "styled-components/macro";
import { useIsZoomed, useStore } from "../store";
import { CUSTOM_SCROLLBAR_CSS } from "../utils/cssSnippets";
import { useEventListener, useInterval, useWindowSize } from "../utils/hooks";
import debounce from "lodash.debounce";
import { useDrag } from "@use-gesture/react";
import { useFrame } from "@react-three/fiber";

const HEIGHT_MULTIPLIER = 10;
export default function ScrollHandler({ children }) {
  // const set = useStore((s) => s.set);
  // const isScrollable = useIsScrollable();
  const windowSize = useWindowSize();
  const maxY = windowSize.height * HEIGHT_MULTIPLIER;
  const setScrollY = useStore((s) => s.setScrollY);
  const setScrollTopPct = useStore((s) => s.setScrollTopPct);

  const scrollRef = React.useRef(null as any);

  // const scrollTo = (y: number) => {
  //   set({
  //     scrollTopPct: y / maxY,
  //   });
  //   scrollRef.current.scrollTop = y;
  //   setScrollY(y);
  // };

  // const handleWheel = debounce((event) => {
  //   if (!isScrollable) {
  //     return;
  //   }
  //   const newScrollY = Math.max(0, Math.min(maxY, scrollY - event.wheelDeltaY));
  //   scrollTo(newScrollY);
  // });

  // useEventListener("wheel", handleWheel);

  // check the scroll height and update the state
  // * fake useFrame for outside a Canvas
  useInterval({
    callback: () => {
      const scrollTop = scrollRef.current.scrollTop;
      setScrollY(scrollTop);
      setScrollTopPct(scrollTop / maxY);
    },
    interval: 1000 / 60,
    immediate: false,
  });

  // const bind = useDrag(
  //   ({ offset: [x, y], distance, ...rest }) => {
  //     console.log("🌟🚨 ~ ScrollHandler ~ delta", [x, y]);
  //     console.log("🌟🚨 ~ ScrollHandler ~ distance", distance);
  //     console.log("🌟🚨 ~ ScrollHandler ~ rest", rest);
  //     const newScrollY = Math.max(0, Math.min(maxY, scrollY - y));
  //     scrollTo(newScrollY);
  //   },
  //   {
  //     enabled: isScrollable,
  //     pointer: { touch: true },
  //   }
  // );

  // prevent pull-to-refresh when zoomed
  // const isZoomed = useIsZoomed();
  // React.useEffect(() => {
  //   document.body.style.overscrollBehavior = !isZoomed ? "unset" : "none";
  // }, [isZoomed]);

  return (
    <InvisibleScrollStyles /*  {...bind()} */>
      {children}
      <div className="scrollWrapper" ref={scrollRef}>
        <div className="scrollable" />
      </div>
    </InvisibleScrollStyles>
  );
}
const InvisibleScrollStyles = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: hsla(0, 0%, 100%, 0);
  .scrollWrapper {
    ${CUSTOM_SCROLLBAR_CSS}
    overflow-x: hidden;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: scroll;
    /* pointer-events: none; */
    .scrollable {
      height: ${HEIGHT_MULTIPLIER * 100}vh;
      width: 100%;
    }
  }
`;
