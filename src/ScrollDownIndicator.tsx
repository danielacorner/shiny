import styled from "styled-components/macro";
import { useEffect, useState } from "react";
import { KeyboardArrowDown } from "@material-ui/icons";
import { useEventListener } from "./utils/hooks";

/** after a couple seconds, hint that user should scroll down */
export function ScrollDownIndicator() {
  const [status, setStatus] = useState<
    "initial-hidden" | "show" | "scrolled-hidden"
  >("initial-hidden");
  useEffect(() => {
    const timeout = setTimeout(() => {
      // reveal if we haven't scrolled yet
      setStatus((p) => (p === "initial-hidden" ? "show" : p));
    }, 4000);
    return () => clearTimeout(timeout);
  }, [setStatus]);

  // once the user has scrolled, hide the indicator
  useEventListener("scroll", () => {
    setStatus("scrolled-hidden");
  });
  useEventListener("wheel", () => {
    setStatus("scrolled-hidden");
  });

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
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  display: flex;
  justify-content: center;
  transform: scale(1.8);
  /* animate up and down */
  .MuiSvgIcon-root {
    animation: bounce 0.8s infinite alternate;
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
