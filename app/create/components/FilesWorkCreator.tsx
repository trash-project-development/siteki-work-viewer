import FileUploadArea from "@/app/_components/FileUploadArea";
import {
  Paper,
  Stack,
  Alert,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import PreviewIcon from "@mui/icons-material/Preview";
import WorkFileCard from "./WorkFileCard";
import { FilesWork, CreatingWork, CreatingWorkFile } from "@/app/create/type";
import {
  calculatePartialFileHash,
} from "@/app/_lib/util/calculateHash";
import { useState } from "react";

interface CalculateState {
  calculated: number;
  skipped?: number;
  error?: number;
  total: number;
}

export default function FilesWorkCreator({
  onChange,
  value,
}: {
  value: Omit<FilesWork, keyof CreatingWork>;
  onChange: (value: Omit<FilesWork, keyof CreatingWork>) => void;
}) {
  const [calculateState, setCalculateState] = useState<CalculateState | null>(
    null
  );

  async function handleAddedFiles(files: File[]) {
    setCalculateState({ calculated: 0, total: files.length });
    let skippedCount = 0;
    let errorCount = 0;
    const addedFiles: CreatingWorkFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const hash = await calculatePartialFileHash(file);
      if (!hash) {
        errorCount += 1;
        continue;
      }
      if (value.files.some((v) => v.key === hash)) {
        skippedCount += 1;
        continue;
      }
      addedFiles.push({
        file: file,
        displayName: file.name.split(".").slice(0, -1).join("."),
        key: hash,
      });
      setCalculateState({
        calculated: i + 1,
        total: files.length,
        skipped: skippedCount,
        error: errorCount,
      });
    }
    if (addedFiles.length !== 0) {
      onChange({
        files: [...value.files, ...addedFiles],
      });
    }
    setCalculateState(null);
  }

  return (
    <Stack spacing={2}>
      <FileUploadArea onAddFiles={(files) => handleAddedFiles(files)} />
      <Paper variant="outlined">
        <Stack spacing={1} sx={{ p: 1 }}>
          {calculateState && (
            <Stack alignItems="center" width="100%">
              <Box>
                <CircularProgress />
              </Box>
              <Typography variant="caption">
                アップロードされたファイルを処理しています...
              </Typography>
              <Typography variant="caption">
                処理中/完了済み: {calculateState.calculated}/
                {calculateState.total}
              </Typography>
              {calculateState.skipped !== undefined &&
                calculateState.skipped !== 0 && (
                  <Typography variant="caption">
                    {calculateState.skipped}
                    個のファイルが重複していたためスキップされました
                  </Typography>
                )}
              {calculateState.error !== undefined &&
                calculateState.error !== 0 && (
                  <Typography variant="caption">
                    {calculateState.error}
                    個のファイルは処理に失敗しました
                  </Typography>
                )}
            </Stack>
          )}
          {value.files.length === 0 && !calculateState && (
            <Alert icon={<PreviewIcon />} variant="outlined" severity="info">
              ファイルをアップロードすると、ここにプレビューが表示されます
            </Alert>
          )}
          {value.files.map((fileInfo, index) => {
            return (
              <WorkFileCard
                onDelete={() => {
                  const copiedArray = [...value.files];
                  copiedArray.splice(index, 1);
                  onChange({ files: copiedArray });
                }}
                onMoveUp={() => {
                  if (index <= 0) return;
                  const copiedArray = [...value.files];
                  const tmp = copiedArray[index - 1];
                  copiedArray[index - 1] = copiedArray[index];
                  copiedArray[index] = tmp;
                  onChange({ files: copiedArray });
                }}
                onMoveDown={() => {
                  if (index >= value.files.length - 1) return;
                  const copiedArray = [...value.files];
                  const tmp = copiedArray[index + 1];
                  copiedArray[index + 1] = copiedArray[index];
                  copiedArray[index] = tmp;
                  onChange({ files: copiedArray });
                }}
                onChangeDisplayName={(displayName) => {
                  const copiedArray = [...value.files];
                  const changedFile = copiedArray[index];
                  changedFile.displayName = displayName;
                  copiedArray[index] = changedFile;
                  onChange({ files: copiedArray });
                }}
                index={index + 1}
                fileInfo={fileInfo}
                key={fileInfo.key}
              />
            );
          })}
        </Stack>
      </Paper>
    </Stack>
  );
}
