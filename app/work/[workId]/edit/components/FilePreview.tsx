import { Box } from "@mui/material";
import AudioPreview from "./AudioPreview";
import ImagePreview from "./ImagePreview";
import VideoPreview from "./VideoPreview";
import { InsertDriveFile } from "@mui/icons-material";

export default function FilePreview({
  url,
  displayName,
  mimeType,
}: {
  url: string;
  displayName: string;
  mimeType?: string;
}) {
  if (mimeType) {
    if (mimeType.startsWith("image/"))
      return <ImagePreview url={url} filename={displayName} />;
    if (mimeType.startsWith("video/")) return <VideoPreview url={url} />;
    if (mimeType.startsWith("audio/")) return <AudioPreview url={url} />;
  }
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
    >
      <InsertDriveFile sx={{ fontSize: "3em" }} />
    </Box>
  );
}
