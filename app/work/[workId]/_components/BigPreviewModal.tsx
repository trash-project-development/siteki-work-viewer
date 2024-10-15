"use client";

import { Box, Button, Modal } from "@mui/material";
import { PreviewInfo } from "../jotai/preview-modal";
import Image from "next/image";

export default function BigPreviewModal({
  previewInfo,
  onClose,
}: {
  previewInfo?: PreviewInfo;
  onClose: () => void;
}) {
  return (
    <Modal open={!!previewInfo}>
      <Box
        sx={{
          width: "100vw",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box sx={{ maxWidth: "100vw", height: "70vh", overflow: "hidden" }}>
            {previewInfo?.mimeType.startsWith("image/") && (
              <Image
                src={previewInfo?.url ?? ""}
                alt="プレビュー"
                width={previewInfo.size.width ?? 0}
                height={previewInfo.size.height ?? 0}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            )}
          </Box>
          <Button sx={{ width: "60vw" }} variant="contained" onClick={onClose}>
            閉じる
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
