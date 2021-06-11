import { useStore } from "../store/store";
import { Info } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import styled from "styled-components/macro";

/** show or hide the info overlay */
export function InfoButton() {
  const isInfoOverlayVisible = useStore((s) => s.isInfoOverlayVisible);
  const set = useStore((s) => s.set);
  return (
    <InfoButtonStyles>
      <IconButton
        onClick={() => set({ isInfoOverlayVisible: !isInfoOverlayVisible })}
      >
        <Info />
      </IconButton>
    </InfoButtonStyles>
  );
}
const InfoButtonStyles = styled.div`
  .MuiButtonBase-root {
    color: hsla(0, 100%, 100%, 0.5);
  }
  position: fixed;
  bottom: 0;
  right: 0;
`;
