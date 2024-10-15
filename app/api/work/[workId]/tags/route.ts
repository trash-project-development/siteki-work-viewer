import { isLoggedIn } from "@/app/_lib/login/isLoggedIn";
import prisma from "@/app/_lib/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { workId: string } }
) {
  const workId = params.workId;
  if (!workId) return new NextResponse(null, { status: 404 });
  const rows = await prisma.workTag.findMany({
    where: { workId },
    select: { tag: true },
  });
  const tags = rows.map((v) => v.tag);
  return NextResponse.json(tags);
}
