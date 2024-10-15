"use client";
import { Paper, useTheme } from "@mui/material";
import { ReactNode } from "react";

export default function AppSection({ children }: { children?: ReactNode }) {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        overflow: "hidden",
        p: 4,
        width: "90%",
        m: "auto",
        my: "1em",
        [theme.breakpoints.down("md")]: {
          maxWidth: "40em",
          width: "100%",
          mb: 2,
          p: 2,
        },
        [theme.breakpoints.up("md")]: {
          width: "40em",
          my: "2em",
        },
        [theme.breakpoints.up("lg")]: {
          minWidth: "40em",
          width: "50%",

          my: "2em",
        },
      }}
    >
      {children}
    </Paper>
  );
}
