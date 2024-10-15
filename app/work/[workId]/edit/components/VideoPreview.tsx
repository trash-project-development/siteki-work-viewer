import { Box } from "@mui/material";
import { useRef } from "react";

export default function VideoPreview({ url }: { url: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  function handleClick() {
    if (!videoRef.current) return;
    if (videoRef.current?.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
      onClick={handleClick}
    >
      <video
        ref={videoRef}
        style={{ width: "100%", height: "100%" }}
        disablePictureInPicture
        playsInline
        src={url}
      />
    </Box>
  );
}
