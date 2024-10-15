"use client";
import LinearProgressWithLabel from "@/app/_components/LinearPrgoressWithLabel";
import AppSection from "@/app/_components/Section";
import { useFileUploadQueueValue } from "@/app/_lib/jotai/file-upload";
import {
  LinearProgress,
  Paper,
  Slider,
  Stack,
  Typography,
} from "@mui/material";

export default function UploadStatus() {
  const queue = useFileUploadQueueValue();
  return (
    <AppSection>
      <Stack spacing={2}>
        <Typography variant="h2" fontSize="2em">
          アップロードの進行状況
        </Typography>
        {queue.length === 0 && (
          <Typography color="lightgray">
            現在進行中のアップロードはありません
          </Typography>
        )}
        {queue.length !== 0 && (
          <Typography>
            現在 {queue.length}個のファイルがアップロード中です
          </Typography>
        )}
        {queue.map((value) => {
          return (
            <Paper variant="elevation" elevation={5} key={value.key}>
              <Stack spacing={1} p={2}>
                {value.type === "create" && <Typography>作品作成</Typography>}
                {value.type === "edit" && <Typography>作品編集</Typography>}
                <Typography>
                  作品「{value.workName}」のファイル「{value.fileName}」
                </Typography>
                <LinearProgressWithLabel value={value.percent} />
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </AppSection>
  );
}
