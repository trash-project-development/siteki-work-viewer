import { createTheme } from "@mui/material";
import { jaJP } from "@mui/material/locale";
import { notojp, roboto } from "./font";

export const theme = createTheme(
  {
    components: {
      MuiCssBaseline: {
        styleOverrides: `
        ::-webkit-scrollbar{
            background-color: gray;
            width: 10px;
            height: 10px;
        },
        ::-webkit-scrollbar-thumb {
            background-color: white;
            border-radius: 10px;
        }
        `,
      },
    },
    palette: {
      mode: "dark",
      primary: {
        main: "#4278f5",
      },
      secondary: {
        main: "#f50057",
      },
      background: {
        default: "#000000",
        paper: "#0f172a",
      },
      text: {
        primary: "#ffffff",
        secondary: "rgba(255,255,255,0.6)",
      },
    },
    typography: {
      fontFamily: [
        roboto.style.fontFamily,
        notojp.style.fontFamily,
        '"Helvetica"',
        "Arial",
        "sans-serif",
      ].join(","),
    },
  },
  jaJP
);

declare module "@mui/material/styles" {
  interface Theme {}
  // allow configuration using `createTheme`
  interface ThemeOptions {}
}
