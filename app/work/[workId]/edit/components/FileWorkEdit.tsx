import FileUploadArea from "@/app/_components/FileUploadArea";
import { calculatePartialFileHash } from "@/app/_lib/util/calculateHash";
import { Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import WorkFileCard from "./WorkFileCard";
import { arbitrarilyMimeType } from "@/app/_lib/util/arbitrarily-mimetype";

export interface EditingFile {
  file: string | File;
  displayName: string;
  fileName: string;
  mimeType: string;
  hash?: string;
}

interface CalculateState {
  calculated: number;
  skipped?: number;
  error?: number;
  total: number;
}

export default function FileWorkEdit({
  onChange,
  value = [],
  error,
  hidden = false,
}: {
  onChange: (files: EditingFile[]) => void;
  value?: EditingFile[];
  error?: string;
  hidden?: boolean;
}) {
  const [calculateState, setCalculateState] = useState<CalculateState | null>(
    null
  );

  async function handleAddedFiles(files: File[]) {
    setCalculateState({ calculated: 0, total: files.length });
    let skippedCount = 0;
    let errorCount = 0;
    const addedFiles: EditingFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const hash = await calculatePartialFileHash(file);
      if (!hash) {
        errorCount += 1;
        continue;
      }
      if (value.some((v) => v.hash === hash)) {
        skippedCount += 1;
        continue;
      }
      addedFiles.push({
        file: file,
        displayName: file.name.split(".").slice(0, -1).join("."),
        fileName: file.name,
        mimeType: arbitrarilyMimeType(file),
        hash: hash,
      });
      setCalculateState({
        calculated: i + 1,
        total: files.length,
        skipped: skippedCount,
        error: errorCount,
      });
    }
    if (addedFiles.length !== 0) {
      onChange([...value, ...addedFiles]);
    }
    setCalculateState(null);
  }
  return (
    <Stack display={hidden ? "none" : "initial"}>
      <FileUploadArea onAddFiles={handleAddedFiles} />
      {calculateState && (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            my: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress />
          <Typography variant="caption" textAlign="center">
            ファイルを処理中です
            <br />
            {calculateState.calculated}/{calculateState.total}
          </Typography>
        </Paper>
      )}
      <Stack spacing={1}>
        {value.map((fileInfo, index) => (
          <Box
            key={
              typeof fileInfo.file === "string" ? fileInfo.file : fileInfo.hash
            }
          >
            <WorkFileCard
              fileInfo={fileInfo}
              index={index + 1}
              onDelete={() => {
                const copiedArray = [...value];
                copiedArray.splice(index, 1);
                onChange(copiedArray);
              }}
              onMoveUp={() => {
                if (index <= 0) return;
                const copiedArray = [...value];
                const tmp = copiedArray[index - 1];
                copiedArray[index - 1] = copiedArray[index];
                copiedArray[index] = tmp;
                onChange(copiedArray);
              }}
              onMoveDown={() => {
                if (index >= value.length - 1) return;
                const copiedArray = [...value];
                const tmp = copiedArray[index + 1];
                copiedArray[index + 1] = copiedArray[index];
                copiedArray[index] = tmp;
                onChange(copiedArray);
              }}
              onChangeDisplayName={(displayName) => {
                const copiedArray = [...value];
                const changedFile = copiedArray[index];
                changedFile.displayName = displayName;
                copiedArray[index] = changedFile;
                onChange(copiedArray);
              }}
            />
          </Box>
        ))}
      </Stack>
      {error && <Typography sx={{ color: "red" }}>{error}</Typography>}
    </Stack>
  );
}
