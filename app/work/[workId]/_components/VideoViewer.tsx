import { Download } from "@mui/icons-material";
import { Box, IconButton, Paper, Typography } from "@mui/material";

export default function VideoViewer({
  url,
  downloadURL,
  displayName,
}: {
  url?: string;
  downloadURL?: string;
  displayName?: string;
}) {
  return (
    <Paper variant="elevation" elevation={5}>
      <Box
        sx={{
          borderRadius: "8px 8px 0px 0px",
          padding: 1,
          backgroundColor: "",
          display: "flex",

          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Typography
          sx={{
            padding: 1,
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {displayName}
        </Typography>
        <Box>
          {downloadURL && (
            <a href={downloadURL} download={true}>
              <IconButton>
                <Download />
              </IconButton>
            </a>
          )}
        </Box>
      </Box>
      <Box>
        <video src={url} style={{ width: "100%" }} controls playsInline />
      </Box>
    </Paper>
  );
}
