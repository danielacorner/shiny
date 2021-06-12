import { VolumeUp, VolumeMute } from "@material-ui/icons";
import { IconButton, Tooltip } from "@material-ui/core";
import ReactPlayer from "react-player";
import styled from "styled-components/macro";
import { useState } from "react";
import { useLocalStorageState } from "../../utils/hooks";

/** show or hide the info overlay */
export function SoundButton() {
  const [isAudioPlaying, setIsAudioPlaying] = useLocalStorageState(
    // const [isAudioPlaying, setIsAudioPlaying] = useState(
    "isAudioPlaying",
    false // As of Chrome 66, videos must be muted in order to play automatically https://www.npmjs.com/package/react-player
  );
  const [isHovered, setIsHovered] = useState(false);
  return (
    <>
      <SoundButtonStyles
        onMouseOut={() => setIsHovered(false)}
        onMouseOver={() => setIsHovered(true)}
      >
        <Tooltip title={isAudioPlaying ? "mute" : "unmute"}>
          <IconButton onClick={() => setIsAudioPlaying(!isAudioPlaying)}>
            {isAudioPlaying ? <VolumeUp /> : <VolumeMute />}
          </IconButton>
        </Tooltip>
        <div className="soundInfo" style={{ opacity: isHovered ? 0.5 : 0 }}>
          <a
            href="https://www.youtube.com/watch?v=aK4JSwhdcdE"
            target="_blank"
            rel="noopener noreferrer"
          >
            Skyrim - Music {"&"} Ambience - Night
          </a>
        </div>
      </SoundButtonStyles>
      <ReactPlayer
        style={{ visibility: "hidden" }}
        playing={isAudioPlaying}
        url="https://www.youtube.com/watch?v=aK4JSwhdcdE"
      />
    </>
  );
}
const SoundButtonStyles = styled.div`
  .MuiButtonBase-root {
    color: hsla(0, 100%, 100%, 0.5);
  }
  .soundInfo {
    a {
      color: white;
    }
    position: fixed;
    bottom: 16px;
    left: 48px;
  }
  position: fixed;
  bottom: 0;
  left: 0;
`;
