import { isLoggedIn } from "@/app/_lib/login/isLoggedIn";
import prisma from "@/app/_lib/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { imageSize } from "image-size";

export async function GET(
  req: NextRequest,
  { params: { fileId } }: { params: { fileId: string } }
) {
  if (!(await isLoggedIn())) return NextResponse.json([], { status: 401 });
  const fileRow = await prisma.file.findUnique({ where: { id: fileId } });
  if (!fileRow) return new NextResponse(null, { status: 404 });
  const filePath = `work_assets/file_work/${fileRow.id}`;
  const size = imageSize(filePath);
  return NextResponse.json(size);
}
