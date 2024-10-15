import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    theme_color: "#5384f6",
    background_color: "#000000",
    icons: [
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "icon512_maskable.png",
        type: "image/png",
      },
      {
        purpose: "any",
        sizes: "512x512",
        src: "icon512_rounded.png",
        type: "image/png",
      },
    ],
    orientation: "natural",
    display: "standalone",
    dir: "auto",
    lang: "ja",
    name: process.env.NEXT_PUBLIC_APP_NAME,
    short_name: process.env.NEXT_PUBLIC_APP_NAME,
    start_url: "/",
    scope: "/",
  };
}
