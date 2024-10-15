import { Box } from "@mui/material";
import Image from "next/image";

export default function ImagePreview({
  url,
  filename,
}: {
  url: string;
  filename: string;
}) {
  if (url === "") return;
  // TODO クリックしたら拡大してプレビューの詳細表示
  return (
    <Box sx={{ position: "relative", maxWidth: "100%", height: "100%" }}>
      <Image src={url} alt={filename} fill style={{ objectFit: "contain" }} />
    </Box>
  );
}
