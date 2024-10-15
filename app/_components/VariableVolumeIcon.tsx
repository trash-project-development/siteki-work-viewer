import {
  VolumeDown,
  VolumeOff,
  VolumeUp,
  VolumeMute,
} from "@mui/icons-material";

export default function VariableVolumeIcon({ volume }: { volume: number }) {
  const volumeIconArray = [
    <VolumeOff key={0} />,
    <VolumeMute key={1} />,
    <VolumeDown key={2} />,
    <VolumeUp key={3} />,
  ];

  return volumeIconArray[
    Math.min(
      Math.ceil(volume * (volumeIconArray.length - 1)),
      volumeIconArray.length - 1
    )
  ];
}
