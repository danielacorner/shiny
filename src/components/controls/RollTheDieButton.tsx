import { Casino, Undo } from "@material-ui/icons";
import { IconButton, Tooltip } from "@material-ui/core";
import styled from "styled-components/macro";
import { useState } from "react";
import { useStore } from "../store/store";
import { animated, useSpring } from "react-spring";

const AnimatedIconButton = animated(IconButton);

/** show or hide the info overlay */
export function RollTheDieButton() {
  const isRollingDie = useStore((s) => s.isRollingDie);
  const set = useStore((s) => s.set);
  const [isHovered, setIsHovered] = useState(false);
  const springRoll = useSpring({
    transform: `rotate(${isHovered || isRollingDie ? 352 : 8}deg)`,
    opacity: isRollingDie ? 0 : 1,
  });
  const springReset = useSpring({ opacity: isRollingDie ? 1 : 0 });
  return (
    <RollTheDieButtonStyles
      onMouseOut={() => setIsHovered(false)}
      onMouseOver={() => setIsHovered(true)}
    >
      <Tooltip title={"roll! 🎲"}>
        <AnimatedIconButton
          className="btnRoll"
          style={{
            ...springRoll,
            pointerEvents: isRollingDie ? "none" : "auto",
          }}
          onClick={() => set({ isRollingDie: true })}
        >
          <Casino />
        </AnimatedIconButton>
      </Tooltip>
      <Tooltip title={"🔙 again"}>
        <AnimatedIconButton
          className="btnReset"
          style={{
            ...springReset,
            pointerEvents: isRollingDie ? "auto" : "none",
          }}
          onClick={() => set({ isRollingDie: false })}
        >
          <Undo />
        </AnimatedIconButton>
      </Tooltip>
    </RollTheDieButtonStyles>
  );
}
const RollTheDieButtonStyles = styled.div`
  .MuiButtonBase-root {
    color: hsla(0, 100%, 100%, 0.5);
    position: fixed;
    top: 0;
    right: 0;
  }
  .btnRoll {
  }
`;
