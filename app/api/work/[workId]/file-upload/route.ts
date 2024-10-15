import { NextRequest, NextResponse } from "next/server";
import { v4 } from "uuid";
import prisma from "@/app/_lib/prisma/client";
import fsp from "fs/promises";
import fs from "fs";
import { WorkType } from "@/app/_lib/common-types/work";
import { Readable, Writable } from "stream";

export async function POST(
  req: NextRequest,
  { params: { workId } }: { params: { workId: string } }
) {
  const work = await prisma.work.findUnique({ where: { id: workId } });
  if (!work || work.type !== WorkType.FILES) {
    return new NextResponse(null, { status: 404 });
  }

  const fileIndexParam = req.nextUrl.searchParams.get("i");
  if (!fileIndexParam) return new NextResponse(null, { status: 400 });
  const fileIndex = Number.parseInt(fileIndexParam);
  if (Number.isNaN(fileIndex)) return new NextResponse(null, { status: 400 });

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const id = v4();
  const fileFormData = formData.get("file");

  if (!fileFormData || !(fileFormData instanceof File)) {
    return new NextResponse(null, { status: 400 });
  }

  const file: File = fileFormData;
  const displayName =
    formData.get("display-name")?.toString() ??
    file.name.split(".").slice(0, -1).join(".");
  const mimeType = formData.get("mime-type")?.toString() ?? file.type;

  await prisma.file.create({
    data: {
      workId,
      fileName: file.name,
      displayName: displayName,
      mimeType: mimeType,
      index: fileIndex,
      id,
    },
  });
  try {
    await fsp.mkdir("work_assets/file_work", { recursive: true });
    const stream = fs.createWriteStream(`work_assets/file_work/${id}`);
    file.stream().pipeTo(Writable.toWeb(stream));
  } catch (err) {
    console.warn(err);
    await prisma.file.delete({
      where: {
        id,
      },
    });
    return new NextResponse(null, { status: 500 });
  }
  return new NextResponse(null, { status: 200 });
}
