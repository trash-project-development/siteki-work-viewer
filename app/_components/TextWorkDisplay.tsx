import { Box, SxProps, Theme } from "@mui/material";
import { notoseifjp } from "../_lib/mui/font";

export default function TextWorkDisplay({
  children,
  isVertical,
  sxOverride,
}: {
  children?: string;
  isVertical?: boolean;
  sxOverride?: SxProps<Theme>;
}) {
  return (
    <Box
      sx={{
        px: "1em",
        fontFamily: `${notoseifjp.style.fontFamily}`,
        overflow: "auto",
        writingMode: isVertical ? "vertical-rl" : "initial",
        height: "30em",
        width: "100%",
        whiteSpace: "pre-wrap",
        ...sxOverride,
      }}
    >
      {children}
    </Box>
  );
}
