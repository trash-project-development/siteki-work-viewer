"use server";
import { base64ID } from "../util/base64-id";
import prisma from "../prisma/client";
import { escapeTagName } from "../util/escape-tagname";

export async function createTag(name: string) {
  if (name === "") return;
  const id = base64ID();
  const row = await prisma.tag.create({
    data: { id: id, name: escapeTagName(name) },
  });
  return row;
}

export async function deleteTag(tagId: string) {
  const worksWithTag = await prisma.workTag.findMany({ where: { tagId } });
  if (worksWithTag.length !== 0) return { conflictWorks: worksWithTag };
  await prisma.tag.delete({ where: { id: tagId } });
}
