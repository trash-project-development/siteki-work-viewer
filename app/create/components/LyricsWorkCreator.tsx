import { Paper, Stack, Typography } from "@mui/material";
import LyricsEditor from "./LyricsEditor";
import { LyricsWork, CreatingWork } from "@/app/create/type";

export default function LyricsWorkCreator({
  onChange,
  value,
}: {
  onChange: (value: Omit<LyricsWork, keyof CreatingWork>) => void;
  value: Omit<LyricsWork, keyof CreatingWork>;
}) {
  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}>
        <Typography mb={2}>歌詞作成エディター</Typography>
        <LyricsEditor
          onChange={(lyrics) => {
            const newValue = { ...value, lyrics };
            onChange(newValue);
          }}
          lyrics={value.lyrics}
        />
      </Paper>
    </Stack>
  );
}
