import { VolumeUp, VolumeMute } from "@material-ui/icons";
import { IconButton, Tooltip } from "@material-ui/core";
import ReactPlayer from "react-player";
import styled from "styled-components/macro";
import { useState } from "react";
import { useLocalStorageState } from "../../utils/hooks";

/** show or hide the info overlay */
export function AudioSoundButton() {
  const [isAudioPlaying, setIsAudioPlaying] = useLocalStorageState(
    // const [isAudioPlaying, setIsAudioPlaying] = useState(
    "isAudioPlaying",
    false // As of Chrome 66, videos must be muted in order to play automatically https://www.npmjs.com/package/react-player
  );
  const [isHovered, setIsHovered] = useState(false);

  const date = new Date();
  const hourOfDay = date.getHours();
  const isDaytime = hourOfDay > 6 && hourOfDay < 18;
  const isRaining = date.getDate() % 3 === 0;
  const isMonday = date.getDay() === 1;
  const isFriday = date.getDay() === 5;
  const music = isDaytime
    ? isMonday
      ? {
          title: "Skyrim - Music & Ambience - Towns",
          href: "https://www.youtube.com/watch?v=Y4KX-owEk98",
        }
      : isRaining
      ? {
          title: "Skyrim - Music & Ambience - Rainy Day",
          href: "https://www.youtube.com/watch?v=8F1-1j_ZDgc",
        }
      : isFriday
      ? {
          title: "Skyrim - Music & Ambience - Taverns",
          href: "https://www.youtube.com/watch?v=dd10InDdvJE",
        }
      : {
          title: "Skyrim - Music & Ambience - Day",
          href: "https://www.youtube.com/watch?v=hBkcwy-iWt8",
        }
    : isRaining
    ? {
        title: "Skyrim - Music & Ambience - Rainy Night",
        href: "https://www.youtube.com/watch?v=vgUaZz04bkw",
      }
    : {
        title: "Skyrim - Music & Ambience - Night",
        href: "https://www.youtube.com/watch?v=aK4JSwhdcdE",
      };
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
          <a href={music.href} target="_blank" rel="noopener noreferrer">
            {music.title}
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
