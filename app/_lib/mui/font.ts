import { Roboto, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const notojp = Noto_Sans_JP({
  subsets: ["latin"],
  display: "swap",
});

export const notoseifjp = Noto_Serif_JP({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
});
