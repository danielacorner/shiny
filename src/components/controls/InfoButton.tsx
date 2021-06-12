import { useStore } from "../store/store";
import { Info } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import styled from "styled-components/macro";
import { useLocalStorageState } from "../../utils/hooks";
import { useEffect } from "react";

/** show or hide the info overlay */
export function InfoButton() {
  const [isInfoOverlayVisibleLS, setIsInfoOverlayVisibleLS] =
    useLocalStorageState("isInfoOverlayVisible", false);
  const set = useStore((s) => s.set);

  // sync isInfoOverlayVisible to LS value
  useEffect(() => {
    set({ isInfoOverlayVisible: isInfoOverlayVisibleLS });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInfoOverlayVisibleLS]);
  return (
    <InfoButtonStyles>
      <IconButton
        onClick={() => {
          setIsInfoOverlayVisibleLS(!isInfoOverlayVisibleLS);
        }}
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
