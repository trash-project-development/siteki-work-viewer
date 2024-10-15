"use server";
import { Work, WorkType } from "../common-types/work";
import { convertDBDateIntoCurrentUnix } from "../util/date";
import { searchQueryParser } from "../util/search-query-parser";
import prisma from "@/app/_lib/prisma/client";

export async function search(query: string): Promise<Work[]> {
  const parsedQuery = searchQueryParser(query);
  const processedQuery = parsedQuery.queryString.map((q) =>
    q.replace(/_/g, " ")
  );
  const works = await prisma.work.findMany({
    where: {
      AND: [
        // title または description に `query` が含まれているかを確認
        {
          OR: processedQuery.map((q) => ({
            OR: [
              { title: { contains: q } },
              { description: { contains: q } },
              { TextWork: { text: { contains: q } } },
              { Lyrics: { lyrics: { contains: q } } },
              { Files: { File: { some: { displayName: { contains: q } } } } },
            ],
          })),
        },
        {
          AND: parsedQuery.author.map((q) => ({
            authors: { some: { user: { name: q } } },
          })),
        },
        {
          AND: parsedQuery.tag.map((q) => ({
            tags: { some: { tag: { name: q } } },
          })),
        },
      ],
    },
  });
  if (!works) return [];
  return works.map((v) => ({
    ...v,
    description: v.description ?? undefined,
    type: v.type as WorkType,
    createdAt: convertDBDateIntoCurrentUnix(v.createdAt),
  }));
}
