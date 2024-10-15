import { Download } from "@mui/icons-material";
import { Box, Button, Link, Paper, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import ImageViewer from "./ImageViewer";
import { useSetAtom } from "jotai";
import { previewModalAtom } from "../jotai/preview-modal";
import { WorkFile } from "@/app/_lib/common-types/file";
import VideoViewer from "./VideoViewer";
import AudioViewer from "./AudioViewer";
import {
  fetchWorkFiles,
  fetchWorkStatus,
} from "@/app/_lib/fetchers/client/work";
import { finishWorkFileCreating } from "@/app/_lib/actions/work";
import { useRouter } from "next/navigation";

export default function FileWorkViewer({ workId }: { workId: string }) {
  const router = useRouter();
  const setPreviewInfo = useSetAtom(previewModalAtom);
  const { isLoading: isLoadingStatus, data: status } = useQuery({
    queryKey: ["work", workId, "status"],
    queryFn: async () => {
      return await fetchWorkStatus(workId);
    },
  });
  const { isLoading, data } = useQuery({
    queryKey: ["work", workId, "files"],
    queryFn: async () => {
      return await fetchWorkFiles(workId);
    },
  });

  if (isLoading || isLoadingStatus)
    return <Typography>読み込み中です...</Typography>;
  if (!data) return <Typography>読み込みに失敗しました</Typography>;

  if (status === "processing") {
    return (
      <Stack alignItems="center" spacing={1}>
        <Typography>このファイルは現在処理中です</Typography>
        <Typography>
          処理を強制的に終了するには下のボタンを押してください
        </Typography>
        <Button
          variant="contained"
          onClick={async () => {
            await finishWorkFileCreating(workId);
            router.refresh();
          }}
          color="secondary"
        >
          強制終了
        </Button>
      </Stack>
    );
  }

  function handleOpenPreviewModal(
    fileInfo: WorkFile,
    size: { width: number; height: number }
  ) {
    setPreviewInfo({
      mimeType: fileInfo.mime!,
      url: fileInfo.fileURL,
      size,
    });
  }

  return (
    <Box>
      <Stack spacing={1}>
        {data.map((fileInfo) => {
          if (fileInfo.mime?.startsWith("image/")) {
            return (
              <ImageViewer
                key={fileInfo.id}
                url={fileInfo.fileURL}
                fileId={fileInfo.id}
                displayName={fileInfo.displayName}
                downloadURL={`${fileInfo.fileURL}?download`}
                onExpand={(size) => {
                  handleOpenPreviewModal(fileInfo, size);
                }}
              />
            );
          }
          //TODO 動画、音声の表示を画像みたいによくする（特に音声）
          if (fileInfo.mime?.startsWith("video/")) {
            return (
              <VideoViewer
                key={fileInfo.id}
                url={fileInfo.fileURL}
                displayName={fileInfo.displayName}
                downloadURL={`${fileInfo.fileURL}?download`}
              />
            );
          }
          if (fileInfo.mime?.startsWith("audio/")) {
            return (
              <AudioViewer
                key={fileInfo.id}
                displayName={fileInfo.displayName}
                url={fileInfo.fileURL}
                downloadURL={`${fileInfo.fileURL}?download`}
              />
            );
          }
          return (
            <Paper
              variant="elevation"
              elevation={5}
              sx={{ p: 2 }}
              key={fileInfo.id}
            >
              <Box
                key={fileInfo.id}
                sx={{
                  width: "100%",
                  height: "7em",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ color: "darkgray" }}>
                  プレビューできないファイル形式です:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* ルーティングをしているわけではないのでNext.jsのやつがないMUIのLinkコンポーネントを用いている */}
                  <Link
                    href={`/api/file/${fileInfo.id}?download`}
                    download={true}
                    sx={{ color: "white" }}
                  >
                    <Stack direction="row">
                      <Typography>{fileInfo.fileName}</Typography>
                      <Download />
                    </Stack>
                  </Link>
                </Box>
              </Box>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
}
