"use client";
import { Box, Button, Typography } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";

export default function TextAccoridion({
  children,
  maxLines = 5,
  noStringText = "(なし)",
}: {
  children?: ReactNode;
  maxLines?: number;
  noStringText?: string;
}) {
  const lineHeight = 1.5;
  const textRef = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  function detectIsOverflowing(element: HTMLParagraphElement) {
    const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
    const maxHeight = lineHeight * maxLines;

    if (element.scrollHeight > maxHeight) {
      setIsOverflowing(true);
    } else {
      setIsOverflowing(false);
    }
  }

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      detectIsOverflowing(element);
    });
    observer.observe(element);
    return () => {
      observer.unobserve(element);
    };
  }, [children, maxLines]);

  function handleToggle() {
    setOpen((p) => !p);
    if (open && textRef.current) {
      textRef.current.scrollTo({ top: 0 });
    }
  }

  const evaluatedMaxLines = open ? 20 : isOverflowing ? maxLines - 1 : maxLines;

  return (
    <Box
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        whiteSpace: "pre-wrap",
        p: 2,
      }}
    >
      <Typography
        component="div"
        ref={textRef}
        sx={{
          overflow: open ? "auto" : "hidden",
          textOverflow: "ellipsis",
          lineClamp: open ? 20 : evaluatedMaxLines,
          lineHeight: `${lineHeight}em`,
          maxHeight: `${lineHeight * evaluatedMaxLines}em`,
          color: !!children ? "white" : "darkgray",
        }}
      >
        {children || noStringText}
      </Typography>
      {isOverflowing && !open && <Typography>...</Typography>}
      {isOverflowing && (
        <Button sx={{ m: 0, p: 0 }} onClick={handleToggle}>
          {open ? "閉じる" : "詳細を表示"}
        </Button>
      )}
    </Box>
  );
}
