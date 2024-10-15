import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/_lib/prisma/client";
import { Tag } from "@/app/_lib/common-types/tag";

export async function GET(
  req: NextRequest,
  { params: { tagId } }: { params: { tagId: string } }
) {
  const tag = await prisma.tag.findUnique({
    where: { id: tagId },
    select: { id: true, name: true, createdAt: true },
  });
  if (!tag) return new NextResponse(null, { status: 404 });
  return NextResponse.json({
    ...tag,
    createdAt: tag.createdAt.getMilliseconds(),
  } as Tag);
}
