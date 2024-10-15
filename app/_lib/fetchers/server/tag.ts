import prisma from "@/app/_lib/prisma/client";
import { Tag } from "../../common-types/tag";
import { convertDBDateIntoCurrentUnix } from "../../util/date";

export async function getTag(tagId: string) {
  const row = await prisma.tag.findUnique({ where: { id: tagId } });
  if (!row) return undefined;
  const tag: Tag = {
    ...row,
    createdAt: convertDBDateIntoCurrentUnix(row.createdAt),
  };
  return tag;
}
