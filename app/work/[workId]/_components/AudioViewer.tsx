import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  Paper,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import WaveSurfer from "wavesurfer.js";
import WaveSurferPlayer, { WavesurferProps } from "@wavesurfer/react";
import {
  Download,
  Forward10,
  Pause,
  PlayArrow,
  Replay10,
} from "@mui/icons-material";
import VariableVolumeIcon from "@/app/_components/VariableVolumeIcon";

export default function AudioViewer({
  url,
  downloadURL,
  displayName,
}: {
  url?: string;
  downloadURL?: string;
  displayName?: string;
}) {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isControllingVolume, setIsControllingVolume] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [isStartedLoad, setIsStartedLoad] = useState(false);

  const onReady: WavesurferProps["onReady"] = (ws) => {
    setWavesurfer(ws);
    setIsPlaying(false);
    setIsLoading(false);
    setErrorMessage(undefined);
  };

  const onError: WavesurferProps["onError"] = (_ws, error) => {
    if (error instanceof MediaError) {
      if (error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED)
        setErrorMessage("このファイルはサポートされていません");
      if (error.code === MediaError.MEDIA_ERR_DECODE) {
        setErrorMessage("デコードに失敗しました");
      }
    }
    setErrorMessage("不明なエラーが発生しました");
  };

  const onSkip = (time: number) => {
    if (!wavesurfer) return;
    const currentTime = wavesurfer.getCurrentTime();
    wavesurfer.setTime(currentTime + time);
  };

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  const onVolumeChange = (volume: number) => {
    setVolume(volume);
    wavesurfer?.setVolume(volume);
  };

  return (
    <Paper variant="elevation" elevation={5} sx={{ p: 2 }}>
      <Typography
        sx={{
          padding: 1,
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {displayName}
      </Typography>
      <Box sx={{ position: "relative", height: 100 }}>
        {!errorMessage && isStartedLoad && isLoading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={1}
          >
            <Stack>
              <CircularProgress />
              <Typography textAlign="center" fontSize="0.8em">
                {loadingPercent}%
              </Typography>
            </Stack>
          </Box>
        )}
        {errorMessage && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={1}
          >
            <Stack alignItems="center" textAlign="center">
              <Typography fontSize="1em">{errorMessage}</Typography>
              <Typography
                fontSize="0.8em"
                variant="caption"
                color="InactiveCaptionText"
              >
                ファイルをダウンロードするかもう一度お試しください
              </Typography>
            </Stack>
          </Box>
        )}
        {isStartedLoad && (
          <Box sx={{ visibility: isLoading ? "hidden" : "visible" }}>
            <WaveSurferPlayer
              height={100}
              waveColor="gray"
              progressColor="lightgray"
              cursorWidth={2}
              barGap={1}
              barWidth={3}
              url={url}
              onReady={onReady}
              onError={onError}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onLoading={(_ws, percent) => {
                setLoadingPercent(percent);
              }}
            />
          </Box>
        )}
        {!isStartedLoad && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={1}
          >
            <Button onClick={() => setIsStartedLoad(true)}>LOAD</Button>
          </Box>
        )}
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Box position="relative">
          <IconButton
            disabled={!!errorMessage || isLoading}
            onClick={() => onVolumeChange(volume === 0 ? 1 : 0)}
            onMouseEnter={() => {
              if (!!errorMessage || isLoading) return;
              setIsControllingVolume(true);
            }}
          >
            <VariableVolumeIcon volume={volume} />
          </IconButton>

          <Box sx={{ position: "absolute", left: 0, bottom: 0, zIndex: 2 }}>
            <Collapse
              in={isControllingVolume}
              orientation="horizontal"
              unmountOnExit={false}
              onMouseLeave={() => setIsControllingVolume(false)}
            >
              <Paper
                variant="elevation"
                elevation={10}
                sx={{
                  height: "100%",
                  width: "15em",
                }}
              >
                <Stack spacing={2} direction="row" alignItems="center" pr={2}>
                  <IconButton
                    onClick={() => onVolumeChange(volume === 0 ? 1 : 0)}
                  >
                    <VariableVolumeIcon volume={volume} />
                  </IconButton>
                  <Slider
                    min={0}
                    max={1}
                    step={0.00000001}
                    value={volume}
                    onChange={(e, v) => {
                      if (Array.isArray(v)) return;
                      onVolumeChange(v);
                    }}
                  />
                </Stack>
              </Paper>
            </Collapse>
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-around">
          <IconButton
            onClick={() => onSkip(-10)}
            disabled={!!errorMessage || isLoading}
          >
            <Replay10 />
          </IconButton>
          <IconButton
            onClick={onPlayPause}
            disabled={!!errorMessage || isLoading}
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton
            onClick={() => onSkip(10)}
            disabled={!!errorMessage || isLoading}
          >
            <Forward10 />
          </IconButton>
        </Box>
        <Box>
          <a href={downloadURL} download={true}>
            <IconButton>{downloadURL && <Download />}</IconButton>
          </a>
        </Box>
      </Box>
    </Paper>
  );
}
