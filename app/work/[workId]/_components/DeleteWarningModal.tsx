import { Box, Button, Modal, Paper, Stack, Typography } from "@mui/material";

interface PropsType {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteWarning({ open, onClose, onDelete }: PropsType) {
  return (
    <Modal open={open}>
      <Box
        sx={{
          width: "100vw",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          variant="elevation"
          sx={{ width: "40em", height: "12em", p: "2em" }}
        >
          <Stack spacing={2}>
            <Typography variant="h2" fontSize="2em">
              警告
            </Typography>
            <Typography>
              この操作を実行すると不可逆的に作品の情報、ファイルが永遠に失われます。
            </Typography>
            <Box display="flex" justifyContent="flex-end">
              <Button onClick={onClose}>キャンセルする</Button>
              <Button
                onClick={onDelete}
                sx={{ bgcolor: "red", color: "white" }}
              >
                削除する
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Modal>
  );
}
