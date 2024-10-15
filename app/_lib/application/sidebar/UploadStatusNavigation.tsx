import { Upload } from "@mui/icons-material";
import { useFileUploadQueueValue } from "../../jotai/file-upload";
import { Box, LinearProgress, Stack, Typography } from "@mui/material";

export default function UploadStatusNavigation() {
  const uploadQueue = useFileUploadQueueValue();
  return (
    <>
      <Upload sx={{ verticalAlign: "-7px" }} />
      アップロードの状態
      <Stack
        sx={{ mx: 2, my: 1 }}
        spacing={1}
        display={uploadQueue.length !== 0 ? "initial" : "none"}
      >
        <LinearProgress />
        <Typography sx={{ color: "lightgray", fontSize: "0.8em" }}>
          アップロードが進行中です
        </Typography>
      </Stack>
    </>
  );
}
