import LinearGradation from "@/app/_components/LinearGradation";
import {
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
  Divider,
  Stack,
  TextField,
  Tabs,
  Tab,
} from "@mui/material";
import { useEffect, useState } from "react";
import { TextWork, CreatingWork } from "@/app/create/type";
import TextWorkDisplay from "@/app/_components/TextWorkDisplay";

export default function TextWorkCreator({
  onChange,
}: {
  onChange?: (value: Omit<TextWork, keyof CreatingWork>) => void;
}) {
  const [mode, setMode] = useState("input");
  const [text, setText] = useState("");
  const [isVertical, setIsVertical] = useState(false);
  useEffect(() => {
    if (!onChange) return;
    onChange({ isTopToBottom: isVertical, text: text });
  }, [text, isVertical, onChange]);
  return (
    <Stack spacing={2}>
      <FormGroup>
        <FormControlLabel
          control={<Switch />}
          value={isVertical}
          onChange={(_, checked) => setIsVertical(checked)}
          label="縦書きを設定"
        />
      </FormGroup>
      <Tabs value={mode} onChange={(e, newValue) => setMode(newValue)}>
        <Tab label="入力" value="input" />
        <Tab label="プレビュー" value="preview" />
      </Tabs>
      <Box sx={{ position: "relative" }}>
        <TextField
          multiline
          rows={20}
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{
            width: "100%",
            visibility: mode === "input" ? "visible" : "hidden",
          }}
          label="本文"
          variant="filled"
        />
        {mode !== "input" && (
          <TextWorkDisplay
            isVertical={isVertical}
            sxOverride={{ position: "absolute", top: 0, left: 0 }}
          >
            {text}
          </TextWorkDisplay>
        )}
      </Box>
    </Stack>
  );
}
