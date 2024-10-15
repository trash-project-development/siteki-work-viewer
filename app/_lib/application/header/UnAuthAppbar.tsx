"use client";
import { AppBar, Toolbar, Typography, useTheme } from "@mui/material";

export default function UnAuthorizedAppbar() {
  const theme = useTheme();
  return (
    <AppBar sx={{ bgcolor: "primary.main" }}>
      <Toolbar>
        <Typography
          variant="h1"
          sx={{
            textWrap: "nowrap",
            width: "100%",
            textAlign: "center",
            fontSize: "1.2em",
            [theme.breakpoints.up("sm")]: {
              fontSize: "2em",
            },
          }}
        >
          {process.env.NEXT_PUBLIC_APP_NAME}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
