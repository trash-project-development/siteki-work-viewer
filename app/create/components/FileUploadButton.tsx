import { Button } from "@mui/material";
import { ChangeEvent, useRef } from "react";

interface props {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function FileUploadButton({ onChange }: props) {
  const audioFileInputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        accept=".mp3"
        type="file"
        style={{ display: "none" }}
        ref={audioFileInputRef}
        onChange={(e) => onChange && onChange(e)}
      />
      <Button
        variant="contained"
        onClick={() => {
          audioFileInputRef.current?.click();
        }}
      >
        アップロード
      </Button>
    </>
  );
}
