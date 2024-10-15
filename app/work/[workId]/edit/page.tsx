import WorkEdit from "./components/WorkEdit";
import Section from "@/app/_components/Section";
import { WorkType } from "@/app/_lib/common-types/work";
import {
  getWork,
  getWorkAuthors,
  getWorkFiles,
  getLyricsWork,
  getTextWork,
  getWorkTags,
} from "@/app/_lib/fetchers/server/work";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params: { workId },
}: {
  params: { workId: string };
}) {
  const work = await getWork(workId);
  if (!work) return;
  return {
    title: `編集中 - ${work.title}`,
  };
}

export default async function WorkEditPage({
  params: { workId },
}: {
  params: { workId: string };
}) {
  const work = await getWork(workId);
  if (!work) notFound();
  const tags = (await getWorkTags(workId)) ?? [];
  const authors = (await getWorkAuthors(workId)) ?? [];
  const files =
    work.type === WorkType.FILES ? await getWorkFiles(workId) : undefined;
  const textWorkInfo =
    work.type === WorkType.TEXT ? await getTextWork(workId) : undefined;
  const lyricsWorkInfo =
    work.type === WorkType.LYRICS ? await getLyricsWork(workId) : undefined;
  return (
    <Section>
      <WorkEdit
        defaultValues={{
          ...work,
          tags,
          authors,
          files: files?.map((v) => ({
            id: v.id,
            displayName: v.displayName,
            fileName: v.fileName,
            mimeType: v.mime ?? "application/octet-stream",
          })),
          textWork: textWorkInfo?.text,
          lyrics: lyricsWorkInfo,
        }}
        workId={workId}
        workType={work.type}
      />
    </Section>
  );
}
