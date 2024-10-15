import { Avatar, Chip, Stack } from "@mui/material";
import { notFound } from "next/navigation";
import InfoDisplay from "./_components/InfoDisplay";
import TextAccoridion from "@/app/_components/TextAccordion";
import ScrollableTags from "../../_components/ScrollableTags";
import AutoLinker from "@/app/_components/AutoLinker";
import {
  getWork,
  getWorkAuthors,
  getWorkTags,
} from "@/app/_lib/fetchers/server/work";
import { Metadata } from "next";

export async function generateMetadata({
  params: { workId },
}: {
  params: { workId: string };
}) {
  const work = await getWork(workId);
  if (!work) return;
  return {
    title: work.title,
  } as Metadata;
}

export default async function WorkPage({
  params,
}: {
  params: { workId: string };
}) {
  const workId = params.workId;
  const workData = await getWork(workId);
  if (!workData) {
    notFound();
  }
  const authors = await getWorkAuthors(workId);
  const tags = await getWorkTags(workId);

  return (
    <InfoDisplay workId={workId} data={workData} title={workData.title}>
      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1} overflow="auto">
          {authors?.map((v) => (
            <Chip
              key={v.id}
              label={v.name}
              avatar={<Avatar alt={v.name} src={v.image} />}
            />
          ))}
        </Stack>
        {tags && <ScrollableTags tags={tags} />}
        <TextAccoridion noStringText="説明はありません">
          {!!workData.description ? (
            <AutoLinker>{workData.description}</AutoLinker>
          ) : undefined}
        </TextAccoridion>
      </Stack>
    </InfoDisplay>
  );
}
