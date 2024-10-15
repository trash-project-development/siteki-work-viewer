import { isLoggedIn } from "@/app/_lib/login/isLoggedIn";
import prisma from "@/app/_lib/prisma/client";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { fileId: string } }
) {
  if (!(await isLoggedIn())) return NextResponse.json([], { status: 401 });
  const fileId = params.fileId;
  const isDownload = req.nextUrl.searchParams.has("download");
  const range = req.headers.get("range");

  const fileRow = await prisma.file.findUnique({ where: { id: fileId } });
  if (!fileRow) return new NextResponse(null, { status: 404 });
  const fileName = fileRow.fileName;
  const filePath = `work_assets/file_work/${fileRow.id}`;

  const fileType = fileRow.mimeType;

  const headers = new Headers();

  if (isDownload) {
    headers.append(
      "Content-Disposition",
      `attachement;filename="${encodeURIComponent(fileName)}"`
    );
  }

  headers.append("Content-Type", fileType ?? "application/octet-stream");
  headers.append("Accept-Ranges", "bytes");

  const fileStat = fs.statSync(filePath);

  if (!range) {
    const stream = fs.createReadStream(filePath);
    headers.append("Content-Length", fileStat.size.toString());
    return new NextResponse(
      Readable.toWeb(stream) as ReadableStream<Uint8Array>,
      {
        headers,
      }
    );
  }

  const fileSize = fileStat.size;
  const [start, end] = range.replace(/bytes=/, "").split("-");
  const startPos = parseInt(start, 10);
  const endPos = end ? parseInt(end, 10) : fileSize - 1;
  // The reason why added one is that `subarray` method's second argument, `end` has NO offset, damn it.
  const slicedStream = fs.createReadStream(filePath, {
    start: startPos,
    end: endPos,
  });
  headers.append("Content-Range", `bytes ${startPos}-${endPos}/${fileSize}`);
  headers.append("Content-Length", (endPos - startPos + 1).toString());
  return new NextResponse(
    Readable.toWeb(slicedStream) as ReadableStream<Uint8Array>,
    { headers, status: 206 }
  );
}
