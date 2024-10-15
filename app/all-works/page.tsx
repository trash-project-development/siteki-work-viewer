import { Box, Stack, Typography } from "@mui/material";
import Section from "../_components/Section";
import { getWorks } from "../_lib/fetchers/server/work";
import { WorkType } from "../_lib/common-types/work";
import WorkList from "./_components/WorkList";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "すべての作品",
};

export default async function Page() {
  const works = await getWorks();
  const fileWorks = works.filter((work) => work.type === WorkType.FILES);
  const textWorks = works.filter((work) => work.type === WorkType.TEXT);
  const lyricsWorks = works.filter((work) => work.type === WorkType.LYRICS);
  return (
    <Section>
      <Stack spacing={1}>
        <Typography variant="h2" sx={{ fontSize: "2em" }}>
          すべての作品
        </Typography>
        <Typography variant="h3" sx={{ fontSize: "1.5em" }}>
          ファイル作品
        </Typography>
        <WorkList works={fileWorks} />
        <Typography variant="h3" sx={{ fontSize: "1.5em" }}>
          文章作品
        </Typography>
        <WorkList works={textWorks} />
        <Typography variant="h3" sx={{ fontSize: "1.5em" }}>
          歌詞作品
        </Typography>
        <WorkList works={lyricsWorks} />
      </Stack>
    </Section>
  );
}
