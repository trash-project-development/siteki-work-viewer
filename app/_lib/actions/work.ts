"use server";
import fs from "fs";
import { LyricsWork, CreatingWork, TextWork } from "../../create/type";
import prisma from "@/app/_lib/prisma/client";
import { base64ID } from "../util/base64-id";
import { Author } from "@/app/_components/AuthorSelector";
import {
  FileWorkStatus,
  LyricsWorkInfo,
  Work,
  WorkType,
} from "../common-types/work";
import { User } from "../common-types/user";
import { Tag } from "../common-types/tag";
import { convertDBDateIntoCurrentUnix } from "../util/date";

export interface WorkInfo {
  title: string;
  description?: string;
  authors?: Author[];
  tags?: string[];
  workType: WorkType;
  textWork?: Omit<TextWork, keyof CreatingWork>;
  lyricsWork?: Omit<LyricsWork, keyof CreatingWork>;
}

export async function createWork(workInfo: WorkInfo): Promise<Work | null> {
  const workId = base64ID();
  const work = await prisma.work.create({
    data: {
      id: workId,
      title: workInfo.title,
      description: workInfo.description,
      type: workInfo.workType,
    },
  });

  if (workInfo.authors) {
    for (const author of workInfo.authors) {
      await prisma.workAuthor.create({
        data: {
          workId: work.id,
          userId: author.id,
        },
      });
    }
  }

  if (workInfo.tags) {
    for (let i = 0; i < workInfo.tags.length; i += 1) {
      const tag = workInfo.tags[i];
      await prisma.workTag.create({ data: { tagId: tag, workId: work.id } });
    }
  }

  if (work.type === WorkType.FILES) {
    await prisma.fileWork.create({
      data: {
        workId: work.id,
      },
    });
    await prisma.fileWork.update({
      where: { workId },
      data: { status: "processing" as FileWorkStatus },
    });
  } else if (work.type === WorkType.TEXT) {
    if (!workInfo.textWork) {
      console.warn("'textWork' was not found when creating work");
      return null;
    }
    await prisma.textWork.create({
      data: {
        workId: work.id,
        text: workInfo.textWork.text,
        isTopToBottom: workInfo.textWork.isTopToBottom,
      },
    });
  } else if (work.type === WorkType.LYRICS) {
    if (!workInfo.lyricsWork) {
      console.warn("'lyricsWork' was not found when creating work");
      return null;
    }

    await prisma.lyricsWork.create({
      data: {
        workId: work.id,
        originalSongName: workInfo.lyricsWork.originalSongName,
        originalSongURL: workInfo.lyricsWork.originalSongURL,
        lyrics: workInfo.lyricsWork.lyrics,
      },
    });
  } else {
    await prisma.work.delete({ where: { id: work.id } });
    console.warn("Unexpected WorkType");
    return null;
  }
  return {
    ...work,
    description: work.description ?? undefined,
    type: work.type as WorkType,
    createdAt: convertDBDateIntoCurrentUnix(work.createdAt),
  };
}

export async function deleteWork(id: string) {
  const work = await prisma.work.findUnique({ where: { id } });
  if (!work) return;
  if (work.type === WorkType.FILES) {
    const files = await prisma.file.findMany({ where: { workId: id } });
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      if (fs.existsSync(`work_assets/file_work/${file.id}`))
        fs.rmSync(`work_assets/file_work/${file.id}`);
    }
  }
  await prisma.work.delete({ where: { id: work.id } });
}

export async function finishWorkFileCreating(id: string) {
  const payload = await prisma.fileWork.update({
    where: { workId: id },
    data: { status: "ok" as FileWorkStatus },
  });
}

interface WorkEditParam {
  title?: string;
  description?: string;
  authors?: User[];
  tags?: Tag[];
}
export async function editWork(
  workId: string,
  { title, description, tags, authors }: WorkEditParam
) {
  const isWorkValid = !!(await prisma.work.count({ where: { id: workId } }));
  if (!isWorkValid) return;
  if (title || description)
    await prisma.work.update({
      where: { id: workId },
      data: { title, description },
    });
  if (authors && authors.length >= 1) {
    await prisma.workAuthor.deleteMany({ where: { workId } });
    for (const author of authors) {
      await prisma.workAuthor.create({
        data: { userId: author.id, workId: workId },
      });
    }
  }
  if (tags) {
    await prisma.workTag.deleteMany({ where: { workId } });
    for (const tag of tags) {
      await prisma.workTag.create({ data: { tagId: tag.id, workId: workId } });
    }
  }
}

export async function startEditWorkFiles(workId: string) {
  await prisma.fileWork.update({
    where: { workId },
    data: { status: "processing" as FileWorkStatus },
  });
  const payload = await prisma.file.updateMany({
    where: { workId: workId },
    data: { index: -1 },
  });
}

export async function editAlreadyWorkFile(
  fileId: string,
  index: number,
  displayName?: string
) {
  try {
    await prisma.file.update({
      where: { id: fileId },
      data: { index, displayName },
    });
  } catch (e) {
    console.error(e);
  }
}

export async function endEditWorkFiles(workId: string) {
  // -1 のままのものは操作されていないものとして削除する
  const deletedWorks = await prisma.file.findMany({
    where: { workId, index: -1 },
  });
  for (const work of deletedWorks) {
    fs.unlinkSync(`work_assets/file_work/${work.id}`);
  }
  await prisma.file.deleteMany({
    where: { workId, index: -1 },
  });
  await prisma.fileWork.update({
    where: { workId },
    data: { status: "ok" as FileWorkStatus },
  });
}

export async function editTextWork(workId: string, { text }: { text: string }) {
  await prisma.textWork.update({
    where: { workId },
    data: { text },
  });
}

export async function editLyricsWork(
  workId: string,
  lyricsInfo: Partial<LyricsWorkInfo>
) {
  await prisma.lyricsWork.update({ where: { workId }, data: lyricsInfo });
}
