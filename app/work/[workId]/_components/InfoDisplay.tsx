"use client";

import Section from "@/app/_components/Section";
import {
  Box,
  IconButton,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import WorkViewer from "./WorkViewer";
import { useAtom } from "jotai";
import { previewModalAtom } from "../jotai/preview-modal";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  LinkOutlined as LinkIcon,
} from "@mui/icons-material";
import { deleteWork } from "@/app/_lib/actions/work";
import { useRouter } from "next/navigation";
import BigPreviewModal from "./BigPreviewModal";
import DeleteWarning from "./DeleteWarningModal";
import Link from "@/app/_components/Link";
import { useSnackbar } from "@/app/_lib/application/snackbar/snackbar";
import { Work } from "@/app/_lib/common-types/work";

export default function InfoDisplay({
  children,
  workId,
  data,
  title,
}: {
  children: ReactNode;
  workId: string;
  data: Work;
  title: string;
}) {
  const router = useRouter();
  const theme = useTheme();
  const { addSnackbar } = useSnackbar();
  const isSmartphone = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const [previewInfo, setPreviewInfo] = useAtom(previewModalAtom);
  const [isDeleteWarning, setIsDeleteWarning] = useState(false);
  const [copiedURL, setCopiedURL] = useState("");
  useEffect(() => {
    setCopiedURL(
      `${window.location.protocol}//${window.location.host}/work/${workId}`
    );
  }, [workId]);
  return (
    <>
      <Section>
        <Stack spacing={1}>
          <Stack direction={isSmartphone ? "column" : "row"} spacing={1}>
            <Typography
              variant="h2"
              sx={{
                fontSize: "2em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                flex: 1,
              }}
            >
              {title}
            </Typography>
            <Box
              sx={{
                borderRadius: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                [theme.breakpoints.down("sm")]: {
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                },
              }}
            >
              <IconButton
                onClick={() => {
                  copyToClipboard(copiedURL);
                  addSnackbar({
                    key: `work:${workId}-copyURL`,
                    message: "URLをコピーしました",
                    severity: "success",
                  });
                }}
              >
                <LinkIcon />
              </IconButton>
              <Link linkProps={{ href: `/work/${workId}/edit` }}>
                <IconButton>
                  <EditIcon />
                </IconButton>
              </Link>
              <IconButton
                sx={{ color: "red" }}
                onClick={() => {
                  setIsDeleteWarning(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Stack>
          {children}
          <WorkViewer workId={workId} workType={data.type} />
        </Stack>
      </Section>
      <DeleteWarning
        open={isDeleteWarning}
        onClose={() => setIsDeleteWarning(false)}
        onDelete={() => {
          deleteWork(workId);
          router.push("/");
        }}
      />
      <BigPreviewModal
        previewInfo={previewInfo}
        onClose={() => setPreviewInfo(undefined)}
      />
    </>
  );
}

function copyToClipboard(text: string) {
  window.navigator.clipboard.writeText(text);
}
