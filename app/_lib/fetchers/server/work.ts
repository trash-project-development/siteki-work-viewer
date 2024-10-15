import { WorkFile } from "../../common-types/file";
import { Tag } from "../../common-types/tag";
import { User } from "../../common-types/user";
import {
  LyricsWorkInfo,
  TextWorkInfo,
  Work,
  WorkType,
} from "../../common-types/work";
import prisma from "../../prisma/client";
import { convertDBDateIntoCurrentUnix } from "../../util/date";

export async function getWorks(): Promise<Work[]> {
  const rows = await prisma.work.findMany();
  return rows.map((row) => {
    return {
      ...row,
      description: row?.description ?? undefined,
      type: row.type as WorkType,
      createdAt: convertDBDateIntoCurrentUnix(row.createdAt),
    };
  });
}

export async function getWork(workId: string) {
  const row = await prisma.work.findUnique({ where: { id: workId } });
  if (!row) return undefined;
  const work: Work = {
    ...row,
    description: row?.description ?? undefined,
    type: row.type as WorkType,
    createdAt: convertDBDateIntoCurrentUnix(row.createdAt),
  };
  return work;
}

export async function getWorkAuthors(workId: string): Promise<User[]> {
  const rows = await prisma.workAuthor.findMany({
    where: { workId },
    select: { user: true },
  });
  const authors: User[] = [];
  for (const row of rows) {
    const author: User = {
      id: row.user.id,
      name: row.user.name ?? "(名無し)",
      //TODO デフォルトアイコンを用意する
      image: row.user.image ?? "",
      createdAt: convertDBDateIntoCurrentUnix(row.user.createdAt),
    };
    authors.push(author);
  }
  return authors;
}

export async function getWorkTags(workId: string): Promise<Tag[]> {
  const rows = await prisma.workTag.findMany({
    where: { workId },
    select: { tag: true },
  });
  const tags: Tag[] = rows.map((row) => {
    return {
      ...row.tag,
      createdAt: convertDBDateIntoCurrentUnix(row.tag.createdAt),
    };
  });
  return tags;
}

export async function getWorkFiles(workId: string): Promise<WorkFile[]> {
  const files = await prisma.file.findMany({ where: { workId } });
  const filtered: WorkFile[] = [];
  for (const file of files) {
    filtered.push({
      id: file.id,
      displayName: file.displayName,
      fileName: file.fileName,
      fileURL: `/api/file/${file.id}`,
      mime: file.mimeType,
      index: file.index,
    });
  }
  const sorted = filtered.sort((a, b) =>
    a === b ? 0 : a.index > b.index ? 1 : -1
  );
  return sorted;
}

export async function getTextWork(
  workId: string
): Promise<TextWorkInfo | undefined> {
  const row = await prisma.textWork.findUnique({ where: { workId: workId } });
  if (!row) return undefined;
  return row;
}

export async function getLyricsWork(
  workId: string
): Promise<LyricsWorkInfo | undefined> {
  const lyricsWork = await prisma.lyricsWork.findUnique({ where: { workId } });
  if (!lyricsWork) return undefined;
  return {
    originalSongName: lyricsWork.originalSongName,
    originalSongURL: lyricsWork.originalSongURL ?? undefined,
    lyrics: lyricsWork.lyrics,
  };
}
