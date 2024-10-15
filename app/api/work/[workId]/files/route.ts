import prisma from "@/app/_lib/prisma/client";
import { NextResponse } from "next/server";
import { WorkFile } from "@/app/_lib/common-types/file";
import { FileWorkStatus } from "@/app/_lib/common-types/work";

export async function GET(_: any, { params }: { params: { workId: string } }) {
  const workId = params.workId;
  const files = await prisma.file.findMany({ where: { workId } });
  if (!files) return new NextResponse(null, { status: 404 });
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
  return NextResponse.json(sorted);
}
