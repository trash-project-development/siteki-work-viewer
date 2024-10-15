"use client";
import { fetchServerFilesInfo } from "@/app/_lib/fetchers/client/system";
import { useQuery } from "@tanstack/react-query";
import AppSection from "../Section";
import { Stack, Typography } from "@mui/material";
import byteSize from "byte-size";

export default function SystemFileInfo() {
  const { data, isLoading } = useQuery({
    queryKey: ["system/info/file"],
    queryFn: async () => {
      return await fetchServerFilesInfo();
    },
  });

  if (isLoading) return <AppSection>取得中...</AppSection>;
  return (
    <AppSection>
      <Stack alignItems="center">
        <Typography
          variant="h2"
          sx={(theme) => ({
            fontSize: "2em",
            [theme.breakpoints.down("sm")]: {
              fontSize: "1.2em",
            },
          })}
        >
          サーバーのファイルの状態
        </Typography>
        <Typography>ファイルの数: {data?.fileWork.count}個</Typography>
        <Typography>
          ファイルの大きさ {byteSize(data?.fileWork.size ?? 0).toString()}
        </Typography>
      </Stack>
    </AppSection>
  );
}
