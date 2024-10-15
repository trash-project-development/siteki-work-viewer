import { TextField } from "@mui/material";

interface PropsType {
  lyrics: string;
  onChange: (lyrics: string) => void;
}

export default function LyricsEditor({ lyrics, onChange }: PropsType) {
  return (
    <TextField
      multiline
      rows={10}
      fullWidth
      label="歌詞"
      placeholder="ここに歌詞を入力します"
      value={lyrics}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
