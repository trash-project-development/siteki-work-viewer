import {
  Alert,
  Box,
  Button,
  Dialog,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { escapeTagName } from "../_lib/util/escape-tagname";

export default function TagCreateModal({
  open = false,
  onClose,
  onCreate,
  tagName,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (tagName: string) => void;
  tagName: string;
}) {
  const theme = useTheme();
  return (
    <Dialog open={open} onClose={onClose}>
      <Box
        onClick={onClose}
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          sx={{ width: "24em", p: 3, position: "relative" }}
          onClick={(e) => e.stopPropagation()}
        >
          <Stack spacing={2}>
            <Typography
              variant="h2"
              sx={{
                fontSize: "1.2em",
                [theme.breakpoints.up("sm")]: {
                  fontSize: "2em",
                },
              }}
            >
              タグを作成
            </Typography>
            <Typography>
              タグ「{escapeTagName(tagName)}
              」を新規作成しようとしています。実行しますか？
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              sx={{ display: "flex", justifyContent: "end" }}
            >
              <Button onClick={() => onClose()}>キャンセル</Button>
              <Button
                variant="contained"
                onClick={() => {
                  onCreate(tagName);
                  onClose();
                }}
              >
                作成
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Dialog>
  );
}
