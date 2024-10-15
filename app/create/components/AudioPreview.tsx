import { Pause, PlayArrow } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export default function AudioPreview({ url }: { url: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    if (!audioRef.current) return;
    const audioElement = audioRef.current;
    const playListener = () => {
      setIsPlaying(true);
    };
    const pauseListener = () => {
      setIsPlaying(false);
    };
    audioElement.addEventListener("play", playListener);
    audioElement.addEventListener("pause", pauseListener);
    audioElement.addEventListener("pause", pauseListener);
    audioElement.addEventListener("suspend", pauseListener);
    return () => {
      audioElement.removeEventListener("play", playListener);
      audioElement.removeEventListener("pause", pauseListener);
      audioElement.removeEventListener("pause", pauseListener);
      audioElement.removeEventListener("suspend", pauseListener);
    };
  }, [audioRef]);
  return (
    <Box
      sx={{
        maxWidth: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <audio src={url} ref={audioRef} />
      <IconButton
        onClick={() => {
          if (!audioRef.current) return;
          if (!audioRef.current.paused) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          } else {
            audioRef.current.play();
          }
        }}
      >
        {isPlaying ? <Pause /> : <PlayArrow />}
      </IconButton>
    </Box>
  );
}
