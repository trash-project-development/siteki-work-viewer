import Link from "@/app/_components/Link";
import { Download, Fullscreen } from "@mui/icons-material";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchDimension } from "@/app/_lib/fetchers/client/file";

export default function ImageViewer({
  url,
  fileId,
  downloadURL,
  displayName,
  onExpand,
}: {
  url: string;
  fileId: string;
  downloadURL?: string;
  displayName: string;
  onExpand?: (size: { height: number; width: number }) => void;
}) {
  const [isShowingDescription, setIsShowingDescription] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["file", fileId, "dimension"],
    queryFn: async () => {
      const size = (await fetchDimension(fileId)) ?? { height: 0, width: 0 };
      return size;
    },
  });
  if (isLoading) return <Typography>読み込み中...</Typography>;
  return (
    <Paper
      variant="elevation"
      elevation={5}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "400px",
          position: "relative",
        }}
        onMouseEnter={() => {
          setIsShowingDescription(true);
        }}
        onMouseLeave={() => {
          setIsShowingDescription(false);
        }}
      >
        <Image
          src={url}
          alt={displayName}
          width={data?.width}
          height={data?.height}
          style={{ width: "100%", height: "auto" }}
          priority
        />
        {isShowingDescription && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              position: "absolute",
              bottom: "0px",
              width: "100%",
              backgroundColor: "rgba(0, 0, 0, 50%)",
              p: 2,
            }}
          >
            <Typography>{displayName}</Typography>
            <Box display="flex">
              {downloadURL && (
                <a href={downloadURL} download={true}>
                  <IconButton>
                    <Download />
                  </IconButton>
                </a>
              )}
              <IconButton
                onClick={() =>
                  onExpand &&
                  onExpand({ width: data!.width, height: data!.height })
                }
              >
                <Fullscreen />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
