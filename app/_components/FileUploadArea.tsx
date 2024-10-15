import { Upload } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import { theme } from "../_lib/mui/theme";
import { useDropzone } from "react-dropzone";
import { useRef } from "react";
import VisuallyHiddenInput from "./VisuallyHiddenInput";

interface PropsType {
  onAddFiles: (files: File[]) => void;
}

export default function FileUploadArea({ onAddFiles }: PropsType) {
  function onDrop(files: File[]) {
    onAddFiles(files);
  }
  const { getRootProps, isDragActive } = useDropzone({ onDrop, noClick: true });
  return (
    <Box
      sx={{
        width: "100%",
        height: "10em",
        border: "dashed 0.2em white",
        padding: "1em",
        borderRadius: "8px",
        bgcolor: isDragActive ? "rgba(255, 255, 255, 0.2)" : "unset",
      }}
      {...getRootProps()}
    >
      <Stack
        width="100%"
        height="100%"
        textAlign="center"
        display="flex"
        justifyContent="space-evenly"
      >
        <Upload sx={{ fontSize: "4em", mx: "auto" }} />
        <Box>
          <Button variant="contained" component="label">
            アップロード
            <VisuallyHiddenInput
              type="file"
              multiple
              onChange={(e) => {
                if (!e.currentTarget.files) return;
                onAddFiles(Array.from(e.currentTarget.files));
                e.target.value = "";
              }}
            />
          </Button>
        </Box>
        <Typography
          sx={{
            fontSize: "0.8em",
            [theme.breakpoints.up("sm")]: { fontSize: "1em" },
          }}
        >
          D&Dでファイルを投下するか、ボタンからファイルを選択します
        </Typography>
      </Stack>
    </Box>
  );
}
