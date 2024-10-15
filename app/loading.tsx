"use client";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";

export default function Loading() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
        width: "100%",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <CircularProgress />
        <Typography>Loading Page...</Typography>
      </Stack>
    </Box>
  );
}
