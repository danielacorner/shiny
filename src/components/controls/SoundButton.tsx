import { VolumeUp, VolumeMute } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import ReactPlayer from "react-player";
import styled from "styled-components/macro";
import { useLocalStorageState } from "../../utils/hooks";

/** show or hide the info overlay */
export function SoundButton() {
  const [isAudioPlaying, setIsAudioPlaying] = useLocalStorageState(
    "isAudioPlaying",
    true
  );
  return (
    <>
      <SoundButtonStyles>
        <IconButton onClick={() => setIsAudioPlaying(!isAudioPlaying)}>
          {isAudioPlaying ? <VolumeUp /> : <VolumeMute />}
        </IconButton>
      </SoundButtonStyles>
      <ReactPlayer
        playing={isAudioPlaying}
        url="https://www.youtube.com/watch?v=ysz5S6PUM-U"
      />
    </>
  );
}
const SoundButtonStyles = styled.div`
  .MuiButtonBase-root {
    color: hsla(0, 100%, 100%, 0.5);
  }
  position: fixed;
  top: 0;
  right: 0;
`;
