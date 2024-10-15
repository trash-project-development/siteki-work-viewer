import { Box, Stack, TextField } from "@mui/material";

export interface EditingLyrics {
  lyrics: string;
}

export default function LyricsWorkEdit({
  hidden = false,
  value = { lyrics: "" },
  onChange,
}: {
  hidden?: boolean;
  value?: EditingLyrics;
  onChange: (v: EditingLyrics) => void;
}) {
  return (
    <Box display={hidden ? "none" : "initial"}>
      <Stack spacing={2}>
        <TextField
          fullWidth
          label="歌詞"
          multiline
          rows={10}
          value={value.lyrics}
          onChange={(e) => onChange({ ...value, lyrics: e.target.value })}
        />
      </Stack>
    </Box>
  );
}
