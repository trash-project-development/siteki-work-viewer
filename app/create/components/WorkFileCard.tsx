import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Theme,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Delete as DeleteIcon,
  DriveFileRenameOutline as FileRenameIcon,
  Done as DoneIcon,
} from "@mui/icons-material";
import byteSize from "byte-size";
import FilePreview from "./FilePreview";
import { CreatingWorkFile } from "@/app/create/type";
import { useEffect, useState } from "react";

export default function WorkFileCard({
  fileInfo,
  index,
  onDelete,
  onMoveUp,
  onMoveDown,
  onChangeDisplayName,
}: {
  fileInfo: CreatingWorkFile;
  index: number;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onChangeDisplayName: (displayName: string) => void;
}) {
  const isPC = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));
  const isLargerThanSmartphone = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("md")
  );
  const fileName = fileInfo.file.name;
  const extension = fileName.split(".")?.at(-1)?.toLocaleUpperCase();
  const fileSize = byteSize(fileInfo.file.size).toString();

  const mimeType = fileInfo.file.type;

  const [url, setURL] = useState("");

  useEffect(() => {
    const objectURL = URL.createObjectURL(fileInfo.file);
    setURL(objectURL);
    return () => {
      URL.revokeObjectURL(objectURL);
    };
  }, [fileInfo]);

  const [isEditing, setIsEditing] = useState(false);
  const [editedDisplayName, setEditedDisplayName] = useState(
    fileInfo.displayName
  );
  function startEditing() {
    setIsEditing(true);
    setEditedDisplayName(fileInfo.displayName);
  }

  function endEditing() {
    if (editedDisplayName.length !== 0) {
      onChangeDisplayName(editedDisplayName);
    }
    setIsEditing(false);
  }

  return (
    <Paper
      sx={{
        p: 2,
        margin: "auto",
        flexGrow: 1,
      }}
    >
      <Grid container spacing={2} direction={isPC ? "row" : "column"}>
        <Grid
          item
          xs={1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {index}
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ height: 128 }}>
            <FilePreview url={url} filename={fileName} mimeType={mimeType} />
          </Box>
        </Grid>
        <Grid item xs={5} container>
          <Grid item xs container direction="column" spacing={2} wrap="nowrap">
            <Grid item xs zeroMinWidth textOverflow="ellipsis">
              <Stack direction="row" spacing={1}>
                {isEditing ? (
                  <>
                    <TextField
                      size="small"
                      value={editedDisplayName}
                      onChange={(e) => setEditedDisplayName(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          // @ts-ignore: 変換中のEnterキーを判別するにはこれを使うしかないから
                          e.keyCode === 229
                        ) {
                          return;
                        }
                        if (e.key === "Enter") {
                          endEditing();
                        }
                      }}
                    />
                    <IconButton sx={{ m: 0 }} onClick={endEditing}>
                      <DoneIcon sx={{ fontSize: "0.9em" }} />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <Typography
                      fontSize="1em"
                      noWrap
                      display="flex"
                      height="100%"
                    >
                      {fileInfo.displayName}
                    </Typography>
                    <IconButton sx={{ m: 0, p: 0 }} onClick={startEditing}>
                      <FileRenameIcon
                        sx={{ fontSize: "0.9em", color: "darkgray" }}
                      />
                    </IconButton>
                  </>
                )}
              </Stack>
              <Typography fontSize="0.8em" gutterBottom my={1}>
                {fileSize} • {extension}
              </Typography>
            </Grid>
            <Grid item container direction="row" spacing={1}>
              <Grid item xs={4}>
                <Button sx={{ color: "white" }} fullWidth onClick={onMoveUp}>
                  <ArrowUpwardIcon />
                  {isLargerThanSmartphone && (
                    <Typography noWrap>上へ</Typography>
                  )}
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button sx={{ color: "white" }} fullWidth onClick={onMoveDown}>
                  <ArrowDownwardIcon />
                  {isLargerThanSmartphone && (
                    <Typography noWrap>下へ</Typography>
                  )}
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button sx={{ color: "red" }} fullWidth onClick={onDelete}>
                  <DeleteIcon />
                  {isLargerThanSmartphone && (
                    <Typography noWrap>削除</Typography>
                  )}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
