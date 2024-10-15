import { Box, TextField } from "@mui/material";

export default function TextWorkEdit({
  value,
  onChange,
  hidden = false,
}: {
  value: string;
  onChange: (text: string) => void;
  hidden?: boolean;
}) {
  return (
    <Box display={hidden ? "none" : "initial"}>
      <TextField
        label="本文"
        fullWidth
        multiline
        rows={10}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Box>
  );
}
