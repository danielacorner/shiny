import { useStore } from "../store/store";
import { Info } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import styled from "styled-components/macro";
import { useLocalStorageState } from "../../utils/hooks";
import { useEffect } from "react";
import { getTimeOfDay } from "../../utils/timeUtils";

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

  const { isDaytime } = getTimeOfDay();
  return (
    <InfoButtonStyles>
      <IconButton
        onClick={() => {
          setIsInfoOverlayVisibleLS(!isInfoOverlayVisibleLS);
        }}
        style={{ color: `hsla(0,0%,${isDaytime ? 0 : 100}%,50%)` }}
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
