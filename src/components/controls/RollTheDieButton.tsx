import { Casino } from "@material-ui/icons";
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
  const spring = useSpring({ transform: `rotate(${isHovered ? 352 : 8}deg)` });
  return (
    <RollTheDieButtonStyles
      onMouseOut={() => setIsHovered(false)}
      onMouseOver={() => setIsHovered(true)}
    >
      <Tooltip title={"roll! 🎲"}>
        <AnimatedIconButton
          style={spring}
          onClick={() => set({ isRollingDie: !isRollingDie })}
        >
          <Casino />
        </AnimatedIconButton>
      </Tooltip>
    </RollTheDieButtonStyles>
  );
}
const RollTheDieButtonStyles = styled.div`
  .MuiButtonBase-root {
    color: hsla(0, 100%, 100%, 0.5);
  }
  position: fixed;
  top: 0;
  right: 0;
`;
