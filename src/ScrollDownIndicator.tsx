import styled from "styled-components/macro";
import { useCallback, useEffect, useState } from "react";
import { KeyboardArrowDown } from "@material-ui/icons";
import { useGesture } from "@use-gesture/react";

/** after a couple seconds, hint that user should scroll down */
export function ScrollDownIndicator({ translateY }) {
  const [status, setStatus] = useState<
    "hidden:initial" | "show" | "hidden:scrolled"
  >("hidden:initial");
  useEffect(() => {
    const timeout = setTimeout(() => {
      // reveal if we haven't scrolled yet
      setStatus((p) => (p === "hidden:initial" ? "show" : p));
    }, 2 * 1000);
    return () => clearTimeout(timeout);
  }, [setStatus]);

  // once the user has scrolled down past "20" to at least "15", hide the indicator
  const handleScroll = useCallback(() => {
    if (translateY < -window.innerHeight) {
      setStatus("hidden:scrolled");
    }
  }, [translateY]);
  /* const bind = */ useGesture(
    {
      // no need for state since we're hacking translateY from props
      onDrag: handleScroll,
      onScroll: handleScroll,
      onWheel: handleScroll,
    },
    // https://use-gesture.netlify.app/docs/options/#structure-of-the-config-object
    { target: window, window }
  );

  return (
    <ScrollDownIndicatorStyles {...{ status }}>
      <KeyboardArrowDown />
    </ScrollDownIndicatorStyles>
  );
}
const ScrollDownIndicatorStyles = styled.div`
  pointer-events: none;
  opacity: ${(p) => (p.status === "show" ? 0.6 : 0)};
  transition: opacity 0.5s;
  position: fixed;
  bottom: 72px;
  left: 0;
  right: 0;
  height: 30px;
  display: flex;
  justify-content: center;
  /* animate up and down */
  .MuiSvgIcon-root {
    font-size: 48px;
    animation: bounce 0.8s infinite alternate;
    color: white;
    filter: drop-shadow(0px -2px 9px white) drop-shadow(0px -2px 9px white);
  }

  @keyframes bounce {
    0% {
      transform: translateY(-12px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;
