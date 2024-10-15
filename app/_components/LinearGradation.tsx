import { Typography, styled } from "@mui/material";
import { notoseifjp } from "../_lib/mui/font";

const LinearGradation = styled(Typography)(({ theme }) => ({
  background: `repeating-linear-gradient(
      to right,
      rgba(255, 0, 0, 1) 0%,
      rgba(255, 154, 0, 1) 10%,
      rgba(208, 222, 33, 1) 20%,
      rgba(79, 220, 74, 1) 30%,
      rgba(63, 218, 216, 1) 40%,
      rgba(47, 201, 226, 1) 50%,
      rgba(28, 127, 238, 1) 60%,
      rgba(95, 21, 242, 1) 70%,
      rgba(186, 12, 248, 1) 80%,
      rgba(251, 7, 217, 1) 90%,
      rgba(255, 0, 0, 1) 100%
    )`,
  fontFamily: `${notoseifjp.style.fontFamily}`,
  fontSize: "1em",
  fontWeight: 900,
  [theme.breakpoints.up("sm")]: {
    fontSize: "1.5em",
  },
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundSize: "200%, 200%",
  animation: "fancyGradation 16s linear infinite",
  "@keyframes fancyGradation": {
    "0%": {
      backgroundPosition: "0%",
    },
    "100%": {
      backgroundPosition: "200%",
    },
  },
}));

export default LinearGradation;
