import { Typography } from "@mui/material";
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
  return <Typography>（対応していない作品タイプです）</Typography>;
}
