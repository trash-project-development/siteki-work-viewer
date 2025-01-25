import { Box, Link, Stack, Typography } from "@mui/material";
import FileWorkViewer from "./FileWorkViewer";
import TextWorkViewer from "./TextWorkViewer";
import LyricsWorkViewer from "./LyricsWorkViewer";
import { WorkType } from "@/app/_lib/common-types/work";

export default function WorkViewer({
  workId,
  workType,
}: {
  workId: string;
  workType: WorkType;
}) {
  if (workType === WorkType.FILES) return <FileWorkViewer workId={workId} />;
  if (workType === WorkType.TEXT) return <TextWorkViewer workId={workId} />;
  if (workType === WorkType.LYRICS) return <LyricsWorkViewer workId={workId} />;
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
      <Stack direction="column" spacing={2} alignItems="center">
        <Typography variant="h2" sx={{ fontSize: "2em" }}>
          対応していない作品タイプです
        </Typography>
        <Typography sx={{ textAlign: "center", textWrap: "balance" }}>
          現在、この作品タイプは対応していません。アップデート等により変更された可能性があります。
          <br />
          詳しくは Github レポジトリの Migration を参照してください
        </Typography>
      </Stack>
    </Box>
  );
}
