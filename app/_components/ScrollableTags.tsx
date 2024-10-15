"use client";

import React, { useRef, useState, useEffect } from "react";
import { Box, Chip, IconButton } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import Link from "@/app/_components/Link";
import { Tag } from "../_lib/common-types/tag";

interface ScrollableTagsProps {
  tags: Tag[];
}

function ScrollableTags({ tags }: ScrollableTagsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  const updateButtonVisibility = (divElement: HTMLDivElement) => {
    const { scrollLeft, scrollWidth, clientWidth } = divElement;
    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft < scrollWidth - clientWidth);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const divElement = containerRef.current;
    updateButtonVisibility(divElement);
    const listener = () => updateButtonVisibility(divElement);
    divElement.addEventListener("scroll", listener);
    return () => divElement.removeEventListener("scroll", listener);
  }, []);

  const scroll = (direction: number) => {
    if (containerRef.current) {
      const scrollAmount = direction;
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
      {showLeftButton && (
        <IconButton
          size="small"
          onClick={function clickToScroll() {
            scroll(-200);
          }}
          sx={{
            position: "absolute",
            left: 0,
            zIndex: 1,
            border: "1px solid rgb(255, 255, 255)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <ArrowBack />
        </IconButton>
      )}

      <Box
        ref={containerRef}
        className="scroll-container"
        sx={{
          overflowX: "hidden",
          whiteSpace: "nowrap",
          flexGrow: 1,
          display: "flex",
          gap: 1,
        }}
      >
        {tags.length !== 0 &&
          tags.map((v, i) => (
            <Box key={v.id} sx={{ display: "inline-block" }}>
              <Link linkProps={{ href: `/tag/${v.id}` }}>
                <Chip label={v.name} />
              </Link>
            </Box>
          ))}
      </Box>

      {showRightButton && (
        <IconButton
          size="small"
          onClick={function clickToScroll() {
            scroll(200);
          }}
          sx={{
            position: "absolute",
            right: 0,
            zIndex: 1,
            border: "1px solid rgb(255, 255, 255)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <ArrowForward />
        </IconButton>
      )}
    </Box>
  );
}

export default ScrollableTags;
